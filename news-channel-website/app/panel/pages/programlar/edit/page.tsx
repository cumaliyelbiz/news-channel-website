"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NewProgramPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Yeni program sayfasına yönlendir (ID olmadan)
    router.push('/panel/pages/programlar/edit/');
  }, [router]);
  
  return null;
}