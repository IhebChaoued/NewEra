import { useState } from "react";
import { useCompanyAuthStore } from "../../store/companyAuthStore";
import { CompanyRegisterData } from "../../types/companyAuth";

/**
 * Company registration page.
 * Contains a form to register a company with optional logo upload.
 */
export default function RegisterCompanyPage() {
  // Pull auth state and register function from store
  const { register, isLoading, error } = useCompanyAuthStore();

  // Form state for controlled inputs
  const [form, setForm] = useState<CompanyRegisterData>({
    name: "",
    email: "",
    password: "",
    logo: null,
  });

  /**
   * Handles text input changes.
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handles file input changes.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({
      ...prev,
      logo: file,
    }));
  };

  /**
   * Handles form submit.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await register(form);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Register Company</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Company Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full"
        />
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
        <input
          type="file"
          name="logo"
          onChange={handleFileChange}
          className="border p-2 w-full"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>

      {/* Display error if present */}
      {error && <p className="text-red-500 mt-4">{String(error)}</p>}
    </div>
  );
}
