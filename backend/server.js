const { expressConfig } = require("./configure/config");
const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const server = express();

const PORT = expressConfig.PORT;

server.use(express.json());

server.use(cors());

// server.use(express.static(path.join(__dirname,"/../frontend/build")));

server.use("/api", require("./routes/api"));

// server.use("*", (req, res) => {
//   res.sendFile(path.join(`${__driname}/../frontend/build/index.html`));
// });

server.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
