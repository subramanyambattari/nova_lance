import { prisma } from "./lib/prisma"
async function check() {
  const users = await prisma.user.findMany({ orderBy: { id: 'desc' }, take: 5 })
  const accounts = await prisma.account.findMany({ orderBy: { id: 'desc' }, take: 5 })
  console.log("Users:", users)
  console.log("Accounts:", accounts)
}
check()
