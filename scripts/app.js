App = {
	url: function(url) {
		return 'http://localhost/ENT-sample-project/'+url;
	}
}

TemplateManager = {
	get: function(key, callback) {
		var self = this;
		
		this.cache = (this.cache || {});

		if (!this.cache[key]) {
			$.get(key, function(template) {
				self.cache[key] = template;

				callback.call(this, template);
			});
		}
	}
}

/// models and collections

Link = Backbone.Model.extend({
	defaults: {
		id: 0,
		title: '',
		url: ''
	}
});

LinkCollection = Backbone.Collection.extend({
	model: Link
});


/// views

window.LinkListView = Backbone.View.extend({
	el: '#links',
	render: function() {
		_.forEach(this.links, function(link) {
			//$(this.el).append(new window.LinkItemView(link).render().el);
		}, this);

		return this;
	}
});
/*
TemplateManager.get(App.url('member/link/item'), function(template) {
	window.LinkItemView = Backbone.View.extend({
		tagName: 'li',
		render: function() {
			//this.el = Mustache.render(template, this.link.toJSON());

			return this;
		}
	});
});
*/
$(document).ready(function() {
	links = new LinkCollection();

	linkListView = new LinkListView(links);
	
	links.add(new Link({
		id: 8,
		title: 'Google',
		url: 'http://www.google.dk'
	}));
	
});
