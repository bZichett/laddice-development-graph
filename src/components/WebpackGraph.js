import Component from 'lib/Component'

import { ForceDirectedGraph } from 'force-directed-graph-d3'

export default class WebpackGraph extends Component {
	init(){

		this.state = {
			stats: undefined,
			edges: [],
			nodes: [],
			zoom: 5,
			width: window.innerWidth,
			height: window.innerHeight,
			started: true,
			font: undefined,
		};

		this.lastDate = new Date()
		this.maxZoom = 15
		this.loading = true
	}

	config(isInit){
		if(isInit) return

		this.startLayout()

	}

	view(){
		const s = this.state

		return (
			<div>
				{ !this.loading ? ForceDirectedGraph.component({
					nodes: s.nodes,
					context: this,
					links: s.edges,
					width: s.width,
					height: s.height,
					setFocusNode: this.props.setFocusNode
				}) : "" }
			</div>
		)
	}

	setState(obj){
		Object.keys(obj).forEach((key) => {
			this.state[key] = obj[key]
		})
	}

	startLayout() {

		if (this.layout) {
			this.layout.stop();
		}

		//this.layout.start();

		this.setState({
			nodes: this.props.tree.nodes,
			edges: this.props.tree.edges,
			started: true
		});

		setTimeout((() => {
			this.loading = false
			m.redraw()
		}), 1000)
	}

	handleSelectFile(e){
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onload = this.handleFileLoad;

		reader.readAsText(file);
	}

	handleFileLoad(e){
		const stats = JSON.parse(e.target.result);

		this.setState({ stats });
	}
}
