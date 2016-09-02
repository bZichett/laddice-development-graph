import Component from 'lib/Component'

export default class ForceDirectedGraph {

	constructor(element, data, options = {}) {
		this.context = this.props.context
		this.element = element

		this.props = {
			nodes: data.nodes,
			links: data.links,
			setFocusNode: options.setFocusNode
		}
	}

	render() {
		var div = document.createElement('div')
		div.setAttribute('class', "ForceDirectedGraph")
		this.element.appendChild(div)
	}

	config(isInit) {
		if (isInit) return
		this.context.drawing = this.draw()
	}

	draw() {

		//const width = this.props.width
		//const height = this.props.height
		const element = this.element
		const nodes = this.props.nodes
		const links = this.props.links

		var width = element.offsetWidth;
		var height = element.offsetHeight;

		var keyc = true, keys = true, keyt = true, keyr = true, keyx = true, keyd = true, keyl = true, keym = true, keyh = true, key1 = true, key2 = true, key3 = true, key0 = true
		var focus_node = null, highlight_node = null;
		var text_center = false;
		var outline = false;
		var min_score = 0;
		var max_score = 1;
		var color = d3.scale.linear()
			.domain([min_score, (min_score + max_score) / 2, max_score])
			.range(["lime", "yellow", "red"]);
		var highlight_color = "blue";
		var highlight_trans = 0.1;

		var size = d3.scale.pow().exponent(1)
			.domain([1, 100])
			.range([8, 24]);

		var default_node_color = "#ccc";
		//var default_node_color = "rgb(3,190,100)";
		var default_link_color = "#b2b2b2";
		var nominal_base_node_size = 8;
		var nominal_text_size = 10;
		var max_text_size = 24;
		var nominal_stroke = 1.5;
		var max_stroke = 4.5;
		var max_base_node_size = 36;
		var min_zoom = 0.1;
		var max_zoom = 7;

		var svg = d3.select(this.element).append("svg");
		var zoom = d3.zoom().scaleExtent([min_zoom, max_zoom])

		var g = svg.append("g");

		var linkedByIndex = {};

		links.forEach(function (d) {
			linkedByIndex[d.source.id + "," + d.target.id] = true;
			linkedByIndex[d.target.id + "," + d.source.id] = true;
		});

		function isConnected(a, b) {
			return linkedByIndex[a.id + "," + b.id] || linkedByIndex[b.id + "," + a.id] || a.id === b.id;
		}

		function hasConnections(a) {
			for (var property in linkedByIndex) {
				if(!linkedByIndex.hasOwnProperty(property)) return
				var s = property.split(",");
				if ((s[0] === a.id || s[1] === a.id) && linkedByIndex[property])                    return true;
			}
			return false;
		}


		var force = d3.force.forceSimulation(nodes)
			.force("link", d3.force.forceLink(links).id(d => {
				return d.id
			}))
			.force("y", d3.force.forceY(0))
			.force("x", d3.force.forceX(0))
			.force("charge",
				d3.force.forceManyBody()
					.strength(-700)
					.distanceMin(50)
					.distanceMax(4000)
			)
			.force("center",
				d3.force.forceCenter(width / 2, height / 2))

		var link = g.selectAll(".link")
			.data(links)
			.enter().append("line")
			.attr("class", "link")
			.style("stroke-width", nominal_stroke)
			.style("stroke", function (d) {
				if (isNumber(d.score) && d.score >= 0) return color(d.score);
				else return default_link_color;
			})


		//var node_drag = d3.drag()
		//	.on("start", dragstart)
		//	.on("drag", dragmove)
		//	.on("end", dragend);

		function dragstart(d, i) {
			force.stop() // stops the force auto positioning before you start dragging
		}

		function dragmove(d, i) {
			var EVENT = d3.event()
			d.px += EVENT.dx;
			d.py += EVENT.dy;
			d.x += EVENT.dx;
			d.y += EVENT.dy;
			tick(); // this is the key to make it work together with updating both px,py,x,y on d !
		}

		function dragend(d, i) {
			d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
			tick();
			force.restart();
		}

		var node = g.selectAll(".node")
			.data(nodes)
			.enter().append("g")
			.attr("class", "node")
		//.call(force.drag)
		//.call(node_drag);

		node.on("dblclick.zoom", function (d) {
			d3.event().stopPropagation();
			var dcx = (window.innerWidth / 2 - d.x * zoom.scaleExtent()[1]);
			var dcy = (window.innerHeight / 2 - d.y * zoom.scaleExtent()[1]);
			zoom.translate([dcx, dcy]);
			g.attr("transform", "translate(" + dcx + "," + dcy + ")scale(" + zoom.scaleExtent()[1] + ")");


		});


		var tocolor = "fill";
		var towhite = "stroke";
		if (outline) {
			tocolor = "stroke"
			towhite = "fill"
		}

		//var scale = d3.scale.linear()
		//	.domain([1, 6])
		//	.range([100, 1000]);
		//
		//var colorscale = d3.scale.linear()
		//	.domain([1, 6])
		//	.range(["red", "steelblue"]);


		var circle = node.append("path")
			.attr("d", d3.shape.symbol()
				.size(200))
			//.type(function (d) {
			//	if(d.size >= 9) {
			//		return "cross";
			//	} else if
			//	(d.size <= 9) {
			//		return "diamond";
			//	}
			//}))
			.style(tocolor, function (d) {
				if (isNumber(d.score) && d.score >= 0) return color(d.score);
				else return default_node_color;
			})
			//.attr("r", function(d) { return size(d.size)||nominal_base_node_size; })
			.style("stroke-width", nominal_stroke)
			.style(towhite, "white");


		var text = g.selectAll(".text")
			.data(nodes)
			.enter().append("text")
			.attr("dy", ".35em")
			.style("font-size", nominal_text_size + "px")
		if (text_center)
			text.text(function (d) {
					return d.shortLabel;
				})
				.style("text-anchor", "middle");
		else
			text.attr("dx", function (d) {
					return (size(d.size) || nominal_base_node_size);
				})
				.text(function (d) {
					return '\u2002' + d.shortLabel;
				});
		node.on("mouseover", function (d) {
				set_highlight(d);
			})
			.on("mousedown", (d) => select_item.call(this, d))
			.on("mouseout", function (d) {
				exit_highlight();
			});

		//d3.select(window).on("mouseup", deselect_item)


		function deselect_item(){
			//if (focus_node !== null) {
				focus_node = null;
				//if (highlight_trans < 1) {

					circle.style("opacity", 1);
					text.style("opacity", 1);
					link.style("opacity", 1);
				//}
			//}
			exit_highlight();
		}

		// eslint-disable-next-line
		function select_item(d, {fromOutside = false} = {fromOutside}){
			var EVENT = d3.event()
			if(EVENT) EVENT.stopPropagation();
			focus_node = d;
			set_focus.call(this, d, fromOutside)
			set_highlight(d)
		}

		function exit_highlight() {
			highlight_node = null;
			if (focus_node === null) {
				if (highlight_color !== "white") {
					circle.style(towhite, "white");
					text.style("font-weight", "normal");
					link.style("stroke", function (o) {
						return (isNumber(o.score) && o.score >= 0) ? color(o.score) : default_link_color
					});
				}

			}
		}

		function set_focus(d, fromOutside) {

			if(!fromOutside) this.props.setFocusNode(d)

			if (highlight_trans < 1) {
				circle.style("opacity", function (o) {
					return isConnected(d, o) ? 1 : highlight_trans;
				});
				text.style("opacity", function (o) {
					return isConnected(d, o) ? 1 : highlight_trans;
				});
				link.style("opacity", function (o) {
					return o.source.id === d.id || o.target.id === d.id ? 1 : highlight_trans;
				});
			}
		}

		function set_highlight(d) {
			if (focus_node !== null) d = focus_node;
			highlight_node = d;
			if (highlight_color !== "white") {
				//circle.style(towhite, function (o) {
				//	return isConnected(d, o) ? highlight_color : "white";
				//});
				text.style("font-weight", function (o) {
					return isConnected(d, o) ? "bold" : "normal";
				});
				link.style("stroke", function (o) {
					return o.source.id === d.id || o.target.id === d.id ? highlight_color : ((isNumber(o.score) && o.score >= 0) ? color(o.score) : default_link_color);
				});
			}
		}

		zoom.on("zoom", function () {

			const EVENT = d3.event()

			const zoomScale = EVENT.transform.k
			const inverseZoomScale = 1 / zoomScale
			//
			////console.log(zoomScale);
			//
			//var stroke = nominal_stroke;
			//if (nominal_stroke * zoomScale > max_stroke) stroke = max_stroke / zoomScale;
			//link.style("stroke-width", stroke);
			//circle.style("stroke-width", stroke);
			//
			//var base_radius = nominal_base_node_size;
			//
			//if (nominal_base_node_size * zoomScale > max_base_node_size)
			//	base_radius = max_base_node_size / zoomScale;
			//
			////circle.attr("d", d3.shape.symbol()
			////	.size(function (d) {
			////		return Math.PI * Math.pow(size(d.size) * base_radius / nominal_base_node_size || base_radius, 2);
			////	}))
			////.type(function (d) {
			////	return d.type;
			////}))
			//
			//circle.attr("r", function(d) { return (size(d.size)*base_radius/nominal_base_node_size||base_radius); })
			//if (!text_center) text.attr("dx", function (d) {
			//	return (size(d.size) * base_radius / nominal_base_node_size || base_radius);
			//});
			//
			var text_size = nominal_text_size;
			//if (nominal_text_size * zoomScale > max_text_size) text_size = max_text_size / zoomScale;
			text.style("font-size", inverseZoomScale * text_size + "px");

			g.attr("transform", EVENT.transform);
		});

		svg.call(zoom);

		resize();
		//window.focus();
		d3.select(window).on("resize", resize).on("keydown", keydown.bind(this));

		function tick(){
			node.attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")";
			});
			text.attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")";
			});

			link.attr("x1", function (d) {
					return d.source.x;
				})
				.attr("y1", function (d) {
					return d.source.y;
				})
				.attr("x2", function (d) {
					return d.target.x;
				})
				.attr("y2", function (d) {
					return d.target.y;
				});

			node.attr("cx", function (d) {
					return d.x;
				})
				.attr("cy", function (d) {
					return d.y;
				});
		}

		force.on("tick", function () {
			tick()
		});

		function resize() {
			width = element.offsetWidth;
			height = element.offsetHeight;
			svg.attr("width", width).attr("height", height);
			 //*TBa
			//force.size([force.size()[0] + (width - w) / zoom.scaleExtent()[1], force.size()[1] + (height - h) / zoom.scaleExtent()[1]]).resume();
			//width = width;
			//height = height;
		}

		function keydown() {
			if (d3.event.keyCode === 32) {
				force.stop();
			}
			else if (d3.event.keyCode >= 48 && d3.event.keyCode <= 90 && !d3.event.ctrlKey && !d3.event.altKey && !d3.event.metaKey) {
				switch (String.fromCharCode(d3.event.keyCode)) {
					case "C":
						keyc = !keyc;
						break;
					case "S":
						keys = !keys;
						break;
					case "T":
						keyt = !keyt;
						break;
					case "R":
						keyr = !keyr;
						break;
					case "X":
						keyx = !keyx;
						break;
					case "D":
						keyd = !keyd;
						break;
					case "L":
						keyl = !keyl;
						break;
					case "M":
						keym = !keym;
						break;
					case "H":
						keyh = !keyh;
						break;
					case "1":
						key1 = !key1;
						break;
					case "2":
						key2 = !key2;
						break;
					case "3":
						key3 = !key3;
						break;
					case "0":
						key0 = !key0;
						break;
					default:
						break;
				}

				link.style("display", function (d) {
					var flag = vis_by_type(d.source.type) && vis_by_type(d.target.type) && vis_by_node_score(d.source.score) && vis_by_node_score(d.target.score) && vis_by_link_score(d.score);
					linkedByIndex[d.source.id + "," + d.target.id] = flag;
					return flag ? "inline" : "none";
				});
				node.style("display", function (d) {
					return (key0 || hasConnections(d)) && vis_by_type(d.type) && vis_by_node_score(d.score) ? "inline" : "none";
				});
				text.style("display", function (d) {
					return (key0 || hasConnections(d)) && vis_by_type(d.type) && vis_by_node_score(d.score) ? "inline" : "none";
				});

				if (highlight_node !== null) {
					if ((key0 || hasConnections(highlight_node)) && vis_by_type(highlight_node.type) && vis_by_node_score(highlight_node.score)) {
						if (focus_node !== null) set_focus(focus_node);
						set_highlight(highlight_node);
					}
					else {
						exit_highlight();
					}
				}
			}
		}


		function vis_by_type(type) {
			switch (type) {
				case "circle":
					return keyc;
				case "square":
					return keys;
				case "triangle-up":
					return keyt;
				case "diamond":
					return keyr;
				case "cross":
					return keyx;
				case "triangle-down":
					return keyd;
				default:
					return true;
			}
		}

		function vis_by_node_score(score) {
			if (isNumber(score)) {
				if (score >= 0.666) return keyh;
				else if (score >= 0.333) return keym;
				else if (score >= 0) return keyl;
			}
			return true;
		}

		function vis_by_link_score(score) {
			if (isNumber(score)) {
				if (score >= 0.666) return key3;
				else if (score >= 0.333) return key2;
				else if (score >= 0) return key1;
			}
			return true;
		}

		function isNumber(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		}


		return {
			deselect_item: deselect_item.bind(this),
			select_item: select_item.bind(this),
		}
	}


}