/* ==========================================================================
   Checkout page
   --------------------------------------------------------------------------
   A form for contact and delivery details, with validation written in
   React. Compare it with booking.js from Project 1: there we changed the
   page by hand (textContent, setAttribute). Here we only update STATE
   (`values`, `errors`) and React redraws the form to match.

   No payment details are collected. A real shop would hand this step to a
   payment provider such as Stripe, so card numbers never touch its own code.
   ========================================================================== */
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import OrderSummary from "../components/OrderSummary.jsx";
import { formatPrice } from "../utils/format.js";
import styles from "./Checkout.module.css";

const EXPRESS_PRICE = 14.95;

// The form's starting values. One object holds every field.
const EMPTY_FORM = {
  email: "",
  firstName: "",
  lastName: "",
  address1: "",
  address2: "",
  city: "",
  postcode: "",
  delivery: "standard",
};

// Validation rules: each returns an error message, or "" if the value is fine.
const RULES = {
  email: (v) =>
    !v.trim() ? "Enter your email address."
    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "Enter an email address like name@example.com."
    : "",
  firstName: (v) => (!v.trim() ? "Enter your first name." : ""),
  lastName: (v) => (!v.trim() ? "Enter your last name." : ""),
  address1: (v) => (!v.trim() ? "Enter the first line of your address." : ""),
  city: (v) => (!v.trim() ? "Enter your town or city." : ""),
  // UK postcodes, e.g. "BS1 4DJ", "SW1A 1AA" (the space is optional).
  postcode: (v) =>
    !v.trim() ? "Enter your postcode."
    : !/^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i.test(v.trim()) ? "Enter a UK postcode, like BS1 4DJ."
    : "",
};

// Labels used in the error summary at the top of the form.
const LABELS = {
  email: "Email",
  firstName: "First name",
  lastName: "Last name",
  address1: "Address line 1",
  city: "Town or city",
  postcode: "Postcode",
};

