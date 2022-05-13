import cors from 'cors'
const express = require('express')
const app = express()
app.use(cors())
const port = 3001

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
