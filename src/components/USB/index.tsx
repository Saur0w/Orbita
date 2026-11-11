import React from "react";
import styles from "./style.module.scss";
import { Logo } from "@/components/Icons/logo";

const OTHER_INFO = [
  {
    label: "Battery Life",
    values: ["Up to 12 hours", "of continuous use"],
  },
  {
    label: "Charging",
    values: ["USB-C fast charging"],
  },
  {
    label: "Materials",
    values: ["Brushed aluminum", "Steel core", "Optical diffuser"],
  },
];

export default function USB() {
  return (
    <section className={styles.usbSection}>
      <div className={styles.container}>
        <div className={styles.contentRow}>
          <div className={styles.diagramCol}>
            <img
              src="/images/dimensions/usb.svg"
              alt="Orbita USB-C fast charging port diagram"
              className={styles.usbImg}
              draggable={false}
              loading="lazy"
            />
          </div>

          <div className={styles.diagramCol}>
            <img
              src="/images/dimensions/battery.png"
              alt="Orbita battery compartment diagram"
              className={styles.batteryImg}
              draggable={false}
              loading="lazy"
            />
          </div>

          <div className={styles.tableCol}>
            <div className={styles.infoTable}>
              <div className={styles.tableHeader}>
                <span>Other Info</span>
              </div>

              <dl className={styles.tableList}>
                {OTHER_INFO.map((item) => (
                  <div key={item.label} className={styles.tableRow}>
                    <dt>{item.label}</dt>
                    <dd>
                      {item.values.map((val, idx) => (
                        <span key={idx}>{val}</span>
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
