function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount || 0);
}

function getFieldClass(error) {
  return error ? 'input-error' : '';
}

function makeId(prefix, suffix = '') {
  return suffix ? `${prefix}-${suffix}` : prefix;
}

export default function FormPanel({
  data,
  setData,
  math,
  errors,
  errorList,
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
        <h1>Write Your Security Deposit Deduction Letter in Minutes.</h1>
        <p>
          Itemize damages, calculate totals, and generate a professional,
          tenant-ready PDF instantly.
        </p>
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

      <div className="summary-card" aria-label="Calculation summary">
        <h3>Letter Summary</h3>
        <div className="summary-card__row">
          <span>Total deposit + interest</span>
          <strong>{formatCurrency(math.totalAvailable)}</strong>
        </div>
        <div className="summary-card__row">
          <span>Total deductions</span>
          <strong>{formatCurrency(math.totalDeductions)}</strong>
        </div>
        <div className="summary-card__row">
          <span>{math.balance >= 0 ? 'Balance due to tenant' : 'Outstanding balance'}</span>
          <strong>{formatCurrency(Math.abs(math.balance))}</strong>
        </div>
        <p className="summary-card__note">
          The preview updates instantly as you type. The final PDF uses your
          browser&apos;s print dialog.
        </p>
      </div>

      <div className="form-section">
        <h3>Landlord Information</h3>
        <div className="input-group">
          <label htmlFor="landlordName">Landlord Name</label>
          <input
            id="landlordName"
            type="text"
            value={data.landlordName}
            onChange={(e) => updateField('landlordName', e.target.value)}
            className={getFieldClass(errors.landlordName)}
            aria-invalid={Boolean(errors.landlordName)}
          />
          {errors.landlordName && (
            <p className="field-error">{errors.landlordName}</p>
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
          />
          {errors.landlordAddress && (
            <p className="field-error">{errors.landlordAddress}</p>
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
          />
          {errors.tenantNames && (
            <p className="field-error">{errors.tenantNames}</p>
          )}
        </div>
        <div className="input-group">
          <label htmlFor="propertyAddress">Property Unit Address</label>
          <input
            id="propertyAddress"
            type="text"
            value={data.propertyAddress}
            onChange={(e) => updateField('propertyAddress', e.target.value)}
            className={getFieldClass(errors.propertyAddress)}
            aria-invalid={Boolean(errors.propertyAddress)}
          />
          {errors.propertyAddress && (
            <p className="field-error">{errors.propertyAddress}</p>
          )}
        </div>
        <div className="input-group">
          <label htmlFor="forwardingAddress">Tenant Forwarding Address</label>
          <textarea
            id="forwardingAddress"
            rows="3"
            value={data.forwardingAddress}
            onChange={(e) => updateField('forwardingAddress', e.target.value)}
          />
          <p className="helper-text">
            Optional, but useful if you want the letter addressed to their new
            mailing address.
          </p>
        </div>
      </div>

      <div className="form-section">
        <h3>Dates &amp; Money</h3>
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
              <p className="field-error">{errors.noticeDate}</p>
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
              <p className="field-error">{errors.moveOutDate}</p>
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
            />
            {errors.originalDeposit && (
              <p className="field-error">{errors.originalDeposit}</p>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="accruedInterest">Accrued Interest ($)</label>
            <input
              id="accruedInterest"
              type="number"
              min="0"
              step="0.01"
              value={data.accruedInterest}
              onChange={(e) => updateField('accruedInterest', e.target.value)}
              className={getFieldClass(errors.accruedInterest)}
              aria-invalid={Boolean(errors.accruedInterest)}
            />
            <p className="helper-text">Optional. Leave blank if none applies.</p>
            {errors.accruedInterest && (
              <p className="field-error">{errors.accruedInterest}</p>
            )}
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Itemized Deductions</h3>
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
                    <p className="field-error">{descriptionError}</p>
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
                    value={item.amount}
                    onChange={(e) =>
                      updateDeduction(item.id, 'amount', e.target.value)
                    }
                    className={getFieldClass(amountError)}
                    aria-invalid={Boolean(amountError)}
                  />
                  {amountError && (
                    <p className="field-error">{amountError}</p>
                  )}
                </div>
              </div>
              <div className="input-group" style={{ marginBottom: 0, marginTop: '0.75rem' }}>
                <label htmlFor={makeId('deduction-note', item.id)}>
                  Reference Note
                </label>
                <input
                  id={makeId('deduction-note', item.id)}
                  type="text"
                  placeholder="Optional: invoice number or receipt note"
                  value={item.note}
                  onChange={(e) => updateDeduction(item.id, 'note', e.target.value)}
                />
                <p className="helper-text">
                  Optional. Example: Invoice #204 or Cleaning receipt attached.
                </p>
              </div>
            </div>
          );
        })}
        {data.deductions.length === 0 && (
          <p className="helper-text">
            No deductions added. The full deposit will be returned.
          </p>
        )}
        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={addDeduction}>
            + Add Deduction
          </button>
        </div>
        <p className="helper-text" style={{ marginTop: '0.5rem' }}>
          Attach physical receipts to the printed letter when relevant.
        </p>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onReset}>
          Reset Form
        </button>
        <button type="button" className="btn btn-primary" onClick={onPrint}>
          Download PDF Letter
        </button>
      </div>
    </section>
  );
}
