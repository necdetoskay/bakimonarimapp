'use client';

import { useEffect } from 'react';
import { useNavigation } from '@/providers/navigation-provider';

export default function Loading() {
  const { endNavigation } = useNavigation();
  
  // Next.js loading bileşeni yüklendiğinde, bizim loading durumumuzu sonlandır
  useEffect(() => {
    // Sayfa yüklendi, loading'i kapat
    endNavigation();
    
    return () => {
      // Bileşen kaldırıldığında da loading'i kapat (güvenlik için)
      endNavigation();
    };
  }, [endNavigation]);
  
  // Boş döndür, çünkü loading durumunu NavigationProvider yönetiyor
  return null;
}
