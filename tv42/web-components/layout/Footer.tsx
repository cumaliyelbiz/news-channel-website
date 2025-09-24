"use client";

import React, { useEffect, useState } from "react";
import Logo from "../Logo";
import Link from "next/link";
import { fetchSiteSettingsData, fetchMediaPartnersData } from "@/lib/api";
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";
import Image from "next/image";

interface SocialMedia {
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  youtube: string;
}

interface Partner {
  id: number;
  name: string;
  url: string;
  image: string;
}

const Footer = () => {
  const [socialMedia, setSocialMedia] = useState<SocialMedia>({
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    youtube: ''
  });
  const [mediaPartners, setMediaPartners] = useState<Partner[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch social media data
        const siteData = await fetchSiteSettingsData();
        if (siteData.socialmedia) {
          setSocialMedia(siteData.socialmedia);
        }
        
        // Fetch media partners data
        const partnersData = await fetchMediaPartnersData();
        if (partnersData.mediaPartners) {
          setMediaPartners(partnersData.mediaPartners);
        }
      } catch (error) {
        console.error("Veriler çekilirken hata oluştu:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <footer className="w-full bg-black text-white pt-10 overflow-x-hidden">
      <div className="container mx-auto px-4 max-w-full">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        
        <div className="text-center mb-8 px-2">
          <p className="text-sm leading-relaxed max-w-3xl mx-auto">
            XXXXX, 10 Haziran 1992'de kuruldu. Türkiye'nin ilk bölgesel yayın yapan kanalı olarak tarihe geçen XXXXX, 2004 yılından buyana uydudan tüm dünyaya yayın yapmaktadır.
            Kablolu Yayın, Tivibu, DSmart, Turkcell TV, IPTV, IPETTV, Teledünya ve Karasal yayını bulunan XXXXX, Türkiye'nin önde gelen kanallarından biridir.
          </p>
        </div>
        
        {/* Social Media Links */}
        <div className="flex justify-center space-x-6 mb-8">
          {socialMedia.facebook && (
            <Link href={socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
              <Facebook size={24} />
            </Link>
          )}
          {socialMedia.instagram && (
            <Link href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors">
              <Instagram size={24} />
            </Link>
          )}
          {socialMedia.twitter && (
            <Link href={socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
              <Twitter size={24} />
            </Link>
          )}
          {socialMedia.linkedin && (
            <Link href={socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
              <Linkedin size={24} />
            </Link>
          )}
          {socialMedia.youtube && (
            <Link href={socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">
              <Youtube size={24} />
            </Link>
          )}
        </div>
        
        <div className="text-center mb-4 px-2">
          <h3 className="text-xl font-bold mb-4">UYDU BİLGİLERİ</h3>
          <div className="border-t border-gray-800 pt-4 pb-4 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row justify-center md:space-x-8 space-y-2 md:space-y-0">
              <div>Türksat 4A Frekans: 123</div>
              <div>Sembol: 123</div>
              <div>Polarizasyon: Yatay/H</div>
            </div>
          </div>
        </div>
        
        {/* Media Partners Section - Only shown if partners exist */}
        {mediaPartners.length > 0 && (
          <div className="flex flex-wrap justify-center items-center gap-4 py-6 px-2">
            {mediaPartners.map((partner) => (
              <Link 
                href={partner.url || "#"} 
                key={partner.id} 
                className="opacity-80 hover:opacity-100 transition-opacity"
                target="_blank" 
                rel="noopener noreferrer"
              >
                {partner.image ? (
                  <div className="h-10 flex items-center justify-center">
                    <Image 
                      src={partner.image} 
                      alt={partner.name} 
                      width={100} 
                      height={40} 
                      className="object-contain max-h-10 max-w-[100px]" 
                    />
                  </div>
                ) : (
                  <div className="h-8 flex items-center justify-center text-white">
                    {partner.name}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
        
        {/* Copyright Section */}
        <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-400">
          <p>
            © {new Date().getFullYear()} XXXXX. Tüm hakları saklıdır.
          </p>
          <p className="mt-1">
            <span>Cumali Yelbiz tarafından geliştirilmiştir.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
