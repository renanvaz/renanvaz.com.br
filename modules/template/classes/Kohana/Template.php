<?php

abstract class Kohana_Template {
    protected static $params = array(
        'css'               => array(),
        'css_external'      => array(),
        'css_inline'        => array(),
        'js'                => array(),
        'js_external'       => array(),
        'js_inline'         => array(),
    );

    protected static $less = null;

    public static function add($type = '', $param = array()){
        if(is_array($type)){
            self::$params = Arr::merge(self::$params, $type);
        }else{
            !is_array($param) && $param = array($param);
            self::$params[$type] = Arr::merge(self::$params[$type], $param);
        }
    }

    public static function remove($type = '', $param = array()){
        foreach($param as $p){
            $i = array_search($p, self::$params[$type]);
            if($i !== false){
                unset(self::$params[$type][$i]);
            }
        }
    }

    public static function compile_js($print = true){
        $return = '';

        foreach (self::$params['js_external'] as $file){
            $return .= HTML::script($file) . "\n";
        }

        if(Kohana::$environment == Kohana::PRODUCTION){
            $buffer = self::get_buffer(self::$params['js'], Kohana::$config->load('template.js_path'));

            $compress_file = Kohana::$config->load('template.js_path_output') . $buffer['filename'] . '.js';
            file_put_contents($compress_file, $buffer['content']);

            $return .= HTML::script($compress_file) . "\n";
        }else{
            foreach (self::$params['js'] as $file){
                $file = Kohana::$config->load('template.js_path') . $file;
                $return .= HTML::script($file) . "\n";
            }
        }

        foreach (self::$params['js_inline'] as $content){
            $return .= '<script>' . preg_replace('/(<script([^>]*)>|<\/script>)/', '', $content) . '</script>' . "\n";
        }

        if($print) echo $return;
        else return $return;
    }

    public static function compile_css($print = true){
        $return = '';

        foreach (self::$params['css_external'] as $file){
            $return .= HTML::style($file, array('media' => 'screen')) . "\n";
        }

        if(Kohana::$environment == Kohana::PRODUCTION){
            $buffer = self::get_buffer(self::$params['css'], Kohana::$config->load('template.css_path'));

            $compress_file = Kohana::$config->load('template.css_path_output') . $buffer['filename'] . '.css';
            file_put_contents($compress_file, $buffer['content']);

            $return .= HTML::style($compress_file, array('media' => 'screen')) . "\n";
        }else{
            foreach (self::$params['css'] as $file){

                if(strpos($file, '.less') !== false){
                    $full_filename = Kohana::$config->load('template.css_path') . $file;
                    $content = file_get_contents($full_filename);
                    $file = Kohana::$config->load('template.css_path_output') . str_replace('.less', '.css', $file);
                    self::check_path($file);
                    file_put_contents($file, self::less_compiler($content, $full_filename));
                }else{
                    $file = Kohana::$config->load('template.css_path') . $file;
                }

                $return .= HTML::style($file, array('media' => 'screen')) . "\n";
            }
        }

        foreach (self::$params['css_inline'] as $content){
            $return .= '<style>' . preg_replace('/(<style([^>]*)>|<\/style>)/', '', $content) . '</style>' . "\n";
        }

        if($print) echo $return;
        else return $return;
    }

    //Simple Compression
    public static function compress($buffer){
        // Remove comments
        $buffer = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/|\/\/.*!', '', $buffer);
        // Remove spaces
        $buffer = preg_replace('!\r\n|\n|\t!', '', $buffer);
        $buffer = preg_replace('! ([{}:;])!', '$1', $buffer);
        $buffer = preg_replace('!([{}:;]) !', '$1', $buffer);
        $buffer = preg_replace('! +!', ' ', $buffer);

        return str_replace(';}','}', $buffer);
    }

    public static function get_buffer($files, $path = ''){
        $filename   = '';
        $buffer     = '';

        foreach ($files as $file) {
            $filename .= $file . filectime($path . $file);
            $buffer .= strpos($file, '.less') !== false ? self::less_compiler(file_get_contents($path . $file), $path . $file) : file_get_contents($path . $file);
        }

        $filename = md5($filename);
        $buffer = self::compress($buffer);

        return array('filename' => $filename, 'content' => $buffer);
    }

    //LESS Compiller String
    public static function less_compiler($content, $filename = ''){
        require_once Kohana::find_file('vendor', 'lessphp/lessc.inc', 'php');

        !self::$less && self::$less = new lessc;

        self::$less->importDir = preg_replace('/(.*)\/(.*)/', '$1/', $filename);

        return self::$less->compile($content);
    }

    public static function check_path($file){
        $path = explode('/', $file);
        array_pop($path);

        $_path = '';
        foreach($path as $folder){
            $_path .= '/'.$folder;
            $_path = trim($_path, '/');
            if(!file_exists($_path))
                mkdir($_path, 0777);
        }
    }
}