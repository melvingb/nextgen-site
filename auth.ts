import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "github") return false;

      const adminLogin = process.env.ADMIN_GITHUB_LOGIN?.trim().toLowerCase();
      const githubLogin = typeof (profile as { login?: unknown })?.login === "string"
        ? String((profile as { login: string }).login).trim().toLowerCase()
        : "";

      return Boolean(adminLogin && githubLogin && adminLogin === githubLogin);
    },
  },
});
