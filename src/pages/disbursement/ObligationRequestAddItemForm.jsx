import { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormField from '../../components/common/FormField';
import { obligationRequestItemsCalculator } from '../../utils/obligationRequestItemsCalculator';

function ObligationRequestAddItemForm({
  onSubmit,
  onClose,
  responsibilityOptions = [],
  chargeAccountOptions = [],
  particularsOptions = [],
  unitOptions = [],
  taxCodeOptions = [],
  initialData,
}) {
  /* ── Yup validation (simplified) ─────────────────────── */
  const validationSchema = Yup.object({
    // responsibilityCenter: Yup.string().required('Required'),
    // chargeAccount: Yup.string().required('Required'),
    // particulars: Yup.string().required('Required'),
    // remarks: Yup.string().required('Required'),
    // fpp: Yup.string().required('Required'),
    // price: Yup.number().required('Required').min(0),
    // quantity: Yup.number().required('Required').min(1),
    // unit: Yup.string().required('Required'),
    // taxCode: Yup.string().required('Required'),
    // discountPercent: Yup.number().min(0).max(100).required('Required'),
    // withheldEWT: Yup.number().min(0).required('Required'),
    // vatable: Yup.boolean(),
  });

  /* ── Formik setup ─────────────────────────────────────── */
  const formik = useFormik({
    initialValues: initialData || {
      responsibilityCenter: '',
      chargeAccount: '',
      particulars: '',
      remarks: '',
      fpp: '',
      price: '',
      quantity: 1,
      unit: '',
      taxCode: '',
      withheldEWT: 0,
      discountPercent: 0,
      vatable: false,
      subTotal: 0,
    },
    validationSchema,
    onSubmit: (vals) => {
      onSubmit(vals);   // ← already contains subTotal
      onClose();
    },
  });

  /* ── Re‑compute every time pricing inputs change ──────── */
  const prev = useRef(formik.values);
  useEffect(() => {
    const watched = [
      'price',
      'quantity',
      'discountPercent',
      'taxCode',
      'vatable',
    ];

    const hasChanged = watched.some(
      (k) => formik.values[k] !== prev.current[k]
    );
    if (!hasChanged) return;

    prev.current = formik.values;

    const calc = obligationRequestItemsCalculator(formik.values);
    if (calc.subtotal !== formik.values.subTotal) {
      formik.setFieldValue('subTotal', calc.subtotal, false); // silent
    }
  }, [
    formik.values.price,
    formik.values.quantity,
    formik.values.discountPercent,
    formik.values.taxCode,
    formik.values.vatable,
  ]);

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <FormField
          type="select"
          label="Responsibility Center"
          name="responsibilityCenter"
          options={responsibilityOptions}
          {...formik.getFieldProps('responsibilityCenter')}
          error={formik.touched.responsibilityCenter && formik.errors.responsibilityCenter}
          required
        />
        <FormField
          type="select"
          label="Charge Account"
          name="chargeAccount"
          options={chargeAccountOptions}
          {...formik.getFieldProps('chargeAccount')}
          error={formik.touched.chargeAccount && formik.errors.chargeAccount}
          required
        />
        <FormField
          type="select"
          label="Particulars"
          name="particulars"
          options={particularsOptions}
          {...formik.getFieldProps('particulars')}
          error={formik.touched.particulars && formik.errors.particulars}
          required
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <FormField
          type="text"
          label="Remarks"
          name="remarks"
          {...formik.getFieldProps('remarks')}
          error={formik.touched.remarks && formik.errors.remarks}
          required
        />
        <FormField
          type="text"
          label="FPP"
          name="fpp"
          {...formik.getFieldProps('fpp')}
          error={formik.touched.fpp && formik.errors.fpp}
          required
        />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <FormField
          type="number"
          label="Item Price"
          name="price"
          {...formik.getFieldProps('price')}
          error={formik.touched.price && formik.errors.price}
          required
        />
        <FormField
          type="number"
          label="Quantity"
          name="quantity"
          {...formik.getFieldProps('quantity')}
          error={formik.touched.quantity && formik.errors.quantity}
          required
        />
        <FormField
          type="select"
          label="Unit"
          name="unit"
          options={unitOptions}
          {...formik.getFieldProps('unit')}
          error={formik.touched.unit && formik.errors.unit}
          required
        />
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <FormField
          type="select"
          label="Tax Code"
          name="taxCode"
          options={taxCodeOptions}
          {...formik.getFieldProps('taxCode')}
          error={formik.touched.taxCode && formik.errors.taxCode}
          required
        />
        <FormField
          type="number"
          label="Withheld / EWT"
          name="withheldEWT"
          {...formik.getFieldProps('withheldEWT')}
          error={formik.touched.withheldEWT && formik.errors.withheldEWT}
          required
        />
        <FormField
          type="number"
          label="Discount %"
          name="discountPercent"
          {...formik.getFieldProps('discountPercent')}
          error={formik.touched.discountPercent && formik.errors.discountPercent}
          required
        />
      </div>

      {/* Row 4 */}
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          name="vatable"
          checked={formik.values.vatable}
          onChange={formik.handleChange}
          className="mr-2"
        />
        <span className="text-sm">Vatable</span>
      </label>

      {/* Row 5 */}
      <div className="font-semibold text-right">
        Sub‑Total:&nbsp;
        {Number(formik.values.subTotal || 0).toFixed(2)}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 border-t pt-4">
        <button type="button" className="btn btn-outline" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </div>
    </form>
  );
}

export default ObligationRequestAddItemForm;
