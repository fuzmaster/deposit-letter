import { formatCurrency, formatDate } from '../utils/helpers';

function getClosingParagraph(balance) {
  if (balance >= 0) {
    return 'Enclosed please find payment for the remaining balance. If you have any questions regarding this statement, please contact the landlord in writing.';
  }
  return 'As shown in the itemization above, the total deductions exceed the security deposit originally collected. An outstanding balance remains. Please contact the landlord in writing regarding next steps.';
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
                <span style={{ whiteSpace: 'pre-line' }}>{data.forwardingAddress}</span>
              ) : (
                '[Tenant Forwarding Address]'
              )}
            </p>
          </div>

          <div className="subject-line">
            RE: Security Deposit Disposition — {data.propertyAddress || '[Property Address]'}
          </div>

          <p>
            This letter serves as the formal itemized statement of the
            disposition of your security deposit for the property located at{' '}
            <strong>{data.propertyAddress || '[Property Address]'}</strong>.
            According to our records, you vacated the premises on{' '}
            {formatDate(data.moveOutDate)}.
          </p>

          {!hasDeductions ? (
            <p>
              <em>
                No deductions have been assessed. The full security deposit
                will be returned.
              </em>
            </p>
          ) : (
            <table className="deduction-table">
              <thead>
                <tr>
                  <th>Description of Deduction</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.deductions.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.description || '[Item Description]'}
                      {item.note && (
                        <div className="deduction-reference">
                          Ref: {item.note}
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
            {hasDeductions && (
              <div className="summary-row">
                <span>Total Deductions:</span>
                <span>− {formatCurrency(math.totalDeductions)}</span>
              </div>
            )}
            <div className="summary-row summary-total">
              <span>
                {math.balance >= 0 ? 'Balance Due to Tenant:' : 'Outstanding Balance Owed:'}
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
          Preview only — use <strong>Print / Save as PDF</strong> above to export.
          In the print dialog, select <strong>Save as PDF</strong> as the destination.
        </p>
      </div>
    </section>
  );
}
