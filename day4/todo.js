import express from "express";

const app = express();

app.use(express.json());


let todos = [
    { id: 1, title: "Study Node", completed: true },
    { id: 2, title: "Solve Problems", completed: true },
    { id: 3, title: "Finish Tasks", completed: false },
];


app.get("/todos", async (req, res) => {
    try {
        res.status(200).json({
            items: todos,
            total: todos.length,
        });
    } catch (error) {
        res.status(400).json({ error: "something went wrong" });
    }
});


app.get("/todos/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const todo = todos.find((t) => String(t.id) === id);

        if (!todo) {
            return res.status(404).json({ error: "Todo not found" });
        }

        res.status(200).json(todo);
    } catch (error) {
        res.status(400).json({ error: "something went wrong" });
    }
});


app.delete("/todos/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const index = todos.findIndex((t) => String(t.id) === id);

        if (index === -1) {
            return res.status(404).json({ error: "Todo not found" });
        }

        todos.splice(index, 1);
        res.sendStatus(204);
    } catch (error) {
        res.status(400).json({ error: "something went wrong" });
    }
});


const port = 3000;
app.listen(port, () => {
    console.log(`Todo app listening on port ${port}`);
});