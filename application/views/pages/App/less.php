

/* VARIABLES */
@backgroundColorBase: <?php echo $app->theme_color ?>;
@fontColorBase: <?php echo $app->is_a_dark_theme() ? 'fade(#FFFFFF, 80%)' : 'fade(#000000, 80%)' ?>;
@textShadowBase: <?php echo $app->is_a_dark_theme() ? '0 1px 0 fade(#000000, 60%)' : '0 1px 0 fade(#FFFFFF, 60%)' ?>;
@iconPath: '<?php echo $app->is_a_dark_theme() ? '../../media/img/APP/icons/white' : '../../media/img/APP/icons/black' ?>';
@borderColor: <?php echo $app->is_a_dark_theme() ? 'rgba(0, 0, 0, 0.55)' : 'rgba(0, 0, 0, 0.2)' ?>;
@borderColorLight: <?php echo $app->is_a_dark_theme() ? 'rgba(255, 255, 255, .3)' : 'rgba(255, 255, 255, .5)' ?>;
@activeButtonBg: <?php echo $app->is_a_dark_theme() ? 'rgba(0, 0, 0, .4)' : 'rgba(0, 0, 0, .15)' ?>;
@hoverButtonBg: <?php echo $app->is_a_dark_theme() ? 'rgba(0,0,0, .2)' : 'rgba(0,0,0, .05)' ?>;
@clickButtonBg: <?php echo $app->is_a_dark_theme() ? 'rgba(0,0,0, .2)' : 'rgba(0,0,0, .15)' ?>;

@paddingHeader: 10px;
@asideWidth: 230px + (@paddingHeader * 2);
@buttonToggleWidth: 50px;

/* END VARIABLES */


/* FUNCTIONS */
.boxShadow(@style, @c) when (iscolor(@c)) {
	box-shadow:         @style @c;
	-webkit-box-shadow: @style @c;
	-moz-box-shadow:    @style @c;
}

.boxShadow(@style, @alpha: 50%) when (isnumber(@alpha)) {
	.boxShadow(@style, rgba(0, 0, 0, @alpha));
}

.linearGradient(@stop1:0, @color1:#ccc, @stop2:50%, @color2:#ddd, @stop3:100%, @color3:#ccc){
	background-color:@color2;
	background:-webkit-gradient(linear, left bottom, left top, color-stop(@stop1, @color1), color-stop(@stop2, @color2), color-stop(@stop3, @color3));
	background:-moz-linear-gradient(center bottom, @color1 @stop1, @color2 @stop2, @color3 @stop3);
	background:-ms-linear-gradient(center bottom, @color1 @stop1, @color2 @stop2, @color3 @stop3);
	background:-o-linear-gradient(center bottom, @color1 @stop1, @color2 @stop2, @color3 @stop3);
	background:linear-gradient(center bottom, @color1 @stop1, @color2 @stop2, @color3 @stop3);
	-pie-background: linear-gradient(@color1, @color2, @color3);
	filter: e(%("progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=%d,endColorstr=%d)", @color1, @color3));
}

.roundedCorners (@radius: 5px) {
	border-radius: @radius;
	-webkit-border-radius: @radius;
	-moz-border-radius: @radius;
}

.transition (@transition) {
	transition: @transition;
	-moz-transition: @transition; /* Firefox 4 */
	-webkit-transition: @transition; /* Safari and Chrome */
	-o-transition: @transition; /* Opera */
}

/* END FUNCTIONS */


/* ERROR MESSAGES */
.floaterMiddle {
	position: absolute;
	top: 50%;
	left: 50%;
}

#messages{
	background: #161616 url(../../media/img/APP/pattern.png);
	height: 100%;
	color: #FFF;

	> #offlineError{
		height: 100%;

		> img {
			.floaterMiddle;
			margin-top: -254px;
			margin-left: -155px;
		}

		> h1 {
			.floaterMiddle;
			margin-top: 0;
			margin-left: -462px;
		}
	}

	> #appIsDownError{
		height: 100%;

		> img {
			.floaterMiddle;
			margin-top: -230px;
			margin-left: -124px;
		}

		> h1 {
			.floaterMiddle;
			margin-top: 0px;
			margin-left: -334px;
		}
	}
}

/* STYLES */
#app > aside, #app > section {
	-webkit-touch-callout: none;
	-webkit-tap-highlight-color: rgba(0,0,0,0);
	-webkit-text-size-adjust: none;
	-webkit-user-select: none;
}

body #loading{
	display: block;
}

#web, #mobile, #app, #loading, #messages{
	display: none;
	width: 100%; height: 100%;
}

