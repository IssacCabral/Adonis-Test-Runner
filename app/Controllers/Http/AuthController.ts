import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'

export default class AuthController {
    public async login({auth, request, response}: HttpContextContract){
        const {email, password} = request.all()

        const user = await User.query().where('email', email).preload('posts').first()

        try{
            const token = await auth.use('api').attempt(email, password, {
                //full_name: user?.full_name,
                expiresIn: Env.get('NODE_ENV') === 'development' ? '' : '30mins'
            })

            return {token, user}
        } catch(error){
            return response.unauthorized({message: 'Invalid credentials'})
        }
    }
}
