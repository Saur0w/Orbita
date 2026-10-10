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

  useGSAP(() => {
    const slides = slidesRef.current;
    if (slides.length <= 1) return;

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

    incomingSlides.forEach((slide) => {
      tl.fromTo(
          slide,
          {clipPath: "inset(100% 0% 0% 0%)"},
          {clipPath: "inset(0% 0% 0% 0%)", ease: "none"}
      );
    });
  }, {scope: atmosRef});

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
            {atmospheres.map((item, i) => {
              const Icon = item.icon;
              return (
                  <div
                      key={item.id}
                      ref={(el) => {
                        slidesRef.current[i] = el;
                      }}
                      className={styles.slide}
                      style={{zIndex: i + 1}}
                  >
                    <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        priority={i === 0}
                    />
                    <div className={styles.card}>
                      <div className={styles.iconBadge}>
                        <Icon />
                      </div>

                      <div className={styles.text}>
                        <h3 className={styles.cardTitle}>{item.title}</h3>
                        <p className={styles.cardDesc}>{item.description}</p>
                      </div>
                    </div>
                  </div>
              );
            })}
          </div>
        </div>
      </section>
  );
}