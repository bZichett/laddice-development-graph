export function filterEdges(edges, options){

	var filteredEdges = []

	if(options.connectedTo){
		var id = options.connectedTo
		filteredEdges = edges.filter((edge) => {
			return edge.source.id === id || edge.target.id === id
		})
	}

	return filteredEdges
}