
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/web-components/ui/carousel";
import Link from "next/link";
import { Skeleton } from "@/web-components/ui/skeleton";

// Define the Episode interface
interface Episode {
  id: number;
  image: string;
  title: string;
}

interface EpisodesSectionProps {
  episodes?: Episode[];
  loading?: boolean;
}

const EpisodesSection = ({ episodes = [], loading = false }: EpisodesSectionProps) => {
  // If loading, show skeleton UI
  if (loading) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">BÖLÜMLER</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="w-full aspect-video" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If no episodes and not loading, don't render the section
  if (episodes.length === 0 && !loading) {
    return null;
  }

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-10">BÖLÜMLER</h2>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {episodes.map((episode) => (
              <CarouselItem key={episode.id} className="md:basis-1/3 lg:basis-1/4">
                <Link href="#" className="block group">
                  <div className="overflow-hidden">
                    <img
                      src={episode.image || "/placeholder.svg"}
                      alt={episode.title}
                      className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-3 text-sm font-medium line-clamp-2 group-hover:text-kontv-orange">
                    {episode.title}
                  </h3>
                </Link>
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

export default EpisodesSection;
