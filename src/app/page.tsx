"use client";

import styles from "./page.module.css";
import Footer from "@/components/Footer";
import Atmos from "@/components/Atmos";

export default function Home() {
  return (
    <main className={styles.main}>
        <Atmos />
      <Footer />
    </main>
  );
}
