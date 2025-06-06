import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';
import { accountOptions } from '../../features/settings/invoiceChargeAccountsSlice';

// Validation schema
const invoiceChargeAccountSchema = Yup.object().shape({
  marriageServiceInvoice: Yup.string().required('Marriage Service Invoice account is required'),
  burialServiceInvoice: Yup.string().required('Burial Service Invoice account is required'),
  dueFromLGU: Yup.string().required('Due From LGU account is required'),
  dueFromRate: Yup.number()
    .required('Due From Rate is required')
    .min(0, 'Rate must be greater than or equal to 0')
    .max(1, 'Rate must be less than or equal to 1'),
  dueToLGU: Yup.string().required('Due To LGU account is required'),
  dueToRate: Yup.number()
    .required('Due To Rate is required')
    .min(0, 'Rate must be greater than or equal to 0')
    .max(1, 'Rate must be less than or equal to 1'),
  specialEducationFund: Yup.string().required('Special Education Fund account is required'),
  specialEducationRate: Yup.number()
    .required('Special Education Rate is required')
    .min(0, 'Rate must be greater than or equal to 0')
    .max(1, 'Rate must be less than or equal to 1'),
});

const InvoiceChargeAccountForm = ({ initialData, onClose, onSubmit }) => {
  return (
    <Formik
      initialValues={{
        marriageServiceInvoice: initialData?.marriageServiceInvoice || '',
        burialServiceInvoice: initialData?.burialServiceInvoice || '',
        dueFromLGU: initialData?.dueFromLGU || '',
        dueFromRate: initialData?.dueFromRate || 0,
        dueToLGU: initialData?.dueToLGU || '',
        dueToRate: initialData?.dueToRate || 0,
        specialEducationFund: initialData?.specialEducationFund || '',
        specialEducationRate: initialData?.specialEducationRate || 0,
      }}
      validationSchema={invoiceChargeAccountSchema}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
        <Form className="space-y-6">
          {/* Service Invoice Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-900">Charge Account of Service Invoice</h3>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                label="Marriage Service Invoice"
                name="marriageServiceInvoice"
                type="select"
                required
                value={values.marriageServiceInvoice}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.marriageServiceInvoice}
                touched={touched.marriageServiceInvoice}
                options={accountOptions}
              />
              <FormField
                label="Burial Service Invoice"
                name="burialServiceInvoice"
                type="select"
                required
                value={values.burialServiceInvoice}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.burialServiceInvoice}
                touched={touched.burialServiceInvoice}
                options={accountOptions}
              />
            </div>
          </div>

          {/* Real Property Tax Shares Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-900">Real Property Tax Shares Settings</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-neutral-50 p-4 rounded-lg space-y-4">
                <h4 className="font-medium text-neutral-700">Due From Local Government Units</h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Account"
                    name="dueFromLGU"
                    type="select"
                    required
                    value={values.dueFromLGU}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.dueFromLGU}
                    touched={touched.dueFromLGU}
                    options={accountOptions}
                  />
                  <FormField
                    label="Rate"
                    name="dueFromRate"
                    type="number"
                    required
                    value={values.dueFromRate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.dueFromRate}
                    touched={touched.dueFromRate}
                    step="0.01"
                    min="0"
                    max="1"
                  />
                </div>
              </div>

              <div className="bg-neutral-50 p-4 rounded-lg space-y-4">
                <h4 className="font-medium text-neutral-700">Due to LGUs</h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Account"
                    name="dueToLGU"
                    type="select"
                    required
                    value={values.dueToLGU}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.dueToLGU}
                    touched={touched.dueToLGU}
                    options={accountOptions}
                  />
                  <FormField
                    label="Rate"
                    name="dueToRate"
                    type="number"
                    required
                    value={values.dueToRate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.dueToRate}
                    touched={touched.dueToRate}
                    step="0.01"
                    min="0"
                    max="1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Special Education Fund Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-900">Special Education Funds</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Real Property Tax"
                name="specialEducationFund"
                type="select"
                required
                value={values.specialEducationFund}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.specialEducationFund}
                touched={touched.specialEducationFund}
                options={accountOptions}
              />
              <FormField
                label="Rate"
                name="specialEducationRate"
                type="number"
                required
                value={values.specialEducationRate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.specialEducationRate}
                touched={touched.specialEducationRate}
                step="0.01"
                min="0"
                max="1"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              Save
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default InvoiceChargeAccountForm; 