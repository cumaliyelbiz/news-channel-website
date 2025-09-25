
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/web-components/ui/carousel";
import Link from "next/link";

// Remove the hardcoded programs array and add props interface
interface ProgramSliderProps {
  programs: any[];
  loading: boolean;
}

const ProgramSlider = ({ programs, loading }: ProgramSliderProps) => {
  // Take only the first 5 programs for the slider
  const sliderPrograms = programs.slice(0, 5);

  return (
    <section className="py-4">
      <div className="container mx-auto px-4 relative">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : sliderPrograms.length === 0 ? (
          <div className="text-center py-10">
            <p>Henüz program bulunmamaktadır.</p>
          </div>
        ) : (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {sliderPrograms.map((program) => (
                <CarouselItem key={program.id} className="md:basis-1/3 lg:basis-1/4">
                  <Link href={`/programlar/${encodeURIComponent(program.id)}`}>
                    <div className="relative rounded overflow-hidden">
                      <img
                        src={program.image || "/placeholder.svg"}
                        alt={program.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute bottom-4 left-4 bg-white p-2 rounded">
                        <p className="font-bold text-sm">{program.broadcast_day || "HER GÜN"}</p>
                        <p className="text-xl font-bold">{program.broadcast_time || "00:00"}</p>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious variant={"link"} className="absolute left-0 top-1/2 transform -translate-y-1/2" />
            <CarouselNext variant={"link"} className="absolute right-0 top-1/2 transform -translate-y-1/2" />
          </Carousel>
        )}
      </div>
    </section>
  );
};

export default ProgramSlider;
