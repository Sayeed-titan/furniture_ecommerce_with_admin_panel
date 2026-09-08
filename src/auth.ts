import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Trust the deployment host (Vercel/custom domain) so admin login works in
  // production without an UntrustedHost error, on any platform.
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      id: "admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.adminUser.findUnique({
          where: { email },
          include: { role: true },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          roleId: user.roleId,
          roleName: user.role.name,
          userType: "admin",
        };
      },
    }),
    Credentials({
      id: "customer",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const customer = await prisma.customer.findUnique({ where: { email } });
        if (!customer || !customer.passwordHash) return null;

        const valid = await bcrypt.compare(password, customer.passwordHash);
        if (!valid) return null;

        return {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          userType: "customer",
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.roleId = (user as { roleId?: string }).roleId;
        token.roleName = (user as { roleName?: string }).roleName;
        token.userType = (user as { userType?: string }).userType;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        (session.user as { id?: string }).id = token.sub;
        (session.user as { roleId?: string }).roleId = token.roleId as string | undefined;
        (session.user as { roleName?: string }).roleName = token.roleName as string | undefined;
        (session.user as { userType?: string }).userType = token.userType as string | undefined;
      }
      return session;
    },
  },
});
