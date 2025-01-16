"use client";
import { LazyLoadImage } from "@/modules/product/components/cmbla-carousel-lazy-load-image";
import { DotButton, useDotButton } from "@/ui/embla-carousel-arrow-buttons";
import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import React from "react";
import { useCallback, useEffect, useState } from "react";
import "../styles/embela-carousel.css";
import { Thumb } from "@/modules/product/components/embla-carousel-thumbs-button";
import Image from "next/image";
type PropType = {
	slides: {
		url: string;
		id: string;
	}[];
	options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
	const { slides, options } = props;
	const [emblaRed, emblaApi] = useEmblaCarousel(options);
	const [slidesInView, setSlidesInView] = useState<number[]>([]);

	const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

	const updateSlidesInView = useCallback((emblaApi: EmblaCarouselType) => {
		setSlidesInView((slidesInView) => {
			if (slidesInView.length === emblaApi.slideNodes().length) {
				emblaApi.off("slidesInView", updateSlidesInView);
			}
			const inView = emblaApi.slidesInView().filter((index) => !slidesInView.includes(index));
			return slidesInView.concat(inView);
		});
	}, []);

	const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
		containScroll: "keepSnaps",
		dragFree: true,
	});
	const onThumbClick = useCallback(
		(index: number) => {
			if (!emblaApi || !emblaThumbsApi) return;
			emblaApi.scrollTo(index);
		},
		[emblaApi, emblaThumbsApi],
	);

	useEffect(() => {
		if (!emblaApi) return;

		updateSlidesInView(emblaApi);
		emblaApi.on("slidesInView", updateSlidesInView);
		emblaApi.on("reInit", updateSlidesInView);
	}, [emblaApi, updateSlidesInView]);

	return (
		<div className="product_embla">
			<div className="product_embla__viewport" ref={emblaRed}>
				<div className="product_embla__container">
					{slides.map((slide, index) => (
						<React.Fragment key={slide.id}>
							{index == 0 ? (
								<Image
									className="product_embla__slide"
									key={slide.id}
									src={slide?.url}
									alt={"product image"}
									width={800}
									height={800}
								/>
							) : (
								<LazyLoadImage
									key={slide.id}
									index={index}
									imgSrc={slide?.url}
									inView={slidesInView.indexOf(index) > -1}
								/>
							)}
						</React.Fragment>
					))}
				</div>
			</div>
			{slides.length && (
				<div className="product_embla-thumbs hidden lg:block">
					<div className="product_embla-thumbs__viewport" ref={emblaThumbsRef}>
						<div className="product_embla-thumbs__container">
							{slides.map((slide, index) => (
								<Thumb
									slidesInView={slidesInView}
									slide={slide}
									key={index}
									onClick={() => onThumbClick(index)}
									selected={index === selectedIndex}
									index={index}
								/>
							))}
						</div>
					</div>
				</div>
			)}

			{scrollSnaps.length > 1 && (
				<div className="product_embla__controls flex lg:hidden">
					<div className="product_embla__dots">
						{scrollSnaps.map((_, index) => (
							<DotButton
								key={index}
								aria-label={`slider button ${index}`}
								onClick={() => onDotButtonClick(index)}
								className={"product_embla__dot".concat(
									index === selectedIndex ? " embla__dot--selected" : "",
								)}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default EmblaCarousel;
