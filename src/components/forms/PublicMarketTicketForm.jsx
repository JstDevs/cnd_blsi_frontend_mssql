import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { FiPlus, FiX } from 'react-icons/fi';
import FormField from '../common/FormField'
import Button from '../common/Button';
import { addTicket, updateTicket } from '../../features/collections/publicMarketTicketSlice';

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
        await dispatch(updateTicket({ id: ticket.id, ...values })).unwrap();
        toast.success('Ticket updated successfully');
      } else {
        await dispatch(addTicket(values)).unwrap();
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
    >
      {({ isValid, dirty }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Items Type"
              name="items"
              type="text"
              placeholder="Enter items type"
            />
            <FormField
              label="Start Time"
              name="startTime"
              type="time"
            />
            <FormField
              label="End Time"
              name="endTime"
              type="time"
            />
            <FormField
              label="Issued By"
              name="issuedBy"
              type="text"
              placeholder="Enter issuer name"
            />
            <FormField
              label="Date Issued"
              name="dateIssued"
              type="date"
            />
            <FormField
              label="Posting Period"
              name="postingPeriod"
              type="date"
            />
            <FormField
              label="Amount Issued"
              name="amountIssued"
              type="number"
              placeholder="Enter amount"
            />
            <div className="md:col-span-2">
              <FormField
                label="Remarks"
                name="remarks"
                type="textarea"
                placeholder="Enter remarks"
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isValid || !dirty}
              loading={isSubmitting}
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