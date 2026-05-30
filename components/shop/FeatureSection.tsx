"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import LiveCounter from "./LiveCounter";

interface FeatureSectionProps {
    title: string;
    titleHighlight?: string;
    subtitle: string;
    stats: Array<{
        value: string;
        label: string;
    }>;
    primaryCTA: {
        text: string;
        href: string;
    };
    secondaryCTA?: {
        text: string;
        href: string;
    };
    videoSrc: string;
    videoCaption?: string;
}

export default function FeatureSection({
    title,
    titleHighlight,
    subtitle,
    stats,
    primaryCTA,
    secondaryCTA,
    videoSrc,
    videoCaption,
}: FeatureSectionProps) {
    return (
        <section className="relative w-full bg-[#F4F4F4] py-16 sm:py-24 md:py-32">
            <div className="max-w-[1920px] mx-auto px-6 sm:px-12">
                <div className="rounded-3xl bg-white shadow-[0_18px_60px_rgba(0,0,0,0.12)] px-6 sm:px-10 md:px-16 py-10 sm:py-14">
                    <div className="grid grid-cols-1 lg:grid-cols-[40%_1fr] gap-8 lg:gap-10 items-stretch">
                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex flex-col justify-center"
                        >
                            {/* Title */}
                            <h2
                                className="text-2xl sm:text-3xl lg:text-[2rem] xl:text-[2.25rem] font-bold text-black mb-3 leading-[1.15] tracking-tight"
                                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                            >
                                {title}
                                {titleHighlight && (
                                    <span className="text-blue-600 ml-2 hover:text-blue-700 transition-colors duration-200">
                                        {titleHighlight}
                                    </span>
                                )}
                            </h2>

                            {/* Subtitle */}
                            <p className="text-sm sm:text-base text-black/70 mb-6 sm:mb-8 leading-relaxed">
                                {subtitle}
                            </p>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                                {stats.map((stat, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.3 }}
                                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                                        className="flex flex-col gap-1"
                                    >
                                        <span className="text-xl sm:text-2xl lg:text-[1.75rem] font-bold text-black tracking-tight">
                                            {stat.label.toLowerCase().includes("miles") ? (
                                                <LiveCounter
                                                    initialValue={parseInt(stat.value.replace(/,/g, ""), 10)}
                                                    incrementMin={300}
                                                    incrementMax={700}
                                                    intervalMs={300}
                                                />
                                            ) : (
                                                stat.value
                                            )}
                                        </span>
                                        <span className="text-[11px] sm:text-xs text-black/60 font-medium uppercase tracking-[0.1em]">
                                            {stat.label}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* CTAs */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="flex flex-col sm:flex-row gap-4 sm:gap-6"
                            >
                                <Link
                                    href={primaryCTA.href}
                                    className="px-6 py-2.5 sm:py-3 bg-black text-white text-[11px] sm:text-xs font-bold tracking-[0.15em] uppercase rounded-full transition-all duration-300 hover:bg-black/90 hover:scale-[1.02] active:scale-95 text-center"
                                >
                                    {primaryCTA.text}
                                </Link>
                                {secondaryCTA && (
                                    <Link
                                        href={secondaryCTA.href}
                                        className="px-6 py-2.5 sm:py-3 bg-transparent border border-black/20 text-black text-[11px] sm:text-xs font-semibold tracking-[0.15em] uppercase rounded-full transition-all duration-300 hover:bg-black/5 hover:border-black/40 hover:scale-[1.02] active:scale-95 text-center"
                                    >
                                        {secondaryCTA.text}
                                    </Link>
                                )}
                            </motion.div>
                        </motion.div>

                        {/* Right Video */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative h-full flex items-center"
                        >
                            <div className="relative w-full h-full min-h-[260px] sm:min-h-[300px] lg:min-h-0 lg:aspect-[16/9] rounded-2xl overflow-hidden shadow-[0_14px_40px_rgba(0,0,0,0.15)] bg-black">
                                <video
                                    src={videoSrc}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                                {videoCaption && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 sm:px-6 py-3 sm:py-4">
                                        <p className="text-white text-xs sm:text-sm md:text-base font-medium">
                                            {videoCaption}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
