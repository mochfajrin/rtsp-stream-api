const express = require("express");
const cors = require("cors");
const app = express();
const { proxy } = require("rtsp-relay")(app);

process.setMaxListeners(0);
app.use(cors());
app.ws("/api/stream", (ws, req) => {
  const rtsp = req.query.rtsp;
  const resolution = req.query.resolution;
  const media = req.query.media || "";
  console.log(rtsp);
  console.log(resolution);
  console.log(media);
  console.log(`${rtsp}${media ? `?${media}` : ""}`);

  proxy({
    url: `${rtsp}${media ? `?${media}` : ""}`,
    verbose: true,
    transport: "tcp",
    additionalFlags: ["-s", resolution || "1080x720"],
  })(ws);
});

app.listen(3000, "10.11.70.99", () => {
  console.log("server running on port 3000");
});
