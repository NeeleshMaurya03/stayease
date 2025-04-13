import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaMoneyBillWave,
  FaShieldAlt,
  FaClock,
  FaHome,
  FaSearch,
  FaUserGraduate,
  FaCheckCircle,
  FaHeart,
} from "react-icons/fa";
import {
  MdLocationOn,
  MdCalendarToday,
  MdPriceChange,
} from "react-icons/md";

// Hero room images (stored in public/assets/)
const heroRoomImages = [
  "/assets/1.jpeg",
  "/assets/2.jpeg",
  "/assets/3.jpeg",
  "/assets/4.jpeg",
  "/assets/5.jpeg",
];

// Placeholder for RecentlyViewed with full display
const RecentlyViewed = ({ listings, toggleFavorite }) => (
  <div className="py-12 bg-gray-50">
    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
      Recently Viewed
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-6">
      {listings.slice(0, 6).map((listing) => (
        <div
          key={listing.id}
          className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 relative"
        >
          <button 
            onClick={() => toggleFavorite(listing.id)}
            className="absolute top-3 right-3 z-10 p-2 bg-white/80 rounded-full"
          >
            <FaHeart 
              className={`text-lg ${listing.isFavorite ? 'text-red-500' : 'text-gray-300'}`} 
            />
          </button>
          <img
            src={process.env.PUBLIC_URL + `/assets/${listing.id}.jpeg`}
            alt={listing.name}
            className="w-full h-48 object-cover"
            onError={(e) => console.error("Image load error:", e)}
          />
          <div className="p-5">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{listing.name}</h3>
            <p className="text-gray-600 mb-2 flex items-center">
              <MdLocationOn className="mr-1" /> {listing.address}
            </p>
            <p className="text-lg font-medium text-green-600">
              ₹{listing.price}/pre {listing.rentUnit}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const HomePage = () => {
  const [allListings, setAllListings] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState(null); // Date for availability
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();
  const featuresRef = useRef(null); // Ref for auto-scroll
  const intervalRef = useRef(null); // Ref to manage interval

  // Fetch listings from JSON Server on mount
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3001/listings")
      .then((res) => res.json())
      .then((data) => {
        const listings = Array.isArray(data) ? data : 
                       Array.isArray(data.listings) ? data.listings : [];
        
        // Initialize favorites status
        const listingsWithFavorites = listings.map(listing => ({
          ...listing,
          isFavorite: false
        }));
        
        setAllListings(listingsWithFavorites);
        setSearchResults(listingsWithFavorites);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching listings:", err);
        setError("Unable to load listings. Please try again later.");
        setLoading(false);
      });
  }, []);

  // Toggle favorite status
  const toggleFavorite = (id) => {
    setAllListings(prevListings => 
      prevListings.map(listing => 
        listing.id === id ? {...listing, isFavorite: !listing.isFavorite} : listing
      )
    );
    setSearchResults(prevResults => 
      prevResults.map(listing => 
        listing.id === id ? {...listing, isFavorite: !listing.isFavorite} : listing
      )
    );
  };

  // Auto-suggest: filter suggestions based on address or name
  const filteredSuggestions = useMemo(() => {
    const searchStr = address.toLowerCase().trim();
    return searchStr.length > 2
      ? allListings.filter(
          (stay) =>
            stay.address.toLowerCase().includes(searchStr) ||
            stay.name.toLowerCase().includes(searchStr)
        )
      : [];
  }, [address, allListings]);

  const parsePriceRange = (priceStr) => {
    if (!priceStr) return null;
    const parts = priceStr.split("-");
    if (parts.length !== 2) return null;
    const min = parseInt(parts[0].replace(/[^\d]/g, ""), 10);
    const max = parseInt(parts[1].replace(/[^\d]/g, ""), 10);
    return isNaN(min) || isNaN(max) ? null : { min, max };
  };

  // Enhanced handleSearch with date filtering
  const handleSearch = () => {
    const addr = address.toLowerCase().trim();
    const priceRange = parsePriceRange(price);
    const searchDate = date ? new Date(date).toISOString().split("T")[0] : null;

    const filtered = allListings.filter((stay) => {
      const matchesAddress = addr
        ? stay.address.toLowerCase().includes(addr) ||
          stay.name.toLowerCase().includes(addr)
        : true;
      const matchesPrice = priceRange
        ? stay.price >= priceRange.min && stay.price <= priceRange.max
        : true;
      const matchesDate = searchDate
        ? stay.availableFrom && stay.availableFrom <= searchDate
        : true;
      return matchesAddress && matchesPrice && matchesDate;
    });

    setSearchResults(filtered);
    setShowSuggestions(false);
    
    // Scroll to results section
    setTimeout(() => {
      const resultsSection = document.querySelector('#search-results');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Handle Enter key for all inputs
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // Auto-scroll effect for features
  useEffect(() => {
    const scrollContainer = featuresRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollSpeed = 0.5; // Adjust speed (pixels per frame)
    const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;

    const autoScroll = () => {
      if (scrollContainer) {
        scrollAmount += scrollSpeed;
        if (scrollAmount >= maxScroll) scrollAmount = 0; // Loop back
        scrollContainer.scrollLeft = scrollAmount;
      }
    };

    intervalRef.current = setInterval(autoScroll, 20); // Initialize interval

    // Pause on hover
    const handleMouseEnter = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    const handleMouseLeave = () => {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(autoScroll, 20);
      }
    };

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const featuresArray = [
    { title: "Affordable Pricing", icon: FaMoneyBillWave, bgColor: "bg-blue-50" },
    { title: "Verified Hosts", icon: FaShieldAlt, bgColor: "bg-green-50" },
    { title: "Instant Booking", icon: FaClock, bgColor: "bg-yellow-50" },
    { title: "Student Deals", icon: FaUserGraduate, bgColor: "bg-purple-50" },
    { title: "Flexible Stays", icon: FaHome, bgColor: "bg-lime-50" },
    { title: "Safe & Secure", icon: FaCheckCircle, bgColor: "bg-pink-50" },
  ];

  // Fixed positions for hero room images in corners
  const getCornerPosition = (index) => {
    const positions = [
      { top: "5%", left: "5%" },
      { top: "5%", right: "5%" },
      { bottom: "5%", left: "5%" },
      { bottom: "5%", right: "5%" },
      { top: "10%", left: "10%" },
    ];
    return positions[index % positions.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 relative overflow-hidden">
      {/* Hero Banner with Decorative Shapes */}
      <header className="relative bg-gradient-to-b from-green-700 to-green-800 py-20 text-center rounded-b-3xl overflow-hidden shadow-lg">
        <motion.div
          className="absolute inset-0 bg-[url('/assets/1.jpeg')] bg-cover bg-center opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute w-20 h-20 bg-white/20 rounded-full blur-md"
            style={{ top: "10%", left: "10%" }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-10 h-40 bg-white/10 rotate-45"
            style={{ bottom: "10%", right: "20%" }}
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-30 h-30 bg-green-500/20 rounded-lg"
            style={{ top: "20%", right: "10%" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>
        {heroRoomImages.map((image, index) => (
          <motion.img
            key={index}
            src={image}
            alt={`Room ${index + 1}`}
            className="absolute w-28 h-20 rounded-lg object-cover border-4 border-white shadow-md"
            style={getCornerPosition(index)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: index * 0.2 }}
            whileHover={{ scale: 1.1 }}
          />
        ))}
        <div className="relative z-10 px-6">
          <motion.h1
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-5xl font-extrabold text-white mb-6 drop-shadow-lg"
          >
            Find Your Perfect Stay with Stayease
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-xl text-white mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Discover affordable spare rooms for students, families, medical
            visitors, and travelers—starting at just ₹300/day!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex-1 px-3 relative">
              <MdLocationOn className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Where: City or Zip"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setShowSuggestions(true);
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-3 outline-none bg-gray-100 text-gray-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500"
              />
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 z-50 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-60 overflow-y-auto">
                  {filteredSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="p-3 hover:bg-gray-100 cursor-pointer transition-colors"
                      onMouseDown={() => {
                        setAddress(suggestion.address);
                        setShowSuggestions(false);
                      }}
                    >
                      {suggestion.address} – {suggestion.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="w-px h-12 bg-gray-300 mx-4" />
            <div className="flex-1 px-3 relative">
              <MdCalendarToday className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <DatePicker
                selected={date}
                onChange={(newDate) => setDate(newDate)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select Availability Date"
                className="w-full pl-10 pr-4 py-3 outline-none bg-gray-100 text-gray-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500"
                onKeyDown={handleKeyDown}
                minDate={new Date()}
              />
            </div>
            <div className="w-px h-12 bg-gray-300 mx-4" />
            <div className="flex-1 px-3 relative">
              <MdPriceChange className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Price Range: 300-800"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-3 outline-none bg-gray-100 text-gray-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              onClick={handleSearch}
              className="ml-4 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-md"
            >
              <FaSearch size={20} />
            </button>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-green-800 to-transparent -skew-y-6 transform origin-bottom" />
      </header>

      {/* Navigate Section */}
      <section className="py-16 bg-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-3xl font-bold text-gray-800 mb-6"
          >
            Explore Affordable Stays Tailored for You
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-lg text-gray-600 mb-8 leading-relaxed"
          >
            Stayease connects you with verified hosts offering spare rooms for
            students, families, medical needs, and budget travelers. Enjoy
            seamless booking with exclusive perks!
          </motion.p>
        </div>
      </section>

      {/* Horizontal Scroll Features with Auto-Scroll */}
      <section className="py-10 bg-gray-50 relative">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Why Choose Stayease
          </h2>
          <div className="relative">
            {/* Gradient overlays for scroll indication */}
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10" />
            <div
              ref={featuresRef}
              className="flex space-x-6 overflow-x-auto scrollbar-hide py-4"
              style={{ scrollBehavior: "smooth" }}
            >
              {featuresArray.map((feature, idx) => (
                <motion.div
                  key={idx}
                  className={`min-w-[130px] flex flex-col items-center justify-center p-5 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 ${feature.bgColor}`}
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-white to-gray-100 flex items-center justify-center mb-3"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <feature.icon className="text-2xl text-gray-800" />
                  </motion.div>
                  <h3 className="text-sm font-semibold text-gray-800 text-center">
                    {feature.title}
                  </h3>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed Section */}
      <RecentlyViewed listings={allListings} toggleFavorite={toggleFavorite} />

      {/* Search Results Section */}
      <section id="search-results" className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            {address ? `Results for "${address}"` : 'Available Stays'}
          </h2>
          {loading ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-600 text-lg"
            >
              Loading...
            </motion.p>
          ) : error ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-red-600 text-lg"
            >
              {error}
            </motion.p>
          ) : searchResults.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {searchResults.map((stay) => (
                <motion.div
                  key={stay.id}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: stay.id * 0.1 }}
                  whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 relative"
                >
                  <button 
                    onClick={() => toggleFavorite(stay.id)}
                    className="absolute top-3 right-3 z-10 p-2 bg-white/80 rounded-full"
                  >
                    <FaHeart 
                      className={`text-lg ${stay.isFavorite ? 'text-red-500' : 'text-gray-300'}`} 
                    />
                  </button>
                  <img
                    src={process.env.PUBLIC_URL + `/assets/${stay.id}.jpeg`}
                    alt={stay.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => console.error("Image load error:", e)}
                  />
                  <div className="p-5">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {stay.name}
                      {stay.price <= 800 && (
                        <span className="ml-2 text-green-600 bg-green-100 px-2 py-1 rounded-full text-sm">
                          Budget Friendly
                        </span>
                      )}
                      {stay.nearMetro && (
                        <span className="ml-2 text-blue-600 bg-blue-100 px-2 py-1 rounded-full text-sm">
                          Near Metro
                        </span>
                      )}
                    </h2>
                    <p className="text-gray-600 mb-2 flex items-center">
                      <MdLocationOn className="mr-1" /> {stay.address}
                    </p>
                    <p className="text-lg font-medium text-green-600 mb-3">
                      ₹{stay.price}/pre {stay.rentUnit}
                    </p>
                    <p className="text-gray-500 text-sm mb-4">
                      {stay.purpose || "Perfect for students or short family stays"}
                    </p>
                    {stay.availableFrom && (
                      <p className="text-gray-500 text-sm mb-2">
                        Available from: {new Date(stay.availableFrom).toLocaleDateString()}
                      </p>
                    )}
                    <button
                      onClick={() => navigate(`/stay/${stay.id}`)}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 rounded-full hover:from-green-700 hover:to-green-800 transition-all shadow-md"
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="text-gray-600 text-lg mb-4">
                No results found for your search criteria.
              </p>
              <button
                onClick={() => {
                  setAddress('');
                  setPrice('');
                  setDate(null);
                  setSearchResults(allListings);
                }}
                className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors"
              >
                Reset Search
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;