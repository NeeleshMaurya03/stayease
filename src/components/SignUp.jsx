import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  FaUserPlus, 
  FaLock, 
  FaEnvelope, 
  FaSpinner, 
  FaEye, 
  FaEyeSlash, 
  FaGoogle 
} from "react-icons/fa";
import { 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isHost, setIsHost] = useState(false);
  const [loading, setLoading] = useState({
    email: false,
    google: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(prev => ({ ...prev, email: true }));
      const { user } = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      // Save additional user data to Firestore
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        email: user.email,
        isHost,
        createdAt: new Date()
      }, { merge: true });

      setCurrentUser({ ...user, isHost });
      navigate("/dashboard");
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({
        apiError: error.code === "auth/email-already-in-use" 
          ? "Email already in use. Try signing in or use a different email." 
          : error.code === "auth/weak-password" 
          ? "Password should be at least 6 characters" 
          : "Registration failed. Please try again."
      });
    } finally {
      setLoading(prev => ({ ...prev, email: false }));
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(prev => ({ ...prev, google: true }));
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      
      // Save additional user data to Firestore
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        email: user.email,
        isHost: false,
        createdAt: new Date()
      }, { merge: true });

      setCurrentUser({ ...user, isHost: false });
      navigate("/dashboard");
    } catch (error) {
      console.error('Google sign-up error:', error);
      setErrors({
        apiError: error.code === "auth/popup-closed-by-user" 
          ? "Sign-up window was closed" 
          : "Google sign-up failed. Please try again."
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
              <FaUserPlus className="text-2xl text-pink-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="mt-2 text-gray-500">
              Join us to start your journey
            </p>
          </div>

          {errors.apiError && (
            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg">
              {errors.apiError}
            </div>
          )}

          <button
            onClick={handleGoogleSignUp}
            disabled={loading.google || loading.email}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 mb-6 rounded-lg font-medium border ${
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
              or sign up with email
            </div>
          </div>

          <form onSubmit={handleEmailSignUp} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-3 py-3 rounded-lg border focus:ring-2 focus:outline-none ${
                    errors.email ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-pink-500'
                  }`}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading.email || loading.google}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-3 rounded-lg border focus:ring-2 focus:outline-none ${
                    errors.password ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-pink-500'
                  }`}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading.email || loading.google}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400 hover:text-gray-500" />
                  ) : (
                    <FaEye className="text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-3 rounded-lg border focus:ring-2 focus:outline-none ${
                    errors.confirmPassword ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-pink-500'
                  }`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading.email || loading.google}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="text-gray-400 hover:text-gray-500" />
                  ) : (
                    <FaEye className="text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            <label className="flex items-center mt-4">
              <input 
                type="checkbox" 
                checked={isHost} 
                onChange={() => setIsHost(!isHost)}
                className="rounded text-pink-500"
                disabled={loading.email || loading.google}
              />
              <span className="ml-2">I want to list my property as a host</span>
            </label>

            <button
              type="submit"
              disabled={loading.email || loading.google}
              className={`w-full flex justify-center items-center py-3 px-4 rounded-lg font-medium text-white ${
                loading.email || loading.google ? 'bg-pink-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700'
              }`}
            >
              {loading.email ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                "Sign Up with Email"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-500">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-pink-600 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}