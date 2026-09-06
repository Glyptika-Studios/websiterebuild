import Hero from "@/components/public/Hero";
import MediaCarousel from "@/components/public/MediaCarousel";
import Services from "@/components/public/Services";
import CustomSections from "@/components/public/CustomSections";
import ContactTeaser from "@/components/public/ContactTeaser";

export default function Home() {
  return (
    <>
      <main className="flex flex-col w-full bg-transparent min-h-screen gap-16 md:gap-24 pb-20">
        <Hero />
        <MediaCarousel />
        <Services />
        <CustomSections />
        <ContactTeaser />
      </main>
    </>
  );
}
