"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import styles from "./style.module.scss";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

interface MaterialItem {
  title: string;
  description: string;
  image: string;
  alt: string;
}

const MATERIALS_DATA: MaterialItem[] = [
  {
    title: "Low Energy LED Technology",
    description:
      "Consumes significantly less power than traditional lighting.",
    image: "/images/sus/led.png",
    alt: "Low Energy LED Technology",
  },
  {
    title: "Long-Life Components",
    description:
      "LED modules designed for over 50,000 hours of operation.",
    image: "/images/sus/life.jpg",
    alt: "Long-Life Components",
  },
  {
    title: "Replaceable Battery System",
    description: "Extends product lifespan.",
    image: "/images/sus/battery.png",
    alt: "Replaceable Battery System",
  },
  {
    title: "Recyclable Materials",
    description:
      "The lamp body is made primarily from recyclable aluminum.",
    image: "/images/sus/mat.jpg",
    alt: "Recyclable Materials",
  },
];


const STAIRCASE_TOP_INSETS = [38, 26, 14, 4];

export default function Materials() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const imageWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageInnerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardTitleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const cardDescRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useGSAP(
    (_, contextSafe) => {
      let isCancelled = false;
      const splits: SplitText[] = [];

      const initAnimations = contextSafe!(() => {
        if (isCancelled || !sectionRef.current) return;

        const mm = gsap.matchMedia();

        mm.add(
          {
            isDesktop: "(min-width: 1025px)",
            isTabletOrMobile: "(max-width: 1024px)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
          },
          (context) => {
            const { isDesktop, reduceMotion } = context.conditions!;
            if (reduceMotion) return;

            if (labelRef.current) {
              gsap.fromTo(
                labelRef.current,
                { yPercent: 115, autoAlpha: 0 },
                {
                  yPercent: 0,
                  autoAlpha: 1,
                  duration: 0.85,
                  ease: "expo.out",
                  scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 84%",
                    toggleActions: "play none none none",
                  },
                }
              );
            }

            if (headingRef.current) {
              const headingSplit = new SplitText(headingRef.current, {
                type: "lines,words",
                linesClass: styles.splitLine,
                wordsClass: styles.splitWord,
              });
              splits.push(headingSplit);

              gsap.fromTo(
                headingSplit.words,
                { yPercent: 115, autoAlpha: 0 },
                {
                  yPercent: 0,
                  autoAlpha: 1,
                  duration: 0.95,
                  stagger: 0.03,
                  ease: "expo.out",
                  scrollTrigger: {
                    trigger: headingRef.current,
                    start: "top 85%",
                    toggleActions: "play none none none",
                  },
                }
              );
            }

            imageWrapRefs.current.forEach((wrap, idx) => {
              if (!wrap) return;

              const startTopInset = isDesktop ? STAIRCASE_TOP_INSETS[idx] : 16;

              gsap.fromTo(
                wrap,
                {
                  clipPath: `inset(${startTopInset}% 0% 0% 0% round 8px)`,
                },
                {
                  clipPath: "inset(0% 0% 0% 0% round 8px)",
                  ease: "none",
                  scrollTrigger: {
                    trigger: gridRef.current,
                    start: "top 95%",
                    end: "center 52%",
                    scrub: 0.8,
                  },
                }
              );
            });

            imageInnerRefs.current.forEach((inner, idx) => {
              if (!inner) return;

              gsap.fromTo(
                inner,
                {
                  yPercent: -8,
                  scale: 1.12,
                },
                {
                  yPercent: 8,
                  scale: 1.02,
                  ease: "none",
                  scrollTrigger: {
                    trigger: gridRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.7 + idx * 0.06,
                  },
                }
              );
            });

            // 4. SplitText line reveal for card titles and descriptions
            cardRefs.current.forEach((card, index) => {
              const titleEl = cardTitleRefs.current[index];
              const descEl = cardDescRefs.current[index];
              if (!card || !titleEl || !descEl) return;

              const titleSplit = new SplitText(titleEl, {
                type: "lines",
                linesClass: styles.splitLine,
              });
              const descSplit = new SplitText(descEl, {
                type: "lines",
                linesClass: styles.splitLine,
              });
              splits.push(titleSplit, descSplit);

              gsap.fromTo(
                [...titleSplit.lines, ...descSplit.lines],
                { yPercent: 110, autoAlpha: 0 },
                {
                  yPercent: 0,
                  autoAlpha: 1,
                  duration: 0.8,
                  stagger: 0.06,
                  delay: index * 0.06,
                  ease: "power3.out",
                  scrollTrigger: {
                    trigger: gridRef.current,
                    start: "top 82%",
                    toggleActions: "play none none none",
                  },
                }
              );
            });

            ScrollTrigger.refresh();
          }
        );
      });

      document.fonts.ready.then(initAnimations);

      return () => {
        isCancelled = true;
        splits.forEach((s) => s.revert());
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.sus}>
      <div className={styles.container}>
        <div className={styles.topHeader}>
          <div className={styles.labelCol}>
            <span className={styles.labelMask}>
              <span ref={labelRef} className={styles.sectionLabel}>
                (Sustainability)
              </span>
            </span>
          </div>

          <h2 ref={headingRef} className={styles.heading}>
            Orbita was designed with environmental responsibility in mind.
          </h2>
        </div>

        <div ref={gridRef} className={styles.grid}>
          {MATERIALS_DATA.map((item, index) => (
            <article
              key={item.title}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className={styles.card}
            >
              <div
                ref={(el) => {
                  imageWrapRefs.current[index] = el;
                }}
                className={styles.imageWrapper}
              >
                <div
                  ref={(el) => {
                    imageInnerRefs.current[index] = el;
                  }}
                  className={styles.imageInner}
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className={styles.image}
                  />
                </div>
              </div>

              <div className={styles.cardContent}>
                <h3
                  ref={(el) => {
                    cardTitleRefs.current[index] = el;
                  }}
                  className={styles.cardTitle}
                >
                  {item.title}
                </h3>
                <p
                  ref={(el) => {
                    cardDescRefs.current[index] = el;
                  }}
                  className={styles.cardDescription}
                >
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}