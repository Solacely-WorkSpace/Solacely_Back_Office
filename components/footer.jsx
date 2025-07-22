import { appstore, facebookLogo, instagramLogo, linkedinLogo, playstore, twitterLogo } from "@/assets/icons";
import { logoWhite } from "@/assets/images";
import { LinkedinSVG } from "@/assets/SVGAssets";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className=" bg-[#521282] px-4 pt-16 md:pt-20 relative">
      <div className="bg-[url('/images/LandingPage/footer/footerbg.png')] bg-contain bg-left-top absolute inset-0 w-full h-full "></div>

      <div className="landingpage-container flex flex-col text-center md:text-left items-center md:items-start lg:flex-row gap-20 justify-between mb-8 z-30">
        <div className="flex-[2]  flex flex-col    items-center md:items-start md:text-left z-30">
          <div className=" flex flex-col gap-2 items-center md:items-start z-30">

            <Image
              src={logoWhite}
              width={1000}
              height={1000}
              alt="logo"
              className="w-36 "
            />

            <p className="text-white/70 mt-2 text-sm">
              Our vision is to have everyone have an affordable place to call home. We are passionate 
              about creating an accessible and transparent ecosystem that allows home seekers a way to 
              explore real estate options, manage their rent payments, and build equity in their homes.
            </p>
          </div>

          <div>
            <p className=" text-white my-3 font-semibold pt-8"> Coming Soon</p>

            <div className=" flex gap-4">
              <button className="h-fit py-3 px-6 rounded-md bg-[#212121] border border-white/70">
                <Image
                  src={appstore}
                  width={1000}
                  height={1000}
                  alt="store"
                  className="w-24 "
                />
              </button>

              <button className="h-fit py-3 px-6 rounded-md bg-[#212121] border border-white/70">
                <Image
                  src={playstore}
                  width={1000}
                  height={1000}
                  alt="store"
                  className="w-24 "
                />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8 justify-between flex-[3]">
          <div className="flex-1 text-white  flex flex-col gap-2 md:gap-4 text-start  z-30">
            <h3 className=" font-semibold text-sm text-white z-30"> Company </h3>

            <Link href="#" className=" opacity-70 text-sm">
              About Us
            </Link>

            <Link href="#" className=" opacity-70 text-sm">
              Our Partner
            </Link>

            <Link href="/contact-us" className=" opacity-70 text-sm">
              Contact Us
            </Link>

            <Link href="#" className=" opacity-70 text-sm">
              FAQS
            </Link>

            <Link href="#" className=" opacity-70 text-sm">
              Terms and Privacy
            </Link>
          </div>

          <div className="flex-1 block text-white font-sans text-start z-30">
            <h3 className=" font-semibold text-sm text-white mb-4">Follow Us</h3>

            <div className=" mt-4 flex gap-3">
              <Link
                href="#"
                className="w-8 "
              >
                <Image
                  src={facebookLogo}
                  alt="facebook icon"
                  width={200}
                  height={200}
                  placeholder="blur"
                />
              </Link>

              <Link
                href="#"
                className="w-8"
              >
                <Image
                  src={instagramLogo}
                  alt="facebook icon"
                  width={200}
                  height={200}
                  placeholder="blur"
                />
              </Link>

              <Link
                href="#"
                className="w-8"
              >
                <Image
                  src={twitterLogo}
                  alt="facebook icon"
                  width={200}
                  height={200}
                  placeholder="blur"
                />
              </Link>

              <Link
                href="#"
                className="w-8"
              >
                <Image
                  src={linkedinLogo}
                  alt="facebook icon"
                  width={200}
                  height={200}
                  placeholder="blur"
                />
              </Link>

            </div>
          </div>
        </div>
      </div>

      <div className="landingpage-container text-center py-4 opacity-50  text-sm">
        <p className=" border-t-[0.1rem] text-white py-4">
          © 2025 Solacely. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
