import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

function BaseUnitForm({ initialData, onSubmit, onClose }) {
  const currentYear = new Date().getFullYear();

  const validationSchema = Yup.object({
    GeneralRevisionYear: Yup.number().required('General Revision Year is required'),
    Classification: Yup.string().required('Classification is required'),
    Unit: Yup.string().required('Unit is required'),
    ActualUse: Yup.string().required('Actual Use is required'),
    SubClassification: Yup.string().required('Sub Class No is required'),
    Price: Yup.number().required('Unit Value is required'),
    Location: Yup.string().required('Location or Description is required'),
  });

  const formik = useFormik({
    initialValues: initialData || {
      GeneralRevisionYear: currentYear,
      Classification: '',
      Unit: '',
      ActualUse: '',
      SubClassification: '',
      Price: '',
      Location: '',
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <FormField
        label="General Revision Year"
        name="GeneralRevisionYear"
        type="number"
        value={formik.values.GeneralRevisionYear}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.GeneralRevisionYear}
        touched={formik.touched.GeneralRevisionYear}
        required
      />

      <FormField
        label="Classification"
        name="Classification"
        type="text"
        value={formik.values.Classification}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.Classification}
        touched={formik.touched.Classification}
        required
      />

      <FormField
        label="Unit"
        name="Unit"
        type="text"
        value={formik.values.Unit}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.Unit}
        touched={formik.touched.Unit}
        required
      />

      <FormField
        label="Actual Use"
        name="ActualUse"
        type="text"
        value={formik.values.ActualUse}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.ActualUse}
        touched={formik.touched.ActualUse}
        required
      />

      <FormField
        label="Sub Class No"
        name="SubClassification"
        type="text"
        value={formik.values.SubClassification}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.SubClassification}
        touched={formik.touched.SubClassification}
        required
      />

      <FormField
        label="Unit Value"
        name="Price"
        type="number"
        value={formik.values.Price}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.Price}
        touched={formik.touched.Price}
        required
      />

      <FormField
        label="Location or Description"
        name="Location"
        type="textarea"
        value={formik.values.Location}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.Location}
        touched={formik.touched.Location}
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

export default BaseUnitForm;
