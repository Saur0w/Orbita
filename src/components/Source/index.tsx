"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./style.module.scss";

const SOURCE_KEYS = ["lightSource", "brightness", "colorTemperature"] as const;

export default function Source() {
  const t = useTranslations("Source");

  return (
      <section className={styles.source}>
        <div className={styles.container}>
          <div className={styles.diagramWrapper}>
            <Image
                src="/images/source.png"
                alt={t("diagramAlt")}
                width={1774}
                height={887}
                priority
                className={styles.diagramImg}
            />
          </div>

          <div className={styles.tableContainer}>
            <div className={styles.infoTable}>
              <div className={styles.tableHeader}>
                <span>{t("tableHeader")}</span>
              </div>

              <dl className={styles.tableList}>
                {SOURCE_KEYS.map((key) => (
                    <div key={key} className={styles.tableRow}>
                      <dt>{t(`items.${key}.label`)}</dt>
                      <dd>{t(`items.${key}.value`)}</dd>
                    </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>
  );
}