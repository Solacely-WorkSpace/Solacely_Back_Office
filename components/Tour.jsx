"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import TourApartment from "../components/TourApartment";
import TourSectionLinks from "../components/TourSectionLinks";
import TourCoLivingSpace from "../components/TourCoLivingSpace";
import TourPairWithMe from "../components/TourPairWithMe";
import TourRealEstate from "../components/TourRealEstate";

const Tour = () => {
  const [isActive, setIsActive] = useState(0);

  return (
    <section className="landingpage-container px-4 mt-16 w-full">
      <div className=" text-center mb-10 leading-12">
        <small className="text-sm text-[#9EA0AB] ">Our Unique Spaces</small>

        <h2>
          From Screen to Keys
        </h2>
      </div>

      <section className=" bg-[#F8F7FE] rounded-2xl p-4 md:p-16 overflow-y-visible ">
        <div className="w-full h-fit overflow-x-auto pt-4 pb-0">
          <TourSectionLinks {...{ isActive, setIsActive }} />
        </div>

        {
          isActive === 0 &&
          <TourApartment />
        }

        {
          isActive === 1 &&
          <TourCoLivingSpace />
        }

        {
          isActive === 2 &&
          <TourPairWithMe />
        }

        {
          isActive === 3 &&
          <TourRealEstate />
        }
      </section >
    </section >
  );
};

export default Tour;
