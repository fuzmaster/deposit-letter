import { useMemo, useState } from 'react';
import FormPanel from './components/FormPanel';
import LetterPreview from './components/LetterPreview';
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

function parseNum(value) {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function validateData(data) {
  const errors = {};
  const errorList = [];

  if (!data.landlordName.trim()) {
    errors.landlordName = 'Landlord name is required.';
    errorList.push('Add the landlord name.');
  }
  if (!data.landlordAddress.trim()) {
    errors.landlordAddress = 'Return address is required.';
    errorList.push('Add the landlord return address.');
  }
  if (!data.tenantNames.trim()) {
    errors.tenantNames = 'Tenant name is required.';
    errorList.push('Add the tenant name.');
  }
  if (!data.propertyAddress.trim()) {
    errors.propertyAddress = 'Property address is required.';
    errorList.push('Add the rental property address.');
  }
  if (!data.noticeDate) {
    errors.noticeDate = 'Notice date is required.';
    errorList.push('Add the notice date.');
  }
  if (!data.moveOutDate) {
    errors.moveOutDate = 'Move-out date is required.';
    errorList.push('Add the move-out date.');
  }
  if (data.originalDeposit === '') {
    errors.originalDeposit = 'Original deposit amount is required.';
    errorList.push('Add the original security deposit amount.');
  }
  if (parseNum(data.originalDeposit) < 0) {
    errors.originalDeposit = 'Original deposit cannot be negative.';
    errorList.push('Original deposit cannot be negative.');
  }
  if (parseNum(data.accruedInterest) < 0) {
    errors.accruedInterest = 'Accrued interest cannot be negative.';
    errorList.push('Accrued interest cannot be negative.');
  }

  data.deductions.forEach((item, index) => {
    const hasDescription = item.description.trim().length > 0;
    const hasAmount = item.amount !== '' && parseNum(item.amount) > 0;
    const key = item.id;

    if (item.amount !== '' && parseNum(item.amount) < 0) {
      errors[`deduction-amount-${key}`] = 'Deduction amount cannot be negative.';
      errorList.push(`Deduction ${index + 1} cannot be negative.`);
    }
    if (hasAmount && !hasDescription) {
      errors[`deduction-description-${key}`] = 'Description is required when amount is entered.';
      errorList.push(`Deduction ${index + 1} needs a description.`);
    }
    if (hasDescription && item.amount === '') {
      errors[`deduction-amount-${key}`] = 'Amount is required when description is entered.';
      errorList.push(`Deduction ${index + 1} needs an amount.`);
    }
  });

  return {
    errors,
    errorList,
    isValid: errorList.length === 0,
  };
}

export default function App() {
  const [data, setData] = useState(initialData);
  const [showValidation, setShowValidation] = useState(false);

  const deposit = parseNum(data.originalDeposit);
  const interest = parseNum(data.accruedInterest);
  const totalAvailable = deposit + interest;
  const totalDeductions = data.deductions.reduce(
    (sum, item) => sum + parseNum(item.amount),
    0
  );
  const balance = totalAvailable - totalDeductions;

  const mathContext = useMemo(
    () => ({ deposit, interest, totalAvailable, totalDeductions, balance }),
    [deposit, interest, totalAvailable, totalDeductions, balance]
  );

  const validation = useMemo(() => validateData(data), [data]);

  const handlePrint = () => {
    setShowValidation(true);
    if (!validation.isValid) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.print();
  };

  const handleReset = () => {
    setData(initialData);
    setShowValidation(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <header className="site-header no-print">
        <div className="site-header__brand">
          <h2>DepositLetter</h2>
          <p>Security deposit deduction letter generator</p>
        </div>
        <button
          type="button"
          className="btn btn-primary desktop-only"
          onClick={handlePrint}
          disabled={!validation.isValid}
        >
          Download PDF Letter
        </button>
      </header>

      <main className="main-content">
        <FormPanel
          data={data}
          setData={setData}
          math={mathContext}
          errors={showValidation ? validation.errors : {}}
          errorList={showValidation ? validation.errorList : []}
          onPrint={handlePrint}
          onReset={handleReset}
        />
        <LetterPreview data={data} math={mathContext} />
      </main>

      <footer className="site-footer no-print">
        This tool generates a formatted document. It does not provide legal advice.
        Landlords are responsible for understanding and complying with their state
        and local laws.
      </footer>

      <div className="mobile-action-bar no-print">
        <button type="button" className="btn btn-outline" onClick={handleReset}>
          Reset
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handlePrint}
          disabled={!validation.isValid}
        >
          Preview &amp; Download
        </button>
      </div>
    </div>
  );
}
