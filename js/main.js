const html = document.documentElement;
const canvas = document.getElementById('airpods-scrolling');
const context = canvas.getContext('2d');

const frameCount = 77; // Ajusta esto al número de frames que tienes
const currentFrame = index => (
  `./img/frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
);



const img = new Image();
img.src = currentFrame(2);
img.onload = function() {
  // Ajusta el tamaño del canvas al tamaño de la ventana
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context.drawImage(img, 0, 0, canvas.width, canvas.height);
}

const preloadImages = () => {
  for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    console.log(img.src);
  }
};

const updateImage = index => {
  img.src = currentFrame(index);
  context.drawImage(img, 0, 0, canvas.width, canvas.height);
}

preloadImages();

const controller = new ScrollMagic.Controller();

new ScrollMagic.Scene({
    triggerElement: "#start",
    duration: document.querySelector('#end').offsetTop
})
    .setPin("#airpods-scrolling")
    .on("progress", function (event) {
        const frameIndex = Math.min(
            frameCount - 1,
            Math.ceil(event.progress * frameCount)
        );
        updateImage(frameIndex + 1);
    })
    .addTo(controller);


