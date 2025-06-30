// BusinessPermitFormFields.js
import React from 'react';
import FormField from '../../components/common/FormField';

const BusinessPermitFormFields = ({
  formData,
  handleInputChange,
  handleSave,
  onCancel,
  isEdit,
  handleFileUpload,
  handleRemoveAttachment,
}) => {
  return (
    <div className=" sm:p-4 space-y-6">
      {/* Section I - Applicant Session */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          I. Applicant Session
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FormField
            label="Applicant Type"
            name="applicantType"
            type="radio-group"
            options={[
              { value: 'new', label: 'New' },
              { value: 'renewal', label: 'Renewal' },
            ]}
            value={formData.applicantType}
            onChange={(value) => handleInputChange('applicantType', value)}
          />

          <FormField
            label="Mode of Payment"
            name="modeOfPayment"
            type="radio-group"
            options={[
              { value: 'annually', label: 'Annually' },
              { value: 'semi-annually', label: 'Semi-Annually' },
              { value: 'quarterly', label: 'Quarterly' },
            ]}
            value={formData.modeOfPayment}
            onChange={(value) => handleInputChange('modeOfPayment', value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FormField
            label="Date of Application"
            name="dateOfApplication"
            type="date"
            value={formData.dateOfApplication}
            onChange={(value) => handleInputChange('dateOfApplication', value)}
          />

          <FormField
            label="DTI/SEC/CDA Registration No."
            name="dtiSecCdaRegistrationNo"
            type="text"
            value={formData.dtiSecCdaRegistrationNo}
            onChange={(value) =>
              handleInputChange('dtiSecCdaRegistrationNo', value)
            }
            placeholder="Enter registration number"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FormField
            label="TIN No."
            name="tinNo"
            type="text"
            value={formData.tinNo}
            onChange={(value) => handleInputChange('tinNo', value)}
            placeholder="Enter TIN number"
          />

          <FormField
            label="DTI/SEC/CDA Registration Date"
            name="dtiSecCdaRegistrationDate"
            type="date"
            value={formData.dtiSecCdaRegistrationDate}
            onChange={(value) =>
              handleInputChange('dtiSecCdaRegistrationDate', value)
            }
          />
        </div>

        <FormField
          label="Type of Business"
          name="typeOfBusiness"
          type="radio-group"
          options={[
            { value: 'single', label: 'Single' },
            { value: 'partnership', label: 'Partnership' },
            { value: 'corporation', label: 'Corporation' },
            { value: 'cooperative', label: 'Cooperative' },
          ]}
          value={formData.typeOfBusiness}
          onChange={(value) => handleInputChange('typeOfBusiness', value)}
        />

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Amendment</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="From"
              name="amendmentFrom"
              type="radio-group"
              options={[
                { value: 'single', label: 'Single' },
                { value: 'partnership', label: 'Partnership' },
                { value: 'corporation', label: 'Corporation' },
              ]}
              value={formData.amendmentFrom}
              onChange={(value) => handleInputChange('amendmentFrom', value)}
            />

            <FormField
              label="To"
              name="amendmentTo"
              type="radio-group"
              options={[
                { value: 'single', label: 'Single' },
                { value: 'partnership', label: 'Partnership' },
                { value: 'corporation', label: 'Corporation' },
              ]}
              value={formData.amendmentTo}
              onChange={(value) => handleInputChange('amendmentTo', value)}
            />
          </div>
        </div>

        <FormField
          label="Are you enjoying tax incentive from any Government Entity?"
          name="taxIncentiveFromGovEntity"
          type="radio-group"
          options={[
            { value: 'no', label: 'No' },
            { value: 'yes', label: 'Yes' },
          ]}
          value={formData.taxIncentiveFromGovEntity}
          onChange={(value) =>
            handleInputChange('taxIncentiveFromGovEntity', value)
          }
          className="mt-4"
        />
      </div>

      {/* Name of Taxpayer/Registrant */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Name of Taxpayer/Registrant
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <FormField
            label="Last Name"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={(value) => handleInputChange('lastName', value)}
            placeholder="Enter last name"
          />

          <FormField
            label="First Name"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={(value) => handleInputChange('firstName', value)}
            placeholder="Enter first name"
          />

          <FormField
            label="Middle Name"
            name="middleName"
            type="text"
            value={formData.middleName}
            onChange={(value) => handleInputChange('middleName', value)}
            placeholder="Enter middle name"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <FormField
            label="Business Name"
            name="businessName"
            type="text"
            value={formData.businessName}
            onChange={(value) => handleInputChange('businessName', value)}
            placeholder="Enter business name"
          />

          <FormField
            label="Trade Name/Franchise"
            name="tradeNameFranchise"
            type="text"
            value={formData.tradeNameFranchise}
            onChange={(value) => handleInputChange('tradeNameFranchise', value)}
            placeholder="Enter trade name or franchise"
          />
        </div>
      </div>

      {/* Section II - Other Information */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          II. Other Information
        </h3>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Business Address
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <FormField
              label="Region"
              name="businessRegion"
              type="select"
              value={formData.businessRegion}
              onChange={(value) => handleInputChange('businessRegion', value)}
              options={[
                { value: '', label: 'Select Region' },
                {
                  value: 'REGION II (CAGAYAN VALLEY)',
                  label: 'REGION II (CAGAYAN VALLEY)',
                },
                {
                  value: 'REGION I (ILOCOS REGION)',
                  label: 'REGION I (ILOCOS REGION)',
                },
                {
                  value: 'REGION III (CENTRAL LUZON)',
                  label: 'REGION III (CENTRAL LUZON)',
                },
                { value: 'NCR', label: 'NCR' },
              ]}
            />

            <FormField
              label="Province"
              name="businessProvince"
              type="select"
              value={formData.businessProvince}
              onChange={(value) => handleInputChange('businessProvince', value)}
              options={[
                { value: '', label: 'Select Province' },
                { value: 'BATANES', label: 'BATANES' },
                { value: 'CAGAYAN', label: 'CAGAYAN' },
                { value: 'ISABELA', label: 'ISABELA' },
                { value: 'NUEVA VIZCAYA', label: 'NUEVA VIZCAYA' },
              ]}
            />

            <FormField
              label="Municipality"
              name="businessMunicipality"
              type="select"
              value={formData.businessMunicipality}
              onChange={(value) =>
                handleInputChange('businessMunicipality', value)
              }
              options={[
                { value: '', label: 'Select Municipality' },
                { value: 'BASCO (Capital)', label: 'BASCO (Capital)' },
                { value: 'ITBAYAT', label: 'ITBAYAT' },
                { value: 'IVANA', label: 'IVANA' },
                { value: 'MAHATAO', label: 'MAHATAO' },
              ]}
            />

            <FormField
              label="Barangay"
              name="businessBarangay"
              type="select"
              value={formData.businessBarangay}
              onChange={(value) => handleInputChange('businessBarangay', value)}
              options={[
                { value: '', label: 'Select Barangay' },
                { value: 'San Antonio', label: 'San Antonio' },
                { value: 'Kayhuvokan', label: 'Kayhuvokan' },
                { value: 'Nakanmuan', label: 'Nakanmuan' },
                { value: 'Chanarian', label: 'Chanarian' },
              ]}
            />
          </div>

          <FormField
            label="Street Address"
            name="businessStreetAddress"
            type="text"
            value={formData.businessStreetAddress}
            onChange={(value) =>
              handleInputChange('businessStreetAddress', value)
            }
            placeholder="Enter street address"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FormField
            label="Postal Code"
            name="postalCode"
            type="text"
            value={formData.postalCode}
            onChange={(value) => handleInputChange('postalCode', value)}
            placeholder="Enter postal code"
          />

          <FormField
            label="Email Address"
            name="emailAddress"
            type="email"
            value={formData.emailAddress}
            onChange={(value) => handleInputChange('emailAddress', value)}
            placeholder="Enter email address"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <FormField
            label="Telephone No."
            name="telephoneNo"
            type="text"
            value={formData.telephoneNo}
            onChange={(value) => handleInputChange('telephoneNo', value)}
            placeholder="Enter telephone number"
          />

          <FormField
            label="Mobile No."
            name="mobileNo"
            type="text"
            value={formData.mobileNo}
            onChange={(value) => handleInputChange('mobileNo', value)}
            placeholder="Enter mobile number"
          />
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Owner's Address
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <FormField
              label="Street Address"
              name="ownerStreetAddress"
              type="text"
              value={formData.ownerStreetAddress}
              onChange={(value) =>
                handleInputChange('ownerStreetAddress', value)
              }
              placeholder="Street address"
            />

            <FormField
              label="Barangay"
              name="ownerBarangay"
              type="text"
              value={formData.ownerBarangay}
              onChange={(value) => handleInputChange('ownerBarangay', value)}
              placeholder="Barangay"
            />

            <FormField
              label="Municipality"
              name="ownerMunicipality"
              type="text"
              value={formData.ownerMunicipality}
              onChange={(value) =>
                handleInputChange('ownerMunicipality', value)
              }
              placeholder="Municipality"
            />

            <FormField
              label="Region"
              name="ownerRegion"
              type="text"
              value={formData.ownerRegion}
              onChange={(value) => handleInputChange('ownerRegion', value)}
              placeholder="Region"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormField
              label="Postal Code"
              name="ownerPostalCode"
              type="text"
              value={formData.ownerPostalCode}
              onChange={(value) => handleInputChange('ownerPostalCode', value)}
              placeholder="Enter postal code"
            />

            <FormField
              label="Email Address"
              name="ownerEmailAddress"
              type="email"
              value={formData.ownerEmailAddress}
              onChange={(value) =>
                handleInputChange('ownerEmailAddress', value)
              }
              placeholder="Enter email address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormField
              label="Telephone No."
              name="ownerTelephoneNo"
              type="text"
              value={formData.ownerTelephoneNo}
              onChange={(value) => handleInputChange('ownerTelephoneNo', value)}
              placeholder="Enter telephone number"
            />

            <FormField
              label="Mobile No."
              name="ownerMobileNo"
              type="text"
              value={formData.ownerMobileNo}
              onChange={(value) => handleInputChange('ownerMobileNo', value)}
              placeholder="Enter mobile number"
            />
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            In Case of emergency, provide name of contact person
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <FormField
              label="Contact Person"
              name="emergencyContactPerson"
              type="text"
              value={formData.emergencyContactPerson}
              onChange={(value) =>
                handleInputChange('emergencyContactPerson', value)
              }
              placeholder="Enter contact person name"
            />

            <FormField
              label="Telephone/Mobile No."
              name="emergencyContactNumber"
              type="text"
              value={formData.emergencyContactNumber}
              onChange={(value) =>
                handleInputChange('emergencyContactNumber', value)
              }
              placeholder="Enter contact number"
            />

            <FormField
              label="Email Address"
              name="emergencyContactEmail"
              type="email"
              value={formData.emergencyContactEmail}
              onChange={(value) =>
                handleInputChange('emergencyContactEmail', value)
              }
              placeholder="Enter email address"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <FormField
            label="Business Area (in sqm)"
            name="businessArea"
            type="number"
            value={formData.businessArea}
            onChange={(value) => handleInputChange('businessArea', value)}
            placeholder="Enter business area"
          />

          <FormField
            label="Total Employees in Establishment"
            name="totalEmployees"
            type="number"
            value={formData.totalEmployees}
            onChange={(value) => handleInputChange('totalEmployees', value)}
            placeholder="Enter total employees"
          />

          <FormField
            label="No. of Employees Residing with LGLI"
            name="employeesResidingWithLgli"
            type="number"
            value={formData.employeesResidingWithLgli}
            onChange={(value) =>
              handleInputChange('employeesResidingWithLgli', value)
            }
            placeholder="Enter number"
          />
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Note: Fill up Only if Business Place is Rented
          </h4>

          <FormField
            label="Lessor's Full Name"
            name="lessorFullName"
            type="text"
            value={formData.lessorFullName}
            onChange={(value) => handleInputChange('lessorFullName', value)}
            placeholder="Enter lessor's full name"
          />

          <FormField
            label="Lessor's Full Address"
            name="lessorAddress"
            type="text"
            value={formData.lessorAddress}
            onChange={(value) => handleInputChange('lessorAddress', value)}
            placeholder="Enter lessor's address"
            className="mt-4"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <FormField
              label="Lessor's Telephone/Mobile No."
              name="lessorContactNumber"
              type="text"
              value={formData.lessorContactNumber}
              onChange={(value) =>
                handleInputChange('lessorContactNumber', value)
              }
              placeholder="Enter contact number"
            />

            <FormField
              label="Lessor's Email Address"
              name="lessorEmail"
              type="email"
              value={formData.lessorEmail}
              onChange={(value) => handleInputChange('lessorEmail', value)}
              placeholder="Enter email address"
            />
          </div>

          <FormField
            label="Monthly Rental"
            name="monthlyRental"
            type="number"
            value={formData.monthlyRental}
            onChange={(value) => handleInputChange('monthlyRental', value)}
            placeholder="Enter monthly rental amount"
            className="mt-4"
          />
        </div>
      </div>

      {/* Section III - Business Activity */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          III. Business Activity
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField
            label="Line of Business"
            name="lineOfBusiness"
            type="text"
            value={formData.lineOfBusiness}
            onChange={(value) => handleInputChange('lineOfBusiness', value)}
            placeholder="Enter line of business"
          />

          <FormField
            label="No. Units"
            name="numberOfUnits"
            type="number"
            value={formData.numberOfUnits}
            onChange={(value) => handleInputChange('numberOfUnits', value)}
            placeholder="Enter number of units"
          />

          <FormField
            label="Capitalization"
            name="capitalization"
            type="number"
            value={formData.capitalization}
            onChange={(value) => handleInputChange('capitalization', value)}
            placeholder="Enter capitalization"
          />

          <FormField
            label="Gross Sales"
            name="grossSales"
            type="number"
            value={formData.grossSales}
            onChange={(value) => handleInputChange('grossSales', value)}
            placeholder="Enter gross sales"
          />
        </div>
      </div>

      {/* Section IV - Attachments */}
      <div className="pb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          IV. Attachments
        </h3>

        <div className="flex items-center mb-4 gap-4 justify-between">
          <label className="block text-sm font-medium text-gray-700 mr-2">
            Add Attachment
          </label>
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            id="fileUpload"
            multiple
          />
          <button
            type="button"
            onClick={() => document.getElementById('fileUpload').click()}
            className="btn btn-outline"
          >
            Add
          </button>
        </div>

        <div className="space-y-2">
          {formData.attachments && formData.attachments.length > 0 ? (
            formData.attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border rounded"
              >
                <span className="text-sm truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No attachments added</p>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
        <button type="button" onClick={onCancel} className="btn btn-outline">
          Cancel
        </button>
        <button type="button" onClick={handleSave} className="btn btn-primary">
          {isEdit ? 'Update Application' : 'Create Application'}
        </button>
      </div>
    </div>
  );
};

export default BusinessPermitFormFields;
