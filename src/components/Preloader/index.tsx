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
const INITIAL_ICON_SIZE = 28; // 28px icon between the two words

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

            // Lock page scroll while preloader is running
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

            // Position the SVG mask logo at the exact center of the viewport
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
            // Center circle diameter in viewBox is ~225.4 units; compute scale needed to cover viewport diagonal
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

            // 1. Left-to-right character unblur reveal (00:00 -> 00:01.3)
            tl.to(allChars, {
                opacity: 1,
                filter: "blur(0px)",
                y: 0,
                duration: 0.75,
                stagger: 0.045,
                ease: "power2.out",
            });

            // 2. Words part + center cutout Logo scales in showing Landing page inside (00:01.4 -> 00:02.4)
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

            // 3. Hold with live video visible inside the spinning/stationary icon (00:02.4 -> 00:03.1)
            const zoomStart = "+=0.55";

            // 4. Expand cutout Logo until center circle reveals the full Landing section (00:03.1 -> 00:04.5)
            tl.to(
                leftWord,
                {
                    x: -90,
                    opacity: 0,
                    filter: "blur(8px)",
                    duration: 0.55,
                    ease: "power2.in",
                },
                zoomStart
            );

            tl.to(
                rightWord,
                {
                    x: 90,
                    opacity: 0,
                    filter: "blur(8px)",
                    duration: 0.55,
                    ease: "power2.in",
                },
                zoomStart
            );

            tl.to(
                maskLogo,
                {
                    scale: fullRevealScale,
                    rotation: 45,
                    duration: 1.35,
                    ease: "portalZoom",
                    onStart: () => {
                        // Trigger Header / Landing entrance slightly before mask finishes clearing edges
                        gsap.delayedCall(0.75, () => {
                            onComplete?.();
                        });
                    },
                },
                zoomStart
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
            {/* Full-viewport SVG Mask Overlay:
                White = #F7F1E8 cream background
                Black (<LogoPaths />) = transparent cutout showing <Landing /> underneath */}
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

            {/* Centered Typography Layer */}
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