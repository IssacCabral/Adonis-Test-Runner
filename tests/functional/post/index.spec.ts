import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Post from 'App/Models/Post'
import { UserFactory } from 'Database/factories'

test.group('Posts index', (group) => {
  // função que roda antes de cada teste dentro desse grupo
  group.each.setup(async () => {
    /**
     * Aqui vamos iniciar uma globalTransaction
     * o que elas fazem é colocar automaticamente todas as suas
     * query de banco de dados dentro de uma transaction e quando terminamos
     * com o nosso teste, é dado um rollback. Ou seja, antes de cada teste
     * que estamos iniciando a transaction, e dando rollback após o término do teste
     */

    await Database.beginGlobalTransaction()

    return (() => Database.rollbackGlobalTransaction())
  })

  test('return empty list when there are no posts', async ({ client }) => {
    const response = await client.get('/posts')

    response.assertStatus(200)
    response.assertBodyContains({ meta: { total: 0 }, data: [] })
  })

  test('get a paginated list of existing posts', async ({ client, assert }) => {
    await UserFactory.query().with('posts', 40).create()

    const response = await client.get('/posts')
    response.assertBodyContains({ meta: { total: 40, per_page: 20, current_page: 1 } })

    const posts = await Post.query().limit(20).preload('author').orderBy('id', 'desc')

    // esperar que contenha o subconjunto de posts criados
    assert.containsSubset(response.body().data, posts.map((row) => row.toJSON()))
  })
})
