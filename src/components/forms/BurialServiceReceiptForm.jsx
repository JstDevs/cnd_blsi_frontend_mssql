import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

const burialServiceReceiptSchema = Yup.object().shape({
  receiptNo: Yup.string().required('Receipt number is required'),
  name: Yup.string().required('Name is required'),
  cityMunicipality: Yup.string().required('City/Municipality is required'),
  province: Yup.string().required('Province is required'),
  deceasedName: Yup.string().required('Deceased name is required'),
  nationality: Yup.string().required('Nationality is required'),
  age: Yup.number()
    .required('Age is required')
    .min(0, 'Age must be positive')
    .max(150, 'Age must be realistic'),
  sex: Yup.string().required('Sex is required'),
  dateOfDeath: Yup.date().required('Date of death is required'),
  causeOfDeath: Yup.string().required('Cause of death is required'),
  cemeteryName: Yup.string().required('Cemetery name is required'),
  serviceType: Yup.string().required('Service type is required'),
});

function BurialServiceReceiptForm({ initialData, onClose, onSubmit }) {
  const initialValues = initialData || {
    receiptNo: '',
    name: '',
    cityMunicipality: '',
    province: '',
    deceasedName: '',
    nationality: '',
    age: '',
    sex: '',
    dateOfDeath: '',
    causeOfDeath: '',
    cemeteryName: '',
    serviceType: '',
    attachments: null,
  };

  const handleSubmit = (values) => {
    onSubmit(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={burialServiceReceiptSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Receipt No"
              name="receiptNo"
              type="text"
              required
              value={values.receiptNo}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.receiptNo}
              touched={touched.receiptNo}
              placeholder="Enter receipt number"
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
              placeholder="Enter name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="To the City Municipality of"
              name="cityMunicipality"
              type="text"
              required
              value={values.cityMunicipality}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.cityMunicipality}
              touched={touched.cityMunicipality}
              placeholder="Enter city/municipality"
            />

            <FormField
              label="Province of"
              name="province"
              type="text"
              required
              value={values.province}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.province}
              touched={touched.province}
              placeholder="Enter province"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Deceased Name"
              name="deceasedName"
              type="text"
              required
              value={values.deceasedName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.deceasedName}
              touched={touched.deceasedName}
              placeholder="Enter deceased name"
            />

            <FormField
              label="Nationality"
              name="nationality"
              type="text"
              required
              value={values.nationality}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.nationality}
              touched={touched.nationality}
              placeholder="Enter nationality"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Age"
              name="age"
              type="number"
              required
              value={values.age}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.age}
              touched={touched.age}
              placeholder="Enter age"
            />

            <FormField
              label="Sex"
              name="sex"
              type="select"
              required
              value={values.sex}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.sex}
              touched={touched.sex}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
              ]}
            />

            <FormField
              label="Date of Death"
              name="dateOfDeath"
              type="date"
              required
              value={values.dateOfDeath}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.dateOfDeath}
              touched={touched.dateOfDeath}
            />
          </div>

          <FormField
            label="Cause of Death"
            name="causeOfDeath"
            type="text"
            required
            value={values.causeOfDeath}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.causeOfDeath}
            touched={touched.causeOfDeath}
            placeholder="Enter cause of death"
          />

          <FormField
            label="Name of Cemetery"
            name="cemeteryName"
            type="text"
            required
            value={values.cemeteryName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.cemeteryName}
            touched={touched.cemeteryName}
            placeholder="Enter cemetery name"
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Service Type</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="serviceType"
                  value="inter"
                  checked={values.serviceType === 'inter'}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2">Inter</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="serviceType"
                  value="disinter"
                  checked={values.serviceType === 'disinter'}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2">Disinter</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="serviceType"
                  value="remove"
                  checked={values.serviceType === 'remove'}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2">Remove</span>
              </label>
            </div>
            {errors.serviceType && touched.serviceType && (
              <div className="text-red-500 text-sm mt-1">{errors.serviceType}</div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Attachments</label>
            <input
              type="file"
              onChange={(event) => {
                setFieldValue("attachments", event.currentTarget.files[0]);
              }}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {errors.attachments && touched.attachments && (
              <div className="text-red-500 text-sm mt-1">{errors.attachments}</div>
            )}
          </div>

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

export default BurialServiceReceiptForm; 