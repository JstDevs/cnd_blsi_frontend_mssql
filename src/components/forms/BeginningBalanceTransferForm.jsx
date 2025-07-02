import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

function BeginningBalanceTransferForm({
  onSubmit,
  onClose,
  fiscalYears = [],
}) {
    const validationSchema = Yup.object({
        PreviousFiscalYearID: Yup.string()
            .required('Previous Fiscal Year is required'),
        NextFiscalYearID: Yup.string()
            .required('Next Fiscal Year is required')
            .test(
            'not-same',
            'Previous and Next Fiscal Years cannot be the same',
            function (value) {
                return value !== this.parent.PreviousFiscalYearID;
            }
            ),
    });


  const formik = useFormik({
    initialValues: {
      PreviousFiscalYearID: '',
      NextFiscalYearID: '',
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {/* Row 1: Previous Fiscal Year, Next Fiscal Year */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Previous Fiscal Year"
          name="PreviousFiscalYearID"
          type="select"
          options={fiscalYears}
          value={formik.values.PreviousFiscalYearID}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.PreviousFiscalYearID}
          touched={formik.touched.PreviousFiscalYearID}
          required
        />

        <FormField
          label="Next Fiscal Year"
          name="NextFiscalYearID"
          type="select"
          options={fiscalYears}
          value={formik.values.NextFiscalYearID}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.NextFiscalYearID}
          touched={formik.touched.NextFiscalYearID}
          required
        />
      </div>

      {/* Buttons */}
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
          className="btn btn-primary"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? 'Transferring...' : 'Transfer'}
        </button>
      </div>
    </form>
  );
}

export default BeginningBalanceTransferForm;
