/*  Author: Renan Vaz && Wormwood (Márcio Laubstein)
 *	Version: 3.0
*/

var GAME = {
    Settings: {
		DEBUG_DRAW: false,
		DEBUG_COLLISION_INDEX: false,
        FPS_PROCESS: 60,
        //FPS_DRAW: 40, //In use request animation frame browser suport
        FPS_SEARCH: false
    },
    Time: {
    	LAST_TIME: 0,
		ELAPSED_TIME: 0,
		ELAPSED_PERCENT: 0,
		TIME_COUNTER: 0
    },
    Physics: {
        acceleration: new Vector2(0, 2000),
        resistance: new Vector2(600, 0)
    },
    Key: {},
    Stage: new Stage($('[data-stage]')),
    Camera: new Camera($('[data-camera]')),
    Preloader: new Preloader(),
    TiledIndex: null,
	Entity: {}, //Helper of instance Objects
    Paused: false,
    Sprites: {
        All: [],
		Animated: [],
        Type: {
            dynamic: [],
            static: [],
            sensor: []
        }
    },
    Create: function(){
    	this._initKeys();

        $.fx.interval = 1000/this.Settings.FPS;

        this.TiledIndex 	= new TiledIndex();

		this.Time.LAST_TIME = new Date().getTime();

        this._initEntities();
        this._SearchSprites();

    	this._initFPS();
    },
    _initFPS: function(){
    	//setInterval(this._Draw, 1000/this.Settings.FPS_DRAW);
        //setInterval(this._Process, 1000/this.Settings.FPS_PROCESS);

        if(this.Settings.FPS_SEARCH !== false){
            setInterval(this._SearchSprites, 1000/this.Settings.FPS_SEARCH);
        }

        this._SearchSprites();

        RequestAnimFrame.add(this._Process);
		RequestAnimFrame.start();
    },
    _initKeys: function(){
    	var _KEYS = {
            LEFT: '37|65',
            UP: '38|87',
            RIGHT: '39|68',
            DOWN: '40|83',
            SPACE: '32'
        };

        $(document)
        .keydown(function(e){
            var keyCode = e.keyCode || e.which;
            var has = false, _has;
            var rg;

            for(var i in _KEYS){
            	rg = new RegExp(_KEYS[i], 'gi');
            	_has = rg.test(keyCode.toString());
            	has = has ? has : _has;
                GAME.Key[i] = _has ? true : GAME.Key[i];
            }

			if(has) e.preventDefault();
        })
        .keyup(function(e){
            var keyCode = e.keyCode || e.which;
            var has = false, _has;
            var rg;

            for(var i in _KEYS){
            	rg = new RegExp(_KEYS[i], 'gi');
            	_has = rg.test(keyCode.toString());
            	has = has ? has : _has;
                GAME.Key[i] = _has ? false : GAME.Key[i];
            }

			if(has) e.preventDefault();
        });
    },
    _initEntities: function(){
    	for(var i in this.Entity){
    		var div = $('<div data-sprite="static" style="top: -1000px; left: -1000px;"></div>')[0];
    		var s = new Sprite(div);
    		this.Entity[i](s);
    	}
    },
    _SearchSprites: function(){
		if(!GAME.Paused){
			if($('[data-sprite]:not([data-sprite-initialized])').length){
				$('[data-sprite]:not([data-sprite-initialized])').each(function(){
					var sprite = new Sprite(this);
					GAME._AddSprite(sprite);
				});
				$('[data-sprite][data-entity]:not([data-entity-instance])').each(function(){
					$(this).sprite().instance = new GAME.Entity[$(this).attr('data-entity-instance', 'true').attr('data-entity')]($(this).sprite());
				});
			}
			GAME.Sprites.Animated = [];
			$('[data-sprite="static"], [data-sprite="sensor"]').each(function(){
				var sprite = $(this).sprite();
				var size = {
					width: $(sprite.el).width(),
					height: $(sprite.el).height()
				}

				var position = new Vector2($(sprite.el).css('left').toNumber() + size.width/2, $(sprite.el).css('top').toNumber() + size.height/2);

				if(sprite.cache.position.x != position.x || sprite.cache.position.y != position.y || sprite.cache.height != size.height || sprite.cache.width != size.width){
					GAME.Sprites.Animated.push(sprite);
				}
			});
		}
    },
	_AddSprite: function(sprite){
		GAME.Sprites.All.push(sprite);
		GAME.Sprites.Type[sprite.type].push(sprite);
	},
	_RemoveSprite: function(sprite){
		GAME.Sprites.All = Arr.remove(GAME.Sprites.All, sprite);
		GAME.Sprites.Type[sprite.type] = Arr.remove(GAME.Sprites.Type[sprite.type], sprite);
		GAME.Sprites.Animated = Arr.remove(GAME.Sprites.Animated, sprite);

		GAME.TiledIndex.removeSprite(sprite);

        sprite.el = false;
	},
    _Process: function(){
        if(GAME.statsProcess) GAME.statsProcess.end();
        if(GAME.statsProcess) GAME.statsProcess.begin();

		if(!GAME.Paused){
            if(GAME._Paused == true){
                GAME.Time.LAST_TIME = new Date().getTime();
            }

            var i, sprite;
            var time = new Date().getTime();
            GAME.Time.ELAPSED_TIME      = time - GAME.Time.LAST_TIME;
            GAME.Time.ELAPSED_TIME      = GAME.Time.ELAPSED_TIME > 100 ? 100 : GAME.Time.ELAPSED_TIME;
            GAME.Time.LAST_TIME         = time;
            GAME.Time.ELAPSED_PERCENT   = GAME.Time.ELAPSED_TIME / 1000; //Per second
            GAME.Time.TIME_COUNTER      += GAME.Time.ELAPSED_TIME;

			//if(GAME.Settings.DEBUG_DRAW){
            for(i = 0; i< GAME.Sprites.Type.static.length; i++){
                sprite = GAME.Sprites.Type.static[i];
    			sprite.getHTMLdata();
                sprite.apply();
            }
            //}

            for(i = 0; i < GAME.Sprites.Type.sensor.length; i++){
                sprite = GAME.Sprites.Type.sensor[i];
				sprite.getHTMLdata();
				sprite.apply();
			};

            for(i = 0; i < GAME.Sprites.Animated.length; i++){
                sprite = GAME.Sprites.Animated[i];
				sprite.getHTMLdata();
			};

            for(i = 0; i < GAME.Sprites.Type.dynamic.length; i++){
                sprite = GAME.Sprites.Type.dynamic[i];
                sprite.process();
				sprite.apply();
			};

			GAME.Camera.follow();

            for(i = 0; i < GAME.Sprites.Type.static.length; i++){
                sprite = GAME.Sprites.Type.static[i];
				sprite.saveCurrentData();
			};

            for(i = 0; i < GAME.Sprites.Type.sensor.length; i++){
                sprite = GAME.Sprites.Type.sensor[i];
				sprite.saveCurrentData();
			};

            GAME.OnStep(GAME.Time.ELAPSED_TIME);
		}
        GAME._Paused = GAME.Paused;
    },
	OnStep: function(){},  //Verificar se vale a pena tornar isto um evento

	ShowStats: function(){
		try{
			this.statsProcess = new Stats('Process');
			this.statsProcess.setMode(0);
			this.statsProcess.domElement.style.position = 'absolute';
			this.statsProcess.domElement.style.left = '0px';
			this.statsProcess.domElement.style.top = '0px';

			document.body.appendChild( this.statsProcess.domElement );
		}catch(e){
			throw 'ShowStatus needs of Stats.js embeded';
		}
	}

}

