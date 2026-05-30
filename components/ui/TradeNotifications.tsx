"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, ArrowDownLeft, Wallet } from "lucide-react";
import { tradeNames, countries, actionTypes } from "@/lib/trade-names";

export default function TradeNotifications() {
    const [notifications, setNotifications] = useState<Array<{
        id: number;
        name: string;
        country: string;
        action: string;
        amount: number;
    }>>([]);

    // Generate random notification
    const generateNotification = () => {
        const name = tradeNames[Math.floor(Math.random() * tradeNames.length)];
        const country = countries[Math.floor(Math.random() * countries.length)];
        const action = actionTypes[Math.floor(Math.random() * actionTypes.length)];
        const amount = Math.floor(Math.random() * (923102 - 649 + 1)) + 649;

        return {
            id: Date.now(),
            name,
            country,
            action,
            amount,
        };
    };

    // Add notifications at random intervals
    useEffect(() => {
        const addNotification = () => {
            const newNotification = generateNotification();
            setNotifications(prev => [...prev, newNotification]);

            // Remove after 5 seconds (minimum duration)
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
            }, 5000);
        };

        // Initial notification
        addNotification();

        // Random interval between 10-20 seconds
        const scheduleNext = () => {
            const delay = Math.random() * 10000 + 10000; // 10000-20000ms
            const timeoutId = setTimeout(() => {
                addNotification();
                scheduleNext();
            }, delay);
            return timeoutId;
        };

        const timeoutId = scheduleNext();

        return () => clearTimeout(timeoutId);
    }, []);

    // Dismiss a single notification
    const dismissNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    // Get icon based on action
    const getIcon = (action: string) => {
        switch (action) {
            case "traded":
                return TrendingUp;
            case "withdrew":
                return ArrowDownLeft;
            case "profited":
                return Wallet;
            default:
                return TrendingUp;
        }
    };

    // Get color based on action
    const getColor = (action: string) => {
        switch (action) {
            case "traded":
                return "text-cyan-400";
            case "withdrew":
                return "text-red-400";
            case "profited":
                return "text-green-400";
            default:
                return "text-cyan-400";
        }
    };

    return (
        <div className="fixed bottom-24 left-4 z-[100] w-72 sm:w-80">
            {/* Notifications Container */}
            <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                    {notifications.slice(0, 3).map((notification) => {
                        const Icon = getIcon(notification.action);
                        const color = getColor(notification.action);

                        return (
                            <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, x: -50, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 50, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-2xl relative"
                            >
                                {/* Dismiss Button on the notification */}
                                <button
                                    onClick={() => dismissNotification(notification.id)}
                                    className="absolute top-2 right-2 p-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                                    title="Dismiss"
                                >
                                    <X className="w-3 h-3" />
                                </button>

                                <div className="flex items-start gap-3 pr-6">
                                    <div className={`w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 ${color}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs sm:text-[11px] text-white font-medium leading-snug">
                                            <span className="font-bold text-white/90">{notification.name}</span>
                                            <span className="text-white/50"> from </span>
                                            <span className="text-white/70">{notification.country}</span>
                                        </p>
                                        <p className="text-[10px] sm:text-[11px] text-white/60 mt-1">
                                            just <span className={`font-bold ${color}`}>{notification.action}</span>
                                        </p>
                                        <p className="text-xs sm:text-sm font-bold text-white mt-1">
                                            ${notification.amount.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
