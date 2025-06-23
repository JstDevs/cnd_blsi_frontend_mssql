import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from 'formik';
import * as Yup from "yup";
import FormField from "@/components/common/FormField";
import { fetchEmployees } from "@/features/settings/employeeSlice";

const GeneralRevisionForm = ({ initialData, onSubmit, onCancel, isEdit }) => {
  const dispatch = useDispatch();

    const { employees } = useSelector((state) => state.employees);
  
    useEffect(() => {
      dispatch(fetchEmployees());
    }, [dispatch]);

  const revisionSchema = Yup.object().shape({
    General_Revision_Date_Year: Yup.string().required("Required"),
    GeneralRevisionCode: Yup.string().required("Required"),
    TaxDeclarationCode: Yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: initialData || {
      General_Revision_Date_Year: '',
      GeneralRevisionCode: '',
      TaxDeclarationCode: '',
      CityorMunicipalityAssessor: '',
      CityorMunicipalityAssistantAssessor: '',
      ProvincialAssessor: '',
      ProvincialAssistantAssessor: '',
    },
    validationSchema: revisionSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="General Revision Date (Year)"
          name="General_Revision_Date_Year"
          type="number"
          value={formik.values.General_Revision_Date_Year}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.General_Revision_Date_Year}
          touched={formik.touched.General_Revision_Date_Year}
          required
        />
        <FormField
          label="General Revision Code"
          name="GeneralRevisionCode"
          type="text"
          value={formik.values.GeneralRevisionCode}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.GeneralRevisionCode}
          touched={formik.touched.GeneralRevisionCode}
          required
        />
      </div>

      <FormField
        label="General Revision Tax Declaration Code"
        name="TaxDeclarationCode"
        type="text"
        value={formik.values.TaxDeclarationCode}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.TaxDeclarationCode}
        touched={formik.touched.TaxDeclarationCode}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="City Or Municipality Assessor"
          name="CityorMunicipalityAssessor"
          type="select"
          value={formik.values.CityorMunicipalityAssessor}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          options={employees.map((employee) => ({
            value: employee.ID,
            label: `${employee.LastName}, ${employee.FirstName}`,
          }))}
        />
        <FormField
          label="Assistant City Or Municipality Assessor"
          name="CityorMunicipalityAssistantAssessor"
          type="select"
          value={formik.values.CityorMunicipalityAssistantAssessor}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          options={employees.map((employee) => ({
            value: employee.ID,
            label: `${employee.LastName}, ${employee.FirstName}`,
          }))}
        />
        <FormField
          label="Provincial Assessor"
          name="ProvincialAssessor"
          type="select"
          value={formik.values.ProvincialAssessor}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          options={employees.map((employee) => ({
            value: employee.ID,
            label: `${employee.LastName}, ${employee.FirstName}`,
          }))}
        />
        <FormField
          label="Assistant Provincial Assessor"
          name="ProvincialAssistantAssessor"
          type="select"
          value={formik.values.ProvincialAssistantAssessor}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          options={employees.map((employee) => ({
            value: employee.ID,
            label: `${employee.LastName}, ${employee.FirstName}`,
          }))}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
        <button type="button" onClick={onCancel} className="btn btn-outline">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default GeneralRevisionForm;
