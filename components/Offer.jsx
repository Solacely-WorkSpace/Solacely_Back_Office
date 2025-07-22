import { whatWeOffer } from "@/Constant";
import Image from "next/image";
import { offerSectionImage } from "@/assets/images";
import clsx from "clsx";

const Offer = () => {
  return (
    <section className=" bg-[url('/images/LandingPage/offer/Bg.png')] bg-left-top bg-fixed bg-cover w-screen p-2 md:px-8">
      <div className="landingpage-container flex gap-8 flex-col md:flex-row items-center justify-between py-10">
        <figure className="flex-1 flex flex-col justify-end md:pt-40">
          <h2 className=" text-center md:text-left">
            The Excellent Luxury we
            <br />
            Offer to all Potential{" "}
            <br />
            <b className="text-green-400">Home Owners </b>
          </h2>

          <Image
            src={offerSectionImage}
            width={200}
            height={200}
            alt="3d design"
            placeholder="blur"
            className=" hidden md:block w-64 h-64"
          />
        </figure>

        <div className="flex-1 grid max-md:gap-8 grid-cols-1 md:grid-cols-2 group">
          {whatWeOffer.map((item, index) => {
            const isLast = index === whatWeOffer.length - 1
            return (
              <article
                key={index}
                className={clsx(
                  "h-fit p-8 flex flex-col transition-all duration-200",
                  "hover:bg-white hover:scale-105 hover:rounded-xl max-md:rounded-xl max-md:bg-white ",
                  {
                    "md:border-r group-hover:border-0 border-black/30 md:border-b border-dashed": index === 0,
                    "md:bg-white md:group-hover:bg-transparent md:hover:bg-white": isLast
                  }
                )}
              >
                <Image
                  src={item.icon}
                  width={35}
                  height={35}
                  alt="icon"
                  className="w-10 "
                />

                <div className="">
                  <h4 className="text-lg font-semibold my-3.5">{item.header}</h4>

                  <p className="">
                    {item.offer}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Offer;
