import React, { Component } from 'react'
import '../css/App.css'

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
  }
  return call && (typeof call === 'object' || typeof call === 'function') ? call : self
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass)
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, enumerable: false, writable: true, configurable: true }
  })
  if (superClass)
    Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : (subClass.__proto__ = superClass)
}

let CardWrapper = (function (_Component) {
  _inherits(CardWrapper, _Component)

  function CardWrapper(props) {
    _classCallCheck(this, CardWrapper)

    let _this = _possibleConstructorReturn(this, _Component.call(this, props))

    _this.state = {}
    return _this
  }

  CardWrapper.prototype.componentDidMount = function componentDidMount() {
    this.setupCards()
  }

  CardWrapper.prototype.componentDidUpdate = function componentDidUpdate() {
    this.setupCards()
  }

  CardWrapper.prototype.setupCards = function setupCards() {
    let container = document.querySelector('.container')
    let allCards = document.querySelectorAll('.card_container')
    let newCards = document.querySelectorAll('.card_container:not(.removed)')
    newCards.forEach(function (card, index) {
      card.style.zIndex = allCards.length - index
      card.style.transform = 'scale(' + (20 - index) / 20 + ') translateY(-' + 30 * index + 'px)'
      // card.style.opacity = (10 - index) / 10;
    })
    container.classList.add('loaded')
  }

  CardWrapper.prototype.renderCards = function renderCards() {
    let _this2 = this

    return React.Children.map(this.props.children, function (child) {
      return React.cloneElement(child, { superOnSwipe: _this2.superOnSwipe.bind(_this2) })
    })
  }

  CardWrapper.prototype.renderEndCard = function renderEndCard() {
    if (this.props.addEndCard) {
      return React.createElement('div', { className: 'card_container end_card' }, this.props.addEndCard())
    }
  }

  CardWrapper.prototype.superOnSwipe = function superOnSwipe() {
    this.setupCards()
  }

  CardWrapper.prototype.render = function render() {
    return React.createElement(
      'div',
      { className: 'container', style: this.props.style },
      React.createElement('div', { className: 'cards_container' }, this.renderCards(), this.renderEndCard())
    )
  }

  return CardWrapper
})(Component)

export default CardWrapper
