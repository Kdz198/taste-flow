import HeroSection from "./_components_home/HeroSection";
import FeaturedBanner from "./_components_home/FeaturedBanner";
import CraveWorthyDishes from "./_components_home/CraveWorthyDishes";
import ExploreMoreSection from "./_components_home/ExploreMoreSection";
import FeaturedRecipeHighlight from "./_components_home/FeaturedRecipeHighlight";
import FanFavorites from "./_components_home/FanFavorites";
import CallToActionBanner from "./_components_home/CallToActionBanner";

export default function Home() {
  return (
    <div className="text-white">
      <HeroSection /> 
      <FeaturedBanner />
      
      <div className="max-w-7xl mx-auto px-4">
        <CraveWorthyDishes />
        <ExploreMoreSection />
        <FeaturedRecipeHighlight />
        <FanFavorites />
        <CallToActionBanner />
      </div>
    </div>
  );
}