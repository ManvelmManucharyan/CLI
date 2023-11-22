import express from 'express';

const app = express();

app.use("/", (req, res) => {
    res.json("Ap is working");
})

app.listen(8000, () => {
    console.log('App is listening on http://localhost:8000');
    
})