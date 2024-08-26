const{ Server } =require("socket.io") ;


const setup_socket=(server)=>{

    const io=new Server(server,{
        cors:{ 
            origin: "http://localhost:3000",
            credentials: true,
            methods: ["GET","POST",'PUT','DELETE']}
    }) ;

const userSocketMap = new Map();

io.on('connection',(socket)=>{
    const user_id=socket.handshake.query.userId;
    if(user_id){
        userSocketMap.set(user_id,socket.id);
        console.log(`user ${user_id}, is connected with socket  ${socket.id}`)
    }else{
        console.log('user_is is not provided during connection')
    }
    socket.on('disconnect',()=>{     
        console.log(`client disconnect ${socket.id}`);

        for(const [user_id,socketId] of userSocketMap.entries()){
            if(socketId===socket.id){
                userSocketMap.delete(user_id);
                break;
            }
        }
    });
});

}

module.exports=setup_socket
   