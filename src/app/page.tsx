"use client";

import "lenis/dist/lenis.css";
import styles from "./page.module.css";
import Footer from "@/components/Footer";
import Atmos from "@/components/Atmos";
import Features from "@/components/Features";
import Des from "@/components/Des";
import Landing from "@/components/Landing";
import Header from "@/components/Header";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";
import Preloader from "@/components/Preloader";
import Upscale from "@/components/Upscale";
import Swtich from "@/components/Switch";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {

        const lenis = new Lenis({
            lerp: 0.1,
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 1.0,
            syncTouch: false,
            autoResize: true
        });

        lenis.on("scroll", ScrollTrigger.update);

        const updateTicker = (time: number) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(updateTicker);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(updateTicker);
            lenis.destroy();
        };
    }, []);
  return (
    <main className={styles.main}>
        <Preloader onComplete={() => setIsReady(true)} />
        <Header isReady={isReady} />
        <Landing />
        <Des />
        <Atmos />
        <Features />
        <Upscale />
        <Swtich />
        <Footer />
    </main>
  );
}
