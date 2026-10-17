"use client";

import styles from "./style.module.scss";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import Image from "next/image";

gsap.registerPlugin(SplitText, ScrollTrigger, useGSAP);

export interface CardData {
  id: number;
  title: string;
  description: string;
  src: string;
}

export const cards: CardData[] = [
  {
    id: 1,
    title: "1. Touch Control",
    description: "Minimal touch sensor located on the base allows seamless switching between lighting modes.",
    src: "/images/cards/touch.png",
  },
  {
    id: 2,
    title: "2. Smart Connectivity",
    description: "Compatible with smart home systems via Bluetooth.",
    src: "/images/cards/smart.jpg",
  },
  {
    id: 3,
    title: "3. Adaptive Brightness",
    description: "Automatic brightness adjustment depending on ambient light conditions.",
    src: "/images/cards/adaptive.png",
  },
  {
    id: 4,
    title: "4. Battery Powered",
    description: "Portable use with long-lasting rechargeable battery.",
    src: "/images/cards/battery.png",
  },
];


export default function Features() {
    const featureRef = useRef<HTMLElement>(null);

    return (
        <section className={styles.features} ref={featureRef}>
            <div className={styles.heading}>
                <span className={styles.subHeading}>(Smart Features)</span>
                <div className={styles.headingWrapper}>
                    <h2 className={styles.mainHeading}>
                        Orbita integrates modern technology with intuitive controls
                    </h2>
                </div>
            </div>

            <div className={styles.cardsViewport}>
              
            </div>
        </section>
    )
}