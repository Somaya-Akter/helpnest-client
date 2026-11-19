"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function AddPostPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [checkingUser, setCheckingUser] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    category: "Programming",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("helpnest_user");
    const token = localStorage.getItem("helpnest_token");

    if (!savedUser || !token) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(savedUser));
    setCheckingUser(false);
  }, [router]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) return;

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("helpnest_token");

      const response = await fetch("http://localhost:5000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          description: formData.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to create post");
        return;
      }

      router.push("/posts");
    } catch (error) {
      setMessage("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  if (checkingUser) {
    return (
      <main className="min-h-screen bg-[#f8fafc]">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <p className="font-semibold text-slate-600">
            Checking your account...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      <Navbar />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
            Ask the community
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
            What do you need help with?
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
            Describe your problem clearly so other members can understand what
            you need and offer useful guidance.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-6 py-12 lg:grid-cols-[1fr_300px] lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Post title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Example: Need help understanding MongoDB CRUD"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Category
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                <option value="Programming">Programming</option>
                <option value="Study Help">Study Help</option>
                <option value="Career">Career</option>
                <option value="Technology">Technology</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Explain your problem, what you have tried, and where you are stuck..."
                required
                rows={9}
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            {message && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {message}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/posts"
                className="rounded-xl border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Publishing..." : "Publish Help Request"}
              </button>
            </div>
          </form>
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold text-emerald-600">
              Posting as
            </p>

            <h3 className="mt-2 font-bold text-slate-900">
              {user?.name}
            </h3>

            <p className="mt-1 break-all text-sm text-slate-500">
              {user?.email}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-950 p-6 text-white">
            <p className="text-sm font-semibold text-emerald-400">
              Make your question useful
            </p>

            <div className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
              <p>✓ Use a clear and specific title.</p>
              <p>✓ Explain where you are stuck.</p>
              <p>✓ Add enough detail for others to understand.</p>
              <p>✓ Choose the most relevant category.</p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}