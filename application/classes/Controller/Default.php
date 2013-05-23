<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Default extends Controller_Root {
	public $auto_render = false;
	public $params = array(
		'css_external' 	=> array(),
		'css' 			=> array(),
		'js_external' 	=> array(),
		'js' 			=> array(),
	);

	public function action_index(){
		Template::add($this->params);
		die('Default -> Index');
	}

}