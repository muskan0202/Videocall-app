//this will be the server side of our website. 
//I have used nodejs for the same.
//socket.io is used for the communication between the client and server.

const app = require("express")();
const server = require("http").createServer(app);

//cors refers to cross origin resource sharing. 

const cors = require("cors");

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('Running');
});

//socket.io uses websockets for communicating.
//On connection it will generate a unique id which will be later used to make or receive calls in our application.
//Here we are defining the parameters that will be exchanged when a new connection is established .

io.on('connection', (socket)=> {
    socket.emit('me',socket.id);

    socket.on('disconnect',()=> {
        socket.broadcast.emit("callEnded");
    });

    socket.on("callUser",({ userToCall, signalData,from, name})=>{
        io.to(userToCall).emit("callUser",{signal: signalData, from, name });
    });
    socket.on("answerCall",(data)=> {
        io.to(data.to).emit("callAccepted",data.signal);
    });
});
//this is the message we get in our console when our server is running smoothly.
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));