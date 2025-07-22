"use client"

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ctaImageOne,
  ctaImageTwo,
  ctaImageThree,
  ctaImageFour,
  ctaImageFive,
  ctaImageSix
} from '@/assets/images'
import { useOnWindowResize } from "@/CustomHooks/usOnWindowResize";

const Cta = () => {
  let [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    if (!window) return
    console.log('in')

    const width = window.innerWidth

    if (width < 768) {
      console.log('its less than')
      setContainerWidth(width + 200)
    } else {
      setContainerWidth(width)
    }
  }, [])

  useOnWindowResize(() => {
    const width = window.innerWidth

    if (width < 768) {
      console.log('its less than')
      setContainerWidth(width + 200)
    } else {
      setContainerWidth(width)
    }
  })

  // const containerRef = useRef(null)

  return (
    <section
      className="relative  overflow-hidden  "
      style={{ height: containerWidth / 2 }}
    >
      <div
        // ref={containerRef}
        className="relative min-w-full aspect-square border border-[#EAD6F9] rounded-full overflow-visible grid place-content-center left-[50%] -translate-x-[50%] "
        style={{ width: containerWidth }}
      >
        <Image
          src={ctaImageTwo}
          width={1000}
          height={1000}
          alt="black"
          placeholder="blur"
          className="absolute aspect-square rounded-full max-w-32 border-2 border-white shadow-lg hidden md:block"
          style={{
            top: `${containerWidth / 100 * 20}px`,
            left: `${containerWidth / 100 * 2}px`,
            width: `${containerWidth / 100 * 10}px`
          }}
        />

        <Image
          src={ctaImageOne}
          width={1000}
          height={1000}
          alt="black"
          placeholder="blur"
          className="absolute aspect-square rounded-full max-w-20 border-2 border-white shadow-lg "
          style={{
            top: `${containerWidth / 100 * 2}px`,
            left: `${containerWidth / 100 * 25}px`,
            width: `${containerWidth / 100 * 8}px`
          }}
        />

        <Image
          src={ctaImageThree}
          width={1000}
          height={1000}
          alt="black"
          placeholder="blur"
          className="absolute aspect-square rounded-full max-w-20 border-2 border-white shadow-lg "
          style={{
            top: `${containerWidth / 100 * 2}px`,
            right: `${containerWidth / 100 * 25}px`,
            width: `${containerWidth / 100 * 8}px`
          }}
        />

        <Image
          src={ctaImageFour}
          width={1000}
          height={1000}
          alt="black"
          placeholder="blur"
          className="absolute aspect-square rounded-full max-w-28 border-2 border-white shadow-lg hidden md:block "
          style={{
            top: `${containerWidth / 100 * 17}px`,
            right: `${containerWidth / 100 * 5}px`,
            width: `${containerWidth / 100 * 10}px`
          }}
        />

        <div
          className="relative w-full aspect-square border border-[#EAD6F9] rounded-full overflow-visible grid place-content-center "
          style={{ width: `${containerWidth * 0.75}px` }}
        >
          <Image
            src={ctaImageTwo}
            width={1000}
            height={1000}
            alt="black"
            placeholder="blur"
            className="absolute aspect-square rounded-full max-w-32 border-2 border-white shadow-lg block md:hidden"
            style={{
              top: `${containerWidth / 100 * 6}px`,
              left: `${containerWidth / 100 * 6}px`,
              width: `${containerWidth / 100 * 10}px`
            }}
          />

          <Image
            src={ctaImageFive}
            width={1000}
            height={1000}
            alt="black"
            placeholder="blur"
            className="absolute aspect-square rounded-full max-w-22 border-2 border-white shadow-lg hidden md:block "
            style={{
              top: `${containerWidth / 100 * 20}px`,
              left: `${containerWidth / 100 * 0}px`,
              width: `${containerWidth / 100 * 8}px`
            }}
          />

          <Image
            src={ctaImageFour}
            width={1000}
            height={1000}
            alt="black"
            placeholder="blur"
            className="absolute aspect-square rounded-full max-w-28 border-2 border-white shadow-lg block md:hidden "
            style={{
              top: `${containerWidth / 100 * 10}px`,
              right: `${containerWidth / 100 * 5}px`,
              width: `${containerWidth / 100 * 10}px`
            }}
          />

          <div className="text-center z-30 absolute top-3 md:top-10 left-[50%] -translate-x-[50%]  whitespace-nowrap">
            <p className="text-xl sm:text-3xl md:text-5xl mb-8">
              <b className=" text-green-400"> Solacely </b>is for Everyone.
              <br />
              Easy and Free
            </p>

            <button className="btn-primary">Get Started</button>
          </div>

          <div
            className="relative w-full aspect-square border border-[#EAD6F9] rounded-full overflow-visible grid place-content-center "
            style={{ width: `${containerWidth * 0.5}px` }}
          >
            <Image
              src={ctaImageFive}
              width={1000}
              height={1000}
              alt="black"
              placeholder="blur"
              className="absolute aspect-square rounded-full max-w-22 border-2 border-white shadow-lg block md:hidden "
              style={{
                top: `${containerWidth / 100 * 12}px`,
                left: `${containerWidth / 100 * 0}px`,
                width: `${containerWidth / 100 * 8}px`
              }}
            />

            <Image
              src={ctaImageSix}
              width={1000}
              height={1000}
              alt="black"
              placeholder="blur"
              className="absolute aspect-square rounded-full max-w-20 border-2 border-white shadow-lg "
              style={{
                top: `${containerWidth / 100 * 15}px`,
                right: `${containerWidth / 100 * -2}px`,
                width: `${containerWidth / 100 * 8}px`
              }}
            />

            <div
              className="relative w-full aspect-square border border-[#EAD6F9] rounded-full overflow-visible grid place-content-center "
              style={{ width: `${containerWidth * 0.25}px` }}
            >
            </div>
          </div>
        </div>
      </div>
    </section>

  );
};

