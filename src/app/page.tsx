"use client";

import styles from "./page.module.css";
import Footer from "@/components/Footer";
import Atmos from "@/components/Atmos";
import Features from "@/components/Features";

export default function Home() {
  return (
    <main className={styles.main}>
        <Atmos />
        <Features />
      <Footer />
    </main>
  );
}
