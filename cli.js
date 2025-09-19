import fs from "fs/promises";

const data = await fs.readFile("./users.json", "utf-8");
let parsedData = JSON.parse(data);
console.log("🚀 ~ parsedData:", parsedData);
const [, , action, ...args] = process.argv;


function getNextId() {
    if (parsedData.length === 0) {
        return 1;
    }
    return parsedData[parsedData.length - 1].id + 1;
};


async function addUser(name) {
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
};


async function removeUser(id) {
    const userId = parseInt(id);
    const index = parsedData.findIndex((user) => user.id === userId);
    if (index === -1) {
        return console.error(`User with id ${userId} Not Found`)
    }

    const removed = parsedData.splice(index, 1);
    await fs.writeFile("./users.json", JSON.stringify(parsedData, null, 2));

    console.log("🚀 ~ User Removed:", removed);
}


function getall() {
    console.log("🚀 ~ Get All Users:", parsedData)
}


function getOne(id) {
    const userId = parseInt(id);
    const getUser = parsedData.find((user) => user.id === userId)

    if (!getUser) {
        return console.error(`User with id ${userId} Not Found`)
    };

    console.log("🚀 ~ User Found:", getUser);
};


async function editUser(id, newName) {
    const userId = parseInt(id);
    const updatedUser = parsedData.find((user) => user.id === userId)

    if (!updatedUser) {
        return console.error(`User with id ${userId} Not Found`)
    };

    updatedUser.name = newName;

    await fs.writeFile("./users.json", JSON.stringify(parsedData, null, 2));

    console.log("🚀 ~ User Updated:", updatedUser);


}



switch (action) {
    case "add":
        await addUser(args[0]);
        break;

    case "remove":
        await removeUser(args[0])
        break;

    case "getall":
        getall();
        break;

    case "getone":
        getOne(args[0]);
        break;

    case "edit":
        await editUser(args[0], args[1]);
        break;
        
    default:
        console.log("Unknown action.");
        break;
}

// add name -> unique id 
// remove id 
// edit id www




