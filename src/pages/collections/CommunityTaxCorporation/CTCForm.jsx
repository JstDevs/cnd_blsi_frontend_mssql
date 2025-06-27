import { useState } from 'react';
import { FileText, Calendar, MapPin, Building, CreditCard } from 'lucide-react';
import FormField from '@/components/common/FormField';
import Button from '@/components/common/Button';

const CTCForm = ({ initialData, readOnly, onBack }) => {
  const [formData, setFormData] = useState({
    year: '2024',
    placeOfIssue: 'San Dionisio',
    dateIssued: '27-06-2025',
    certificateNumber: 'CC12024 9',
    companyFullName: '',
    tin: '',
    addressOfBusiness: '',
    dateOfRegistration: '01-01-1900',
    kindOfOrganization: 'corporation',
    placeOfIncorporation: '',
    kindNatureOfBusiness: '',
    taxableAmount: '0.00',
    communityTaxDue: '0.00',
    basicCommunityTax: '500.00',
    assessedValueRealProperty: '0.00',
    assessedValueTax: '0.00',
    grossReceipts: '0.00',
    grossReceiptsTax: '0.00',
    total: '0.00',
    interest: '12',
    totalAmountPaid: '0.00',
    remarks: '',
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const organizationOptions = [
    { value: 'corporation', label: 'Corporation' },
    { value: 'association', label: 'Association' },
    { value: 'partnership', label: 'Partnership' },
  ];

  return (
    <div className="min-h-screen ">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Certificate Header Info */}
        <div className="rounded-lg border bg-white text-card-foreground shadow-lg  bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col space-y-1.5 p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Certificate Information
            </h3>
          </div>
          <div className="p-2 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <FormField
                label="Year"
                name="year"
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <FormField
                label="Place of Issue (City/Mun/Province)"
                name="placeOfIssue"
                value={formData.placeOfIssue}
                onChange={(e) =>
                  handleInputChange('placeOfIssue', e.target.value)
                }
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <FormField
                label="Date Issued"
                name="dateIssued"
                type="date"
                value={formData.dateIssued}
                onChange={(e) =>
                  handleInputChange('dateIssued', e.target.value)
                }
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <FormField
                label="Certificate No."
                name="certificateNumber"
                value={formData.certificateNumber}
                onChange={(e) =>
                  handleInputChange('certificateNumber', e.target.value)
                }
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 font-bold text-blue-600"
              />
            </div>

            <div className="text-right mb-4">
              <span className="bg-gray-100 px-3 py-1 text-sm font-medium">
                TAXPAYER'S COPY
              </span>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="rounded-lg border bg-white text-card-foreground shadow-lg bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col space-y-1.5 p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <Building className="h-5 w-5" />
              Company Information
            </h3>
          </div>
          <div className="p-2 sm:p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Company's Full Name"
                  name="companyFullName"
                  value={formData.companyFullName}
                  onChange={(e) =>
                    handleInputChange('companyFullName', e.target.value)
                  }
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <FormField
                  label="TIN (if Any)"
                  name="tin"
                  value={formData.tin}
                  onChange={(e) => handleInputChange('tin', e.target.value)}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label={
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address of Principal Place of Business
                    </span>
                  }
                  name="addressOfBusiness"
                  value={formData.addressOfBusiness}
                  onChange={(e) =>
                    handleInputChange('addressOfBusiness', e.target.value)
                  }
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <FormField
                  label="Date of Registration/Incorporation"
                  name="dateOfRegistration"
                  type="date"
                  value={formData.dateOfRegistration}
                  onChange={(e) =>
                    handleInputChange('dateOfRegistration', e.target.value)
                  }
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FormField
                    label="Kind of Organization"
                    name="kindOfOrganization"
                    type="radio"
                    value={formData.kindOfOrganization}
                    onChange={(e) =>
                      handleInputChange('kindOfOrganization', e.target.value)
                    }
                    options={organizationOptions}
                  />
                </div>
                <FormField
                  label="Place of Incorporation"
                  name="placeOfIncorporation"
                  value={formData.placeOfIncorporation}
                  onChange={(e) =>
                    handleInputChange('placeOfIncorporation', e.target.value)
                  }
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <FormField
                label="Kind/Nature of Business"
                name="kindNatureOfBusiness"
                value={formData.kindNatureOfBusiness}
                onChange={(e) =>
                  handleInputChange('kindNatureOfBusiness', e.target.value)
                }
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Taxable Amount"
                  name="taxableAmount"
                  value={formData.taxableAmount}
                  onChange={(e) =>
                    handleInputChange('taxableAmount', e.target.value)
                  }
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-right font-mono"
                />
                <FormField
                  label="Community Tax Due"
                  name="communityTaxDue"
                  value={formData.communityTaxDue}
                  onChange={(e) =>
                    handleInputChange('communityTaxDue', e.target.value)
                  }
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-right font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tax Information */}
        <div className="rounded-lg border bg-white text-card-foreground shadow-lg bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col space-y-1.5 p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Tax Assessment
            </h3>
          </div>
          <div className="p-2 sm:p-6">
            <div className="space-y-6">
              {/* Basic Community Tax */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-blue-900 mb-4">
                  A. BASIC COMMUNITY TAX (₱ 500.00)
                </h3>
                <div className="flex justify-end">
                  <div className="w-32">
                    <FormField
                      name="basicCommunityTax"
                      value={formData.basicCommunityTax}
                      onChange={(e) =>
                        handleInputChange('basicCommunityTax', e.target.value)
                      }
                      className="text-right font-mono border-blue-200 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Community Tax */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-blue-900 mb-4">
                  B. ADDITIONAL COMMUNITY TAX (tax not exceed ₱10,000.00)
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center py-3 border-b border-blue-200">
                    <div className="lg:col-span-2">
                      <p className="text-sm text-gray-700">
                        1. ASSESSED VALUE OF REAL PROPERTY OWNED IN THE
                        PHILIPPINES (₱2.00 FOR EVERY ₱5,000.00)
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <FormField
                        name="assessedValueRealProperty"
                        value={formData.assessedValueRealProperty}
                        onChange={(e) =>
                          handleInputChange(
                            'assessedValueRealProperty',
                            e.target.value
                          )
                        }
                        className="text-right font-mono border-blue-200 focus:border-blue-500"
                        placeholder="Amount"
                      />
                      <FormField
                        name="assessedValueTax"
                        value={formData.assessedValueTax}
                        onChange={(e) =>
                          handleInputChange('assessedValueTax', e.target.value)
                        }
                        className="w-24 text-right font-mono border-blue-200 focus:border-blue-500"
                        placeholder="Tax"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center py-3 border-b border-blue-200">
                    <div className="lg:col-span-2">
                      <p className="text-sm text-gray-700">
                        2. GROSS RECEIPTS, INCLUDING DIVIDENDS/EARNINGS DERIVED
                        FROM BUSINESS IN THE PHIL. DURING THE PRECEDING YEAR
                        (₱2.00 FOR EVERY ₱5,000.00)
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <FormField
                        name="grossReceipts"
                        value={formData.grossReceipts}
                        onChange={(e) =>
                          handleInputChange('grossReceipts', e.target.value)
                        }
                        className="text-right font-mono border-blue-200 focus:border-blue-500"
                        placeholder="Amount"
                      />
                      <FormField
                        name="grossReceiptsTax"
                        value={formData.grossReceiptsTax}
                        onChange={(e) =>
                          handleInputChange('grossReceiptsTax', e.target.value)
                        }
                        className="w-24 text-right font-mono border-blue-200 focus:border-blue-500"
                        placeholder="Tax"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg shadow-lg">
                <div className="flex flex-col md:flex-row md:items-end gap-6">
                  {/* Left Section - Input Fields */}
                  <div className="md:w-1/3 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <label className="font-medium block">TOTAL</label>
                        <FormField
                          name="total"
                          value={formData.total}
                          onChange={(e) =>
                            handleInputChange('total', e.target.value)
                          }
                          className="w-full px-3 py-2 rounded bg-white/20 border border-white/30 text-right font-mono text-white focus:ring-2 focus:ring-white/50 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="font-medium block">INTEREST %</label>
                        <FormField
                          name="interest"
                          value={formData.interest}
                          onChange={(e) =>
                            handleInputChange('interest', e.target.value)
                          }
                          className="w-full px-3 py-2 rounded bg-white/20 border border-white/30 text-right font-mono text-white focus:ring-2 focus:ring-white/50 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Middle Section - Total Amount */}
                  <div className="md:w-1/3">
                    <div className="space-y-2">
                      <label className="font-bold text-lg block">
                        TOTAL AMOUNT PAID
                      </label>
                      <FormField
                        name="totalAmountPaid"
                        value={formData.totalAmountPaid}
                        onChange={(e) =>
                          handleInputChange('totalAmountPaid', e.target.value)
                        }
                        className="w-full px-3 py-2 rounded bg-white/20 border border-white/30 text-right font-mono font-bold text-lg text-white focus:ring-2 focus:ring-white/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Right Section - In Words */}
                  <div className="md:w-1/3 flex justify-center md:justify-end">
                    <div className="text-center md:text-right w-full md:w-auto">
                      <p className="text-sm text-white/80 mb-1">(in words)</p>
                      <p className="font-bold text-lg bg-white/10 px-3 py-2 rounded-lg inline-block w-full md:w-auto">
                        ZERO PESOS
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <FormField
                label="Remarks"
                name="remarks"
                type="textarea"
                value={formData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                className="min-h-24 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter any additional remarks here..."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pb-8">
          <button type="button" onClick={onBack} className="btn btn-outline">
            Close
          </button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white  text-lg rounded-md transition-colors">
            Generate Certificate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CTCForm;
