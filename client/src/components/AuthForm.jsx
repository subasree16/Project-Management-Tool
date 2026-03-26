import { Link } from "react-router-dom";

function AuthForm({
  title,
  subtitle,
  fields,
  values,
  onChange,
  onSubmit,
  error,
  loading,
  submitLabel,
  footerText,
  footerLink,
  footerLabel,
}) {
  return (
    <div className="auth-layout">
      <div className="auth-hero">
        <span className="eyebrow">PROJECT OPERATIONS</span>
        <h1>Organize work with a cleaner workflow.</h1>
        <p>
          Manage projects, plan execution, track deadlines, and keep delivery visible across a
          single dashboard.
        </p>
      </div>

      <form className="auth-card" onSubmit={onSubmit}>
        <div className="section-heading">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        {error ? <div className="alert error">{error}</div> : null}

        {fields.map((field) => (
          <label className="field" key={field.name}>
            <span>{field.label}</span>
            <input
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={values[field.name]}
              onChange={onChange}
              required={field.required}
            />
          </label>
        ))}

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Please wait..." : submitLabel}
        </button>

        <p className="auth-footer">
          {footerText} <Link to={footerLink}>{footerLabel}</Link>
        </p>
      </form>
    </div>
  );
}

export default AuthForm;

