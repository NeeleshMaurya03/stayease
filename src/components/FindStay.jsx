import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaFilter, FaStar, FaHeart, FaMapMarkerAlt, FaBed, FaBath, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdOutlineSort } from "react-icons/md";
import { motion } from "framer-motion";

const RESULTS_PER_PAGE = 6;

export default function FindStay() {
  const navigate = useNavigate();

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [listings, setListings] = useState([]);
  const [filteredStays, setFilteredStays] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // Fetch listings from API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3001/listings");
        
        // Load favorites from localStorage
        const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(savedFavorites);

        let listingsData = [];
        if (Array.isArray(response.data)) {
          listingsData = response.data;
        } else if (Array.isArray(response.data.listings)) {
          listingsData = response.data.listings;
        } else {
          throw new Error("Invalid data format");
        }

        // Add isFavorite flag to listings
        const listingsWithFavorites = listingsData.map(listing => ({
          ...listing,
          isFavorite: savedFavorites.includes(listing.id)
        }));

        setListings(listingsWithFavorites);
        setFilteredStays(listingsWithFavorites);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err.response?.status === 404
            ? "Listings not found. Please check your connection."
            : "Failed to load listings. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  // Toggle favorite status
  const toggleFavorite = (id) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(favId => favId !== id)
      : [...favorites, id];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));

    // Update listings with new favorite status
    setListings(prevListings => 
      prevListings.map(listing => 
        listing.id === id ? {...listing, isFavorite: !listing.isFavorite} : listing
      )
    );
    setFilteredStays(prevStays => 
      prevStays.map(stay => 
        stay.id === id ? {...stay, isFavorite: !stay.isFavorite} : stay
      )
    );
  };

  // Parse price range
  const parsePriceRange = (priceStr) => {
    if (!priceStr) return null;
    const parts = priceStr.split("-").map(p => parseInt(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return { min: parts[0], max: parts[1] };
    }
    return null;
  };

  // Filter and sort listings
  useEffect(() => {
    let results = listings.filter(stay => {
      const matchesQuery = searchQuery === "" ||
        stay.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stay.address?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesProperty = propertyTypeFilter === "" ||
        stay.propertyType?.toLowerCase().includes(propertyTypeFilter.toLowerCase());
      
      const priceRange = parsePriceRange(priceFilter);
      const matchesPrice = !priceRange || 
        (stay.price >= priceRange.min && stay.price <= priceRange.max);
      
      return matchesQuery && matchesProperty && matchesPrice;
    });

    // Apply sorting
    switch (sortOption) {
      case "priceLowHigh":
        results.sort((a, b) => a.price - b.price);
        break;
      case "priceHighLow":
        results.sort((a, b) => b.price - a.price);
        break;
      case "nameAsc":
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nameDesc":
        results.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "ratingHighLow":
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // Default sorting (maybe by relevance or newest)
        break;
    }

    setFilteredStays(results);
    setCurrentPage(1);
  }, [searchQuery, priceFilter, propertyTypeFilter, sortOption, listings]);

  // Pagination
  const totalPages = Math.ceil(filteredStays.length / RESULTS_PER_PAGE);
  const paginatedResults = filteredStays.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-md">
          <p className="font-bold">Error Loading Listings</p>
          <p>{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Find Your Perfect Stay</h1>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by location, property name, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FaFilter /> Filters
            </button>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdOutlineSort className="text-gray-400" />
              </div>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
              >
                <option value="default">Sort by</option>
                <option value="priceLowHigh">Price: Low to High</option>
                <option value="priceHighLow">Price: High to Low</option>
                <option value="nameAsc">Name: A-Z</option>
                <option value="nameDesc">Name: Z-A</option>
                <option value="ratingHighLow">Rating: High to Low</option>
              </select>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="bg-gray-50 p-4 rounded-lg mb-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <input
                    type="text"
                    placeholder="e.g., 300-800"
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                  <select
                    value={propertyTypeFilter}
                    onChange={(e) => setPropertyTypeFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    <option value="Private Room">Private Room</option>
                    <option value="PG Room">PG Room</option>
                    <option value="Flat">Flat</option>
                    <option value="Studio Apartment">Studio Apartment</option>
                    <option value="Shared Room">Shared Room</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {filteredStays.length} {filteredStays.length === 1 ? 'property' : 'properties'}
          </p>
          {filteredStays.length > 0 && (
            <p className="text-gray-600">
              Page {currentPage} of {totalPages}
            </p>
          )}
        </div>

        {/* Listings Grid */}
        {filteredStays.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedResults.map((stay) => (
              <motion.div
                key={stay.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
              >
                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(stay.id)}
                  className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full shadow-sm hover:bg-white transition-colors"
                  aria-label={stay.isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <FaHeart className={stay.isFavorite ? "text-red-500 fill-current" : "text-gray-400 fill-current"} />
                </button>

                {/* Property Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={stay.images?.[0] || "/assets/placeholder.jpg"}
                    alt={stay.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      e.target.src = "/assets/placeholder.jpg";
                    }}
                  />
                  {stay.rating && (
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span>{stay.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {/* Property Details */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-semibold text-gray-800">{stay.name}</h2>
                    <p className="text-lg font-bold text-green-600">₹{stay.price}<span className="text-sm font-normal text-gray-500">/{stay.rentUnit}</span></p>
                  </div>

                  <div className="flex items-center text-gray-600 mb-2">
                    <FaMapMarkerAlt className="mr-1 text-maroon-600" />
                    <span className="text-sm">{stay.address}</span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <FaBed className="mr-1" />
                      <span>{stay.bedrooms} bed{stay.bedrooms !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center">
                      <FaBath className="mr-1" />
                      <span>{stay.bathrooms} bath{stay.bathrooms !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center">
                      <span>{stay.area}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {stay.features?.slice(0, 3).map((feature, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                    {stay.features?.length > 3 && (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        +{stay.features.length - 3} more
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => navigate(`/stay/${stay.id}`)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No properties found</h2>
            <p className="text-gray-600 mb-4">Try adjusting your search filters or search for a different location.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setPriceFilter("");
                setPropertyTypeFilter("");
                setSortOption("default");
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg flex items-center ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
              aria-label="Previous page"
            >
              <FaArrowLeft className="mr-2" /> Previous
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-full ${currentPage === pageNum ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="px-2 flex items-center">...</span>
              )}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className={`w-10 h-10 rounded-full ${currentPage === totalPages ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  {totalPages}
                </button>
              )}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg flex items-center ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
              aria-label="Next page"
            >
              Next <FaArrowRight className="ml-2" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}