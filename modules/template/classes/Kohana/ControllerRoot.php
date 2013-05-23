<?php defined('SYSPATH') or die('No direct script access.');

abstract class Kohana_ControllerRoot extends Controller_Template {
    public $params = array(
		'css_external' 	=> array(),
		'css' 			=> array(),
		'js_external' 	=> array(),
		'js' 			=> array(),
	);

    public $template 			= 'shared/template/base';
	public $restrict_actions 	= array();
	public $restrict_redirect 	= 'default/index';

    public function before(){
		if(!Auth::instance()->logged_in() && in_array($this->request->action(), $this->restrict_actions)){
			Controller::redirect($this->restrict_redirect . '?redirect_uri=' . Request::current()->uri());
		}

		if ($this->auto_render === TRUE){
            Template::add($this->params);

            $this->template 			= View::factory($this->template);

            $this->template->header 	= View::factory('shared/template/header');
            $this->template->footer 	= View::factory('shared/template/footer');

			if(Kohana::find_file('views','pages/'.UTF8::ucfirst($this->request->controller()).'/'.$this->request->action()))
            $this->template->content 	= View::factory('pages/'.UTF8::ucfirst($this->request->controller()).'/'.$this->request->action());
		}
	}

    public function after(){
		if ($this->auto_render === TRUE){
            $this->template->header 	= $this->template->header->render();
            $this->template->content 	= $this->template->content->render();
            $this->template->footer 	= $this->template->footer->render();

			$this->response->body($this->template);
		}
	}
}