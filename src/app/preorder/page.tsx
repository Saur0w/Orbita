"use client";

import styles from "./style.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, CustomEase, useGSAP);

CustomEase.create("luxuryMask", "0.16, 1, 0.3, 1");

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
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const priceRef = useRef<HTMLParagraphElement>(null);
  const colorLabelRef = useRef<HTMLSpanElement>(null);
  const disclaimerRef = useRef<HTMLParagraphElement>(null);

  const activeColorConfig =
    COLORS.find((c) => c.id === selectedColor) || COLORS[0];

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  useGSAP(
    () => {
      if (!titleRef.current) return;

      const titleSplit = new SplitText(titleRef.current, {
        type: "lines",
        mask: "lines",
        linesClass: `${styles.splitLine} splitLine`,
      });

      let priceSplit: SplitText | null = null;
      if (priceRef.current) {
        priceSplit = new SplitText(priceRef.current, {
          type: "lines",
          mask: "lines",
          linesClass: `${styles.splitLine} splitLine`,
        });
      }

      let colorLabelSplit: SplitText | null = null;
      if (colorLabelRef.current) {
        colorLabelSplit = new SplitText(colorLabelRef.current, {
          type: "lines",
          mask: "lines",
          linesClass: `${styles.splitLine} splitLine`,
        });
      }

      let disclaimerSplit: SplitText | null = null;
      if (disclaimerRef.current) {
        disclaimerSplit = new SplitText(disclaimerRef.current, {
          type: "lines",
          mask: "lines",
          linesClass: `${styles.splitLine} splitLine`,
        });
      }

      const allLines = [
        ...titleSplit.lines,
        ...(priceSplit ? priceSplit.lines : []),
        ...(colorLabelSplit ? colorLabelSplit.lines : []),
        ...(disclaimerSplit ? disclaimerSplit.lines : []),
      ];

      gsap.set(allLines, { yPercent: 115 });

      const tl = gsap.timeline({
        delay: 0.1,
        onComplete: () => {
          priceSplit?.revert();
          colorLabelSplit?.revert();
          disclaimerSplit?.revert();
        },
      });

      if (titleSplit.lines.length) {
        tl.to(
          titleSplit.lines,
          {
            delay: 0.3,
            yPercent: 0,
            duration: 1.4,
            stagger: 0.08,
            ease: "luxuryMask",
          },
          0
        );
      }

      if (priceSplit && priceSplit.lines.length) {
        tl.to(
          priceSplit.lines,
          {
            yPercent: 0,
            duration: 1.35,
            ease: "luxuryMask",
          },
          0.12
        );
      }

      if (colorLabelSplit && colorLabelSplit.lines.length) {
        tl.to(
          colorLabelSplit.lines,
          {
            yPercent: 0,
            duration: 1.25,
            ease: "luxuryMask",
          },
          0.22
        );
      }

      if (disclaimerSplit && disclaimerSplit.lines.length) {
        tl.to(
          disclaimerSplit.lines,
          {
            yPercent: 0,
            duration: 1.25,
            stagger: 0.06,
            ease: "luxuryMask",
          },
          0.32
        );
      }

      return () => {
        tl.kill();
        titleSplit.revert();
        priceSplit?.revert();
        colorLabelSplit?.revert();
        disclaimerSplit?.revert();
      };
    },
    { scope: contentRef }
  );

  return (
    <main className={styles.preorder}>
      <Link href="/" className={styles.homeBtn} aria-label="Go to home page">
        <span className={styles.homeArrow}>←</span>
        <span>Home</span>
      </Link>

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

      <div className={styles.content} ref={contentRef}>
        <div className={styles.contentInner}>
          <h1 className={styles.title} ref={titleRef}>
            Pre-order Orbital Lamp
          </h1>
          <p className={styles.price} ref={priceRef}>
            €{800 * quantity}
          </p>

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
            <span className={styles.colorLabel} ref={colorLabelRef}>
              Color
            </span>
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

            <p className={styles.disclaimer} ref={disclaimerRef}>
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