"use client";

import { useRef, useState } from "react";
import styles from "./style.module.scss";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { LogoPaths } from "@/components/Icons/logo";

gsap.registerPlugin(SplitText, CustomEase, useGSAP);

CustomEase.create("wordSplit", "0.22, 1, 0.36, 1");
CustomEase.create("portalZoom", "0.65, 0, 0.25, 1");

interface PreloaderProps {
    onComplete?: () => void;
}

const ICON_VIEWBOX_CENTER = 366.913;
const INITIAL_ICON_SIZE = 56; 

export default function Preloader({ onComplete }: PreloaderProps) {
    const preloaderRef = useRef<HTMLDivElement>(null);
    const leftWordRef = useRef<HTMLSpanElement>(null);
    const rightWordRef = useRef<HTMLSpanElement>(null);
    const iconSlotRef = useRef<HTMLSpanElement>(null);
    const maskLogoGroupRef = useRef<SVGGElement>(null);
    const [isDone, setIsDone] = useState(false);

    useGSAP(
        () => {
            const el = preloaderRef.current;
            const leftWord = leftWordRef.current;
            const rightWord = rightWordRef.current;
            const iconSlot = iconSlotRef.current;
            const maskLogo = maskLogoGroupRef.current;

            if (!el || !leftWord || !rightWord || !iconSlot || !maskLogo) return;

            const prevOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";

            const splitLeft = SplitText.create(leftWord, {
                type: "chars",
                charsClass: styles.char,
            });
            const splitRight = SplitText.create(rightWord, {
                type: "chars",
                charsClass: styles.char,
            });
            const allChars = [...splitLeft.chars, ...splitRight.chars];

            const updateMaskCenter = () => {
                const vw = window.innerWidth;
                const vh = window.innerHeight;
                gsap.set(maskLogo, {
                    x: vw / 2 - ICON_VIEWBOX_CENTER,
                    y: vh / 2 - ICON_VIEWBOX_CENTER,
                    svgOrigin: `${ICON_VIEWBOX_CENTER} ${ICON_VIEWBOX_CENTER}`,
                });
            };
            updateMaskCenter();

            const baseScale = INITIAL_ICON_SIZE / 730;
            const maxViewportHypotenuse = Math.hypot(
                window.innerWidth,
                window.innerHeight
            );
            const fullRevealScale = (maxViewportHypotenuse / 220) * 1.15;

            // Initial states
            gsap.set(allChars, {
                opacity: 0,
                filter: "blur(12px)",
                y: 4,
            });
            gsap.set(iconSlot, { width: 0 });
            gsap.set(maskLogo, {
                scale: 0,
                rotation: -90,
            });

            const tl = gsap.timeline({
                onComplete: () => {
                    document.body.style.overflow = prevOverflow;
                    setIsDone(true);
                },
            });

            tl.to(allChars, {
                opacity: 1,
                filter: "blur(0px)",
                y: 0,
                duration: 0.75,
                stagger: 0.045,
                ease: "power2.out",
            });

            const splitStart = "+=0.15";
            tl.to(
                iconSlot,
                {
                    width: INITIAL_ICON_SIZE + 16,
                    duration: 0.85,
                    ease: "wordSplit",
                },
                splitStart
            );

            tl.to(
                maskLogo,
                {
                    scale: baseScale,
                    rotation: 0,
                    duration: 0.85,
                    ease: "wordSplit",
                },
                splitStart
            );


            tl.to(
                maskLogo,
                {
                    scale: fullRevealScale,
                    rotation: 45,
                    duration: 1.35,
                    ease: "portalZoom",
                    onStart: () => {
                        gsap.delayedCall(0.75, () => {
                            onComplete?.();
                        });
                    },
                },
            );

            tl.to(
                leftWord,
                {
                    opacity: 0,
                },
            );

            tl.to(
                rightWord,
                {
                    opacity: 0,
                },
            );

            

            window.addEventListener("resize", updateMaskCenter);
            return () => {
                window.removeEventListener("resize", updateMaskCenter);
                document.body.style.overflow = prevOverflow;
                splitLeft.revert();
                splitRight.revert();
            };
        },
        { scope: preloaderRef }
    );

    if (isDone) return null;

    return (
        <div
            ref={preloaderRef}
            className={styles.preloader}
            aria-hidden="true"
        >
            <svg className={styles.maskSvg} xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <mask id="orbita-preloader-mask">
                        <rect width="100%" height="100%" fill="white" />
                        <g ref={maskLogoGroupRef} fill="black">
                            <LogoPaths />
                        </g>
                    </mask>
                </defs>
                <rect
                    width="100%"
                    height="100%"
                    fill="#F7F1E8"
                    mask="url(#orbita-preloader-mask)"
                />
            </svg>

            <div className={styles.textLayer}>
                <h1 className={styles.brandTitle}>
                    <span ref={leftWordRef} className={styles.word}>
                        Orbital
                    </span>
                    <span ref={iconSlotRef} className={styles.iconSlot} />
                    <span ref={rightWordRef} className={styles.word}>
                        Lamp
                    </span>
                </h1>
            </div>
        </div>
    );
}