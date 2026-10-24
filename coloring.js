
function drawEdges(context, triangles) {
    // go through triangles and draw edges
    triangles.forEach(function(triangle) {
        context.strokeStyle = document.getElementById("lineColor").value;
        // draw triangle edges (if you want to see the edges of the triangles)
        context.beginPath();
        context.moveTo(triangle.point1.x, triangle.point1.y);
        context.lineTo(triangle.point2.x, triangle.point2.y);
        context.lineTo(triangle.point3.x, triangle.point3.y);
        context.lineTo(triangle.point1.x, triangle.point1.y);
        context.stroke();
        context.closePath();
    });
}

function drawTriangles(context, triangles) {
    clearCanvasAndRedrawImage();
    
    triangles.forEach(function(triangle) {
        // fill triangles
        // get the bounding box of the triangle
        minx = Math.min(triangle.point1.x, triangle.point2.x, triangle.point3.x);
        miny = Math.min(triangle.point1.y, triangle.point2.y, triangle.point3.y);
        maxx = Math.max(triangle.point1.x, triangle.point2.x, triangle.point3.x);
        maxy = Math.max(triangle.point1.y, triangle.point2.y, triangle.point3.y);
        const width = maxx - minx;
        const height = maxy - miny;
        console.log("triangle: ", triangle);
        console.log(minx, maxy, width, height);
        // context.willReadFrequently = true;
        const imageData = context.getImageData(minx, maxy, width, height, {
            willReadFrequently: true,
        });
        console.log(imageData);

        count = 0;
        sumRed = 0;
        sumGreen = 0;
        sumBlue = 0;
        // for each point in the bounding box, check if it's inside the triangle
        for (let x = minx; x < minx + width; x++) {
            for (let y = miny; y < miny + height; y++) {
                area01 = (x - triangle.point1.x) * (triangle.point2.y - triangle.point1.y) - (y - triangle.point1.y) * (triangle.point2.x - triangle.point1.x)
                area12 = (x - triangle.point2.x) * (triangle.point3.y - triangle.point2.y) - (y - triangle.point2.y) * (triangle.point3.x - triangle.point2.x)
                area20 = (x - triangle.point3.x) * (triangle.point1.y - triangle.point3.y) - (y - triangle.point3.y) * (triangle.point1.x - triangle.point3.x)
                // console.log(x, y, area01, area12, area20);
                if (!(area01 >= 0 && area12 >= 0 && area20 >= 0)) {
                    if (!(area01 <= 0 && area12 <= 0 && area20 <= 0)) {
                        continue
                    }
                }

                // if it is, add the color values to the sums
                const index = ((y-miny) * width + (x-minx)) * 4;
                // console.log(imageData.data[index]);
                sumRed += imageData.data[index];
                sumGreen += imageData.data[index + 1];
                sumBlue += imageData.data[index + 2];
                count++;
            }
        }
        
        console.log(sumRed, sumGreen, sumBlue, count);

        if (count != 0) {

            // calculate the average color
            const avgRed = Math.floor(sumRed / count);
            const avgGreen = Math.floor(sumGreen / count);
            const avgBlue = Math.floor(sumBlue / count);
            console.log(avgRed, avgGreen, avgBlue);

            // fill the triangle with the average color
            context.fillStyle = `rgb(${avgRed}, ${avgGreen}, ${avgBlue})`;
            context.strokeStyle = document.getElementById("lineColor").value;
            context.beginPath();
            context.moveTo(triangle.point1.x, triangle.point1.y);
            context.lineTo(triangle.point2.x, triangle.point2.y);
            context.lineTo(triangle.point3.x, triangle.point3.y);
            context.lineTo(triangle.point1.x, triangle.point1.y);
            context.fill();
            context.closePath();

            // create list of image data for each triangle
            // and then go through each image data and draw it on a cleared canvas after the fact?
            // cover the entire canvas with the line color first to prevent aliasing or whatever
        }
    });
    console.log("drawing edges...");
    // draw edges if they should be drawn
    drawEdges(context, triangles)
    
}