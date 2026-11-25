import { useEffect, useId, useRef, useState } from "react";
import { BUDGET, ENGAGE, P, SERVICES, TIMELINE, svcFormName } from "../data/site.js";
import { leadText, sendLead, sleep, validEmail, validPhone } from "../lib/lead.js";

/* Free-consultation form: client-side validation, optional backend, WhatsApp hand-off */
export default function LeadForm({ pre = "" }) {
  const id = useId();
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [waHref, setWaHref] = useState();
  const [sendError, setSendError] = useState("");
  const doneRef = useRef(null);

  useEffect(() => {
    if (status === "sent") doneRef.current?.focus();
  }, [status]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.website.value) return; // honeypot
    const errs = {
      name: form.elements.name.value.trim().length < 2 ? "Enter your full name." : "",
      email: validEmail(form.email.value) ? "" : "Enter a valid email address.",
      phone: validPhone(form.phone.value) ? "" : "Enter a valid phone number.",
      service: form.service.value ? "" : "Choose a service.",
      message: form.message.value.trim().length < 5 ? "Tell us briefly what you need." : "",
      agree: form.agree.checked ? "" : "Please accept the Privacy Policy.",
    };
    setErrors(errs);
    const firstBad = Object.keys(errs).find((k) => errs[k]);
    if (firstBad) {
      if (firstBad !== "agree") form.elements[firstBad].focus();
      return;
    }
    setStatus("sending");
    setSendError("");
    const d = Object.fromEntries(new FormData(form));
    d.source = "Website form";
    const [ok] = await Promise.all([sendLead(d), sleep(700)]);
    setWaHref(`${P.wa}?text=${encodeURIComponent(leadText(d))}`);
    if (!ok) {
      setStatus("idle");
      setSendError("We couldn't send your request right now. Please try again, or send it to us on WhatsApp.");
      return;
    }
    setStatus("sent");
  };

  const onInput = (e) => {
    const n = e.target.name;
    if (errors[n]) setErrors((x) => ({ ...x, [n]: "" }));
  };

  const fld = (n, l, t = "text", ac = "", req = true) => (
    <div className={`field${errors[n] ? " bad" : ""}`}>
      <label htmlFor={`${id}-${n}`}>
        {l}
        {req ? " *" : ""}
      </label>
      <input id={`${id}-${n}`} name={n} type={t} autoComplete={ac} />
      <span className="err" aria-live="polite">
        {errors[n] || ""}
      </span>
    </div>
  );
  const sel = (n, l, ph, arr, req, selv = "") => (
    <div className={`field${errors[n] ? " bad" : ""}`}>
      <label htmlFor={`${id}-${n}`}>
        {l}
        {req ? " *" : ""}
      </label>
      <select id={`${id}-${n}`} name={n} defaultValue={selv}>
        <option value="">{ph}</option>
        {arr.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <span className="err" aria-live="polite">
        {errors[n] || ""}
      </span>
    </div>
  );

  const sending = status === "sending";
  return (
    <form className={`lead-form${status === "sent" ? " sent" : ""}`} noValidate onSubmit={onSubmit} onInput={onInput} onChange={onInput}>
      {fld("name", "Full name", "text", "name")}
      {fld("email", "Email", "email", "email")}
      {fld("phone", "Phone / WhatsApp", "tel", "tel")}
      {fld("company", "Company (optional)", "text", "organization", false)}
      {sel("service", "Service", "Select service...", SERVICES.map(svcFormName), true, pre)}
      {sel("engagement", "Engagement (optional)", "Select engagement...", ENGAGE, false)}
      {sel("budget", "Budget (optional)", "Select budget...", BUDGET, false)}
      {sel("timeline", "Timeline (optional)", "Select timeline...", TIMELINE, false)}
      <div className={`field full${errors.message ? " bad" : ""}`}>
        <label htmlFor={`${id}-message`}>Project details *</label>
        <textarea id={`${id}-message`} name="message" rows="4"></textarea>
        <span className="err" aria-live="polite">
          {errors.message || ""}
        </span>
      </div>
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <label className={`agree full${errors.agree ? " bad" : ""}`}>
        <input type="checkbox" name="agree" /> I agree to the{" "}
        <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a>
      </label>
      {sendError && (
        <p className="full" role="alert" style={{ color: "var(--danger)", fontSize: ".9rem", fontWeight: 600 }}>
          {sendError}{" "}
          <a href={waHref} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
            Send on WhatsApp
          </a>
        </p>
      )}
      <button className={`btn btn-primary submit${sending ? " loading" : ""}`} type="submit" disabled={sending}>
        <span>{sending ? "Sending..." : "Request Free Consultation"}</span>
      </button>
      <div className="form-done" role="status" tabIndex={-1} ref={doneRef}>
        <svg className="tick" viewBox="0 0 72 72" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
          <circle cx="36" cy="36" r="33" />
          <path d="M22 37l10 10 19-21" />
        </svg>
        <h3>Request received</h3>
        <p>Our team will contact you within 24 hours with your free consultation and cost estimate.</p>
        <div className="done-row">
          <a className="btn btn-primary wa-send" href={waHref} target="_blank" rel="noopener noreferrer">
            Send details on WhatsApp
          </a>
          <a className="btn btn-ghost" href="/">
            Back to Home
          </a>
        </div>
      </div>
    </form>
  );
}
