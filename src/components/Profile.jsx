import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    // Simulate fetching user data
    const fetchUserData = async () => {
      try {
        // In a real app, you would fetch from your API with the token
        const userData = {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          phone: "+1 (555) 123-4567",
          joinDate: "2023-01-15"
        };
        setUser(userData);
        setFormData({
          name: userData.name,
          email: userData.email,
          phone: userData.phone
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // In a real app, you would send this to your API
    setUser(prev => ({
      ...prev,
      ...formData
    }));
    setEditMode(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-pink-600 p-6 text-center">
            <div className="mx-auto w-24 h-24 rounded-full bg-white flex items-center justify-center mb-4">
              <FaUser className="text-4xl text-pink-600" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-white/90 text-gray-800 px-3 py-1 rounded text-center"
                />
              ) : (
                user.name
              )}
            </h1>
            <p className="text-pink-100 mt-1">
              Member since {new Date(user.joinDate).toLocaleDateString()}
            </p>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <div className="flex justify-end mb-6">
              {editMode ? (
                <div className="space-x-2">
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  <FaEdit /> Edit Profile
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaEnvelope className="text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      {editMode ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="border-b border-gray-300 focus:outline-none focus:border-pink-500"
                        />
                      ) : (
                        <p className="text-gray-900">{user.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaPhone className="text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      {editMode ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="border-b border-gray-300 focus:outline-none focus:border-pink-500"
                        />
                      ) : (
                        <p className="text-gray-900">{user.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h2>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-800"
                >
                  <FaSignOutAlt /> Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}