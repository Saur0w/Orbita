"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./style.module.scss";
import { Logo } from "@/components/Icons/logo";

const OTHER_INFO = [
  { key: "batteryLife", lines: ["line1", "line2"] },
  { key: "charging", lines: ["line1"] },
  { key: "materials", lines: ["line1", "line2", "line3"] },
] as const;

export default function USB() {
  const t = useTranslations("USB");

  return (
      <section className={styles.usbSection}>
        <div className={styles.container}>
          <div className={styles.contentRow}>
            <div className={styles.diagramCol}>
              <Image
                  src="/images/dimensions/usb.svg"
                  alt={t("diagrams.usbAlt")}
                  width={0}
                  height={0}
                  unoptimized
                  className={styles.usbImg}
                  draggable={false}
              />
            </div>

            <div className={styles.diagramCol}>
              <Image
                  src="/images/dimensions/b.svg"
                  alt={t("diagrams.batteryAlt")}
                  width={0}
                  height={0}
                  unoptimized
                  className={styles.batteryImg}
                  draggable={false}
              />
            </div>

            <div className={styles.tableCol}>
              <div className={styles.infoTable}>
                <div className={styles.tableHeader}>
                  <span>{t("tableHeader")}</span>
                </div>

                <dl className={styles.tableList}>
                  {OTHER_INFO.map((item) => (
                      <div key={item.key} className={styles.tableRow}>
                        <dt>{t(`items.${item.key}.label`)}</dt>
                        <dd>
                          {item.lines.map((lineKey) => (
                              <span key={lineKey}>
                          {t(`items.${item.key}.${lineKey}`)}
                        </span>
                          ))}
                        </dd>
                      </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          <div className={styles.logoWrapper}>
            <div className={styles.logoGlow} />
            <Logo className={styles.logo} />
          </div>
        </div>
      </section>
  );
}