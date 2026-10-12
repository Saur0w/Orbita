"use client";

import "lenis/dist/lenis.css";
import styles from "./page.module.css";
import Footer from "@/components/Footer";
import Atmos from "@/components/Atmos";
import Features from "@/components/Features";
import Des from "@/components/Des";
import Landing from "@/components/Landing";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";
import { appleEase } from "@/lib/scroll-easing";

export default function Home() {
    useEffect(() => {
        // Ensure ScrollTrigger is registered
        gsap.registerPlugin(ScrollTrigger);

        // Refined Lenis instance with custom easing & smooth physics
        const lenis = new Lenis({
            duration: 1.2, // Duration of scroll animation in seconds
            easing: appleEase, // Custom easing curve (or try easeOutQuint for a velvet glide)
            smoothWheel: true,
            wheelMultiplier: 1.0, // Multiplier for mouse wheel events
            touchMultiplier: 1.5,
            infinite: false,
            syncTouch: false, // Keep native touch momentum on mobile devices
            autoResize: true,
            anchors: true, // Smooth scroll to hash anchor targets
        });

        // Synchronize Lenis scroll position with GSAP ScrollTrigger
        lenis.on("scroll", ScrollTrigger.update);

        // Drive Lenis through GSAP ticker for 100% frame synchronization with ScrollTrigger
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
        <Landing />
        <Des />
        <Atmos />
        <Features />
        <Footer />
    </main>
  );
}
