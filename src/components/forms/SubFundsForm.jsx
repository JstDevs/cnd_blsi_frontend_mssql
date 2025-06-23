import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

function SubFundsForm({ initialData, onSubmit, onClose, fundOptions = [] }) {
  const validationSchema = Yup.object({
    Code: Yup.string().required('Code is required'),
    Amount: Yup.number()
      .required('Amount is required')
      .typeError('Amount must be a number'),
    Name: Yup.string().required('Name is required'),
    Fund: Yup.string().required('Fund is required'),
    Description: Yup.string().required('Description is required'),
  });

  const formik = useFormik({
    initialValues: initialData || {
      Code: '',
      Amount: '',
      Name: '',
      Fund: '',
      Description: '',
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const { values, handleChange, handleBlur, errors, touched } = formik;

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {/* Code */}
      <FormField
        label="Code"
        name="Code"
        type="text"
        value={values.Code}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.Code}
        touched={touched.Code}
        required
      />

      {/* Amount */}
      <FormField
        label="Amount"
        name="Amount"
        type="number"
        value={values.Amount}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.Amount}
        touched={touched.Amount}
        required
      />

      {/* Name */}
      <FormField
        label="Name"
        name="Name"
        type="text"
        value={values.Name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.Name}
        touched={touched.Name}
        required
      />

      {/* Fund Select */}
      <FormField
        label="Fund"
        name="Fund"
        type="select"
        value={values.Fund}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.Fund}
        touched={touched.Fund}
        required
        options={fundOptions.map(fund => ({
          value: fund.ID,
          label: fund.Name,
        }))}
      />

      {/* Description */}
      <FormField
        label="Description"
        name="Description"
        type="textarea"
        value={values.Description}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.Description}
        touched={touched.Description}
        required
      />

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
          {formik.isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}

export default SubFundsForm;
