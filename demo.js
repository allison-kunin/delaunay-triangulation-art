// global variables
var imageLoader;    // uploaded image file
var image;          // image object
var canvas;         // canvas for image
var ctx;            // canvas context


// var numPoints = 500; // user-input number of points for triangulation
// var numPointsValue = document.getElementById("numPointsValue");
// numPointsValue.innerHTML = numPoints;

// wait for window to load before starting script
window.onload = init;


function init(){
    imageLoader = document.getElementById('imageLoader');
    canvas = document.getElementById('imageCanvas');
    ctx = canvas.getContext('2d'); 
    imageLoader.addEventListener('change', handleImage, false);
}

function handleImage(e){
    var reader = new FileReader();
    reader.onload = function(event){
        image = new Image();
        image.onload = function(){
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image,0,0);
        }
        image.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);     
}

var points = []; // points in the triangulation

function generateRandomPoints() {
    // start by clearing the canvas (and redraw image)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (image != null) {
        ctx.drawImage(image, 0, 0);
    }
    // clear previous points
    points = [];

    // user input number of points
    const numPoints = parseInt(document.getElementById("numPointsValue").innerHTML);

    const width = canvas.width;
    const height = canvas.height;

    // randomly generate and draw points
    ctx.beginPath();
    for (let i = 0; i < numPoints; i++) {
        const x = Math.floor(Math.random() * (width + 1));
        const y = Math.floor(Math.random() * (height + 1));
        points.push(new Point(x, y));
        ctx.moveTo(x, y);
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function createDelaunayTriangulation() {
    // add points around the canvas border to make the convex hull = the canvas border
    for (let x = 0; x <= canvas.width; x += canvas.width / 10) {
        points.push(new Point(x, 0));
        points.push(new Point(x, canvas.height));
    }
    for (let y = 0; y <= canvas.height; y += canvas.height / 10) {
        points.push(new Point(0, y));
        points.push(new Point(canvas.width, y));
    }

    // create triangulation and draw it
    const triangles = triangulate(points);
    ctx.beginPath();
    triangles.forEach(function(triangle) {
        ctx.moveTo(triangle.point1.x, triangle.point1.y);
        ctx.lineTo(triangle.point2.x, triangle.point2.y);
        ctx.lineTo(triangle.point3.x, triangle.point3.y);
        ctx.stroke();
    });
    ctx.closePath();
}

