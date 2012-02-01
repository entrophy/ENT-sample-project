Backbone.LayoutManager.configure({
	render: function(template, context) {
		return Mustache.render(template, context);
	}
});

Backbone.LayoutManager.View.prototype.serialize = function() {
	return this.model.toJSON();
};

var app = {};

jQuery(function($) {
	var Router = Backbone.Router.extend({
		routes: {
			"": "index",
			"show/:id": "show"
		},

		index: function() {
			alert("her");
			var main = new Backbone.LayoutManager({
				template: "#main"
			});

			links = new Link.Collection();
			links.add(new Link.Model({
				id: 1,
				url: 'http://www.google.com/',
				title: 'Google'
			}));
			links.add(new Link.Model({
				id: 2,
				url: 'http://www.reddit.com/',
				title: 'Reddit'
			}));
		
			
			var list = main.view('.list', new Link.Views.List({ collection: links }));
			var detail = main.view('.detail', new Link.Views.Detail({ model: links.at(0) }));

			list.bind('update', function(model) {
				detail.model = model;
				
				detail.render();
			});

			main.render(function(contents) {
				$('#page-wrapper').html(contents);
			});
		},
		
		show: function(id) {
			var detailed = new Backbone.LayoutManager({
				template: "#detailed"
			});

			links = new Link.Collection();
			links.add(new Link.Model({
				id: 1,
				url: 'http://www.google.com/',
				title: 'Google'
			}));
			links.add(new Link.Model({
				id: 2,
				url: 'http://www.reddit.com/',
				title: 'Reddit'
			}));
		
			var detail = detailed.view('.detailed', new Link.Views.Detail({ model: links.get(id) }));

			detailed.render(function(contents) {
				$('#page-wrapper').html(contents);
			});
		}
	});

	app.router = new Router();

	Backbone.history.start({ pushState: true, root: '/ENT-sample-project/member/link/view/' });
});

Link = {};

Link.Model = Backbone.Model.extend({

});

Link.Collection = Backbone.Collection.extend({
	model: Link.Model
});

Link.Views = {};

Link.Views.List = Backbone.LayoutManager.View.extend({
	template: '#list',

	events: {
		'click li a': 'update'
	},

	update: function(event) {
		var index = $(event.target).parent().index();
		var model = this.collection.at(index);
		
		this.trigger('update', model);

		return false;
	},

	serialize: function() {
		return { links: this.collection.toJSON() };
	}
});

Link.Views.Detail = Backbone.LayoutManager.View.extend({
	template: '#detail',

	events: {
		'click a': 'show'
	},

	show: function() {
		app.router.navigate('show/' + this.model.id, true);

		return false;
	}
});
