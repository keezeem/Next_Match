import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { Role } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      profileComplete: boolean
      role: Role
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string
    profileComplete: boolean
    role: Role
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    profileComplete: boolean
    role: Role
  }
}
