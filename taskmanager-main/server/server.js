import {app} from "./app.js";
import http from 'http'
import { setupSocket } from "./src/sockets/meetingSocket.js";

const server = http.createServer(app)
setupSocket(server)
const port = process.env.PORT || 5001;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
