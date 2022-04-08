const express =  require('express');
const app = express();
const cors = require('cors');


app.use(express.json());
app.use(cors());

const http = require('http').createServer(app);
const io = require('socket.io')(http);

let users = [];
io.on("connect",socket => {

    socket.on("joinRoom",data => {
        const user = {name:data.name,id:socket.id,room:data.room};
        const check = users.every(item => item.id !== socket.id);
        if(check){
            users.push(user);
            socket.join(user.room);
        }
        else{
            users.map( item => {
                if(item.id === socket.id){
                    if(item.room !== data.room){
                        socket.leave(item.room);
                        socket.join(data.room);
                        item.room = data.room;
                    }
                }
            })
        }
    })

    socket.on("createComment", data => {
        console.log(users)
        
        io.to(data.room).emit("sendCommentToClient",{name:data.name,comment:data.content});
    })
    socket.on("disconnect",() => {
        console.log("diconnected");
    })
})

const PORT = 5000;
http.listen(PORT, () =>console.log(`Your webite listen in  port 5000`));