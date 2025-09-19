import { Command } from "commander";
import fs from "fs/promises";

const program = new Command();


const data = await fs.readFile("./users.json", "utf-8");
let parsedData = JSON.parse(data);
console.log("🚀 ~ parsedData:", parsedData);


function getNextId() {
  if (parsedData.length === 0) {
    return 1;
  }
  return parsedData[parsedData.length - 1].id + 1;
};

program
  .command("add <name>")
  .description("Add a new user")
  .action(async (name) => {
    if (!name) {
      return console.error("You must enter a name")
    }

    const newUser = { id: getNextId(), name };

    if (Array.isArray(parsedData)) {
      parsedData.push(newUser);
    }
    else {
      parsedData = [parsedData, newUser];
    }

    await fs.writeFile("./users.json", JSON.stringify(parsedData, null, 2));

    console.log("🚀 ~ User added:", newUser);
  });



program
  .command("remove <id>")
  .description("Remove a user with id")
  .action(async (id) => {
    const userId = parseInt(id);
    const index = parsedData.findIndex((user) => user.id === userId);
    if (index === -1) {
      return console.error(`User with id ${userId} Not Found`)
    }

    const removed = parsedData.splice(index, 1);
    await fs.writeFile("./users.json", JSON.stringify(parsedData, null, 2));

    console.log("🚀 ~ User Removed:", removed);
  });


program
  .command("getall")
  .description("Get All Users")
  .action(() => console.log("🚀 ~ Get All Users:", parsedData));


program
  .command("getone <id>")
  .description("Get a user with id")
  .action((id) => {
    const userId = parseInt(id);
    const getUser = parsedData.find((user) => user.id === userId)

    if (!getUser) {
      return console.error(`User with id ${userId} Not Found`)
    };

    console.log("🚀 ~ User Found:", getUser);
  });


program
  .command("edit <id> <name>")
  .description("Edit a user name with id")
  .action(async (id, newName) => {
    const userId = parseInt(id);
    const updatedUser = parsedData.find((user) => user.id === userId)

    if (!updatedUser) {
      return console.error(`User with id ${userId} Not Found`)
    };

    updatedUser.name = newName;

    await fs.writeFile("./users.json", JSON.stringify(parsedData, null, 2));

    console.log("🚀 ~ User Updated:", updatedUser);
  });




program.parse(process.argv);
