// Node server which will handle socket io connections

// using socket.io library and using 8000 on socket.io server
// socket.io will listen incoming events
const io=require('socket.io')(8000)

const users={};

// io.on is instance of socket.io, socket is a particular connection.
//  io.on will listen the many socket connections like kohli has joined, dhoni has joined, someone sent message to someone. So like this kind of connections will listen by io.on
io.on('connection',socket=>{

    //for a articular connection(kohli joined, kohli messaged dhoni), what needs to be done will be  handle by socket.on. It means if new-user-joined event happens, what needs to be done will be hande by socket.on
    socket.on('new-user-joined',name=>{
        // console.log("New user",name);

        //we will append the new users to the users list. socket.id will give one id for each connected user so that it will be unique. We can also do by taking users name but it is risky if users have same name
        users[socket.id]=name;

        //broadcast.emit will send a message to other people like this user has joined, except to the joined user. name is the joined user name. 'new-user-joined', 'user-joined' these are not pre-defined events, we can keep anything.
           socket.broadcast.emit('user-joined', name);
    });

    //If someone sends message
    socket.on('send',message=>{
        // other people receive the message. All the people in users list will receive it. 
        // It means someone sends message(socket.on('send',message)), the server will have the message and by using receive event we will take the sent message on client side
        socket.broadcast.emit('receive',{message:message,name:users[socket.id]})
    })

    //If anyone diconnects, we will write user has left. disconnect is a inbuilt event, others are used our own event names
    socket.on('disconnect',message=>{
        socket.broadcast.emit('left-the-chat',users[socket.id]);
        delete users[socket.id];
    })
})