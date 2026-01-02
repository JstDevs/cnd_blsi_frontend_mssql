import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import FormField from '../../components/common/FormField';
import { fetchDocumentDetails } from '@/features/settings/documentDetailsSlice';
import { fetchPositions } from '@/features/settings/positionSlice';
import { fetchEmployees } from '@/features/settings/employeeSlice';
import { fetchUserroles } from '@/features/settings/userrolesSlice';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const schema = Yup.object().shape({
  DocumentTypeID: Yup.string().required('Document type is required'),
  sequences: Yup.array().of(
    Yup.object().shape({
      SequenceLevel: Yup.number().required(),
      AllorMajority: Yup.string().required(),
      NumberofApprover: Yup.number().when('AllorMajority', {
        is: 'Majority',
        then: (schema) => schema.required('Required for Majority').min(1),
        otherwise: (schema) => schema.nullable(),
      }),
      approvers: Yup.array().of(
        Yup.object().shape({
          type: Yup.string().required('Required'),
          value: Yup.string().required('Required'),
          amountFrom: Yup.number().typeError('Must be a number').required('Required'),
          amountTo: Yup.number().typeError('Must be a number').required('Required'),
        })
      ).min(1, 'At least one approver required'),
    })
  ).min(1, 'At least one sequence required'),
});

