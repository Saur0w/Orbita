"use client";

import styles from "./style.module.scss";

const videoSrc = "/video/hero.mp4";

export default function Landing() {
    return (
        <section className={styles.landing}>
            <video src={videoSrc} autoPlay loop muted playsInline />
        </section>
    )
}