"use client";

import { useRef } from "react";
import styles from "./style.module.scss";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mainImageRef = useRef<HTMLDivElement>(null);
    const leftImageRef = useRef<HTMLDivElement>(null);
    const rightImageRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=200%",
                    scrub: 1,
                    pin: true,
                },
            });

            gsap.set([leftImageRef.current, rightImageRef.current], {
                opacity: 0,
                scale: 0.8,
                x: "0vw",
            });

            tl.to(
                mainImageRef.current,
                {
                    width: "28vw",
                    height: "70vh",
                    borderRadius: "16px",
                    ease: "power2.inOut",
                },
                0
            )
                .to(
                    leftImageRef.current,
                    {
                        x: "-30vw",
                        opacity: 1,
                        scale: 1,
                        ease: "power2.inOut",
                    },
                    0
                )
                .to(
                    rightImageRef.current,
                    {
                        x: "30vw",
                        opacity: 1,
                        scale: 1,
                        ease: "power2.inOut",
                    },
                    0
                );
        },
        { scope: containerRef }
    );

    return (
        <section ref={containerRef} className={styles.landing}>
            <div className={styles.stickyWrapper}>
                <div
                    ref={leftImageRef}
                    className={`${styles.imageContainer} ${styles.sideImage}`}
                >
                    <Image
                        src="/images/hero-left.jpg"
                        alt="Left Lamp Detail"
                        fill
                        priority
                        className={styles.img}
                        sizes="(max-width: 768px) 100vw, 30vw"
                        unoptimized
                    />
                </div>

                <div
                    ref={mainImageRef}
                    className={`${styles.imageContainer} ${styles.mainImage}`}
                >
                    <Image
                        src="/images/hero.jpg"
                        alt="Orbita Lamp"
                        fill
                        priority
                        className={styles.img}
                        sizes="100vw"
                        unoptimized
                    />
                </div>

                <div
                    ref={rightImageRef}
                    className={`${styles.imageContainer} ${styles.sideImage}`}
                >
                    <Image
                        src="/images/hero-right.jpg"
                        alt="Right Lamp Detail"
                        fill
                        priority
                        className={styles.img}
                        sizes="(max-width: 768px) 100vw, 30vw"
                        unoptimized
                    />
                </div>

            </div>
        </section>
    );
}