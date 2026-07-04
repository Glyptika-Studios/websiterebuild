import Hero from "@/components/public/Hero";
import Stats from "@/components/public/Stats";
import Services from "@/components/public/Services";
import CustomSections from "@/components/public/CustomSections";
import ContactTeaser from "@/components/public/ContactTeaser";

export default function Home() {
  return (
    <>
      <main className="flex flex-col w-full bg-transparent min-h-screen">
        <Hero />
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -my-10 relative z-20">
          <div className="matrix-divider" />
        </div>
        <Stats />
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -my-10 relative z-20">
          <div className="matrix-divider" />
        </div>
        <Services />
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -my-10 relative z-20">
          <div className="matrix-divider" />
        </div>
        <CustomSections />
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -my-10 relative z-20">
          <div className="matrix-divider" />
        </div>
        <ContactTeaser />
      </main>
    </>
  );
}

