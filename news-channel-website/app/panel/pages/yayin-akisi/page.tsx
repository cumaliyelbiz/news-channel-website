"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { fetchYayinAkisiPageData, updateYayinAkisiPageData } from '@/lib/api';
import { toast } from "sonner";
import { Calendar, Clock, Plus, Save } from "lucide-react";

interface ScheduleItem {
  id: number;
  time: string;
  program: string;
}

interface ScheduleData {
  scheduleItems: {
    [key: string]: ScheduleItem[];
  };
}

export default function EditPage() {

  // State variables for broadcast schedule
  const daysOfWeek = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
  const [selectedDay, setSelectedDay] = useState<string>("Pazartesi");
  
  const [scheduleItems, setScheduleItems] = useState<{
    [key: string]: {
      id: number;
      time: string;
      program: string;
    }[]
  }>({
    "Pazartesi": [{ id: 1, time: "", program: "" }],
    "Salı": [{ id: 1, time: "", program: "" }],
    "Çarşamba": [{ id: 1, time: "", program: "" }],
    "Perşembe": [{ id: 1, time: "", program: "" }],
    "Cuma": [{ id: 1, time: "", program: "" }],
    "Cumartesi": [{ id: 1, time: "", program: "" }],
    "Pazar": [{ id: 1, time: "", program: "" }],
  });
  const [initialData, setInitialData] = useState<ScheduleData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

  // Verileri fetch et
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchYayinAkisiPageData();
        setScheduleItems(data.scheduleItems);
        setInitialData(JSON.parse(JSON.stringify(data))); // Deep copy to ensure reference is different
      } catch (error) {
        console.error("Veri çekilirken hata oluştu:", error);
      }
    };

    fetchData();
  }, []);

  // Improved form change detection
  useEffect(() => {
    if (!initialData) return;
    
    // Convert both objects to strings for comparison
    const currentData = JSON.stringify(scheduleItems);
    const original = JSON.stringify(initialData.scheduleItems);
    
    // Compare the string representations
    const isChanged = currentData !== original;
    console.log("Form changed:", isChanged); // Debug log
    setFormChanged(isChanged);
  }, [scheduleItems, initialData]);

  const handleScheduleItemChange = (day: string, index: number, field: 'time' | 'program', value: string) => {
    // Create a completely new object to ensure React detects the change
    setScheduleItems(prevItems => {
      const newItems = JSON.parse(JSON.stringify(prevItems)); // Deep clone
      newItems[day][index][field] = value;
      return newItems;
    });
  };

  // Also update the other methods to use the functional state update pattern
  const addScheduleItem = (day: string) => {
    setScheduleItems(prevItems => {
      const newItems = JSON.parse(JSON.stringify(prevItems)); // Deep clone
      const dayItems = newItems[day];
      const newId = dayItems.length > 0 
        ? Math.max(...dayItems.map((item: { id: number }) => item.id)) + 1
        : 1;
      
      newItems[day] = [...dayItems, { id: newId, time: "", program: "" }];
      return newItems;
    });
  };

  const deleteScheduleItem = (day: string, index: number) => {
    setScheduleItems(prevItems => {
      const newItems = JSON.parse(JSON.stringify(prevItems)); // Deep clone
      newItems[day] = newItems[day].filter((item: { id: number; time: string; program: string }, idx: number) => idx !== index);
      return newItems;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const updatedData = {
      scheduleItems
    };

    try {
      await updateYayinAkisiPageData(updatedData);
      setInitialData(updatedData);
      toast.success("Başarılı", { description: "Yayın akışı verileri başarıyla güncellendi." });
      setFormChanged(false);
    } catch (error) {
      console.error("Veri güncellenirken hata oluştu:", error);
      toast.error("Hata", { description: "Güncelleme sırasında bir hata oluştu." });
    } finally {
      setIsSaving(false);
    }
  };

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
                  <BreadcrumbLink href="/panel/pages">
                    Sayfalar
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Yayın Akışı</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Kaydet butonu */}
          <div className="ml-auto mr-4">
            <Button onClick={handleSubmit} disabled={isSaving || !formChanged} className="px-4">
              {isSaving ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Kaydet
                </>
              )}
            </Button>
          </div>
        </header>

        {/* Form for editing the page */}
        <div className="px-4 py-6">
          <Card className="rounded-xl border bg-card text-card-foreground shadow">
            <CardHeader className="pb-0 mb-4">
              <div className="flex space-x-2 justify-between">
                <CardTitle className="tracking-tight text-lg font-medium">Yayın Akışı Düzenle</CardTitle>
                {formChanged && <span className="text-sm text-amber-500">Kaydedilmemiş değişiklikler var</span>}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <Tabs 
                defaultValue={selectedDay} 
                onValueChange={(value) => setSelectedDay(value)}
                className="w-full"
              >
                <TabsList className="flex space-x-1 pb-2">
                  {daysOfWeek.map((day) => (
                    <TabsTrigger key={day} value={day} className="flex-shrink-0">
                      <Calendar className="h-4 w-4 mr-2" />
                      {day}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {daysOfWeek.map((day) => (
                  <TabsContent key={day} value={day} className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-medium">{day} Yayın Akışı</h3>
                      <Button 
                        onClick={() => addScheduleItem(day)} 
                        variant="outline" 
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Program Ekle
                      </Button>
                    </div>

                    {scheduleItems[day].map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="flex-shrink-0 w-1/4">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <Input
                              value={item.time}
                              onChange={(e) => handleScheduleItemChange(day, index, 'time', e.target.value)}
                              className="flex-1"
                              placeholder="Saat"
                            />
                          </div>
                        </div>
                        <div className="flex-grow">
                          <Input
                            value={item.program}
                            onChange={(e) => handleScheduleItemChange(day, index, 'program', e.target.value)}
                            className="w-full"
                            placeholder="Program adı"
                          />
                        </div>
                        <Button 
                          onClick={() => deleteScheduleItem(day, index)} 
                          variant="outline" 
                          size="sm"
                          disabled={scheduleItems[day].length <= 1}
                          className="flex-shrink-0"
                        >
                          Sil
                        </Button>
                      </div>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}