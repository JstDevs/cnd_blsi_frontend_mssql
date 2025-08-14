import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '@/components/common/FormField';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFunds } from '@/features/budget/fundsSlice';
import { useEffect } from 'react';

const CASHBOOK_SCHEMA = Yup.object().shape({
  StartDate: Yup.date()
    .required('From Date is required')
    .max(Yup.ref('EndDate'), 'From Date must be before or equal to To Date'),
  EndDate: Yup.date()
    .required('To Date is required')
    .min(Yup.ref('StartDate'), 'To Date must be after or equal to From Date'),
  fund: Yup.string().required('Fund is required'),
});

function CashbookForm({ onSubmit }) {
  const initialValues = {
    StartDate: '',
    EndDate: '',
    fund: '',
  };
  const { funds } = useSelector((state) => state.funds);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFunds());
  }, [dispatch]);

  const fundsOptions = [
    { value: 'all', label: 'All Funds' },
    ...(funds?.map((item) => ({
      value: item.ID,
      label: item.Name,
    })) || []),
  ];

  const handleFormSubmit = (values, { setSubmitting }) => {
    const payload = {
      ...values,
      FundID: values.fund === 'all' ? '%' : values.fund,
    };
    delete payload.fund;
    onSubmit(payload);
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={CASHBOOK_SCHEMA}
      onSubmit={handleFormSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleSubmit,
        setFieldValue,
        handleChange,
      }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-4">
            <FormField
              label="From Date"
              name="StartDate"
              type="date"
              required
              value={values.StartDate}
              onChange={handleChange}
              error={errors.StartDate}
              touched={touched.StartDate}
            />

            <FormField
              label="To Date"
              name="EndDate"
              type="date"
              required
              value={values.EndDate}
              onChange={handleChange}
              error={errors.EndDate}
              touched={touched.EndDate}
            />
            <FormField
              label="Fund"
              name="fund"
              type="select"
              required
              value={values.fund}
              onChange={handleChange}
              error={errors.fund}
              touched={touched.fund}
              options={fundsOptions}
            />
          </div>

          <div className="flex justify-end  max-sm:flex-col gap-3 pt-4 border-t border-neutral-200">
            <button
              type="submit"
              onClick={() => setFieldValue('action', 'view')}
              className="btn btn-primary"
            >
              View
            </button>
            <button
              type="submit"
              onClick={() => setFieldValue('action', 'generate')}
              className="btn btn-secondary"
            >
              Generate Cashbook
            </button>
            <button
              type="submit"
              onClick={() => setFieldValue('action', 'export')}
              className="btn btn-outline"
            >
              Export to Excel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default CashbookForm;
