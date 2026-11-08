"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import styles from "./style.module.scss";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export default function Philo() {
  const philoRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const tagRef = useRef<HTMLSpanElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const imageSectionRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const infoCardRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      let headerTitleSplit: SplitText | null = null;

      const initSplitText = () => {
        if (!titleRef.current) return;

        if (headerTitleSplit) {
          headerTitleSplit.revert();
        }

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
            trigger: titleRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      };

      initSplitText();

      if (tagRef.current) {
        gsap.from(tagRef.current, {
          y: 24,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: tagRef.current,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      }

      const mm = gsap.matchMedia();

      mm.add("(min-width: 769px)", () => {
        if (imageRef.current) {
          gsap.fromTo(
            imageRef.current,
            { yPercent: -6, scale: 1.1 },
            {
              yPercent: 6,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: imageSectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );
        }

        if (infoCardRef.current) {
          gsap.fromTo(
            infoCardRef.current,
            { y: 30 },
            {
              y: -30,
              ease: "none",
              scrollTrigger: {
                trigger: imageSectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            }
          );
        }
      });

      ScrollTrigger.sort();
      ScrollTrigger.refresh();

      if (typeof document !== "undefined" && document.fonts?.ready) {
        document.fonts.ready.then(() => {
          initSplitText();
          ScrollTrigger.sort();
          ScrollTrigger.refresh();
        });
      }

      return () => {
        headerTitleSplit?.revert();
      };
    },
    { scope: philoRef }
  );

  return (
    <section ref={philoRef} className={styles.philo}>
      <div ref={headerRef} className={styles.upperSection}>
        <span ref={tagRef} className={styles.tag}>
          (Design Philosophy)
        </span>
        <h2 ref={titleRef} className={styles.title}>
          <span>Inspired by</span>
          <span>twentieth-century</span>
          <span>Modernism</span>
        </h2>
      </div>

      <div ref={imageSectionRef} className={styles.imageSection}>
        <Image
          ref={imageRef}
          src="/images/philo.png"
          alt="Orbita lamp on stone base"
          fill
          priority
          
          className={styles.bannerImage}
        />

        <div className={styles.contentOverlay}>
          <div ref={infoCardRef} className={styles.infoCard}>
            <h3 className={styles.infoHeading}>
              Every element has<br />
              been reduced to its<br />
              most essential form
            </h3>

            <div className={styles.elementsList}>
              <span>Circle</span>
              <span>Axis</span>
              <span>Cylinder</span>
            </div>

            <p className={styles.infoDesc}>
              This simplicity allows Orbita to exist both as a functional
              object and as a sculptural presence in the space
            </p>

            <Link href="/preorder" className={styles.pillButton}>
              <span className={styles.buttonText}>Pre-Order Now</span>
              <span className={styles.arrowCircle}>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5"
                    stroke="#232323"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}