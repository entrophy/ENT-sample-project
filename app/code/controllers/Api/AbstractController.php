<?php
class Api_AbstractController extends ENT_Controller_REST {
	public function _beforeAction() {
		$this->getResponse()->setType('json');
	}
	
	protected function sendModel($module) {
		$this->sendModule($module);
	}
	protected function sendModule($module) {
		$this->getResponse()->setContent($module->toJSON());
	}
	protected function sendCollection($collection) {
		$this->getResponse()->setContent($collection->toJSON());
	}
}
?>
