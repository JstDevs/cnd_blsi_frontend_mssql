import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

// Validation schema for document types
const documentTypeSchema = Yup.object().shape({
  code: Yup.string().required('Code is required').max(10, 'Code must be at most 10 characters'),
  name: Yup.string().required('Name is required'),
  description: Yup.string(),
  category: Yup.string().required('Category is required'),
  status: Yup.string().required('Status is required'),
});

// Validation schema for document categories
const documentCategorySchema = Yup.object().shape({
  code: Yup.string().required('Code is required').max(10, 'Code must be at most 10 characters'),
  name: Yup.string().required('Name is required'),
  description: Yup.string(),
  status: Yup.string().required('Status is required'),
});

function DocumentForm({ initialData, onClose, type = 'types' }) {
  const initialValues = initialData || {
    code: '',
    name: '',
    description: '',
    category: '',
    status: 'Active',
  };

  const handleSubmit = (values) => {
    // Handle form submission
    console.log('Form values:', values);
    onClose();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={type === 'types' ? documentTypeSchema : documentCategorySchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Code"
              name="code"
              type="text"
              required
              value={values.code}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.code}
              touched={touched.code}
              placeholder="Enter document code"
            />

            <FormField
              label="Name"
              name="name"
              type="text"
              required
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              touched={touched.name}
              placeholder="Enter document name"
            />
          </div>

          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.description}
            touched={touched.description}
            placeholder="Enter document description"
            rows={3}
          />

          {type === 'types' && (
            <FormField
              label="Category"
              name="category"
              type="select"
              required
              value={values.category}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.category}
              touched={touched.category}
              options={[
                { value: 'Financial', label: 'Financial' },
                { value: 'Administrative', label: 'Administrative' },
                { value: 'Legal', label: 'Legal' },
                { value: 'Personnel', label: 'Personnel' },
              ]}
            />
          )}

          <FormField
            label="Status"
            name="status"
            type="select"
            required
            value={values.status}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.status}
            touched={touched.status}
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
            ]}
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
              disabled={isSubmitting}
            >
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default DocumentForm; 