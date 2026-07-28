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
      const userEmail = auth?.user?.email

      const isOnAdmin = nextUrl.pathname.startsWith("/admin")
      const isSuperAdmin = userEmail === "b.subburoyal@gmail.com"

      if (isOnAdmin) {
        if (!isLoggedIn) return false // Redirect to login
        if (role !== "ADMIN" && !isSuperAdmin) return Response.redirect(new URL(role === "CLIENT" ? "/client-dashboard" : "/user-dashboard", nextUrl))
        return true
      }

      if (isOnDashboard) {
        if (!isLoggedIn) return false // Redirect to login
        if (!role && !isSuperAdmin) return Response.redirect(new URL("/onboarding", nextUrl))
        
        if (role === "ADMIN" || isSuperAdmin) return Response.redirect(new URL("/admin", nextUrl))

        if (nextUrl.pathname.startsWith("/client-dashboard") && role !== "CLIENT") {
           return Response.redirect(new URL("/user-dashboard", nextUrl))
        }
        if (nextUrl.pathname.startsWith("/user-dashboard") && role !== "FREELANCER") {
           return Response.redirect(new URL("/client-dashboard", nextUrl))
        }
        return true
      } else if (isLoggedIn) {
        if (isOnOnboarding && (role || isSuperAdmin)) {
           if (role === "ADMIN" || isSuperAdmin) return Response.redirect(new URL("/admin", nextUrl))
           return Response.redirect(new URL(role === "CLIENT" ? "/client-dashboard" : "/user-dashboard", nextUrl))
        }
        if (nextUrl.pathname === "/login") {
           if (!role && !isSuperAdmin) return Response.redirect(new URL("/onboarding", nextUrl))
           if (role === "ADMIN" || isSuperAdmin) return Response.redirect(new URL("/admin", nextUrl))
           return Response.redirect(new URL(role === "CLIENT" ? "/client-dashboard" : "/user-dashboard", nextUrl))
        }
      } else {
        // Not logged in
        if (isOnOnboarding) {
          return Response.redirect(new URL("/login", nextUrl))
        }
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
