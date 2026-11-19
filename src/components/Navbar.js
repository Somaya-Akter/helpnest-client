"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("helpnest_user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("helpnest_token");
    localStorage.removeItem("helpnest_user");

    setUser(null);
    router.push("/");
    router.refresh();
  };

  const navLinkClass = (path) => {
    const isActive =
      path === "/"
        ? pathname === "/"
        : pathname === path || pathname.startsWith(`${path}/`);

    return `font-semibold transition ${
      isActive
        ? "text-emerald-600"
        : "text-slate-700 hover:text-emerald-600"
    }`;
  };

  return (
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

            <p className="text-xs font-medium text-slate-500">
              Ask. Help. Grow.
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-8 text-sm md:flex">
          <Link href="/" className={navLinkClass("/")}>
            Home
          </Link>

          <Link href="/posts" className={navLinkClass("/posts")}>
            Explore
          </Link>

          <Link
            href="/add-post"
            className={navLinkClass("/add-post")}
          >
            Ask for Help
          </Link>

          {user && (
            <Link
              href="/my-posts"
              className={navLinkClass("/my-posts")}
            >
              My Posts
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold text-slate-900">
                  {user.name}
                </p>

                <p className="text-xs font-medium text-slate-500">
                  {user.email}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:block"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Join HelpNest
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}