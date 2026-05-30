import { useMemo, useState } from 'react';
import posthog from 'posthog-js';
import FormPanel from './components/FormPanel';
import LetterPreview from './components/LetterPreview';
import SeoContent from './components/SeoContent';

import { parseNum, validateData } from './utils/helpers';
import './App.css';

const track = (event, props) => {
  if (posthog.__loaded) posthog.capture(event, props);
};

function makeEmptyDeduction() {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    description: '',
    note: '',
    amount: '',
  };
}

const initialData = {
  landlordName: '',
  landlordAddress: '',
  tenantNames: '',
  forwardingAddress: '',
  propertyAddress: '',
  moveOutDate: '',
  noticeDate: new Date().toISOString().split('T')[0],
  originalDeposit: '',
  accruedInterest: '',
  deductions: [makeEmptyDeduction()],
};

function useDepositLetterState() {
  const [data, setData] = useState(initialData);
  const [showValidation, setShowValidation] = useState(false);
  const [printed, setPrinted] = useState(false);
  const [formStarted, setFormStarted] = useState(false);

  const deposit = parseNum(data.originalDeposit);
  const interest = parseNum(data.accruedInterest);
  const totalAvailable = deposit + interest;
  const totalDeductions = data.deductions.reduce(
    (sum, item) => sum + parseNum(item.amount),
    0
  );
  const balance = totalAvailable - totalDeductions;

  const math = useMemo(
    () => ({ deposit, interest, totalAvailable, totalDeductions, balance }),
    [deposit, interest, totalAvailable, totalDeductions, balance]
  );

  const validation = useMemo(() => validateData(data), [data]);

  // Track first interaction — fires once per session
  const handleFormStart = () => {
    if (!formStarted) {
      track('form_started');
      setFormStarted(true);
    }
  };

  const handlePrint = () => {
    setShowValidation(true);

    if (!validation.isValid) {
      track('validation_failed', {
        error_count: validation.errorList.length,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    track('pdf_download_clicked', {
      deduction_count: data.deductions.length,
      balance_due: math.balance,
    });

    window.print();
    setPrinted(true);
  };

  const handleReset = () => {
    setData(initialData);
    setShowValidation(false);
    setPrinted(false);
    setFormStarted(false);
    track('form_reset');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    data,
    setData,
    math,
    validation,
    showValidation,
    printed,
    handleFormStart,
    handlePrint,
    handleReset,
  };
}

export default function App() {
  const {
    data,
    setData,
    math,
    validation,
    showValidation,
    printed,
    handleFormStart,
    handlePrint,
    handleReset,
  } = useDepositLetterState();

  return (
    <div className="app-container">
      <header className="site-header no-print">
        <div className="site-header__brand">
          <h2>DepositLetter</h2>
          <p>Deposit return letter builder for landlords</p>
        </div>
        <button
          type="button"
          className="btn btn-primary desktop-only"
          onClick={handlePrint}
          title={!validation.isValid ? 'Fill in all required fields to continue' : undefined}
        >
          Print / Save as PDF
        </button>
      </header>

      <main className="main-content">
        <FormPanel
          data={data}
          setData={setData}
          math={math}
          errors={showValidation ? validation.errors : {}}
          errorList={showValidation ? validation.errorList : []}
          isValid={validation.isValid}
          printed={printed}
          onPrint={handlePrint}
          onReset={handleReset}
          onFormStart={handleFormStart}
        />
        <LetterPreview data={data} math={math} />
      </main>

      <SeoContent />

      <footer className="site-footer no-print">
        <strong>Compliance note:</strong> This tool formats your information into a document. It does not
        determine whether a deduction is legally allowed, what return deadline applies, whether interest
        is required, or what notices and attachments your state or city may require.{' '}
        <strong>Review your local laws before sending.</strong>
        <p>
          Copyright Jacob Britten 2026 · <a href="/privacy.html">Privacy Policy</a>
        </p>
      </footer>

      {/* JBD BACKLINK FOOTER START */}
      <footer className="jbd-backlink-footer no-print">
        <div className="jbd-backlink-footer__inner">
          <p className="jbd-backlink-footer__brand">
            Built by <a href="https://jacobbritten.com" target="_blank" rel="noopener noreferrer">Jacob Britten</a> &mdash; Media Systems Architect
          </p>
          <nav className="jbd-backlink-footer__links" aria-label="Jacob Britten">
            <a href="https://jacobbritten.com" target="_blank" rel="noopener noreferrer">Portfolio</a>
            <a href="https://jacobbritten.com/projects.html" target="_blank" rel="noopener noreferrer">Projects</a>
            <a href="https://jacobbritten.com/lab.html" target="_blank" rel="noopener noreferrer">The Lab</a>
            <a href="https://ko-fi.com/jacobbritten" target="_blank" rel="noopener noreferrer">Ko-fi</a>
            <a href="https://www.paypal.com/donate/?hosted_button_id=47A4JJ4WNBY9U" target="_blank" rel="noopener noreferrer">PayPal</a>
          </nav>
        </div>
      </footer>
      {/* JBD BACKLINK FOOTER END */}

      <div className="mobile-action-bar no-print">
        <button type="button" className="btn btn-outline" onClick={handleReset}>
          Reset
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handlePrint}
        >
          Print / Save as PDF
        </button>
      </div>
    </div>
  );
}
