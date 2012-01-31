App = {
	url: function(url) {
		return 'http://localhost/ENT-sample-project/'+url;
	}
}

Backbone.emulateJSON = true;
TemplateManager = {
	init: function(key, callback) {
		var self = this;
		
		this.cache = (this.cache || {});

		if (!this.cache[key]) {
			$.get(App.url(key), function(template) {
				self.cache[key] = template;

				callback.call(this, template);
			});
		}
	},
	get: function(key) {
		return this.cache[key];
	}
}

// models

Link = Backbone.Model.extend({
	defaults: {
		title: '',
		url: ''
	}
});

// collections

LinkCollection = Backbone.Collection.extend({
	url: App.url('api/links'),
	model: Link
});

// views

LinkListView = Backbone.View.extend({
	initialize: function() {
		var self = this;
		
		this.el = $('#links');
		this.ids = [];

		this.collection.bind('reset', this.render, this);
		this.collection.bind('add', this.render, this);
	},
	render: function() {
		_.forEach(this.collection.models, function(link) {
			if (!_.include(this.ids, link.id)) {
				this.el.append(new window.LinkItemView({ model: link }).render().el);
				this.ids.push(link.id);
			}
		}, this);

		return this;
	}
});

LinkItemView = Backbone.View.extend({
	initialize: function() {
		this.template = TemplateManager.get('member/link/item');
	},
	render: function() {
		this.el = Mustache.render(this.template, this.model.toJSON());

		return this;
	}
});


TemplateManager.init('member/link/item', function(templates) {
	links = new LinkCollection();

	linkListView = new window.LinkListView({
		collection: links
	});

	links.fetch();
});
