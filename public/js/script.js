//imports
const socket = io('/');
const myPeer = new Peer();
const conn = myPeer.connect('another-peers-id');

let frontCamera = false
let stream;
const myFace = document.querySelector('.my-face');
const clientFace = document.querySelector('.client-face');
const myVideo = document.createElement('video');
myVideo.classList.add('myVideo')
const peers = {}

let constraints = {
    audo: true, 
    video: {exact: 'enverionment'} 
}

const options = {
    switchCamera: document.querySelector('#flip-camera'),
}

const getUserMedia = navigator.mediaDevices.getUserMedia

options.switchCamera.addEventListener('click', ()=>{
    frontCamera = !frontCamera
    frontCamera ? constraints.video.exact = "user"  : constraints.video.exact = "environment"
    const video = document.querySelector('.myVideo');
    video.pause()
    
});

myVideo.muted = true;






getUserMedia(constraints).then(stream => {
    addMyVideo(myVideo, stream);
    this.stream = stream;
    
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