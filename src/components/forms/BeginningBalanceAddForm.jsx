import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';
import Select from 'react-select';

function BeginningBalanceAddForm({
  initialData,
  onSubmit,
  onClose,
  fiscalYears = [],
  fundsOptions = [],
  chartOfAccountsOptions = [],
}) {
  const validationSchema = Yup.object({
    FiscalYearID: Yup.string().required('Fiscal Year is required'),
    FundsID: Yup.string().required('Funds are required'),
    BeginningBalance: Yup.number()
      .typeError('Must be a number')
      .required('Beginning Balance is required'),
    ChartofAccountsCode: Yup.string().required('Chart of Accounts is required'),
  });

  const formik = useFormik({
    initialValues: initialData || {
      FiscalYearID: '',
      FundsID: '',
      BeginningBalance: '',
      ChartofAccountsCode: '',
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {/* Row 1: Funds & Beginning Balance */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField
            label="Fiscal Year"
            name="FiscalYearID"
            type="select"
            options={fiscalYears}
            value={formik.values.FiscalYearID}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.FiscalYearID}
            touched={formik.touched.FiscalYearID}
            required
            className="w-full"
        />
        <FormField
            label="Funds"
            name="FundsID"
            type="select"
            options={fundsOptions}
            value={formik.values.FundsID}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.FundsID}
            touched={formik.touched.FundsID}
            required
            className="w-full"
        />
        <FormField
            label="Beginning Balance"
            name="BeginningBalance"
            type="number"
            value={formik.values.BeginningBalance}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.BeginningBalance}
            touched={formik.touched.BeginningBalance}
            required
            className="w-full"
        />
        </div>


      {/* Row 2: Chart of Accounts */}
      <div>
        <div>
            <label className="form-label">
            Chart of Accounts <span className="text-error-500">*</span>
            </label>
        </div>
        <Select
            options={chartOfAccountsOptions}
            placeholder="Select a chart of account..."
            isSearchable={true}
            name="ChartofAccountsCode"
            value={
                chartOfAccountsOptions.find(
                    opt => String(opt.value) === String(formik.values.ChartofAccountsCode)
                ) || null
            }
            onChange={(selected) =>
            formik.setFieldValue('ChartofAccountsCode', selected?.value || '')
            }
            onBlur={formik.handleBlur}
        />
        {formik.touched.ChartofAccountsCode && formik.errors.ChartofAccountsCode && (
            <div className="text-sm text-red-600 mt-1">
            {formik.errors.ChartofAccountsCode}
            </div>
        )}
        </div>


      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
        <button type="button" onClick={onClose} className="btn btn-outline">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}

export default BeginningBalanceAddForm;
