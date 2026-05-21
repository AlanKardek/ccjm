import NextAuth from "next-auth";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { DEMO_EMAIL, DEMO_FALLBACK_ID, getPersistedDemoUser } from "@/lib/demo-user";
import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    }),
    Credentials({
      name: "Email e senha",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const email = parsed.data.email.toLowerCase();
        const isDemo = email === DEMO_EMAIL && parsed.data.password === "montello123";

        let user = null;
        try {
          user = await prisma.user.findUnique({
            where: { email },
          });
        } catch {
          if (isDemo) {
            return {
              id: DEMO_FALLBACK_ID,
              email,
              name: "Leitora Maranhense",
              image: "https://api.dicebear.com/9.x/initials/svg?seed=Leitora%20Maranhense",
              username: "leitora",
            };
          }
          return null;
        }

        if (!user && isDemo) {
          return {
            id: DEMO_FALLBACK_ID,
            email,
            name: "Leitora Maranhense",
            image: "https://api.dicebear.com/9.x/initials/svg?seed=Leitora%20Maranhense",
            username: "leitora",
          };
        }

        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          username: user.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      if ((token.id === DEMO_FALLBACK_ID || token.email === DEMO_EMAIL) && token.email === DEMO_EMAIL) {
        const demo = await getPersistedDemoUser();
        if (demo) {
          token.id = demo.id;
          token.name = demo.name;
          token.picture = demo.image;
          token.username = demo.username;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id);
        session.user.username =
          typeof token.username === "string" ? token.username : session.user.email?.split("@")[0];
      }
      return session;
    },
  },
});
