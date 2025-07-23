import Image from "next/image";
import ListingMapView from "./_components/ListingMapView";
import Hero from "@/components/Hero";
import Tour from "@/components/Tour";
import Waiting from "@/components/Waiting";
import Offer from "@/components/Offer";
import Ad from "@/components/Ad";
import Cta from "@/components/Cta";
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export default function Home() {
  return (
 <>
<Nav/>
      {/* <ListingMapView type='Sell' />
       */} <Hero />

            <main >
                <Tour />
                <Waiting />
                <Offer />
                <Ad />
                <Cta />
            </main>
     <Footer/>
    </>
  );
}
