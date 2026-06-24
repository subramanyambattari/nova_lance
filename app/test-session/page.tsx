import { auth } from "@/auth"

export default async function TestPage() {
  const session = await auth()
  return (
    <div className="p-10">
      <h1>Session Server Side</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}
