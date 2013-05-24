var Player, jump = false, crouch = false, lookUp = false;

var EteImage = (function(){
	function EteImage(){
		var self = this;
		this.data = {index: [], cache: {}};
	};

	EteImage.prototype = new DisplayObject();

	EteImage.prototype.cache = function(colors){
		var self = this;
		var count = 0;
		for(var i = 0; i < colors.length; i++){
			var img = {
				ete: new Image,
				explode: new Image
			};

			var nocache = +new Date;

			img.ete.onload = function(){
				if(++count == colors.length*2){
					self.trigger('cached');
				};
			};

			img.explode.onload = function(){
				if(++count == colors.length*2){
					self.trigger('cached');
				};
			};

			img.ete.src = 'get_image.php?color='+encodeURIComponent(colors[i])+'&'+nocache;
			img.explode.src = 'get_image.php?explode=&color='+encodeURIComponent(colors[i])+'&'+nocache;

			self.data.index.push(colors[i]);
			self.data.cache[colors[i]] = img;
		};
	};

	EteImage.prototype.getRandomCached = function(){
		return this.data.cache[this.data.index[Math.round(Math.random() * (this.data.index.length -1))]];
	};

	return EteImage;
})();

var EteImageGenerator = new EteImage();
var explodeColor;

//Weapons
var Gun = function (){
	this.dagmage = 5;
	this.can = true;
};

Gun.prototype = new DisplayObject();

Gun.prototype.attack = function(){
	if(this.can && !jump){
		var self = this, html, parent = this.parent, left = parent.position.x, top = parent.position.y - 11, size = 28, padding = 30;

		if(GAME.Key.LEFT){
			html = '<div data-sprite="dynamic" data-entity="shotLeft"/>';
			left = parent.position.x - parent.width/2 - padding;
		}else if(GAME.Key.RIGHT){
			html = '<div data-sprite="dynamic" data-entity="shotRight"/>';
			left = parent.position.x + parent.width/2 + padding;
		}else{
			html = '<div data-sprite="dynamic" data-entity="shot'+(parent.spriteSheet.current.toLowerCase().indexOf('left') != -1 ? 'Left' : 'Right')+'"/>';
			left = (parent.spriteSheet.current.toLowerCase().indexOf('left') != -1 ? parent.position.x - parent.width/2 - size - padding : parent.position.x + parent.width/2 + padding);
		};

	    var el = $(html).css({
	        left: left,
	        top: top
	    })
	    .appendTo(GAME.Stage.el);
	    GAME._SearchSprites();

	    this.can = false;
	    Player.velocity.x = 0;
	    Player.spriteSheet.play('shot'+(parent.spriteSheet.current.toLowerCase().indexOf('left') != -1 ? 'Left' : 'Right'));
	    setTimeout(function(){
	    	self.can = true;
	    	Player.spriteSheet.play('idle'+(parent.spriteSheet.current.toLowerCase().indexOf('left') != -1 ? 'Left' : 'Right'));
	    }, 300);

	};
};

var shotBase = function(sprite){
	this.sprite = sprite;

	this.velocity = 600;
	this.sprite.config.collisionEnabled = false;
	this.sprite.config.resistance = new Vector2(0, 0);

	this.sprite.spriteSheet.play('normal');

	setTimeout(function(){ $(sprite.el).remove(); GAME._RemoveSprite(sprite); }, 3000);

	$(this.sprite.el).bind('hittest.in', function(e, collision){
		if(collision.other.sprite != Player && !collision.other.sprite.config.plataform && collision.other.sprite.type != 'sensor'){
			$(collision.self.sprite.el).remove();
			GAME._RemoveSprite(collision.self.sprite);
		};

		var dataObject = collision.other.sprite.attr('data-entity');
		if(dataObject && dataObject == 'EteEnemy'){
			explodeColor = collision.other.sprite.image.explode.src;
			var ex = $('<div data-sprite="sensor" data-entity="EteExplode" style="width: 233px; height: 192px;">');
			$(GAME.Stage.el).append(ex);
			GAME._SearchSprites();

			ex.sprite().position.x = collision.other.sprite.position.x;
			ex.sprite().position.y = collision.other.sprite.position.y;

			ex.sprite().apply();

			$(collision.other.sprite.el).remove();

			setTimeout(function(){
				randomEnemy();
			}, 8000);
		};
	});
};

