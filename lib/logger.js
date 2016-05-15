'use strict';

let log = console.log.bind(console);

module.exports = {
    debug: log,
    info: log,
    warn: console.warn.bind(console),
    err: console.error.bind(console),
    error: console.error.bind(console)
};
