"use client";

import { useRef, useCallback, useEffect } from "react";
import styles from "./style.module.scss";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LogoPaths } from "@/components/Icons/logo";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ICON_VIEWBOX_CENTER = 366.913;
const VIDEO_SRC = "/video/mode.mp4";

export default function Switch() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinWrapperRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const maskLogoGroupRef = useRef<SVGGElement | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const playVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, []);

  const pauseAndResetVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;
  }, []);

  const scrollToNextSection = useCallback(() => {
    const st = scrollTriggerRef.current;
    const currentY = window.scrollY || window.pageYOffset || 0;

    // Safety: only auto-scroll if the user is still within Switch (never scroll backwards/upwards)
    if (st && currentY > st.end + 20) {
      return;
    }

    const pinSpacer =
      sectionRef.current?.closest(".pin-spacer") ||
      (sectionRef.current?.parentElement?.classList.contains("pin-spacer")
        ? sectionRef.current.parentElement
        : null);

    const nextSection = (pinSpacer?.nextElementSibling ||
      sectionRef.current?.nextElementSibling) as HTMLElement | null;

    const targetPos = st
      ? st.end + 2
      : nextSection
      ? nextSection.offsetTop
      : currentY + window.innerHeight;

    // Strict downward-only check: never scroll if already at or past the target
    if (targetPos <= currentY + 10) return;

    const lenis =
      typeof window !== "undefined"
        ? (window as unknown as { lenis?: { scrollTo: (target: HTMLElement | number, opts?: unknown) => void } }).lenis
        : null;

    if (lenis && typeof lenis.scrollTo === "function") {
      if (nextSection) {
        lenis.scrollTo(nextSection, {
          duration: 1.5,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        lenis.scrollTo(targetPos, {
          duration: 1.5,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }
    } else {
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({
          top: targetPos,
          behavior: "smooth",
        });
      }
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      // 1. Expand the sunburst mask to full reveal
      if (maskLogoGroupRef.current) {
        const maxHypot = Math.hypot(window.innerWidth, window.innerHeight);
        const fullScale = (maxHypot / 225) * 1.35;
        gsap.to(maskLogoGroupRef.current, {
          scale: fullScale,
          duration: 0.5,
          ease: "power2.out",
        });
      }

      // 2. Smoothly scroll down to the next section (Finish)
      scrollToNextSection();
    };

    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, [scrollToNextSection]);

  useGSAP(
    () => {
      const pinWrapper = pinWrapperRef.current;
      const maskLogo = maskLogoGroupRef.current;
      if (!pinWrapper || !maskLogo) return;

      const calcScales = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const initialSize = Math.min(w * 0.52, h * 0.62, 540);
        const initialScale = Math.max(initialSize / 730, 0.35);
        const maxHypot = Math.hypot(w, h);
        const fullRevealScale = (maxHypot / 225) * 1.35;
        return { initialScale, fullRevealScale };
      };

      const updateMaskCenter = () => {
        const rect = pinWrapper.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        gsap.set(maskLogo, {
          x: centerX - ICON_VIEWBOX_CENTER,
          y: centerY - ICON_VIEWBOX_CENTER,
          transformOrigin: `${ICON_VIEWBOX_CENTER}px ${ICON_VIEWBOX_CENTER}px`,
        });
      };

      const { initialScale, fullRevealScale } = calcScales();
      updateMaskCenter();

      gsap.set(maskLogo, {
        scale: initialScale,
        opacity: 1,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinWrapper,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: () => {
            playVideo();
          },
          onEnterBack: () => {
            playVideo();
          },
          onLeave: () => {
            const video = videoRef.current;
            if (video) video.pause();
          },
          onLeaveBack: () => {
            pauseAndResetVideo();
          },
          onUpdate: (self) => {
            if (self.progress > 0.05 && self.progress < 0.98) {
              if (videoRef.current?.paused) {
                playVideo();
              }
            }
          },
        },
      });

      scrollTriggerRef.current = tl.scrollTrigger as ScrollTrigger;

      tl.fromTo(
        maskLogo,
        { scale: initialScale },
        {
          scale: fullRevealScale,
          ease: "power2.inOut",
        }
      );

      const handleResize = () => {
        updateMaskCenter();
        ScrollTrigger.refresh();
      };

      window.addEventListener("resize", handleResize);

      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.pause();
      }

      return () => {
        window.removeEventListener("resize", handleResize);
        scrollTriggerRef.current = null;
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.switchSection}>
      <div ref={pinWrapperRef} className={styles.pinWrapper}>
        <div className={styles.videoWrapper}>
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            playsInline
            muted
            preload="auto"
          />
        </div>

        <svg className={styles.maskSvg} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <mask id="orbita-switch-mask">
              <rect width="100%" height="100%" fill="white" />
              <g
                ref={maskLogoGroupRef}
                fill="black"
                className={styles.maskLogo}
              >
                <LogoPaths />
              </g>
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="#F7F1E8"
            mask="url(#orbita-switch-mask)"
          />
        </svg>
      </div>
    </section>
  );
}
