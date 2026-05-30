import { useState } from 'react';

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT;

export default function LeadModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');

  if (!isOpen) return null;
  if (!FORMSPREE_ENDPOINT) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (honeypot) {
      setSubmitted(true);
      return;
    }
    try {
      await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Fail silently — don't block the user on a lead capture error
    }
    setSubmitted(true);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Get landlord tool updates">
      <div className="modal-card">
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        {submitted ? (
          <div className="modal-success">
            <div className="modal-success__icon" aria-hidden="true">✓</div>
            <h3>You're on the list.</h3>
            <p>We'll send new landlord tools straight to your inbox — no spam.</p>
            <button type="button" className="btn btn-outline" onClick={onClose} style={{ marginTop: '1rem' }}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="modal-check" aria-hidden="true">✓</div>
            <h3 className="modal-title">Letter Generated.</h3>
            <p className="modal-body">
              Building more tools for landlords — state-specific deadline
              guidance, move-in checklists, and notice generators. Want early
              access?
            </p>
            <form onSubmit={handleSubmit} className="modal-form">
              <label htmlFor="modal-email" className="modal-label">
                Your email
              </label>
              <input
                id="modal-email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="modal-input"
              />
              <input
                type="text"
                name="_gotcha"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex="-1"
                autoComplete="off"
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
              />
              <button type="submit" className="btn btn-primary modal-submit">
                Get Free Updates
              </button>
            </form>
            <button
              type="button"
              className="modal-skip"
              onClick={onClose}
            >
              No thanks, just the letter
            </button>
          </>
        )}
      </div>
    </div>
  );
}
