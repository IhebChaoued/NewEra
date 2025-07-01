import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useCompanyAuthStore } from "../store/companyAuthStore";

export default function App({ Component, pageProps }: AppProps) {
  const loadStoredAuth = useCompanyAuthStore((state) => state.loadStoredAuth);

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  return <Component {...pageProps} />;
}
