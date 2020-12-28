import React, { Component } from 'react'
import Hammer from 'react-hammerjs'

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

let Card = (function (_Component) {
  _inherits(Card, _Component)

  function Card(props) {
    _classCallCheck(this, Card)

    let _this = _possibleConstructorReturn(this, _Component.call(this, props))

    _this.state = {
      classList: ['card_container']
    }
    return _this
  }

  Card.prototype.componentDidMount = function componentDidMount() {}

  Card.prototype.onPan = function onPan(event) {
    if (this.props.isSwipeEnabled !== false) {
      if (
        (this.props.isLeftSwipeEnabled !== false && event.deltaX <= 0) ||
        (this.props.isRightSwipeEnabled !== false && event.deltaX >= 0)
      ) {
        this.state.classList.push('moving')
        if (event.deltaX === 0) return
        if (event.center.x === 0 && event.center.y === 0) return
        let xMulti = event.deltaX * 0.08 // 0.03
        let yMulti = 1 // event.deltaY / 80
        let rotate = xMulti * yMulti
        // console.log(event.deltaY)
        // event.target.style.transform = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';
        event.target.style.transform = 'translate(' + event.deltaX + 'px, ' + 10 + 'px) rotate(' + rotate + 'deg)'
      }
    }
  }

  Card.prototype.onPanEnd = function onPanEnd(event) {
    if (this.props.isSwipeEnabled !== false) {
      if (
        (this.props.isLeftSwipeEnabled !== false && event.deltaX <= 0) ||
        (this.props.isRightSwipeEnabled !== false && event.deltaX >= 0)
      ) {
        let newClass = this.state.classList.filter(function (s) {
          return s !== 'moving'
        })
        this.setState({ classList: newClass })
        let moveOutWidth = document.body.clientWidth
        let keep = Math.abs(event.deltaX) < 80
        event.target.classList.toggle('removed', !keep)
        if (keep) {
          event.target.style.transform = ''
        } else {
          let endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth)
          let toX = event.deltaX > 0 ? endX : -endX
          let endY = Math.abs(event.velocityY) * moveOutWidth
          let toY = event.deltaY > 0 ? endY : -endY
          let xMulti = event.deltaX * 0.08 // 0.03
          let yMulti = 1 // event.deltaY / 80
          let rotate = xMulti * yMulti
          // event.target.style.transform = 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)';
          event.target.style.transform = 'translate(' + toX + 'px, ' + 100 + 'px) rotate(' + rotate + 'deg)'

          // DO SWIPE ACTIONS
          this.props.superOnSwipe()
          if (this.props.onSwipe) this.props.onSwipe(this.props.data)
          if (toX < 0 && this.props.onSwipeLeft) {
            this.props.onSwipeLeft(this.props.data)
          } else if (this.props.onSwipeRight) {
            this.props.onSwipeRight(this.props.data)
          }
        }
      }
    }
  }

  Card.prototype.onDoubleTap = function onDoubleTap() {
    if (this.props.onDoubleTap) this.props.onDoubleTap(this.props.data)
  }

  Card.prototype.render = function render() {
    return React.createElement(
      Hammer,
      { onPan: this.onPan.bind(this), onPanEnd: this.onPanEnd.bind(this), onDoubleTap: this.onDoubleTap.bind(this) },
      React.createElement(
        'div',
        { className: this.state.classList.join(' '), style: this.props.style },
        this.props.children
      )
    )
  }

  return Card
})(Component)

export { Card as default }
