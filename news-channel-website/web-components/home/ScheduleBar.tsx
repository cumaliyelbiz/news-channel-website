
import React, { useState, useEffect } from "react";
import { fetchYayinAkisiPageData } from "@/lib/api";

interface ScheduleItem {
  id: number;
  time: string;
  program: string;
}

interface ScheduleData {
  [key: string]: ScheduleItem[];
}

const ScheduleBar = () => {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDay, setCurrentDay] = useState<string>("");

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        setLoading(true);
        const datas = await fetchYayinAkisiPageData();
        const data = datas.scheduleItems;
        
        // Get current day name in Turkish with first letter capitalized
        const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
        const today = new Date().getDay();
        const currentDayName = days[today];
        setCurrentDay(currentDayName);
        
        // Get schedule items for the current day
        let todaySchedule: ScheduleItem[] = [];
        
        if (data && data[currentDayName]) {
          todaySchedule = data[currentDayName];
          
          // Sort by time
          todaySchedule.sort((a, b) => {
            return a.time.localeCompare(b.time);
          });
          
          // Take only the first 5 items for the bar
          todaySchedule = todaySchedule.slice(0, 5);
        }
        
        setScheduleItems(todaySchedule);
      } catch (err) {
        console.error("Yayın akışı verileri yüklenirken hata oluştu:", err);
        // Fallback to empty array if there's an error
        setScheduleItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, []);

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 w-full">
      <div className="container mx-auto">
        <div className="flex overflow-x-auto text-white">
          <div className="min-w-[120px] py-4 px-6 font-bold flex items-center justify-center border-r border-white/20 bg-kontv-orange">
            {loading ? "YÜKLENİYOR..." : `${currentDay}`}
          </div>
          
          {loading ? (
            // Loading state - show skeleton loaders
            Array(5).fill(0).map((_, index) => (
              <div
                key={index}
                className="min-w-[120px] py-4 px-4 font-bold flex flex-col items-center justify-center border-r border-white/20"
              >
                <div className="h-4 w-16 bg-white/30 rounded animate-pulse mb-1"></div>
                <div className="h-3 w-20 bg-white/30 rounded animate-pulse"></div>
              </div>
            ))
          ) : scheduleItems.length === 0 ? (
            // Empty state
            <div className="min-w-[120px] py-4 px-4 font-bold flex items-center justify-center border-r border-white/20">
              Yayın akışı bulunamadı
            </div>
          ) : (
            // Display schedule items
            scheduleItems.map((item) => (
              <div
                key={item.id}
                className="min-w-[120px] py-4 px-4 font-bold flex flex-col items-center justify-center border-r border-white/20"
              >
                <span className="text-white text-sm">{item.time}</span>
                <span className="text-white text-xs">{item.program}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleBar;
