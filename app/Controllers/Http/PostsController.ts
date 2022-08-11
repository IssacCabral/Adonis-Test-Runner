import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {schema, rules} from '@ioc:Adonis/Core/Validator'
import Post from 'App/Models/Post'

export default class PostsController {
  public async index({request}: HttpContextContract) {
    const page = 1
    const {per_page} = request.qs() || 20

    return Post.query().preload('author').orderBy('id', 'desc').paginate(page, per_page)
  }

  public async store({request, response, auth}: HttpContextContract) {
    const {title, content, cover_image} = await request.validate({
      schema: schema.create({
        title: schema.string([rules.trim(), rules.escape()]),
        content: schema.string([rules.trim()]),
        cover_image: schema.file.optional({extnames: ['jpg', 'jpeg', 'png'], size: '1mb'})
      })
    })

    // const post = await Post.create({title, content})
    // post.$setRelated('author', auth.user!)
    const post = new Post()

    post.fill({
      title,
      content,
      userId: auth.user!.id,
      cover_image: cover_image ? Attachment.fromFile(cover_image) : null
    })

    await post.save()

    return response.created({data: post})
  }

  public async show({request, response}: HttpContextContract){
    const post = await Post.findOrFail(request.param('id'))
    await post.load('author')
    return {
      data: post
    }
  }
}
