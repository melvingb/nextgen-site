import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) redirect("/admin/login");

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-sidebar-brand" href="/admin">
          <span className="brand-mark">N</span>
          <span>nextgen <b>admin</b></span>
        </Link>

        <nav className="admin-nav" aria-label="Admin navigation">
          <Link href="/admin">Overview</Link>
          <span>Designs <small>soon</small></span>
          <span>Extensions <small>soon</small></span>
          <span>Portfolio <small>soon</small></span>
          <span>Testimonials <small>soon</small></span>
          <span>Media <small>soon</small></span>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user">
            {session.avatarUrl ? (
              <img src={session.avatarUrl} alt="" />
            ) : (
              <span className="admin-user-avatar">A</span>
            )}
            <div>
              <strong>{session.login}</strong>
              <span>GitHub authenticated</span>
            </div>
          </div>

          <form action="/api/auth/signout" method="post">
            <button type="submit" className="admin-signout">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="admin-workspace">
        <header className="admin-topbar">
          <div>
            <span className="admin-topbar-label">Content workspace</span>
            <strong>nextgen-site</strong>
          </div>
          <a href="/" target="_blank" rel="noreferrer">
            View site ↗
          </a>
        </header>

        {children}
      </div>
    </div>
  );
}
