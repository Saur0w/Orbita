"use client";

import styles from "./page.module.css";
import Footer from "@/components/Footer";
import Atmos from "@/components/Atmos";
import Features from "@/components/Features";
import Des from "@/components/Des";
import Landing from "@/components/Landing";

export default function Home() {
  return (
    <main className={styles.main}>
        <Landing />
        <Des />
        <Atmos />
        <Features />
        <Footer />
    </main>
  );
}
