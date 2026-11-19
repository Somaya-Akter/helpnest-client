"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

export default function PostDetailsPage() {
  const params = useParams();
  const id = params.id;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadPost = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/posts/${id}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Post not found");
        }

        const data = await response.json();

        setPost(data);
      } catch (error) {
        setError("Unable to load this post.");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  const isSolved = post?.status === "Solved";

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      <Navbar />

      {/* TOP NAVIGATION */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
          <Link
            href={isSolved ? "/posts?status=Solved" : "/posts"}
            className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
          >
            {isSolved
              ? "← Back to Solved Issues"
              : "← Back to Discussions"}
          </Link>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        {loading && (
          <div className="rounded-3xl border border-slate-200 bg-white px-8 py-20 text-center shadow-sm">
            <p className="font-semibold text-slate-600">
              Loading discussion...
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-8 py-16 text-center">
            <h2 className="text-2xl font-bold text-red-700">
              Post unavailable
            </h2>

            <p className="mt-3 text-sm text-red-600">
              {error}
            </p>

            <Link
              href="/posts"
              className="mt-6 inline-block rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white"
            >
              Browse Posts
            </Link>
          </div>
        )}

        {!loading && !error && post && (
          <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {/* POST HEADER */}
            <div className="border-b border-slate-100 px-7 py-8 sm:px-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
                  {post.category || "General"}
                </span>

                <span
                  className={`rounded-full px-4 py-2 text-xs font-semibold ${
                    isSolved
                      ? "bg-sky-50 text-sky-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {isSolved ? "Solved" : "Open"}
                </span>
              </div>

              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
                {isSolved ? "Solved Issue" : "Help Request"}
              </p>

              <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">
                {post.title}
              </h1>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
                <p>
                  {isSolved ? "Shared by" : "Asked by"}{" "}
                  <span className="font-semibold text-slate-800">
                    {post.author || "HelpNest User"}
                  </span>
                </p>

                {post.createdAt && (
                  <p>{formatDate(post.createdAt)}</p>
                )}
              </div>
            </div>

            {/* ORIGINAL QUESTION */}
            <div className="px-7 py-10 sm:px-10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg">
                  ?
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
                    Original Question
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    The issue originally shared with the community.
                  </p>
                </div>
              </div>

              <p className="mt-6 whitespace-pre-line text-base leading-8 text-slate-700 sm:text-lg">
                {post.description}
              </p>
            </div>

            {/* SOLUTION */}
            {isSolved && post.solution && (
              <div className="border-t border-emerald-100 bg-emerald-50/60 px-7 py-10 sm:px-10">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-lg font-bold text-white shadow-sm">
                    ✓
                  </div>

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
                      Solution
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-slate-950">
                      How this issue was solved
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      This solution was shared so others facing the
                      same issue can learn from it.
                    </p>
                  </div>
                </div>

                <div className="mt-7 rounded-2xl border border-emerald-200 bg-white p-6 sm:p-7">
                  <p className="whitespace-pre-line text-base leading-8 text-slate-700">
                    {post.solution}
                  </p>
                </div>
              </div>
            )}

            {/* SOLVED WITHOUT SOLUTION FALLBACK */}
            {isSolved && !post.solution && (
              <div className="border-t border-slate-100 bg-slate-50 px-7 py-8 sm:px-10">
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <p className="font-semibold text-slate-900">
                    This issue is marked as solved.
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    A written solution has not been shared yet.
                  </p>
                </div>
              </div>
            )}

            {/* BOTTOM ACTION */}
            <div className="border-t border-slate-100 bg-slate-50 px-7 py-6 sm:px-10">
              {isSolved ? (
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-semibold text-slate-900">
                      Found this useful?
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Explore more solved issues and learn from real
                      community solutions.
                    </p>
                  </div>

                  <Link
                    href="/posts?status=Solved"
                    className="rounded-xl bg-emerald-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Browse More Solved Issues
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-semibold text-slate-900">
                      Can you help with this?
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Helpful community guidance can make a real
                      difference.
                    </p>
                  </div>

                  <Link
                    href="/posts"
                    className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                  >
                    Explore More Posts
                  </Link>
                </div>
              )}
            </div>
          </article>
        )}
      </section>

      {/* FOOTER */}
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