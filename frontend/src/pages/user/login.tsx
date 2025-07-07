import { useState } from "react";
import { useUserAuthStore } from "../../store/userAuthStore";
import { UserLoginData } from "../../types/userAuth";
import Link from "next/link";
import { useRouter } from "next/router";

export default function LoginUserPage() {
  const { login, isLoading, error } = useUserAuthStore();
  const router = useRouter();

  const [form, setForm] = useState<UserLoginData>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await login(form);

    if (!error) {
      router.push("/user/jobs");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Candidate Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        <p className="text-center text-sm mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/user/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
