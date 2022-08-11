import Database from '@ioc:Adonis/Lucid/Database'

import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'
import {file} from '@ioc:Adonis/Core/Helpers'

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

  test('create a post with cover image', async ({ client, route }) => {
    const user = await UserFactory.query().create()
    const {contents, name} = await file.generateJpg('800kb')
    /**
     * Esse método de fields faz uma solicitação de várias partes ao servidor e, em seguida,
     * podemos anexar também para que eu possa dizer que quero fazer upload de uma imagem de capa
     * 
     */
    const response = await client
      .post(route('PostsController.store'))
      .loginAs(user)
      .fields({
        title: 'Hello World',
        content: 'Hello, everyone. This is testing 101'
      })
      .file('cover_image', contents, {filename: name})
    
      
    // response.dumpBody()
      
    response.assertStatus(201)
    response.assertBodyContains({
      data: {
        title: 'Hello World',
        content: 'Hello, everyone. This is testing 101',
        user_id: user.id,
        cover_image: {
          mimeType: 'image/jpeg',
          extname: 'jpg'
        }
      }
    })

  })

  test('do not allow cover image bigger than 1mb', async ({ client, route }) => {
    const user = await UserFactory.query().create()
    const {contents, name} = await file.generateJpg('2mb')

    const response = await client
      .post(route('PostsController.store'))
      .loginAs(user)
      .fields({
        title: 'Hello World',
        content: 'Hello, everyone. This is testing 101'
      })
      .file('cover_image', contents, {filename: name})
    
      
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [{field: 'cover_image', message: 'File size should be less than 1MB'}]
    })
  
  })

})