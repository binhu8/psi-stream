const myFaceContainer = document.querySelector('.my-face')


myFaceContainer.addEventListener('dragstart', dragstart)
myFaceContainer.addEventListener('drag', drag)
myFaceContainer.addEventListener('dragend', dragend)