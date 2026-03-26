import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";
import { login } from "../services/authService";

function LoginPage() {
  const navigate = useNavigate();
  const { saveAuth } = useAuth();
  const [values, setValues] = useState({ email: "", password: "" });
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
      const data = await login(values);
      saveAuth(data);
      navigate("/");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Welcome back"
      subtitle="Login to access your workspace dashboard."
      fields={[
        { name: "email", label: "Email", type: "email", placeholder: "you@example.com", required: true },
        { name: "password", label: "Password", type: "password", placeholder: "Enter password", required: true },
      ]}
      values={values}
      onChange={handleChange}
      onSubmit={handleSubmit}
      error={error}
      loading={loading}
      submitLabel="Login"
      footerText="Need an account?"
      footerLink="/signup"
      footerLabel="Create one"
    />
  );
}

export default LoginPage;