function ApprovalMatrixForm({ initialData, onClose, onSubmit }) {
  const dispatch = useDispatch();
  const { documentDetails } = useSelector((state) => state.documentDetails);
  const { positions } = useSelector((state) => state.positions);
  const { employees } = useSelector((state) => state.employees);
  const { userroles } = useSelector((state) => state.userroles);

  useEffect(() => {
    dispatch(fetchDocumentDetails());
    dispatch(fetchPositions());
    dispatch(fetchEmployees());
    dispatch(fetchUserroles());
  }, [dispatch]);

  const initialValues = initialData || {
    DocumentTypeID: '',
    sequences: [
      {
        SequenceLevel: 1,
        AllorMajority: 'ALL',
        NumberofApprover: '',
        approvers: [{ type: 'Position', value: '', amountFrom: 0, amountTo: 0 }],
      },
    ],
  };

  const getApproverOptions = (type) => {
    switch (type) {
      case 'Position':
        return positions.map((p) => ({ value: p.ID, label: p.Name }));
      case 'Employee':
        return employees.map((e) => ({
          value: e.ID,
          label: `${e.FirstName} ${e.MiddleName || ''} ${e.LastName}`,
        }));
      case 'User Access':
        return userroles.map((r) => ({ value: r.ID, label: r.Description || r.RoleName || r.Name }));
      default:
        return [];
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting }) => {
        // Transform for backend
        const payload = {
          DocumentTypeID: values.DocumentTypeID,
          sequences: values.sequences.map((seq, seqIdx) => ({
            SequenceLevel: seqIdx + 1,
            AllorMajority: seq.AllorMajority,
            NumberofApprover: seq.AllorMajority === 'Majority' ? seq.NumberofApprover : 1,
            approvers: seq.approvers.map((app) => ({
              PositionorEmployee: app.type,
              PositionorEmployeeID: app.value,
              AmountFrom: app.amountFrom,
              AmountTo: app.amountTo,
            })),
          })),
        };

        onSubmit(payload);
        setSubmitting(false);
      }}
      enableReinitialize
    >
      {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
        <Form className="space-y-6">
          <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
            <FormField
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
              disabled={!!initialData} // Disable if editing existing sequences for a doc type
            />
          </div>

          <FieldArray name="sequences">
            {({ push, remove }) => (
              <div className="space-y-8">
                {values.sequences.map((sequence, seqIndex) => (
                  <div key={seqIndex} className="relative border-2 border-primary-100 rounded-xl p-6 bg-white shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-primary-700 flex items-center">
                        <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">
                          {seqIndex + 1}
                        </span>
                        Sequence Level {seqIndex + 1}
                      </h3>
                      {values.sequences.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(seqIndex)}
                          className="text-error-500 hover:text-error-700 p-2 hover:bg-error-50 rounded-full transition-colors"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-700">Approval Rule</label>
                        <div className="flex items-center space-x-6 p-2 bg-neutral-50 rounded-lg border border-neutral-200">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`sequences[${seqIndex}].AllorMajority`}
                              value="ALL"
                              checked={sequence.AllorMajority === 'ALL'}
                              onChange={() => setFieldValue(`sequences[${seqIndex}].AllorMajority`, 'ALL')}
                              className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                            />
                            <span className="text-sm font-medium text-neutral-900">ALL</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`sequences[${seqIndex}].AllorMajority`}
                              value="Majority"
                              checked={sequence.AllorMajority === 'Majority'}
                              onChange={() => setFieldValue(`sequences[${seqIndex}].AllorMajority`, 'Majority')}
                              className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                            />
                            <span className="text-sm font-medium text-neutral-900">Majority</span>
                          </label>
                        </div>
                      </div>

                      {sequence.AllorMajority === 'Majority' && (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-neutral-700">Required Count</label>
                          <input
                            type="number"
                            name={`sequences[${seqIndex}].NumberofApprover`}
                            value={sequence.NumberofApprover}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                            placeholder="Number of approvers"
                          />
                          {errors.sequences?.[seqIndex]?.NumberofApprover && (
                            <p className="text-error-500 text-xs">{errors.sequences[seqIndex].NumberofApprover}</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-neutral-50 p-3 rounded-t-lg border-x border-t border-neutral-200">
                        <span className="text-sm font-semibold text-neutral-700 uppercase tracking-wider">Approvers</span>
                      </div>
                      <FieldArray name={`sequences[${seqIndex}].approvers`}>
                        {({ push: pushApp, remove: removeApp }) => (
                          <div className="border border-neutral-200 rounded-b-lg overflow-hidden">
                            {sequence.approvers.map((approver, appIndex) => (
                              <div
                                key={appIndex}
                                className={`p-4 ${appIndex !== 0 ? 'border-t border-neutral-100' : ''} bg-white`}
                              >
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                                  <div className="lg:col-span-2">
                                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Type</label>
                                    <select
                                      name={`sequences[${seqIndex}].approvers[${appIndex}].type`}
                                      value={approver.type}
                                      onChange={(e) => {
                                        setFieldValue(`sequences[${seqIndex}].approvers[${appIndex}].type`, e.target.value);
                                        setFieldValue(`sequences[${seqIndex}].approvers[${appIndex}].value`, '');
                                      }}
                                      className="w-full p-2 border border-neutral-300 rounded-lg bg-neutral-50 text-sm focus:ring-primary-500 focus:border-primary-500"
                                    >
                                      <option value="Position">Position</option>
                                      <option value="Employee">Employee</option>
                                      <option value="User Access">User Access</option>
                                    </select>
                                  </div>

                                  <div className="lg:col-span-4">
                                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Approver Name</label>
                                    <select
                                      name={`sequences[${seqIndex}].approvers[${appIndex}].value`}
                                      value={approver.value}
                                      onChange={handleChange}
                                      className="w-full p-2 border border-neutral-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                                    >
                                      <option value="">Select Approver</option>
                                      {getApproverOptions(approver.type).map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                          {opt.label}
                                        </option>
                                      ))}
                                    </select>
                                    {errors.sequences?.[seqIndex]?.approvers?.[appIndex]?.value && (
                                      <p className="text-error-500 text-xs mt-1">Required</p>
                                    )}
                                  </div>

                                  <div className="lg:col-span-5 flex items-end gap-2 text-neutral-400">
                                    <div className="flex-1">
                                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Min Amount</label>
                                      <input
                                        type="number"
                                        placeholder="0.00"
                                        name={`sequences[${seqIndex}].approvers[${appIndex}].amountFrom`}
                                        value={approver.amountFrom}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-neutral-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                                      />
                                    </div>
                                    <span className="mb-2">—</span>
                                    <div className="flex-1">
                                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Max Amount</label>
                                      <input
                                        type="number"
                                        placeholder="999,999,999.00"
                                        name={`sequences[${seqIndex}].approvers[${appIndex}].amountTo`}
                                        value={approver.amountTo}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-neutral-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                                      />
                                    </div>
                                  </div>

                                  <div className="lg:col-span-1 flex justify-end pb-1">
                                    {sequence.approvers.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => removeApp(appIndex)}
                                        className="p-2 text-neutral-400 hover:text-error-500 transition-colors"
                                      >
                                        <TrashIcon className="h-5 w-5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                            <div className="p-3 bg-neutral-50 border-t border-neutral-200">
                              <button
                                type="button"
                                onClick={() => pushApp({ type: 'Position', value: '', amountFrom: 0, amountTo: 0 })}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
                              >
                                <PlusIcon className="h-4 w-4 mr-1" /> Add Approver
                              </button>
                            </div>
                          </div>
                        )}
                      </FieldArray>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    push({
                      SequenceLevel: values.sequences.length + 1,
                      AllorMajority: 'ALL',
                      NumberofApprover: '',
                      approvers: [{ type: 'Position', value: '', amountFrom: 0, amountTo: 0 }],
                    })
                  }
                  className="w-full py-4 border-2 border-dashed border-neutral-300 rounded-xl text-neutral-500 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-all flex items-center justify-center font-semibold"
                >
                  <PlusIcon className="h-6 w-6 mr-2" /> Add Next Sequence Level
                </button>
              </div>
            )}
          </FieldArray>

          <div className="flex justify-end space-x-4 pt-8 border-t border-neutral-200 mt-10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-neutral-300 rounded-lg text-neutral-700 font-medium hover:bg-neutral-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-primary-600 text-white rounded-lg font-bold shadow-lg shadow-primary-200 hover:bg-primary-700 hover:shadow-primary-300 disabled:opacity-50 disabled:shadow-none transition-all"
            >
              {isSubmitting ? 'Saving...' : 'Save Approval Matrix'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default ApprovalMatrixForm;
