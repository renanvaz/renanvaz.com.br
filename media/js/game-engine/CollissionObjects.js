
var Collision = function(self, other){
    this.self = {
        sprite: self,
        point: self.position.clone(),
        hit: self._hit
    }
    this.other = {
        sprite: other,
        point: other.position.clone(),
        hit: other._hit
    }
}

var CollisionData = function(data){
	this.data = data || [];

	this.removeCollision = function(collision){
		var _return = [];
		for(var i = 0; i < this.data.length; i++){
			if(this.data[i] != collision){
				_return.push(this.data[i]);
			}else{
				collision.self.sprite.trigger('hittest.out', this.data[i], true);
				collision.other.sprite.trigger('hittest.out', collision.other.sprite.collisions.getCollision(collision.self.sprite), true);
			}
		}
		this.data = _return;
	}

	this.hasCollision = function(sprite){
		for(var i = 0; i < this.data.length; i++){
			if(this.data[i].other.sprite == sprite){
				return true;
			}
		}
		return false;
	}

	this.addCollision = function(collision){
		if(!this.hasCollision(collision.other.sprite)){
			this.data.push(collision);
			collision.self.sprite.trigger('hittest.in', collision, true);
			collision.other.sprite.trigger('hittest.in', new Collision(collision.other.sprite, collision.self.sprite), true);
		}
	}

	this.getCollision = function(sprite){
		for(var i = 0; i < this.data.length; i++){
			if(this.data[i].other.sprite == sprite){
				return this.data[i];
			}
		}
		return false;
	}

    this.cleanCollisions = function(){
        this.data = [];
    }
}

/**
 * A circle.
 *
 * @param {Vector2=} pos A Vector2 representing the position of the center of the circle
 * @param {?number=} r The radius of the circle
 * @constructor
 */
var Circle = function (pos, r) {
    this.pos = pos || new Vector2();
    this.r = r || 0;
};

/**
 * A *convex* clockwise polygon.
 *
 * @param {Vector2=} pos A Vector2 representing the origin of the polygon. (all other
 *   points are relative to this one)
 * @param {Array.<Vector2>=} points An array of Vector2s representing the points in the polygon,
 *   in clockwise order.
 * @constructor
 */
var Polygon = function (pos, points) {
    this.pos = pos || new Vector2();
    this.points = points || [];
    this.recalc();
};

/**
 * Recalculate the edges and normals of the polygon.  This
 * MUST be called if the points array is modified at all and
 * the edges or normals are to be accessed.
 */
Polygon.prototype.recalc = function () {
    var points = this.points;
    var len = points.length;
    this.edges = [];
    this.normals = [];
    for (var i = 0; i < len; i++) {
        var p1 = points[i];
        var p2 = i < len - 1 ? points[i + 1] : points[0];
        var e = new Vector2().copy(p2).sub(p1);
        var n = new Vector2().copy(e).perp().normalize();
        this.edges.push(e);
        this.normals.push(n);
    }
};

/**
 * An axis-aligned box, with width and height.
 *
 * @param {Vector2=} pos A Vector2 representing the top-left of the box.
 * @param {?number=} w The width of the box.
 * @param {?number=} h The height of the box.
 * @constructor
 */
var Box = function (pos, w, h) {
    this.pos = pos || new Vector2();
    this.w = w || 0;
    this.h = h || 0;
};

/**
 * Create a polygon that is the same as this box.
 *
 * @return {Polygon} A new Polygon that represents this box.
 */
Box.prototype.toPolygon = function () {
    var pos = this.pos;
    var w = this.w;
    var h = this.h;
    var s = Shape ?
	new Shape.polygon(pos.clone(), [
		new Vector2(), new Vector2(w, 0),
		new Vector2(w, h), new Vector2(0, h)
	]) :
	new Polygon(pos.clone(), [
		new Vector2(), new Vector2(w, 0),
		new Vector2(w, h), new Vector2(0, h)
	]);

	if(Shape) { this.parent.addChild(s); }

	return s;
};

/**
 * Create a triangle.
 *
 * @param ENUM Shape.triangleType
 * @constructor
 */
