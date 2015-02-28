Sequencer
=========

An educational sequencer for use learning about timing audio visual effects.

Installation
------------

`npm install jl-sequencer`

Usage
-----

A sequencer is instantiated with a handful of properties.

``` javascript
var sequencer = require('jl-sequencer')
  , Scheduler = require('beat-scheduler')
  , ee = require('nee')()

var initialBpm = 120
  , container = document.querySelector('.sequencer')
  , clock = Scheduler(ac, { ee: ee, bpm: initialBpm})
  , props = (
      { beats: 16
      , clock: clock
      , initialBpm: initialBpm
      , rows: rows
      }
    )

react.renderComponent(sequencer(props), container)
```

An example is available by cloning this repo (`git clone https://github.com/joeLepper/jl-sequencer.git`).

Start `gulp` and point your browser at `localhost:3000`.

Properties
----------

- **beats**:
The number of beats in a loop. 16 is a nice round number that gets you 4 bars of 4 beats.

- **clock**:
The sequencer expects a `beat-scheduler` to publish `next-tick` events to it which use time values from the same `AudioContext`. If you can replicate that behavior, anything emits that event on the shared event emitter ought to do.

- **initialBpm**:
Initial beats per minute for the sequencer to cycle at.

- **rows**:
An array. Each item in the array should be a unique string. The length of this array will determine the number of rows in the sequencer.


Emitted events
--------------

- **schedule [scheduleEventArray]**:
An array of `scheduleEvent` objects is broadcast. Each object has a `name`, `beat`, and `state`. `beat` is a moment in the future that can be used to schedule against an `audioContext`.

- **register-row [name]**
The `register-row` event notifies listeners that a row has been initialized. It somes with a unique string to identify it. This maps to the strings handed in with the initial rows, and can be used to store the name of a file.
