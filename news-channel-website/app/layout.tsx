"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/redux/store';
import { jsonLd } from '../lib/metadata';
import { usePathname } from 'next/navigation';
import ContextMenuComponent from '@/components/ContextMenuComponent';
import React from 'react';
import { Toaster } from "sonner"
import PanelLayout from "@/components/PanelLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isPanelPage = pathname.startsWith('/panel');

  return (
    <Provider store={store}>
      {/* head içerisine metadata ve diğer global bilgiler yerleştirilmeli */}
      <html lang="en">
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <PersistGate persistor={persistor}>
            {isPanelPage ? (
              <PanelLayout>
                <ContextMenuComponent>
                  {children}
              </ContextMenuComponent>
              </PanelLayout>

            ) : (
              <>
              {children}
            </>
            )}
          </PersistGate>
          <Toaster toastOptions={{
          duration: 3000, // Tüm toast mesajları için 3 saniye
        }}/>
        </body>
      </html>
    </Provider>
  );
};

export default Layout;


