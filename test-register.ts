import { registerUser } from "./app/actions/credentials"
async function test() {
  const result = await registerUser({
    firstName: "Test",
    lastName: "User",
    email: "test1@example.com",
    password: "password123"
  })
  console.log(result)
}
test()
