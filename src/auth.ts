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
    error(code, ...message) {
      console.error("[AUTH ERROR CODE]", String(code));
      const err = message[0];
      if (err && typeof err === "object" && "cause" in err) {
        console.error("[AUTH ERROR CAUSE]", JSON.stringify(err.cause, null, 2));
        console.error("[AUTH ERROR CAUSE STR]", String(err.cause));
      }
      console.error("[AUTH ERROR FULL]", JSON.stringify(message, null, 2));
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
