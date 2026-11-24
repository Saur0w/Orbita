"use client";

import styles from "./style.module.scss";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Finish() {
  const finishRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  return (
    <section className={styles.finish} ref={finishRef}>
      <div className={styles.marquee} ref={marqueeRef}>
        <p>AVAILABLE IN TWO FINISHES</p>
      </div>
    </section>
  )
}