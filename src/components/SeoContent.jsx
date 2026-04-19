export default function SeoContent() {
  return (
    <section className="seo-content no-print" aria-label="Guide: How to write a security deposit deduction letter">
      <hr className="seo-content__divider" />

      <h2>How to Write a Security Deposit Deduction Letter</h2>
      <p>
        Returning a tenant's security deposit isn't just about writing a check.
        If you are withholding funds for damages, unpaid rent, or cleaning,
        almost every state requires landlords to provide a formal, itemized
        deduction letter. Failing to send this document within your state's
        legal deadline can result in forfeiting your right to withhold any
        funds — and may expose you to double or treble damages in small claims
        court.
      </p>

      <h3>Normal Wear and Tear vs. Actual Damage</h3>
      <p>
        The most common dispute between landlords and tenants is the definition
        of "normal wear and tear." You cannot deduct from a security deposit for
        routine aging of the property.
      </p>
      <div className="seo-content__two-col">
        <div className="seo-content__card seo-content__card--ok">
          <h4>Wear &amp; Tear — Do Not Deduct</h4>
          <ul>
            <li>Faded or slightly scuffed paint from normal use</li>
            <li>Minor scuffs on baseboards or door frames</li>
            <li>Worn carpet from regular foot traffic</li>
            <li>Loose door handles or sticky window latches</li>
            <li>Small nail holes from pictures (in most states)</li>
          </ul>
        </div>
        <div className="seo-content__card seo-content__card--warn">
          <h4>Actual Damage — Deductible</h4>
          <ul>
            <li>Large holes punched or kicked in drywall</li>
            <li>Carpet burns, pet stains, or heavy soiling</li>
            <li>Broken windows, doors, or cabinet hardware</li>
            <li>Unauthorized paint colors left unpainted</li>
            <li>Missing fixtures, appliances, or blinds</li>
          </ul>
        </div>
      </div>

      <h3>Why Physical Receipts Matter</h3>
      <p>
        Courts do not favor estimated costs. If you charge $200 for professional
        cleaning, you need an invoice proving you paid a cleaner $200. Always
        attach copies of your invoices, material receipts, and contractor bids
        directly to the printed itemized statement before mailing it to your
        tenant. In some states, receipts are legally required for deductions
        above a certain dollar threshold.
      </p>

      <h3>The Importance of Certified Mail</h3>
      <p>
        Proof of mailing matters as much as the letter itself. Send your
        itemization via USPS Certified Mail with Return Receipt Requested. Keep
        the green card when it comes back — that is your evidence the tenant
        received the notice within the legal window. If the tenant has moved and
        left no forwarding address, send it to the rental unit address and
        document the attempt.
      </p>

      <h3>Common Reasons Landlords Lose Deposit Disputes</h3>
      <ul className="seo-content__loss-list">
        <li><strong>Missed the deadline.</strong> Most states require the letter within 14–30 days of move-out. Missing this can forfeit all deductions.</li>
        <li><strong>No receipts attached.</strong> A deduction without supporting documentation is easy for a judge to dismiss.</li>
        <li><strong>Deducting for wear and tear.</strong> Charging for routine aging is a common error that undermines credibility for all deductions.</li>
        <li><strong>Vague item descriptions.</strong> "Cleaning — $300" is weaker than "Professional carpet steam cleaning by ABC Cleaning, Invoice #204 — $300."</li>
        <li><strong>No move-in condition record.</strong> If you cannot show the damage wasn't pre-existing, you may not be able to collect.</li>
      </ul>

      <p className="seo-content__disclaimer">
        The information above is general educational content only. Landlord-tenant
        laws vary significantly by state and city. Always verify the specific rules,
        deadlines, and required disclosures in your jurisdiction before sending any
        deposit-related correspondence.
      </p>
    </section>
  );
}
