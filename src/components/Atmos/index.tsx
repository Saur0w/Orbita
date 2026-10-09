"use client";

import styles from "./style.module.scss";

export default function Atmos() {
  return (
      <section className={styles.atmos}>
          <div className={styles.header}>
              <span className={styles.tag}>[Key Features]</span>
              <h2 className={styles.title}>
                  <span>ONE LAMP</span>
                  <span>FOUR<sup>04</sup></span>
                  <span>ATMOSPHERES</span>
              </h2>
          </div>
      </section>
  );
}