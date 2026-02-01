import NextAuth, { type DefaultSession } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { isTestEnvironment } from "@/lib/constants";
import { createOrGetGoogleUser } from "@/lib/db/queries";
import { authConfig } from "./auth.config";

export type UserType = "regular";

const ALLOWED_DOMAIN = "xyz.vc";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      type: UserType;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    type: UserType;
  }
}

// Build providers list - add test credentials only in test environment
const providers: Provider[] = [
  Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
    authorization: {
      params: {
        prompt: "consent",
        access_type: "offline",
        response_type: "code",
        hd: ALLOWED_DOMAIN, // Hint to Google to show only @xyz.vc accounts
      },
    },
  }),
];

// Add test credentials provider for Playwright tests only
if (isTestEnvironment) {
  providers.push(
    Credentials({
      id: "playwright",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        const email = credentials.email as string;
        // Only allow test emails in test environment
        if (!email.includes("@playwright.com")) return null;
        return {
          id: `test-${email}`,
          email,
          name: "Test User",
        };
      },
    })
  );
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers,
  callbacks: {
    async signIn({ user, account }) {
      // Allow test credentials in test environment
      if (account?.provider === "playwright" && isTestEnvironment) {
        return true;
      }
      // Only allow @xyz.vc domain emails for Google
      if (account?.provider === "google") {
        const email = user.email;
        if (!email || !email.endsWith(`@${ALLOWED_DOMAIN}`)) {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account, profile }) {
      // Handle test credentials
      if (account?.provider === "playwright" && isTestEnvironment && user) {
        const dbUser = await createOrGetGoogleUser(user.email as string);
        token.id = dbUser.id;
        token.type = "regular";
        return token;
      }
      // On Google sign-in, create or get the user from our database
      if (account?.provider === "google" && profile?.email) {
        const dbUser = await createOrGetGoogleUser(profile.email);
        token.id = dbUser.id;
        token.type = "regular";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.type = token.type;
      }
      return session;
    },
  },
});
