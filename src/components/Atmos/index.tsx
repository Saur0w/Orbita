"use client";

import styles from "./style.module.scss";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import Image from "next/image";
import { SplitText } from "gsap/SplitText";
import { AmbientIcon, FocusIcon, NightIcon, HaloIcon } from "@/lib/icons";
import type { ComponentType, SVGProps } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

interface AtmosphereItem {
  id: number;
  src: string;
  alt: string;
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const atmospheres: AtmosphereItem[] = [
  {
    id: 1,
    src: "/images/ambient.jpg",
    alt: "Modern circular desk lamp casting soft, warm indirect ambient illumination across a bedroom setup",
    title: "Ambient Mode",
    description: "Soft indirect illumination that creates a calm, relaxing atmosphere.",
    icon: AmbientIcon,
  },
  {
    id: 2,
    src: "/images/focus.jpg",
    alt: "Focused downward task lighting from a table lamp illuminating a desk workspace and camera equipment",
    title: "Focus Mode",
    description: "Directed lighting for reading, working, and everyday productivity.",
    icon: FocusIcon,
  },
  {
    id: 3,
    src: "/images/night.jpg",
    alt: "Low-glare warm night lighting from a minimalist lamp creating a dim, relaxed atmosphere in a dark room",
    title: "Night Mode",
    description: "Warm, low-intensity light designed for evening environments.",
    icon: NightIcon,
  },
  {
    id: 4,
    src: "/images/halo.jpg",
    alt: "Diffuse accent lighting from a circular lamp casting a soft perimeter halo glow onto the surface",
    title: "Halo Mode",
    description: "A subtle glowing ring that transforms the lamp into an atmospheric design object.",
    icon: HaloIcon,
  },
];

export default function Atmos() {
  const atmosRef = useRef<HTMLElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const titlesRef = useRef<(HTMLHeadingElement | null)[]>([]);
  const descsRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const iconsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const slides = slidesRef.current;
      if (slides.length <= 1) return;

      const titleSplits: SplitText[] = [];
      const descSplits: SplitText[] = [];

      atmospheres.forEach((_, i) => {
        const titleEl = titlesRef.current[i];
        const descEl = descsRef.current[i];

        if (titleEl) {
          const split = new SplitText(titleEl, {
            type: "lines",
            mask: "lines",
            linesClass: styles.splitLine,
          });
          titleSplits.push(split);
        }

        if (descEl) {
          const split = new SplitText(descEl, {
            type: "lines",
            mask: "lines",
            linesClass: styles.splitLine,
          });
          descSplits.push(split);
        }
      });

      for (let i = 1; i < atmospheres.length; i++) {
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
        atmospheres.forEach((_, i) => {
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

      return () => {
        titleSplits.forEach((s) => s.revert());
        descSplits.forEach((s) => s.revert());
      };
    },
    { scope: atmosRef }
  );

  return (
    <section className={styles.atmos} ref={atmosRef}>
      <div className={styles.header}>
        <span className={styles.tag}>(Key Features)</span>
        <h1 className={styles.title}>
          <span>ONE LAMP</span>
          <span className={styles.fourRow}>
            FOUR<sup className={styles.sup}>(4)</sup>
          </span>
          <span>ATMOSPHERES</span>
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

            <div className={styles.textTrack}>
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