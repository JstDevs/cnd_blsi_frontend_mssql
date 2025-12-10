import React, { useRef } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';
import Select from 'react-select';
import SearchableDropdown from '../common/SearchableDropdown';

function GeneralLedgerForm({
  funds = [],
  accountOptions = [],
  accLoading = false,
  onView,
  onGenerateJournal,
  onExportExcel,
}) {
  const submitAction = useRef(null);

  const validationSchema = Yup.object({
    ChartofAccountsID: Yup.string().required('Chart of Accounts is required'),
    CutOffDate: Yup.string().required('Cut Off Date is required'),
    FundID: Yup.string().required('Fund is required'),
  });

  const initialValues = {
    ChartofAccountsID: '',
    CutOffDate: '',
    FundID: '',
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const action = submitAction.current;

    if (action === 'view') {
      onView(values);
    } else if (action === 'generate') {
      onGenerateJournal(values);
    } else if (action === 'export') {
      onExportExcel(values);
    }

    setSubmitting(false);
    submitAction.current = null; // clear after use
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validateOnMount={true}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isSubmitting,
        setFieldValue,
      }) => (
        <Form className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 sm:gap-4 gap-1">
            {/* <div>
              <label className="form-label">Chart of Accounts<span className="text-red-500">*</span></label>
              <Select
                  options={accountOptions}
                  placeholder="Select a chart of account..."
                  isSearchable={true}
                  name="ChartofAccountsID"
                  value={
                      accountOptions.find(
                          opt => String(opt.value) === String(values.ChartofAccountsID)
                      ) || null
                  }
                  onChange={(selected) =>
                  setFieldValue('ChartofAccountsID', selected?.value || '')
                  }
                  onBlur={handleBlur}
              />
              {errors.ChartofAccountsID && touched.ChartofAccountsID && (
                <p className="mt-1 text-sm text-error-600">{errors.ChartofAccountsID}</p>
              )}
            </div> */}
            <SearchableDropdown
              label="Chart of Account"
              name="ChartofAccountsID"
              placeholder="Select a chart of account..."
              type="select"
              required
              selectedValue={values.ChartofAccountsID}
              onSelect={(selectedValue) =>
                setFieldValue('ChartofAccountsID', selectedValue)
              }
              options={accountOptions}
              error={errors.ChartofAccountsID}
              touched={touched.ChartofAccountsID}
              className="w-full mb-3"
            />
            <FormField
              label="Cut Off Date"
              name="CutOffDate"
              type="date"
              value={values.CutOffDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.CutOffDate}
              touched={touched.CutOffDate}
              required
            />
            <FormField
              type="select"
              label="Fund"
              name="FundID"
              options={funds.map((item) => ({
                value: item.ID,
                label: item.Name,
              }))}
              value={values.FundID}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.FundID}
              touched={touched.FundID}
              required
            />
          </div>

          {/* Row 3: Buttons */}
          <div className="flex justify-end gap-3 max-sm:flex-col pt-4 border-t border-neutral-200">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              onClick={() => (submitAction.current = 'view')}
            >
              View
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={isSubmitting}
              // onClick={() => (submitAction.current = 'generate')}
            >
              Generate Ledger
            </button>
            <button
              type="submit"
              className="btn btn-outline"
              disabled={isSubmitting}
              onClick={() => (submitAction.current = 'export')}
            >
              Export to Excel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default GeneralLedgerForm;
