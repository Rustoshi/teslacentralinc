"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface ProductItem {
    _id: string;
    slug: string;
    name: string;
    description: string;
    heroImage: string;
    baseCashPrice?: number;
    category?: 'VEHICLE' | 'ENERGY';
}

interface ProductBentoGridProps {
    title: string;
    items: ProductItem[];
    darkTheme?: boolean;
    id?: string;
    mobileCardWidth?: string;
}

const formatPrice = (price?: number) => {
    if (!price) return null;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

export default function ProductBentoGrid({ title, items, darkTheme = false, id, mobileCardWidth = "w-[95vw]" }: ProductBentoGridProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right", e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.6;
            scrollContainerRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    if (!items || items.length === 0) return null;

    const bgClass = darkTheme ? "bg-black" : "bg-[#F4F4F4]";

    return (
        <section id={id} className={`py-20 sm:py-28 w-full mx-auto ${bgClass} transition-colors duration-700`}>
            <div className="max-w-[1920px] mx-auto px-6 sm:px-12">

                {/* Section Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mb-12"
                >
                    <h2
                        className="text-4xl sm:text-5xl font-semibold tracking-tight text-black"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif", letterSpacing: "-0.03em" }}
                    >
                        {title}
                    </h2>
                </motion.div>

                {/* Carousel Container */}
                <div className="flex items-center gap-4 sm:gap-6 overflow-hidden">
                    {/* Left Arrow - Outside on Desktop */}
                    {items.length > 1 && (
                        <button
                            onClick={(e) => scroll("left", e)}
                            className="hidden sm:flex flex-shrink-0 p-3 sm:p-4 rounded-full transition-all duration-300 backdrop-blur-md bg-white/80 border border-black/5 hover:bg-white hover:border-black/10"
                            aria-label="Previous"
                        >
                            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                        </button>
                    )}

                    {/* Carousel Wrapper */}
                    <div className="flex-1 overflow-hidden">
                        {/* Scrollable Cards */}
                        <div
                            ref={scrollContainerRef}
                            className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide pb-8"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                        {items.map((item, idx) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.1 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: idx * 0.08 }}
                                className={`flex-shrink-0 ${mobileCardWidth} sm:w-[75vw] md:w-[65vw] lg:w-[57vw] xl:w-[55vw] snap-start`}
                            >
                                <Link href={`/dashboard/shop/${item.slug}`} className="block h-full">
                                    <div className="relative h-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[21/9] rounded-2xl overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-black/20">
                                        {/* Full Container Image */}
                                        <img
                                            src={item.heroImage}
                                            alt={item.name}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        
                                        {/* Dark Gradient Overlay for Text Legibility */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                        
                                        {/* Category Badge */}
                                        {item.category && (
                                            <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
                                                <span className="px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-[11px] sm:text-[12px] font-semibold tracking-[0.15em] uppercase rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20">
                                                    {item.category}
                                                </span>
                                            </div>
                                        )}

                                        {/* Content Overlay */}
                                        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-10">
                                            {/* Mobile: Only name and button */}
                                            <div className="sm:hidden mb-3">
                                                <h3
                                                    className="text-xl font-semibold text-white leading-tight"
                                                    style={{ fontFamily: "var(--font-montserrat), sans-serif", letterSpacing: "-0.02em" }}
                                                >
                                                    {item.name}
                                                </h3>
                                            </div>

                                            {/* Tablet+: Full content */}
                                            <div className="hidden sm:block mb-4 sm:mb-6">
                                                <h3
                                                    className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-2 sm:mb-3 leading-tight"
                                                    style={{ fontFamily: "var(--font-montserrat), sans-serif", letterSpacing: "-0.02em" }}
                                                >
                                                    {item.name}
                                                </h3>
                                                <p className="text-base md:text-lg text-white/80 line-clamp-2 leading-relaxed max-w-2xl">
                                                    {item.description}
                                                </p>
                                            </div>

                                            {/* Price and CTA */}
                                            <div className="flex items-center justify-between gap-2 sm:gap-4">
                                                {item.baseCashPrice && (
                                                    <span className="text-lg sm:text-2xl md:text-3xl font-semibold text-white truncate">
                                                        {formatPrice(item.baseCashPrice)}
                                                    </span>
                                                )}
                                                <button className="px-3 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[9px] sm:text-xs md:text-sm font-bold tracking-[0.15em] uppercase rounded transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg whitespace-nowrap">
                                                    Order
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                    </div>

                    {/* Right Arrow - Outside on Desktop */}
                    {items.length > 1 && (
                        <button
                            onClick={(e) => scroll("right", e)}
                            className="hidden sm:flex flex-shrink-0 p-3 sm:p-4 rounded-full transition-all duration-300 backdrop-blur-md bg-white/80 border border-black/5 hover:bg-white hover:border-black/10"
                            aria-label="Next"
                        >
                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
