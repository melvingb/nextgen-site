import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

const ADMIN_GITHUB_USER_ID = "512772";

const githubClientId = process.env.AUTH_GITHUB_ID?.trim() ?? "";
const githubClientSecret = process.env.AUTH_GITHUB_SECRET?.trim() ?? "";
const authSecret = process.env.AUTH_SECRET?.trim() ?? "";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: authSecret,
  providers: [
    GitHub({
      clientId: githubClientId,
      clientSecret: githubClientSecret,
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  logger: {
    error(error) {
      console.error("[nextgen-auth]", error);
    },
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === "github") {
        const githubId = String(
          (profile as { id?: string | number } | undefined)?.id ??
            account.providerAccountId ??
            ""
        ).trim();

        token.isAdmin = githubId === ADMIN_GITHUB_USER_ID;
        token.githubId = githubId;
      }

      return token;
    },
    async session({ session, token }) {
      (session as typeof session & { isAdmin?: boolean; githubId?: string }).isAdmin =
        token.isAdmin === true;
      (session as typeof session & { isAdmin?: boolean; githubId?: string }).githubId =
        typeof token.githubId === "string" ? token.githubId : undefined;

      return session;
    },
  },
});
