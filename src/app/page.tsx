"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Landing from "@/components/Landing";
import Preloader from "@/components/Preloader";

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <main className={styles.page}>
            {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
            <Landing />
        </main>
    );
}