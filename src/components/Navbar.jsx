import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaRegHeart, FaHeart, FaMoon, FaSun } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkTheme, setDarkTheme] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (darkTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkTheme]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/signin");
  };

  const handleThemeToggle = () => {
    setDarkTheme(!darkTheme);
    localStorage.setItem("theme", !darkTheme ? "dark" : "light");
  };

  const handleFavClick = () => {
    if (!isFav) {
      setIsFav(true);
      navigate("/favorites");
    } else {
      setIsFav(false);
      navigate("/");
    }
  };

  // Motion Variants for staggered nav links
  const navListVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const navItemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  return (
    <motion.nav
      className="flex justify-between items-center px-8 py-4 shadow-md bg-white dark:bg-gray-900 sticky top-0 z-50"
      initial={{ y: -70 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      {/* Left: Logo with a slight hover scale */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="select-none"
      >
        <Link to="/" className="text-2xl font-bold text-gray-800 dark:text-white">
          <span className="text-green-600">S</span>tayEase
        </Link>
      </motion.div>

      {/* Center: Animated Navigation Links */}
      <motion.ul
        className="flex gap-6 text-gray-700 dark:text-gray-300 font-medium flex-1 justify-center items-center"
        variants={navListVariants}
        initial="initial"
        animate="animate"
      >
        <motion.li variants={navItemVariants}>
          <Link to="/">Home</Link>
        </motion.li>
        <motion.li variants={navItemVariants}>
          <Link to="/find-stay">Find & Stay</Link>
        </motion.li>
        <motion.li variants={navItemVariants}>
          <Link to="/become-host">Host</Link>
        </motion.li>
        <motion.li variants={navItemVariants}>
          <Link to="/contact">Contact</Link>
        </motion.li>
      </motion.ul>

      {/* Right: Favorite Icon, Theme Toggle, and Auth Buttons */}
      <div className="flex items-center gap-4">
        {/* Favorite Icon with hover scaling */}
        <motion.button
          onClick={handleFavClick}
          whileHover={{ scale: 1.1 }}
          className="text-2xl text-gray-700 dark:text-gray-300 focus:outline-none"
        >
          {isFav ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
        </motion.button>

        {/* Theme Toggle with hover scaling */}
        <motion.button
          onClick={handleThemeToggle}
          whileHover={{ scale: 1.1 }}
          className="text-xl focus:outline-none"
        >
          {darkTheme ? (
            <FaSun className="text-yellow-400" />
          ) : (
            <FaMoon className="text-gray-800" />
          )}
        </motion.button>

        {/* Signin / Signout Button */}
        {!isLoggedIn ? (
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              to="/signin"
              className="px-4 py-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
            >
              SignIn / SignUp
            </Link>
          </motion.div>
        ) : (
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </motion.button>
        )}
      </div>
    </motion.nav>
  );
}