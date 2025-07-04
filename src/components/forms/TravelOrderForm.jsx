import { useFormik, FieldArray, FormikProvider, Form } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import FormField from '../common/FormField';
import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import Button from '../common/Button';
import { fetchDepartments } from '../../features/settings/departmentSlice';
import { fetchEmployees } from '../../features/settings/employeeSlice';
import { fetchBudgets } from '../../features/budget/budgetSlice';


function TravelOrderForm({ initialData, onSubmit, onClose, officeOptions, employeeOptions }) {
  const API_URL = import.meta.env.VITE_API_URL;

  const { departments } = useSelector(state => state.departments);
  const { employees } = useSelector(state => state.employees);
  const { budgets } = useSelector(state => state.budget);

  const dispatch = useDispatch();
  useEffect(() => {
      dispatch(fetchDepartments());
      dispatch(fetchEmployees());
      dispatch(fetchBudgets());
    }, [dispatch]);

  const validationSchema = Yup.object({
    BudgetID: Yup.string().required('Office is required'),
    DateStart: Yup.date().required('Start Date is required'),
    DateEnd: Yup.date().required('End Date is required'),
    Place: Yup.string().required('Place/Office to be visited is required'),
    Venue: Yup.string().required('Venue/Destination is required'),
    Remarks: Yup.string(),
    Purpose: Yup.string().required('Purpose of Travel is required'),
    Travelers: Yup.array().of(
      Yup.object({
        TravelerID: Yup.string().required('Employee is required')
      })
    ).min(1, 'At least one traveler is required'),
    TravelPayments: Yup.array().of(
      Yup.object({
        Amount: Yup.number().required('Amount is required'),
        BudgetID: Yup.string().required('Budget of Fund is required'),
        Type: Yup.string().required('Type is required')
      })
    ).min(1, 'At least one expense is required'),
    TravelDocuments: Yup.array().of(
      Yup.object({
        Name: Yup.string().required('Document name is required')
      })
    ).min(1, 'At least one document is required'),
  });

  const formik = useFormik({
    initialValues: initialData || {
      BudgetID: '',
      DateStart: '',
      DateEnd: '',
      Place: '',
      Venue: '',
      Remarks: '',
      Purpose: '',
      Plane: false,
      Vessels: false,
      PUV: false,
      ServiceVehicle: false,
      RentedVehicle: false,
      Travelers: [{ TravelerID: '' }],
      TravelPayments: [{ Amount: '', BudgetID: '', Type: '' }],
      TravelDocuments: [{ Name: '' }],
      Attachments: [],
    },
    validationSchema,
    onSubmit: async(values, setSubmitting) => {
      const formData = new FormData();

      for (const key in values) {
        if (key === 'Attachments') {
          values.Attachments.forEach((att, idx) => {
            if (att.File) {
              formData.append(`Attachments[${idx}].File`, att.File);
            } else if (att.ID) {
              formData.append(`Attachments[${idx}].ID`, att.ID);
            }
          });
        }
        else {
          formData.append(key, JSON.stringify(values[key]));
        }
      }

      try {
        await onSubmit(formData);
      } catch (err) {
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    }
  });

  const { values, handleChange, handleBlur, errors, touched, isSubmitting } = formik;

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <FormField
          type="select"
          label="Office"
          name="BudgetID"
          options={departments.map(dept => ({
            value: dept.ID,
            label: dept.Name
          }))}
          value={values.BudgetID}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.BudgetID}
          touched={touched.BudgetID}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Start Date"
            name="DateStart"
            type="date"
            value={values.DateStart}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.DateStart}
            touched={touched.DateStart}
            required
          />
          <FormField
            label="End Date"
            name="DateEnd"
            type="date"
            value={values.DateEnd}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.DateEnd}
            touched={touched.DateEnd}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Place/Office to be visited"
            name="Place"
            type="text"
            value={values.Place}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.Place}
            touched={touched.Place}
            required
          />
          <FormField
            label="Venue/Destination"
            name="Venue"
            type="text"
            value={values.Venue}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.Venue}
            touched={touched.Venue}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            type="textarea"
            label="Remarks"
            name="Remarks"
            value={values.Remarks}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.Remarks}
            touched={touched.Remarks}
          />
          <FormField
            type="textarea"
            label="Purpose of Travel"
            name="Purpose"
            value={values.Purpose}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.Purpose}
            touched={touched.Purpose}
            required
          />
        </div>

        <div>
          <label className="font-medium block mb-2">Means of Transportation</label>
          <div className="grid grid-cols-3 gap-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="Plane"
                checked={values.Plane}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <span>Plane</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="Vessels"
                checked={values.Vessels}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <span>Ship/Boat</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="PUV"
                checked={values.PUV}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <span>PUV</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="ServiceVehicle"
                checked={values.ServiceVehicle}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <span>LGU Service Vehicle</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="RentedVehicle"
                checked={values.RentedVehicle}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <span>Vehicle for Rent</span>
            </label>
          </div>
        </div>


        <hr />

        <FieldArray
          name="Travelers"
          render={({ remove, push }) => (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium">Travelers</label>
                <Button
                  type="button"
                  onClick={() => push({ TravelerID: '' })}
                  className="btn btn-sm btn-primary"
                >
                  + Add
                </Button>
              </div>
              {values.Travelers.map((traveler, index) => (
                <div key={index} className="flex items-center space-x-4 mb-2">
                  <FormField
                    type="select"
                    label={`Employee ${index + 1}`}
                    name={`Travelers[${index}].TravelerID`}
                    options={employees.map(emp => ({
                      value: emp.ID,
                      label: emp.FirstName + ' ' + emp.MiddleName + ' ' + emp.LastName
                    }))}
                    value={traveler.TravelerID}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.Travelers?.[index]?.TravelerID}
                    touched={touched.Travelers?.[index]?.TravelerID}
                    className="min-w-[300px]"
                    required
                  />
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    className="bg-red-600 hover:bg-red-700 text-white p-1"
                    disabled={values.Travelers.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        />

        <hr />

        <FieldArray
          name="TravelPayments"
          render={({ remove, push }) => (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium">Expenses</label>
                <Button
                  type="button"
                  onClick={() => push({ Amount: '', BudgetID: '', Type: '' })}
                  className="btn btn-sm btn-primary"
                >
                  + Add
                </Button>
              </div>

              {values.TravelPayments?.map((TravelPayment, index) => (
                <div key={index} className="flex flex-wrap items-center items-end gap-4 mb-2">
                  {/* Amount */}
                  <FormField
                    type="number"
                    label="Amount"
                    name={`TravelPayments[${index}].Amount`}
                    value={TravelPayment.Amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.TravelPayments?.[index]?.Amount}
                    touched={touched.TravelPayments?.[index]?.Amount}
                    className="max-w-[180px] flex-1"
                    required
                  />

                  {/* Source of Fund */}
                  <FormField
                    type="select"
                    label="Source of Fund"
                    name={`TravelPayments[${index}].BudgetID`}
                    options={budgets.map(budget => ({
                      value: budget.id,
                      label: budget.budgetName
                    }))}
                    value={TravelPayment.BudgetID}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.TravelPayments?.[index]?.BudgetID}
                    touched={touched.TravelPayments?.[index]?.BudgetID}
                    className="min-w-[200px] flex-1"
                    required
                  />

                  {/* Type */}
                  <FormField
                    type="select"
                    label="Type"
                    name={`TravelPayments[${index}].Type`}
                    options={[
                      { label: 'One Time Payment', value: '1' },
                      { label: 'Per Day', value: '2' },
                    ]}
                    value={TravelPayment.Type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.TravelPayments?.[index]?.Type}
                    touched={touched.TravelPayments?.[index]?.Type}
                    className="min-w-[100px] flex-1"
                    required
                  />

                  {/* Remove Button */}
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    className="bg-red-600 hover:bg-red-700 text-white p-1 mt-2"
                    disabled={values.TravelPayments.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}


              {/* Total Row */}
              <div className="flex justify-end text-right mt-4">
                <label className="font-semibold mr-2">Total:</label>
                <span className="">
                  {values.TravelPayments?.reduce((sum, exp) => {
                    const amt = parseFloat(exp.Amount);
                    return sum + (isNaN(amt) ? 0 : amt);
                  }, 0).toFixed(2)}
                </span>
              </div>

            </div>
          )}
        />


        <hr />

        <FieldArray
          name="TravelDocuments"
          render={({ remove, push }) => (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium">Documents Required</label>
                <Button
                  type="button"
                  onClick={() => push({ Name: '' })}
                  className="btn btn-sm btn-primary"
                >
                  + Add
                </Button>
              </div>

              {values.TravelDocuments?.map((doc, index) => (
                <div key={index} className="flex items-center gap-4 mb-2">
                  <FormField
                    type="text"
                    label={`Document ${index + 1}`}
                    name={`TravelDocuments[${index}].Name`}
                    value={doc.Name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.TravelDocuments?.[index]?.Name}
                    touched={touched.TravelDocuments?.[index]?.Name}
                    className="flex-1 min-w-[300px]"
                    required
                  />
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    className="bg-red-600 hover:bg-red-700 text-white p-1"
                    disabled={values.TravelDocuments.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        />

        <hr />

        {/* <FieldArray
          name="Attachments"
          render={({ remove, push }) => (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium">Attachments</label>
                <Button
                  type="button"
                  onClick={() => push({ File: null })}
                  className="btn btn-sm btn-primary"
                >
                  + Add
                </Button>
              </div>

              {values.Attachments?.map((_, index) => (
                <div key={index} className="flex items-center gap-4 mb-2">
                  <div className="flex-1 min-w-[300px]">
                    <label className="block text-sm font-medium mb-1">{`File ${index + 1}`}</label>
                    <input
                      type="file"
                      name={`Attachments[${index}].File`}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
                      onChange={(e) =>
                        formik.setFieldValue(`Attachments[${index}].File`, e.currentTarget.files[0])
                      }
                      onBlur={handleBlur}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                    {touched.Attachments?.[index]?.File && errors.Attachments?.[index]?.File && (
                      <p className="text-red-500 text-sm mt-1">{errors.Attachments[index].File}</p>
                    )}
                  </div>

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
        /> */}
        <FieldArray
          name="Attachments"
          render={({ remove, push }) => (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium">Attachments</label>
                <Button
                  type="button"
                  onClick={() => push({ File: null })}
                  className="btn btn-sm btn-primary"
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
                      <input type="hidden" name={`Attachments[${index}].ID`} value={att.ID} />
                    </div>
                  ) : (
                    <div className="flex-1 min-w-[300px]">
                      <label className="block text-sm font-medium mb-1">{`File ${index + 1}`}</label>
                      <input
                        type="file"
                        name={`Attachments[${index}].File`}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
                        onChange={(e) =>
                          formik.setFieldValue(`Attachments[${index}].File`, e.currentTarget.files[0])
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



        <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
          <Button
            type="button"
            onClick={onClose}
            className="btn btn-outline"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </FormikProvider>
  );
}

export default TravelOrderForm;
