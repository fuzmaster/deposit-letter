import { useMemo, useState } from 'react';
import posthog from 'posthog-js';
import FormPanel from './components/FormPanel';
import LetterPreview from './components/LetterPreview';
import SeoContent from './components/SeoContent';
import LeadModal from './components/LeadModal';
import { parseNum, validateData } from './utils/helpers';
import './App.css';

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
  deductions: [],
};

function useDepositLetterState() {
  const [data, setData] = useState(initialData);
  const [showValidation, setShowValidation] = useState(false);
  const [printed, setPrinted] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
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
      posthog.capture('form_started');
      setFormStarted(true);
    }
  };

  const handlePrint = () => {
    setShowValidation(true);

    if (!validation.isValid) {
      posthog.capture('validation_failed', {
        error_count: validation.errorList.length,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    posthog.capture('pdf_download_clicked', {
      deduction_count: data.deductions.length,
      balance_due: math.balance,
    });

    window.print();
    setPrinted(true);

    // Show lead modal after user returns from print dialog
    setTimeout(() => setShowLeadModal(true), 1500);
  };

  const handleReset = () => {
    setData(initialData);
    setShowValidation(false);
    setPrinted(false);
    setFormStarted(false);
    posthog.capture('form_reset');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    data,
    setData,
    math,
    validation,
    showValidation,
    printed,
    showLeadModal,
    setShowLeadModal,
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
    showLeadModal,
    setShowLeadModal,
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
      </footer>

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

      <LeadModal
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
      />
    </div>
  );
}
