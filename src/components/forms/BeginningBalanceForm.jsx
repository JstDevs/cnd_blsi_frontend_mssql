import React, { useRef } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

function BeginningBalanceForm({ fiscalYears = [], onSubmit, onAddClick, onTransferClick }) {
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
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
        <Form>
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left Side: Fiscal Year + Search */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="w-auto sm:w-auto">
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

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                Search
              </button>
            </div>

            {/* Right Side: Add + Transfer */}
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onAddClick}
              >
                Add
              </button>
              <button
                type="button"
                className="btn btn-outline"
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
