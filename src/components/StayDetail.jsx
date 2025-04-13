import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaHeart, FaShare, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaWifi, FaParking, FaSnowflake, FaUtensils, FaTv, FaSwimmingPool, FaDumbbell } from "react-icons/fa";
import { MdPets, MdLocalLaundryService, MdSecurity, MdKitchen } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";

const StayDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  // Fetch listing data
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3001/listings/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Listing not found");
        return res.json();
      })
      .then((data) => {
        setListing(data);
        setIsFavorite(data.isFavorite || false);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching listing:", err);
        setError("Unable to load listing details. Please try again later.");
        setLoading(false);
      });
  }, [id]);

  // Handle contact form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", contactForm);
    alert("Thank you for your interest! We will get back to you soon.");
    setContactForm({ name: "", phone: "", email: "", message: "" });
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Here you would typically update the favorite status in your database
    console.log(`Listing ${id} ${isFavorite ? 'removed from' : 'added to'} favorites`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.name,
        text: `Check out this ${listing.propertyType} in ${listing.address}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support Web Share API
      alert('Share link copied to clipboard!');
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-maroon-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
      <button 
        onClick={() => navigate(-1)} 
        className="bg-maroon-600 text-white px-4 py-2 rounded hover:bg-maroon-700 transition-colors"
      >
        Go Back
      </button>
    </div>
  );
  
  if (!listing) return null;

  // Amenities icons mapping
  const amenitiesIcons = {
    "Wi-Fi": <FaWifi className="text-maroon-600" />,
    "Parking": <FaParking className="text-maroon-600" />,
    "Air Conditioning": <FaSnowflake className="text-maroon-600" />,
    "Swimming Pool": <FaSwimmingPool className="text-maroon-600" />,
    "Gym": <FaDumbbell className="text-maroon-600" />,
    "Pets Allowed": <MdPets className="text-maroon-600" />,
    "Laundry": <MdLocalLaundryService className="text-maroon-600" />,
    "Security": <MdSecurity className="text-maroon-600" />,
    "Kitchen": <MdKitchen className="text-maroon-600" />,
    "TV": <FaTv className="text-maroon-600" />,
    "Home-Cooked Meals": <FaUtensils className="text-maroon-600" />
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header with back button */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-maroon-600 hover:text-maroon-800 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          <div className="flex space-x-4">
            <button 
              onClick={handleShare}
              className="p-2 text-gray-600 hover:text-maroon-600 transition-colors"
            >
              <FaShare />
            </button>
            <button 
              onClick={toggleFavorite}
              className="p-2 text-gray-600 hover:text-maroon-600 transition-colors"
            >
              <FaHeart className={isFavorite ? "text-red-500 fill-current" : "text-gray-400 fill-current"} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Property Title and Basic Info */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.name}</h1>
          <div className="flex items-center text-gray-600 mb-4">
            <FaMapMarkerAlt className="mr-1 text-maroon-600" />
            <span>{listing.address}</span>
          </div>
          <div className="flex items-center space-x-6 text-gray-700 mb-4">
            <div className="flex items-center">
              <FaBed className="mr-2 text-maroon-600" />
              <span>{listing.bedrooms} Bed{listing.bedrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center">
              <FaBath className="mr-2 text-maroon-600" />
              <span>{listing.bathrooms} Bath{listing.bathrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center">
              <FaRulerCombined className="mr-2 text-maroon-600" />
              <span>{listing.area}</span>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
          <div className="relative h-96 w-full">
            <img
              src={process.env.PUBLIC_URL + listing.images[activeImage]}
              alt={listing.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {listing.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-3 h-3 rounded-full ${activeImage === index ? 'bg-maroon-600' : 'bg-white bg-opacity-50'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Price and Booking Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Property Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4">About this property</h2>
              <p className="text-gray-700 mb-6">{listing.description}</p>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-semibold mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {listing.features.slice(0, showAllAmenities ? listing.features.length : 6).map((feature, index) => (
                    <div key={index} className="flex items-center">
                      {amenitiesIcons[feature] || <FaWifi className="text-maroon-600" />}
                      <span className="ml-2 text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                {listing.features.length > 6 && (
                  <button
                    onClick={() => setShowAllAmenities(!showAllAmenities)}
                    className="mt-4 text-maroon-600 hover:underline flex items-center"
                  >
                    {showAllAmenities ? 'Show less' : `Show all ${listing.features.length} amenities`}
                    <IoIosArrowForward className={`ml-1 transition-transform ${showAllAmenities ? 'transform rotate-90' : ''}`} />
                  </button>
                )}
              </div>
            </div>

            {/* Location Map (placeholder) */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Location</h2>
              <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 mb-4">
                Map View Coming Soon
              </div>
              <div className="space-y-2">
                {listing.nearbyPlaces && listing.nearbyPlaces.map((place, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <FaMapMarkerAlt className="mr-2 text-maroon-600" />
                    <span>{place}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Widget */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-2xl font-bold text-maroon-600">₹{listing.price}</span>
                  <span className="text-gray-500">/{listing.rentUnit}</span>
                </div>
                {listing.monthlyPrice && (
                  <div className="text-gray-600">
                    <span className="font-medium">₹{listing.monthlyPrice}</span>
                    <span className="text-sm">/month</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Available from:</span>
                  <span className="font-medium">
                    {new Date(listing.availableFrom).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Minimum stay:</span>
                  <span className="font-medium">{listing.minimumStay} days</span>
                </div>
              </div>

              <button className="w-full bg-maroon-600 hover:bg-maroon-700 text-white py-3 rounded-lg font-medium transition-colors mb-4">
                Check Availability
              </button>

              <div className="text-center text-gray-500 text-sm">
                Contact us for long-term discounts
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Contact the host</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Host Info */}
            <div>
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500 mr-4">
                  {listing.contact.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{listing.contact.name}</h3>
                  <p className="text-gray-600">Host since {new Date(listing.contact.joinDate).getFullYear()}</p>
                  {listing.contact.isVerified && (
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1">
                      Verified Host
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <span className="font-medium mr-2">Response rate:</span>
                  <span>100%</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="font-medium mr-2">Response time:</span>
                  <span>within an hour</span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  value={contactForm.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="phone"
                  value={contactForm.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <textarea
                  name="message"
                  value={contactForm.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                  required
                ></textarea>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="consent"
                  className="mr-2 h-4 w-4 text-maroon-600 focus:ring-maroon-500 border-gray-300 rounded"
                  required
                />
                <label htmlFor="consent" className="text-sm text-gray-600">
                  I agree to receive communications from StayEase
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-maroon-600 hover:bg-maroon-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Similar Listings (placeholder) */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Similar stays you might like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder for similar listings */}
            <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center text-gray-500">
              Similar Listing 1
            </div>
            <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center text-gray-500">
              Similar Listing 2
            </div>
            <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center text-gray-500">
              Similar Listing 3
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <p>© 2023 StayEase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StayDetail;