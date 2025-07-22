import Image from "next/image";
import Link from "next/link";
import AiPopuop from "../Components/AiPopuop";
import { HeroIllustration, MetaImage } from '@/assets/images'

const Hero = () => {
  return (
    <section className="landingpage-container px-4 md:px-0 mt-20">
      <AiPopuop />

      <div className="flex flex-col-reverse md:flex-row justify-between items-start gap-10 mt-10 ">
        <div className="flex-1 w-full mt-16">
          <div className="  px-2 font-rob">
            <h1 className="text-3xl md:text-5xl font-bold md:leading-14">
              Homes aren't found, they're revealed.
              <br />
              AI-Powered Recommendations.
            </h1>

            <p className=" text-sm md:text-lg leading-6 mt-6 max-w-96 ">
              Find verified rentals, pay in smaller, flexible installments, and enjoy secure, transparent transactions. Earn while you rent — and use it to pay towards your next rent. Solacely makes renting smarter and safer.
            </p>

            <div className=" flex justify-between md:flex-col gap-8 py-4 mt-6 items-center md:items-start">
              <Link
                href="/sign-up"
                className="btn-primary"
              >
                Get Started
              </Link>

              <article>
                <h5 className="font-semibold font-rob text-[#9EA0AB] text-sub text-xs mb-1.5 whitespace-nowrap">
                  OUR ESTEEM PARTNERS
                </h5>
                <figure className=" flex items-center">
                  <Image
                    src={MetaImage}
                    width={400}
                    height={400}
                    alt="meta"
                    placeholder="blur"
                    className="w-16"
                  />
                </figure>
              </article>
            </div>
          </div>
        </div>

        <div className="w-full flex-1">
          <Image
            src={HeroIllustration}
            alt="hero illustration"
            width={2000}
            height={2000}
            placeholder="blur"
            className="w-full"
          />

        </div>
      </div>
    </section>
  );
};

export default Hero;
