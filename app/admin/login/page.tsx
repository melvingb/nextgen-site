import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { GitHubSignInButton } from "./GitHubSignInButton";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ error?: string }>;
};

const errorMessages: Record<string, string> = {
  AccessDenied: "This GitHub account is not authorized to access the admin.",
  Configuration: "The sign-in service is temporarily misconfigured. Try again after the latest deployment finishes.",
  OAuthCallback: "GitHub returned an OAuth callback error. Please try again.",
  OAuthSignin: "GitHub sign-in could not be started. Please try again.",
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const session = await auth();
  const adminSession = session as (typeof session & { isAdmin?: boolean }) | null;

  if (session?.user && adminSession?.isAdmin) redirect("/admin");

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

        {error && (
          <div className="admin-auth-error" role="alert">
            {errorMessages[error] ?? "GitHub sign-in did not complete. Please try again."}
          </div>
        )}

        <GitHubSignInButton />

        <a className="admin-back-link" href="/">← Back to nextgen solutions</a>
      </section>
    </main>
  );
}
