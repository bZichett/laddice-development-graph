import Component from 'lib/Component'
import WebpackGraph from 'components/WebpackGraph'
import DetailView from 'components/DetailView'
import Directory from 'components/Directory';
import { getDefaultStats, getTreeFromStats } from 'utils/getTreeFromStats'

export default class Dashboard extends Component {

	init(){

		app.dashboard = this

		this.focusNode = null
		this.loading = true

		this.populate()

	}

	view(){
		return (
			<div>
				<header>
					<div><h1>Webpack Graph</h1></div>
					<nav>
						{ this.focusNode ?
						<span class="header-focus-node-info">
							{ this.focusNode.shortLabel } &nbsp;
							<a onclick={() => this.deselectNode()}>x</a>
						</span> : "" }
					</nav>
				</header>

				<div class="Container">
					<div class="Container-left"> { !this.loading ? this.WebpackGraph.render() : ""}</div>
					<div class="Container-right"> { !this.loading ? this.DetailView.render() : ""}</div>
				</div>

			</div>
		)
	}

	populate(){

		getDefaultStats().then(stats => {

			this.stats = stats

			this.directory = new Directory()

			this.tree = getTreeFromStats(this.stats, this.directory)

			app.data = {
				nodes: this.tree.nodes,
				edges: this.tree.edges,
			}

			this.directory.setHierarchyObjects()

			this.WebpackGraph = new WebpackGraph({
				focusNode: this.focusNode,
				setFocusNode: this.setFocusNode.bind(this),
				tree: this.tree
			})

			this.DetailView = new DetailView({
				WebpackGraph: this.WebpackGraph,
				focusNode: this.focusNode,
				setFocusNode: this.setFocusNode.bind(this)
			})

			this.loading = false

			m.redraw()

		})
	}

	deselectNode(){
		this.focusNode = false
		this.DetailView.show(false)
		this.WebpackGraph.graph.layout.deselect_item()
	}

	setFocusNode(d){
		this.focusNode = d
		this.DetailView.show(d)
	}
}