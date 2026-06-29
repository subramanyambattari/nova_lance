import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith("/client-dashboard") || nextUrl.pathname.startsWith("/user-dashboard")
      const isOnOnboarding = nextUrl.pathname.startsWith("/onboarding")
      // @ts-ignore
      const role = auth?.user?.role as string | undefined

      if (isOnDashboard) {
        if (!isLoggedIn) return false // Redirect to login
        if (!role) return Response.redirect(new URL("/onboarding", nextUrl))
        
        if (nextUrl.pathname.startsWith("/client-dashboard") && role !== "CLIENT") {
           return Response.redirect(new URL("/user-dashboard", nextUrl))
        }
        if (nextUrl.pathname.startsWith("/user-dashboard") && role !== "FREELANCER") {
           return Response.redirect(new URL("/client-dashboard", nextUrl))
        }
        return true
      } else if (isLoggedIn) {
        if (isOnOnboarding && role) {
           return Response.redirect(new URL(role === "CLIENT" ? "/client-dashboard" : "/user-dashboard", nextUrl))
        }
        if (nextUrl.pathname === "/login" || nextUrl.pathname === "/") {
           if (!role) return Response.redirect(new URL("/onboarding", nextUrl))
           return Response.redirect(new URL(role === "CLIENT" ? "/client-dashboard" : "/user-dashboard", nextUrl))
        }
      } else {
        // Allow public access to root "/"
      }
      return true
    },
    session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        // @ts-ignore
        session.user.role = token.role as string | undefined
      }
      return session
    },
  },
  providers: [], // Add providers in auth.ts
} satisfies NextAuthConfig
