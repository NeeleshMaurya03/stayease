export default function HostDashboard() {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Host Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Listings */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Your Properties</h2>
            {/* Property management would go here */}
          </div>
  
          {/* Bookings */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
            {/* Booking calendar would go here */}
          </div>
  
          {/* Earnings */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Earnings</h2>
            {/* Revenue charts would go here */}
          </div>
        </div>
      </div>
    );
  }