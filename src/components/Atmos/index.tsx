"use client";

import styles from "./style.module.scss";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import Image from "next/image";
import { SplitText } from "gsap/SplitText";
import { useLocale, useTranslations } from "next-intl";
import { AmbientIcon, FocusIcon, NightIcon, HaloIcon } from "@/lib/icons";
import type { ComponentType, SVGProps } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

type AtmosphereKey = "ambient" | "focus" | "night" | "halo";

interface AtmosphereConfig {
  id: number;
  key: AtmosphereKey;
  src: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const ATMOSPHERE_CONFIG: AtmosphereConfig[] = [
  {
    id: 1,
    key: "ambient",
    src: "/images/ambient.jpg",
    icon: AmbientIcon,
  },
  {
    id: 2,
    key: "focus",
    src: "/images/focus.jpg",
    icon: FocusIcon,
  },
  {
    id: 3,
    key: "night",
    src: "/images/night.jpg",
    icon: NightIcon,
  },
  {
    id: 4,
    key: "halo",
    src: "/images/halo.jpg",
    icon: HaloIcon,
  },
];

export default function Atmos() {
  const t = useTranslations("Atmos");
  const locale = useLocale();

  const atmospheres = ATMOSPHERE_CONFIG.map((item) => ({
    ...item,
    title: t(`modes.${item.key}.title`),
    description: t(`modes.${item.key}.description`),
    alt: t(`modes.${item.key}.alt`),
  }));

  const atmosRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const titlesRef = useRef<(HTMLHeadingElement | null)[]>([]);
  const descsRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const iconsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
      () => {
        // Split Line Mask Reveal
        let headerTitleSplit: SplitText | null = null;
        if (titleRef.current) {
          headerTitleSplit = new SplitText(titleRef.current, {
            type: "lines",
            mask: "lines",
            linesClass: `${styles.splitLine} splitLine`,
          });

          gsap.from(headerTitleSplit.lines, {
            yPercent: 120,
            duration: 1.15,
            stagger: 0.12,
            ease: "power4.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          });
        }

        if (tagRef.current) {
          gsap.from(tagRef.current, {
            y: 24,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          });
        }

        const slides = slidesRef.current;
        if (slides.length <= 1) return;

        const titleSplits: SplitText[] = [];
        const descSplits: SplitText[] = [];

        ATMOSPHERE_CONFIG.forEach((_, i) => {
          const titleEl = titlesRef.current[i];
          const descEl = descsRef.current[i];

          if (titleEl) {
            const split = new SplitText(titleEl, {
              type: "lines",
              mask: "lines",
              linesClass: `${styles.splitLine} splitLine`,
            });
            titleSplits.push(split);
          }

          if (descEl) {
            const split = new SplitText(descEl, {
              type: "lines",
              mask: "lines",
              linesClass: `${styles.splitLine} splitLine`,
            });
            descSplits.push(split);
          }
        });

        for (let i = 1; i < ATMOSPHERE_CONFIG.length; i++) {
          if (titleSplits[i]?.lines) {
            gsap.set(titleSplits[i].lines, { yPercent: 100, opacity: 0 });
          }
          if (descSplits[i]?.lines) {
            gsap.set(descSplits[i].lines, { yPercent: 100, opacity: 0 });
          }
          if (iconsRef.current[i]) {
            gsap.set(iconsRef.current[i], { yPercent: 100, opacity: 0 });
          }
        }

        if (titleSplits[0]?.lines) {
          gsap.set(titleSplits[0].lines, { yPercent: 0, opacity: 1 });
        }
        if (descSplits[0]?.lines) {
          gsap.set(descSplits[0].lines, { yPercent: 0, opacity: 1 });
        }
        if (iconsRef.current[0]) {
          gsap.set(iconsRef.current[0], { yPercent: 0, opacity: 1 });
        }

        let currentIndex = 0;

        const goToAtmosphere = (nextIndex: number) => {
          if (nextIndex === currentIndex) return;
          const isForward = nextIndex > currentIndex;
          const prevIndex = currentIndex;
          currentIndex = nextIndex;

          iconsRef.current.forEach((icon) => icon && gsap.killTweensOf(icon));
          titleSplits.forEach((s) => s?.lines && gsap.killTweensOf(s.lines));
          descSplits.forEach((s) => s?.lines && gsap.killTweensOf(s.lines));
          ATMOSPHERE_CONFIG.forEach((_, i) => {
            if (i !== prevIndex && i !== nextIndex) {
              if (iconsRef.current[i]) gsap.set(iconsRef.current[i], { opacity: 0 });
              if (titleSplits[i]?.lines) gsap.set(titleSplits[i].lines, { opacity: 0 });
              if (descSplits[i]?.lines) gsap.set(descSplits[i].lines, { opacity: 0 });
            }
          });

          const outY = isForward ? -100 : 100;
          const inY = isForward ? 100 : -100;

          if (iconsRef.current[prevIndex]) {
            gsap.to(iconsRef.current[prevIndex], {
              yPercent: outY,
              opacity: 0,
              duration: 0.35,
              ease: "power2.in",
            });
          }

          if (titleSplits[prevIndex]?.lines?.length) {
            gsap.to(titleSplits[prevIndex].lines, {
              yPercent: outY,
              opacity: 0,
              duration: 0.35,
              ease: "power2.in",
            });
          }
          if (descSplits[prevIndex]?.lines?.length) {
            gsap.to(descSplits[prevIndex].lines, {
              yPercent: outY,
              opacity: 0,
              duration: 0.35,
              ease: "power2.in",
            });
          }

          if (iconsRef.current[nextIndex]) {
            gsap.fromTo(
                iconsRef.current[nextIndex],
                { yPercent: inY, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.12 }
            );
          }

          if (titleSplits[nextIndex]?.lines?.length) {
            gsap.fromTo(
                titleSplits[nextIndex].lines,
                { yPercent: inY, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 0.55, ease: "power2.out", delay: 0.15 }
            );
          }
          if (descSplits[nextIndex]?.lines?.length) {
            gsap.fromTo(
                descSplits[nextIndex].lines,
                { yPercent: inY, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 0.55, ease: "power2.out", delay: 0.15 }
            );
          }
        };

        const incomingSlides = slides.slice(1);
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinWrapperRef.current,
            start: "top top",
            end: `+=${incomingSlides.length * 100}%`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              const isDown = self.direction > 0;
              let targetIdx = currentIndex;

              if (isDown) {
                if (p >= 0.72) targetIdx = 3;
                else if (p >= 0.39) targetIdx = 2;
                else if (p >= 0.07) targetIdx = 1;
                else targetIdx = 0;
              } else {
                if (p < 0.05) targetIdx = 0;
                else if (p < 0.36) targetIdx = 1;
                else if (p < 0.69) targetIdx = 2;
                else targetIdx = 3;
              }

              goToAtmosphere(targetIdx);
            },
          },
        });

