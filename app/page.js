import Image from "next/image";
import ListingMapView from "./_components/ListingMapView";
// import Hero from "@/components/Hero";     // Updated to match Hero.jsx
import Tour from "@/components/Tour";
import Waiting from "@/components/Waiting";
import Offer from "@/components/Offer";   // Updated to match Offer.jsx
import Ad from "@/components/Ad";         // Updated to match Ad.jsx
import Cta from "@/components/Cta";       // Updated to match Cta.jsx
import Nav from "@/components/Nav";       // Updated to match Nav.jsx
// import Footer from "@/components/Footer"; // Updated to match Footer.jsx

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
