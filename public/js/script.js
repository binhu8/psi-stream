const socket = io('/');
const peer = new Peer();
const conn = peer.connect('another-peers-id');
const peers = {}

const myFace = document.querySelector('.my-face');
const clientFace = document.querySelector('.client-face');
const myVideo = document.createElement('video');
myVideo.muted = true

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {

    addMyvideo(myVideo, stream);

    peer.on('call', call=> {
        call.answer(stream);

        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    })
});

socket.on('user-disconnected', userId => {
    console.log(peers[userId] ? true : false)
    console.log('teste')
    peers[userId] ? peers[userId].close() : ''
})

peer.on('open', id => {
    socket.emit('join-room', roomId, id, );
});

function addVideoStream(video, stream){
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', ()=>{
        video.play()
    });
    clientFace.append(video)
}
function addMyvideo(video, stream){
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', ()=>{
        video.play()
    });
    myFace.append(video)
}

function connectToNewUser(userId, stream){
    const call = peer.call(userId, stream);



    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    });

    call.on('close', ()=> {
        video.remove()
    })

    peers[userId] = call
}






socket.on('user-connected', (userId)=> {
    console.log('usuario conectado', userId)
})