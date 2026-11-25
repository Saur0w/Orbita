import styles from "./style.module.scss";

interface PerspectiveTextProps {
  label: string;
  className?: string;
  isActive?: boolean;
}

export default function PerspectiveText({
  label,
  className = "",
  isActive = false,
}: PerspectiveTextProps) {
  return (
    <span
      className={`${styles.perspectiveText} ${className}`.trim()}
      data-active={isActive || undefined}
    >
      <span className={styles.inner}>
        <span className={styles.primary}>{label}</span>
        <span className={styles.secondary} aria-hidden="true">
          {label}
        </span>
      </span>
    </span>
  );
}