"use client";

import styles from "./style.module.scss";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP);
  CustomEase.create("luxuryMask", "0.16, 1, 0.3, 1");
}

type FinishKey = "silver" | "gold";

type FinishDes = {
  label: string;
  description: string;
  swatch: string;
  image: string;
  alt: string;
};

const FINISH_KEYS: FinishKey[] = ["silver", "gold"];

const FINISH_META: Record<FinishKey, { swatch: string; image: string }> = {
  silver: {
    swatch: "#C9C9C9",
    image: "/images/silver.png",
  },
  gold: {
    swatch: "#C48938",
    image: "/images/gold.png",
  },
};

export default function Finish() {
  const t = useTranslations("Finish");
  const locale = useLocale();

  const finishes: Record<FinishKey, FinishDes> = {
    silver: {
      label: t("finishes.silver.title"),
      description: t("finishes.silver.description"),
      alt: t("finishes.silver.alt"),
      ...FINISH_META.silver,
    },
    gold: {
      label: t("finishes.gold.title"),
      description: t("finishes.gold.description"),
      alt: t("finishes.gold.alt"),
      ...FINISH_META.gold,
    },
  };

  const marqueeText = t("marquee");
  const finishRef = useRef<HTMLElement>(null);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);
  const stageLayersRef = useRef<(HTMLDivElement | null)[]>([]);
  const swatchDotRef = useRef<HTMLSpanElement>(null);
  const infoTextRefs = useRef<(HTMLDivElement | null)[]>([]);
  const infoTitleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const infoDescRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const titleSplitsRef = useRef<SplitText[]>([]);
  const descSplitsRef = useRef<SplitText[]>([]);
  const prevFinishRef = useRef<FinishKey>("silver");

  const [activeFinish, setActiveFinish] = useState<FinishKey>("silver");

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

    let isCancelled = false;

    const initSplits = () => {
      if (isCancelled) return;

      titleSplitsRef.current.forEach((s) => s.revert());
      descSplitsRef.current.forEach((s) => s.revert());

      const nextTitleSplits: SplitText[] = [];
      const nextDescSplits: SplitText[] = [];

      FINISH_KEYS.forEach((key, idx) => {
        const titleEl = infoTitleRefs.current[idx];
        const descEl = infoDescRefs.current[idx];
        const isCurrent = key === prevFinishRef.current;

        if (titleEl) {
          const split = new SplitText(titleEl, {
            type: "lines",
            mask: "lines",
            linesClass: `${styles.splitLine} splitLine`,
          });
          gsap.set(split.lines, {
            yPercent: isCurrent ? 0 : 115,
            opacity: isCurrent ? 1 : 0,
          });
          nextTitleSplits.push(split);
        }

        if (descEl) {
          const split = new SplitText(descEl, {
            type: "lines",
            mask: "lines",
            linesClass: `${styles.splitLine} splitLine`,
          });
          gsap.set(split.lines, {
            yPercent: isCurrent ? 0 : 115,
            opacity: isCurrent ? 1 : 0,
          });
          nextDescSplits.push(split);
        }
      });

      titleSplitsRef.current = nextTitleSplits;
      descSplitsRef.current = nextDescSplits;

      const textEls = infoTextRefs.current.filter(Boolean) as HTMLDivElement[];
      if (textEls.length) {
        gsap.set(textEls, { opacity: 1 });
      }
    };

    if (typeof document !== "undefined" && document.fonts && document.fonts.status !== "loaded") {
      document.fonts.ready.then(initSplits);
    } else {
      initSplits();
    }

    return () => {
      isCancelled = true;
      gsap.killTweensOf(stageLayersRef.current.filter(Boolean));
      if (swatchDotRef.current) gsap.killTweensOf(swatchDotRef.current);
      titleSplitsRef.current.forEach((s) => s.revert());
      descSplitsRef.current.forEach((s) => s.revert());
      titleSplitsRef.current = [];
      descSplitsRef.current = [];
    };
  }, { scope: finishRef, dependencies: [locale], revertOnUpdate: true });

  useEffect(() => {
    const prevKey = prevFinishRef.current;
    if (prevKey === activeFinish) return;
    prevFinishRef.current = activeFinish;

    const prevIndex = FINISH_KEYS.indexOf(prevKey);
    const nextIndex = FINISH_KEYS.indexOf(activeFinish);
    const isForward = nextIndex > prevIndex;

    // image layer morph 
    const prevLayer = stageLayersRef.current[prevIndex];
    const nextLayer = stageLayersRef.current[nextIndex];
    if (prevLayer && nextLayer) {
      gsap.killTweensOf([prevLayer, nextLayer]);
      const nextAlpha = Number(gsap.getProperty(nextLayer, "opacity")) || 0;

      if (nextAlpha >= 0.99) {
        gsap.set(nextLayer, { zIndex: 1, opacity: 1 });
        gsap.set(prevLayer, { zIndex: 2 });
        gsap.to(prevLayer, {
          opacity: 0,
          duration: 0.72,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.set(prevLayer, { zIndex: 0 });
          },
        });
      } else {
        gsap.set(prevLayer, { zIndex: 1, opacity: 1 });
        gsap.set(nextLayer, { zIndex: 2 });
        gsap.fromTo(
          nextLayer,
          { opacity: nextAlpha },
          {
            opacity: 1,
            duration: 0.78,
            ease: "power2.inOut",
            onComplete: () => {
              gsap.set(prevLayer, { opacity: 0, zIndex: 0 });
            },
          }
        );
      }
    }

    // swatch color morph
    if (swatchDotRef.current) {
      gsap.killTweensOf(swatchDotRef.current);
      gsap.to(swatchDotRef.current, {
        backgroundColor: FINISH_META[activeFinish].swatch,
        duration: 0.65,
        ease: "power2.out",
      });
      gsap.fromTo(
        swatchDotRef.current,
        { scale: 0.86 },
        { scale: 1, duration: 0.55, ease: "power3.out" }
      );
    }

    // SplitText line 
    const outY = isForward ? -115 : 115;
    const inY = isForward ? 115 : -115;

    titleSplitsRef.current.forEach((s) => s?.lines && gsap.killTweensOf(s.lines));
    descSplitsRef.current.forEach((s) => s?.lines && gsap.killTweensOf(s.lines));

    const prevTitle = titleSplitsRef.current[prevIndex];
    const prevDesc = descSplitsRef.current[prevIndex];
    const nextTitle = titleSplitsRef.current[nextIndex];
    const nextDesc = descSplitsRef.current[nextIndex];

    if (prevTitle?.lines?.length) {
      gsap.to(prevTitle.lines, {
        yPercent: outY,
        opacity: 0,
        duration: 0.34,
        stagger: 0.04,
        ease: "power2.in",
      });
    }
    if (prevDesc?.lines?.length) {
      gsap.to(prevDesc.lines, {
        yPercent: outY,
        opacity: 0,
        duration: 0.32,
        stagger: 0.03,
        ease: "power2.in",
      });
    }

    if (nextTitle?.lines?.length) {
      gsap.fromTo(
        nextTitle.lines,
        { yPercent: inY, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.68,
          stagger: 0.05,
          ease: "luxuryMask",
          delay: 0.14,
        }
      );
    }
    if (nextDesc?.lines?.length) {
      gsap.fromTo(
        nextDesc.lines,
        { yPercent: inY, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.045,
          ease: "luxuryMask",
          delay: 0.2,
        }
      );
    }
  }, [activeFinish]);

  return (
    <section className={styles.finish} ref={finishRef}>
      <div className={styles.marquee}>
        <div className={styles.marqueeTrack} ref={marqueeTrackRef} key={locale}>
          <span>{marqueeText} &nbsp;•&nbsp;</span>
          <span>{marqueeText} &nbsp;•&nbsp;</span>
          <span>{marqueeText} &nbsp;•&nbsp;</span>
          <span>{marqueeText} &nbsp;•&nbsp;</span>
        </div>
      </div>

      <div className={styles.stage}>
        {FINISH_KEYS.map((key, idx) => {
          const item = finishes[key];
          const isActive = activeFinish === key;
          return (
            <div
              key={key}
              ref={(el) => {
                stageLayersRef.current[idx] = el;
              }}
              className={styles.stageLayer}
              aria-hidden={!isActive}
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="100vw"
                loading="eager"
                className={styles.stageImage}
              />
            </div>
          );
        })}
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.previewCard}>
          <div className={styles.previewThumb}>
            <Image src="/images/lamp.jpg" alt={t("previewAlt")} fill /> 
          </div>
          <Link href="/preorder" className={styles.preorderBtn}>
            {t("preorderCta")}
          </Link>
        </div>

        <div className={styles.controls}>
          <div 
            className={styles.toggle} 
            data-active={activeFinish}
            role="tablist" 
            aria-label="Lamp Finish"
          >
            {FINISH_KEYS.map((key) => (
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
                {finishes[key].label}
              </button>
            ))}
          </div>
          <div className={styles.infoCard}>
            <div className={styles.swatchRing} aria-hidden="true">
              <span
                ref={swatchDotRef}
                className={styles.swatchDot}
              />
            </div>

            <div className={styles.infoTextTrack} key={locale}>
              {FINISH_KEYS.map((key, idx) => {
                const item = finishes[key];
                const isActive = activeFinish === key;
                return (
                  <div
                    key={key}
                    ref={(el) => {
                      infoTextRefs.current[idx] = el;
                    }}
                    className={`${styles.infoText} ${
                      isActive ? styles.infoTextActive : ""
                    }`}
                    aria-hidden={!isActive}
                  >
                    <h3
                      className={styles.infoTitle}
                      ref={(el) => {
                        infoTitleRefs.current[idx] = el;
                      }}
                    >
                      {item.label}
                    </h3>
                    <p
                      className={styles.infoDesc}
                      ref={(el) => {
                        infoDescRefs.current[idx] = el;
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}