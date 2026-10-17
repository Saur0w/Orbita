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
    description:
      "Minimal touch sensor located on the base allows seamless switching between lighting modes.",
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
    description:
      "Automatic brightness adjustment depending on ambient light conditions.",
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
  const headingRef = useRef<HTMLHeadingElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = featureRef.current;
      const heading = headingRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;

      if (!section || !heading || !viewport || !track) return;

      const split = SplitText.create(heading, {
        type: "lines,words",
        linesClass: styles.lineMask,
      });

      gsap.from(split.words, {
        yPercent: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.03,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
        },
      });

      const getScrollAmount = () => {
        return -(track.scrollWidth - viewport.clientWidth);
      };

      gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "bottom bottom", 
          end: () => `+=${track.scrollWidth - viewport.clientWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        split.revert();
      };
    },
    { scope: featureRef }
  );

  return (
    <section className={styles.features} ref={featureRef}>
      <div className={styles.heading}>
        <span className={styles.subHeading}>(Smart Features)</span>
        <div className={styles.headingWrapper}>
          <h2 className={styles.mainHeading} ref={headingRef}>
            Orbita integrates modern technology with intuitive controls
          </h2>
        </div>
      </div>

      <div className={styles.cardsViewport} ref={viewportRef}>
        <div className={styles.cardsTrack} ref={trackRef}>
          {cards.map((card) => (
            <article key={card.id} className={styles.card}>
              <div className={styles.imageFrame}>
                <Image
                  src={card.src}
                  alt={card.title}
                  fill
                  className={styles.cardImage}
                />
              </div>
              <div className={styles.cardInfo}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDescription}>{card.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}