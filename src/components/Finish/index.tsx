"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./style.module.scss";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const silver = "/images/silver.png";
const gold = "/images/gold.png";

type FinishType = "silver" | "gold";

const SWATCH_COLORS: Record<FinishType, string> = {
  silver: "#C9C9C9",
  gold: "#C8943F",
};

export default function Finish() {
  const t = useTranslations("Finish");
  const locale = useLocale();

  const [activeFinish, setActiveFinish] = useState<FinishType>("silver");
  const [previousFinish, setPreviousFinish] = useState<FinishType | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);
  const marqueeTrackRef = useRef<HTMLDivElement | null>(null);

  const content = {
    title: t(`finishes.${activeFinish}.title`),
    description: t(`finishes.${activeFinish}.description`),
    swatchColor: SWATCH_COLORS[activeFinish],
  };

  const handleSelectFinish = (next: FinishType) => {
    if (next === activeFinish) return;
    setPreviousFinish(activeFinish);
    setActiveFinish(next);
  };

  useEffect(() => {
    if (!previousFinish) return;
    const timer = setTimeout(() => {
      setPreviousFinish(null);
    }, 600);
    return () => clearTimeout(timer);
  }, [activeFinish, previousFinish]);

  useGSAP(
      () => {
        const track = marqueeTrackRef.current;
        const section = sectionRef.current;
        if (!track || !section) return;

        const driftTween = gsap.to(track, {
          xPercent: -50,
          duration: 32,
          ease: "none",
          repeat: -1,
        });

        const scrubTween = gsap.to(track, {
          x: "-=280",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });

        return () => {
          driftTween.kill();
          scrubTween.kill();
        };
      },
      { scope: sectionRef, dependencies: [locale], revertOnUpdate: true }
  );

  const marqueeText = t("marquee");

  return (
      <section ref={sectionRef} className={styles.finish}>
        <div className={styles.marqueeWrapper}>
          <div ref={marqueeTrackRef} className={styles.marqueeTrack}>
            <span>{marqueeText} &nbsp;•&nbsp;</span>
            <span>{marqueeText} &nbsp;•&nbsp;</span>
            <span>{marqueeText} &nbsp;•&nbsp;</span>
            <span>{marqueeText} &nbsp;•&nbsp;</span>
          </div>
        </div>

        <div className={styles.bg}>
          <div
              className={`${styles.imageLayer} ${
                  activeFinish === "silver"
                      ? styles.active
                      : previousFinish === "silver"
                          ? styles.underneath
                          : ""
              }`}
          >
            <Image
                src={silver}
                alt={t("finishes.silver.alt")}
                fill
                priority
                className={styles.lampImage}
            />
          </div>

          <div
              className={`${styles.imageLayer} ${
                  activeFinish === "gold"
                      ? styles.active
                      : previousFinish === "gold"
                          ? styles.underneath
                          : ""
              }`}
          >
            <Image
                src={gold}
                alt={t("finishes.gold.alt")}
                fill
                priority
                className={styles.lampImage}
            />
          </div>
        </div>

        <div className={styles.desktopPreviewCard}>
          <div className={styles.cardThumbWrapper}>
            <Image
                src="/images/lamp.jpg"
                alt={t("previewAlt")}
                fill
            />
          </div>
          <Link href="/preorder" className={styles.desktopPreorderBtn}>
            {t("preorderCta")}
          </Link>
        </div>

        <div className={styles.controls}>
          <div className={styles.toggle} role="tablist">
            <button
                type="button"
                role="tab"
                aria-selected={activeFinish === "silver"}
                className={`${styles.toggleBtn} ${
                    activeFinish === "silver" ? styles.active : ""
                }`}
                onClick={() => handleSelectFinish("silver")}
            >
              {t("finishes.silver.title")}
            </button>
            <button
                type="button"
                role="tab"
                aria-selected={activeFinish === "gold"}
                className={`${styles.toggleBtn} ${
                    activeFinish === "gold" ? styles.active : ""
                }`}
                onClick={() => handleSelectFinish("gold")}
            >
              {t("finishes.gold.title")}
            </button>
          </div>

          <div className={styles.card}>
            <div className={styles.swatchRing}>
            <span
                className={styles.swatchDot}
                style={{ backgroundColor: content.swatchColor }}
            />
            </div>

            <div key={activeFinish} className={styles.textBlock}>
              <h3 className={styles.title}>{content.title}</h3>
              <p className={styles.description}>{content.description}</p>
            </div>
          </div>

          <div className={styles.mobilePreorderBar}>
            <Link href="/preorder" className={styles.mobilePreorderBtn}>
              {t("preorderCta")}
            </Link>
            <div className={styles.mobilePreorderThumb}>
              <Image
                  src="/images/lamp.jpg"
                  alt={t("previewAlt")}
                  fill
              />
            </div>
          </div>
        </div>
      </section>
  );
}