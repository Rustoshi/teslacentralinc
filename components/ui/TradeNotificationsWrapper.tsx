"use client";

import { usePathname } from "next/navigation";
import TradeNotifications from "@/components/ui/TradeNotifications";

export default function TradeNotificationsWrapper() {
    const pathname = usePathname();
    const isHidden = pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard");

    if (isHidden) return null;

    return <TradeNotifications />;
}
