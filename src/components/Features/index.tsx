"use client";

import styles from "./style.module.scss";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(SplitText, ScrollTrigger, useGSAP);

export default function Features() {
    const featureRef = useRef<HTMLElement>(null);

    return (
        <section className={styles.features} ref={featureRef}>
            <div className={styles.heading}>
                <span className={styles.subHeading}>(Smart Features)</span>
                <div className={styles.headingWrapper}>
                    <h2 className={styles.mainHeading}>
                        Orbita integrates modern technology with intuitive controls
                    </h2>
                </div>
            </div>

        </section>
    )
}