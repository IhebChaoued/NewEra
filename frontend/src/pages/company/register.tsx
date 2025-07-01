import { useRef, useState } from "react";
import { useCompanyAuthStore } from "../../store/companyAuthStore";
import { CompanyRegisterData } from "../../types/companyAuth";
import Link from "next/link";

/**
 * Company registration page.
 */
export default function RegisterCompanyPage() {
  const { register, isLoading, error } = useCompanyAuthStore();

  // Form state
  const [form, setForm] = useState<CompanyRegisterData>({
    name: "",
    email: "",
    password: "",
    logo: undefined,
  });

  // Ref to the file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle text changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || undefined;
    setForm((prev) => ({
      ...prev,
      logo: file,
    }));
  };

  // Remove selected logo
  const handleRemoveLogo = () => {
    setForm((prev) => ({
      ...prev,
      logo: undefined,
    }));

    // Clear the file input field visually
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submit registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create Company Account
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1 text-sm">
              Company Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Example Corp"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 text-sm">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 text-sm">
              Logo (optional)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              name="logo"
              onChange={handleFileChange}
              className="w-full border-gray-300 rounded px-3 py-2 text-white file:bg-gray-700 file:text-white file:border-0 file:py-2 file:px-4 file:rounded file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {form.logo && (
              <>
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {form.logo.name}
                </p>
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="mt-2 text-sm text-red-600 hover:underline"
                >
                  Remove Logo
                </button>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
        )}

        <p className="text-center text-sm mt-6 text-gray-700">
          Already have an account?{" "}
          <Link href="/company/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
