import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../../components/common/FormField';
import { fetchDocumentDetails } from '@/features/settings/documentDetailsSlice';
import { fetchPositions } from '@/features/settings/positionSlice';
import { fetchEmployees } from '@/features/settings/employeeSlice';
import { TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const sequenceLevels = [
  { value: '1 - First', label: '1 - First' },
  { value: '2 - Second', label: '2 - Second' },
  { value: '3 - Third', label: '3 - Third' },
];

const schema = Yup.object().shape({
  // DocumentTypeID: Yup.string().required('Document type is required'),
  // SequenceLevel: Yup.string().required('Sequence level is required'),
  // AllorMajority: Yup.string().required('Approval rule is required'),
  // NumberofApprover: Yup.string().required('Required'),
  // approverType: Yup.string().required('Approver type is required'),
  // approver: Yup.string().required('Approver is required'),
  // amountFrom: Yup.number().typeError('Must be a number').required('From amount is required'),
  // amountTo: Yup.number().typeError('Must be a number').required('To amount is required'),
});

function ApprovalMatrixForm({ initialData, onClose, onSubmit }) {
  const [approvalRule, setApprovalRule] = useState(
    initialData?.AllorMajority || 'ALL'
  );

  const dispatch = useDispatch();
  const { documentDetails } = useSelector((state) => state.documentDetails);
  const { positions } = useSelector((state) => state.positions);
  const { employees } = useSelector((state) => state.employees);

  useEffect(() => {
    dispatch(fetchDocumentDetails());
    dispatch(fetchPositions());
    dispatch(fetchEmployees());
  }, [dispatch]);

  const initialValues = initialData || {
    DocumentTypeID: '',
    SequenceLevel: '',
    AllorMajority: 'ALL',
    NumberofApprover: '',
  };

  const [approvers, setApprovers] = useState(
    initialData?.approvers || [
      { type: 'Position', value: '', amountFrom: '', amountTo: '' },
    ]
  );

  const addApprover = () => {
    setApprovers([
      ...approvers,
      { type: 'Position', value: '', amountFrom: '', amountTo: '', errors: {} },
    ]);
  };

  const removeApprover = (index) => {
    const updated = [...approvers];
    updated.splice(index, 1);
    setApprovers(updated);
  };

  const updateApprover = (index, newItem) => {
    const updated = [...approvers];
    updated[index] = newItem;
    setApprovers(updated);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting }) => {
        if (
          !values.DocumentTypeID ||
          values.SequenceLevel === '' ||
          approvalRule === '' ||
          approvers.length === 0 ||
          approvers.some((a) => !a.value) ||
          approvers.some((a) => !a.type) ||
          approvers.some((a) => !a.amountFrom) ||
          approvers.some((a) => !a.amountTo)
        ) {
          toast.error('Please Select All Required Fields');
          setSubmitting(false);
          return;
        }
        const transformedApprovers = approvers.map((a) => ({
          PositionorEmployee: a.type,
          PositionorEmployeeID: a.value,
          AmountFrom: a.amountFrom,
          AmountTo: a.amountTo,
        }));

        const payload = {
          ...values,
          AllorMajority: approvalRule,
          approvers: transformedApprovers,
        };

        onSubmit(payload);
        setSubmitting(false);
      }}
      enableReinitialize
    >
      {/* <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={(values) => {
        onSubmit({
          ...values,
          approvalRule,
          approverType,
          approvers,
        });
      }}
      enableReinitialize
    > */}
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        isSubmitting,
      }) => (
        <Form className="space-y-4">
          <FormField
            className="p-3 focus:outline-none"
            label="Document Type"
            name="DocumentTypeID"
            type="select"
            required
            value={values.DocumentTypeID}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.DocumentTypeID}
            touched={touched.DocumentTypeID}
            options={documentDetails.map((doc) => ({
              value: doc.ID,
              label: doc.Name,
            }))}
          />
          <FormField
            className="p-3 focus:outline-none"
            label="Sequence Level"
            name="SequenceLevel"
            type="select"
            required
            value={values.SequenceLevel}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.SequenceLevel}
            touched={touched.SequenceLevel}
            options={sequenceLevels}
          />
          <div>
            <label className="form-label">
              Approval Rule <span className="text-error-500">*</span>
            </label>
            <div className="flex items-center space-x-4 p-3">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="AllorMajority"
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
                  name="AllorMajority"
                  value="Majority"
                  checked={approvalRule === 'Majority'}
                  onChange={() => setApprovalRule('Majority')}
                  className="form-radio"
                />
                <span>Majority</span>
                <select
                  name="NumberofApprover"
                  value={values.NumberofApprover || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={approvalRule !== 'Majority'}
                  className="ml-2 w-24 p-2 border border-neutral-300 rounded focus:outline-none"
                >
                  <option value="">Select</option>
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* APPROVERS SECTION */}
          <div>
            <label className="form-label mb-2">
              Approvers <span className="text-error-500">*</span>
            </label>
            {approvers.map((item, index) => (
              <div key={index}>
                <div className="flex flex-col gap-4 mb-4 border p-4 rounded-md relative">
                  {/* First Row: Radio + Select + Remove */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`approverType-${index}`}
                          value="Position"
                          checked={item.type === 'Position'}
                          onChange={() =>
                            updateApprover(index, {
                              type: 'Position',
                              value: '',
                              amountFrom: '',
                              amountTo: '',
                              errors: {},
                            })
                          }
                          className="form-radio"
                        />
                        <span>Position</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`approverType-${index}`}
                          value="Employee"
                          checked={item.type === 'Employee'}
                          onChange={() =>
                            updateApprover(index, {
                              type: 'Employee',
                              value: '',
                              amountFrom: '',
                              amountTo: '',
                              errors: {},
                            })
                          }
                          className="form-radio"
                        />
                        <span>Employee</span>
                      </label>
                    </div>

                    <div className="w-full md:w-1/3">
                      <select
                        className="w-full p-2 border rounded pr-8"
                        value={item.value}
                        onChange={(e) =>
                          updateApprover(index, {
                            ...item,
                            value: e.target.value,
                          })
                        }
                      >
                        <option value="">Select</option>
                        {(item.type === 'Position' ? positions : employees).map(
                          (opt) => (
                            <option key={opt.ID} value={opt.ID}>
                              {item.type === 'Position'
                                ? opt.Name
                                : `${opt.FirstName} ${opt.MiddleName} ${opt.LastName}`}
                            </option>
                          )
                        )}
                      </select>
                      {item.errors?.value && (
                        <p className="text-red-500 text-sm mt-1">
                          {item.errors.value}
                        </p>
                      )}
                    </div>

                    {approvers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeApprover(index)}
                        className="btn btn-sm btn-error text-red-500"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  {/* Second Row: Amounts */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/2">
                      <input
                        type="number"
                        placeholder="Amount From"
                        className="w-full p-2 border rounded"
                        value={item.amountFrom}
                        onChange={(e) =>
                          updateApprover(index, {
                            ...item,
                            amountFrom: e.target.value,
                          })
                        }
                      />
                      {item.errors?.amountFrom && (
                        <p className="text-red-500 text-sm mt-1">
                          {item.errors.amountFrom}
                        </p>
                      )}
                    </div>
                    <div className="w-full md:w-1/2">
                      <input
                        type="number"
                        placeholder="Amount To"
                        className="w-full p-2 border rounded"
                        value={item.amountTo}
                        onChange={(e) =>
                          updateApprover(index, {
                            ...item,
                            amountTo: e.target.value,
                          })
                        }
                      />
                      {item.errors?.amountTo && (
                        <p className="text-red-500 text-sm mt-1">
                          {item.errors.amountTo}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {index < approvers.length - 1 && (
                  <hr className="mb-4 border-gray-300" />
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline"
              onClick={addApprover}
            >
              + Add More
            </button>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
            <button type="button" onClick={onClose} className="btn btn-outline">
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

export default ApprovalMatrixForm;
