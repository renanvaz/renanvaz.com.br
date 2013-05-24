$(document).ready(function(){
    if($(window).width() >= 768){
    	var colors =['#c165c1']; //['#990099', '#999999', '#0099FF', '#993333', '#009999', '#006600', '#66CC99', '#99CC66', '#FFCCFF'];
    	for(var i = 0; i < 10; i++){
    		colors.push('#' + (Math.round(Math.random() * (255 * 255 * 255))).toString(16));
    	}

    	EteImageGenerator.bind('cached', function(){
    		createGame();
    	});

    	EteImageGenerator.cache(colors);
        Clouds.start();
    }
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
    },

    start: function(){
        Clouds.create();

        setInterval(function(){ Clouds.create(); }, (Math.random() * 5000) + 1000);
    }
};

function createGame(){
	GAME.Stage.setSize(800, 1500);
	GAME.Camera.setSize(0, 0);
    GAME.Stage.addParallax('clouds', ({dom: $('main'), parallaxX: 0, parallaxY: 0}));
    GAME.Create();


    $(window).bind('resize', function(){
        var w = $(window).width();
        var h = $(window).height();
        var y = 1500 - h;

        GAME.Camera.position.y = y;
        GAME.Stage.setSize(w, 1500);
        GAME.Camera.setSize(w, h);

        $('#ground-right').css('left', w);
        $('main').css('margin-top', y + 60);
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

    setTimeout(function(){
        randomEnemy();
    }, 6000);
};

function randomEnemy(){
	$(GAME.Stage.el).append('<div data-sprite="dynamic" data-entity="EteEnemy" style="left: '+(Math.random() * GAME.Stage.size.width)+'px; top: 0px; width: 90px; height: 128px;"></div>');
    GAME._SearchSprites();
};