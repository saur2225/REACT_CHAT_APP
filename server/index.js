const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const routeUrls = require('./routes/routes');
const signUpTemplate = require('./models/SignUpModel');

dotenv.config();

mongoose.connect(process.env.DATABASE_ACCESS, () => {
    console.log('DATABASE CONNECTED !!');
})
// const http = require('http');

app.use(express.json());
app.use(cors());
app.use('/app', routeUrls);


var http = require( 'http' ).createServer( app );
var io = require( 'socket.io' )( http,  {
    cors: {
      origin: '*',
    }
  } );

const PORT = 9999;

http.listen( PORT, function() {
    console.log( 'listening on *:'+ PORT );
});

io.on( 'connection', function( socket ) {
    console.log( "a user has connected!" );
});



io.on("connection", (socket) => {
    console.log("User connected", socket.id);
    
    socket.on("join_room", async (data) => {
        console.log("joining", data);
        socket.join(data);
    })

    socket.on("user_selected", async (data) => {
        let allMessages = [];
        signUpTemplate.find({ email: data.email},  (err, docs) => {
            if (err){
                console.log(err);
            }
            else{
                if(docs.password === data.password){
                    res.send(docs);
                }
            }
        });
        signUpTemplate.find({}, function(err, users) {
            socket.emit("receive_all_Users", users);
        });
    })
    socket.on("all_messages", async(data) => {
        signUpTemplate.find({email: data.email}, (err, docs) => {
            if(err){
                console.log(err);
            }else{
                res.send(docs.messages);
            }
        })
    })
    socket.on("send_message", async (data) => { 
        // signUpTemplate.find({uniqueId: data.currentUser}, (err, docs) => {
        //     if(err){
        //         console.log(err);
        //     }else{
        //         console.log(docs);
        //         docs.push(data);
        //     }
        // })

        await signUpTemplate.updateOne({ uniqueId: data.currentUser }, {
            $push: {
               messages: data
            }
         })
         await signUpTemplate.updateOne({ uniqueId: data.friend }, {
            $push: {
               messages: data
            }
         })
        socket.to(data.room).emit("receive_message", data)
    })

    socket.on("disconnect", async () => {
        console.log("User disconnected", socket.id);
    })
})

// app.listen(9999, () => {
//     console.log('server running on PORT'+9999)
// })