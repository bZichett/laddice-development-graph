import Component from 'lib/Component'
import { connectedSet } from 'utils/connectedSet'
import './DetailView.css'

export default class DetailView extends Component {

	init(){
		this.WebpackGraph = this.props.WebpackGraph
	}

	view(){
		return (
			<div style="width: 100%;">
				{ this.focusNode ?
					<div>

						<div style="font-size: 130%;">
							{ this.focusNode.shortLabel }
							<span style="font-size: 80%; color: grey;"> { this.getShortPath(this.focusNode) } </span>
						</div>

						<p> Dependencies </p>

						{ this.renderLevel(this.focusNode)}

					</div> : "Select an item to view here"}

			</div>
		)
	}

	renderLevel(rootNode){
		return (
			<ul class="DetailView-descendants-list">
				{ connectedSet(rootNode).map((node) => {
					return (
						<li>
							{/* <span onclick={() => this.toggleConnectedVisibility(node)}>+</span> */}
							<a onclick={() => this.show(node)}> { node.shortLabel } </a>
							<span style="color: grey;"> { this.getShortPath(node) } </span>
						</li>
					)
				})}
			</ul>
		)
	}

	getShortPath(node){
		return node.splitPath.slice(3, node.splitPath.length).join('/')
	}

	show(node){
		this.focusNode = node
		this.WebpackGraph.graph.layout.select_item(node, {fromOutside: true})
		m.redraw()
	}

	toggleConnectedVisibility(node){

	}
}