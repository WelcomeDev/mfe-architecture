import cors from "cors";
import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(cors());
app.use(bodyParser.json());

const port = 9001;

const license = {
    id: `${Date.now()}`,
    dueDate: new Date().toISOString(),
}
const exisingKeys = ['one', 'two', 'three']

app.get('/license', (req, res) => {
    res.status(200)
       .json(license);
})

app.get('/license/has-option', (req, res) => {
    const {option} = req.query;
    res.status(200)
       .json({isIncluded: exisingKeys.includes(option)})
})

app.post('/license/refresh', (req, res) => {
    license.dueDate = new Date().toISOString();
    res.status(200);
})

app.post('/license/check-validity', async (req, res) => {
    const {key} = await req.body;
    res.status(200)
       .json({isValid: !!key})
})

app.listen(port, () => {
    console.log(`Bff started on port ${port}`);
})
