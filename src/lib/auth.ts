import NextAuth, { AuthOptions, DefaultSession, User } from 'next-auth';
import { db } from '@/lib/db';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { JWTPayload, SignJWT, importJWK } from 'jose';

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
    } & DefaultSession["user"]
  }

  interface User {
    email: string;
    role: string;
    token?: string;
  }
}

export const generateJWT = async (payload: JWTPayload) => {
  const secret = process.env.NEXTAUTH_SECRET || 'secret';

  const jwk = await importJWK({ k: secret, alg: 'HS256', kty: 'oct' });

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('365d')
    .sign(jwk);

  return jwt;
};

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'Enter your email' },
        password: { label: 'Password', type: 'password', placeholder: 'Enter your password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        try {
          const user = await db.user.findFirst({
            where: {
              email: credentials.email,
              deletedAt: null
            },
            select: {
              id: true,
              email: true,
              password: true,
              role: true,
              displayName: true,
            },
          });

          if (!user) {
            throw new Error("User doesn't exist");
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            throw new Error('Invalid credentials');
          }

          const jwt = await generateJWT({
            id: user.id,
            email: user.email,
            role: user.role,
          });

          return {
            id: user.id,
            name: user.displayName || user.email,
            email: user.email,
            role: user.role,
            token: jwt,
          };
        } catch (e: any) {
          console.error('Authentication error:', e);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.user_id) {
        session.user.id = token.user_id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.user_id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    redirect: async ({ url, baseUrl }) => {
      if (url === '/auth/login') return `${baseUrl}/u/dashboard`;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);