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
  const cardRef = useRef<HTMLDivElement>(null);
  const cardItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const titlesRef = useRef<(HTMLHeadingElement | null)[]>([]);
  const descsRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const iconsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const slides = slidesRef.current;
      const cardItems = cardItemsRef.current;
      if (slides.length <= 1 || cardItems.length <= 1) return;

      const titleSplits: SplitText[] = [];
      const descSplits: SplitText[] = [];

      // Create SplitText line masks for each card item
      cardItems.forEach((_, i) => {
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

      // Initial states for items > 0
      for (let i = 1; i < cardItems.length; i++) {
        const item = cardItems[i];
        if (item) {
          gsap.set(item, { clipPath: "inset(100% 0% 0% 0%)" });
        }
        if (titleSplits[i]?.lines) {
          gsap.set(titleSplits[i].lines, { yPercent: 100, opacity: 0 });
        }
        if (descSplits[i]?.lines) {
          gsap.set(descSplits[i].lines, { yPercent: 100, opacity: 0 });
        }
        if (iconsRef.current[i]) {
          gsap.set(iconsRef.current[i], { y: 20, opacity: 0, scale: 0.85 });
        }
      }

      // Initial state for item 0
      if (cardItems[0]) {
        gsap.set(cardItems[0], { clipPath: "inset(0% 0% 0% 0%)" });
      }
      if (titleSplits[0]?.lines) {
        gsap.set(titleSplits[0].lines, { yPercent: 0, opacity: 1 });
      }
      if (descSplits[0]?.lines) {
        gsap.set(descSplits[0].lines, { yPercent: 0, opacity: 1 });
      }
      if (iconsRef.current[0]) {
        gsap.set(iconsRef.current[0], { y: 0, opacity: 1, scale: 1 });
      }

      // Entrance reveal for the card container when scrolling down into Atmos section
      if (cardRef.current && pinWrapperRef.current) {
        gsap.fromTo(
          cardRef.current,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            scrollTrigger: {
              trigger: pinWrapperRef.current,
              start: "top 85%",
              end: "top 65%",
              scrub: 1,
            },
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
          }
        );
      }

      // Atmosphere scroll scrubbing timeline
      const incomingSlides = slides.slice(1);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinWrapperRef.current,
          start: "top top",
          end: `+=${incomingSlides.length * 100}%`,
          pin: true,
          scrub: 1,
        },
      });

      incomingSlides.forEach((slide, idx) => {
        const prevIdx = idx;
        const nextIdx = idx + 1;
        const stepTime = idx;

        // 1. Background image slide wipes from bottom
        tl.fromTo(
          slide,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration: 1 },
          stepTime
        );

        // 2. Card item layer wipes from bottom
        const nextCard = cardItems[nextIdx];
        if (nextCard) {
          tl.fromTo(
            nextCard,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration: 1 },
            stepTime
          );
        }

        // 3. Outgoing atmosphere content: text & icon mask-reveal out
        if (titleSplits[prevIdx]?.lines?.length) {
          tl.to(
            titleSplits[prevIdx].lines,
            { yPercent: -100, opacity: 0, duration: 0.45, ease: "power2.inOut" },
            stepTime
          );
        }
        if (descSplits[prevIdx]?.lines?.length) {
          tl.to(
            descSplits[prevIdx].lines,
            { yPercent: -100, opacity: 0, duration: 0.45, ease: "power2.inOut" },
            stepTime
          );
        }
        if (iconsRef.current[prevIdx]) {
          tl.to(
            iconsRef.current[prevIdx],
            { y: -20, opacity: 0, scale: 0.85, duration: 0.4, ease: "power2.inOut" },
            stepTime
          );
        }

        // 4. Incoming atmosphere content: text & icon mask-reveal in
        if (titleSplits[nextIdx]?.lines?.length) {
          tl.fromTo(
            titleSplits[nextIdx].lines,
            { yPercent: 100, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
            stepTime + 0.35
          );
        }
        if (descSplits[nextIdx]?.lines?.length) {
          tl.fromTo(
            descSplits[nextIdx].lines,
            { yPercent: 100, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
            stepTime + 0.35
          );
        }
        if (iconsRef.current[nextIdx]) {
          tl.fromTo(
            iconsRef.current[nextIdx],
            { y: 20, opacity: 0, scale: 0.85 },
            { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: "power2.out" },
            stepTime + 0.35
          );
        }
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
          {/* Background Image Slides */}
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

          {/* Floating Atmospheric Card with Mask Reveal Layers */}
          <div className={styles.card} ref={cardRef}>
            {atmospheres.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    cardItemsRef.current[i] = el;
                  }}
                  className={styles.cardItem}
                  style={{ zIndex: i + 1 }}
                >
                  <div
                    className={styles.iconBadge}
                    ref={(el) => {
                      iconsRef.current[i] = el;
                    }}
                  >
                    <Icon />
                  </div>

                  <div className={styles.text}>
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
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}