import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TaxDeclarationPage() {
  const [formData, setFormData] = useState({
    tdNo: '',
    propertyId: '',
    kind: '',
    numStoreys: '',
    owner: '',
    tin: '',
    ownerPhone: '',
    address: '',
    beneficialUser: '',
    beneficialTin: '',
    beneficialPhone: '',
    beneficialAddress: '',
    octTctcloaNo: '',
    surveyNo: '',
    lotNo: '',
    blockNo: '',
    cct: '',
    dated: '',
    boundaries: {
      north: '',
      south: '',
      east: '',
      west: '',
    },
    taxable: false,
    description: '',
    actualUse: '',
    classification: '',
    areaSize: '',
    assessmentLevel: '',
    marketValue: '',
    cancelsTdNo: '',
    effectivity: '',
    ownerPrevious: '',
    previousValue: '',
    amountsInWords: '',
    memoranda: '',
  });

  const [assessmentRows, setAssessmentRows] = useState([
    {
      description: '',
      area: '',
      marketValue: '',
      actualUse: '',
      assessmentLevel: '',
      assessmentValue: '',
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleAssessmentChange = (index, field, value) => {
    const newRows = [...assessmentRows];
    newRows[index][field] = value;
    setAssessmentRows(newRows);
  };

  const addAssessmentRow = () => {
    setAssessmentRows([
      ...assessmentRows,
      {
        description: '',
        area: '',
        marketValue: '',
        actualUse: '',
        assessmentLevel: '',
        assessmentValue: '',
      },
    ]);
  };

  const deleteAssessmentRow = (index) => {
    if (assessmentRows.length > 1) {
      setAssessmentRows(assessmentRows.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    console.log('Assessment Rows:', assessmentRows);
    toast.success('Tax Declaration saved successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Tax Declaration</h1>
        {/* <button onClick={handleAdd} className="btn btn-primary">
          Add Revision
        </button> */}
      </div>

      <div className="space-y-6">
        {/* Basic Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-300">
          <div>
            <label className="block text-sm font-medium mb-1">TD No.</label>
            <input
              type="text"
              name="tdNo"
              value={formData.tdNo}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Property Identification No.
            </label>
            <input
              type="text"
              name="propertyId"
              value={formData.propertyId}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Kind:</label>
            <input
              type="text"
              name="kind"
              value={formData.kind}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Number of Storeys:
            </label>
            <input
              type="text"
              name="numStoreys"
              value={formData.numStoreys}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Owner Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-300">
          <div>
            <label className="block text-sm font-medium mb-1">Owner:</label>
            <select
              name="owner"
              value={formData.owner}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Owner</option>
              <option value="Lea Bugarin Marquez">Lea Bugarin Marquez</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">TIN:</label>
            <input
              type="text"
              name="tin"
              value={formData.tin}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Owner Telephone No.
            </label>
            <input
              type="text"
              name="ownerPhone"
              value={formData.ownerPhone}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Beneficial User Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-300">
          <div>
            <label className="block text-sm font-medium mb-1">
              Beneficial/Administrator User:
            </label>
            <select
              name="beneficialUser"
              value={formData.beneficialUser}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select User</option>
              <option value="MElvin Alvarez">MElvin Alvarez</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Beneficial/Admin User TIN:
            </label>
            <input
              type="text"
              name="beneficialTin"
              value={formData.beneficialTin}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Beneficial/Administrator Telephone No.
            </label>
            <input
              type="text"
              name="beneficialPhone"
              value={formData.beneficialPhone}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Beneficial/Administrator Address:
            </label>
            <input
              type="text"
              name="beneficialAddress"
              value={formData.beneficialAddress}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-300">
          <div>
            <label className="block text-sm font-medium mb-1">
              OCT/TCT/CLOA No.:
            </label>
            <input
              type="text"
              name="octTctcloaNo"
              value={formData.octTctcloaNo}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Survey No.</label>
            <input
              type="text"
              name="surveyNo"
              value={formData.surveyNo}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Lot No.</label>
            <input
              type="text"
              name="lotNo"
              value={formData.lotNo}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CCT</label>
            <input
              type="text"
              name="cct"
              value={formData.cct}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Block No.</label>
            <input
              type="text"
              name="blockNo"
              value={formData.blockNo}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Dated:</label>
            <input
              type="date"
              name="dated"
              value={formData.dated}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Boundaries */}
        <div className="p-4 border border-gray-300">
          <h3 className="text-lg font-semibold mb-4">Boundaries:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">North:</label>
              <input
                type="text"
                name="boundaries.north"
                value={formData.boundaries.north}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">South:</label>
              <input
                type="text"
                name="boundaries.south"
                value={formData.boundaries.south}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">East:</label>
              <input
                type="text"
                name="boundaries.east"
                value={formData.boundaries.east}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">West:</label>
              <input
                type="text"
                name="boundaries.west"
                value={formData.boundaries.west}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="taxable"
                checked={formData.taxable}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm">Taxable</span>
            </label>
          </div>
        </div>

        {/* Description and Property Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-300">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Description:
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Kind:</label>
            <select
              name="actualUse"
              value={formData.actualUse}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Kind</option>
              <option value="LAND">LAND</option>
              <option value="BUILDING">BUILDING</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Actual Use:
            </label>
            <select
              name="classification"
              value={formData.classification}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Use</option>
              <option value="RESIDENTIAL">RESIDENTIAL</option>
              <option value="COMMERCIAL">COMMERCIAL</option>
              <option value="INDUSTRIAL">INDUSTRIAL</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Classification:
            </label>
            <select
              name="areaSize"
              value={formData.areaSize}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Classification</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Area Size:</label>
            <input
              type="text"
              name="assessmentLevel"
              value={formData.assessmentLevel}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Assessment Level:
            </label>
            <input
              type="text"
              name="marketValue"
              value={formData.marketValue}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Market Value:
            </label>
            <input
              type="text"
              name="marketValue"
              value={formData.marketValue}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Assessment Table */}
        <div className="p-4 border border-gray-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Assessment Details</h3>
            <Button
              type="button"
              onClick={addAssessmentRow}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              ADD
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 p-2 text-sm">
                    Description
                  </th>
                  <th className="border border-gray-300 p-2 text-sm">Area</th>
                  <th className="border border-gray-300 p-2 text-sm">
                    Market Value
                  </th>
                  <th className="border border-gray-300 p-2 text-sm">
                    Actual Use
                  </th>
                  <th className="border border-gray-300 p-2 text-sm">
                    Assessment Level
                  </th>
                  <th className="border border-gray-300 p-2 text-sm">
                    Assessment Value
                  </th>
                  <th className="border border-gray-300 p-2 text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {assessmentRows.map((row, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-1">
                      <input
                        type="text"
                        value={row.description}
                        onChange={(e) =>
                          handleAssessmentChange(
                            index,
                            'description',
                            e.target.value
                          )
                        }
                        className="w-full p-1 border-0 focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="border border-gray-300 p-1">
                      <input
                        type="text"
                        value={row.area}
                        onChange={(e) =>
                          handleAssessmentChange(index, 'area', e.target.value)
                        }
                        className="w-full p-1 border-0 focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="border border-gray-300 p-1">
                      <input
                        type="text"
                        value={row.marketValue}
                        onChange={(e) =>
                          handleAssessmentChange(
                            index,
                            'marketValue',
                            e.target.value
                          )
                        }
                        className="w-full p-1 border-0 focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="border border-gray-300 p-1">
                      <input
                        type="text"
                        value={row.actualUse}
                        onChange={(e) =>
                          handleAssessmentChange(
                            index,
                            'actualUse',
                            e.target.value
                          )
                        }
                        className="w-full p-1 border-0 focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="border border-gray-300 p-1">
                      <input
                        type="text"
                        value={row.assessmentLevel}
                        onChange={(e) =>
                          handleAssessmentChange(
                            index,
                            'assessmentLevel',
                            e.target.value
                          )
                        }
                        className="w-full p-1 border-0 focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="border border-gray-300 p-1">
                      <input
                        type="text"
                        value={row.assessmentValue}
                        onChange={(e) =>
                          handleAssessmentChange(
                            index,
                            'assessmentValue',
                            e.target.value
                          )
                        }
                        className="w-full p-1 border-0 focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="border border-gray-300 p-1 text-center">
                      <Button
                        type="button"
                        onClick={() => deleteAssessmentRow(index)}
                        className="bg-red-600 hover:bg-red-700 text-white p-1"
                        disabled={assessmentRows.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-300">
          <div>
            <label className="block text-sm font-medium mb-1">
              This Declaration cancels TD No.
            </label>
            <select
              name="cancelsTdNo"
              value={formData.cancelsTdNo}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select TD No.</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Effectivity of Assessment/Reassessment
            </label>
            <input
              type="date"
              name="effectivity"
              value={formData.effectivity}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Owner:</label>
            <input
              type="text"
              name="ownerPrevious"
              value={formData.ownerPrevious}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Previous Assessed Value:
            </label>
            <input
              type="text"
              name="previousValue"
              value={formData.previousValue}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Footer Sections */}
        <div className="p-4 border border-gray-300">
          <label className="block text-sm font-medium mb-1">
            Amounts in Words:
          </label>
          <textarea
            name="amountsInWords"
            value={formData.amountsInWords}
            onChange={handleInputChange}
            rows="2"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="p-4 border border-gray-300">
          <label className="block text-sm font-medium mb-1 bg-red-100 p-2">
            Memoranda:
          </label>
          <textarea
            name="memoranda"
            value={formData.memoranda}
            onChange={handleInputChange}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" className="px-6 py-2">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Tax Declaration
          </Button>
        </div>
      </div>
    </div>
  );
}
