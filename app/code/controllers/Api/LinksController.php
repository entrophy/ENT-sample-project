<?php
class Api_LinksController extends ENT_Controller_REST {
	public function createAction() {
		$link = ENT::getModule('link');
		$link->save(json_decode($this->getRequest()->getPost('model'), true));
		
		echo $link->toJSON();
	}
	
	public function readAction() {
		$collection = ENT::getCollection('link');
		echo $collection->toJSON();
	}
	
	public function updateAction() {
		if ($id = $this->getRequest()->getParam('id')) {
			$link = Link::load($id);
			if ($link->exists) {
				$link->save(json_decode($this->getRequest()->getPost('model'), true));
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
