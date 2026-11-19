"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    "All",
    "Programming",
    "Study Help",
    "Career",
    "Technology",
  ];

  const statuses = ["All", "Open", "Solved"];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const categoryFromUrl = params.get("category");
    const statusFromUrl = params.get("status");

    if (
      categoryFromUrl &&
      categories.includes(categoryFromUrl)
    ) {
      setCategory(categoryFromUrl);
    }

    if (statusFromUrl && statuses.includes(statusFromUrl)) {
      setStatus(statusFromUrl);
    }
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/posts",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load posts");
        }

        const data = await response.json();

        setPosts(data);
      } catch (error) {
        setError("Unable to load posts right now.");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const updateUrl = (newCategory, newStatus) => {
    const params = new URLSearchParams();

    if (newCategory !== "All") {
      params.set("category", newCategory);
    }

    if (newStatus !== "All") {
      params.set("status", newStatus);
    }

    const queryString = params.toString();

    window.history.replaceState(
      {},
      "",
      queryString ? `/posts?${queryString}` : "/posts"
    );
  };

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;

    setCategory(selectedCategory);
    updateUrl(selectedCategory, status);
  };

  const handleStatusChange = (event) => {
    const selectedStatus = event.target.value;

    setStatus(selectedStatus);
    updateUrl(category, selectedStatus);
  };

  const filteredPosts = useMemo(() => {
    let result = [...posts];

    if (category !== "All") {
      result = result.filter(
        (post) => post.category === category
      );
    }

    if (status !== "All") {
      result = result.filter(
        (post) => (post.status || "Open") === status
      );
    }

    if (search.trim()) {
      const searchText = search.toLowerCase();

      result = result.filter(
        (post) =>
          post.title?.toLowerCase().includes(searchText) ||
          post.description
            ?.toLowerCase()
            .includes(searchText) ||
          post.solution
            ?.toLowerCase()
            .includes(searchText)
      );
    }

    result.sort((a, b) => {
      const firstDate = new Date(a.createdAt).getTime();
      const secondDate = new Date(b.createdAt).getTime();

      if (sortOrder === "oldest") {
        return firstDate - secondDate;
      }

      return secondDate - firstDate;
    });

    return result;
  }, [posts, search, category, status, sortOrder]);

  const pageHeading =
    status === "Solved"
      ? "Solved Issues"
      : status === "Open"
        ? "Open Help Requests"
        : category !== "All"
          ? `${category} Posts`
          : "Community Posts";

  const pageDescription =
    status === "Solved"
      ? "Browse issues that have already been solved and learn from the solutions shared by the community."
      : status === "Open"
        ? "Browse active help requests that still need support from the community."
        : "Browse help requests and solved issues shared by the HelpNest community.";

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      <Navbar />

      {/* PAGE HEADER */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
              {status === "Solved"
                ? "Community solutions"
                : "Community discussions"}
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              {status === "Solved"
                ? "Learn from solved issues"
                : "Explore questions from the community"}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              {pageDescription}
            </p>
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto_auto]">
            <input
              type="text"
              placeholder={
                status === "Solved"
                  ? "Search solved issues or solutions..."
                  : "Search by title or description..."
              }
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />

            <select
              value={category}
              onChange={handleCategoryChange}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === "All"
                    ? "All Categories"
                    : item}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={handleStatusChange}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500"
            >
              <option value="All">All Status</option>
              <option value="Open">Open</option>
              <option value="Solved">Solved</option>
            </select>

            <select
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(event.target.value)
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500"
            >
              <option value="newest">
                Newest First
              </option>

              <option value="oldest">
                Oldest First
              </option>
            </select>
          </div>
        </div>
      </section>

      {/* POSTS */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">
              {pageHeading}
            </h2>

            {!loading && !error && (
              <p className="mt-1 text-sm text-slate-500">
                {filteredPosts.length}{" "}
                {filteredPosts.length === 1
                  ? status === "Solved"
                    ? "solved issue"
                    : "post"
                  : status === "Solved"
                    ? "solved issues"
                    : "posts"}{" "}
                found
              </p>
            )}
          </div>

          {status !== "Solved" && (
            <Link
              href="/add-post"
              className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Ask for Help
            </Link>
          )}
        </div>

        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <p className="font-semibold text-slate-700">
              Loading posts...
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
            <p className="font-semibold text-red-600">
              {error}
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          filteredPosts.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                {status === "Solved" ? "✓" : "?"}
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                {status === "Solved"
                  ? "No solved issues yet"
                  : "No posts found"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {status === "Solved"
                  ? "When community members solve their issues and share the solution, they will appear here."
                  : "Try changing your search, category, or status filter."}
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          filteredPosts.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => {
                const isSolved =
                  post.status === "Solved";

                return (
                  <article
                    key={post._id}
                    className={`flex min-h-[310px] flex-col rounded-2xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg ${
                      isSolved
                        ? "border-emerald-200 hover:border-emerald-300"
                        : "border-slate-200 hover:border-emerald-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {post.category || "General"}
                      </span>

                      <span
                        className={`text-xs font-semibold ${
                          isSolved
                            ? "text-sky-600"
                            : "text-amber-600"
                        }`}
                      >
                        {isSolved
                          ? "Solved"
                          : "Open"}
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-bold leading-7 text-slate-950">
                      {post.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                      {post.description}
                    </p>

                    {isSolved && post.solution && (
                      <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-600">
                          Solution
                        </p>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-700">
                          {post.solution}
                        </p>
                      </div>
                    )}

                    <div className="mt-auto border-t border-slate-100 pt-4">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            {post.author ||
                              "HelpNest User"}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {post.createdAt
                              ? new Date(
                                  post.createdAt
                                ).toLocaleDateString()
                              : ""}
                          </p>
                        </div>

                        <Link
                          href={`/posts/${post._id}`}
                          className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
                        >
                          {isSolved
                            ? "View Solution →"
                            : "View Details →"}
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>
            <span className="font-bold text-slate-900">
              HelpNest
            </span>

            <span className="ml-2">
              Community support made simple.
            </span>
          </p>

          <p>
            © 2026 HelpNest • Built by Somaya Akter
          </p>
        </div>
      </footer>
    </main>
  );
}