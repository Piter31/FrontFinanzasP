"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "finanzasp:show-charts";

export function useShowCharts(): {
  showCharts: boolean;
  setShowCharts: (value: boolean) => void;
} {
  // Se inicia en true para evitar parpadeos/hydration mismatch;
  // el valor guardado se lee al montar.
  const [showCharts, setShowChartsState] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        setShowChartsState(saved === "true");
      }
    } catch {
      // sin almacenamiento: se mantiene el valor por defecto
    }
  }, []);

  const setShowCharts = (value: boolean) => {
    setShowChartsState(value);
    try {
      localStorage.setItem(STORAGE_KEY, value ? "true" : "false");
    } catch {
      // sin almacenamiento: la preferencia solo vive en esta sesión
    }
  };

  return { showCharts, setShowCharts };
}