var Triangle = function(){
    this.bind('onAdded', function(){
        var type = this.parent.attr('data-shape-type', Shape.triangleType.TOP_LEFT).toString().toNumber();

    	switch(type){
    		case Shape.triangleType.TOP_LEFT:
    			this.points = [new Vector2(0, this.h), new Vector2(this.w, this.h), new Vector2(this.w, 0)];
    		break;
    		case Shape.triangleType.TOP_RIGHT:
    			this.points = [new Vector2(0, 0), new Vector2(0, this.h), new Vector2(this.w, this.h)];
    		break;
    		case Shape.triangleType.BOTTOM_LEFT:
    			this.points = [new Vector2(0, 0), new Vector2(this.w, 0), new Vector2(this.w, this.h)];
    		break;
    		case Shape.triangleType.BOTTOM_RIGHT:
    			this.points = [new Vector2(0, 0), new Vector2(this.w, 0), new Vector2(0, this.h)];
    		break;
    	}
    });
}

Triangle.prototype.toPolygon = function(){
    var s = new Shape.polygon(new Vector2(), this.points);
    if(Shape) { this.parent.addChild(s); }
    return s;
}

/**
 * Pool of Vector2s used in calculations.
 *
 * @type {Array.<Vector2>}
 */
var T_VECTORS2 = [];
for (var i = 0; i < 10; i++) {
    T_VECTORS2.push(new Vector2());
}
/**
 * Pool of Arrays used in calculations.
 *
 * @type {Array.<Array.<*>>}
 */
var T_ARRAYS = [];
for (var i = 0; i < 5; i++) {
    T_ARRAYS.push([]);
}

/**
 * An object representing the result of an intersection. Contain information about:
 * - The two objects participating in the intersection
 * - The Vector2 representing the minimum change necessary to extract the first object
 *   from the second one.
 * - Whether the first object is entirely inside the second, or vice versa.
 *
 * @constructor
 */
var Response = function () {
    this.a = null;
    this.b = null;
    this.overlapN = new Vector2(); // Unit Vector2 in the direction of overlap
    this.overlapV = new Vector2(); // Subtract this from a's position to extract it from b
    this.clear();
};

/**
 * Set some values of the response back to their defaults.  Call this between tests if
 * you are going to reuse a single Response object for multiple intersection tests (recommented)
 *
 * @return {Response} This for chaining
 */
Response.prototype.clear = function () {
    this.aInB = true; // Is a fully inside b?
    this.bInA = true; // Is b fully inside a?
    this.overlap = Number.MAX_VALUE; // Amount of overlap (magnitude of overlapV). Can be 0 (if a and b are touching)
    return this;
};

/**
 * Flattens the specified array of points onto a unit Vector2 axis,
 * resulting in a one dimensional range of the minimum and
 * maximum value on that axis.
 *
 * @param {Array.<Vector2>} points The points to flatten.
 * @param {Vector2} normal The unit Vector2 axis to flatten on.
 * @param {Array.<number>} result An array.  After calling this function,
 *   result[0] will be the minimum value,
 *   result[1] will be the maximum value.
 */
var flattenPointsOn = function (points, normal, result) {
    var min = Number.MAX_VALUE;
    var max = -Number.MAX_VALUE;
    var len = points.length;
    for (var i = 0; i < len; i++ ) {
        // Get the magnitude of the projection of the point onto the normal
        var dot = points[i].dot(normal);
        if (dot < min) { min = dot; }
        if (dot > max) { max = dot; }
    }
    result[0] = min; result[1] = max;
};

/**
 * Check whether two convex clockwise polygons are separated by the specified
 * axis (must be a unit Vector2).
 *
 * @param {Vector2} aPos The position of the first polygon.
 * @param {Vector2} bPos The position of the second polygon.
 * @param {Array.<Vector2>} aPoints The points in the first polygon.
 * @param {Array.<Vector2>} bPoints The points in the second polygon.
 * @param {Vector2} axis The axis (unit sized) to test against.  The points of both polygons
 *   will be projected onto this axis.
 * @param {Response=} response A Response object (optional) which will be populated
 *   if the axis is not a separating axis.
 * @return {boolean} true if it is a separating axis, false otherwise.  If false,
 *   and a response is passed in, information about how much overlap and
 *   the direction of the overlap will be populated.
 */
