import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState("");

  // Handle newsletter signup
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setNotification("Please enter a valid email address.");
      return;
    }
    setNotification("Thanks for subscribing! 🎉");
    setEmail("");
    setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds
  };

  return (
    <footer
      className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12"
      aria-label="Footer section with navigation and contact information"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid for Footer Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand and Newsletter */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-green-400">StayEase</h2>
            <p className="text-gray-300 mb-4">The smarter way to stay.</p>
            <p className="text-sm text-gray-400 mb-4">Sign up for the latest updates</p>
            <form onSubmit={handleNewsletterSubmit} className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-2 rounded-l-md border border-gray-600 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email for newsletter subscription"
                required
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-r transition-colors"
                aria-label="Subscribe to newsletter"
              >
                Sign Up
              </button>
            </form>
            {notification && (
              <p className="mt-2 text-sm text-green-400">{notification}</p>
            )}
          </div>

          {/* Column 2: Stays */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-200">Stays</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/find-stay"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                  aria-label="Navigate to Find Stay"
                >
                  Find Stay
                </Link>
              </li>
              <li>
                <Link
                  to="/rent-room"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                  aria-label="Navigate to Rent Room"
                >
                  Rent Room
                </Link>
              </li>
              <li>
                <Link
                  to="/offers"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                  aria-label="Navigate to Offers"
                >
                  Offers
                </Link>
              </li>
              <li>
                <Link
                  to="/map-view"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                  aria-label="Navigate to Map View"
                >
                  Map View
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Host */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-200">Host</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/become-host"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                  aria-label="Navigate to Become a Host"
                >
                  Become a Host
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                  aria-label="Navigate to Help Center"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/reviews"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                  aria-label="Navigate to Host Reviews"
                >
                  Host Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: About and Social */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-200">About</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                  aria-label="Navigate to About Us"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                  aria-label="Navigate to Careers"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                  aria-label="Navigate to Contact"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/investors"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                  aria-label="Navigate to Investors"
                >
                  Investors
                </Link>
              </li>
            </ul>
            <div className="mt-4 flex space-x-4">
              <a
                href="https://facebook.com"
                className="text-gray-400 hover:text-green-400"
                aria-label="Facebook"
              >
                <span className="sr-only">Facebook</span>
                {/* Replace with an icon library like react-icons */}
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                className="text-gray-400 hover:text-green-400"
                aria-label="Twitter"
              >
                <span className="sr-only">Twitter</span>
                {/* Replace with an icon library */}
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.494 14-13.986 0-.21-.005-.42-.014-.63.961-.695 1.8-1.562 2.457-2.549z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Information and Bottom Line */}
        <div className="mt-12 border-t border-gray-700 pt-6 text-center">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400">
                Call Us:{" "}
                <span className="font-semibold text-gray-200">1800-123-4567</span>
              </p>
              <p className="text-gray-400">
                Email Us:{" "}
                <span className="font-semibold text-gray-200">support@stayease.com</span>
              </p>
            </div>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
              <p className="text-gray-400">
                © {new Date().getFullYear()} StayEase. All rights reserved.
              </p>
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-green-400 transition-colors"
                aria-label="Navigate to Privacy Policy"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;