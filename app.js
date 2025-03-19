const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const { proxy } = require("rtsp-relay")(app);

dotenv.config();

const HOSTNAME = process.env.HOSTNAME || "localhost";
const PORT = process.env.PORT || 3000;
process.setMaxListeners(0);
app.use(cors());
app.ws("/api/stream", (ws, req) => {
  const rtsp = req.query.rtsp;
  const resolution = req.query.resolution || "2688x1520";
  const media = req.query.media || "";
  console.log(rtsp);
  console.log(resolution);
  console.log(media);
  console.log(`${rtsp}${media ? `?${media}` : ""}`);

  proxy({
    url: `${rtsp}${media ? `?${media}` : ""}`,
    verbose: true,
    transport: "tcp",
    additionalFlags: ["-s", resolution],
  })(ws);
});

app.listen(PORT, HOSTNAME, () => {
  console.log(`server running on port ${PORT}`);
});
