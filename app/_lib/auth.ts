import { PrismaAdapter } from "@auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import { db } from "./prisma";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { Adapter } from "next-auth/adapters";

// O login simulado fica restrito ao desenvolvimento e usa sessao JWT.
const localAuthEnabled =
  process.env.NODE_ENV !== "production" &&
  process.env.NEXT_PUBLIC_LOCAL_AUTH_ENABLED === "true";

const providers = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

// Cria um usuario local persistente para pedidos funcionarem com as FKs do banco.
if (localAuthEnabled) {
  providers.push(
    CredentialsProvider({
      id: "local",
      name: "Desenvolvimento local",
      credentials: {},
      async authorize() {
        const email = "local@ddfoods.test";
        const name = "DD Foods Local User";
        const user = await db.user.upsert({
          where: { email },
          update: { name },
          create: { email, name },
        });

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  );
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  session: { strategy: localAuthEnabled ? "jwt" : "database" },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    },
    async session({ session, user, token }) {
      const userId = user?.id ?? token.sub;
      if (userId) session.user = { ...session.user, id: userId };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
