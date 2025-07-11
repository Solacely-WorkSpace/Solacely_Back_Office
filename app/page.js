import Image from "next/image";
import ListingMapView from "./_components/ListingMapView";
import { Navbar5 } from "@/components/navbar";
import { Footer7 } from "@/components/footer";
import { Hero47 } from "@/components/phone";
import { Hero34 } from "@/components/hero";


export default function Home() {
  return (
   <div className=" p-10">
      {/* <ListingMapView type='Sell' />
       */}
       <Navbar5/>
       <Hero34/>
       <Hero47/>
       <Footer7/>
   </div>
  );
}
