import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, Check, X as XIcon } from "lucide-react";
import logo from "../../img icon/logo.png";

const MIN_LENGTH = 8;

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= MIN_LENGTH) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

function getStrengthLabel(score: number) {
  switch (score) {
    case 5: return "Strong";
    case 4: return "Good";
    case 3: return "Medium";
    case 2: return "Weak";
    default: return "Very Weak";
  }
}

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const requirements = [
    {
      label: `At least ${MIN_LENGTH} characters`,
      test: (pw: string) => pw.length >= MIN_LENGTH,
    },
    {
      label: "Contains uppercase letter",
      test: (pw: string) => /[A-Z]/.test(pw),
    },
    {
      label: "Contains lowercase letter",
      test: (pw: string) => /[a-z]/.test(pw),
    },
    {
      label: "Contains a number",
      test: (pw: string) => /\d/.test(pw),
    },
    {
      label: "Contains special character",
      test: (pw: string) => /[^A-Za-z0-9]/.test(pw),
    },
  ];

  const score = getPasswordStrength(password);
  const strengthLabel = getStrengthLabel(score);
  const allValid = requirements.every(r => r.test(password));
  const canSubmit = allValid && password === confirm && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (!allValid) {
      setError("Password does not meet all requirements");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/users/reset-password/${token}`, { password });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-200">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-16" />
        </div>
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#b97b2a] via-[#cfae7b] to-[#cfc7b7] text-transparent bg-clip-text drop-shadow-md text-center mb-2">
          Reset your password
        </h2>
        <p className="text-gray-500 text-center mb-6 text-sm">Enter a new password below to change your password</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 text-xs mb-1 ml-2" htmlFor="new-password">New password</label>
            <div className="relative">
              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                className="w-full py-3 px-4 border border-gray-200 rounded-full pr-12 text-lg focus:outline-none focus:ring-2 focus:ring-[#b97b2a] bg-gray-50"
                placeholder="New password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                tabIndex={-1}
                onClick={() => setShowPassword(v => !v)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-[#3b82f6] text-xs mb-1 ml-2" htmlFor="confirm-password">Re-enter new password</label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                className="w-full py-3 px-4 border border-[#3b82f6] rounded-full pr-12 text-lg focus:outline-none focus:ring-2 focus:ring-[#b97b2a] bg-gray-50"
                placeholder="Re-enter new password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                tabIndex={-1}
                onClick={() => setShowConfirm(v => !v)}
                disabled={loading}
              >
                {showConfirm ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>
          {/* Password strength bar and checklist */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-700 text-sm">Password strength</span>
              <span className={`font-semibold text-sm ${score === 5 ? "text-green-600" : score >= 3 ? "text-yellow-600" : "text-red-600"}`}>{strengthLabel}</span>
            </div>
            <div className="flex gap-2 mb-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className={`h-2 rounded-full flex-1 ${score >= i ? (score === 5 ? "bg-green-500" : score >= 3 ? "bg-yellow-400" : "bg-red-500") : "bg-gray-300"}`}></div>
              ))}
            </div>
            <ul className="space-y-1 mt-2">
              {requirements.map((req, idx) => {
                const passed = req.test(password);
                return (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    {passed ? <Check className="text-green-600" size={18} /> : <XIcon className="text-red-500" size={18} />}
                    <span className={passed ? "text-gray-800" : "text-gray-500"}>{req.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-full text-lg font-semibold text-white bg-gradient-to-r from-[#b97b2a] via-[#cfae7b] to-[#cfc7b7] shadow-md hover:scale-105 transition-transform duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={!canSubmit}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            ) : null}
            {loading ? "Processing..." : "Continue"}
          </button>
        </form>
        {message && <p className="text-green-600 mt-4 text-center">{message}</p>}
        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
        <div className="flex justify-between mt-6 gap-4">
          <button
            type="button"
            className="w-1/2 py-2 rounded-full text-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors border border-gray-300"
            onClick={() => { setPassword(""); setConfirm(""); setError(""); setMessage(""); }}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="w-1/2 py-2 rounded-full text-lg font-semibold text-white bg-[#b97b2a] hover:bg-[#a86d22] transition-colors border border-[#b97b2a]"
            onClick={() => navigate("/")}
            disabled={loading}
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
