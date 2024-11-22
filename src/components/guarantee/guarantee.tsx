import Image from "next/image"
import "./guarantee.css"
import image from "./Ridge_Dawn_1.webp"
const Guarantee = () => {
  return (
    <div>
      <section id="shopify-section-template--18466364227834__slideshow_6WEydz" className="shopify-section section">
        <div className="relative overflow-hidden  flex flex-col " role="region" aria-roledescription="Carousel" aria-label="Slideshow about our brand">
          <div className="slideshow banner banner--medium grid grid--1-col slider slider--everywhere banner--mobile-bottom" id="Slider-template--18466364227834__slideshow_6WEydz" aria-live="polite" aria-atomic="true" data-autoplay="false" data-speed="5">
            <div className="relative lg:pb-[40%] slideshow__slide grid__item grid--1-col slider__slide" id="Slide-template--18466364227834__slideshow_6WEydz-1" role="group" aria-roledescription="Slide" aria-label="1 of 1">
              <div className="slideshow__media banner__media media">
                <Image
                  className="w-full h-auto lg:absolute"
                  src={image}
                  alt="asdf"
                  width={1500}
                  height={1000}
                />
              </div>
              <div className="sm:absolute sm:top-[20%] sm:left-[10%] sm:text-white ">
                <div className=" w-[90%] m-[0_auto] lg:w-[40%] lg:text-left sm:m-[0_0] slideshow__text banner__box banner--transparent-white content-container content-container--full-width-mobile color-background-1 color-scheme-template--18466364227834__slideshow_6WEydz-slide_zCbQ4R gradient slideshow__text--left slideshow__text-mobile--center">
                  <h5 className="tracking-[0.02rem] pt-4 lg:text-left  font-bold flex justify-center items-end gap-4 flex-wrap text-center text-[1.5rem] md:text-[2.3rem] mb-2 mx-0 my-12 mt-6">
                    30-DAY COOL OFF GUARANTEE
                  </h5>
                  <div style={{ fontFamily: "'HarmoniaSansProCyr', sans-serif" }} className=" lg:text-left tracking-[0.02rem] text-[1rem] text-center">
                    <span>Love it or not, no stress. We've got you covered with a straightforward 30-day return policy. If our gear doesn't mesh with your style, send it back. Simple, hassle-free, and on your terms. Your satisfaction is our priority.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )

}
export default Guarantee
