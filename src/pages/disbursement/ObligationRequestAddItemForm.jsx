import { useEffect, useRef, useMemo } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormField from '../../components/common/FormField';
import { obligationRequestItemsCalculator } from '../../utils/obligationRequestItemsCalculator';
import { formatCurrency, formatForInput } from '../../utils/currencyFormater';

function ObligationRequestAddItemForm({
  onSubmit,
  onClose,
  responsibilityOptions = [],
  particularsOptions = [],
  unitOptions = [],
  taxCodeOptions = [],
  taxCodeFull = [],
  budgetOptions = [],
  formBudgets = [],
  initialData,
}) {
  const validationSchema = Yup.object({
    ResponsibilityCenter: Yup.string().required('Required'),
    ChargeAccountID: Yup.string().required('Required'),
    // ItemID: Yup.string().required('Required'),
    Remarks: Yup.string().required('Required'),
    FPP: Yup.string(),
    Price: Yup.number().required('Required'),
    Quantity: Yup.number().required('Required'),
    ItemUnitID: Yup.string().required('Required'),
    // TAXCodeID: Yup.string().required('Required'),
    // DiscountRate: Yup.number().required('Required'),
  });

  const formik = useFormik({
    initialValues: initialData || {
      ResponsibilityCenter: '',
      ChargeAccountID: '',
      ItemID: '',
      Remarks: '',
      FPP: '',
      Price: '',
      Quantity: 1,
      ItemUnitID: '',
      TAXCodeID: initialData?.TAXCodeID || '',
      Vatable: initialData?.Vatable || false,
      withheldEWT: initialData?.EWTRate || 0,
      DiscountRate: initialData?.DiscountRate || 0,
      subtotal: initialData?.subtotal || 0,
    },
    validationSchema,
    onSubmit: (vals) => {
      const sBudget = formBudgets.find(b => String(b.ID) === String(vals.ChargeAccountID));
      if (sBudget) {
          const appro = parseFloat(sBudget.Appropriation || 0);
          const used = parseFloat(sBudget.PreEncumbrance || 0) + parseFloat(sBudget.Encumbrance || 0);
          const available = appro - used;
          
          // Check if Subtotal exceeds Available
          if (parseFloat(vals.subtotal) > available) {
             // You can use toast or alert
             alert(`Insufficient budget! You only have ${formatCurrency(available)} remaining.`);
             return; // STOP execution
          }
      }

      // Find a default tax if none is selected (since field is hidden)
      let finalTaxID = vals.TAXCodeID;
      if (!finalTaxID && taxCodeFull.length > 0) {
        const zeroTax = taxCodeFull.find(t => parseFloat(t.Rate) === 0);
        finalTaxID = zeroTax ? zeroTax.ID : taxCodeFull[0].ID;
      }

      const selectedTax = taxCodeFull.find(
        (t) => String(t.ID) === String(finalTaxID)
      );
      console.log('selectedTax', vals);
      // const computed = obligationRequestItemsCalculator({
      //   price: vals.Price,
      //   quantity: vals.Quantity,
      //   taxRate: selectedTax?.Rate || 0,
      //   discountPercent: vals.DiscountRate,
      //   vatable: vals.Vatable,
      //   ewtRate: vals.withheldEWT,
      // });

      const rcSelected = responsibilityOptions.find(
        (o) => String(o.value) === String(vals.ResponsibilityCenter)
      );
      const cSelected = budgetOptions.find(
        (o) => String(o.value) === String(vals.ChargeAccountID)
      );
      // const itemSelected = particularsOptions.find(
      //   (o) => String(o.value) === String(vals.ItemID)
      // );

      onSubmit({
        ...vals,
        TAXCodeID: finalTaxID,
        // ...computed,
        responsibilityCenterName: rcSelected ? rcSelected.label : '',
        chargeAccountName: cSelected ? cSelected.label : '',
        itemName: vals.Remarks,
        TaxName: selectedTax?.Name,
        TaxRate: selectedTax?.Rate,
      });
      onClose();
    },
  });

  const prev = useRef({ ...formik.values });

  useEffect(() => {
    const watched = [
      'Price',
      'Quantity',
      'DiscountRate',
      'TAXCodeID',
      'Vatable',
    ];
    if (!watched.some((k) => formik.values[k] !== prev.current[k])) return;
    prev.current = { ...formik.values };

    const selectedTax = taxCodeFull.find(
      (t) => String(t.ID) === String(formik.values.TAXCodeID)
    );
    const computed = obligationRequestItemsCalculator({
      price: formik.values.Price,
      quantity: formik.values.Quantity,
      taxRate: selectedTax?.Rate || 0,
      discountPercent: formik.values.DiscountRate,
      vatable: formik.values.Vatable,
      ewtRate: 0, // Should not pass the calculated amount back as a rate
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
    formik.values.DiscountRate,
    formik.values.TAXCodeID,
    formik.values.Vatable,
    formik.values.withheldEWT,
    taxCodeFull,
  ]);

  const currentTaxRate =
    taxCodeFull.find((t) => String(t.ID) === String(formik.values.TAXCodeID))
      ?.Rate ?? '';

  const selectedBudget = useMemo(() => {
    if (!formik.values.ChargeAccountID || !formBudgets) return null;
    return formBudgets.find(b => String(b.ID) === String(formik.values.ChargeAccountID));
  }, [formik.values.ChargeAccountID, formBudgets]);

  const availableBalance = useMemo(() => {
    if (!selectedBudget) return 0;
    const appropriation = parseFloat(selectedBudget.Appropriation || 0);
    const preEncumbrance = parseFloat(selectedBudget.PreEncumbrance || 0);
    const encumbrance = parseFloat(selectedBudget.Encumbrance || 0);

    return appropriation - (preEncumbrance + encumbrance);
  }, [selectedBudget]);

  // Filter budgets based on Selected Responsibility Center
  const filteredBudgetOptions = useMemo(() => {
    if (!formik.values.ResponsibilityCenter) return [];

    // If we have raw budget data (formBudgets), filter by DepartmentID
    if (formBudgets && formBudgets.length > 0) {
      return formBudgets
        .filter((b) => {
          // Must match Responsibility Center (Department)
          const matchesDept = String(b.DepartmentID) === String(formik.values.ResponsibilityCenter);
          return matchesDept;
        })
        .map((b) => ({ value: b.ID, label: b.Name }));
    }

    // Fallback if formBudgets is missing (should verify if this is desired)
    return budgetOptions;
  }, [formik.values.ResponsibilityCenter, formBudgets, budgetOptions]);

  // Reset Charge Account if the selected one is no longer in the filtered list
  useEffect(() => {
    if (formik.values.ChargeAccountID && filteredBudgetOptions.length > 0) {
      const exists = filteredBudgetOptions.some(
        (opt) => String(opt.value) === String(formik.values.ChargeAccountID)
      );
      if (!exists) {
        formik.setFieldValue('ChargeAccountID', '');
      }
    }
  }, [filteredBudgetOptions, formik.values.ChargeAccountID]);

  // const selectedTax = taxCodeFull.find(
  //   (t) => String(t.ID) === String(vals.TAXCodeID)
  // );
  console.log('selectedTax', taxCodeFull);
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
          />
          {formik.touched.ResponsibilityCenter &&
            formik.errors.ResponsibilityCenter && (
              <p className="text-red-500 text-sm">
                {formik.errors.ResponsibilityCenter}
              </p>
            )}
        </div>

        <div>
          <FormField
            type="select"
            label="Charge Account"
            name="ChargeAccountID"
            options={filteredBudgetOptions}
            {...formik.getFieldProps('ChargeAccountID')}
            required
          />

          {/* Start */}
            {selectedBudget && (
              <div className="text-xs mt-1 text-gray-600">
                Available Balance: <span className={`font-semibold ${availableBalance < formik.values.subtotal ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(availableBalance)}
                </span>
                </div>
            )}

          {formik.touched.ChargeAccountID && formik.errors.ChargeAccountID && (
            <p className="text-red-500 text-sm">
              {formik.errors.ChargeAccountID}
            </p>
          )}
        </div>

        {/* <div>
          <FormField
            type="select"
            label="Particulars"
            name="ItemID"
            options={particularsOptions}
            {...formik.getFieldProps('ItemID')}
            required
          />
          {formik.touched.ItemID && formik.errors.ItemID && (
            <p className="text-red-500 text-sm">{formik.errors.ItemID}</p>
          )}
        </div> */}
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <FormField
            type="textarea"
            label="Particulars"
            name="Remarks"
            {...formik.getFieldProps('Remarks')}
            required
            rows={3}
          />
          {formik.touched.Remarks && formik.errors.Remarks && (
            <p className="text-red-500 text-sm">{formik.errors.Remarks}</p>
          )}
        </div>

        {/* <div>
          <FormField
            type="text"
            label="FPP"
            name="FPP"
            {...formik.getFieldProps('FPP')}
          // required
          />
          {formik.touched.FPP && formik.errors.FPP && (
            <p className="text-red-500 text-sm">{formik.errors.FPP}</p>
          )}
        </div> */}
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <FormField
            type="text"
            label="Item Price"
            name="Price"
            value={formatForInput(formik.values.Price)}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/[^0-9.]/g, '');
              formik.setFieldValue('Price', rawValue);
            }}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.Price && formik.errors.Price && (
            <p className="text-red-500 text-sm">{formik.errors.Price}</p>
          )}
        </div>

        <div>
          <FormField
            type="text"
            label="Quantity"
            name="Quantity"
            value={formatForInput(formik.values.Quantity)}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/[^0-9.]/g, '');
              formik.setFieldValue('Quantity', rawValue);
            }}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.Quantity && formik.errors.Quantity && (
            <p className="text-red-500 text-sm">{formik.errors.Quantity}</p>
          )}
        </div>

        <div>
          <FormField
            type="select"
            label="Unit"
            name="ItemUnitID"
            options={unitOptions}
            {...formik.getFieldProps('ItemUnitID')}
            required
          />
          {formik.touched.ItemUnitID && formik.errors.ItemUnitID && (
            <p className="text-red-500 text-sm">{formik.errors.ItemUnitID}</p>
          )}
        </div>
      </div>

      {/* Row 4 */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <FormField
            type="select"
            label="Tax Code"
            name="TAXCodeID"
            options={taxCodeOptions}
            {...formik.getFieldProps('TAXCodeID')}
            required
          />
          {formik.touched.TAXCodeID && formik.errors.TAXCodeID && (
            <p className="text-red-500 text-sm">{formik.errors.TAXCodeID}</p>
          )}
        </div>

        <div>
          <FormField
            type="text"
            label="Withheld / EWT"
            name="withheldEWT"
            value={formatCurrency(formik.values.withheldEWT)}
            readOnly
            className="bg-gray-200 cursor-not-allowed"
          />
        </div>

        <div>
          <FormField
            type="text"
            label="Discount %"
            name="DiscountRate"
            value={formatForInput(formik.values.DiscountRate)}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/[^0-9.]/g, '');
              formik.setFieldValue('DiscountRate', rawValue);
            }}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.DiscountRate && formik.errors.DiscountRate && (
            <p className="text-red-500 text-sm">{formik.errors.DiscountRate}</p>
          )}
        </div>
      </div> */}

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
      {/* <label className="inline-flex items-center">
        <input
          type="checkbox"
          name="Vatable"
          checked={formik.values.Vatable}
          onChange={formik.handleChange}
          className="mr-2"
        />
        <span className="text-sm">Vatable</span>
      </label> */}

      {/* Subtotal */}
      <div className="font-semibold text-right">
        Sub‑Total:&nbsp;{formatCurrency(formik.values.subtotal)}
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
