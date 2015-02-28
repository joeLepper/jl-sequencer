var react = require('react')
  , ee = require('nee')()
  , Scheduler = require('beat-scheduler')
  , machine = require('./src')
  , socket = require('socket.io-client')
  , io = socket()
  , ac = new window.AudioContext
  , d = react.DOM
  , initialBpm = 240
  , rows = (
      [ 'BD/BD0000.wav'
      , 'BD/BD0025.wav'
      , 'BD/BD0050.wav'
      , 'SD/SD1050.wav'
      , 'CH/CH.wav'
      , 'OH/OH00.wav'
      , 'CP/CP.wav'
      , 'CL/CL.wav'
      , 'HT/HT00.wav'
      , 'MT/MT00.wav'
      , 'LT/LT00.wav'
      , 'HC/HC00.wav'
      , 'MC/MC00.wav'
      , 'LC/LC00.wav'
      ]
    )
  , bars = 4
  , barLength = 4
  , beats = bars * barLength
  , audioSrc = 'TR808WAV'
  , samples = {}


window.addEventListener('load', function (e) {
  var socketId
    , sequencerContainer = document.querySelector('.sequencer')
    , clock = Scheduler(ac, { ee: ee, bpm: initialBpm})
    , sequenceProps = (
        { clock: clock
        , rows: rows
        , beats: beats
        , initialBpm: initialBpm
        }
      )

  machine.on('register-row', function (eventName) {
    loadSample(eventName)

    function loadSample (sampleName) {
      var request = new XMLHttpRequest()
      request.open('GET', audioSrc + '/' + sampleName, true)
      request.responseType = 'arraybuffer'
      request.onload = function () {
        ac.decodeAudioData(request.response, function decodeResponse (buffer) {
          samples[eventName] = buffer
        }, onError)
      }
      request.send()
    }
    function onError (err) { throw(err) }
  })

  machine.on('schedule', function (events) {
    events.forEach(function (evt, index) {
      io.emit('glitch', [evt.state, index])
      if (evt.state) setSample(evt.beat, evt.name)
    })
  })
  react.renderComponent(machine(sequenceProps), sequencerContainer)
  io.on('init-ack', function (id) {
    socketId = id
    clock.play()
  })
  io.emit('init')
})

function setSample (time, name) {
  var source = ac.createBufferSource()
  source.buffer = samples[name]
  source.connect(ac.destination)
  source.start(time)
}
