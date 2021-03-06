import bodyParser from "body-parser"
import cors from "cors"
import express, { NextFunction, Request, Response } from "express"
import path from "path"
import { corsUrl, environment } from "./config"
import { ApiError, InternalError, NotFoundError } from "./core/ApiError"
import Logger from "./core/Logger"
import './database' // initialize database
import routes from "./routes"

process.on("uncaughtException", (e:any) => {
    Logger.error(e)
})

// integrate certificate and key for TLS, created with Let's Encrypt
var fs = require('fs')
var https = require('https')
const CERT_DIR = path.join(process.cwd() + "/certificates/")
var privateKey  = fs.readFileSync(CERT_DIR + 'key.pem', 'utf8')
var certificate = fs.readFileSync(CERT_DIR + 'fullchain.pem', 'utf8')
var credentials = {key: privateKey, cert: certificate};

const app = express()

app.use(bodyParser.json({ limit: "10mb" }))
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }))
app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }))

// Routes
app.use("/", routes)

// catch 404 and forward to error handler
app.use((req, res, next) => next(new NotFoundError()))

// Middleware Error Handler
// next: NextFunction is needed, otherwise it doesnt work
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
        return ApiError.handle(err, res)
    }
    if (environment === "development") {
        Logger.error(err)
        return res.status(500).send(err.message)
    }
    return ApiError.handle(new InternalError(), res)
})

// start server to only respond to HTTPS requests to ensure data privacy
var httpsServer = https.createServer(credentials, app);

export default httpsServer