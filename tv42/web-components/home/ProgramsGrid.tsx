
import Link from "next/link";
import React from "react";

// Remove the hardcoded programs array and add props interface
interface ProgramsGridProps {
  programs: any[];
  loading: boolean;
}

const ProgramsGrid = ({ programs, loading }: ProgramsGridProps) => {
  // Function to determine color based on category or index
  const getProgramColor = (program: any, index: number) => {
    const colorMap: Record<string, string> = {
      "Haber": "bg-red-600",
      "Spor": "bg-green-600",
      "Ekonomi": "bg-yellow-600",
      "Kültür": "bg-blue-600",
      "Eğlence": "bg-purple-600",
      "Belgesel": "bg-gray-700",
      "Tartışma": "bg-yellow-800",
      "Yaşam": "bg-green-400",
      "Müzik": "bg-pink-500",
    };

    // Use category if available, otherwise use index-based color
    if (program.category && colorMap[program.category]) {
      return colorMap[program.category];
    }

    // Fallback colors
    const fallbackColors = [
      "bg-red-600", "bg-green-600", "bg-blue-600", "bg-yellow-600", 
      "bg-purple-600", "bg-gray-700", "bg-pink-500", "bg-yellow-800"
    ];
    
    return fallbackColors[index % fallbackColors.length];
  };

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-10">PROGRAMLARIMIZ</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-10">
            <p>Henüz program bulunmamaktadır.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.slice(0, 8).map((program, index) => (
              <Link 
                key={program.id} 
                href={`/programlar/${encodeURIComponent(program.id)}`} 
                className="block group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={program.image || "/placeholder.svg"}
                    alt={program.title}
                    className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className={`absolute bottom-0 left-0 right-0 ${getProgramColor(program, index)} p-4`}>
                    <div className="text-center text-white">
                      <p className="text-sm">{program.broadcast_day || "HER GÜN"}</p>
                      <p className="text-xl font-bold">{program.broadcast_time || "00:00"}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProgramsGrid;
