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
					</nav>
				</header>

				<div class="Container">
					<div class="Container-left"> { !this.loading ? this.graph.render() : ""}</div>
					<div class="Container-right"> { !this.loading ? this.detail.render() : ""}</div>
				</div>

			</div>
		)
	}

	populate(){

		getDefaultStats().then(stats => {

			this.stats = stats

			this.directory = new Directory()

			this.tree = getTreeFromStats(this.stats, this.directory)

			this.directory.setHierarchyObjects()

			this.graph = new WebpackGraph({
				focusNode: this.focusNode,
				setFocusNode: this.setFocusNode,
				tree: this.tree
			})

			this.detail = new DetailView({
				focusNode: this.focusNode,
				setFocusNode: this.setFocusNode
			})

			this.loading = false

			m.redraw()

		})
	}

	setFocusNode(d){
		console.log(d)
		this.focusNode = d
	}
}