var isSeparatingAxis = function (aPos, bPos, aPoints, bPoints, axis, response) {
    var rangeA = T_ARRAYS.pop();
    var rangeB = T_ARRAYS.pop();
    // Get the magnitude of the offset between the two polygons
    var offsetV = T_VECTORS2.pop().copy(bPos).sub(aPos);
    var projectedOffset = offsetV.dot(axis);
    // Project the polygons onto the axis.
    flattenPointsOn(aPoints, axis, rangeA);
    flattenPointsOn(bPoints, axis, rangeB);
    // Move B's range to its position relative to A.
    rangeB[0] += projectedOffset;
    rangeB[1] += projectedOffset;
    // Check if there is a gap. If there is, this is a separating axis and we can stop
    if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
        T_VECTORS2.push(offsetV);
        T_ARRAYS.push(rangeA);
        T_ARRAYS.push(rangeB);
        return true;
    }
    // If we're calculating a response, calculate the overlap.
    if (response) {
        var overlap = 0;
        // A starts further left than B
        if (rangeA[0] < rangeB[0]) {
            response.aInB = false;
            // A ends before B does. We have to pull A out of B
            if (rangeA[1] < rangeB[1]) {
                overlap = rangeA[1] - rangeB[0];
                response.bInA = false;
                // B is fully inside A.  Pick the shortest way out.
            } else {
                var option1 = rangeA[1] - rangeB[0];
                var option2 = rangeB[1] - rangeA[0];
                overlap = option1 < option2 ? option1 : -option2;
            }
            // B starts further left than A
        } else {
            response.bInA = false;
            // B ends before A ends. We have to push A out of B
            if (rangeA[1] > rangeB[1]) {
                overlap = rangeA[0] - rangeB[1];
                response.aInB = false;
                // A is fully inside B.  Pick the shortest way out.
            } else {
                var option1 = rangeA[1] - rangeB[0];
                var option2 = rangeB[1] - rangeA[0];
                overlap = option1 < option2 ? option1 : -option2;
            }
        }
        // If this is the smallest amount of overlap we've seen so far, set it as the minimum overlap.
        var absOverlap = Math.abs(overlap);
        if (absOverlap < response.overlap) {
            response.overlap = absOverlap;
            response.overlapN.copy(axis);
            if (overlap < 0) {
                response.overlapN.reverse();
            }
        }
    }
    T_VECTORS2.push(offsetV);
    T_ARRAYS.push(rangeA);
    T_ARRAYS.push(rangeB);
    return false;
};

/**
 * Calculates which Vornoi region a point is on a line segment.
 * It is assumed that both the line and the point are relative to (0, 0)
 *
 *             |       (0)      |
 *      (-1)  [0]--------------[1]  (1)
 *             |       (0)      |
 *
 * @param {Vector2} line The line segment.
 * @param {Vector2} point The point.
 * @return  {number} LEFT_VORNOI_REGION (-1) if it is the left region,
 *          MIDDLE_VORNOI_REGION (0) if it is the middle region,
 *          RIGHT_VORNOI_REGION (1) if it is the right region.
 */
var vornoiRegion = function (line, point) {
    var len2 = line.len2();
    var dp = point.dot(line);
    if (dp < 0) {
        return LEFT_VORNOI_REGION;
    } else if (dp > len2) {
        return RIGHT_VORNOI_REGION;
    } else {
        return MIDDLE_VORNOI_REGION;
    }
};
/**
 * @const
 */
var LEFT_VORNOI_REGION = -1;
/**
 * @const
 */
var MIDDLE_VORNOI_REGION = 0;
/**
 * @const
 */
var RIGHT_VORNOI_REGION = 1;

/**
 * Check if two circles intersect.
 *
 * @param {Circle} a The first circle.
 * @param {Circle} b The second circle.
 * @param {Response=} response Response object (optional) that will be populated if
 *   the circles intersect.
 * @return {boolean} true if the circles intersect, false if they don't.
 */
