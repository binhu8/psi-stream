const socket = io('/');
const myPeer = new Peer();
const conn = myPeer.connect('another-peers-id');
const peers = {}


const p1 = document.querySelector('.p1');
const p2 = document.querySelector('.p2');

const myVideo = document.createElement('video');
myVideo.classList.add('p1')
myVideo.muted = true

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream, 1);

    myPeer.on('call', call=> {
        call.answer(stream);

        const video = document.createElement('video')
        video.classList.add('p2')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream, 2)
        })
    })

    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    });

    
});

socket.on('user-disconnected', userId => {
    peers[userId] ? peers[userId].close() : false
})

myPeer.on('open', id => {
    socket.emit('join-room', roomId, id);
});

function addVideoStream(video, stream, player){
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', ()=>{
        video.play()
    });
    player == 1 ? p1.append(video) : p2.append(video)
}

function connectToNewUser(userId, stream){
    const call = myPeer.call(userId, stream);



    const video = document.createElement('video')
    video.classList.add('p2')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    });

    call.on('close', ()=> {
        p1.removeChild(video)
    })

    peers[userId] = call
}






socket.on('user-connected', (userId)=> {
    console.log('usuario conectado', userId)
})