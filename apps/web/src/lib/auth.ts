import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { JWTPayload, SignJWT, importJWK } from "jose";
import { SessionStrategy } from "next-auth";
import prisma from "@repo/db/client";

const generateJWT = async (payload: JWTPayload) => {
  const secret = process.env.JWT_SECRET || "secret";

  const jwk = await importJWK({ k: secret, alg: "HS256", kty: "oct" });

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("365d")
    .sign(jwk);

  return jwt;
};

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "name", type: "text", placeholder: "your name" },
        email: { label: "email", type: "text", placeholder: "your email" },
        password: {
          label: "password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials: any, req) {
        try {
          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          const userDb = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
            select: {
              id: true,
              image: true,
              name: true,
              email: true,
              password: true,
              role: true,
              collegeId: true,
            },
          });
          if (
            userDb &&
            userDb.password &&
            (await bcrypt.compare(credentials.password, userDb.password))
          ) {
            const jwt = await generateJWT({
              id: userDb.id,
            });
            await prisma.user.update({
              where: {
                id: userDb.id,
              },
              data: {
                token: jwt,
              },
            });

            return {
              id: userDb.id,
              name: userDb.name,
              email: userDb.email,
              image: userDb.image,
              token: jwt,
            };
          } else {
            const createdUser = await prisma.user.create({
              data: {
                name: credentials.name,
                email: credentials.email,
                password: hashedPassword,
              },
            });
            const jwt = await generateJWT({
              id: createdUser.id,
            });
            await prisma.user.update({
              where: {
                id: createdUser.id,
              },
              data: {
                token: jwt,
              },
            });
            return {
              id: createdUser.id,
              name: createdUser.name,
              email: createdUser.email,
              token: jwt,
            };
          }
        } catch (e) {
          console.error(e);
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "secr3t",
  pages: {
    signIn: "/auth",
  },
  session: { strategy: "jwt" as SessionStrategy },
  callbacks: {
    async signIn({ account, profile }: any) {
      if (account.provider == "google") {
        let userDb = await prisma.user.findUnique({
          where: {
            email: profile.email,
          },
        });
        if (!userDb) {
          userDb = await prisma.user.create({
            data: {
              id: profile.sub,
              name: profile.name,
              image: profile.picture,
              email: profile.email,
            },
          });
        }
        return {
          id: userDb.id,
          name: userDb.name,
          email: userDb.email,
          image: userDb.image,
        };
      }
    },
    async session({ session, token }: any) {
      const user = await prisma.user.findUnique({
        where: {
          id: token.sub,
        },
      });

      if (session) {
        session.accessToken = token.accessToken;
        session.user.id = token.sub;
        session.user.role = user?.role;
      }
      return session;
    },
  },
};