#installWeb #web{
	display: block;
}

#installMobile #mobile{
	display: block;
}

#standalone #app{
	display: block;
	z-index: 1;
}

#standalone #messages{
  display: block;
}

.progressbar{
	background: #222;
	position: absolute;
	bottom: 0;
	left: 0;
	height: 20%;

	width: 0;

	transition: width .4s;
	-moz-transition: width .4s;
	-webkit-transition: width .4s;
	-o-transition: width .4s;
}

#loading #loader, #standalone #loader{
	display:block;
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	top: 0;
	background: #FFF;
	z-index: 2;

	-webkit-transition-delay: .4s;
}

aside nav a, .button{
	transition: background-color .3s linear;
	-webkit-transition: background-color .3s linear;
	-moz-transition: background-color .3s linear;
	-o-transition: background-color .3s linear;
}

#standalone #app{
	display: block;
	z-index: 1;
}

<?php echo str_replace('../', '../../media/', file_get_contents('media/css/style.css')) ?>
#app{
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	overflow: hidden;
	background-color: #FFF;
	text-shadow: @textShadowBase;
	color: @fontColorBase;

	#formLogin {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background-color: @backgroundColorBase;
		z-index: 10;

		form{
			position: absolute;
			top: 50px;
			left: 50%;
			margin-left: -115px;

			img{
				margin: 0 auto 10px;
				display: block;
			}

			.button{
				display: block;
				width: 100%;
				margin-top: 10px;
				font-size: 16px;
				height: 35px;
			}

			textarea, input[type="text"], input[type="password"], input[type="datetime"], input[type="datetime-local"], input[type="date"], input[type="month"], input[type="time"], input[type="week"], input[type="number"], input[type="email"], input[type="url"], input[type="search"], input[type="tel"], input[type="color"], .uneditable-input{
				width: 216px;
			}
		}
	}

	> aside{
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: @asideWidth;
		z-index: 1;

		.masker {
			-webkit-mask: url(../../media/img/APP/asideMask.png) no-repeat bottom left;
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
		}

		header{
			padding: @paddingHeader;
		}

		header img{
			width: 100%;
		}

		nav .active a{
			background: @activeButtonBg !important;
		}

		nav a{
			.transition(background .7s);

			display: block;
			font-weight: bold;
			padding: 15px;
			text-decoration: none;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			height: 15px;
			position: relative;

			&.hasCounter{
				padding: 15px 36px 15px 15px;
			}

			&:hover{
				background: @hoverButtonBg;
			}

			span{
				padding: 1px 3px 3px 4px;
				position: absolute;
				right: 15px;
				top: 13px;
			}

			i {
				background-repeat: no-repeat;
				background-position: center center;
				position: relative;
				display: block;
				width: 47px;
				margin-right: 0;
				top: -15px;
				float: left;
				height: 47px;
				left: -15px;

			}
		}

	}

	> section{
		min-width: 320px;
		position: absolute;
		right: 0;
		top: 0;
		z-index: 2;
		background: #161616 url(../../media/img/APP/pattern.png);
		left: @asideWidth;
		bottom: 0;
		.boxShadow(-1px -1px 3px, 50%);

		#hitClickExpand{
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			display: none;
			z-index: 2;
		}

		> header {
			z-index: 3;

			padding: @paddingHeader;
			position: relative;

			#btToggle{
				background-image: url(@{iconPath}/btToggle.png);
				background-position: center center;
				background-repeat: no-repeat;
				width: @buttonToggleWidth;
				text-indent: -9999px;
			}

			> nav{
				position: absolute;
				right: @paddingHeader;
				top: 10px;

				#btRight{
					background-image: url(@{iconPath}/rightArrow.png);
					background-position: center center;
					background-repeat: no-repeat;
					width: 35px;
					text-indent: -9999px;
					border-radius: 0 4px 4px 0;
					position: relative;
					left: -4px;
				}

				#btLeft{
					background-image: url(@{iconPath}/leftArrow.png);
					background-position: center center;
					background-repeat: no-repeat;
					width: 35px;
					text-indent: -9999px;
					border-radius: 4px 0 0 4px;
				}

				#btToggleThumbnail{
					background-image: url(@{iconPath}/thumbnails.png);
					background-position: center center;
					background-repeat: no-repeat;
					width: @buttonToggleWidth;
					text-indent: -9999px;
					margin-right: 6px;
				}

				#btToogleThumbnail.thumbMode{
					background-image: url(@{iconPath}/bigImages.png);
				}
			}

			> h1{
				margin: 0;
				padding: 0;
				position: absolute;
				top: @paddingHeader + 2px;
				left:  @paddingHeader * 2 + @buttonToggleWidth;
				text-overflow: ellipsis;
				text-align: center;
				white-space: nowrap;
				overflow: hidden;
			}
		}
	}

	.button{
		border: solid 1px;
		-webkit-box-shadow: inset 0 1px 0 rgba(0, 0, 0, .1), 0 1px 1px rgba(255, 255, 255, .17);
		text-shadow: @textShadowBase;
		-webkit-border-radius: 4px;
		-webkit-box-sizing: border-box;
		display: inline-block;
		font-weight: bold;
		line-height: 27px;
		width: 50px;
		overflow: hidden;
		padding: 0 8px;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 12px;
	}

	.button:hover{
		background: @clickButtonBg;
	}

	/* Components */
	.hbar{
		background-color: @backgroundColorBase;
		border-top: 1px solid desaturate(lighten(@backgroundColorBase, 28%), 20%);
		border-bottom: 1px solid darken(@backgroundColorBase, 20%);
		color: @fontColorBase;
		.boxShadow(1px 1px 3px, 30%);
	}

	.button {
		background: rgba(0, 0, 0, 0.1);
		border-color: @borderColor;
		color: @fontColorBase;
	}

	> aside{
		background: @backgroundColorBase;
		nav a{
			/*
			border-top: 1px solid desaturate(lighten(@backgroundColorBase, 20%), 20%);
			border-bottom: 1px solid darken(@backgroundColorBase, 20%);
			*/
			border-top: 1px solid @borderColorLight;
			border-bottom: 1px solid @borderColor;
			color: @fontColorBase;

			span{
				/*
				background: -webkit-gradient( linear, left top, left bottom, color-stop(0, lighten(@backgroundColorBase, 10%)), color-stop(1, lighten(@backgroundColorBase, 5%)) );
				border-top: 1px solid desaturate(lighten(@backgroundColorBase, 28%), 20%);
				*/
				background: -webkit-gradient( linear, left top, left bottom, color-stop(0, lighten(@backgroundColorBase, 10%)), color-stop(1, lighten(@backgroundColorBase, 5%)) );
				border-top: 1px solid rgba(255, 255, 255, .4);
				-webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, .4);
				color: @fontColorBase;
			}
		}
	}

	> section {
		> header{
			.hbar
		}
	}

	.module{
		margin: 0;
		padding: 0;

		position: absolute;
		top: 51px;
		right: 0;
		bottom:0;
		left: 0;
	}

	.gallery ul{
		margin: 0;
		padding: 0;
	}
	.gallery img { width: 100%; }
	.gallery li{ float:left; list-style: none; }

	.gallery .thumbs{
		position: absolute;
		top: 0;
		right: 0;
		bottom:0;
		left: 0;

		display: none;

		overflow: hidden;

		width: auto !important;
		height: auto !important;
	}

	.gallery .thumbs li{
		width: auto !important;
		height: auto !important;
		overflow: visible !important;
		margin: 15px;
		cursor: pointer;
	}
	.gallery .thumbs img {
		width: 216px;
		height: auto;
		padding: 5px;
		background: #efefef;
		.boxShadow(0px 1px 3px, 90%);
		.roundedCorners(3px);
	}
	.gallery .thumbs .active img {
		background: rgb(182, 218, 224);
		box-shadow: 0 0 10px rgb(0, 133, 255);
	}
}

@media only screen
and (min-width: 320px) and (max-width: 480px) {
	#app .gallery .thumbs img {
		width: 200px;
	}
}

@media only screen
and (max-width: 320px) {
	[sidebarstate="EXPANDED"] #hitClickExpand{
		display: block !important;
	}

	#app .gallery .thumbs img {
		width: 120px;
	}
	#app > section > header > h1 {
		top: 17px;
		font-size: 12px;
		line-height: 16px;
	}

	#messages > #appIsDownError > img {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -170px;
		margin-left: -124px;
	}

	#messages > #appIsDownError > h1 {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: 80px;
		margin-left: -160px;
		width: 320px;
		text-align: center;
	}

	#messages > #offlineError > img {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -150px;
		margin-left: -125px;
		width: 250px;
	}

	#messages > #offlineError > h1 {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: 83px;
		margin-left: -150px;
		width: 300px;
		font-size: 20px;
		text-align: center;
	}
}

#web, #mobile{
	<?php echo str_replace('../', '../../media/', file_get_contents('media/css/normalize.css')) ?>
	<?php echo str_replace('../', '../../media/', file_get_contents('media/css/main.css')) ?>
	<?php echo str_replace('../', '../../media/', file_get_contents('media/css/estilos.css')) ?>
}