"use client";

import styles from "./style.module.scss";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Finish() {
  const finishRef = useRef<HTMLElement>(null);
  return (
    <section className={styles.finish} ref={finishRef}>
      <div className={styles.marquee}>
        <p>AVAILABLE IN TWO FINISHES</p>
      </div>
    </section>
  )
}