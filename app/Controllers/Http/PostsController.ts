import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PostsController {
  public async index({}: HttpContextContract) {
    return {hello: 'world'}
  }
}
