$(document).ready(function(){
	var colors =['#c165c1']; //['#990099', '#999999', '#0099FF', '#993333', '#009999', '#006600', '#66CC99', '#99CC66', '#FFCCFF'];
	for(var i = 0; i < 10; i++){
		colors.push('#' + (Math.round(Math.random() * (255 * 255 * 255))).toString(16));
	}

	EteImageGenerator.bind('cached', function(){
		createGame();
	});

	EteImageGenerator.cache(colors);
    Clouds.start();
});

var Clouds = {
    create: function(){
        var rand1 = Math.random()
            , rand2 = Math.random()
            , rand3 = Math.random()
            , top = rand1 * ($(window).height() / 2)
            , left = -140
            , fontSize = (rand2 * 70) + 70
            , time = (rand3 * 15000) + 10000;

        $('<i class="icon-cloud"></i>').appendTo('body').css({top: top, left: left, fontSize: fontSize, opacity: Math.random() * .3 + .2}).animate({left: $(window).width()}, time, 'linear', function(){
            $(this).remove();
        });

        //$('#montain2').css($.fx.cssPrefix + 'filter', 'hue-rotate('+Math.round((Math.random() * 360))+'deg)');
    },

    start: function(){
        Clouds.create();

        setInterval(function(){ Clouds.create(); }, (Math.random() * 5000) + 1000);
    }
}

// Background
var canvas;
var stage;
var shape;
var circleRadius = 30;

function initBG() {
    // create a new stage and point it at our canvas:
    canvas = document.getElementById("canvas");
    stage = new createjs.Stage(canvas);
    stage.snapToPixelEnabled = true;

    for(var i = 0; i < 35; i++) {
        shape = new createjs.Shape();
        shape.graphics.beginFill('#FFFFFF').drawCircle(0, 0, circleRadius);

		var z = Math.random() * .3 + .1;
		shape.alpha = z;

        shape.x = Math.random() * canvas.width;
        shape.y = Math.random() * canvas.height;
        shape.velX = Math.random() * 5 - 2;
        shape.velY = Math.random() * 5 - 2;

        shape.snapToPixel = true;
        shape.cache(-circleRadius, -circleRadius, circleRadius * 2, circleRadius * 2);

        stage.addChild(shape);
    }

    RequestAnimFrame.add(tick);
}

function tick() {
    var w = canvas.width;
    var h = canvas.height;
    var l = stage.getNumChildren() - 1;

    // iterate through all the children and move them according to their velocity:
    for(var i = 1; i < l; i++) {
        var shape = stage.getChildAt(i);
        shape.x = (shape.x + shape.velX + w) % w;
        shape.y = (shape.y + shape.velY + h) % h;
    }

    // draw the updates to stage:
    stage.update();
}

function createGame(){
	GAME.Stage.setSize(800, 1500);
	GAME.Camera.setSize(0, 0);
    GAME.Stage.addParallax('clouds', ({dom: $('.container'), parallaxX: 0, parallaxY: 0}));
    GAME.Create();


    $(window).bind('resize', function(){
        var w = $(window).width();
        var h = $(window).height();
        var y = 1500 - h;

        //$('#canvas').attr({width: w, height: h});
        $('#ground-right').css('left', w);

        GAME.Camera.position.y = y;
        GAME.Stage.setSize(w, 1500);
        GAME.Camera.setSize(w, h);

        $('#ground-right').css('left', w);
        $('.container').css('margin-top', y + 60);
    }).trigger('resize');

    $(Player.el).bind('hittest.in', function(e, collision){
        if(collision.self.hit.bottom)
        jump = false;
    });

    $(document).bind('keydown', function(e){
        if(e.which == 13){
            Player.weapon.attack();
        }
    });

    //initBG();

    setTimeout(function(){
        randomEnemy();
    }, 6000);
}

function randomEnemy(){
	$(GAME.Stage.el).append('<div data-sprite="dynamic" data-entity="EteEnemy" style="left: '+(Math.random() * GAME.Stage.size.width)+'px; top: 0px; width: 90px; height: 128px;"></div>');
    GAME._SearchSprites();
}

var fbOpened = false;
var friendsData = null;
var friendsIndex = 0;
function loginFB(){
	if(!fbOpened){
		fbOpened = true;
		FB.login(function(response) {
			if (response.authResponse) {
				FB.api('/me/friends?fields=id,name,gender', function(response) {
					$('.btFaceConnect').fadeOut(function(){ $(this).remove(); });
					friendsData = response.data;
					randomEnemy();
				});
			} else {
				fbOpened = false;
				console.log('User cancelled login or did not fully authorize.');
			}
		});
	}
}