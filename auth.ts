import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

const ADMIN_GITHUB_USER_ID = "512772";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "github") return false;

      const githubId = String(
        (profile as { id?: string | number } | undefined)?.id ??
        account.providerAccountId ??
        ""
      ).trim();

      if (githubId === ADMIN_GITHUB_USER_ID) return true;

      const adminLogin = process.env.ADMIN_GITHUB_LOGIN?.trim().toLowerCase();
      const githubLogin =
        typeof (profile as { login?: unknown } | undefined)?.login === "string"
          ? String((profile as { login: string }).login).trim().toLowerCase()
          : "";

      return Boolean(adminLogin && githubLogin && adminLogin === githubLogin);
    },
  },
});
