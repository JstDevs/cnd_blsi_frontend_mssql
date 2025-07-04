// components/forms/PublicMarketTicketForm.js
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import FormField from '../common/FormField';
import Button from '../common/Button';
import {
  addPublicMarketTicket,
  updatePublicMarketTicket,
} from '@/features/collections/PublicMarketTicketingSlice';

const validationSchema = Yup.object().shape({
  items: Yup.string().required('Items type is required'),
  startTime: Yup.date().required('Start time is required'),
  endTime: Yup.date()
    .required('End time is required')
    .min(Yup.ref('startTime'), 'End time must be after start time'),
  issuedBy: Yup.string().required('Issued by is required'),
  dateIssued: Yup.date().required('Date issued is required'),
  postingPeriod: Yup.date().required('Posting period is required'),
  amountIssued: Yup.number()
    .required('Amount issued is required')
    .min(0, 'Amount must be greater than or equal to 0'),
  remarks: Yup.string().required('Remarks are required'),
});

const initialValues = {
  items: '',
  startTime: '',
  endTime: '',
  issuedBy: '',
  dateIssued: '',
  postingPeriod: '',
  amountIssued: '',
  remarks: '',
};

const PublicMarketTicketForm = ({ ticket, onClose }) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatInitialValues = (values) => {
    if (!values) return initialValues;
    console.log(values);
    return {
      ...values,
      items: values.Items || '',
      startTime: values.StartTime
        ? format(parseISO(values.StartTime), "yyyy-MM-dd'T'HH:mm")
        : '',
      endTime: values.EndTime
        ? format(parseISO(values.EndTime), "yyyy-MM-dd'T'HH:mm")
        : '',
      issuedBy: values.IssuedBy || '',
      dateIssued: values.DateIssued || '',
      postingPeriod: values.PostingPeriod || '',
      amountIssued: values.AmountIssued || '',
      remarks: values.Remarks || '',
    };
  };

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);

      const submissionData = {
        Items: values.items,
        StartTime: new Date(values.startTime).toISOString(),
        EndTime: new Date(values.endTime).toISOString(),
        IssuedBy: values.issuedBy,
        DateIssued: values.dateIssued,
        PostingPeriod: values.postingPeriod,
        AmountIssued: values.amountIssued,
        Remarks: values.remarks,
      };

      if (ticket) {
        await dispatch(
          updatePublicMarketTicket({
            ID: ticket.ID,
            LinkID: ticket.LinkID,
            ...submissionData,
          })
        ).unwrap();
        toast.success('Ticket updated successfully');
      } else {
        await dispatch(addPublicMarketTicket(submissionData)).unwrap();
        toast.success('Ticket added successfully');
      }
      onClose();
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };
  // Custom form field component that properly handles value and onChange
  const FormikInput = ({ label, name, type = 'text', ...props }) => {
    const [field, meta] = useField(name);

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <FormField
          {...field}
          {...props}
          type={type}
          value={field.value || ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            meta.touched && meta.error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {meta.touched && meta.error && (
          <div className="text-red-500 text-xs mt-1">{meta.error}</div>
        )}
      </div>
    );
  };

  return (
    <Formik
      initialValues={formatInitialValues(ticket)}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, isValid, dirty, values }) => (
        <Form className="space-y-6">
          {/* Items Field */}
          <FormikInput
            label="Items:"
            name="items"
            type="text"
            placeholder="Enter items"
          />

          {/* Date and Time Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormikInput
              label="Date Issued:"
              name="dateIssued"
              type="date"
              max={new Date().toISOString().split('T')[0]}
            />
            <FormikInput
              label="Posting Period:"
              name="postingPeriod"
              type="date"
              min={values.dateIssued}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormikInput
              label="Start Time:"
              name="startTime"
              type="datetime-local"
            />
            <FormikInput
              label="End Time:"
              name="endTime"
              type="datetime-local"
              min={values.startTime}
            />
          </div>

          <FormikInput
            label="Issued By:"
            name="issuedBy"
            type="text"
            placeholder="Enter issuer name"
          />

          <FormikInput
            label="Amount Issued:"
            name="amountIssued"
            type="number"
            placeholder="0.00"
            min="0"
            step="0.01"
          />

          <FormikInput
            label="Remarks:"
            name="remarks"
            type="textarea"
            placeholder="Enter remarks"
            rows={4}
          />

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 rounded-md border border-gray-300 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isValid || !dirty}
              className="px-6 py-2 rounded-md border border-transparent shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting
                ? 'Saving...'
                : ticket
                ? 'Update Ticket'
                : 'Add Ticket'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
export default PublicMarketTicketForm;
