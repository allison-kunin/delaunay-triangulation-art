// global variables
var imageLoader;    // uploaded image file
var canvas;         // canvas for image
var ctx;            // canvas context

// wait for window to load before starting script
window.onload = init


function init(){
    imageLoader = document.getElementById('imageLoader');
    canvas = document.getElementById('imageCanvas');
    console.log(canvas)
    ctx = canvas.getContext('2d'); 
    imageLoader.addEventListener('change', handleImage, false);
}

function handleImage(e){
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img,0,0);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);     
}

