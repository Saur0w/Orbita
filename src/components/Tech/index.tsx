"use client";

import styles from "./style.module.scss";

const SCHEMATICS = [
  {
    id: "lamp",
    src: "/images/dimensions/lamp.svg",
    alt: "Full lamp dimensions: 38cm height, 26cm disc diameter, 12cm base diameter",
  },
  {
    id: "topView",
    src: "/images/dimensions/topView.svg",
    alt: "Top disc view: 26cm diameter",
  },
  {
    id: "base",
    src: "/images/dimensions/base.svg",
    alt: "Lamp base view: 18cm height",
  },
  {
    id: "stem",
    src: "/images/dimensions/stem.svg",
    alt: "Lamp stem view: 18cm height",
  },
];

const DIMENSIONS = [
  { label: "Height", value: "38cm" },
  { label: "Disc Diameter", value: "26cm" },
  { label: "Base Diameter", value: "12cm" },
  { label: "Weight", value: "12cm" },
];

export default function TechnicalSpecs() {
  return (
    <section className={styles.specsSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Technical Specifications</h2>

        <div className={styles.schematicsRow}>
          {SCHEMATICS.map((item) => (
            <div
              key={item.id}
              className={`${styles.schematicItem} ${styles[item.id]}`}
            >
              <img
                src={item.src}
                alt={item.alt}
                className={styles.schematicImg}
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.dimensionsTable}>
            <div className={`${styles.tableHeader} ${styles.tableRow}`}>
              <span>Dimensions</span>
            </div>

            <dl className={styles.tableList}>
              {DIMENSIONS.map((row) => (
                <div key={row.label} className={styles.tableRow}>
                  <dt>{row.label}</dt>
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
