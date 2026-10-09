"use client";

import styles from "./style.module.scss";

export default function Atmos() {
  return (
    <section className={styles.atmos}>
      <div className={styles.header}>
        <span className={styles.tag}>(Key Features)</span>
        <h1 className={styles.title}>
          <span>ONE LAMP</span>
          <span className={styles.fourRow}>
            FOUR<sup className={styles.sup}>(4)</sup>
          </span>
          <span>ATMOSPHERES</span>
        </h1>
      </div>
    </section>
  );
}