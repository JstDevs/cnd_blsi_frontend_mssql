import { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormField from '../../components/common/FormField';
import { obligationRequestItemsCalculator } from '../../utils/obligationRequestItemsCalculator';

function FundUtilizationAddItemForm({
  onSubmit,
  onClose,
  responsibilityOptions = [],
  particularsOptions = [],
  unitOptions = [],
  taxCodeOptions = [],
  taxCodeFull = [],
  budgetOptions = [],
  initialData,
}) {
  const validationSchema = Yup.object({
    ResponsibilityCenter: Yup.string().required('Required'),
    ChargeAccountID: Yup.string().required('Required'),
    ItemID: Yup.string().required('Required'),
    Remarks: Yup.string().required('Required'),
    // FPP: Yup.string().required('Required'),
    Price: Yup.number().required('Required'),
    Quantity: Yup.number().required('Required'),
    ItemUnitID: Yup.string().required('Required'),
    TAXCodeID: Yup.string().required('Required'),
    // DiscountRate: Yup.number().required('Required'),
  });

  const formik = useFormik({
    initialValues: initialData || {
      ResponsibilityCenter: '',
      ChargeAccountID: '',
      ItemID: '',
      Remarks: '',
      // FPP: '',
      Price: '',
      Quantity: 1,
      ItemUnitID: '',
      TAXCodeID: '',
      Vatable: false,
      withheldEWT: 0,
      // DiscountRate: 0,
      subtotal: 0,
    },
    validationSchema,
    onSubmit: (vals) => {
      const selectedTax = taxCodeFull.find(
        (t) => String(t.ID) === String(vals.TAXCodeID)
      );

      const computed = obligationRequestItemsCalculator({
        price: vals.Price,
        quantity: vals.Quantity,
        taxRate: selectedTax?.Rate || 0,
        // discountPercent: vals.DiscountRate,
        vatable: vals.Vatable,
        ewtRate: vals.withheldEWT,
      });

      const rcSelected = responsibilityOptions.find(
        (o) => String(o.value) === String(vals.ResponsibilityCenter)
      );
      const cSelected = budgetOptions.find(
        (o) => String(o.value) === String(vals.ChargeAccountID)
      );
      const itemSelected = particularsOptions.find(
        (o) => String(o.value) === String(vals.ItemID)
      );

      onSubmit({
        ...vals,
        ...computed,
        responsibilityCenterName: rcSelected ? rcSelected.label : '',
        chargeAccountName: cSelected ? cSelected.label : '',
        itemName: itemSelected ? itemSelected.label : '',
      });
      onClose();
    },
  });

  const prev = useRef({ ...formik.values });

  useEffect(() => {
    const watched = ['Price', 'Quantity', 'TAXCodeID', 'Vatable'];
    if (!watched.some((k) => formik.values[k] !== prev.current[k])) return;
    prev.current = { ...formik.values };

    const selectedTax = taxCodeFull.find(
      (t) => String(t.ID) === String(formik.values.TAXCodeID)
    );
    const computed = obligationRequestItemsCalculator({
      price: formik.values.Price,
      quantity: formik.values.Quantity,
      taxRate: selectedTax?.Rate || 0,
      // discountPercent: formik.values.DiscountRate,
      vatable: formik.values.Vatable,
      ewtRate: formik.values.withheldEWT,
    });

    if (computed.subtotal !== formik.values.subtotal) {
      formik.setFieldValue('subtotal', computed.subtotal, false);
    }
    if (computed.withheld !== formik.values.withheldEWT) {
      formik.setFieldValue('withheldEWT', computed.withheld, false);
    }
  }, [
    formik.values.Price,
    formik.values.Quantity,
    // formik.values.DiscountRate,
    formik.values.TAXCodeID,
    formik.values.Vatable,
    formik.values.withheldEWT,
    taxCodeFull,
  ]);

  const currentTaxRate =
    taxCodeFull.find((t) => String(t.ID) === String(formik.values.TAXCodeID))
      ?.Rate ?? '';

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <FormField
            type="select"
            label="Responsibility Center"
            name="ResponsibilityCenter"
            options={responsibilityOptions}
            {...formik.getFieldProps('ResponsibilityCenter')}
            required
            error={
              formik.touched.ResponsibilityCenter &&
              formik.errors.ResponsibilityCenter
            }
            touched={formik.touched.ResponsibilityCenter}
          />
        </div>

        <div>
          <FormField
            type="select"
            label="Charge Account"
            name="ChargeAccountID"
            options={budgetOptions}
            {...formik.getFieldProps('ChargeAccountID')}
            required
            error={
              formik.touched.ChargeAccountID && formik.errors.ChargeAccountID
            }
            touched={formik.touched.ChargeAccountID}
          />
        </div>

        <div>
          <FormField
            type="select"
            label="Particulars"
            name="ItemID"
            options={particularsOptions}
            {...formik.getFieldProps('ItemID')}
            required
            error={formik.touched.ItemID && formik.errors.ItemID}
            touched={formik.touched.ItemID}
          />
        </div>
      </div>

      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-4"> */}
      {/* <div>
          <FormField
            type="text"
            label="Remarks"
            name="Remarks"
            {...formik.getFieldProps('Remarks')}
            required
          />
          {formik.touched.Remarks && formik.errors.Remarks && (
            <p className="text-red-500 text-sm">{formik.errors.Remarks}</p>
          )}
        </div> */}

      {/* <div>
          <FormField
            type="text"
            label="FPP"
            name="FPP"
            {...formik.getFieldProps('FPP')}
            required
          />
          {formik.touched.FPP && formik.errors.FPP && (
            <p className="text-red-500 text-sm">{formik.errors.FPP}</p>
          )}
        </div> */}
      {/* </div> */}

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <FormField
            type="number"
            label="Item Price"
            name="Price"
            {...formik.getFieldProps('Price')}
            required
            error={formik.touched.Price && formik.errors.Price}
            touched={formik.touched.Price}
          />
        </div>

        <div>
          <FormField
            type="number"
            label="Quantity"
            name="Quantity"
            {...formik.getFieldProps('Quantity')}
            required
            error={formik.touched.Quantity && formik.errors.Quantity}
            touched={formik.touched.Quantity}
          />
        </div>

        <div>
          <FormField
            type="select"
            label="Unit"
            name="ItemUnitID"
            options={unitOptions}
            {...formik.getFieldProps('ItemUnitID')}
            required
            error={formik.touched.ItemUnitID && formik.errors.ItemUnitID}
            touched={formik.touched.ItemUnitID}
          />
        </div>
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <FormField
            type="select"
            label="Tax Code"
            name="TAXCodeID"
            options={taxCodeOptions}
            {...formik.getFieldProps('TAXCodeID')}
            required
            error={formik.touched.TAXCodeID && formik.errors.TAXCodeID}
            touched={formik.touched.TAXCodeID}
          />
        </div>

        <div>
          <FormField
            type="number"
            label="Withheld / EWT"
            name="withheldEWT"
            value={formik.values.withheldEWT}
            readOnly
            disabled
          />
        </div>

        {/* <div>
          <FormField
            type="number"
            label="Discount %"
            name="DiscountRate"
            {...formik.getFieldProps('DiscountRate')}
            required
          />
          {formik.touched.DiscountRate && formik.errors.DiscountRate && (
            <p className="text-red-500 text-sm">{formik.errors.DiscountRate}</p>
          )}
        </div> */}
        <FormField
          type="number"
          label="Tax Rate (%)"
          name="TaxRateDisplay"
          value={currentTaxRate}
          disabled
        />
      </div>

      {/* Tax Rate Display */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <FormField
          type="number"
          label="Tax Rate (%)"
          name="TaxRateDisplay"
          value={currentTaxRate}
          disabled
        />
      </div> */}

      {/* Vatable checkbox */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <FormField
          type="text"
          label="Remarks"
          name="Remarks"
          {...formik.getFieldProps('Remarks')}
          required
          error={formik.touched.Remarks && formik.errors.Remarks}
          touched={formik.touched.Remarks}
        />
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            name="Vatable"
            checked={formik.values.Vatable}
            onChange={() =>
              formik.setFieldValue('Vatable', !formik.values.Vatable ? 1 : 0)
            }
            className="mr-2"
          />
          <span className="text-sm">Vatable</span>
        </label>
      </div>

      {/* Subtotal */}
      <div className="font-semibold text-right">
        Sub‑Total:&nbsp;{Number(formik.values.subtotal || 0).toFixed(2)}
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

export default FundUtilizationAddItemForm;
