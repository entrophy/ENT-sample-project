App = {
	url: function(url) {
		return 'http://localhost/ENT-sample-project/'+url;
	}
}

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
		id: 0,
		title: '',
		url: ''
	}
});

// collections

LinkCollection = Backbone.Collection.extend({
	model: Link
});

// views

LinkListView = Backbone.View.extend({
	initialize: function() {
		var self = this;
		
		this.el = $('#links');
		this.ids = [];

		this.collection.bind('add', this.render, this)
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

// dispatch

TemplateManager.init('member/link/item', function(templates) {
	links = new LinkCollection();

	linkListView = new window.LinkListView({
		collection: links
	});

	links.add([
		new Link({
			id: 8,
			title: 'Google',
			url: 'http://www.google.dk/'
		}),
		new Link({
			id: 7,
			title: 'Reddit',
			url: 'http://www.reddit.com/'
		}),
		new Link({
			id: 9,
			title: 'Anti Sleep Pilot',
			url: 'http://www.antisleeppilot.com/'
		}),
		new Link({
			id: 10,
			title: 'Imgur',
			url: 'http://www.imgur.com/'
		}),
		new Link({
			id: 11,
			title: 'Politiken',
			url: 'http://www.politiken.dk/'
		})
	]);
});
