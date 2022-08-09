import { test } from '@japa/runner'

test('healthy mysql connection', async ({ client }) => {
  const response = await client.get('/healthy')

  response.assertStatus(200)
  response.assertBodyContains({ message: "All connections are healthy", age: 2 })
})
