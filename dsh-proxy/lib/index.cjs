"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from2, except, desc) => {
  if (from2 && typeof from2 === "object" || typeof from2 === "function") {
    for (let key of __getOwnPropNames(from2))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from2[key], enumerable: !(desc = __getOwnPropDesc(from2, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/.pnpm/eventemitter3@4.0.7/node_modules/eventemitter3/index.js
var require_eventemitter3 = __commonJS({
  "node_modules/.pnpm/eventemitter3@4.0.7/node_modules/eventemitter3/index.js"(exports2, module2) {
    "use strict";
    var has = Object.prototype.hasOwnProperty;
    var prefix = "~";
    function Events() {
    }
    if (Object.create) {
      Events.prototype = /* @__PURE__ */ Object.create(null);
      if (!new Events().__proto__) prefix = false;
    }
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }
    function addListener(emitter, event, fn, context, once) {
      if (typeof fn !== "function") {
        throw new TypeError("The listener must be a function");
      }
      var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
      if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
      else emitter._events[evt] = [emitter._events[evt], listener];
      return emitter;
    }
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0) emitter._events = new Events();
      else delete emitter._events[evt];
    }
    function EventEmitter() {
      this._events = new Events();
      this._eventsCount = 0;
    }
    EventEmitter.prototype.eventNames = function eventNames() {
      var names = [], events, name2;
      if (this._eventsCount === 0) return names;
      for (name2 in events = this._events) {
        if (has.call(events, name2)) names.push(prefix ? name2.slice(1) : name2);
      }
      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }
      return names;
    };
    EventEmitter.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event, handlers = this._events[evt];
      if (!handlers) return [];
      if (handlers.fn) return [handlers.fn];
      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }
      return ee;
    };
    EventEmitter.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event, listeners = this._events[evt];
      if (!listeners) return 0;
      if (listeners.fn) return 1;
      return listeners.length;
    };
    EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt]) return false;
      var listeners = this._events[evt], len = arguments.length, args, i;
      if (listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
        switch (len) {
          case 1:
            return listeners.fn.call(listeners.context), true;
          case 2:
            return listeners.fn.call(listeners.context, a1), true;
          case 3:
            return listeners.fn.call(listeners.context, a1, a2), true;
          case 4:
            return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for (i = 1, args = new Array(len - 1); i < len; i++) {
          args[i - 1] = arguments[i];
        }
        listeners.fn.apply(listeners.context, args);
      } else {
        var length = listeners.length, j;
        for (i = 0; i < length; i++) {
          if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
          switch (len) {
            case 1:
              listeners[i].fn.call(listeners[i].context);
              break;
            case 2:
              listeners[i].fn.call(listeners[i].context, a1);
              break;
            case 3:
              listeners[i].fn.call(listeners[i].context, a1, a2);
              break;
            case 4:
              listeners[i].fn.call(listeners[i].context, a1, a2, a3);
              break;
            default:
              if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
                args[j - 1] = arguments[j];
              }
              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }
      return true;
    };
    EventEmitter.prototype.on = function on(event, fn, context) {
      return addListener(this, event, fn, context, false);
    };
    EventEmitter.prototype.once = function once(event, fn, context) {
      return addListener(this, event, fn, context, true);
    };
    EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt]) return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }
      var listeners = this._events[evt];
      if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
          clearEvent(this, evt);
        }
      } else {
        for (var i = 0, events = [], length = listeners.length; i < length; i++) {
          if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
            events.push(listeners[i]);
          }
        }
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
        else clearEvent(this, evt);
      }
      return this;
    };
    EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;
      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt]) clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }
      return this;
    };
    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
    EventEmitter.prototype.addListener = EventEmitter.prototype.on;
    EventEmitter.prefixed = prefix;
    EventEmitter.EventEmitter = EventEmitter;
    if ("undefined" !== typeof module2) {
      module2.exports = EventEmitter;
    }
  }
});

// node_modules/.pnpm/requires-port@1.0.0/node_modules/requires-port/index.js
var require_requires_port = __commonJS({
  "node_modules/.pnpm/requires-port@1.0.0/node_modules/requires-port/index.js"(exports2, module2) {
    "use strict";
    module2.exports = function required(port, protocol) {
      protocol = protocol.split(":")[0];
      port = +port;
      if (!port) return false;
      switch (protocol) {
        case "http":
        case "ws":
          return port !== 80;
        case "https":
        case "wss":
          return port !== 443;
        case "ftp":
          return port !== 21;
        case "gopher":
          return port !== 70;
        case "file":
          return false;
      }
      return port !== 0;
    };
  }
});

// node_modules/.pnpm/http-proxy@1.18.1_debug@2.6.9/node_modules/http-proxy/lib/http-proxy/common.js
var require_common = __commonJS({
  "node_modules/.pnpm/http-proxy@1.18.1_debug@2.6.9/node_modules/http-proxy/lib/http-proxy/common.js"(exports2) {
    var common = exports2;
    var url = require("url");
    var extend2 = require("util")._extend;
    var required = require_requires_port();
    var upgradeHeader = /(^|,)\s*upgrade\s*($|,)/i;
    var isSSL = /^https|wss/;
    common.isSSL = isSSL;
    common.setupOutgoing = function(outgoing, options, req, forward) {
      outgoing.port = options[forward || "target"].port || (isSSL.test(options[forward || "target"].protocol) ? 443 : 80);
      [
        "host",
        "hostname",
        "socketPath",
        "pfx",
        "key",
        "passphrase",
        "cert",
        "ca",
        "ciphers",
        "secureProtocol"
      ].forEach(
        function(e) {
          outgoing[e] = options[forward || "target"][e];
        }
      );
      outgoing.method = options.method || req.method;
      outgoing.headers = extend2({}, req.headers);
      if (options.headers) {
        extend2(outgoing.headers, options.headers);
      }
      if (options.auth) {
        outgoing.auth = options.auth;
      }
      if (options.ca) {
        outgoing.ca = options.ca;
      }
      if (isSSL.test(options[forward || "target"].protocol)) {
        outgoing.rejectUnauthorized = typeof options.secure === "undefined" ? true : options.secure;
      }
      outgoing.agent = options.agent || false;
      outgoing.localAddress = options.localAddress;
      if (!outgoing.agent) {
        outgoing.headers = outgoing.headers || {};
        if (typeof outgoing.headers.connection !== "string" || !upgradeHeader.test(outgoing.headers.connection)) {
          outgoing.headers.connection = "close";
        }
      }
      var target = options[forward || "target"];
      var targetPath = target && options.prependPath !== false ? target.path || "" : "";
      var outgoingPath = !options.toProxy ? url.parse(req.url).path || "" : req.url;
      outgoingPath = !options.ignorePath ? outgoingPath : "";
      outgoing.path = common.urlJoin(targetPath, outgoingPath);
      if (options.changeOrigin) {
        outgoing.headers.host = required(outgoing.port, options[forward || "target"].protocol) && !hasPort(outgoing.host) ? outgoing.host + ":" + outgoing.port : outgoing.host;
      }
      return outgoing;
    };
    common.setupSocket = function(socket) {
      socket.setTimeout(0);
      socket.setNoDelay(true);
      socket.setKeepAlive(true, 0);
      return socket;
    };
    common.getPort = function(req) {
      var res = req.headers.host ? req.headers.host.match(/:(\d+)/) : "";
      return res ? res[1] : common.hasEncryptedConnection(req) ? "443" : "80";
    };
    common.hasEncryptedConnection = function(req) {
      return Boolean(req.connection.encrypted || req.connection.pair);
    };
    common.urlJoin = function() {
      var args = Array.prototype.slice.call(arguments), lastIndex = args.length - 1, last = args[lastIndex], lastSegs = last.split("?"), retSegs;
      args[lastIndex] = lastSegs.shift();
      retSegs = [
        args.filter(Boolean).join("/").replace(/\/+/g, "/").replace("http:/", "http://").replace("https:/", "https://")
      ];
      retSegs.push.apply(retSegs, lastSegs);
      return retSegs.join("?");
    };
    common.rewriteCookieProperty = function rewriteCookieProperty(header, config, property2) {
      if (Array.isArray(header)) {
        return header.map(function(headerElement) {
          return rewriteCookieProperty(headerElement, config, property2);
        });
      }
      return header.replace(new RegExp("(;\\s*" + property2 + "=)([^;]+)", "i"), function(match, prefix, previousValue) {
        var newValue;
        if (previousValue in config) {
          newValue = config[previousValue];
        } else if ("*" in config) {
          newValue = config["*"];
        } else {
          return match;
        }
        if (newValue) {
          return prefix + newValue;
        } else {
          return "";
        }
      });
    };
    function hasPort(host) {
      return !!~host.indexOf(":");
    }
  }
});

// node_modules/.pnpm/http-proxy@1.18.1_debug@2.6.9/node_modules/http-proxy/lib/http-proxy/passes/web-outgoing.js
var require_web_outgoing = __commonJS({
  "node_modules/.pnpm/http-proxy@1.18.1_debug@2.6.9/node_modules/http-proxy/lib/http-proxy/passes/web-outgoing.js"(exports2, module2) {
    var url = require("url");
    var common = require_common();
    var redirectRegex = /^201|30(1|2|7|8)$/;
    module2.exports = {
      // <--
      /**
       * If is a HTTP 1.0 request, remove chunk headers
       *
       * @param {ClientRequest} Req Request object
       * @param {IncomingMessage} Res Response object
       * @param {proxyResponse} Res Response object from the proxy request
       *
       * @api private
       */
      removeChunked: function removeChunked(req, res, proxyRes) {
        if (req.httpVersion === "1.0") {
          delete proxyRes.headers["transfer-encoding"];
        }
      },
      /**
       * If is a HTTP 1.0 request, set the correct connection header
       * or if connection header not present, then use `keep-alive`
       *
       * @param {ClientRequest} Req Request object
       * @param {IncomingMessage} Res Response object
       * @param {proxyResponse} Res Response object from the proxy request
       *
       * @api private
       */
      setConnection: function setConnection(req, res, proxyRes) {
        if (req.httpVersion === "1.0") {
          proxyRes.headers.connection = req.headers.connection || "close";
        } else if (req.httpVersion !== "2.0" && !proxyRes.headers.connection) {
          proxyRes.headers.connection = req.headers.connection || "keep-alive";
        }
      },
      setRedirectHostRewrite: function setRedirectHostRewrite(req, res, proxyRes, options) {
        if ((options.hostRewrite || options.autoRewrite || options.protocolRewrite) && proxyRes.headers["location"] && redirectRegex.test(proxyRes.statusCode)) {
          var target = url.parse(options.target);
          var u = url.parse(proxyRes.headers["location"]);
          if (target.host != u.host) {
            return;
          }
          if (options.hostRewrite) {
            u.host = options.hostRewrite;
          } else if (options.autoRewrite) {
            u.host = req.headers["host"];
          }
          if (options.protocolRewrite) {
            u.protocol = options.protocolRewrite;
          }
          proxyRes.headers["location"] = u.format();
        }
      },
      /**
       * Copy headers from proxyResponse to response
       * set each header in response object.
       *
       * @param {ClientRequest} Req Request object
       * @param {IncomingMessage} Res Response object
       * @param {proxyResponse} Res Response object from the proxy request
       * @param {Object} Options options.cookieDomainRewrite: Config to rewrite cookie domain
       *
       * @api private
       */
      writeHeaders: function writeHeaders(req, res, proxyRes, options) {
        var rewriteCookieDomainConfig = options.cookieDomainRewrite, rewriteCookiePathConfig = options.cookiePathRewrite, preserveHeaderKeyCase = options.preserveHeaderKeyCase, rawHeaderKeyMap, setHeader = function(key2, header) {
          if (header == void 0) return;
          if (rewriteCookieDomainConfig && key2.toLowerCase() === "set-cookie") {
            header = common.rewriteCookieProperty(header, rewriteCookieDomainConfig, "domain");
          }
          if (rewriteCookiePathConfig && key2.toLowerCase() === "set-cookie") {
            header = common.rewriteCookieProperty(header, rewriteCookiePathConfig, "path");
          }
          res.setHeader(String(key2).trim(), header);
        };
        if (typeof rewriteCookieDomainConfig === "string") {
          rewriteCookieDomainConfig = { "*": rewriteCookieDomainConfig };
        }
        if (typeof rewriteCookiePathConfig === "string") {
          rewriteCookiePathConfig = { "*": rewriteCookiePathConfig };
        }
        if (preserveHeaderKeyCase && proxyRes.rawHeaders != void 0) {
          rawHeaderKeyMap = {};
          for (var i = 0; i < proxyRes.rawHeaders.length; i += 2) {
            var key = proxyRes.rawHeaders[i];
            rawHeaderKeyMap[key.toLowerCase()] = key;
          }
        }
        Object.keys(proxyRes.headers).forEach(function(key2) {
          var header = proxyRes.headers[key2];
          if (preserveHeaderKeyCase && rawHeaderKeyMap) {
            key2 = rawHeaderKeyMap[key2] || key2;
          }
          setHeader(key2, header);
        });
      },
      /**
       * Set the statusCode from the proxyResponse
       *
       * @param {ClientRequest} Req Request object
       * @param {IncomingMessage} Res Response object
       * @param {proxyResponse} Res Response object from the proxy request
       *
       * @api private
       */
      writeStatusCode: function writeStatusCode(req, res, proxyRes) {
        if (proxyRes.statusMessage) {
          res.statusCode = proxyRes.statusCode;
          res.statusMessage = proxyRes.statusMessage;
        } else {
          res.statusCode = proxyRes.statusCode;
        }
      }
    };
  }
});

// node_modules/.pnpm/ms@2.0.0/node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/.pnpm/ms@2.0.0/node_modules/ms/index.js"(exports2, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse2(val);
      } else if (type === "number" && isNaN(val) === false) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse2(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      if (ms >= d) {
        return Math.round(ms / d) + "d";
      }
      if (ms >= h) {
        return Math.round(ms / h) + "h";
      }
      if (ms >= m) {
        return Math.round(ms / m) + "m";
      }
      if (ms >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      return plural(ms, d, "day") || plural(ms, h, "hour") || plural(ms, m, "minute") || plural(ms, s, "second") || ms + " ms";
    }
    function plural(ms, n, name2) {
      if (ms < n) {
        return;
      }
      if (ms < n * 1.5) {
        return Math.floor(ms / n) + " " + name2;
      }
      return Math.ceil(ms / n) + " " + name2 + "s";
    }
  }
});

// node_modules/.pnpm/debug@2.6.9/node_modules/debug/src/debug.js
var require_debug = __commonJS({
  "node_modules/.pnpm/debug@2.6.9/node_modules/debug/src/debug.js"(exports2, module2) {
    exports2 = module2.exports = createDebug.debug = createDebug["default"] = createDebug;
    exports2.coerce = coerce;
    exports2.disable = disable;
    exports2.enable = enable;
    exports2.enabled = enabled;
    exports2.humanize = require_ms();
    exports2.names = [];
    exports2.skips = [];
    exports2.formatters = {};
    var prevTime;
    function selectColor(namespace) {
      var hash = 0, i;
      for (i in namespace) {
        hash = (hash << 5) - hash + namespace.charCodeAt(i);
        hash |= 0;
      }
      return exports2.colors[Math.abs(hash) % exports2.colors.length];
    }
    function createDebug(namespace) {
      function debug() {
        if (!debug.enabled) return;
        var self = debug;
        var curr = +/* @__PURE__ */ new Date();
        var ms = curr - (prevTime || curr);
        self.diff = ms;
        self.prev = prevTime;
        self.curr = curr;
        prevTime = curr;
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        args[0] = exports2.coerce(args[0]);
        if ("string" !== typeof args[0]) {
          args.unshift("%O");
        }
        var index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
          if (match === "%%") return match;
          index++;
          var formatter = exports2.formatters[format];
          if ("function" === typeof formatter) {
            var val = args[index];
            match = formatter.call(self, val);
            args.splice(index, 1);
            index--;
          }
          return match;
        });
        exports2.formatArgs.call(self, args);
        var logFn = debug.log || exports2.log || console.log.bind(console);
        logFn.apply(self, args);
      }
      debug.namespace = namespace;
      debug.enabled = exports2.enabled(namespace);
      debug.useColors = exports2.useColors();
      debug.color = selectColor(namespace);
      if ("function" === typeof exports2.init) {
        exports2.init(debug);
      }
      return debug;
    }
    function enable(namespaces) {
      exports2.save(namespaces);
      exports2.names = [];
      exports2.skips = [];
      var split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
      var len = split.length;
      for (var i = 0; i < len; i++) {
        if (!split[i]) continue;
        namespaces = split[i].replace(/\*/g, ".*?");
        if (namespaces[0] === "-") {
          exports2.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
        } else {
          exports2.names.push(new RegExp("^" + namespaces + "$"));
        }
      }
    }
    function disable() {
      exports2.enable("");
    }
    function enabled(name2) {
      var i, len;
      for (i = 0, len = exports2.skips.length; i < len; i++) {
        if (exports2.skips[i].test(name2)) {
          return false;
        }
      }
      for (i = 0, len = exports2.names.length; i < len; i++) {
        if (exports2.names[i].test(name2)) {
          return true;
        }
      }
      return false;
    }
    function coerce(val) {
      if (val instanceof Error) return val.stack || val.message;
      return val;
    }
  }
});

// node_modules/.pnpm/debug@2.6.9/node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/.pnpm/debug@2.6.9/node_modules/debug/src/browser.js"(exports2, module2) {
    exports2 = module2.exports = require_debug();
    exports2.log = log;
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.storage = "undefined" != typeof chrome && "undefined" != typeof chrome.storage ? chrome.storage.local : localstorage();
    exports2.colors = [
      "lightseagreen",
      "forestgreen",
      "goldenrod",
      "dodgerblue",
      "darkorchid",
      "crimson"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && window.process.type === "renderer") {
        return true;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    exports2.formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (err) {
        return "[UnexpectedJSONParseError]: " + err.message;
      }
    };
    function formatArgs(args) {
      var useColors2 = this.useColors;
      args[0] = (useColors2 ? "%c" : "") + this.namespace + (useColors2 ? " %c" : " ") + args[0] + (useColors2 ? "%c " : " ") + "+" + exports2.humanize(this.diff);
      if (!useColors2) return;
      var c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      var index = 0;
      var lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, function(match) {
        if ("%%" === match) return;
        index++;
        if ("%c" === match) {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    function log() {
      return "object" === typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments);
    }
    function save(namespaces) {
      try {
        if (null == namespaces) {
          exports2.storage.removeItem("debug");
        } else {
          exports2.storage.debug = namespaces;
        }
      } catch (e) {
      }
    }
    function load() {
      var r;
      try {
        r = exports2.storage.debug;
      } catch (e) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    exports2.enable(load());
    function localstorage() {
      try {
        return window.localStorage;
      } catch (e) {
      }
    }
  }
});

// node_modules/.pnpm/debug@2.6.9/node_modules/debug/src/node.js
var require_node = __commonJS({
  "node_modules/.pnpm/debug@2.6.9/node_modules/debug/src/node.js"(exports2, module2) {
    var tty = require("tty");
    var util = require("util");
    exports2 = module2.exports = require_debug();
    exports2.init = init;
    exports2.log = log;
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.colors = [6, 2, 3, 4, 5, 1];
    exports2.inspectOpts = Object.keys(process.env).filter(function(key) {
      return /^debug_/i.test(key);
    }).reduce(function(obj, key) {
      var prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, function(_, k) {
        return k.toUpperCase();
      });
      var val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
      else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
      else if (val === "null") val = null;
      else val = Number(val);
      obj[prop] = val;
      return obj;
    }, {});
    var fd = parseInt(process.env.DEBUG_FD, 10) || 2;
    if (1 !== fd && 2 !== fd) {
      util.deprecate(function() {
      }, "except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)")();
    }
    var stream = 1 === fd ? process.stdout : 2 === fd ? process.stderr : createWritableStdioStream(fd);
    function useColors() {
      return "colors" in exports2.inspectOpts ? Boolean(exports2.inspectOpts.colors) : tty.isatty(fd);
    }
    exports2.formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map(function(str) {
        return str.trim();
      }).join(" ");
    };
    exports2.formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
    function formatArgs(args) {
      var name2 = this.namespace;
      var useColors2 = this.useColors;
      if (useColors2) {
        var c = this.color;
        var prefix = "  \x1B[3" + c + ";1m" + name2 + " \x1B[0m";
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push("\x1B[3" + c + "m+" + exports2.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = (/* @__PURE__ */ new Date()).toUTCString() + " " + name2 + " " + args[0];
      }
    }
    function log() {
      return stream.write(util.format.apply(util, arguments) + "\n");
    }
    function save(namespaces) {
      if (null == namespaces) {
        delete process.env.DEBUG;
      } else {
        process.env.DEBUG = namespaces;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function createWritableStdioStream(fd2) {
      var stream2;
      var tty_wrap = process.binding("tty_wrap");
      switch (tty_wrap.guessHandleType(fd2)) {
        case "TTY":
          stream2 = new tty.WriteStream(fd2);
          stream2._type = "tty";
          if (stream2._handle && stream2._handle.unref) {
            stream2._handle.unref();
          }
          break;
        case "FILE":
          var fs = require("fs");
          stream2 = new fs.SyncWriteStream(fd2, { autoClose: false });
          stream2._type = "fs";
          break;
        case "PIPE":
        case "TCP":
          var net = require("net");
          stream2 = new net.Socket({
            fd: fd2,
            readable: false,
            writable: true
          });
          stream2.readable = false;
          stream2.read = null;
          stream2._type = "pipe";
          if (stream2._handle && stream2._handle.unref) {
            stream2._handle.unref();
          }
          break;
        default:
          throw new Error("Implement me. Unknown stream file type!");
      }
      stream2.fd = fd2;
      stream2._isStdio = true;
      return stream2;
    }
    function init(debug) {
      debug.inspectOpts = {};
      var keys = Object.keys(exports2.inspectOpts);
      for (var i = 0; i < keys.length; i++) {
        debug.inspectOpts[keys[i]] = exports2.inspectOpts[keys[i]];
      }
    }
    exports2.enable(load());
  }
});

// node_modules/.pnpm/debug@2.6.9/node_modules/debug/src/index.js
var require_src = __commonJS({
  "node_modules/.pnpm/debug@2.6.9/node_modules/debug/src/index.js"(exports2, module2) {
    if (typeof process !== "undefined" && process.type === "renderer") {
      module2.exports = require_browser();
    } else {
      module2.exports = require_node();
    }
  }
});

// node_modules/.pnpm/follow-redirects@1.16.0_debug@2.6.9/node_modules/follow-redirects/debug.js
var require_debug2 = __commonJS({
  "node_modules/.pnpm/follow-redirects@1.16.0_debug@2.6.9/node_modules/follow-redirects/debug.js"(exports2, module2) {
    var debug;
    module2.exports = function() {
      if (!debug) {
        try {
          debug = require_src()("follow-redirects");
        } catch (error) {
        }
        if (typeof debug !== "function") {
          debug = function() {
          };
        }
      }
      debug.apply(null, arguments);
    };
  }
});

// node_modules/.pnpm/follow-redirects@1.16.0_debug@2.6.9/node_modules/follow-redirects/index.js
var require_follow_redirects = __commonJS({
  "node_modules/.pnpm/follow-redirects@1.16.0_debug@2.6.9/node_modules/follow-redirects/index.js"(exports2, module2) {
    var url = require("url");
    var URL2 = url.URL;
    var http2 = require("http");
    var https = require("https");
    var Writable = require("stream").Writable;
    var assert = require("assert");
    var debug = require_debug2();
    (function detectUnsupportedEnvironment() {
      var looksLikeNode = typeof process !== "undefined";
      var looksLikeBrowser = typeof window !== "undefined" && typeof document !== "undefined";
      var looksLikeV8 = isFunction(Error.captureStackTrace);
      if (!looksLikeNode && (looksLikeBrowser || !looksLikeV8)) {
        console.warn("The follow-redirects package should be excluded from browser builds.");
      }
    })();
    var useNativeURL = false;
    try {
      assert(new URL2(""));
    } catch (error) {
      useNativeURL = error.code === "ERR_INVALID_URL";
    }
    var sensitiveHeaders = [
      "Authorization",
      "Proxy-Authorization",
      "Cookie"
    ];
    var preservedUrlFields = [
      "auth",
      "host",
      "hostname",
      "href",
      "path",
      "pathname",
      "port",
      "protocol",
      "query",
      "search",
      "hash"
    ];
    var events = ["abort", "aborted", "connect", "error", "socket", "timeout"];
    var eventHandlers = /* @__PURE__ */ Object.create(null);
    events.forEach(function(event) {
      eventHandlers[event] = function(arg1, arg2, arg3) {
        this._redirectable.emit(event, arg1, arg2, arg3);
      };
    });
    var InvalidUrlError = createErrorType(
      "ERR_INVALID_URL",
      "Invalid URL",
      TypeError
    );
    var RedirectionError = createErrorType(
      "ERR_FR_REDIRECTION_FAILURE",
      "Redirected request failed"
    );
    var TooManyRedirectsError = createErrorType(
      "ERR_FR_TOO_MANY_REDIRECTS",
      "Maximum number of redirects exceeded",
      RedirectionError
    );
    var MaxBodyLengthExceededError = createErrorType(
      "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
      "Request body larger than maxBodyLength limit"
    );
    var WriteAfterEndError = createErrorType(
      "ERR_STREAM_WRITE_AFTER_END",
      "write after end"
    );
    var destroy = Writable.prototype.destroy || noop;
    function RedirectableRequest(options, responseCallback) {
      Writable.call(this);
      this._sanitizeOptions(options);
      this._options = options;
      this._ended = false;
      this._ending = false;
      this._redirectCount = 0;
      this._redirects = [];
      this._requestBodyLength = 0;
      this._requestBodyBuffers = [];
      if (responseCallback) {
        this.on("response", responseCallback);
      }
      var self = this;
      this._onNativeResponse = function(response) {
        try {
          self._processResponse(response);
        } catch (cause) {
          self.emit("error", cause instanceof RedirectionError ? cause : new RedirectionError({ cause }));
        }
      };
      this._headerFilter = new RegExp("^(?:" + sensitiveHeaders.concat(options.sensitiveHeaders).map(escapeRegex).join("|") + ")$", "i");
      this._performRequest();
    }
    RedirectableRequest.prototype = Object.create(Writable.prototype);
    RedirectableRequest.prototype.abort = function() {
      destroyRequest(this._currentRequest);
      this._currentRequest.abort();
      this.emit("abort");
    };
    RedirectableRequest.prototype.destroy = function(error) {
      destroyRequest(this._currentRequest, error);
      destroy.call(this, error);
      return this;
    };
    RedirectableRequest.prototype.write = function(data, encoding, callback) {
      if (this._ending) {
        throw new WriteAfterEndError();
      }
      if (!isString(data) && !isBuffer(data)) {
        throw new TypeError("data should be a string, Buffer or Uint8Array");
      }
      if (isFunction(encoding)) {
        callback = encoding;
        encoding = null;
      }
      if (data.length === 0) {
        if (callback) {
          callback();
        }
        return;
      }
      if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
        this._requestBodyLength += data.length;
        this._requestBodyBuffers.push({ data, encoding });
        this._currentRequest.write(data, encoding, callback);
      } else {
        this.emit("error", new MaxBodyLengthExceededError());
        this.abort();
      }
    };
    RedirectableRequest.prototype.end = function(data, encoding, callback) {
      if (isFunction(data)) {
        callback = data;
        data = encoding = null;
      } else if (isFunction(encoding)) {
        callback = encoding;
        encoding = null;
      }
      if (!data) {
        this._ended = this._ending = true;
        this._currentRequest.end(null, null, callback);
      } else {
        var self = this;
        var currentRequest = this._currentRequest;
        this.write(data, encoding, function() {
          self._ended = true;
          currentRequest.end(null, null, callback);
        });
        this._ending = true;
      }
    };
    RedirectableRequest.prototype.setHeader = function(name2, value) {
      this._options.headers[name2] = value;
      this._currentRequest.setHeader(name2, value);
    };
    RedirectableRequest.prototype.removeHeader = function(name2) {
      delete this._options.headers[name2];
      this._currentRequest.removeHeader(name2);
    };
    RedirectableRequest.prototype.setTimeout = function(msecs, callback) {
      var self = this;
      function destroyOnTimeout(socket) {
        socket.setTimeout(msecs);
        socket.removeListener("timeout", socket.destroy);
        socket.addListener("timeout", socket.destroy);
      }
      function startTimer(socket) {
        if (self._timeout) {
          clearTimeout(self._timeout);
        }
        self._timeout = setTimeout(function() {
          self.emit("timeout");
          clearTimer();
        }, msecs);
        destroyOnTimeout(socket);
      }
      function clearTimer() {
        if (self._timeout) {
          clearTimeout(self._timeout);
          self._timeout = null;
        }
        self.removeListener("abort", clearTimer);
        self.removeListener("error", clearTimer);
        self.removeListener("response", clearTimer);
        self.removeListener("close", clearTimer);
        if (callback) {
          self.removeListener("timeout", callback);
        }
        if (!self.socket) {
          self._currentRequest.removeListener("socket", startTimer);
        }
      }
      if (callback) {
        this.on("timeout", callback);
      }
      if (this.socket) {
        startTimer(this.socket);
      } else {
        this._currentRequest.once("socket", startTimer);
      }
      this.on("socket", destroyOnTimeout);
      this.on("abort", clearTimer);
      this.on("error", clearTimer);
      this.on("response", clearTimer);
      this.on("close", clearTimer);
      return this;
    };
    [
      "flushHeaders",
      "getHeader",
      "setNoDelay",
      "setSocketKeepAlive"
    ].forEach(function(method) {
      RedirectableRequest.prototype[method] = function(a, b) {
        return this._currentRequest[method](a, b);
      };
    });
    ["aborted", "connection", "socket"].forEach(function(property2) {
      Object.defineProperty(RedirectableRequest.prototype, property2, {
        get: function() {
          return this._currentRequest[property2];
        }
      });
    });
    RedirectableRequest.prototype._sanitizeOptions = function(options) {
      if (!options.headers) {
        options.headers = {};
      }
      if (!isArray(options.sensitiveHeaders)) {
        options.sensitiveHeaders = [];
      }
      if (options.host) {
        if (!options.hostname) {
          options.hostname = options.host;
        }
        delete options.host;
      }
      if (!options.pathname && options.path) {
        var searchPos = options.path.indexOf("?");
        if (searchPos < 0) {
          options.pathname = options.path;
        } else {
          options.pathname = options.path.substring(0, searchPos);
          options.search = options.path.substring(searchPos);
        }
      }
    };
    RedirectableRequest.prototype._performRequest = function() {
      var protocol = this._options.protocol;
      var nativeProtocol = this._options.nativeProtocols[protocol];
      if (!nativeProtocol) {
        throw new TypeError("Unsupported protocol " + protocol);
      }
      if (this._options.agents) {
        var scheme = protocol.slice(0, -1);
        this._options.agent = this._options.agents[scheme];
      }
      var request = this._currentRequest = nativeProtocol.request(this._options, this._onNativeResponse);
      request._redirectable = this;
      for (var event of events) {
        request.on(event, eventHandlers[event]);
      }
      this._currentUrl = /^\//.test(this._options.path) ? url.format(this._options) : (
        // When making a request to a proxy, […]
        // a client MUST send the target URI in absolute-form […].
        this._options.path
      );
      if (this._isRedirect) {
        var i = 0;
        var self = this;
        var buffers = this._requestBodyBuffers;
        (function writeNext(error) {
          if (request === self._currentRequest) {
            if (error) {
              self.emit("error", error);
            } else if (i < buffers.length) {
              var buffer = buffers[i++];
              if (!request.finished) {
                request.write(buffer.data, buffer.encoding, writeNext);
              }
            } else if (self._ended) {
              request.end();
            }
          }
        })();
      }
    };
    RedirectableRequest.prototype._processResponse = function(response) {
      var statusCode = response.statusCode;
      if (this._options.trackRedirects) {
        this._redirects.push({
          url: this._currentUrl,
          headers: response.headers,
          statusCode
        });
      }
      var location = response.headers.location;
      if (!location || this._options.followRedirects === false || statusCode < 300 || statusCode >= 400) {
        response.responseUrl = this._currentUrl;
        response.redirects = this._redirects;
        this.emit("response", response);
        this._requestBodyBuffers = [];
        return;
      }
      destroyRequest(this._currentRequest);
      response.destroy();
      if (++this._redirectCount > this._options.maxRedirects) {
        throw new TooManyRedirectsError();
      }
      var requestHeaders;
      var beforeRedirect = this._options.beforeRedirect;
      if (beforeRedirect) {
        requestHeaders = Object.assign({
          // The Host header was set by nativeProtocol.request
          Host: response.req.getHeader("host")
        }, this._options.headers);
      }
      var method = this._options.method;
      if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" || // RFC7231§6.4.4: The 303 (See Other) status code indicates that
      // the server is redirecting the user agent to a different resource […]
      // A user agent can perform a retrieval request targeting that URI
      // (a GET or HEAD request if using HTTP) […]
      statusCode === 303 && !/^(?:GET|HEAD)$/.test(this._options.method)) {
        this._options.method = "GET";
        this._requestBodyBuffers = [];
        removeMatchingHeaders(/^content-/i, this._options.headers);
      }
      var currentHostHeader = removeMatchingHeaders(/^host$/i, this._options.headers);
      var currentUrlParts = parseUrl(this._currentUrl);
      var currentHost = currentHostHeader || currentUrlParts.host;
      var currentUrl = /^\w+:/.test(location) ? this._currentUrl : url.format(Object.assign(currentUrlParts, { host: currentHost }));
      var redirectUrl = resolveUrl(location, currentUrl);
      debug("redirecting to", redirectUrl.href);
      this._isRedirect = true;
      spreadUrlObject(redirectUrl, this._options);
      if (redirectUrl.protocol !== currentUrlParts.protocol && redirectUrl.protocol !== "https:" || redirectUrl.host !== currentHost && !isSubdomain(redirectUrl.host, currentHost)) {
        removeMatchingHeaders(this._headerFilter, this._options.headers);
      }
      if (isFunction(beforeRedirect)) {
        var responseDetails = {
          headers: response.headers,
          statusCode
        };
        var requestDetails = {
          url: currentUrl,
          method,
          headers: requestHeaders
        };
        beforeRedirect(this._options, responseDetails, requestDetails);
        this._sanitizeOptions(this._options);
      }
      this._performRequest();
    };
    function wrap(protocols) {
      var exports3 = {
        maxRedirects: 21,
        maxBodyLength: 10 * 1024 * 1024
      };
      var nativeProtocols = {};
      Object.keys(protocols).forEach(function(scheme) {
        var protocol = scheme + ":";
        var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
        var wrappedProtocol = exports3[scheme] = Object.create(nativeProtocol);
        function request(input, options, callback) {
          if (isURL(input)) {
            input = spreadUrlObject(input);
          } else if (isString(input)) {
            input = spreadUrlObject(parseUrl(input));
          } else {
            callback = options;
            options = validateUrl(input);
            input = { protocol };
          }
          if (isFunction(options)) {
            callback = options;
            options = null;
          }
          options = Object.assign({
            maxRedirects: exports3.maxRedirects,
            maxBodyLength: exports3.maxBodyLength
          }, input, options);
          options.nativeProtocols = nativeProtocols;
          if (!isString(options.host) && !isString(options.hostname)) {
            options.hostname = "::1";
          }
          assert.equal(options.protocol, protocol, "protocol mismatch");
          debug("options", options);
          return new RedirectableRequest(options, callback);
        }
        function get(input, options, callback) {
          var wrappedRequest = wrappedProtocol.request(input, options, callback);
          wrappedRequest.end();
          return wrappedRequest;
        }
        Object.defineProperties(wrappedProtocol, {
          request: { value: request, configurable: true, enumerable: true, writable: true },
          get: { value: get, configurable: true, enumerable: true, writable: true }
        });
      });
      return exports3;
    }
    function noop() {
    }
    function parseUrl(input) {
      var parsed;
      if (useNativeURL) {
        parsed = new URL2(input);
      } else {
        parsed = validateUrl(url.parse(input));
        if (!isString(parsed.protocol)) {
          throw new InvalidUrlError({ input });
        }
      }
      return parsed;
    }
    function resolveUrl(relative, base) {
      return useNativeURL ? new URL2(relative, base) : parseUrl(url.resolve(base, relative));
    }
    function validateUrl(input) {
      if (/^\[/.test(input.hostname) && !/^\[[:0-9a-f]+\]$/i.test(input.hostname)) {
        throw new InvalidUrlError({ input: input.href || input });
      }
      if (/^\[/.test(input.host) && !/^\[[:0-9a-f]+\](:\d+)?$/i.test(input.host)) {
        throw new InvalidUrlError({ input: input.href || input });
      }
      return input;
    }
    function spreadUrlObject(urlObject, target) {
      var spread = target || {};
      for (var key of preservedUrlFields) {
        spread[key] = urlObject[key];
      }
      if (spread.hostname.startsWith("[")) {
        spread.hostname = spread.hostname.slice(1, -1);
      }
      if (spread.port !== "") {
        spread.port = Number(spread.port);
      }
      spread.path = spread.search ? spread.pathname + spread.search : spread.pathname;
      return spread;
    }
    function removeMatchingHeaders(regex, headers) {
      var lastValue;
      for (var header in headers) {
        if (regex.test(header)) {
          lastValue = headers[header];
          delete headers[header];
        }
      }
      return lastValue === null || typeof lastValue === "undefined" ? void 0 : String(lastValue).trim();
    }
    function createErrorType(code, message, baseClass) {
      function CustomError(properties) {
        if (isFunction(Error.captureStackTrace)) {
          Error.captureStackTrace(this, this.constructor);
        }
        Object.assign(this, properties || {});
        this.code = code;
        this.message = this.cause ? message + ": " + this.cause.message : message;
      }
      CustomError.prototype = new (baseClass || Error)();
      Object.defineProperties(CustomError.prototype, {
        constructor: {
          value: CustomError,
          enumerable: false
        },
        name: {
          value: "Error [" + code + "]",
          enumerable: false
        }
      });
      return CustomError;
    }
    function destroyRequest(request, error) {
      for (var event of events) {
        request.removeListener(event, eventHandlers[event]);
      }
      request.on("error", noop);
      request.destroy(error);
    }
    function isSubdomain(subdomain, domain) {
      assert(isString(subdomain) && isString(domain));
      var dot = subdomain.length - domain.length - 1;
      return dot > 0 && subdomain[dot] === "." && subdomain.endsWith(domain);
    }
    function isArray(value) {
      return value instanceof Array;
    }
    function isString(value) {
      return typeof value === "string" || value instanceof String;
    }
    function isFunction(value) {
      return typeof value === "function";
    }
    function isBuffer(value) {
      return typeof value === "object" && "length" in value;
    }
    function isURL(value) {
      return URL2 && value instanceof URL2;
    }
    function escapeRegex(regex) {
      return regex.replace(/[\]\\/()*+?.$]/g, "\\$&");
    }
    module2.exports = wrap({ http: http2, https });
    module2.exports.wrap = wrap;
  }
});

// node_modules/.pnpm/http-proxy@1.18.1_debug@2.6.9/node_modules/http-proxy/lib/http-proxy/passes/web-incoming.js
var require_web_incoming = __commonJS({
  "node_modules/.pnpm/http-proxy@1.18.1_debug@2.6.9/node_modules/http-proxy/lib/http-proxy/passes/web-incoming.js"(exports2, module2) {
    var httpNative = require("http");
    var httpsNative = require("https");
    var web_o = require_web_outgoing();
    var common = require_common();
    var followRedirects = require_follow_redirects();
    web_o = Object.keys(web_o).map(function(pass) {
      return web_o[pass];
    });
    var nativeAgents = { http: httpNative, https: httpsNative };
    module2.exports = {
      /**
       * Sets `content-length` to '0' if request is of DELETE type.
       *
       * @param {ClientRequest} Req Request object
       * @param {IncomingMessage} Res Response object
       * @param {Object} Options Config object passed to the proxy
       *
       * @api private
       */
      deleteLength: function deleteLength(req, res, options) {
        if ((req.method === "DELETE" || req.method === "OPTIONS") && !req.headers["content-length"]) {
          req.headers["content-length"] = "0";
          delete req.headers["transfer-encoding"];
        }
      },
      /**
       * Sets timeout in request socket if it was specified in options.
       *
       * @param {ClientRequest} Req Request object
       * @param {IncomingMessage} Res Response object
       * @param {Object} Options Config object passed to the proxy
       *
       * @api private
       */
      timeout: function timeout(req, res, options) {
        if (options.timeout) {
          req.socket.setTimeout(options.timeout);
        }
      },
      /**
       * Sets `x-forwarded-*` headers if specified in config.
       *
       * @param {ClientRequest} Req Request object
       * @param {IncomingMessage} Res Response object
       * @param {Object} Options Config object passed to the proxy
       *
       * @api private
       */
      XHeaders: function XHeaders(req, res, options) {
        if (!options.xfwd) return;
        var encrypted = req.isSpdy || common.hasEncryptedConnection(req);
        var values = {
          for: req.connection.remoteAddress || req.socket.remoteAddress,
          port: common.getPort(req),
          proto: encrypted ? "https" : "http"
        };
        ["for", "port", "proto"].forEach(function(header) {
          req.headers["x-forwarded-" + header] = (req.headers["x-forwarded-" + header] || "") + (req.headers["x-forwarded-" + header] ? "," : "") + values[header];
        });
        req.headers["x-forwarded-host"] = req.headers["x-forwarded-host"] || req.headers["host"] || "";
      },
      /**
       * Does the actual proxying. If `forward` is enabled fires up
       * a ForwardStream, same happens for ProxyStream. The request
       * just dies otherwise.
       *
       * @param {ClientRequest} Req Request object
       * @param {IncomingMessage} Res Response object
       * @param {Object} Options Config object passed to the proxy
       *
       * @api private
       */
      stream: function stream(req, res, options, _, server, clb) {
        server.emit("start", req, res, options.target || options.forward);
        var agents = options.followRedirects ? followRedirects : nativeAgents;
        var http2 = agents.http;
        var https = agents.https;
        if (options.forward) {
          var forwardReq = (options.forward.protocol === "https:" ? https : http2).request(
            common.setupOutgoing(options.ssl || {}, options, req, "forward")
          );
          var forwardError = createErrorHandler(forwardReq, options.forward);
          req.on("error", forwardError);
          forwardReq.on("error", forwardError);
          (options.buffer || req).pipe(forwardReq);
          if (!options.target) {
            return res.end();
          }
        }
        var proxyReq = (options.target.protocol === "https:" ? https : http2).request(
          common.setupOutgoing(options.ssl || {}, options, req)
        );
        proxyReq.on("socket", function(socket) {
          if (server && !proxyReq.getHeader("expect")) {
            server.emit("proxyReq", proxyReq, req, res, options);
          }
        });
        if (options.proxyTimeout) {
          proxyReq.setTimeout(options.proxyTimeout, function() {
            proxyReq.abort();
          });
        }
        req.on("aborted", function() {
          proxyReq.abort();
        });
        var proxyError = createErrorHandler(proxyReq, options.target);
        req.on("error", proxyError);
        proxyReq.on("error", proxyError);
        function createErrorHandler(proxyReq2, url) {
          return function proxyError2(err) {
            if (req.socket.destroyed && err.code === "ECONNRESET") {
              server.emit("econnreset", err, req, res, url);
              return proxyReq2.abort();
            }
            if (clb) {
              clb(err, req, res, url);
            } else {
              server.emit("error", err, req, res, url);
            }
          };
        }
        (options.buffer || req).pipe(proxyReq);
        proxyReq.on("response", function(proxyRes) {
          if (server) {
            server.emit("proxyRes", proxyRes, req, res);
          }
          if (!res.headersSent && !options.selfHandleResponse) {
            for (var i = 0; i < web_o.length; i++) {
              if (web_o[i](req, res, proxyRes, options)) {
                break;
              }
            }
          }
          if (!res.finished) {
            proxyRes.on("end", function() {
              if (server) server.emit("end", req, res, proxyRes);
            });
            if (!options.selfHandleResponse) proxyRes.pipe(res);
          } else {
            if (server) server.emit("end", req, res, proxyRes);
          }
        });
      }
    };
  }
});

// node_modules/.pnpm/http-proxy@1.18.1_debug@2.6.9/node_modules/http-proxy/lib/http-proxy/passes/ws-incoming.js
var require_ws_incoming = __commonJS({
  "node_modules/.pnpm/http-proxy@1.18.1_debug@2.6.9/node_modules/http-proxy/lib/http-proxy/passes/ws-incoming.js"(exports2, module2) {
    var http2 = require("http");
    var https = require("https");
    var common = require_common();
    module2.exports = {
      /**
       * WebSocket requests must have the `GET` method and
       * the `upgrade:websocket` header
       *
       * @param {ClientRequest} Req Request object
       * @param {Socket} Websocket
       *
       * @api private
       */
      checkMethodAndHeader: function checkMethodAndHeader(req, socket) {
        if (req.method !== "GET" || !req.headers.upgrade) {
          socket.destroy();
          return true;
        }
        if (req.headers.upgrade.toLowerCase() !== "websocket") {
          socket.destroy();
          return true;
        }
      },
      /**
       * Sets `x-forwarded-*` headers if specified in config.
       *
       * @param {ClientRequest} Req Request object
       * @param {Socket} Websocket
       * @param {Object} Options Config object passed to the proxy
       *
       * @api private
       */
      XHeaders: function XHeaders(req, socket, options) {
        if (!options.xfwd) return;
        var values = {
          for: req.connection.remoteAddress || req.socket.remoteAddress,
          port: common.getPort(req),
          proto: common.hasEncryptedConnection(req) ? "wss" : "ws"
        };
        ["for", "port", "proto"].forEach(function(header) {
          req.headers["x-forwarded-" + header] = (req.headers["x-forwarded-" + header] || "") + (req.headers["x-forwarded-" + header] ? "," : "") + values[header];
        });
      },
      /**
       * Does the actual proxying. Make the request and upgrade it
       * send the Switching Protocols request and pipe the sockets.
       *
       * @param {ClientRequest} Req Request object
       * @param {Socket} Websocket
       * @param {Object} Options Config object passed to the proxy
       *
       * @api private
       */
      stream: function stream(req, socket, options, head, server, clb) {
        var createHttpHeader = function(line, headers) {
          return Object.keys(headers).reduce(function(head2, key) {
            var value = headers[key];
            if (!Array.isArray(value)) {
              head2.push(key + ": " + value);
              return head2;
            }
            for (var i = 0; i < value.length; i++) {
              head2.push(key + ": " + value[i]);
            }
            return head2;
          }, [line]).join("\r\n") + "\r\n\r\n";
        };
        common.setupSocket(socket);
        if (head && head.length) socket.unshift(head);
        var proxyReq = (common.isSSL.test(options.target.protocol) ? https : http2).request(
          common.setupOutgoing(options.ssl || {}, options, req)
        );
        if (server) {
          server.emit("proxyReqWs", proxyReq, req, socket, options, head);
        }
        proxyReq.on("error", onOutgoingError);
        proxyReq.on("response", function(res) {
          if (!res.upgrade) {
            socket.write(createHttpHeader("HTTP/" + res.httpVersion + " " + res.statusCode + " " + res.statusMessage, res.headers));
            res.pipe(socket);
          }
        });
        proxyReq.on("upgrade", function(proxyRes, proxySocket, proxyHead) {
          proxySocket.on("error", onOutgoingError);
          proxySocket.on("end", function() {
            server.emit("close", proxyRes, proxySocket, proxyHead);
          });
          socket.on("error", function() {
            proxySocket.end();
          });
          common.setupSocket(proxySocket);
          if (proxyHead && proxyHead.length) proxySocket.unshift(proxyHead);
          socket.write(createHttpHeader("HTTP/1.1 101 Switching Protocols", proxyRes.headers));
          proxySocket.pipe(socket).pipe(proxySocket);
          server.emit("open", proxySocket);
          server.emit("proxySocket", proxySocket);
        });
        return proxyReq.end();
        function onOutgoingError(err) {
          if (clb) {
            clb(err, req, socket);
          } else {
            server.emit("error", err, req, socket);
          }
          socket.end();
        }
      }
    };
  }
});

// node_modules/.pnpm/http-proxy@1.18.1_debug@2.6.9/node_modules/http-proxy/lib/http-proxy/index.js
var require_http_proxy = __commonJS({
  "node_modules/.pnpm/http-proxy@1.18.1_debug@2.6.9/node_modules/http-proxy/lib/http-proxy/index.js"(exports2, module2) {
    var httpProxy2 = module2.exports;
    var extend2 = require("util")._extend;
    var parse_url = require("url").parse;
    var EE3 = require_eventemitter3();
    var http2 = require("http");
    var https = require("https");
    var web = require_web_incoming();
    var ws = require_ws_incoming();
    httpProxy2.Server = ProxyServer;
    function createRightProxy(type) {
      return function(options) {
        return function(req, res) {
          var passes = type === "ws" ? this.wsPasses : this.webPasses, args = [].slice.call(arguments), cntr = args.length - 1, head, cbl;
          if (typeof args[cntr] === "function") {
            cbl = args[cntr];
            cntr--;
          }
          var requestOptions = options;
          if (!(args[cntr] instanceof Buffer) && args[cntr] !== res) {
            requestOptions = extend2({}, options);
            extend2(requestOptions, args[cntr]);
            cntr--;
          }
          if (args[cntr] instanceof Buffer) {
            head = args[cntr];
          }
          ["target", "forward"].forEach(function(e) {
            if (typeof requestOptions[e] === "string")
              requestOptions[e] = parse_url(requestOptions[e]);
          });
          if (!requestOptions.target && !requestOptions.forward) {
            return this.emit("error", new Error("Must provide a proper URL as target"));
          }
          for (var i = 0; i < passes.length; i++) {
            if (passes[i](req, res, requestOptions, head, this, cbl)) {
              break;
            }
          }
        };
      };
    }
    httpProxy2.createRightProxy = createRightProxy;
    function ProxyServer(options) {
      EE3.call(this);
      options = options || {};
      options.prependPath = options.prependPath === false ? false : true;
      this.web = this.proxyRequest = createRightProxy("web")(options);
      this.ws = this.proxyWebsocketRequest = createRightProxy("ws")(options);
      this.options = options;
      this.webPasses = Object.keys(web).map(function(pass) {
        return web[pass];
      });
      this.wsPasses = Object.keys(ws).map(function(pass) {
        return ws[pass];
      });
      this.on("error", this.onError, this);
    }
    require("util").inherits(ProxyServer, EE3);
    ProxyServer.prototype.onError = function(err) {
      if (this.listeners("error").length === 1) {
        throw err;
      }
    };
    ProxyServer.prototype.listen = function(port, hostname) {
      var self = this, closure = function(req, res) {
        self.web(req, res);
      };
      this._server = this.options.ssl ? https.createServer(this.options.ssl, closure) : http2.createServer(closure);
      if (this.options.ws) {
        this._server.on("upgrade", function(req, socket, head) {
          self.ws(req, socket, head);
        });
      }
      this._server.listen(port, hostname);
      return this;
    };
    ProxyServer.prototype.close = function(callback) {
      var self = this;
      if (this._server) {
        this._server.close(done);
      }
      function done() {
        self._server = null;
        if (callback) {
          callback.apply(null, arguments);
        }
      }
      ;
    };
    ProxyServer.prototype.before = function(type, passName, callback) {
      if (type !== "ws" && type !== "web") {
        throw new Error("type must be `web` or `ws`");
      }
      var passes = type === "ws" ? this.wsPasses : this.webPasses, i = false;
      passes.forEach(function(v, idx) {
        if (v.name === passName) i = idx;
      });
      if (i === false) throw new Error("No such pass");
      passes.splice(i, 0, callback);
    };
    ProxyServer.prototype.after = function(type, passName, callback) {
      if (type !== "ws" && type !== "web") {
        throw new Error("type must be `web` or `ws`");
      }
      var passes = type === "ws" ? this.wsPasses : this.webPasses, i = false;
      passes.forEach(function(v, idx) {
        if (v.name === passName) i = idx;
      });
      if (i === false) throw new Error("No such pass");
      passes.splice(i++, 0, callback);
    };
  }
});

// node_modules/.pnpm/http-proxy@1.18.1_debug@2.6.9/node_modules/http-proxy/lib/http-proxy.js
var require_http_proxy2 = __commonJS({
  "node_modules/.pnpm/http-proxy@1.18.1_debug@2.6.9/node_modules/http-proxy/lib/http-proxy.js"(exports2, module2) {
    var ProxyServer = require_http_proxy().Server;
    function createProxyServer(options) {
      return new ProxyServer(options);
    }
    ProxyServer.createProxyServer = createProxyServer;
    ProxyServer.createServer = createProxyServer;
    ProxyServer.createProxy = createProxyServer;
    module2.exports = ProxyServer;
  }
});

// node_modules/.pnpm/http-proxy@1.18.1_debug@2.6.9/node_modules/http-proxy/index.js
var require_http_proxy3 = __commonJS({
  "node_modules/.pnpm/http-proxy@1.18.1_debug@2.6.9/node_modules/http-proxy/index.js"(exports2, module2) {
    module2.exports = require_http_proxy2();
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/identity.js
var require_identity = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/identity.js"(exports2) {
    "use strict";
    var ALIAS = /* @__PURE__ */ Symbol.for("yaml.alias");
    var DOC = /* @__PURE__ */ Symbol.for("yaml.document");
    var MAP = /* @__PURE__ */ Symbol.for("yaml.map");
    var PAIR = /* @__PURE__ */ Symbol.for("yaml.pair");
    var SCALAR = /* @__PURE__ */ Symbol.for("yaml.scalar");
    var SEQ = /* @__PURE__ */ Symbol.for("yaml.seq");
    var NODE_TYPE = /* @__PURE__ */ Symbol.for("yaml.node.type");
    var isAlias = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === ALIAS;
    var isDocument = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === DOC;
    var isMap = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === MAP;
    var isPair = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === PAIR;
    var isScalar = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SCALAR;
    var isSeq = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SEQ;
    function isCollection(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case MAP:
          case SEQ:
            return true;
        }
      return false;
    }
    function isNode(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case ALIAS:
          case MAP:
          case SCALAR:
          case SEQ:
            return true;
        }
      return false;
    }
    var hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;
    exports2.ALIAS = ALIAS;
    exports2.DOC = DOC;
    exports2.MAP = MAP;
    exports2.NODE_TYPE = NODE_TYPE;
    exports2.PAIR = PAIR;
    exports2.SCALAR = SCALAR;
    exports2.SEQ = SEQ;
    exports2.hasAnchor = hasAnchor;
    exports2.isAlias = isAlias;
    exports2.isCollection = isCollection;
    exports2.isDocument = isDocument;
    exports2.isMap = isMap;
    exports2.isNode = isNode;
    exports2.isPair = isPair;
    exports2.isScalar = isScalar;
    exports2.isSeq = isSeq;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/visit.js
var require_visit = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/visit.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var BREAK = /* @__PURE__ */ Symbol("break visit");
    var SKIP = /* @__PURE__ */ Symbol("skip children");
    var REMOVE = /* @__PURE__ */ Symbol("remove node");
    function visit(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = visit_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        visit_(null, node, visitor_, Object.freeze([]));
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP;
    visit.REMOVE = REMOVE;
    function visit_(key, node, visitor, path) {
      const ctrl = callVisitor(key, node, visitor, path);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path, ctrl);
        return visit_(key, ctrl, visitor, path);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path = Object.freeze(path.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = visit_(i, node.items[i], visitor, path);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path = Object.freeze(path.concat(node));
          const ck = visit_("key", node.key, visitor, path);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = visit_("value", node.value, visitor, path);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    async function visitAsync(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = await visitAsync_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        await visitAsync_(null, node, visitor_, Object.freeze([]));
    }
    visitAsync.BREAK = BREAK;
    visitAsync.SKIP = SKIP;
    visitAsync.REMOVE = REMOVE;
    async function visitAsync_(key, node, visitor, path) {
      const ctrl = await callVisitor(key, node, visitor, path);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path, ctrl);
        return visitAsync_(key, ctrl, visitor, path);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path = Object.freeze(path.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = await visitAsync_(i, node.items[i], visitor, path);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path = Object.freeze(path.concat(node));
          const ck = await visitAsync_("key", node.key, visitor, path);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = await visitAsync_("value", node.value, visitor, path);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    function initVisitor(visitor) {
      if (typeof visitor === "object" && (visitor.Collection || visitor.Node || visitor.Value)) {
        return Object.assign({
          Alias: visitor.Node,
          Map: visitor.Node,
          Scalar: visitor.Node,
          Seq: visitor.Node
        }, visitor.Value && {
          Map: visitor.Value,
          Scalar: visitor.Value,
          Seq: visitor.Value
        }, visitor.Collection && {
          Map: visitor.Collection,
          Seq: visitor.Collection
        }, visitor);
      }
      return visitor;
    }
    function callVisitor(key, node, visitor, path) {
      if (typeof visitor === "function")
        return visitor(key, node, path);
      if (identity.isMap(node))
        return visitor.Map?.(key, node, path);
      if (identity.isSeq(node))
        return visitor.Seq?.(key, node, path);
      if (identity.isPair(node))
        return visitor.Pair?.(key, node, path);
      if (identity.isScalar(node))
        return visitor.Scalar?.(key, node, path);
      if (identity.isAlias(node))
        return visitor.Alias?.(key, node, path);
      return void 0;
    }
    function replaceNode(key, path, node) {
      const parent = path[path.length - 1];
      if (identity.isCollection(parent)) {
        parent.items[key] = node;
      } else if (identity.isPair(parent)) {
        if (key === "key")
          parent.key = node;
        else
          parent.value = node;
      } else if (identity.isDocument(parent)) {
        parent.contents = node;
      } else {
        const pt = identity.isAlias(parent) ? "alias" : "scalar";
        throw new Error(`Cannot replace node with ${pt} parent`);
      }
    }
    exports2.visit = visit;
    exports2.visitAsync = visitAsync;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/doc/directives.js
var require_directives = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/doc/directives.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var visit = require_visit();
    var escapeChars = {
      "!": "%21",
      ",": "%2C",
      "[": "%5B",
      "]": "%5D",
      "{": "%7B",
      "}": "%7D"
    };
    var escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]);
    var Directives = class _Directives {
      constructor(yaml, tags) {
        this.docStart = null;
        this.docEnd = false;
        this.yaml = Object.assign({}, _Directives.defaultYaml, yaml);
        this.tags = Object.assign({}, _Directives.defaultTags, tags);
      }
      clone() {
        const copy = new _Directives(this.yaml, this.tags);
        copy.docStart = this.docStart;
        return copy;
      }
      /**
       * During parsing, get a Directives instance for the current document and
       * update the stream state according to the current version's spec.
       */
      atDocument() {
        const res = new _Directives(this.yaml, this.tags);
        switch (this.yaml.version) {
          case "1.1":
            this.atNextDocument = true;
            break;
          case "1.2":
            this.atNextDocument = false;
            this.yaml = {
              explicit: _Directives.defaultYaml.explicit,
              version: "1.2"
            };
            this.tags = Object.assign({}, _Directives.defaultTags);
            break;
        }
        return res;
      }
      /**
       * @param onError - May be called even if the action was successful
       * @returns `true` on success
       */
      add(line, onError) {
        if (this.atNextDocument) {
          this.yaml = { explicit: _Directives.defaultYaml.explicit, version: "1.1" };
          this.tags = Object.assign({}, _Directives.defaultTags);
          this.atNextDocument = false;
        }
        const parts = line.trim().split(/[ \t]+/);
        const name2 = parts.shift();
        switch (name2) {
          case "%TAG": {
            if (parts.length !== 2) {
              onError(0, "%TAG directive should contain exactly two parts");
              if (parts.length < 2)
                return false;
            }
            const [handle, prefix] = parts;
            this.tags[handle] = prefix;
            return true;
          }
          case "%YAML": {
            this.yaml.explicit = true;
            if (parts.length !== 1) {
              onError(0, "%YAML directive should contain exactly one part");
              return false;
            }
            const [version] = parts;
            if (version === "1.1" || version === "1.2") {
              this.yaml.version = version;
              return true;
            } else {
              const isValid = /^\d+\.\d+$/.test(version);
              onError(6, `Unsupported YAML version ${version}`, isValid);
              return false;
            }
          }
          default:
            onError(0, `Unknown directive ${name2}`, true);
            return false;
        }
      }
      /**
       * Resolves a tag, matching handles to those defined in %TAG directives.
       *
       * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
       *   `'!local'` tag, or `null` if unresolvable.
       */
      tagName(source, onError) {
        if (source === "!")
          return "!";
        if (source[0] !== "!") {
          onError(`Not a valid tag: ${source}`);
          return null;
        }
        if (source[1] === "<") {
          const verbatim = source.slice(2, -1);
          if (verbatim === "!" || verbatim === "!!") {
            onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
            return null;
          }
          if (source[source.length - 1] !== ">")
            onError("Verbatim tags must end with a >");
          return verbatim;
        }
        const [, handle, suffix] = source.match(/^(.*!)([^!]*)$/s);
        if (!suffix)
          onError(`The ${source} tag has no suffix`);
        const prefix = this.tags[handle];
        if (prefix) {
          try {
            return prefix + decodeURIComponent(suffix);
          } catch (error) {
            onError(String(error));
            return null;
          }
        }
        if (handle === "!")
          return source;
        onError(`Could not resolve tag: ${source}`);
        return null;
      }
      /**
       * Given a fully resolved tag, returns its printable string form,
       * taking into account current tag prefixes and defaults.
       */
      tagString(tag) {
        for (const [handle, prefix] of Object.entries(this.tags)) {
          if (tag.startsWith(prefix))
            return handle + escapeTagName(tag.substring(prefix.length));
        }
        return tag[0] === "!" ? tag : `!<${tag}>`;
      }
      toString(doc) {
        const lines = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [];
        const tagEntries = Object.entries(this.tags);
        let tagNames;
        if (doc && tagEntries.length > 0 && identity.isNode(doc.contents)) {
          const tags = {};
          visit.visit(doc.contents, (_key, node) => {
            if (identity.isNode(node) && node.tag)
              tags[node.tag] = true;
          });
          tagNames = Object.keys(tags);
        } else
          tagNames = [];
        for (const [handle, prefix] of tagEntries) {
          if (handle === "!!" && prefix === "tag:yaml.org,2002:")
            continue;
          if (!doc || tagNames.some((tn) => tn.startsWith(prefix)))
            lines.push(`%TAG ${handle} ${prefix}`);
        }
        return lines.join("\n");
      }
    };
    Directives.defaultYaml = { explicit: false, version: "1.2" };
    Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };
    exports2.Directives = Directives;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/doc/anchors.js
var require_anchors = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/doc/anchors.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var visit = require_visit();
    function anchorIsValid(anchor) {
      if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
        const sa = JSON.stringify(anchor);
        const msg = `Anchor must not contain whitespace or control characters: ${sa}`;
        throw new Error(msg);
      }
      return true;
    }
    function anchorNames(root) {
      const anchors = /* @__PURE__ */ new Set();
      visit.visit(root, {
        Value(_key, node) {
          if (node.anchor)
            anchors.add(node.anchor);
        }
      });
      return anchors;
    }
    function findNewAnchor(prefix, exclude) {
      for (let i = 1; true; ++i) {
        const name2 = `${prefix}${i}`;
        if (!exclude.has(name2))
          return name2;
      }
    }
    function createNodeAnchors(doc, prefix) {
      const aliasObjects = [];
      const sourceObjects = /* @__PURE__ */ new Map();
      let prevAnchors = null;
      return {
        onAnchor: (source) => {
          aliasObjects.push(source);
          prevAnchors ?? (prevAnchors = anchorNames(doc));
          const anchor = findNewAnchor(prefix, prevAnchors);
          prevAnchors.add(anchor);
          return anchor;
        },
        /**
         * With circular references, the source node is only resolved after all
         * of its child nodes are. This is why anchors are set only after all of
         * the nodes have been created.
         */
        setAnchors: () => {
          for (const source of aliasObjects) {
            const ref = sourceObjects.get(source);
            if (typeof ref === "object" && ref.anchor && (identity.isScalar(ref.node) || identity.isCollection(ref.node))) {
              ref.node.anchor = ref.anchor;
            } else {
              const error = new Error("Failed to resolve repeated object (this should not happen)");
              error.source = source;
              throw error;
            }
          }
        },
        sourceObjects
      };
    }
    exports2.anchorIsValid = anchorIsValid;
    exports2.anchorNames = anchorNames;
    exports2.createNodeAnchors = createNodeAnchors;
    exports2.findNewAnchor = findNewAnchor;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/doc/applyReviver.js
var require_applyReviver = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/doc/applyReviver.js"(exports2) {
    "use strict";
    function applyReviver(reviver, obj, key, val) {
      if (val && typeof val === "object") {
        if (Array.isArray(val)) {
          for (let i = 0, len = val.length; i < len; ++i) {
            const v0 = val[i];
            const v1 = applyReviver(reviver, val, String(i), v0);
            if (v1 === void 0)
              delete val[i];
            else if (v1 !== v0)
              val[i] = v1;
          }
        } else if (val instanceof Map) {
          for (const k of Array.from(val.keys())) {
            const v0 = val.get(k);
            const v1 = applyReviver(reviver, val, k, v0);
            if (v1 === void 0)
              val.delete(k);
            else if (v1 !== v0)
              val.set(k, v1);
          }
        } else if (val instanceof Set) {
          for (const v0 of Array.from(val)) {
            const v1 = applyReviver(reviver, val, v0, v0);
            if (v1 === void 0)
              val.delete(v0);
            else if (v1 !== v0) {
              val.delete(v0);
              val.add(v1);
            }
          }
        } else {
          for (const [k, v0] of Object.entries(val)) {
            const v1 = applyReviver(reviver, val, k, v0);
            if (v1 === void 0)
              delete val[k];
            else if (v1 !== v0)
              val[k] = v1;
          }
        }
      }
      return reviver.call(obj, key, val);
    }
    exports2.applyReviver = applyReviver;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/toJS.js
var require_toJS = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/toJS.js"(exports2) {
    "use strict";
    var identity = require_identity();
    function toJS(value, arg, ctx) {
      if (Array.isArray(value))
        return value.map((v, i) => toJS(v, String(i), ctx));
      if (value && typeof value.toJSON === "function") {
        if (!ctx || !identity.hasAnchor(value))
          return value.toJSON(arg, ctx);
        const data = { aliasCount: 0, count: 1, res: void 0 };
        ctx.anchors.set(value, data);
        ctx.onCreate = (res2) => {
          data.res = res2;
          delete ctx.onCreate;
        };
        const res = value.toJSON(arg, ctx);
        if (ctx.onCreate)
          ctx.onCreate(res);
        return res;
      }
      if (typeof value === "bigint" && !ctx?.keep)
        return Number(value);
      return value;
    }
    exports2.toJS = toJS;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/Node.js
var require_Node = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/Node.js"(exports2) {
    "use strict";
    var applyReviver = require_applyReviver();
    var identity = require_identity();
    var toJS = require_toJS();
    var NodeBase = class {
      constructor(type) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: type });
      }
      /** Create a copy of this node.  */
      clone() {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** A plain JavaScript representation of this node. */
      toJS(doc, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        if (!identity.isDocument(doc))
          throw new TypeError("A document argument is required");
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc,
          keep: true,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this, "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
    };
    exports2.NodeBase = NodeBase;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/Alias.js
var require_Alias = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/Alias.js"(exports2) {
    "use strict";
    var anchors = require_anchors();
    var visit = require_visit();
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var Alias = class extends Node.NodeBase {
      constructor(source) {
        super(identity.ALIAS);
        this.source = source;
        Object.defineProperty(this, "tag", {
          set() {
            throw new Error("Alias nodes cannot have tags");
          }
        });
      }
      /**
       * Resolve the value of this alias within `doc`, finding the last
       * instance of the `source` anchor before this node.
       */
      resolve(doc, ctx) {
        if (ctx?.maxAliasCount === 0)
          throw new ReferenceError("Alias resolution is disabled");
        let nodes;
        if (ctx?.aliasResolveCache) {
          nodes = ctx.aliasResolveCache;
        } else {
          nodes = [];
          visit.visit(doc, {
            Node: (_key, node) => {
              if (identity.isAlias(node) || identity.hasAnchor(node))
                nodes.push(node);
            }
          });
          if (ctx)
            ctx.aliasResolveCache = nodes;
        }
        let found = void 0;
        for (const node of nodes) {
          if (node === this)
            break;
          if (node.anchor === this.source)
            found = node;
        }
        if (found && ctx) {
          const { anchors: anchors2, doc: doc2, maxAliasCount } = ctx;
          let data = anchors2.get(found);
          if (!data) {
            toJS.toJS(found, null, ctx);
            data = anchors2.get(found);
          }
          if (data?.res === void 0) {
            const msg = "This should not happen: Alias anchor was not resolved?";
            throw new ReferenceError(msg);
          }
          if (maxAliasCount >= 0) {
            data.count += 1;
            if (data.aliasCount === 0)
              data.aliasCount = getAliasCount(doc2, found, anchors2);
            if (data.count * data.aliasCount > maxAliasCount) {
              const msg = "Excessive alias count indicates a resource exhaustion attack";
              throw new ReferenceError(msg);
            }
          }
        }
        return found;
      }
      toJSON(_arg, ctx) {
        if (!ctx)
          return { source: this.source };
        const source = this.resolve(ctx.doc, ctx);
        if (!source) {
          const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
          throw new ReferenceError(msg);
        }
        return ctx.anchors.get(source).res;
      }
      toString(ctx, _onComment, _onChompKeep) {
        const src = `*${this.source}`;
        if (ctx) {
          anchors.anchorIsValid(this.source);
          if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
            const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
            throw new Error(msg);
          }
          if (ctx.implicitKey)
            return `${src} `;
        }
        return src;
      }
    };
    function getAliasCount(doc, node, anchors2) {
      if (identity.isAlias(node)) {
        const source = node.resolve(doc);
        const anchor = anchors2 && source && anchors2.get(source);
        return anchor ? anchor.count * anchor.aliasCount : 0;
      } else if (identity.isCollection(node)) {
        let count = 0;
        for (const item of node.items) {
          const c = getAliasCount(doc, item, anchors2);
          if (c > count)
            count = c;
        }
        return count;
      } else if (identity.isPair(node)) {
        const kc = getAliasCount(doc, node.key, anchors2);
        const vc = getAliasCount(doc, node.value, anchors2);
        return Math.max(kc, vc);
      }
      return 1;
    }
    exports2.Alias = Alias;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/Scalar.js
var require_Scalar = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/Scalar.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var isScalarValue = (value) => !value || typeof value !== "function" && typeof value !== "object";
    var Scalar = class extends Node.NodeBase {
      constructor(value) {
        super(identity.SCALAR);
        this.value = value;
      }
      toJSON(arg, ctx) {
        return ctx?.keep ? this.value : toJS.toJS(this.value, arg, ctx);
      }
      toString() {
        return String(this.value);
      }
    };
    Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
    Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
    Scalar.PLAIN = "PLAIN";
    Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
    Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";
    exports2.Scalar = Scalar;
    exports2.isScalarValue = isScalarValue;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/doc/createNode.js
var require_createNode = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/doc/createNode.js"(exports2) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var defaultTagPrefix = "tag:yaml.org,2002:";
    function findTagObject(value, tagName, tags) {
      if (tagName) {
        const match = tags.filter((t) => t.tag === tagName);
        const tagObj = match.find((t) => !t.format) ?? match[0];
        if (!tagObj)
          throw new Error(`Tag ${tagName} not found`);
        return tagObj;
      }
      return tags.find((t) => t.identify?.(value) && !t.format);
    }
    function createNode(value, tagName, ctx) {
      if (identity.isDocument(value))
        value = value.contents;
      if (identity.isNode(value))
        return value;
      if (identity.isPair(value)) {
        const map = ctx.schema[identity.MAP].createNode?.(ctx.schema, null, ctx);
        map.items.push(value);
        return map;
      }
      if (value instanceof String || value instanceof Number || value instanceof Boolean || typeof BigInt !== "undefined" && value instanceof BigInt) {
        value = value.valueOf();
      }
      const { aliasDuplicateObjects, onAnchor, onTagObj, schema, sourceObjects } = ctx;
      let ref = void 0;
      if (aliasDuplicateObjects && value && typeof value === "object") {
        ref = sourceObjects.get(value);
        if (ref) {
          ref.anchor ?? (ref.anchor = onAnchor(value));
          return new Alias.Alias(ref.anchor);
        } else {
          ref = { anchor: null, node: null };
          sourceObjects.set(value, ref);
        }
      }
      if (tagName?.startsWith("!!"))
        tagName = defaultTagPrefix + tagName.slice(2);
      let tagObj = findTagObject(value, tagName, schema.tags);
      if (!tagObj) {
        if (value && typeof value.toJSON === "function") {
          value = value.toJSON();
        }
        if (!value || typeof value !== "object") {
          const node2 = new Scalar.Scalar(value);
          if (ref)
            ref.node = node2;
          return node2;
        }
        tagObj = value instanceof Map ? schema[identity.MAP] : Symbol.iterator in Object(value) ? schema[identity.SEQ] : schema[identity.MAP];
      }
      if (onTagObj) {
        onTagObj(tagObj);
        delete ctx.onTagObj;
      }
      const node = tagObj?.createNode ? tagObj.createNode(ctx.schema, value, ctx) : typeof tagObj?.nodeClass?.from === "function" ? tagObj.nodeClass.from(ctx.schema, value, ctx) : new Scalar.Scalar(value);
      if (tagName)
        node.tag = tagName;
      else if (!tagObj.default)
        node.tag = tagObj.tag;
      if (ref)
        ref.node = node;
      return node;
    }
    exports2.createNode = createNode;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/Collection.js
var require_Collection = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/Collection.js"(exports2) {
    "use strict";
    var createNode = require_createNode();
    var identity = require_identity();
    var Node = require_Node();
    function collectionFromPath(schema, path, value) {
      let v = value;
      for (let i = path.length - 1; i >= 0; --i) {
        const k = path[i];
        if (typeof k === "number" && Number.isInteger(k) && k >= 0) {
          const a = [];
          a[k] = v;
          v = a;
        } else {
          v = /* @__PURE__ */ new Map([[k, v]]);
        }
      }
      return createNode.createNode(v, void 0, {
        aliasDuplicateObjects: false,
        keepUndefined: false,
        onAnchor: () => {
          throw new Error("This should not happen, please report a bug.");
        },
        schema,
        sourceObjects: /* @__PURE__ */ new Map()
      });
    }
    var isEmptyPath = (path) => path == null || typeof path === "object" && !!path[Symbol.iterator]().next().done;
    var Collection = class extends Node.NodeBase {
      constructor(type, schema) {
        super(type);
        Object.defineProperty(this, "schema", {
          value: schema,
          configurable: true,
          enumerable: false,
          writable: true
        });
      }
      /**
       * Create a copy of this collection.
       *
       * @param schema - If defined, overwrites the original's schema
       */
      clone(schema) {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (schema)
          copy.schema = schema;
        copy.items = copy.items.map((it) => identity.isNode(it) || identity.isPair(it) ? it.clone(schema) : it);
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /**
       * Adds a value to the collection. For `!!map` and `!!omap` the value must
       * be a Pair instance or a `{ key, value }` object, which may not have a key
       * that already exists in the map.
       */
      addIn(path, value) {
        if (isEmptyPath(path))
          this.add(value);
        else {
          const [key, ...rest] = path;
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.addIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
      /**
       * Removes a value from the collection.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path) {
        const [key, ...rest] = path;
        if (rest.length === 0)
          return this.delete(key);
        const node = this.get(key, true);
        if (identity.isCollection(node))
          return node.deleteIn(rest);
        else
          throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path, keepScalar) {
        const [key, ...rest] = path;
        const node = this.get(key, true);
        if (rest.length === 0)
          return !keepScalar && identity.isScalar(node) ? node.value : node;
        else
          return identity.isCollection(node) ? node.getIn(rest, keepScalar) : void 0;
      }
      hasAllNullValues(allowScalar) {
        return this.items.every((node) => {
          if (!identity.isPair(node))
            return false;
          const n = node.value;
          return n == null || allowScalar && identity.isScalar(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
        });
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       */
      hasIn(path) {
        const [key, ...rest] = path;
        if (rest.length === 0)
          return this.has(key);
        const node = this.get(key, true);
        return identity.isCollection(node) ? node.hasIn(rest) : false;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path, value) {
        const [key, ...rest] = path;
        if (rest.length === 0) {
          this.set(key, value);
        } else {
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.setIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
    };
    exports2.Collection = Collection;
    exports2.collectionFromPath = collectionFromPath;
    exports2.isEmptyPath = isEmptyPath;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/stringifyComment.js
var require_stringifyComment = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/stringifyComment.js"(exports2) {
    "use strict";
    var stringifyComment = (str) => str.replace(/^(?!$)(?: $)?/gm, "#");
    function indentComment(comment, indent) {
      if (/^\n+$/.test(comment))
        return comment.substring(1);
      return indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
    }
    var lineComment = (str, indent, comment) => str.endsWith("\n") ? indentComment(comment, indent) : comment.includes("\n") ? "\n" + indentComment(comment, indent) : (str.endsWith(" ") ? "" : " ") + comment;
    exports2.indentComment = indentComment;
    exports2.lineComment = lineComment;
    exports2.stringifyComment = stringifyComment;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/foldFlowLines.js
var require_foldFlowLines = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/foldFlowLines.js"(exports2) {
    "use strict";
    var FOLD_FLOW = "flow";
    var FOLD_BLOCK = "block";
    var FOLD_QUOTED = "quoted";
    function foldFlowLines(text, indent, mode = "flow", { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
      if (!lineWidth || lineWidth < 0)
        return text;
      if (lineWidth < minContentWidth)
        minContentWidth = 0;
      const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
      if (text.length <= endStep)
        return text;
      const folds = [];
      const escapedFolds = {};
      let end = lineWidth - indent.length;
      if (typeof indentAtStart === "number") {
        if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
          folds.push(0);
        else
          end = lineWidth - indentAtStart;
      }
      let split = void 0;
      let prev = void 0;
      let overflow = false;
      let i = -1;
      let escStart = -1;
      let escEnd = -1;
      if (mode === FOLD_BLOCK) {
        i = consumeMoreIndentedLines(text, i, indent.length);
        if (i !== -1)
          end = i + endStep;
      }
      for (let ch; ch = text[i += 1]; ) {
        if (mode === FOLD_QUOTED && ch === "\\") {
          escStart = i;
          switch (text[i + 1]) {
            case "x":
              i += 3;
              break;
            case "u":
              i += 5;
              break;
            case "U":
              i += 9;
              break;
            default:
              i += 1;
          }
          escEnd = i;
        }
        if (ch === "\n") {
          if (mode === FOLD_BLOCK)
            i = consumeMoreIndentedLines(text, i, indent.length);
          end = i + indent.length + endStep;
          split = void 0;
        } else {
          if (ch === " " && prev && prev !== " " && prev !== "\n" && prev !== "	") {
            const next = text[i + 1];
            if (next && next !== " " && next !== "\n" && next !== "	")
              split = i;
          }
          if (i >= end) {
            if (split) {
              folds.push(split);
              end = split + endStep;
              split = void 0;
            } else if (mode === FOLD_QUOTED) {
              while (prev === " " || prev === "	") {
                prev = ch;
                ch = text[i += 1];
                overflow = true;
              }
              const j = i > escEnd + 1 ? i - 2 : escStart - 1;
              if (escapedFolds[j])
                return text;
              folds.push(j);
              escapedFolds[j] = true;
              end = j + endStep;
              split = void 0;
            } else {
              overflow = true;
            }
          }
        }
        prev = ch;
      }
      if (overflow && onOverflow)
        onOverflow();
      if (folds.length === 0)
        return text;
      if (onFold)
        onFold();
      let res = text.slice(0, folds[0]);
      for (let i2 = 0; i2 < folds.length; ++i2) {
        const fold = folds[i2];
        const end2 = folds[i2 + 1] || text.length;
        if (fold === 0)
          res = `
${indent}${text.slice(0, end2)}`;
        else {
          if (mode === FOLD_QUOTED && escapedFolds[fold])
            res += `${text[fold]}\\`;
          res += `
${indent}${text.slice(fold + 1, end2)}`;
        }
      }
      return res;
    }
    function consumeMoreIndentedLines(text, i, indent) {
      let end = i;
      let start = i + 1;
      let ch = text[start];
      while (ch === " " || ch === "	") {
        if (i < start + indent) {
          ch = text[++i];
        } else {
          do {
            ch = text[++i];
          } while (ch && ch !== "\n");
          end = i;
          start = i + 1;
          ch = text[start];
        }
      }
      return end;
    }
    exports2.FOLD_BLOCK = FOLD_BLOCK;
    exports2.FOLD_FLOW = FOLD_FLOW;
    exports2.FOLD_QUOTED = FOLD_QUOTED;
    exports2.foldFlowLines = foldFlowLines;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/stringifyString.js
var require_stringifyString = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/stringifyString.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    var foldFlowLines = require_foldFlowLines();
    var getFoldOptions = (ctx, isBlock) => ({
      indentAtStart: isBlock ? ctx.indent.length : ctx.indentAtStart,
      lineWidth: ctx.options.lineWidth,
      minContentWidth: ctx.options.minContentWidth
    });
    var containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
    function lineLengthOverLimit(str, lineWidth, indentLength) {
      if (!lineWidth || lineWidth < 0)
        return false;
      const limit = lineWidth - indentLength;
      const strLen = str.length;
      if (strLen <= limit)
        return false;
      for (let i = 0, start = 0; i < strLen; ++i) {
        if (str[i] === "\n") {
          if (i - start > limit)
            return true;
          start = i + 1;
          if (strLen - start <= limit)
            return false;
        }
      }
      return true;
    }
    function doubleQuotedString(value, ctx) {
      const json = JSON.stringify(value);
      if (ctx.options.doubleQuotedAsJSON)
        return json;
      const { implicitKey } = ctx;
      const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      let str = "";
      let start = 0;
      for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
        if (ch === " " && json[i + 1] === "\\" && json[i + 2] === "n") {
          str += json.slice(start, i) + "\\ ";
          i += 1;
          start = i;
          ch = "\\";
        }
        if (ch === "\\")
          switch (json[i + 1]) {
            case "u":
              {
                str += json.slice(start, i);
                const code = json.substr(i + 2, 4);
                switch (code) {
                  case "0000":
                    str += "\\0";
                    break;
                  case "0007":
                    str += "\\a";
                    break;
                  case "000b":
                    str += "\\v";
                    break;
                  case "001b":
                    str += "\\e";
                    break;
                  case "0085":
                    str += "\\N";
                    break;
                  case "00a0":
                    str += "\\_";
                    break;
                  case "2028":
                    str += "\\L";
                    break;
                  case "2029":
                    str += "\\P";
                    break;
                  default:
                    if (code.substr(0, 2) === "00")
                      str += "\\x" + code.substr(2);
                    else
                      str += json.substr(i, 6);
                }
                i += 5;
                start = i + 1;
              }
              break;
            case "n":
              if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
                i += 1;
              } else {
                str += json.slice(start, i) + "\n\n";
                while (json[i + 2] === "\\" && json[i + 3] === "n" && json[i + 4] !== '"') {
                  str += "\n";
                  i += 2;
                }
                str += indent;
                if (json[i + 2] === " ")
                  str += "\\";
                i += 1;
                start = i + 1;
              }
              break;
            default:
              i += 1;
          }
      }
      str = start ? str + json.slice(start) : json;
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_QUOTED, getFoldOptions(ctx, false));
    }
    function singleQuotedString(value, ctx) {
      if (ctx.options.singleQuote === false || ctx.implicitKey && value.includes("\n") || /[ \t]\n|\n[ \t]/.test(value))
        return doubleQuotedString(value, ctx);
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&
${indent}`) + "'";
      return ctx.implicitKey ? res : foldFlowLines.foldFlowLines(res, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function quotedString(value, ctx) {
      const { singleQuote } = ctx.options;
      let qs;
      if (singleQuote === false)
        qs = doubleQuotedString;
      else {
        const hasDouble = value.includes('"');
        const hasSingle = value.includes("'");
        if (hasDouble && !hasSingle)
          qs = singleQuotedString;
        else if (hasSingle && !hasDouble)
          qs = doubleQuotedString;
        else
          qs = singleQuote ? singleQuotedString : doubleQuotedString;
      }
      return qs(value, ctx);
    }
    var blockEndNewlines;
    try {
      blockEndNewlines = new RegExp("(^|(?<!\n))\n+(?!\n|$)", "g");
    } catch {
      blockEndNewlines = /\n+(?!\n|$)/g;
    }
    function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
      const { blockQuote, commentString, lineWidth } = ctx.options;
      if (!blockQuote || /\n[\t ]+$/.test(value)) {
        return quotedString(value, ctx);
      }
      const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : "");
      const literal = blockQuote === "literal" ? true : blockQuote === "folded" || type === Scalar.Scalar.BLOCK_FOLDED ? false : type === Scalar.Scalar.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, lineWidth, indent.length);
      if (!value)
        return literal ? "|\n" : ">\n";
      let chomp;
      let endStart;
      for (endStart = value.length; endStart > 0; --endStart) {
        const ch = value[endStart - 1];
        if (ch !== "\n" && ch !== "	" && ch !== " ")
          break;
      }
      let end = value.substring(endStart);
      const endNlPos = end.indexOf("\n");
      if (endNlPos === -1) {
        chomp = "-";
      } else if (value === end || endNlPos !== end.length - 1) {
        chomp = "+";
        if (onChompKeep)
          onChompKeep();
      } else {
        chomp = "";
      }
      if (end) {
        value = value.slice(0, -end.length);
        if (end[end.length - 1] === "\n")
          end = end.slice(0, -1);
        end = end.replace(blockEndNewlines, `$&${indent}`);
      }
      let startWithSpace = false;
      let startEnd;
      let startNlPos = -1;
      for (startEnd = 0; startEnd < value.length; ++startEnd) {
        const ch = value[startEnd];
        if (ch === " ")
          startWithSpace = true;
        else if (ch === "\n")
          startNlPos = startEnd;
        else
          break;
      }
      let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
      if (start) {
        value = value.substring(start.length);
        start = start.replace(/\n+/g, `$&${indent}`);
      }
      const indentSize = indent ? "2" : "1";
      let header = (startWithSpace ? indentSize : "") + chomp;
      if (comment) {
        header += " " + commentString(comment.replace(/ ?[\r\n]+/g, " "));
        if (onComment)
          onComment();
      }
      if (!literal) {
        const foldedValue = value.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`);
        let literalFallback = false;
        const foldOptions = getFoldOptions(ctx, true);
        if (blockQuote !== "folded" && type !== Scalar.Scalar.BLOCK_FOLDED) {
          foldOptions.onOverflow = () => {
            literalFallback = true;
          };
        }
        const body = foldFlowLines.foldFlowLines(`${start}${foldedValue}${end}`, indent, foldFlowLines.FOLD_BLOCK, foldOptions);
        if (!literalFallback)
          return `>${header}
${indent}${body}`;
      }
      value = value.replace(/\n+/g, `$&${indent}`);
      return `|${header}
${indent}${start}${value}${end}`;
    }
    function plainString(item, ctx, onComment, onChompKeep) {
      const { type, value } = item;
      const { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
      if (implicitKey && value.includes("\n") || inFlow && /[[\]{},]/.test(value)) {
        return quotedString(value, ctx);
      }
      if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
        return implicitKey || inFlow || !value.includes("\n") ? quotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
      }
      if (!implicitKey && !inFlow && type !== Scalar.Scalar.PLAIN && value.includes("\n")) {
        return blockString(item, ctx, onComment, onChompKeep);
      }
      if (containsDocumentMarker(value)) {
        if (indent === "") {
          ctx.forceBlockIndent = true;
          return blockString(item, ctx, onComment, onChompKeep);
        } else if (implicitKey && indent === indentStep) {
          return quotedString(value, ctx);
        }
      }
      const str = value.replace(/\n+/g, `$&
${indent}`);
      if (actualString) {
        const test = (tag) => tag.default && tag.tag !== "tag:yaml.org,2002:str" && tag.test?.test(str);
        const { compat, tags } = ctx.doc.schema;
        if (tags.some(test) || compat?.some(test))
          return quotedString(value, ctx);
      }
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function stringifyString(item, ctx, onComment, onChompKeep) {
      const { implicitKey, inFlow } = ctx;
      const ss = typeof item.value === "string" ? item : Object.assign({}, item, { value: String(item.value) });
      let { type } = item;
      if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
        if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
          type = Scalar.Scalar.QUOTE_DOUBLE;
      }
      const _stringify = (_type) => {
        switch (_type) {
          case Scalar.Scalar.BLOCK_FOLDED:
          case Scalar.Scalar.BLOCK_LITERAL:
            return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
          case Scalar.Scalar.QUOTE_DOUBLE:
            return doubleQuotedString(ss.value, ctx);
          case Scalar.Scalar.QUOTE_SINGLE:
            return singleQuotedString(ss.value, ctx);
          case Scalar.Scalar.PLAIN:
            return plainString(ss, ctx, onComment, onChompKeep);
          default:
            return null;
        }
      };
      let res = _stringify(type);
      if (res === null) {
        const { defaultKeyType, defaultStringType } = ctx.options;
        const t = implicitKey && defaultKeyType || defaultStringType;
        res = _stringify(t);
        if (res === null)
          throw new Error(`Unsupported default string type ${t}`);
      }
      return res;
    }
    exports2.stringifyString = stringifyString;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/stringify.js
var require_stringify = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/stringify.js"(exports2) {
    "use strict";
    var anchors = require_anchors();
    var identity = require_identity();
    var stringifyComment = require_stringifyComment();
    var stringifyString = require_stringifyString();
    function createStringifyContext(doc, options) {
      const opt = Object.assign({
        blockQuote: true,
        commentString: stringifyComment.stringifyComment,
        defaultKeyType: null,
        defaultStringType: "PLAIN",
        directives: null,
        doubleQuotedAsJSON: false,
        doubleQuotedMinMultiLineLength: 40,
        falseStr: "false",
        flowCollectionPadding: true,
        indentSeq: true,
        lineWidth: 80,
        minContentWidth: 20,
        nullStr: "null",
        simpleKeys: false,
        singleQuote: null,
        trailingComma: false,
        trueStr: "true",
        verifyAliasOrder: true
      }, doc.schema.toStringOptions, options);
      let inFlow;
      switch (opt.collectionStyle) {
        case "block":
          inFlow = false;
          break;
        case "flow":
          inFlow = true;
          break;
        default:
          inFlow = null;
      }
      return {
        anchors: /* @__PURE__ */ new Set(),
        doc,
        flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
        indent: "",
        indentStep: typeof opt.indent === "number" ? " ".repeat(opt.indent) : "  ",
        inFlow,
        options: opt
      };
    }
    function getTagObject(tags, item) {
      if (item.tag) {
        const match = tags.filter((t) => t.tag === item.tag);
        if (match.length > 0)
          return match.find((t) => t.format === item.format) ?? match[0];
      }
      let tagObj = void 0;
      let obj;
      if (identity.isScalar(item)) {
        obj = item.value;
        let match = tags.filter((t) => t.identify?.(obj));
        if (match.length > 1) {
          const testMatch = match.filter((t) => t.test);
          if (testMatch.length > 0)
            match = testMatch;
        }
        tagObj = match.find((t) => t.format === item.format) ?? match.find((t) => !t.format);
      } else {
        obj = item;
        tagObj = tags.find((t) => t.nodeClass && obj instanceof t.nodeClass);
      }
      if (!tagObj) {
        const name2 = obj?.constructor?.name ?? (obj === null ? "null" : typeof obj);
        throw new Error(`Tag not resolved for ${name2} value`);
      }
      return tagObj;
    }
    function stringifyProps(node, tagObj, { anchors: anchors$1, doc }) {
      if (!doc.directives)
        return "";
      const props = [];
      const anchor = (identity.isScalar(node) || identity.isCollection(node)) && node.anchor;
      if (anchor && anchors.anchorIsValid(anchor)) {
        anchors$1.add(anchor);
        props.push(`&${anchor}`);
      }
      const tag = node.tag ?? (tagObj.default ? null : tagObj.tag);
      if (tag)
        props.push(doc.directives.tagString(tag));
      return props.join(" ");
    }
    function stringify2(item, ctx, onComment, onChompKeep) {
      if (identity.isPair(item))
        return item.toString(ctx, onComment, onChompKeep);
      if (identity.isAlias(item)) {
        if (ctx.doc.directives)
          return item.toString(ctx);
        if (ctx.resolvedAliases?.has(item)) {
          throw new TypeError(`Cannot stringify circular structure without alias nodes`);
        } else {
          if (ctx.resolvedAliases)
            ctx.resolvedAliases.add(item);
          else
            ctx.resolvedAliases = /* @__PURE__ */ new Set([item]);
          item = item.resolve(ctx.doc);
        }
      }
      let tagObj = void 0;
      const node = identity.isNode(item) ? item : ctx.doc.createNode(item, { onTagObj: (o) => tagObj = o });
      tagObj ?? (tagObj = getTagObject(ctx.doc.schema.tags, node));
      const props = stringifyProps(node, tagObj, ctx);
      if (props.length > 0)
        ctx.indentAtStart = (ctx.indentAtStart ?? 0) + props.length + 1;
      const str = typeof tagObj.stringify === "function" ? tagObj.stringify(node, ctx, onComment, onChompKeep) : identity.isScalar(node) ? stringifyString.stringifyString(node, ctx, onComment, onChompKeep) : node.toString(ctx, onComment, onChompKeep);
      if (!props)
        return str;
      return identity.isScalar(node) || str[0] === "{" || str[0] === "[" ? `${props} ${str}` : `${props}
${ctx.indent}${str}`;
    }
    exports2.createStringifyContext = createStringifyContext;
    exports2.stringify = stringify2;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/stringifyPair.js
var require_stringifyPair = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/stringifyPair.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var stringify2 = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
      const { allNullValues, doc, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
      let keyComment = identity.isNode(key) && key.comment || null;
      if (simpleKeys) {
        if (keyComment) {
          throw new Error("With simple keys, key nodes cannot have comments");
        }
        if (identity.isCollection(key) || !identity.isNode(key) && typeof key === "object") {
          const msg = "With simple keys, collection cannot be used as a key value";
          throw new Error(msg);
        }
      }
      let explicitKey = !simpleKeys && (!key || keyComment && value == null && !ctx.inFlow || identity.isCollection(key) || (identity.isScalar(key) ? key.type === Scalar.Scalar.BLOCK_FOLDED || key.type === Scalar.Scalar.BLOCK_LITERAL : typeof key === "object"));
      ctx = Object.assign({}, ctx, {
        allNullValues: false,
        implicitKey: !explicitKey && (simpleKeys || !allNullValues),
        indent: indent + indentStep
      });
      let keyCommentDone = false;
      let chompKeep = false;
      let str = stringify2.stringify(key, ctx, () => keyCommentDone = true, () => chompKeep = true);
      if (!explicitKey && !ctx.inFlow && str.length > 1024) {
        if (simpleKeys)
          throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
        explicitKey = true;
      }
      if (ctx.inFlow) {
        if (allNullValues || value == null) {
          if (keyCommentDone && onComment)
            onComment();
          return str === "" ? "?" : explicitKey ? `? ${str}` : str;
        }
      } else if (allNullValues && !simpleKeys || value == null && explicitKey) {
        str = `? ${str}`;
        if (keyComment && !keyCommentDone) {
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        } else if (chompKeep && onChompKeep)
          onChompKeep();
        return str;
      }
      if (keyCommentDone)
        keyComment = null;
      if (explicitKey) {
        if (keyComment)
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        str = `? ${str}
${indent}:`;
      } else {
        str = `${str}:`;
        if (keyComment)
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
      }
      let vsb, vcb, valueComment;
      if (identity.isNode(value)) {
        vsb = !!value.spaceBefore;
        vcb = value.commentBefore;
        valueComment = value.comment;
      } else {
        vsb = false;
        vcb = null;
        valueComment = null;
        if (value && typeof value === "object")
          value = doc.createNode(value);
      }
      ctx.implicitKey = false;
      if (!explicitKey && !keyComment && identity.isScalar(value))
        ctx.indentAtStart = str.length + 1;
      chompKeep = false;
      if (!indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && identity.isSeq(value) && !value.flow && !value.tag && !value.anchor) {
        ctx.indent = ctx.indent.substring(2);
      }
      let valueCommentDone = false;
      const valueStr = stringify2.stringify(value, ctx, () => valueCommentDone = true, () => chompKeep = true);
      let ws = " ";
      if (keyComment || vsb || vcb) {
        ws = vsb ? "\n" : "";
        if (vcb) {
          const cs = commentString(vcb);
          ws += `
${stringifyComment.indentComment(cs, ctx.indent)}`;
        }
        if (valueStr === "" && !ctx.inFlow) {
          if (ws === "\n" && valueComment)
            ws = "\n\n";
        } else {
          ws += `
${ctx.indent}`;
        }
      } else if (!explicitKey && identity.isCollection(value)) {
        const vs0 = valueStr[0];
        const nl0 = valueStr.indexOf("\n");
        const hasNewline = nl0 !== -1;
        const flow = ctx.inFlow ?? value.flow ?? value.items.length === 0;
        if (hasNewline || !flow) {
          let hasPropsLine = false;
          if (hasNewline && (vs0 === "&" || vs0 === "!")) {
            let sp0 = valueStr.indexOf(" ");
            if (vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!") {
              sp0 = valueStr.indexOf(" ", sp0 + 1);
            }
            if (sp0 === -1 || nl0 < sp0)
              hasPropsLine = true;
          }
          if (!hasPropsLine)
            ws = `
${ctx.indent}`;
        }
      } else if (valueStr === "" || valueStr[0] === "\n") {
        ws = "";
      }
      str += ws + valueStr;
      if (ctx.inFlow) {
        if (valueCommentDone && onComment)
          onComment();
      } else if (valueComment && !valueCommentDone) {
        str += stringifyComment.lineComment(str, ctx.indent, commentString(valueComment));
      } else if (chompKeep && onChompKeep) {
        onChompKeep();
      }
      return str;
    }
    exports2.stringifyPair = stringifyPair;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/log.js
var require_log = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/log.js"(exports2) {
    "use strict";
    var node_process = require("process");
    function debug(logLevel, ...messages) {
      if (logLevel === "debug")
        console.log(...messages);
    }
    function warn(logLevel, warning) {
      if (logLevel === "debug" || logLevel === "warn") {
        if (typeof node_process.emitWarning === "function")
          node_process.emitWarning(warning);
        else
          console.warn(warning);
      }
    }
    exports2.debug = debug;
    exports2.warn = warn;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/merge.js
var require_merge = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/merge.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var MERGE_KEY = "<<";
    var merge2 = {
      identify: (value) => value === MERGE_KEY || typeof value === "symbol" && value.description === MERGE_KEY,
      default: "key",
      tag: "tag:yaml.org,2002:merge",
      test: /^<<$/,
      resolve: () => Object.assign(new Scalar.Scalar(Symbol(MERGE_KEY)), {
        addToJSMap: addMergeToJSMap
      }),
      stringify: () => MERGE_KEY
    };
    var isMergeKey = (ctx, key) => (merge2.identify(key) || identity.isScalar(key) && (!key.type || key.type === Scalar.Scalar.PLAIN) && merge2.identify(key.value)) && ctx?.doc.schema.tags.some((tag) => tag.tag === merge2.tag && tag.default);
    function addMergeToJSMap(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (identity.isSeq(source))
        for (const it of source.items)
          mergeValue(ctx, map, it);
      else if (Array.isArray(source))
        for (const it of source)
          mergeValue(ctx, map, it);
      else
        mergeValue(ctx, map, source);
    }
    function mergeValue(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (!identity.isMap(source))
        throw new Error("Merge sources must be maps or map aliases");
      const srcMap = source.toJSON(null, ctx, Map);
      for (const [key, value2] of srcMap) {
        if (map instanceof Map) {
          if (!map.has(key))
            map.set(key, value2);
        } else if (map instanceof Set) {
          map.add(key);
        } else if (!Object.prototype.hasOwnProperty.call(map, key)) {
          Object.defineProperty(map, key, {
            value: value2,
            writable: true,
            enumerable: true,
            configurable: true
          });
        }
      }
      return map;
    }
    function resolveAliasValue(ctx, value) {
      return ctx && identity.isAlias(value) ? value.resolve(ctx.doc, ctx) : value;
    }
    exports2.addMergeToJSMap = addMergeToJSMap;
    exports2.isMergeKey = isMergeKey;
    exports2.merge = merge2;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/addPairToJSMap.js
var require_addPairToJSMap = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/addPairToJSMap.js"(exports2) {
    "use strict";
    var log = require_log();
    var merge2 = require_merge();
    var stringify2 = require_stringify();
    var identity = require_identity();
    var toJS = require_toJS();
    function addPairToJSMap(ctx, map, { key, value }) {
      if (identity.isNode(key) && key.addToJSMap)
        key.addToJSMap(ctx, map, value);
      else if (merge2.isMergeKey(ctx, key))
        merge2.addMergeToJSMap(ctx, map, value);
      else {
        const jsKey = toJS.toJS(key, "", ctx);
        if (map instanceof Map) {
          map.set(jsKey, toJS.toJS(value, jsKey, ctx));
        } else if (map instanceof Set) {
          map.add(jsKey);
        } else {
          const stringKey = stringifyKey(key, jsKey, ctx);
          const jsValue = toJS.toJS(value, stringKey, ctx);
          if (stringKey in map)
            Object.defineProperty(map, stringKey, {
              value: jsValue,
              writable: true,
              enumerable: true,
              configurable: true
            });
          else
            map[stringKey] = jsValue;
        }
      }
      return map;
    }
    function stringifyKey(key, jsKey, ctx) {
      if (jsKey === null)
        return "";
      if (typeof jsKey !== "object")
        return String(jsKey);
      if (identity.isNode(key) && ctx?.doc) {
        const strCtx = stringify2.createStringifyContext(ctx.doc, {});
        strCtx.anchors = /* @__PURE__ */ new Set();
        for (const node of ctx.anchors.keys())
          strCtx.anchors.add(node.anchor);
        strCtx.inFlow = true;
        strCtx.inStringifyKey = true;
        const strKey = key.toString(strCtx);
        if (!ctx.mapKeyWarned) {
          let jsonStr = JSON.stringify(strKey);
          if (jsonStr.length > 40)
            jsonStr = jsonStr.substring(0, 36) + '..."';
          log.warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
          ctx.mapKeyWarned = true;
        }
        return strKey;
      }
      return JSON.stringify(jsKey);
    }
    exports2.addPairToJSMap = addPairToJSMap;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/Pair.js
var require_Pair = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/Pair.js"(exports2) {
    "use strict";
    var createNode = require_createNode();
    var stringifyPair = require_stringifyPair();
    var addPairToJSMap = require_addPairToJSMap();
    var identity = require_identity();
    function createPair(key, value, ctx) {
      const k = createNode.createNode(key, void 0, ctx);
      const v = createNode.createNode(value, void 0, ctx);
      return new Pair(k, v);
    }
    var Pair = class _Pair {
      constructor(key, value = null) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.PAIR });
        this.key = key;
        this.value = value;
      }
      clone(schema) {
        let { key, value } = this;
        if (identity.isNode(key))
          key = key.clone(schema);
        if (identity.isNode(value))
          value = value.clone(schema);
        return new _Pair(key, value);
      }
      toJSON(_, ctx) {
        const pair = ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        return addPairToJSMap.addPairToJSMap(ctx, pair, this);
      }
      toString(ctx, onComment, onChompKeep) {
        return ctx?.doc ? stringifyPair.stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
      }
    };
    exports2.Pair = Pair;
    exports2.createPair = createPair;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/stringifyCollection.js
var require_stringifyCollection = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/stringifyCollection.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var stringify2 = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyCollection(collection, ctx, options) {
      const flow = ctx.inFlow ?? collection.flow;
      const stringify3 = flow ? stringifyFlowCollection : stringifyBlockCollection;
      return stringify3(collection, ctx, options);
    }
    function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
      const { indent, options: { commentString } } = ctx;
      const itemCtx = Object.assign({}, ctx, { indent: itemIndent, type: null });
      let chompKeep = false;
      const lines = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment2 = null;
        if (identity.isNode(item)) {
          if (!chompKeep && item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, chompKeep);
          if (item.comment)
            comment2 = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (!chompKeep && ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
          }
        }
        chompKeep = false;
        let str2 = stringify2.stringify(item, itemCtx, () => comment2 = null, () => chompKeep = true);
        if (comment2)
          str2 += stringifyComment.lineComment(str2, itemIndent, commentString(comment2));
        if (chompKeep && comment2)
          chompKeep = false;
        lines.push(blockItemPrefix + str2);
      }
      let str;
      if (lines.length === 0) {
        str = flowChars.start + flowChars.end;
      } else {
        str = lines[0];
        for (let i = 1; i < lines.length; ++i) {
          const line = lines[i];
          str += line ? `
${indent}${line}` : "\n";
        }
      }
      if (comment) {
        str += "\n" + stringifyComment.indentComment(commentString(comment), indent);
        if (onComment)
          onComment();
      } else if (chompKeep && onChompKeep)
        onChompKeep();
      return str;
    }
    function stringifyFlowCollection({ items }, ctx, { flowChars, itemIndent }) {
      const { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
      itemIndent += indentStep;
      const itemCtx = Object.assign({}, ctx, {
        indent: itemIndent,
        inFlow: true,
        type: null
      });
      let reqNewline = false;
      let linesAtValue = 0;
      const lines = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment = null;
        if (identity.isNode(item)) {
          if (item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, false);
          if (item.comment)
            comment = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, false);
            if (ik.comment)
              reqNewline = true;
          }
          const iv = identity.isNode(item.value) ? item.value : null;
          if (iv) {
            if (iv.comment)
              comment = iv.comment;
            if (iv.commentBefore)
              reqNewline = true;
          } else if (item.value == null && ik?.comment) {
            comment = ik.comment;
          }
        }
        if (comment)
          reqNewline = true;
        let str = stringify2.stringify(item, itemCtx, () => comment = null);
        reqNewline || (reqNewline = lines.length > linesAtValue || str.includes("\n"));
        if (i < items.length - 1) {
          str += ",";
        } else if (ctx.options.trailingComma) {
          if (ctx.options.lineWidth > 0) {
            reqNewline || (reqNewline = lines.reduce((sum, line) => sum + line.length + 2, 2) + (str.length + 2) > ctx.options.lineWidth);
          }
          if (reqNewline) {
            str += ",";
          }
        }
        if (comment)
          str += stringifyComment.lineComment(str, itemIndent, commentString(comment));
        lines.push(str);
        linesAtValue = lines.length;
      }
      const { start, end } = flowChars;
      if (lines.length === 0) {
        return start + end;
      } else {
        if (!reqNewline) {
          const len = lines.reduce((sum, line) => sum + line.length + 2, 2);
          reqNewline = ctx.options.lineWidth > 0 && len > ctx.options.lineWidth;
        }
        if (reqNewline) {
          let str = start;
          for (const line of lines)
            str += line ? `
${indentStep}${indent}${line}` : "\n";
          return `${str}
${indent}${end}`;
        } else {
          return `${start}${fcPadding}${lines.join(" ")}${fcPadding}${end}`;
        }
      }
    }
    function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
      if (comment && chompKeep)
        comment = comment.replace(/^\n+/, "");
      if (comment) {
        const ic = stringifyComment.indentComment(commentString(comment), indent);
        lines.push(ic.trimStart());
      }
    }
    exports2.stringifyCollection = stringifyCollection;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/YAMLMap.js
var require_YAMLMap = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/YAMLMap.js"(exports2) {
    "use strict";
    var stringifyCollection = require_stringifyCollection();
    var addPairToJSMap = require_addPairToJSMap();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    function findPair(items, key) {
      const k = identity.isScalar(key) ? key.value : key;
      for (const it of items) {
        if (identity.isPair(it)) {
          if (it.key === key || it.key === k)
            return it;
          if (identity.isScalar(it.key) && it.key.value === k)
            return it;
        }
      }
      return void 0;
    }
    var YAMLMap = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:map";
      }
      constructor(schema) {
        super(identity.MAP, schema);
        this.items = [];
      }
      /**
       * A generic collection parsing method that can be extended
       * to other node classes that inherit from YAMLMap
       */
      static from(schema, obj, ctx) {
        const { keepUndefined, replacer } = ctx;
        const map = new this(schema);
        const add = (key, value) => {
          if (typeof replacer === "function")
            value = replacer.call(obj, key, value);
          else if (Array.isArray(replacer) && !replacer.includes(key))
            return;
          if (value !== void 0 || keepUndefined)
            map.items.push(Pair.createPair(key, value, ctx));
        };
        if (obj instanceof Map) {
          for (const [key, value] of obj)
            add(key, value);
        } else if (obj && typeof obj === "object") {
          for (const key of Object.keys(obj))
            add(key, obj[key]);
        }
        if (typeof schema.sortMapEntries === "function") {
          map.items.sort(schema.sortMapEntries);
        }
        return map;
      }
      /**
       * Adds a value to the collection.
       *
       * @param overwrite - If not set `true`, using a key that is already in the
       *   collection will throw. Otherwise, overwrites the previous value.
       */
      add(pair, overwrite) {
        let _pair;
        if (identity.isPair(pair))
          _pair = pair;
        else if (!pair || typeof pair !== "object" || !("key" in pair)) {
          _pair = new Pair.Pair(pair, pair?.value);
        } else
          _pair = new Pair.Pair(pair.key, pair.value);
        const prev = findPair(this.items, _pair.key);
        const sortEntries = this.schema?.sortMapEntries;
        if (prev) {
          if (!overwrite)
            throw new Error(`Key ${_pair.key} already set`);
          if (identity.isScalar(prev.value) && Scalar.isScalarValue(_pair.value))
            prev.value.value = _pair.value;
          else
            prev.value = _pair.value;
        } else if (sortEntries) {
          const i = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
          if (i === -1)
            this.items.push(_pair);
          else
            this.items.splice(i, 0, _pair);
        } else {
          this.items.push(_pair);
        }
      }
      delete(key) {
        const it = findPair(this.items, key);
        if (!it)
          return false;
        const del = this.items.splice(this.items.indexOf(it), 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const it = findPair(this.items, key);
        const node = it?.value;
        return (!keepScalar && identity.isScalar(node) ? node.value : node) ?? void 0;
      }
      has(key) {
        return !!findPair(this.items, key);
      }
      set(key, value) {
        this.add(new Pair.Pair(key, value), true);
      }
      /**
       * @param ctx - Conversion context, originally set in Document#toJS()
       * @param {Class} Type - If set, forces the returned collection type
       * @returns Instance of Type, Map, or Object
       */
      toJSON(_, ctx, Type) {
        const map = Type ? new Type() : ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const item of this.items)
          addPairToJSMap.addPairToJSMap(ctx, map, item);
        return map;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        for (const item of this.items) {
          if (!identity.isPair(item))
            throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
        }
        if (!ctx.allNullValues && this.hasAllNullValues(false))
          ctx = Object.assign({}, ctx, { allNullValues: true });
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "",
          flowChars: { start: "{", end: "}" },
          itemIndent: ctx.indent || "",
          onChompKeep,
          onComment
        });
      }
    };
    exports2.YAMLMap = YAMLMap;
    exports2.findPair = findPair;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/common/map.js
var require_map = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/common/map.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var YAMLMap = require_YAMLMap();
    var map = {
      collection: "map",
      default: true,
      nodeClass: YAMLMap.YAMLMap,
      tag: "tag:yaml.org,2002:map",
      resolve(map2, onError) {
        if (!identity.isMap(map2))
          onError("Expected a mapping for this tag");
        return map2;
      },
      createNode: (schema, obj, ctx) => YAMLMap.YAMLMap.from(schema, obj, ctx)
    };
    exports2.map = map;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/YAMLSeq.js
var require_YAMLSeq = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/YAMLSeq.js"(exports2) {
    "use strict";
    var createNode = require_createNode();
    var stringifyCollection = require_stringifyCollection();
    var Collection = require_Collection();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var toJS = require_toJS();
    var YAMLSeq = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:seq";
      }
      constructor(schema) {
        super(identity.SEQ, schema);
        this.items = [];
      }
      add(value) {
        this.items.push(value);
      }
      /**
       * Removes a value from the collection.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       *
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return false;
        const del = this.items.splice(idx, 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return void 0;
        const it = this.items[idx];
        return !keepScalar && identity.isScalar(it) ? it.value : it;
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       */
      has(key) {
        const idx = asItemIndex(key);
        return typeof idx === "number" && idx < this.items.length;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       *
       * If `key` does not contain a representation of an integer, this will throw.
       * It may be wrapped in a `Scalar`.
       */
      set(key, value) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          throw new Error(`Expected a valid index, not ${key}.`);
        const prev = this.items[idx];
        if (identity.isScalar(prev) && Scalar.isScalarValue(value))
          prev.value = value;
        else
          this.items[idx] = value;
      }
      toJSON(_, ctx) {
        const seq = [];
        if (ctx?.onCreate)
          ctx.onCreate(seq);
        let i = 0;
        for (const item of this.items)
          seq.push(toJS.toJS(item, String(i++), ctx));
        return seq;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "- ",
          flowChars: { start: "[", end: "]" },
          itemIndent: (ctx.indent || "") + "  ",
          onChompKeep,
          onComment
        });
      }
      static from(schema, obj, ctx) {
        const { replacer } = ctx;
        const seq = new this(schema);
        if (obj && Symbol.iterator in Object(obj)) {
          let i = 0;
          for (let it of obj) {
            if (typeof replacer === "function") {
              const key = obj instanceof Set ? it : String(i++);
              it = replacer.call(obj, key, it);
            }
            seq.items.push(createNode.createNode(it, void 0, ctx));
          }
        }
        return seq;
      }
    };
    function asItemIndex(key) {
      let idx = identity.isScalar(key) ? key.value : key;
      if (idx && typeof idx === "string")
        idx = Number(idx);
      return typeof idx === "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
    }
    exports2.YAMLSeq = YAMLSeq;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/common/seq.js
var require_seq = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/common/seq.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var YAMLSeq = require_YAMLSeq();
    var seq = {
      collection: "seq",
      default: true,
      nodeClass: YAMLSeq.YAMLSeq,
      tag: "tag:yaml.org,2002:seq",
      resolve(seq2, onError) {
        if (!identity.isSeq(seq2))
          onError("Expected a sequence for this tag");
        return seq2;
      },
      createNode: (schema, obj, ctx) => YAMLSeq.YAMLSeq.from(schema, obj, ctx)
    };
    exports2.seq = seq;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/common/string.js
var require_string = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/common/string.js"(exports2) {
    "use strict";
    var stringifyString = require_stringifyString();
    var string = {
      identify: (value) => typeof value === "string",
      default: true,
      tag: "tag:yaml.org,2002:str",
      resolve: (str) => str,
      stringify(item, ctx, onComment, onChompKeep) {
        ctx = Object.assign({ actualString: true }, ctx);
        return stringifyString.stringifyString(item, ctx, onComment, onChompKeep);
      }
    };
    exports2.string = string;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/common/null.js
var require_null = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/common/null.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    var nullTag = {
      identify: (value) => value == null,
      createNode: () => new Scalar.Scalar(null),
      default: true,
      tag: "tag:yaml.org,2002:null",
      test: /^(?:~|[Nn]ull|NULL)?$/,
      resolve: () => new Scalar.Scalar(null),
      stringify: ({ source }, ctx) => typeof source === "string" && nullTag.test.test(source) ? source : ctx.options.nullStr
    };
    exports2.nullTag = nullTag;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/core/bool.js
var require_bool = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/core/bool.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    var boolTag = {
      identify: (value) => typeof value === "boolean",
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
      resolve: (str) => new Scalar.Scalar(str[0] === "t" || str[0] === "T"),
      stringify({ source, value }, ctx) {
        if (source && boolTag.test.test(source)) {
          const sv = source[0] === "t" || source[0] === "T";
          if (value === sv)
            return source;
        }
        return value ? ctx.options.trueStr : ctx.options.falseStr;
      }
    };
    exports2.boolTag = boolTag;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/stringifyNumber.js
var require_stringifyNumber = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/stringifyNumber.js"(exports2) {
    "use strict";
    function stringifyNumber({ format, minFractionDigits, tag, value }) {
      if (typeof value === "bigint")
        return String(value);
      const num = typeof value === "number" ? value : Number(value);
      if (!isFinite(num))
        return isNaN(num) ? ".nan" : num < 0 ? "-.inf" : ".inf";
      let n = Object.is(value, -0) ? "-0" : JSON.stringify(value);
      if (!format && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^-?\d/.test(n) && !n.includes("e")) {
        let i = n.indexOf(".");
        if (i < 0) {
          i = n.length;
          n += ".";
        }
        let d = minFractionDigits - (n.length - i - 1);
        while (d-- > 0)
          n += "0";
      }
      return n;
    }
    exports2.stringifyNumber = stringifyNumber;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/core/float.js
var require_float = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/core/float.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
      resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str));
        const dot = str.indexOf(".");
        if (dot !== -1 && str[str.length - 1] === "0")
          node.minFractionDigits = str.length - dot - 1;
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports2.float = float;
    exports2.floatExp = floatExp;
    exports2.floatNaN = floatNaN;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/core/int.js
var require_int = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/core/int.js"(exports2) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    var intResolve = (str, offset, radix, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix);
    function intStringify(node, radix, prefix) {
      const { value } = node;
      if (intIdentify(value) && value >= 0)
        return prefix + value.toString(radix);
      return stringifyNumber.stringifyNumber(node);
    }
    var intOct = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^0o[0-7]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 8, opt),
      stringify: (node) => intStringify(node, 8, "0o")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^0x[0-9a-fA-F]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports2.int = int;
    exports2.intHex = intHex;
    exports2.intOct = intOct;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/core/schema.js
var require_schema = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/core/schema.js"(exports2) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.boolTag,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float
    ];
    exports2.schema = schema;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/json/schema.js
var require_schema2 = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/json/schema.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    var map = require_map();
    var seq = require_seq();
    function intIdentify(value) {
      return typeof value === "bigint" || Number.isInteger(value);
    }
    var stringifyJSON = ({ value }) => JSON.stringify(value);
    var jsonScalars = [
      {
        identify: (value) => typeof value === "string",
        default: true,
        tag: "tag:yaml.org,2002:str",
        resolve: (str) => str,
        stringify: stringifyJSON
      },
      {
        identify: (value) => value == null,
        createNode: () => new Scalar.Scalar(null),
        default: true,
        tag: "tag:yaml.org,2002:null",
        test: /^null$/,
        resolve: () => null,
        stringify: stringifyJSON
      },
      {
        identify: (value) => typeof value === "boolean",
        default: true,
        tag: "tag:yaml.org,2002:bool",
        test: /^true$|^false$/,
        resolve: (str) => str === "true",
        stringify: stringifyJSON
      },
      {
        identify: intIdentify,
        default: true,
        tag: "tag:yaml.org,2002:int",
        test: /^-?(?:0|[1-9][0-9]*)$/,
        resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
        stringify: ({ value }) => intIdentify(value) ? value.toString() : JSON.stringify(value)
      },
      {
        identify: (value) => typeof value === "number",
        default: true,
        tag: "tag:yaml.org,2002:float",
        test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
        resolve: (str) => parseFloat(str),
        stringify: stringifyJSON
      }
    ];
    var jsonError = {
      default: true,
      tag: "",
      test: /^/,
      resolve(str, onError) {
        onError(`Unresolved plain scalar ${JSON.stringify(str)}`);
        return str;
      }
    };
    var schema = [map.map, seq.seq].concat(jsonScalars, jsonError);
    exports2.schema = schema;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/binary.js
var require_binary = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/binary.js"(exports2) {
    "use strict";
    var node_buffer = require("buffer");
    var Scalar = require_Scalar();
    var stringifyString = require_stringifyString();
    var binary = {
      identify: (value) => value instanceof Uint8Array,
      // Buffer inherits from Uint8Array
      default: false,
      tag: "tag:yaml.org,2002:binary",
      /**
       * Returns a Buffer in node and an Uint8Array in browsers
       *
       * To use the resulting buffer as an image, you'll want to do something like:
       *
       *   const blob = new Blob([buffer], { type: 'image/jpeg' })
       *   document.querySelector('#photo').src = URL.createObjectURL(blob)
       */
      resolve(src, onError) {
        if (typeof node_buffer.Buffer === "function") {
          return node_buffer.Buffer.from(src, "base64");
        } else if (typeof atob === "function") {
          const str = atob(src.replace(/[\n\r]/g, ""));
          const buffer = new Uint8Array(str.length);
          for (let i = 0; i < str.length; ++i)
            buffer[i] = str.charCodeAt(i);
          return buffer;
        } else {
          onError("This environment does not support reading binary tags; either Buffer or atob is required");
          return src;
        }
      },
      stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
        if (!value)
          return "";
        const buf = value;
        let str;
        if (typeof node_buffer.Buffer === "function") {
          str = buf instanceof node_buffer.Buffer ? buf.toString("base64") : node_buffer.Buffer.from(buf.buffer).toString("base64");
        } else if (typeof btoa === "function") {
          let s = "";
          for (let i = 0; i < buf.length; ++i)
            s += String.fromCharCode(buf[i]);
          str = btoa(s);
        } else {
          throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
        }
        type ?? (type = Scalar.Scalar.BLOCK_LITERAL);
        if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
          const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
          const n = Math.ceil(str.length / lineWidth);
          const lines = new Array(n);
          for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
            lines[i] = str.substr(o, lineWidth);
          }
          str = lines.join(type === Scalar.Scalar.BLOCK_LITERAL ? "\n" : " ");
        }
        return stringifyString.stringifyString({ comment, type, value: str }, ctx, onComment, onChompKeep);
      }
    };
    exports2.binary = binary;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/pairs.js
var require_pairs = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/pairs.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLSeq = require_YAMLSeq();
    function resolvePairs(seq, onError) {
      if (identity.isSeq(seq)) {
        for (let i = 0; i < seq.items.length; ++i) {
          let item = seq.items[i];
          if (identity.isPair(item))
            continue;
          else if (identity.isMap(item)) {
            if (item.items.length > 1)
              onError("Each pair must have its own sequence indicator");
            const pair = item.items[0] || new Pair.Pair(new Scalar.Scalar(null));
            if (item.commentBefore)
              pair.key.commentBefore = pair.key.commentBefore ? `${item.commentBefore}
${pair.key.commentBefore}` : item.commentBefore;
            if (item.comment) {
              const cn = pair.value ?? pair.key;
              cn.comment = cn.comment ? `${item.comment}
${cn.comment}` : item.comment;
            }
            item = pair;
          }
          seq.items[i] = identity.isPair(item) ? item : new Pair.Pair(item);
        }
      } else
        onError("Expected a sequence for this tag");
      return seq;
    }
    function createPairs(schema, iterable, ctx) {
      const { replacer } = ctx;
      const pairs2 = new YAMLSeq.YAMLSeq(schema);
      pairs2.tag = "tag:yaml.org,2002:pairs";
      let i = 0;
      if (iterable && Symbol.iterator in Object(iterable))
        for (let it of iterable) {
          if (typeof replacer === "function")
            it = replacer.call(iterable, String(i++), it);
          let key, value;
          if (Array.isArray(it)) {
            if (it.length === 2) {
              key = it[0];
              value = it[1];
            } else
              throw new TypeError(`Expected [key, value] tuple: ${it}`);
          } else if (it && it instanceof Object) {
            const keys = Object.keys(it);
            if (keys.length === 1) {
              key = keys[0];
              value = it[key];
            } else {
              throw new TypeError(`Expected tuple with one key, not ${keys.length} keys`);
            }
          } else {
            key = it;
          }
          pairs2.items.push(Pair.createPair(key, value, ctx));
        }
      return pairs2;
    }
    var pairs = {
      collection: "seq",
      default: false,
      tag: "tag:yaml.org,2002:pairs",
      resolve: resolvePairs,
      createNode: createPairs
    };
    exports2.createPairs = createPairs;
    exports2.pairs = pairs;
    exports2.resolvePairs = resolvePairs;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/omap.js
var require_omap = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/omap.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var toJS = require_toJS();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var pairs = require_pairs();
    var YAMLOMap = class _YAMLOMap extends YAMLSeq.YAMLSeq {
      constructor() {
        super();
        this.add = YAMLMap.YAMLMap.prototype.add.bind(this);
        this.delete = YAMLMap.YAMLMap.prototype.delete.bind(this);
        this.get = YAMLMap.YAMLMap.prototype.get.bind(this);
        this.has = YAMLMap.YAMLMap.prototype.has.bind(this);
        this.set = YAMLMap.YAMLMap.prototype.set.bind(this);
        this.tag = _YAMLOMap.tag;
      }
      /**
       * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
       * but TypeScript won't allow widening the signature of a child method.
       */
      toJSON(_, ctx) {
        if (!ctx)
          return super.toJSON(_);
        const map = /* @__PURE__ */ new Map();
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const pair of this.items) {
          let key, value;
          if (identity.isPair(pair)) {
            key = toJS.toJS(pair.key, "", ctx);
            value = toJS.toJS(pair.value, key, ctx);
          } else {
            key = toJS.toJS(pair, "", ctx);
          }
          if (map.has(key))
            throw new Error("Ordered maps must not include duplicate keys");
          map.set(key, value);
        }
        return map;
      }
      static from(schema, iterable, ctx) {
        const pairs$1 = pairs.createPairs(schema, iterable, ctx);
        const omap2 = new this();
        omap2.items = pairs$1.items;
        return omap2;
      }
    };
    YAMLOMap.tag = "tag:yaml.org,2002:omap";
    var omap = {
      collection: "seq",
      identify: (value) => value instanceof Map,
      nodeClass: YAMLOMap,
      default: false,
      tag: "tag:yaml.org,2002:omap",
      resolve(seq, onError) {
        const pairs$1 = pairs.resolvePairs(seq, onError);
        const seenKeys = [];
        for (const { key } of pairs$1.items) {
          if (identity.isScalar(key)) {
            if (seenKeys.includes(key.value)) {
              onError(`Ordered maps must not include duplicate keys: ${key.value}`);
            } else {
              seenKeys.push(key.value);
            }
          }
        }
        return Object.assign(new YAMLOMap(), pairs$1);
      },
      createNode: (schema, iterable, ctx) => YAMLOMap.from(schema, iterable, ctx)
    };
    exports2.YAMLOMap = YAMLOMap;
    exports2.omap = omap;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/bool.js
var require_bool2 = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/bool.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    function boolStringify({ value, source }, ctx) {
      const boolObj = value ? trueTag : falseTag;
      if (source && boolObj.test.test(source))
        return source;
      return value ? ctx.options.trueStr : ctx.options.falseStr;
    }
    var trueTag = {
      identify: (value) => value === true,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
      resolve: () => new Scalar.Scalar(true),
      stringify: boolStringify
    };
    var falseTag = {
      identify: (value) => value === false,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
      resolve: () => new Scalar.Scalar(false),
      stringify: boolStringify
    };
    exports2.falseTag = falseTag;
    exports2.trueTag = trueTag;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/float.js
var require_float2 = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/float.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str.replace(/_/g, "")),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
      resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str.replace(/_/g, "")));
        const dot = str.indexOf(".");
        if (dot !== -1) {
          const f = str.substring(dot + 1).replace(/_/g, "");
          if (f[f.length - 1] === "0")
            node.minFractionDigits = f.length;
        }
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports2.float = float;
    exports2.floatExp = floatExp;
    exports2.floatNaN = floatNaN;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/int.js
var require_int2 = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/int.js"(exports2) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    function intResolve(str, offset, radix, { intAsBigInt }) {
      const sign = str[0];
      if (sign === "-" || sign === "+")
        offset += 1;
      str = str.substring(offset).replace(/_/g, "");
      if (intAsBigInt) {
        switch (radix) {
          case 2:
            str = `0b${str}`;
            break;
          case 8:
            str = `0o${str}`;
            break;
          case 16:
            str = `0x${str}`;
            break;
        }
        const n2 = BigInt(str);
        return sign === "-" ? BigInt(-1) * n2 : n2;
      }
      const n = parseInt(str, radix);
      return sign === "-" ? -1 * n : n;
    }
    function intStringify(node, radix, prefix) {
      const { value } = node;
      if (intIdentify(value)) {
        const str = value.toString(radix);
        return value < 0 ? "-" + prefix + str.substr(1) : prefix + str;
      }
      return stringifyNumber.stringifyNumber(node);
    }
    var intBin = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "BIN",
      test: /^[-+]?0b[0-1_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 2, opt),
      stringify: (node) => intStringify(node, 2, "0b")
    };
    var intOct = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^[-+]?0[0-7_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 1, 8, opt),
      stringify: (node) => intStringify(node, 8, "0")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9][0-9_]*$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^[-+]?0x[0-9a-fA-F_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports2.int = int;
    exports2.intBin = intBin;
    exports2.intHex = intHex;
    exports2.intOct = intOct;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/set.js
var require_set = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/set.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSet = class _YAMLSet extends YAMLMap.YAMLMap {
      constructor(schema) {
        super(schema);
        this.tag = _YAMLSet.tag;
      }
      add(key) {
        let pair;
        if (identity.isPair(key))
          pair = key;
        else if (key && typeof key === "object" && "key" in key && "value" in key && key.value === null)
          pair = new Pair.Pair(key.key, null);
        else
          pair = new Pair.Pair(key, null);
        const prev = YAMLMap.findPair(this.items, pair.key);
        if (!prev)
          this.items.push(pair);
      }
      /**
       * If `keepPair` is `true`, returns the Pair matching `key`.
       * Otherwise, returns the value of that Pair's key.
       */
      get(key, keepPair) {
        const pair = YAMLMap.findPair(this.items, key);
        return !keepPair && identity.isPair(pair) ? identity.isScalar(pair.key) ? pair.key.value : pair.key : pair;
      }
      set(key, value) {
        if (typeof value !== "boolean")
          throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
        const prev = YAMLMap.findPair(this.items, key);
        if (prev && !value) {
          this.items.splice(this.items.indexOf(prev), 1);
        } else if (!prev && value) {
          this.items.push(new Pair.Pair(key));
        }
      }
      toJSON(_, ctx) {
        return super.toJSON(_, ctx, Set);
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        if (this.hasAllNullValues(true))
          return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
        else
          throw new Error("Set items must all have null values");
      }
      static from(schema, iterable, ctx) {
        const { replacer } = ctx;
        const set3 = new this(schema);
        if (iterable && Symbol.iterator in Object(iterable))
          for (let value of iterable) {
            if (typeof replacer === "function")
              value = replacer.call(iterable, value, value);
            set3.items.push(Pair.createPair(value, null, ctx));
          }
        return set3;
      }
    };
    YAMLSet.tag = "tag:yaml.org,2002:set";
    var set2 = {
      collection: "map",
      identify: (value) => value instanceof Set,
      nodeClass: YAMLSet,
      default: false,
      tag: "tag:yaml.org,2002:set",
      createNode: (schema, iterable, ctx) => YAMLSet.from(schema, iterable, ctx),
      resolve(map, onError) {
        if (identity.isMap(map)) {
          if (map.hasAllNullValues(true))
            return Object.assign(new YAMLSet(), map);
          else
            onError("Set items must all have null values");
        } else
          onError("Expected a mapping for this tag");
        return map;
      }
    };
    exports2.YAMLSet = YAMLSet;
    exports2.set = set2;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/timestamp.js
var require_timestamp = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/timestamp.js"(exports2) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    function parseSexagesimal(str, asBigInt) {
      const sign = str[0];
      const parts = sign === "-" || sign === "+" ? str.substring(1) : str;
      const num = (n) => asBigInt ? BigInt(n) : Number(n);
      const res = parts.replace(/_/g, "").split(":").reduce((res2, p) => res2 * num(60) + num(p), num(0));
      return sign === "-" ? num(-1) * res : res;
    }
    function stringifySexagesimal(node) {
      let { value } = node;
      let num = (n) => n;
      if (typeof value === "bigint")
        num = (n) => BigInt(n);
      else if (isNaN(value) || !isFinite(value))
        return stringifyNumber.stringifyNumber(node);
      let sign = "";
      if (value < 0) {
        sign = "-";
        value *= num(-1);
      }
      const _60 = num(60);
      const parts = [value % _60];
      if (value < 60) {
        parts.unshift(0);
      } else {
        value = (value - parts[0]) / _60;
        parts.unshift(value % _60);
        if (value >= 60) {
          value = (value - parts[0]) / _60;
          parts.unshift(value);
        }
      }
      return sign + parts.map((n) => String(n).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
    }
    var intTime = {
      identify: (value) => typeof value === "bigint" || Number.isInteger(value),
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
      resolve: (str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt),
      stringify: stringifySexagesimal
    };
    var floatTime = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
      resolve: (str) => parseSexagesimal(str, false),
      stringify: stringifySexagesimal
    };
    var timestamp = {
      identify: (value) => value instanceof Date,
      default: true,
      tag: "tag:yaml.org,2002:timestamp",
      // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
      // may be omitted altogether, resulting in a date format. In such a case, the time part is
      // assumed to be 00:00:00Z (start of day, UTC).
      test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
      resolve(str) {
        const match = str.match(timestamp.test);
        if (!match)
          throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
        const [, year, month, day, hour, minute, second] = match.map(Number);
        const millisec = match[7] ? Number((match[7] + "00").substr(1, 3)) : 0;
        let date2 = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
        const tz = match[8];
        if (tz && tz !== "Z") {
          let d = parseSexagesimal(tz, false);
          if (Math.abs(d) < 30)
            d *= 60;
          date2 -= 6e4 * d;
        }
        return new Date(date2);
      },
      stringify: ({ value }) => value?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
    };
    exports2.floatTime = floatTime;
    exports2.intTime = intTime;
    exports2.timestamp = timestamp;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/schema.js
var require_schema3 = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/schema.js"(exports2) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var binary = require_binary();
    var bool = require_bool2();
    var float = require_float2();
    var int = require_int2();
    var merge2 = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var set2 = require_set();
    var timestamp = require_timestamp();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.trueTag,
      bool.falseTag,
      int.intBin,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float,
      binary.binary,
      merge2.merge,
      omap.omap,
      pairs.pairs,
      set2.set,
      timestamp.intTime,
      timestamp.floatTime,
      timestamp.timestamp
    ];
    exports2.schema = schema;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/tags.js
var require_tags = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/tags.js"(exports2) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = require_schema();
    var schema$1 = require_schema2();
    var binary = require_binary();
    var merge2 = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var schema$2 = require_schema3();
    var set2 = require_set();
    var timestamp = require_timestamp();
    var schemas = /* @__PURE__ */ new Map([
      ["core", schema.schema],
      ["failsafe", [map.map, seq.seq, string.string]],
      ["json", schema$1.schema],
      ["yaml11", schema$2.schema],
      ["yaml-1.1", schema$2.schema]
    ]);
    var tagsByName = {
      binary: binary.binary,
      bool: bool.boolTag,
      float: float.float,
      floatExp: float.floatExp,
      floatNaN: float.floatNaN,
      floatTime: timestamp.floatTime,
      int: int.int,
      intHex: int.intHex,
      intOct: int.intOct,
      intTime: timestamp.intTime,
      map: map.map,
      merge: merge2.merge,
      null: _null.nullTag,
      omap: omap.omap,
      pairs: pairs.pairs,
      seq: seq.seq,
      set: set2.set,
      timestamp: timestamp.timestamp
    };
    var coreKnownTags = {
      "tag:yaml.org,2002:binary": binary.binary,
      "tag:yaml.org,2002:merge": merge2.merge,
      "tag:yaml.org,2002:omap": omap.omap,
      "tag:yaml.org,2002:pairs": pairs.pairs,
      "tag:yaml.org,2002:set": set2.set,
      "tag:yaml.org,2002:timestamp": timestamp.timestamp
    };
    function getTags(customTags, schemaName, addMergeTag) {
      const schemaTags = schemas.get(schemaName);
      if (schemaTags && !customTags) {
        return addMergeTag && !schemaTags.includes(merge2.merge) ? schemaTags.concat(merge2.merge) : schemaTags.slice();
      }
      let tags = schemaTags;
      if (!tags) {
        if (Array.isArray(customTags))
          tags = [];
        else {
          const keys = Array.from(schemas.keys()).filter((key) => key !== "yaml11").map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown schema "${schemaName}"; use one of ${keys} or define customTags array`);
        }
      }
      if (Array.isArray(customTags)) {
        for (const tag of customTags)
          tags = tags.concat(tag);
      } else if (typeof customTags === "function") {
        tags = customTags(tags.slice());
      }
      if (addMergeTag)
        tags = tags.concat(merge2.merge);
      return tags.reduce((tags2, tag) => {
        const tagObj = typeof tag === "string" ? tagsByName[tag] : tag;
        if (!tagObj) {
          const tagName = JSON.stringify(tag);
          const keys = Object.keys(tagsByName).map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown custom tag ${tagName}; use one of ${keys}`);
        }
        if (!tags2.includes(tagObj))
          tags2.push(tagObj);
        return tags2;
      }, []);
    }
    exports2.coreKnownTags = coreKnownTags;
    exports2.getTags = getTags;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/Schema.js
var require_Schema = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/Schema.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var map = require_map();
    var seq = require_seq();
    var string = require_string();
    var tags = require_tags();
    var sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
    var Schema2 = class _Schema {
      constructor({ compat, customTags, merge: merge2, resolveKnownTags, schema, sortMapEntries, toStringDefaults }) {
        this.compat = Array.isArray(compat) ? tags.getTags(compat, "compat") : compat ? tags.getTags(null, compat) : null;
        this.name = typeof schema === "string" && schema || "core";
        this.knownTags = resolveKnownTags ? tags.coreKnownTags : {};
        this.tags = tags.getTags(customTags, this.name, merge2);
        this.toStringOptions = toStringDefaults ?? null;
        Object.defineProperty(this, identity.MAP, { value: map.map });
        Object.defineProperty(this, identity.SCALAR, { value: string.string });
        Object.defineProperty(this, identity.SEQ, { value: seq.seq });
        this.sortMapEntries = typeof sortMapEntries === "function" ? sortMapEntries : sortMapEntries === true ? sortMapEntriesByKey : null;
      }
      clone() {
        const copy = Object.create(_Schema.prototype, Object.getOwnPropertyDescriptors(this));
        copy.tags = this.tags.slice();
        return copy;
      }
    };
    exports2.Schema = Schema2;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/stringifyDocument.js
var require_stringifyDocument = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/stringifyDocument.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var stringify2 = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyDocument(doc, options) {
      const lines = [];
      let hasDirectives = options.directives === true;
      if (options.directives !== false && doc.directives) {
        const dir = doc.directives.toString(doc);
        if (dir) {
          lines.push(dir);
          hasDirectives = true;
        } else if (doc.directives.docStart)
          hasDirectives = true;
      }
      if (hasDirectives)
        lines.push("---");
      const ctx = stringify2.createStringifyContext(doc, options);
      const { commentString } = ctx.options;
      if (doc.commentBefore) {
        if (lines.length !== 1)
          lines.unshift("");
        const cs = commentString(doc.commentBefore);
        lines.unshift(stringifyComment.indentComment(cs, ""));
      }
      let chompKeep = false;
      let contentComment = null;
      if (doc.contents) {
        if (identity.isNode(doc.contents)) {
          if (doc.contents.spaceBefore && hasDirectives)
            lines.push("");
          if (doc.contents.commentBefore) {
            const cs = commentString(doc.contents.commentBefore);
            lines.push(stringifyComment.indentComment(cs, ""));
          }
          ctx.forceBlockIndent = !!doc.comment;
          contentComment = doc.contents.comment;
        }
        const onChompKeep = contentComment ? void 0 : () => chompKeep = true;
        let body = stringify2.stringify(doc.contents, ctx, () => contentComment = null, onChompKeep);
        if (contentComment)
          body += stringifyComment.lineComment(body, "", commentString(contentComment));
        if ((body[0] === "|" || body[0] === ">") && lines[lines.length - 1] === "---") {
          lines[lines.length - 1] = `--- ${body}`;
        } else
          lines.push(body);
      } else {
        lines.push(stringify2.stringify(doc.contents, ctx));
      }
      if (doc.directives?.docEnd) {
        if (doc.comment) {
          const cs = commentString(doc.comment);
          if (cs.includes("\n")) {
            lines.push("...");
            lines.push(stringifyComment.indentComment(cs, ""));
          } else {
            lines.push(`... ${cs}`);
          }
        } else {
          lines.push("...");
        }
      } else {
        let dc = doc.comment;
        if (dc && chompKeep)
          dc = dc.replace(/^\n+/, "");
        if (dc) {
          if ((!chompKeep || contentComment) && lines[lines.length - 1] !== "")
            lines.push("");
          lines.push(stringifyComment.indentComment(commentString(dc), ""));
        }
      }
      return lines.join("\n") + "\n";
    }
    exports2.stringifyDocument = stringifyDocument;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/doc/Document.js
var require_Document = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/doc/Document.js"(exports2) {
    "use strict";
    var Alias = require_Alias();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var toJS = require_toJS();
    var Schema2 = require_Schema();
    var stringifyDocument = require_stringifyDocument();
    var anchors = require_anchors();
    var applyReviver = require_applyReviver();
    var createNode = require_createNode();
    var directives = require_directives();
    var Document = class _Document {
      constructor(value, replacer, options) {
        this.commentBefore = null;
        this.comment = null;
        this.errors = [];
        this.warnings = [];
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.DOC });
        let _replacer = null;
        if (typeof replacer === "function" || Array.isArray(replacer)) {
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const opt = Object.assign({
          intAsBigInt: false,
          keepSourceTokens: false,
          logLevel: "warn",
          prettyErrors: true,
          strict: true,
          stringKeys: false,
          uniqueKeys: true,
          version: "1.2"
        }, options);
        this.options = opt;
        let { version } = opt;
        if (options?._directives) {
          this.directives = options._directives.atDocument();
          if (this.directives.yaml.explicit)
            version = this.directives.yaml.version;
        } else
          this.directives = new directives.Directives({ version });
        this.setSchema(version, options);
        this.contents = value === void 0 ? null : this.createNode(value, _replacer, options);
      }
      /**
       * Create a deep copy of this Document and its contents.
       *
       * Custom Node values that inherit from `Object` still refer to their original instances.
       */
      clone() {
        const copy = Object.create(_Document.prototype, {
          [identity.NODE_TYPE]: { value: identity.DOC }
        });
        copy.commentBefore = this.commentBefore;
        copy.comment = this.comment;
        copy.errors = this.errors.slice();
        copy.warnings = this.warnings.slice();
        copy.options = Object.assign({}, this.options);
        if (this.directives)
          copy.directives = this.directives.clone();
        copy.schema = this.schema.clone();
        copy.contents = identity.isNode(this.contents) ? this.contents.clone(copy.schema) : this.contents;
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** Adds a value to the document. */
      add(value) {
        if (assertCollection(this.contents))
          this.contents.add(value);
      }
      /** Adds a value to the document. */
      addIn(path, value) {
        if (assertCollection(this.contents))
          this.contents.addIn(path, value);
      }
      /**
       * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
       *
       * If `node` already has an anchor, `name` is ignored.
       * Otherwise, the `node.anchor` value will be set to `name`,
       * or if an anchor with that name is already present in the document,
       * `name` will be used as a prefix for a new unique anchor.
       * If `name` is undefined, the generated anchor will use 'a' as a prefix.
       */
      createAlias(node, name2) {
        if (!node.anchor) {
          const prev = anchors.anchorNames(this);
          node.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          !name2 || prev.has(name2) ? anchors.findNewAnchor(name2 || "a", prev) : name2;
        }
        return new Alias.Alias(node.anchor);
      }
      createNode(value, replacer, options) {
        let _replacer = void 0;
        if (typeof replacer === "function") {
          value = replacer.call({ "": value }, "", value);
          _replacer = replacer;
        } else if (Array.isArray(replacer)) {
          const keyToStr = (v) => typeof v === "number" || v instanceof String || v instanceof Number;
          const asStr = replacer.filter(keyToStr).map(String);
          if (asStr.length > 0)
            replacer = replacer.concat(asStr);
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options ?? {};
        const { onAnchor, setAnchors, sourceObjects } = anchors.createNodeAnchors(
          this,
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          anchorPrefix || "a"
        );
        const ctx = {
          aliasDuplicateObjects: aliasDuplicateObjects ?? true,
          keepUndefined: keepUndefined ?? false,
          onAnchor,
          onTagObj,
          replacer: _replacer,
          schema: this.schema,
          sourceObjects
        };
        const node = createNode.createNode(value, tag, ctx);
        if (flow && identity.isCollection(node))
          node.flow = true;
        setAnchors();
        return node;
      }
      /**
       * Convert a key and a value into a `Pair` using the current schema,
       * recursively wrapping all values as `Scalar` or `Collection` nodes.
       */
      createPair(key, value, options = {}) {
        const k = this.createNode(key, null, options);
        const v = this.createNode(value, null, options);
        return new Pair.Pair(k, v);
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        return assertCollection(this.contents) ? this.contents.delete(key) : false;
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path) {
        if (Collection.isEmptyPath(path)) {
          if (this.contents == null)
            return false;
          this.contents = null;
          return true;
        }
        return assertCollection(this.contents) ? this.contents.deleteIn(path) : false;
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      get(key, keepScalar) {
        return identity.isCollection(this.contents) ? this.contents.get(key, keepScalar) : void 0;
      }
      /**
       * Returns item at `path`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path, keepScalar) {
        if (Collection.isEmptyPath(path))
          return !keepScalar && identity.isScalar(this.contents) ? this.contents.value : this.contents;
        return identity.isCollection(this.contents) ? this.contents.getIn(path, keepScalar) : void 0;
      }
      /**
       * Checks if the document includes a value with the key `key`.
       */
      has(key) {
        return identity.isCollection(this.contents) ? this.contents.has(key) : false;
      }
      /**
       * Checks if the document includes a value at `path`.
       */
      hasIn(path) {
        if (Collection.isEmptyPath(path))
          return this.contents !== void 0;
        return identity.isCollection(this.contents) ? this.contents.hasIn(path) : false;
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      set(key, value) {
        if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, [key], value);
        } else if (assertCollection(this.contents)) {
          this.contents.set(key, value);
        }
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path, value) {
        if (Collection.isEmptyPath(path)) {
          this.contents = value;
        } else if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, Array.from(path), value);
        } else if (assertCollection(this.contents)) {
          this.contents.setIn(path, value);
        }
      }
      /**
       * Change the YAML version and schema used by the document.
       * A `null` version disables support for directives, explicit tags, anchors, and aliases.
       * It also requires the `schema` option to be given as a `Schema` instance value.
       *
       * Overrides all previously set schema options.
       */
      setSchema(version, options = {}) {
        if (typeof version === "number")
          version = String(version);
        let opt;
        switch (version) {
          case "1.1":
            if (this.directives)
              this.directives.yaml.version = "1.1";
            else
              this.directives = new directives.Directives({ version: "1.1" });
            opt = { resolveKnownTags: false, schema: "yaml-1.1" };
            break;
          case "1.2":
          case "next":
            if (this.directives)
              this.directives.yaml.version = version;
            else
              this.directives = new directives.Directives({ version });
            opt = { resolveKnownTags: true, schema: "core" };
            break;
          case null:
            if (this.directives)
              delete this.directives;
            opt = null;
            break;
          default: {
            const sv = JSON.stringify(version);
            throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
          }
        }
        if (options.schema instanceof Object)
          this.schema = options.schema;
        else if (opt)
          this.schema = new Schema2.Schema(Object.assign(opt, options));
        else
          throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
      }
      // json & jsonArg are only used from toJSON()
      toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc: this,
          keep: !json,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this.contents, jsonArg ?? "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
      /**
       * A JSON representation of the document `contents`.
       *
       * @param jsonArg Used by `JSON.stringify` to indicate the array index or
       *   property name.
       */
      toJSON(jsonArg, onAnchor) {
        return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
      }
      /** A YAML representation of the document. */
      toString(options = {}) {
        if (this.errors.length > 0)
          throw new Error("Document with errors cannot be stringified");
        if ("indent" in options && (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
          const s = JSON.stringify(options.indent);
          throw new Error(`"indent" option must be a positive integer, not ${s}`);
        }
        return stringifyDocument.stringifyDocument(this, options);
      }
    };
    function assertCollection(contents) {
      if (identity.isCollection(contents))
        return true;
      throw new Error("Expected a YAML collection as document contents");
    }
    exports2.Document = Document;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/errors.js
var require_errors = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/errors.js"(exports2) {
    "use strict";
    var YAMLError = class extends Error {
      constructor(name2, pos, code, message) {
        super();
        this.name = name2;
        this.code = code;
        this.message = message;
        this.pos = pos;
      }
    };
    var YAMLParseError = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLParseError", pos, code, message);
      }
    };
    var YAMLWarning = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLWarning", pos, code, message);
      }
    };
    var prettifyError = (src, lc) => (error) => {
      if (error.pos[0] === -1)
        return;
      error.linePos = error.pos.map((pos) => lc.linePos(pos));
      const { line, col } = error.linePos[0];
      error.message += ` at line ${line}, column ${col}`;
      let ci = col - 1;
      let lineStr = src.substring(lc.lineStarts[line - 1], lc.lineStarts[line]).replace(/[\n\r]+$/, "");
      if (ci >= 60 && lineStr.length > 80) {
        const trimStart = Math.min(ci - 39, lineStr.length - 79);
        lineStr = "\u2026" + lineStr.substring(trimStart);
        ci -= trimStart - 1;
      }
      if (lineStr.length > 80)
        lineStr = lineStr.substring(0, 79) + "\u2026";
      if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
        let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
        if (prev.length > 80)
          prev = prev.substring(0, 79) + "\u2026\n";
        lineStr = prev + lineStr;
      }
      if (/[^ ]/.test(lineStr)) {
        let count = 1;
        const end = error.linePos[1];
        if (end?.line === line && end.col > col) {
          count = Math.max(1, Math.min(end.col - col, 80 - ci));
        }
        const pointer = " ".repeat(ci) + "^".repeat(count);
        error.message += `:

${lineStr}
${pointer}
`;
      }
    };
    exports2.YAMLError = YAMLError;
    exports2.YAMLParseError = YAMLParseError;
    exports2.YAMLWarning = YAMLWarning;
    exports2.prettifyError = prettifyError;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/resolve-props.js
var require_resolve_props = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/resolve-props.js"(exports2) {
    "use strict";
    function resolveProps(tokens, { flow, indicator, next, offset, onError, parentIndent, startOnNewline }) {
      let spaceBefore = false;
      let atNewline = startOnNewline;
      let hasSpace = startOnNewline;
      let comment = "";
      let commentSep = "";
      let hasNewline = false;
      let reqSpace = false;
      let tab = null;
      let anchor = null;
      let tag = null;
      let newlineAfterProp = null;
      let comma = null;
      let found = null;
      let start = null;
      for (const token of tokens) {
        if (reqSpace) {
          if (token.type !== "space" && token.type !== "newline" && token.type !== "comma")
            onError(token.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
          reqSpace = false;
        }
        if (tab) {
          if (atNewline && token.type !== "comment" && token.type !== "newline") {
            onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
          }
          tab = null;
        }
        switch (token.type) {
          case "space":
            if (!flow && (indicator !== "doc-start" || next?.type !== "flow-collection") && token.source.includes("	")) {
              tab = token;
            }
            hasSpace = true;
            break;
          case "comment": {
            if (!hasSpace)
              onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
            const cb = token.source.substring(1) || " ";
            if (!comment)
              comment = cb;
            else
              comment += commentSep + cb;
            commentSep = "";
            atNewline = false;
            break;
          }
          case "newline":
            if (atNewline) {
              if (comment)
                comment += token.source;
              else if (!found || indicator !== "seq-item-ind")
                spaceBefore = true;
            } else
              commentSep += token.source;
            atNewline = true;
            hasNewline = true;
            if (anchor || tag)
              newlineAfterProp = token;
            hasSpace = true;
            break;
          case "anchor":
            if (anchor)
              onError(token, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
            if (token.source.endsWith(":"))
              onError(token.offset + token.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", true);
            anchor = token;
            start ?? (start = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          case "tag": {
            if (tag)
              onError(token, "MULTIPLE_TAGS", "A node can have at most one tag");
            tag = token;
            start ?? (start = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          }
          case indicator:
            if (anchor || tag)
              onError(token, "BAD_PROP_ORDER", `Anchors and tags must be after the ${token.source} indicator`);
            if (found)
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.source} in ${flow ?? "collection"}`);
            found = token;
            atNewline = indicator === "seq-item-ind" || indicator === "explicit-key-ind";
            hasSpace = false;
            break;
          case "comma":
            if (flow) {
              if (comma)
                onError(token, "UNEXPECTED_TOKEN", `Unexpected , in ${flow}`);
              comma = token;
              atNewline = false;
              hasSpace = false;
              break;
            }
          // else fallthrough
          default:
            onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.type} token`);
            atNewline = false;
            hasSpace = false;
        }
      }
      const last = tokens[tokens.length - 1];
      const end = last ? last.offset + last.source.length : offset;
      if (reqSpace && next && next.type !== "space" && next.type !== "newline" && next.type !== "comma" && (next.type !== "scalar" || next.source !== "")) {
        onError(next.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
      }
      if (tab && (atNewline && tab.indent <= parentIndent || next?.type === "block-map" || next?.type === "block-seq"))
        onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
      return {
        comma,
        found,
        spaceBefore,
        comment,
        hasNewline,
        anchor,
        tag,
        newlineAfterProp,
        end,
        start: start ?? end
      };
    }
    exports2.resolveProps = resolveProps;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/util-contains-newline.js
var require_util_contains_newline = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/util-contains-newline.js"(exports2) {
    "use strict";
    function containsNewline(key) {
      if (!key)
        return null;
      switch (key.type) {
        case "alias":
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          if (key.source.includes("\n"))
            return true;
          if (key.end) {
            for (const st of key.end)
              if (st.type === "newline")
                return true;
          }
          return false;
        case "flow-collection":
          for (const it of key.items) {
            for (const st of it.start)
              if (st.type === "newline")
                return true;
            if (it.sep) {
              for (const st of it.sep)
                if (st.type === "newline")
                  return true;
            }
            if (containsNewline(it.key) || containsNewline(it.value))
              return true;
          }
          return false;
        default:
          return true;
      }
    }
    exports2.containsNewline = containsNewline;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/util-flow-indent-check.js
var require_util_flow_indent_check = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/util-flow-indent-check.js"(exports2) {
    "use strict";
    var utilContainsNewline = require_util_contains_newline();
    function flowIndentCheck(indent, fc, onError) {
      if (fc?.type === "flow-collection") {
        const end = fc.end[0];
        if (end.indent === indent && (end.source === "]" || end.source === "}") && utilContainsNewline.containsNewline(fc)) {
          const msg = "Flow end indicator should be more indented than parent";
          onError(end, "BAD_INDENT", msg, true);
        }
      }
    }
    exports2.flowIndentCheck = flowIndentCheck;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/util-map-includes.js
var require_util_map_includes = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/util-map-includes.js"(exports2) {
    "use strict";
    var identity = require_identity();
    function mapIncludes(ctx, items, search) {
      const { uniqueKeys } = ctx.options;
      if (uniqueKeys === false)
        return false;
      const isEqual = typeof uniqueKeys === "function" ? uniqueKeys : (a, b) => a === b || identity.isScalar(a) && identity.isScalar(b) && a.value === b.value;
      return items.some((pair) => isEqual(pair.key, search));
    }
    exports2.mapIncludes = mapIncludes;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/resolve-block-map.js
var require_resolve_block_map = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/resolve-block-map.js"(exports2) {
    "use strict";
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    var utilMapIncludes = require_util_map_includes();
    var startColMsg = "All mapping items must start at the same column";
    function resolveBlockMap({ composeNode, composeEmptyNode }, ctx, bm, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLMap.YAMLMap;
      const map = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      let offset = bm.offset;
      let commentEnd = null;
      for (const collItem of bm.items) {
        const { start, key, sep, value } = collItem;
        const keyProps = resolveProps.resolveProps(start, {
          indicator: "explicit-key-ind",
          next: key ?? sep?.[0],
          offset,
          onError,
          parentIndent: bm.indent,
          startOnNewline: true
        });
        const implicitKey = !keyProps.found;
        if (implicitKey) {
          if (key) {
            if (key.type === "block-seq")
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
            else if ("indent" in key && key.indent !== bm.indent)
              onError(offset, "BAD_INDENT", startColMsg);
          }
          if (!keyProps.anchor && !keyProps.tag && !sep) {
            commentEnd = keyProps.end;
            if (keyProps.comment) {
              if (map.comment)
                map.comment += "\n" + keyProps.comment;
              else
                map.comment = keyProps.comment;
            }
            continue;
          }
          if (keyProps.newlineAfterProp || utilContainsNewline.containsNewline(key)) {
            onError(key ?? start[start.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
          }
        } else if (keyProps.found?.indent !== bm.indent) {
          onError(offset, "BAD_INDENT", startColMsg);
        }
        ctx.atKey = true;
        const keyStart = keyProps.end;
        const keyNode = key ? composeNode(ctx, key, keyProps, onError) : composeEmptyNode(ctx, keyStart, start, null, keyProps, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bm.indent, key, onError);
        ctx.atKey = false;
        if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
          onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
        const valueProps = resolveProps.resolveProps(sep ?? [], {
          indicator: "map-value-ind",
          next: value,
          offset: keyNode.range[2],
          onError,
          parentIndent: bm.indent,
          startOnNewline: !key || key.type === "block-scalar"
        });
        offset = valueProps.end;
        if (valueProps.found) {
          if (implicitKey) {
            if (value?.type === "block-map" && !valueProps.hasNewline)
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
            if (ctx.options.strict && keyProps.start < valueProps.found.offset - 1024)
              onError(keyNode.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key");
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : composeEmptyNode(ctx, offset, sep, null, valueProps, onError);
          if (ctx.schema.compat)
            utilFlowIndentCheck.flowIndentCheck(bm.indent, value, onError);
          offset = valueNode.range[2];
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        } else {
          if (implicitKey)
            onError(keyNode.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
          if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        }
      }
      if (commentEnd && commentEnd < offset)
        onError(commentEnd, "IMPOSSIBLE", "Map comment with trailing content");
      map.range = [bm.offset, offset, commentEnd ?? offset];
      return map;
    }
    exports2.resolveBlockMap = resolveBlockMap;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/resolve-block-seq.js
var require_resolve_block_seq = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/resolve-block-seq.js"(exports2) {
    "use strict";
    var YAMLSeq = require_YAMLSeq();
    var resolveProps = require_resolve_props();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    function resolveBlockSeq({ composeNode, composeEmptyNode }, ctx, bs, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLSeq.YAMLSeq;
      const seq = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = bs.offset;
      let commentEnd = null;
      for (const { start, value } of bs.items) {
        const props = resolveProps.resolveProps(start, {
          indicator: "seq-item-ind",
          next: value,
          offset,
          onError,
          parentIndent: bs.indent,
          startOnNewline: true
        });
        if (!props.found) {
          if (props.anchor || props.tag || value) {
            if (value?.type === "block-seq")
              onError(props.end, "BAD_INDENT", "All sequence items must start at the same column");
            else
              onError(offset, "MISSING_CHAR", "Sequence item without - indicator");
          } else {
            commentEnd = props.end;
            if (props.comment)
              seq.comment = props.comment;
            continue;
          }
        }
        const node = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, start, null, props, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bs.indent, value, onError);
        offset = node.range[2];
        seq.items.push(node);
      }
      seq.range = [bs.offset, offset, commentEnd ?? offset];
      return seq;
    }
    exports2.resolveBlockSeq = resolveBlockSeq;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/resolve-end.js
var require_resolve_end = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/resolve-end.js"(exports2) {
    "use strict";
    function resolveEnd(end, offset, reqSpace, onError) {
      let comment = "";
      if (end) {
        let hasSpace = false;
        let sep = "";
        for (const token of end) {
          const { source, type } = token;
          switch (type) {
            case "space":
              hasSpace = true;
              break;
            case "comment": {
              if (reqSpace && !hasSpace)
                onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
              const cb = source.substring(1) || " ";
              if (!comment)
                comment = cb;
              else
                comment += sep + cb;
              sep = "";
              break;
            }
            case "newline":
              if (comment)
                sep += source;
              hasSpace = true;
              break;
            default:
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${type} at node end`);
          }
          offset += source.length;
        }
      }
      return { comment, offset };
    }
    exports2.resolveEnd = resolveEnd;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/resolve-flow-collection.js
var require_resolve_flow_collection = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/resolve-flow-collection.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilMapIncludes = require_util_map_includes();
    var blockMsg = "Block collections are not allowed within flow collections";
    var isBlock = (token) => token && (token.type === "block-map" || token.type === "block-seq");
    function resolveFlowCollection({ composeNode, composeEmptyNode }, ctx, fc, onError, tag) {
      const isMap = fc.start.source === "{";
      const fcName = isMap ? "flow map" : "flow sequence";
      const NodeClass = tag?.nodeClass ?? (isMap ? YAMLMap.YAMLMap : YAMLSeq.YAMLSeq);
      const coll = new NodeClass(ctx.schema);
      coll.flow = true;
      const atRoot = ctx.atRoot;
      if (atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = fc.offset + fc.start.source.length;
      for (let i = 0; i < fc.items.length; ++i) {
        const collItem = fc.items[i];
        const { start, key, sep, value } = collItem;
        const props = resolveProps.resolveProps(start, {
          flow: fcName,
          indicator: "explicit-key-ind",
          next: key ?? sep?.[0],
          offset,
          onError,
          parentIndent: fc.indent,
          startOnNewline: false
        });
        if (!props.found) {
          if (!props.anchor && !props.tag && !sep && !value) {
            if (i === 0 && props.comma)
              onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
            else if (i < fc.items.length - 1)
              onError(props.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${fcName}`);
            if (props.comment) {
              if (coll.comment)
                coll.comment += "\n" + props.comment;
              else
                coll.comment = props.comment;
            }
            offset = props.end;
            continue;
          }
          if (!isMap && ctx.options.strict && utilContainsNewline.containsNewline(key))
            onError(
              key,
              // checked by containsNewline()
              "MULTILINE_IMPLICIT_KEY",
              "Implicit keys of flow sequence pairs need to be on a single line"
            );
        }
        if (i === 0) {
          if (props.comma)
            onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
        } else {
          if (!props.comma)
            onError(props.start, "MISSING_CHAR", `Missing , between ${fcName} items`);
          if (props.comment) {
            let prevItemComment = "";
            loop: for (const st of start) {
              switch (st.type) {
                case "comma":
                case "space":
                  break;
                case "comment":
                  prevItemComment = st.source.substring(1);
                  break loop;
                default:
                  break loop;
              }
            }
            if (prevItemComment) {
              let prev = coll.items[coll.items.length - 1];
              if (identity.isPair(prev))
                prev = prev.value ?? prev.key;
              if (prev.comment)
                prev.comment += "\n" + prevItemComment;
              else
                prev.comment = prevItemComment;
              props.comment = props.comment.substring(prevItemComment.length + 1);
            }
          }
        }
        if (!isMap && !sep && !props.found) {
          const valueNode = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, sep, null, props, onError);
          coll.items.push(valueNode);
          offset = valueNode.range[2];
          if (isBlock(value))
            onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
        } else {
          ctx.atKey = true;
          const keyStart = props.end;
          const keyNode = key ? composeNode(ctx, key, props, onError) : composeEmptyNode(ctx, keyStart, start, null, props, onError);
          if (isBlock(key))
            onError(keyNode.range, "BLOCK_IN_FLOW", blockMsg);
          ctx.atKey = false;
          const valueProps = resolveProps.resolveProps(sep ?? [], {
            flow: fcName,
            indicator: "map-value-ind",
            next: value,
            offset: keyNode.range[2],
            onError,
            parentIndent: fc.indent,
            startOnNewline: false
          });
          if (valueProps.found) {
            if (!isMap && !props.found && ctx.options.strict) {
              if (sep)
                for (const st of sep) {
                  if (st === valueProps.found)
                    break;
                  if (st.type === "newline") {
                    onError(st, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                    break;
                  }
                }
              if (props.start < valueProps.found.offset - 1024)
                onError(valueProps.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
            }
          } else if (value) {
            if ("source" in value && value.source?.[0] === ":")
              onError(value, "MISSING_CHAR", `Missing space after : in ${fcName}`);
            else
              onError(valueProps.start, "MISSING_CHAR", `Missing , or : between ${fcName} items`);
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : valueProps.found ? composeEmptyNode(ctx, valueProps.end, sep, null, valueProps, onError) : null;
          if (valueNode) {
            if (isBlock(value))
              onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
          } else if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          if (isMap) {
            const map = coll;
            if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
              onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
            map.items.push(pair);
          } else {
            const map = new YAMLMap.YAMLMap(ctx.schema);
            map.flow = true;
            map.items.push(pair);
            const endRange = (valueNode ?? keyNode).range;
            map.range = [keyNode.range[0], endRange[1], endRange[2]];
            coll.items.push(map);
          }
          offset = valueNode ? valueNode.range[2] : valueProps.end;
        }
      }
      const expectedEnd = isMap ? "}" : "]";
      const [ce, ...ee] = fc.end;
      let cePos = offset;
      if (ce?.source === expectedEnd)
        cePos = ce.offset + ce.source.length;
      else {
        const name2 = fcName[0].toUpperCase() + fcName.substring(1);
        const msg = atRoot ? `${name2} must end with a ${expectedEnd}` : `${name2} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
        onError(offset, atRoot ? "MISSING_CHAR" : "BAD_INDENT", msg);
        if (ce && ce.source.length !== 1)
          ee.unshift(ce);
      }
      if (ee.length > 0) {
        const end = resolveEnd.resolveEnd(ee, cePos, ctx.options.strict, onError);
        if (end.comment) {
          if (coll.comment)
            coll.comment += "\n" + end.comment;
          else
            coll.comment = end.comment;
        }
        coll.range = [fc.offset, cePos, end.offset];
      } else {
        coll.range = [fc.offset, cePos, cePos];
      }
      return coll;
    }
    exports2.resolveFlowCollection = resolveFlowCollection;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/compose-collection.js
var require_compose_collection = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/compose-collection.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveBlockMap = require_resolve_block_map();
    var resolveBlockSeq = require_resolve_block_seq();
    var resolveFlowCollection = require_resolve_flow_collection();
    function resolveCollection(CN, ctx, token, onError, tagName, tag) {
      const coll = token.type === "block-map" ? resolveBlockMap.resolveBlockMap(CN, ctx, token, onError, tag) : token.type === "block-seq" ? resolveBlockSeq.resolveBlockSeq(CN, ctx, token, onError, tag) : resolveFlowCollection.resolveFlowCollection(CN, ctx, token, onError, tag);
      const Coll = coll.constructor;
      if (tagName === "!" || tagName === Coll.tagName) {
        coll.tag = Coll.tagName;
        return coll;
      }
      if (tagName)
        coll.tag = tagName;
      return coll;
    }
    function composeCollection(CN, ctx, token, props, onError) {
      const tagToken = props.tag;
      const tagName = !tagToken ? null : ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg));
      if (token.type === "block-seq") {
        const { anchor, newlineAfterProp: nl } = props;
        const lastProp = anchor && tagToken ? anchor.offset > tagToken.offset ? anchor : tagToken : anchor ?? tagToken;
        if (lastProp && (!nl || nl.offset < lastProp.offset)) {
          const message = "Missing newline after block sequence props";
          onError(lastProp, "MISSING_CHAR", message);
        }
      }
      const expType = token.type === "block-map" ? "map" : token.type === "block-seq" ? "seq" : token.start.source === "{" ? "map" : "seq";
      if (!tagToken || !tagName || tagName === "!" || tagName === YAMLMap.YAMLMap.tagName && expType === "map" || tagName === YAMLSeq.YAMLSeq.tagName && expType === "seq") {
        return resolveCollection(CN, ctx, token, onError, tagName);
      }
      let tag = ctx.schema.tags.find((t) => t.tag === tagName && t.collection === expType);
      if (!tag) {
        const kt = ctx.schema.knownTags[tagName];
        if (kt?.collection === expType) {
          ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
          tag = kt;
        } else {
          if (kt) {
            onError(tagToken, "BAD_COLLECTION_TYPE", `${kt.tag} used for ${expType} collection, but expects ${kt.collection ?? "scalar"}`, true);
          } else {
            onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, true);
          }
          return resolveCollection(CN, ctx, token, onError, tagName);
        }
      }
      const coll = resolveCollection(CN, ctx, token, onError, tagName, tag);
      const res = tag.resolve?.(coll, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg), ctx.options) ?? coll;
      const node = identity.isNode(res) ? res : new Scalar.Scalar(res);
      node.range = coll.range;
      node.tag = tagName;
      if (tag?.format)
        node.format = tag.format;
      return node;
    }
    exports2.composeCollection = composeCollection;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/resolve-block-scalar.js
var require_resolve_block_scalar = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/resolve-block-scalar.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    function resolveBlockScalar(ctx, scalar, onError) {
      const start = scalar.offset;
      const header = parseBlockScalarHeader(scalar, ctx.options.strict, onError);
      if (!header)
        return { value: "", type: null, comment: "", range: [start, start, start] };
      const type = header.mode === ">" ? Scalar.Scalar.BLOCK_FOLDED : Scalar.Scalar.BLOCK_LITERAL;
      const lines = scalar.source ? splitLines(scalar.source) : [];
      let chompStart = lines.length;
      for (let i = lines.length - 1; i >= 0; --i) {
        const content = lines[i][1];
        if (content === "" || content === "\r")
          chompStart = i;
        else
          break;
      }
      if (chompStart === 0) {
        const value2 = header.chomp === "+" && lines.length > 0 ? "\n".repeat(Math.max(1, lines.length - 1)) : "";
        let end2 = start + header.length;
        if (scalar.source)
          end2 += scalar.source.length;
        return { value: value2, type, comment: header.comment, range: [start, end2, end2] };
      }
      let trimIndent = scalar.indent + header.indent;
      let offset = scalar.offset + header.length;
      let contentStart = 0;
      for (let i = 0; i < chompStart; ++i) {
        const [indent, content] = lines[i];
        if (content === "" || content === "\r") {
          if (header.indent === 0 && indent.length > trimIndent)
            trimIndent = indent.length;
        } else {
          if (indent.length < trimIndent) {
            const message = "Block scalars with more-indented leading empty lines must use an explicit indentation indicator";
            onError(offset + indent.length, "MISSING_CHAR", message);
          }
          if (header.indent === 0)
            trimIndent = indent.length;
          contentStart = i;
          if (trimIndent === 0 && !ctx.atRoot) {
            const message = "Block scalar values in collections must be indented";
            onError(offset, "BAD_INDENT", message);
          }
          break;
        }
        offset += indent.length + content.length + 1;
      }
      for (let i = lines.length - 1; i >= chompStart; --i) {
        if (lines[i][0].length > trimIndent)
          chompStart = i + 1;
      }
      let value = "";
      let sep = "";
      let prevMoreIndented = false;
      for (let i = 0; i < contentStart; ++i)
        value += lines[i][0].slice(trimIndent) + "\n";
      for (let i = contentStart; i < chompStart; ++i) {
        let [indent, content] = lines[i];
        offset += indent.length + content.length + 1;
        const crlf = content[content.length - 1] === "\r";
        if (crlf)
          content = content.slice(0, -1);
        if (content && indent.length < trimIndent) {
          const src = header.indent ? "explicit indentation indicator" : "first line";
          const message = `Block scalar lines must not be less indented than their ${src}`;
          onError(offset - content.length - (crlf ? 2 : 1), "BAD_INDENT", message);
          indent = "";
        }
        if (type === Scalar.Scalar.BLOCK_LITERAL) {
          value += sep + indent.slice(trimIndent) + content;
          sep = "\n";
        } else if (indent.length > trimIndent || content[0] === "	") {
          if (sep === " ")
            sep = "\n";
          else if (!prevMoreIndented && sep === "\n")
            sep = "\n\n";
          value += sep + indent.slice(trimIndent) + content;
          sep = "\n";
          prevMoreIndented = true;
        } else if (content === "") {
          if (sep === "\n")
            value += "\n";
          else
            sep = "\n";
        } else {
          value += sep + content;
          sep = " ";
          prevMoreIndented = false;
        }
      }
      switch (header.chomp) {
        case "-":
          break;
        case "+":
          for (let i = chompStart; i < lines.length; ++i)
            value += "\n" + lines[i][0].slice(trimIndent);
          if (value[value.length - 1] !== "\n")
            value += "\n";
          break;
        default:
          value += "\n";
      }
      const end = start + header.length + scalar.source.length;
      return { value, type, comment: header.comment, range: [start, end, end] };
    }
    function parseBlockScalarHeader({ offset, props }, strict, onError) {
      if (props[0].type !== "block-scalar-header") {
        onError(props[0], "IMPOSSIBLE", "Block scalar header not found");
        return null;
      }
      const { source } = props[0];
      const mode = source[0];
      let indent = 0;
      let chomp = "";
      let error = -1;
      for (let i = 1; i < source.length; ++i) {
        const ch = source[i];
        if (!chomp && (ch === "-" || ch === "+"))
          chomp = ch;
        else {
          const n = Number(ch);
          if (!indent && n)
            indent = n;
          else if (error === -1)
            error = offset + i;
        }
      }
      if (error !== -1)
        onError(error, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${source}`);
      let hasSpace = false;
      let comment = "";
      let length = source.length;
      for (let i = 1; i < props.length; ++i) {
        const token = props[i];
        switch (token.type) {
          case "space":
            hasSpace = true;
          // fallthrough
          case "newline":
            length += token.source.length;
            break;
          case "comment":
            if (strict && !hasSpace) {
              const message = "Comments must be separated from other tokens by white space characters";
              onError(token, "MISSING_CHAR", message);
            }
            length += token.source.length;
            comment = token.source.substring(1);
            break;
          case "error":
            onError(token, "UNEXPECTED_TOKEN", token.message);
            length += token.source.length;
            break;
          /* istanbul ignore next should not happen */
          default: {
            const message = `Unexpected token in block scalar header: ${token.type}`;
            onError(token, "UNEXPECTED_TOKEN", message);
            const ts = token.source;
            if (ts && typeof ts === "string")
              length += ts.length;
          }
        }
      }
      return { mode, indent, chomp, comment, length };
    }
    function splitLines(source) {
      const split = source.split(/\n( *)/);
      const first = split[0];
      const m = first.match(/^( *)/);
      const line0 = m?.[1] ? [m[1], first.slice(m[1].length)] : ["", first];
      const lines = [line0];
      for (let i = 1; i < split.length; i += 2)
        lines.push([split[i], split[i + 1]]);
      return lines;
    }
    exports2.resolveBlockScalar = resolveBlockScalar;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/resolve-flow-scalar.js
var require_resolve_flow_scalar = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/resolve-flow-scalar.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    var resolveEnd = require_resolve_end();
    function resolveFlowScalar(scalar, strict, onError) {
      const { offset, type, source, end } = scalar;
      let _type;
      let value;
      const _onError = (rel, code, msg) => onError(offset + rel, code, msg);
      switch (type) {
        case "scalar":
          _type = Scalar.Scalar.PLAIN;
          value = plainValue(source, _onError);
          break;
        case "single-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_SINGLE;
          value = singleQuotedValue(source, _onError);
          break;
        case "double-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_DOUBLE;
          value = doubleQuotedValue(source, _onError);
          break;
        /* istanbul ignore next should not happen */
        default:
          onError(scalar, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${type}`);
          return {
            value: "",
            type: null,
            comment: "",
            range: [offset, offset + source.length, offset + source.length]
          };
      }
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, strict, onError);
      return {
        value,
        type: _type,
        comment: re.comment,
        range: [offset, valueEnd, re.offset]
      };
    }
    function plainValue(source, onError) {
      let badChar = "";
      switch (source[0]) {
        /* istanbul ignore next should not happen */
        case "	":
          badChar = "a tab character";
          break;
        case ",":
          badChar = "flow indicator character ,";
          break;
        case "%":
          badChar = "directive indicator character %";
          break;
        case "|":
        case ">": {
          badChar = `block scalar indicator ${source[0]}`;
          break;
        }
        case "@":
        case "`": {
          badChar = `reserved character ${source[0]}`;
          break;
        }
      }
      if (badChar)
        onError(0, "BAD_SCALAR_START", `Plain value cannot start with ${badChar}`);
      return unfoldLines(source);
    }
    function singleQuotedValue(source, onError) {
      if (source[source.length - 1] !== "'" || source.length === 1)
        onError(source.length, "MISSING_CHAR", "Missing closing 'quote");
      return unfoldLines(source.slice(1, -1)).replace(/''/g, "'");
    }
    function unfoldLines(source) {
      const line = /(.*?)\r?\n/sy;
      let match = line.exec(source);
      if (!match)
        return source;
      let trimEnd, trimBoth;
      try {
        trimEnd = new RegExp("(?<![ 	])[ 	]+$");
        trimBoth = new RegExp("^[ 	]+|(?<![ 	])[ 	]+$", "g");
      } catch {
        trimEnd = /[ \t]+$/;
        trimBoth = /^[ \t]+|[ \t]+$/g;
      }
      let res = match[1].replace(trimEnd, "");
      let sep = " ";
      let pos = line.lastIndex;
      while (match = line.exec(source)) {
        const lm = match[1].replace(trimBoth, "");
        if (lm === "") {
          if (sep === "\n")
            res += sep;
          else
            sep = "\n";
        } else {
          res += sep + lm;
          sep = " ";
        }
        pos = line.lastIndex;
      }
      const last = /[ \t]*(.*)/sy;
      last.lastIndex = pos;
      match = last.exec(source);
      return res + sep + (match?.[1] ?? "");
    }
    function doubleQuotedValue(source, onError) {
      let res = "";
      for (let i = 1; i < source.length - 1; ++i) {
        const ch = source[i];
        if (ch === "\r" && source[i + 1] === "\n")
          continue;
        if (ch === "\n") {
          const { fold, offset } = foldNewline(source, i);
          res += fold;
          i = offset;
        } else if (ch === "\\") {
          let next = source[++i];
          const cc = escapeCodes[next];
          if (cc)
            res += cc;
          else if (next === "\n") {
            next = source[i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "\r" && source[i + 1] === "\n") {
            next = source[++i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "x" || next === "u" || next === "U") {
            const length = next === "x" ? 2 : next === "u" ? 4 : 8;
            res += parseCharCode(source, i + 1, length, onError);
            i += length;
          } else {
            const raw = source.substr(i - 1, 2);
            onError(i - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
            res += raw;
          }
        } else if (ch === " " || ch === "	") {
          const wsStart = i;
          let next = source[i + 1];
          while (next === " " || next === "	")
            next = source[++i + 1];
          if (next !== "\n" && !(next === "\r" && source[i + 2] === "\n"))
            res += i > wsStart ? source.slice(wsStart, i + 1) : ch;
        } else {
          res += ch;
        }
      }
      if (source[source.length - 1] !== '"' || source.length === 1)
        onError(source.length, "MISSING_CHAR", 'Missing closing "quote');
      return res;
    }
    function foldNewline(source, offset) {
      let fold = "";
      let ch = source[offset + 1];
      while (ch === " " || ch === "	" || ch === "\n" || ch === "\r") {
        if (ch === "\r" && source[offset + 2] !== "\n")
          break;
        if (ch === "\n")
          fold += "\n";
        offset += 1;
        ch = source[offset + 1];
      }
      if (!fold)
        fold = " ";
      return { fold, offset };
    }
    var escapeCodes = {
      "0": "\0",
      // null character
      a: "\x07",
      // bell character
      b: "\b",
      // backspace
      e: "\x1B",
      // escape character
      f: "\f",
      // form feed
      n: "\n",
      // line feed
      r: "\r",
      // carriage return
      t: "	",
      // horizontal tab
      v: "\v",
      // vertical tab
      N: "\x85",
      // Unicode next line
      _: "\xA0",
      // Unicode non-breaking space
      L: "\u2028",
      // Unicode line separator
      P: "\u2029",
      // Unicode paragraph separator
      " ": " ",
      '"': '"',
      "/": "/",
      "\\": "\\",
      "	": "	"
    };
    function parseCharCode(source, offset, length, onError) {
      const cc = source.substr(offset, length);
      const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
      const code = ok ? parseInt(cc, 16) : NaN;
      try {
        return String.fromCodePoint(code);
      } catch {
        const raw = source.substr(offset - 2, length + 2);
        onError(offset - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
        return raw;
      }
    }
    exports2.resolveFlowScalar = resolveFlowScalar;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/compose-scalar.js
var require_compose_scalar = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/compose-scalar.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    function composeScalar(ctx, token, tagToken, onError) {
      const { value, type, comment, range } = token.type === "block-scalar" ? resolveBlockScalar.resolveBlockScalar(ctx, token, onError) : resolveFlowScalar.resolveFlowScalar(token, ctx.options.strict, onError);
      const tagName = tagToken ? ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg)) : null;
      let tag;
      if (ctx.options.stringKeys && ctx.atKey) {
        tag = ctx.schema[identity.SCALAR];
      } else if (tagName)
        tag = findScalarTagByName(ctx.schema, value, tagName, tagToken, onError);
      else if (token.type === "scalar")
        tag = findScalarTagByTest(ctx, value, token, onError);
      else
        tag = ctx.schema[identity.SCALAR];
      let scalar;
      try {
        const res = tag.resolve(value, (msg) => onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg), ctx.options);
        scalar = identity.isScalar(res) ? res : new Scalar.Scalar(res);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg);
        scalar = new Scalar.Scalar(value);
      }
      scalar.range = range;
      scalar.source = value;
      if (type)
        scalar.type = type;
      if (tagName)
        scalar.tag = tagName;
      if (tag.format)
        scalar.format = tag.format;
      if (comment)
        scalar.comment = comment;
      return scalar;
    }
    function findScalarTagByName(schema, value, tagName, tagToken, onError) {
      if (tagName === "!")
        return schema[identity.SCALAR];
      const matchWithTest = [];
      for (const tag of schema.tags) {
        if (!tag.collection && tag.tag === tagName) {
          if (tag.default && tag.test)
            matchWithTest.push(tag);
          else
            return tag;
        }
      }
      for (const tag of matchWithTest)
        if (tag.test?.test(value))
          return tag;
      const kt = schema.knownTags[tagName];
      if (kt && !kt.collection) {
        schema.tags.push(Object.assign({}, kt, { default: false, test: void 0 }));
        return kt;
      }
      onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, tagName !== "tag:yaml.org,2002:str");
      return schema[identity.SCALAR];
    }
    function findScalarTagByTest({ atKey, directives, schema }, value, token, onError) {
      const tag = schema.tags.find((tag2) => (tag2.default === true || atKey && tag2.default === "key") && tag2.test?.test(value)) || schema[identity.SCALAR];
      if (schema.compat) {
        const compat = schema.compat.find((tag2) => tag2.default && tag2.test?.test(value)) ?? schema[identity.SCALAR];
        if (tag.tag !== compat.tag) {
          const ts = directives.tagString(tag.tag);
          const cs = directives.tagString(compat.tag);
          const msg = `Value may be parsed as either ${ts} or ${cs}`;
          onError(token, "TAG_RESOLVE_FAILED", msg, true);
        }
      }
      return tag;
    }
    exports2.composeScalar = composeScalar;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/util-empty-scalar-position.js
var require_util_empty_scalar_position = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/util-empty-scalar-position.js"(exports2) {
    "use strict";
    function emptyScalarPosition(offset, before, pos) {
      if (before) {
        pos ?? (pos = before.length);
        for (let i = pos - 1; i >= 0; --i) {
          let st = before[i];
          switch (st.type) {
            case "space":
            case "comment":
            case "newline":
              offset -= st.source.length;
              continue;
          }
          st = before[++i];
          while (st?.type === "space") {
            offset += st.source.length;
            st = before[++i];
          }
          break;
        }
      }
      return offset;
    }
    exports2.emptyScalarPosition = emptyScalarPosition;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/compose-node.js
var require_compose_node = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/compose-node.js"(exports2) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var composeCollection = require_compose_collection();
    var composeScalar = require_compose_scalar();
    var resolveEnd = require_resolve_end();
    var utilEmptyScalarPosition = require_util_empty_scalar_position();
    var CN = { composeNode, composeEmptyNode };
    function composeNode(ctx, token, props, onError) {
      const atKey = ctx.atKey;
      const { spaceBefore, comment, anchor, tag } = props;
      let node;
      let isSrcToken = true;
      switch (token.type) {
        case "alias":
          node = composeAlias(ctx, token, onError);
          if (anchor || tag)
            onError(token, "ALIAS_PROPS", "An alias node must not specify any properties");
          break;
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "block-scalar":
          node = composeScalar.composeScalar(ctx, token, tag, onError);
          if (anchor)
            node.anchor = anchor.source.substring(1);
          break;
        case "block-map":
        case "block-seq":
        case "flow-collection":
          try {
            node = composeCollection.composeCollection(CN, ctx, token, props, onError);
            if (anchor)
              node.anchor = anchor.source.substring(1);
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            onError(token, "RESOURCE_EXHAUSTION", message);
          }
          break;
        default: {
          const message = token.type === "error" ? token.message : `Unsupported token (type: ${token.type})`;
          onError(token, "UNEXPECTED_TOKEN", message);
          isSrcToken = false;
        }
      }
      node ?? (node = composeEmptyNode(ctx, token.offset, void 0, null, props, onError));
      if (anchor && node.anchor === "")
        onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      if (atKey && ctx.options.stringKeys && (!identity.isScalar(node) || typeof node.value !== "string" || node.tag && node.tag !== "tag:yaml.org,2002:str")) {
        const msg = "With stringKeys, all keys must be strings";
        onError(tag ?? token, "NON_STRING_KEY", msg);
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        if (token.type === "scalar" && token.source === "")
          node.comment = comment;
        else
          node.commentBefore = comment;
      }
      if (ctx.options.keepSourceTokens && isSrcToken)
        node.srcToken = token;
      return node;
    }
    function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag, end }, onError) {
      const token = {
        type: "scalar",
        offset: utilEmptyScalarPosition.emptyScalarPosition(offset, before, pos),
        indent: -1,
        source: ""
      };
      const node = composeScalar.composeScalar(ctx, token, tag, onError);
      if (anchor) {
        node.anchor = anchor.source.substring(1);
        if (node.anchor === "")
          onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        node.comment = comment;
        node.range[2] = end;
      }
      return node;
    }
    function composeAlias({ options }, { offset, source, end }, onError) {
      const alias = new Alias.Alias(source.substring(1));
      if (alias.source === "")
        onError(offset, "BAD_ALIAS", "Alias cannot be an empty string");
      if (alias.source.endsWith(":"))
        onError(offset + source.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", true);
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, options.strict, onError);
      alias.range = [offset, valueEnd, re.offset];
      if (re.comment)
        alias.comment = re.comment;
      return alias;
    }
    exports2.composeEmptyNode = composeEmptyNode;
    exports2.composeNode = composeNode;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/compose-doc.js
var require_compose_doc = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/compose-doc.js"(exports2) {
    "use strict";
    var Document = require_Document();
    var composeNode = require_compose_node();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    function composeDoc(options, directives, { offset, start, value, end }, onError) {
      const opts = Object.assign({ _directives: directives }, options);
      const doc = new Document.Document(void 0, opts);
      const ctx = {
        atKey: false,
        atRoot: true,
        directives: doc.directives,
        options: doc.options,
        schema: doc.schema
      };
      const props = resolveProps.resolveProps(start, {
        indicator: "doc-start",
        next: value ?? end?.[0],
        offset,
        onError,
        parentIndent: 0,
        startOnNewline: true
      });
      if (props.found) {
        doc.directives.docStart = true;
        if (value && (value.type === "block-map" || value.type === "block-seq") && !props.hasNewline)
          onError(props.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker");
      }
      doc.contents = value ? composeNode.composeNode(ctx, value, props, onError) : composeNode.composeEmptyNode(ctx, props.end, start, null, props, onError);
      const contentEnd = doc.contents.range[2];
      const re = resolveEnd.resolveEnd(end, contentEnd, false, onError);
      if (re.comment)
        doc.comment = re.comment;
      doc.range = [offset, contentEnd, re.offset];
      return doc;
    }
    exports2.composeDoc = composeDoc;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/composer.js
var require_composer = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/composer.js"(exports2) {
    "use strict";
    var node_process = require("process");
    var directives = require_directives();
    var Document = require_Document();
    var errors = require_errors();
    var identity = require_identity();
    var composeDoc = require_compose_doc();
    var resolveEnd = require_resolve_end();
    function getErrorPos(src) {
      if (typeof src === "number")
        return [src, src + 1];
      if (Array.isArray(src))
        return src.length === 2 ? src : [src[0], src[1]];
      const { offset, source } = src;
      return [offset, offset + (typeof source === "string" ? source.length : 1)];
    }
    function parsePrelude(prelude) {
      let comment = "";
      let atComment = false;
      let afterEmptyLine = false;
      for (let i = 0; i < prelude.length; ++i) {
        const source = prelude[i];
        switch (source[0]) {
          case "#":
            comment += (comment === "" ? "" : afterEmptyLine ? "\n\n" : "\n") + (source.substring(1) || " ");
            atComment = true;
            afterEmptyLine = false;
            break;
          case "%":
            if (prelude[i + 1]?.[0] !== "#")
              i += 1;
            atComment = false;
            break;
          default:
            if (!atComment)
              afterEmptyLine = true;
            atComment = false;
        }
      }
      return { comment, afterEmptyLine };
    }
    var Composer = class {
      constructor(options = {}) {
        this.doc = null;
        this.atDirectives = false;
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
        this.onError = (source, code, message, warning) => {
          const pos = getErrorPos(source);
          if (warning)
            this.warnings.push(new errors.YAMLWarning(pos, code, message));
          else
            this.errors.push(new errors.YAMLParseError(pos, code, message));
        };
        this.directives = new directives.Directives({ version: options.version || "1.2" });
        this.options = options;
      }
      decorate(doc, afterDoc) {
        const { comment, afterEmptyLine } = parsePrelude(this.prelude);
        if (comment) {
          const dc = doc.contents;
          if (afterDoc) {
            doc.comment = doc.comment ? `${doc.comment}
${comment}` : comment;
          } else if (afterEmptyLine || doc.directives.docStart || !dc) {
            doc.commentBefore = comment;
          } else if (identity.isCollection(dc) && !dc.flow && dc.items.length > 0) {
            let it = dc.items[0];
            if (identity.isPair(it))
              it = it.key;
            const cb = it.commentBefore;
            it.commentBefore = cb ? `${comment}
${cb}` : comment;
          } else {
            const cb = dc.commentBefore;
            dc.commentBefore = cb ? `${comment}
${cb}` : comment;
          }
        }
        if (afterDoc) {
          for (let i = 0; i < this.errors.length; ++i)
            doc.errors.push(this.errors[i]);
          for (let i = 0; i < this.warnings.length; ++i)
            doc.warnings.push(this.warnings[i]);
        } else {
          doc.errors = this.errors;
          doc.warnings = this.warnings;
        }
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
      }
      /**
       * Current stream status information.
       *
       * Mostly useful at the end of input for an empty stream.
       */
      streamInfo() {
        return {
          comment: parsePrelude(this.prelude).comment,
          directives: this.directives,
          errors: this.errors,
          warnings: this.warnings
        };
      }
      /**
       * Compose tokens into documents.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *compose(tokens, forceDoc = false, endOffset = -1) {
        for (const token of tokens)
          yield* this.next(token);
        yield* this.end(forceDoc, endOffset);
      }
      /** Advance the composer by one CST token. */
      *next(token) {
        if (node_process.env.LOG_STREAM)
          console.dir(token, { depth: null });
        switch (token.type) {
          case "directive":
            this.directives.add(token.source, (offset, message, warning) => {
              const pos = getErrorPos(token);
              pos[0] += offset;
              this.onError(pos, "BAD_DIRECTIVE", message, warning);
            });
            this.prelude.push(token.source);
            this.atDirectives = true;
            break;
          case "document": {
            const doc = composeDoc.composeDoc(this.options, this.directives, token, this.onError);
            if (this.atDirectives && !doc.directives.docStart)
              this.onError(token, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
            this.decorate(doc, false);
            if (this.doc)
              yield this.doc;
            this.doc = doc;
            this.atDirectives = false;
            break;
          }
          case "byte-order-mark":
          case "space":
            break;
          case "comment":
          case "newline":
            this.prelude.push(token.source);
            break;
          case "error": {
            const msg = token.source ? `${token.message}: ${JSON.stringify(token.source)}` : token.message;
            const error = new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg);
            if (this.atDirectives || !this.doc)
              this.errors.push(error);
            else
              this.doc.errors.push(error);
            break;
          }
          case "doc-end": {
            if (!this.doc) {
              const msg = "Unexpected doc-end without preceding document";
              this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg));
              break;
            }
            this.doc.directives.docEnd = true;
            const end = resolveEnd.resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
            this.decorate(this.doc, true);
            if (end.comment) {
              const dc = this.doc.comment;
              this.doc.comment = dc ? `${dc}
${end.comment}` : end.comment;
            }
            this.doc.range[2] = end.offset;
            break;
          }
          default:
            this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", `Unsupported token ${token.type}`));
        }
      }
      /**
       * Call at end of input to yield any remaining document.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *end(forceDoc = false, endOffset = -1) {
        if (this.doc) {
          this.decorate(this.doc, true);
          yield this.doc;
          this.doc = null;
        } else if (forceDoc) {
          const opts = Object.assign({ _directives: this.directives }, this.options);
          const doc = new Document.Document(void 0, opts);
          if (this.atDirectives)
            this.onError(endOffset, "MISSING_CHAR", "Missing directives-end indicator line");
          doc.range = [0, endOffset, endOffset];
          this.decorate(doc, false);
          yield doc;
        }
      }
    };
    exports2.Composer = Composer;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/parse/cst-scalar.js
var require_cst_scalar = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/parse/cst-scalar.js"(exports2) {
    "use strict";
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    var errors = require_errors();
    var stringifyString = require_stringifyString();
    function resolveAsScalar(token, strict = true, onError) {
      if (token) {
        const _onError = (pos, code, message) => {
          const offset = typeof pos === "number" ? pos : Array.isArray(pos) ? pos[0] : pos.offset;
          if (onError)
            onError(offset, code, message);
          else
            throw new errors.YAMLParseError([offset, offset + 1], code, message);
        };
        switch (token.type) {
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return resolveFlowScalar.resolveFlowScalar(token, strict, _onError);
          case "block-scalar":
            return resolveBlockScalar.resolveBlockScalar({ options: { strict } }, token, _onError);
        }
      }
      return null;
    }
    function createScalarToken(value, context) {
      const { implicitKey = false, indent, inFlow = false, offset = -1, type = "PLAIN" } = context;
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey,
        indent: indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      const end = context.end ?? [
        { type: "newline", offset: -1, indent, source: "\n" }
      ];
      switch (source[0]) {
        case "|":
        case ">": {
          const he = source.indexOf("\n");
          const head = source.substring(0, he);
          const body = source.substring(he + 1) + "\n";
          const props = [
            { type: "block-scalar-header", offset, indent, source: head }
          ];
          if (!addEndtoBlockProps(props, end))
            props.push({ type: "newline", offset: -1, indent, source: "\n" });
          return { type: "block-scalar", offset, indent, props, source: body };
        }
        case '"':
          return { type: "double-quoted-scalar", offset, indent, source, end };
        case "'":
          return { type: "single-quoted-scalar", offset, indent, source, end };
        default:
          return { type: "scalar", offset, indent, source, end };
      }
    }
    function setScalarValue(token, value, context = {}) {
      let { afterKey = false, implicitKey = false, inFlow = false, type } = context;
      let indent = "indent" in token ? token.indent : null;
      if (afterKey && typeof indent === "number")
        indent += 2;
      if (!type)
        switch (token.type) {
          case "single-quoted-scalar":
            type = "QUOTE_SINGLE";
            break;
          case "double-quoted-scalar":
            type = "QUOTE_DOUBLE";
            break;
          case "block-scalar": {
            const header = token.props[0];
            if (header.type !== "block-scalar-header")
              throw new Error("Invalid block scalar header");
            type = header.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
            break;
          }
          default:
            type = "PLAIN";
        }
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey: implicitKey || indent === null,
        indent: indent !== null && indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      switch (source[0]) {
        case "|":
        case ">":
          setBlockScalarValue(token, source);
          break;
        case '"':
          setFlowScalarValue(token, source, "double-quoted-scalar");
          break;
        case "'":
          setFlowScalarValue(token, source, "single-quoted-scalar");
          break;
        default:
          setFlowScalarValue(token, source, "scalar");
      }
    }
    function setBlockScalarValue(token, source) {
      const he = source.indexOf("\n");
      const head = source.substring(0, he);
      const body = source.substring(he + 1) + "\n";
      if (token.type === "block-scalar") {
        const header = token.props[0];
        if (header.type !== "block-scalar-header")
          throw new Error("Invalid block scalar header");
        header.source = head;
        token.source = body;
      } else {
        const { offset } = token;
        const indent = "indent" in token ? token.indent : -1;
        const props = [
          { type: "block-scalar-header", offset, indent, source: head }
        ];
        if (!addEndtoBlockProps(props, "end" in token ? token.end : void 0))
          props.push({ type: "newline", offset: -1, indent, source: "\n" });
        for (const key of Object.keys(token))
          if (key !== "type" && key !== "offset")
            delete token[key];
        Object.assign(token, { type: "block-scalar", indent, props, source: body });
      }
    }
    function addEndtoBlockProps(props, end) {
      if (end)
        for (const st of end)
          switch (st.type) {
            case "space":
            case "comment":
              props.push(st);
              break;
            case "newline":
              props.push(st);
              return true;
          }
      return false;
    }
    function setFlowScalarValue(token, source, type) {
      switch (token.type) {
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          token.type = type;
          token.source = source;
          break;
        case "block-scalar": {
          const end = token.props.slice(1);
          let oa = source.length;
          if (token.props[0].type === "block-scalar-header")
            oa -= token.props[0].source.length;
          for (const tok of end)
            tok.offset += oa;
          delete token.props;
          Object.assign(token, { type, source, end });
          break;
        }
        case "block-map":
        case "block-seq": {
          const offset = token.offset + source.length;
          const nl = { type: "newline", offset, indent: token.indent, source: "\n" };
          delete token.items;
          Object.assign(token, { type, source, end: [nl] });
          break;
        }
        default: {
          const indent = "indent" in token ? token.indent : -1;
          const end = "end" in token && Array.isArray(token.end) ? token.end.filter((st) => st.type === "space" || st.type === "comment" || st.type === "newline") : [];
          for (const key of Object.keys(token))
            if (key !== "type" && key !== "offset")
              delete token[key];
          Object.assign(token, { type, indent, source, end });
        }
      }
    }
    exports2.createScalarToken = createScalarToken;
    exports2.resolveAsScalar = resolveAsScalar;
    exports2.setScalarValue = setScalarValue;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/parse/cst-stringify.js
var require_cst_stringify = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/parse/cst-stringify.js"(exports2) {
    "use strict";
    var stringify2 = (cst) => "type" in cst ? stringifyToken(cst) : stringifyItem(cst);
    function stringifyToken(token) {
      switch (token.type) {
        case "block-scalar": {
          let res = "";
          for (const tok of token.props)
            res += stringifyToken(tok);
          return res + token.source;
        }
        case "block-map":
        case "block-seq": {
          let res = "";
          for (const item of token.items)
            res += stringifyItem(item);
          return res;
        }
        case "flow-collection": {
          let res = token.start.source;
          for (const item of token.items)
            res += stringifyItem(item);
          for (const st of token.end)
            res += st.source;
          return res;
        }
        case "document": {
          let res = stringifyItem(token);
          if (token.end)
            for (const st of token.end)
              res += st.source;
          return res;
        }
        default: {
          let res = token.source;
          if ("end" in token && token.end)
            for (const st of token.end)
              res += st.source;
          return res;
        }
      }
    }
    function stringifyItem({ start, key, sep, value }) {
      let res = "";
      for (const st of start)
        res += st.source;
      if (key)
        res += stringifyToken(key);
      if (sep)
        for (const st of sep)
          res += st.source;
      if (value)
        res += stringifyToken(value);
      return res;
    }
    exports2.stringify = stringify2;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/parse/cst-visit.js
var require_cst_visit = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/parse/cst-visit.js"(exports2) {
    "use strict";
    var BREAK = /* @__PURE__ */ Symbol("break visit");
    var SKIP = /* @__PURE__ */ Symbol("skip children");
    var REMOVE = /* @__PURE__ */ Symbol("remove item");
    function visit(cst, visitor) {
      if ("type" in cst && cst.type === "document")
        cst = { start: cst.start, value: cst.value };
      _visit(Object.freeze([]), cst, visitor);
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP;
    visit.REMOVE = REMOVE;
    visit.itemAtPath = (cst, path) => {
      let item = cst;
      for (const [field, index] of path) {
        const tok = item?.[field];
        if (tok && "items" in tok) {
          item = tok.items[index];
        } else
          return void 0;
      }
      return item;
    };
    visit.parentCollection = (cst, path) => {
      const parent = visit.itemAtPath(cst, path.slice(0, -1));
      const field = path[path.length - 1][0];
      const coll = parent?.[field];
      if (coll && "items" in coll)
        return coll;
      throw new Error("Parent collection not found");
    };
    function _visit(path, item, visitor) {
      let ctrl = visitor(item, path);
      if (typeof ctrl === "symbol")
        return ctrl;
      for (const field of ["key", "value"]) {
        const token = item[field];
        if (token && "items" in token) {
          for (let i = 0; i < token.items.length; ++i) {
            const ci = _visit(Object.freeze(path.concat([[field, i]])), token.items[i], visitor);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              token.items.splice(i, 1);
              i -= 1;
            }
          }
          if (typeof ctrl === "function" && field === "key")
            ctrl = ctrl(item, path);
        }
      }
      return typeof ctrl === "function" ? ctrl(item, path) : ctrl;
    }
    exports2.visit = visit;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/parse/cst.js
var require_cst = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/parse/cst.js"(exports2) {
    "use strict";
    var cstScalar = require_cst_scalar();
    var cstStringify = require_cst_stringify();
    var cstVisit = require_cst_visit();
    var BOM = "\uFEFF";
    var DOCUMENT = "";
    var FLOW_END = "";
    var SCALAR = "";
    var isCollection = (token) => !!token && "items" in token;
    var isScalar = (token) => !!token && (token.type === "scalar" || token.type === "single-quoted-scalar" || token.type === "double-quoted-scalar" || token.type === "block-scalar");
    function prettyToken(token) {
      switch (token) {
        case BOM:
          return "<BOM>";
        case DOCUMENT:
          return "<DOC>";
        case FLOW_END:
          return "<FLOW_END>";
        case SCALAR:
          return "<SCALAR>";
        default:
          return JSON.stringify(token);
      }
    }
    function tokenType(source) {
      switch (source) {
        case BOM:
          return "byte-order-mark";
        case DOCUMENT:
          return "doc-mode";
        case FLOW_END:
          return "flow-error-end";
        case SCALAR:
          return "scalar";
        case "---":
          return "doc-start";
        case "...":
          return "doc-end";
        case "":
        case "\n":
        case "\r\n":
          return "newline";
        case "-":
          return "seq-item-ind";
        case "?":
          return "explicit-key-ind";
        case ":":
          return "map-value-ind";
        case "{":
          return "flow-map-start";
        case "}":
          return "flow-map-end";
        case "[":
          return "flow-seq-start";
        case "]":
          return "flow-seq-end";
        case ",":
          return "comma";
      }
      switch (source[0]) {
        case " ":
        case "	":
          return "space";
        case "#":
          return "comment";
        case "%":
          return "directive-line";
        case "*":
          return "alias";
        case "&":
          return "anchor";
        case "!":
          return "tag";
        case "'":
          return "single-quoted-scalar";
        case '"':
          return "double-quoted-scalar";
        case "|":
        case ">":
          return "block-scalar-header";
      }
      return null;
    }
    exports2.createScalarToken = cstScalar.createScalarToken;
    exports2.resolveAsScalar = cstScalar.resolveAsScalar;
    exports2.setScalarValue = cstScalar.setScalarValue;
    exports2.stringify = cstStringify.stringify;
    exports2.visit = cstVisit.visit;
    exports2.BOM = BOM;
    exports2.DOCUMENT = DOCUMENT;
    exports2.FLOW_END = FLOW_END;
    exports2.SCALAR = SCALAR;
    exports2.isCollection = isCollection;
    exports2.isScalar = isScalar;
    exports2.prettyToken = prettyToken;
    exports2.tokenType = tokenType;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/parse/lexer.js
var require_lexer = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/parse/lexer.js"(exports2) {
    "use strict";
    var cst = require_cst();
    function isEmpty(ch) {
      switch (ch) {
        case void 0:
        case " ":
        case "\n":
        case "\r":
        case "	":
          return true;
        default:
          return false;
      }
    }
    var hexDigits = new Set("0123456789ABCDEFabcdef");
    var tagChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()");
    var flowIndicatorChars = new Set(",[]{}");
    var invalidAnchorChars = new Set(" ,[]{}\n\r	");
    var isNotAnchorChar = (ch) => !ch || invalidAnchorChars.has(ch);
    var Lexer = class {
      constructor() {
        this.atEnd = false;
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        this.buffer = "";
        this.flowKey = false;
        this.flowLevel = 0;
        this.indentNext = 0;
        this.indentValue = 0;
        this.lineEndPos = null;
        this.next = null;
        this.pos = 0;
      }
      /**
       * Generate YAML tokens from the `source` string. If `incomplete`,
       * a part of the last line may be left as a buffer for the next call.
       *
       * @returns A generator of lexical tokens
       */
      *lex(source, incomplete = false) {
        if (source) {
          if (typeof source !== "string")
            throw TypeError("source is not a string");
          this.buffer = this.buffer ? this.buffer + source : source;
          this.lineEndPos = null;
        }
        this.atEnd = !incomplete;
        let next = this.next ?? "stream";
        while (next && (incomplete || this.hasChars(1)))
          next = yield* this.parseNext(next);
      }
      atLineEnd() {
        let i = this.pos;
        let ch = this.buffer[i];
        while (ch === " " || ch === "	")
          ch = this.buffer[++i];
        if (!ch || ch === "#" || ch === "\n")
          return true;
        if (ch === "\r")
          return this.buffer[i + 1] === "\n";
        return false;
      }
      charAt(n) {
        return this.buffer[this.pos + n];
      }
      continueScalar(offset) {
        let ch = this.buffer[offset];
        if (this.indentNext > 0) {
          let indent = 0;
          while (ch === " ")
            ch = this.buffer[++indent + offset];
          if (ch === "\r") {
            const next = this.buffer[indent + offset + 1];
            if (next === "\n" || !next && !this.atEnd)
              return offset + indent + 1;
          }
          return ch === "\n" || indent >= this.indentNext || !ch && !this.atEnd ? offset + indent : -1;
        }
        if (ch === "-" || ch === ".") {
          const dt = this.buffer.substr(offset, 3);
          if ((dt === "---" || dt === "...") && isEmpty(this.buffer[offset + 3]))
            return -1;
        }
        return offset;
      }
      getLine() {
        let end = this.lineEndPos;
        if (typeof end !== "number" || end !== -1 && end < this.pos) {
          end = this.buffer.indexOf("\n", this.pos);
          this.lineEndPos = end;
        }
        if (end === -1)
          return this.atEnd ? this.buffer.substring(this.pos) : null;
        if (this.buffer[end - 1] === "\r")
          end -= 1;
        return this.buffer.substring(this.pos, end);
      }
      hasChars(n) {
        return this.pos + n <= this.buffer.length;
      }
      setNext(state) {
        this.buffer = this.buffer.substring(this.pos);
        this.pos = 0;
        this.lineEndPos = null;
        this.next = state;
        return null;
      }
      peek(n) {
        return this.buffer.substr(this.pos, n);
      }
      *parseNext(next) {
        switch (next) {
          case "stream":
            return yield* this.parseStream();
          case "line-start":
            return yield* this.parseLineStart();
          case "block-start":
            return yield* this.parseBlockStart();
          case "doc":
            return yield* this.parseDocument();
          case "flow":
            return yield* this.parseFlowCollection();
          case "quoted-scalar":
            return yield* this.parseQuotedScalar();
          case "block-scalar":
            return yield* this.parseBlockScalar();
          case "plain-scalar":
            return yield* this.parsePlainScalar();
        }
      }
      *parseStream() {
        let line = this.getLine();
        if (line === null)
          return this.setNext("stream");
        if (line[0] === cst.BOM) {
          yield* this.pushCount(1);
          line = line.substring(1);
        }
        if (line[0] === "%") {
          let dirEnd = line.length;
          let cs = line.indexOf("#");
          while (cs !== -1) {
            const ch = line[cs - 1];
            if (ch === " " || ch === "	") {
              dirEnd = cs - 1;
              break;
            } else {
              cs = line.indexOf("#", cs + 1);
            }
          }
          while (true) {
            const ch = line[dirEnd - 1];
            if (ch === " " || ch === "	")
              dirEnd -= 1;
            else
              break;
          }
          const n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
          yield* this.pushCount(line.length - n);
          this.pushNewline();
          return "stream";
        }
        if (this.atLineEnd()) {
          const sp = yield* this.pushSpaces(true);
          yield* this.pushCount(line.length - sp);
          yield* this.pushNewline();
          return "stream";
        }
        yield cst.DOCUMENT;
        return yield* this.parseLineStart();
      }
      *parseLineStart() {
        const ch = this.charAt(0);
        if (!ch && !this.atEnd)
          return this.setNext("line-start");
        if (ch === "-" || ch === ".") {
          if (!this.atEnd && !this.hasChars(4))
            return this.setNext("line-start");
          const s = this.peek(3);
          if ((s === "---" || s === "...") && isEmpty(this.charAt(3))) {
            yield* this.pushCount(3);
            this.indentValue = 0;
            this.indentNext = 0;
            return s === "---" ? "doc" : "stream";
          }
        }
        this.indentValue = yield* this.pushSpaces(false);
        if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
          this.indentNext = this.indentValue;
        return yield* this.parseBlockStart();
      }
      *parseBlockStart() {
        const [ch0, ch1] = this.peek(2);
        if (!ch1 && !this.atEnd)
          return this.setNext("block-start");
        if ((ch0 === "-" || ch0 === "?" || ch0 === ":") && isEmpty(ch1)) {
          const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
          this.indentNext = this.indentValue + 1;
          this.indentValue += n;
          return "block-start";
        }
        return "doc";
      }
      *parseDocument() {
        yield* this.pushSpaces(true);
        const line = this.getLine();
        if (line === null)
          return this.setNext("doc");
        let n = yield* this.pushIndicators();
        switch (line[n]) {
          case "#":
            yield* this.pushCount(line.length - n);
          // fallthrough
          case void 0:
            yield* this.pushNewline();
            return yield* this.parseLineStart();
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel = 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            return "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "doc";
          case '"':
          case "'":
            return yield* this.parseQuotedScalar();
          case "|":
          case ">":
            n += yield* this.parseBlockScalarHeader();
            n += yield* this.pushSpaces(true);
            yield* this.pushCount(line.length - n);
            yield* this.pushNewline();
            return yield* this.parseBlockScalar();
          default:
            return yield* this.parsePlainScalar();
        }
      }
      *parseFlowCollection() {
        let nl, sp;
        let indent = -1;
        do {
          nl = yield* this.pushNewline();
          if (nl > 0) {
            sp = yield* this.pushSpaces(false);
            this.indentValue = indent = sp;
          } else {
            sp = 0;
          }
          sp += yield* this.pushSpaces(true);
        } while (nl + sp > 0);
        const line = this.getLine();
        if (line === null)
          return this.setNext("flow");
        if (indent !== -1 && indent < this.indentNext && line[0] !== "#" || indent === 0 && (line.startsWith("---") || line.startsWith("...")) && isEmpty(line[3])) {
          const atFlowEndMarker = indent === this.indentNext - 1 && this.flowLevel === 1 && (line[0] === "]" || line[0] === "}");
          if (!atFlowEndMarker) {
            this.flowLevel = 0;
            yield cst.FLOW_END;
            return yield* this.parseLineStart();
          }
        }
        let n = 0;
        while (line[n] === ",") {
          n += yield* this.pushCount(1);
          n += yield* this.pushSpaces(true);
          this.flowKey = false;
        }
        n += yield* this.pushIndicators();
        switch (line[n]) {
          case void 0:
            return "flow";
          case "#":
            yield* this.pushCount(line.length - n);
            return "flow";
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel += 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            this.flowKey = true;
            this.flowLevel -= 1;
            return this.flowLevel ? "flow" : "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "flow";
          case '"':
          case "'":
            this.flowKey = true;
            return yield* this.parseQuotedScalar();
          case ":": {
            const next = this.charAt(1);
            if (this.flowKey || isEmpty(next) || next === ",") {
              this.flowKey = false;
              yield* this.pushCount(1);
              yield* this.pushSpaces(true);
              return "flow";
            }
          }
          // fallthrough
          default:
            this.flowKey = false;
            return yield* this.parsePlainScalar();
        }
      }
      *parseQuotedScalar() {
        const quote = this.charAt(0);
        let end = this.buffer.indexOf(quote, this.pos + 1);
        if (quote === "'") {
          while (end !== -1 && this.buffer[end + 1] === "'")
            end = this.buffer.indexOf("'", end + 2);
        } else {
          while (end !== -1) {
            let n = 0;
            while (this.buffer[end - 1 - n] === "\\")
              n += 1;
            if (n % 2 === 0)
              break;
            end = this.buffer.indexOf('"', end + 1);
          }
        }
        const qb = this.buffer.substring(0, end);
        let nl = qb.indexOf("\n", this.pos);
        if (nl !== -1) {
          while (nl !== -1) {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = qb.indexOf("\n", cs);
          }
          if (nl !== -1) {
            end = nl - (qb[nl - 1] === "\r" ? 2 : 1);
          }
        }
        if (end === -1) {
          if (!this.atEnd)
            return this.setNext("quoted-scalar");
          end = this.buffer.length;
        }
        yield* this.pushToIndex(end + 1, false);
        return this.flowLevel ? "flow" : "doc";
      }
      *parseBlockScalarHeader() {
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        let i = this.pos;
        while (true) {
          const ch = this.buffer[++i];
          if (ch === "+")
            this.blockScalarKeep = true;
          else if (ch > "0" && ch <= "9")
            this.blockScalarIndent = Number(ch) - 1;
          else if (ch !== "-")
            break;
        }
        return yield* this.pushUntil((ch) => isEmpty(ch) || ch === "#");
      }
      *parseBlockScalar() {
        let nl = this.pos - 1;
        let indent = 0;
        let ch;
        loop: for (let i2 = this.pos; ch = this.buffer[i2]; ++i2) {
          switch (ch) {
            case " ":
              indent += 1;
              break;
            case "\n":
              nl = i2;
              indent = 0;
              break;
            case "\r": {
              const next = this.buffer[i2 + 1];
              if (!next && !this.atEnd)
                return this.setNext("block-scalar");
              if (next === "\n")
                break;
            }
            // fallthrough
            default:
              break loop;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("block-scalar");
        if (indent >= this.indentNext) {
          if (this.blockScalarIndent === -1)
            this.indentNext = indent;
          else {
            this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
          }
          do {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = this.buffer.indexOf("\n", cs);
          } while (nl !== -1);
          if (nl === -1) {
            if (!this.atEnd)
              return this.setNext("block-scalar");
            nl = this.buffer.length;
          }
        }
        let i = nl + 1;
        ch = this.buffer[i];
        while (ch === " ")
          ch = this.buffer[++i];
        if (ch === "	") {
          while (ch === "	" || ch === " " || ch === "\r" || ch === "\n")
            ch = this.buffer[++i];
          nl = i - 1;
        } else if (!this.blockScalarKeep) {
          do {
            let i2 = nl - 1;
            let ch2 = this.buffer[i2];
            if (ch2 === "\r")
              ch2 = this.buffer[--i2];
            const lastChar = i2;
            while (ch2 === " ")
              ch2 = this.buffer[--i2];
            if (ch2 === "\n" && i2 >= this.pos && i2 + 1 + indent > lastChar)
              nl = i2;
            else
              break;
          } while (true);
        }
        yield cst.SCALAR;
        yield* this.pushToIndex(nl + 1, true);
        return yield* this.parseLineStart();
      }
      *parsePlainScalar() {
        const inFlow = this.flowLevel > 0;
        let end = this.pos - 1;
        let i = this.pos - 1;
        let ch;
        while (ch = this.buffer[++i]) {
          if (ch === ":") {
            const next = this.buffer[i + 1];
            if (isEmpty(next) || inFlow && flowIndicatorChars.has(next))
              break;
            end = i;
          } else if (isEmpty(ch)) {
            let next = this.buffer[i + 1];
            if (ch === "\r") {
              if (next === "\n") {
                i += 1;
                ch = "\n";
                next = this.buffer[i + 1];
              } else
                end = i;
            }
            if (next === "#" || inFlow && flowIndicatorChars.has(next))
              break;
            if (ch === "\n") {
              const cs = this.continueScalar(i + 1);
              if (cs === -1)
                break;
              i = Math.max(i, cs - 2);
            }
          } else {
            if (inFlow && flowIndicatorChars.has(ch))
              break;
            end = i;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("plain-scalar");
        yield cst.SCALAR;
        yield* this.pushToIndex(end + 1, true);
        return inFlow ? "flow" : "doc";
      }
      *pushCount(n) {
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos += n;
          return n;
        }
        return 0;
      }
      *pushToIndex(i, allowEmpty) {
        const s = this.buffer.slice(this.pos, i);
        if (s) {
          yield s;
          this.pos += s.length;
          return s.length;
        } else if (allowEmpty)
          yield "";
        return 0;
      }
      *pushIndicators() {
        let n = 0;
        loop: while (true) {
          switch (this.charAt(0)) {
            case "!":
              n += yield* this.pushTag();
              n += yield* this.pushSpaces(true);
              continue loop;
            case "&":
              n += yield* this.pushUntil(isNotAnchorChar);
              n += yield* this.pushSpaces(true);
              continue loop;
            case "-":
            // this is an error
            case "?":
            // this is an error outside flow collections
            case ":": {
              const inFlow = this.flowLevel > 0;
              const ch1 = this.charAt(1);
              if (isEmpty(ch1) || inFlow && flowIndicatorChars.has(ch1)) {
                if (!inFlow)
                  this.indentNext = this.indentValue + 1;
                else if (this.flowKey)
                  this.flowKey = false;
                n += yield* this.pushCount(1);
                n += yield* this.pushSpaces(true);
                continue loop;
              }
            }
          }
          break loop;
        }
        return n;
      }
      *pushTag() {
        if (this.charAt(1) === "<") {
          let i = this.pos + 2;
          let ch = this.buffer[i];
          while (!isEmpty(ch) && ch !== ">")
            ch = this.buffer[++i];
          return yield* this.pushToIndex(ch === ">" ? i + 1 : i, false);
        } else {
          let i = this.pos + 1;
          let ch = this.buffer[i];
          while (ch) {
            if (tagChars.has(ch))
              ch = this.buffer[++i];
            else if (ch === "%" && hexDigits.has(this.buffer[i + 1]) && hexDigits.has(this.buffer[i + 2])) {
              ch = this.buffer[i += 3];
            } else
              break;
          }
          return yield* this.pushToIndex(i, false);
        }
      }
      *pushNewline() {
        const ch = this.buffer[this.pos];
        if (ch === "\n")
          return yield* this.pushCount(1);
        else if (ch === "\r" && this.charAt(1) === "\n")
          return yield* this.pushCount(2);
        else
          return 0;
      }
      *pushSpaces(allowTabs) {
        let i = this.pos - 1;
        let ch;
        do {
          ch = this.buffer[++i];
        } while (ch === " " || allowTabs && ch === "	");
        const n = i - this.pos;
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos = i;
        }
        return n;
      }
      *pushUntil(test) {
        let i = this.pos;
        let ch = this.buffer[i];
        while (!test(ch))
          ch = this.buffer[++i];
        return yield* this.pushToIndex(i, false);
      }
    };
    exports2.Lexer = Lexer;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/parse/line-counter.js
var require_line_counter = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/parse/line-counter.js"(exports2) {
    "use strict";
    var LineCounter = class {
      constructor() {
        this.lineStarts = [];
        this.addNewLine = (offset) => this.lineStarts.push(offset);
        this.linePos = (offset) => {
          let low = 0;
          let high = this.lineStarts.length;
          while (low < high) {
            const mid = low + high >> 1;
            if (this.lineStarts[mid] < offset)
              low = mid + 1;
            else
              high = mid;
          }
          if (this.lineStarts[low] === offset)
            return { line: low + 1, col: 1 };
          if (low === 0)
            return { line: 0, col: offset };
          const start = this.lineStarts[low - 1];
          return { line: low, col: offset - start + 1 };
        };
      }
    };
    exports2.LineCounter = LineCounter;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/parse/parser.js
var require_parser = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/parse/parser.js"(exports2) {
    "use strict";
    var node_process = require("process");
    var cst = require_cst();
    var lexer = require_lexer();
    function includesToken(list, type) {
      for (let i = 0; i < list.length; ++i)
        if (list[i].type === type)
          return true;
      return false;
    }
    function findNonEmptyIndex(list) {
      for (let i = 0; i < list.length; ++i) {
        switch (list[i].type) {
          case "space":
          case "comment":
          case "newline":
            break;
          default:
            return i;
        }
      }
      return -1;
    }
    function isFlowToken(token) {
      switch (token?.type) {
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "flow-collection":
          return true;
        default:
          return false;
      }
    }
    function getPrevProps(parent) {
      switch (parent.type) {
        case "document":
          return parent.start;
        case "block-map": {
          const it = parent.items[parent.items.length - 1];
          return it.sep ?? it.start;
        }
        case "block-seq":
          return parent.items[parent.items.length - 1].start;
        /* istanbul ignore next should not happen */
        default:
          return [];
      }
    }
    function getFirstKeyStartProps(prev) {
      if (prev.length === 0)
        return [];
      let i = prev.length;
      loop: while (--i >= 0) {
        switch (prev[i].type) {
          case "doc-start":
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
          case "newline":
            break loop;
        }
      }
      while (prev[++i]?.type === "space") {
      }
      return prev.splice(i, prev.length);
    }
    function arrayPushArray(target, source) {
      if (source.length < 1e5)
        Array.prototype.push.apply(target, source);
      else
        for (let i = 0; i < source.length; ++i)
          target.push(source[i]);
    }
    function fixFlowSeqItems(fc) {
      if (fc.start.type === "flow-seq-start") {
        for (const it of fc.items) {
          if (it.sep && !it.value && !includesToken(it.start, "explicit-key-ind") && !includesToken(it.sep, "map-value-ind")) {
            if (it.key)
              it.value = it.key;
            delete it.key;
            if (isFlowToken(it.value)) {
              if (it.value.end)
                arrayPushArray(it.value.end, it.sep);
              else
                it.value.end = it.sep;
            } else
              arrayPushArray(it.start, it.sep);
            delete it.sep;
          }
        }
      }
    }
    var Parser = class {
      /**
       * @param onNewLine - If defined, called separately with the start position of
       *   each new line (in `parse()`, including the start of input).
       */
      constructor(onNewLine) {
        this.atNewLine = true;
        this.atScalar = false;
        this.indent = 0;
        this.offset = 0;
        this.onKeyLine = false;
        this.stack = [];
        this.source = "";
        this.type = "";
        this.lexer = new lexer.Lexer();
        this.onNewLine = onNewLine;
      }
      /**
       * Parse `source` as a YAML stream.
       * If `incomplete`, a part of the last line may be left as a buffer for the next call.
       *
       * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
       *
       * @returns A generator of tokens representing each directive, document, and other structure.
       */
      *parse(source, incomplete = false) {
        if (this.onNewLine && this.offset === 0)
          this.onNewLine(0);
        for (const lexeme of this.lexer.lex(source, incomplete))
          yield* this.next(lexeme);
        if (!incomplete)
          yield* this.end();
      }
      /**
       * Advance the parser by the `source` of one lexical token.
       */
      *next(source) {
        this.source = source;
        if (node_process.env.LOG_TOKENS)
          console.log("|", cst.prettyToken(source));
        if (this.atScalar) {
          this.atScalar = false;
          yield* this.step();
          this.offset += source.length;
          return;
        }
        const type = cst.tokenType(source);
        if (!type) {
          const message = `Not a YAML token: ${source}`;
          yield* this.pop({ type: "error", offset: this.offset, message, source });
          this.offset += source.length;
        } else if (type === "scalar") {
          this.atNewLine = false;
          this.atScalar = true;
          this.type = "scalar";
        } else {
          this.type = type;
          yield* this.step();
          switch (type) {
            case "newline":
              this.atNewLine = true;
              this.indent = 0;
              if (this.onNewLine)
                this.onNewLine(this.offset + source.length);
              break;
            case "space":
              if (this.atNewLine && source[0] === " ")
                this.indent += source.length;
              break;
            case "explicit-key-ind":
            case "map-value-ind":
            case "seq-item-ind":
              if (this.atNewLine)
                this.indent += source.length;
              break;
            case "doc-mode":
            case "flow-error-end":
              return;
            default:
              this.atNewLine = false;
          }
          this.offset += source.length;
        }
      }
      /** Call at end of input to push out any remaining constructions */
      *end() {
        while (this.stack.length > 0)
          yield* this.pop();
      }
      get sourceToken() {
        const st = {
          type: this.type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
        return st;
      }
      *step() {
        const top = this.peek(1);
        if (this.type === "doc-end" && top?.type !== "doc-end") {
          while (this.stack.length > 0)
            yield* this.pop();
          this.stack.push({
            type: "doc-end",
            offset: this.offset,
            source: this.source
          });
          return;
        }
        if (!top)
          return yield* this.stream();
        switch (top.type) {
          case "document":
            return yield* this.document(top);
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return yield* this.scalar(top);
          case "block-scalar":
            return yield* this.blockScalar(top);
          case "block-map":
            return yield* this.blockMap(top);
          case "block-seq":
            return yield* this.blockSequence(top);
          case "flow-collection":
            return yield* this.flowCollection(top);
          case "doc-end":
            return yield* this.documentEnd(top);
        }
        yield* this.pop();
      }
      peek(n) {
        return this.stack[this.stack.length - n];
      }
      *pop(error) {
        const token = error ?? this.stack.pop();
        if (!token) {
          const message = "Tried to pop an empty stack";
          yield { type: "error", offset: this.offset, source: "", message };
        } else if (this.stack.length === 0) {
          yield token;
        } else {
          const top = this.peek(1);
          if (token.type === "block-scalar") {
            token.indent = "indent" in top ? top.indent : 0;
          } else if (token.type === "flow-collection" && top.type === "document") {
            token.indent = 0;
          }
          if (token.type === "flow-collection")
            fixFlowSeqItems(token);
          switch (top.type) {
            case "document":
              top.value = token;
              break;
            case "block-scalar":
              top.props.push(token);
              break;
            case "block-map": {
              const it = top.items[top.items.length - 1];
              if (it.value) {
                top.items.push({ start: [], key: token, sep: [] });
                this.onKeyLine = true;
                return;
              } else if (it.sep) {
                it.value = token;
              } else {
                Object.assign(it, { key: token, sep: [] });
                this.onKeyLine = !it.explicitKey;
                return;
              }
              break;
            }
            case "block-seq": {
              const it = top.items[top.items.length - 1];
              if (it.value)
                top.items.push({ start: [], value: token });
              else
                it.value = token;
              break;
            }
            case "flow-collection": {
              const it = top.items[top.items.length - 1];
              if (!it || it.value)
                top.items.push({ start: [], key: token, sep: [] });
              else if (it.sep)
                it.value = token;
              else
                Object.assign(it, { key: token, sep: [] });
              return;
            }
            /* istanbul ignore next should not happen */
            default:
              yield* this.pop();
              yield* this.pop(token);
          }
          if ((top.type === "document" || top.type === "block-map" || top.type === "block-seq") && (token.type === "block-map" || token.type === "block-seq")) {
            const last = token.items[token.items.length - 1];
            if (last && !last.sep && !last.value && last.start.length > 0 && findNonEmptyIndex(last.start) === -1 && (token.indent === 0 || last.start.every((st) => st.type !== "comment" || st.indent < token.indent))) {
              if (top.type === "document")
                top.end = last.start;
              else
                top.items.push({ start: last.start });
              token.items.splice(-1, 1);
            }
          }
        }
      }
      *stream() {
        switch (this.type) {
          case "directive-line":
            yield { type: "directive", offset: this.offset, source: this.source };
            return;
          case "byte-order-mark":
          case "space":
          case "comment":
          case "newline":
            yield this.sourceToken;
            return;
          case "doc-mode":
          case "doc-start": {
            const doc = {
              type: "document",
              offset: this.offset,
              start: []
            };
            if (this.type === "doc-start")
              doc.start.push(this.sourceToken);
            this.stack.push(doc);
            return;
          }
        }
        yield {
          type: "error",
          offset: this.offset,
          message: `Unexpected ${this.type} token in YAML stream`,
          source: this.source
        };
      }
      *document(doc) {
        if (doc.value)
          return yield* this.lineEnd(doc);
        switch (this.type) {
          case "doc-start": {
            if (findNonEmptyIndex(doc.start) !== -1) {
              yield* this.pop();
              yield* this.step();
            } else
              doc.start.push(this.sourceToken);
            return;
          }
          case "anchor":
          case "tag":
          case "space":
          case "comment":
          case "newline":
            doc.start.push(this.sourceToken);
            return;
        }
        const bv = this.startBlockValue(doc);
        if (bv)
          this.stack.push(bv);
        else {
          yield {
            type: "error",
            offset: this.offset,
            message: `Unexpected ${this.type} token in YAML document`,
            source: this.source
          };
        }
      }
      *scalar(scalar) {
        if (this.type === "map-value-ind") {
          const prev = getPrevProps(this.peek(2));
          const start = getFirstKeyStartProps(prev);
          let sep;
          if (scalar.end) {
            sep = scalar.end;
            sep.push(this.sourceToken);
            delete scalar.end;
          } else
            sep = [this.sourceToken];
          const map = {
            type: "block-map",
            offset: scalar.offset,
            indent: scalar.indent,
            items: [{ start, key: scalar, sep }]
          };
          this.onKeyLine = true;
          this.stack[this.stack.length - 1] = map;
        } else
          yield* this.lineEnd(scalar);
      }
      *blockScalar(scalar) {
        switch (this.type) {
          case "space":
          case "comment":
          case "newline":
            scalar.props.push(this.sourceToken);
            return;
          case "scalar":
            scalar.source = this.source;
            this.atNewLine = true;
            this.indent = 0;
            if (this.onNewLine) {
              let nl = this.source.indexOf("\n") + 1;
              while (nl !== 0) {
                this.onNewLine(this.offset + nl);
                nl = this.source.indexOf("\n", nl) + 1;
              }
            }
            yield* this.pop();
            break;
          /* istanbul ignore next should not happen */
          default:
            yield* this.pop();
            yield* this.step();
        }
      }
      *blockMap(map) {
        const it = map.items[map.items.length - 1];
        switch (this.type) {
          case "newline":
            this.onKeyLine = false;
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              it.start.push(this.sourceToken);
            }
            return;
          case "space":
          case "comment":
            if (it.value) {
              map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              if (this.atIndentedComment(it.start, map.indent)) {
                const prev = map.items[map.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start);
                  end.push(this.sourceToken);
                  map.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
        }
        if (this.indent >= map.indent) {
          const atMapIndent = !this.onKeyLine && this.indent === map.indent;
          const atNextItem = atMapIndent && (it.sep || it.explicitKey) && this.type !== "seq-item-ind";
          let start = [];
          if (atNextItem && it.sep && !it.value) {
            const nl = [];
            for (let i = 0; i < it.sep.length; ++i) {
              const st = it.sep[i];
              switch (st.type) {
                case "newline":
                  nl.push(i);
                  break;
                case "space":
                  break;
                case "comment":
                  if (st.indent > map.indent)
                    nl.length = 0;
                  break;
                default:
                  nl.length = 0;
              }
            }
            if (nl.length >= 2)
              start = it.sep.splice(nl[1]);
          }
          switch (this.type) {
            case "anchor":
            case "tag":
              if (atNextItem || it.value) {
                start.push(this.sourceToken);
                map.items.push({ start });
                this.onKeyLine = true;
              } else if (it.sep) {
                it.sep.push(this.sourceToken);
              } else {
                it.start.push(this.sourceToken);
              }
              return;
            case "explicit-key-ind":
              if (!it.sep && !it.explicitKey) {
                it.start.push(this.sourceToken);
                it.explicitKey = true;
              } else if (atNextItem || it.value) {
                start.push(this.sourceToken);
                map.items.push({ start, explicitKey: true });
              } else {
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: [this.sourceToken], explicitKey: true }]
                });
              }
              this.onKeyLine = true;
              return;
            case "map-value-ind":
              if (it.explicitKey) {
                if (!it.sep) {
                  if (includesToken(it.start, "newline")) {
                    Object.assign(it, { key: null, sep: [this.sourceToken] });
                  } else {
                    const start2 = getFirstKeyStartProps(it.start);
                    this.stack.push({
                      type: "block-map",
                      offset: this.offset,
                      indent: this.indent,
                      items: [{ start: start2, key: null, sep: [this.sourceToken] }]
                    });
                  }
                } else if (it.value) {
                  map.items.push({ start: [], key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start, key: null, sep: [this.sourceToken] }]
                  });
                } else if (isFlowToken(it.key) && !includesToken(it.sep, "newline")) {
                  const start2 = getFirstKeyStartProps(it.start);
                  const key = it.key;
                  const sep = it.sep;
                  sep.push(this.sourceToken);
                  delete it.key;
                  delete it.sep;
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: start2, key, sep }]
                  });
                } else if (start.length > 0) {
                  it.sep = it.sep.concat(start, this.sourceToken);
                } else {
                  it.sep.push(this.sourceToken);
                }
              } else {
                if (!it.sep) {
                  Object.assign(it, { key: null, sep: [this.sourceToken] });
                } else if (it.value || atNextItem) {
                  map.items.push({ start, key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: [], key: null, sep: [this.sourceToken] }]
                  });
                } else {
                  it.sep.push(this.sourceToken);
                }
              }
              this.onKeyLine = true;
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs = this.flowScalar(this.type);
              if (atNextItem || it.value) {
                map.items.push({ start, key: fs, sep: [] });
                this.onKeyLine = true;
              } else if (it.sep) {
                this.stack.push(fs);
              } else {
                Object.assign(it, { key: fs, sep: [] });
                this.onKeyLine = true;
              }
              return;
            }
            default: {
              const bv = this.startBlockValue(map);
              if (bv) {
                if (bv.type === "block-seq") {
                  if (!it.explicitKey && it.sep && !includesToken(it.sep, "newline")) {
                    yield* this.pop({
                      type: "error",
                      offset: this.offset,
                      message: "Unexpected block-seq-ind on same line with key",
                      source: this.source
                    });
                    return;
                  }
                } else if (atMapIndent) {
                  map.items.push({ start });
                }
                this.stack.push(bv);
                return;
              }
            }
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *blockSequence(seq) {
        const it = seq.items[seq.items.length - 1];
        switch (this.type) {
          case "newline":
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                seq.items.push({ start: [this.sourceToken] });
            } else
              it.start.push(this.sourceToken);
            return;
          case "space":
          case "comment":
            if (it.value)
              seq.items.push({ start: [this.sourceToken] });
            else {
              if (this.atIndentedComment(it.start, seq.indent)) {
                const prev = seq.items[seq.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start);
                  end.push(this.sourceToken);
                  seq.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
          case "anchor":
          case "tag":
            if (it.value || this.indent <= seq.indent)
              break;
            it.start.push(this.sourceToken);
            return;
          case "seq-item-ind":
            if (this.indent !== seq.indent)
              break;
            if (it.value || includesToken(it.start, "seq-item-ind"))
              seq.items.push({ start: [this.sourceToken] });
            else
              it.start.push(this.sourceToken);
            return;
        }
        if (this.indent > seq.indent) {
          const bv = this.startBlockValue(seq);
          if (bv) {
            this.stack.push(bv);
            return;
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *flowCollection(fc) {
        const it = fc.items[fc.items.length - 1];
        if (this.type === "flow-error-end") {
          let top;
          do {
            yield* this.pop();
            top = this.peek(1);
          } while (top?.type === "flow-collection");
        } else if (fc.end.length === 0) {
          switch (this.type) {
            case "comma":
            case "explicit-key-ind":
              if (!it || it.sep)
                fc.items.push({ start: [this.sourceToken] });
              else
                it.start.push(this.sourceToken);
              return;
            case "map-value-ind":
              if (!it || it.value)
                fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                Object.assign(it, { key: null, sep: [this.sourceToken] });
              return;
            case "space":
            case "comment":
            case "newline":
            case "anchor":
            case "tag":
              if (!it || it.value)
                fc.items.push({ start: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                it.start.push(this.sourceToken);
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs = this.flowScalar(this.type);
              if (!it || it.value)
                fc.items.push({ start: [], key: fs, sep: [] });
              else if (it.sep)
                this.stack.push(fs);
              else
                Object.assign(it, { key: fs, sep: [] });
              return;
            }
            case "flow-map-end":
            case "flow-seq-end":
              fc.end.push(this.sourceToken);
              return;
          }
          const bv = this.startBlockValue(fc);
          if (bv)
            this.stack.push(bv);
          else {
            yield* this.pop();
            yield* this.step();
          }
        } else {
          const parent = this.peek(2);
          if (parent.type === "block-map" && (this.type === "map-value-ind" && parent.indent === fc.indent || this.type === "newline" && !parent.items[parent.items.length - 1].sep)) {
            yield* this.pop();
            yield* this.step();
          } else if (this.type === "map-value-ind" && parent.type !== "flow-collection") {
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            fixFlowSeqItems(fc);
            const sep = fc.end.splice(1, fc.end.length);
            sep.push(this.sourceToken);
            const map = {
              type: "block-map",
              offset: fc.offset,
              indent: fc.indent,
              items: [{ start, key: fc, sep }]
            };
            this.onKeyLine = true;
            this.stack[this.stack.length - 1] = map;
          } else {
            yield* this.lineEnd(fc);
          }
        }
      }
      flowScalar(type) {
        if (this.onNewLine) {
          let nl = this.source.indexOf("\n") + 1;
          while (nl !== 0) {
            this.onNewLine(this.offset + nl);
            nl = this.source.indexOf("\n", nl) + 1;
          }
        }
        return {
          type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
      }
      startBlockValue(parent) {
        switch (this.type) {
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return this.flowScalar(this.type);
          case "block-scalar-header":
            return {
              type: "block-scalar",
              offset: this.offset,
              indent: this.indent,
              props: [this.sourceToken],
              source: ""
            };
          case "flow-map-start":
          case "flow-seq-start":
            return {
              type: "flow-collection",
              offset: this.offset,
              indent: this.indent,
              start: this.sourceToken,
              items: [],
              end: []
            };
          case "seq-item-ind":
            return {
              type: "block-seq",
              offset: this.offset,
              indent: this.indent,
              items: [{ start: [this.sourceToken] }]
            };
          case "explicit-key-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            start.push(this.sourceToken);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, explicitKey: true }]
            };
          }
          case "map-value-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, key: null, sep: [this.sourceToken] }]
            };
          }
        }
        return null;
      }
      atIndentedComment(start, indent) {
        if (this.type !== "comment")
          return false;
        if (this.indent <= indent)
          return false;
        return start.every((st) => st.type === "newline" || st.type === "space");
      }
      *documentEnd(docEnd) {
        if (this.type !== "doc-mode") {
          if (docEnd.end)
            docEnd.end.push(this.sourceToken);
          else
            docEnd.end = [this.sourceToken];
          if (this.type === "newline")
            yield* this.pop();
        }
      }
      *lineEnd(token) {
        switch (this.type) {
          case "comma":
          case "doc-start":
          case "doc-end":
          case "flow-seq-end":
          case "flow-map-end":
          case "map-value-ind":
            yield* this.pop();
            yield* this.step();
            break;
          case "newline":
            this.onKeyLine = false;
          // fallthrough
          case "space":
          case "comment":
          default:
            if (token.end)
              token.end.push(this.sourceToken);
            else
              token.end = [this.sourceToken];
            if (this.type === "newline")
              yield* this.pop();
        }
      }
    };
    exports2.Parser = Parser;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/public-api.js
var require_public_api = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/public-api.js"(exports2) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var errors = require_errors();
    var log = require_log();
    var identity = require_identity();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    function parseOptions(options) {
      const prettyErrors = options.prettyErrors !== false;
      const lineCounter$1 = options.lineCounter || prettyErrors && new lineCounter.LineCounter() || null;
      return { lineCounter: lineCounter$1, prettyErrors };
    }
    function parseAllDocuments(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      const docs = Array.from(composer$1.compose(parser$1.parse(source)));
      if (prettyErrors && lineCounter2)
        for (const doc of docs) {
          doc.errors.forEach(errors.prettifyError(source, lineCounter2));
          doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
        }
      if (docs.length > 0)
        return docs;
      return Object.assign([], { empty: true }, composer$1.streamInfo());
    }
    function parseDocument(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      let doc = null;
      for (const _doc of composer$1.compose(parser$1.parse(source), true, source.length)) {
        if (!doc)
          doc = _doc;
        else if (doc.options.logLevel !== "silent") {
          doc.errors.push(new errors.YAMLParseError(_doc.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
          break;
        }
      }
      if (prettyErrors && lineCounter2) {
        doc.errors.forEach(errors.prettifyError(source, lineCounter2));
        doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
      }
      return doc;
    }
    function parse2(src, reviver, options) {
      let _reviver = void 0;
      if (typeof reviver === "function") {
        _reviver = reviver;
      } else if (options === void 0 && reviver && typeof reviver === "object") {
        options = reviver;
      }
      const doc = parseDocument(src, options);
      if (!doc)
        return null;
      doc.warnings.forEach((warning) => log.warn(doc.options.logLevel, warning));
      if (doc.errors.length > 0) {
        if (doc.options.logLevel !== "silent")
          throw doc.errors[0];
        else
          doc.errors = [];
      }
      return doc.toJS(Object.assign({ reviver: _reviver }, options));
    }
    function stringify2(value, replacer, options) {
      let _replacer = null;
      if (typeof replacer === "function" || Array.isArray(replacer)) {
        _replacer = replacer;
      } else if (options === void 0 && replacer) {
        options = replacer;
      }
      if (typeof options === "string")
        options = options.length;
      if (typeof options === "number") {
        const indent = Math.round(options);
        options = indent < 1 ? void 0 : indent > 8 ? { indent: 8 } : { indent };
      }
      if (value === void 0) {
        const { keepUndefined } = options ?? replacer ?? {};
        if (!keepUndefined)
          return void 0;
      }
      if (identity.isDocument(value) && !_replacer)
        return value.toString(options);
      return new Document.Document(value, _replacer, options).toString(options);
    }
    exports2.parse = parse2;
    exports2.parseAllDocuments = parseAllDocuments;
    exports2.parseDocument = parseDocument;
    exports2.stringify = stringify2;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/index.js
var require_dist = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/index.js"(exports2) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var Schema2 = require_Schema();
    var errors = require_errors();
    var Alias = require_Alias();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var cst = require_cst();
    var lexer = require_lexer();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    var publicApi = require_public_api();
    var visit = require_visit();
    exports2.Composer = composer.Composer;
    exports2.Document = Document.Document;
    exports2.Schema = Schema2.Schema;
    exports2.YAMLError = errors.YAMLError;
    exports2.YAMLParseError = errors.YAMLParseError;
    exports2.YAMLWarning = errors.YAMLWarning;
    exports2.Alias = Alias.Alias;
    exports2.isAlias = identity.isAlias;
    exports2.isCollection = identity.isCollection;
    exports2.isDocument = identity.isDocument;
    exports2.isMap = identity.isMap;
    exports2.isNode = identity.isNode;
    exports2.isPair = identity.isPair;
    exports2.isScalar = identity.isScalar;
    exports2.isSeq = identity.isSeq;
    exports2.Pair = Pair.Pair;
    exports2.Scalar = Scalar.Scalar;
    exports2.YAMLMap = YAMLMap.YAMLMap;
    exports2.YAMLSeq = YAMLSeq.YAMLSeq;
    exports2.CST = cst;
    exports2.Lexer = lexer.Lexer;
    exports2.LineCounter = lineCounter.LineCounter;
    exports2.Parser = parser.Parser;
    exports2.parse = publicApi.parse;
    exports2.parseAllDocuments = publicApi.parseAllDocuments;
    exports2.parseDocument = publicApi.parseDocument;
    exports2.stringify = publicApi.stringify;
    exports2.visit = visit.visit;
    exports2.visitAsync = visit.visitAsync;
  }
});

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AuditTrail: () => AuditTrail,
  AuthState: () => AuthState,
  Config: () => Config,
  apply: () => apply,
  createLanProxyRoute: () => createLanProxyRoute,
  inject: () => inject,
  lanAddresses: () => lanAddresses,
  name: () => name,
  startLanProxy: () => startLanProxy
});
module.exports = __toCommonJS(index_exports);
var import_node_path5 = require("node:path");

// node_modules/.pnpm/@deepseek-ai+cosmokit@1.8.3/node_modules/@deepseek-ai/cosmokit/lib/index.js
function isNullable(value) {
  return value === null || value === void 0;
}
function isPlainObject(data) {
  return data && typeof data === "object" && !Array.isArray(data);
}
function filterKeys(object, filter) {
  return Object.fromEntries(Object.entries(object).filter(([key, value]) => filter(key, value)));
}
function mapValues(object, transform) {
  return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, transform(value, key)]));
}
function pick(source, keys, forced) {
  if (!keys) return { ...source };
  const result = {};
  for (const key of keys) if (forced || source[key] !== void 0) result[key] = source[key];
  return result;
}
function is(type, value) {
  if (arguments.length === 1) return (value2) => is(type, value2);
  return type in globalThis && value instanceof globalThis[type] || Object.prototype.toString.call(value).slice(8, -1) === type;
}
function isArrayBufferLike(value) {
  return is("ArrayBuffer", value) || is("SharedArrayBuffer", value);
}
function isArrayBufferSource(value) {
  return isArrayBufferLike(value) || ArrayBuffer.isView(value);
}
var Binary;
(function(Binary2) {
  Binary2.is = isArrayBufferLike;
  Binary2.isSource = isArrayBufferSource;
  function fromSource(source) {
    if (ArrayBuffer.isView(source)) return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
    else return source;
  }
  Binary2.fromSource = fromSource;
  function toBase64(source) {
    source = fromSource(source);
    if (typeof Buffer !== "undefined") return Buffer.from(source).toString("base64");
    let binary = "";
    const bytes = new Uint8Array(source);
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }
  Binary2.toBase64 = toBase64;
  function fromBase64(source) {
    if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "base64"));
    return Uint8Array.from(atob(source), (c) => c.charCodeAt(0));
  }
  Binary2.fromBase64 = fromBase64;
  function toHex(source) {
    source = fromSource(source);
    if (typeof Buffer !== "undefined") return Buffer.from(source).toString("hex");
    return Array.from(new Uint8Array(source), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  Binary2.toHex = toHex;
  function fromHex(source) {
    if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "hex"));
    const hex = source.length % 2 === 0 ? source : source.slice(0, source.length - 1);
    const buffer = [];
    for (let i = 0; i < hex.length; i += 2) buffer.push(parseInt(`${hex[i]}${hex[i + 1]}`, 16));
    return Uint8Array.from(buffer).buffer;
  }
  Binary2.fromHex = fromHex;
})(Binary || (Binary = {}));
var base64ToArrayBuffer = Binary.fromBase64;
var arrayBufferToBase64 = Binary.toBase64;
var hexToArrayBuffer = Binary.fromHex;
var arrayBufferToHex = Binary.toHex;
function clone(source, refs = /* @__PURE__ */ new Map()) {
  if (!source || typeof source !== "object") return source;
  if (is("Date", source)) return new Date(source.valueOf());
  if (is("RegExp", source)) return new RegExp(source.source, source.flags);
  if (isArrayBufferLike(source)) return source.slice(0);
  if (ArrayBuffer.isView(source)) return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
  const cached = refs.get(source);
  if (cached) return cached;
  if (Array.isArray(source)) {
    const result2 = [];
    refs.set(source, result2);
    source.forEach((value, index) => {
      result2[index] = Reflect.apply(clone, null, [value, refs]);
    });
    return result2;
  }
  const result = Object.create(Object.getPrototypeOf(source));
  refs.set(source, result);
  for (const key of Reflect.ownKeys(source)) {
    const descriptor = { ...Reflect.getOwnPropertyDescriptor(source, key) };
    if ("value" in descriptor) descriptor.value = Reflect.apply(clone, null, [descriptor.value, refs]);
    Reflect.defineProperty(result, key, descriptor);
  }
  return result;
}
function deepEqual(a, b, strict) {
  if (a === b) return true;
  if (!strict && isNullable(a) && isNullable(b)) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object") return false;
  if (!a || !b) return false;
  function check(test, then) {
    return test(a) ? test(b) ? then(a, b) : false : test(b) ? false : void 0;
  }
  return check(Array.isArray, (a2, b2) => a2.length === b2.length && a2.every((item, index) => deepEqual(item, b2[index]))) ?? check(is("Date"), (a2, b2) => a2.valueOf() === b2.valueOf()) ?? check(is("RegExp"), (a2, b2) => a2.source === b2.source && a2.flags === b2.flags) ?? check(isArrayBufferLike, (a2, b2) => {
    if (a2.byteLength !== b2.byteLength) return false;
    const viewA = new Uint8Array(a2);
    const viewB = new Uint8Array(b2);
    for (let i = 0; i < viewA.length; i++) if (viewA[i] !== viewB[i]) return false;
    return true;
  }) ?? Object.keys({
    ...a,
    ...b
  }).every((key) => deepEqual(a[key], b[key], strict));
}
var Time;
(function(Time2) {
  Time2.millisecond = 1;
  Time2.second = 1e3;
  Time2.minute = Time2.second * 60;
  Time2.hour = Time2.minute * 60;
  Time2.day = Time2.hour * 24;
  Time2.week = Time2.day * 7;
  let timezoneOffset = (/* @__PURE__ */ new Date()).getTimezoneOffset();
  function setTimezoneOffset(offset) {
    timezoneOffset = offset;
  }
  Time2.setTimezoneOffset = setTimezoneOffset;
  function getTimezoneOffset() {
    return timezoneOffset;
  }
  Time2.getTimezoneOffset = getTimezoneOffset;
  function getDateNumber(date2 = /* @__PURE__ */ new Date(), offset) {
    if (typeof date2 === "number") date2 = new Date(date2);
    if (offset === void 0) offset = timezoneOffset;
    return Math.floor((date2.valueOf() / Time2.minute - offset) / 1440);
  }
  Time2.getDateNumber = getDateNumber;
  function fromDateNumber(value, offset) {
    const date2 = new Date(value * Time2.day);
    if (offset === void 0) offset = timezoneOffset;
    return new Date(+date2 + offset * Time2.minute);
  }
  Time2.fromDateNumber = fromDateNumber;
  const numeric = /\d+(?:\.\d+)?/.source;
  const timeRegExp = new RegExp(`^${[
    "w(?:eek(?:s)?)?",
    "d(?:ay(?:s)?)?",
    "h(?:our(?:s)?)?",
    "m(?:in(?:ute)?(?:s)?)?",
    "s(?:ec(?:ond)?(?:s)?)?"
  ].map((unit) => `(${numeric}${unit})?`).join("")}$`);
  function parseTime(source) {
    const capture = timeRegExp.exec(source);
    if (!capture) return 0;
    return (parseFloat(capture[1]) * Time2.week || 0) + (parseFloat(capture[2]) * Time2.day || 0) + (parseFloat(capture[3]) * Time2.hour || 0) + (parseFloat(capture[4]) * Time2.minute || 0) + (parseFloat(capture[5]) * Time2.second || 0);
  }
  Time2.parseTime = parseTime;
  function parseDate(date2) {
    const parsed = parseTime(date2);
    if (parsed) date2 = Date.now() + parsed;
    else if (/^\d{1,2}(:\d{1,2}){1,2}$/.test(date2)) date2 = `${(/* @__PURE__ */ new Date()).toLocaleDateString()}-${date2}`;
    else if (/^\d{1,2}-\d{1,2}-\d{1,2}(:\d{1,2}){1,2}$/.test(date2)) date2 = `${(/* @__PURE__ */ new Date()).getFullYear()}-${date2}`;
    return date2 ? new Date(date2) : /* @__PURE__ */ new Date();
  }
  Time2.parseDate = parseDate;
  function format(ms) {
    const abs = Math.abs(ms);
    if (abs >= Time2.day - Time2.hour / 2) return Math.round(ms / Time2.day) + "d";
    else if (abs >= Time2.hour - Time2.minute / 2) return Math.round(ms / Time2.hour) + "h";
    else if (abs >= Time2.minute - Time2.second / 2) return Math.round(ms / Time2.minute) + "m";
    else if (abs >= Time2.second) return Math.round(ms / Time2.second) + "s";
    return ms + "ms";
  }
  Time2.format = format;
  function toDigits(source, length = 2) {
    return source.toString().padStart(length, "0");
  }
  Time2.toDigits = toDigits;
  function template(template2, time = /* @__PURE__ */ new Date()) {
    return template2.replace("yyyy", time.getFullYear().toString()).replace("yy", time.getFullYear().toString().slice(2)).replace("MM", toDigits(time.getMonth() + 1)).replace("dd", toDigits(time.getDate())).replace("hh", toDigits(time.getHours())).replace("mm", toDigits(time.getMinutes())).replace("ss", toDigits(time.getSeconds())).replace("SSS", toDigits(time.getMilliseconds(), 3));
  }
  Time2.template = template;
})(Time || (Time = {}));

// node_modules/.pnpm/@deepseek-ai+schemastery@3.18.2/node_modules/@deepseek-ai/schemastery/lib/index.mjs
var kSchema = /* @__PURE__ */ Symbol.for("schemastery");
var kValidationError = /* @__PURE__ */ Symbol.for("ValidationError");
globalThis.__schemastery_index__ ??= 0;
globalThis.__schemastery_refs__ = void 0;
var ValidationError = class extends TypeError {
  options;
  name = "ValidationError";
  constructor(message, options) {
    let prefix = "$";
    for (const segment of options.path || []) if (typeof segment === "string") prefix += "." + segment;
    else if (typeof segment === "number") prefix += "[" + segment + "]";
    else if (typeof segment === "symbol") prefix += `[Symbol(${segment.toString()})]`;
    if (prefix.startsWith(".")) prefix = prefix.slice(1);
    super((prefix === "$" ? "" : `${prefix} `) + message);
    this.options = options;
  }
  static is(error) {
    return !!error?.[kValidationError];
  }
};
Object.defineProperty(ValidationError.prototype, kValidationError, { value: true });
var Schema = function(options) {
  const schema = function(data, options2 = {}) {
    return Schema.resolve(data, schema, options2)[0];
  };
  if (options.refs) {
    const refs = mapValues(options.refs, (options2) => new Schema(options2));
    const getRef = (uid) => refs[uid];
    for (const key in refs) {
      const options2 = refs[key];
      options2.sKey = getRef(options2.sKey);
      options2.inner = getRef(options2.inner);
      options2.list = options2.list && options2.list.map(getRef);
      options2.dict = options2.dict && mapValues(options2.dict, getRef);
    }
    return refs[options.uid];
  }
  Object.assign(schema, options);
  if (typeof schema.callback === "string") try {
    schema.callback = new Function("return " + schema.callback)();
  } catch {
  }
  Object.defineProperty(schema, "uid", { value: globalThis.__schemastery_index__++ });
  Object.setPrototypeOf(schema, Schema.prototype);
  schema.meta ||= {};
  schema.toString = schema.toString.bind(schema);
  return schema;
};
Schema.prototype = Object.create(Function.prototype);
Schema.prototype[kSchema] = true;
Object.defineProperty(Schema.prototype, "~standard", { get() {
  return {
    version: 1,
    vendor: "schemastery",
    validate: (value) => {
      try {
        return { value: Schema.resolve(value, this, {})[0] };
      } catch (error) {
        if (ValidationError.is(error)) return { issues: [{
          message: error.message,
          path: error.options.path
        }] };
        throw error;
      }
    }
  };
} });
Schema.ValidationError = ValidationError;
Schema.prototype.toJSON = function toJSON() {
  if (globalThis.__schemastery_refs__) {
    globalThis.__schemastery_refs__[this.uid] ??= JSON.parse(JSON.stringify({ ...this }));
    return this.uid;
  }
  globalThis.__schemastery_refs__ = { [this.uid]: { ...this } };
  globalThis.__schemastery_refs__[this.uid] = JSON.parse(JSON.stringify({ ...this }));
  const result = {
    uid: this.uid,
    refs: globalThis.__schemastery_refs__
  };
  globalThis.__schemastery_refs__ = void 0;
  return result;
};
Schema.prototype.set = function set(key, value) {
  this.dict[key] = value;
  return this;
};
Schema.prototype.push = function push(value) {
  this.list.push(value);
  return this;
};
function mergeDesc(original, messages) {
  const result = typeof original === "string" ? { "": original } : { ...original };
  for (const locale in messages) {
    const value = messages[locale];
    if (value?.$description || value?.$desc) result[locale] = value.$description || value.$desc;
    else if (typeof value === "string") result[locale] = value;
  }
  return result;
}
function getInner(value) {
  return value?.$value ?? value?.$inner;
}
function extractKeys(data) {
  return filterKeys(data ?? {}, (key) => !key.startsWith("$"));
}
Schema.prototype.i18n = function i18n(messages) {
  const schema = Schema(this);
  const desc = mergeDesc(schema.meta.description, messages);
  if (Object.keys(desc).length) schema.meta.description = desc;
  if (schema.dict) schema.dict = mapValues(schema.dict, (inner, key) => {
    return inner.i18n(mapValues(messages, (data) => getInner(data)?.[key] ?? data?.[key]));
  });
  if (schema.list) schema.list = schema.list.map((inner, index) => {
    return inner.i18n(mapValues(messages, (data = {}) => {
      if (Array.isArray(getInner(data))) return getInner(data)[index];
      if (Array.isArray(data)) return data[index];
      return extractKeys(data);
    }));
  });
  if (schema.inner) schema.inner = schema.inner.i18n(mapValues(messages, (data) => {
    if (getInner(data)) return getInner(data);
    return extractKeys(data);
  }));
  if (schema.sKey) schema.sKey = schema.sKey.i18n(mapValues(messages, (data) => data?.$key));
  return schema;
};
Schema.prototype.extra = function extra(key, value) {
  const schema = Schema(this);
  schema.meta = {
    ...schema.meta,
    [key]: value
  };
  return schema;
};
for (const key of [
  "required",
  "disabled",
  "collapse",
  "hidden",
  "loose"
]) Object.assign(Schema.prototype, { [key](value = true) {
  const schema = Schema(this);
  schema.meta = {
    ...schema.meta,
    [key]: value
  };
  return schema;
} });
Schema.prototype.deprecated = function deprecated() {
  const schema = Schema(this);
  schema.meta.badges ||= [];
  schema.meta.badges.push({
    text: "deprecated",
    type: "danger"
  });
  return schema;
};
Schema.prototype.experimental = function experimental() {
  const schema = Schema(this);
  schema.meta.badges ||= [];
  schema.meta.badges.push({
    text: "experimental",
    type: "warning"
  });
  return schema;
};
Schema.prototype.pattern = function pattern(regexp) {
  const schema = Schema(this);
  const pattern2 = pick(regexp, ["source", "flags"]);
  schema.meta = {
    ...schema.meta,
    pattern: pattern2
  };
  return schema;
};
Schema.prototype.simplify = function simplify(value) {
  if (deepEqual(value, this.meta.default, this.type === "dict")) return null;
  if (isNullable(value)) return value;
  if (this.type === "object" || this.type === "dict") {
    const result = {};
    for (const key in value) {
      const item = (this.type === "object" ? this.dict[key] : this.inner)?.simplify(value[key]);
      if (this.type === "dict" || !isNullable(item)) result[key] = item;
    }
    if (deepEqual(result, this.meta.default, this.type === "dict")) return null;
    return result;
  } else if (this.type === "array" || this.type === "tuple") {
    const result = [];
    value.forEach((value2, index) => {
      const schema = this.type === "array" ? this.inner : this.list[index];
      const item = schema ? schema.simplify(value2) : value2;
      result.push(item);
    });
    return result;
  } else if (this.type === "intersect") {
    const result = {};
    for (const item of this.list) Object.assign(result, item.simplify(value));
    return result;
  } else if (this.type === "union") for (const schema of this.list) try {
    Schema.resolve(value, schema, {});
    return schema.simplify(value);
  } catch {
  }
  return value;
};
Schema.prototype.toString = function toString(inline) {
  return formatters[this.type]?.(this, inline) ?? `Schema<${this.type}>`;
};
Schema.prototype.role = function role(role, extra2) {
  const schema = Schema(this);
  schema.meta = {
    ...schema.meta,
    role,
    extra: extra2
  };
  return schema;
};
for (const key of [
  "default",
  "link",
  "comment",
  "description",
  "max",
  "min",
  "step"
]) Object.assign(Schema.prototype, { [key](value) {
  const schema = Schema(this);
  schema.meta = {
    ...schema.meta,
    [key]: value
  };
  return schema;
} });
var resolvers = {};
Schema.extend = function extend(type, resolve4) {
  resolvers[type] = resolve4;
};
Schema.resolve = function resolve(data, schema, options = {}, strict = false) {
  if (!schema) return [data];
  if (options.ignore?.(data, schema)) return [data];
  if (isNullable(data) && schema.type !== "lazy") {
    if (schema.meta.required) throw new ValidationError(`missing required value`, options);
    let current = schema;
    let fallback = schema.meta.default;
    while (current?.type === "intersect" && isNullable(fallback)) {
      current = current.list[0];
      fallback = current?.meta.default;
    }
    if (isNullable(fallback)) return [data];
    data = clone(fallback);
  }
  const callback = resolvers[schema.type];
  if (!callback) throw new ValidationError(`unsupported type "${schema.type}"`, options);
  try {
    return callback(data, schema, options, strict);
  } catch (error) {
    if (!schema.meta.loose) throw error;
    return [schema.meta.default];
  }
};
Schema.from = function from(source) {
  if (isNullable(source)) return Schema.any();
  else if ([
    "string",
    "number",
    "boolean"
  ].includes(typeof source)) return Schema.const(source).required();
  else if (source[kSchema]) return source;
  else if (typeof source === "function") switch (source) {
    case String:
      return Schema.string().required();
    case Number:
      return Schema.number().required();
    case Boolean:
      return Schema.boolean().required();
    case Function:
      return Schema.function().required();
    default:
      return Schema.is(source).required();
  }
  else throw new TypeError(`cannot infer schema from ${source}`);
};
Schema.lazy = function lazy(builder) {
  const toJSON2 = () => {
    if (!schema.inner[kSchema]) {
      schema.inner = schema.builder();
      schema.inner.meta = {
        ...schema.meta,
        ...schema.inner.meta
      };
    }
    return schema.inner.toJSON();
  };
  const schema = new Schema({
    type: "lazy",
    builder,
    inner: { toJSON: toJSON2 }
  });
  return schema;
};
Schema.natural = function natural() {
  return Schema.number().step(1).min(0);
};
Schema.percent = function percent() {
  return Schema.number().step(0.01).min(0).max(1).role("slider");
};
Schema.date = function date() {
  return Schema.union([Schema.is(Date), Schema.transform(Schema.string().role("datetime"), (value, options) => {
    const date2 = new Date(value);
    if (isNaN(+date2)) throw new ValidationError(`invalid date "${value}"`, options);
    return date2;
  }, true)]);
};
Schema.regExp = function regExp(flag = "") {
  return Schema.union([Schema.is(RegExp), Schema.transform(Schema.string().role("regexp", { flag }), (value, options) => {
    try {
      return new RegExp(value, flag);
    } catch (e) {
      throw new ValidationError(e.message, options);
    }
  }, true)]);
};
Schema.arrayBuffer = function arrayBuffer(encoding) {
  return Schema.union([
    Schema.is(ArrayBuffer),
    Schema.is(SharedArrayBuffer),
    Schema.transform(Schema.any(), (value, options) => {
      if (Binary.isSource(value)) return Binary.fromSource(value);
      throw new ValidationError(`expected ArrayBufferSource but got ${value}`, options);
    }, true),
    ...encoding ? [Schema.transform(Schema.string(), (value, options) => {
      try {
        return encoding === "base64" ? Binary.fromBase64(value) : Binary.fromHex(value);
      } catch (e) {
        throw new ValidationError(e.message, options);
      }
    }, true)] : []
  ]);
};
Schema.extend("lazy", (data, schema, options, strict) => {
  if (!schema.inner[kSchema]) {
    schema.inner = schema.builder();
    schema.inner.meta = {
      ...schema.meta,
      ...schema.inner.meta
    };
  }
  return Schema.resolve(data, schema.inner, options, strict);
});
Schema.extend("any", (data) => {
  return [data];
});
Schema.extend("never", (data, _, options) => {
  throw new ValidationError(`expected nullable but got ${data}`, options);
});
Schema.extend("const", (data, { value }, options) => {
  if (deepEqual(data, value)) return [value];
  throw new ValidationError(`expected ${value} but got ${data}`, options);
});
function checkWithinRange(data, meta, description, options, skipMin = false) {
  const { max = Infinity, min = -Infinity } = meta;
  if (data > max) throw new ValidationError(`expected ${description} <= ${max} but got ${data}`, options);
  if (data < min && !skipMin) throw new ValidationError(`expected ${description} >= ${min} but got ${data}`, options);
}
Schema.extend("string", (data, { meta }, options) => {
  if (typeof data !== "string") throw new ValidationError(`expected string but got ${data}`, options);
  if (meta.pattern) {
    const regexp = new RegExp(meta.pattern.source, meta.pattern.flags);
    if (!regexp.test(data)) throw new ValidationError(`expect string to match regexp ${regexp}`, options);
  }
  checkWithinRange(data.length, meta, "string length", options);
  return [data];
});
function decimalShift(data, digits) {
  const str = data.toString();
  if (str.includes("e")) return data * Math.pow(10, digits);
  const index = str.indexOf(".");
  if (index === -1) return data * Math.pow(10, digits);
  const frac = str.slice(index + 1);
  const integer = str.slice(0, index);
  if (frac.length <= digits) return +(integer + frac.padEnd(digits, "0"));
  return +(integer + frac.slice(0, digits) + "." + frac.slice(digits));
}
function isMultipleOf(data, min, step) {
  step = Math.abs(step);
  if (!/^\d+\.\d+$/.test(step.toString())) return (data - min) % step === 0;
  const index = step.toString().indexOf(".");
  const digits = step.toString().slice(index + 1).length;
  return Math.abs(decimalShift(data, digits) - decimalShift(min, digits)) % decimalShift(step, digits) === 0;
}
Schema.extend("number", (data, { meta }, options) => {
  if (typeof data !== "number") throw new ValidationError(`expected number but got ${data}`, options);
  checkWithinRange(data, meta, "number", options);
  const { step } = meta;
  if (step && !isMultipleOf(data, meta.min ?? 0, step)) throw new ValidationError(`expected number multiple of ${step} but got ${data}`, options);
  return [data];
});
Schema.extend("boolean", (data, _, options) => {
  if (typeof data === "boolean") return [data];
  throw new ValidationError(`expected boolean but got ${data}`, options);
});
Schema.extend("bitset", (data, { bits, meta }, options) => {
  let value = 0, keys = [];
  if (typeof data === "number") {
    value = data;
    for (const key in bits) if (data & bits[key]) keys.push(key);
  } else if (Array.isArray(data)) {
    keys = data;
    for (const key of keys) {
      if (typeof key !== "string") throw new ValidationError(`expected string but got ${key}`, options);
      if (key in bits) value |= bits[key];
    }
  } else throw new ValidationError(`expected number or array but got ${data}`, options);
  if (value === meta.default) return [value];
  return [value, keys];
});
Schema.extend("function", (data, _, options) => {
  if (typeof data === "function") return [data];
  throw new ValidationError(`expected function but got ${data}`, options);
});
Schema.extend("is", (data, { constructor }, options) => {
  if (typeof constructor === "function") {
    if (data instanceof constructor) return [data];
    throw new ValidationError(`expected ${constructor.name} but got ${data}`, options);
  } else {
    if (isNullable(data)) throw new ValidationError(`expected ${constructor} but got ${data}`, options);
    let prototype = Object.getPrototypeOf(data);
    while (prototype) {
      if (prototype.constructor?.name === constructor) return [data];
      prototype = Object.getPrototypeOf(prototype);
    }
    throw new ValidationError(`expected ${constructor} but got ${data}`, options);
  }
});
function property(data, key, schema, options) {
  try {
    const [value, adapted] = Schema.resolve(data[key], schema, {
      ...options,
      path: [...options.path || [], key]
    });
    if (adapted !== void 0) data[key] = adapted;
    return value;
  } catch (e) {
    if (!options?.autofix) throw e;
    delete data[key];
    return schema.meta.default;
  }
}
Schema.extend("array", (data, { inner, meta }, options) => {
  if (!Array.isArray(data)) throw new ValidationError(`expected array but got ${data}`, options);
  checkWithinRange(data.length, meta, "array length", options, !isNullable(inner.meta.default));
  return [data.map((_, index) => property(data, index, inner, options))];
});
Schema.extend("dict", (data, { inner, sKey }, options, strict) => {
  if (!isPlainObject(data)) throw new ValidationError(`expected object but got ${data}`, options);
  const result = {};
  for (const key in data) {
    let rKey;
    try {
      rKey = Schema.resolve(key, sKey, options)[0];
    } catch (error) {
      if (strict) continue;
      throw error;
    }
    result[rKey] = property(data, key, inner, options);
    data[rKey] = data[key];
    if (key !== rKey) delete data[key];
  }
  return [result];
});
Schema.extend("tuple", (data, { list }, options, strict) => {
  if (!Array.isArray(data)) throw new ValidationError(`expected array but got ${data}`, options);
  const result = list.map((inner, index) => property(data, index, inner, options));
  if (strict) return [result];
  result.push(...data.slice(list.length));
  return [result];
});
function merge(result, data) {
  for (const key in data) {
    if (key in result) continue;
    result[key] = data[key];
  }
}
Schema.extend("object", (data, { dict }, options, strict) => {
  if (!isPlainObject(data)) throw new ValidationError(`expected object but got ${data}`, options);
  const result = {};
  for (const key in dict) {
    const value = property(data, key, dict[key], options);
    if (!isNullable(value) || key in data) result[key] = value;
  }
  if (!strict) merge(result, data);
  return [result];
});
Schema.extend("union", (data, { list, toString: toString2 }, options, strict) => {
  const messages = [];
  for (const inner of list) try {
    return Schema.resolve(data, inner, options, strict);
  } catch (error) {
    messages.push(error);
  }
  throw new ValidationError(`expected ${toString2()} but got ${JSON.stringify(data)}`, options);
});
Schema.extend("intersect", (data, { list, toString: toString2 }, options, strict) => {
  if (!list.length) return [data];
  let result;
  for (const inner of list) {
    const value = Schema.resolve(data, inner, options, true)[0];
    if (isNullable(value)) continue;
    if (isNullable(result)) result = value;
    else if (typeof result !== typeof value) throw new ValidationError(`expected ${toString2()} but got ${JSON.stringify(data)}`, options);
    else if (typeof value === "object") merge(result ??= {}, value);
    else if (result !== value) throw new ValidationError(`expected ${toString2()} but got ${JSON.stringify(data)}`, options);
  }
  if (!strict && isPlainObject(data)) merge(result, data);
  return [result];
});
Schema.extend("transform", (data, { inner, callback, preserve }, options) => {
  const [result, adapted = data] = Schema.resolve(data, inner, options, true);
  if (preserve) return [callback(result)];
  else return [callback(result), callback(adapted)];
});
var formatters = {};
function defineMethod(name2, keys, format) {
  formatters[name2] = format;
  Object.assign(Schema, { [name2](...args) {
    const schema = new Schema({ type: name2 });
    keys.forEach((key, index) => {
      switch (key) {
        case "sKey":
          schema.sKey = args[index] ?? Schema.string();
          break;
        case "inner":
          schema.inner = Schema.from(args[index]);
          break;
        case "list":
          schema.list = args[index].map(Schema.from);
          break;
        case "dict":
          schema.dict = mapValues(args[index], Schema.from);
          break;
        case "bits":
          schema.bits = {};
          for (const key2 in args[index]) {
            if (typeof args[index][key2] !== "number") continue;
            schema.bits[key2] = args[index][key2];
          }
          break;
        case "callback": {
          const callback = schema.callback = args[index];
          callback["toJSON"] ||= () => callback.toString();
          break;
        }
        case "constructor": {
          const constructor = schema.constructor = args[index];
          if (typeof constructor === "function") constructor["toJSON"] ||= () => constructor["name"];
          break;
        }
        default:
          schema[key] = args[index];
      }
    });
    if (name2 === "object" || name2 === "dict") schema.meta.default = {};
    else if (name2 === "array" || name2 === "tuple") schema.meta.default = [];
    else if (name2 === "bitset") schema.meta.default = 0;
    return schema;
  } });
}
defineMethod("is", ["constructor"], ({ constructor }) => {
  if (typeof constructor === "function") return constructor.name;
  else return constructor;
});
defineMethod("any", [], () => "any");
defineMethod("never", [], () => "never");
defineMethod("const", ["value"], ({ value }) => typeof value === "string" ? JSON.stringify(value) : value);
defineMethod("string", [], () => "string");
defineMethod("number", [], () => "number");
defineMethod("boolean", [], () => "boolean");
defineMethod("bitset", ["bits"], () => "bitset");
defineMethod("function", [], () => "function");
defineMethod("array", ["inner"], ({ inner }) => `${inner.toString(true)}[]`);
defineMethod("dict", ["inner", "sKey"], ({ inner, sKey }) => `{ [key: ${sKey.toString()}]: ${inner.toString()} }`);
defineMethod("tuple", ["list"], ({ list }) => `[${list.map((inner) => inner.toString()).join(", ")}]`);
defineMethod("object", ["dict"], ({ dict }) => {
  if (Object.keys(dict).length === 0) return "{}";
  return `{ ${Object.entries(dict).map(([key, inner]) => {
    return `${key}${inner.meta.required ? "" : "?"}: ${inner.toString()}`;
  }).join(", ")} }`;
});
defineMethod("union", ["list"], ({ list }, inline) => {
  const result = list.map(({ toString: format }) => format()).join(" | ");
  return inline ? `(${result})` : result;
});
defineMethod("intersect", ["list"], ({ list }) => {
  return `${list.map((inner) => inner.toString(true)).join(" & ")}`;
});
defineMethod("transform", [
  "inner",
  "callback",
  "preserve"
], ({ inner }, isInner) => inner.toString(isInner));

// node_modules/.pnpm/@deepseek-ai+dsh-home-paths_2edf0aafde0b0b6a4c3f954fcf54c80c/node_modules/@deepseek-ai/dsh-home-paths/lib/index.js
var import_node_os = require("node:os");
var import_node_path = require("node:path");
var DSH_HOME_DIR_NAME = ".dsh";
var DEFAULT_DSH_HOME_DISPLAY = `~/${DSH_HOME_DIR_NAME}`;
var DSH_HOME_ENV = "DSH_HOME";
function defaultDshHome() {
  return (0, import_node_path.join)((0, import_node_os.homedir)(), DSH_HOME_DIR_NAME);
}
function expandHomePath(path) {
  if (path === "~") return (0, import_node_os.homedir)();
  if (path.startsWith("~/") || path.startsWith("~\\")) return (0, import_node_path.join)((0, import_node_os.homedir)(), path.slice(2));
  return path;
}
function resolveDshHome(configured, env = process.env) {
  const fromEnv = env[DSH_HOME_ENV];
  return (0, import_node_path.resolve)(expandHomePath(configured ?? (fromEnv !== void 0 && fromEnv.trim().length > 0 ? fromEnv : defaultDshHome())));
}
function dshHomePath(...segments) {
  return (0, import_node_path.join)(resolveDshHome(), ...segments);
}

// src/proxy.ts
var import_node_http = __toESM(require("node:http"), 1);
var import_node_os2 = __toESM(require("node:os"), 1);
var import_http_proxy = __toESM(require_http_proxy3(), 1);

// src/session.ts
var import_node_crypto = require("node:crypto");
function safeEqual(a, b) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && (0, import_node_crypto.timingSafeEqual)(ba, bb);
}
function checkBasicAuth(authorization, username, password) {
  const match = /^Basic\s+(.+)$/i.exec(authorization ?? "");
  if (!match) return false;
  let decoded;
  try {
    decoded = Buffer.from(match[1], "base64").toString("utf8");
  } catch {
    return false;
  }
  const sep = decoded.indexOf(":");
  if (sep === -1) return false;
  return safeEqual(decoded.slice(0, sep), username) && safeEqual(decoded.slice(sep + 1), password);
}
var Authenticator = class {
  constructor(config) {
    this.config = config;
  }
  config;
  /** Password login is active only when both username and password are set. */
  get enabled() {
    return this.config.username !== "" && this.config.password !== "";
  }
  isAuthenticated(authorization) {
    if (!this.enabled) return true;
    return checkBasicAuth(authorization, this.config.username, this.config.password);
  }
};

// src/auth.ts
var import_node_crypto2 = require("node:crypto");
var DEFAULT_AUTH_POLICY = {
  sessionTtlMs: 7 * 24 * 60 * 60 * 1e3,
  sessionIdleMs: 12 * 60 * 60 * 1e3,
  maxFailures: 5,
  lockoutMs: 15 * 60 * 1e3,
  failureDelayMs: 250
};
function sessionIdOf(token) {
  return Buffer.from(token).toString("base64url").slice(0, 12);
}
function safeEqual2(a, b) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && (0, import_node_crypto2.timingSafeEqual)(ba, bb);
}
function verifyCredentials(candidate, expected) {
  const userOk = safeEqual2(candidate.username, expected.username);
  const passOk = safeEqual2(candidate.password, expected.password);
  return userOk && passOk;
}
var AuthState = class {
  sessions = /* @__PURE__ */ new Map();
  failures = /* @__PURE__ */ new Map();
  policy;
  now;
  auditSink;
  constructor(options = {}) {
    this.policy = { ...DEFAULT_AUTH_POLICY, ...options.policy };
    this.now = options.now ?? (() => Date.now());
    this.auditSink = options.audit ?? (() => {
    });
  }
  /** The effective policy (the settings UI reports the relevant knobs). */
  get authPolicy() {
    return { ...this.policy };
  }
  /** Append one audit entry and hand it to the sink. */
  audit(entry) {
    this.auditSink(entry);
  }
  /** Drop expired sessions; called opportunistically on every check. */
  sweep(now) {
    for (const [token, session] of this.sessions) {
      const absoluteExpired = now - session.createdAt >= this.policy.sessionTtlMs;
      const idleExpired = now - session.lastSeenAt >= this.policy.sessionIdleMs;
      if (absoluteExpired || idleExpired) this.sessions.delete(token);
    }
  }
  /**
   * Whether one source is currently locked out.
   * @param source - the per-client key (remote address).
   */
  lockedFor(source) {
    const record = this.failures.get(source);
    if (record === void 0) return { locked: false, retryAfterMs: 0 };
    const now = this.now();
    if (record.lockedUntil > now) return { locked: true, retryAfterMs: record.lockedUntil - now };
    if (record.failures >= this.policy.maxFailures) this.failures.delete(source);
    return { locked: false, retryAfterMs: 0 };
  }
  /**
   * Attempt a login.
   *
   * The failure path is uniform: a wrong username, a wrong password and a
   * disabled login all produce the same result, and the lockout counter is keyed
   * by source rather than by username so it cannot be used to enumerate accounts.
   *
   * @param input - candidate credentials plus the request's provenance.
   * @returns the new session, a lockout notice, or a plain failure.
   */
  login(input) {
    const now = this.now();
    const lock = this.lockedFor(input.source);
    if (lock.locked) {
      this.audit({ at: now, event: "login-throttled", source: input.source, detail: "locked out" });
      return { ok: false, reason: "locked", retryAfterMs: lock.retryAfterMs };
    }
    const enabled = input.expected.username !== "" && input.expected.password !== "";
    if (!enabled || !verifyCredentials(
      { username: input.username, password: input.password },
      input.expected
    )) {
      const record = this.failures.get(input.source) ?? { failures: 0, lockedUntil: 0 };
      record.failures += 1;
      if (record.failures >= this.policy.maxFailures) {
        record.lockedUntil = now + this.policy.lockoutMs;
        this.audit({ at: now, event: "locked-out", source: input.source, detail: `${record.failures} failures` });
      }
      this.failures.set(input.source, record);
      this.audit({ at: now, event: "login-failed", source: input.source });
      return {
        ok: false,
        reason: enabled ? "invalid" : "disabled",
        retryAfterMs: record.lockedUntil > now ? record.lockedUntil - now : 0
      };
    }
    this.failures.delete(input.source);
    const session = {
      token: (0, import_node_crypto2.randomBytes)(32).toString("base64url"),
      createdAt: now,
      lastSeenAt: now,
      source: input.source,
      userAgent: (input.userAgent ?? "").slice(0, 200)
    };
    this.sessions.set(session.token, session);
    this.audit({ at: now, event: "login", source: input.source });
    return { ok: true, session };
  }
  /**
   * Issue a session for an ALREADY AUTHORIZED external sign-in.
   *
   * The caller (OAuthRuntime) has verified the one-shot state and the manual
   * binding before this runs, so there is no credential to compare; the session
   * shape, TTL, idle sweep and revocation stay identical to a password login.
   */
  issueExternalSession(input) {
    const now = this.now();
    const session = {
      token: (0, import_node_crypto2.randomBytes)(32).toString("base64url"),
      createdAt: now,
      lastSeenAt: now,
      source: input.source,
      userAgent: (input.userAgent ?? "").slice(0, 200)
    };
    this.sessions.set(session.token, session);
    this.failures.delete(input.source);
    this.audit({ at: now, event: "oauth-login", source: input.source });
    return session;
  }
  /**
   * Validate a session cookie and refresh its idle timer.
   * @param token - the cookie value, when present.
   * @returns the live session, or null when there is none.
   */
  authenticate(token) {
    if (token === void 0 || token === "") return null;
    const now = this.now();
    this.sweep(now);
    const session = this.sessions.get(token);
    if (session === void 0) return null;
    session.lastSeenAt = now;
    return session;
  }
  /** Every live session, projected for the settings UI (optionally marking the caller's). */
  listSessions(currentToken) {
    const now = this.now();
    this.sweep(now);
    const currentId = currentToken === void 0 ? null : sessionIdOf(currentToken);
    return [...this.sessions.values()].sort((a, b) => b.lastSeenAt - a.lastSeenAt).map((session) => ({
      id: sessionIdOf(session.token),
      createdAt: session.createdAt,
      lastSeenAt: session.lastSeenAt,
      source: session.source,
      userAgent: session.userAgent,
      current: currentId !== null && sessionIdOf(session.token) === currentId
    }));
  }
  /**
   * Revoke one session by its public id.
   * @param id - the id from {@link listSessions}.
   * @returns whether a session was revoked.
   */
  revokeSession(id) {
    for (const [token, session] of this.sessions) {
      if (sessionIdOf(token) === id) {
        this.sessions.delete(token);
        this.audit({ at: this.now(), event: "session-revoked", source: session.source, detail: id });
        return true;
      }
    }
    return false;
  }
  /** Revoke every session except the caller's (or all of them). */
  revokeAllSessions(keepToken) {
    const now = this.now();
    let revoked = 0;
    for (const [token, session] of this.sessions) {
      if (keepToken !== void 0 && token === keepToken) continue;
      this.sessions.delete(token);
      revoked += 1;
      this.audit({ at: now, event: "logout-all", source: session.source });
    }
    return revoked;
  }
  /**
   * End the caller's own session.
   * @param token - the session cookie value.
   */
  logout(token) {
    if (token === void 0) return;
    const session = this.sessions.get(token);
    if (session === void 0) return;
    this.sessions.delete(token);
    this.audit({ at: this.now(), event: "logout", source: session.source });
  }
  /**
   * Sources that are locked out right now, newest lock first.
   *
   * Exposed so an operator can see a brute-force attempt in progress and, in
   * particular, tell whether it is one noisy device or many — the audit trail
   * answers "what happened", this answers "what is happening".
   */
  lockedSources() {
    const now = this.now();
    const out = [];
    for (const [source, record] of this.failures) {
      if (record.lockedUntil <= now) continue;
      out.push({ source, failures: record.failures, retryAfterMs: record.lockedUntil - now });
    }
    return out.sort((a, b) => b.retryAfterMs - a.retryAfterMs);
  }
  /** Number of live sessions (used by tests and the status surface). */
  get sessionCount() {
    this.sweep(this.now());
    return this.sessions.size;
  }
};
var SESSION_COOKIE = "__Host-dsh_proxy_session";
function sessionCookie(token, maxAgeSeconds, name2 = SESSION_COOKIE) {
  const secure = name2 === SESSION_COOKIE ? "; Secure" : "";
  return `${name2}=${token}; Path=/; HttpOnly${secure}; SameSite=Strict; Max-Age=${Math.max(0, Math.floor(maxAgeSeconds))}`;
}
function clearedSessionCookie(name2 = SESSION_COOKIE) {
  const secure = name2 === SESSION_COOKIE ? "; Secure" : "";
  return `${name2}=; Path=/; HttpOnly${secure}; SameSite=Strict; Max-Age=0`;
}
function readCookie(header, name2) {
  if (header === void 0) return void 0;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() !== name2) continue;
    return part.slice(eq + 1).trim();
  }
  return void 0;
}

// src/contract.ts
var LAN_PROXY_PATH = "/api/dsh-proxy";
var ENDPOINT_STATUS = "status";
var ENDPOINT_UPDATE = "update";
var ENDPOINT_START = "start";
var ENDPOINT_STOP = "stop";
var ENDPOINT_AUTH = "auth";
var ENDPOINT_AUDIT = "audit";
var ENDPOINT_AUTH_REVOKE = "auth-revoke";
var ENDPOINT_SECURITY = "security";
var ENDPOINT_OAUTH_STATUS = "oauth-status";
var ENDPOINT_OAUTH_UPDATE = "oauth-update";
var ENDPOINT_OAUTH_BINDING_START = "oauth-binding-start";
var ENDPOINT_OAUTH_BINDING_REMOVE = "oauth-binding-remove";
var OAUTH_CHANNEL = "dsh-proxy-oauth";
var OAUTH_MESSAGE_SOURCE = "dsh-proxy-oauth";
var OAUTH_POPUP_TIMEOUT_MS = 3 * 60 * 1e3;
function isLanExposed(listenHost, proxyListening, authEnabled) {
  return proxyListening && !authEnabled && isLanVisibleHost(listenHost);
}
var LOOPBACK_HOSTS = /* @__PURE__ */ new Set(["localhost", "127.0.0.1", "::1", "0:0:0:0:0:0:0:1"]);
function isLanVisibleHost(host) {
  let value = host.trim().toLowerCase();
  if (value.startsWith("[") && value.endsWith("]")) value = value.slice(1, -1);
  if (value.startsWith("::ffff:")) value = value.slice("::ffff:".length);
  if (value === "" || LOOPBACK_HOSTS.has(value)) return false;
  return !value.startsWith("127.");
}

// src/loginpage.ts
function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function renderLoginPage(options) {
  const title = escapeHtml(options.title ?? "DSH \u5C40\u57DF\u7F51\u4EE3\u7406");
  const action = escapeHtml(options.action);
  const error = options.error === void 0 || options.error === "" ? "" : `<p class="error" role="alert">${escapeHtml(options.error)}</p>`;
  const insecure = options.secure ? "" : '<p class="warn" role="alert">\u5F53\u524D\u8FDE\u63A5\u672A\u52A0\u5BC6\uFF08HTTP\uFF09\uFF1A\u5BC6\u7801\u4F1A\u4EE5\u660E\u6587\u7ECF\u8FC7\u7F51\u7EDC\uFF0C\u8BF7\u8BA9\u53CD\u5411\u4EE3\u7406\u542F\u7528 HTTPS \u540E\u518D\u767B\u5F55\u3002</p>';
  const passwordForm = options.passwordForm !== false;
  const providers = options.providers ?? [];
  const subtitle = passwordForm ? "\u8BF7\u8F93\u5165\u7528\u6237\u540D\u548C\u5BC6\u7801\u4EE5\u8BBF\u95EE DSH\u3002" : "\u8BF7\u4F7F\u7528\u5DF2\u542F\u7528\u7684\u7B2C\u4E09\u65B9\u8D26\u53F7\u767B\u5F55\u3002";
  const form = passwordForm ? `
  <form method="post" action="${action}" autocomplete="on">
    <label for="username">\u7528\u6237\u540D</label>
    <input id="username" name="username" type="text" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" required autofocus>
    <label for="password">\u5BC6\u7801</label>
    <input id="password" name="password" type="password" autocomplete="current-password" required>
    <button type="submit">\u767B\u5F55</button>
  </form>` : "";
  const oauth = providers.length === 0 ? "" : `
  <p id="oauth-error" class="error" role="alert" hidden></p>
  <p id="oauth-pending" class="pending" role="status" hidden>
    \u6B63\u5728\u7B49\u5F85\u7B2C\u4E09\u65B9\u8BA4\u8BC1\u2026
    <button type="button" id="oauth-cancel" class="cancelBtn">\u53D6\u6D88\u8BA4\u8BC1</button>
  </p>
  <div class="oauth">
    ${passwordForm ? '<p class="sub oauthHint">\u6216\u4F7F\u7528\u7B2C\u4E09\u65B9\u8D26\u53F7\u767B\u5F55</p>' : ""}
    ${providers.map((button) => `<a class="oauthBtn" href="${escapeHtml(button.startUrl)}" target="_blank" rel="noopener noreferrer" onclick="return window.dshProxyOauthOpen ? window.dshProxyOauthOpen(this) : true">${button.icon}<span>${escapeHtml(button.label)}</span></a>`).join("\n    ")}
  </div>`;
  const oauthScript = providers.length === 0 ? "" : `
<script>
(function () {
  var popup = null;
  var timeout = null;
  var watcher = null;
  // Only a live flow may react to a result. Authorization can finish in the
  // popup just as the visitor cancels / times out / closes it; that late
  // message must not navigate the opener afterwards.
  var active = false;
  function showError(text) {
    var box = document.getElementById('oauth-error');
    if (box) { box.textContent = text; box.removeAttribute('hidden'); }
  }
  function setPending(on) {
    var box = document.getElementById('oauth-pending');
    if (box) box.hidden = !on;
  }
  function cleanup() {
    if (timeout !== null) { window.clearTimeout(timeout); timeout = null; }
    if (watcher !== null) { window.clearInterval(watcher); watcher = null; }
    active = false;
    popup = null;
    setPending(false);
  }
  function closePopup() {
    if (popup !== null && !popup.closed) { try { popup.close(); } catch (error) {} }
  }
  function receive(data) {
    if (!active) return;
    if (!data || data.source !== ${JSON.stringify(OAUTH_MESSAGE_SOURCE)} || data.intent !== 'login') return;
    cleanup();
    if (data.status === 'ok') { window.location.replace('/'); return; }
    showError(data.message || '\u7B2C\u4E09\u65B9\u767B\u5F55\u672A\u5B8C\u6210\uFF0C\u8BF7\u91CD\u8BD5\u3002');
  }
  window.dshProxyOauthOpen = function (anchor) {
    try { popup = window.open('about:blank', 'dsh-proxy-oauth', 'popup,width=520,height=700'); } catch (error) { popup = null; }
    if (popup === null) return true;
    try { popup.opener = null; } catch (error) {}
    try { popup.location.href = anchor.href; } catch (error) {}
    var errorBox = document.getElementById('oauth-error');
    if (errorBox) errorBox.setAttribute('hidden', '');
    active = true;
    setPending(true);
    timeout = window.setTimeout(function () {
      closePopup();
      cleanup();
      showError('\u7B49\u5F85\u7B2C\u4E09\u65B9\u8BA4\u8BC1\u8D85\u65F6\uFF083 \u5206\u949F\uFF09\uFF0C\u5F39\u7A97\u5DF2\u5173\u95ED\uFF0C\u8BF7\u91CD\u8BD5\u3002');
    }, ${OAUTH_POPUP_TIMEOUT_MS});
    watcher = window.setInterval(function () {
      if (popup !== null && popup.closed) cleanup();
    }, 1000);
    return false;
  };
  window.dshProxyOauthCancel = function () {
    closePopup();
    cleanup();
    showError('\u5DF2\u53D6\u6D88\u7B2C\u4E09\u65B9\u8BA4\u8BC1\u3002');
  };
  var cancel = document.getElementById('oauth-cancel');
  if (cancel) cancel.addEventListener('click', window.dshProxyOauthCancel);
  try {
    var channel = new BroadcastChannel(${JSON.stringify(OAUTH_CHANNEL)});
    channel.onmessage = function (event) { receive(event.data); };
  } catch (error) {}
  window.addEventListener('message', function (event) {
    if (event.origin !== window.location.origin) return;
    receive(event.data);
  });
})();
</script>`;
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="referrer" content="no-referrer">
<meta name="robots" content="noindex, nofollow">
<title>${title}</title>
<style>
:root { color-scheme: light dark; }
* { box-sizing: border-box; }
body {
  margin: 0; min-height: 100vh; display: grid; place-items: center;
  background: #0f1115; color: #e6edf3;
  font: 14px/22px -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
}
main { width: min(360px, calc(100vw - 32px)); padding: 24px; border: 1px solid #30363d; border-radius: 12px; background: #161b22; }
h1 { margin: 0 0 4px; font-size: 18px; line-height: 26px; }
p.sub { margin: 0 0 16px; color: #8b949e; font-size: 12px; line-height: 18px; }
label { display: block; margin: 0 0 4px; color: #c9d1d9; font-size: 13px; }
input {
  width: 100%; margin: 0 0 12px; padding: 8px 10px;
  border: 1px solid #30363d; border-radius: 8px; background: #0d1117; color: #e6edf3;
  font: inherit;
}
input:focus-visible { outline: 2px solid #2f81f7; outline-offset: 1px; }
button {
  width: 100%; padding: 8px 14px; border: 1px solid #2f81f7; border-radius: 8px;
  background: #2f81f7; color: #fff; font: inherit; font-weight: 500; cursor: pointer;
}
button:hover { background: #388bfd; border-color: #388bfd; }
p.error { margin: 0 0 12px; padding: 8px 10px; border-left: 3px solid #f85149; border-radius: 4px; background: rgb(248 81 73 / 12%); color: #ff7b72; font-size: 13px; }
p.error[hidden] { display: none; }
p.pending[hidden] { display: none; }
p.pending { margin: 12px 0 0; padding: 8px 10px; border-left: 3px solid #2f81f7; border-radius: 4px; background: rgb(47 129 247 / 12%); color: #79c0ff; font-size: 12px; line-height: 18px; }
button.cancelBtn { width: auto; margin: 8px 0 0; padding: 4px 10px; font-size: 12px; }
p.warn { margin: 12px 0 0; padding: 8px 10px; border-left: 3px solid #d29922; border-radius: 4px; background: rgb(210 153 34 / 12%); color: #d29922; font-size: 12px; line-height: 18px; }
div.oauth { display: grid; gap: 8px; margin-top: 4px; }
p.oauthHint { margin: 12px 0 0; text-align: center; }
a.oauthBtn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  box-sizing: border-box; width: 100%; padding: 8px 12px;
  border: 1px solid #30363d; border-radius: 8px; background: #0d1117; color: #e6edf3;
  font-size: 13px; line-height: 20px; text-decoration: none; cursor: pointer;
}
a.oauthBtn:hover { border-color: #2f81f7; }
a.oauthBtn svg { flex: none; }
@media (prefers-color-scheme: light) {
  body { background: #f6f7f9; color: #0f1115; }
  main { background: #fff; border-color: #d7dbe0; }
  p.sub { color: #61666b; }
  label { color: #3c4149; }
  input { background: #fff; border-color: #d7dbe0; color: #0f1115; }
  a.oauthBtn { background: #fff; border-color: #d7dbe0; color: #0f1115; }
  p.error { color: #b3261e; }
  p.pending { color: #0969da; }
}
</style>
</head>
<body>
<main>
  <h1>${title}</h1>
  <p class="sub">${subtitle}</p>
  ${error}
  ${insecure}
  ${form}
  ${oauth}
</main>
${oauthScript}
</body>
</html>
`;
}
function loginFailureMessage(reason, retryAfterMs) {
  if (reason === "locked") {
    const minutes = Math.max(1, Math.ceil(retryAfterMs / 6e4));
    return `\u5931\u8D25\u6B21\u6570\u8FC7\u591A\uFF0C\u8BF7\u5728\u7EA6 ${minutes} \u5206\u949F\u540E\u91CD\u8BD5\u3002`;
  }
  if (reason === "disabled") return "\u7BA1\u7406\u5458\u5C1A\u672A\u8BBE\u7F6E\u5BC6\u7801\uFF0C\u65E0\u6CD5\u767B\u5F55\u3002";
  return "\u7528\u6237\u540D\u6216\u5BC6\u7801\u4E0D\u6B63\u786E\u3002";
}

// src/netaccess.ts
var LOOPBACK_HOSTS2 = /* @__PURE__ */ new Set(["localhost", "127.0.0.1", "::1", "0:0:0:0:0:0:0:1"]);
function canonical(value) {
  let host = value.trim().toLowerCase();
  if (host.startsWith("[") && host.endsWith("]")) host = host.slice(1, -1);
  if (host.startsWith("::ffff:")) host = host.slice("::ffff:".length);
  return host;
}
function isLoopbackAddress(value) {
  const host = canonical(value);
  if (host === "") return false;
  if (LOOPBACK_HOSTS2.has(host)) return true;
  return /^127\./.test(host);
}
function isTrustedProxyPeer(remoteAddress, trusted) {
  if (remoteAddress === void 0) return false;
  const peer = canonical(remoteAddress);
  if (isLoopbackAddress(peer)) return true;
  for (const candidate of trusted.addresses) {
    if (canonical(candidate) === peer) return true;
  }
  return false;
}
function firstValue(header) {
  const raw = Array.isArray(header) ? header[0] : header;
  if (raw === void 0) return void 0;
  const first = raw.split(",")[0]?.trim();
  return first === void 0 || first === "" ? void 0 : first;
}
function resolveSecureTransport(input) {
  if (input.peerTrusted) {
    const proto = firstValue(input.forwardedProto)?.toLowerCase();
    if (proto === "https") return true;
    if (proto === "http") return false;
  }
  return input.socketEncrypted;
}
function resolveClientAddress(input) {
  if (input.peerTrusted) {
    const raw = Array.isArray(input.forwardedFor) ? input.forwardedFor.join(",") : input.forwardedFor;
    if (raw !== void 0) {
      const hops = raw.split(",").map((hop) => hop.trim()).filter((hop) => hop !== "");
      const last = hops[hops.length - 1];
      if (last !== void 0) return canonical(last);
    }
  }
  return canonical(input.peerAddress ?? "") || "unknown";
}
var SECURE_COOKIE_NAME = "__Host-dsh_proxy_session";
var PLAINTEXT_COOKIE_NAME = "dsh_proxy_session";
function resolveGate(input) {
  let hostname = "";
  let authority = input.host ?? "";
  try {
    hostname = new URL(`http://${input.host ?? ""}`).hostname;
  } catch {
    hostname = "";
  }
  if (authority === "") authority = "localhost";
  const loopback = isLoopbackAddress(hostname);
  const transportSecure = input.secure || input.socketEncrypted;
  const secureContext = transportSecure || loopback;
  const scheme = transportSecure ? "https" : "http";
  if (secureContext) {
    return {
      mode: "session",
      secure: true,
      cookieName: SECURE_COOKIE_NAME,
      origin: `${scheme}://${authority}`
    };
  }
  if (input.requireTls) {
    return { mode: "plaintext-blocked", secure: false, cookieName: PLAINTEXT_COOKIE_NAME, origin: `${scheme}://${authority}` };
  }
  const mode = input.cleartextAuth === "basic" ? "basic" : "session";
  return { mode, secure: false, cookieName: PLAINTEXT_COOKIE_NAME, origin: `${scheme}://${authority}` };
}

// src/polyfill.ts
var RANDOM_UUID_POLYFILL = '<script>(function(){try{if(typeof crypto!=="undefined"&&crypto&&typeof crypto.randomUUID!=="function"){crypto.randomUUID=function(){var b=crypto.getRandomValues(new Uint8Array(16));b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;var h="";for(var i=0;i<16;i++){h+=b[i].toString(16).padStart(2,"0")}return h.slice(0,8)+"-"+h.slice(8,12)+"-"+h.slice(12,16)+"-"+h.slice(16,20)+"-"+h.slice(20)}}}catch(e){}})();</script>';
function injectPolyfill(html, polyfill = RANDOM_UUID_POLYFILL) {
  const head = html.toLowerCase().indexOf("<head");
  if (head !== -1) {
    const end = html.indexOf(">", head);
    if (end !== -1) return html.slice(0, end + 1) + polyfill + html.slice(end + 1);
    return polyfill + html;
  }
  return polyfill + html;
}

// src/clientpatch.ts
var LOOPBACK_TRUST_PATCHES = [
  {
    // dsh-client-connection: the one place `connection.isLoopback` is born;
    // forcing true makes every consumer (settings mirror persistence,
    // settings-general document store, deliverables open-file) treat the
    // proxied origin as host-trusted. The needle tracks the dsh-client-connection
    // bundle's current expression (0.1.2 added a leading `ownsHost` disjunct —
    // `transport?.ownsHost === true || pageLocation === void 0 || isLoopbackHostname(...)`);
    // a new DSH release may shift it again, degrading to remote behavior rather
    // than erroring differently than direct LAN access.
    needle: "isLoopback: transport?.ownsHost === true || pageLocation === void 0 || isLoopbackHostname(pageLocation.hostname),",
    replacement: "isLoopback: true,",
    purpose: "connection.isLoopback (settings mirror stays unavailable)"
  },
  {
    // dsh-client-ui-settings: defense in depth — if the connection shape ever
    // changes upstream, the settings describe mirror keeps its host mode. The
    // needle tracks the current expression (`ctx.remote.$host.isLoopback`, the
    // connection's persisted isLoopback consumed in the settings plugin).
    needle: 'ctx.remote.$host.isLoopback ? "host" : "memory"',
    replacement: '"host"',
    purpose: "settings describe mirror persistence"
  }
];
function isJavaScriptContentType(contentType) {
  return contentType.toLowerCase().includes("javascript");
}
function patchClientScript(code) {
  let out = code;
  const matched = [];
  for (const patch of LOOPBACK_TRUST_PATCHES) {
    if (!out.includes(patch.needle)) continue;
    matched.push(patch.purpose);
    out = out.split(patch.needle).join(patch.replacement);
  }
  return { code: out, matched };
}

// src/compression.ts
var import_node_zlib = __toESM(require("node:zlib"), 1);
function parseEncoding(ce) {
  if (!ce) return "identity";
  const first = String(ce).split(",")[0].trim().toLowerCase();
  return first || "identity";
}
function decompress(buf, encoding) {
  if (!encoding || encoding === "identity") return buf;
  try {
    switch (encoding) {
      case "gzip":
        return import_node_zlib.default.gunzipSync(buf);
      case "deflate":
        try {
          return import_node_zlib.default.inflateSync(buf);
        } catch {
          return import_node_zlib.default.inflateRawSync(buf);
        }
      case "br":
        return import_node_zlib.default.brotliDecompressSync(buf);
      default:
        return null;
    }
  } catch {
    return null;
  }
}
function recompress(buf, encoding) {
  if (!encoding || encoding === "identity") return buf;
  try {
    switch (encoding) {
      case "gzip":
        return import_node_zlib.default.gzipSync(buf);
      case "deflate":
        return import_node_zlib.default.deflateSync(buf);
      case "br":
        return import_node_zlib.default.brotliCompressSync(buf);
      default:
        return null;
    }
  } catch {
    return null;
  }
}
function attachBodyTransform(res, proxyRes, transform) {
  const encoding = parseEncoding(proxyRes.headers["content-encoding"]);
  delete proxyRes.headers["content-length"];
  res.removeHeader("content-length");
  const chunks = [];
  const origWrite = res.write.bind(res);
  const origEnd = res.end.bind(res);
  res.write = (chunk, ...rest) => {
    if (chunk !== void 0 && chunk !== null) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return true;
  };
  res.end = (chunk, ...rest) => {
    if (chunk !== void 0 && chunk !== null) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    res.write = origWrite;
    res.end = origEnd;
    const raw = Buffer.concat(chunks);
    let out = raw;
    const plain = decompress(raw, encoding);
    if (plain !== null) {
      const rewritten = transform(plain);
      if (rewritten !== null) {
        const compressed = recompress(rewritten, encoding);
        if (compressed !== null) {
          out = compressed;
        } else {
          out = rewritten;
          delete proxyRes.headers["content-encoding"];
        }
      }
    }
    origEnd(out, ...rest);
  };
}

// src/proxy.ts
var AUTH_REALM = "dsh-proxy";
var AUTH_PATH_PREFIX = "/__dsh-proxy";
var LOGIN_PATH = `${AUTH_PATH_PREFIX}/login`;
var LOGOUT_PATH = `${AUTH_PATH_PREFIX}/logout`;
var PUBLIC_PATHS = /* @__PURE__ */ new Set(["/manifest.webmanifest", "/favicon.svg"]);
var TOKEN_QUERY = "token";
function lanAddresses(port) {
  const ips = [];
  for (const ifaces of Object.values(import_node_os2.default.networkInterfaces())) {
    for (const entry of ifaces ?? []) {
      if (entry.family === "IPv4" && !entry.internal) ips.push(entry.address);
    }
  }
  return ips.map((ip) => `http://${ip}:${port}`);
}
function startLanProxy(options) {
  const {
    listenHost,
    listenPort,
    upstreamHost,
    upstreamPort,
    username,
    password,
    log = () => {
    }
  } = options;
  const targetOrigin = `http://${upstreamHost}:${upstreamPort}`;
  const auth = new Authenticator({ username, password });
  const proxy = import_http_proxy.default.createProxyServer({
    target: targetOrigin,
    ws: true,
    changeOrigin: true
  });
  proxy.on("error", (err, _req, res) => {
    log("error", `upstream ${targetOrigin} error: ${err.message}`);
    if (res && "writeHead" in res && !res.headersSent) {
      try {
        res.writeHead(502, { "content-type": "text/plain; charset=utf-8" });
        res.end("502 Bad Gateway");
      } catch {
      }
    }
  });
  const publicOrigins = /* @__PURE__ */ new WeakMap();
  const redirectIndexToTokenExchange = (req, res, statusCode) => {
    if (statusCode !== 401 || options.authenticatedUrl === void 0) return false;
    if (req.method !== "GET") return false;
    let pathname;
    let hasToken;
    try {
      const url = new URL(req.url ?? "/", "http://proxy.local");
      pathname = url.pathname;
      hasToken = url.searchParams.has(TOKEN_QUERY);
    } catch {
      return false;
    }
    if (pathname !== "/" || hasToken) return false;
    const authority = publicOrigins.get(req);
    if (authority === void 0) return false;
    let target;
    try {
      target = options.authenticatedUrl(`http://${authority}`);
    } catch {
      return false;
    }
    if (target === void 0) return false;
    res.writeHead(302, {
      location: target,
      "cache-control": "no-store",
      "referrer-policy": "no-referrer"
    });
    res.end();
    return true;
  };
  proxy.on("proxyRes", (proxyRes, req, res) => {
    if (redirectIndexToTokenExchange(req, res, proxyRes.statusCode)) {
      proxyRes.resume();
      return;
    }
    const contentType = String(proxyRes.headers["content-type"] ?? "");
    const isHtml = contentType.includes("text/html");
    const isJs = isJavaScriptContentType(contentType);
    if (!isHtml && !isJs) return;
    attachBodyTransform(res, proxyRes, (plain) => {
      const text = plain.toString("utf8");
      if (isHtml) {
        return Buffer.from(injectPolyfill(text, RANDOM_UUID_POLYFILL));
      }
      const { code, matched } = patchClientScript(text);
      if (matched.length > 0) {
        log("info", `loopback-trust patch applied: ${matched.join(", ")}`);
        return Buffer.from(code);
      }
      return null;
    });
  });
  const alignOrigin = (req) => {
    if (req.headers.origin) req.headers.origin = targetOrigin;
  };
  const challenge = (res) => {
    res.writeHead(401, {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      "www-authenticate": `Basic realm="${AUTH_REALM}"`
    });
    res.end("401 Unauthorized");
  };
  const gateFor = (req) => {
    const peerTrusted = isTrustedProxyPeer(req.socket.remoteAddress, {
      addresses: new Set(options.trustedProxyAddresses ?? [])
    });
    const secure = resolveSecureTransport({
      forwardedProto: req.headers["x-forwarded-proto"],
      peerTrusted,
      socketEncrypted: req.socket.encrypted === true
    });
    return resolveGate({
      secure,
      host: req.headers.host,
      socketEncrypted: req.socket.encrypted === true,
      requireTls: options.requireTls === true,
      cleartextAuth: options.cleartextAuth ?? "login"
    });
  };
  const gateEnforced = () => auth.enabled || options.oauth?.authEnabled === true;
  const clientAddressFor = (req) => {
    const peerTrusted = isTrustedProxyPeer(req.socket.remoteAddress, {
      addresses: new Set(options.trustedProxyAddresses ?? [])
    });
    return resolveClientAddress({
      forwardedFor: req.headers["x-forwarded-for"],
      peerAddress: req.socket.remoteAddress,
      peerTrusted
    });
  };
  const loginPageHeaders = (contentType) => ({
    "content-type": contentType,
    "cache-control": "no-store, must-revalidate",
    "referrer-policy": "no-referrer",
    // Self-contained page: one inline style block and (only when OAuth channels
    // exist) one inline script that opens a script-owned popup. default-src
    // 'none' still forbids every external resource; the inline script must be
    // allowed or the browser falls back to a plain tab that cannot be closed.
    // Every interpolated value is escaped server-side.
    "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY"
  });
  const readFormBody = (req, limit = 8 * 1024) => new Promise((resolve4) => {
    let body = "";
    let size = 0;
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      size += Buffer.byteLength(chunk);
      if (size > limit) {
        resolve4(body);
        req.destroy();
        return;
      }
      body += chunk;
    });
    req.on("end", () => resolve4(body));
    req.on("error", () => resolve4(body));
  });
  const crossSiteReason = (req) => {
    const fetchSite = req.headers["sec-fetch-site"];
    if (typeof fetchSite === "string") {
      if (fetchSite === "same-origin" || fetchSite === "none") return null;
      if (fetchSite === "same-site" || fetchSite === "cross-site") {
        return `\u6D4F\u89C8\u5668\u62A5\u544A\u6765\u6E90\u4E3A ${fetchSite}\uFF08\u4EC5\u63A5\u53D7\u540C\u6E90\u63D0\u4EA4\uFF09`;
      }
    }
    const origin = req.headers.origin;
    if (origin === void 0) return null;
    if (origin === "null") return null;
    let host;
    try {
      host = new URL(origin).host;
    } catch {
      return `Origin \u5934\u65E0\u6CD5\u89E3\u6790\uFF1A${origin}`;
    }
    const expected = req.headers.host ?? "";
    if (host !== expected) {
      return `\u6765\u6E90\u6821\u9A8C\u5931\u8D25\uFF1AOrigin=${host} \u4E0E Host=${expected} \u4E0D\u4E00\u81F4`;
    }
    return null;
  };
  const isCrossSite = (req) => crossSiteReason(req) !== null;
  const refuseCleartext = (res) => {
    res.writeHead(403, {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      "referrer-policy": "no-referrer"
    });
    res.end("403 Forbidden \u2014 this proxy requires HTTPS (configure requireTls after putting a TLS reverse proxy in front).");
  };
  const serveLoginPage = (res, gate, error) => {
    const html = renderLoginPage({
      action: LOGIN_PATH,
      secure: gate.secure,
      providers: options.oauth?.loginProviders(gate.mode) ?? [],
      passwordForm: auth.enabled,
      ...options.loginTitle === void 0 ? {} : { title: options.loginTitle },
      ...error === void 0 ? {} : { error }
    });
    res.writeHead(200, loginPageHeaders("text/html; charset=utf-8"));
    res.end(html);
  };
  const handleAuthRoutes = async (req, res, pathname, gate) => {
    if (options.oauth !== void 0 && await options.oauth.handle(req, res, pathname, gate, clientAddressFor(req))) {
      return true;
    }
    const store = options.auth;
    if (store === void 0 || gate.mode !== "session" || !gateEnforced()) return false;
    if (pathname === LOGIN_PATH) {
      if (req.method === "GET" || req.method === "HEAD") {
        const existing = options.auth?.authenticate(readCookie(req.headers.cookie, gate.cookieName));
        if (existing !== null && existing !== void 0) {
          res.writeHead(303, { "cache-control": "no-store", location: "/" });
          res.end();
          return true;
        }
        serveLoginPage(res, gate);
        return true;
      }
      if (req.method !== "POST") {
        res.writeHead(405, loginPageHeaders("text/plain; charset=utf-8")).end("405 Method Not Allowed");
        return true;
      }
      const crossSite = crossSiteReason(req);
      if (crossSite !== null) {
        log("warn", `dsh-proxy: rejected a login POST \u2014 ${crossSite}`);
        serveLoginPage(res, gate, `\u8BF7\u6C42\u6765\u6E90\u6821\u9A8C\u5931\u8D25\uFF1A${crossSite}\u3002\u8BF7\u4ECE\u767B\u5F55\u9875\u76F4\u63A5\u767B\u5F55\u3002`);
        return true;
      }
      if (req.headers.origin === void 0 || req.headers.origin === "null") {
        options.audit?.({
          at: Date.now(),
          event: "login-origin-withheld",
          source: clientAddressFor(req),
          detail: `sec-fetch-site=${String(req.headers["sec-fetch-site"] ?? "none")} origin=${String(req.headers.origin ?? "absent")}`
        });
      }
      const body = await readFormBody(req);
      const form = new URLSearchParams(body);
      const result = store.login({
        username: form.get("username") ?? "",
        password: form.get("password") ?? "",
        source: clientAddressFor(req),
        userAgent: req.headers["user-agent"] ?? "",
        expected: { username, password }
      });
      if (!result.ok) {
        serveLoginPage(res, gate, loginFailureMessage(result.reason, result.retryAfterMs));
        return true;
      }
      res.writeHead(303, {
        ...loginPageHeaders("text/plain; charset=utf-8"),
        location: "/",
        "set-cookie": sessionCookie(
          result.session.token,
          Math.floor(store.authPolicy.sessionTtlMs / 1e3),
          gate.cookieName
        )
      });
      res.end();
      return true;
    }
    if (pathname === LOGOUT_PATH) {
      if (req.method === "POST" && isCrossSite(req)) {
        res.writeHead(403, loginPageHeaders("text/plain; charset=utf-8")).end("403 Forbidden");
        return true;
      }
      store.logout(readCookie(req.headers.cookie, gate.cookieName));
      res.writeHead(303, {
        ...loginPageHeaders("text/plain; charset=utf-8"),
        location: LOGIN_PATH,
        "set-cookie": clearedSessionCookie(gate.cookieName)
      });
      res.end();
      return true;
    }
    return false;
  };
  const server = import_node_http.default.createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://proxy.local");
    const pathname = url.pathname;
    if (req.headers.host !== void 0) publicOrigins.set(req, req.headers.host);
    const gate = gateFor(req);
    void handleAuthRoutes(req, res, pathname, gate).then((handled) => {
      if (handled) return;
      if (PUBLIC_PATHS.has(pathname)) {
        alignOrigin(req);
        proxy.web(req, res);
        return;
      }
      if (gate.mode === "plaintext-blocked" && gateEnforced()) {
        options.audit?.({ at: Date.now(), event: "insecure-transport-refused", source: clientAddressFor(req), detail: pathname });
        refuseCleartext(res);
        return;
      }
      if (!gateEnforced()) {
        alignOrigin(req);
        proxy.web(req, res);
        return;
      }
      const session = gate.mode === "session" ? options.auth?.authenticate(readCookie(req.headers.cookie, gate.cookieName)) : null;
      if (session !== null && session !== void 0) {
        alignOrigin(req);
        proxy.web(req, res);
        return;
      }
      const basicAllowed = auth.enabled && auth.isAuthenticated(req.headers.authorization);
      if (!basicAllowed) {
        if (gate.mode === "session") {
          res.writeHead(303, {
            "cache-control": "no-store",
            location: LOGIN_PATH
          });
          res.end();
          return;
        }
        challenge(res);
        return;
      }
      alignOrigin(req);
      proxy.web(req, res);
    });
  });
  const upgradedSockets = /* @__PURE__ */ new Set();
  server.on("upgrade", (req, socket, head) => {
    const gate = gateFor(req);
    if (!gateEnforced()) {
      upgradedSockets.add(socket);
      socket.once("close", () => upgradedSockets.delete(socket));
      alignOrigin(req);
      proxy.ws(req, socket, head);
      return;
    }
    const session = gate.mode === "session" ? options.auth?.authenticate(readCookie(req.headers.cookie, gate.cookieName)) : null;
    if (session === null || session === void 0) {
      const basicAllowed = auth.enabled && auth.isAuthenticated(req.headers.authorization);
      if (!basicAllowed) {
        socket.end(`HTTP/1.1 401 Unauthorized\r
www-authenticate: Basic realm="${AUTH_REALM}"\r
Connection: close\r
\r
`);
        return;
      }
    }
    upgradedSockets.add(socket);
    socket.once("close", () => upgradedSockets.delete(socket));
    alignOrigin(req);
    proxy.ws(req, socket, head);
  });
  const ready = new Promise((resolve4, reject) => {
    const onListenError = (err) => {
      log("error", `cannot listen on ${listenHost}:${listenPort}: ${err.code ?? err.message}`);
      reject(err);
    };
    server.once("error", onListenError);
    server.listen(listenPort, listenHost, () => {
      server.off("error", onListenError);
      server.on("error", (err) => log("error", `proxy server error: ${err.message}`));
      resolve4(server.address().port);
    });
  });
  const close = async () => {
    for (const socket of upgradedSockets) socket.destroy();
    upgradedSockets.clear();
    await new Promise((resolveClose) => {
      server.close(() => resolveClose());
      const timer = setTimeout(() => {
        server.closeAllConnections();
      }, 250);
    });
  };
  return {
    ready,
    close,
    describeUrls: (boundPort) => ({
      local: `http://127.0.0.1:${boundPort}`,
      lan: lanAddresses(boundPort)
    })
  };
}

// src/state-file.ts
var import_node_fs = require("node:fs");
var import_node_path2 = require("node:path");
var import_yaml = __toESM(require_dist(), 1);
function legacyJsonPath(yamlPath) {
  return yamlPath.endsWith(".yaml") ? `${yamlPath.slice(0, -".yaml".length)}.json` : yamlPath;
}
function stringifyStateYaml(value) {
  return (0, import_yaml.stringify)(value, { lineWidth: 0 });
}
function parseStateYaml(text) {
  return (0, import_yaml.parse)(text);
}
function readStateYaml(yamlPath, normalize, fallback) {
  try {
    const raw = parseStateYaml((0, import_node_fs.readFileSync)(yamlPath, "utf8"));
    if (raw !== null && raw !== void 0) return normalize(raw);
    return fallback();
  } catch {
  }
  try {
    const raw = JSON.parse((0, import_node_fs.readFileSync)(legacyJsonPath(yamlPath), "utf8"));
    const value = normalize(raw);
    try {
      writeStateYaml(yamlPath, value);
    } catch {
    }
    return value;
  } catch {
    return fallback();
  }
}
function writeStateYaml(yamlPath, value) {
  (0, import_node_fs.mkdirSync)((0, import_node_path2.dirname)(yamlPath), { recursive: true });
  const temp = `${yamlPath}.tmp`;
  (0, import_node_fs.writeFileSync)(temp, stringifyStateYaml(value), "utf8");
  (0, import_node_fs.renameSync)(temp, yamlPath);
}
function migrateLegacyStateFile(legacyPath, yamlPath) {
  let raw;
  try {
    raw = JSON.parse((0, import_node_fs.readFileSync)(legacyPath, "utf8"));
  } catch {
    return false;
  }
  try {
    writeStateYaml(yamlPath, raw);
    return true;
  } catch {
    return false;
  }
}

// src/settings.ts
function normalizeRuntimeSettings(raw) {
  if (typeof raw !== "object" || raw === null) return {};
  const source = raw;
  const out = {};
  if (typeof source.listenPort === "number" && Number.isInteger(source.listenPort)) {
    out.listenPort = source.listenPort;
  }
  if (typeof source.upstreamPort === "number" && Number.isInteger(source.upstreamPort)) {
    out.upstreamPort = source.upstreamPort;
  }
  if (typeof source.username === "string") out.username = source.username;
  if (typeof source.password === "string") out.password = source.password;
  return out;
}
var RuntimeSettingsFile = class {
  constructor(filePath) {
    this.filePath = filePath;
  }
  filePath;
  read() {
    return readStateYaml(this.filePath, normalizeRuntimeSettings, () => ({}));
  }
  write(settings) {
    writeStateYaml(this.filePath, settings);
  }
};
var MAX_USERNAME_LENGTH = 64;
var MAX_PASSWORD_LENGTH = 128;
function validateUpdate(payload, currentListenPort, currentUpstreamPort) {
  if (typeof payload !== "object" || payload === null) {
    return { ok: false, message: "\u8BF7\u6C42\u4F53\u5FC5\u987B\u662F\u5BF9\u8C61" };
  }
  const input = payload;
  const patch = {};
  if (input.listenPort !== void 0) {
    const port = input.listenPort;
    if (typeof port !== "number" || !Number.isInteger(port) || port < 1 || port > 65535) {
      return { ok: false, message: `\u4EE3\u7406\u670D\u52A1\u7AEF\u53E3\u65E0\u6548\uFF1A${String(port)}\uFF08\u9700\u8981 1\u201365535 \u7684\u6574\u6570\uFF09` };
    }
    if (port === currentUpstreamPort) {
      return { ok: false, message: `\u4EE3\u7406\u670D\u52A1\u7AEF\u53E3\u4E0D\u80FD\u4E0E\u9ED8\u8BA4\u670D\u52A1\u7AEF\u53E3\u76F8\u540C\uFF08\u90FD\u662F ${port}\uFF09` };
    }
    patch.listenPort = port;
  }
  if (input.upstreamPort !== void 0) {
    const port = input.upstreamPort;
    if (typeof port !== "number" || !Number.isInteger(port) || port < 1 || port > 65535) {
      return { ok: false, message: `\u8F6C\u53D1\u76EE\u6807\u7AEF\u53E3\u65E0\u6548\uFF1A${String(port)}\uFF08\u9700\u8981 1\u201365535 \u7684\u6574\u6570\uFF09` };
    }
    if (port === currentListenPort) {
      return { ok: false, message: `\u8F6C\u53D1\u76EE\u6807\u7AEF\u53E3\u4E0D\u80FD\u4E0E\u4EE3\u7406\u670D\u52A1\u7AEF\u53E3\u76F8\u540C\uFF08\u90FD\u662F ${port}\uFF09` };
    }
    patch.upstreamPort = port;
  }
  if (input.username !== void 0) {
    if (typeof input.username !== "string") return { ok: false, message: "\u7528\u6237\u540D\u5FC5\u987B\u662F\u5B57\u7B26\u4E32" };
    if (input.username.length > MAX_USERNAME_LENGTH) {
      return { ok: false, message: `\u7528\u6237\u540D\u8FC7\u957F\uFF08\u6700\u591A ${MAX_USERNAME_LENGTH} \u4E2A\u5B57\u7B26\uFF09` };
    }
    patch.username = input.username;
  }
  if (input.password !== void 0) {
    if (typeof input.password !== "string") return { ok: false, message: "\u5BC6\u7801\u5FC5\u987B\u662F\u5B57\u7B26\u4E32" };
    if (input.password.length > MAX_PASSWORD_LENGTH) {
      return { ok: false, message: `\u5BC6\u7801\u8FC7\u957F\uFF08\u6700\u591A ${MAX_PASSWORD_LENGTH} \u4E2A\u5B57\u7B26\uFF09` };
    }
    patch.password = input.password;
  }
  if (patch.listenPort === void 0 && patch.upstreamPort === void 0 && patch.username === void 0 && patch.password === void 0) {
    return { ok: false, message: "\u6CA1\u6709\u53EF\u4FDD\u5B58\u7684\u4FEE\u6539" };
  }
  return {
    ok: true,
    patch
  };
}

// src/audit.ts
var import_node_fs2 = require("node:fs");
var import_node_path3 = require("node:path");
var AuditTrail = class {
  filePath;
  maxBytes;
  keep;
  recent = [];
  constructor(options) {
    this.filePath = options.filePath;
    this.maxBytes = options.maxBytes ?? 1024 * 1024;
    this.keep = options.keep ?? 200;
    this.recent = this.readFromDisk();
  }
  /**
   * Record one entry: push to the window and append to disk.
   * @param entry - the event, already free of credentials.
   */
  record(entry) {
    this.recent.push(entry);
    if (this.recent.length > this.keep) this.recent.splice(0, this.recent.length - this.keep);
    try {
      (0, import_node_fs2.mkdirSync)((0, import_node_path3.dirname)(this.filePath), { recursive: true });
      this.rotateIfNeeded();
      (0, import_node_fs2.appendFileSync)(this.filePath, `${JSON.stringify(entry)}
`, "utf8");
    } catch {
    }
  }
  /** The most recent entries, newest last (the settings UI reverses for display). */
  list() {
    return this.recent.slice(-this.keep).map((entry, index) => ({ ...entry, index }));
  }
  /** Drop the in-memory window (the on-disk trail is left alone). */
  clearWindow() {
    this.recent = [];
  }
  /** Move the file aside when it outgrows {@link maxBytes}, keeping one previous generation. */
  rotateIfNeeded() {
    let size = 0;
    try {
      size = (0, import_node_fs2.statSync)(this.filePath).size;
    } catch {
      return;
    }
    if (size < this.maxBytes) return;
    (0, import_node_fs2.renameSync)(this.filePath, `${this.filePath}.1`);
  }
  /** Read the tail of the file so a restart keeps its recent history. */
  readFromDisk() {
    let text;
    try {
      text = (0, import_node_fs2.readFileSync)(this.filePath, "utf8");
    } catch {
      return [];
    }
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    const tail = lines.slice(-this.keep);
    const entries = [];
    for (const line of tail) {
      try {
        const parsed = JSON.parse(line);
        if (typeof parsed?.at === "number" && typeof parsed?.event === "string") entries.push(parsed);
      } catch {
      }
    }
    return entries;
  }
};

// src/security.ts
var DEFAULT_SECURITY_SETTINGS = {
  requireTls: false,
  // Unified by default: one login page everywhere a cookie can be held.
  cleartextAuth: "login"
};
function isCleartextAuthMode(value) {
  return value === "login" || value === "basic";
}
function normalizeSecuritySettings(raw) {
  if (typeof raw !== "object" || raw === null) return { ...DEFAULT_SECURITY_SETTINGS };
  const source = raw;
  return {
    requireTls: typeof source.requireTls === "boolean" ? source.requireTls : DEFAULT_SECURITY_SETTINGS.requireTls,
    cleartextAuth: isCleartextAuthMode(source.cleartextAuth) ? source.cleartextAuth : DEFAULT_SECURITY_SETTINGS.cleartextAuth
  };
}
var SecuritySettingsFile = class {
  constructor(filePath) {
    this.filePath = filePath;
  }
  filePath;
  read() {
    return readStateYaml(this.filePath, normalizeSecuritySettings, () => ({ ...DEFAULT_SECURITY_SETTINGS }));
  }
  write(settings) {
    writeStateYaml(this.filePath, settings);
  }
};

// src/oauth/finish.ts
var COPY = {
  ok: { title: "\u767B\u5F55\u6210\u529F", detail: "\u6B63\u5728\u8FD4\u56DE DSH\uFF0C\u6B64\u7A97\u53E3\u5373\u5C06\u5173\u95ED\u3002" },
  bound: { title: "\u7ED1\u5B9A\u6210\u529F", detail: "\u8BBE\u7F6E\u9875\u4F1A\u81EA\u52A8\u5237\u65B0\uFF0C\u6B64\u7A97\u53E3\u5373\u5C06\u5173\u95ED\u3002" },
  unbound: { title: "\u65E0\u6CD5\u767B\u5F55", detail: "\u8BE5\u4E09\u65B9\u8D26\u53F7\u5C1A\u672A\u7ED1\u5B9A\uFF0C\u8BF7\u8054\u7CFB\u7BA1\u7406\u5458\u5728\u8BBE\u7F6E\u9875\u7ED1\u5B9A\u540E\u518D\u767B\u5F55\u3002" },
  denied: { title: "\u5DF2\u53D6\u6D88\u6388\u6743", detail: "\u7B2C\u4E09\u65B9\u6388\u6743\u5DF2\u53D6\u6D88\uFF0C\u53EF\u5173\u95ED\u6B64\u7A97\u53E3\u540E\u91CD\u8BD5\u3002" },
  invalid: { title: "\u767B\u5F55\u72B6\u6001\u65E0\u6548", detail: "\u6388\u6743\u72B6\u6001\u65E0\u6548\u6216\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u5173\u95ED\u6B64\u7A97\u53E3\u540E\u91CD\u65B0\u53D1\u8D77\u3002" },
  failed: { title: "\u7B2C\u4E09\u65B9\u767B\u5F55\u5931\u8D25", detail: "\u672A\u80FD\u5B8C\u6210\u7B2C\u4E09\u65B9\u8BA4\u8BC1\uFF0C\u8BF7\u5173\u95ED\u6B64\u7A97\u53E3\u540E\u91CD\u8BD5\u3002" },
  rejected: { title: "\u7ED1\u5B9A\u672A\u5B8C\u6210", detail: "\u7ED1\u5B9A\u7968\u636E\u65E0\u6548\u6216\u8BE5\u8D26\u53F7\u5DF2\u7ED1\u5B9A\uFF0C\u8BF7\u4ECE\u8BBE\u7F6E\u9875\u91CD\u65B0\u53D1\u8D77\u3002" },
  unavailable: { title: "\u7B2C\u4E09\u65B9\u767B\u5F55\u4E0D\u53EF\u7528", detail: "\u8BF7\u5148\u914D\u7F6E\u5BC6\u7801\u6216\u542F\u7528\u5E76\u914D\u7F6E\u8BE5\u6E20\u9053\uFF0C\u4E14\u4F7F\u7528\u767B\u5F55\u9875\u6A21\u5F0F\u3002" }
};
function escapeHtml2(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function scriptJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
}
function renderOAuthFinishPage(options) {
  const copy = COPY[options.status];
  const detail = options.message ?? copy.detail;
  const success = options.status === "ok" || options.status === "bound";
  const payload = {
    source: OAUTH_MESSAGE_SOURCE,
    intent: options.intent,
    status: options.status,
    message: detail
  };
  const script = `(function () {
  var payload = ${scriptJson(payload)};
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      var channel = new BroadcastChannel(${scriptJson(OAUTH_CHANNEL)});
      channel.postMessage(payload);
      window.setTimeout(function () { channel.close(); }, 150);
    }
  } catch (error) {}
  try {
    if (window.opener && window.opener !== window) {
      window.opener.postMessage(payload, window.location.origin);
    }
  } catch (error) {}
  if (${scriptJson(success)}) {
    window.setTimeout(function () { try { window.close(); } catch (error) {} }, 400);
  }
})();`;
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="referrer" content="no-referrer">
<meta name="robots" content="noindex, nofollow">
<title>${escapeHtml2(copy.title)}</title>
<style>
:root { color-scheme: light dark; }
* { box-sizing: border-box; }
body {
  margin: 0; min-height: 100vh; display: grid; place-items: center;
  background: #0f1115; color: #e6edf3;
  font: 14px/22px -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
}
main { width: min(380px, calc(100vw - 32px)); padding: 24px; border: 1px solid #30363d; border-radius: 12px; background: #161b22; }
h1 { margin: 0 0 8px; font-size: 18px; line-height: 26px; }
p { margin: 0 0 16px; color: #c9d1d9; font-size: 13px; line-height: 20px; }
p.hint { color: #8b949e; font-size: 12px; }
button {
  width: 100%; padding: 8px 14px; border: 1px solid #2f81f7; border-radius: 8px;
  background: #2f81f7; color: #fff; font: inherit; font-weight: 500; cursor: pointer;
}
button:hover { background: #388bfd; }
@media (prefers-color-scheme: light) {
  body { background: #f6f7f9; color: #0f1115; }
  main { background: #fff; border-color: #d7dbe0; }
  p { color: #3c4149; }
  p.hint { color: #61666b; }
}
</style>
</head>
<body>
<main>
  <h1>${escapeHtml2(copy.title)}</h1>
  <p>${escapeHtml2(detail)}</p>
  <p class="hint">${success ? "\u82E5\u7A97\u53E3\u6CA1\u6709\u81EA\u52A8\u5173\u95ED\uFF0C\u53EF\u70B9\u51FB\u4E0B\u65B9\u6309\u94AE\u8FD4\u56DE\u3002" : "\u5173\u95ED\u6B64\u7A97\u53E3\u5373\u53EF\u56DE\u5230\u539F\u9875\u9762\u91CD\u8BD5\u3002"}</p>
  <button type="button" onclick="try { window.close(); } catch (error) {}">\u5173\u95ED\u7A97\u53E3</button>
</main>
<script>
${script}
</script>
</body>
</html>
`;
}

// src/oauth/providers.ts
var import_node_crypto3 = require("node:crypto");
var OAUTH_PROVIDER_IDS = ["github", "google", "feishu", "casdoor"];
var OAUTH_BASE_PATH = "/__dsh-proxy/oauth";
var DEFAULT_PROVIDER_LABELS = {
  github: "GitHub",
  google: "Google",
  feishu: "\u98DE\u4E66",
  casdoor: "Casdoor"
};
var DEFAULT_SCOPES = {
  github: "read:user user:email",
  google: "openid email profile",
  feishu: "contact:user.base:readonly",
  casdoor: "openid profile email"
};
var CASDOOR_ENDPOINT_TEMPLATES = {
  authorizationEndpoint: "{baseUrl}/login/oauth/authorize",
  tokenEndpoint: "{baseUrl}/api/login/oauth/access_token",
  userInfoEndpoint: "{baseUrl}/api/userinfo",
  jwksEndpoint: "{baseUrl}/.well-known/jwks"
};
var OFFICIAL_ENDPOINTS = {
  github: {
    authorizationEndpoint: "https://github.com/login/oauth/authorize",
    tokenEndpoint: "https://github.com/login/oauth/access_token",
    userInfoEndpoint: "https://api.github.com/user"
  },
  google: {
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
    userInfoEndpoint: "https://openidconnect.googleapis.com/v1/userinfo",
    jwksEndpoint: "https://www.googleapis.com/oauth2/v3/certs",
    issuer: "https://accounts.google.com"
  },
  feishu: {
    authorizationEndpoint: "https://accounts.feishu.cn/open-apis/authen/v1/authorize",
    tokenEndpoint: "https://open.feishu.cn/open-apis/authen/v2/oauth/token",
    userInfoEndpoint: "https://open.feishu.cn/open-apis/authen/v1/user_info"
  },
  casdoor: { ...CASDOOR_ENDPOINT_TEMPLATES }
};
function defaultOAuthConfig() {
  const providers = {};
  for (const id of OAUTH_PROVIDER_IDS) {
    providers[id] = { enabled: false, clientId: "", clientSecret: "" };
  }
  return { enabled: false, providers, stateTtlMs: 6e5 };
}
function isOAuthProviderId(value) {
  return typeof value === "string" && OAUTH_PROVIDER_IDS.includes(value);
}
function oauthStartPath(id) {
  return `${OAUTH_BASE_PATH}/${id}/start`;
}
function oauthBindStartPath(id) {
  return `${OAUTH_BASE_PATH}/${id}/bind/start`;
}
function oauthCallbackPath(id) {
  return `${OAUTH_BASE_PATH}/${id}/callback`;
}
function normalizeBaseUrl(value) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\/+$/, "");
}
function validateEndpointUrl(value, label) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return `${label} \u4E0D\u662F\u6709\u6548\u7684 URL\uFF1A${value}`;
  }
  if (url.protocol === "https:") return null;
  const host = url.hostname.toLowerCase();
  if (url.protocol === "http:" && (host === "localhost" || host === "127.0.0.1" || host.endsWith(".localhost"))) {
    return null;
  }
  return `${label} \u5FC5\u987B\u4F7F\u7528 https\uFF08\u4EC5\u672C\u673A\u5F00\u53D1\u53EF\u7528 http\uFF09\uFF1A${value}`;
}
function fromTemplate(base) {
  const expand = (template) => template.replace("{baseUrl}", base);
  return {
    authorizationEndpoint: expand(CASDOOR_ENDPOINT_TEMPLATES.authorizationEndpoint),
    tokenEndpoint: expand(CASDOOR_ENDPOINT_TEMPLATES.tokenEndpoint),
    userInfoEndpoint: expand(CASDOOR_ENDPOINT_TEMPLATES.userInfoEndpoint),
    ...CASDOOR_ENDPOINT_TEMPLATES.jwksEndpoint === void 0 ? {} : { jwksEndpoint: expand(CASDOOR_ENDPOINT_TEMPLATES.jwksEndpoint) }
  };
}
function applyExplicit(base, patch) {
  const next = { ...base };
  for (const key of Object.keys(base)) {
    const candidate = patch[key];
    if (typeof candidate === "string" && candidate.trim() !== "") next[key] = candidate.trim();
  }
  return next;
}
function resolveProviderEndpoints(id, provider, center) {
  const issues = [];
  let endpoints = { ...OFFICIAL_ENDPOINTS[id] };
  let source = "official";
  const centerBase = normalizeBaseUrl(center?.baseUrl);
  const providerBase = normalizeBaseUrl(provider.baseUrl);
  const chosenBase = providerBase !== "" ? providerBase : centerBase;
  if (centerBase !== "" && providerBase === "") {
    endpoints = fromTemplate(centerBase);
    source = "auth-center";
  }
  if (center?.endpoints !== void 0) {
    endpoints = applyExplicit(endpoints, center.endpoints);
    if (Object.values(center.endpoints).some((value) => typeof value === "string" && value.trim() !== "")) {
      source = "auth-center";
    }
  }
  if (providerBase !== "") {
    endpoints = fromTemplate(providerBase);
    source = "provider-override";
  }
  if (provider.endpoints !== void 0) {
    endpoints = applyExplicit(endpoints, provider.endpoints);
    if (Object.values(provider.endpoints).some((value) => typeof value === "string" && value.trim() !== "")) {
      source = "provider-override";
    }
  }
  if (chosenBase === "" && id === "casdoor" && endpoints.authorizationEndpoint.includes("{baseUrl}")) {
    issues.push("\u672A\u914D\u7F6E\u7EDF\u4E00\u8BA4\u8BC1\u4E2D\u5FC3\u5730\u5740\uFF0C\u65E0\u6CD5\u542F\u7528 Casdoor \u767B\u5F55");
    endpoints = { authorizationEndpoint: "", tokenEndpoint: "", userInfoEndpoint: "" };
    return { endpoints, issues, source };
  }
  for (const key of ["authorizationEndpoint", "tokenEndpoint", "userInfoEndpoint", "jwksEndpoint"]) {
    const value = endpoints[key];
    if (value === void 0 || value === "") continue;
    const error = validateEndpointUrl(value, `${id}.${key}`);
    if (error !== null) issues.push(error);
  }
  return { endpoints, issues, source };
}
function isProviderReady(id, config, center) {
  if (!config.enabled) return false;
  const provider = config.providers[id];
  if (!provider.enabled) return false;
  if (provider.clientId.trim() === "" || provider.clientSecret.trim() === "") return false;
  return resolveProviderEndpoints(id, provider, center ?? config.authCenter).issues.length === 0;
}
function readyProviders(config) {
  return OAUTH_PROVIDER_IDS.filter((id) => isProviderReady(id, config));
}
function effectiveProviderHint(provider) {
  return typeof provider.providerHint === "string" ? provider.providerHint.trim() : "";
}
function effectiveScopes(id, provider) {
  if (provider.scopes !== void 0 && provider.scopes.length > 0) return provider.scopes.join(" ");
  return DEFAULT_SCOPES[id];
}
var OFFICIAL_SUBJECT_KEYS = {
  github: ["id"],
  google: ["sub"],
  feishu: ["open_id", "union_id", "user_id"],
  casdoor: ["sub", "id"]
};
var AUTH_CENTER_SUBJECT_KEYS = ["sub", "id", "open_id", "union_id", "user_id"];
function extractSubject(id, userInfo, source = "official") {
  if (typeof userInfo !== "object" || userInfo === null) return null;
  const record = userInfo;
  const keys = source === "official" ? OFFICIAL_SUBJECT_KEYS[id] : AUTH_CENTER_SUBJECT_KEYS;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim() !== "") return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return null;
}
function extractProfile(userInfo) {
  if (typeof userInfo !== "object" || userInfo === null) return {};
  const record = userInfo;
  const string = (...keys) => {
    for (const key of keys) {
      const value = record[key];
      if (typeof value === "string" && value.trim() !== "") return value.trim().slice(0, 120);
    }
    return void 0;
  };
  const email = string("email", "mail");
  const displayName = string("name", "preferred_username", "login", "display_name", "en_name");
  return { ...email === void 0 ? {} : { email }, ...displayName === void 0 ? {} : { displayName } };
}
function providerIconSvg(id) {
  const colors = {
    github: "#6e7681",
    google: "#4285f4",
    feishu: "#3370ff",
    casdoor: "#7c6bf3"
  };
  const letters = {
    github: "G",
    google: "G",
    feishu: "\u98DE",
    casdoor: "C"
  };
  return `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="${colors[id]}"/><text x="12" y="16" text-anchor="middle" font-size="12" font-family="sans-serif" font-weight="600" fill="#ffffff">${letters[id]}</text></svg>`;
}
function bindingId() {
  return (0, import_node_crypto3.randomBytes)(12).toString("base64url").slice(0, 16);
}

// src/oauth/bindings.ts
var import_node_crypto4 = require("node:crypto");
function normalizeBindings(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (const entry of raw) {
    if (typeof entry !== "object" || entry === null) continue;
    const record = entry;
    if (!isOAuthProviderId(record.provider)) continue;
    const subject = typeof record.subject === "string" ? record.subject.trim() : "";
    if (subject === "") continue;
    const email = typeof record.email === "string" ? record.email.slice(0, 120) : void 0;
    const displayName = typeof record.displayName === "string" ? record.displayName.slice(0, 120) : void 0;
    const localSubject = typeof record.localSubject === "string" && record.localSubject !== "" ? record.localSubject.slice(0, 120) : "default";
    const boundAt = typeof record.boundAt === "number" && Number.isFinite(record.boundAt) ? record.boundAt : Date.now();
    const id = typeof record.id === "string" && record.id !== "" ? record.id.slice(0, 64) : bindingId();
    out.push({
      id,
      provider: record.provider,
      subject,
      localSubject,
      boundAt,
      boundVia: record.boundVia === "bootstrap" ? "bootstrap" : "settings",
      ...email === void 0 ? {} : { email },
      ...displayName === void 0 ? {} : { displayName }
    });
  }
  return out;
}
function findBinding(bindings, provider, subject) {
  return bindings.find((entry) => entry.provider === provider && entry.subject === subject);
}
function addBinding(bindings, input) {
  if (input.subject.trim() === "") return { ok: false, message: "\u4E09\u65B9\u8D26\u53F7\u6807\u8BC6\u4E3A\u7A7A\uFF0C\u65E0\u6CD5\u5B8C\u6210\u7ED1\u5B9A" };
  if (findBinding(bindings, input.provider, input.subject) !== void 0) {
    return { ok: false, message: "\u8BE5\u4E09\u65B9\u8D26\u53F7\u5DF2\u7ECF\u7ED1\u5B9A\uFF0C\u65E0\u9700\u91CD\u590D\u7ED1\u5B9A" };
  }
  const entry = {
    id: bindingId(),
    provider: input.provider,
    subject: input.subject,
    localSubject: input.localSubject,
    boundAt: Date.now(),
    boundVia: input.boundVia ?? "settings",
    ...input.email === void 0 ? {} : { email: input.email },
    ...input.displayName === void 0 ? {} : { displayName: input.displayName }
  };
  return { ok: true, bindings: [...bindings, entry] };
}
function removeBinding(bindings, id) {
  return bindings.filter((entry) => entry.id !== id);
}
var BindingTicketStore = class {
  tickets = /* @__PURE__ */ new Map();
  now;
  ttlMs;
  constructor(options = {}) {
    this.now = options.now ?? (() => Date.now());
    this.ttlMs = options.ttlMs ?? 6e5;
  }
  /** Issue a fresh ticket bound to one provider and one local subject. */
  issue(input) {
    const ticket = (0, import_node_crypto4.randomBytes)(24).toString("base64url");
    this.tickets.set(ticket, { ...input, createdAt: this.now() });
    return ticket;
  }
  /** Read a live ticket without consuming it. */
  peek(ticket, provider) {
    if (ticket === void 0 || ticket === "") return null;
    const record = this.tickets.get(ticket);
    if (record === void 0) return null;
    if (this.now() - record.createdAt >= this.ttlMs || record.provider !== provider) {
      this.tickets.delete(ticket);
      return null;
    }
    return record;
  }
  /** Consume a live ticket exactly once. */
  consume(ticket, provider) {
    const record = this.peek(ticket, provider);
    if (record !== null && ticket !== void 0) this.tickets.delete(ticket);
    return record;
  }
};

// src/oauth/config.ts
function emptyOAuthState() {
  return { bindings: [] };
}
function normalizeOAuthState(raw) {
  if (typeof raw !== "object" || raw === null) return emptyOAuthState();
  const record = raw;
  const overlay = record.overlay === void 0 || record.overlay === null ? void 0 : normalizeOAuthConfig(record.overlay);
  return {
    bindings: normalizeBindings(record.bindings),
    ...overlay === void 0 ? {} : { overlay }
  };
}
var OAuthStateFile = class {
  constructor(filePath) {
    this.filePath = filePath;
  }
  filePath;
  read() {
    return readStateYaml(this.filePath, normalizeOAuthState, emptyOAuthState);
  }
  write(state) {
    writeStateYaml(this.filePath, state);
  }
};
function normalizeEndpoints(raw) {
  if (typeof raw !== "object" || raw === null) return void 0;
  const record = raw;
  const out = {};
  for (const key of ["authorizationEndpoint", "tokenEndpoint", "userInfoEndpoint", "jwksEndpoint", "issuer"]) {
    const value = record[key];
    if (typeof value === "string" && value.trim() !== "") out[key] = value.trim();
  }
  return out;
}
function normalizeProvider(raw, base) {
  if (typeof raw !== "object" || raw === null) return { ...base };
  const record = raw;
  const next = {
    ...base,
    ...record.endpoints === void 0 ? {} : { endpoints: normalizeEndpoints(record.endpoints) }
  };
  if (typeof record.enabled === "boolean") next.enabled = record.enabled;
  if (typeof record.clientId === "string") next.clientId = record.clientId;
  if (typeof record.clientSecret === "string") next.clientSecret = record.clientSecret;
  if (typeof record.baseUrl === "string") next.baseUrl = record.baseUrl;
  if (typeof record.redirectUri === "string") next.redirectUri = record.redirectUri;
  if (typeof record.label === "string") next.label = record.label;
  if (typeof record.providerHint === "string") next.providerHint = record.providerHint;
  if (Array.isArray(record.scopes)) {
    next.scopes = record.scopes.filter((value) => typeof value === "string");
  }
  return next;
}
function normalizeBootstrap(raw) {
  if (!Array.isArray(raw)) return void 0;
  const out = [];
  for (const entry of raw) {
    if (typeof entry !== "object" || entry === null) continue;
    const record = entry;
    if (!isOAuthProviderId(record.provider) || typeof record.subject !== "string" || record.subject.trim() === "") continue;
    const email = typeof record.email === "string" ? record.email.slice(0, 120) : void 0;
    out.push({ provider: record.provider, subject: record.subject.trim(), ...email === void 0 ? {} : { email } });
  }
  return out;
}
function normalizeOAuthConfig(raw, base = defaultOAuthConfig()) {
  if (typeof raw !== "object" || raw === null) {
    return { ...base, providers: { ...base.providers } };
  }
  const record = raw;
  const providers = {};
  const rawProviders = typeof record.providers === "object" && record.providers !== null ? record.providers : {};
  for (const id of OAUTH_PROVIDER_IDS) {
    providers[id] = normalizeProvider(rawProviders[id], base.providers[id]);
  }
  const next = { ...base, providers };
  if (typeof record.enabled === "boolean") next.enabled = record.enabled;
  if (typeof record.stateTtlMs === "number" && Number.isFinite(record.stateTtlMs)) next.stateTtlMs = record.stateTtlMs;
  if (typeof record.publicOrigin === "string") next.publicOrigin = record.publicOrigin;
  if (typeof record.authCenter === "object" && record.authCenter !== null) {
    const center = record.authCenter;
    next.authCenter = {
      ...base.authCenter ?? {},
      ...typeof center.baseUrl === "string" ? { baseUrl: center.baseUrl } : {},
      ...center.endpoints === void 0 ? {} : { endpoints: normalizeEndpoints(center.endpoints) }
    };
  }
  const bootstrap = normalizeBootstrap(record.bootstrapBindings);
  if (bootstrap !== void 0) next.bootstrapBindings = bootstrap;
  return next;
}
function mergeOAuthConfig(base, state) {
  return state.overlay === void 0 ? base : normalizeOAuthConfig(state.overlay, base);
}
function validatePublicOrigin(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "\u4EE3\u7406\u5916\u90E8\u5730\u5740\u5FC5\u987B\u662F http \u6216 https URL";
    return null;
  } catch {
    return `\u4EE3\u7406\u5916\u90E8\u5730\u5740\u4E0D\u662F\u6709\u6548\u7684 URL\uFF1A${value}`;
  }
}
function validateOAuthPatch(payload, current) {
  if (typeof payload !== "object" || payload === null) return { ok: false, message: "\u8BF7\u6C42\u4F53\u5FC5\u987B\u662F\u5BF9\u8C61" };
  const next = normalizeOAuthConfig(payload, current);
  if (next.stateTtlMs !== void 0 && (!Number.isInteger(next.stateTtlMs) || next.stateTtlMs < 1e3 || next.stateTtlMs > 36e5)) {
    return { ok: false, message: "state \u6709\u6548\u671F\u65E0\u6548\uFF08\u9700\u8981 1000\u20133600000 \u6BEB\u79D2\u7684\u6574\u6570\uFF09" };
  }
  if (next.publicOrigin !== void 0 && next.publicOrigin.trim() !== "") {
    const error = validatePublicOrigin(next.publicOrigin.trim());
    if (error !== null) return { ok: false, message: error };
  }
  for (const id of OAUTH_PROVIDER_IDS) {
    const provider = next.providers[id];
    if (!provider.enabled) continue;
    if (provider.clientId.trim() === "" || provider.clientSecret.trim() === "") {
      return { ok: false, message: `\u672A\u914D\u7F6E Client ID \u6216 Client Secret\uFF0C\u65E0\u6CD5\u542F\u7528 ${id} \u767B\u5F55` };
    }
    const resolved = resolveProviderEndpoints(id, provider, next.authCenter);
    if (resolved.issues.length > 0) return { ok: false, message: resolved.issues[0] };
  }
  return { ok: true, config: next };
}

// src/oauth/flow.ts
var import_node_crypto5 = require("node:crypto");
var OAuthStateStore = class {
  flows = /* @__PURE__ */ new Map();
  now;
  ttlMs;
  constructor(options = {}) {
    this.now = options.now ?? (() => Date.now());
    this.ttlMs = options.ttlMs ?? 6e5;
  }
  /** Register one flow and return its opaque `state` value. */
  issue(input) {
    const state = (0, import_node_crypto5.randomBytes)(24).toString("base64url");
    this.flows.set(state, { ...input, createdAt: this.now() });
    return state;
  }
  /** Consume a flow exactly once, checking its TTL and provider binding. */
  consume(state, provider) {
    if (state === void 0 || state === "") return null;
    const flow = this.flows.get(state);
    if (flow === void 0) return null;
    this.flows.delete(state);
    if (this.now() - flow.createdAt >= this.ttlMs || flow.provider !== provider) return null;
    return flow;
  }
};
function pkcePair() {
  const verifier = (0, import_node_crypto5.randomBytes)(32).toString("base64url");
  const challenge = (0, import_node_crypto5.createHash)("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}
function buildAuthorizeUrl(input) {
  const url = new URL(input.endpoint);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", input.clientId);
  url.searchParams.set("redirect_uri", input.redirectUri);
  url.searchParams.set("scope", input.scopes);
  url.searchParams.set("state", input.state);
  url.searchParams.set("code_challenge", input.challenge);
  url.searchParams.set("code_challenge_method", "S256");
  const hint = input.providerHint?.trim() ?? "";
  if (hint !== "") url.searchParams.set("provider_hint", hint);
  return url.toString();
}
async function exchangeCode(input) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: input.clientId,
    client_secret: input.clientSecret,
    code: input.code,
    redirect_uri: input.redirectUri,
    code_verifier: input.codeVerifier
  });
  let response;
  try {
    response = await (input.fetchImpl ?? globalThis.fetch)(input.endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        accept: "application/json"
      },
      body: body.toString()
    });
  } catch (err) {
    return { ok: false, message: `\u4EE4\u724C\u4EA4\u6362\u8BF7\u6C42\u5931\u8D25\uFF1A${err instanceof Error ? err.message : String(err)}` };
  }
  if (!response.ok) return { ok: false, message: `\u4EE4\u724C\u4EA4\u6362\u5931\u8D25\uFF08HTTP ${response.status}\uFF09` };
  let text;
  try {
    text = await response.text();
  } catch {
    return { ok: false, message: "\u4EE4\u724C\u4EA4\u6362\u54CD\u5E94\u65E0\u6CD5\u8BFB\u53D6" };
  }
  let token;
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("json")) {
    try {
      const parsed = JSON.parse(text);
      token = parsed.access_token ?? parsed.data?.access_token;
    } catch {
      return { ok: false, message: "\u4EE4\u724C\u4EA4\u6362\u54CD\u5E94\u4E0D\u662F\u6709\u6548\u7684 JSON" };
    }
  } else {
    token = new URLSearchParams(text).get("access_token");
  }
  if (typeof token !== "string" || token === "") return { ok: false, message: "\u4EE4\u724C\u4EA4\u6362\u54CD\u5E94\u7F3A\u5C11 access_token" };
  return { ok: true, accessToken: token };
}
async function fetchUserInfo(input) {
  let response;
  try {
    response = await (input.fetchImpl ?? globalThis.fetch)(input.endpoint, {
      headers: { authorization: `Bearer ${input.accessToken}`, accept: "application/json" }
    });
  } catch (err) {
    return { ok: false, message: `\u7528\u6237\u4FE1\u606F\u8BF7\u6C42\u5931\u8D25\uFF1A${err instanceof Error ? err.message : String(err)}` };
  }
  if (!response.ok) return { ok: false, message: `\u7528\u6237\u4FE1\u606F\u8BF7\u6C42\u5931\u8D25\uFF08HTTP ${response.status}\uFF09` };
  try {
    return { ok: true, info: await response.json() };
  } catch {
    return { ok: false, message: "\u7528\u6237\u4FE1\u606F\u54CD\u5E94\u4E0D\u662F\u6709\u6548\u7684 JSON" };
  }
}

// src/oauth/runtime.ts
var OAUTH_HEADERS = {
  "cache-control": "no-store, must-revalidate",
  "referrer-policy": "no-referrer",
  // The finish page's inline script notifies the opener and closes the popup
  // ONLY on success. default-src 'none' still forbids all external resources.
  "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY"
};
var OAuthRuntime = class {
  config;
  bindings;
  flows;
  tickets;
  now;
  opts;
  constructor(options) {
    this.opts = options;
    this.now = options.now ?? (() => Date.now());
    const ttl = options.base.stateTtlMs ?? 6e5;
    this.flows = new OAuthStateStore({ now: this.now, ttlMs: ttl });
    this.tickets = new BindingTicketStore({ now: this.now, ttlMs: ttl });
    const state = options.stateFile.read();
    this.config = mergeOAuthConfig(options.base, state);
    this.bindings = normalizeBindings(state.bindings);
    this.applyBootstrap();
  }
  /** Effective config (used by the controller for status/log decisions). */
  get effective() {
    return this.config;
  }
  /** Providers that are enabled, fully configured and have valid endpoints. */
  ready() {
    return readyProviders(this.config);
  }
  /** D2: password login OR at least one usable OAuth provider. */
  get authEnabled() {
    return this.opts.hasPassword() || this.ready().length > 0;
  }
  /** D7: only enabled channels appear; D5: never in Basic mode; D2′: none with no auth. */
  loginProviders(mode) {
    if (mode !== "session" || !this.authEnabled || !this.config.enabled) return [];
    if (this.opts.cleartextAuth() === "basic") return [];
    return this.ready().map((id) => ({
      id,
      label: this.config.providers[id].label?.trim() || DEFAULT_PROVIDER_LABELS[id],
      startUrl: oauthStartPath(id),
      icon: providerIconSvg(id)
    }));
  }
  /** A one-time bootstrap: deployment-declared bindings are written only once. */
  applyBootstrap() {
    const seeds = this.config.bootstrapBindings ?? [];
    if (seeds.length === 0 || this.bindings.length > 0) return;
    let next = [];
    for (const seed of seeds) {
      const result = addBinding(next, {
        provider: seed.provider,
        subject: seed.subject,
        localSubject: this.opts.getLocalSubject(),
        boundVia: "bootstrap",
        ...seed.email === void 0 ? {} : { email: seed.email }
      });
      if (result.ok) next = result.bindings;
    }
    if (next.length === 0) return;
    this.bindings = next;
    this.persist();
    this.opts.audit({ at: this.now(), event: "oauth-binding-added", source: "bootstrap", detail: `${next.length} bootstrap bindings` });
    this.opts.log("info", `dsh-proxy: seeded ${next.length} bootstrap OAuth binding(s)`);
  }
  /** Write the overlay + binding table atomically. */
  persist() {
    this.opts.stateFile.write({
      overlay: this.config,
      bindings: this.bindings
    });
  }
  /** The redirect URI registered at the IdP (explicit override wins). */
  redirectUri(id, publicOrigin) {
    const configured = this.config.providers[id].redirectUri?.trim();
    return configured !== void 0 && configured !== "" ? configured : `${publicOrigin}${oauthCallbackPath(id)}`;
  }
  /** The settings-page view: masked-in-UI secrets, resolved endpoints, bindings. */
  statusView(requestOrigin) {
    const publicOrigin = this.opts.publicOrigin(requestOrigin).replace(/\/+$/, "");
    const providers = {};
    const ready = new Set(this.ready());
    for (const id of OAUTH_PROVIDER_IDS) {
      const provider = this.config.providers[id];
      const resolved = resolveProviderEndpoints(id, provider, this.config.authCenter);
      const issues = [...resolved.issues];
      if (provider.enabled && (provider.clientId.trim() === "" || provider.clientSecret.trim() === "")) {
        issues.push("\u672A\u914D\u7F6E Client ID \u6216 Client Secret");
      }
      providers[id] = {
        enabled: provider.enabled,
        label: provider.label?.trim() || DEFAULT_PROVIDER_LABELS[id],
        clientId: provider.clientId,
        clientSecret: provider.clientSecret,
        scopes: effectiveScopes(id, provider),
        baseUrl: provider.baseUrl ?? "",
        endpoints: resolved.endpoints,
        endpointOverrides: provider.endpoints ?? {},
        providerHint: provider.providerHint ?? "",
        redirectUri: this.redirectUri(id, publicOrigin),
        effectiveSource: resolved.source,
        issues,
        displayOnLogin: ready.has(id) && this.opts.cleartextAuth() === "login"
      };
    }
    const bindings = this.bindings.map((entry) => ({
      id: entry.id,
      provider: entry.provider,
      subject: entry.subject,
      localSubject: entry.localSubject,
      boundAt: entry.boundAt,
      boundVia: entry.boundVia,
      ...entry.email === void 0 ? {} : { email: entry.email },
      ...entry.displayName === void 0 ? {} : { displayName: entry.displayName }
    }));
    return {
      enabled: this.config.enabled,
      publicOrigin,
      authCenter: {
        baseUrl: this.config.authCenter?.baseUrl ?? "",
        endpoints: this.config.authCenter?.endpoints ?? {}
      },
      providers,
      bindings,
      hasAnyAuth: this.authEnabled,
      cleartextAuth: this.opts.cleartextAuth()
    };
  }
  /** Validate and persist a settings patch; the running proxy sees it at once. */
  updateConfig(payload, requestOrigin) {
    const check = validateOAuthPatch(payload, this.config);
    if (!check.ok) return { ok: false, message: check.message };
    this.config = check.config;
    this.persist();
    const enabled = this.ready().join(", ") || "none";
    this.opts.log("info", `dsh-proxy: OAuth config updated (enabled providers: ${enabled})`);
    return { ok: true, view: this.statusView(requestOrigin) };
  }
  /** Issue a one-shot binding ticket from the settings page. */
  startBinding(payload, requestOrigin) {
    const provider = payload?.provider;
    if (!isOAuthProviderId(provider)) return { ok: false, message: "\u672A\u77E5\u7684\u7B2C\u4E09\u65B9\u767B\u5F55\u6E20\u9053" };
    if (!this.config.enabled || !isProviderReady(provider, this.config)) {
      return { ok: false, message: "\u8BE5\u6E20\u9053\u5C1A\u672A\u542F\u7528\u6216\u914D\u7F6E\u4E0D\u5B8C\u6574\uFF0C\u8BF7\u5148\u4FDD\u5B58\u6E20\u9053\u914D\u7F6E" };
    }
    const ticket = this.tickets.issue({
      provider,
      source: "settings",
      localSubject: this.opts.getLocalSubject()
    });
    const origin = this.opts.publicOrigin(requestOrigin).replace(/\/+$/, "");
    return { ok: true, startUrl: `${origin}${oauthBindStartPath(provider)}?ticket=${encodeURIComponent(ticket)}` };
  }
  /** Remove one binding; the account loses access immediately. */
  removeBindingById(payload, requestOrigin) {
    const id = payload?.id;
    if (typeof id !== "string" || id === "") return { ok: false, message: "\u7ED1\u5B9A id \u65E0\u6548" };
    const next = removeBinding(this.bindings, id);
    if (next.length === this.bindings.length) return { ok: false, message: "\u8BE5\u7ED1\u5B9A\u4E0D\u5B58\u5728" };
    this.bindings = next;
    this.persist();
    this.opts.audit({ at: this.now(), event: "oauth-binding-removed", source: "settings", detail: id });
    return { ok: true, view: this.statusView(requestOrigin) };
  }
  /**
   * Send the popup result page. The opener never navigates: it listens on a
   * same-origin BroadcastChannel (see `finish.ts`) and reloads on success.
   * `headers` carries the session cookie for a successful login.
   */
  finish(res, status, intent, message, headers = {}, httpStatus = 200) {
    const html = renderOAuthFinishPage({
      status,
      intent,
      ...message === void 0 ? {} : { message }
    });
    res.writeHead(httpStatus, {
      ...OAUTH_HEADERS,
      "content-type": "text/html; charset=utf-8",
      ...headers
    });
    res.end(html);
  }
  /** Audit helper: never record codes, tokens, secrets or state values. */
  audit(event, source, detail) {
    this.opts.audit({
      at: this.now(),
      event,
      source,
      ...detail === void 0 ? {} : { detail }
    });
  }
  /**
   * Answer every `/__dsh-proxy/oauth/...` route.
   *
   * D2′: with no authentication method configured (or a disabled channel) all
   * of them answer 403 and audit `oauth-unavailable`; the rest of the proxy
   * keeps its open-access, warning-only posture.
   */
  async handle(req, res, pathname, gate, source) {
    const match = /^\/__dsh-proxy\/oauth\/([^/]+)\/(start|bind\/start|callback)$/.exec(pathname);
    if (match === null) return false;
    const id = match[1];
    const action = match[2];
    if (!isOAuthProviderId(id)) {
      this.finish(res, "invalid", "login", "\u672A\u77E5\u7684\u7B2C\u4E09\u65B9\u767B\u5F55\u6E20\u9053", {}, 404);
      return true;
    }
    if (gate.mode !== "session" || !this.authEnabled || !this.config.enabled || !isProviderReady(id, this.config)) {
      this.audit("oauth-unavailable", source, `${id} ${action}`);
      this.finish(res, "unavailable", "login", "\u7B2C\u4E09\u65B9\u767B\u5F55\u5F53\u524D\u4E0D\u53EF\u7528\uFF1A\u8BF7\u5148\u914D\u7F6E\u5BC6\u7801\u6216\u542F\u7528\u5E76\u914D\u7F6E\u8BE5\u6E20\u9053\uFF0C\u4E14\u4F7F\u7528\u767B\u5F55\u9875\u6A21\u5F0F\u3002", {}, 403);
      return true;
    }
    if (req.method !== "GET" && req.method !== "HEAD") {
      this.finish(res, "invalid", "login", "405 Method Not Allowed", {}, 405);
      return true;
    }
    const url = new URL(req.url ?? "/", "http://proxy.local");
    const provider = this.config.providers[id];
    const resolved = resolveProviderEndpoints(id, provider, this.config.authCenter);
    const configured = this.config.publicOrigin?.trim();
    const publicOrigin = configured !== void 0 && configured !== "" ? configured.replace(/\/+$/, "") : gate.origin.replace(/\/+$/, "");
    const redirectUri = this.redirectUri(id, publicOrigin);
    const authorize = (state, challenge) => buildAuthorizeUrl({
      endpoint: resolved.endpoints.authorizationEndpoint,
      clientId: provider.clientId,
      redirectUri,
      scopes: effectiveScopes(id, provider),
      state,
      challenge,
      providerHint: effectiveProviderHint(provider)
    });
    if (action === "start" || action === "bind/start") {
      let ticket;
      let intent = "login";
      if (action === "bind/start") {
        const candidate = url.searchParams.get("ticket") ?? void 0;
        const record = this.tickets.peek(candidate, id);
        if (record === null) {
          this.audit("oauth-binding-rejected", source, `${id} invalid ticket`);
          this.finish(res, "rejected", "bind", "\u7ED1\u5B9A\u7968\u636E\u65E0\u6548\u6216\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u4ECE\u8BBE\u7F6E\u9875\u91CD\u65B0\u53D1\u8D77\u7ED1\u5B9A\u3002", {}, 403);
          return true;
        }
        ticket = candidate;
        intent = "bind";
      }
      const { verifier, challenge } = pkcePair();
      const state = this.flows.issue({
        provider: id,
        intent,
        codeVerifier: verifier,
        publicOrigin,
        source,
        ...ticket === void 0 ? {} : { ticket }
      });
      res.writeHead(302, { ...OAUTH_HEADERS, location: authorize(state, challenge) });
      res.end();
      return true;
    }
    const flow = this.flows.consume(url.searchParams.get("state") ?? void 0, id);
    if (flow === null) {
      this.audit("oauth-state-invalid", source, id);
      this.finish(res, "invalid", "login", "\u767B\u5F55\u72B6\u6001\u65E0\u6548\u6216\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u91CD\u65B0\u53D1\u8D77\u767B\u5F55\u3002", {}, 400);
      return true;
    }
    const idpError = url.searchParams.get("error");
    if (idpError !== null) {
      this.audit("oauth-access-denied", source, id);
      this.finish(res, "denied", flow.intent, "\u7B2C\u4E09\u65B9\u767B\u5F55\u5DF2\u53D6\u6D88\u6216\u672A\u6388\u6743\uFF0C\u8BF7\u91CD\u8BD5\u3002");
      return true;
    }
    const code = url.searchParams.get("code");
    if (code === null || code === "") {
      this.audit("oauth-login-failed", source, `${id} missing code`);
      this.finish(res, "failed", flow.intent, "\u7B2C\u4E09\u65B9\u767B\u5F55\u672A\u8FD4\u56DE\u6388\u6743\u7801\uFF0C\u8BF7\u91CD\u8BD5\u3002");
      return true;
    }
    const token = await exchangeCode({
      endpoint: resolved.endpoints.tokenEndpoint,
      clientId: provider.clientId,
      clientSecret: provider.clientSecret,
      code,
      redirectUri: this.redirectUri(id, flow.publicOrigin),
      codeVerifier: flow.codeVerifier,
      ...this.opts.fetchImpl === void 0 ? {} : { fetchImpl: this.opts.fetchImpl }
    });
    if (!token.ok) {
      this.audit("oauth-login-failed", source, `${id} token exchange failed`);
      this.finish(res, "failed", flow.intent, `\u7B2C\u4E09\u65B9\u767B\u5F55\u5931\u8D25\uFF1A${token.message}`);
      return true;
    }
    const info = await fetchUserInfo({
      endpoint: resolved.endpoints.userInfoEndpoint,
      accessToken: token.accessToken,
      ...this.opts.fetchImpl === void 0 ? {} : { fetchImpl: this.opts.fetchImpl }
    });
    if (!info.ok) {
      this.audit("oauth-login-failed", source, `${id} userinfo failed`);
      this.finish(res, "failed", flow.intent, `\u7B2C\u4E09\u65B9\u767B\u5F55\u5931\u8D25\uFF1A${info.message}`);
      return true;
    }
    const container = typeof info.info === "object" && info.info !== null ? info.info : {};
    const doc = typeof container.data === "object" && container.data !== null ? container.data : info.info;
    const subject = extractSubject(id, doc, resolved.source);
    if (subject === null) {
      this.audit("oauth-login-failed", source, `${id} missing subject`);
      this.finish(res, "failed", flow.intent, "\u65E0\u6CD5\u8BC6\u522B\u8BE5\u4E09\u65B9\u8D26\u53F7\u7684\u7A33\u5B9A\u6807\u8BC6\uFF0C\u8BF7\u8054\u7CFB\u7BA1\u7406\u5458\u3002");
      return true;
    }
    if (flow.intent === "bind") {
      const ticket = this.tickets.consume(flow.ticket, id);
      if (ticket === null) {
        this.audit("oauth-binding-rejected", source, `${id} ticket expired`);
        this.finish(res, "rejected", "bind", "\u7ED1\u5B9A\u7968\u636E\u5DF2\u5931\u6548\uFF0C\u8BF7\u4ECE\u8BBE\u7F6E\u9875\u91CD\u65B0\u53D1\u8D77\u7ED1\u5B9A\u3002");
        return true;
      }
      const profile = extractProfile(doc);
      const added = addBinding(this.bindings, {
        provider: id,
        subject,
        localSubject: ticket.localSubject,
        ...profile
      });
      if (!added.ok) {
        this.audit("oauth-binding-rejected", source, `${id} duplicate`);
        this.finish(res, "rejected", "bind", added.message);
        return true;
      }
      this.bindings = added.bindings;
      this.persist();
      this.audit("oauth-binding-added", source, id);
      this.finish(res, "bound", "bind");
      return true;
    }
    if (findBinding(this.bindings, id, subject) === void 0) {
      this.audit("oauth-login-unbound", source, id);
      this.finish(res, "unbound", "login", "\u8BE5\u4E09\u65B9\u8D26\u53F7\u5C1A\u672A\u7ED1\u5B9A\uFF0C\u8BF7\u8054\u7CFB\u7BA1\u7406\u5458\u5728\u8BBE\u7F6E\u9875\u7ED1\u5B9A\u540E\u518D\u767B\u5F55\u3002");
      return true;
    }
    const session = this.opts.auth.issueExternalSession({
      source: flow.source,
      userAgent: typeof req.headers["user-agent"] === "string" ? req.headers["user-agent"] : ""
    });
    this.finish(res, "ok", "login", void 0, {
      "set-cookie": sessionCookie(
        session.token,
        Math.floor(this.opts.auth.authPolicy.sessionTtlMs / 1e3),
        gate.cookieName
      )
    });
    return true;
  }
};

// src/oauth/origin.ts
function parseBareOrigin(raw) {
  if (typeof raw !== "string" || raw.trim() === "") return void 0;
  let url;
  try {
    url = new URL(raw.trim());
  } catch {
    return void 0;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return void 0;
  if (url.username !== "" || url.password !== "") return void 0;
  if (url.pathname !== "/" || url.search !== "" || url.hash !== "") return void 0;
  if (url.hostname === "") return void 0;
  return {
    protocol: url.protocol,
    hostname: url.hostname,
    ...url.port === "" ? {} : { port: url.port },
    origin: url.origin
  };
}
function trimOrigin(value) {
  return value.replace(/\/+$/, "");
}
function originFromRequest(requestOrigin, listenPort) {
  const parsed = parseBareOrigin(requestOrigin);
  if (parsed === void 0) return void 0;
  if (parsed.port === void 0 || Number(parsed.port) === listenPort) return parsed.origin;
  return `${parsed.protocol}//${parsed.hostname}:${listenPort}`;
}
function requestOriginOf(input) {
  const bare = (raw) => {
    const parsed = parseBareOrigin(raw ?? void 0);
    return parsed?.origin;
  };
  if (input.originHeader !== void 0 && input.originHeader !== null && input.originHeader !== "null") {
    const fromOrigin = bare(input.originHeader);
    if (fromOrigin !== void 0) return fromOrigin;
  }
  if (input.referer !== void 0 && input.referer !== null) {
    try {
      const fromReferer = bare(new URL(input.referer).origin);
      if (fromReferer !== void 0) return fromReferer;
    } catch {
    }
  }
  if (input.url !== void 0) {
    try {
      const fromUrl = bare(new URL(input.url).origin);
      if (fromUrl !== void 0) return fromUrl;
    } catch {
    }
  }
  const host = input.host;
  if (host !== void 0 && host !== null && host !== "") {
    return bare(`http://${host}`);
  }
  return void 0;
}
function resolveOAuthOrigin(input) {
  const configured = input.configured?.trim();
  if (configured !== void 0 && configured !== "") {
    return { origin: trimOrigin(configured), source: "configured" };
  }
  const fromRequest = originFromRequest(input.requestOrigin, input.listenPort);
  if (fromRequest !== void 0) return { origin: fromRequest, source: "request" };
  return { origin: trimOrigin(input.inferred), source: "inferred" };
}

// src/controller.ts
var PROBE_TIMEOUT_MS = 1500;
var PROBE_CACHE_MS = 3e3;
var ProxyController = class {
  constructor(opts) {
    this.opts = opts;
    this.log = opts.log;
    this.settings = new RuntimeSettingsFile(opts.settingsFile);
    this.audit = opts.auditFile === void 0 ? null : new AuditTrail({ filePath: opts.auditFile });
    this.security = opts.securityFile === void 0 ? null : new SecuritySettingsFile(opts.securityFile);
    this.securitySettings = this.security?.read() ?? { ...DEFAULT_SECURITY_SETTINGS };
    this.auth = new AuthState({
      ...opts.authPolicy === void 0 ? {} : { policy: opts.authPolicy },
      audit: (entry) => this.audit?.record(entry)
    });
    this.options = { ...opts.base };
    this.oauth = opts.oauthFile === void 0 ? null : new OAuthRuntime({
      base: opts.oauthBase ?? defaultOAuthConfig(),
      stateFile: new OAuthStateFile(opts.oauthFile),
      auth: this.auth,
      getLocalSubject: () => this.options.username === "" ? "default" : this.options.username,
      hasPassword: () => this.hasPassword(),
      cleartextAuth: () => this.cleartextAuth(),
      publicOrigin: (requestOrigin) => this.publicOrigin(requestOrigin),
      audit: (entry) => this.audit?.record(entry),
      log: this.log
    });
    const persisted = this.settings.read();
    if (persisted.listenPort !== void 0) this.options.listenPort = persisted.listenPort;
    if (persisted.upstreamPort !== void 0) this.options.upstreamPort = persisted.upstreamPort;
    if (persisted.username !== void 0) this.options.username = persisted.username;
    if (persisted.password !== void 0) this.options.password = persisted.password;
  }
  opts;
  handle = null;
  boundPort = null;
  probeCache = null;
  settings;
  log;
  options;
  /** Login-gate sessions; deliberately in-memory so a restart drops them. */
  auth;
  /** Durable audit trail (absent when no path was configured). */
  audit;
  /** Persisted transport policy (`requireTls`); absent when no path was configured. */
  security;
  /** Effective transport policy, kept in sync with the file. */
  securitySettings;
  /** Third-party login runtime; null only when no state file was wired in. */
  oauth;
  /** Whether a persisted runtime override exists (drives the status flag). */
  persisted() {
    const current = this.settings.read();
    return current.listenPort !== void 0 || current.upstreamPort !== void 0 || current.username !== void 0 || current.password !== void 0;
  }
  /**
   * Start the proxy (idempotent). Listen errors — the port is already taken by
   * another dsh-proxy instance, say — are logged loudly and reported through
   * the outcome (never thrown), so a failed forwarder can never take down the
   * web app boot while callers still learn why the listener is down.
   */
  async start() {
    if (this.handle !== null) return { ok: true };
    const log = this.log;
    const handle = startLanProxy({
      listenHost: this.options.listenHost,
      listenPort: this.options.listenPort,
      upstreamHost: this.options.upstreamHost,
      upstreamPort: this.options.upstreamPort,
      username: this.options.username,
      password: this.options.password,
      auth: this.auth,
      ...this.oauth === null ? {} : { oauth: this.oauth },
      ...this.opts.trustedProxyAddresses === void 0 ? {} : { trustedProxyAddresses: this.opts.trustedProxyAddresses },
      requireTls: this.requireTls(),
      cleartextAuth: this.cleartextAuth(),
      ...this.opts.loginTitle === void 0 ? {} : { loginTitle: this.opts.loginTitle },
      audit: (entry) => this.audit?.record(entry),
      ...this.opts.authenticatedUrl === void 0 ? {} : { authenticatedUrl: this.opts.authenticatedUrl },
      log
    });
    this.handle = handle;
    try {
      const bound = await handle.ready;
      this.boundPort = bound;
      const urls = handle.describeUrls(bound);
      log("info", `dsh-proxy: listening on ${this.options.listenHost}:${bound} -> http://${this.options.upstreamHost}:${this.options.upstreamPort}`);
      log("info", `dsh-proxy: \u672C\u673A\u8BBF\u95EE ${urls.local}`);
      for (const url of urls.lan) log("info", `dsh-proxy: \u5C40\u57DF\u7F51\u8BBF\u95EE ${url}`);
      if (this.authEnabled()) {
        log("info", this.hasPassword() ? `dsh-proxy: password login enabled (username: ${this.options.username})` : "dsh-proxy: third-party login enabled (no local password configured)");
        if (!this.requireTls() && this.cleartextAuth() === "login" && !isLoopbackAddress(this.options.listenHost)) {
          log("warn", 'dsh-proxy: \u660E\u6587\u767B\u5F55\u5DF2\u542F\u7528/SECURITY NOTE \u2014 cleartext visitors get a session cookie WITHOUT Secure/__Host- (a Secure cookie is not stored over http); anyone on the same network can sniff or plant it. Put a TLS reverse proxy in front, or set cleartextAuth to "basic" / requireTls to true.');
        }
      } else {
        const lanUrls = urls.lan.length > 0 ? urls.lan.join("  ") : `http://${this.options.listenHost}:${bound}`;
        const reason = this.options.username !== "" || this.options.password !== "" ? "only one of username/password is set, so password login is OFF" : "username and password are both empty, so password login is OFF";
        log("warn", `dsh-proxy: \u5B89\u5168\u63D0\u793A/SECURITY WARNING \u2014 ${reason}; anyone who can reach ${lanUrls} gets full access to DSH (HTTP + WebSocket, including privileged /api RPC) WITHOUT a password. Set BOTH a username and a password in DSH settings \u2192 LAN Proxy, or bind listenHost to 127.0.0.1.`);
      }
      return { ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      log("error", `dsh-proxy: failed to listen on ${this.options.listenHost}:${this.options.listenPort}: ${message} \u2014 stop any other dsh-proxy on this port, or change listenPort`);
      this.handle = null;
      return {
        ok: false,
        message: `\u65E0\u6CD5\u76D1\u542C ${this.options.listenHost}:${this.options.listenPort}\uFF1A${message}\u3002\u8BE5\u7AEF\u53E3\u53EF\u80FD\u5DF2\u88AB\u5360\u7528\uFF0C\u8BF7\u66F4\u6362\u4EE3\u7406\u670D\u52A1\u7AEF\u53E3\u6216\u91CA\u653E\u8BE5\u7AEF\u53E3\u540E\u91CD\u8BD5\u3002`
      };
    }
  }
  /**
   * Effective transport policy: the persisted override wins, then the cordis
   * config, then the compatible default (cleartext allowed).
   */
  requireTls() {
    if (this.security !== null) return this.securitySettings.requireTls;
    return this.opts.requireTls ?? false;
  }
  /** Authentication mode currently in force for allowed cleartext traffic. */
  cleartextAuth() {
    return this.securitySettings.cleartextAuth;
  }
  /** The authentication surface for the settings page. */
  authView(currentToken) {
    return {
      sessions: this.auth.listSessions(currentToken),
      lockouts: this.auth.lockedSources(),
      policy: this.auth.authPolicy,
      requireTls: this.requireTls(),
      cleartextAuth: this.cleartextAuth(),
      loginEnabled: this.hasPassword(),
      oauthEnabled: this.oauth?.authEnabled ?? false,
      loginPath: LOGIN_PATH,
      logoutPath: LOGOUT_PATH
    };
  }
  /** Recent audit entries, newest first (what an operator would want on screen). */
  auditView() {
    const entries = this.audit?.list() ?? [];
    return [...entries].reverse().map(({ at, event, source, detail }) => ({
      at,
      event,
      source,
      ...detail === void 0 ? {} : { detail }
    }));
  }
  /**
   * Revoke one session, or every session except the caller's.
   * @param payload - `{ id }` from the settings page; `all` keeps the caller.
   * @param currentToken - the caller's own session token, so it is never dropped by `all`.
   * @returns how many sessions were revoked.
   */
  revokeSessions(payload, currentToken) {
    const id = payload?.id;
    if (typeof id !== "string" || id === "") return { revoked: 0 };
    if (id === "all") return { revoked: this.auth.revokeAllSessions(currentToken) };
    return { revoked: this.auth.revokeSession(id) ? 1 : 0 };
  }
  /**
   * Persist the transport policy. A change takes effect on the next restart, so
   * this reports whether a restart is needed instead of silently not applying it.
   * @param payload - the requested `requireTls`.
   */
  updateSecurity(payload) {
    const input = payload;
    if (input === null || typeof input !== "object") return { ok: false, message: "\u8BF7\u6C42\u4F53\u5FC5\u987B\u662F\u5BF9\u8C61" };
    const next = { ...this.securitySettings };
    if (input.requireTls !== void 0) {
      if (typeof input.requireTls !== "boolean") return { ok: false, message: "requireTls \u5FC5\u987B\u662F\u5E03\u5C14\u503C" };
      next.requireTls = input.requireTls;
    }
    if (input.cleartextAuth !== void 0) {
      if (!isCleartextAuthMode(input.cleartextAuth)) {
        return { ok: false, message: "cleartextAuth \u53EA\u80FD\u662F 'login' \u6216 'basic'" };
      }
      next.cleartextAuth = input.cleartextAuth;
    }
    if (input.requireTls === void 0 && input.cleartextAuth === void 0) {
      return { ok: false, message: "\u6CA1\u6709\u53EF\u4FDD\u5B58\u7684\u4FEE\u6539" };
    }
    const changed = next.requireTls !== this.requireTls() || next.cleartextAuth !== this.securitySettings.cleartextAuth;
    this.securitySettings = next;
    this.security?.write(next);
    this.log("info", `dsh-proxy: transport policy updated (requireTls=${String(next.requireTls)}, cleartextAuth=${next.cleartextAuth})`);
    return {
      ok: true,
      requireTls: next.requireTls,
      cleartextAuth: next.cleartextAuth,
      restartRequired: changed
    };
  }
  /** Stop the proxy and every upgraded socket. */
  async stop() {
    const handle = this.handle;
    this.handle = null;
    this.boundPort = null;
    if (handle !== null) await handle.close();
  }
  /** Stop and start again with the current effective options (the "restart the forwarding service" verb). */
  async restart() {
    await this.stop();
    return this.start();
  }
  /**
   * Stop the proxy AFTER the caller's response has flushed back. The stop RPC
   * answer travels through the proxy itself when the settings page is reached
   * via the LAN URL, so closing the listener before the response is written
   * would drop it; the listener is torn down shortly afterwards instead.
   * @param delayMs - grace before the listener closes (defaults to 300ms).
   * @returns the status as it will be once stopped.
   */
  stopDeferred(delayMs = 300) {
    const stopped = { ...this.status(), proxyListening: false };
    const timer = setTimeout(() => {
      void this.stop();
    }, delayMs);
    timer.unref?.();
    return stopped;
  }
  /**
   * Current read-only status for the settings page. `upstreamReachable`
   * reflects the most recent probe (false until the first probe runs).
   */
  status() {
    const authEnabled = this.authEnabled();
    return {
      oauthEnabled: this.oauth?.authEnabled ?? false,
      listenHost: this.options.listenHost,
      listenPort: this.boundPort ?? this.options.listenPort,
      proxyListening: this.boundPort !== null,
      upstreamHost: this.options.upstreamHost,
      upstreamPort: this.options.upstreamPort,
      upstreamReachable: this.probeCache?.reachable ?? false,
      username: this.options.username,
      password: this.options.password,
      authEnabled,
      // The settings page warns in red about this one; the rule lives in the
      // shared contract so the host and the section can never disagree.
      lanExposed: isLanExposed(this.options.listenHost, this.boundPort !== null, authEnabled),
      authSessionCount: this.auth.sessionCount,
      persisted: this.persisted()
    };
  }
  /**
   * Status with a fresh upstream reachability probe (cached for a few
   * seconds so repeated settings-page loads do not hammer the target).
   */
  async refreshStatus() {
    await this.probeUpstream();
    return this.status();
  }
  /**
   * Probe whether the target upstream service answers HTTP. Any response —
   * even an error status — counts as reachable; only connection failures and
   * timeouts turn the light red.
   */
  async probeUpstream() {
    const now = Date.now();
    if (this.probeCache !== null && now - this.probeCache.at < PROBE_CACHE_MS) {
      return this.probeCache.reachable;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
    let reachable = false;
    try {
      const res = await fetch(
        `http://${this.options.upstreamHost}:${this.options.upstreamPort}/favicon.svg`,
        { signal: controller.signal, redirect: "manual" }
      );
      reachable = true;
      await res.body?.cancel().catch(() => {
      });
    } catch {
      reachable = false;
    } finally {
      clearTimeout(timer);
    }
    this.probeCache = { at: now, reachable };
    return reachable;
  }
  /**
   * Apply an update payload: validate, persist, then restart the forwarding
   * service with the new effective options.
   * @param payload - raw RPC payload from the settings page.
   * @returns the new status, or a user-facing rejection message.
   */
  async update(payload) {
    const check = validateUpdate(
      payload,
      this.boundPort ?? this.options.listenPort,
      this.options.upstreamPort
    );
    if (!check.ok) return { ok: false, message: check.message };
    const patch = check.patch;
    const next = { ...this.settings.read(), ...patch };
    this.settings.write(next);
    if (patch.listenPort !== void 0) this.options.listenPort = patch.listenPort;
    if (patch.upstreamPort !== void 0) this.options.upstreamPort = patch.upstreamPort;
    if (patch.username !== void 0) this.options.username = patch.username;
    if (patch.password !== void 0) this.options.password = patch.password;
    const wasListening = this.boundPort !== null;
    const startOutcome = wasListening ? await this.restart() : null;
    this.probeCache = null;
    this.log("info", `dsh-proxy: settings updated via the settings page; forwarding service ${startOutcome === null ? "kept stopped" : startOutcome.ok ? "restarted" : "restart FAILED"}`);
    const bothSet = this.options.username !== "" && this.options.password !== "";
    const anySet = this.options.username !== "" || this.options.password !== "";
    const partial = anySet && !bothSet;
    if (startOutcome !== null && !startOutcome.ok) {
      return {
        ok: true,
        result: {
          status: await this.refreshStatus(),
          notice: "saved-restart-failed",
          message: startOutcome.message
        }
      };
    }
    const notice = startOutcome === null ? partial ? "credentials-partial-saved" : "saved" : partial ? "credentials-partial-restarted" : "saved-restarted";
    return {
      ok: true,
      result: {
        status: await this.refreshStatus(),
        notice,
        message: startOutcome === null ? partial ? "\u5DF2\u4FDD\u5B58\uFF08\u6CE8\u610F\uFF1A\u9700\u540C\u65F6\u8BBE\u7F6E\u7528\u6237\u540D\u548C\u5BC6\u7801\u624D\u4F1A\u542F\u7528\u5BC6\u7801\u767B\u5F55\uFF09" : "\u5DF2\u4FDD\u5B58" : partial ? "\u5DF2\u4FDD\u5B58\u5E76\u91CD\u542F\u8F6C\u53D1\u670D\u52A1\uFF08\u6CE8\u610F\uFF1A\u9700\u540C\u65F6\u8BBE\u7F6E\u7528\u6237\u540D\u548C\u5BC6\u7801\u624D\u4F1A\u542F\u7528\u5BC6\u7801\u767B\u5F55\uFF09" : "\u5DF2\u4FDD\u5B58\u5E76\u91CD\u542F\u8F6C\u53D1\u670D\u52A1"
      }
    };
  }
  /** Whether the local username/password pair is complete. */
  hasPassword() {
    return this.options.username !== "" && this.options.password !== "";
  }
  /**
   * D2: either configured authentication method turns the gate on. With
   * NEITHER method configured the long-standing open/warning posture stays
   * unchanged (D2′, see the spec).
   */
  authEnabled() {
    if (this.oauth === null) return this.hasPassword();
    return this.oauth.authEnabled;
  }
  /**
   * Externally reachable proxy origin for the settings page's displayed
   * callback URIs and binding links.
   *
   * Precedence: explicit `publicOrigin` override > the domain actually used by
   * the settings page (with the proxy's real port substituted when the settings
   * page runs on the DSH app's own port) > the legacy LAN-IP guess. The live
   * login flow never uses this: it builds `redirect_uri` from `gate.origin`.
   */
  publicOrigin(requestOrigin) {
    const port = this.boundPort ?? this.options.listenPort;
    return resolveOAuthOrigin({
      configured: this.oauth?.effective.publicOrigin,
      requestOrigin,
      listenPort: port,
      inferred: lanAddresses(port)[0] ?? `http://127.0.0.1:${port}`
    }).origin;
  }
  /** Settings view of the third-party login surface; null when not wired in. */
  oauthStatus(requestOrigin) {
    return this.oauth?.statusView(requestOrigin) ?? null;
  }
  /** Validate + persist an OAuth config patch (effective on the next request). */
  updateOAuth(payload, requestOrigin) {
    if (this.oauth === null) return { ok: false, message: "\u7B2C\u4E09\u65B9\u767B\u5F55\u672A\u521D\u59CB\u5316" };
    return this.oauth.updateConfig(payload, requestOrigin);
  }
  /** Start a manual binding flow from the settings page. */
  startOAuthBinding(payload, requestOrigin) {
    if (this.oauth === null) return { ok: false, message: "\u7B2C\u4E09\u65B9\u767B\u5F55\u672A\u521D\u59CB\u5316" };
    return this.oauth.startBinding(payload, requestOrigin);
  }
  /** Remove one manual binding; the account loses access immediately. */
  removeOAuthBinding(payload, requestOrigin) {
    if (this.oauth === null) return { ok: false, message: "\u7B2C\u4E09\u65B9\u767B\u5F55\u672A\u521D\u59CB\u5316" };
    return this.oauth.removeBindingById(payload, requestOrigin);
  }
};

// src/state-dir.ts
var import_node_fs3 = require("node:fs");
var import_node_path4 = require("node:path");
var import_node_url = require("node:url");
var PROXY_STATE_FILES = {
  /** Runtime overlay: listen port, username, password. */
  settings: "dsh-proxy.yaml",
  /** Append-only login audit trail (JSON Lines, intentionally not a config). */
  audit: "dsh-proxy-audit.jsonl",
  /** Transport policy: requireTls / cleartextAuth. */
  security: "dsh-proxy-security.yaml",
  /** Third-party login config overlay + manual binding table. */
  oauth: "dsh-proxy-oauth.yaml"
};
var LEGACY_JSON_STATE_FILES = {
  settings: "dsh-proxy.json",
  security: "dsh-proxy-security.json",
  oauth: "dsh-proxy-oauth.json"
};
var PROXY_STATE_DIR_NAME = "dsh-proxy";
var SAFE_PROFILE_NAME = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
function profileDirFromBaseUrl(baseUrl) {
  if (typeof baseUrl !== "string" || !baseUrl.startsWith("file:")) return void 0;
  try {
    const url = new URL(baseUrl);
    const path = (0, import_node_url.fileURLToPath)(url);
    const dir = url.pathname.endsWith("/") ? path : (0, import_node_path4.dirname)(path);
    return (0, import_node_path4.resolve)(dir);
  } catch {
    return void 0;
  }
}
function resolveStateDir(options) {
  const home = (0, import_node_path4.resolve)(options.dshHome);
  if (options.scope === "home") return { dir: home, scope: "home" };
  const profileDir = profileDirFromBaseUrl(options.baseUrl);
  if (profileDir === void 0) {
    return { dir: home, scope: "home", fallbackReason: "ctx.baseUrl is missing or not a file: URL" };
  }
  const name2 = (0, import_node_path4.basename)(profileDir);
  if (!SAFE_PROFILE_NAME.test(name2)) {
    return { dir: home, scope: "home", fallbackReason: `unsafe profile name ${JSON.stringify(name2)}` };
  }
  const profilesRoot = (0, import_node_path4.join)(home, "profiles");
  if ((0, import_node_path4.resolve)((0, import_node_path4.dirname)(profileDir)) !== profilesRoot) {
    return { dir: home, scope: "home", fallbackReason: `baseUrl is not under ${profilesRoot}` };
  }
  return { dir: (0, import_node_path4.join)(profileDir, PROXY_STATE_DIR_NAME), scope: "profile", profile: name2 };
}
function seedLegacyState(dir, dshHome) {
  const target = (0, import_node_path4.resolve)(dir);
  const home = (0, import_node_path4.resolve)(dshHome);
  if (target === home) return [];
  const names = Object.values(PROXY_STATE_FILES);
  if (names.some((name2) => (0, import_node_fs3.existsSync)((0, import_node_path4.join)(target, name2)))) return [];
  const copied = [];
  for (const key of Object.keys(LEGACY_JSON_STATE_FILES)) {
    const yamlName = PROXY_STATE_FILES[key];
    const legacyName = LEGACY_JSON_STATE_FILES[key];
    if ((0, import_node_fs3.existsSync)((0, import_node_path4.join)(home, yamlName))) {
      try {
        (0, import_node_fs3.mkdirSync)(target, { recursive: true });
        (0, import_node_fs3.copyFileSync)((0, import_node_path4.join)(home, yamlName), (0, import_node_path4.join)(target, yamlName));
        copied.push(yamlName);
      } catch {
      }
    } else if ((0, import_node_fs3.existsSync)((0, import_node_path4.join)(home, legacyName))) {
      try {
        (0, import_node_fs3.mkdirSync)(target, { recursive: true });
        if (migrateLegacyStateFile((0, import_node_path4.join)(home, legacyName), (0, import_node_path4.join)(target, yamlName))) {
          copied.push(`${legacyName} -> ${yamlName}`);
        } else {
          (0, import_node_fs3.copyFileSync)((0, import_node_path4.join)(home, legacyName), (0, import_node_path4.join)(target, yamlName));
          copied.push(`${legacyName} (raw)`);
        }
      } catch {
      }
    }
  }
  if ((0, import_node_fs3.existsSync)((0, import_node_path4.join)(home, PROXY_STATE_FILES.audit))) {
    try {
      (0, import_node_fs3.mkdirSync)(target, { recursive: true });
      (0, import_node_fs3.copyFileSync)((0, import_node_path4.join)(home, PROXY_STATE_FILES.audit), (0, import_node_path4.join)(target, PROXY_STATE_FILES.audit));
      copied.push(PROXY_STATE_FILES.audit);
    } catch {
    }
  }
  return copied;
}

// src/index.ts
var name = "@stack-brain/dsh-proxy";
var inject = ["webServer", "connection"];
var emptyOAuthConfig = () => defaultOAuthConfig();
var Config = Schema.object({
  listenHost: Schema.string().default("0.0.0.0"),
  listenPort: Schema.natural().max(65535).default(3081),
  upstreamHost: Schema.string().default("127.0.0.1"),
  upstreamPort: Schema.natural().max(65535).default(0),
  username: Schema.string().default(""),
  password: Schema.string().default(""),
  trustedProxies: Schema.array(Schema.string()).default([]),
  requireTls: Schema.boolean().default(false),
  stateScope: Schema.union([Schema.const("profile"), Schema.const("home")]).default("profile"),
  oauth: Schema.any().default(emptyOAuthConfig())
});
function failure(message) {
  const error = { code: "bad-request", message, details: { issues: [] } };
  return { ok: false, error };
}
function createLanProxyRoute(controller, currentSessionToken) {
  const dispatch = async (endpoint, payload, currentToken, requestOrigin) => {
    if (endpoint === ENDPOINT_STATUS) {
      return { ok: true, value: await controller.refreshStatus() };
    }
    if (endpoint === ENDPOINT_START) {
      const outcome = await controller.start();
      if (!outcome.ok) {
        return failure(outcome.message);
      }
      return { ok: true, value: await controller.refreshStatus() };
    }
    if (endpoint === ENDPOINT_STOP) {
      return { ok: true, value: controller.stopDeferred() };
    }
    if (endpoint === ENDPOINT_UPDATE) {
      const outcome = await controller.update(payload);
      if (outcome.ok) return { ok: true, value: outcome.result };
      return failure(outcome.message);
    }
    if (endpoint === ENDPOINT_AUTH) {
      return { ok: true, value: controller.authView(currentToken) };
    }
    if (endpoint === ENDPOINT_AUDIT) {
      return { ok: true, value: controller.auditView() };
    }
    if (endpoint === ENDPOINT_AUTH_REVOKE) {
      return { ok: true, value: controller.revokeSessions(payload, currentToken) };
    }
    if (endpoint === ENDPOINT_SECURITY) {
      const outcome = controller.updateSecurity(payload);
      if (outcome.ok) return { ok: true, value: outcome };
      return failure(outcome.message);
    }
    if (endpoint === ENDPOINT_OAUTH_STATUS) {
      const view = controller.oauthStatus(requestOrigin);
      return view === null ? failure("\u7B2C\u4E09\u65B9\u767B\u5F55\u672A\u521D\u59CB\u5316") : { ok: true, value: view };
    }
    if (endpoint === ENDPOINT_OAUTH_UPDATE) {
      const outcome = controller.updateOAuth(payload, requestOrigin);
      return outcome.ok ? { ok: true, value: outcome.view } : failure(outcome.message);
    }
    if (endpoint === ENDPOINT_OAUTH_BINDING_START) {
      const outcome = controller.startOAuthBinding(payload, requestOrigin);
      return outcome.ok ? { ok: true, value: { startUrl: outcome.startUrl } } : failure(outcome.message);
    }
    if (endpoint === ENDPOINT_OAUTH_BINDING_REMOVE) {
      const outcome = controller.removeOAuthBinding(payload, requestOrigin);
      return outcome.ok ? { ok: true, value: outcome.view } : failure(outcome.message);
    }
    return failure(`unknown endpoint ${JSON.stringify(endpoint)}`);
  };
  return async (request) => {
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json(failure("body is not JSON"), { status: 400 });
    }
    if (typeof body?.endpoint !== "string" || body.endpoint.length === 0) {
      return Response.json(failure("body has no endpoint"), { status: 400 });
    }
    const requestOrigin = requestOriginOf({
      url: request.url,
      originHeader: request.headers.get("origin"),
      referer: request.headers.get("referer"),
      host: request.headers.get("host")
    });
    const result = await dispatch(
      body.endpoint,
      body.payload,
      currentSessionToken === void 0 ? void 0 : currentSessionToken(request),
      requestOrigin
    );
    return Response.json(result);
  };
}
function apply(ctx, config) {
  const resolved = Config(config ?? {});
  const log = (level, message) => {
    ctx.logger[level](message);
  };
  const dshHome = dshHomePath();
  const baseUrl = ctx.baseUrl ?? ctx.root?.baseUrl;
  const state = resolveStateDir({ baseUrl, dshHome, scope: resolved.stateScope });
  if (state.fallbackReason !== void 0) {
    log("warn", `dsh-proxy: \u65E0\u6CD5\u6309 profile \u9694\u79BB\u72B6\u6001\u6587\u4EF6\uFF08${state.fallbackReason}\uFF09\uFF0C\u5DF2\u56DE\u9000\u5230 $DSH_HOME \u5171\u4EAB\u76EE\u5F55`);
  }
  const migrated = seedLegacyState(state.dir, dshHome);
  if (migrated.length > 0) {
    log("info", `dsh-proxy: \u65E7\u914D\u7F6E\u5DF2\u4ECE $DSH_HOME \u8FC1\u79FB\u5230 ${state.dir}\uFF08${migrated.join(", ")}\uFF09\uFF1B\u65E7\u6587\u4EF6\u4FDD\u7559`);
  }
  log("info", `dsh-proxy: \u72B6\u6001\u76EE\u5F55 ${state.dir}${state.profile === void 0 ? "\uFF08\u5171\u4EAB\uFF09" : `\uFF08profile: ${state.profile}\uFF09`}`);
  const controller = new ProxyController({
    base: {
      listenHost: resolved.listenHost,
      listenPort: resolved.listenPort,
      upstreamHost: resolved.upstreamHost,
      upstreamPort: resolved.upstreamPort || ctx.webServer.port || 3080,
      username: resolved.username,
      password: resolved.password
    },
    settingsFile: (0, import_node_path5.join)(state.dir, PROXY_STATE_FILES.settings),
    auditFile: (0, import_node_path5.join)(state.dir, PROXY_STATE_FILES.audit),
    securityFile: (0, import_node_path5.join)(state.dir, PROXY_STATE_FILES.security),
    oauthBase: normalizeOAuthConfig(resolved.oauth, defaultOAuthConfig()),
    oauthFile: (0, import_node_path5.join)(state.dir, PROXY_STATE_FILES.oauth),
    trustedProxyAddresses: resolved.trustedProxies,
    requireTls: resolved.requireTls,
    loginTitle: "DSH \u5C40\u57DF\u7F51\u4EE3\u7406",
    // DSH mints its browser-session cookie only through the tokenized URL it
    // prints at startup, which points at loopback. Rebuild that URL for the
    // authority the browser actually used so a LAN visitor's first index
    // request logs itself in instead of dead-ending on "dsh web
    // authentication required".
    authenticatedUrl: (publicOrigin) => {
      try {
        return ctx.connection.authenticatedUrl(publicOrigin);
      } catch {
        return void 0;
      }
    },
    log
  });
  ctx.effect(
    async () => {
      await controller.start();
      return () => controller.stop();
    },
    "dsh-proxy.proxy"
  );
  ctx.effect(
    () => ctx.connection.fetch.register({
      path: LAN_PROXY_PATH,
      methods: ["POST"],
      requestBody: "buffered",
      // The caller's own session cookie (when the page came through the proxy's
      // login gate) identifies which session must survive a "revoke others".
      fetch: createLanProxyRoute(controller, (request) => readCookie(request.headers.get("cookie") ?? void 0, SESSION_COOKIE))
    }),
    "dsh-proxy.settings-route"
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuditTrail,
  AuthState,
  Config,
  apply,
  createLanProxyRoute,
  inject,
  lanAddresses,
  name,
  startLanProxy
});
/*! Bundled license information:

http-proxy/lib/http-proxy/passes/web-outgoing.js:
http-proxy/lib/http-proxy/passes/web-incoming.js:
  (*!
   * Array of passes.
   *
   * A `pass` is just a function that is executed on `req, res, options`
   * so that you can easily add new checks while still keeping the base
   * flexible.
   *)

http-proxy/lib/http-proxy/passes/ws-incoming.js:
  (*!
   * Array of passes.
   *
   * A `pass` is just a function that is executed on `req, socket, options`
   * so that you can easily add new checks while still keeping the base
   * flexible.
   *)

http-proxy/index.js:
  (*!
   * Caron dimonio, con occhi di bragia
   * loro accennando, tutte le raccoglie;
   * batte col remo qualunque s’adagia 
   *
   * Charon the demon, with the eyes of glede,
   * Beckoning to them, collects them all together,
   * Beats with his oar whoever lags behind
   *          
   *          Dante - The Divine Comedy (Canto III)
   *)
*/
//# sourceMappingURL=index.cjs.map
