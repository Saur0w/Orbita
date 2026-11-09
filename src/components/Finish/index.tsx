"use client";

import styles from "./style.module.scss";
import Image from "next/image";
import { useState } from "react";

const silver = "/images/silver.png";
const gold = "/images/gold.png";

type FinishType = "silver" | "gold";

interface FinishData {
  title: string;
  description: string;
  swatchColor: string;
}

const FINISH_CONTENT: Record<FinishType, FinishData> = {
  silver: {
    title: "Silver",
    description: "A brushed aluminum finish with a cool industrial character.",
    swatchColor: "#C9C9C9"
  },
  gold: {
    title: "Gold",
    description: "An anodized brass finish with a warm, luxurious character.",
    swatchColor: "#C48938"
  }
};

export default function Finish() {
  const [activeFinish, setActiveFinish] = useState<FinishType>("silver");
  const content = FINISH_CONTENT[activeFinish];
  return (
    <section className={styles.finish}>
      <div className={styles.bg}>
        <Image
          src={silver}
          alt="Silver Finish"
          fill
          priority
          className={`${styles.image} ${activeFinish === "silver" ? styles.visible : ""}`}
        />
        <Image
          src={gold}
          alt="Gold Finish"
          fill
          priority
          className={`${styles.image} ${activeFinish === "gold" ? styles.visible : ""}`}
        />
      </div>
    </section>
  );
}