import { getTranslations } from "next-intl/server";
import Image from "next/image";

const icons = [
	"/White_Milestone.png",
	"/icons8-price-tag-100.png",
	"/icons8-chat-100.png",
	"/icons8-guarantee-certificate-100.png",
];

const WhyChooseUs = async () => {
	const t = await getTranslations("Global.CustomersLove");
	return (
		<div className="px-2 py-5">
			<h6 className="tracking-[0.02rem]   font-bold flex justify-center items-end gap-4 flex-wrap text-center text-[1.8rem] md:text-[2.3rem] mb-6 mx-0 my-12 px-6 mt-6">
				{t("title")}
			</h6>
			<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-[40px] py-10">
				{[0, 1, 2, 3].map((index) => (
					<div key={index}>
						<div className="grid justify-center">
							{icons[index] && (
								<Image
									width={50}
									height={50}
									alt="icon"
									className="m-[0_auto] w-[50px] h-[50px]"
									src={icons[index]}
								/>
							)}
							<p className="tracking-[0.02rem] font-bold flex justify-center items-end gap-4 flex-wrap text-center text-[1rem] md:text-[1.3rem] mx-0 my-2">
								{t(`blocks.${index}.title`)}
							</p>
							<p
								style={{ fontFamily: "'HarmoniaSansProCyr', sans-serif" }}
								className="tracking-[0.02rem] text-[1rem] text-center"
							>
								{t(`blocks.${index}.description`)}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
export default WhyChooseUs;
