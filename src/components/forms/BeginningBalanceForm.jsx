import React, { useRef } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

function BeginningBalanceForm({
  fiscalYears = [],
  onSubmit,
  onAddClick,
  onTransferClick,
  Add,
}) {
  const validationSchema = Yup.object({
    FiscalYearID: Yup.string().required('Fiscal Year is required'),
  });

  const initialValues = {
    FiscalYearID: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnMount={true}
      onSubmit={onSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isSubmitting,
      }) => (
        <Form>
          <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between sm:gap-4 w-full">
            {/* Left Side: Fiscal Year + Search */}
            <div className="flex flex-wrap items-center sm:gap-4 w-full sm:w-auto">
              <div className="w-full sm:w-auto">
                <FormField
                  type="select"
                  label="Fiscal Year"
                  name="FiscalYearID"
                  options={fiscalYears}
                  value={values.FiscalYearID}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.FiscalYearID}
                  touched={touched.FiscalYearID}
                  required
                />
              </div>
            </div>

            {/* Right Side: Add + Transfer */}
            <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
              <button
                type="submit"
                className="btn btn-primary w-full sm:w-auto"
                disabled={isSubmitting}
              >
                Search
              </button>
              {Add && (
                <button
                  type="button"
                  className="btn btn-secondary w-full sm:w-auto"
                  onClick={onAddClick}
                >
                  Add
                </button>
              )}
              <button
                type="button"
                className="btn btn-outline w-full sm:w-auto"
                onClick={onTransferClick}
              >
                Transfer
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default BeginningBalanceForm;
