export function parseNum(value) {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount || 0);
}

export function formatDate(dateStr) {
  if (!dateStr) return '[Date]';
  const [year, month, day] = dateStr.split('-');
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function makeId(prefix, suffix = '') {
  return suffix ? `${prefix}-${suffix}` : prefix;
}

export function validateData(data) {
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

  return { errors, errorList, isValid: errorList.length === 0 };
}
