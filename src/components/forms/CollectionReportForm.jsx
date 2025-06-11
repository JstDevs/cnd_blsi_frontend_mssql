import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormField from "../common/FormField";

const COLLECTION_REPORT_SCHEMA = Yup.object().shape({
  date: Yup.date().required("Date is required"),
});

function CollectionReportForm({ onSubmit }) {
  const initialValues = {
    date: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={COLLECTION_REPORT_SCHEMA}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form className="space-y-4">
          <FormField
            label="Date"
            name="date"
            type="date"
            required
            value={values.date}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.date}
            touched={touched.date}
          />

          <div className="grid grid-cols-1 gap-4 sm:flex justify-end pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={() => onSubmit({ ...values, action: "view" })}
              className="btn btn-primary sm:w-auto w-full"
            >
              View
            </button>
            <button
              type="button"
              onClick={() => onSubmit({ ...values, action: "generate" })}
              className="btn btn-secondary sm:w-auto w-full"
            >
              Generate Journal
            </button>
            <button
              type="button"
              onClick={() => onSubmit({ ...values, action: "export" })}
              className="btn btn-outline sm:w-auto w-full"
            >
              Export to Excel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default CollectionReportForm;
