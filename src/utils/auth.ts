import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/utils/db";
import { isPasswordValid } from "@/utils/hash";

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
              username: { label: "Username", type: "text" },
              password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
              // Add logic here to look up the user from the credentials supplied
              const userDoc = await db.findOne({username: credentials?.username},{collection: 'users'})
              const user = userDoc.document
                      // Check if user exists
              if (!user) {
                return null;
              }

              // Validate password
              const isPasswordMatch = await isPasswordValid(
              credentials?.password as string,
              user.password
              );

              if (!isPasswordMatch) {
              return null;
              }

                // Any object returned will be saved in `user` property of the JWT
                return {
                  id: user._id,
                  username: user.username,
                  role: user.role
                }
            }
          })
      // ...add more providers here
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: 'jwt' as const,
      maxAge: 30 * 24 * 60 * 60, // 30 Days
    },
    callbacks: {
      jwt: async ({ token, user }: any) => {
          user && (token.user = user)
          return token
      },
      session: async ({ session, token }: any) => {
          session.user = token.user
          return session
      }
  }
  }