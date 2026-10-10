"use client";

import styles from "./page.module.css";
import Footer from "@/components/Footer";
import Atmos from "@/components/Atmos";
import Features from "@/components/Features";
import Des from "@/components/Des";

export default function Home() {
  return (
    <main className={styles.main}>
        <Des />
        <Atmos />
        <Features />
      <Footer />
    </main>
  );
}
