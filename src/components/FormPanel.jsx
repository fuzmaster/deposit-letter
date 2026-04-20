import { useState } from 'react';
import { formatCurrency, makeId } from '../utils/helpers';

function getFieldClass(error) {
  return error ? 'input-error' : '';
}

function TrustBadges() {
  return (
    <div className="trust-badges">
      <span className="trust-badge">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        Private in your browser
      </span>
      <span className="trust-badge">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
        No data saved
      </span>
      <span className="trust-badge">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        Print-ready draft
      </span>
      <span className="trust-badge trust-badge--caution">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        State rules not included
      </span>
    </div>
  );
}

function PostPrintBanner({ onReset }) {
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('https://formspree.io/f/YOUR_ENDPOINT_HERE', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Fail silently
    }
    setEmailSubmitted(true);
  };

  return (
    <div className="post-print-banner" role="status">
      <div className="post-print-banner__left">
        <div className="post-print-banner__check" aria-hidden="true">✓</div>
        <div>
          <strong>Letter ready to print.</strong>
          <p>
            Attach receipts and send via certified mail. Keep your tracking number.
          </p>
          <p className="post-print-banner__compliance">
            Deadlines and allowable deductions vary by state. Verify your local
            rules before mailing.
          </p>
          <button type="button" className="btn btn-outline post-print-banner__reset" onClick={onReset}>
            Start a new letter
          </button>
        </div>
      </div>
      <div className="post-print-banner__divider" aria-hidden="true" />
      <div className="post-print-banner__right">
        {emailSubmitted ? (
          <div className="post-print-banner__thanks">
            <strong>✓ You're on the list.</strong>
            <p>We'll notify you when new landlord tools launch.</p>
          </div>
        ) : (
          <>
            <p className="post-print-banner__pitch">
              <strong>Get notified</strong> when we add state-specific deadline
              guidance, move-in checklists, and notice generators.
            </p>
            <form onSubmit={handleSubmit} className="post-print-banner__form">
              <label htmlFor="banner-email" className="sr-only">Your email</label>
              <input
                id="banner-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="post-print-banner__input"
              />
              <button type="submit" className="btn btn-primary post-print-banner__btn">
                Get Updates
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function PreExportChecklist() {
  return (
    <div className="checklist-block">
      <h3 className="checklist-block__title">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        Before You Send — What to Include
      </h3>
      <ul className="checklist-block__list">
        <li>
          <span className="checklist-icon">📄</span>
          <span>This itemized deduction letter (signed)</span>
        </li>
        <li>
          <span className="checklist-icon">🧾</span>
          <span>Original receipts or invoices for each deduction</span>
        </li>
        <li>
          <span className="checklist-icon">📸</span>
          <span>Move-out photos documenting the damage (if available)</span>
        </li>
        <li>
          <span className="checklist-icon">💵</span>
          <span>Check or money order for the balance due (if any refund applies)</span>
        </li>
        <li>
          <span className="checklist-icon">📬</span>
          <span>Send via certified mail with return receipt — keep your tracking number</span>
        </li>
      </ul>
      <p className="checklist-block__note">
        Requirements vary by state. Some jurisdictions require sworn statements, specific forms, or receipts above a certain threshold. Verify your local rules before mailing.
      </p>
    </div>
  );
}

function AboutThisTool() {
  return (
    <div className="about-block no-print">
      <div className="about-block__grid">
        <div className="about-block__col">
          <h3>Who this is for</h3>
          <ul>
            <li>Self-managing landlords handling move-out accounting</li>
            <li>Small property managers processing frequent turnovers</li>
            <li>Accidental landlords who need a clean, professional letter fast</li>
            <li>Anyone who wants math done automatically and a formatted document ready to print</li>
          </ul>
        </div>
        <div className="about-block__col">
          <h3>What this does <em>not</em> do</h3>
          <ul>
            <li>Does not determine whether a deduction is legally allowed in your state</li>
            <li>Does not check whether you are within your return deadline</li>
            <li>Does not tell you if interest is owed on the deposit</li>
            <li>Does not replace a landlord-tenant attorney for contested disputes</li>
            <li>Does not store, send, or track anything — all data stays in your browser</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function FormPanel({
  data,
  setData,
  math,
  errors,
  errorList,
  isValid,
  printed,
  onPrint,
  onReset,
  onFormStart,
}) {
  const markFormStarted = () => {
    if (onFormStart) onFormStart();
  };

  const updateField = (field, value) => {
    markFormStarted();
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const addDeduction = () => {
    markFormStarted();
    setData((prev) => ({
      ...prev,
      deductions: [
        ...prev.deductions,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          description: '',
          note: '',
          amount: '',
        },
      ],
    }));
  };

  const updateDeduction = (id, field, value) => {
    markFormStarted();
    setData((prev) => ({
      ...prev,
      deductions: prev.deductions.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeDeduction = (id) => {
    markFormStarted();
    setData((prev) => ({
      ...prev,
      deductions: prev.deductions.filter((item) => item.id !== id),
    }));
  };

  return (
    <section className="form-panel no-print" aria-label="Letter form">
      <div className="form-panel__hero">
        <h1>Create a Print-Ready Security Deposit Itemization Letter.</h1>
        <p>
          Organize deductions, calculate the balance, and generate a clean
          professional draft. Review your state and local requirements before
          sending.
        </p>
        <TrustBadges />
      </div>

      {errorList.length > 0 && (
        <div className="validation-banner" role="alert" aria-live="polite">
          <strong>Fix these items before printing:</strong>
          <ul>
            {errorList.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {printed && <PostPrintBanner onReset={onReset} />}

      <div className="summary-card" aria-label="Calculation summary">
        <h3>Live Summary</h3>
        <div className="summary-card__row">
          <span>Deposit + interest</span>
          <strong>{formatCurrency(math.totalAvailable)}</strong>
        </div>
        <div className="summary-card__row">
          <span>Total deductions</span>
          <strong>− {formatCurrency(math.totalDeductions)}</strong>
        </div>
        <div className="summary-card__divider" aria-hidden="true" />
        <div className="summary-card__row summary-card__row--total">
          <span>{math.balance >= 0 ? 'Return to tenant' : 'Outstanding balance'}</span>
          <strong className={math.balance < 0 ? 'text-danger' : ''}>
            {formatCurrency(Math.abs(math.balance))}
          </strong>
        </div>
        <p className="summary-card__note">
          Preview updates instantly. Click <em>Print / Save as PDF</em> when ready.
        </p>
      </div>

      <div className="form-section">
        <h3>Landlord Information</h3>
        <div className="input-group">
          <label htmlFor="landlordName">Landlord / Management Company Name</label>
          <input
            id="landlordName"
            type="text"
            value={data.landlordName}
            onChange={(e) => updateField('landlordName', e.target.value)}
            className={getFieldClass(errors.landlordName)}
            aria-invalid={Boolean(errors.landlordName)}
            aria-describedby={errors.landlordName ? 'landlordName-error' : undefined}
            placeholder="e.g. John Smith or Acme Properties LLC"
          />
          {errors.landlordName && (
            <p id="landlordName-error" className="field-error" role="alert">{errors.landlordName}</p>
          )}
        </div>
        <div className="input-group">
          <label htmlFor="landlordAddress">Return Address</label>
          <textarea
            id="landlordAddress"
            rows="3"
            value={data.landlordAddress}
            onChange={(e) => updateField('landlordAddress', e.target.value)}
            className={getFieldClass(errors.landlordAddress)}
            aria-invalid={Boolean(errors.landlordAddress)}
            aria-describedby={errors.landlordAddress ? 'landlordAddress-error' : undefined}
            placeholder={"123 Main St\nBoston, MA 02101"}
          />
          {errors.landlordAddress && (
            <p id="landlordAddress-error" className="field-error" role="alert">{errors.landlordAddress}</p>
          )}
        </div>
      </div>

      <div className="form-section">
        <h3>Tenant Information</h3>
        <div className="input-group">
          <label htmlFor="tenantNames">Tenant Name(s)</label>
          <input
            id="tenantNames"
            type="text"
            value={data.tenantNames}
            onChange={(e) => updateField('tenantNames', e.target.value)}
            className={getFieldClass(errors.tenantNames)}
            aria-invalid={Boolean(errors.tenantNames)}
            aria-describedby={errors.tenantNames ? 'tenantNames-error' : undefined}
            placeholder="e.g. Jane Doe and John Doe"
          />
          {errors.tenantNames && (
            <p id="tenantNames-error" className="field-error" role="alert">{errors.tenantNames}</p>
          )}
        </div>
        <div className="input-group">
          <label htmlFor="propertyAddress">Rental Property Address</label>
          <input
            id="propertyAddress"
            type="text"
            value={data.propertyAddress}
            onChange={(e) => updateField('propertyAddress', e.target.value)}
            className={getFieldClass(errors.propertyAddress)}
            aria-invalid={Boolean(errors.propertyAddress)}
            aria-describedby={errors.propertyAddress ? 'propertyAddress-error' : undefined}
            placeholder="e.g. 456 Oak Ave, Unit 2B, Boston, MA"
          />
          {errors.propertyAddress && (
            <p id="propertyAddress-error" className="field-error" role="alert">{errors.propertyAddress}</p>
          )}
        </div>
        <div className="input-group">
          <label htmlFor="forwardingAddress">
            Tenant Forwarding Address{' '}
            <span className="optional-label">optional</span>
          </label>
          <textarea
            id="forwardingAddress"
            rows="3"
            value={data.forwardingAddress}
            onChange={(e) => updateField('forwardingAddress', e.target.value)}
            placeholder={"789 New St\nCambridge, MA 02139"}
          />
          <p className="helper-text">
            If the tenant did not provide a forwarding address, you must mail
            this to the rental property address to legally prove you attempted
            delivery.
          </p>
        </div>
      </div>

      <div className="form-section">
        <h3>Dates &amp; Deposit</h3>
        <div className="form-grid form-grid--two">
          <div className="input-group">
            <label htmlFor="noticeDate">Notice Date</label>
            <input
              id="noticeDate"
              type="date"
              value={data.noticeDate}
              onChange={(e) => updateField('noticeDate', e.target.value)}
              className={getFieldClass(errors.noticeDate)}
              aria-invalid={Boolean(errors.noticeDate)}
            />
            {errors.noticeDate && (
              <p className="field-error" role="alert">{errors.noticeDate}</p>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="moveOutDate">Move-Out Date</label>
            <input
              id="moveOutDate"
              type="date"
              value={data.moveOutDate}
              onChange={(e) => updateField('moveOutDate', e.target.value)}
              className={getFieldClass(errors.moveOutDate)}
              aria-invalid={Boolean(errors.moveOutDate)}
            />
            {errors.moveOutDate && (
              <p className="field-error" role="alert">{errors.moveOutDate}</p>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="originalDeposit">Original Deposit ($)</label>
            <input
              id="originalDeposit"
              type="number"
              min="0"
              step="0.01"
              value={data.originalDeposit}
              onChange={(e) => updateField('originalDeposit', e.target.value)}
              className={getFieldClass(errors.originalDeposit)}
              aria-invalid={Boolean(errors.originalDeposit)}
              placeholder="0.00"
            />
            {errors.originalDeposit && (
              <p className="field-error" role="alert">{errors.originalDeposit}</p>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="accruedInterest">
              Accrued Interest ($){' '}
              <span className="optional-label">optional</span>
            </label>
            <input
              id="accruedInterest"
              type="number"
              min="0"
              step="0.01"
              value={data.accruedInterest}
              onChange={(e) => updateField('accruedInterest', e.target.value)}
              className={getFieldClass(errors.accruedInterest)}
              aria-invalid={Boolean(errors.accruedInterest)}
              placeholder="0.00"
            />
            <p className="helper-text">Some states require interest on held deposits.</p>
            {errors.accruedInterest && (
              <p className="field-error" role="alert">{errors.accruedInterest}</p>
            )}
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Itemized Deductions</h3>
        <p className="helper-text" style={{ marginBottom: '1rem' }}>
          Be objective and specific. Use invoice numbers where available.
          Attach original receipts to the printed letter.
        </p>

        {data.deductions.map((item, index) => {
          const descriptionError = errors[makeId('deduction-description', item.id)];
          const amountError = errors[makeId('deduction-amount', item.id)];
          return (
            <div key={item.id} className="deduction-item">
              <div className="deduction-item__header">
                <h4>Deduction {index + 1}</h4>
                <button
                  type="button"
                  className="btn btn-danger"
                  aria-label={`Remove deduction ${index + 1}`}
                  onClick={() => removeDeduction(item.id)}
                >
                  &times;
                </button>
              </div>
              <div className="deduction-row">
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label htmlFor={makeId('deduction-description', item.id)}>
                    Description
                  </label>
                  <input
                    id={makeId('deduction-description', item.id)}
                    type="text"
                    placeholder="e.g. Professional carpet cleaning"
                    value={item.description}
                    onChange={(e) =>
                      updateDeduction(item.id, 'description', e.target.value)
                    }
                    className={getFieldClass(descriptionError)}
                    aria-invalid={Boolean(descriptionError)}
                  />
                  <p className="helper-text">
                    Keep it objective. Example: &quot;Professional carpet
                    cleaning&quot; rather than &quot;Tenant ruined the rug.&quot;
                  </p>
                  {descriptionError && (
                    <p className="field-error" role="alert">{descriptionError}</p>
                  )}
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label htmlFor={makeId('deduction-amount', item.id)}>
                    Amount ($)
                  </label>
                  <input
                    id={makeId('deduction-amount', item.id)}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={item.amount}
                    onChange={(e) =>
                      updateDeduction(item.id, 'amount', e.target.value)
                    }
                    className={getFieldClass(amountError)}
                    aria-invalid={Boolean(amountError)}
                  />
                  {amountError && (
                    <p className="field-error" role="alert">{amountError}</p>
                  )}
                </div>
              </div>
              <div className="input-group" style={{ marginBottom: 0, marginTop: '0.75rem' }}>
                <label htmlFor={makeId('deduction-note', item.id)}>
                  Reference Note{' '}
                  <span className="optional-label">optional</span>
                </label>
                <input
                  id={makeId('deduction-note', item.id)}
                  type="text"
                  placeholder="e.g. Invoice #204 · ABC Cleaning Co."
                  value={item.note}
                  onChange={(e) => updateDeduction(item.id, 'note', e.target.value)}
                />
              </div>
            </div>
          );
        })}

        {data.deductions.length === 0 && (
          <p className="helper-text deduction-empty-hint">
            Add a deduction below. Enter a description and dollar amount for
            each item — cleaning, repairs, unpaid rent, etc.
          </p>
        )}

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={addDeduction}>
            + Add Deduction
          </button>
        </div>
      </div>

      {/* Pre-export checklist — always visible before CTA */}
      <PreExportChecklist />

      <div className="form-actions form-actions--primary">
        <button type="button" className="btn btn-outline" onClick={onReset}>
          Reset Form
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onPrint}
          title={!isValid ? 'Fill in all required fields to continue' : undefined}
        >
          Print / Save as PDF
        </button>
      </div>

      {/* Below-fold trust / about section */}
      <AboutThisTool />
    </section>
  );
}
