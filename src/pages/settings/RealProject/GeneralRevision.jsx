import React, { useState } from "react";
import FormField from "@/components/common/FormField";
import Modal from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { Trash2, Pencil, Plus } from "lucide-react";
const GeneralRevision = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRevision, setSelectedRevision] = useState(null);

  const handleEdit = (revision) => {
    setSelectedRevision(revision);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedRevision(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">General Revision</h1>
        <button onClick={handleAdd} className="btn btn-primary">
          Add Revision
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Revision Year</th>
              <th className="px-4 py-2 border">Tax Declaration Code</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Replace with dynamic data */}
            <tr>
              <td className="px-4 py-2 border">2024 H</td>
              <td className="px-4 py-2 border">24</td>
              <td className="px-4 py-2 border">
                <Button size="sm" variant="outline" onClick={() => {}}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => {}}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedRevision ? "Edit General Revision" : "New General Revision"
        }
        size="lg"
      >
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="General Revision Date (Year)"
              name="revisionYear"
              type="text"
              defaultValue={selectedRevision?.revisionYear || ""}
            />
            <FormField
              label="General Revision Code"
              name="revisionCode"
              type="text"
              defaultValue={selectedRevision?.revisionCode || ""}
            />
          </div>

          <FormField
            label="General Revision Tax Declaration Code"
            name="taxDeclarationCode"
            type="text"
            defaultValue={selectedRevision?.taxDeclarationCode || ""}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="City Or Municipality Assessor"
              name="municipalityAssessor"
              type="select"
              options={[
                {
                  value: "Caballero, Joven",
                  label: "Curimao, Caballero, Joven",
                },
              ]}
            />

            <FormField
              label="Assistant City Or Municipality Assessor"
              name="assistantMunicipalityAssessor"
              type="select"
              options={[
                { value: "Elopre, Clark", label: "Entac, Elopre, Clark" },
              ]}
            />

            <FormField
              label="Provincial Assessor"
              name="provincialAssessor"
              type="select"
              options={[
                {
                  value: "Aruscaldo, Vincent",
                  label: "Azupardo, Aruscaldo, Vincent",
                },
              ]}
            />

            <FormField
              label="Assistant Provincial Assessor"
              name="assistantProvincialAssessor"
              type="select"
              options={[
                { value: "Orquin, Melvin", label: "Alvarez, Orquin, Melvin" },
              ]}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {selectedRevision ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GeneralRevision;
