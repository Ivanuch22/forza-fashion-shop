import { LazyLoadImage } from "@/app/[locale]/(store)/product/carousel/components/cmbla-carousel-lazy-load-image";
import type React from "react";

type PropType = {
	selected: boolean;
	index: number;
	slide: { url: string };
	onClick: () => void;
	slidesInView: number[];
};

export const Thumb: React.FC<PropType> = (props) => {
	const { slidesInView, slide, selected, index, onClick } = props;
	console.log(slidesInView);
	return (
		<div
			className={"product_embla-thumbs__slide".concat(
				selected ? " product_embla-thumbs__slide--selected" : "",
			)}
		>
			<button onClick={onClick} type="button" className="product_embla-thumbs__slide__number">
				<LazyLoadImage index={index} imgSrc={slide?.url} inView={true} />
			</button>
		</div>
	);
};
