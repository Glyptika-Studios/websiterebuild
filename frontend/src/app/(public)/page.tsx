import Hero from "@/components/public/Hero";
import Stats from "@/components/public/Stats";
import Services from "@/components/public/Services";
import CustomSections from "@/components/public/CustomSections";
import ContactTeaser from "@/components/public/ContactTeaser";

export default function Home() {
  return (
    <>
      <main className="flex flex-col w-full bg-[#0a0f1c] min-h-screen">
        <Hero />
        <Stats />
        <Services />
        <CustomSections />
        <ContactTeaser />
      </main>
    </>
  );
}

