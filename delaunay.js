
var Point = function(x, y) {
    this.x = x;
    this.y = y;
    this.equals = function(other) {
        return this.x == other.x && this.y == other.y;
    }
}

var Edge = function(p1, p2) {
    this.point1 = p1;
    this.point2 = p2;
    this.equals = function(other) {
        return (this.point1.equals(other.point1) && this.point2.equals(other.point2)) || 
        (this.point1.equals(other.point2) && this.point2.equals(other.point1));
    }
}

var Triangle = function(p1, p2, p3) {
    this.point1 = p1;
    this.point2 = p2;
    this.point3 = p3;
    this.circumcircle = calculateCircumcircle(this);
}

var Circumcircle = function(center, radius) {
    this.center = center;
    this.radius = radius;
}

function calculateCircumcircle(triangle) {
    // use determinate to compute circumcenter
    const D = 2 * (triangle.point1.x * (triangle.point2.y - triangle.point3.y) + triangle.point2.x * (triangle.point3.y - triangle.point1.y) + triangle.point3.x * (triangle.point1.y - triangle.point2.y));
    const cx = ((triangle.point1.x ** 2 + triangle.point1.y ** 2) * (triangle.point2.y - triangle.point3.y) + (triangle.point2.x ** 2 + triangle.point2.y ** 2) * (triangle.point3.y - triangle.point1.y) + (triangle.point3.x ** 2 + triangle.point3.y ** 2) * (triangle.point1.y - triangle.point2.y)) / D;
    const cy = ((triangle.point1.x ** 2 + triangle.point1.y ** 2) * (triangle.point3.x - triangle.point2.x) + (triangle.point2.x ** 2 + triangle.point2.y ** 2) * (triangle.point1.x - triangle.point3.x) + (triangle.point3.x ** 2 + triangle.point3.y ** 2) * (triangle.point2.x - triangle.point1.x)) / D;
    // use distance formula to compute circumradius
    const radius = Math.sqrt((cx - triangle.point1.x) ** 2 + (cy - triangle.point1.y) ** 2);
    return new Circumcircle(new Point(cx, cy), radius);
}

function inCircumcircle(point, circumcircle) {
    const distance = Math.sqrt((point.x - circumcircle.center.x) ** 2 + (point.y - circumcircle.center.y) ** 2);
    return distance <= circumcircle.radius;
}

function createSuperTriangle(points) {
    // var minX = points[0].x;
    // var minY = points[0].y;
    // var maxX = points[0].x;
    // var maxY = points[0].y;

    // for (var i = 1; i < points.length; i++) {
    //     minX = Math.min(minX, points[i].x);
    //     minY = Math.min(minY, points[i].y);
    //     maxX = Math.max(maxX, points[i].x);
    //     maxY = Math.max(maxY, points[i].y);
    // }
    minX = 0;
    minY = 0;
    maxX = canvas.width;
    maxY = canvas.height;

    const dx = (maxX - minX) * 10;
    const dy = (maxY - minY) * 10;
    var superTriangle = new Triangle(
        new Point(minX - dx, minY - dy),
        new Point(maxX + dx, minY - dy),
        new Point((minX + maxX) / 2, maxY + dy)
    );
    return superTriangle;
}

function triangulate(points) {
    var superTriangle = createSuperTriangle(points);
    var triangles = [superTriangle];

    points.forEach(function(point) {
        var edges = [];

        // remove triangles whose circumcircle contains the point
        var filteredTriangles = [];
        for (var i = 0; i < triangles.length; i++) {
            if (inCircumcircle(point, triangles[i].circumcircle)) {
                edges.push(new Edge(triangles[i].point1, triangles[i].point2));
                edges.push(new Edge(triangles[i].point2, triangles[i].point3));
                edges.push(new Edge(triangles[i].point3, triangles[i].point1));
                // triangles.splice(i, 1);
            }
            else {
                filteredTriangles.push(triangles[i]);
            }
        }
        triangles = filteredTriangles;

        // remove duplicate edges
        filteredEdges = [];
        for (var i = 0; i < edges.length; i++) {
            var isUnique = true;
            for (var j = 0; j < edges.length; j++) {
                if (i == j) continue;
                if (edges[i].equals(edges[j])) {
                    isUnique = false;
                    break;
                }
            }
            if (isUnique) {
                filteredEdges.push(edges[i]);
            }
        }
        edges = filteredEdges;

        // add in new triangles
        edges.forEach(function(edge) {
            triangles.push(new Triangle(edge.point1, edge.point2, point));
        });
    });

    // remove super triangle edges
    triangles = triangles.filter(function(triangle) {
        return !(triangle.point1 == superTriangle.point1 || triangle.point1 == superTriangle.point2 || triangle.point1 == superTriangle.point3
            || triangle.point2 == superTriangle.point1 || triangle.point2 == superTriangle.point2 || triangle.point2 == superTriangle.point3
            || triangle.point3 == superTriangle.point1 || triangle.point3 == superTriangle.point2 || triangle.point3 == superTriangle.point3);
    });

    return triangles;
}
