"use client";

import styles from "./style.module.scss";

export default function Atmos() {
  return (
      <section className={styles.atmos}>
          <div className={styles.header}>
              <span className={styles.tag}>[Key Features]</span>
              <h1>
                  One <br /><span>Four<sup>4</sup><br />Atmosphere</span>
              </h1>
          </div>
      </section>
  );
}