const { curry, flip, compose } = require("ramda");
const config = require("config3");
const visualize = require("micro-visualize");

module.exports = compose(curry, flip)(visualize)(config.NODE_ENV);
