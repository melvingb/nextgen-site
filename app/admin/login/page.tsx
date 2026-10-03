import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const session = await auth();
  if (session?.user) redirect("/admin");

  const { error } = await searchParams;

  return (
    <main className="admin-auth-page">
      <section className="admin-login-card">
        <div className="admin-brand">
          <span className="brand-mark">N</span>
          <span>nextgen <b>admin</b></span>
        </div>
        <p className="admin-kicker">Private workspace</p>
        <h1>Manage nextgen without leaving GitHub.</h1>
        <p className="admin-login-copy">Sign in with the GitHub account authorized to manage this site.</p>

        {error && <div className="admin-auth-error" role="alert">Access was not granted. Make sure you are using the configured GitHub account.</div>}

        <form action={async () => {
          "use server";
          await signIn("github", { redirectTo: "/admin" });
        }}>
          <button className="admin-github-button" type="submit">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M12 .7a11.5 11.5 0 0 0-3.64 22.4c.58.1.8-.25.8-.56v-2.2c-3.25.7-3.94-1.38-3.94-1.38-.53-1.35-1.3-1.71-1.3-1.71-1.06-.73.08-.72.08-.72 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.4-1.27.74-1.56-2.6-.3-5.33-1.3-5.33-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.18A10.9 10.9 0 0 1 12 6.14c.98 0 1.97.13 2.89.39 2.2-1.5 3.16-1.18 3.16-1.18.62 1.58.23 2.75.11 3.04.73.8 1.18 1.83 1.18 3.08 0 4.4-2.74 5.38-5.35 5.67.42.36.79 1.08.79 2.18v3.23c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" />
            </svg>
            Continue with GitHub
          </button>
        </form>

        <a className="admin-back-link" href="/">← Back to nextgen solutions</a>
      </section>
    </main>
  );
}
