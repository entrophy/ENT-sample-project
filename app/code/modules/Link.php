<?php
class Link extends ENT_Module {
	public function getId() {
		return $this->valueObject->id;
	}
	public function getTitle() {
		return $this->valueObject->title;
	}
	public function getUrl() {
		return $this->valueObject->url;
	}

}
?>
