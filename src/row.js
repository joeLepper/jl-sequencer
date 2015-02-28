var react = require('react')
  , d = react.DOM
  , button = require('./button')

module.exports = react.createClass(
  { componentDidMount: function () {
      var self = this
      self.props.ee.emit('register-row', [self.props.eventName])
    }
  , componentWillUnmount: function () {
      var self = this
      self.props.ee.emit('remove-row', [self.props.eventName])
    }
  , render: function () {
      var self = this
        , buttons = []

      for (var i = 0; i < (self.props.numberOfBeats); i++) {
        buttons.push(button(
          { ee: self.props.ee
          , row: self.props.row
          , eventName: self.props.eventName
          , column: i
          , litForNow: self.props.currentBeat === i
          }
        ))
      }
      return d.div({ className: 'row' }, buttons)
    }
  }
)
