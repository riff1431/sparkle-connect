import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomepageHero from "@/components/homepage/HomepageHero";
import SearchFilterBar from "@/components/homepage/SearchFilterBar";
import CleanerOfTheWeekCard from "@/components/homepage/CleanerOfTheWeekCard";
import CategoryChipsRow from "@/components/homepage/CategoryChipsRow";
import SponsoredSpotlightSection from "@/components/homepage/SponsoredSpotlightSection";
import QuoteRequestSidebar from "@/components/homepage/QuoteRequestSidebar";
import MapPreviewCard from "@/components/homepage/MapPreviewCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HomepageHero />

        {/* Full blue gradient wash area */}
        <div className="bg-gradient-to-b from-[hsl(210_60%_95%)] via-[hsl(210_50%_96%)] to-[hsl(210_40%_97%)]">
          <SearchFilterBar />

          {/* Main 2-Column Layout */}
          <div className="container mx-auto px-4 py-6">
            <div className="grid lg:grid-cols-[1fr_320px] gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <CleanerOfTheWeekCard />
                <CategoryChipsRow />
                <SponsoredSpotlightSection />
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                <QuoteRequestSidebar />
                <MapPreviewCard />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
