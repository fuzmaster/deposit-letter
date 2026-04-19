function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount || 0);
}

function formatDate(dateStr) {
  if (!dateStr) return '[Date]';
  const [year, month, day] = dateStr.split('-');
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getClosingParagraph(balance) {
  if (balance >= 0) {
    return 'Enclosed please find payment for the remaining balance. If you have any questions regarding this statement, please contact the landlord in writing.';
  }
  return 'The total deductions exceed the original security deposit. According to the itemization above, an outstanding balance remains. Please contact the landlord in writing regarding next steps.';
}

export default function LetterPreview({ data, math }) {
  const hasInterest = parseFloat(data.accruedInterest) > 0;
  const hasDeductions = data.deductions.length > 0;

  return (
    <section className="preview-panel" aria-label="Letter preview">
      <div>
        <div className="paper">
          <div className="sender-block">
            <p>
              <strong>{data.landlordName || '[Landlord Name]'}</strong>
              <br />
              {data.landlordAddress ? (
                <span style={{ whiteSpace: 'pre-line' }}>{data.landlordAddress}</span>
              ) : (
                '[Landlord Return Address]'
              )}
            </p>
            <p>{formatDate(data.noticeDate)}</p>
          </div>

          <div className="recipient-block">
            <p>
              <strong>To:</strong> {data.tenantNames || '[Tenant Name(s)]'}
              <br />
              {data.forwardingAddress ? (
                <span style={{ whiteSpace: 'pre-line' }}>
                  {data.forwardingAddress}
                </span>
              ) : (
                '[Tenant Forwarding Address]'
              )}
            </p>
          </div>

          <div className="subject-line">
            RE: Security Deposit Return for{' '}
            {data.propertyAddress || '[Property Address]'}
          </div>

          <p>
            This letter serves as the formal itemized statement of the
            disposition of your security deposit for the property located at{' '}
            {data.propertyAddress || '[Property Address]'}. According to our
            records, you vacated the premises on {formatDate(data.moveOutDate)}.
          </p>

          {!hasDeductions ? (
            <p>
              <em>
                No deductions have been assessed. The full deposit will be
                returned.
              </em>
            </p>
          ) : (
            <table className="deduction-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.deductions.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.description || '[Item Description]'}
                      {item.note && (
                        <div
                          style={{
                            fontSize: '0.85em',
                            color: '#555',
                            marginTop: '0.25rem',
                          }}
                        >
                          Reference: {item.note}
                        </div>
                      )}
                    </td>
                    <td className="text-right">
                      {formatCurrency(parseFloat(item.amount) || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="summary-block">
            <div className="summary-row">
              <span>Original Security Deposit:</span>
              <span>{formatCurrency(data.originalDeposit)}</span>
            </div>
            {hasInterest && (
              <div className="summary-row">
                <span>Accrued Interest:</span>
                <span>{formatCurrency(data.accruedInterest)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Total Deductions:</span>
              <span>- {formatCurrency(math.totalDeductions)}</span>
            </div>
            <div className="summary-row summary-total">
              <span>
                {math.balance >= 0
                  ? 'Balance Due to Tenant:'
                  : 'Outstanding Balance:'}
              </span>
              <span>{formatCurrency(Math.abs(math.balance))}</span>
            </div>
          </div>

          <p>{getClosingParagraph(math.balance)}</p>

          <div className="signature-block">
            <p>Sincerely,</p>
            <div className="signature-line" />
            <p>{data.landlordName || '[Landlord Name]'}</p>
          </div>
        </div>
        <p className="preview-note no-print">
          Preview only. Your browser print dialog will generate the final PDF.
        </p>
      </div>
    </section>
  );
}
