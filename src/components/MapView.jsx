import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import axios from "axios";
import { 
  FaBed, 
  FaBath, 
  FaWifi, 
  FaParking, 
  FaSnowflake, 
  FaStar,
  FaMapMarkerAlt,
  FaRulerCombined 
} from "react-icons/fa";
import { MdLocalLaundryService, MdSecurity } from "react-icons/md";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

// Custom icon for markers
const createCustomIcon = (price) => {
  const priceColor = price < 500 ? 'green' : price < 1000 ? 'orange' : 'red';
  
  return L.divIcon({
    html: `
      <div style="
        background: ${priceColor};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-weight: bold;
        border: 2px solid white;
        box-shadow: 0 0 5px rgba(0,0,0,0.3);
      ">
        ₹${price}
      </div>
    `,
    className: '', // Remove default className
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

// Component to handle map view changes
const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const MapView = () => {
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStay, setSelectedStay] = useState(null);
  const [mapCenter, setMapCenter] = useState([22.9734, 78.6569]); // Centered on India
  const [zoom, setZoom] = useState(5);
  const [bounds, setBounds] = useState(null);

  // Fetch stays from database
  useEffect(() => {
    const fetchStays = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3001/listings");
        
        // Transform data to include coordinates
        const staysWithCoords = response.data.map(stay => {
          // Generate random coordinates if not provided (for demo purposes)
          const coords = stay.coordinates || [
            18.5 + Math.random() * 10, // Latitude range for India
            72.5 + Math.random() * 10  // Longitude range for India
          ];
          
          return {
            ...stay,
            coordinates: coords
          };
        });
        
        setStays(staysWithCoords);
      } catch (err) {
        console.error("Error fetching stays:", err);
        setError("Failed to load property locations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStays();
  }, []);

  // Handle map move events
  const handleMoveEnd = () => {
    const map = document.querySelector('.leaflet-container')?._leaflet_map;
    if (map) {
      setMapCenter(map.getCenter());
      setZoom(map.getZoom());
      setBounds(map.getBounds());
    }
  };

  // Filter stays by current map bounds
  const filteredStays = bounds 
    ? stays.filter(stay => bounds.contains(stay.coordinates))
    : stays;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full">
      {/* Map Container */}
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(map) => {
          map.on('moveend', handleMoveEnd);
          setBounds(map.getBounds());
        }}
      >
        <MapController center={mapCenter} zoom={zoom} />
        
        {/* Tile Layer - Using Mapbox for better visuals */}
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
          attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {/* Marker Cluster Group */}
        <MarkerClusterGroup
          chunkedLoading
          spiderfyOnMaxZoom
          showCoverageOnHover
          zoomToBoundsOnClick
          maxClusterRadius={60}
          iconCreateFunction={(cluster) => {
            const count = cluster.getChildCount();
            const priceColor = count > 10 ? 'red' : count > 5 ? 'orange' : 'green';
            
            return L.divIcon({
              html: `<div style="
                background: ${priceColor};
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
                font-weight: bold;
                border: 3px solid white;
                box-shadow: 0 0 5px rgba(0,0,0,0.3);
              ">
                ${count}
              </div>`,
              className: '',
              iconSize: [40, 40]
            });
          }}
        >
          {filteredStays.map((stay) => (
            <Marker 
              key={stay.id} 
              position={stay.coordinates}
              icon={createCustomIcon(stay.price)}
              eventHandlers={{
                click: () => setSelectedStay(stay)
              }}
            />
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Property Details Panel */}
      {selectedStay && (
        <div className="absolute top-4 right-4 w-96 bg-white rounded-lg shadow-xl z-[1000] max-h-[90vh] overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-bold">{selectedStay.name}</h2>
              <button 
                onClick={() => setSelectedStay(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="flex items-center text-gray-600 mb-2">
              <FaMapMarkerAlt className="mr-1 text-green-600" />
              <span>{selectedStay.address}</span>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-green-600">
                ₹{selectedStay.price}<span className="text-sm font-normal text-gray-500">/{selectedStay.rentUnit}</span>
              </span>
              {selectedStay.rating && (
                <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded">
                  <FaStar className="mr-1" />
                  <span>{selectedStay.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            
            {/* Property Images */}
            <div className="mb-4">
              <img 
                src={selectedStay.images?.[0] || "/placeholder.jpg"} 
                alt={selectedStay.name}
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = "/placeholder.jpg";
                }}
              />
            </div>
            
            {/* Property Features */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="flex items-center">
                <FaBed className="mr-2 text-green-600" />
                <span>{selectedStay.bedrooms} bed{selectedStay.bedrooms !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center">
                <FaBath className="mr-2 text-green-600" />
                <span>{selectedStay.bathrooms} bath{selectedStay.bathrooms !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center">
                <FaRulerCombined className="mr-2 text-green-600" />
                <span>{selectedStay.area}</span>
              </div>
            </div>
            
            {/* Amenities */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {selectedStay.features?.slice(0, 8).map((feature, index) => (
                  <span key={index} className="flex items-center bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                    {feature === 'Wi-Fi' && <FaWifi className="mr-1" />}
                    {feature === 'Parking' && <FaParking className="mr-1" />}
                    {feature === 'Air Conditioning' && <FaSnowflake className="mr-1" />}
                    {feature === 'Laundry' && <MdLocalLaundryService className="mr-1" />}
                    {feature === 'Security' && <MdSecurity className="mr-1" />}
                    {feature}
                  </span>
                ))}
                {selectedStay.features?.length > 8 && (
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                    +{selectedStay.features.length - 8} more
                  </span>
                )}
              </div>
            </div>
            
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors">
              View Full Details
            </button>
          </div>
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute bottom-4 left-4 bg-white p-2 rounded-lg shadow-md z-[1000]">
        <div className="text-sm text-gray-700">
          <div>Zoom: {zoom.toFixed(1)}</div>
          <div>Properties: {filteredStays.length}</div>
        </div>
      </div>
    </div>
  );
};

export default MapView;