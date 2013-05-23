<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Mgen extends Kohana_Controller {
    public $_tables = array();
    public function action_index(){
		echo '<pre>';

        $_tables =& $this->_tables;
        $tables = Database::instance()->list_tables();

		foreach($tables as $table){
			$this->set($table);
		}

        foreach($tables as $table){
            $foreing = Database::instance()->list_columns($table, '%_id%');

            $many_to_many = array();
			$foreings = array();
            foreach($foreing as $f => $p){
				$foreings[] = $f;
                $t = str_replace('_id', '', $f);
                $many_to_many[] = Inflector::plural($t);
            }

            $_table = array();
			sort($many_to_many);
			$_table[] = join('_', $many_to_many);
			$many_to_many = array_reverse($many_to_many);
			$_table[] = join('_', $many_to_many);

			$_table = $_table[0] == $table ? $_table[0] : $_table[1] == $table ? $_table[1] : false;

            if($_table){
                $table1 = Inflector::plural(str_replace('_id', '', $foreings[0]));
                $table2 = Inflector::plural(str_replace('_id', '', $foreings[1]));
                $_tables[$table1]['_has_many'][$table2] = array('through' => strtolower($_table));
                $_tables[$table2]['_has_many'][$table1] = array('through' => strtolower($_table));
            }else{
                foreach($foreing as $f => $p){
                    $t = str_replace('_id', '', $f);
                    $plural = Inflector::plural($t);
					//echo $plural.' - '.$table.'</br/>';
                    if(in_array($plural, $tables)){
                       $_tables[$table]['_belongs_to'][strtolower($t)] = array('model' => strtolower($t));
                       $_tables[$plural]['_has_many'][strtolower($table)] = array('model' => strtolower($table));
                    }
                }
            }
        }

        foreach($_tables as $table => $vars){
            $_belongs_to = $this->to_string($vars['_belongs_to']);
            $_has_many = $this->to_string($vars['_has_many']);

			$class_name = Inflector::singular($table);
			$class_name = explode('_', $class_name);
			foreach($class_name as $k => $n){
				$class_name[$k] = ucfirst($n);
			}
			$class_name = join('_', $class_name);

            $str = "<?php defined('SYSPATH') or die('No direct script access.');"."\n".
            "class Model_".$class_name." extends ORM {"."\n".
            '    protected $_has_one = array();'."\n".
            '    protected $_belongs_to = '.$_belongs_to.';'."\n".
            '    protected $_has_many = '.$_has_many.';'."\n".
            '}';

			$_file = explode('_', Inflector::singular(strtolower($table)));
			$_file_name = array_pop($_file).".php";
			$_file[] = '';
			$_path = APPPATH.'classes/model/'.join('/', $_file);

            $file = $_path.$_file_name;
			echo Inflector::singular(strtolower($table)). ' - ' . $file."<br/>";
			if(!file_exists($_path)){
				mkdir($_path, 0777);
			}
            $fh = fopen($file, 'w+') or die("can't open file");
            fwrite($fh, $str);
            fclose($fh);/**/
        }

		die(Debug::dump($_tables));
    }


    public function to_string($param){
        $return = '';
        foreach($param as  $k => $v){
            $return .= strlen($return) > 0 ? ', ' : '';
            if(is_array($v)){
                $return .= "\"$k\" => ".$this->to_string($v);
            }else{
                $return .= "\"$k\" => \"$v\"";
            }
         }
        return 'array('.$return.')';
    }

    public function set($indice){
        if(!isset($this->_tables[$indice]))
        $this->_tables[$indice] = array(
                '_has_one' => array(),
                '_belongs_to' => array(),
                '_has_many' => array());
    }
}