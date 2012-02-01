<?php
date_default_timezone_set('Europe/Copenhagen');
ini_set('upload_tmp_dir','var/tmp'); 

$root_path = '/users/hhau/work/source/';
$ent_path = $root_path.'ENT/';
require_once $ent_path.'ENT.php';

ENT::register('ent_path', $ent_path);
ENT::register('project_path', str_replace('index.php', '', $_SERVER['SCRIPT_FILENAME']));


#Entrophy_Profiler::$render = true;
#Entrophy_Profiler::start();
ENT::run();
#Entrophy_Profiler::stop();
?>
