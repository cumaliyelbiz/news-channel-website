"use client";

import WebLayout from "@/web-components/layout/Layout";
import { useState, useEffect } from "react";
import { fetchYayinAkisiPageData } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface ScheduleItem {
  time: string;
  program: string;
}

interface ScheduleData {
  [key: string]: ScheduleItem[];
}

export default function YayinAkisi() {
  const daysOfWeek = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
  const [selectedDay, setSelectedDay] = useState(0);
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch schedule data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchYayinAkisiPageData();
        if (data && data.scheduleItems) {
          setScheduleData(data.scheduleItems);
          console.log("Yayın akışı verileri başarıyla alınmıştır:", data);
        } else {
          console.error("Invalid data format received from API");
        }
      } catch (error) {
        console.error("Yayın akışı verileri alınırken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format the schedule data for display
  const getFormattedSchedule = (day: number) => {
    if (!scheduleData || !scheduleData[daysOfWeek[day]]) {
      return [];
    }
    
    return scheduleData[daysOfWeek[day]].map((item: ScheduleItem) => ({
      time: item.time,
      program: item.program
    }));
  };

  return (
    <WebLayout>
      <div className="py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-8">Yayın Akışı</h1>

          {/* Replace the day tabs with a more responsive design */}
          <div className="bg-gray-100 mb-10 overflow-hidden">
            <div className="flex flex-nowrap overflow-x-auto md:grid md:grid-cols-7">
              {daysOfWeek.map((day, index) => (
                <div
                  key={index}
                  className={`p-4 text-center cursor-pointer whitespace-nowrap flex-shrink-0 min-w-[100px] md:min-w-0 ${
                    index === selectedDay ? "bg-gray-200 font-bold" : ""
                  }`}
                  onClick={() => setSelectedDay(index)}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Rest of the component remains the same */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : !scheduleData ? (
            <div className="text-center py-10 text-gray-500">
              Yayın akışı verileri bulunamadı.
            </div>
          ) : (
            <div className="bg-gray-100">
              {getFormattedSchedule(selectedDay).length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  Bu gün için yayın akışı bulunmamaktadır.
                </div>
              ) : (
                getFormattedSchedule(selectedDay).map((item: ScheduleItem, index: number) => (
                  <div
                    key={index}
                    className={`grid grid-cols-12 p-4 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                      }`}
                  >
                    <div className="col-span-3 md:col-span-2 font-bold">{item.time}</div>
                    <div className="col-span-9 md:col-span-10">{item.program}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </WebLayout>
  );
}
