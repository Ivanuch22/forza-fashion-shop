"use client";
import type { EmblaCarouselType } from "embla-carousel";
import type React from "react";
import { type ComponentPropsWithRef, useCallback, useEffect, useState } from "react";

type UsePrevNextButtonsType = {
	prevBtnDisabled: boolean;
	nextBtnDisabled: boolean;
	onPrevButtonClick: () => void;
	onNextButtonClick: () => void;
};

export const usePrevNextButtons = (emblaApi: EmblaCarouselType | undefined): UsePrevNextButtonsType => {
	const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
	const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

	const onPrevButtonClick = useCallback(() => {
		if (!emblaApi) return;
		emblaApi.scrollPrev();
	}, [emblaApi]);

	const onNextButtonClick = useCallback(() => {
		if (!emblaApi) return;
		emblaApi.scrollNext();
	}, [emblaApi]);

	const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
		setPrevBtnDisabled(!emblaApi.canScrollPrev());
		setNextBtnDisabled(!emblaApi.canScrollNext());
	}, []);

	useEffect(() => {
		if (!emblaApi) return;

		onSelect(emblaApi);
		emblaApi.on("reInit", onSelect).on("select", onSelect);
	}, [emblaApi, onSelect]);

	return {
		prevBtnDisabled,
		nextBtnDisabled,
		onPrevButtonClick,
		onNextButtonClick,
	};
};

type PropType = ComponentPropsWithRef<"button">;

export const PrevButton: React.FC<PropType> = (props) => {
	const { children, ...restProps } = props;

	return (
		<button aria-label="Prev Slide" className="embla__button embla__button--prev" type="button" {...restProps}>
			<svg className="embla__button__svg" viewBox="0 0 532 532">
				<path
					fill="currentColor"
					d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z"
				/>
			</svg>
			{children}
		</button>
	);
};

export const NextButton: React.FC<PropType> = (props) => {
	const { children, ...restProps } = props;

	return (
		<button aria-label="Next Slide" className="embla__button embla__button--next" type="button" {...restProps}>
			<svg className="embla__button__svg" viewBox="0 0 532 532">
				<path
					fill="currentColor"
					d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 206.395 206.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2-45.865 45.901-206.404 206.564-229.332 229.52Z"
				/>
			</svg>
			{children}
		</button>
	);
};

type UseDotButtonType = {
	selectedIndex: number;
	scrollSnaps: number[];
	onDotButtonClick: (index: number) => void;
};

export const useDotButton = (emblaApi: EmblaCarouselType | undefined): UseDotButtonType => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

	const onDotButtonClick = useCallback(
		(index: number) => {
			if (!emblaApi) return;
			emblaApi.scrollTo(index);
		},
		[emblaApi],
	);

	const onInit = useCallback((emblaApi: EmblaCarouselType) => {
		setScrollSnaps(emblaApi.scrollSnapList());
	}, []);

	const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
		setSelectedIndex(emblaApi.selectedScrollSnap());
	}, []);

	useEffect(() => {
		if (!emblaApi) return;

		onInit(emblaApi);
		onSelect(emblaApi);
		emblaApi.on("reInit", onInit).on("reInit", onSelect).on("select", onSelect);
	}, [emblaApi, onInit, onSelect]);

	return {
		selectedIndex,
		scrollSnaps,
		onDotButtonClick,
	};
};

type DotPropType = ComponentPropsWithRef<"button">;

export const DotButton: React.FC<DotPropType> = (props) => {
	const { children, ...restProps } = props;

	return (
		<button type="button" {...restProps}>
			{children}
		</button>
	);
};

type UseSelectedSnapDisplayType = {
	selectedSnap: number;
	snapCount: number;
};

export const useSelectedSnapDisplay = (
	emblaApi: EmblaCarouselType | undefined,
): UseSelectedSnapDisplayType => {
	const [selectedSnap, setSelectedSnap] = useState(0);
	const [snapCount, setSnapCount] = useState(0);

	const updateScrollSnapState = useCallback((emblaApi: EmblaCarouselType) => {
		setSnapCount(emblaApi.scrollSnapList().length);
		setSelectedSnap(emblaApi.selectedScrollSnap());
	}, []);

	useEffect(() => {
		if (!emblaApi) return;

		updateScrollSnapState(emblaApi);
		emblaApi.on("select", updateScrollSnapState);
		emblaApi.on("reInit", updateScrollSnapState);
	}, [emblaApi, updateScrollSnapState]);

	return {
		selectedSnap,
		snapCount,
	};
};

type SelectedSnapDisplayPropType = {
	selectedSnap: number;
	snapCount: number;
};

export const SelectedSnapDisplay: React.FC<SelectedSnapDisplayPropType> = (props) => {
	const { selectedSnap, snapCount } = props;

	return (
		<div className="embla__selected-snap-display">
			{selectedSnap + 1} / {snapCount}
		</div>
	);
};
