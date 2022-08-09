import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Post from 'App/Models/Post'

export default class PostsController {
  public async index({}: HttpContextContract) {
    const page = 1
    const perPage = 20

    return Post.query().preload('author').paginate(page, perPage)
  }
}
