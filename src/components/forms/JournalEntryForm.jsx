import { useFormik, FieldArray, FormikProvider } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';
import Button from '../common/Button';
import { Trash2 } from 'lucide-react';
import Select from 'react-select';
import { useState } from 'react'; // already imported
const API_URL = import.meta.env.VITE_API_URL;
function JournalEntryForm({
  initialData,
  onSubmit,
  onClose,
  typeOptions,
  fundOptions,
  centerOptions,
  accountOptions,
}) {
  const [balanceError, setBalanceError] = useState('');
  // Add state to track the selected type
  const [selectedType, setSelectedType] = useState(initialData?.JEVType || '');

  const validationSchema = Yup.object({
    JEVType: Yup.string().required('Type is required'),
    FundsID: Yup.string().required('Fund is required'),
    InvoiceDate: Yup.date().required('Date is required'),
    SAI_No: Yup.string(),
    Remarks: Yup.string().required('Particulars are required'),
    ObligationRequestNumber: Yup.string(),
    // Make CheckNumber required only if not Cash type
    CheckNumber: Yup.string(),
    CheckDate: Yup.date(),
    AccountingEntries: Yup.array()
      .of(
        Yup.object({
          ResponsibilityCenter: Yup.string().required('Required'),
          AccountExplanation: Yup.string().required('Required'),
          // PR: Yup.string().required('Required'),
          Debit: Yup.number()
            .nullable()
            .typeError('Must be a number')
            .required('Debit is required'),
          Credit: Yup.number()
            .nullable()
            .typeError('Must be a number')
            .required('Credit is required'),
        })
      )
      .min(1, 'At least one entry is required'),
  });
  const formik = useFormik({
    initialValues: initialData || {
      JEVType: '',
      FundsID: '',
      InvoiceDate: '',
      SAI_No: '',
      Remarks: '',
      Payee: '',
      ObligationRequestNumber: '',
      CheckNumber: '',
      CheckDate: '',
      AccountingEntries: [
        {
          ResponsibilityCenter: '',
          AccountExplanation: '',
          // PR: '',
          Debit: 0,
          Credit: 0,
        },
      ],
      Attachments: [],
    },
    validationSchema,
    onSubmit: async (values, setSubmitting) => {
      const totalDebit = values.AccountingEntries.reduce(
        (sum, entry) => sum + (parseFloat(entry.Debit) || 0),
        0
      );
      const totalCredit = values.AccountingEntries.reduce(
        (sum, entry) => sum + (parseFloat(entry.Credit) || 0),
        0
      );
      console.log(values);
      if (totalDebit !== totalCredit) {
        setBalanceError('Total Debit must be equal to Total Credit.');
        return;
      } else {
        setBalanceError('');
      }

      const formData = new FormData();

      for (const key in values) {
        if (key === 'Attachments') {
          values.Attachments.forEach((att, idx) => {
            if (att.ID) {
              formData.append(`Attachments[${idx}].ID`, att.ID);
            } else {
              formData.append(`Attachments[${idx}].File`, att.File);
            }
          });
        } else if (key !== 'CheckDate') {
          formData.append(key, JSON.stringify(values[key]));
        }
      }

      // Handle CheckDate separately
      formData.append(
        'CheckDate',
        JSON.stringify(values.CheckDate || values.InvoiceDate)
      );
      // Optional: LinkID if editing
      if (initialData) {
        formData.append('LinkID', initialData.LinkID);
      }
      try {
        await onSubmit(formData);
      } catch (err) {
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    },
  });
  // Update selectedType when JEVType changes
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    formik.handleChange(e);
  };

  const { values, handleChange, handleBlur, errors, touched } = formik;
  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-4">
          <FormField
            type="select"
            label="Type"
            name="JEVType"
            options={typeOptions}
            value={values.JEVType}
            onChange={handleTypeChange} // Use the custom handler
            onBlur={handleBlur}
            error={errors.JEVType}
            touched={touched.JEVType}
            required
          />
          <FormField
            type="select"
            label="Fund"
            name="FundsID"
            options={fundOptions}
            value={values.FundsID}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.FundsID}
            touched={touched.FundsID}
            required
          />
          <FormField
            type="date"
            label="Invoice Date"
            name="InvoiceDate"
            value={values.InvoiceDate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.InvoiceDate}
            touched={touched.InvoiceDate}
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-4">
          <FormField
            type="text"
            label="OBR No"
            name="ObligationRequestNumber"
            value={values.ObligationRequestNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.ObligationRequestNumber}
            touched={touched.ObligationRequestNumber}
          />
          <FormField
            type="text"
            label="Remarks"
            name="Remarks"
            value={values.Remarks}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.Remarks}
            touched={touched.Remarks}
            required
          />
          <FormField
            type="text"
            label="Payee"
            name="Payee"
            value={values.Payee}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.Payee}
            touched={touched.Payee}
          />
        </div>

        {/* Row 4 */}
        {/* Only show Check Number if not Cash type */}
        {selectedType === 'Check Disbursement' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-4">
            <FormField
              type="text"
              label="DV No"
              name="SAI_No"
              value={values.SAI_No}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.SAI_No}
              touched={touched.SAI_No}
            />
            <FormField
              type="text"
              label="Check No"
              name="CheckNumber"
              value={values.CheckNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.CheckNumber}
              touched={touched.CheckNumber}
              // required={selectedType !== 'Cash Disbursement'}
            />
            <FormField
              type="date"
              label="Check Date"
              name="CheckDate"
              value={values.CheckDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.CheckDate}
              touched={touched.CheckDate}
              // required={selectedType !== 'Cash Disbursement'}
            />
          </div>
        )}

        <hr />

        {/* Accounting Entries Section */}
        <FieldArray
          name="AccountingEntries"
          render={({ remove, push }) => (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium">Accounting Entries</label>
                <Button
                  type="button"
                  onClick={() =>
                    push({
                      ResponsibilityCenter: '',
                      AccountExplanation: '',
                      PR: '',
                      Debit: 0,
                      Credit: 0,
                    })
                  }
                  className="btn btn-sm btn-primary"
                >
                  + Add
                </Button>
              </div>

              {values.AccountingEntries.map((entry, index) => {
                // Check if either Debit or Credit has a value
                const hasDebit = parseFloat(entry.Debit) > 0;
                const hasCredit = parseFloat(entry.Credit) > 0;
                return (
                  <div
                    key={index}
                    className="space-y-2 border p-4 rounded-md bg-neutral-50"
                  >
                    <div className="flex max-sm:flex-col sm:flex-wrap gap-2 w-full">
                      <FormField
                        className="flex-1 w-full sm:min-w-[200px]"
                        type="select"
                        label="Responsibility Center"
                        name={`AccountingEntries[${index}].ResponsibilityCenter`}
                        options={centerOptions}
                        value={entry.ResponsibilityCenter}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          errors.AccountingEntries?.[index]
                            ?.ResponsibilityCenter
                        }
                        touched={
                          touched.AccountingEntries?.[index]
                            ?.ResponsibilityCenter
                        }
                        required
                      />
                      <div className="flex-1 sm:min-w-[200px]">
                        <label className="form-label">
                          Accounts and Explanation{' '}
                          <span className="text-error-500">*</span>
                        </label>
                        <Select
                          label="Accounts and Explanation"
                          options={accountOptions}
                          className="focus:!ring-none focus:!border-none focus:bg-red-600"
                          placeholder="Select an account..."
                          isSearchable={true}
                          onChange={(selected) =>
                            formik.setFieldValue(
                              `AccountingEntries[${index}].AccountExplanation`,
                              selected?.value || ''
                            )
                          }
                          name={`AccountingEntries[${index}].AccountExplanation`}
                          value={
                            accountOptions.find(
                              (opt) => opt.value === entry.AccountExplanation
                            ) || null
                          }
                          onBlur={handleBlur}
                          required
                        />
                        {errors.AccountingEntries?.[index]
                          ?.AccountExplanation && (
                          <div className="text-sm text-red-600 mt-1">
                            {errors.AccountingEntries[index].AccountExplanation}
                          </div>
                        )}
                      </div>
                      {/* <FormField
                      className="flex-1 max-w-[150px]"
                      type="text"
                      label="PR"
                      name={`AccountingEntries[${index}].PR`}
                      value={entry.PR}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.AccountingEntries?.[index]?.PR}
                      touched={touched.AccountingEntries?.[index]?.PR}
                      required
                    /> */}
                      <FormField
                        className="flex-1 sm:max-w-[150px] disabled:bg-gray-200 disabled:cursor-not-allowed"
                        type="number"
                        label="Debit"
                        name={`AccountingEntries[${index}].Debit`}
                        value={entry.Debit}
                        onChange={(e) => {
                          // When Debit changes, clear Credit if it exists
                          if (
                            e.target.value &&
                            parseFloat(e.target.value) > 0
                          ) {
                            formik.setFieldValue(
                              `AccountingEntries[${index}].Credit`,
                              0
                            );
                          }
                          handleChange(e);
                        }}
                        onBlur={handleBlur}
                        error={errors.AccountingEntries?.[index]?.Debit}
                        touched={touched.AccountingEntries?.[index]?.Debit}
                        // disabled={hasCredit} // Disable if Credit has value
                        required={!hasCredit} // Only required if Credit is empty
                      />

                      <FormField
                        className="flex-1 sm:max-w-[150px] disabled:bg-gray-200 disabled:cursor-not-allowed"
                        type="number"
                        label="Credit"
                        name={`AccountingEntries[${index}].Credit`}
                        value={entry.Credit}
                        onChange={(e) => {
                          // When Credit changes, clear Debit if it exists
                          if (
                            e.target.value &&
                            parseFloat(e.target.value) > 0
                          ) {
                            formik.setFieldValue(
                              `AccountingEntries[${index}].Debit`,
                              0
                            );
                          }
                          handleChange(e);
                        }}
                        onBlur={handleBlur}
                        error={errors.AccountingEntries?.[index]?.Credit}
                        touched={touched.AccountingEntries?.[index]?.Credit}
                        // disabled={hasDebit} // Disable if Debit has value
                        required={!hasDebit} // Only required if Debit is empty
                      />
                    </div>

                    <div className="flex justify-end pt-0">
                      <Button
                        type="button"
                        onClick={() => remove(index)}
                        className="bg-red-600 hover:bg-red-700 text-white p-1"
                        disabled={values.AccountingEntries.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}

              {/* ✅ Totals Row */}
              <div className="grid grid-cols-6 gap-4 border-t pt-4 font-semibold">
                <div className="col-span-2 text-right">Total:</div>

                <div className="col-span-2 text-right">
                  <div className="text-green-600 font-bold">
                    {values.AccountingEntries.reduce(
                      (sum, e) => sum + (parseFloat(e.Debit) || 0),
                      0
                    ).toFixed(2)}{' '}
                    <span className="text-sm font-normal text-gray-500">
                      (debit)
                    </span>
                  </div>
                </div>

                <div className="col-span-2 text-right">
                  <div className="text-red-600 font-bold">
                    {values.AccountingEntries.reduce(
                      (sum, e) => sum + (parseFloat(e.Credit) || 0),
                      0
                    ).toFixed(2)}{' '}
                    <span className="text-sm font-normal text-gray-500">
                      (credit)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        />

        <hr />

        <FieldArray
          name="Attachments"
          render={({ remove, push }) => (
            <div className="space-y-4">
              <div className="mb-2 mt-10">
                <label className="font-medium">Attachments</label>
                <Button
                  type="button"
                  onClick={() => push({ File: null })}
                  className="btn btn-sm btn-primary ml-5"
                >
                  + Add
                </Button>
              </div>

              {values.Attachments?.map((att, index) => (
                <div key={index} className="flex items-center gap-4 mb-2">
                  {att.ID ? (
                    <div className="flex-1">
                      <a
                        href={`${API_URL}/uploads/${att.DataImage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {att.DataName}
                      </a>
                      <input
                        type="hidden"
                        name={`Attachments[${index}].ID`}
                        value={att.ID}
                      />
                    </div>
                  ) : (
                    <div className="flex-1 min-w-[300px]">
                      <label className="block text-sm font-medium mb-1">{`File ${
                        index + 1
                      }`}</label>
                      <input
                        type="file"
                        name={`Attachments[${index}].File`}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
                        onChange={(e) =>
                          formik.setFieldValue(
                            `Attachments[${index}].File`,
                            e.currentTarget.files[0]
                          )
                        }
                        onBlur={handleBlur}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      />
                    </div>
                  )}

                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    className="bg-red-600 hover:bg-red-700 text-white p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        />

        {balanceError && (
          <div className="text-red-600 text-sm font-medium text-right">
            {balanceError}
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
          <Button type="button" onClick={onClose} className="btn btn-outline">
            Cancel
          </Button>
          <Button
            type="submit"
            className="btn btn-primary"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </FormikProvider>
  );
}

export default JournalEntryForm;
