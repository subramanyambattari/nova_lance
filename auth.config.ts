import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith("/client-dashboard") || nextUrl.pathname.startsWith("/freelancer-dashboard")
      const isOnOnboarding = nextUrl.pathname.startsWith("/onboarding")
      // @ts-ignore
      const role = auth?.user?.role as string | undefined

      if (isOnDashboard) {
        if (!isLoggedIn) return false // Redirect to login
        if (!role) return Response.redirect(new URL("/onboarding", nextUrl))
        
        if (nextUrl.pathname.startsWith("/client-dashboard") && role !== "CLIENT") {
           return Response.redirect(new URL("/freelancer-dashboard", nextUrl))
        }
        if (nextUrl.pathname.startsWith("/freelancer-dashboard") && role !== "FREELANCER") {
           return Response.redirect(new URL("/client-dashboard", nextUrl))
        }
        return true
      } else if (isLoggedIn) {
        if (isOnOnboarding && role) {
           return Response.redirect(new URL(role === "CLIENT" ? "/client-dashboard" : "/freelancer-dashboard", nextUrl))
        }
        if (nextUrl.pathname === "/login" || nextUrl.pathname === "/") {
           if (!role) return Response.redirect(new URL("/onboarding", nextUrl))
           return Response.redirect(new URL(role === "CLIENT" ? "/client-dashboard" : "/freelancer-dashboard", nextUrl))
        }
      }
      return true
    },
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        // @ts-ignore
        session.user.role = user.role
      }
      return session
    },
  },
  providers: [], // Add providers in auth.ts
} satisfies NextAuthConfig
