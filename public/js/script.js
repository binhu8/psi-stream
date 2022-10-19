//imports
const socket = io('/');
const myPeer = new Peer();
const conn = myPeer.connect('another-peers-id');

let frontal = false
let muted = false
let currentStream;
const myFace = document.querySelector('.my-face');
const clientFace = document.querySelector('.client-face');
const myVideo = document.createElement('video');
myVideo.classList.add('myVideo')
const peers = {}

const options = {
    switchCamera: document.querySelector('#flip-camera'),
    mic: document.queryCommandValue('#mic')
}

myVideo.muted = true;


options.switchCamera.addEventListener('click', ()=>{
    
    if(typeof currentStream != undefined) {
        frontal = !frontal
        stopMediaTracks(currentStream);
    }
    const videoConstraints = {facingMode: frontal ? 'user' : 'environment'}
    getUserMedia(videoConstraints)
});

options.mic.addEventListener('click', ()=>{
    muted = !muted
    const audioConstranst = !muted 
    getUserMedia(audioConstranst)
});

function stopMediaTracks(stream){
    stream.getTracks().forEach(track => {
        track.stop()
    })
   }




function getUserMedia(videoConstraints, audioConstranst){

    const constraints = {
        audio: audioConstranst,
        video: videoConstraints
    }
    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        currentStream= stream;
        addMyVideo(myVideo, stream);
        
        myPeer.on('call', call=> {
            call.answer(stream);

            const video = document.createElement('video')
            call.on('stream', userVideoStream => {
                addVideoStream(video, userVideoStream)
            })
        })

        socket.on('user-connected', userId => {
            connectToNewUser(userId, stream)
        })
    })
}

getUserMedia({facingMode: 'user'}, true)

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
    console.log(stream)
    video.srcObject = stream;
    video.play()
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