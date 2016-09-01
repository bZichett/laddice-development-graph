import Component from 'lib/Component'

export default class DetailView extends Component {
	view(){

		const focusNode = this.props.focusNode

		return (
			<div>
				{ focusNode ? focusNode.shortLabel : ""}
			</div>
		)
	}
}