        incomingSlides.forEach((slide, idx) => {
          tl.fromTo(
              slide,
              { clipPath: "inset(100% 0% 0% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration: 1 },
              idx
          );
        });

        ScrollTrigger.sort();
        ScrollTrigger.refresh();

        return () => {
          headerTitleSplit?.revert();
          titleSplits.forEach((s) => s.revert());
          descSplits.forEach((s) => s.revert());
        };
      },
      { scope: atmosRef, dependencies: [locale], revertOnUpdate: true }
  );

  return (
      <section className={styles.atmos} ref={atmosRef}>
        <div className={styles.header} ref={headerRef}>
        <span className={styles.tag} ref={tagRef}>
          {t("tag")}
        </span>
          <h1 className={styles.title} ref={titleRef} key={locale}>
            <span>{t("titleLine1")}</span>
            <span className={styles.fourRow}>
            {t("titleLine2")}
              <sup className={styles.sup}>(4)</sup>
          </span>
            <span>{t("titleLine3")}</span>
          </h1>
        </div>

        <div className={styles.pinWrapper} ref={pinWrapperRef}>
          <div className={styles.stage}>
            <div className={styles.slidesTrack}>
              {atmospheres.map((item, i) => (
                  <div
                      key={item.id}
                      ref={(el) => {
                        slidesRef.current[i] = el;
                      }}
                      className={styles.slide}
                      style={{ zIndex: i + 1 }}
                  >
                    <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        priority={i === 0}
                        unoptimized
                    />
                  </div>
              ))}
            </div>

            <div className={styles.card}>
              <div className={styles.iconBadge}>
                {atmospheres.map((item, i) => {
                  const Icon = item.icon;
                  return (
                      <div
                          key={item.id}
                          ref={(el) => {
                            iconsRef.current[i] = el;
                          }}
                          className={styles.iconSlot}
                      >
                        <Icon />
                      </div>
                  );
                })}
              </div>

              <div className={styles.textTrack} key={locale}>
                {atmospheres.map((item, i) => (
                    <div key={item.id} className={styles.textItem}>
                      <h3
                          className={styles.cardTitle}
                          ref={(el) => {
                            titlesRef.current[i] = el;
                          }}
                      >
                        {item.title}
                      </h3>
                      <p
                          className={styles.cardDesc}
                          ref={(el) => {
                            descsRef.current[i] = el;
                          }}
                      >
                        {item.description}
                      </p>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}