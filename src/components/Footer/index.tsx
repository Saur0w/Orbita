"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import styles from "./style.module.scss";
import { Logo } from "../Icons/logo";
import Magnetic from "@/ui/Magnetic";

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP);

CustomEase.create("luxuryMask", "0.16, 1, 0.3, 1");

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "The Lamp", href: "#the-lamp" },
  { label: "Features", href: "#features" },
  { label: "Specification", href: "#specification" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "X", href: "https://x.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement | null>(null);
  const topBorderRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const emailLabelRef = useRef<HTMLSpanElement | null>(null);
  const emailTextRef = useRef<HTMLSpanElement | null>(null);
  const navLabelRef = useRef<HTMLSpanElement | null>(null);
  const navLinksRef = useRef<(HTMLSpanElement | null)[]>([]);
  const socialsLabelRef = useRef<HTMLSpanElement | null>(null);
  const socialLinksRef = useRef<(HTMLSpanElement | null)[]>([]);
  const imageSectionRef = useRef<HTMLDivElement | null>(null);
  const bannerWrapperRef = useRef<HTMLDivElement | null>(null);
  const cardParallaxRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      let emailSplit: SplitText | null = null;
      let labelSplit: SplitText | null = null;
      let linksSplit: SplitText | null = null;
      let revealTimeline: gsap.core.Timeline | null = null;

      const initSplitText = () => {
        revealTimeline?.kill();
        emailSplit?.revert();
        labelSplit?.revert();
        linksSplit?.revert();

        if (emailTextRef.current) {
          emailSplit = new SplitText(emailTextRef.current, {
            type: "lines",
            mask: "lines",
            linesClass: `${styles.splitLine} splitLine`,
          });
        }

        const labelElements = [
          emailLabelRef.current,
          navLabelRef.current,
          socialsLabelRef.current,
        ].filter(Boolean) as HTMLElement[];

        if (labelElements.length > 0) {
          labelSplit = new SplitText(labelElements, {
            type: "lines",
            mask: "lines",
            linesClass: `${styles.splitLine} splitLine`,
          });
        }

        const linkElements = [
          ...navLinksRef.current,
          ...socialLinksRef.current,
        ].filter(Boolean) as HTMLElement[];

        if (linkElements.length > 0) {
          linksSplit = new SplitText(linkElements, {
            type: "lines",
            mask: "lines",
            linesClass: `${styles.splitLine} splitLine`,
          });
        }

        revealTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        });

        // 1. Top border hairline draws in smoothly
        if (topBorderRef.current) {
          revealTimeline.fromTo(
            topBorderRef.current,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.6,
              ease: "power3.inOut",
              transformOrigin: "left center",
            },
            0
          );
        }

        // 2. Logo floats up softly
        if (logoRef.current) {
          revealTimeline.from(
            logoRef.current,
            {
              opacity: 0,
              y: 20,
              duration: 1.3,
              ease: "power2.out",
            },
            0.15
          );
        }

        // 3. Section column labels reveal through mask
        if (labelSplit && labelSplit.lines.length > 0) {
          revealTimeline.from(
            labelSplit.lines,
            {
              yPercent: 115,
              opacity: 0,
              duration: 1.35,
              stagger: 0.09,
              ease: "luxuryMask",
            },
            0.15
          );
        }

        // 4. Large email address glides up through line mask
        if (emailSplit && emailSplit.lines.length > 0) {
          revealTimeline.from(
            emailSplit.lines,
            {
              yPercent: 115,
              duration: 1.65,
              ease: "luxuryMask",
            },
            0.25
          );
        }

        // 5. Navigation & Social links cascade up through line masks
        if (linksSplit && linksSplit.lines.length > 0) {
          revealTimeline.from(
            linksSplit.lines,
            {
              yPercent: 115,
              duration: 1.45,
              stagger: 0.065,
              ease: "luxuryMask",
            },
            0.32
          );
        }
      };

      initSplitText();

      // Card subtle entrance when image section enters
      if (cardRef.current && imageSectionRef.current) {
        gsap.from(cardRef.current, {
          opacity: 0,
          scale: 0.95,
          duration: 1.4,
          ease: "luxuryMask",
          scrollTrigger: {
            trigger: imageSectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }

      // Parallax scroll: very subtle, restrained and photographic
      const mm = gsap.matchMedia();

      mm.add("(min-width: 769px)", () => {
        if (bannerWrapperRef.current && footerRef.current) {
          gsap.fromTo(
            bannerWrapperRef.current,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: footerRef.current,
                start: "top bottom",
                end: "bottom bottom",
                scrub: 1.2,
              },
            }
          );
        }

        if (cardParallaxRef.current && footerRef.current) {
          gsap.fromTo(
            cardParallaxRef.current,
            { y: 26 },
            {
              y: -26,
              ease: "none",
              scrollTrigger: {
                trigger: footerRef.current,
                start: "top bottom",
                end: "bottom bottom",
                scrub: 0.9,
              },
            }
          );
        }
      });

      mm.add("(max-width: 768px)", () => {
        if (bannerWrapperRef.current && footerRef.current) {
          gsap.fromTo(
            bannerWrapperRef.current,
            { yPercent: -2.5 },
            {
              yPercent: 2.5,
              ease: "none",
              scrollTrigger: {
                trigger: footerRef.current,
                start: "top bottom",
                end: "bottom bottom",
                scrub: 1,
              },
            }
          );
        }

        if (cardParallaxRef.current && footerRef.current) {
          gsap.fromTo(
            cardParallaxRef.current,
            { y: 12 },
            {
              y: -12,
              ease: "none",
              scrollTrigger: {
                trigger: footerRef.current,
                start: "top bottom",
                end: "bottom bottom",
                scrub: 0.8,
              },
            }
          );
        }
      });

      // Recalculate accurately once web fonts are fully ready
      if (typeof document !== "undefined" && document.fonts?.ready) {
        document.fonts.ready.then(() => {
          initSplitText();
          ScrollTrigger.refresh();
        });
      }

      return () => {
        revealTimeline?.kill();
        emailSplit?.revert();
        labelSplit?.revert();
        linksSplit?.revert();
      };
    },
    { scope: footerRef }
  );

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div className={styles.topBorderWrapper}>
        <div ref={topBorderRef} className={styles.topBorder} />
      </div>

      <div className={styles.topSection}>
        <div ref={logoRef} className={styles.logoCol}>
          <Link href="/" aria-label="Orbita Home" className={styles.logoLink}>
            <Logo className={styles.logo} />
          </Link>
        </div>

        <div className={styles.emailCol}>
          <span ref={emailLabelRef} className={styles.columnLabel}>
            (Email)
          </span>
          <Magnetic>
            <Link
              href="mailto:hello@orbitalight.com"
              className={styles.emailLink}
            >
              <span ref={emailTextRef} className={styles.emailText}>
                hello@orbitalight.com
              </span>
            </Link>
          </Magnetic>
        </div>

        <div className={styles.navCol}>
          <span ref={navLabelRef} className={styles.columnLabel}>
            (Navs)
          </span>
          <ul className={styles.linkList}>
            {NAV_LINKS.map((link, idx) => (
              <li key={link.label}>
                <Link href={link.href} className={styles.linkItem}>
                  <span
                    ref={(el) => {
                      navLinksRef.current[idx] = el;
                    }}
                    className={styles.linkText}
                  >
                    {link.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.socialsCol}>
          <span ref={socialsLabelRef} className={styles.columnLabel}>
            (Socials)
          </span>
          <ul className={styles.linkList}>
            {SOCIAL_LINKS.map((link, idx) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkItem}
                >
                  <span
                    ref={(el) => {
                      socialLinksRef.current[idx] = el;
                    }}
                    className={styles.linkText}
                  >
                    {link.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div ref={imageSectionRef} className={styles.imageSection}>
        <div ref={bannerWrapperRef} className={styles.bannerWrapper}>
          <Image
            src="/images/footer.png"
            alt="Orbita Lamp preview"
            fill
            priority
            unoptimized
            className={styles.bannerImage}
          />
        </div>

        <div className={styles.centerCard}>
          <div ref={cardParallaxRef} className={styles.cardParallax}>
            <div ref={cardRef} className={styles.card}>
              <div className={styles.cardImageWrapper}>
                <Image
                  src="/images/lamp.jpg"
                  alt="Orbita Lamp on stand"
                  fill
                  priority
                  className={styles.cardImage}
                />
              </div>

              <Link href="/preorder" className={styles.cardButton}>
                Pre-order now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
