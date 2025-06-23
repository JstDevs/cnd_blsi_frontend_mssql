import { useState } from "react";
import FormField from "@/components/common/FormField";
import Modal from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { Trash2, Pencil, Plus } from "lucide-react";
const dummyData = [
  {
    year: "2025",
    classification: "",
    location: "",
    unit: "Square Meter",
    actualUse: "construction",
    subClass: "1",
    price: "1.00",
  },
];

export default function BaseUnitValue() {
  const [data, setData] = useState(dummyData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const openModal = (record = null) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const deleteRecord = (index) => {
    const updated = [...data];
    updated.splice(index, 1);
    setData(updated);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Base Unit Value</h2>
        <div className="space-x-2">
          <Button
            className="bg-blue-600 text-white"
            onClick={() => openModal()}
          >
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border">General Revision Year</th>
              <th className="px-4 py-2 border">Classification</th>
              <th className="px-4 py-2 border">Location</th>
              <th className="px-4 py-2 border">Unit</th>
              <th className="px-4 py-2 border">Actual Use</th>
              <th className="px-4 py-2 border">Sub Classification</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((record, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border">{record.year}</td>
                <td className="px-4 py-2 border">{record.classification}</td>
                <td className="px-4 py-2 border">{record.location}</td>
                <td className="px-4 py-2 border">{record.unit}</td>
                <td className="px-4 py-2 border">{record.actualUse}</td>
                <td className="px-4 py-2 border">{record.subClass}</td>
                <td className="px-4 py-2 border">{record.price}</td>
                
                <td className="px-4 py-2 border">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openModal(record)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteRecord(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedRecord ? "Edit Unit Value" : "Add Unit Value"}
        size="lg"
      >
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="General Revision Year"
              name="year"
              type="text"
              defaultValue={selectedRecord?.year}
              placeholder="Enter year"
            />
            <FormField
              label="Classification"
              name="classification"
              type="text"
              defaultValue={selectedRecord?.classification}
              placeholder="Enter classification"
            />
            <FormField
              label="Location"
              name="location"
              type="text"
              defaultValue={selectedRecord?.location}
              placeholder="Enter location"
            />
            <FormField
              label="Unit"
              name="unit"
              type="text"
              defaultValue={selectedRecord?.unit}
              placeholder="e.g., Square Meter"
            />
            <FormField
              label="Actual Use"
              name="actualUse"
              type="text"
              defaultValue={selectedRecord?.actualUse}
              placeholder="e.g., construction"
            />
            <FormField
              label="Sub Classification"
              name="subClass"
              type="text"
              defaultValue={selectedRecord?.subClass}
            />
            <FormField
              label="Price"
              name="price"
              type="number"
              defaultValue={selectedRecord?.price}
              step="0.01"
            />
          </div>
          <div className="pt-4 flex justify-end space-x-2">
            <button
              className="btn btn-outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              {selectedRecord ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
