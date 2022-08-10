import Route from '@ioc:Adonis/Core/Route'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

Route.get('/healthy', async ({ response }: HttpContextContract) => {
  await Database.report().then(({ health }) => {
    const { healthy, message } = health

    if (healthy) return response.ok({ message })

    return response.status(500).json({ message })
  })
})

Route.resource('/posts', 'PostsController').middleware({
  store: ['auth']
})

Route.resource('/users', 'UsersController')

Route.post('/login', 'AuthController.login')

Route.get('/', async () => {
  return { hello: 'world' }
})