GAME.OnStep = function(){};

GAME.Entity.GamePlayer = function(sprite){
	Player = sprite;
	sprite.position.y = 1500 - 300;
	GAME.Camera.look(Player);

	this.sprite = sprite;
	this.sprite.weapon = new Gun();
	this.sprite.addChild(this.sprite.weapon);


	var image = EteImageGenerator.data.cache[EteImageGenerator.data.index[0]];
	this.sprite.image = image;
	this.sprite.spriteSheet.setDefaults({image: image.ete.src, width: 196, height: 158, FPS: 10});
	this.sprite.spriteSheet.add('left', 		{order: [28, 27, 26, 25, 34, 33, 32, 31, 30, 39]});
	this.sprite.spriteSheet.add('right', 		{fromTo: [1, 10]});
	this.sprite.spriteSheet.add('jumpLeft', 	{order: [47], FPS: 1});
	this.sprite.spriteSheet.add('fallLeft', 	{order: [35, 44, 43, 42, 41, 40, 49, 48], FPS: 30});
	this.sprite.spriteSheet.add('jumpRight', 	{order: [22], FPS: 1});
	this.sprite.spriteSheet.add('fallRight', 	{fromTo: [14, 21], FPS: 30});
	this.sprite.spriteSheet.add('idleRight', 	{order: [0], FPS: 1});
	this.sprite.spriteSheet.add('idleLeft', 	{order: [29], FPS: 1});
	this.sprite.spriteSheet.add('shotRight', 	{order: [12, 13], FPS: 7});
	this.sprite.spriteSheet.add('shotLeft', 	{order: [37, 36], FPS: 7});
	this.sprite.spriteSheet.play('idleRight');

	function position(){
		$(sprite.el).hide().fadeIn();
		sprite.position.y = 1500 - 300;
		sprite.position.x = 50;
		sprite.setVelocity(600, -600);
	};

	setTimeout(function(){
		position();
	}, 1000);

	var sprite = this.sprite;
	this.sprite.onStep = function(){
		if(sprite.spriteSheet.current == 'shotLeft' || sprite.spriteSheet.current == 'shotRight'){
			return false;
		};

		if(sprite.spriteSheet.current == 'dead') return false;

	    if(GAME.Key.LEFT && !crouch && !lookUp){
	        sprite.velocity.x = -300;
	    }else if(GAME.Key.RIGHT && !crouch && !lookUp){
	       sprite.velocity.x = 300;
	    };

	    if((GAME.Key.SPACE || GAME.Key.UP) && !jump){
	        sprite.velocity.y -= 830;
	        jump = true;
	    };

		if(sprite.velocity.y < 0){
			if(sprite.cache.position.x < sprite.position.x || (sprite.cache.position.x == sprite.position.x && sprite.spriteSheet.current.toLowerCase().indexOf('right') != -1)){
				sprite.spriteSheet.play('jumpRight');
			}else{
				sprite.spriteSheet.play('jumpLeft');
			};
		}else if(sprite.velocity.y > 0){
			if(sprite.cache.position.x < sprite.position.x || (sprite.cache.position.x == sprite.position.x && sprite.spriteSheet.current.toLowerCase().indexOf('right') != -1)){
				sprite.spriteSheet.play('fallRight');
			}else{
				sprite.spriteSheet.play('fallLeft');
			};
		}else{
			if(!crouch && !lookUp){
				if (sprite.velocity.x != 0) {
					if (sprite.velocity.x > 0) {
						sprite.spriteSheet.play('right');

						if(sprite.velocity.x > 0 && GAME.Key.LEFT){
							sprite.spriteSheet.play('breakRight');
						};
					} else {
						sprite.spriteSheet.play('left');

						if(sprite.velocity.x < 0 && GAME.Key.RIGHT){
							sprite.spriteSheet.play('breakLeft');
						};
					};
				} else {
					if(sprite.spriteSheet.current != 'idleLeft' && sprite.spriteSheet.current != 'idleRight'){
						if(sprite.cache.position.x > sprite.position.x || sprite.spriteSheet.current.toLowerCase().indexOf('right') == -1){
							sprite.spriteSheet.play('idleLeft');
						}else{
							sprite.spriteSheet.play('idleRight');
						};
					};
				};
			};
		};
	};
};

