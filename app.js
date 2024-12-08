const express = require('express')
const app = express()
const port = 3000

const http = require("http")
const path = require('path')
// const { connected } = require('process')
const socket = require("socket.io")
const server = http.createServer(app)
const io = socket(server)

app.set("view engine" , "ejs")
// app.set(express.static(path.join(__dirname,"public")))
app.use(express.static('public'));

io.on("connection",(socket)=>
{
  socket.on("send-location",(data)=>
  {
    io.emit("recieve-location",{id:socket.id, ...data})
  })
  socket.on("disconnect",()=>
    {
      io.emit("user-disconnect" , socket.id)
    })
  console.log("connected")
})

app.get('/', (req, res) => {
  res.render('index')
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
