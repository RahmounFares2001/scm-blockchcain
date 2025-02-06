import Image from "next/image";
import Hero from "./components/home/Hero";
import HomeHeader from "./components/home/HomeHeader";
import Features from "./components/home/Features";
import Contact from "./components/home/Contact";
import HomeFooter from "./components/home/HomeFooter";

export default function Home() {
  return (
    <section className="bg-primary" >
      <HomeHeader />
      <Hero />
      <Features />
      <Contact />
      <HomeFooter />
    </section>
  );
}
