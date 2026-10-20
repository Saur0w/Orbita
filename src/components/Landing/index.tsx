"use client";

import styles from "./style.module.scss";
import Image from "next/image";
import { useRef } from "react";

const videoSrc = "/video/hero.mp4";

export interface CardProps {
    src: string;
    alt: string;
    title: string;
}

const card: CardProps[] = [
    {
        src: "/images/lamp.jpg",
        alt: "Lamp preview",
        title: "Pre-order now",
    },
];

export default function Landing() {
    const landingRef = useRef<HTMLElement>(null);
    return (
        <section className={styles.landing} ref={landingRef}>
            <div className={styles.bg}>
                <video src={videoSrc} autoPlay loop muted playsInline />
            </div>

            <div className={styles.heroTextOverlay}>
                <h1 className={styles.leftHeading} data-split-lines>
                    Light <br />
                    designed <br />
                    as an object
                </h1>

                <p className={styles.rightHeading} data-split-lines>
                    Light in <br />
                    perfect <br />
                    balance
                </p>
            </div>

            <span className={styles.scrollDown}>Scroll down</span>
            
            <div className={styles.cardContainer}>
                {card.map((item, i) => (
                    <div key={i} className={styles.card}>
                        <div className={styles.imageWrapper}>
                            <Image
                                src={item.src}
                                alt={item.alt}
                                fill
                                priority
                            />
                        </div>
                        <button type="button" className={styles.cardButton}>
                            {item.title}
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}