import React, { useRef } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

function FinancialPerformanceForm({
    funds = [],
    employees = [],
    fiscalYears = [],
    onView,
    onGenerateJournal,
    onExportExcel,
}) {
    const submitAction = useRef(null);

    const validationSchema = Yup.object({
        fiscalYearID: Yup.string().required('Fiscal Year is required'),
        dateFrom: Yup.string().required('Date From is required'),
        dateTo: Yup.string().required('Date To is required'),
        fundID: Yup.string().required('Fund is required'),
        approverID: Yup.string().required('Approver is required'),
    });

    const initialValues = {
        fiscalYearID: '',
        dateFrom: new Date().toISOString().split('T')[0],
        dateTo: new Date().toISOString().split('T')[0],
        fundID: '',
        approverID: '',
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
        submitAction.current = null;
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
            }) => (
                <Form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Fiscal Year Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-900 border-b pb-1">Fiscal Year</h3>
                            <FormField
                                type="select"
                                label=""
                                name="fiscalYearID"
                                options={fiscalYears.map((item) => ({
                                    value: item.ID,
                                    label: item.Name,
                                }))}
                                value={values.fiscalYearID}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.fiscalYearID}
                                touched={touched.fiscalYearID}
                                required
                            />
                        </div>

                        {/* Date Range Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-900 border-b pb-1">Date Range</h3>
                            <div className="grid grid-cols-1 gap-2">
                                <FormField
                                    label="Date From :"
                                    name="dateFrom"
                                    type="date"
                                    value={values.dateFrom}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.dateFrom}
                                    touched={touched.dateFrom}
                                    required
                                    className="flex items-center gap-4"
                                />
                                <FormField
                                    label="Date To :"
                                    name="dateTo"
                                    type="date"
                                    value={values.dateTo}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.dateTo}
                                    touched={touched.dateTo}
                                    required
                                    className="flex items-center gap-4"
                                />
                            </div>
                        </div>

                        {/* Other Filters Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-900 border-b pb-1">&nbsp;</h3>
                            <FormField
                                type="select"
                                label="Fund :"
                                name="fundID"
                                options={funds.map((item) => ({
                                    value: item.ID,
                                    label: item.Name,
                                }))}
                                value={values.fundID}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.fundID}
                                touched={touched.fundID}
                                required
                                className="flex items-center gap-4"
                            />
                            <FormField
                                label="Approver :"
                                name="approverID"
                                type="select"
                                options={employees.map((item) => ({
                                    value: item.ID,
                                    label: `${item.FirstName} ${item.LastName}${item.Department ? ` - ${item.Department.Name}` : ''}`,
                                }))}
                                value={values.approverID}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.approverID}
                                touched={touched.approverID}
                                required
                                className="flex items-center gap-4"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                        <button
                            type="submit"
                            className="btn btn-secondary"
                            disabled={isSubmitting}
                            onClick={() => (submitAction.current = 'view')}
                        >
                            View
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                            onClick={() => (submitAction.current = 'generate')}
                        >
                            Generate Journal
                        </button>
                        <button
                            type="submit"
                            className="btn btn-success"
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

export default FinancialPerformanceForm;
