'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ComponentProps, useState } from 'react';
import { useNavigation } from '@/providers/navigation-provider';

type NavigationLinkProps = ComponentProps<typeof Link> & {
  showLoadingOnClick?: boolean;
};

export function NavigationLink({
  children,
  showLoadingOnClick = true,
  onClick,
  ...props
}: NavigationLinkProps) {
  const router = useRouter();
  const { startNavigation } = useNavigation();
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }

    if (!e.defaultPrevented && showLoadingOnClick) {
      // Tıklandığında loading durumunu başlat
      startNavigation();
      
      // Tıklanma durumunu güncelle (butonun görünümünü değiştirmek için)
      setIsClicked(true);
      
      // 2 saniye sonra tıklanma durumunu sıfırla (buton görünümü için)
      setTimeout(() => {
        setIsClicked(false);
      }, 2000);
    }
  };

  return (
    <Link
      {...props}
      onClick={handleClick}
      aria-busy={isClicked}
      className={`${props.className || ''} ${isClicked ? 'pointer-events-none' : ''}`}
    >
      {children}
    </Link>
  );
}
