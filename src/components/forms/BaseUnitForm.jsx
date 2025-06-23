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
    SubClassNo: Yup.string().required('Sub Class No is required'),
    UnitValue: Yup.number().required('Unit Value is required'),
    LocationDescription: Yup.string().required('Location or Description is required'),
  });

  const formik = useFormik({
    initialValues: initialData || {
      generalRevisionYear: currentYear,
      classification: '',
      unit: '',
      actualUse: '',
      subClassNo: '',
      unitValue: '',
      locationDescription: '',
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
        name="generalRevisionYear"
        type="number"
        value={formik.values.generalRevisionYear}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.generalRevisionYear}
        touched={formik.touched.generalRevisionYear}
        required
      />

      <FormField
        label="Classification"
        name="classification"
        type="text"
        value={formik.values.classification}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.classification}
        touched={formik.touched.classification}
        required
      />

      <FormField
        label="Unit"
        name="unit"
        type="text"
        value={formik.values.unit}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.unit}
        touched={formik.touched.unit}
        required
      />

      <FormField
        label="Actual Use"
        name="actualUse"
        type="text"
        value={formik.values.actualUse}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.actualUse}
        touched={formik.touched.actualUse}
        required
      />

      <FormField
        label="Sub Class No"
        name="subClassNo"
        type="text"
        value={formik.values.subClassNo}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.subClassNo}
        touched={formik.touched.subClassNo}
        required
      />

      <FormField
        label="Unit Value"
        name="unitValue"
        type="number"
        value={formik.values.unitValue}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.unitValue}
        touched={formik.touched.unitValue}
        required
      />

      <FormField
        label="Location or Description"
        name="locationDescription"
        type="textarea"
        value={formik.values.locationDescription}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.locationDescription}
        touched={formik.touched.locationDescription}
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
