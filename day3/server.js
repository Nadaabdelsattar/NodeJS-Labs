import http from "http";
import fs from "fs/promises";
import { content } from "./main.js";

const PORT = 3000;

const cssContent = await fs.readFile("styles.css", "utf-8");

async function readUsers() {
  try {
    const users = await fs.readFile("users.json", "utf-8");
    return JSON.parse(users);
  } catch {
    return [];
  }
}

async function saveUsers(users) {
  await fs.writeFile("users.json", JSON.stringify(users, null, 2));
}

function getNextId(users) {
  if (users.length === 0) {
    return 1;
  }
  return users[users.length - 1].id + 1;
}

const server = http.createServer(async (req, res) => {
  console.log(req.url);
  const reg = new RegExp(/^\/users\/\d*$/);

  switch (req.method) {

    case "GET":
      switch (req.url) {
        case "/":
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(content("menna"));
          break;

        case "/styles.css":
          res.writeHead(200, { "Content-Type": "text/css" });
          res.end(cssContent);
          break;

        case "/users":
          const users = await readUsers();
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(users));
          break;

        default:
          if (reg.test(req.url)) {
            const id = parseInt(req.url.split('/')[2]);
            const usersList = await readUsers();
            const user = usersList.find(u => u.id === id);
            if (!user) {
              res.writeHead(404, { "content-type": "text/plain" });
              return res.end("NOT FOUND");
            }
            res.writeHead(200, { "content-type": "application/json" });
            res.end(JSON.stringify(user));
            break;
          }
          res.writeHead(404);
          res.end("<h1 style='color:red'> Error!</h1>");
          break;
      }
      break;


    case "POST":
      switch (req.url) {
        case "/users":
          let body = [];
          req
            .on("data", (chunk) => {
              body.push(chunk)
            })
            .on("end", async () => {
              try {
                body = Buffer.concat(body).toString();
                const user = JSON.parse(body);

                const users = await readUsers();
                user.id = getNextId(users);
                users.push(user);

                await saveUsers(users);

                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(JSON.stringify(user));
              } catch {
                res.writeHead(400);
                res.end("Invalid Data");
              }
            });
          break;

        default:
          res.writeHead(404);
          res.end("Not Found");
      }
      break;


    case "PUT":
      switch (true) {
        case reg.test(req.url):
          const id = parseInt(req.url.split("/")[2]);
          let body = [];
          req
            .on("data", (chunk) => {
              body.push(chunk)
            })
            .on("end", async () => {
              body = Buffer.concat(body).toString();

              const updatedData = JSON.parse(body);

              const users = await readUsers();
              const index = users.findIndex((u) => u.id === id);

              if (index === -1) {
                res.writeHead(404);
                return res.end("User Not Found");
              }

              users[index] = { ...users[index], ...updatedData };
              await saveUsers(users);

              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(users[index]));
            });
          break;

        default:
          res.writeHead(404);
          res.end("Not Found");
      }
      break;


    case "DELETE":
      switch (true) {
        case reg.test(req.url):
          const id = parseInt(req.url.split("/")[2]);
          const users = await readUsers();
          const newUsers = users.filter((u) => u.id !== id);

          if (newUsers.length === users.length) {
            res.writeHead(404);
            return res.end("User Not Found");
          }

          await saveUsers(newUsers);
          res.writeHead(200);
          res.end("User Deleted");
          break;

        default:
          res.writeHead(404);
          res.end("Not Found");
      }
      break;

    
    default:
      res.writeHead(405);
      res.end("Method Not Allowed");
  }
});

server.listen(PORT, "localhost", () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});