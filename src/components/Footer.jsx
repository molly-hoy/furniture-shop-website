// Footer: links, a newsletter sign-up, and the small print.
import { useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../data/categories.js";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>
            Hearth <span>&amp;</span> Grain
          </Link>
          <p>Solid-wood furniture and homeware, designed in Bristol and made to be lived with.</p>
        </div>

        <nav aria-label="Shop">
          <h2 className={styles.heading}>Shop</h2>
          <ul>
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link to={`/shop?category=${c.id}`}>{c.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={styles.heading}>Help</h2>
          <ul>
            <li>Delivery &amp; returns</li>
            <li>Care guides</li>
            <li>10-year frame guarantee</li>
            <li>Contact us</li>
          </ul>
        </div>

        <Newsletter />
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>© {new Date().getFullYear()} Hearth &amp; Grain. A fictional shop.</p>
        <p>Designed and built by [Your Name] as a portfolio project.</p>
      </div>
    </footer>
  );
}

/* A second, smaller component in the same file. It's only used here, so
   it doesn't need its own file. It shows a simple form with validation. */
function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter an email address like name@example.com.");
      return;
    }
    setError("");
    setSubscribed(true); // a real shop would send this to a mailing-list service
  }

  if (subscribed) {
    return (
      <div className={styles.newsletter} aria-live="polite">
        <h2 className={styles.heading}>You're on the list</h2>
        <p>This is a demo, so no email was saved. On a live shop this would sign you up.</p>
      </div>
    );
  }

  return (
    <form className={styles.newsletter} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.heading}>Letters from the workshop</h2>
      <p>New pieces and care tips, once a month.</p>
      <div className={styles.inputRow}>
        <label htmlFor="newsletter-email" className="visually-hidden">Email address</label>
        <input
          id="newsletter-email"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={error ? "true" : "false"}
          aria-describedby="newsletter-error"
        />
        <button type="submit" className="btn btn-primary">Sign up</button>
      </div>
      <p id="newsletter-error" className={styles.error} aria-live="polite">{error}</p>
    </form>
  );
}
