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

  const [currentAccount, setCurrentAccount] = useState(null);

  useEffect(() => {
    dispatch(fetchInvoiceChargeAccounts());
  }, [dispatch]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (currentAccount) {
        await dispatch(updateInvoiceChargeAccount({ ...values, id: currentAccount.id })).unwrap();
      } else {
        await dispatch(addInvoiceChargeAccount(values)).unwrap();
      }
      setCurrentAccount(null);
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
          initialData={currentAccount}
          onClose={() => setCurrentAccount(null)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default InvoiceChargeAccountsPage;
