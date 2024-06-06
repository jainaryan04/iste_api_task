import express from "express"
import pg from "pg"
import env from "dotenv";

const port=3000;
env.config();
const app=express();
const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  });
  db.connect();

app.get("/",async(req,res)=>{
    const data=await db.query("SELECT * from details");
    res.send(data.rows);
})
app.get("/getbyid",async(req,res)=>{
    const {id}=req.query
    const data=await db.query("SELECT * from details WHERE id=$1",[id]);
    if(data.rows)
    res.send(data.rows);
    else
    res.send("id does not exist");
})
app.post("/", async (req, res) => {
    const { id, name, reg, colour } = req.query;
    try {
        await db.query("INSERT INTO details (id, name, reg, colour) VALUES ($1, $2, $3, $4)", [id, name, reg, colour]);
        res.status(201).send("Data inserted")
    } catch (error) {
        console.error("Error inserting into database:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.patch("/",async(req,res)=>{
    const { id, name, reg, colour } = req.query;
    try {
        await db.query("UPDATE details SET name=$1,reg=$2,colour=$3 WHERE id=$4",[name,reg,colour,id])
        res.status(201).send("Data updated")
    } catch (error) {
        console.error("Error updating database:", error);
        res.status(500).send("Internal Server Error");
    }
})

app.delete("/",async(req,res)=>{
    const {id}=req.query;
    try {
        const result=await db.query("SELECT * from details WHERE id=$1",[id]);
        if(result.rows[0]){
            await db.query("DELETE from details WHERE id=$1",[id]);
            res.status(201).send("Entry deleted")
        }
        else{
            res.send("id does not exist")
        }
    } catch (error) {
        console.error("Error deleting entry:", error);
        res.status(500).send("Internal Server Error");
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });