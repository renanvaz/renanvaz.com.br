//(function(){var e = 'sprite,shape,spritesheet,player'.split(','), i=e.length; while(i--){document.createElement(e[i])}})();

var DisplayObject = function(){
	this.el 		= null;
	this.parent 	= null;
	this.event 		= null;
	this.childs 	= [];
};

DisplayObject.prototype.bind = function(name, fn){
	if(!this.event)	this.event = new EventHandler(this);
	this.event.bind(name, fn);
};
DisplayObject.prototype.trigger = function(name, params, retroative){
	var retroative = retroative || false;

	if(!this.event)	this.event = new EventHandler(this);
		this.event.trigger(name, params);

	if(this.el)
		$(this.el).trigger(name, params);

	if(retroative && this.parent){
		this.parent.trigger(name, params);
	};
};
DisplayObject.prototype.addChild = function(child){
	child.parent = this;
	this.childs.push(child);
	this.trigger('onAdd', child);
	child.trigger('onAdded', this);
};


var Shape = {
	box			: Box,
	circle		: Circle,
	polygon		: Polygon,
	triangle	: Triangle,
	container	: DisplayObject,
	triangleType: {
		TOP_LEFT		: 1,
		TOP_RIGHT		: 2,
		BOTTOM_LEFT		: 3,
		BOTTOM_RIGHT	: 4,
	};
};

Shape.box.prototype 		= Object.extend(Shape.box.prototype , DisplayObject.prototype);
Shape.circle.prototype 		= Object.extend(Shape.circle.prototype , DisplayObject.prototype);
Shape.polygon.prototype 	= Object.extend(Shape.polygon.prototype , DisplayObject.prototype);
Shape.triangle.prototype 	= Object.extend(Shape.triangle.prototype , DisplayObject.prototype);

//Hack for COLLISION OBJECTS class
var HACK = function (obj){
	obj.__defineGetter__('pos', function () { return this.parent.getPositionForCollision().clone(); });
	obj.__defineGetter__('r', function () { return this.parent.width/2; });
	obj.__defineGetter__('w', function () { return this.parent.width; });
	obj.__defineGetter__('h', function () { return this.parent.height; });
};

var HACK2 = function (obj){
	obj.__defineGetter__('pos', function () { return this.parent.getPositionForCollision().clone().sub(new Vector2(this.parent.width/2, this.parent.height/2)); });
	obj.__defineGetter__('r', function () { return this.parent.width/2; });
	obj.__defineGetter__('w', function () { return this.parent.width; });
	obj.__defineGetter__('h', function () { return this.parent.height; });
};

HACK(Shape.circle.prototype);
HACK2(Shape.box.prototype);
HACK2(Shape.polygon.prototype);
HACK2(Shape.triangle.prototype);

var DebugDraw = function(){
	this.canvas = null;
	this.bind('onAdded', function(){
		var sprite = this.parent;
		var shape = sprite.shape;

		$('canvas', sprite.el).remove();

		this.canvas = $('<canvas width="'+sprite.width+'" height="'+sprite.height+'"></canvas>').css({position: 'absolute', top: 0, left: 0}).appendTo(sprite.el)[0];

		if (this.canvas.getContext){
			var ctx = this.canvas.getContext('2d');

			ctx.fillStyle = sprite.attr('data-debug-color', 'rgba(0, 0, 0, .5)');

			if(shape instanceof Box){
				ctx.fillRect(0, 0, sprite.width, sprite.height);
			}else if(shape instanceof Circle){
				ctx.beginPath();
				ctx.arc(shape.r, shape.r, shape.r, 0, Math.PI*2, true);
			}else if(shape instanceof Polygon){
				ctx.beginPath();
				ctx.moveTo(shape.points[0].x, shape.points[0].y);
				for(var i = 1; i < shape.points.length; i++){
					ctx.lineTo(shape.points[i].x, shape.points[i].y);
				};
				ctx.closePath();
			}else if(shape instanceof Triangle){
				ctx.beginPath();
				ctx.moveTo(shape.points[0].x, shape.points[0].y);
				ctx.lineTo(shape.points[1].x, shape.points[1].y);
				ctx.lineTo(shape.points[2].x, shape.points[2].y);
				ctx.closePath();
			};
			ctx.fill();
		};
	});
};
DebugDraw.prototype = new DisplayObject();

