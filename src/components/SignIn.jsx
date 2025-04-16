import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  FaUser, 
  FaLock, 
  FaSpinner, 
  FaEye, 
  FaEyeSlash, 
  FaGoogle,
  FaEnvelope
} from "react-icons/fa";
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  fetchSignInMethodsForEmail
} from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState({
    email: false,
    google: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(prev => ({ ...prev, email: true }));
      
      // Check if email exists and is linked to email/password method
      const methods = await fetchSignInMethodsForEmail(auth, formData.email);
      if (methods.length === 0) {
        setErrors({ apiError: "No account found with this email" });
        return;
      }
      if (!methods.includes("password")) {
        setErrors({ apiError: "Account exists with a different sign-in method (e.g., Google). Try signing in with Google." });
        return;
      }

      // Proceed with sign-in
      const { user } = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      setCurrentUser(user);
      navigate("/dashboard");
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        apiError: error.code === "auth/wrong-password" 
          ? "Incorrect password" 
          : error.code === "auth/user-not-found" 
          ? "No account found with this email" 
          : "Login failed. Please try again."
      });
    } finally {
      setLoading(prev => ({ ...prev, email: false }));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(prev => ({ ...prev, google: true }));
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      setCurrentUser(user);
      navigate("/dashboard");
    } catch (error) {
      console.error('Google sign-in error:', error);
      setErrors({
        apiError: error.code === "auth/popup-closed-by-user" 
          ? "Sign-in window was closed" 
          : "Google sign-in failed. Please try again."
      });
    } finally {
      setLoading(prev => ({ ...prev, google: false }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-pink-100">
              <FaUser className="text-2xl text-pink-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="mt-2 text-gray-500">
              Sign in to access your account
            </p>
          </div>

          {errors.apiError && (
            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg">
              {errors.apiError}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading.google || loading.email}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium border ${
                loading.google 
                  ? "bg-gray-100 border-gray-200 text-gray-400" 
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {loading.google ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <>
                  <FaGoogle className="text-red-500" />
                  Continue with Google
                </>
              )}
            </button>

            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative px-2 bg-white text-sm text-gray-500">
                or sign in with email
              </div>
            </div>

            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your email"
                  />
                  <FaEnvelope className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading.email || loading.google}
                className={`w-full py-2 px-4 rounded-lg font-medium text-white bg-pink-600 hover:bg-pink-700 ${
                  loading.email || loading.google ? "opacity-50" : ""
                }`}
              >
                {loading.email ? <FaSpinner className="animate-spin inline" /> : "Sign In"}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-pink-600 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}