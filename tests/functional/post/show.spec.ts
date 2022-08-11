import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { PostFactory } from 'Database/factories'

test.group('Post show', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return (() => Database.rollbackGlobalTransaction())
  })

  test('return 404 when test does not exists', async ({client, route}) => {
    const response = await client.get(route('PostsController.show', {id: 1}))

    response.assertStatus(404)
  })

  // esse teste não está passando
  test('get post by id', async ({client, route}) => {
    const post = await PostFactory.query().with('author').create()

    const response = await client.get(route('PostsController.show', {id: post.id}))

    console.log({data: post.toJSON()})
    console.log('-----------------------')
    console.log(response.body())
    response.assertStatus(200)
    response.assertBodyContains({data: post.toJSON()})

  })
})