/*
 * Sprite
 * @param el (DOM element)
*/
var Sprite = function(el){
	this.el 			= el;

	this.type 			= 'static';
	this.width 			= 0;
	this.height 		= 0;
    this.mass 			= 0;
    this.velocity 		= new Vector2(0, 0);
    this.position 		= new Vector2(0, 0);
    this.force	 		= new Vector2(0, 0);

	this.config = {
		minVelocity		: new Vector2(-99999, -99999),
		maxVelocity		: new Vector2(99999, 99999),
		acceleration	: new Vector2(0, 0),
		resistance		: GAME.Physics.resistance.clone(),
		plataform		: false, //Enabled only collisions at the top
		collisionEnabled: true
	};

    this.cache 			= {}; //Cache of last states
    this.tiles 			= [];

	this.collisions 	= new CollisionData();
    this.spriteSheet 	= new SpriteSheet();
	this.shape 			= new Shape[this.attr('data-shape', 'box')]();

	this.onStep 		= null;
	this._body 			= [];

	this.bind('onAdd', function(child){
		if(child instanceof Sprite){
			this.getLastParent()._body.push(child);
		};
	});

	$(this.el).data('game', this).attr('data-sprite-initialized', 'true');


	if($(this.el).parent().is('[data-sprite]')){
		$(this.el).parent().sprite().addChild(this);
	};

	this.getHTMLdata();
    this.saveCurrentData();

    this.addChild(this.spriteSheet);
	this.addChild(this.shape);

	if(GAME.Settings.DEBUG_DRAW){
		this.debugDraw = new DebugDraw();
		this.addChild(this.debugDraw);
	};

	$(this.el).bind('fn.remove', function(e){
		var s = $(e.target).sprite();
		if(s) GAME._RemoveSprite(s);
	});
};

Sprite.prototype = new DisplayObject();

Sprite.prototype.attr = function(name, d){
	return $(this.el).getAttr(name, d);
};

Sprite.prototype.css = function(name, d){
	return ($(this.el).css(name) || d).toString().toNumber();
};

Sprite.prototype.getPositionForCollision = function(){
	var pos = new Vector2(this.position.x, this.position.y);
	var s;
	if(s = this.parent){
		pos.x += s.getPositionForCollision().x - s.width / 2;
		pos.y += s.getPositionForCollision().y - s.height / 2;
	};
	return pos;
};

Sprite.prototype.getLastParent = function(){
	var p = this;
	var s;
	if(s = this.parent){
		p = s.getLastParent();
	};
	return p;
};

Sprite.prototype.getTiles = function(){
	var t = this.tiles;
	for(var i = 0; i < this._body.length; i++){
		for(var j = 0; j < this._body[i].tiles.length; j++){
			t.push(this._body[i].tiles[j]);
		};
	};
	return t;
};

Sprite.prototype.saveCurrentData = function(){
    this.cache.html 		= this.getHtml();
    this.cache.width 		= this.width;
    this.cache.height 		= this.height;
    this.cache.mass 		= this.mass;
    this.cache.position 	= this.position.clone();
    this.cache.collisions 	= new CollisionData(this.collisions.data);

    GAME.TiledIndex.add(this);
};

Sprite.prototype.getHtml = function(){
	var html = '';
	for (var attr, i = 0, attrs = this.el.attributes, l = attrs.length; i < l; i++){
	    attr = attrs.item(i);
	    html += attr.nodeName + attr.nodeValue;
	};
	return html;
};

