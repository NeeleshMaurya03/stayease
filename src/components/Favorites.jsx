import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaTrash, FaMapMarkerAlt, FaRupeeSign, FaSadTear } from "react-icons/fa";
import { MdOutlineNoPhotography } from "react-icons/md";

export default function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load favorites from localStorage
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const favFromStorage = localStorage.getItem("favorites");
        if (favFromStorage) {
          setFavorites(JSON.parse(favFromStorage));
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Remove a favorite item with confirmation
  const handleRemoveFavorite = (id) => {
    if (window.confirm("Are you sure you want to remove this from favorites?")) {
      const updatedFavorites = favorites.filter((fav) => fav.id !== id);
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
  };

  // Clear all favorites with confirmation
  const handleClearAll = () => {
    if (favorites.length === 0) return;
    
    if (window.confirm("Are you sure you want to remove all favorites?")) {
      setFavorites([]);
      localStorage.removeItem("favorites");
    }
  };

  // Animation variants for list items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-3">
            <FaHeart className="text-red-500" />
            Your Favorites
          </h1>
          <p className="text-xl text-gray-600">
            {favorites.length > 0 
              ? `You have ${favorites.length} saved propert${favorites.length === 1 ? 'y' : 'ies'}`
              : 'Your favorite properties will appear here'}
          </p>
        </motion.div>

        {/* Clear All Button (only shown when there are favorites) */}
        {favorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-end mb-6"
          >
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <FaTrash /> Clear All
            </button>
          </motion.div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        )}

        {/* Favorites Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {favorites.length > 0 ? (
                favorites.map((fav) => (
                  <motion.div
                    key={fav.id}
                    layout
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={itemVariants}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Property Image */}
                    <div className="relative h-48 w-full overflow-hidden">
                      {fav.image ? (
                        <img
                          src={fav.image}
                          alt={fav.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 cursor-pointer"
                          onClick={() => navigate(`/stay/${fav.id}`)}
                          onError={(e) => {
                            e.target.src = "";
                            e.target.className = "w-full h-full bg-gray-200 flex items-center justify-center";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center text-gray-500">
                          <MdOutlineNoPhotography className="text-4xl mb-2" />
                          <span>No Image</span>
                        </div>
                      )}
                      {/* Favorite badge */}
                      <div className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-sm">
                        <FaHeart className="text-red-500" />
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="p-5">
                      <h2 
                        className="text-xl font-semibold text-gray-800 mb-2 cursor-pointer hover:text-green-600 transition-colors"
                        onClick={() => navigate(`/stay/${fav.id}`)}
                      >
                        {fav.name}
                      </h2>
                      
                      <div className="flex items-center text-gray-600 mb-2">
                        <FaMapMarkerAlt className="mr-2 text-green-600" />
                        <span>{fav.address}</span>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center text-green-600 font-bold">
                          <FaRupeeSign className="mr-1" />
                          <span>{fav.price}</span>
                          <span className="text-sm font-normal text-gray-500 ml-1">/day</span>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFavorite(fav.id);
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <FaTrash size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="col-span-full flex flex-col items-center justify-center py-12"
                >
                  <FaSadTear className="text-5xl text-gray-400 mb-4" />
                  <h3 className="text-2xl font-medium text-gray-700 mb-2">No favorites yet</h3>
                  <p className="text-gray-500 mb-6 text-center max-w-md">
                    You haven't saved any properties to your favorites. Start exploring and click the heart icon to save properties you love!
                  </p>
                  <button
                    onClick={() => navigate("/")}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Browse Properties
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}