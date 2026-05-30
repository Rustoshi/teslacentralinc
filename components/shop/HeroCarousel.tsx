"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface VehicleProduct {
    _id: string;
    slug: string;
    name: string;
    description: string;
    heroImage: string;
}

interface HeroCarouselProps {
    vehicles: VehicleProduct[];
}

export default function HeroCarousel({ vehicles }: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? "100%" : "-100%",
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? "100%" : "-100%",
            opacity: 0,
        }),
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const paginate = useCallback(
        (newDirection: number) => {
            setDirection(newDirection);
            setCurrentIndex((prevIndex) => {
                let nextIndex = prevIndex + newDirection;
                if (nextIndex >= vehicles.length) nextIndex = 0;
                if (nextIndex < 0) nextIndex = vehicles.length - 1;
                return nextIndex;
            });
        },
        [vehicles.length]
    );

    useEffect(() => {
        if (!isAutoPlaying || vehicles.length <= 1) return;

        const timer = setInterval(() => {
            paginate(1);
        }, 3000);

        return () => clearInterval(timer);
    }, [isAutoPlaying, paginate, vehicles.length]);

    if (!vehicles || vehicles.length === 0) {
        return null;
    }

    return (
        <section
            className="relative h-[70vh] w-full flex flex-col items-center justify-between overflow-hidden group bg-[#F4F4F4]"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "tween", ease: "circOut", duration: 0.7 },
                        opacity: { duration: 0.4 },
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);

                        if (swipe < -swipeConfidenceThreshold) {
                            paginate(1);
                        } else if (swipe > swipeConfidenceThreshold) {
                            paginate(-1);
                        }
                    }}
                    className="absolute inset-0 w-full h-full"
                >
                    <img
                        src={vehicles[currentIndex].heroImage}
                        alt={vehicles[currentIndex].name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] ease-out scale-105 group-hover:scale-100"
                    />

                    <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                </motion.div>
            </AnimatePresence>

            <div className="relative z-10 w-full flex flex-col items-center justify-start pt-16 sm:pt-24 pointer-events-none">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-center"
                    >
                        <h1
                            className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white tracking-tight drop-shadow-md"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif", letterSpacing: "-0.02em" }}
                        >
                            {vehicles[currentIndex].name}
                        </h1>
                        <p className="text-sm sm:text-base text-white/90 mt-2 font-medium tracking-wider drop-shadow-sm max-w-lg mx-auto px-4">
                            {vehicles[currentIndex].description || "Experience the Future."}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="absolute bottom-12 sm:bottom-16 left-0 right-0 z-10 flex flex-col items-center gap-4 w-full px-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`btn-${currentIndex}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto justify-center pointer-events-auto"
                    >
                        <Link
                            href={`/dashboard/shop/${vehicles[currentIndex].slug}`}
                            className="flex-1 text-center bg-white/95 backdrop-blur-md text-black text-xs font-bold tracking-[0.15em] uppercase px-8 py-3 rounded hover:bg-white hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-lg cursor-pointer"
                        >
                            Order Now
                        </Link>
                        <Link
                            href={`/dashboard/shop/${vehicles[currentIndex].slug}`}
                            className="flex-1 text-center bg-transparent border-2 border-white/60 text-white text-xs font-bold tracking-[0.15em] uppercase px-8 py-3 rounded hover:bg-white/10 hover:border-white hover:scale-[1.02] active:scale-95 transition-all duration-300 backdrop-blur-sm cursor-pointer"
                        >
                            Learn More
                        </Link>
                    </motion.div>
                </AnimatePresence>

                {vehicles.length > 1 && (
                    <>
                        <button
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/30 text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md hidden sm:block shadow-lg"
                            onClick={() => paginate(-1)}
                            aria-label="Previous Slide"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/30 text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md hidden sm:block shadow-lg"
                            onClick={() => paginate(1)}
                            aria-label="Next Slide"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                {vehicles.length > 1 && (
                    <div className="flex gap-2">
                        {vehicles.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setDirection(idx > currentIndex ? 1 : -1);
                                    setCurrentIndex(idx);
                                }}
                                className={`relative h-1 rounded-full flex-shrink-0 overflow-hidden transition-all duration-300 ${idx === currentIndex ? "w-16 bg-white/30" : "w-2 bg-white/50 hover:bg-white/80"
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            >
                                {idx === currentIndex && isAutoPlaying && (
                                    <motion.div
                                        key={currentIndex}
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 3, ease: "linear" }}
                                        className="absolute inset-y-0 left-0 bg-white"
                                    />
                                )}
                                {idx === currentIndex && !isAutoPlaying && (
                                    <div className="absolute inset-y-0 left-0 bg-white w-full" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
