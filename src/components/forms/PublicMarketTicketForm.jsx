// components/forms/PublicMarketTicketForm.js
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import FormField from '../common/FormField';
import Button from '../common/Button';
import {
  addPublicMarketTicket,
  updatePublicMarketTicket,
} from '@/features/collections/PublicMarketTicketingSlice';

const validationSchema = Yup.object().shape({
  items: Yup.string().required('Items type is required'),
  startTime: Yup.string().required('Start time is required'),
  endTime: Yup.string().required('End time is required'),
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

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      if (ticket) {
        await dispatch(
          updatePublicMarketTicket({ id: ticket.id, ...values })
        ).unwrap();
        toast.success('Ticket updated successfully');
      } else {
        await dispatch(addPublicMarketTicket(values)).unwrap();
        toast.success('Ticket added successfully');
      }
      onClose();
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={ticket || initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isValid, dirty }) => (
        <Form className="space-y-6">
          {/* Items Field */}
          <div>
            <FormField
              label="Items:"
              name="items"
              type="text"
              placeholder="Enter items"
              className="text-lg font-medium"
            />
          </div>

          {/* Time Fields - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <FormField
                name="startTime"
                type="time"
                className="w-full"
                hideLabel
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <FormField
                name="endTime"
                type="time"
                className="w-full"
                hideLabel
              />
            </div>
          </div>

          {/* Issued By Field */}
          <div>
            <FormField
              label="Issued By:"
              name="issuedBy"
              type="text"
              placeholder="Enter issuer name"
            />
          </div>

          {/* Date Fields - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormField label="Date Issued:" name="dateIssued" type="date" />
            </div>
            <div>
              <FormField
                label="Posting Period:"
                name="postingPeriod"
                type="date"
              />
            </div>
          </div>

          {/* Amount Issued */}
          <div>
            <FormField
              label="Amount Issued:"
              name="amountIssued"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          {/* Remarks */}
          <div>
            <FormField
              label="Remarks:"
              name="remarks"
              type="textarea"
              placeholder="Enter remarks"
              rows={4}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isValid || !dirty}
              loading={isSubmitting}
              className="px-6 py-2"
            >
              {ticket ? 'Update Ticket' : 'Add Ticket'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PublicMarketTicketForm;
