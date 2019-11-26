const app = require('express')();
const mongoose=require('mongoose');
const socketio = require('socket.io');
const BodyParser = require("body-parser");
const Router = require('./router')

var cors = require('cors');
app.use(cors())

const DATABASE_NAME = "Socket";
const CONNECTION_URL = `mongodb+srv://root:root@cluster0-92avx.gcp.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority`;
let PORT=process.env.PORT || 5000;


mongoose.connect(CONNECTION_URL, { useNewUrlParser: true,useUnifiedTopology: true })
mongoose.connection.on('connected', function(){
    console.log("Mongoose default connection is open to ");
});

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
const server = app.listen(PORT,()=>{console.log(`listing on port${PORT}`)});
const io = socketio.listen(server);
io.on('connection', socket => {
    console.log('User connected')
      socket.on('send msg',(data)=>{
          io.emit('resend msg',{data:data})
      })
    socket.on('resend msg',(data)=>{
      io.emit('send msg',{data:data})
    })
    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })
// app.use('/',(req,res)=>{
//     res.send(`!!!`);
// })


