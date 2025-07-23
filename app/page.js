import Image from "next/image";
import ListingMapView from "./_components/ListingMapView";
import Hero from "@/components/hero";  // Changed from { Hero }
import Tour from "@/components/Tour";  // Changed from { Tour }
import Waiting from "@/components/Waiting";  // Changed from { Waiting }
import Offer from "@/components/offer";  // Changed from { Offer }
import Ad from "@/components/ad";  // Changed from { Ad }
import Cta from "@/components/cta";  // Changed from { Cta }
import Nav from "@/components/nav";  // Changed from { Nav }
import Footer from "@/components/footer";  // Changed from { Footer }

export default function Home() {
  return (
    <>
      <Nav />
      {/* <ListingMapView type='Sell' />
       */}{" "}
      <Hero />
      <main>
        <Tour />
        <Waiting />
        <Offer />
        <Ad />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
