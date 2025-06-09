import React, { useState } from "react";
import Modal from "@/components/common/Modal";
import FormField from "@/components/common/FormField";
import { Button } from "@/components/common/Button";
import { Trash2, Pencil, Plus } from "lucide-react";

const sampleData = [
  {
    tdNo: "1231321123",
    propertyId: "10010101",
    owner: "Leivan, Jake",
    ownerTIN: "101654512",
    ownerAddress: "aweaw",
    ownerPhone: "101010101",
    beneficialUser: "sherwin, public",
    beneficialTIN: "1010101010",
    beneficialAddress: "sdadsada",
    // You can continue with more fields here as needed
  },
];

export default function TaxDeclarationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [records, setRecords] = useState(sampleData);

  const handleAdd = () => {
    setSelectedRecord(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = (tdNo) => {
    const updated = records.filter((r) => r.tdNo !== tdNo);
    setRecords(updated);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Tax Declaration</h1>
        <div className="space-x-2">
          <Button onClick={handleAdd} className="bg-blue-600 text-white">
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
      </div>

      <table className="w-full table-auto border text-sm">
        <thead className="bg-neutral-100">
          <tr>
            <th className="border p-2">T.D. No</th>
            <th className="border p-2">Property ID</th>
            <th className="border p-2">Owner</th>
            <th className="border p-2">Owner TIN</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Beneficial User</th>
            <th className="border p-2">Beneficial TIN</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, idx) => (
            <tr key={idx} className="odd:bg-white even:bg-neutral-50">
              <td className="border p-2">{record.tdNo}</td>
              <td className="border p-2">{record.propertyId}</td>
              <td className="border p-2">{record.owner}</td>
              <td className="border p-2">{record.ownerTIN}</td>
              <td className="border p-2">{record.ownerPhone}</td>
              <td className="border p-2">{record.beneficialUser}</td>
              <td className="border p-2">{record.beneficialTIN}</td>
              <td className="border p-2 space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(record)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(record.tdNo)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedRecord ? "Edit Tax Declaration" : "New Tax Declaration"}
        size="xl"
      >
        <form className="space-y-4 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="TD No"
              name="tdNo"
              type="text"
              defaultValue={selectedRecord?.tdNo}
            />
            <FormField
              label="Property Identification No."
              name="propertyId"
              type="text"
              defaultValue={selectedRecord?.propertyId}
            />
            <FormField
              label="Owner"
              name="owner"
              type="text"
              defaultValue={selectedRecord?.owner}
            />
            <FormField
              label="TIN"
              name="ownerTIN"
              type="text"
              defaultValue={selectedRecord?.ownerTIN}
            />
            <FormField
              label="Owner Phone"
              name="ownerPhone"
              type="text"
              defaultValue={selectedRecord?.ownerPhone}
            />
            <FormField
              label="Owner Address"
              name="ownerAddress"
              type="text"
              defaultValue={selectedRecord?.ownerAddress}
            />
            <FormField
              label="Beneficial User"
              name="beneficialUser"
              type="text"
              defaultValue={selectedRecord?.beneficialUser}
            />
            <FormField
              label="Beneficial TIN"
              name="beneficialTIN"
              type="text"
              defaultValue={selectedRecord?.beneficialTIN}
            />
            <FormField
              label="Beneficial Address"
              name="beneficialAddress"
              type="text"
              defaultValue={selectedRecord?.beneficialAddress}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="btn-primary">
              {selectedRecord ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
