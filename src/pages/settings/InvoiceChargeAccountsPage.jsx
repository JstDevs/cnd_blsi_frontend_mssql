import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InvoiceChargeAccountForm from '../../components/forms/InvoiceChargeAccountForm';
import {
  fetchInvoiceChargeAccounts,
  addInvoiceChargeAccount,
  updateInvoiceChargeAccount,
} from '../../features/settings/invoiceChargeAccountsSlice';
import toast from 'react-hot-toast';

function InvoiceChargeAccountsPage() {
  const dispatch = useDispatch();
  const { invoiceChargeAccounts } = useSelector(
    (state) => state.invoiceChargeAccounts
  );

  useEffect(() => {
    dispatch(fetchInvoiceChargeAccounts());
  }, [dispatch]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(updateInvoiceChargeAccount(values)).unwrap();
      toast.success('Invoice charge account updated successfully');
    } catch (error) {
      console.error('Failed to save invoice charge account:', error);
    } finally {
      setSubmitting(false);
      dispatch(fetchInvoiceChargeAccounts());
    }
  };

  return (
    <div>
      <div className="bg-white p-3 sm:p-6 rounded-lg shadow border">
        <InvoiceChargeAccountForm
          // onClose={() => {}}
          onSubmit={handleSubmit}
          invoiceChargeAccounts={invoiceChargeAccounts}
        />
      </div>
    </div>
  );
}

export default InvoiceChargeAccountsPage;
