import Hero from "@/components/site/sections/Hero";
import About from "@/components/site/sections/About";
import Progress from "@/components/site/sections/Progress";
import DonationSection from "@/components/site/sections/DonationSection";
import Gallery from "@/components/site/sections/Gallery";
import Contact from "@/components/site/sections/Contact";

export default function Index() {
  return (
    <div className="">
      <Hero />
      <About />
      <Progress />
      <DonationSection />
      <Gallery />
      <Contact />
    </div>
  );
}
