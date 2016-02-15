
	var width = 1000,
		height = 800,
		maxNodeSize = 50;

	var color = "white";

	var force = d3.layout.force()
		.charge(-1500)
		.linkDistance(160)
		.size([width, height]);

	var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height);

	d3.json("links.json", function(error, graph) {

		if (error) throw error;

		force
			.nodes(graph.nodes)
			.links(graph.links)
			.start();

	var link = svg.selectAll(".link")
		.data(graph.links).enter().append("line")
		.attr("class", "link")
		.style("stroke-width", function(d) { return Math.sqrt(d.value); });

		var node = svg.selectAll(".node")
			.data(graph.nodes)
			.enter()
			.append("g").attr("class", "node")
			.call(force.drag);

		var circle = node
			.append("circle")
			.attr("r", function(d) { return (d.value/2) })
			.style("fill", function(d) { return color; });


		node.append("title")
			.text(function(d) { return d.name; });

		var anchor = node.append("svg:a")
				.attr("xlink:href", function(d) { return d.url; })
				.attr("target", "_blank");

		var image = anchor.append("svg:image")
				.attr("xlink:href", function(d) { return d.photo; })
				.attr("x", function(d) { return -(d.value/2); })
				.attr("y", function(d) { return -(d.value/2); })
				.attr("height", function(d) { return d.value })
				.attr("width", function(d) { return d.value });



		force.on("tick", function() {
			
			//node.attr("cx", function(d) { return d.x = Math.max(r, Math.min(width - r, d.x)); })
			//	.attr("cy", function(d) { return d.y = Math.max(r, Math.min(height - r, d.y)); });
			

			node.attr("transform", function(d) {
				var radius = d.value/2;
				return "translate(" + [Math.max(radius, Math.min(width - radius, d.x)), Math.max(radius, Math.min(height - radius, d.y))] + ")";
			});

			link.attr("x1", function (d) {return d.source.x;})
				.attr("y1", function (d) {return d.source.y;})
				.attr("x2", function (d) {return d.target.x;})
				.attr("y2", function (d) {return d.target.y;});



		});

		var setEvents = node
				.on("mouseover", function(d) {
					
					// select element in current context
					d3.select(this).selectAll("image")
							.transition()
							.duration(700)
							.attr("x", function(d) {
								if(d.value < 120){return -(d.value*0.7); }
								else{
									return -(d.value/2);
								}
							})
							.attr("y", function(d) {
								if(d.value < 120){return -(d.value*0.7); }
								else{
									return -(d.value/2);
								}
							})
							.attr("height", function(d) {
								if(d.value < 120){return (d.value*1.4); }
								else{
									return d.value;
								}
							})
							.attr("width", function(d) {
								if(d.value < 120){return (d.value*1.4); }
								else{
									return d.value;
								}
							});
				})
				// set back
				.on("mouseout", function() {
					d3.select( this).selectAll("image")
							.transition()
							.attr("x", function(d) { return -(d.value/2); })
							.attr("y", function(d) { return -(d.value/2); })
							.attr("height", function(d) { return d.value; })
							.attr("width", function(d) { return d.value; });
				})
	});