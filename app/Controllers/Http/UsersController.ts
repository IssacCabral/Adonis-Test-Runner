import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {schema, rules} from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class UsersController {
  public async index({}: HttpContextContract) {}

  public async store({request, response}: HttpContextContract) {
    const {email, full_name, password} = await request.validate({
      schema: schema.create({
        full_name: schema.string({trim: true}, [
          rules.maxLength(50),
          rules.minLength(3),
          rules.regex(/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g)
        ]),
        email: schema.string({trim: true}, [
          rules.maxLength(50),
          rules.minLength(8),
          rules.email(),
          rules.unique({table: 'users', column: 'email'})
        ]),
        
        password: schema.string({}, [rules.maxLength(50)])
      })
    })

    const user = new User()

    user.fill({
      email,
      full_name,
      password
    })

    await user.save()

    return response.created(user)
  }
}
