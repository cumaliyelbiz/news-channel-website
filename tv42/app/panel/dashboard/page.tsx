"use client";

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from 'next/navigation';
import { RootState } from '@/redux/store';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Activity, Newspaper, Tv, Film } from 'lucide-react';
import VisitorChart from "@/components/ui/chart"; // Grafiği import et
import { fetchDashboardData } from "@/lib/api";

export default function Page() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);

  const [statistics, setStatisctics] = useState({
    programCount: 0,
    activePrograms: 0,
    episodeCount: 0,
    fragmanCount: 0,
  });

  const cards = [
    {
      title: "Toplam Program Sayısı",
      value: statistics.programCount.toLocaleString(),
      icon: <Tv />,
    },
    {
      title: "Aktif Programlar",
      value: statistics.activePrograms.toLocaleString(),
      icon: <Activity />,
    },
    {
      title: "Toplam Bölüm Sayısı",
      value: statistics.episodeCount.toLocaleString(),
      icon: <Film />,
    },
    {
      title: "Toplam Fragman Sayısı",
      value: statistics.fragmanCount.toLocaleString(),
      icon: <Film />,
    }
  ];

  const chartData = {
    labels: [
      "Aktif Programlar",
      "Pasif Programlar"
    ],
    datasets: [
      {
        label: "Program Sayısı",
        data: [statistics.activePrograms, statistics.programCount - statistics.activePrograms],
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDashboardData();
        // Update state with TV program related data
        setStatisctics({
          programCount: data.counts.allPrograms || 0,
          activePrograms: data.counts.activePrograms || 0,
          episodeCount: data.counts.bolumler || 0,
          fragmanCount: data.counts.fragmanlar || 0,
        });
      } catch (error) {
        console.error("Dashboard verisi yüklenirken hata oluştu:", error);
      }
    }

    fetchData()
  }, []);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]); // Add dependencies here

  if (!user) {
    return <p>Lütfen giriş yapınız</p>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/panel/dashboard">
                    Anasayfa
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Anasayfa</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 px-4 pb-5">
          {cards.map((card, index) => (
            <Card key={index} className="rounded-xl border bg-card text-card-foreground shadow gap-2">
              <CardHeader className="pb-0 mb-0 flex align-center justify-between">
                <div className="flex space-x-2 justify-between">
                  <CardTitle className="tracking-tight text-sm font-medium">{card.title}</CardTitle>
                  {card.icon}
                </div>
              </CardHeader>
              <CardContent className="font-bold text-2xl">
                <p>{card.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart Section */}
        <div className="px-4">
          <Card className="rounded-xl border bg-card text-card-foreground shadow p-4">
            <CardHeader className="p-0">
              <CardTitle className="text-lg">Program İstatistikleri</CardTitle>
              <CardDescription>Aktif ve pasif program dağılımı</CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-4">
              <VisitorChart data={{
                labels: chartData.labels,
                datasets: chartData.datasets.map(dataset => ({
                  ...dataset,
                  backgroundColor: dataset.backgroundColor[0],
                  borderColor: dataset.borderColor[0]
                }))
              }} />
            </CardContent>
          </Card>
        </div>

        {/* Program Yönetimi Kısayolları */}
        <div className="px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="rounded-xl border bg-card text-card-foreground shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Tv className="h-5 w-5 text-kontv-orange" />
                  <CardTitle className="text-base">Programlar</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Tüm programları görüntüleyin, düzenleyin veya yeni program ekleyin.
                </p>
                <a href="/panel/pages/programlar" className="text-sm font-medium text-kontv-orange hover:underline">
                  Programları Yönet →
                </a>
              </CardContent>
            </Card>
            
            <Card className="rounded-xl border bg-card text-card-foreground shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Film className="h-5 w-5 text-kontv-orange" />
                  <CardTitle className="text-base">Fragmanlar</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Yayınlanacak program fragmanlarını yönetin ve düzenleyin.
                </p>
                <a href="/panel/pages/anasayfa" className="text-sm font-medium text-kontv-orange hover:underline">
                  Fragmanları Yönet →
                </a>
              </CardContent>
            </Card>
            
            <Card className="rounded-xl border bg-card text-card-foreground shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Newspaper className="h-5 w-5 text-kontv-orange" />
                  <CardTitle className="text-base">Haberler</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Haber içeriklerini yönetin, yeni haberler ekleyin.
                </p>
                <a href="/panel/pages/anasayfa" className="text-sm font-medium text-kontv-orange hover:underline">
                  Haberleri Yönet →
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
