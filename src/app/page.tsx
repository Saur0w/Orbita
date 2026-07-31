"use client";

import styles from "./page.module.css";
import Landing from "@/components/Landing";
import Des from "@/components/Des";
import Header from "@/components/Header";

export default function Home() {

    return (
        <main className={styles.page}>
            <Header />
            <Landing />
            <Des />
        </main>
    );
}