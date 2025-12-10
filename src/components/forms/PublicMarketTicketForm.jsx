// components/forms/PublicMarketTicketForm.js
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import FormField from '../common/FormField';
import {
  addPublicMarketTicket,
  fetchPublicMarketTickets,
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
          addPublicMarketTicket({
            IsNew: false,
            ID: ticket.ID,
            LinkID: ticket.LinkID,
            ...submissionData,
          })
        ).unwrap();
        toast.success('Ticket updated successfully');
        dispatch(fetchPublicMarketTickets());
      } else {
        await dispatch(
          addPublicMarketTicket({ IsNew: true, ...submissionData })
        ).unwrap();
        toast.success('Ticket added successfully');
        dispatch(fetchPublicMarketTickets());
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      onClose();
    }
  };

  return (
    <Formik
      initialValues={formatInitialValues(ticket)}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({
        isSubmitting,
        isValid,
        dirty,
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
      }) => (
        <Form className="space-y-6">
          {/* Items Field */}
          <FormField
            label="Items:"
            name="items"
            type="text"
            placeholder="Enter items"
            required
            error={touched.items && errors.items}
            touched={touched.items}
            value={values.items}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          {/* Date and Time Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Date Issued:"
              name="dateIssued"
              type="date"
              max={new Date().toISOString().split('T')[0]}
              required
              error={touched.dateIssued && errors.dateIssued}
              touched={touched.dateIssued}
              value={values.dateIssued}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormField
              label="Posting Period:"
              name="postingPeriod"
              type="date"
              // min={values.dateIssued}
              // max={new Date().toISOString().split('T')[0]}
              required
              error={touched.postingPeriod && errors.postingPeriod}
              touched={touched.postingPeriod}
              value={values.postingPeriod}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Start Time:"
              name="startTime"
              type="datetime-local"
              max={values.postingPeriod}
              required
              error={touched.startTime && errors.startTime}
              touched={touched.startTime}
              value={values.startTime}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormField
              label="End Time:"
              name="endTime"
              type="datetime-local"
              min={values.startTime}
              max={values.postingPeriod}
              required
              error={touched.endTime && errors.endTime}
              touched={touched.endTime}
              value={values.endTime}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

          <FormField
            label="Issued By:"
            name="issuedBy"
            type="text"
            placeholder="Enter issuer name"
            required
            error={touched.issuedBy && errors.issuedBy}
            touched={touched.issuedBy}
            value={values.issuedBy}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <FormField
            label="Amount Issued:"
            name="amountIssued"
            type="text"
            placeholder="0.00"
            required
            error={touched.amountIssued && errors.amountIssued}
            touched={touched.amountIssued}
            value={
              values.amountIssued !== '' && !isNaN(values.amountIssued)
                ? Number(values.amountIssued).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : ''
            }
            onChange={(e) => {
              // Remove all non-digit characters
              const rawValue = e.target.value.replace(/\D/g, '');

              // Parse to number and divide by 100 to get 2 decimal places
              const formattedValue = rawValue
                ? (parseInt(rawValue, 10) / 100).toFixed(2)
                : '';

              // Store in Formik as a plain number
              handleChange({
                target: {
                  name: 'amountIssued',
                  value: formattedValue,
                },
              });
            }}
            onBlur={handleBlur}
          />

          <FormField
            label="Remarks:"
            name="remarks"
            type="textarea"
            placeholder="Enter remarks"
            required
            error={touched.remarks && errors.remarks}
            touched={touched.remarks}
            value={values.remarks}
            onChange={handleChange}
            onBlur={handleBlur}
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
