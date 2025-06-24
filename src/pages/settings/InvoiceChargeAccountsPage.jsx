import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InvoiceChargeAccountForm from '../../components/forms/InvoiceChargeAccountForm';
import {
  fetchInvoiceChargeAccounts,
  addInvoiceChargeAccount,
  updateInvoiceChargeAccount
} from '../../features/settings/invoiceChargeAccountsSlice';

function InvoiceChargeAccountsPage() {
  const dispatch = useDispatch();
  const { invoiceChargeAccounts } = useSelector(state => state.invoiceChargeAccounts);

  useEffect(() => {
    dispatch(fetchInvoiceChargeAccounts());
  }, [dispatch]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(updateInvoiceChargeAccount(values)).unwrap();
      setSubmitting(false);
    } catch (error) {
      console.error('Failed to save invoice charge account:', error);
      setSubmitting(false);
    }
  };

  return (
    <div>

      <div className="bg-white p-6 rounded-lg shadow border">
        <InvoiceChargeAccountForm
          onSubmit={handleSubmit}
          invoiceChargeAccounts={invoiceChargeAccounts}
        />
      </div>
    </div>
  );
}

export default InvoiceChargeAccountsPage;
