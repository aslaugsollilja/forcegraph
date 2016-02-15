
	// Define the dimensions of the Force graph
	var width = 1500,
		height = 800;

	// Background color for the nodes
	var nodeColor = "white";

	// Create a SVG container to hold the vizualization
	// Specify the dimensions for this container
	var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height);

	// Create a force layout object and define its properties.
	// 'charge' is how much the nodes push each other off.
	// 'linkDistance' is the length on the nodes to the center node
	var force = d3.layout.force()
		.charge(-1500)
		.linkDistance(180)
		.size([width, height]);

	// The static data comes from a json file
	d3.json("links.json", function(error, graph) {

		if (error) throw error;
		// Turn on the force layout
		force
			.nodes(graph.nodes)
			.links(graph.links)
			.start();

	// Draw the SVG lines between the nodes
	var link = svg.selectAll(".link")
		.data(graph.links).enter().append("line")
		.attr("class", "link")
		.style("stroke-width", function(d) { return Math.sqrt(d.value); });

	// Draw the SVG circles
	var node = svg.selectAll(".node")
		.data(graph.nodes)
		.enter()
		.append("g").attr("class", "node")
		.call(force.drag);

	var circle = node
		.append("circle")
		.attr("r", function(d) { return (d.value/2) })
		.style("fill", function(d) { return nodeColor; });

	// Append title to the nodes
	node.append("title")
		.text(function(d) { return d.name; });

	// Append anchor to the nodes so user can click on hyperlink
	var anchor = node.append("svg:a")
			.attr("xlink:href", function(d) { return d.url; })
			.attr("target", "_blank");

	// Append image anchor on the nodes
	var image = anchor.append("svg:image")
			.attr("xlink:href", function(d) { return d.photo; })
			.attr("x", function(d) { return -(d.value/2); })
			.attr("y", function(d) { return -(d.value/2); })
			.attr("height", function(d) { return d.value })
			.attr("width", function(d) { return d.value });


	force.on("tick", function() {
		// Update position of the nodes. 
		// Nodes can't go out of the box
		node.attr("transform", function(d) {
			var radius = d.value/2;
			return "translate(" + [Math.max(radius, Math.min(width - radius, d.x)), Math.max(radius, Math.min(height - radius, d.y))] + ")";
		});

		// Update the positions of the links
		link.attr("x1", function (d) { return d.source.x; })
			.attr("y1", function (d) { return d.source.y; })
			.attr("x2", function (d) { return d.target.x; })
			.attr("y2", function (d) { return d.target.y; });
	});

	// Mouseover and Mouseout events
	var setEvents = node
		.on("mouseover", function(d) {
			// select element in current context
			d3.select(this).selectAll("image")
				.transition()
				.duration(700)
				.attr("x", function(d) {
					if(d.value < 120){return -(d.value*0.7); }
					else{ return -(d.value/2); }
				})
				.attr("y", function(d) {
					if(d.value < 120){return -(d.value*0.7); }
					else{ return -(d.value/2); }
				})
				.attr("height", function(d) {
					if(d.value < 120){return (d.value*1.4); }
					else{ return d.value; }
				})
				.attr("width", function(d) {
					if(d.value < 120){return (d.value*1.4); }
					else{ return d.value; }
				});
			})

			// Set back
			.on("mouseout", function() {
				d3.select( this).selectAll("image")
					.transition()
					.attr("x", function(d) { return -(d.value/2); })
					.attr("y", function(d) { return -(d.value/2); })
					.attr("height", function(d) { return d.value; })
					.attr("width", function(d) { return d.value; });
			})
	});