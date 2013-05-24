/**
 * Represents a Vector2 in two dimensions.
 *
 * @param {?number=} x The x position.
 * @param {?number=} y The y position.
 * @constructor
 */
var Vector2 = function (x, y) {
    this.x = Number(x || 0);
    this.y = Number(y || 0);
};

/**
 * Print vaues into formated string
 *
 * @return {String} Formated values.
 */
Vector2.prototype.toString = function () {
    return '['+this.x+', '+this.y+']';
};

/**
 * Clone the values of Vector2.
 *
 * @return {Vector2} This for chaining.
 */
Vector2.prototype.clone = function () {
    return new Vector2(this.x, this.y);
};

/**
 * Copy the values of another Vector2 into this one.
 *
 * @param {Vector2} other The other Vector2.
 * @return {Vector2} This for chaining.
 */
Vector2.prototype.copy = function (other) {
    this.x = other.x;
    this.y = other.y;
    return this;
};

/**
 * Rotate this Vector2 by 90 degrees
 *
 * @return {Vector2} This for chaining.
 */
Vector2.prototype.perp = function () {
    var x = this.x;
    this.x = this.y;
    this.y = -x;
    return this;
};

/**
 * Reverse this Vector2.
 *
 * @return {Vector2} This for chaining.
 */
Vector2.prototype.reverse = function () {
    this.x = -this.x;
    this.y = -this.y;
    return this;
};

/**
 * Normalize (make unit length) this Vector2.
 *
 * @return {Vector2} This for chaining.
 */
Vector2.prototype.normalize = function () {
    var d = this.len();
    if (d > 0) {
        this.x = this.x / d;
        this.y = this.y / d;
    };
    return this;
};

/**
 * Add another Vector2 to this one.
 *
 * @param {Vector2} other The other Vector2.
 * @return {Vector2} This for chaining.
 */
Vector2.prototype.add = function (other) {
    this.x += other.x;
    this.y += other.y;
    return this;
};

/**
 * Subtract another Vector2 from this one.
 *
 * @param {Vector2} other The other Vector2.
 * @return {Vector2} This for chaiing.
 */
Vector2.prototype.sub = function (other) {
    this.x -= other.x;
    this.y -= other.y;
    return this;
};

/**
 * Scale this Vector2.
 *
 * @param {number} x The scaling factor in the x direction.
 * @param {?number=} y The scaling factor in the y direction.  If this
 *   is not specified, the x scaling factor will be used.
 * @return {Vector2} This for chaining.
 */
Vector2.prototype.scale = function (x, y) {
    this.x *= x;
    this.y *= y || x;
    return this;
};

/**
 * Project this Vector2 on to another Vector2.
 *
 * @param {Vector2} other The Vector2 to project onto.
 * @return {Vector2} This for chaining.
 */
Vector2.prototype.project = function (other) {
    var amt = this.dot(other) / other.len2();
    this.x = amt * other.x;
    this.y = amt * other.y;
    return this;
};

/**
 * Project this Vector2 onto a Vector2 of unit length.
 *
 * @param {Vector2} other The unit Vector2 to project onto.
 * @return {Vector2} This for chaining.
 */
Vector2.prototype.projectN = function (other) {
    var amt = this.dot(other);
    this.x = amt * other.x;
    this.y = amt * other.y;
    return this;
};

/**
 * Reflect this Vector2 on an arbitrary axis.
 *
 * @param {Vector2} axis The Vector2 representing the axis.
 * @return {Vector2} This for chaining.
 */
Vector2.prototype.reflect = function (axis) {
    var x = this.x;
    var y = this.y;
    this.project(axis).scale(2);
    this.x -= x;
    this.y -= y;
    return this;
};

/**
 * Reflect this Vector2 on an arbitrary axis (represented by a unit Vector2)
 *
 * @param {Vector2} axis The unit Vector2 representing the axis.
 * @return {Vector2} This for chaining.
 */
Vector2.prototype.reflectN = function (axis) {
    var x = this.x;
    var y = this.y;
    this.projectN(axis).scale(2);
    this.x -= x;
    this.y -= y;
    return this;
};

/**
 * Get the dot product of this Vector2 against another.
 *
 * @param {Vector2}  other The Vector2 to dot this one against.
 * @return {number} The dot product.
 */
Vector2.prototype.dot = function (other) {
    return this.x * other.x + this.y * other.y;
};

/**
 * Get the length^2 of this Vector2.
 *
 * @return {number} The length^2 of this Vector2.
 */
Vector2.prototype.len2 = function () {
    return this.dot(this);
};

/**
 * Get the length of this Vector2.
 *
 * @return {number} The length of this Vector2.
 */
Vector2.prototype.len = function () {
    return Math.sqrt(this.len2());
};