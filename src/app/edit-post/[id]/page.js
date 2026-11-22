"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Programming",
    description: "",
    status: "Open",
    solution: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("helpnest_user");
    const token = localStorage.getItem("helpnest_token");

    if (!savedUser || !token) {
      router.push("/login");
      return;
    }

    const currentUser = JSON.parse(savedUser);
    setUser(currentUser);

    const loadPost = async () => {
      try {
        const response = await fetch(
          `https://helpnest-server.onrender.com/posts/${id}`
        );

        const post = await response.json();

        if (!response.ok) {
          throw new Error(post.message || "Unable to load post");
        }

        if (post.authorEmail !== currentUser.email) {
          setMessage("You can only edit your own posts.");
          setLoading(false);
          return;
        }

        setFormData({
          title: post.title || "",
          category: post.category || "Programming",
          description: post.description || "",
          status: post.status || "Open",
          solution: post.solution || "",
        });
      } catch (error) {
        setMessage("Unable to load this post.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPost();
    }
  }, [id, router]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "status" && value === "Open"
        ? { solution: "" }
        : {}),
    }));

    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) return;

    if (
      formData.status === "Solved" &&
      !formData.solution.trim()
    ) {
      setMessage(
        "Please explain how the issue was solved before marking it as Solved."
      );
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("helpnest_token");

      const response = await fetch(
        `https://helpnest-server.onrender.com/posts/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formData.title,
            category: formData.category,
            description: formData.description,
            status: formData.status,
            solution:
              formData.status === "Solved"
                ? formData.solution.trim()
                : "",
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("helpnest_user");
        localStorage.removeItem("helpnest_token");

        router.push("/login");
        return;
      }

      if (!response.ok) {
        setMessage(data.message || "Failed to update post");
        return;
      }

      router.push("/my-posts");
    } catch (error) {
      setMessage("Unable to connect to the server.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      <Navbar />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
          <Link
            href="/my-posts"
            className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
          >
            ← Back to My Posts
          </Link>

          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
            Update your post
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
            Edit Help Request
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
            Update your help request and share the solution when your
            issue has been resolved.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white py-20 text-center">
            <p className="font-semibold text-slate-600">
              Loading your post...
            </p>
          </div>
        ) : message && !formData.title ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-16 text-center">
            <h2 className="text-xl font-bold text-red-700">
              Unable to edit post
            </h2>

            <p className="mt-3 text-sm text-red-600">
              {message}
            </p>

            <Link
              href="/my-posts"
              className="mt-6 inline-block rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white"
            >
              Return to My Posts
            </Link>
          </div>
        ) : (
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
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
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
                    <option value="Programming">
                      Programming
                    </option>
                    <option value="Study Help">
                      Study Help
                    </option>
                    <option value="Career">
                      Career
                    </option>
                    <option value="Technology">
                      Technology
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="status"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Status
                  </label>

                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  >
                    <option value="Open">Open</option>
                    <option value="Solved">Solved</option>
                  </select>
                </div>
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
                  rows={9}
                  required
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              {formData.status === "Solved" && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 sm:p-6">
                  <div className="mb-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
                      Resolution
                    </p>

                    <h2 className="mt-2 text-xl font-bold text-slate-950">
                      How was this solved?
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Share the solution so other community members with
                      the same problem can learn from it.
                    </p>
                  </div>

                  <label
                    htmlFor="solution"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Solution
                  </label>

                  <textarea
                    id="solution"
                    name="solution"
                    value={formData.solution}
                    onChange={handleChange}
                    placeholder="Explain what fixed the problem, which steps you followed, or what you learned..."
                    rows={7}
                    required={formData.status === "Solved"}
                    className="w-full resize-none rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />

                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    This solution will be visible to other HelpNest
                    members once the post is marked as solved.
                  </p>
                </div>
              )}

              {message && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {message}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                <Link
                  href="/my-posts"
                  className="rounded-xl border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving Changes..."
                    : formData.status === "Solved"
                      ? "Save Solution"
                      : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}