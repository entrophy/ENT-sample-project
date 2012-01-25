<?php
class Member_Link_View_View extends ENT_View {
	public function getLinks() {
		return ENT::registry('links');
	}
}
?>