Sprite.prototype.getHTMLdata = function(){
	if(this.cache.html != undefined && this.getHtml() == this.cache.html) return false;

	this.type 		= this.attr('data-sprite', this.type);

    this.width 		=  $(this.el).width();
    this.height 	=  $(this.el).height();

    this.mass 		= this.width * this.height;
    this.position 	= new Vector2(this.css('left') + this.width/2, this.css('top') + this.height/2);

	this.config 	= {
		minVelocity	: new Vector2(this.attr('data-min-velocity-x', this.config.minVelocity.x), this.attr('data-min-velocity-y', this.config.minVelocity.y)),
		maxVelocity	: new Vector2(this.attr('data-max-velocity-x', this.config.maxVelocity.x), this.attr('data-max-velocity-y', this.config.maxVelocity.y)),
		acceleration: new Vector2(this.attr('data-acceleration-x', this.config.acceleration.x), this.attr('data-acceleration-y', this.config.acceleration.y)),
		resistance 	: new Vector2(this.attr('data-resistance-x', this.config.resistance.x), this.attr('data-resistance-y', this.config.resistance.y)),
		plataform	: this.attr('data-plataform', this.config.plataform).toString() == 'true',
		collisionEnabled: this.attr('data-collision-enabled', this.config.collisionEnabled).toString() == 'true'
	};

    if(GAME.Settings.DEBUG_DRAW && this.debugDraw){
		this.addChild(this.shape);
		this.addChild(this.debugDraw);
	};

    if(this.type == 'static' && this.cache.position){
        //Calculate velocity of element out game - DESLOCAMENTO
        this.velocity = new Vector2(this.position.x - this.cache.position.x, this.position.y - this.cache.position.y);
    };
};

Sprite.prototype.addVelocity = function (x, y) {
	this.velocity.add(new Vector2(x, y));
};

Sprite.prototype.setVelocity = function (x, y) {
	this.velocity.copy(new Vector2(x, y));
};

Sprite.prototype.collide = function(other){
	this._collide(other);

	for(var i = 0; i < this._body.length; i++){
		this._body[i]._collide(other);
	};
};

Sprite.prototype._collide = function(other){
	var collided = false;
	var response = new Response();
	var shape_self = this.shape;
	var shape_other = other.shape;

	shape_self = shape_self instanceof Box || shape_self instanceof Triangle ? shape_self.toPolygon() : shape_self;
	shape_other = shape_other instanceof Box || shape_other instanceof Triangle ? shape_other.toPolygon() : shape_other;
	if(shape_self instanceof Polygon && shape_other instanceof Polygon){
		collided = testPolygonPolygon(shape_self, shape_other, response);
	} else if(shape_self instanceof Circle && shape_other instanceof Circle){
		collided = testCircleCircle(shape_self, shape_other, response);
	} else if(shape_self instanceof Circle && shape_other instanceof Polygon){
		collided = testCirclePolygon(shape_self, shape_other, response);
	} else if(shape_self instanceof Polygon && shape_other instanceof Circle){
		collided = testPolygonCircle(shape_self, shape_other, response);
	};

	//console.log(collided, response, this.position.toString(), other.position.toString());

	if(collided){
		other._hit = {
			top: response.overlapV.y > 0,
			bottom: response.overlapV.y < 0,
			right: response.overlapV.x > 0,
			left: response.overlapV.x < 0
		};

		this._hit = {
			top: response.overlapV.y < 0,
			bottom: response.overlapV.y > 0,
			right: response.overlapV.x < 0,
			left: response.overlapV.x > 0
		};

		var collision = new Collision(this, other);

		if(other.type != 'sensor' && this.type != 'sensor' && this.config.collisionEnabled){
			if(this.config.collisionEnabled && other.config.collisionEnabled){
				if((!other.config.plataform && !this.config.plataform) || (collision.self.hit.bottom && this.cache.position.y + this.cache.height/2 <= other.cache.position.y - other.cache.height/2)){
					this.getLastParent().position.sub(response.overlapV);
					if((collision.self.hit.left || collision.self.hit.right || (this.type == 'dynamic' && other.type == 'dynamic' && (collision.self.hit.top /*|| collision.self.hit.bottom*/))) && !(other.type == 'static' && other.velocity.x == 0)){
						elasticCollision(collision);
					}else{
						if(response.overlapV.x != 0)
							this.getLastParent().velocity.x = 0;

						if(response.overlapV.y != 0 && (collision.self.hit.top || (collision.self.hit.bottom && this.cache.position.y <= this.position.y)))
							this.getLastParent().velocity.y = 0;
					};
					this.collisions.addCollision(collision);
				};
			};
		}else{
			this.collisions.addCollision(collision);
		};
	}else{
		this.collisions.removeCollision(this.collisions.getCollision(other));
	};
};


