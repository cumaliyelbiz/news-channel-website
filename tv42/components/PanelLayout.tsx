// components/Layout.tsx
import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface LayoutProps {
  children: ReactNode;
}

const PanelLayout: React.FC<LayoutProps> = ({ children }) => {
    const router = useRouter();

    const { user } = useSelector((state: RootState) => state.user);
    
    useEffect(() => {
      if (!user) {
        router.push('/login');
      }
    }, [user, router]);
  
    if (!user) {
      return <p>Lütfen giriş yapınız</p>;
    }
  
  return (
    <div>{children}</div>
  );
};

export default PanelLayout;
