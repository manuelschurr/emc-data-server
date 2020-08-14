import httpsServer from "./app"
import { port } from "./config"
import Logger from "./core/Logger"

httpsServer.listen(port, () => {
    Logger.info(`server running on port : ${port}`)
}).on("error", (e:any) => Logger.error(e))
