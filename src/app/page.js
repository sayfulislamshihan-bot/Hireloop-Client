import FeaturesPage from "@/components/Features";
import Plans from "@/components/PlansPreview";
import StatsSection from "@/components/StatsSection";
import Image from "next/image";

export default function Home() {
  return (
    <div className=" bg-zinc-50 font-sans dark:bg-black">
  
        <StatsSection />
        <FeaturesPage></FeaturesPage>
        <Plans></Plans>
    </div>
  );
}
