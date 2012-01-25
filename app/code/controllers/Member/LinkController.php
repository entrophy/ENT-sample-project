<?php

include 'app/code/modules/Link.php';
include 'app/code/modules/Link/Load.php';
include 'app/code/modules/Link/DAO.php';
include 'app/code/modules/Link/ValueObject.php';

class Member_LinkController extends ENT_Controller {
	public function viewAction() {
		$links = ENT::getCollection('link');
		$links->build();

		ENT::register('links', $links);
	}
}
?>
