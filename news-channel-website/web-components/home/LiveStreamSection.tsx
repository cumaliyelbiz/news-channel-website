
"use client";

import { Play, Volume2, Maximize, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchLiveStreamData } from "@/lib/api";
import Link from "next/link";

interface LiveStreamData {
  streamUrl: string;
  streamTitle: string;
  thumbnailUrl: string;
  isLive: boolean;
}

const LiveStreamSection = () => {
  const [streamData, setStreamData] = useState<LiveStreamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLiveStreamData();
        setStreamData(data);
      } catch (error) {
        console.error("Canlı yayın verileri alınırken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">CANLI YAYIN</h2>
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="aspect-video bg-gray-900 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
          ) : (
            <div className="aspect-video bg-black relative">
              {isPlaying && streamData?.streamUrl ? (
                <iframe
                  src={streamData.streamUrl}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              ) : (
                <>
                  <img
                    src={streamData?.thumbnailUrl || "/placeholder.svg"}
                    alt="Live broadcast"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      className="bg-white/50 rounded-full p-4 hover:bg-white/70 transition-colors"
                      onClick={handlePlay}
                    >
                      <Play className="w-12 h-12 text-white fill-white" />
                    </button>
                  </div>
                </>
              )}
              
              {!isPlaying && (
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
                  <div className="flex items-center space-x-4">
                    <button className="hover:text-kontv-orange" onClick={handlePlay}>
                      <Play className="w-6 h-6" />
                    </button>
                    <button className="hover:text-kontv-orange">
                      <Volume2 className="w-6 h-6" />
                    </button>
                    {streamData?.isLive && (
                      <div className="px-2 py-1 bg-red-600 text-white text-sm">CANLI</div>
                    )}
                  </div>
                  <Link href="/canli-yayin" className="hover:text-kontv-orange">
                    <Maximize className="w-6 h-6" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LiveStreamSection;
