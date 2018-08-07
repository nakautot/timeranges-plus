# timeranges-plus
[![Build Status](https://travis-ci.org/nakautot/timeranges-plus.svg?branch=master)](https://travis-ci.org/nakautot/timeranges-plus)

timeranges-plus is a wrapper for HTML5 Media TimeRanges Interface with the main purpose of providing additional functionalities.

timeranges-plus can be used in browsers or as a Node JS module.

## Usage

### Browsers

Simply include [timeranges-plus.min.js](https://github.com/nakautot/timeranges-plus/releases/download/1.2.0/timeranges-plus.min.js) on your page.

### Node JS

Install latest released version:

```bash
    npm install timeranges-plus
```

A simple Node JS code example using timeranges-plus:

```javascript
    var Trp = require('timeranges-plus');
    var trpInstance = new Trp();

    trpInstance.add(0,10);
    trpInstance.add(20,30);
    trpInstance.toString();
```

### Instantiate

Basic
```javascript
    var Trp = require('timeranges-plus');
    var trpInstance = new Trp();
```
With initial range
```javascript
    var Trp = require('timeranges-plus');
    var trpInstance = new Trp(startValue, endValue);
```
From HTML 5 Media Timeranges
```javascript
    var Trp = require('timeranges-plus');
    var trpInstance = Trp.wrap(html5MediaTimeranges);
```

### Populate

Basic
```javascript
    var Trp = require('timeranges-plus');
    var trpInstance = new Trp();

    trpInstance.add(startValue, endValue);
```
During instantiation
```javascript
    var Trp = require('timeranges-plus');
    var trpInstance = new Trp(startValue, endValue);
```
Combining other timeranges
```javascript
    var Trp = require('timeranges-plus');
    var trpInstance = new Trp();

    trpInstance.merge(timeranges)
```

### Display
String
```javascript
    var Trp = require('timeranges-plus');
    var trpInstance = new Trp();

    trpInstance.toString();
```
Duration
```javascript
    var Trp = require('timeranges-plus');
    var trpInstance = new Trp();

    trpInstance.toDuration();
```

### Under the hood

Auto-sort
```javascript
    var Trp = require('timeranges-plus');
    var trpInstance = new Trp();

    trpInstance.add(20,30);
    trpInstance.add(0,10);
    trpInstance.toString(); // yields: [[0,10],[20,30]]
```
Auto-overlap
```javascript
    var Trp = require('timeranges-plus');
    var trpInstance1 = new Trp();
    var trpInstance2 = new Trp(5,25);

    trpInstance1.add(0,10);
    trpInstance1.add(20,30);
    trpInstance1.add(40,50);
    trpInstance1.merge(trpInstance2);

    trpInstance1.toString(); // yields: [[0,30],[40,50]]
```

### Transporting
```javascript
    var trpInstance1 = new Trp();
    trpInstance1.add(0, 10);
    trpInstance1.add(40, 50);
    trpInstance1.add(20, 30);

    var trpInstance2 = Trp.unpack(trpInstance1.pack());
```

## Development environment

Linux or similar is assumed.

### Dependencies

* Node JS
* mocha (for tests)
* eslint (for linting)
* uglifyjs (for builds)

### Unit tests

```bash
    npm test
```

### Linting

```bash
    npm run lint
```

### Packaging

```bash
    npm run build
```