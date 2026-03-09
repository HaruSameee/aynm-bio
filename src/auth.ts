// import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

// import { db } from "@/db";
// import { accounts, sessions, users, verificationTokens } from "@/db/schema";

const allowedDiscordIds = new Set(
  (process.env.ALLOWED_DISCORD_IDS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  // adapter: DrizzleAdapter(db, {
  //   usersTable: users,
  //   accountsTable: accounts,
  //   sessionsTable: sessions,
  //   verificationTokensTable: verificationTokens,
  // }),
  secret: process.env.AUTH_SECRET,
  debug: true,
  trustHost: true,
  session: { strategy: "jwt" },
  logger: {
    error(error) {
      const authError = error as Error & { type?: string; cause?: unknown };

      console.error(
        "[AUTH ERROR CODE]",
        String(authError.type ?? authError.name ?? "UnknownAuthError"),
      );
      if ("cause" in authError) {
        console.error(
          "[AUTH ERROR CAUSE]",
          JSON.stringify(authError.cause, null, 2),
        );
        console.error("[AUTH ERROR CAUSE STR]", String(authError.cause));
      }
      console.error(
        "[AUTH ERROR FULL]",
        JSON.stringify(
          {
            name: authError.name,
            message: authError.message,
            stack: authError.stack,
            type: authError.type,
            cause: authError.cause,
          },
          null,
          2,
        ),
      );
    },
    warn(code) {
      console.warn("[AUTH WARN]", code);
    },
    debug(code, metadata) {
      console.log("[AUTH DEBUG]", code, JSON.stringify(metadata, null, 2));
    },
  },
  providers: [
    Discord({
      clientId: process.env.AUTH_DISCORD_ID ?? "",
      clientSecret: process.env.AUTH_DISCORD_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ account }) {
      console.log("[DEBUG] provider:", account?.provider);
      console.log("[DEBUG] providerAccountId:", account?.providerAccountId);
      console.log(
        "[DEBUG] ALLOWED_DISCORD_IDS raw:",
        process.env.ALLOWED_DISCORD_IDS,
      );
      console.log("[DEBUG] allowedIds set:", [...allowedDiscordIds]);
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
      }

      return session;
    },
  },
});
