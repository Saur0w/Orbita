"use client";

import styles from "./style.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import PerspectiveText from "@/ui/PerspectiveText";

gsap.registerPlugin(SplitText, CustomEase, useGSAP);

CustomEase.create("preorderLuxury", "0.22, 1, 0.36, 1");

type ColorOption = "gold" | "silver";

interface ColorConfig {
    id: ColorOption;
    swatch: string;
    image: string;
}

const COLORS: ColorConfig[] = [
    {
        id: "gold",
        swatch: "#C28A3D",
        image: "/images/preorder_gold.jpg",
    },
    {
        id: "silver",
        swatch: "#C9C9C9",
        image: "/images/preorder_silver.jpg",
    },
];

export default function Preorder() {
    const t = useTranslations("Preorder");
    const locale = useLocale();

    const [selectedColor, setSelectedColor] = useState<ColorOption>("gold");
    const [quantity, setQuantity] = useState<number>(1);
    const contentRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const priceInnerRef = useRef<HTMLSpanElement>(null);
    const colorLabelRef = useRef<HTMLSpanElement>(null);
    const disclaimerRef = useRef<HTMLParagraphElement>(null);

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
                ...(priceInnerRef.current ? [priceInnerRef.current] : []),
                ...(colorLabelSplit ? colorLabelSplit.lines : []),
                ...(disclaimerSplit ? disclaimerSplit.lines : []),
            ];

            gsap.set(allLines, { yPercent: 120 });

            const tl = gsap.timeline({
                delay: 0.25,
                onComplete: () => {
                    colorLabelSplit?.revert();
                    disclaimerSplit?.revert();
                },
            });

            if (titleSplit.lines.length) {
                tl.to(
                    titleSplit.lines,
                    {
                        yPercent: 0,
                        duration: 1.75,
                        stagger: 0.14,
                        ease: "preorderLuxury",
                    },
                    0
                );
            }

            if (priceInnerRef.current) {
                tl.to(
                    priceInnerRef.current,
                    {
                        yPercent: 0,
                        duration: 1.55,
                        ease: "preorderLuxury",
                    },
                    0.2
                );
            }

            if (colorLabelSplit && colorLabelSplit.lines.length) {
                tl.to(
                    colorLabelSplit.lines,
                    {
                        yPercent: 0,
                        duration: 1.5,
                        ease: "preorderLuxury",
                    },
                    0.35
                );
            }

            if (disclaimerSplit && disclaimerSplit.lines.length) {
                tl.to(
                    disclaimerSplit.lines,
                    {
                        yPercent: 0,
                        duration: 1.5,
                        stagger: 0.1,
                        ease: "preorderLuxury",
                    },
                    0.46
                );
            }

            return () => {
                tl.kill();
                titleSplit.revert();
                colorLabelSplit?.revert();
                disclaimerSplit?.revert();
            };
        },
        { scope: contentRef, dependencies: [locale], revertOnUpdate: true }
    );

    return (
        <main className={styles.preorder}>
            <Link
                href="/"
                className={styles.homeBtn}
                aria-label={t("backHome")}
                data-perspective-trigger
            >
                <span className={styles.homeArrow}>←</span>
                <PerspectiveText label={t("backHome")} />
            </Link>

            <div className={styles.imageSection}>
                <div className={styles.imageWrapper}>
                    {COLORS.map((color) => {
                        const isActive = color.id === selectedColor;
                        const colorName = t(`colors.${color.id}`);
                        return (
                            <div
                                key={color.id}
                                className={`${styles.imageSlide} ${
                                    isActive ? styles.activeImage : ""
                                }`}
                            >
                                <Image
                                    src={color.image}
                                    alt={`${t("imageAlt")} — ${colorName}`}
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
                        {t("title")}
                    </h1>
                    <p className={styles.price}>
                        <span ref={priceInnerRef} className={styles.priceInner}>
                            €{800 * quantity}
                        </span>
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
                            {t("colorLabel")}
                        </span>
                        <div className={styles.swatches}>
                            {COLORS.map((color) => {
                                const isSelected = selectedColor === color.id;
                                const colorName = t(`colors.${color.id}`);
                                return (
                                    <button
                                        key={color.id}
                                        type="button"
                                        onClick={() => setSelectedColor(color.id)}
                                        className={`${styles.swatchBtn} ${
                                            isSelected ? styles.swatchActive : ""
                                        }`}
                                        aria-label={colorName}
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
                        <button
                            type="button"
                            className={styles.preorderBtn}
                            data-perspective-trigger
                        >
                            <span className={styles.btnText}>
                                <PerspectiveText label={t("ctaButton")} />
                            </span>
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
                            {t.rich("disclaimer", {
                                terms: (chunks) => <Link href="/">{chunks}</Link>,
                                privacy: (chunks) => <Link href="/">{chunks}</Link>,
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}