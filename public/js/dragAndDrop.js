const myFaceContainer = document.querySelector('.my-face')
const coantainer = document.querySelector('.container');
let alturaViewPage = window.innerHeight

coantainer.style.height = alturaViewPage + 'px'

myFaceContainer.addEventListener('dragstart', dragstart)
myFaceContainer.addEventListener('drag', drag)
myFaceContainer.addEventListener('dragend', dragend)