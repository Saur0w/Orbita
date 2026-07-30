"use client";

import { useRef } from "react";
import styles from "./style.module.scss";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface PreloaderProps {
    onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const maskRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            document.body.style.overflow = "hidden";

            const tl = gsap.timeline({
                onComplete: () => {
                    document.body.style.overflow = "";
                    onComplete();
                },
            });

            tl.fromTo(
                maskRef.current,
                { scale: 0.3, opacity: 0, rotate: 0 },
                { scale: 1, opacity: 1, rotate: 180, duration: 1, ease: "power3.out" }
            )
                .to(maskRef.current, {
                    rotate: 360,
                    duration: 0.8,
                    ease: "power2.inOut",
                })

                .to(maskRef.current, {
                    scale: 40,
                    duration: 1.1,
                    ease: "power4.inOut",
                })

                .to(
                    containerRef.current,
                    {
                        opacity: 0,
                        duration: 0.3,
                        ease: "power2.out",
                    },
                    "-=0.4"
                );
        },
        { scope: containerRef }
    );

    return (
        <section ref={containerRef} className={styles.preloader}>
            <div ref={maskRef} className={styles.mask}>
                <Image
                    src="/images/main.svg"
                    alt="Orbita Lamp"
                    width={100}
                    height={100}
                    priority
                />
            </div>
        </section>
    );
}