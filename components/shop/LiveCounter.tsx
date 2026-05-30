"use client";

import { useState, useEffect, useCallback } from "react";

interface LiveCounterProps {
  initialValue: number;
  incrementMin?: number;
  incrementMax?: number;
  intervalMs?: number;
}

export default function LiveCounter({
  initialValue,
  incrementMin = 60,
  incrementMax = 120,
  intervalMs = 500,
}: LiveCounterProps) {
  const [value, setValue] = useState(initialValue);

  const formatNumber = useCallback((num: number): string => {
    return num.toLocaleString("en-US");
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const increment =
        Math.floor(Math.random() * (incrementMax - incrementMin + 1)) +
        incrementMin;
      setValue((prev) => prev + increment);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [incrementMin, incrementMax, intervalMs]);

  return <span>{formatNumber(value)}</span>;
}
