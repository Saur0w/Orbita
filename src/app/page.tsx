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
import { useEffect } from "react";
import { appleEase } from "@/lib/scroll-easing";
import Head from "next/head";
import Preloader from "@/components/Preloader";
import Upscale from "@/components/Upscale";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
    useEffect(() => {

        const lenis = new Lenis({
            duration: 1.2, 
            easing: appleEase,
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 1.5,
            infinite: false,
            syncTouch: false,
            autoResize: true,
            anchors: true, 
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
        <Preloader />
        <Header />
        <Landing />
        <Des />
        <Atmos />
        <Features />
        <Upscale />
        <Footer />
    </main>
  );
}