export default Cta;




{/* <section className=" px-3 py-20 md:p-20 my-16 lg:p-36 relative">
  <figure className=" max-w-[15%] ring-1 ring-slate-300 absolute left-6 top-1/2 aspect-square rounded-full p-1">
    <Image
      src="/icons/black.svg"
      width={70}
      height={70}
      alt="black"
      className=" aspect-square rounded-full object-cover w-full"
    />
  </figure>

  <figure className=" max-w-[15%] absolute bottom-0 lg:bottom-6  right-1/5 aspect-square rounded-full p-1 ring-1 ring-slate-300">
    <Image
      src="/icons/african.svg"
      width={70}
      height={70}
      alt="black"
      className=" aspect-square rounded-full object-cover w-full"
    />
  </figure>

  <figure className=" absolute -top-2 left-1/5 aspect-square rounded-full max-w-[15%] ring-1 ring-slate-200">
    <Image
      src="/icons/curl.svg"
      width={70}
      height={70}
      alt="black"
      className=" object-cover w-full "
    />
  </figure>

  <figure className=" max-w-[15%] ring-1 ring-slate-300 absolute right-6 bottom-1/4 aspect-square rounded-full p-1">
    <Image
      src="/icons/afro.svg"
      width={70}
      height={70}
      alt="black"
      className=" aspect-square rounded-full object-cover w-full"
    />
  </figure>

  <figure className=" absolute right-1/10 top-1 aspect-square rounded-full p-1 ring-1 ring-slate-200 max-w-[15%]">
    <Image
      src="/icons/fcurls.svg"
      width={70}
      height={70}
      alt="black"
      className=" aspect-square rounded-full object-cover w-full"
    />
  </figure>

  <figure className=" max-w-[15%] ring-1 ring-slate-300 absolute bottom-0 left-1/10 aspect-square rounded-full p-1 z-0">
    <Image
      src="/icons/hd.svg"
      width={70}
      height={70}
      alt="black"
      className=" aspect-square rounded-full "
    />
  </figure>

  <div className="text-center z-50">
    <p className=" text-2xl md:text-4xl mb-10">
      <b className=" text-green-400"> Solacely </b>is for Everyone.
      <br />
      Easy and Free
    </p>
    <button>Get Started</button>
  </div>
</section> */}