"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _BackgroundDef = require("./BackgroundDef");

var _BackgroundDef2 = _interopRequireDefault(_BackgroundDef);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hexRatio = 0.868217054;
var numSides = 6;
var centerAng = 2 * Math.PI / numSides;

var bgIndex = 0;

function round(num) {
  return Number(num.toFixed(3));
}

function toRadians(degs) {
  return Math.PI * degs / 180;
}

function getPoints(props, offset) {
  var cy = props.diagonal / 2;
  var cx = props.diagonal * hexRatio / 2;

  var startAng = toRadians(90);
  var radius = cy;

  var vertex = [];
  for (var i = 0; i < numSides; i++) {
    var ang = startAng + i * centerAng;
    vertex.push([offset / 2 + cx + radius * Math.cos(ang), // X
    offset / 1.5 + cy - radius * Math.sin(ang)] // Y
    );
  }

  return vertex.map(function (point) {
    return point.map(round);
  });
}

function getFlatTopPoints(props, offset) {
  var y = props.diagonal / 2;
  var cx = hexRatio * props.diagonal / 2;
  var x = cx + (y - cx);
  var radius = y;

  var cos = 0.866 * radius;
  var sin = 0.5 * radius;

  return [[x - sin, y - cos], [x + sin, y - cos], [x + radius, y], [x + sin, y + cos], [x - sin, y + cos], [x - radius, y]].map(function (point) {
    return point.map(round);
  });
}

function defaults(defs, usr) {
  var target = {};

  for (var key in usr) {
    if (usr.hasOwnProperty(key)) {
      target[key] = usr[key];
    }
  }

  for (var _key in defs) {
    if (typeof target[_key] === "undefined" && defs.hasOwnProperty(_key)) {
      target[_key] = defs[_key];
    }
  }

  return target;
}

function substractMinBounds(extremes) {
  return {
    maxX: extremes.maxX - extremes.minX,
    maxY: extremes.maxY - extremes.minY,
    minX: extremes.minX,
    minY: extremes.minY
  };
}

function getBackgroundId() {
  return "bg-" + ++bgIndex;
}

function Hexagon(props) {
  var bgId = props.backgroundImage && getBackgroundId();
  var polyStyle = defaults({
    fill: props.backgroundImage ? "url(#" + bgId + ")" : "none",
    stroke: "#42873f",
    strokeWidth: props.diagonal * 0.02,
    cursor: props.onClick && "pointer"
  }, props.style);

  var baseBounds = {
    maxX: -Infinity,
    maxY: -Infinity,
    minX: +Infinity,
    minY: +Infinity
  };

  var offset = polyStyle.strokeWidth;
  var halfStroke = Math.ceil(offset / 2);
  var points = props.flatTop ? getFlatTopPoints(props, offset) : getPoints(props, offset);
  var bounds = substractMinBounds(points.reduce(reduceBounds, baseBounds));
  var viewBox = [bounds.minX, bounds.minY, bounds.maxX + (bounds.minX < 0 ? Math.abs(bounds.minX) : 0), bounds.maxY + (bounds.minY < 0 ? Math.abs(bounds.minY) : 0)].join(" ");

  var polygon = _react2.default.createElement("polygon", _extends({}, props.hexProps, {
    onClick: props.onClick,
    style: polyStyle,
    points: points.map(function (point) {
      return point.join(",");
    }).join(" ")
  }));

  var anchor = props.href && _react2.default.createElement(
    "a",
    { xlinkHref: props.href, target: props.target },
    polygon
  );

  return _react2.default.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      version: "1.1",
      className: props.className,
      viewBox: viewBox
    },
    props.backgroundImage && _react2.default.createElement(_BackgroundDef2.default, _extends({ id: bgId }, props)),
    anchor || polygon,
    props.children
  );

  function reduceBounds(extremes, point) {
    return {
      maxX: Math.ceil(Math.max(extremes.maxX, point[0] + halfStroke)),
      maxY: Math.ceil(Math.max(extremes.maxY, point[1] + halfStroke)),
      minX: Math.floor(Math.min(extremes.minX, point[0] - halfStroke)),
      minY: Math.floor(Math.min(extremes.minY, point[1] - halfStroke))
    };
  }
}

Hexagon.propTypes = {
  diagonal: _propTypes.number,
  className: _propTypes.string,
  onClick: _propTypes.func,
  href: _propTypes.string,
  target: _propTypes.string,
  flatTop: _propTypes.bool,
  backgroundImage: _propTypes.string,
  backgroundWidth: _propTypes.number,
  backgroundHeight: _propTypes.number,
  backgroundScale: _propTypes.number,
  backgroundSize: _propTypes.number,
  backgroundClasses: _propTypes.string,
  hexProps: _propTypes.object,
  style: _propTypes.object,
  children: _propTypes.node
};

Hexagon.defaultProps = {
  diagonal: 500,
  flatTop: false,
  style: {}
};

exports.default = Hexagon;