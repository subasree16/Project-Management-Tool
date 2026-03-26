import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";
import { signup } from "../services/authService";

function SignupPage() {
  const navigate = useNavigate();
  const { saveAuth } = useAuth();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await signup(values);
      saveAuth(data);
      navigate("/");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Create account"
      subtitle="Set up your workspace and start organizing projects."
      fields={[
        { name: "name", label: "Full Name", type: "text", placeholder: "Your name", required: true },
        { name: "email", label: "Email", type: "email", placeholder: "you@example.com", required: true },
        { name: "password", label: "Password", type: "password", placeholder: "Minimum 6 characters", required: true },
      ]}
      values={values}
      onChange={handleChange}
      onSubmit={handleSubmit}
      error={error}
      loading={loading}
      submitLabel="Sign Up"
      footerText="Already have an account?"
      footerLink="/login"
      footerLabel="Login"
    />
  );
}

export default SignupPage;

