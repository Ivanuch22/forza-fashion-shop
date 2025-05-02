import type React from "react";
import { useCallback, useState } from "react";

const PLACEHOLDER_SRC = `data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D`;

type PropType = {
	imgSrc: string;
	inView: boolean;
	index: number;
};

export const LazyLoadImage: React.FC<PropType> = (props) => {
	const { imgSrc, inView } = props;
	const [hasLoaded, setHasLoaded] = useState(false);

	const setLoaded = useCallback(() => {
		if (inView) setHasLoaded(true);
	}, [inView, setHasLoaded]);

	return (
		<div className="product_embla__slide">
			<div
				className={"product_embla__lazy-load".concat(
					hasLoaded ? " product_embla__lazy-load--has-loaded" : "",
				)}
			>
				{!hasLoaded && <span className="product_embla__lazy-load__spinner" />}
				<img
					className="product_embla__slide__img product_embla__lazy-load__img"
					onLoad={setLoaded}
					src={inView ? imgSrc : PLACEHOLDER_SRC}
					alt="Your alt text"
					data-src={imgSrc}
				/>
			</div>
		</div>
	);
};
