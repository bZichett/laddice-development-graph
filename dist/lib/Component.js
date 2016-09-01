'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The `Component` class defines a user interface 'building block'. A component
 * can generate a virtual DOM to be rendered on each redraw.
 *
 * An instance's virtual DOM can be retrieved directly using the {@link
	* Component#render} method.
 *
 * @example
 * this.myComponentInstance = new MyComponent({foo: 'bar'});
 * return m('div', this.myComponentInstance.render());
 *
 * Alternatively, components can be nested, letting Mithril take care of
 * instance persistence. For this, the static {@link Component.component} method
 * can be used.
 *
 * @example
 * return m('div', MyComponent.component({foo: 'bar'));
 *
 * @see https://lhorie.github.io/mithril/mithril.component.html
 * @abstract
 */

var Component = function () {
	/**
  * @param {Object} props
  * @param {Array|Object} children
  * @public
  */
	function Component() {
		var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
		var children = arguments[1];

		_classCallCheck(this, Component);

		if (children) props.children = children;

		this.constructor.initProps(props);

		/**
   * The properties passed into the component.
   *
   * @type {Object}
   */
		this.props = props;

		/**
   * The root DOM element for the component.
   *
   * @type DOMElement
   * @public
   */
		this.element = null;

		/**
   * Whether or not to retain the component's subtree on redraw.
   *
   * @type {boolean}
   * @public
   */
		this.retain = false;

		this.init();
	}

	/**
  * Called when the component is constructed.
  *
  * @protected
  */


	_createClass(Component, [{
		key: 'init',
		value: function init() {}

		/**
   * Called when the component is destroyed, i.e. after a redraw where it is no
   * longer a part of the view.
   *
   * @see https://lhorie.github.io/mithril/mithril.component.html#unloading-components
   * @param {Object} e
   * @public
   */

	}, {
		key: 'onunload',
		value: function onunload() {}

		/**
   * Get the renderable virtual DOM that represents the component's view.
   *
   * This should NOT be overridden by subclasses. Subclasses wishing to define
   * their virtual DOM should override Component#view instead.
   *
   * @example
   * this.myComponentInstance = new MyComponent({foo: 'bar'});
   * return m('div', this.myComponentInstance.render());
   *
   * @returns {Object}
   * @final
   * @public
   */

	}, {
		key: 'render',
		value: function render() {
			var _this = this;

			var vdom = this.retain ? { subtree: 'retain' } : this.view();

			// Override the root element's config attribute with our own function, which
			// will set the component instance's element property to the root DOM
			// element, and then run the component class' config method.
			vdom.attrs = vdom.attrs || {};

			var originalConfig = vdom.attrs.config;

			vdom.attrs.config = function () {
				for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
					args[_key] = arguments[_key];
				}

				_this.element = args[0];
				_this.config.apply(_this, args.slice(1));
				if (originalConfig) originalConfig.apply(_this, args);
			};
			return vdom;
		}

		/**
   * Returns a jQuery object for this component's element. If you pass in a
   * selector string, this method will return a jQuery object, using the current
   * element as its buffer.
   *
   * For example, calling `component.$('li')` will return a jQuery object
   * containing all of the `li` elements inside the DOM element of this
   * component.
   *
   * @param {String} [selector] a jQuery-compatible selector string
   * @returns {jQuery} the jQuery object for the DOM node
   * @final
   * @public
   */

	}, {
		key: '$',
		value: function $(selector) {
			return this.element;
			//const $element = $(this.element);
			//return selector ? $element.find(selector) : $element;
		}

		/**
   * Called after the component's root element is redrawn. This hook can be used
   * to perform any actions on the DOM, both on the initial draw and any
   * subsequent redraws. See Mithril's documentation for more information.
   *
   * @see https://lhorie.github.io/mithril/mithril.html#the-config-attribute
   * @param {Boolean} isInitialized
   * @param {Object} context
   * @param {Object} vdom
   * @public
   */

	}, {
		key: 'config',
		value: function config() {}

		/**
   * Get the virtual DOM that represents the component's view.
   *
   * @return {Object} The virtual DOM
   * @protected
   */

	}, {
		key: 'view',
		value: function view() {
			throw new Error('Component#view must be implemented by subclass');
		}

		/**
   * Get a Mithril component object for this component, preloaded with props.
   *
   * @see https://lhorie.github.io/mithril/mithril.component.html
   * @param {Object} [props] Properties to set on the component
   * @return {Object} The Mithril component object
   * @property {function} controller
   * @property {function} view
   * @property {Object} component The class of this component
   * @property {Object} props The props that were passed to the component
   * @public
   */

	}], [{
		key: 'component',
		value: function component() {
			var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
			var children = arguments[1];

			var componentProps = Object.assign({}, props);

			if (children) componentProps.children = children;

			this.initProps(componentProps);

			// Set up a function for Mithril to get the component's view. It will accept
			// the component's controller (which happens to be the component itself, in
			// our case), update its props with the ones supplied, and then render the view.
			var view = function view(component) {
				component.props = componentProps;
				return component.render();
			};

			// Mithril uses this property on the view function to cache component
			// controllers between redraws, thus persisting component state.
			view.$original = this.prototype.view;

			// Our output object consists of a controller constructor + a view function
			// which Mithril will use to instantiate and render the component. We also
			// attach a reference to the props that were passed through and the
			// component's class for reference.
			var output = {
				controller: this.bind(undefined, componentProps),
				view: view,
				props: componentProps,
				component: this
			};

			//c.info("output", output)

			// If a `key` prop was set, then we'll assume that we want that to actually
			// show up as an attribute on the component object so that Mithril's key
			// algorithm can be applied.
			if (componentProps.key) {
				output.attrs = { key: componentProps.key };
			}

			return output;
		}

		/**
   * Initialize the component's props.
   *
   * @param {Object} props
   * @public
   */

	}, {
		key: 'initProps',
		value: function initProps(props) {}
	}]);

	return Component;
}();

exports.default = Component;