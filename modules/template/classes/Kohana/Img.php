<?php

abstract class Kohana_Img {

	public static function get($src = '', $params = array('w' => 0, 'h' => 0, 'crop' => false, 'resize' => false), $keep = ''){
	    $storage = kohana::$config->load('img.storage');

	    if(!is_array($params)) parse_str($params, $params);

	    if(!file_exists($storage.$src) || $src == '' || filesize($storage.$src) == 0)
        $src = 'empty.gif';

		$image = Image::factory($storage.$src);

        $params = $params + array('w' => 500, 'h' => 500, 'crop' => false, 'resize' => false);
        $output = kohana::$config->load('img.output').base64_encode($src.json_encode($params)).substr($src, strrpos($src, '.'));
        if(file_exists($output))
        return $output;

        if($src == 'empty.gif'){
            $image->resize($params['w'], $params['h'], Image::NONE);
        }else{
			$isize = getimagesize($storage.$src);
			if($isize[0] > $params['w'] || $isize[1] > $params['h']){
				if($params['resize'] == 'true' and $params['crop'] == 'true'){
					$image->resize($params['w'], $params['h'], $keep ? $keep : $image->width / $params['w'] > $image->height / $params['h'] ? Image::HEIGHT : Image::WIDTH );
				}else if($params['resize'] == 'true'){
					$image->resize($params['w'], $params['h'], Image::AUTO);
				}

				if($params['crop'] == 'true')
				$image->crop($params['w'], $params['h']);
			}
        }

        $image->save($output, 80);

		return $output;
	}

    public static function remove($src = '', $params = array('w' => 0, 'h' => 0, 'crop' => false, 'resize' => false)){
        if(!is_array($params)) parse_str($params, $params);

        $params = $params + array('w' => 500, 'h' => 500, 'crop' => false, 'resize' => false);

        $output = kohana::$config->load('img.output').base64_encode($src.json_encode($params)).$image->type;
        if(file_exists($output)){
            @unlink($output); //ver se precisa do app path
        }
        return $this;
    }
 }