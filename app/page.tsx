import { HeroToday } from "@/components/hero/HeroToday";
import HistoricalMap from "@/components/map/HistoricalMap";
import AboutUs from "@/components/about/AboutUs";
import LatestNews from "@/components/news/LatestNews";

export default function Home() {
  return (
    <>
      <HeroToday />
      <HistoricalMap />
      <AboutUs />
      <LatestNews />
    </>
  );
}
