import React, { useState } from "react";
import Modal from "@/components/common/Modal";
import FormField from "@/components/common/FormField"; // assuming reusable field
import { Pencil, Trash2, PlusCircle } from "lucide-react";

const sampleProjects = [
  {
    title: "Project A",
    type: "Type A",
    description: "This is Project A.",
    startDate: "2024-08-30",
    endDate: "2024-12-25",
  },
  {
    title: "Project B",
    type: "Type B",
    description: "This is Project B.",
    startDate: "2024-08-30",
    endDate: "2024-12-31",
  },
];

const ProjectDetails = () => {
  const [projects, setProjects] = useState(sampleProjects);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Project Details</h2>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <PlusCircle size={18} /> Add Project
          </button>
        </div>

        <div className="overflow-auto shadow rounded-lg bg-white">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Start Date</th>
                <th className="px-4 py-2">End Date</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{project.title}</td>
                  <td className="px-4 py-2">{project.type}</td>
                  <td className="px-4 py-2">{project.description}</td>
                  <td className="px-4 py-2">{project.startDate}</td>
                  <td className="px-4 py-2">{project.endDate}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={16} />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProject ? "Edit Project" : "New Project"}
        size="lg"
      >
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Project Title"
              name="projectTitle"
              type="text"
              defaultValue={selectedProject?.title}
              placeholder="Enter project title"
            />
            <FormField
              label="Project Type"
              name="projectType"
              type="select"
              options={[
                { value: "Type A", label: "Type A" },
                { value: "Type B", label: "Type B" },
              ]}
              defaultValue={selectedProject?.type}
            />
          </div>

          <FormField
            label="Description"
            name="description"
            type="textarea"
            defaultValue={selectedProject?.description}
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Start Date"
              name="startDate"
              type="date"
              defaultValue={selectedProject?.startDate}
            />
            <FormField
              label="End Date"
              name="endDate"
              type="date"
              defaultValue={selectedProject?.endDate}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {selectedProject ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectDetails;
