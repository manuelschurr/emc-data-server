const fs = require("fs");

module.exports = {
  devServer: {
    port: 8080,
    https: {
      key: fs.readFileSync("./certificates/key.pem"),
      cert: fs.readFileSync("./certificates/cert.pem"),
    },
    allowedHosts: ["wifo1-29.bwl.uni-mannheim.de"],
  },
};
