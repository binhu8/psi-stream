const socket = io('/');
const myPeer = new Peer();
const conn = myPeer.connect('another-peers-id');
const peers = {}
let front = true

const getUserMedia = navigator.mediaDevices.getUserMedia
const fliCamera = document.querySelector('#flip-camera')

fliCamera.addEventListener('click', ()=>{
    front = !front
    getUserMedia(constraints)
})

const myFace = document.querySelector('.my-face');
const clientFace = document.querySelector('.client-face');
const myVideo = document.createElement('video')
myVideo.muted = true;
const constraints = {
    audo: true, 
    video: {facingMode: front ? 'user' : 'environment'} 
}



getUserMedia(constraints).then(stream => {
    addMyVideo(myVideo, stream);

    myPeer.on('call', call=> {
        call.answer(stream);

        const video = document.createElement('video')
        video.classList.add('p2')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    })
});

socket.on('user-disconnected', userId => {
    peers[userId] ? peers[userId].close() : false
})

myPeer.on('open', id => {
    socket.emit('join-room', roomId, id);
});

function addVideoStream(video, stream){
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', ()=>{
        video.play()
    });
    clientFace.appendChild(video)
}

function addMyVideo(video, stream){
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', ()=>{
        video.play()
    });
    myFace.appendChild(video)
}

function connectToNewUser(userId, stream){
    const call = myPeer.call(userId, stream);



    const video = document.createElement('video')
    video.classList.add('p2')
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