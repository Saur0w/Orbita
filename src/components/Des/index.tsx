"use client";

import styles from "./style.module.scss";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

const text = "Lightship is a new standard in travel, where automotive-grade engineering meets the soul of American craft. From our Silicon Valley roots to our Colorado factory floor, we build every vehicle under one roof, ensuring your journey is as reliable as it is revolutionary.";

export default function Des() {
    const desRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(textRef.current, {
            yPercent: 100,
            opacity: 0,
            duration: 1,

        })
    }, { scope: desRef })
    return (
        <section className={styles.des} ref={desRef}>
            <div className={styles.textWrapper} ref={textRef}>
                <p>{text}</p>
            </div>
        </section>
    )
}