import { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../../components/common/FormField';

const documentTypes = [
  { value: 'ARO', label: 'ARO- Allotment Release Order' },
  { value: 'BS', label: 'BS - Budget Supplemental' },
  { value: 'BT', label: 'BT - Budget Transfer' },
  { value: 'CCI', label: 'CCI - Community Tax' },
  { value: 'CCIC', label: 'CCIC - Community Tax Corporate' },
  { value: 'CH', label: 'CH - Check' },
  { value: 'DV', label: 'DV - Disbursement Voucher' },
  { value: 'FT', label: 'FT - Fund Transfer' },
  { value: 'FURS', label: 'FURS - Fund Utilization Request and Status' },
  { value: 'JEV', label: 'JEV - Journal Entry Voucher' },
  { value: 'MARIAGEOR', label: 'MARIAGEOR - Marriage Receipt' },
  { value: 'OBR', label: 'OBR - Obligation Request' },
  { value: 'ORB', label: 'ORB - Burial Receipt' },
  { value: 'PMT', label: 'PMT - Public Market Ticketing' },
  { value: 'PPR', label: 'PPR - Property Plant Equipment' },
  { value: 'PR', label: 'PR - Purchase Request' },
  { value: 'RPT', label: 'RPT - Real Property Tax' },
  { value: 'SI', label: 'SI - Service Invoice' },
  { value: 'TO', label: 'TO - Travel Order' },
];
const sequenceLevels = [
  { value: 'First', label: 'First' },
  { value: 'Second', label: 'Second' },
];
const positions = [
  { value: 'Accounting Clerk', label: 'Accounting Clerk' },
  { value: 'Accounting Head', label: 'Accounting Head' },
  { value: 'Budget Head', label: 'Budget Head' },
  { value: 'Busines Analyst', label: 'Busines Analyst' },
  { value: 'clerk', label: 'clerk' },
  { value: 'Mayor', label: 'Mayor' },
  { value: 'MTMDD head', label: 'MTMDD head' },
  { value: 'Supervsior', label: 'Supervsior' },
  { value: 'System Aanlyst', label: 'System Aanlyst' },
  { value: 'Technical Lead', label: 'Technical Lead' },
  { value: 'Traffic Enforcer', label: 'Traffic Enforcer' },
  { value: 'Treasury Head', label: 'Treasury Head' },
  { value: 'Vice Mayor', label: 'Vice Mayor' },
];
const employees = [
  { value: 'emp1', label: 'John Doe' },
  { value: 'emp2', label: 'Jane Smith' },
  { value: 'emp3', label: 'Alice Johnson' },
  { value: 'emp4', label: 'Bob Williams' },
  { value: 'emp5', label: 'Maria Garcia' },
  { value: 'emp6', label: 'David Lee' },
  { value: 'emp7', label: 'Sarah Kim' },
  { value: 'emp8', label: 'Michael Brown' },
];

const schema = Yup.object().shape({
  documentType: Yup.string().required('Document type is required'),
  sequenceLevel: Yup.string().required('Sequence level is required'),
  approvalRule: Yup.string().required('Approval rule is required'),
  approverType: Yup.string().required('Approver type is required'),
  approver: Yup.string().required('Approver is required'),
  amountFrom: Yup.number().typeError('Must be a number').required('From amount is required'),
  amountTo: Yup.number().typeError('Must be a number').required('To amount is required'),
});

function ApprovalMatrixForm({ initialData, onClose, onSubmit }) {
  const [approverType, setApproverType] = useState(initialData?.approverType || 'Position');
  const [approvalRule, setApprovalRule] = useState(initialData?.approvalRule || 'ALL');

  const initialValues = initialData || {
    documentType: '',
    sequenceLevel: '',
    approvalRule: 'ALL',
    approvalRuleSelect: '',
    approverType: 'Position',
    approver: '',
    amountFrom: '',
    amountTo: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={(values) => {
        onSubmit({
          ...values,
          approvalRule,
          approverType,
        });
      }}
      enableReinitialize
    >
      {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
        <Form className="space-y-4">
          <FormField
            className="p-3 focus:outline-none"
            label="Document Type"
            name="documentType"
            type="select"
            required
            value={values.documentType}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.documentType}
            touched={touched.documentType}
            options={documentTypes}
          />
          <FormField
            className="p-3 focus:outline-none"
            label="Sequence Level"
            name="sequenceLevel"
            type="select"
            required
            value={values.sequenceLevel}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.sequenceLevel}
            touched={touched.sequenceLevel}
            options={sequenceLevels}
          />
          <div>
            <label className="form-label">Approval Rule <span className="text-error-500">*</span></label>
            <div className="flex items-center space-x-4 p-3">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="approvalRule"
                  value="ALL"
                  checked={approvalRule === 'ALL'}
                  onChange={() => setApprovalRule('ALL')}
                  className="form-radio"
                />
                <span>ALL</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="approvalRule"
                  value="Majority"
                  checked={approvalRule === 'Majority'}
                  onChange={() => setApprovalRule('Majority')}
                  className="form-radio"
                />
                <span>Majority</span>
                <select
                  name="approvalRuleSelect"
                  value={values.approvalRuleSelect || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={approvalRule !== 'Majority'}
                  className="ml-2 w-24 p-2 border border-neutral-300 rounded focus:outline-none"
                >
                  <option value="">Select</option>
                  {Array.from({ length: 20 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <div>
            <label className="form-label">Approver <span className="text-error-500">*</span></label>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 p-3">
              <label className="flex items-center space-x-2 mb-2 md:mb-0">
                <input
                  type="radio"
                  name="approverType"
                  value="Position"
                  checked={approverType === 'Position'}
                  onChange={() => {
                    setApproverType('Position');
                    setFieldValue('approver', '');
                  }}
                  className="form-radio"
                />
                <span>Position</span>
                <FormField
                  className="p-3 focus:outline-none"
                  name="approver"
                  type="select"
                  value={values.approver}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={positions}
                  disabled={approverType !== 'Position'}
                />
              </label>
              <label className="flex items-center space-x-2 mb-2 md:mb-0">
                <input
                  type="radio"
                  name="approverType"
                  value="Employee"
                  checked={approverType === 'Employee'}
                  onChange={() => {
                    setApproverType('Employee');
                    setFieldValue('approver', '');
                  }}
                  className="form-radio"
                />
                <span>Employee</span>
                <FormField
                  className="p-3 focus:outline-none"
                  name="approver"
                  type="select"
                  value={values.approver}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={employees}
                  disabled={approverType !== 'Employee'}
                />
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              className="p-3 focus:outline-none"
              label="Amount From"
              name="amountFrom"
              type="number"
              required
              value={values.amountFrom}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.amountFrom}
              touched={touched.amountFrom}
            />
            <FormField
              className="p-3 focus:outline-none"
              label="Amount To"
              name="amountTo"
              type="number"
              required
              value={values.amountTo}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.amountTo}
              touched={touched.amountTo}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
            <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Save</button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default ApprovalMatrixForm; 