var testCircleCircle = function (a, b, response) {
    var differenceV = T_VECTORS2.pop().copy(b.pos).sub(a.pos);
    var totalRadius = a.r + b.r;
    var totalRadiusSq = totalRadius * totalRadius;
    var distanceSq = differenceV.len2();
    if (distanceSq > totalRadiusSq) {
        // They do not intersect
        T_VECTORS2.push(differenceV);
        return false;
    }
    // They intersect.  If we're calculating a response, calculate the overlap.
    if (response) {
        var dist = Math.sqrt(distanceSq);
        response.a = a;
        response.b = b;
        response.overlap = totalRadius - dist;
        response.overlapN.copy(differenceV.normalize());
        response.overlapV.copy(differenceV).scale(response.overlap);
        response.aInB = a.r <= b.r && dist <= b.r - a.r;
        response.bInA = b.r <= a.r && dist <= a.r - b.r;
    }
    T_VECTORS2.push(differenceV);
    return true;
};

/**
 * Check if a polygon and a circle intersect.
 *
 * @param {Polygon} polygon The polygon.
 * @param {Circle} circle The circle.
 * @param {Response=} response Response object (optional) that will be populated if
 *   they interset.
 * @return {boolean} true if they intersect, false if they don't.
 */
var testPolygonCircle = function (polygon, circle, response) {
    var circlePos = T_VECTORS2.pop().copy(circle.pos).sub(polygon.pos);
    var radius = circle.r;
    var radius2 = radius * radius;
    var points = polygon.points;
    var len = points.length;
    var edge = T_VECTORS2.pop();
    var point = T_VECTORS2.pop();

    // For each edge in the polygon
    for (var i = 0; i < len; i++) {
        var next = i === len - 1 ? 0 : i + 1;
        var prev = i === 0 ? len - 1 : i - 1;
        var overlap = 0;
        var overlapN = null;

        // Get the edge
        edge.copy(polygon.edges[i]);
        // Calculate the center of the cirble relative to the starting point of the edge
        point.copy(circlePos).sub(points[i]);

        // If the distance between the center of the circle and the point
        // is bigger than the radius, the polygon is definitely not fully in
        // the circle.
        if (response && point.len2() > radius2) {
            response.aInB = false;
        }

        // Calculate which Vornoi region the center of the circle is in.
        var region = vornoiRegion(edge, point);
        if (region === LEFT_VORNOI_REGION) {
            // Need to make sure we're in the RIGHT_VORNOI_REGION of the previous edge.
            edge.copy(polygon.edges[prev]);
            // Calculate the center of the circle relative the starting point of the previous edge
            var point2 = T_VECTORS2.pop().copy(circlePos).sub(points[prev]);
            region = vornoiRegion(edge, point2);
            if (region === RIGHT_VORNOI_REGION) {
                // It's in the region we want.  Check if the circle intersects the point.
                var dist = point.len();
                if (dist > radius) {
                    // No intersection
                    T_VECTORS2.push(circlePos);
                    T_VECTORS2.push(edge);
                    T_VECTORS2.push(point);
                    T_VECTORS2.push(point2);
                    return false;
                } else if (response) {
                    // It intersects, calculate the overlap
                    response.bInA = false;
                    overlapN = point.normalize();
                    overlap = radius - dist;
                }
            }
            T_VECTORS2.push(point2);
        } else if (region === RIGHT_VORNOI_REGION) {
            // Need to make sure we're in the left region on the next edge
            edge.copy(polygon.edges[next]);
            // Calculate the center of the circle relative to the starting point of the next edge
            point.copy(circlePos).sub(points[next]);
            region = vornoiRegion(edge, point);
            if (region === LEFT_VORNOI_REGION) {
                // It's in the region we want.  Check if the circle intersects the point.
                var dist = point.len();
                if (dist > radius) {
                    // No intersection
                    T_VECTORS2.push(circlePos);
                    T_VECTORS2.push(edge);
                    T_VECTORS2.push(point);
                    return false;
                } else if (response) {
                    // It intersects, calculate the overlap
                    response.bInA = false;
                    overlapN = point.normalize();
                    overlap = radius - dist;
                }
            }
            // MIDDLE_VORNOI_REGION
        } else {
            // Need to check if the circle is intersecting the edge,
            // Change the edge into its "edge normal".
            var normal = edge.perp().normalize();
            // Find the perpendicular distance between the center of the
            // circle and the edge.
            var dist = point.dot(normal);
            var distAbs = Math.abs(dist);
            // If the circle is on the outside of the edge, there is no intersection
            if (dist > 0 && distAbs > radius) {
                T_VECTORS2.push(circlePos);
                T_VECTORS2.push(normal);
                T_VECTORS2.push(point);
                return false;
            } else if (response) {
                // It intersects, calculate the overlap.
                overlapN = normal;
                overlap = radius - dist;
                // If the center of the circle is on the outside of the edge, or part of the
                // circle is on the outside, the circle is not fully inside the polygon.
                if (dist >= 0 || overlap < 2 * radius) {
                    response.bInA = false;
                }
            }
        }

        // If this is the smallest overlap we've seen, keep it.
        // (overlapN may be null if the circle was in the wrong Vornoi region)
        if (overlapN && response && Math.abs(overlap) < Math.abs(response.overlap)) {
            response.overlap = overlap;
            response.overlapN.copy(overlapN);
        }
    }

    // Calculate the final overlap Vector2 - based on the smallest overlap.
    if (response) {
        response.a = polygon;
        response.b = circle;
        response.overlapV.copy(response.overlapN).scale(response.overlap);
    }
    T_VECTORS2.push(circlePos);
    T_VECTORS2.push(edge);
    T_VECTORS2.push(point);
    return true;
};

