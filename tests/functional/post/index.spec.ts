import { test } from '@japa/runner'

test.group('Posts index', () => {
    test('return empty list when there are no posts', async ({client}) => {
      const response = await client.get('/posts')

      response.assertStatus(200)
      response.assertBodyContains({meta: {total: 0}, data: []})
    })
    
    // test('get a paginated list of existing posts', async ({client}) => {
    //   const response = await client.get('/posts')

    //   response.
    // })
})
