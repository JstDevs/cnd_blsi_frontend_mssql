import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormField from "../common/FormField";

const CASHBOOK_SCHEMA = Yup.object().shape({
  fromDate: Yup.date()
    .required("From Date is required")
    .max(Yup.ref("toDate"), "From Date must be before or equal to To Date"),
  toDate: Yup.date()
    .required("To Date is required")
    .min(Yup.ref("fromDate"), "To Date must be after or equal to From Date"),
  fund: Yup.string().required("Fund is required"),
});

function CashbookForm({ onSubmit }) {
  const initialValues = {
    fromDate: "",
    toDate: "",
    fund: "general",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={CASHBOOK_SCHEMA}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="From Date"
              name="fromDate"
              type="date"
              required
              value={values.fromDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.fromDate}
              touched={touched.fromDate}
            />

            <FormField
              label="To Date"
              name="toDate"
              type="date"
              required
              value={values.toDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.toDate}
              touched={touched.toDate}
            />
          </div>

          <FormField
            label="Fund"
            name="fund"
            type="select"
            required
            value={values.fund}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.fund}
            touched={touched.fund}
            options={[{ value: "general", label: "General Fund" }]}
          />

          <div className="grid grid-cols-1 gap-4 sm:flex justify-end pt-4 border-t border-neutral-200 w-full">
            <button
              type="button"
              onClick={() => onSubmit({ ...values, action: "view" })}
              className="btn btn-primary w-full sm:w-auto"
            >
              View
            </button>
            <button
              type="button"
              onClick={() => onSubmit({ ...values, action: "generate" })}
              className="btn btn-secondary  w-full sm:w-auto"
            >
              Generate Cashbook
            </button>
            <button
              type="button"
              onClick={() => onSubmit({ ...values, action: "export" })}
              className="btn btn-outline  w-full sm:w-auto"
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
