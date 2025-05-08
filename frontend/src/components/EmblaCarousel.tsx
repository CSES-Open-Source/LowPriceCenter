import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import { PrevButton, NextButton, usePrevNextButtons } from "./EmblaCarouselArrowButtons";
import useEmblaCarousel from "embla-carousel-react";

type PropType = {
  slides: string[];
  options?: EmblaOptionsType;
  onSelect?: (index: number) => void;
};

const EmblaCarousel: React.FC<PropType> = ({ slides, options, onSelect }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi);

  return (
    <div className="relative w-full">
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10">
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
      </div>
      <section className="max-w-[28rem] mx-auto [--slide-height:19rem] [--slide-spacing:1rem] [--slide-size:50%]">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {slides.map((imageUrl, index) => (
              <div className="flex-none min-w-0 pl-4" key={index}>
                <img
                  src={imageUrl}
                  alt={`Slide ${index + 1}`}
                  className="h-32 w-auto object-contain cursor-pointer"
                  onClick={() => onSelect?.(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10">
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
      </div>
    </div>
  );
};

export default EmblaCarousel;
