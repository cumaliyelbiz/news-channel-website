//navbar fixed olacak
//sosyal medya linkleri footer'da olacak
"use client";
import { fetchKunyePageData } from "@/lib/api";
import WebLayout from "@/web-components/layout/Layout";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface KunyeData {
  id?: number;
  unvan: string;
  logo: string;
  yayin_ortami: string;
  lisans_tipi: string;
  yayin_turu: string;
  adres: string;
  telefon_faks: string;
  internet_adresi: string;
  email: string;
  kep_adresi: string;
  vergi_daire_no: string;
  mersis_no: string;
  sorumlular: ResponsibleManager[];
  izleyici_temsilcisi_ad: string;
  izleyici_temsilcisi_email: string;
  dokumanlar: Document[];
}

interface ResponsibleManager {
  name: string;
  title: string;
  email: string;
}

interface Document {
  name: string;
  link: string;
}

export default function Kunye() {
  const [kunyeData, setKunyeData] = useState<KunyeData>({
    unvan: "",
    logo: "",
    yayin_ortami: "",
    lisans_tipi: "",
    yayin_turu: "",
    adres: "",
    telefon_faks: "",
    internet_adresi: "",
    email: "",
    kep_adresi: "",
    vergi_daire_no: "",
    mersis_no: "",
    sorumlular: [{ name: "", title: "", email: "" }],
    izleyici_temsilcisi_ad: "",
    izleyici_temsilcisi_email: "",
    dokumanlar: [{ name: "", link: "" }]
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchKunyePageData();
                
        if (data) {
          setKunyeData(data);
        }
      } catch (error) {
        console.error("Veri çekilirken hata oluştu:", error);
        toast.error("Veri yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Şirket bilgilerini dinamik olarak oluştur
  const companyInfoDynamic = [
    { label: "1. Ünvanı", value: kunyeData.unvan },
    { label: "2. Logo/Çağrı İşareti", value: kunyeData.logo },
    { label: "3. Yayın Ortamı", value: kunyeData.yayin_ortami },
    { label: "4. Lisans Tipi", value: kunyeData.lisans_tipi },
    { label: "5. Yayın Türü", value: kunyeData.yayin_turu },
    { label: "6. Yazışma Adresi", value: kunyeData.adres },
    { label: "7. Telefon ve Faks", value: kunyeData.telefon_faks },
    { label: "8. İnternet Adresi", value: kunyeData.internet_adresi },
    { label: "9. E-Posta Adresi", value: kunyeData.email },
    { label: "10. Kep Adresi", value: kunyeData.kep_adresi },
    { label: "11. Vergi Daire / No", value: kunyeData.vergi_daire_no },
    { label: "12. Mersis No", value: kunyeData.mersis_no },
  ];

  return (
    <WebLayout>
      <div className="py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-8">Künye</h1>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin h-8 w-8 border-4 border-sky-500 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
              <div className="mb-10">
                <div className="bg-sky-500 text-white font-bold p-4">
                  Şirket Bilgileri
                </div>
                <div className="border">
                  {companyInfoDynamic.map((item, index) => (
                    <div key={index} className="grid grid-cols-4 border-b last:border-b-0">
                      <div className="col-span-1 p-4 font-medium">{item.label}</div>
                      <div className="col-span-3 p-4">
                        {item.value?.split('\n').map((line, i) => (
                          <div key={i}>{line}</div>
                        )) || ""}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-10">
                <div className="bg-sky-500 text-white font-bold p-4">
                  Sorumlu Müdür
                </div>
                {kunyeData.sorumlular.map((manager, index) => (
                  <div key={index} className="border mb-4 last:mb-0">
                    <div className="grid grid-cols-4 border-b">
                      <div className="col-span-1 p-4 font-medium">Adı Soyadı</div>
                      <div className="col-span-3 p-4">{manager.name} / {manager.title}</div>
                    </div>
                    <div className="grid grid-cols-4">
                      <div className="col-span-1 p-4 font-medium">E-Posta Adresi</div>
                      <div className="col-span-3 p-4">{manager.email}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-10">
                <div className="bg-sky-500 text-white font-bold p-4">
                  İzleyici Temsilcisi
                </div>
                <div className="border mb-4">
                  <div className="grid grid-cols-4 border-b">
                    <div className="col-span-1 p-4 font-medium">Adı Soyadı</div>
                    <div className="col-span-3 p-4">{kunyeData.izleyici_temsilcisi_ad}</div>
                  </div>
                  <div className="grid grid-cols-4">
                    <div className="col-span-1 p-4 font-medium">E-Posta Adresi</div>
                    <div className="col-span-3 p-4">{kunyeData.izleyici_temsilcisi_email}</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-sky-500 text-white font-bold p-4 mb-4">
                  Dokümanlar
                </div>
                {kunyeData.dokumanlar.map((doc, index) => (
                  <a 
                    href={doc.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    key={index} 
                    className="block bg-gray-200 p-4 mb-2 cursor-pointer hover:bg-gray-300 transition-colors"
                  >
                    {doc.name} (İndirmek için tıklayınız)
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </WebLayout>
  );
}