import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";

const nav = [
  ["Overview", "/admin"],
  ["Designs", "/admin/designs"],
  ["Extensions", "/admin/extensions"],
  ["Portfolio", "/admin/portfolio"],
  ["Testimonials", "/admin/testimonials"],
  ["Media", "/admin/media"],
] as const;

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
          {nav.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
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
            <button type="submit" className="admin-signout">Sign out</button>
          </form>
        </div>
      </aside>

      <div className="admin-workspace">
        <header className="admin-topbar">
          <div>
            <span className="admin-topbar-label">Content workspace</span>
            <strong>nextgen-site</strong>
          </div>
          <a href="/" target="_blank" rel="noreferrer">View site ↗</a>
        </header>
        {children}
      </div>
    </div>
  );
}
