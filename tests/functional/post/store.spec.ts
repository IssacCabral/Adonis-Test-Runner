import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('Posts store', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return (() => Database.rollbackGlobalTransaction())
  })
  
  // Esse teste, verifica que quando tentamos criar um novo post sem passar os parâmetros
  // nos é retornado erro e status code = 422
  test('make sure post title and content is provided', async ({client, route}) => {
    const response = await client.post(route('PostsController.store'))

    // response.dumpBody()

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {message: 'required validation failed', field: 'title'}
      ]
    })
  })

  test('create a new post with title and content', async ({client, route}) => {
    const response = await client.post(route('PostsController.store')).form({
      title: 'Hello World',
      content: 'Hello, everyone. This is testing 101'
    })

    response.assertStatus(201)
    // response.assertBodyContains({
    //   errors: [
    //     {message: 'required validation failed', field: 'title'}
    //   ]
    // })
  })

})
