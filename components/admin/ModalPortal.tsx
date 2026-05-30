"use client";

import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ModalPortalProps {
    children: ReactNode;
}

export default function ModalPortal({ children }: ModalPortalProps) {
    const elRef = useRef<HTMLElement | null>(null);

    if (!elRef.current && typeof window !== "undefined") {
        elRef.current = document.createElement("div");
        elRef.current.className = "z-[11000] fixed inset-0";
    }

    useEffect(() => {
        const portalRoot = document.body;
        const el = elRef.current!;
        portalRoot.appendChild(el);
        return () => {
            if (portalRoot.contains(el)) {
                portalRoot.removeChild(el);
            }
        };
    }, []);

    return elRef.current ? createPortal(children, elRef.current) : null;
}
