// src/pages/Offers.jsx
import React from "react";

export default function Offers() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Latest Offers</h1>
      <p className="text-center text-gray-600">
        Check out our special offers and discounts on stays.
      </p>
      <div className="mt-8 flex flex-col items-center">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-xl font-bold text-green-600">Offer Title</h2>
          <p className="text-gray-600 mt-2">Details about the offer.</p>
        </div>
      </div>
    </div>
  );
}