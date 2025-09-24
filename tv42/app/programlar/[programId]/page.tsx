"use client";

import WebLayout from "@/web-components/layout/Layout";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchProgramData } from "@/lib/api";
import Image from "next/image";

interface Program {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  presenter: string;
  broadcast_day: string;
  broadcast_time: string;
  category: string;
}

export default function ProgramDetail() {
  const params = useParams();
  const programId = typeof params.programId === 'string' ? decodeURIComponent(params.programId) : "";
  const [program, setProgram] = useState<Program>({
    id: "",
    title: "Yükleniyor...",
    subtitle: "",
    image: "/placeholder.svg",
    description: "",
    presenter: "",
    broadcast_day: "",
    broadcast_time: "",
    category: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgramDetail = async () => {
      try {
        setLoading(true);
        // Use the programId to fetch specific program data
        const data = await fetchProgramData(programId);

        if (data && data.program) {
          setProgram(data.program);
        } else {
          setError("Program bulunamadı");
          setProgram({
            id: "",
            title: "Program Bulunamadı",
            subtitle: "",
            image: "/placeholder.svg",
            description: "Üzgünüz, aradığınız program bulunamadı.",
            presenter: "",
            broadcast_day: "",
            broadcast_time: "",
            category: "",
          });
        }
      } catch (err) {
        console.error("Program detayları yüklenirken hata oluştu:", err);
        setError("Program detayları yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    if (programId) {
      fetchProgramDetail();
    }
  }, [programId]);

  // Function to determine color based on category
  const getProgramColor = () => {
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

    return program.category && colorMap[program.category]
      ? colorMap[program.category]
      : "bg-gray-600";
  };

  return (
    <WebLayout>
      <div className="py-10">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="mb-10">
                <Image
                  src={program.image || "/placeholder.svg"}
                  alt={program.title}
                  width={1200}
                  height={675}
                  className="w-full aspect-video object-cover rounded-lg shadow-lg"
                />
              </div>

              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">{program.title}</h1>
                {program.subtitle && (
                  <p className="text-xl text-gray-600">{program.subtitle}</p>
                )}
              </div>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {program.broadcast_day && (
                  <div className={`${getProgramColor()} text-white px-4 py-2 rounded-full`}>
                    {program.broadcast_day}
                  </div>
                )}
                {program.broadcast_time && (
                  <div className={`${getProgramColor()} text-white px-4 py-2 rounded-full`}>
                    {program.broadcast_time}
                  </div>
                )}
                {program.presenter && (
                  <div className={`${getProgramColor()} text-white px-4 py-2 rounded-full`}>
                    Sunucu: {program.presenter}
                  </div>
                )}
                {program.category && (
                  <div className={`${getProgramColor()} text-white px-4 py-2 rounded-full`}>
                    {program.category}
                  </div>
                )}
              </div>

              {program.description && (
                <div className="prose max-w-none">
                  <p className="text-lg leading-relaxed">{program.description}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </WebLayout>
  );
}
