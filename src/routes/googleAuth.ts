import { FastifyInstance } from "fastify";
import fastifySecureSession from '@fastify/secure-session';
import fastifyPassport from '@fastify/passport';
import google from "passport-google-oauth20";
import 'dotenv/config'



export async function googleAuth(app: FastifyInstance){

app.register(fastifySecureSession,
    {
        secret: process.env.SECRET_KEY_GOOGLE,
        resave: false,
        saveUninitialized: true,
        cookie : {
            path: '/',
            secure: false
        }
    }
    )
app.register(fastifyPassport.initialize())
app.register(fastifyPassport.secureSession())

fastifyPassport.use('google', new google.Strategy({
    clientID: process.env.CLIENT_ID_GOOGLE,
    clientSecret: process.env.SECRET_KEY_GOOGLE,
    callbackURL: process.env.URL_GOOGLE,
}, function(accessToken, refreshToken, profile, cb){

    // INSERT YOUR DB FUNCTION HERE
    cb(null, profile)
}
))

fastifyPassport.registerUserDeserializer(async(user,req) => {
    return user
})

fastifyPassport.registerUserSerializer(async(user,req) => {
    return user
})

app.get('/google', async (req, res) => {
    res.send(`Seja bem-vindo ${req.user.displayName}`)
})

app.get('/failured', async (req, res) => {
    res.send('failured')
})

app.get('/auth/google/callback', 
    {
        preValidation: fastifyPassport.authenticate('google',{
            successRedirect: '/google',
            failureRedirect: '/failured',
            scope: ['profile']
        })
    },
    () => {})

app.get('/login', fastifyPassport.authenticate('google', {scope: ['profile']}) )

app.get('/logout', async (req, res) => {
    await req.session.delete()
    res.send({message: 'logout success'})
})

}