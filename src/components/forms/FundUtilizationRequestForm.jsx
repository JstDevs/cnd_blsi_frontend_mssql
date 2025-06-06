import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormField from "../common/FormField";
import DatePickerField from "../common/DatePickerField";

// Mock options for select menus
const fundOptions = [
  { value: "general", label: "General Fund" },
  { value: "special", label: "Special Fund" },
  { value: "capital", label: "Capital Fund" },
  { value: "trust", label: "Trust Fund" },
];

const fiscalYearOptions = [
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
];

const projectOptions = [
  { value: "project1", label: "Project 1" },
  { value: "project2", label: "Project 2" },
  { value: "project3", label: "Project 3" },
];

// Validation schema using Yup
const validationSchema = Yup.object({
  number: Yup.string().required("Number is required"),
  date: Yup.date().required("Date is required"),
  payee: Yup.string().required("Payee is required"),
  address: Yup.string().required("Address is required"),
  fund: Yup.string().required("Fund is required"),
  fiscalYear: Yup.string().required("Fiscal Year is required"),
  project: Yup.string().required("Project is required"),
});

function FundUtilizationRequestForm({ initialData, onSubmit, onClose }) {
  const handleSubmit = (values) => {
    onSubmit(values);
  };

  return (
    <Formik
      initialValues={
        initialData || {
          number: "",
          date: "",
          payee: "",
          address: "",
          fund: "",
          fiscalYear: "",
          project: "",
        }
      }
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField name="number" label="No." type="text" required />
            <DatePickerField name="date" label="Date" required />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <FormField name="payee" label="Payee" type="text" required />
            <FormField name="address" label="Address" type="text" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              name="fund"
              label="Fund"
              as="select"
              options={fundOptions}
              required
            />
            <FormField
              name="fiscalYear"
              label="Fiscal Year"
              as="select"
              options={fiscalYearOptions}
              required
            />
            <FormField
              name="project"
              label="Project"
              as="select"
              options={projectOptions}
              required
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-neutral-200">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default FundUtilizationRequestForm;
