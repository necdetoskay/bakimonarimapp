'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { FullPageLoader } from '@/components/ui/loading-spinner';

interface NavigationContextType {
  isNavigating: boolean;
  startNavigation: () => void;
  endNavigation: () => void;
}

const NavigationContext = createContext<NavigationContextType>({
  isNavigating: false,
  startNavigation: () => {},
  endNavigation: () => {},
});

export const useNavigation = () => useContext(NavigationContext);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sayfa değiştiğinde
  useEffect(() => {
    // Navigasyon tamamlandı
    setIsNavigating(false);
    
    // Varsa önceki timeout'u temizle
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
      navigationTimeoutRef.current = null;
    }
  }, [pathname, searchParams]);

  // Navigasyon başlatma fonksiyonu
  const startNavigation = () => {
    setIsNavigating(true);
    
    // Güvenlik için 5 saniye sonra loading'i otomatik kapat
    // (Herhangi bir nedenle sayfa yüklenemezse kullanıcı sıkışıp kalmasın)
    navigationTimeoutRef.current = setTimeout(() => {
      setIsNavigating(false);
    }, 5000);
  };

  // Navigasyon sonlandırma fonksiyonu
  const endNavigation = () => {
    setIsNavigating(false);
    
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
      navigationTimeoutRef.current = null;
    }
  };

  return (
    <NavigationContext.Provider 
      value={{ 
        isNavigating, 
        startNavigation, 
        endNavigation 
      }}
    >
      {isNavigating && <FullPageLoader />}
      {children}
    </NavigationContext.Provider>
  );
}
