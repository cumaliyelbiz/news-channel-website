"use client";
import WebLayout from "@/web-components/layout/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchProgramsData } from "@/lib/api";
import Image from "next/image";

interface Program {
  id: number;
  title: string;
  broadcast_time?: string;
  broadcast_day?: string;
  category: string;
  image: string;
  presenter?: string;
  is_active?: number;
}

// Use Program type for state
export default function Programlar() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        setLoading(true);
        const data = await fetchProgramsData();

        // Filter active programs if is_active field exists
        const activePrograms = data.programs.filter((program: Program) =>
          program.is_active === undefined || program.is_active === 1
        );

        setPrograms(activePrograms);
      } catch (err) {
        console.error("Programlar yüklenirken hata oluştu:", err);
        setError("Programlar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };

    loadPrograms();
  }, []);

  return (
    <WebLayout>
      <div className="py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-center mb-10">PROGRAMLARIMIZ</h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              <p>{error}</p>
            </div>
          ) : programs.length === 0 ? (
            <div className="text-center py-10">
              <p>Henüz program bulunmamaktadır.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {programs.map((program) => (
                <Link
                  key={program.id}
                  href={`/programlar/${encodeURIComponent(program.id)}`}
                  className="group cursor-pointer"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                    <div className="relative overflow-hidden">
                      <div className="aspect-video">
                        <Image
                          src={program.image}
                          alt={program.title}
                          width={300}
                          height={200}
                          className="rounded-lg"
                        />
                      </div>
                      <div className={`absolute bottom-0 left-0 right-0 bg-red-400 bg-opacity-90 p-3`}>
                        <div className="flex justify-between items-center text-white">
                          <div className="flex items-center">
                            <span className="mr-1">⏰</span>
                            <span>{program.broadcast_time || "00:00"}</span>
                          </div>
                          <div>
                            <span>{program.broadcast_day || "HER GÜN"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-center mb-1 line-clamp-1 group-hover:text-primary transition-colors duration-300">
                        {program.title}
                      </h3>
                      {program.presenter && (
                        <div className="flex items-center justify-center text-sm text-gray-600 mt-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          <span>{program.presenter}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </WebLayout>
  );
}