/**
 * Check if a circle and a polygon intersect.
 *
 * NOTE: This runs slightly slower than polygonCircle as it just
 * runs polygonCircle and reverses everything at the end.
 *
 * @param {Circle} circle The circle.
 * @param {Polygon} polygon The polygon.
 * @param {Response=} response Response object (optional) that will be populated if
 *   they interset.
 * @return {boolean} true if they intersect, false if they don't.
 */
var testCirclePolygon = function (circle, polygon, response) {
    var result = testPolygonCircle(polygon, circle, response);
    if (result && response) {
        // Swap A and B in the response.
        var a = response.a;
        var aInB = response.aInB;
        response.overlapN.reverse();
        response.overlapV.reverse();
        response.a = response.b;
        response.b = a;
        response.aInB = response.bInA;
        response.bInA = aInB;
    }
    return result;
};

/**
 * Checks whether two convex, clockwise polygons intersect.
 *
 * @param {Polygon} a The first polygon.
 * @param {Polygon} b The second polygon.
 * @param {Response=} response Response object (optional) that will be populated if
 *   they interset.
 * @return {boolean} true if they intersect, false if they don't.
 */
var testPolygonPolygon = function (a, b, response) {
    var aPoints = a.points;
    var aLen = aPoints.length;
    var bPoints = b.points;
    var bLen = bPoints.length;

    // If any of the edge normals of A is a separating axis, no intersection.
    for (var i = 0; i < aLen; i++) {
        if (isSeparatingAxis(a.pos, b.pos, aPoints, bPoints, a.normals[i], response)) {
            return false;
        }
    }
    // If any of the edge normals of B is a separating axis, no intersection.
    for (var i = 0; i < bLen; i++) {
        if (isSeparatingAxis(a.pos, b.pos, aPoints, bPoints, b.normals[i], response)) {
            return false;
        }
    }
    // Since none of the edge normals of A or B are a separating axis, there is an intersection
    // and we've already calculated the smallest overlap (in isSeparatingAxis).  Calculate the
    // final overlap Vector2.
    if (response) {
        response.a = a;
        response.b = b;
        response.overlapV.copy(response.overlapN).scale(response.overlap);
    }
    return true;
};

var elasticCollision = function(collision){
    var self = collision.self.sprite;
    var other = collision.other.sprite;

	var selfVelocity = new Vector2(
		((self.velocity.x * (self.mass - other.mass)) + (2 * other.mass * other.velocity.x)) / (self.mass + other.mass),
		((self.velocity.y * (self.mass - other.mass)) + (2 * other.mass * other.velocity.y)) / (self.mass + other.mass)
		);
	var otherVelocity = new Vector2(
		((other.velocity.x * (other.mass - self.mass)) + (2 * self.mass * self.velocity.x)) / (other.mass + self.mass),
		((other.velocity.y * (other.mass - self.mass)) + (2 * self.mass * self.velocity.y)) / (other.mass + self.mass)
		);

	if(collision.self.hit.left || collision.self.hit.right){
		self.velocity.x = selfVelocity.x;
		other.velocity.x = otherVelocity.x;
	}

	if(collision.self.hit.top || collision.self.hit.bottom){
		self.velocity.y = selfVelocity.y;
		other.velocity.y = otherVelocity.y;
	}
}
