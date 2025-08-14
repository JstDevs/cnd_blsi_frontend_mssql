import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';
import SearchableDropdown from '../common/SearchableDropdown';
import { Paperclip, Trash2 } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL;
const validationSchema = Yup.object().shape({
  BudgetID: Yup.string().required('Budget is required'),
  budgetName: Yup.string(),
  fiscalYearID: Yup.string(),
  departmentID: Yup.string(),
  subDepartmentID: Yup.string(),
  chartOfAccountsID: Yup.string(),
  fundID: Yup.string(),
  projectID: Yup.string(),
  supplemental: Yup.number().integer().required('Supplemental is required'),
  remarks: Yup.string(),
  appropriation: Yup.number().integer(),
  balance: Yup.number().integer(),
  releasedAllotments: Yup.number().integer(),
  releasedBalance: Yup.number().integer(),
  Attachments: Yup.array(),
});

const initialValues = {
  BudgetID: '',
  budgetName: '',
  fiscalYearID: '',
  departmentID: '',
  subDepartmentID: '',
  chartOfAccountsID: '',
  fundID: '',
  projectID: '',
  supplemental: 0,
  charges: 0,
  totalAmount: 0,
  balance: 0,
  allotment: 0,
  remarks: '',
  appropriation: 0,
  releasedAllotments: 0,
  releasedBalance: 0,
  Attachments: [],
};

