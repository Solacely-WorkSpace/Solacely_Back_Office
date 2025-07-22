import Image from "next/image";

const Ad = () => {
  return (
    <section className="w-screen h-fit px-4 md:px-8 relative">
      <div className="w-16 h-16 rounded-full bg-white/10 absolute top-2 right-0 md:right-[40%] z-40"></div>

      <div className="landingpage-container bg-[#521282] flex gap-8 md:gap-16 flex-col min-[940px]:flex-row items-center md:items-end justify-between px-8 py-20 md:py-24 md:px-24 text-white font-sans rounded-4xl my-10 relative">
        <Image
          src="/images/LandingPage/offer/virtal 1.png"
          width={120}
          height={120}
          alt="video icon"
          className="absolute md:-bottom-16 -left-24 w-106"
        />

        <Image
          src="/icons/360.svg"
          width={120}
          height={120}
          alt="video icon"
          className=" rotate-50 absolute -bottom-6 -right-6 md:-right-4 md:-top-12 w-28 md:w-40"
        />

        <article className="flex-1 flex flex-col gap-2 text-center md:text-start">
          <h3 className="text-3xl md:text-4xl font-rob font-bold w-full text-white">
            Solacely is coming soon to all devices
          </h3>
          <p className="text-md text-[#ccc] ">
            Solacely - Revolutionizing real estate, powered by AI, and built on blockchain.
          </p>
        </article>

        <div className="flex-1 flex gap-4 md:gap-8 flex-col md:flex-row md:items-center">
          <button className="px-6 py-3 rounded-2xl bg-complementary flex items-center gap-2">
            <Image
              src="/images/LandingPage/ad/appstore.png"
              width={30}
              height={30}
              alt="apple"
              className="w-8 "
            />

            <p className="text-start text-white leading-5">
              Get it on
              <br />
              <span className="font-semibold">AppleStore</span>
            </p>
          </button>

          <button className="px-6 py-3 rounded-2xl bg-complementary flex items-center gap-2">
            <Image
              src="/images/LandingPage/ad/playstore.png"
              width={30}
              height={30}
              alt="apple"
              className="w-8 "
            />

            <p className="text-start text-white leading-5">
              Get it on
              <br />
              <span className="font-semibold">PlayStore</span>
            </p>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Ad;
