import { formatCurrency, makeId } from '../utils/helpers';

function getFieldClass(error) {
  return error ? 'input-error' : '';
}

function TrustBadges() {
  return (
    <div className="trust-badges">
      <span className="trust-badge">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        100% browser-based
      </span>
      <span className="trust-badge">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
        No data saved
      </span>
      <span className="trust-badge">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        Not legal advice
      </span>
      <span className="trust-badge">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        Free
      </span>
    </div>
  );
}

function SuccessCallout({ onReset }) {
  return (
    <div className="success-callout" role="status">
      <div className="success-callout__icon" aria-hidden="true">✓</div>
      <div>
        <strong>Letter generated.</strong>
        <p>
          Save the PDF to your records. Attach physical receipts for any
          deductions when you send this to your tenant.
        </p>
        <p className="success-callout__sub">
          <strong>Reminder:</strong> Most states require landlords to send the
          itemized statement within 14–30 days of move-out. Check your local
          rules.
        </p>
        <button type="button" className="btn btn-outline" style={{ marginTop: '0.75rem' }} onClick={onReset}>
          Start a new letter
        </button>
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
}) {
  const updateField = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const addDeduction = () => {
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
    setData((prev) => ({
      ...prev,
      deductions: prev.deductions.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeDeduction = (id) => {
    setData((prev) => ({
      ...prev,
      deductions: prev.deductions.filter((item) => item.id !== id),
    }));
  };

  return (
    <section className="form-panel no-print" aria-label="Letter form">
      <div className="form-panel__hero">
        <h1>Generate a Security Deposit Deduction Letter in Minutes.</h1>
        <p>
          Itemize damages, calculate the balance, and export a professional
          PDF your tenant can't dispute on formatting alone.
        </p>
        <TrustBadges />
      </div>

      {errorList.length > 0 && (
        <div className="validation-banner" role="alert" aria-live="polite">
          <strong>Fix these items before downloading:</strong>
          <ul>
            {errorList.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {printed && <SuccessCallout onReset={onReset} />}

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
          Preview updates instantly. Click <em>Download PDF Letter</em> when ready.
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
            If known, include the tenant's new address so the letter can be
            mailed directly.
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
          Attach receipts to the printed letter.
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
            No deductions yet — the full deposit will be returned. Add a
            deduction below if applicable.
          </p>
        )}

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={addDeduction}>
            + Add Deduction
          </button>
        </div>
      </div>

      <div className="form-actions form-actions--primary">
        <button type="button" className="btn btn-outline" onClick={onReset}>
          Reset Form
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onPrint}
          title={!isValid ? 'Fill in all required fields to download' : undefined}
        >
          Download PDF Letter
        </button>
      </div>
    </section>
  );
}