function BudgetSupplementalForm({
  initialData,
  onSubmit,
  onClose,
  budgetList,
  departmentOptions,
  subDepartmentOptions,
  chartOfAccountsOptions,
  fundOptions,
  projectOptions,
  fiscalYearOptions,
}) {
  const [formData, setFormData] = useState({ ...initialValues });

  useEffect(() => {
    if (initialData?.ID) {
      const { Budget } = initialData;
      setFormData({
        BudgetID: Budget?.ID,
        budgetName: Budget?.Name || '',
        fiscalYearID: Budget?.FiscalYearID || '',
        departmentID: Budget?.DepartmentID || '',
        subDepartmentID: Budget?.SubDepartmentID || '',
        chartOfAccountsID: Budget?.ChartofAccountsID || '',
        fundID: Budget?.FundID || '',
        projectID: Budget?.ProjectID || '',
        supplemental: Budget?.Supplemental || 0,
        charges: Budget?.Charges || 0,
        totalAmount: Budget?.TotalAmount || 0,
        balance: Budget?.AppropriationBalance || 0,
        remarks: initialData?.Remarks || '',
        appropriation: Budget?.Appropriation || 0,
        releasedAllotments: Budget?.ReleasedAllotments || 0,
        releasedBalance: Budget?.ReleasedBalance || 0,
        Attachments: Budget?.Attachments || [],
      });
    } else {
      setFormData(initialValues);
    }
  }, [initialData]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();

      // Handle attachments

      values?.Attachments.forEach((att, idx) => {
        if (att.ID) {
          formData.append(`Attachments[${idx}].ID`, att.ID);
        } else {
          formData.append(`Attachments[${idx}].File`, att);
        }
      });

      if (values?.Attachments.length === 0) {
        formData.append('Attachments', '[]');
      }
      console.log({ values });
      // Common fields for both new and existing data
      const commonFields = {
        BudgetID: values.BudgetID,
        Remarks: values.remarks,
        Supplemental: values.supplemental,
      };

      // Add common fields to formData
      Object.entries(commonFields).forEach(([key, value]) => {
        formData.append(key, JSON.stringify(value));
      });

      // Conditional fields based on whether it's initial data
      if (initialData) {
        formData.append('LinkID', JSON.stringify(initialData.LinkID));
        formData.append('IsNew', JSON.stringify(false));
      } else {
        formData.append('IsNew', JSON.stringify(true));
      }

      // Call onSubmit with the prepared formData
      await onSubmit(formData);
    } catch (error) {
      console.error('Submission error:', error);
      // You might want to handle the error state here
    } finally {
      setSubmitting(false);
    }
  };
  const handleBudgetSelect = (value) => {
    const selected = budgetList?.find((item) => item.ID === parseInt(value));
    if (selected) {
      setFormData({
        ...formData,
        BudgetID: selected.ID,
        budgetName: selected.Name || '',
        fiscalYearID: selected.FiscalYearID || '',
        departmentID: selected.DepartmentID || '',
        subDepartmentID: selected.SubDepartmentID || '',
        chartOfAccountsID: selected.ChartofAccountsID || '',
        fundID: selected.FundID || '',
        projectID: selected.ProjectID || '',
        appropriation: parseFloat(selected.Appropriation) || 0,
        balance: parseFloat(selected.AppropriationBalance) || 0,
        charges: parseFloat(selected.Charges || 0),
      });
    }
  };
  // -------------FILE UPLOAD-------------
  const handleFileUpload = (event, setFieldValue, values) => {
    const files = Array.from(event.target.files);

    // Create new attachments array with just the File objects
    const newAttachments = files.map((file) => file); // Just store the File objects directly

    // Combine with existing attachments
    setFieldValue('Attachments', [...values.Attachments, ...newAttachments]);
  };
  // -----------REMOVE ATTACHMENT-------------
  const removeAttachment = (index, setFieldValue, values) => {
    const updatedAttachments = [...values.Attachments];
    updatedAttachments.splice(index, 1);
    setFieldValue('Attachments', updatedAttachments);
  };
  return (
    <Formik
      enableReinitialize
      initialValues={formData}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2  pt-4">
              <SearchableDropdown
                label="Select Budget"
                name="BudgetID"
                type="select"
                required
                selectedValue={formData.BudgetID}
                onSelect={handleBudgetSelect}
                options={budgetList.map((b) => ({
                  label: b.Name,
                  value: b.ID,
                }))}
                error={errors.BudgetID}
                touched={touched.BudgetID}
              />
            </div>
            {/* Attachments Section */}
            <div className="mb-4 md:col-span-2 py-4 border-b border-gray-300">
              <div className="space-y-2">
                <h2 className="font-bold mb-2">Attachments</h2>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e, setFieldValue, values)}
                  className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                />
              </div>
              {values?.Attachments?.length > 0 ? (
                <div className="space-y-2 py-2 mt-2">
                  {values.Attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div className="flex items-center">
                        <Paperclip className="h-4 w-4 text-gray-500 mr-2" />
                        {/* <span className="text-sm">
                          {file.ID ? (
                            <a
                              href={`${API_URL}/uploads/${file.DataImage}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {file.name || file.DataName}
                            </a>
                          ) : (
                            file.name || file.DataName
                          )}
                        </span> */}
                        <span className="text-xs text-gray-500 ml-2">
                          <a
                            href={
                              file?.ID
                                ? `${API_URL}/uploads/${file?.DataImage}`
                                : URL.createObjectURL(file)
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {file?.name || file?.DataName}
                          </a>
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {file?.type}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          removeAttachment(index, setFieldValue, values)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-2">
                  No attachments added
                </p>
              )}
            </div>
            <FormField
              label="Budget Name"
              name="budgetName"
              type="text"
              value={values.budgetName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.budgetName}
              touched={touched.budgetName}
              disabled
              className="bg-gray-100"
              readOnly
            />
            <FormField
              label="Fiscal Year"
              name="fiscalYearID"
              type="select"
              value={values.fiscalYearID}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.fiscalYearID}
              touched={touched.fiscalYearID}
              options={fiscalYearOptions}
              disabled
              className="bg-gray-100"
              readOnly
            />
            <FormField
              label="Department"
              name="departmentID"
              type="select"
              value={values.departmentID}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.departmentID}
              touched={touched.departmentID}
              options={departmentOptions}
              disabled
              className="bg-gray-100"
              readOnly
            />
            <FormField
              label="Sub-Department"
              name="subDepartmentID"
              type="select"
              value={values.subDepartmentID}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.subDepartmentID}
              touched={touched.subDepartmentID}
              options={subDepartmentOptions}
              disabled
              className="bg-gray-100"
              readOnly
            />
            <FormField
              label="Chart of Accounts"
              name="chartOfAccountsID"
              type="select"
              value={values.chartOfAccountsID}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.chartOfAccountsID}
              touched={touched.chartOfAccountsID}
              options={chartOfAccountsOptions}
              disabled
              className="bg-gray-100"
              readOnly
            />
            <FormField
              label="Fund"
              name="fundID"
              type="select"
              value={values.fundID}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.fundID}
              touched={touched.fundID}
              options={fundOptions}
              disabled
              className="bg-gray-100"
              readOnly
            />
            <FormField
              label="Project"
              name="projectID"
              type="select"
              value={values.projectID}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.projectID}
              touched={touched.projectID}
              options={projectOptions}
              disabled
              className="bg-gray-100"
              readOnly
            />

            <FormField
              label="Appropriation"
              name="appropriation"
              type="number"
              value={values.appropriation}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.appropriation}
              touched={touched.appropriation}
              disabled
              className="bg-gray-100"
              readOnly
            />
            <FormField
              label="Balance"
              name="balance"
              type="number"
              value={values.balance}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.balance}
              touched={touched.balance}
              disabled
              className="bg-gray-100"
              readOnly
            />
            <FormField
              label="Released Allotments"
              name="releasedAllotments"
              type="number"
              value={values.releasedAllotments}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.releasedAllotments}
              touched={touched.releasedAllotments}
              disabled
              className="bg-gray-100"
              readOnly
            />
            <FormField
              label="Released Balance"
              name="releasedBalance"
              type="number"
              value={values.releasedBalance}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.releasedBalance}
              touched={touched.releasedBalance}
              disabled
              className="bg-gray-100"
              readOnly
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-300 py-4">
            <FormField
              label="Supplemental"
              name="supplemental"
              type="number"
              value={values.supplemental}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.supplemental}
              touched={touched.supplemental}
              required
            />
            <FormField
              label="Remarks"
              name="remarks"
              type="textarea"
              value={values.remarks}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.remarks}
              touched={touched.remarks}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {initialData ? 'Update' : 'Save'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default BudgetSupplementalForm;