GAME.Entity.shotLeft = function(sprite){
	var shot = new shotBase(sprite);
	shot.sprite.config.acceleration = new Vector2(0, -GAME.Physics.acceleration.y);
	shot.sprite.velocity = new Vector2(-shot.velocity, 0);
};

GAME.Entity.shotRight = function(sprite){
	var shot = new shotBase(sprite);
	shot.sprite.config.acceleration = new Vector2(0, -GAME.Physics.acceleration.y);
	shot.sprite.velocity = new Vector2(shot.velocity, 0);
};

GAME.Entity.EteExplode = function(sprite){
	this.sprite = sprite;

	this.sprite.spriteSheet.add('normal', new SpriteSheetData({fromTo: [0, 9], image: explodeColor, width: 233, height: 192, FPS: 30, repeat: false, onComplete: function(){ $(this.parent.parent.el).remove(); }}));
	this.sprite.spriteSheet.play('normal');
};

GAME.Entity.EteEnemy = function(sprite){
	var self = this;
	var velX = 150;
	this.sprite = sprite;

	var image = EteImageGenerator.getRandomCached();
	this.sprite.image = image;
	this.sprite.spriteSheet.setDefaults({image: image.ete.src, width: 196, height: 158, FPS: 10});
	this.sprite.spriteSheet.add('left', 		{order: [28, 27, 26, 25, 34, 33, 32, 31, 30, 39]});
	this.sprite.spriteSheet.add('right', 		{fromTo: [1, 10]});
	this.sprite.spriteSheet.add('jumpLeft', 	{order: [47], FPS: 1});
	this.sprite.spriteSheet.add('fallLeft', 	{order: [35, 44, 43, 42, 41, 40, 49, 48], FPS: 30});
	this.sprite.spriteSheet.add('jumpRight', 	{order: [22], FPS: 1});
	this.sprite.spriteSheet.add('fallRight', 	{fromTo: [14, 21], FPS: 30});
	this.sprite.spriteSheet.add('idleRight', 	{order: [0], FPS: 1});
	this.sprite.spriteSheet.add('idleLeft', 	{order: [29], FPS: 1});
	this.sprite.spriteSheet.add('shotRight', 	{order: [12, 13], FPS: 7});
	this.sprite.spriteSheet.add('shotLeft', 	{order: [37, 36], FPS: 7});
	this.sprite.spriteSheet.play('idleRight');

	this.sprite.config.resistance.x = 0;
	this.sprite.position.y = GAME.Camera.position.y - this.sprite.height;
	this.sprite.velocity.x = Math.round(Math.random()) * (velX*2) - velX;

	$(this.sprite.el).bind('hittest.in', function(e, collision){
		if(!collision.self.hit.bottom){
			var dataObject = collision.other.sprite.attr('data-entity');
			if(collision.self.hit.left){
				collision.self.sprite.velocity.x = -velX;
			}else if(collision.self.hit.right){
				collision.self.sprite.velocity.x = velX;
			};
		};
	});

	var sprite = this.sprite;
	this.sprite.onStep = function(){
		if(sprite.velocity.y < 0){
			if(sprite.cache.position.x < sprite.position.x || (sprite.cache.position.x == sprite.position.x && sprite.spriteSheet.current.toLowerCase().indexOf('right') != -1)){
				sprite.spriteSheet.play('jumpRight');
			}else{
				sprite.spriteSheet.play('jumpLeft');
			};
		}else if(sprite.velocity.y > 0){
			if(sprite.cache.position.x < sprite.position.x || (sprite.cache.position.x == sprite.position.x && sprite.spriteSheet.current.toLowerCase().indexOf('right') != -1)){
				sprite.spriteSheet.play('fallRight');
			}else{
				sprite.spriteSheet.play('fallLeft');
			};
		}else{
			if(!crouch && !lookUp){
				if (sprite.velocity.x != 0) {
					if (sprite.velocity.x > 0) {
						sprite.spriteSheet.play('right');
					} else {
						sprite.spriteSheet.play('left');
					};
				} else {
					if(sprite.spriteSheet.current != 'idleLeft' && sprite.spriteSheet.current != 'idleRight'){
						if(sprite.cache.position.x > sprite.position.x || sprite.spriteSheet.current.toLowerCase().indexOf('right') == -1){
							sprite.spriteSheet.play('idleLeft');
						}else{
							sprite.spriteSheet.play('idleRight');
						};
					};
				};
			};
		};
	};
};
