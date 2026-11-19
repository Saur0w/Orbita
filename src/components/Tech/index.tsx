"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./style.module.scss";

type SchematicId = "lamp" | "topView" | "base" | "stem";
type DimensionKey = "height" | "discDiameter" | "baseDiameter" | "weight";

const SCHEMATICS: { id: SchematicId; src: string }[] = [
  { id: "lamp", src: "/images/dimensions/lamp.svg" },
  { id: "topView", src: "/images/dimensions/topView.svg" },
  { id: "base", src: "/images/dimensions/base.svg" },
  { id: "stem", src: "/images/dimensions/stem.svg" },
];

const DIMENSIONS: { key: DimensionKey; value: string }[] = [
  { key: "height", value: "38cm" },
  { key: "discDiameter", value: "26cm" },
  { key: "baseDiameter", value: "12cm" },
  { key: "weight", value: "12cm" },
];

export default function TechnicalSpecs() {
  const t = useTranslations("TechnicalSpecs");

  return (
      <section className={styles.specsSection} id="specification">
        <div className={styles.container}>
          <h2 className={styles.title}>{t("title")}</h2>

          <div className={styles.schematicsRow}>
            {SCHEMATICS.map((item) => (
                <div
                    key={item.id}
                    className={`${styles.schematicItem} ${styles[item.id]}`}
                >
                  <Image
                      src={item.src}
                      alt={t(`schematics.${item.id}`)}
                      width={0}
                      height={0}
                      unoptimized
                      className={styles.schematicImg}
                      draggable={false}
                  />
                </div>
            ))}
          </div>

          <div className={styles.tableContainer}>
            <div className={styles.dimensionsTable}>
              <div className={`${styles.tableHeader} ${styles.tableRow}`}>
                <span>{t("tableHeader")}</span>
              </div>

              <dl className={styles.tableList}>
                {DIMENSIONS.map((row) => (
                    <div key={row.key} className={styles.tableRow}>
                      <dt>{t(`dimensions.${row.key}`)}</dt>
                      <dd>{row.value}</dd>
                    </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>
  );
}