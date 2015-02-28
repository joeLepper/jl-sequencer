var react = require('react')
  , d = react.DOM
  , row = require('./row')
  , ee = require('nee')()

module.exports = react.createClass(
  { componentWillMount: function () {
      var self = this
        , clock = self.props.clock
        , scheduledEvents = {}
        , scheduled = false
        , currentBeat = 15
        , nextBeat = 0
        , lastBeat

      clock.on('next-tick', function (beat) {
        if (lastBeat !== beat.lastBeat) {
          scheduled = false
          lastBeat = beat.lastBeat
          currentBeat === 15 ? currentBeat = 0 : currentBeat++
          nextBeat === 15 ? nextBeat = 0 : nextBeat++
          self.setState({ currentBeat: currentBeat })
          ee.emit('next-beat', [])
        }

        if (!scheduled && beat.nextBeat < beat.lookahead) {
          var beats = []
          Object.keys(scheduledEvents).forEach(function (eventName, index) {
            var evt = (
                  { beat: beat.nextBeat
                  , name: eventName
                  , state: scheduledEvents[eventName][nextBeat]
                  }
                )

            beats[index] = evt
          })
          ee.emit('schedule', [beats])
          scheduled = true
        }
      })
      ee.on('register-row', function (eventName) { scheduledEvents[eventName] = [] })
      ee.on('remove-row', function (eventName) { delete scheduleNotes[eventName] })
      ee.on('note-button-click', function (column, row, eventName) {
        scheduledEvents[eventName][column] = !scheduledEvents[eventName][column]
      })
      ee.on('bpm-change', function (bpm) {
        self.setState({ bpm: bpm })
        clock.changeBpm(bpm)
      })
      ee.on('swing-change', function (swing) {
        self.setState({ swing: swing })
        clock.changeSwing(swing)
      })
    }
  , getInitialState: function () {
      var self = this
      return (
        { currentBeat: 15
        , nextBeat: 0
        , bpm: self.props.initialBpm
        , swing: 0.25
        }
      )
    }
  , render: function () {
      var self = this
        , controls = self.props.rows.map(function (eventName, index) {
            return row(
              { eventName: eventName
              , ee: ee
              , row: index
              , currentBeat: self.state.currentBeat
              , numberOfBeats: self.props.beats
              }
            )
          })
      controls.unshift(d.div({ className: 'group'}, (
        [ d.div({ className: 'item' }
          , [ d.label({}, 'bpm: ' + (self.state.bpm / 2))
            , d.div({}
              , d.input(
                  { type: 'range'
                  , min: 60
                  , max: 1200
                  , value: self.state.bpm
                  , step: 0.25
                  , onChange: function (e) { ee.emit('bpm-change', [e.target.value]) }
                  }
                )
              )
            ]
          )
        , d.div({ className: 'item' }
          , [ d.label({}, 'swing: ' + self.state.swing)
            , d.div({}
              , d.input(
                  { type: 'range'
                  , min: 0
                  , max: 1
                  , value: self.state.swing
                  , step: 0.01
                  , onChange: function (e) { ee.emit('swing-change', [e.target.value]) }
                  }
                )
              )
            ]
          )
        ]
      )))
      controls.unshift(d.div({ className: 'room_name' }, d.span({ className: 'room_span' }, 'room: ' + self.state.socketId)))
      return d.div({ className: 'controls' }, controls)
    }
  }
)
module.exports.on = ee.on.bind(ee)
