import { FastifyInstance } from 'fastify'
import axios from 'axios'
import 'dotenv/config'

export async function gitHubAuth(app: FastifyInstance){
      
    app.get("/api/auth/callback", async (req, res) => {
        const ir = new URL(process.env.URL_GITHUB+req.url)
        const code = ir.searchParams.get('code')

        const accesstokenResponse = await axios.post('https://github.com/login/oauth/access_token',null, {
            params: {
                client_id: process.env.CLIENT_ID_GITHUB,
                client_secret: process.env.CLIENT_SECRET_GITHUB,
                code,
            },
            headers: {
                Accept: 'application/json',
            },
        })

        const { access_token } = accesstokenResponse.data;

        const userInfo = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })

//*******************************INSERT YOUR DB FUNCTION HERE******************************


        const token = app.jwt.sign({
            name: userInfo.data.name,
            avatar_url: userInfo.data.avatarurl,
        }, {
            sub: String(userInfo.data.id),
            expiresIn: '1 day'
        })

    return res.send('Bem Vindo ' + userInfo.data.name + '   |    token = ' + token)
    })
}