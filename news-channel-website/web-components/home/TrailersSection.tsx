
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/web-components/ui/carousel";
import { Skeleton } from "@/web-components/ui/skeleton";

// Define the Trailer interface
interface Trailer {
  id: number;
  image: string;
  title: string;
  time: string;
  day: string;
  channel?: string;
}

interface TrailersSectionProps {
  trailers?: Trailer[];
  loading?: boolean;
}

const TrailersSection = ({ trailers = [], loading = false }: TrailersSectionProps) => {
  // If loading, show skeleton UI
  if (loading) {
    return (
      <section className="py-10 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">YENİ FRAGMANLAR</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="w-full aspect-video" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If no trailers and not loading, don't render the section
  if (trailers.length === 0 && !loading) {
    return null;
  }

  return (
    <section className="py-10 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-10">YENİ FRAGMANLAR</h2>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {trailers.map((trailer) => (
              <CarouselItem key={trailer.id} className="md:basis-1/3 lg:basis-1/3">
                <div className="group relative overflow-hidden">
                  <img
                    src={trailer.image || "/placeholder.svg"}
                    alt={trailer.title}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-purple-600 text-white p-2">
                    <div className="flex flex-col items-center">
                      <p className="text-sm">{trailer.title}</p>
                      <p className="font-bold">
                        {trailer.day} <span className="text-yellow-300">{trailer.time}</span>
                        {trailer.channel && <span className="ml-1">'DE {trailer.channel}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-white text-purple-600 text-xs font-bold px-2 py-1 rounded">
                    YENİ BÖLÜM
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious variant={"link"} className="absolute left-0 top-1/2 transform -translate-y-1/2" />
          <CarouselNext variant={"link"} className="absolute right-0 top-1/2 transform -translate-y-1/2" />
        </Carousel>
      </div>
    </section>
  );
};

export default TrailersSection;
