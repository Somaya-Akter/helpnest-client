"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function MyPostsPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("helpnest_user");
    const token = localStorage.getItem("helpnest_token");

    if (!savedUser || !token) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(savedUser));

    const loadPosts = async () => {
      try {
        const response = await fetch("https://helpnest-server.onrender.com/my-posts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("helpnest_user");
          localStorage.removeItem("helpnest_token");

          router.push("/login");
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load posts");
        }

        setPosts(data);
      } catch (error) {
        setMessage("Unable to load your posts.");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [router]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("helpnest_token");

      const response = await fetch(
        `https://helpnest-server.onrender.com/posts/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
        throw new Error(data.message || "Delete failed");
      }

      setPosts((previousPosts) =>
        previousPosts.filter((post) => post._id !== id)
      );
    } catch (error) {
      setMessage("Failed to delete the post.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      <Navbar />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Your dashboard
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
                My Posts
              </h1>

              <p className="mt-3 text-slate-600">
                Manage the help requests you have shared with the community.
              </p>
            </div>

            <Link
              href="/add-post"
              className="rounded-xl bg-emerald-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              + Create New Post
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {user && (
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">Signed in as</p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              {user.name}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {user.email}
            </p>
          </div>
        )}

        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
            <p className="font-semibold text-slate-600">
              Loading your posts...
            </p>
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
            {message}
          </div>
        )}

        {!loading && posts.length === 0 && !message && (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
              +
            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              You have not posted anything yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Share your first question with the HelpNest community and get
              help from others.
            </p>

            <Link
              href="/add-post"
              className="mt-6 inline-block rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Ask for Help
            </Link>
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="space-y-5">
            {posts.map((post) => (
              <article
                key={post._id}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-emerald-200 hover:shadow-md sm:p-7"
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {post.category || "General"}
                      </span>

                      <span
                        className={`text-xs font-semibold ${
                          post.status === "Solved"
                            ? "text-sky-600"
                            : "text-amber-600"
                        }`}
                      >
                        {post.status || "Open"}
                      </span>
                    </div>

                    <h2 className="mt-4 text-xl font-bold text-slate-950">
                      {post.title}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                      {post.description}
                    </p>

                    {post.createdAt && (
                      <p className="mt-4 text-xs text-slate-400">
                        Posted on{" "}
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/posts/${post._id}`}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      View
                    </Link>

                    <Link
                      href={`/edit-post/${post._id}`}
                      className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(post._id)}
                      className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
