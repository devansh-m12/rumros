import NextAuth, { AuthOptions, DefaultSession, User } from 'next-auth';
import {db} from '@/lib/db/drizzle';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { JWTPayload, SignJWT, importJWK } from 'jose';
import { users } from './db/migrations/schema';
import { eq } from 'drizzle-orm';

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: string;
    } & DefaultSession["user"]
  }

  interface User {
    username: string;
    role: string;
    token?: string;
  }
}

export const generateJWT = async (payload: JWTPayload) => {
  const secret = process.env.JWT_SECRET || 'secret';

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
        username: { label: 'Username', type: 'text', placeholder: 'Enter your username' },
        password: { label: 'Password', type: 'password', placeholder: 'Enter your password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        try {
          const user = await db.query.users.findFirst({
            where: eq(users.username, credentials.username),
            columns: {
              id: true,
              username: true,
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
            username: user.username,
            role: user.role,
          });

          return {
            id: user.id,
            name: user.displayName || user.username,
            username: user.username,
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
        session.user.username = token.username as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.user_id = user.id;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);