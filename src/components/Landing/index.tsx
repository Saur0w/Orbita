"use client";

import styles from "./style.module.scss";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import Image from "next/image";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function Landing() {
    const landingRef = useRef<HTMLDivElement>(null);
    const imgWrapperRef = useRef<HTMLDivElement>(null);
    const headingRef1 = useRef<HTMLSpanElement>(null);
    const headingRef2 = useRef<HTMLSpanElement>(null);

    useGSAP(() => {
        const split1 = SplitText.create(headingRef1.current, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
        });

        const split2 = SplitText.create(headingRef2.current, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
        });

        const entranceTl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

        entranceTl
            .from([split1.lines, split2.lines], {
                yPercent: 110,
                duration: 1,
                stagger: 0.08,
            })

            .set([split1.masks, split2.masks], {
                overflow: "visible"
            })

            .from(headingRef2.current, {
                xPercent: -48,
                duration: 1.2,
                ease: "power2.out",
            });

        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: landingRef.current,
                start: "top top",
                end: "+=40%",
                scrub: 0.3,
                pin: true,
                anticipatePin: 1,
            },
        });

        scrollTl
            .to([headingRef1.current, headingRef2.current], {
                opacity: 0,
                ease: "none",
            })
            .to(
                imgWrapperRef.current,
                {
                    clipPath: "inset(15% 38% 15% 38% round 10px)",
                    ease: "none"
                },
                "<"
            );
    }, { scope: landingRef });

    return (
        <section className={styles.landing} ref={landingRef}>
            <div className={styles.body}>
                <div className={styles.imageWrapper} ref={imgWrapperRef}>
                    <Image
                        src="/images/main.jpg"
                        alt="hero"
                        fill
                        priority
                        unoptimized
                    />
                </div>
                <div className={styles.text}>
                    <h1>
                        <span ref={headingRef1}>Born for Adventure.</span>
                        <span ref={headingRef2}>Built in America</span>
                    </h1>
                </div>
            </div>
        </section>
    );
}