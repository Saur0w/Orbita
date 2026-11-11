"use client";

import styles from "./style.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type ColorOption = "gold" | "silver";

interface ColorConfig {
  id: ColorOption;
  name: string;
  swatch: string;
  image: string;
}

const COLORS: ColorConfig[] = [
  {
    id: "gold",
    name: "Gold",
    swatch: "#C28A3D",
    image: "/images/preorder_gold.jpg",
  },
  {
    id: "silver",
    name: "Silver",
    swatch: "#C9C9C9",
    image: "/images/preorder_silver.jpg",
  },
];

export default function Preorder() {
  const [selectedColor, setSelectedColor] = useState<ColorOption>("gold");
  const [quantity, setQuantity] = useState<number>(1);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const activeColorConfig =
    COLORS.find((c) => c.id === selectedColor) || COLORS[0];

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  

  return (
    <main className={styles.preorder}>
      <div className={styles.imageSection}>
        <div className={styles.imageWrapper}>
          {COLORS.map((color) => {
            const isActive = color.id === selectedColor;
            return (
              <div
                key={color.id}
                className={`${styles.imageSlide} ${
                  isActive ? styles.activeImage : ""
                }`}
              >
                <Image
                  src={color.image}
                  alt={`Orbital Lamp in ${color.name}`}
                  fill
                  priority
                  className={styles.productImage}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.contentInner}>
          <h1 className={styles.title}>Pre-order Orbital Lamp</h1>
          <p className={styles.price}>€{800 * quantity}</p>

          <div className={styles.quantitySelector} aria-label="Quantity">
            <button
              type="button"
              onClick={handleDecrement}
              className={styles.qtyBtn}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              &minus;
            </button>
            <span className={styles.qtyValue}>{quantity}</span>
            <button
              type="button"
              onClick={handleIncrement}
              className={styles.qtyBtn}
              aria-label="Increase quantity"
            >
              &#43;
            </button>
          </div>

          <div className={styles.colorGroup}>
            <span className={styles.colorLabel}>Color</span>
            <div className={styles.swatches}>
              {COLORS.map((color) => {
                const isSelected = selectedColor === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setSelectedColor(color.id)}
                    className={`${styles.swatchBtn} ${
                      isSelected ? styles.swatchActive : ""
                    }`}
                    aria-label={`Select ${color.name} finish`}
                    aria-pressed={isSelected}
                  >
                    <span
                      className={styles.swatchFill}
                      style={{ backgroundColor: color.swatch }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.actionWrapper}>
            <button type="button" className={styles.preorderBtn}>
              <span className={styles.btnText}>Pre-order now</span>
              <span className={styles.btnThumb}>
                <Image
                  src="/images/lamp.jpg"
                  alt=""
                  fill
                  sizes="48px"
                  className={styles.thumbImage}
                />
              </span>
            </button>

            <p className={styles.disclaimer}>
              By clicking &ldquo;Pre-order now&rdquo; you agree to the{" "}
              <Link href="/terms">terms</Link> and{" "}
              <Link href="/privacy">privacy policy</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}