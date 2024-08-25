import * as http from "node:http";

let counter = 0;

const server = http.createServer((req, res) => {
  res.writeHead(
    200,
    { "Content-Type": "application/json" },
    { "access-control-allow-origin": "*" }
  );
  setTimeout(() => {
    res.end(
      JSON.stringify({
        count: ++counter,
      })
    );
  }, 3000);
});

server.listen(3000).on("listening", () => {
  console.log("server is running on port 3000");
});