export default function Checkout() {
  const cart = useCart();
  const navigate = useNavigate();
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const errorSummaryRef = useRef(null);

  if (cart.items.length === 0) {
    return (
      <div className="container page">
        <div className="page-title">
          <h1>Checkout</h1>
          <p>Your basket is empty, so there's nothing to check out yet.</p>
        </div>
        <Link to="/shop" className="btn btn-dark">Browse the shop</Link>
      </div>
    );
  }

  const delivery = values.delivery === "express" ? EXPRESS_PRICE : cart.standardDelivery;

  // One change handler for every field. `name` on each input matches a key
  // in `values`, so [name]: value updates the right one.
  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));

    // If this field already shows an error, re-check it as the user types.
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: RULES[name](value) }));
    }
  }

  // Check a field when the user leaves it (but not if they left it empty
  // without typing, which would feel naggy).
  function handleBlur(event) {
    const { name, value } = event.target;
    if (RULES[name] && value) {
      setErrors((current) => ({ ...current, [name]: RULES[name](value) }));
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    // Run every rule. Object.entries turns { email: fn, ... } into [["email", fn], ...].
    const newErrors = {};
    Object.entries(RULES).forEach(([field, rule]) => {
      const message = rule(values[field]);
      if (message) newErrors[field] = message;
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setShowSummary(true);
      // Wait one frame for React to draw the summary, then move focus to it.
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }

    // Everything's valid: build the order and go to the confirmation page.
    const order = {
      number: `HG-${Math.floor(100000 + Math.random() * 900000)}`,
      email: values.email.trim(),
      name: `${values.firstName.trim()} ${values.lastName.trim()}`,
      address: [values.address1, values.address2, values.city, values.postcode.toUpperCase()]
        .map((line) => line.trim())
        .filter(Boolean),
      delivery: values.delivery === "express" ? "Express, next working day" : "Standard, 3–5 working days",
      items: cart.items,
      subtotal: cart.subtotal,
      deliveryCost: delivery,
    };

    cart.clearBasket();
    // `state` passes the order to the next page without putting it in the address.
    navigate("/order-confirmed", { state: { order } });
  }

  // Shared props for each text field, so the JSX below stays short.
  const fieldProps = (name) => ({
    id: name,
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    "aria-invalid": errors[name] ? "true" : "false",
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  // The error message under a field, or nothing if it's valid.
  const errorText = (name) =>
    errors[name] ? <p id={`${name}-error`} className="field-error">{errors[name]}</p> : null;

  const errorList = Object.entries(errors).filter(([, message]) => message);

  return (
    <div className="container page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link to="/basket">Basket</Link></li>
          <li aria-current="page">Checkout</li>
        </ol>
      </nav>
      <div className="page-title" style={{ marginTop: "1rem" }}>
        <h1>Checkout</h1>
      </div>

      <div className={styles.layout}>
        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          {/* Error summary: lists every problem with a link to the field. */}
          {showSummary && errorList.length > 0 && (
            <div className={styles.errorSummary} ref={errorSummaryRef} tabIndex={-1} role="alert">
              <h2>There's a problem with your details</h2>
              <ul>
                {errorList.map(([field, message]) => (
                  <li key={field}>
                    <a href={`#${field}`} onClick={(e) => { e.preventDefault(); document.getElementById(field)?.focus(); }}>
                      {LABELS[field]}: {message}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <fieldset className={styles.section}>
            <legend>1. Contact</legend>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input type="email" autoComplete="email" {...fieldProps("email")} />
              <p className="field-hint">We'll send your order confirmation here.</p>
              {errorText("email")}
            </div>
          </fieldset>

          <fieldset className={styles.section}>
            <legend>2. Delivery address</legend>
            <div className={styles.twoCol}>
              <div className="field">
                <label htmlFor="firstName">First name</label>
                <input type="text" autoComplete="given-name" {...fieldProps("firstName")} />
                {errorText("firstName")}
              </div>
              <div className="field">
                <label htmlFor="lastName">Last name</label>
                <input type="text" autoComplete="family-name" {...fieldProps("lastName")} />
                {errorText("lastName")}
              </div>
            </div>
            <div className="field">
              <label htmlFor="address1">Address line 1</label>
              <input type="text" autoComplete="address-line1" {...fieldProps("address1")} />
              {errorText("address1")}
            </div>
            <div className="field">
              <label htmlFor="address2">Address line 2 <span className={styles.optional}>(optional)</span></label>
              <input type="text" autoComplete="address-line2" {...fieldProps("address2")} />
            </div>
            <div className={styles.twoCol}>
              <div className="field">
                <label htmlFor="city">Town or city</label>
                <input type="text" autoComplete="address-level2" {...fieldProps("city")} />
                {errorText("city")}
              </div>
              <div className="field">
                <label htmlFor="postcode">Postcode</label>
                <input type="text" autoComplete="postal-code" className={styles.postcode} {...fieldProps("postcode")} />
                {errorText("postcode")}
              </div>
            </div>
          </fieldset>

          <fieldset className={styles.section}>
            <legend>3. Delivery method</legend>
            <div className={styles.options}>
              <label className={styles.option}>
                <input type="radio" name="delivery" value="standard" checked={values.delivery === "standard"} onChange={handleChange} />
                <span>
                  <strong>Standard</strong>
                  <span className={styles.optional}>3–5 working days</span>
                </span>
                <strong>{cart.standardDelivery === 0 ? "Free" : formatPrice(cart.standardDelivery)}</strong>
              </label>
              <label className={styles.option}>
                <input type="radio" name="delivery" value="express" checked={values.delivery === "express"} onChange={handleChange} />
                <span>
                  <strong>Express</strong>
                  <span className={styles.optional}>Next working day if ordered by 2pm</span>
                </span>
                <strong>{formatPrice(EXPRESS_PRICE)}</strong>
              </label>
            </div>
          </fieldset>

          <fieldset className={styles.section}>
            <legend>4. Payment</legend>
            <p className={styles.demo}>
              This is a demo shop, so no payment is taken. On a live site this step would
              hand over to a secure payment provider such as Stripe.
            </p>
          </fieldset>

          <button type="submit" className="btn btn-primary btn-block">
            Place order · {formatPrice(cart.subtotal + delivery)}
          </button>
        </form>

        <OrderSummary
          items={cart.items}
          subtotal={cart.subtotal}
          delivery={delivery}
          deliveryLabel={values.delivery === "express" ? "Express delivery" : "Standard delivery"}
          showItems
        />
      </div>
    </div>
  );
}