Sprite.prototype.addVelocityOfObjectsInCollision = function(){
	/*if(this == $('[game-player]').sprite()){
		console.log(this.collisions.data);
	}*/
    $.each(this.collisions.data, function(i, collision){
    	if(collision.other.sprite.type != 'sensor' && collision.self.sprite.type != 'sensor'){
	        if(collision.other.sprite.velocity.x != 0 || collision.other.sprite.velocity.y != 0){
	            collision.other.sprite.getHTMLdata();
	            if(collision.self.hit.bottom){
	                collision.self.sprite.position.x += collision.other.sprite.velocity.x;
	                collision.self.sprite.position.y += collision.other.sprite.velocity.y;
	            }else if(collision.self.hit.top){
	                collision.self.sprite.position.y += collision.other.sprite.velocity.y;
	            }else if(collision.self.hit.left || collision.self.hit.right){
	                collision.self.sprite.position.x += collision.other.sprite.velocity.x;
	            };
	        };
	    };
    });
};

Sprite.prototype.process = function(){
	if(!this.el){
		Game._RemoveSprite(this);
		return false;
	};

	if(this.type != 'dynamic') return false;


    //this.getHTMLdata(); //Deve deixar um pouco lento
    this.saveCurrentData(); //Se descomentar a linha de cima pode comentar esta

	//if(this.collisions.data.length) this.addVelocityOfObjectsInCollision();

	this.velocity.add(new Vector2((GAME.Physics.acceleration.x + this.config.acceleration.x) * GAME.Time.ELAPSED_PERCENT, (GAME.Physics.acceleration.y + this.config.acceleration.y) * GAME.Time.ELAPSED_PERCENT));

    if(this.velocity.y < this.config.minVelocity.y) this.velocity.y = this.config.minVelocity.y;
    if(this.velocity.y > this.config.maxVelocity.y) this.velocity.y = this.config.maxVelocity.y;
    if(this.velocity.x < this.config.minVelocity.x) this.velocity.x = this.config.minVelocity.x;
    if(this.velocity.x > this.config.maxVelocity.x) this.velocity.x = this.config.maxVelocity.x;

    this.position.y += (this.velocity.y * GAME.Time.ELAPSED_PERCENT);
    this.position.x += (this.force.x * GAME.Time.ELAPSED_PERCENT) + (this.velocity.x * GAME.Time.ELAPSED_PERCENT);

    this.calcResistance(this.velocity);

	var sprite = this;

	if(GAME.TiledIndex.hasOther(sprite) || this.collisions.data.length){
		var collision, i, other, others = GAME.TiledIndex.getOther(sprite);

	    for(i = 0; i < this.collisions.data.length; i++){
	    	collision = this.collisions.data[i];
	    	if(collision.other.sprite.el){
	        	sprite.collide(collision.other.sprite);
	    	};
	    };

	    for(i = 0; i < others.length; i++){
	    	other = others[i];
	    	if(other.el){
	        	sprite.collide(other);
	        };
	    };
	};

    if(this.onStep) this.onStep(GAME.Time.ELAPSED_TIME);
};

Sprite.prototype.calcResistance = function(ve2){
    if(ve2.y > 0){
        ve2.y -= this.config.resistance.y * GAME.Time.ELAPSED_PERCENT;
        if(ve2.y < 0) ve2.y = 0;
    };

    if(ve2.y < 0){
        ve2.y += this.config.resistance.y * GAME.Time.ELAPSED_PERCENT;
        if(ve2.y > 0) ve2.y = 0;
    };

    if(ve2.x > 0){
        ve2.x -= this.config.resistance.x * GAME.Time.ELAPSED_PERCENT;
        if(ve2.x < 0) ve2.x = 0;
    };

    if(ve2.x < 0){
        ve2.x += this.config.resistance.x * GAME.Time.ELAPSED_PERCENT;
        if(ve2.x > 0) ve2.x = 0;
    };
    return ve2;
};

Sprite.prototype.apply = function(){
	if(this.position.x != this.cache.position.x
		|| this.position.y != this.cache.position.y
		|| this.height != this.cache.height
		|| this.width != this.cache.width){
		$(this.el).css({
			top: Math.round(this.position.y - this.height/2),
			left: Math.round(this.position.x - this.width/2),
			width: this.width,
			height: this.height
		});

		if(this.height != this.cache.height || this.width != this.cache.width){
			this.shape = new Shape[this.attr('data-shape', 'box')]();
			this.addChild(this.shape);

			if(GAME.Settings.DEBUG_DRAW){
				this.debugDraw = new DebugDraw();
				this.addChild(this.debugDraw);
			};
		};
	};
};

