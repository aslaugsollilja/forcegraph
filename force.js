
	// Define the dimensions of the Force jsonData
	var width = 1500,
		height = 800;

	// Background color for the png images
	var nodeColor = "white";
	var growthConstant = 1.4;

	// Create a SVG container to hold the vizualization
	// Specify the dimensions for this container
	var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height);

	// Create a force layout object and define its properties
	// 'charge' is how much the nodes push each other off
	// 'linkDistance' is the length of the links between the nodes
	var force = d3.layout.force()
		.charge(-1500)
		.linkDistance(180)
		.size([width, height]);

	// The static data comes from a json file
	d3.json("links.json", function(error, jsonData) {
		if (error) throw error;

		// Turn on the force layout
		force
			.nodes(jsonData.nodes)
			.links(jsonData.links)
			.start();

	// Draw the SVG lines between the nodes
	var link = svg.selectAll(".link")
		// Data bind
		.data(jsonData.links)
		// Enter : for new data
		.enter().append("line")
		.attr("class", "link")
		.style("stroke-width", function(d) { return Math.sqrt(d.diameter); });

	// Draw the SVG circles
	var node = svg.selectAll(".node")
		// Data bind
		.data(jsonData.nodes)
		// Enter : for new data
		.enter()
		.append("g").attr("class", "node")
		// Apply force.drag to each element
		.call(force.drag);

	// Append circle to each node
	node.append("circle")
		.attr("r", function(d) { return (d.diameter/2) })
		.style("fill", function(d) { return nodeColor; });

	// Append title to each node
	node.append("title")
		.text(function(d) { return d.name; });

	// Append anchor to the nodes so user can click on hyperlink
	var anchor = node.append("svg:a")
			.attr("xlink:href", function(d) { return d.url; })
			.attr("target", "_blank");

	// Append image anchor on the nodes
	anchor.append("svg:image")
			.attr("xlink:href", function(d) { return d.photo; })
			.attr("x", function(d) { return -(d.diameter/2); })
			.attr("y", function(d) { return -(d.diameter/2); })
			.attr("height", function(d) { return d.diameter })
			.attr("width", function(d) { return d.diameter });


	force.on("tick", function() {
		// Update position of the nodes
		node.attr("transform", function(d) {
			var radius = d.diameter/2;
			// Put constraints on the position - within bounds - nodes can't go outside of the box
			var xPos = Math.max(radius, Math.min(width - radius, d.x));
			var yPos = Math.max(radius, Math.min(height - radius, d.y));
			return "translate(" + [xPos, yPos] + ")";
		});

		// Update the positions of the links
		link.attr("x1", function (d) { return d.source.x; })
			.attr("y1", function (d) { return d.source.y; })
			.attr("x2", function (d) { return d.target.x; })
			.attr("y2", function (d) { return d.target.y; });
	});

	// Mouseover and Mouseout events
	node
		.on("mouseover", function(d) {
			// Enlarge nodes on hover
			d3.select(this).selectAll("image")
				.transition()
				.duration(700)
				// modify size and position
				.attr({
					x : function(d) {
					if(!d.centerNode){return -(d.diameter * (growthConstant/2)); }
					else{ return -(d.diameter/2); }
				},
					y : function(d) {
					if(!d.centerNode){return -(d.diameter * (growthConstant/2)); }
					else{ return -(d.diameter/2); }
				},
					height:function(d) {
					if(!d.centerNode){return (d.diameter * growthConstant); }
					else{ return d.diameter; }
				},
					width : function(d) {
					if(!d.centerNode){return (d.diameter * growthConstant); }
					else{ return d.diameter; }
				}
				})
			})

			// Return to default size and position
			.on("mouseout", function() {
				d3.select( this).selectAll("image")
					.transition()
					.attr("x", function(d) { return -(d.diameter/2); })
					.attr("y", function(d) { return -(d.diameter/2); })
					.attr("height", function(d) { return d.diameter; })
					.attr("width", function(d) { return d.diameter; });
			})
	});