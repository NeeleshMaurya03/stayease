import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCamera, FaUserCircle, FaHome, FaPhone, FaRupeeSign } from "react-icons/fa";
import { MdMeetingRoom, MdBathtub, MdOutlineDescription } from "react-icons/md";
import { BiBed } from "react-icons/bi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaMapMarkerAlt } from "react-icons/fa";
export default function BecomeHost() {
  const navigate = useNavigate();
  const roomImageRef = useRef(null);
  const profileImageRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    propertyName: "",
    address: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    amenitiesCount: "",
    description: "",
    features: "",
    contactName: "",
    contactPhone: ""
  });

  // Image state
  const [roomImage, setRoomImage] = useState(null);
  const [roomImagePreview, setRoomImagePreview] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  // Validation errors
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Handle file uploads with preview
  const handleFileUpload = (e, setImage, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    const requiredFields = [
      'propertyName', 'address', 'price', 'bedrooms', 
      'bathrooms', 'amenitiesCount', 'description', 
      'features', 'contactName', 'contactPhone'
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    // Numeric fields validation
    const numericFields = ['price', 'bedrooms', 'bathrooms', 'amenitiesCount'];
    numericFields.forEach(field => {
      if (formData[field] && isNaN(formData[field])) {
        newErrors[field] = 'Must be a number';
      }
    });

    // Phone number validation
    if (formData.contactPhone && !/^\d{10}$/.test(formData.contactPhone)) {
      newErrors.contactPhone = 'Invalid phone number (10 digits required)';
    }

    // Image validation
    if (!roomImage) {
      newErrors.roomImage = 'Room image is required';
    }
    if (!profileImage) {
      newErrors.profileImage = 'Profile image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // For demo, we convert file to Object URLs
    const roomImageUrl = roomImagePreview || URL.createObjectURL(roomImage);
    const profileImageUrl = profileImagePreview || URL.createObjectURL(profileImage);

    // Construct the new listing object
    const newListing = {
      name: formData.propertyName,
      address: formData.address,
      price: parseInt(formData.price, 10),
      rentUnit: "month",
      propertyType: "Room",
      bedrooms: parseInt(formData.bedrooms, 10),
      bathrooms: parseInt(formData.bathrooms, 10),
      amenitiesCount: parseInt(formData.amenitiesCount, 10),
      description: formData.description,
      features: formData.features.split(",").map(feat => feat.trim()),
      images: [roomImageUrl],
      contact: {
        name: formData.contactName,
        phone: formData.contactPhone,
        profileImage: profileImageUrl,
      },
      rating: (Math.random() * 1 + 4).toFixed(1), // Random rating for demo
      availableFrom: new Date().toISOString().split('T')[0]
    };

    try {
      const response = await fetch("http://localhost:3001/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newListing),
      });
      
      if (response.ok) {
        alert("Listing added successfully!");
        navigate("/host/success");
      } else {
        throw new Error("Failed to add listing");
      }
    } catch (error) {
      console.error("Error adding listing:", error);
      alert("Error adding listing. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-32 h-32 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="fixed bottom-0 left-0 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      
      {/* Main form container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {/* Form header */}
        <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 text-white">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FaHome className="text-2xl" />
            Become a Host
          </h1>
          <p className="mt-2 opacity-90">List your property and start earning today</p>
        </div>

        {/* Form content */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {/* Room Details Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <MdMeetingRoom />
              Property Details
            </h2>
            
            {/* Property Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="propertyName"
                  value={formData.propertyName}
                  onChange={handleChange}
                  placeholder="Beautiful Apartment in Downtown"
                  className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.propertyName ? 'border-red-500' : 'border-gray-300'}`}
                />
                <FaHome className="absolute left-3 top-3.5 text-gray-400" />
              </div>
              {errors.propertyName && <p className="mt-1 text-sm text-red-600">{errors.propertyName}</p>}
            </div>
            
            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
              <div className="relative">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main St, City, State ZIP"
                  className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                />
                <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400" />
              </div>
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>
            
            {/* Price and Room Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Price (₹)</label>
                <div className="relative">
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="5000"
                    className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <FaRupeeSign className="absolute left-3 top-3.5 text-gray-400" />
                </div>
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Image</label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${errors.roomImage ? 'border-red-500' : 'border-gray-300 hover:border-green-500'}`}
                  onClick={() => roomImageRef.current.click()}
                >
                  <input
                    type="file"
                    ref={roomImageRef}
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, setRoomImage, setRoomImagePreview)}
                    className="hidden"
                  />
                  {roomImagePreview ? (
                    <div className="relative">
                      <img src={roomImagePreview} alt="Room preview" className="w-full h-32 object-cover rounded-md" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <FaCamera className="text-white text-2xl" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <IoMdAddCircleOutline className="mx-auto text-3xl text-gray-400" />
                      <p className="text-sm text-gray-500">Click to upload room image</p>
                    </div>
                  )}
                </div>
                {errors.roomImage && <p className="mt-1 text-sm text-red-600">{errors.roomImage}</p>}
              </div>
            </div>
            
            {/* Bedrooms and Bathrooms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <div className="relative">
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    placeholder="2"
                    className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.bedrooms ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <BiBed className="absolute left-3 top-3.5 text-gray-400" />
                </div>
                {errors.bedrooms && <p className="mt-1 text-sm text-red-600">{errors.bedrooms}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <div className="relative">
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    placeholder="1"
                    className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.bathrooms ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <MdBathtub className="absolute left-3 top-3.5 text-gray-400" />
                </div>
                {errors.bathrooms && <p className="mt-1 text-sm text-red-600">{errors.bathrooms}</p>}
              </div>
            </div>
            
            {/* Amenities Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Amenities</label>
              <input
                type="number"
                name="amenitiesCount"
                value={formData.amenitiesCount}
                onChange={handleChange}
                placeholder="5"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.amenitiesCount ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.amenitiesCount && <p className="mt-1 text-sm text-red-600">{errors.amenitiesCount}</p>}
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <div className="relative">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your property in detail..."
                  rows="4"
                  className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                />
                <MdOutlineDescription className="absolute left-3 top-3.5 text-gray-400" />
              </div>
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
            
            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma separated)</label>
              <textarea
                name="features"
                value={formData.features}
                onChange={handleChange}
                placeholder="Wi-Fi, Air Conditioning, Parking, Laundry, etc."
                rows="2"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.features ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.features && <p className="mt-1 text-sm text-red-600">{errors.features}</p>}
            </div>
          </div>

          {/* Owner Contact Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FaUserCircle />
              Owner Details
            </h2>
            
            {/* Contact Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.contactName ? 'border-red-500' : 'border-gray-300'}`}
                />
                <FaUserCircle className="absolute left-3 top-3.5 text-gray-400" />
              </div>
              {errors.contactName && <p className="mt-1 text-sm text-red-600">{errors.contactName}</p>}
            </div>
            
            {/* Contact Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.contactPhone ? 'border-red-500' : 'border-gray-300'}`}
                />
                <FaPhone className="absolute left-3 top-3.5 text-gray-400" />
              </div>
              {errors.contactPhone && <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>}
            </div>
            
            {/* Profile Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
              <div 
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${errors.profileImage ? 'border-red-500' : 'border-gray-300 hover:border-green-500'}`}
                onClick={() => profileImageRef.current.click()}
              >
                <input
                  type="file"
                  ref={profileImageRef}
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, setProfileImage, setProfileImagePreview)}
                  className="hidden"
                />
                {profileImagePreview ? (
                  <div className="relative mx-auto w-32 h-32">
                    <img src={profileImagePreview} alt="Profile preview" className="w-full h-full object-cover rounded-full" />
                    <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <FaCamera className="text-white text-2xl" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <IoMdAddCircleOutline className="mx-auto text-3xl text-gray-400" />
                    <p className="text-sm text-gray-500">Click to upload profile picture</p>
                  </div>
                )}
              </div>
              {errors.profileImage && <p className="mt-1 text-sm text-red-600">{errors.profileImage}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            Submit Listing
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}