/*
 * SpriteSheet animation image class
*/

var SpriteSheet = function(){
	var self 		= this;
	this.data 		= {};
	this.timer 		= null;
	this.current 	= '';
	this.div 		= '';

	this.defaults = {
		image: '',
		width: 0,
		height: 0,
		fromTo: [],
		order: [],
		repeat: true,
		FPS: 0,
		onPlay: function(){},
		onStop: function(){},
		onComplete: function(){};
	};

	this.bind('onAdded', function(){
		this.div = $('<div>').css({position: 'absolute', bottom: 0});
		$(this.parent.el).append(this.div);
	});

	this.add = function(name, config){
		this.data[name] = config instanceof SpriteSheetData ? config : new SpriteSheetData(config);
		this.addChild(this.data[name]);
	};

	this.remove = function(name, config){
		delete this.data[name];
	};

	this.get = function(name){
		return this.data[name];
	};

	this.stop = function(){
		if(this.current != ''){
			this.get(this.current).config.onStop.apply(this.get(this.current));
		};
		this.current = '';
		clearInterval(this.timer);
	};

	this.play = function(name){
		if(this.current != name && this.data[name]){
			this.stop();
			this.current = name;
			this.get(this.current).config.onPlay.apply(this.get(this.current));
			this.div.css({backgroundImage: 'url('+this.data[name].config.image+')'});
			this._draw();
			this.timer = setInterval(this._draw, 1000/this.data[name].config.FPS);
		};
	};

	this.setDefaults = function(d){
		this.defaults = $.extend({}, this.defaults, d);
	};

	this._draw = function(){
		self.data[self.current].draw();
	};
};
SpriteSheet.prototype = new DisplayObject();

/*
 * SpriteSheetData to use in SpriteSheet
 * @param config (Object)
*/
var SpriteSheetData = function(config){
	var self = this;

	this.imageData = {width: 0, height: 0, maxSpriteX: 0};
	this.config = config;

	this.bind('onAdded', function(){
		this.config = $.extend({}, this.parent.defaults, this.config);

		if(this.config.fromTo.length > 0){
			this.config.order = [];
			this.config.fromTo[1] = this.config.fromTo[1] || this.config.fromTo[0];
			if(this.config.fromTo[1] < this.config.fromTo[0]){
				for(var i = this.config.fromTo[0]; i >= this.config.fromTo[1]; i--){
					this.config.order.push(i);
				};
			}else{
				for(var i = this.config.fromTo[0]; i <= this.config.fromTo[1]; i++){
					this.config.order.push(i);
				};
			};
		};

		this.frame = 0;

		var img = new Image();
		img.onload = function(){
			self.imageData.width 		= this.width;
			self.imageData.height 		= this.height;
			self.imageData.maxSpriteX 	= Math.floor(self.imageData.width / self.config.width);
			self.draw();

			GAME.Preloader.add(this.src);
		};
		img.src = this.config.image;

		//self.config.onPlay.apply(this);
	});

	this.draw = function(){
		if(this.frame >= this.config.order.length && !this.config.repeat){
			this.parent.stop();
			this.config.onComplete.apply(this);
		}else{
			if(this.frame < 0) this.frame = this.config.order.length - 1;
			if(this.frame >= this.config.order.length) this.frame = 0;
		};

		var x = this.config.order[this.frame] % this.imageData.maxSpriteX;
		var y = Math.floor(this.config.order[this.frame] / this.imageData.maxSpriteX);

		$(this.parent.div).css({
			width			: this.config.width,
			height			: this.config.height,
			left			: -(this.config.width - this.parent.parent.width)/2,
			backgroundPosition : '-'+(x * this.config.width)+'px -'+(y * this.config.height)+'px'
		});

		this.frame++;
	};
};
SpriteSheetData.prototype = new DisplayObject();


