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

		this.collection.on('reset', this.render, this);
		this.collection.on('add', this.render, this);
		this.collection.on('remove', this.remove, this);
	},
	remove: function(link) {
		this.el.find('#link-'+link.id).remove();
	},
	render: function() {
		var self = this;
		_.forEach(this.collection.models, function(link) {
			if (!_.include(this.ids, link.id)) {
				this.el.append(new window.LinkItemView({ 
					model: link,
					collection: self.collection,
					id: 'link-'+link.id		
				}).render().el);
				this.ids.push(link.id);
			}
		}, this);

		return this;
	}
});

LinkItemView = Backbone.View.extend({
	tagName: 'li',
	className: 'link',
	events: {
		"click .delete": "remove"
	},
	remove: function() {
		this.model.destroy();
		this.collection.remove(this.model);
		return false;
	},
	initialize: function() {
		this.id = 'link-'+this.model.id;
		this.template = TemplateManager.get('member/link/item');
	},
	render: function() {
		$(this.el).html(Mustache.render(this.template, this.model.toJSON()));
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
