"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";

const categoryList = [
  {
    name: "Programming",
    icon: "💻",
  },
  {
    name: "Study Help",
    icon: "📚",
  },
  {
    name: "Career",
    icon: "🎯",
  },
  {
    name: "Technology",
    icon: "⚡",
  },
];

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("https://helpnest-server.onrender.com/posts", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load posts");
        }

        const data = await response.json();

        setPosts(data);
      } catch (error) {
        setError("Unable to load community data right now.");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });
  }, [posts]);

  const openPosts = useMemo(() => {
    return sortedPosts.filter(
      (post) => (post.status || "Open") === "Open"
    );
  }, [sortedPosts]);

  const solvedPosts = useMemo(() => {
    return sortedPosts.filter(
      (post) => post.status === "Solved"
    );
  }, [sortedPosts]);

  const latestOpenPost = openPosts[0] || null;

  const latestOpenPosts = openPosts.slice(0, 3);

  const categories = categoryList.map((category) => {
    const count = posts.filter(
      (post) => post.category === category.name
    ).length;

    return {
      ...category,
      count,
      href: `/posts?category=${encodeURIComponent(category.name)}`,
    };
  });

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-100 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-sky-100 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <div className="mb-5 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              A community built around helping each other
            </div>

            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              A better place to ask,{" "}
              <span className="text-emerald-600">
                share and solve.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              HelpNest connects people who need guidance with people willing to
              help. Share a problem, discover useful discussions and grow
              together through real community support.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/add-post"
                className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700"
              >
                Ask for Help
              </Link>

              <Link
                href="/posts"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                Explore Discussions
              </Link>
            </div>

            {/* REAL STATS */}
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-5">
              <div>
                <p className="text-2xl font-bold text-slate-950">
                  {loading ? "—" : posts.length}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Total posts
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-950">
                  {loading ? "—" : openPosts.length}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Open requests
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-950">
                  {loading ? "—" : solvedPosts.length}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Solved issues
                </p>
              </div>
            </div>
          </div>

          {/* LATEST OPEN REQUEST ONLY */}
          <div className="relative">
            <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 shadow-2xl sm:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-emerald-400">
                    Community activity
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-white">
                    {latestOpenPost
                      ? "Latest help request"
                      : "No open requests right now"}
                  </h2>
                </div>

                <div className="h-3 w-3 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.8)]" />
              </div>

              {loading ? (
                <div className="rounded-2xl bg-white px-6 py-16 text-center">
                  <p className="font-semibold text-slate-600">
                    Loading latest activity...
                  </p>
                </div>
              ) : error ? (
                <div className="rounded-2xl bg-white px-6 py-12 text-center">
                  <p className="font-semibold text-slate-700">
                    Community activity is temporarily unavailable.
                  </p>
                </div>
              ) : latestOpenPost ? (
                <div className="rounded-2xl bg-white p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {latestOpenPost.category || "General"}
                    </span>

                    <span className="text-xs text-slate-400">
                      {formatDate(latestOpenPost.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    {latestOpenPost.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                    {latestOpenPost.description}
                  </p>

                  <div className="mt-6 flex items-end justify-between gap-4 border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {latestOpenPost.author || "HelpNest User"}
                      </p>

                      <p className="text-xs text-slate-400">
                        Asked for help
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-600">
                        Open
                      </span>

                      <Link
                        href={`/posts/${latestOpenPost._id}`}
                        className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-white px-6 py-14 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-xl font-bold text-emerald-600">
                    ✓
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    All current issues are solved
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    There are no open help requests at the moment.
                  </p>

                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Link
                      href="/add-post"
                      className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                      Ask for Help
                    </Link>

                    {solvedPosts.length > 0 && (
                      <Link
                        href="/posts?status=Solved"
                        className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                      >
                        View Solved Issues
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* TOPICS + SOLVED ISSUES */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Explore topics
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Find the right space for your question
            </h2>

            <p className="mt-3 text-slate-600">
              Browse real community posts by topic or learn from solved issues.
            </p>
          </div>

          <Link
            href="/posts"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Browse all posts →
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group block rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl transition group-hover:bg-emerald-50">
                {category.icon}
              </div>

              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold transition group-hover:text-emerald-700">
                  {category.name}
                </h3>

                <span className="text-emerald-600 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100">
                  →
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                {loading
                  ? "Loading..."
                  : `${category.count} ${
                      category.count === 1 ? "post" : "posts"
                    }`}
              </p>
            </Link>
          ))}

          {/* SOLVED ISSUES CARD */}
          <Link
            href="/posts?status=Solved"
            className="group block rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6 transition hover:-translate-y-1 hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-lg"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl">
              ✓
            </div>

            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-slate-900 transition group-hover:text-emerald-700">
                Solved Issues
              </h3>

              <span className="text-emerald-600 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100">
                →
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              {loading
                ? "Loading..."
                : `${solvedPosts.length} ${
                    solvedPosts.length === 1
                      ? "solved issue"
                      : "solved issues"
                  }`}
            </p>
          </Link>
        </div>
      </section>

      {/* LATEST OPEN HELP REQUESTS ONLY */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Latest help requests
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                See what the community still needs help with
              </h2>

              <p className="mt-3 text-slate-600">
                Only open questions that are still waiting for a solution appear
                here.
              </p>
            </div>

            {openPosts.length > 0 && (
              <Link
                href="/posts?status=Open"
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                View all open requests →
              </Link>
            )}
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-[#fbfcfd] px-6 py-16 text-center">
              <p className="font-semibold text-slate-600">
                Loading latest requests...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
              <p className="font-semibold text-red-600">
                {error}
              </p>
            </div>
          ) : latestOpenPosts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/40 px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl font-bold text-emerald-600">
                ✓
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                No open help requests
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Every current issue has been solved. New open questions will
                automatically appear here.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/add-post"
                  className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Ask a Question
                </Link>

                {solvedPosts.length > 0 && (
                  <Link
                    href="/posts?status=Solved"
                    className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                  >
                    Browse Solved Issues
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              {latestOpenPosts.map((post) => (
                <article
                  key={post._id}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-[#fbfcfd] p-6 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {post.category || "General"}
                    </span>

                    <span className="text-xs font-semibold text-amber-600">
                      Open
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-bold leading-7 text-slate-950">
                    {post.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">
                    {post.description}
                  </p>

                  <div className="mt-6 border-t border-slate-200 pt-4">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          {post.author || "HelpNest User"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {formatDate(post.createdAt)}
                        </p>
                      </div>

                      <Link
                        href={`/posts/${post._id}`}
                        className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
            Simple by design
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Get help in three simple steps
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            [
              "01",
              "Share your problem",
              "Explain what you need help with clearly.",
            ],
            [
              "02",
              "Find the solution",
              "Use helpful guidance to solve the issue.",
            ],
            [
              "03",
              "Share what worked",
              "Mark it solved and help others learn from your solution.",
            ],
          ].map(([number, title, text]) => (
            <div
              key={number}
              className="rounded-2xl border border-slate-200 bg-white p-7 transition hover:border-emerald-200 hover:shadow-md"
            >
              <span className="text-sm font-bold text-emerald-600">
                {number}
              </span>

              <h3 className="mt-4 text-xl font-bold">
                {title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-slate-950 px-6 py-14 text-center sm:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Your question matters
          </p>

          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold text-white sm:text-4xl">
            Ask for help, solve the issue and help the next person.
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">
            HelpNest turns community questions and real solutions into useful
            knowledge for everyone.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/add-post"
              className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Ask for Help
            </Link>

            <Link
              href="/posts?status=Solved"
              className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-white transition hover:border-slate-500 hover:bg-slate-900"
            >
              Browse Solved Issues
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <span className="font-bold text-slate-900">
              HelpNest
            </span>

            <span className="ml-2">
              Community support made simple.
            </span>
          </div>

          <p>© 2026 HelpNest • Built by Somaya Akter</p>
        </div>
      </footer>
    </main>
  );
}
