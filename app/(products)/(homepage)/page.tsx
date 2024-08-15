import Image from "next/image";

import NewCollection from "./_components/collections";
import Hero from "./_components/hero";
import TrendingProducts from "./_components/trending-products";
import Technology from "./_components/technology";
import WhyChooseUs from "./_components/why-choose-us";
import Footer from "./_components/footer";

export default function Home() {
  return (
    <div className=" flex flex-col items-center justify-center ">
      <Hero />
      <TrendingProducts />
      <NewCollection />
      <Technology />
      <WhyChooseUs />
      <Footer />
    </div>
  );
}
