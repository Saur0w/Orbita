"use client";

import styles from "./style.module.scss";
import Image from "next/image";

const silver = "/images/silver.png";
const gold = "/images/gold.png";

export default function Finish() {
  return (
    <section className={styles.finish}>
      <div className={styles.bg}>
        <Image src={silver} alt="finishes" fill />
      </div>
    </section>
  );
}