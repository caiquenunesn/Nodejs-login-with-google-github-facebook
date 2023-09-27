import fastify from "fastify";
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import fs from 'fs';
import path from 'path';


import { googleAuth } from './routes/googleAuth'
import { gitHubAuth } from "./routes/githubAuth";

const app = fastify()



app.register(cors, {
    origin: true
})

app.register(googleAuth)
app.register(gitHubAuth)

app.get('/', async (req, res) => {
    const indexStr = fs.readFileSync(path.join(__dirname, '../index.html'))
    res.type('text/html')
    return indexStr
})

app.register(jwt, {
    secret: 'secret_key_here'
})

app.listen({ port: 3000, /*host: '0.0.0.0.0'*/}).then(() => console.log('serving running...'))