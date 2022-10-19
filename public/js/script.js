//imports
const socket = io('/');
const myPeer = new Peer();
const conn = myPeer.connect('another-peers-id');

let frontal = false
let muted = false
let videoDisabled = false
let currentStream;
const myFace = document.querySelector('.my-face');
const clientFace = document.querySelector('.client-face');
const myVideo = document.createElement('video');
myVideo.classList.add('myVideo')
const peers = {}

const options = {
    switchCamera: document.querySelector('#flip-camera'),
    mic: document.querySelector('#mic'),
    video: document.querySelector('#video'),
    endCall: document.querySelector('.end-call')
}

myVideo.muted = true;


options.endCall.addEventListener('click', ()=> {
    window.close()
})

options.switchCamera.addEventListener('click', ()=>{
    
    if(typeof currentStream != undefined) {
        frontal = !frontal
        stopMediaTracks(currentStream);
    }
    const videoConstraints = {facingMode: frontal ? 'user' : 'environment'}
    getUserMedia(videoConstraints)
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
    const newVideo = document.createElement('video')
    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        
        options.mic.addEventListener('click', ()=>{
            const microfone = document.querySelector('.mic')
            if(stream.getAudioTracks()[0].enabled){ 
                microfone.src = '/images/mute.png'
                stream.getAudioTracks()[0].enabled = false
            }else{
                microfone.src = '/images/mic.png'
                stream.getAudioTracks()[0].enabled = true

            }
        });

        options.video.addEventListener('click', ()=>{
            const video = document.querySelector('.video')
            console.log(stream.getAudioTracks()[0])
            if(stream.getVideoTracks()[0].enabled){ 
                video.src = '/images/no-video.png'
                stream.getVideoTracks()[0].enabled = false
            }else{
                video.src = '/images/video.png'
                stream.getVideoTracks()[0].enabled = true

            }
        });


        addMyVideo(myVideo, stream);
       
        
        myPeer.on('call', call=> {
            const video = document.createElement('video')
            call.answer(stream);

            call.on('stream', userVideoStream => {
                addVideoStream(video, userVideoStream)
            })
        })

        socket.on('user-connected', userId => {
            connectToNewUser(userId, stream)
        });

        connectToNewUser
        
        currentStream= stream;
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