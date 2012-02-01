<?php
class Api_LinksController extends Api_AbstractController {
	public function createAction() {
		$link = ENT::getModule('link');
		$link->save(json_decode($this->getRequest()->getPost('model'), true));
		
		$this->sendModule($link);
	}
	
	public function readAction() {
		$collection = ENT::getCollection('link');
		$this->sendCollection($collection);
	}
	
	public function updateAction() {
		if ($id = $this->getRequest()->getParam('id')) {
			$link = Link::load($id);
			if ($link->exists) {
				$link->save(json_decode($this->getRequest()->getPost('model'), true));
				$this->sendModule($link);
			}
		}
	}
	
	public function deleteAction() {
		if ($id = $this->getRequest()->getParam('id')) {
			$link = Link::load($id);
			if ($link->exists) {
				$link->delete();
			}
		}
	}
}
?>