var Camera = function(el){
    this.el = el;

    this.target = null;
    this.size = {
        width: 0,
        height:0
    };

    this.position = new Vector2(0, 0);

    var self = this;

    this.setSize = function(w, h){
        this.size.width = w;
        this.size.height = h;

        if(GAME.Stage.size.width < this.size.width){
            throw "The Stage width can't be less than Camera width";
        };

        if(GAME.Stage.size.height < this.size.height){
            throw "The stage height can't be less than Camera height";
        };

        this.apply();
    };

    this.apply = function(){
        $(this.el).css({
            height: this.size.height,
            width: this.size.width
        });

        GAME.Stage.position = new Vector2(-this.position.x, -this.position.y);
		GAME.Stage.apply();
    };

    this.look = function(sprite){
        this.target = sprite;
    };

    this.follow = function(){
		if(this.target){
			self.position = new Vector2(self.target.position.x - self.size.width/2, self.target.position.y - self.size.height/2);

			if(self.position.x < 0) self.position.x = 0;
			if(self.position.x > GAME.Stage.size.width - self.size.width) self.position.x = GAME.Stage.size.width - self.size.width;
			if(self.position.y < 0) self.position.y = 0;
			if(self.position.y > GAME.Stage.size.height - self.size.height) self.position.y = GAME.Stage.size.height - self.size.height;

			self.apply();
		};
    };
};
Camera.prototype = new DisplayObject();


var Stage = function(el){
    this.el = el;

    this.size = {width: 0, height:0};
	this.position = new Vector2(0, 0);
	this.parallax = {};

    this.setSize = function(w, h){
		$('[game-stage-bounds]').remove();
		$('<div game-sprite="static" game-stage-bounds="true"><div>').css({position: 'absolute', width: 100, height: h, top: 0, left: -100}).prependTo($('[game-stage]'));
		$('<div game-sprite="static" game-stage-bounds="true"><div>').css({position: 'absolute', width: 100, height: h, top: 0, right: -100}).prependTo($('[game-stage]'));
		$('<div game-sprite="static" game-stage-bounds="true"><div>').css({position: 'absolute', width: w, height: 100, top: -100, left: 0}).prependTo($('[game-stage]'));
		$('<div game-sprite="static" game-stage-bounds="true"><div>').css({position: 'absolute', width: w, height: 100, bottom: -100, left: 0}).prependTo($('[game-stage]'));

        this.size.width = w;
        this.size.height = h;

        this.apply();
    };

    this.apply = function(){
        $(this.el).css({
            height: this.size.height,
            width: this.size.width,
            top: Math.round(this.position.y),
            left: Math.round(this.position.x)
        });

		for(var i in this.parallax){
			this.parallax[i].draw();
		};
    };

	this.addParallax = function(name, config){
		var p = config instanceof StageParallax ? config : new StageParallax(config);
		this.addChild(p);
		this.parallax[name] = p;
	};

	this.removeParallax = function(name, config){
		delete this.parallax[name];
	};

	this.getParallax = function(name){
		return this.parallax[name];
	};
};
Stage.prototype = new DisplayObject();


var StageParallax = function(config){
	this.config = config;

	this.defaults = {
		image: '',
		doom: '',
		parallaxX: .3,
		parallaxY: 0
	};

	this.bind('onAdded', function(){
		this.config = $.extend({}, this.defaults, this.config);

		if(this.config.image != ''){
			GAME.Preloader.add(this.config.image);
			this.div = $('<div game-stage-parallax="true">').css({position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, zIndex: -1, background: 'url('+this.config.image+') 0 0'});
		}else if(this.config.dom != ''){
			this.div = $('<div game-stage-parallax="true">').css({position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}).append(this.config.dom.css('position', 'relative'));
		};
		$(this.parent.el).append(this.div);
	});

	this.draw = function(){
		if(this.config.image != ''){
			$(this.div).css({
				backgroundPosition: (Math.round(this.config.parallaxX * this.parent.position.x))+'px '+(Math.round(this.config.parallaxY * this.parent.position.y))+'px'
			});
		}else if(this.config.dom != ''){
			$(this.div).css({
				left: Math.round(this.config.parallaxX * this.parent.position.x),
				top: Math.round(this.config.parallaxY * this.parent.position.y)
			});
		};
	};
};
StageParallax.prototype = new DisplayObject();
