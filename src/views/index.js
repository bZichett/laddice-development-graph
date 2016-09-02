import { forceSimulation, forceManyBody, forceLink, forceCenter, forceX, forceY } from "d3-force";
import { selectAll, select } from "d3-selection";

import { scaleLinear, scalePow } from "d3-scale";
import { symbol, circle } from "d3-shape";
import { zoom, zoomTransform } from "d3-zoom";
import { interpolateZoom } from "d3-interpolate";
import { drag } from "d3-drag";

import './ForceDirectedGraph.css'

import ForceDirectedGraph from './ForceDirectedGraph'

window.d3 = {
	selectAll,
	select,
	zoom,
	zoomTransform,
	event: () => require("d3-selection").event,
	drag,
	force: {
		forceX,
		forceY,
		forceManyBody,
		forceLink,
		forceSimulation,
		forceCenter
	},
	shape: {
		symbol,
		circle,
	},
	interpolate: {
		zoom: interpolateZoom
	},
	scale: {
		linear: scaleLinear,
		pow: scalePow
	}
}

export {
	ForceDirectedGraph
}