import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import FormField from '../../components/common/FormField';
import Button from '../../components/common/Button';
import { Trash2 } from 'lucide-react';
import Select from 'react-select';

const PURCHASE_REQUEST_SCHEMA = Yup.object().shape({
  ResponsibilityCenter: Yup.string().required('Department is required'),
  OfficeUnitProject: Yup.string().required('Section is required'),
  ContraAccountID: Yup.string().required('Charge Account is required'),
  InvoiceNumber: Yup.string().required('PR Number is required'),
  SAI_No: Yup.string(),
  ObligationRequestNumber: Yup.string(),
  InvoiceDate: Yup.date().required('PR Date is required'),
  SAIDate: Yup.date(),
  ALOBSDate: Yup.date(),
  Remarks: Yup.string().required('Purpose is required'),
  Items: Yup.array()
    .of(
      Yup.object({
        ItemID: Yup.string().required('Required'),
        Quantity: Yup.string().required('Required'),
        Unit: Yup.string().required('Required'),
        Cost: Yup.number()
          .nullable()
          .typeError('Must be a number')
          .required('Cost is required'),
      })
    )
    .min(1, 'At least one entry is required'),
});

function PurchaseRequestForm({
  initialData,
  onSubmit,
  onClose,
  departmentsOptions = [],
  chartOfAccountsOptions = [],
  itemsOptions = [],
  itemsUnitsOptions = [],
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = initialData
    ? {
        ...initialData,
        Items: initialData.PurchaseItems || [], // 👈 remap here
      }
    : {
        ResponsibilityCenter: '',
        OfficeUnitProject: '',
        InvoiceNumber: '',
        ContraAccountID: '',
        SAI_No: '',
        ObligationRequestNumber: '',
        InvoiceDate: '',
        SAIDate: '',
        ALOBSDate: '',
        Remarks: '',
        Items: [{ ItemID: '', Quantity: 0, Unit: '', Cost: 0 }],
      };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={PURCHASE_REQUEST_SCHEMA}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
      }) => (
        <Form className="space-y-1">
          <div className="grid grid-cols-1 md:grid-cols-3 sm:gap-4">
            <FormField
              className="p-3 focus:outline-none"
              label="Department"
              name="ResponsibilityCenter"
              type="select"
              required
              value={values.ResponsibilityCenter}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.ResponsibilityCenter}
              touched={touched.ResponsibilityCenter}
              options={departmentsOptions}
            />

            <FormField
              className="p-3 focus:outline-none"
              label="Section"
              name="OfficeUnitProject"
              type="text"
              required
              value={values.OfficeUnitProject}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.OfficeUnitProject}
              touched={touched.OfficeUnitProject}
            />
            <FormField
              className="p-3 focus:outline-none"
              label="Charge Account"
              name="ContraAccountID"
              type="select"
              required
              value={values.ContraAccountID}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.ContraAccountID}
              touched={touched.ContraAccountID}
              options={chartOfAccountsOptions}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 sm:gap-4">
            <FormField
              className="p-3 focus:outline-none"
              label="PR No."
              name="InvoiceNumber"
              type="text"
              required
              value={values.InvoiceNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.InvoiceNumber}
              touched={touched.InvoiceNumber}
            />
            <FormField
              className="p-3 focus:outline-none"
              label="SAI No."
              name="SAI_No"
              type="text"
              value={values.SAI_No}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.SAI_No}
              touched={touched.SAI_No}
            />

            <FormField
              className="p-3 focus:outline-none"
              label="ALOBS No."
              name="ObligationRequestNumber"
              type="text"
              value={values.ObligationRequestNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.ObligationRequestNumber}
              touched={touched.ObligationRequestNumber}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 sm:gap-4">
            <FormField
              className="p-3 focus:outline-none"
              label="PR Date"
              name="InvoiceDate"
              type="date"
              required
              value={values.InvoiceDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.InvoiceDate}
              touched={touched.InvoiceDate}
            />

            <FormField
              className="p-3 focus:outline-none"
              label="SAI Date"
              name="SAIDate"
              type="date"
              value={values.SAIDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.SAIDate}
              touched={touched.SAIDate}
            />

            <FormField
              className="p-3 focus:outline-none"
              label="ALOBS Date"
              name="ALOBSDate"
              type="date"
              value={values.ALOBSDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.ALOBSDate}
              touched={touched.ALOBSDate}
            />
          </div>

          <FormField
            className="p-3 focus:outline-none"
            label="Purpose"
            name="Remarks"
            type="text"
            required
            value={values.Remarks}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.Remarks}
            touched={touched.Remarks}
          />

          {/* New Items field */}

          <hr className="!mt-5 !mb-5" />

          {/* Items Section */}
          <FieldArray
            name="Items"
            render={({ remove, push }) => (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="font-medium">Items</label>
                  <Button
                    type="button"
                    onClick={() =>
                      push({ ItemID: '', Quantity: 0, Unit: '', Cost: 0 })
                    }
                    className="btn btn-sm btn-primary"
                  >
                    + Add
                  </Button>
                </div>

                {values.Items.map((entry, index) => (
                  <div
                    key={index}
                    className="space-y-2 border p-4 rounded-md bg-neutral-50"
                  >
                    <div className="flex max-sm:flex-col flex-wrap gap-2 w-full">
                      <div className="flex-1 w-full sm:min-w-[200px]">
                        <div>
                          <label className="form-label">
                            Item <span className="text-error-500">*</span>
                          </label>
                        </div>
                        <Select
                          label="Item"
                          options={itemsOptions}
                          placeholder="Select item..."
                          isSearchable={true}
                          onChange={(selected) =>
                            setFieldValue(
                              `Items[${index}].ItemID`,
                              selected?.value || ''
                            )
                          }
                          name={`Items[${index}].ItemID`}
                          value={
                            itemsOptions.find(
                              (opt) => opt.value === entry.ItemID
                            ) || null
                          }
                          onBlur={handleBlur}
                          required
                        />
                        {errors.Items?.[index]?.ItemID && (
                          <div className="text-sm text-red-600 mt-1">
                            {errors.Items[index].ItemID}
                          </div>
                        )}
                      </div>
                      <FormField
                        className="flex-1 w-full sm:max-w-[180px]"
                        type="number"
                        label="Quantity"
                        name={`Items[${index}].Quantity`}
                        value={entry.Quantity}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.Items?.[index]?.Quantity}
                        touched={touched.Items?.[index]?.Quantity}
                        required
                      />
                      <FormField
                        className="flex-1 w-full sm:max-w-[150px]"
                        type="select"
                        label="Unit"
                        name={`Items[${index}].Unit`}
                        value={entry.Unit}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        options={itemsUnitsOptions}
                        error={errors.Items?.[index]?.Unit}
                        touched={touched.Items?.[index]?.Unit}
                        required
                      />
                      <FormField
                        className="flex-1 w-full sm:max-w-[200px]"
                        type="text" // change to text so we can control formatting
                        label="Cost"
                        name={`Items[${index}].Cost`}
                        value={
                          entry.Cost !== '' && !isNaN(entry.Cost)
                            ? Number(entry.Cost).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : ''
                        }
                        onChange={(e) => {
                          // Strip all non-digit characters
                          const rawValue = e.target.value.replace(/\D/g, '');

                          // Format into cents
                          const formattedValue = rawValue
                            ? (parseInt(rawValue, 10) / 100).toFixed(2)
                            : '';

                          handleChange({
                            target: {
                              name: `Items[${index}].Cost`,
                              value: formattedValue,
                            },
                          });
                        }}
                        onBlur={handleBlur}
                        error={errors.Items?.[index]?.Cost}
                        touched={touched.Items?.[index]?.Cost}
                        required
                      />
                    </div>

                    <div className="flex justify-end pt-0">
                      <Button
                        type="button"
                        onClick={() => remove(index)}
                        className="bg-red-600 hover:bg-red-700 text-white p-1"
                        disabled={values.Items.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* ✅ Totals Row */}
                <div className="grid grid-cols-3 sm:grid-cols-6 sm:gap-4 border-t pt-4 font-semibold">
                  <div className=" col-span-1 sm:col-span-2 sm:text-right">
                    Total:
                  </div>

                  <div className="col-span-1 sm:col-span-2 text-right">
                    <div className="font-bold">
                      {values.Items.reduce(
                        (sum, e) => sum + (parseFloat(e.Cost) || 0),
                        0
                      ).toFixed(2)}{' '}
                      <span className="text-sm max-sm:block font-normal text-gray-500">
                        (Estimated Cost)
                      </span>
                    </div>
                  </div>

                  <div className="col-span-1 sm:col-span-2 text-right">
                    <div className="font-bold">
                      {values.Items.reduce(
                        (sum, e) =>
                          sum +
                          (parseFloat(e.Cost) || 0) *
                            (parseFloat(e.Quantity) || 0),
                        0
                      ).toFixed(2)}{' '}
                      <span className="text-sm max-sm:block font-normal text-gray-500">
                        (Cost)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          />

          <div className="flex justify-end space-x-2 !mt-5">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              Save
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default PurchaseRequestForm;
