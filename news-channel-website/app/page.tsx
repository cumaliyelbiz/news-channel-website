//Yapılacaklar
//yetim: Toplam hami sayısı, toplam yetim sayısı, card(id, isim, yetim bilgisi..) 
//su kuyusu: Tarihe göre ülkede açılan su kuyusu bilgileri örnek: Afrika/sudan şehrine girecek su kuyusu bilgileri resmi vs. açılması planlanan su kuyusu gibi filtreleri 
//kurban: Çok detay verilmemiş, yurt için yurt dışı ülke ayrımı, kaç kişi olacak kurbanda, kurban özellikleri, 
//firma adı: ribat, renkleri: 
//mobil olacak
"use client";
import React, { useState, useEffect } from "react";
import LiveStreamSection from "../web-components/home/LiveStreamSection";
import ProgramSlider from "../web-components/home/ProgramSlider";
import ScheduleBar from "../web-components/home/ScheduleBar";
import ProgramsGrid from "../web-components/home/ProgramsGrid";
import TrailersSection from "../web-components/home/TrailersSection";
import EpisodesSection from "../web-components/home/EpisodesSection";
import WebLayout from "@/web-components/layout/Layout";
import { fetchProgramsData, fetchHomePageData } from "@/lib/api";

interface Program {
  id: number;
  title: string;
  image_url: string;
  category: string;
  is_active?: number;
  schedule: string;
}

interface Trailer {
  id: number;
  image: string;
  title: string;
  time: string;
  day: string;
  channel?: string;
}

interface Episode {
  id: number;
  image: string;
  title: string;
}

interface HomeData {
  fragmanlar: Trailer[];
  bolumler: Episode[];
}

const Index = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [homeData, setHomeData] = useState<HomeData>({
    fragmanlar: [],
    bolumler: []
  });
  const [loading, setLoading] = useState(true);
  const [homeLoading, setHomeLoading] = useState(true);

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        setLoading(true);
        const data = await fetchProgramsData();
        
        // Update filter with proper type
        const activePrograms = data.programs.filter((program: Program) => 
          program.is_active === undefined || program.is_active === 1
        );
        
        setPrograms(activePrograms);
      } catch (err) {
        console.error("Programlar yüklenirken hata oluştu:", err);
      } finally {
        setLoading(false);
      }
    };

    const loadHomeData = async () => {
      try {
        setHomeLoading(true);
        const data = await fetchHomePageData();
        setHomeData({
          fragmanlar: data.fragmanlar || [],
          bolumler: data.bolumler || []
        });
      } catch (err) {
        console.error("Anasayfa verileri yüklenirken hata oluştu:", err);
      } finally {
        setHomeLoading(false);
      }
    };

    loadPrograms();
    loadHomeData();
  }, []);

  return (
    <WebLayout>
      <LiveStreamSection />
      <ProgramSlider programs={programs} loading={loading} />
      <ScheduleBar />
      <ProgramsGrid programs={programs} loading={loading} />
      <TrailersSection trailers={homeData.fragmanlar} loading={homeLoading} />
      <EpisodesSection episodes={homeData.bolumler} loading={homeLoading} />
    </WebLayout>
  );
};

export default Index;