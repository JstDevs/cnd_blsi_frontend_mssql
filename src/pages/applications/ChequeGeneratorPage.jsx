import { useState } from 'react';
import { PrinterIcon } from '@heroicons/react/24/outline';
import FormField from '../../components/common/FormField';

function ChequeGeneratorPage() {
  const [chequeData, setChequeData] = useState({
    payee: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    bank: '',
    accountNumber: '',
    particulars: '',
  });
  
  const banks = [
    { value: 'LBP', label: 'Land Bank of the Philippines' },
    { value: 'DBP', label: 'Development Bank of the Philippines' },
    { value: 'PNB', label: 'Philippine National Bank' },
  ];
  
  const accounts = [
    { value: '1234567890', label: 'General Fund - Current Account' },
    { value: '0987654321', label: 'Special Education Fund - Current Account' },
    { value: '1357924680', label: 'Trust Fund - Current Account' },
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setChequeData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle cheque generation
  };
  
  // Format amount to words
  const amountToWords = (amount) => {
    // This is a simplified version. In production, use a proper number-to-words library
    const formatter = new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    });
    return formatter.format(amount) + ' ONLY';
  };

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Cheque Generator</h1>
            <p>Generate and print cheques</p>
          </div>
          <button
            type="button"
            className="btn btn-primary flex items-center"
          >
            <PrinterIcon className="h-5 w-5 mr-2" />
            Print Cheque
          </button>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="card p-4">
            <h2 className="text-lg font-medium mb-4">Cheque Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                label="Bank"
                name="bank"
                type="select"
                required
                value={chequeData.bank}
                onChange={handleChange}
                options={banks}
              />
              
              <FormField
                label="Account Number"
                name="accountNumber"
                type="select"
                required
                value={chequeData.accountNumber}
                onChange={handleChange}
                options={accounts}
              />
              
              <FormField
                label="Payee"
                name="payee"
                type="text"
                required
                placeholder="Enter payee name"
                value={chequeData.payee}
                onChange={handleChange}
              />
              
              <FormField
                label="Amount"
                name="amount"
                type="number"
                required
                placeholder="0.00"
                value={chequeData.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
              
              <FormField
                label="Date"
                name="date"
                type="date"
                required
                value={chequeData.date}
                onChange={handleChange}
              />
              
              <FormField
                label="Particulars"
                name="particulars"
                type="textarea"
                placeholder="Enter payment details"
                value={chequeData.particulars}
                onChange={handleChange}
                rows={3}
              />
            </form>
          </div>
        </div>
        
        <div>
          <div className="card p-4">
            <h2 className="text-lg font-medium mb-4">Cheque Preview</h2>
            <div className="border border-neutral-300 p-6 rounded-lg bg-white shadow">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-neutral-500">Bank</p>
                    <p className="font-medium">{banks.find(b => b.value === chequeData.bank)?.label || 'Select Bank'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-neutral-500">Date</p>
                    <p className="font-medium">
                      {chequeData.date ? new Date(chequeData.date).toLocaleDateString() : 'Select Date'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-neutral-500">Pay to the Order of</p>
                  <p className="font-medium text-lg border-b border-neutral-300 pb-1">
                    {chequeData.payee || 'Enter Payee Name'}
                  </p>
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-neutral-500">Amount in Words</p>
                    <p className="font-medium">
                      {chequeData.amount ? amountToWords(chequeData.amount) : 'Enter Amount'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-neutral-500">Amount</p>
                    <p className="font-medium text-lg">
                      {chequeData.amount ? new Intl.NumberFormat('en-PH', {
                        style: 'currency',
                        currency: 'PHP'
                      }).format(chequeData.amount) : '₱0.00'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-12 pt-4 border-t border-neutral-300">
                  <div className="text-center">
                    <p className="text-sm text-neutral-500">Authorized Signature</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChequeGeneratorPage;