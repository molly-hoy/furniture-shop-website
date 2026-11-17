/* QuantityControl: a "– 2 +" stepper.
   It doesn't store the number itself. The parent passes in `value` and an
   `onChange` function. This is called a "controlled component", and it
   keeps the real data in one place (the parent or the basket). */
import Icon from "./Icon.jsx";
import styles from "./QuantityControl.module.css";

export default function QuantityControl({ value, onChange, min = 1, max = 99, label = "Quantity", small = false }) {
  return (
    <div className={`${styles.stepper} ${small ? styles.small : ""}`} role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Icon name="minus" size={16} />
      </button>
      {/* aria-live so screen readers announce the new number */}
      <output aria-live="polite">{value}</output>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}
