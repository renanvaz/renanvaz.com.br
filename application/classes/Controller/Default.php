<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Default extends Controller_Root {
	public $auto_render = true;
	public $params = array(
		'css_external' 	=> array('http://netdna.bootstrapcdn.com/font-awesome/3.1.1/css/font-awesome.css'),
		'css' 			=> array('style.less'),
		'js_external' 	=> array('http://code.jquery.com/jquery-1.9.1.min.js'),
		'js' 			=> array(
			'game-engine/Stats.js',
			'game-engine/Utils.js',
			'game-engine/Vector2.js',
			'game-engine/Preloader.js',
			'game-engine/TiledIndex.js',
			'game-engine/EventHandler.js',
			'game-engine/CollissionObjects.js',
			'game-engine/DisplayObjects.js',
			'game-engine/Engine.js',
			'entities.js',
			'main.js',
		),
	);

	public function action_index(){

	}

}