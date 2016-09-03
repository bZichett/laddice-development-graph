export async function getDefaultStats() {
	//const result = await fetch('static/stats/stats_list.json');
	const result = await fetch('static/stats/stats_all.json');
	return await result.json();
}

function passesNodeNameTest(name){
	if(name.indexOf('vendor') !== -1) return false
	if(name.indexOf('src') !== -1) return true
	return false
}

export function getTreeFromStats(json, directory) {

	const tree = json.modules.reduce((t, module) =>
		module.reasons.reduce((t1, reason) => ({
			nodes: [...t1.nodes, reason.module, module.name],
			edges: [...t1.edges, [reason.module, module.name]]
		}), t), { nodes: [], edges: [] });


	var numNodes = 0

	var nodes = []

	tree.nodes.forEach((nodeName) => {

		if(!passesNodeNameTest(nodeName)) return

		if(directory.nodeNameSet.has(nodeName)) return

		directory.nodeNameSet.add(nodeName)

		numNodes++

		var node = {
			size: 25,
			score: 1,
			edges: [],
			type: 'circle',
			path: nodeName,
			id: numNodes
		}
		nodes.push(node)
		var {last, splitPath} = directory.set(nodeName, node)
		node.shortLabel = last
		node.splitPath = splitPath

	})

	var addEdge = (name, edge, location) => {
		var node = directory.get(name)
		if(node){
			edge[location] = node
			node.edges.push(edge)
			return node
		} else {
			node = directory.set(name, numNodes++)
			edge[location] = numNodes
			node.edges.push(edge)
		}
	}

	var numEdges = 0

	var edges = []

	tree.edges.forEach((edge) => {

		if(passesNodeNameTest(edge[1]) && passesNodeNameTest(edge[0])){

			edges.push(edge)

			edge.id = numEdges++

			addEdge(edge[0], edge, 'source')
			addEdge(edge[1], edge, 'target')

			if(edge[0] === edge[1]) {
				//tree.edges.splice(edge, 1)
				console.log("==", edge)
			}

			if(!edge.target || !edge.source ) {
				console.log("Empty", edge)
			}
		}
	})

	//console.log("Tree", tree)
	return {
		nodes: nodes,
		edges: edges,
	};
}