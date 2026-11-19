"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      localStorage.setItem("helpnest_token", data.token);
      localStorage.setItem("helpnest_user", JSON.stringify(data.user));

      router.push("/");
    } catch (error) {
      setMessage("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-lg font-bold text-white">
              H
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                HelpNest
              </h1>
              <p className="text-xs text-slate-500">Ask. Help. Grow.</p>
            </div>
          </Link>

          <Link
            href="/"
            className="text-sm font-semibold text-slate-600 transition hover:text-emerald-600"
          >
            Back to Home
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-12 px-6 py-12 lg:grid-cols-2 lg:px-8">
        <div className="hidden lg:block">
          <div className="max-w-lg">
            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              Welcome back
            </span>

            <h2 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-slate-950">
              Continue helping, learning and{" "}
              <span className="text-emerald-600">growing together.</span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Sign in to manage your posts, ask new questions and continue
              exploring helpful community discussions.
            </p>

            <div className="mt-10 rounded-3xl bg-slate-950 p-7 text-white shadow-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-400">
                HelpNest community
              </p>

              <h3 className="mt-3 text-2xl font-bold">
                Every useful answer can make someone&apos;s day easier.
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                Ask when you need help and share what you know when someone
                else needs it.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 sm:p-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Sign in
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Enter your account details to continue to HelpNest.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-20 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {message && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}