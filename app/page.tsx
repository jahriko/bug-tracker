import { getCurrentUser } from "@/lib/get-current-user"

export default async function LandingPage() {
  const user = await getCurrentUser()

  return (
    <div>
      <h1>Welcome to the landing page</h1>
      {user ? <p>Welcome, {user.name}</p> : <p>Not logged in</p>}
    </div>
  )
}
