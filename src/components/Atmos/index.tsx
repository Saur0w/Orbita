"use client";

import styles from "./style.module.scss";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ImageData {
  id: number;
  src: string;
  alt: string;
}

const images: ImageData[] = [
  {
    id: 1,
    src: "/images/ambient.jpg",
    alt: "Modern circular desk lamp casting soft, warm indirect ambient illumination across a bedroom setup",
  },
  {
    id: 2,
    src: "/images/focus.jpg",
    alt: "Focused downward task lighting from a table lamp illuminating a desk workspace and camera equipment",
  },
  {
    id: 3,
    src: "/images/night.jpg",
    alt: "Low-glare warm night lighting from a minimalist lamp creating a dim, relaxed atmosphere in a dark room",
  },
  {
    id: 4,
    src: "/images/halo.jpg",
    alt: "Diffuse accent lighting from a circular lamp casting a soft perimeter halo glow onto the surface",
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
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "none" }
      );
    });
  }, { scope: atmosRef });

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
          {images.map((image, i) => (
              <div
                  key={i}
                   ref={(el) => {
                     slidesRef.current[i] = el;
                   }}
                   className={styles.slide}
                   style={{ zIndex: i + 1 }}
              >
                <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    priority={i === 0}
                    unoptimized
                />
              </div>
          ))}
        </div>
      </div>
    </section>
  );
}