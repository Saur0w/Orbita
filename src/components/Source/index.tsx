import React from "react";
import Image from "next/image";
import styles from "./style.module.scss";

const LIGHT_SOURCE_INFO = [
  { label: "Light Source", value: "Integrated LED module" },
  { label: "Brightness", value: "Up to 850 lumens" },
  { label: "Color Temperature", value: "Adjustable (2700K – 4000K)" },
];

export default function Source() {
  return (
    <section className={styles.source}>
      <div className={styles.container}>
        <div className={styles.diagramWrapper}>
          <Image
            src="/images/source.png"
            alt="Light Source Integrated LED Module"
            width={1774}
            height={887}
            priority
            className={styles.diagramImg}
          />
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.infoTable}>
            <div className={styles.tableHeader}>
              <span>Light source info</span>
            </div>

            <dl className={styles.tableList}>
              {LIGHT_SOURCE_INFO.map((row) => (
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
