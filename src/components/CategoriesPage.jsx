// src/pages/CategoriesPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaMedkit, FaBriefcase } from 'react-icons/fa';

const categories = [
  {
    id: 1,
    title: "Student Stays",
    description: "Find quiet, affordable stays near exam centers for students.",
    icon: <FaGraduationCap size={48} className="text-green-600" />,
    route: "/categories/student-stays",
  },
  {
    id: 2,
    title: "Medical Assistance Stays",
    description: "Convenient stays located near hospitals and medical centers.",
    icon: <FaMedkit size={48} className="text-green-600" />,
    route: "/categories/medical-stays",
  },
  {
    id: 3,
    title: "Business Stays",
    description: "Comfortable and modern stays for business travelers near city centers.",
    icon: <FaBriefcase size={48} className="text-green-600" />,
    route: "/categories/business-stays",
  },
];

export default function CategoriesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Explore Categories
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(cat.route)}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
            >
              <div className="flex justify-center mb-4">
                {cat.icon}
              </div>
              <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
                {cat.title}
              </h2>
              <p className="text-gray-600 text-center">
                {cat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}