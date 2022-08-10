import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {schema, rules} from '@ioc:Adonis/Core/Validator'
import Post from 'App/Models/Post'

export default class PostsController {
  public async index({request}: HttpContextContract) {
    const page = 1
    const {per_page} = request.qs() || 20

    return Post.query().preload('author').orderBy('id', 'desc').paginate(page, per_page)
  }

  public async store({request, response}: HttpContextContract) {
    const {title, content} = await request.validate({
      schema: schema.create({
        title: schema.string([rules.trim(), rules.escape()]),
        content: schema.string([rules.trim()])
      })
    })

    const post = await Post.create({title, content})

    return response.created(post)
  }
}
