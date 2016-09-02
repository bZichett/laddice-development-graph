import Component from 'lib/Component'
import { connectedSet } from 'utils/connectedSet'

export default class DetailView extends Component {
	init(){
		this.graph = this.props.graph
	}

	view(){
		return (
			<div>
				{ this.focusNode ?
					<div>

						<div style="font-size: 130%;"> { this.focusNode.shortLabel } </div>

						<p> Dependencies </p>

						{ this.renderLevel(this.focusNode)}

					</div> : "Select an item to view here"}

			</div>
		)
	}

	renderLevel(rootNode){
		return (
			<ul>
				{ connectedSet(rootNode).map((node) => {
					return (
						<li>
							{/* <span onclick={() => this.toggleConnectedVisibility(node)}>+</span> */}
							<a onclick={() => this.show(node)}> { node.shortLabel } </a>
							<span style="color: grey;"> { node.path } </span>
						</li>
					)
				})}
			</ul>
		)
	}

	show(node){
		this.focusNode = node
		this.graph.drawing.select_item(node, {fromOutside: true})
		m.redraw()
	}

	toggleConnectedVisibility(node){

	}
}