import { useState } from "react";
import { PlusIcon, EyeIcon, PencilIcon } from "@heroicons/react/24/outline";
import DataTable from "@/components/common/DataTable";
import Modal from "@/components/common/Modal";
import FormField from "@/components/common/FormField";

function BusinessPermitPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPermit, setCurrentPermit] = useState(null);

  // Mock data for table
  const permits = [
    {
      id: 1,
      permitNumber: "BP-2024-01-0001",
      businessName: "ABC Store",
      ownerName: "John Smith",
      businessType: "Retail",
      address: "123 Main St.",
      status: "Active",
      issueDate: "2024-01-15",
      expiryDate: "2024-12-31",
    },
    {
      id: 2,
      permitNumber: "BP-2024-01-0002",
      businessName: "XYZ Restaurant",
      ownerName: "Jane Doe",
      businessType: "Food Service",
      address: "456 Market St.",
      status: "Pending",
      issueDate: null,
      expiryDate: null,
    },
  ];

  // Table columns
  const columns = [
    {
      key: "permitNumber",
      header: "Permit No.",
      sortable: true,
      className: "font-medium text-neutral-900",
    },
    {
      key: "businessName",
      header: "Business Name",
      sortable: true,
    },
    {
      key: "ownerName",
      header: "Owner",
      sortable: true,
    },
    {
      key: "businessType",
      header: "Type",
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (value) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            value === "Active"
              ? "bg-success-100 text-success-800"
              : value === "Pending"
              ? "bg-warning-100 text-warning-800"
              : "bg-neutral-100 text-neutral-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "issueDate",
      header: "Issue Date",
      sortable: true,
      render: (value) => (value ? new Date(value).toLocaleDateString() : "-"),
    },
    {
      key: "expiryDate",
      header: "Expiry Date",
      sortable: true,
      render: (value) => (value ? new Date(value).toLocaleDateString() : "-"),
    },
  ];

  // Actions for table rows
  const actions = [
    {
      icon: EyeIcon,
      title: "View",
      onClick: (permit) => handleViewPermit(permit),
      className:
        "text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50",
    },
    {
      icon: PencilIcon,
      title: "Edit",
      onClick: (permit) => handleEditPermit(permit),
      className:
        "text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50",
    },
  ];

  const handleCreatePermit = () => {
    setCurrentPermit(null);
    setIsModalOpen(true);
  };

  const handleViewPermit = (permit) => {
    setCurrentPermit(permit);
    setIsModalOpen(true);
  };

  const handleEditPermit = (permit) => {
    setCurrentPermit(permit);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="page-header">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Business Permits
            </h1>
            <p className="text-gray-600">
              Manage business permits and licenses
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreatePermit}
            className="w-full sm:w-auto btn btn-primary flex items-center justify-center px-4 py-2 text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Permit
          </button>
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={permits}
          actions={actions}
          pagination={true}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentPermit ? "Edit Business Permit" : "New Business Permit"}
        size="xl"
      >
        <div className="p-6 space-y-6">
          {/* Application Details Section */}
          <div className="border-b border-neutral-200 pb-4">
            <h3 className="text-lg font-medium text-neutral-900 mb-4">
              Application Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Application Type"
                name="applicationType"
                type="radio"
                options={[
                  { value: "New", label: "New" },
                  { value: "Renewal", label: "Renewal" },
                ]}
                required
              />

              <FormField
                label="Mode of Payment"
                name="paymentMode"
                type="radio"
                options={[
                  { value: "Annually", label: "Annually" },
                  { value: "Semi-Annually", label: "Semi-Annually" },
                  { value: "Quarterly", label: "Quarterly" },
                ]}
                required
              />

              <FormField
                label="Date of Application"
                name="applicationDate"
                type="date"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormField
                label="DTI/SEC/CDA Registration No."
                name="registrationNumber"
                type="text"
                placeholder="Enter registration number"
              />

              <FormField
                label="DTI/SEC/CDA Registration Date"
                name="registrationDate"
                type="date"
              />
            </div>
          </div>

          {/* Business Information Section */}
          <div className="border-b border-neutral-200 pb-4">
            <h3 className="text-lg font-medium text-neutral-900 mb-4">
              Business Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Type of Business"
                name="businessType"
                type="radio"
                options={[
                  { value: "Single", label: "Single" },
                  { value: "Partnership", label: "Partnership" },
                  { value: "Corporation", label: "Corporation" },
                  { value: "Cooperative", label: "Cooperative" },
                ]}
                required
              />

              <FormField
                label="Tax Incentive from Government"
                name="taxIncentive"
                type="radio"
                options={[
                  { value: "No", label: "No" },
                  { value: "Yes", label: "Yes" },
                ]}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormField
                label="Business Name"
                name="businessName"
                type="text"
                required
                placeholder="Enter business name"
              />

              <FormField
                label="Trade Name/Franchise"
                name="tradeName"
                type="text"
                placeholder="Enter trade name or franchise"
              />
            </div>
          </div>

          {/* Owner Information Section */}
          <div className="border-b border-neutral-200 pb-4">
            <h3 className="text-lg font-medium text-neutral-900 mb-4">
              Owner/Registrant Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Last Name"
                name="ownerLastName"
                type="text"
                required
                placeholder="Enter last name"
              />

              <FormField
                label="First Name"
                name="ownerFirstName"
                type="text"
                required
                placeholder="Enter first name"
              />

              <FormField
                label="Middle Name"
                name="ownerMiddleName"
                type="text"
                placeholder="Enter middle name"
              />
            </div>
          </div>

          {/* Business Address Section */}
          <div className="border-b border-neutral-200 pb-4">
            <h3 className="text-lg font-medium text-neutral-900 mb-4">
              Business Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                label="Region"
                name="businessRegion"
                type="select"
                required
                options={[
                  {
                    value: "REGION I (ILOCOS REGION)",
                    label: "Region I (Ilocos Region)",
                  },
                  {
                    value: "REGION II (CAGAYAN VALLEY)",
                    label: "Region II (Cagayan Valley)",
                  },
                  { value: "NCR", label: "National Capital Region" },
                ]}
              />

              <FormField
                label="Province"
                name="businessProvince"
                type="select"
                required
                options={[
                  { value: "ILOCOS NORTE", label: "Ilocos Norte" },
                  { value: "ILOCOS SUR", label: "Ilocos Sur" },
                  { value: "LA UNION", label: "La Union" },
                ]}
              />

              <FormField
                label="Municipality"
                name="businessMunicipality"
                type="select"
                required
                options={[
                  { value: "ADAMS", label: "Adams" },
                  { value: "BACARRA", label: "Bacarra" },
                  { value: "BADOC", label: "Badoc" },
                ]}
              />

              <FormField
                label="Barangay"
                name="businessBarangay"
                type="select"
                required
                options={[
                  { value: "San Antonio", label: "San Antonio" },
                  { value: "San Jose", label: "San Jose" },
                  { value: "San Pedro", label: "San Pedro" },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormField
                label="Street Address"
                name="businessStreetAddress"
                type="text"
                required
                placeholder="Enter street address"
              />

              <FormField
                label="Postal Code"
                name="businessPostalCode"
                type="text"
                placeholder="Enter postal code"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormField
                label="Telephone No."
                name="businessTelephone"
                type="text"
                placeholder="Enter telephone number"
              />

              <FormField
                label="Mobile No."
                name="businessMobile"
                type="text"
                placeholder="Enter mobile number"
              />
            </div>

            <FormField
              label="Email Address"
              name="businessEmail"
              type="email"
              placeholder="Enter email address"
              className="mt-4"
            />
          </div>

          {/* Owner Address Section */}
          <div className="border-b border-neutral-200 pb-4">
            <h3 className="text-lg font-medium text-neutral-900 mb-4">
              Owner's Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                label="Region"
                name="ownerRegion"
                type="select"
                options={[
                  {
                    value: "REGION I (ILOCOS REGION)",
                    label: "Region I (Ilocos Region)",
                  },
                  {
                    value: "REGION II (CAGAYAN VALLEY)",
                    label: "Region II (Cagayan Valley)",
                  },
                  { value: "NCR", label: "National Capital Region" },
                ]}
              />

              <FormField
                label="Municipality"
                name="ownerMunicipality"
                type="select"
                options={[
                  { value: "BASCO (Capital)", label: "Basco (Capital)" },
                  { value: "ITBAYAT", label: "Itbayat" },
                  { value: "IVANA", label: "Ivana" },
                ]}
              />

              <FormField
                label="Barangay"
                name="ownerBarangay"
                type="select"
                options={[
                  { value: "San Antonio", label: "San Antonio" },
                  { value: "San Jose", label: "San Jose" },
                  { value: "San Pedro", label: "San Pedro" },
                ]}
              />

              <FormField
                label="Street Address"
                name="ownerStreetAddress"
                type="text"
                placeholder="Enter street address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormField
                label="Postal Code"
                name="ownerPostalCode"
                type="text"
                placeholder="Enter postal code"
              />

              <FormField
                label="Email Address"
                name="ownerEmail"
                type="email"
                placeholder="Enter email address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormField
                label="Telephone No."
                name="ownerTelephone"
                type="text"
                placeholder="Enter telephone number"
              />

              <FormField
                label="Mobile No."
                name="ownerMobile"
                type="text"
                placeholder="Enter mobile number"
              />
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="border-b border-neutral-200 pb-4">
            <h3 className="text-lg font-medium text-neutral-900 mb-4">
              Emergency Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Contact Person Name"
                name="emergencyContactName"
                type="text"
                placeholder="Enter contact person name"
              />

              <FormField
                label="Contact Person Email"
                name="emergencyContactEmail"
                type="email"
                placeholder="Enter contact person email"
              />
            </div>

            <FormField
              label="Telephone/Mobile No."
              name="emergencyContactPhone"
              type="text"
              placeholder="Enter telephone/mobile number"
              className="mt-4"
            />
          </div>

          {/* Business Details Section */}
          <div className="border-b border-neutral-200 pb-4">
            <h3 className="text-lg font-medium text-neutral-900 mb-4">
              Business Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Business Area (sq.m.)"
                name="businessArea"
                type="number"
                placeholder="Enter area in square meters"
              />

              <FormField
                label="Total Employees in Establishment"
                name="totalEmployees"
                type="number"
                placeholder="Enter total employees"
              />

              <FormField
                label="No. of Employees Residing with LGU"
                name="localEmployees"
                type="number"
                placeholder="Enter local employees"
              />
            </div>
          </div>

          {/* Rental Information Section */}
          <div className="border-b border-neutral-200 pb-4">
            <h3 className="text-lg font-medium text-neutral-900 mb-4">
              Rental Information
            </h3>
            <p className="text-sm text-neutral-600 mb-4">
              Note: Fill up Only if Business Place is Rented
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Lessor's Full Name"
                name="lessorName"
                type="text"
                placeholder="Enter lessor's full name"
              />

              <FormField
                label="Monthly Rental"
                name="monthlyRental"
                type="number"
                placeholder="Enter monthly rental amount"
              />
            </div>

            <FormField
              label="Lessor's Full Address"
              name="lessorAddress"
              type="textarea"
              placeholder="Enter lessor's complete address"
              rows={2}
              className="mt-4"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormField
                label="Lessor's Telephone/Mobile No."
                name="lessorPhone"
                type="text"
                placeholder="Enter lessor's phone number"
              />

              <FormField
                label="Lessor's Email Address"
                name="lessorEmail"
                type="email"
                placeholder="Enter lessor's email address"
              />
            </div>
          </div>

          {/* Status and Dates Section */}
          <div>
            <h3 className="text-lg font-medium text-neutral-900 mb-4">
              Permit Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Status"
                name="status"
                type="select"
                required
                options={[
                  { value: "Active", label: "Active" },
                  { value: "Pending", label: "Pending" },
                  { value: "Expired", label: "Expired" },
                ]}
              />

              <FormField label="Issue Date" name="issueDate" type="date" />

              <FormField label="Expiry Date" name="expiryDate" type="date" />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {currentPermit ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default BusinessPermitPage;
