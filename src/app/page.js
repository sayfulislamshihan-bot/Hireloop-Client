import FeaturesPage from "@/components/Features";
import LandingPageJobsPage from "@/components/LandingPageJobs";
import Plans from "@/components/PlansPreview";
import StatsSection from "@/components/StatsSection";
import Image from "next/image";

export default function Home() {
  return (
    <div className=" bg-zinc-50 font-sans dark:bg-black">
  
        <StatsSection />
        <LandingPageJobsPage></LandingPageJobsPage>
        <FeaturesPage></FeaturesPage>
        <Plans></Plans>
    </div>
  );
}
