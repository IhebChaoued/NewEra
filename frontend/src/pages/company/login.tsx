import { useState } from "react";
import { useCompanyAuthStore } from "../../store/companyAuthStore";
import { CompanyLoginData } from "../../types/companyAuth";

/**
 * Company login page.
 * Contains a form to log in a company.
 */
export default function LoginCompanyPage() {
  // Pull auth state and login function from store
  const { login, isLoading, error } = useCompanyAuthStore();

  // Form state for controlled inputs
  const [form, setForm] = useState<CompanyLoginData>({
    email: "",
    password: "",
  });

  /**
   * Handles text input changes.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handles form submit.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await login(form);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Login Company</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Display error if present */}
      {error && <p className="text-red-500 mt-4">{String(error)}</p>}
    </div>
  );
}
