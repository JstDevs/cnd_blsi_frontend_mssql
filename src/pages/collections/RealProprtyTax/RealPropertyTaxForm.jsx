import { useState } from 'react';
import {
  Building,
  FileText,
  Calendar,
  MapPin,
  Plus,
  Trash2,
} from 'lucide-react';
// import FormField from './FormField';
// import { Button } from '@/components/ui/button';
import FormField from '@/components/common/FormField';
import Button from '@/components/common/Button';

const RealPropertyTaxForm = () => {
  const [formData, setFormData] = useState({
    owner: '',
    municipality: 'MAKATI',
    checkNumber: '0',
    previousPayment: '0',
    receivedFrom: 'CEDRIC',
    taxDeclarationNumber: '',
    address: '',
    block: '',
    lot: '',
    amountReceived: '',
    remainingBalance: '0',
    receivedFrom2: '',
    advancePayment: false,
    year: '2025',
    until: '2025',
    amountInWords: '',
    // Fund selection
    basicFund: true,
    specialEducationFund: false,
    // Previous Year Balance section
    previousLandValues: '0',
    previousImprovement: '0',
    previousTotalAssessed: '0',
    previousTotal: '0',
    // Present Year Balance section
    presentLandValues: '0',
    presentImprovement: '0',
    presentTotalAssessed: '0',
    discountRate: '0',
    penaltyRate: '0',
    payment: '0',
    dueDateYear: '',
    // Payment options
    installmentPayment: false,
    fullPayment: true,
  });

  const [propertyEntries, setPropertyEntries] = useState([
    {
      id: '1',
      ownerAddress: '',
      lotNumber: '',
      blockNumber: '',
      tdNo: '',
      land: '',
      improvement: '',
      totalAssessed: '',
      taxDue: '',
      payment: '',
    },
  ]);

  const [presentYearEntries, setPresentYearEntries] = useState([
    {
      id: '1',
      ownerAddress: '',
      lotNumber: '',
      blockNumber: '',
      tdNo: '',
      land: '',
      improvement: '',
      totalAssessed: '',
      taxDue: '',
      payment: '',
    },
  ]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addPropertyEntry = (entries, setEntries) => {
    const newEntry = {
      id: Date.now().toString(),
      ownerAddress: '',
      lotNumber: '',
      blockNumber: '',
      tdNo: '',
      land: '',
      improvement: '',
      totalAssessed: '',
      taxDue: '',
      payment: '',
    };
    setEntries([...entries, newEntry]);
  };

  const removePropertyEntry = (id, entries, setEntries) => {
    if (entries.length > 1) {
      setEntries(entries.filter((entry) => entry.id !== id));
    }
  };

  const updatePropertyEntry = (id, field, value, entries, setEntries) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const PropertyTable = ({ entries, setEntries, title }) => (
    <div className="bg-white rounded-lg border border-gray-200 mb-6">
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => addPropertyEntry(entries, setEntries)}
            className="bg-green-600 hover:bg-green-700 text-white p-2 h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-2 text-sm font-medium">
                  Owner ID
                </th>
                <th className="border border-gray-300 p-2 text-sm font-medium">
                  Owner Address
                </th>
                <th className="border border-gray-300 p-2 text-sm font-medium">
                  Lot Number
                </th>
                <th className="border border-gray-300 p-2 text-sm font-medium">
                  Block Number
                </th>
                <th className="border border-gray-300 p-2 text-sm font-medium">
                  T.D No
                </th>
                <th className="border border-gray-300 p-2 text-sm font-medium">
                  Land
                </th>
                <th className="border border-gray-300 p-2 text-sm font-medium">
                  Improvement
                </th>
                <th className="border border-gray-300 p-2 text-sm font-medium">
                  Total Assessed
                </th>
                <th className="border border-gray-300 p-2 text-sm font-medium">
                  Tax Due
                </th>
                <th className="border border-gray-300 p-2 text-sm font-medium">
                  Payment
                </th>
                <th className="border border-gray-300 p-2 text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={entry.id}>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="text"
                      value={index + 1}
                      readOnly
                      className="w-full p-1 text-sm bg-gray-50 border-none text-center"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="text"
                      value={entry.ownerAddress}
                      onChange={(e) =>
                        updatePropertyEntry(
                          entry.id,
                          'ownerAddress',
                          e.target.value,
                          entries,
                          setEntries
                        )
                      }
                      className="w-full p-1 text-sm border-none"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="text"
                      value={entry.lotNumber}
                      onChange={(e) =>
                        updatePropertyEntry(
                          entry.id,
                          'lotNumber',
                          e.target.value,
                          entries,
                          setEntries
                        )
                      }
                      className="w-full p-1 text-sm border-none"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="text"
                      value={entry.blockNumber}
                      onChange={(e) =>
                        updatePropertyEntry(
                          entry.id,
                          'blockNumber',
                          e.target.value,
                          entries,
                          setEntries
                        )
                      }
                      className="w-full p-1 text-sm border-none"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="text"
                      value={entry.tdNo}
                      onChange={(e) =>
                        updatePropertyEntry(
                          entry.id,
                          'tdNo',
                          e.target.value,
                          entries,
                          setEntries
                        )
                      }
                      className="w-full p-1 text-sm border-none"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="text"
                      value={entry.land}
                      onChange={(e) =>
                        updatePropertyEntry(
                          entry.id,
                          'land',
                          e.target.value,
                          entries,
                          setEntries
                        )
                      }
                      className="w-full p-1 text-sm border-none text-right"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="text"
                      value={entry.improvement}
                      onChange={(e) =>
                        updatePropertyEntry(
                          entry.id,
                          'improvement',
                          e.target.value,
                          entries,
                          setEntries
                        )
                      }
                      className="w-full p-1 text-sm border-none text-right"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="text"
                      value={entry.totalAssessed}
                      onChange={(e) =>
                        updatePropertyEntry(
                          entry.id,
                          'totalAssessed',
                          e.target.value,
                          entries,
                          setEntries
                        )
                      }
                      className="w-full p-1 text-sm border-none text-right"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="text"
                      value={entry.taxDue}
                      onChange={(e) =>
                        updatePropertyEntry(
                          entry.id,
                          'taxDue',
                          e.target.value,
                          entries,
                          setEntries
                        )
                      }
                      className="w-full p-1 text-sm border-none text-right"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="text"
                      value={entry.payment}
                      onChange={(e) =>
                        updatePropertyEntry(
                          entry.id,
                          'payment',
                          e.target.value,
                          entries,
                          setEntries
                        )
                      }
                      className="w-full p-1 text-sm border-none text-right"
                    />
                  </td>
                  <td className="border border-gray-300 p-1 text-center">
                    <button
                      type="button"
                      onClick={() =>
                        removePropertyEntry(entry.id, entries, setEntries)
                      }
                      className="btn btn-danger "
                      disabled={entries.length === 1}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white md:p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Basic Information Row */}
        <div className="bg-white rounded-lg shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
            <h3 className="text-2xl font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Basic Information
            </h3>
          </div>
          <div className="p-6">
            {/* First Row */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <FormField
                label="Owner"
                name="owner"
                value={formData.owner}
                onChange={(e) => handleInputChange('owner', e.target.value)}
                className="border-green-200 focus:border-green-500 focus:ring-green-500"
              />
              <FormField
                label="Municipality"
                name="municipality"
                value={formData.municipality}
                onChange={(e) =>
                  handleInputChange('municipality', e.target.value)
                }
                className="border-green-200 focus:border-green-500 focus:ring-green-500"
              />
              <FormField
                label="Check Number"
                name="checkNumber"
                value={formData.checkNumber}
                onChange={(e) =>
                  handleInputChange('checkNumber', e.target.value)
                }
                className="border-green-200 focus:border-green-500 focus:ring-green-500"
              />
              <FormField
                label="Previous Payment"
                name="previousPayment"
                value={formData.previousPayment}
                onChange={(e) =>
                  handleInputChange('previousPayment', e.target.value)
                }
                className="border-green-200 focus:border-green-500 focus:ring-green-500"
              />
              <FormField
                label="Received From"
                name="receivedFrom"
                value={formData.receivedFrom}
                onChange={(e) =>
                  handleInputChange('receivedFrom', e.target.value)
                }
                className="border-green-200 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <FormField
                label="Tax Declaration Number"
                name="taxDeclarationNumber"
                value={formData.taxDeclarationNumber}
                onChange={(e) =>
                  handleInputChange('taxDeclarationNumber', e.target.value)
                }
                className="border-green-200 focus:border-green-500 focus:ring-green-500"
              />
              <FormField
                label="Address"
                name="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="border-green-200 focus:border-green-500 focus:ring-green-500"
              />
              <FormField
                label="Block"
                name="block"
                value={formData.block}
                onChange={(e) => handleInputChange('block', e.target.value)}
                className="border-green-200 focus:border-green-500 focus:ring-green-500"
              />
              <FormField
                label="Lot"
                name="lot"
                value={formData.lot}
                onChange={(e) => handleInputChange('lot', e.target.value)}
                className="border-green-200 focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Previous Balance Land Values Section */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="bg-gray-100 p-4 rounded-t-lg">
            <h3 className="text-lg font-semibold text-gray-700">
              Previous Balance Land Values
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <FormField
                label="Land Values"
                name="previousLandValues"
                value={formData.previousLandValues}
                onChange={(e) =>
                  handleInputChange('previousLandValues', e.target.value)
                }
                className="border-gray-200 focus:border-green-500 focus:ring-green-500"
              />
              <FormField
                label="Improvement"
                name="previousImprovement"
                value={formData.previousImprovement}
                onChange={(e) =>
                  handleInputChange('previousImprovement', e.target.value)
                }
                className="border-gray-200 focus:border-green-500 focus:ring-green-500"
              />
              <FormField
                label="Total Assessed Value"
                name="previousTotalAssessed"
                value={formData.previousTotalAssessed}
                onChange={(e) =>
                  handleInputChange('previousTotalAssessed', e.target.value)
                }
                className="border-gray-200 focus:border-green-500 focus:ring-green-500"
              />
              <FormField
                label="Total"
                name="previousTotal"
                value={formData.previousTotal}
                onChange={(e) =>
                  handleInputChange('previousTotal', e.target.value)
                }
                className="border-gray-200 focus:border-green-500 focus:ring-green-500"
              />
              <div className="flex flex-col gap-2">
                <FormField
                  label="General Revision (Year)"
                  name="dueDateYear"
                  value={formData.dueDateYear}
                  onChange={(e) =>
                    handleInputChange('dueDateYear', e.target.value)
                  }
                  className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
                <FormField
                  label="Payment"
                  name="payment"
                  value={formData.payment}
                  onChange={(e) => handleInputChange('payment', e.target.value)}
                  className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Property Tables */}
        <PropertyTable
          entries={propertyEntries}
          setEntries={setPropertyEntries}
          title="Previous Year Balance - Detailed Property List"
        />

        {/* Present Year Balance Section */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="bg-gray-100 p-4 rounded-t-lg">
            <h3 className="text-lg font-semibold text-gray-700">
              Present Year Balance
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <FormField
                label="Land Values"
                name="presentLandValues"
                value={formData.presentLandValues}
                onChange={(e) =>
                  handleInputChange('presentLandValues', e.target.value)
                }
                className="border-gray-200 focus:border-green-500 focus:ring-green-500"
              />
              <FormField
                label="Improvement"
                name="presentImprovement"
                value={formData.presentImprovement}
                onChange={(e) =>
                  handleInputChange('presentImprovement', e.target.value)
                }
                className="border-gray-200 focus:border-green-500 focus:ring-green-500"
              />
              <FormField
                label="Total Assessed Value"
                name="presentTotalAssessed"
                value={formData.presentTotalAssessed}
                onChange={(e) =>
                  handleInputChange('presentTotalAssessed', e.target.value)
                }
                className="border-gray-200 focus:border-green-500 focus:ring-green-500"
              />
              <div className="text-center">
                <span className="text-sm font-medium text-gray-600">
                  Label10
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <FormField
                label="Discount Rate"
                name="discountRate"
                value={formData.discountRate}
                onChange={(e) =>
                  handleInputChange('discountRate', e.target.value)
                }
                className="border-gray-200 focus:border-green-500 focus:ring-green-500"
              />
              <FormField
                label="Penalty Rate"
                name="penaltyRate"
                value={formData.penaltyRate}
                onChange={(e) =>
                  handleInputChange('penaltyRate', e.target.value)
                }
                className="border-gray-200 focus:border-green-500 focus:ring-green-500"
              />
              <FormField
                label="Payment"
                name="payment"
                value={formData.payment}
                onChange={(e) => handleInputChange('payment', e.target.value)}
                className="border-gray-200 focus:border-green-500 focus:ring-green-500"
              />
              <FormField
                label="Total"
                name="previousTotal"
                value={formData.previousTotal}
                onChange={(e) =>
                  handleInputChange('previousTotal', e.target.value)
                }
                className="border-gray-200 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <FormField
                label="Payment"
                name="payment"
                value={formData.payment}
                onChange={(e) => handleInputChange('payment', e.target.value)}
                className="border-gray-200 focus:border-green-500 focus:ring-green-500"
              />
              <FormField
                label="Due Date (Year)"
                name="dueDateYear"
                value={formData.dueDateYear}
                onChange={(e) =>
                  handleInputChange('dueDateYear', e.target.value)
                }
                className="border-gray-200 focus:border-green-500 focus:ring-green-500"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentType"
                      checked={formData.installmentPayment}
                      onChange={() => {
                        handleInputChange('installmentPayment', true);
                        handleInputChange('fullPayment', false);
                      }}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm">Installment Payment</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentType"
                      checked={formData.fullPayment}
                      onChange={() => {
                        handleInputChange('fullPayment', true);
                        handleInputChange('installmentPayment', false);
                      }}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm">Full Payment</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <PropertyTable
          entries={presentYearEntries}
          setEntries={setPresentYearEntries}
          title="Present Year Balance - Detailed Property List"
        />

        {/* Right Panel Information */}
        <div className="bg-white rounded-lg shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
            <h3 className="text-2xl font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Payment Summary
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormField
                label="Amount Received"
                name="amountReceived"
                value={formData.amountReceived}
                onChange={(e) =>
                  handleInputChange('amountReceived', e.target.value)
                }
                className="border-green-200 focus:border-green-500 focus:ring-green-500 text-right font-mono"
              />
              <FormField
                label="Remaining Balance"
                name="remainingBalance"
                value={formData.remainingBalance}
                onChange={(e) =>
                  handleInputChange('remainingBalance', e.target.value)
                }
                className="border-green-200 focus:border-green-500 focus:ring-green-500 text-right font-mono"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormField
                label="Received From"
                name="receivedFrom2"
                value={formData.receivedFrom2}
                onChange={(e) =>
                  handleInputChange('receivedFrom2', e.target.value)
                }
                className="border-green-200 focus:border-green-500 focus:ring-green-500"
              />
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.advancePayment}
                    onChange={(e) =>
                      handleInputChange('advancePayment', e.target.checked)
                    }
                    className="text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium">Advance Payment</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center gap-4">
                <FormField
                  label="Year"
                  name="year"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  className="border-green-200 focus:border-green-500 focus:ring-green-500 w-20"
                />
                <span className="text-sm text-gray-600">Until</span>
                <FormField
                  label=""
                  name="until"
                  value={formData.until}
                  onChange={(e) => handleInputChange('until', e.target.value)}
                  className="border-green-200 focus:border-green-500 focus:ring-green-500 w-20"
                />
              </div>
              {/* TODO CHANGE FORM FOR THIS VALUE.... */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fund Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="fundType"
                      checked={formData.basicFund}
                      onChange={() => {
                        handleInputChange('basicFund', true);
                        handleInputChange('specialEducationFund', false);
                      }}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm">Basic Fund</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="fundType"
                      checked={formData.specialEducationFund}
                      onChange={() => {
                        handleInputChange('specialEducationFund', true);
                        handleInputChange('basicFund', false);
                      }}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm">Special Education Fund</span>
                  </label>
                </div>
              </div>
            </div>

            <FormField
              label="Amount In Words"
              name="amountInWords"
              value={formData.amountInWords}
              onChange={(e) =>
                handleInputChange('amountInWords', e.target.value)
              }
              className="border-green-200 focus:border-green-500 focus:ring-green-500"
              placeholder="Enter amount in words..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pb-8">
          <button variant="outline" className="btn btn-outline">
            Cancel
          </button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
            Save Draft
          </Button>
          {/* <Button
            variant="outline"
            className="border-gray-300 text-gray-600 hover:bg-gray-50 px-8 py-3 text-lg"
          >
            Print Preview
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default RealPropertyTaxForm;
