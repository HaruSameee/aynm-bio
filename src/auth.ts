import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

import { db } from "@/db";
import { accounts, sessions, users, verificationTokens } from "@/db/schema";

const allowedDiscordIds = new Set(
  (process.env.ALLOWED_DISCORD_IDS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  secret: process.env.AUTH_SECRET,
  debug: true,
  trustHost: true,
  logger: {
    error(code, ...message) {
      console.error("[AUTH ERROR CODE]", code);
      console.error("[AUTH ERROR DETAIL]", JSON.stringify(message, null, 2));
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
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }

      return session;
    },
  },
});
