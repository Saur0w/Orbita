"use client";

import { useRef } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import styles from "./style.module.scss";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

type MaterialKey = "aluminum" | "diffuser" | "finish" | "core";

interface MaterialConfig {
  key: MaterialKey;
  image: string;
}

const MATERIALS_CONFIG: MaterialConfig[] = [
  {
    key: "aluminum",
    image: "/images/mat/alu.png",
  },
  {
    key: "diffuser",
    image: "/images/mat/dif.png",
  },
  {
    key: "finish",
    image: "/images/mat/finish.png",
  },
  {
    key: "core",
    image: "/images/mat/core.png",
  },
];

const STAIRCASE_TOP_INSETS = [38, 26, 14, 4];

export default function Materials() {
  const t = useTranslations("Materials");
  const locale = useLocale();

  const materialsData = MATERIALS_CONFIG.map((item) => {
    const title = t(`items.${item.key}.title`);
    return {
      key: item.key,
      title,
      description: t(`items.${item.key}.description`),
      image: item.image,
      alt: title,
    };
  });

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
        if (!contextSafe) return;

        let isCancelled = false;
        const mm = gsap.matchMedia();

        const initAnimations = contextSafe(() => {
          if (isCancelled || !sectionRef.current) return;

          mm.add(
              {
                isDesktop: "(min-width: 1025px)",
                isTablet: "(min-width: 769px) and (max-width: 1024px)",
                isMobile: "(max-width: 768px)",
                reduceMotion: "(prefers-reduced-motion: reduce)",
              },
              (context) => {
                const { isDesktop, reduceMotion } = context.conditions!;
                if (reduceMotion) return;

                const localSplits: SplitText[] = [];

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
                  localSplits.push(headingSplit);

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

                if (isDesktop) {
                  imageWrapRefs.current.forEach((wrap, idx) => {
                    if (!wrap) return;

                    const startTopInset = STAIRCASE_TOP_INSETS[idx];

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
                } else {
                  imageWrapRefs.current.forEach((wrap) => {
                    if (wrap) gsap.set(wrap, { clipPath: "none" });
                  });
                  imageInnerRefs.current.forEach((inner) => {
                    if (inner) gsap.set(inner, { clearProps: "transform" });
                  });
                }

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
                  localSplits.push(titleSplit, descSplit);

                  gsap.fromTo(
                      [...titleSplit.lines, ...descSplit.lines],
                      { yPercent: 110, autoAlpha: 0 },
                      {
                        yPercent: 0,
                        autoAlpha: 1,
                        duration: 0.8,
                        stagger: 0.06,
                        delay: isDesktop ? index * 0.06 : 0,
                        ease: "power3.out",
                        scrollTrigger: {
                          trigger: isDesktop ? gridRef.current : card,
                          start: isDesktop ? "top 82%" : "top 88%",
                          toggleActions: "play none none none",
                        },
                      }
                  );
                });

                ScrollTrigger.refresh();

                return () => {
                  localSplits.forEach((s) => s.revert());
                };
              }
          );
        });

        void document.fonts.ready.then(initAnimations);

        return () => {
          isCancelled = true;
          mm.revert();
        };
      },
      { scope: sectionRef, dependencies: [locale], revertOnUpdate: true }
  );

  return (
      <section ref={sectionRef} className={styles.materials}>
        <div className={styles.container}>
          <div className={styles.topHeader}>
            <div className={styles.labelCol}>
            <span className={styles.labelMask}>
              <span ref={labelRef} className={styles.sectionLabel}>
                {t("label")}
              </span>
            </span>
            </div>

            <h2 ref={headingRef} className={styles.heading} key={locale}>
              {t("heading")}
            </h2>
          </div>

          <div ref={gridRef} className={styles.grid}>
            {materialsData.map((item, index) => (
                <article
                    key={item.key}
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
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className={styles.image}
                      />
                    </div>
                  </div>

                  <div className={styles.cardContent} key={locale}>
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