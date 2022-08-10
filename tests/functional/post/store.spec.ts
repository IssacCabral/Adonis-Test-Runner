import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'

test.group('Posts store', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return (() => Database.rollbackGlobalTransaction())
  })

  test('user must be logged in before creating the post', async ({ client, route }) => {
    const response = await client.post(route('PostsController.store')).form({
      title: 'Hello World',
      content: 'Hello, everyone. This is testing 101'
    })

    response.assertStatus(401)
    response.assertBodyContains({
      errors: [
        { message: 'E_UNAUTHORIZED_ACCESS: Unauthorized access' }
      ]
    })
  })

  // Esse teste, verifica que quando tentamos criar um novo post sem passar os parâmetros
  // nos é retornado erro e status code = 422
  test('make sure post title and content is provided', async ({ client, route }) => {
    // vamos criar um usuário para que façamos a requisição a rota com ele autenticado
    const user = await UserFactory.query().create()
    const response = await client.post(route('PostsController.store')).loginAs(user)

    // response.dumpBody()

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        { message: 'required validation failed', field: 'title' }
      ]
    })
  })

  test('create a post with title and content', async ({ client, route }) => {
    const user = await UserFactory.query().create()
    const response = await client.post(route('PostsController.store')).loginAs(user).form({
      title: 'Hello World',
      content: 'Hello, everyone. This is testing 101'
    })

    response.assertStatus(201)
    response.assertBodyContains({
      data: {
        title: 'Hello World',
        content: 'Hello, everyone. This is testing 101',
        user_id: user.id
      }
    })

  })

})
