export default function GuestDashboard() {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your StayEase</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Upcoming Trips */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Upcoming Stays</h2>
            {/* Trip cards would go here */}
          </div>
  
          {/* Wishlist */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Saved Stays</h2>
            {/* Wishlist items would go here */}
          </div>
  
          {/* Recommendations */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">For You</h2>
            {/* Recommendations would go here */}
          </div>
        </div>
      </div>
    );
  }