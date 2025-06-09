import React, { useState } from "react";
import { Building } from "lucide-react";

const LGUMaintenance = () => {
  const [lgu, setLgu] = useState({
    id: "1",
    code: "LGU001",
    name: "Sample LGU",
    tin: "123-456-789",
    rdo: "RDO123",
    staddress: "123 Main Street",
    barangayId: "1",
    municipalityId: "1",
    regionId: "1",
    zipcode: "1234",
    number: "123-4567",
    email: "info@samplelgu.gov.ph",
    website: "www.samplelgu.gov.ph",
  });

  const [image, setImage] = useState("https://picsum.photos/200/300");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(lgu);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLgu(formData);
    setIsEditing(false);
  };

  return (
    <div className="py-6 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-blue-800">LGU Maintenance</h1>
        <p className="mt-2 text-gray-600">
          Manage Local Government Unit information
        </p>
      </header>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <Building className="h-5 w-5 mr-2 text-blue-600" />
            <h2 className="text-lg font-semibold">LGU Information</h2>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors w-full sm:w-auto text-center"
            >
              Edit Information
            </button>
          )}
        </div>

        {/* Card Content */}
        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <img
              src={image}
              className="h-[150px] w-[150px] rounded-full object-cover"
              alt="LGU Logo"
            />
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2 w-auto"
              />
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    LGU Code
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    LGU Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    TIN
                  </label>
                  <input
                    type="text"
                    value={formData.tin}
                    onChange={(e) =>
                      setFormData({ ...formData, tin: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    RDO
                  </label>
                  <input
                    type="text"
                    value={formData.rdo}
                    onChange={(e) =>
                      setFormData({ ...formData, rdo: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.staddress}
                    onChange={(e) =>
                      setFormData({ ...formData, staddress: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    value={formData.zipcode}
                    onChange={(e) =>
                      setFormData({ ...formData, zipcode: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={formData.number}
                    onChange={(e) =>
                      setFormData({ ...formData, number: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Website
                  </label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setFormData(lgu);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-500">LGU Code</h3>
                <p className="mt-1 text-sm text-gray-900">{lgu.code}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-500">LGU Name</h3>
                <p className="mt-1 text-sm text-gray-900">{lgu.name}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-500">TIN</h3>
                <p className="mt-1 text-sm text-gray-900">{lgu.tin}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-500">RDO</h3>
                <p className="mt-1 text-sm text-gray-900">{lgu.rdo}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-500">
                  Street Address
                </h3>
                <p className="mt-1 text-sm text-gray-900">{lgu.staddress}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-500">Zip Code</h3>
                <p className="mt-1 text-sm text-gray-900">{lgu.zipcode}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-500">
                  Contact Number
                </h3>
                <p className="mt-1 text-sm text-gray-900">{lgu.number}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-sm text-gray-900">{lgu.email}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-500">Website</h3>
                <p className="mt-1 text-sm text-gray-900">{lgu.website}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LGUMaintenance;
