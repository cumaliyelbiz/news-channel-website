"use client";
import { fetchMediaPartnersData } from "@/lib/api";
import WebLayout from "@/web-components/layout/Layout";
import { useEffect, useState } from "react";

interface Partner {
  id: number;
  name: string;
  url: string;
  image: string;
}

export default function Basin() {
  const [mediaPartners, setMediaPartners] = useState<Partner[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMediaPartnersData();
        setMediaPartners(data.mediaPartners || []);
      } catch (error) {
        console.error("Veri çekme sırasında hata oluştu:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <WebLayout>
      <div className="py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-8">Basın</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mediaPartners.map((partner) => (
              <a
                key={partner.id}
                href={partner.url}
                className="block rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 bg-white"
              >
                <div className="relative aspect-[4/3]">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${partner.image})`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      backgroundColor: '#ffffff'
                    }}
                  />
                </div>
                <div className="p-4 border-t">
                  <h3 className="text-lg font-medium text-gray-800 text-center">
                    {partner.name}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </WebLayout>
  );
}
