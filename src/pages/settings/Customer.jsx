import React, { useState } from "react";
import Modal from "@/components/common/Modal";
import FormField from "@/components/common/FormField";
import { Pencil, Trash2, UserPlus } from "lucide-react";
import Button from "../../components/common/Button";

const Customer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);

  const handleEdit = (customer) => {
    setCurrentCustomer(customer);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentCustomer(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-xl font-bold">Customer Management</h2>
        <Button
          onClick={handleAdd}
          className="btn btn-primary flex items-center gap-2"
        >
          <UserPlus size={16} /> Add
        </Button>
      </div>

      <div className="overflow-auto border rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-neutral-200">
            <tr>
              <th className="px-3 py-2">Code</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">TIN</th>
              <th className="px-3 py-2">Payment Terms</th>
              <th className="px-3 py-2">Payment Method</th>
              <th className="px-3 py-2">Tax Code</th>
              <th className="px-3 py-2">Industry Type</th>
              <th className="px-3 py-2">ZIP Code</th>
              <th className="px-3 py-2">Place of Incorporation</th>
              <th className="px-3 py-2">Kind of Organization</th>
              <th className="px-3 py-2">Date of Registration</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Sample Row */}
            <tr className="border-t">
              <td className="px-3 py-2">JST</td>
              <td className="px-3 py-2">JST Technology</td>
              <td className="px-3 py-2">321-212-213-0000</td>
              <td className="px-3 py-2">N/A - Not Applicable</td>
              <td className="px-3 py-2">Cash</td>
              <td className="px-3 py-2">NOT</td>
              <td className="px-3 py-2">IT Consulting</td>
              <td className="px-3 py-2">1200</td>
              <td className="px-3 py-2">JST MAKATI</td>
              <td className="px-3 py-2">Corporation</td>
              <td className="px-3 py-2">15-04-2000</td>
              <td className="px-3 py-2 space-x-2">
                <button onClick={() => handleEdit({})}>
                  <Pencil size={16} />
                </button>
                <button>
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentCustomer ? "Edit Customer" : "New Customer"}
        size="xl"
      >
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Code" name="code" type="text" />
            <FormField label="TIN" name="tin" type="text" />
            <FormField label="Phone Number" name="phone" type="text" />
            <FormField label="Mobile Number" name="mobile" type="text" />
            <FormField label="Name" name="name" type="text" />
            <FormField label="Email" name="email" type="email" />
            <FormField label="Website" name="website" type="text" />
            <FormField
              label="Region"
              name="region"
              type="select"
              options={[
                { value: "REGION VI", label: "REGION VI (WESTERN VISAYAS)" },
              ]}
            />
            <FormField
              label="Province"
              name="province"
              type="select"
              options={[{ value: "AKLAN", label: "AKLAN" }]}
            />
            <FormField
              label="Municipality"
              name="municipality"
              type="select"
              options={[{ value: "ALTAVAS", label: "ALTAVAS" }]}
            />
            <FormField
              label="Barangay"
              name="barangay"
              type="select"
              options={[{ value: "Cabangila", label: "Cabangila" }]}
            />
            <FormField label="Zip Code" name="zipCode" type="text" />
            <FormField
              label="Street Address"
              name="street"
              type="textarea"
              rows={2}
            />
            <FormField label="Revenue District Office" name="rdo" type="text" />
            <FormField
              label="Place of Incorporation"
              name="placeOfIncorp"
              type="text"
            />
            <FormField
              label="Tax Code"
              name="taxCode"
              type="select"
              options={[{ value: "NOT", label: "NOT" }]}
            />
            <FormField
              label="Industry"
              name="industry"
              type="select"
              options={[{ value: "IT Consulting", label: "IT Consulting" }]}
            />
            <FormField
              label="Payment Terms"
              name="paymentTerms"
              type="select"
              options={[
                {
                  value: "N/A - Not Applicable",
                  label: "N/A - Not Applicable",
                },
              ]}
            />
            <FormField
              label="Mode of Payment"
              name="paymentMode"
              type="select"
              options={[{ value: "Cash", label: "Cash" }]}
            />
            <FormField
              label="Contact Person"
              name="contactPerson"
              type="text"
            />
            <FormField
              label="Date of Registration / Incorporation"
              name="registrationDate"
              type="date"
            />
          </div>

          <div className="pt-2">
            <label className="font-medium">Kind of Organization</label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-2">
                <input type="radio" name="orgType" value="Association" />{" "}
                Association
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="orgType" value="Partnership" />{" "}
                Partnership
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="orgType" value="Corporation" />{" "}
                Corporation
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={() => setIsModalOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button className="btn btn-primary">
              {currentCustomer ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Customer;
