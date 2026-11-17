"use client";

import { useState, useRef, forwardRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Magnetic from "@/ui/Magnetic";
import styles from "./style.module.scss";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "Is Orbita portable?",
    answer:
      "Yes. Orbita includes a rechargeable battery allowing up to 12 hours of cordless use.",
  },
  {
    question: "Can I adjust the brightness?",
    answer:
      "Yes. Orbita features stepless touch dimming, allowing you to smoothly transition from a soft ambient glow to focused task lighting.",
  },
  {
    question: "How do I control the lamp?",
    answer:
      "A discreet capacitive touch sensor on the base lets you tap to toggle power and press-and-hold to adjust brightness effortlessly.",
  },
  {
    question: "Is the LED replaceable?",
    answer:
      "Orbita uses an integrated high-efficiency LED array rated for over 50,000 hours of use, engineered to last decades without replacement.",
  },
  {
    question: "Does Orbita work with smart homes?",
    answer:
      "Orbita is intentionally designed as a tactile, distraction-free object and operates independently without Wi-Fi or apps.",
  },
];

interface MagneticLineProps {
  className?: string;
}

const MagneticDivider = forwardRef<HTMLDivElement, MagneticLineProps>(
  ({ className = "" }, forwardedRef) => {
    const internalRef = useRef<HTMLDivElement | null>(null);
    const pathRef = useRef<SVGPathElement | null>(null);

    const setRefs = (el: HTMLDivElement | null) => {
      internalRef.current = el;
      if (typeof forwardedRef === "function") {
        forwardedRef(el);
      } else if (forwardedRef) {
        forwardedRef.current = el;
      }
    };

    useGSAP(
      () => {
        const container = internalRef.current;
        const path = pathRef.current;
        if (!container || !path) return;

        const mm = gsap.matchMedia();

        mm.add(
          "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
          () => {
            const state = { x: 500, y: 50 };

            const render = () => {
              const { x, y } = state;
              const leftLimit = Math.max(0, x - 150);
              const rightLimit = Math.min(1000, x + 150);

              const cp1x = x - 80;
              const cp2x = x - 40;
              const cp3x = x + 40;
              const cp4x = x + 80;

              path.setAttribute(
                "d",
                `M 0 50 L ${leftLimit} 50 C ${cp1x} 50, ${cp2x} ${y}, ${x} ${y} C ${cp3x} ${y}, ${cp4x} 50, ${rightLimit} 50 L 1000 50`
              );
            };

            const xTo = gsap.quickTo(state, "x", {
              duration: 0.65,
              ease: "power3.out",
              onUpdate: render,
            });

            const yTo = gsap.quickTo(state, "y", {
              duration: 0.9,
              ease: "elastic.out(1, 0.45)",
              onUpdate: render,
            });

            const handleMouseMove = (e: MouseEvent) => {
              const rect = container.getBoundingClientRect();
              const rawX = ((e.clientX - rect.left) / rect.width) * 1000;
              const rawY = ((e.clientY - rect.top) / rect.height) * 100;

              const offsetFromCenter = rawY - 50;
              const pushY = 50 + offsetFromCenter * 0.9;

              xTo(gsap.utils.clamp(90, 910, rawX));
              yTo(gsap.utils.clamp(12, 88, pushY));
            };

            const handleMouseLeave = () => {
              yTo(50);
            };

            container.addEventListener("mousemove", handleMouseMove);
            container.addEventListener("mouseleave", handleMouseLeave);

            return () => {
              container.removeEventListener("mousemove", handleMouseMove);
              container.removeEventListener("mouseleave", handleMouseLeave);
            };
          }
        );

        return () => mm.revert();
      },
      { scope: internalRef }
    );

    return (
      <div
        ref={setRefs}
        className={`${styles.lineContainer} ${className}`.trim()}
      >
        <svg
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
          className={styles.lineSvg}
          aria-hidden="true"
        >
          <path
            ref={pathRef}
            d="M 0 50 L 1000 50"
            fill="none"
            stroke="rgba(35, 35, 35, 0.24)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    );
  }
);

MagneticDivider.displayName = "MagneticDivider";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const labelColRef = useRef<HTMLDivElement | null>(null);
  const labelTextRef = useRef<HTMLSpanElement | null>(null);
  const accordionColRef = useRef<HTMLDivElement | null>(null);
  const topLineRef = useRef<HTMLDivElement | null>(null);
  const answerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { contextSafe } = useGSAP(
    () => {
      FAQ_DATA.forEach((_, idx) => {
        const content = answerRefs.current[idx];
        const icon = iconRefs.current[idx];
        if (!content || !icon) return;

        if (idx === 0) {
          gsap.set(content, { height: "auto", opacity: 1 });
          gsap.set(icon, { rotation: 45 });
        } else {
          gsap.set(content, { height: 0, opacity: 0 });
          gsap.set(icon, { rotation: 0 });
        }
      });

      if (labelTextRef.current) {
        gsap.fromTo(
          labelTextRef.current,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power4.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      const allLines = [topLineRef.current, ...lineRefs.current].filter(Boolean);
      gsap.fromTo(
        allLines,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          stagger: 0.09,
          ease: "expo.out",
          scrollTrigger: {
            trigger: accordionColRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        `.${styles.faqItem}`,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: {
            trigger: accordionColRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      const mm = gsap.matchMedia();

      mm.add("(min-width: 769px)", () => {
        gsap.fromTo(
          [labelColRef.current, accordionColRef.current],
          { y: 0 },
          {
            y: -18,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          }
        );
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  const toggleFAQ = contextSafe((index: number) => {
    const isOpening = openIndex !== index;
    const prevIndex = openIndex;

    if (prevIndex !== null && answerRefs.current[prevIndex]) {
      gsap.to(answerRefs.current[prevIndex], {
        height: 0,
        opacity: 0,
        duration: 0.38,
        ease: "power3.inOut",
        onComplete: () => ScrollTrigger.refresh(),
      });
      gsap.to(iconRefs.current[prevIndex], {
        rotation: 0,
        duration: 0.32,
        ease: "power2.out",
      });
    }

    if (isOpening && answerRefs.current[index]) {
      gsap.to(answerRefs.current[index], {
        height: "auto",
        opacity: 1,
        duration: 0.42,
        ease: "power3.out",
        onComplete: () => ScrollTrigger.refresh(),
      });
      gsap.to(iconRefs.current[index], {
        rotation: 45,
        duration: 0.32,
        ease: "power2.out",
      });
      setOpenIndex(index);
    } else {
      setOpenIndex(null);
    }
  });

  return (
    <section ref={sectionRef} className={styles.faqSection}>
      <div className={styles.container}>
        <div ref={labelColRef} className={styles.labelCol}>
          <div className={styles.labelMask}>
            <span ref={labelTextRef} className={styles.sectionLabel}>
              (Frequently asked questions)
            </span>
          </div>
        </div>

        <div ref={accordionColRef} className={styles.accordionCol}>
          <MagneticDivider ref={topLineRef} className={styles.topBorder} />

          {FAQ_DATA.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question} className={styles.faqItem}>
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className={styles.questionButton}
                  aria-expanded={isOpen}
                >
                  <span className={styles.questionText}>{item.question}</span>

                  <Magnetic>
                    <span className={styles.iconHitbox}>
                      <span
                        ref={(el) => {
                          iconRefs.current[index] = el;
                        }}
                        className={styles.icon}
                        aria-hidden="true"
                      >
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 17 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.73438 0H9.14062C9.26562 0 9.32812 0.0625 9.32812 0.1875V16.6875C9.32812 16.8125 9.26562 16.875 9.14062 16.875H7.73438C7.60937 16.875 7.54688 16.8125 7.54688 16.6875V0.1875C7.54688 0.0625 7.60937 0 7.73438 0Z"
                            fill="#232323"
                          />
                          <path
                            d="M0.9375 7.54688H16.6875C16.8125 7.54688 16.875 7.60937 16.875 7.73438V9.14062C16.875 9.26562 16.8125 9.32812 16.6875 9.32812H0.1875C0.0625 9.32812 0 9.26562 0 9.14062V7.73438C0 7.60937 0.0625 7.54688 0.1875 7.54688H0.9375Z"
                            fill="#232323"
                          />
                        </svg>
                      </span>
                    </span>
                  </Magnetic>
                </button>

                <div
                  ref={(el) => {
                    answerRefs.current[index] = el;
                  }}
                  className={styles.answerWrapper}
                >
                  <p className={styles.answerText}>{item.answer}</p>
                </div>

                <MagneticDivider
                  ref={(el) => {
                    lineRefs.current[index] = el;
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}