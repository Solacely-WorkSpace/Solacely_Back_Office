"use client";

import Image from "next/image";

import { XSVG } from "@/assets/SVGAssets";
import { Testimonial } from "@/Constant";

const Waiting = () => {
  return (
    <section className="px-4 py-10 rounded-sm mt-10">
      <div className="landingpage-container">
        <figure className="mb-4 w-20 h-20">
          <Image src="/icons/purple.svg" width={60} height={60} alt="heart" />
        </figure>

        <div className="font-rob md:w-1/2 mb-14">
          <h3 className="mb-3">
            10,000<span className="font-extrabold">+ </span> People are Waiting
          </h3>

          <p className="">
            Helping you in learning about new places and areas by allowing you to
            experience them as if you were there.
          </p>
        </div>

        <div className="w-full overflow-x-auto pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex gap-6 w-max py-2">
            {Testimonial.map((item, index) => (
              <div
                key={index}
                className="bg-[#F8F7FE] rounded-2xl w-[300px] shrink-0 p-6 border border-gray-200"
              >
                <div className="flex justify-between items-center mb-6">
                  <figure className="aspect-square rounded-full overflow-hidden">
                    <Image
                      src={item.pic}
                      height={40}
                      width={40}
                      alt="Picture"
                      className="inset-shadow"
                    />
                  </figure>
                  <XSVG />
                </div>

                <p className="text-sm text-gray-500 mb-6">
                  {item.testimony}
                </p>

                <h4 className="font-mont font-bold text-sm">
                  {item.username}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Waiting;
