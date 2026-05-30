import { Metadata } from "next";
import * as motion from "framer-motion/client";
import ShopNavbar from "@/components/shop/ShopNavbar";
import ShopSubNav from "@/components/shop/ShopSubNav";
import HeroCarousel from "@/components/shop/HeroCarousel";
import FeatureSection from "@/components/shop/FeatureSection";
import ProductBentoGrid from "@/components/shop/ProductBentoGrid";
import ShopFooter from "@/components/shop/ShopFooter";
import dbConnect from "@/lib/mongodb";
import ShopProduct from "@/models/ShopProduct";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
    title: `Shop | ${siteConfig.name}`,
    description: siteConfig.description,
};

// Force dynamic since shop products can change or go inactive
export const dynamic = "force-dynamic";

export default async function ShopPage() {
    await dbConnect();

    // Fetch active products
    const activeProducts = await ShopProduct.find({ isActive: true })
        .sort({ baseCashPrice: 1 })
        .lean();

    // Separate into vehicles and energy
    const vehiclesData = activeProducts.filter(p => p.category === "VEHICLE");
    const energyData = activeProducts.filter(p => p.category === "ENERGY");

    // Serialize vehicles for client component
    const vehiclesForCarousel = vehiclesData.map((v: any) => ({
        _id: v._id.toString(),
        slug: v.slug,
        name: v.name,
        description: v.description || "Experience the Future.",
        heroImage: v.heroImage || "",
        baseCashPrice: v.baseCashPrice,
        category: v.category,
    }));

    const currentVehicles = vehiclesForCarousel;

    return (
        <div className="bg-[#F4F4F4]">
            {/* Navigation */}
            <ShopNavbar />

            <main className="w-full min-h-screen pb-24">

                {/* 1. Main Immersive Hero (100vh) */}
                <HeroCarousel vehicles={currentVehicles} />

                {/* 2. Feature Section with Video */}
                <FeatureSection
                    title="Full Self-Driving"
                    titleHighlight="(Supervised)"
                    subtitle="Makes every drive easier. Subscribe for $99/mo."
                    stats={[
                        { value: "7x", label: "Fewer Collisions" },
                        { value: "10,693,508,104", label: "Miles Driven" },
                    ]}
                    primaryCTA={{ text: "Schedule Demo", href: "/dashboard" }}
                    secondaryCTA={{ text: "Learn More", href: "#vehicles" }}
                    videoSrc="/video/tesla.webm"
                    videoCaption="I do my espresso while I'm driving."
                />

                {/* 3. Sticky Sub-Navigation */}
                <ShopSubNav
                    sections={[
                        { id: "vehicles", label: "Vehicles" },
                        { id: "energy", label: "Energy" }
                    ]}
                />

                {/* 3. Vehicles Bento Grid (Light Theme) */}
                {vehiclesForCarousel.length > 0 && (
                    <ProductBentoGrid
                        id="vehicles"
                        title="Vehicles"
                        items={vehiclesForCarousel}
                        darkTheme={false}
                        mobileCardWidth="w-[66vw]"
                    />
                )}

                {/* 4. Energy Bento Grid (Stark Dark Theme) */}
                {energyData.length > 0 && (
                    <ProductBentoGrid
                        id="energy"
                        title="Energy"
                        items={energyData.map((e: any) => ({
                            _id: e._id.toString(),
                            slug: e.slug,
                            name: e.name,
                            description: e.description || "Power your home with clean energy.",
                            heroImage: e.heroImage || "",
                            baseCashPrice: e.baseCashPrice,
                            category: e.category,
                        }))}
                        darkTheme={true}
                    />
                )}

                {/* 5. Final CTA Section (Light Theme) */}
                <section className="relative h-[60vh] sm:h-[80vh] w-full flex flex-col items-center justify-center bg-[#F4F4F4] overflow-hidden border-t border-black/[0.05]">
                    {/* Animated subtle background */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.02)_0%,transparent_70%)]" />

                    <div className="relative z-10 text-center px-8">
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-4xl sm:text-5xl md:text-6xl font-bold text-black tracking-tight mb-4 drop-shadow-sm"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Experience the Future
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="text-base sm:text-lg text-black/60 mb-10 max-w-lg mx-auto font-medium"
                        >
                            Premium products for a sustainable future.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <a
                                href="/invest/signup"
                                className="w-full sm:w-[220px] text-center bg-black text-white text-[11px] sm:text-xs font-bold tracking-[0.15em] uppercase px-6 py-3 rounded-full hover:bg-black/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-md"
                            >
                                Create Account
                            </a>
                            <a
                                href="/dashboard"
                                className="w-full sm:w-[220px] text-center bg-transparent border-2 border-black/70 text-black text-[11px] sm:text-xs font-bold tracking-[0.15em] uppercase px-6 py-3 rounded-full hover:bg-black/5 hover:border-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-sm backdrop-blur-sm"
                            >
                                Go to Dashboard
                            </a>
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <ShopFooter />
        </div>
    );
}
