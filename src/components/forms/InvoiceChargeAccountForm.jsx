import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccounts } from '../../features/settings/chartOfAccountsSlice';
import { useModulePermissions } from '@/utils/useModulePremission';

// Validation schema
const invoiceChargeAccountSchema = Yup.object().shape({
  MarriageServiceInvoice: Yup.string().required(
    'Marriage Service Invoice account is required'
  ),
  BurialServiceInvoice: Yup.string().required(
    'Burial Service Invoice account is required'
  ),
  DueFromLGU: Yup.string().required('Due From LGU account is required'),
  DueFromRate: Yup.number().required('Due From Rate is required'),
  DueToLGU: Yup.string().required('Due To LGU account is required'),
  DueToRate: Yup.number().required('Due To Rate is required'),
  RealPropertyTax: Yup.string().required(
    'Real Property Tax account is required'
  ),
  RealPropertyTaxRate: Yup.number().required(
    'Real Property Tax Rate is required'
  ),
});

const InvoiceChargeAccountForm = ({
  initialData,
  // onClose,
  onSubmit,
  invoiceChargeAccounts = [],
}) => {
  const dispatch = useDispatch();
  const chartOfAccounts = useSelector(
    (state) => state.chartOfAccounts?.accounts || []
  );
  // ---------------------USE MODULE PERMISSIONS------------------START (Invoice Charge Account Form  - MODULE ID = 54 )
  const { Add } = useModulePermissions(54);

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  const accountMap = invoiceChargeAccounts.reduce((acc, item) => {
    switch (item.ID) {
      case 1:
        acc.MarriageServiceInvoice = item.ChartofAccountsID;
        break;
      case 2:
        acc.BurialServiceInvoice = item.ChartofAccountsID;
        break;
      case 3:
        acc.DueFromLGU = item.ChartofAccountsID;
        acc.DueFromRate = item.Rate ?? 0;
        break;
      case 4:
        acc.DueToLGU = item.ChartofAccountsID;
        acc.DueToRate = item.Rate ?? 0;
        break;
      case 5:
        acc.RealPropertyTax = item.ChartofAccountsID;
        acc.RealPropertyTaxRate = item.Rate ?? 0;
        break;
      default:
        break;
    }
    return acc;
  }, {});

  if (!invoiceChargeAccounts || invoiceChargeAccounts.length === 0) {
    return <div className="text-neutral-500">Loading charge accounts...</div>;
  }

  return (
    <Formik
      initialValues={{
        MarriageServiceInvoice: accountMap.MarriageServiceInvoice || '',
        BurialServiceInvoice: accountMap.BurialServiceInvoice || '',
        DueFromLGU: accountMap.DueFromLGU || '',
        DueFromRate: accountMap.DueFromRate || 0,
        DueToLGU: accountMap.DueToLGU || '',
        DueToRate: accountMap.DueToRate || 0,
        RealPropertyTax: accountMap.RealPropertyTax || '',
        RealPropertyTaxRate: accountMap.RealPropertyTaxRate || 0,
      }}
      validationSchema={invoiceChargeAccountSchema}
      onSubmit={onSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isSubmitting,
        resetForm,
      }) => (
        <Form className="space-y-6">
          {/* Service Invoice Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-900">
              Charge Account of Service Invoice
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                label="Marriage Service Invoice"
                name="MarriageServiceInvoice"
                type="select"
                required
                value={values.MarriageServiceInvoice}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.MarriageServiceInvoice}
                touched={touched.MarriageServiceInvoice}
                options={(chartOfAccounts || []).map((account) => ({
                  value: account.ID,
                  label: account.Name,
                }))}
              />
              <FormField
                label="Burial Service Invoice"
                name="BurialServiceInvoice"
                type="select"
                required
                value={values.BurialServiceInvoice}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.BurialServiceInvoice}
                touched={touched.BurialServiceInvoice}
                options={(chartOfAccounts || []).map((account) => ({
                  value: account.ID,
                  label: account.Name,
                }))}
              />
            </div>
          </div>

          {/* Real Property Tax Shares Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-900">
              Real Property Tax Shares Settings
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-neutral-50 p-2 sm:p-4 rounded-lg space-y-4">
                <h4 className="font-medium text-neutral-700">Due to LGUs</h4>
                <div className="grid sm:grid-cols-2 sm:gap-4">
                  <FormField
                    label="Account"
                    name="DueToLGU"
                    type="select"
                    required
                    value={values.DueToLGU}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.DueToLGU}
                    touched={touched.DueToLGU}
                    options={(chartOfAccounts || []).map((account) => ({
                      value: account.ID,
                      label: account.Name,
                    }))}
                  />
                  <FormField
                    label="Rate"
                    name="DueToRate"
                    type="number"
                    required
                    value={values.DueToRate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.DueToRate}
                    touched={touched.DueToRate}
                  />
                </div>
              </div>

              <div className="bg-neutral-50 p-2 sm:p-4 rounded-lg space-y-4">
                <h4 className="font-medium text-neutral-700">
                  Due From Local Government Units
                </h4>
                <div className="grid sm:grid-cols-2 sm:gap-4">
                  <FormField
                    label="Account"
                    name="DueFromLGU"
                    type="select"
                    required
                    value={values.DueFromLGU}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.DueFromLGU}
                    touched={touched.DueFromLGU}
                    options={(chartOfAccounts || []).map((account) => ({
                      value: account.ID,
                      label: account.Name,
                    }))}
                  />
                  <FormField
                    label="Rate"
                    name="DueFromRate"
                    type="number"
                    required
                    value={values.DueFromRate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.DueFromRate}
                    touched={touched.DueFromRate}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Special Education Fund Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-900">
              Special Education Funds
            </h3>
            <div className="grid sm:grid-cols-2 sm:gap-4">
              <FormField
                label="Real Property Tax"
                name="RealPropertyTax"
                type="select"
                required
                value={values.RealPropertyTax}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.RealPropertyTax}
                touched={touched.RealPropertyTax}
                options={(chartOfAccounts || []).map((account) => ({
                  value: account.ID,
                  label: account.Name,
                }))}
              />
              <FormField
                label="Rate"
                name="RealPropertyTaxRate"
                type="number"
                required
                value={values.RealPropertyTaxRate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.RealPropertyTaxRate}
                touched={touched.RealPropertyTaxRate}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={() => {
                resetForm();
                // onClose();
              }}
              className="btn btn-outline"
            >
              Cancel
            </button>
            {Add && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default InvoiceChargeAccountForm;
