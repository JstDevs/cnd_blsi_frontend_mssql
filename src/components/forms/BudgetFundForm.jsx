import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';
import { useEffect, useState } from 'react';

const validationSchema = Yup.object({
  Code: Yup.string().required('Code is required'),
  Name: Yup.string().required('Name is required'),
  Description: Yup.string().required('Description is required'),
  Amount: Yup.number()
    .required('Amount is required')
    .min(0, 'Amount must be positive'),
});

const initialValues = {
  Code: '',
  Name: '',
  Description: '',
  Amount: 0,
};

function BudgetFundForm({ initialData, onSubmit, onClose }) {
  const [formData, setFormData] = useState({ ...initialValues });

  const handleSubmit = (values, { setSubmitting }) => {
    onSubmit(values);
    setSubmitting(false);
    console.log('Form submitted with values:', values);
  };

  useEffect(() => {
    if (initialData?.ID) {
      setFormData({
        ID: initialData?.ID || '',
        Code: initialData?.Code || '',
        Name: initialData?.Name || '',
        Description: initialData?.Description || '',
        Amount: initialData?.OriginalAmount || '',
      });
    } else {
      setFormData(initialValues);
    }
  }, [initialData]);

  return (
    <Formik
      enableReinitialize
      onSubmit={handleSubmit}
      initialValues={formData}
      validationSchema={validationSchema}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isSubmitting,
      }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            <FormField
              label="Code"
              name="Code"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.Code}
              error={errors.Code}
              touched={touched.Code}
              placeholder="e.g., 100,200,300"
              required
            />
            <FormField
              label="Name"
              name="Name"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.Name}
              error={errors.Name}
              touched={touched.Name}
              placeholder="Enter Name "
              required
            />
            <FormField
              label="Amount"
              name="Amount"
              type="text" // text for full control
              onChange={(e) => {
                // Remove all non-digit characters
                const rawValue = e.target.value.replace(/\D/g, '');

                // Format into cents (two decimal places)
                const formattedValue = rawValue
                  ? (parseInt(rawValue, 10) / 100).toFixed(2)
                  : '';

                handleChange({
                  target: {
                    name: 'Amount',
                    value: formattedValue,
                  },
                });
              }}
              onBlur={handleBlur}
              value={
                values.Amount !== '' && !isNaN(values.Amount)
                  ? Number(values.Amount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : ''
              }
              error={errors.Amount}
              touched={touched.Amount}
              placeholder="Enter Amount"
              required
            />

            <FormField
              name="Description"
              type="textarea"
              label="Description"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.Description}
              error={errors.Description}
              touched={touched.Description}
              placeholder="Enter Description"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {initialData ? 'Update' : 'Save'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default BudgetFundForm;
