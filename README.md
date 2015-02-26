Sequencer
=========

An educational sequencer for use learning about timing audio visual effects.

TODO BEFORE PUBLISHING
----------------------

This sequencer probably shouldn't know about how to play a sample, It should just listen to ticks and turn them into beats. A beat event should probably publish an array which lists booleans for each sample or glitch to invoke.

Installation
------------

`npm install jl-sequencer`

Usage
-----

A sequencer is instantiated with a handful of properties.

``` javascript
var sequencer = require('jl-sequencer')
  , Scheduler = require('beat-scheduler')
  , socket = require('socket.io-client')
  , ee = require('nee')()

var initialBpm = 120
  , container = document.querySelector('.sequencer')
  , io = socket()
  , ac = new AudioContext()
  , clock = Scheduler(ac, { ee: ee, bpm: initialBpm})
  , props = (
      { ac: ac
      , audioSrc: 'TR808WAV'
      , beats: 16
      , clock: clock
      , ee: ee
      , initialBpm: initialBpm
      , io: io
      , rows: rows
      }
    )

react.renderComponent(sequencer(props), container)
```

Properties
----------

- **ac**: 
A new `AudioContext` object which is used to time and - if this is an audio sequencer - play samples.

- **audioSrc (optional)**: 
A string indicating the directory from which samples should be fetched. If this isn't an audio sequencer, leave this undefined.

- **beats**: 
The number of beats in a loop. 16 is a nice round number that gets you 4 bars of 4 beats.

- **clock**: 
The sequencer expects a `beat-scheduler` to publish `next-tick` events to it which use time values from the same `AudioContext`. If you can replicate that behavior, anything emits that event on the shared event emitter ought to do.

- **ee**: 
An event emitter. This is the main mode of communication between the clock and the sequencer. In a future version we should probably just make the clock emit these events directly.

- **initialBpm**: 
Initial beats per minute for the sequencer to cycle at.

- **io**: 
A socket for communication between the sequencer and its child pages. See more about how the socket and a sequencer's child pages work below.

- **rows**: 
An array. Each item in the array should be the name of a sample. These will be the files that the sequencer tries to fetch from the `audioSrc`. The length of this array will determine the number of rows in the sequencer.

Sockets
-------

Each sequencer reserves its own channel in socket and displays that to the user via a GUID.

Upon instantiation the sequencer will emit an `init` event. The server should respond with an `init-ack` acknowledgement. That acknowledgement should transmit the sequencer's GUID. Child pages can use this GUID to subscribe to the sequencer's events.

Currently the sequencer emits (perhaps poorly-named) `glitch` events on the socket. In the future this should probably just be a `beat` event.

Child pages
-----------

Child pages respond to a sequencer's events. A child page should join a sequencer by publishing a `join-room` event with the proper GUID. After successfully joining a sequencer, the child page will begin receiving (perhaps poorly-named) `glitch` events. See below for more about `glitch` events.

Emitted events
--------------

- **init**: 
Published upon initialization of a sequencer. Really gets the ball rolling, y'know.

- **glitch [activate, index]**: 
`activate` or de`activate` the glitch at `index`, child.

Subscribed events
-----------------

- **init-ack [guid]**: 
The server acknowledges that the sequencer has successfully created the room represented by `guid`. Child pages may subscribe to it there.
