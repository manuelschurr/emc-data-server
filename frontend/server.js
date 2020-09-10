const https = require("https");
const fs = require("fs");
server = https
  .createServer(
    {
      key: fs.readFileSync("./certificates/key.pem"),
      cert: fs.readFileSync("./certificates/server.cert"),
    },
    app
  )
  .listen(port);