var rAF = (function() {
	var window = {};
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.request = window[vendors[x]+'RequestAnimationFrame'];
        window.cancel = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.request)
        window.request = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancel)
        window.cancel = function(id) {
            clearTimeout(id);
        };

	return window;
})();

var _RequestAnimFrame = function(){
	//throw "Timer can't be instanciated";
	var self = this;
	this.data = [];

	this.add = function(fn){
		this.data.push(fn);
	}

	this.time = function(time){
		for(var i = 0; i < self.data.length; i++){
			setTimeout(function(fn){
				fn();
				rAF.request(self.time);
			}, 5, self.data[i]);
		}
	}

	this.start = function(){
		rAF.request(this.time);
	}
}

var RequestAnimFrame = new _RequestAnimFrame();

(function() {
    var hidden, change, vis = {
            hidden: "visibilitychange",
            mozHidden: "mozvisibilitychange",
            webkitHidden: "webkitvisibilitychange",
            msHidden: "msvisibilitychange",
            oHidden: "ovisibilitychange" /* not currently supported */
        };
    for (hidden in vis) {
        if (vis.hasOwnProperty(hidden) && hidden in document) {
            change = vis[hidden];
            break;
        }
    }
    if (change)
        document.addEventListener(change, onchange);
    else if (/*@cc_on!@*/false) // IE 9 and lower
        document.onfocusin = document.onfocusout = onchange
    else
        window.onfocus = window.onblur = onchange;

    function onchange (evt) {
        var body = document.body;
        evt = evt || window.event;

        if (evt.type == "focus" || evt.type == "focusin")
        	GAME.Paused = false;
        else if (evt.type == "blur" || evt.type == "focusout")
            GAME.Paused = true;
        else
            if(this[hidden]){
        		GAME.Paused = true;
            }else{
        		GAME.Paused = false;
        	}
    }
})();