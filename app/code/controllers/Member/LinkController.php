<?php
class Member_LinkController extends ENT_Controller {
	public function viewAction() {
		$links = ENT::getCollection('link');
		$links->build();

		ENT::register('links', $links);
	}

	public function itemAction() {
		$this->renderLayout(false);
	}
}
?>
