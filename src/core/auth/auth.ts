import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/core/db/prisma";
import { getAuthSecret } from "@/core/config/auth-secret";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        if (!email || !password) {
          return null;
        }

        const user = await prisma.adminUser.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        if (token.id) {
          const currentAdmin = await prisma.adminUser.findUnique({
            where: { id: String(token.id) },
            select: { email: true, name: true },
          });
          if (currentAdmin) {
            session.user.email = currentAdmin.email;
            session.user.name = currentAdmin.name ?? currentAdmin.email;
          }
        }
      }
      session.authIssuedAt = typeof token.iat === "number" ? token.iat : undefined;
      return session;
    },
  },
  secret: getAuthSecret(),
};
