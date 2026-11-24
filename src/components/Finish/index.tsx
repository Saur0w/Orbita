"use client";

import styles from "./style.module.scss";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from 'react';
import Image from "next/image";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type FinishKey = "silver" | "gold";
type FinishDes = {
  label: string;
  description: string;
  swatch: string;
};

const FINISHES: Record<FinishKey, FinishDes> = {
  silver: {
    label: "Silver",
    description: "A brushed aluminum finish with a cool industrial character.",
    swatch: "#C9C9C9"
  },
  gold: {
    label: "Gold",
    description: "A warm anodized finish designed to complement natural interiors.",
    swatch: "#C48938"
  }
};

export default function Finish() {
  const finishRef = useRef<HTMLElement>(null);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);
  const [activeFinish, setActiveFinish] = useState<FinishKey>("silver");

  const current = FINISHES[activeFinish];

  useGSAP(() => {
    const track = marqueeTrackRef.current;
    const section = finishRef.current;
    if (!track || !section) return;

    gsap.to(track, {
      xPercent: -59,
      duration: 28,
      ease: "none",
      repeat: -1
    });

    gsap.to(track, {
      x: "-=240",
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.2
      }
    });
  }, { scope: finishRef });

  return (
    <section className={styles.finish} ref={finishRef}>
      <div className={styles.marquee}>
        <div className={styles.marqueeTrack} ref={marqueeTrackRef}>
          <span>AVAILABLE IN TWO FINISHES &nbsp;•&nbsp;</span>
          <span>AVAILABLE IN TWO FINISHES &nbsp;•&nbsp;</span>
          <span>AVAILABLE IN TWO FINISHES &nbsp;•&nbsp;</span>
          <span>AVAILABLE IN TWO FINISHES &nbsp;•&nbsp;</span>
        </div>
      </div>

      <div className={styles.stage} aria-hidden="true" />

      <div className={styles.bottomBar}>
        <div className={styles.previewCard}>
          <div className={styles.previewThumb}>
            <Image src="/images/lamp.jpg" alt="Preorder" fill /> 
          </div>
          <Link href="/preorder" className={styles.preorderBtn}>
            Pre-order now
          </Link>
        </div>

        <div className={styles.controls}>
          <div 
            className={styles.toggle} 
            data-active={activeFinish}
            role="tablist" 
            aria-label="Lamp Finish"
          >
            {(Object.keys(FINISHES) as FinishKey[]).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={activeFinish === key}
                className={`${styles.toggleBtn} ${
                  activeFinish === key ? styles.active : ""
                }`}
                onClick={() => setActiveFinish(key)}
              >
                {FINISHES[key].label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}