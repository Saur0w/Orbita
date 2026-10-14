"use client";

import styles from "./style.module.scss";
import Image from "next/image";

const videoSrc = "/video/hero.mp4";

export interface CardProps {
    src: string,
    alt: string,
    title: string
}

const card: CardProps[] = [
    {
        src: "/images/lamp.jpg",
        alt: "Lamp preview",
        title: "Pre-order now"
    }
];

export default function Landing() {
    return (
        <section className={styles.landing}>
            <div className={styles.bg}>
                <video src={videoSrc} autoPlay loop muted playsInline />
            </div>
            <div className={styles.cardContainer}>
                {card.map((item, i) => (
                    <div key={i} className={styles.card}>
                        <div className={styles.imageWrapper}>
                            <Image src={item.src} alt={item.alt} fill />
                        </div>
                        <button type="button" className={styles.cardButton}>
                            {item.title}
                        </button>
                    </div>
                ))}
            </div>
        </section>
    )
}