// src/components/RecentlyViewed.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const RecentlyViewed = ({ listings }) => {
    const navigate = useNavigate();
    const [recentlyViewed, setRecentlyViewed] = useState([]);

    useEffect(() => {
        // Simulate fetching recently viewed items (replace with your actual logic)
        // For now, we'll just take the last few listings as "recently viewed"
        const lastFew = listings.slice(-4); // Adjust the number as needed
        setRecentlyViewed(lastFew);
    }, [listings]);

    if (recentlyViewed.length === 0) {
        return null; // Don't show the section if there are no recently viewed items
    }

    return (
        <section className="py-12 bg-white">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 px-4">
                    Recently viewed
                </h2>
                <div className="overflow-x-auto px-4">
                    <div className="flex space-x-6">
                        {recentlyViewed.map((stay) => (
                            <motion.div
                                key={stay.id}
                                className="min-w-[280px] bg-gray-100 rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg"
                                whileHover={{ scale: 1.02 }}
                                onClick={() => navigate(`/stay/${stay.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <img
                                    src={process.env.PUBLIC_URL + "/" + stay.image}
                                    alt={stay.name}
                                    className="w-full h-32 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                                        {stay.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm truncate">
                                        {stay.address}
                                    </p>
                                    <p className="mt-2 font-bold text-green-600 text-sm">
                                        ₹{stay.price}/day
                                    </p>
                                    {/* You can add more details here if needed */}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
                {/* Optional: Add navigation arrows if you want more control over scrolling */}
                {/* <div className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 cursor-pointer">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </div>
                <div className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 cursor-pointer">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </div> */}
            </div>
        </section>
    );
};

export default RecentlyViewed;