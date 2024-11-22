const WhyChooseUs = () => {
  return (
    <div className="px-2 py-5">
      <h5 className="tracking-[0.02rem]   font-bold flex justify-center items-end gap-4 flex-wrap text-center text-[1.8rem] md:text-[2.3rem] mb-6 mx-0 my-12 px-6 mt-6">
        Why Our Customers Love Us
      </h5>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-[40px] py-10">
        <div>
          <div className="grid justify-center">
            <img className="m-[0_auto] w-[50px] h-[50px] " src="/White_Milestone.png" />
            <h6 className="tracking-[0.02rem] font-bold flex justify-center items-end gap-4 flex-wrap text-center text-[1rem] md:text-[1.3rem] mx-0 my-2 ">
              Shopify Milestone Achieved
            </h6>
            <p style={{ fontFamily: "'HarmoniaSansProCyr', sans-serif" }} className=" tracking-[0.02rem] text-[1rem] text-center">
              Amazing Value Everyday
            </p>
          </div>
        </div>
        <div>
          <div className="grid justify-center ">
            <img className="m-[0_auto] w-[50px] h-[50px] " src="/icons8-price-tag-100.png" />
            <h6 className="tracking-[0.02rem] font-bold flex justify-center items-end gap-4 flex-wrap text-center text-[1rem] md:text-[1.3rem] mx-0 my-2 ">
              Amazing Value Everyday
            </h6>
            <p style={{ fontFamily: "'HarmoniaSansProCyr', sans-serif" }} className=" tracking-[0.02rem] text-[1rem] text-center">
              Products you love at prices that fit your budget
            </p>
          </div>
        </div>
        <div>
          <div className="grid justify-center">
            <img className="m-[0_auto] w-[50px] h-[50px] " src="/icons8-chat-100.png" />
            <h6 className="tracking-[0.02rem] font-bold flex justify-center items-end gap-4 flex-wrap text-center text-[1rem] md:text-[1.3rem] mx-0 my-2 ">
              Expert Customer Service
            </h6>
            <p style={{ fontFamily: "'HarmoniaSansProCyr', sans-serif" }} className=" tracking-[0.02rem] text-[1rem] text-center">
              Our friendly team’s on hand five days a week to answer any question you may have
            </p>
          </div>
        </div>
        <div>
          <div className="grid justify-center">
            <img className="m-[0_auto] w-[50px] h-[50px] " src="/icons8-guarantee-certificate-100.png" />
            <h6 className="tracking-[0.02rem] font-bold flex justify-center items-end gap-4 flex-wrap text-center text-[1rem] md:text-[1.3rem] mx-0 my-2 ">
              Satisfaction Guaranteed
            </h6>
            <p style={{ fontFamily: "'HarmoniaSansProCyr', sans-serif" }} className=" tracking-[0.02rem] text-[1rem] text-center">
              We stand by our products and our promise to ensure your satisfaction. Every order comes with a 30 day satisfaction guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default WhyChooseUs;