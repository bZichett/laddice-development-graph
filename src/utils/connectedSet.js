import { filterEdges } from 'utils/filterEdges'

export function connectedSet(node){
	var edges = filterEdges(app.data.edges, {connectedTo: node.id})
	var nodes = []

	edges.forEach((edge) => {
		if(edge.target.id === node.id){
			nodes.push(edge.source)
		} else {
			nodes.push(edge.target)
		}
	})

	return nodes
}
