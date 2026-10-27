// global variables
var imageLoader;    // uploaded image file
var image;          // image object
var canvas;         // canvas for image
var ctx;            // canvas context


var triangulationMade = false;
var points = new Set(); // points in the triangulation
var triangles = []; // triangles in the triangulation

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

function clearCanvasAndRedrawImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (image != null) {
        ctx.drawImage(image, 0, 0);
    }
}

function clearCanvas() {
    // reset everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points = new Set();
    triangulationMade = false;
}

function generateRandomPoints() {
    // start by clearing the canvas (and redraw image)
    clearCanvasAndRedrawImage();
    // reset
    points = new Set();
    triangulationMade = false;

    // user input number of points
    const numPoints = parseInt(document.getElementById("numPointsValue").innerHTML);

    const width = canvas.width;
    const height = canvas.height;

    // randomly generate and draw points
    ctx.fillStyle = document.getElementById("lineColor").value;
    ctx.beginPath();
    for (let i = 0; i < numPoints; i++) {
        const x = Math.floor(Math.random() * (width + 1));
        const y = Math.floor(Math.random() * (height + 1));
        points.add(new Point(x, y));
        ctx.moveTo(x, y);
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function createDelaunayTriangulation() {
    // add points around the canvas border to make the convex hull = the canvas border
    for (let x = 0; x <= canvas.width; x += canvas.width / 10) {
        points.add(new Point(Math.round(x), 0));
        points.add(new Point(Math.round(x), canvas.height));
    }
    for (let y = 0; y <= canvas.height; y += canvas.height / 10) {
        points.add(new Point(0, Math.round(y)));
        points.add(new Point(canvas.width, Math.round(y)));
    }

    // console.log("points: ", points);

    // create triangulation and draw it
    triangles = triangulate(points);
    triangles = colorTriangles(ctx, triangles);
    triangulationMade = true;
}

function updateLineColor() {
    if (triangulationMade) {
        drawMainTriangulation(ctx, triangles);
    } else {
        // update points to be the correct color
        clearCanvasAndRedrawImage();
        ctx.fillStyle = document.getElementById("lineColor").value;
        ctx.beginPath();
        points.forEach(function(point) {
            ctx.moveTo(point.x, point.y);
            ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
            ctx.fill();
        });
    }
}

