import { useState } from 'react';
import { FileText, Calendar, MapPin, User, CreditCard } from 'lucide-react';
import FormField from '@/components/common/FormField';
import Button from '@/components/common/Button';

const CommunityTaxForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    year: '2024',
    placeOfIssue: 'Angadanan',
    dateIssued: '21-02-2024',
    certificateNumber: '102',
    surname: 'Baguio',
    firstName: 'Leivan',
    middleName: 'Jake',
    address: 'Washington street, San Antonio, , REGION II (CAGAYAN VALLEY)',
    citizenship: 'Afghan',
    icrNumber: '24132654',
    placeOfBirth: 'Sultan Kudarat',
    civilStatus: 'divorced',
    profession: 'Garbage Collector',
    sex: 'male',
    height: '200.00',
    weight: '50.00',
    dateOfBirth: '31-07-2000',
    basicTax: '5.00',
    grossReceipts: '1,000.00',
    grossReceiptsTax: '1.00',
    salaries: '45,000.00',
    salariesTax: '45.00',
    realProperty: '45,000.00',
    realPropertyTax: '45.00',
    totalTax: '96.00',
    interest: '0.00',
    totalAmountPaid: '96.00',
    remarks: '',
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const citizenshipOptions = [
    { value: 'Afghan', label: 'Afghan' },
    { value: 'Filipino', label: 'Filipino' },
    { value: 'American', label: 'American' },
    { value: 'Other', label: 'Other' },
  ];

  const civilStatusOptions = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' },
  ];

  const sexOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Certificate Header Info */}
        <div className="rounded-lg border bg-white text-card-foreground   bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col space-y-1.5 p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Certificate Information
            </h3>
          </div>
          <div className="p-6 pt-2 ">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FormField
                label="Year"
                name="year"
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <FormField
                label="Place of Issue"
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
          </div>
        </div>

        {/* Personal Information */}
        <div className="rounded-lg border bg-white text-card-foreground  bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col space-y-1.5 p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </h3>
          </div>
          <div className="p-6 pt-2 ">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <FormField
                label="Surname"
                name="surname"
                value={formData.surname}
                onChange={(e) => handleInputChange('surname', e.target.value)}
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <FormField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <FormField
                label="Middle Name"
                name="middleName"
                value={formData.middleName}
                onChange={(e) =>
                  handleInputChange('middleName', e.target.value)
                }
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-6">
              <FormField
                label={
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address
                  </span>
                }
                name="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FormField
                  label="Citizenship"
                  name="citizenship"
                  type="select"
                  value={formData.citizenship}
                  onChange={(e) =>
                    handleInputChange('citizenship', e.target.value)
                  }
                  options={citizenshipOptions}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <FormField
                  label="ICR No."
                  name="icrNumber"
                  value={formData.icrNumber}
                  onChange={(e) =>
                    handleInputChange('icrNumber', e.target.value)
                  }
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <FormField
                  label="Place of Birth"
                  name="placeOfBirth"
                  value={formData.placeOfBirth}
                  onChange={(e) =>
                    handleInputChange('placeOfBirth', e.target.value)
                  }
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <FormField
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange('dateOfBirth', e.target.value)
                  }
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FormField
                  label="Civil Status"
                  name="civilStatus"
                  type="radio"
                  value={formData.civilStatus}
                  onChange={(e) =>
                    handleInputChange('civilStatus', e.target.value)
                  }
                  options={civilStatusOptions}
                />
                <FormField
                  label="Profession/Occupation"
                  name="profession"
                  value={formData.profession}
                  onChange={(e) =>
                    handleInputChange('profession', e.target.value)
                  }
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <FormField
                  label="Sex"
                  name="sex"
                  type="radio"
                  value={formData.sex}
                  onChange={(e) => handleInputChange('sex', e.target.value)}
                  options={sexOptions}
                />
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    label="Height (cm)"
                    name="height"
                    value={formData.height}
                    onChange={(e) =>
                      handleInputChange('height', e.target.value)
                    }
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <FormField
                    label="Weight (kg)"
                    name="weight"
                    value={formData.weight}
                    onChange={(e) =>
                      handleInputChange('weight', e.target.value)
                    }
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Information */}
        <div className="rounded-lg border bg-white text-card-foreground  bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col space-y-1.5 p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Tax Assessment
            </h3>
          </div>
          <div className="p-6 pt-2 ">
            <div className="space-y-6">
              {/* Basic Community Tax */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-blue-900 mb-4">
                  A. Basic Community Tax (₱5.00) or Exempted (₱1.00)
                </h3>
                <div className="flex justify-end">
                  <div className="w-32">
                    <FormField
                      name="basicTax"
                      value={formData.basicTax}
                      onChange={(e) =>
                        handleInputChange('basicTax', e.target.value)
                      }
                      className="text-right font-mono border-blue-200 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Community Tax */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-blue-900 mb-4">
                  B. Additional Community Tax (tax not exceed ₱5,000.00)
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center py-3 border-b border-blue-200">
                    <div className="lg:col-span-2">
                      <p className="text-sm text-gray-700">
                        1. Gross receipts or earnings derived from business
                        during the preceding year (₱1.00 for every ₱1,000)
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

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center py-3 border-b border-blue-200">
                    <div className="lg:col-span-2">
                      <p className="text-sm text-gray-700">
                        2. Salaries or gross receipt or earnings derived from
                        exercise of profession or pursuit of any occupation
                        (₱1.00 for every ₱1,000)
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <FormField
                        name="salaries"
                        value={formData.salaries}
                        onChange={(e) =>
                          handleInputChange('salaries', e.target.value)
                        }
                        className="text-right font-mono border-blue-200 focus:border-blue-500"
                        placeholder="Amount"
                      />
                      <FormField
                        name="salariesTax"
                        value={formData.salariesTax}
                        onChange={(e) =>
                          handleInputChange('salariesTax', e.target.value)
                        }
                        className="w-24 text-right font-mono border-blue-200 focus:border-blue-500"
                        placeholder="Tax"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center py-3 border-b border-blue-200">
                    <div className="lg:col-span-2">
                      <p className="text-sm text-gray-700">
                        3. Income from real property (₱1.00 for every ₱1,000)
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <FormField
                        name="realProperty"
                        value={formData.realProperty}
                        onChange={(e) =>
                          handleInputChange('realProperty', e.target.value)
                        }
                        className="text-right font-mono border-blue-200 focus:border-blue-500"
                        placeholder="Amount"
                      />
                      <FormField
                        name="realPropertyTax"
                        value={formData.realPropertyTax}
                        onChange={(e) =>
                          handleInputChange('realPropertyTax', e.target.value)
                        }
                        className="w-24 text-right font-mono border-blue-200 focus:border-blue-500"
                        placeholder="Tax"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Section - Total and Interest */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="font-medium block">Total</label>
                      <FormField
                        name="totalTax"
                        value={formData.totalTax}
                        onChange={(e) =>
                          handleInputChange('totalTax', e.target.value)
                        }
                        className="w-full text-right font-mono bg-white/20 border-white/30 text-white placeholder-white/70 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-medium block">Interest %</label>
                      <FormField
                        name="interest"
                        value={formData.interest}
                        onChange={(e) =>
                          handleInputChange('interest', e.target.value)
                        }
                        className="w-full text-right font-mono bg-white/20 border-white/30 text-white placeholder-white/70 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                    </div>
                  </div>

                  {/* Middle Section - Total Amount Paid */}
                  <div className="space-y-2">
                    <label className="font-bold text-lg block">
                      Total Amount Paid
                    </label>
                    <FormField
                      name="totalAmountPaid"
                      value={formData.totalAmountPaid}
                      onChange={(e) =>
                        handleInputChange('totalAmountPaid', e.target.value)
                      }
                      className="w-full text-right font-mono bg-white/20 border-white/30 text-white placeholder-white/70 font-bold text-lg px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>

                  {/* Right Section - In Words */}
                  <div className="flex items-end md:items-center justify-center md:justify-end">
                    <div className="text-center md:text-right">
                      <p className="text-sm text-white/80 mb-1">(in words)</p>
                      <p className="font-bold text-lg bg-white/10 px-3 py-2 rounded-lg inline-block w-full md:w-auto">
                        NINETY-SIX PESOS
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
          <button type="button" onClick={onCancel} className="btn btn-outline">
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

export default CommunityTaxForm;
