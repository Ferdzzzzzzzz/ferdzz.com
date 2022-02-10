// node_modules/lib0/map.js
var create = () => new Map();
var copy = (m) => {
  const r = create();
  m.forEach((v, k) => {
    r.set(k, v);
  });
  return r;
};
var setIfUndefined = (map7, key, createT) => {
  let set3 = map7.get(key);
  if (set3 === void 0) {
    map7.set(key, set3 = createT());
  }
  return set3;
};
var map = (m, f2) => {
  const res = [];
  for (const [key, value] of m) {
    res.push(f2(value, key));
  }
  return res;
};
var any = (m, f2) => {
  for (const [key, value] of m) {
    if (f2(value, key)) {
      return true;
    }
  }
  return false;
};

// node_modules/lib0/set.js
var create2 = () => new Set();

// node_modules/lib0/array.js
var last = (arr) => arr[arr.length - 1];
var from = Array.from;

// node_modules/lib0/observable.js
var Observable = class {
  constructor() {
    this._observers = create();
  }
  on(name, f2) {
    setIfUndefined(this._observers, name, create2).add(f2);
  }
  once(name, f2) {
    const _f = (...args2) => {
      this.off(name, _f);
      f2(...args2);
    };
    this.on(name, _f);
  }
  off(name, f2) {
    const observers = this._observers.get(name);
    if (observers !== void 0) {
      observers.delete(f2);
      if (observers.size === 0) {
        this._observers.delete(name);
      }
    }
  }
  emit(name, args2) {
    return from((this._observers.get(name) || create()).values()).forEach((f2) => f2(...args2));
  }
  destroy() {
    this._observers = create();
  }
};

// node_modules/lib0/math.js
var floor = Math.floor;
var abs = Math.abs;
var min = (a, b) => a < b ? a : b;
var max = (a, b) => a > b ? a : b;
var isNaN = Number.isNaN;
var isNegativeZero = (n) => n !== 0 ? n < 0 : 1 / n < 0;

// node_modules/lib0/string.js
var fromCharCode = String.fromCharCode;
var fromCodePoint = String.fromCodePoint;
var toLowerCase = (s) => s.toLowerCase();
var trimLeftRegex = /^\s*/g;
var trimLeft = (s) => s.replace(trimLeftRegex, "");
var fromCamelCaseRegex = /([A-Z])/g;
var fromCamelCase = (s, separator) => trimLeft(s.replace(fromCamelCaseRegex, (match) => `${separator}${toLowerCase(match)}`));
var utf8TextEncoder = typeof TextEncoder !== "undefined" ? new TextEncoder() : null;
var utf8TextDecoder = typeof TextDecoder === "undefined" ? null : new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });
if (utf8TextDecoder && utf8TextDecoder.decode(new Uint8Array()).length === 1) {
  utf8TextDecoder = null;
}

// node_modules/lib0/conditions.js
var undefinedToNull = (v) => v === void 0 ? null : v;

// node_modules/lib0/storage.js
var VarStoragePolyfill = class {
  constructor() {
    this.map = new Map();
  }
  setItem(key, newValue) {
    this.map.set(key, newValue);
  }
  getItem(key) {
    return this.map.get(key);
  }
};
var _localStorage = new VarStoragePolyfill();
var usePolyfill = true;
try {
  if (typeof localStorage !== "undefined") {
    _localStorage = localStorage;
    usePolyfill = false;
  }
} catch (e) {
}
var varStorage = _localStorage;

// node_modules/lib0/environment.js
var isNode = typeof process !== "undefined" && process.release && /node|io\.js/.test(process.release.name);
var isMac = typeof navigator !== "undefined" ? /Mac/.test(navigator.platform) : false;
var params;
var args = [];
var computeParams = () => {
  if (params === void 0) {
    if (isNode) {
      params = create();
      const pargs = process.argv;
      let currParamName = null;
      for (let i = 0; i < pargs.length; i++) {
        const parg = pargs[i];
        if (parg[0] === "-") {
          if (currParamName !== null) {
            params.set(currParamName, "");
          }
          currParamName = parg;
        } else {
          if (currParamName !== null) {
            params.set(currParamName, parg);
            currParamName = null;
          } else {
            args.push(parg);
          }
        }
      }
      if (currParamName !== null) {
        params.set(currParamName, "");
      }
    } else if (typeof location === "object") {
      params = create();
      (location.search || "?").slice(1).split("&").forEach((kv) => {
        if (kv.length !== 0) {
          const [key, value] = kv.split("=");
          params.set(`--${fromCamelCase(key, "-")}`, value);
          params.set(`-${fromCamelCase(key, "-")}`, value);
        }
      });
    } else {
      params = create();
    }
  }
  return params;
};
var hasParam = (name) => computeParams().has(name);
var getVariable = (name) => isNode ? undefinedToNull(process.env[name.toUpperCase()]) : undefinedToNull(varStorage.getItem(name));
var hasConf = (name) => hasParam("--" + name) || getVariable(name) !== null;
var production = hasConf("production");

// node_modules/lib0/binary.js
var BIT1 = 1;
var BIT2 = 2;
var BIT3 = 4;
var BIT4 = 8;
var BIT6 = 32;
var BIT7 = 64;
var BIT8 = 128;
var BIT18 = 1 << 17;
var BIT19 = 1 << 18;
var BIT20 = 1 << 19;
var BIT21 = 1 << 20;
var BIT22 = 1 << 21;
var BIT23 = 1 << 22;
var BIT24 = 1 << 23;
var BIT25 = 1 << 24;
var BIT26 = 1 << 25;
var BIT27 = 1 << 26;
var BIT28 = 1 << 27;
var BIT29 = 1 << 28;
var BIT30 = 1 << 29;
var BIT31 = 1 << 30;
var BIT32 = 1 << 31;
var BITS5 = 31;
var BITS6 = 63;
var BITS7 = 127;
var BITS17 = BIT18 - 1;
var BITS18 = BIT19 - 1;
var BITS19 = BIT20 - 1;
var BITS20 = BIT21 - 1;
var BITS21 = BIT22 - 1;
var BITS22 = BIT23 - 1;
var BITS23 = BIT24 - 1;
var BITS24 = BIT25 - 1;
var BITS25 = BIT26 - 1;
var BITS26 = BIT27 - 1;
var BITS27 = BIT28 - 1;
var BITS28 = BIT29 - 1;
var BITS29 = BIT30 - 1;
var BITS30 = BIT31 - 1;
var BITS31 = 2147483647;

// node_modules/lib0/buffer.js
var createUint8ArrayViewFromArrayBuffer = (buffer2, byteOffset, length3) => new Uint8Array(buffer2, byteOffset, length3);

// node_modules/lib0/number.js
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
var MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER;
var LOWEST_INT32 = 1 << 31;
var isInteger = Number.isInteger || ((num) => typeof num === "number" && isFinite(num) && floor(num) === num);
var isNaN2 = Number.isNaN;
var parseInt = Number.parseInt;

// node_modules/lib0/encoding.js
var Encoder = class {
  constructor() {
    this.cpos = 0;
    this.cbuf = new Uint8Array(100);
    this.bufs = [];
  }
};
var createEncoder = () => new Encoder();
var length = (encoder) => {
  let len = encoder.cpos;
  for (let i = 0; i < encoder.bufs.length; i++) {
    len += encoder.bufs[i].length;
  }
  return len;
};
var toUint8Array = (encoder) => {
  const uint8arr = new Uint8Array(length(encoder));
  let curPos = 0;
  for (let i = 0; i < encoder.bufs.length; i++) {
    const d = encoder.bufs[i];
    uint8arr.set(d, curPos);
    curPos += d.length;
  }
  uint8arr.set(createUint8ArrayViewFromArrayBuffer(encoder.cbuf.buffer, 0, encoder.cpos), curPos);
  return uint8arr;
};
var verifyLen = (encoder, len) => {
  const bufferLen = encoder.cbuf.length;
  if (bufferLen - encoder.cpos < len) {
    encoder.bufs.push(createUint8ArrayViewFromArrayBuffer(encoder.cbuf.buffer, 0, encoder.cpos));
    encoder.cbuf = new Uint8Array(max(bufferLen, len) * 2);
    encoder.cpos = 0;
  }
};
var write = (encoder, num) => {
  const bufferLen = encoder.cbuf.length;
  if (encoder.cpos === bufferLen) {
    encoder.bufs.push(encoder.cbuf);
    encoder.cbuf = new Uint8Array(bufferLen * 2);
    encoder.cpos = 0;
  }
  encoder.cbuf[encoder.cpos++] = num;
};
var writeUint8 = write;
var writeVarUint = (encoder, num) => {
  while (num > BITS7) {
    write(encoder, BIT8 | BITS7 & num);
    num >>>= 7;
  }
  write(encoder, BITS7 & num);
};
var writeVarInt = (encoder, num) => {
  const isNegative = isNegativeZero(num);
  if (isNegative) {
    num = -num;
  }
  write(encoder, (num > BITS6 ? BIT8 : 0) | (isNegative ? BIT7 : 0) | BITS6 & num);
  num >>>= 6;
  while (num > 0) {
    write(encoder, (num > BITS7 ? BIT8 : 0) | BITS7 & num);
    num >>>= 7;
  }
};
var writeVarString = (encoder, str) => {
  const encodedString = unescape(encodeURIComponent(str));
  const len = encodedString.length;
  writeVarUint(encoder, len);
  for (let i = 0; i < len; i++) {
    write(encoder, encodedString.codePointAt(i));
  }
};
var writeUint8Array = (encoder, uint8Array) => {
  const bufferLen = encoder.cbuf.length;
  const cpos = encoder.cpos;
  const leftCopyLen = min(bufferLen - cpos, uint8Array.length);
  const rightCopyLen = uint8Array.length - leftCopyLen;
  encoder.cbuf.set(uint8Array.subarray(0, leftCopyLen), cpos);
  encoder.cpos += leftCopyLen;
  if (rightCopyLen > 0) {
    encoder.bufs.push(encoder.cbuf);
    encoder.cbuf = new Uint8Array(max(bufferLen * 2, rightCopyLen));
    encoder.cbuf.set(uint8Array.subarray(leftCopyLen));
    encoder.cpos = rightCopyLen;
  }
};
var writeVarUint8Array = (encoder, uint8Array) => {
  writeVarUint(encoder, uint8Array.byteLength);
  writeUint8Array(encoder, uint8Array);
};
var writeOnDataView = (encoder, len) => {
  verifyLen(encoder, len);
  const dview = new DataView(encoder.cbuf.buffer, encoder.cpos, len);
  encoder.cpos += len;
  return dview;
};
var writeFloat32 = (encoder, num) => writeOnDataView(encoder, 4).setFloat32(0, num, false);
var writeFloat64 = (encoder, num) => writeOnDataView(encoder, 8).setFloat64(0, num, false);
var writeBigInt64 = (encoder, num) => writeOnDataView(encoder, 8).setBigInt64(0, num, false);
var floatTestBed = new DataView(new ArrayBuffer(4));
var isFloat32 = (num) => {
  floatTestBed.setFloat32(0, num);
  return floatTestBed.getFloat32(0) === num;
};
var writeAny = (encoder, data) => {
  switch (typeof data) {
    case "string":
      write(encoder, 119);
      writeVarString(encoder, data);
      break;
    case "number":
      if (isInteger(data) && data <= BITS31) {
        write(encoder, 125);
        writeVarInt(encoder, data);
      } else if (isFloat32(data)) {
        write(encoder, 124);
        writeFloat32(encoder, data);
      } else {
        write(encoder, 123);
        writeFloat64(encoder, data);
      }
      break;
    case "bigint":
      write(encoder, 122);
      writeBigInt64(encoder, data);
      break;
    case "object":
      if (data === null) {
        write(encoder, 126);
      } else if (data instanceof Array) {
        write(encoder, 117);
        writeVarUint(encoder, data.length);
        for (let i = 0; i < data.length; i++) {
          writeAny(encoder, data[i]);
        }
      } else if (data instanceof Uint8Array) {
        write(encoder, 116);
        writeVarUint8Array(encoder, data);
      } else {
        write(encoder, 118);
        const keys2 = Object.keys(data);
        writeVarUint(encoder, keys2.length);
        for (let i = 0; i < keys2.length; i++) {
          const key = keys2[i];
          writeVarString(encoder, key);
          writeAny(encoder, data[key]);
        }
      }
      break;
    case "boolean":
      write(encoder, data ? 120 : 121);
      break;
    default:
      write(encoder, 127);
  }
};
var RleEncoder = class extends Encoder {
  constructor(writer) {
    super();
    this.w = writer;
    this.s = null;
    this.count = 0;
  }
  write(v) {
    if (this.s === v) {
      this.count++;
    } else {
      if (this.count > 0) {
        writeVarUint(this, this.count - 1);
      }
      this.count = 1;
      this.w(this, v);
      this.s = v;
    }
  }
};
var flushUintOptRleEncoder = (encoder) => {
  if (encoder.count > 0) {
    writeVarInt(encoder.encoder, encoder.count === 1 ? encoder.s : -encoder.s);
    if (encoder.count > 1) {
      writeVarUint(encoder.encoder, encoder.count - 2);
    }
  }
};
var UintOptRleEncoder = class {
  constructor() {
    this.encoder = new Encoder();
    this.s = 0;
    this.count = 0;
  }
  write(v) {
    if (this.s === v) {
      this.count++;
    } else {
      flushUintOptRleEncoder(this);
      this.count = 1;
      this.s = v;
    }
  }
  toUint8Array() {
    flushUintOptRleEncoder(this);
    return toUint8Array(this.encoder);
  }
};
var flushIntDiffOptRleEncoder = (encoder) => {
  if (encoder.count > 0) {
    const encodedDiff = encoder.diff << 1 | (encoder.count === 1 ? 0 : 1);
    writeVarInt(encoder.encoder, encodedDiff);
    if (encoder.count > 1) {
      writeVarUint(encoder.encoder, encoder.count - 2);
    }
  }
};
var IntDiffOptRleEncoder = class {
  constructor() {
    this.encoder = new Encoder();
    this.s = 0;
    this.count = 0;
    this.diff = 0;
  }
  write(v) {
    if (this.diff === v - this.s) {
      this.s = v;
      this.count++;
    } else {
      flushIntDiffOptRleEncoder(this);
      this.count = 1;
      this.diff = v - this.s;
      this.s = v;
    }
  }
  toUint8Array() {
    flushIntDiffOptRleEncoder(this);
    return toUint8Array(this.encoder);
  }
};
var StringEncoder = class {
  constructor() {
    this.sarr = [];
    this.s = "";
    this.lensE = new UintOptRleEncoder();
  }
  write(string2) {
    this.s += string2;
    if (this.s.length > 19) {
      this.sarr.push(this.s);
      this.s = "";
    }
    this.lensE.write(string2.length);
  }
  toUint8Array() {
    const encoder = new Encoder();
    this.sarr.push(this.s);
    this.s = "";
    writeVarString(encoder, this.sarr.join(""));
    writeUint8Array(encoder, this.lensE.toUint8Array());
    return toUint8Array(encoder);
  }
};

// node_modules/isomorphic.js/browser.mjs
var performance = typeof window === "undefined" ? null : typeof window.performance !== "undefined" && window.performance || null;
var isoCrypto = typeof crypto === "undefined" ? null : crypto;
var cryptoRandomBuffer = isoCrypto !== null ? (len) => {
  const buf = new ArrayBuffer(len);
  const arr = new Uint8Array(buf);
  isoCrypto.getRandomValues(arr);
  return buf;
} : (len) => {
  const buf = new ArrayBuffer(len);
  const arr = new Uint8Array(buf);
  for (let i = 0; i < len; i++) {
    arr[i] = Math.ceil(Math.random() * 4294967295 >>> 0);
  }
  return buf;
};

// node_modules/lib0/random.js
var uint32 = () => new Uint32Array(cryptoRandomBuffer(4))[0];
var uuidv4Template = [1e7] + -1e3 + -4e3 + -8e3 + -1e11;
var uuidv4 = () => uuidv4Template.replace(/[018]/g, (c) => (c ^ uint32() & 15 >> c / 4).toString(16));

// node_modules/lib0/time.js
var getUnixTime = Date.now;

// node_modules/lib0/promise.js
var create3 = (f2) => new Promise(f2);

// node_modules/lib0/error.js
var create4 = (s) => new Error(s);
var methodUnimplemented = () => {
  throw create4("Method unimplemented");
};
var unexpectedCase = () => {
  throw create4("Unexpected case");
};

// node_modules/lib0/object.js
var keys = Object.keys;
var length2 = (obj) => keys(obj).length;
var every = (obj, f2) => {
  for (const key in obj) {
    if (!f2(obj[key], key)) {
      return false;
    }
  }
  return true;
};
var hasProperty = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
var equalFlat = (a, b) => a === b || length2(a) === length2(b) && every(a, (val, key) => (val !== void 0 || hasProperty(b, key)) && b[key] === val);

// node_modules/lib0/function.js
var callAll = (fs, args2, i = 0) => {
  try {
    for (; i < fs.length; i++) {
      fs[i](...args2);
    }
  } finally {
    if (i < fs.length) {
      callAll(fs, args2, i + 1);
    }
  }
};

// node_modules/lib0/symbol.js
var create5 = Symbol;

// node_modules/lib0/pair.js
var Pair = class {
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }
};
var create6 = (left, right) => new Pair(left, right);

// node_modules/lib0/dom.js
var doc = typeof document !== "undefined" ? document : {};
var domParser = typeof DOMParser !== "undefined" ? new DOMParser() : null;
var mapToStyleString = (m) => map(m, (value, key) => `${key}:${value};`).join("");
var ELEMENT_NODE = doc.ELEMENT_NODE;
var TEXT_NODE = doc.TEXT_NODE;
var CDATA_SECTION_NODE = doc.CDATA_SECTION_NODE;
var COMMENT_NODE = doc.COMMENT_NODE;
var DOCUMENT_NODE = doc.DOCUMENT_NODE;
var DOCUMENT_TYPE_NODE = doc.DOCUMENT_TYPE_NODE;
var DOCUMENT_FRAGMENT_NODE = doc.DOCUMENT_FRAGMENT_NODE;

// node_modules/lib0/logging.js
var BOLD = create5();
var UNBOLD = create5();
var BLUE = create5();
var GREY = create5();
var GREEN = create5();
var RED = create5();
var PURPLE = create5();
var ORANGE = create5();
var UNCOLOR = create5();
var _browserStyleMap = {
  [BOLD]: create6("font-weight", "bold"),
  [UNBOLD]: create6("font-weight", "normal"),
  [BLUE]: create6("color", "blue"),
  [GREEN]: create6("color", "green"),
  [GREY]: create6("color", "grey"),
  [RED]: create6("color", "red"),
  [PURPLE]: create6("color", "purple"),
  [ORANGE]: create6("color", "orange"),
  [UNCOLOR]: create6("color", "black")
};
var _nodeStyleMap = {
  [BOLD]: "[1m",
  [UNBOLD]: "[2m",
  [BLUE]: "[34m",
  [GREEN]: "[32m",
  [GREY]: "[37m",
  [RED]: "[31m",
  [PURPLE]: "[35m",
  [ORANGE]: "[38;5;208m",
  [UNCOLOR]: "[0m"
};
var computeBrowserLoggingArgs = (args2) => {
  const strBuilder = [];
  const styles = [];
  const currentStyle = create();
  let logArgs = [];
  let i = 0;
  for (; i < args2.length; i++) {
    const arg = args2[i];
    const style = _browserStyleMap[arg];
    if (style !== void 0) {
      currentStyle.set(style.left, style.right);
    } else {
      if (arg.constructor === String || arg.constructor === Number) {
        const style2 = mapToStyleString(currentStyle);
        if (i > 0 || style2.length > 0) {
          strBuilder.push("%c" + arg);
          styles.push(style2);
        } else {
          strBuilder.push(arg);
        }
      } else {
        break;
      }
    }
  }
  if (i > 0) {
    logArgs = styles;
    logArgs.unshift(strBuilder.join(""));
  }
  for (; i < args2.length; i++) {
    const arg = args2[i];
    if (!(arg instanceof Symbol)) {
      logArgs.push(arg);
    }
  }
  return logArgs;
};
var computeNodeLoggingArgs = (args2) => {
  const strBuilder = [];
  const logArgs = [];
  let i = 0;
  for (; i < args2.length; i++) {
    const arg = args2[i];
    const style = _nodeStyleMap[arg];
    if (style !== void 0) {
      strBuilder.push(style);
    } else {
      if (arg.constructor === String || arg.constructor === Number) {
        strBuilder.push(arg);
      } else {
        break;
      }
    }
  }
  if (i > 0) {
    strBuilder.push("[0m");
    logArgs.push(strBuilder.join(""));
  }
  for (; i < args2.length; i++) {
    const arg = args2[i];
    if (!(arg instanceof Symbol)) {
      logArgs.push(arg);
    }
  }
  return logArgs;
};
var computeLoggingArgs = isNode ? computeNodeLoggingArgs : computeBrowserLoggingArgs;
var print = (...args2) => {
  console.log(...computeLoggingArgs(args2));
  vconsoles.forEach((vc) => vc.print(args2));
};
var vconsoles = new Set();
var lastLoggingTime = getUnixTime();

// node_modules/lib0/iterator.js
var createIterator = (next) => ({
  [Symbol.iterator]() {
    return this;
  },
  next
});
var iteratorFilter = (iterator2, filter) => createIterator(() => {
  let res;
  do {
    res = iterator2.next();
  } while (!res.done && !filter(res.value));
  return res;
});
var iteratorMap = (iterator2, fmap) => createIterator(() => {
  const { done, value } = iterator2.next();
  return { done, value: done ? void 0 : fmap(value) };
});

// node_modules/yjs/dist/yjs.mjs
var DeleteItem = class {
  constructor(clock, len) {
    this.clock = clock;
    this.len = len;
  }
};
var DeleteSet = class {
  constructor() {
    this.clients = new Map();
  }
};
var iterateDeletedStructs = (transaction, ds, f2) => ds.clients.forEach((deletes, clientid) => {
  const structs = transaction.doc.store.clients.get(clientid);
  for (let i = 0; i < deletes.length; i++) {
    const del = deletes[i];
    iterateStructs(transaction, structs, del.clock, del.len, f2);
  }
});
var findIndexDS = (dis, clock) => {
  let left = 0;
  let right = dis.length - 1;
  while (left <= right) {
    const midindex = floor((left + right) / 2);
    const mid = dis[midindex];
    const midclock = mid.clock;
    if (midclock <= clock) {
      if (clock < midclock + mid.len) {
        return midindex;
      }
      left = midindex + 1;
    } else {
      right = midindex - 1;
    }
  }
  return null;
};
var isDeleted = (ds, id) => {
  const dis = ds.clients.get(id.client);
  return dis !== void 0 && findIndexDS(dis, id.clock) !== null;
};
var sortAndMergeDeleteSet = (ds) => {
  ds.clients.forEach((dels) => {
    dels.sort((a, b) => a.clock - b.clock);
    let i, j;
    for (i = 1, j = 1; i < dels.length; i++) {
      const left = dels[j - 1];
      const right = dels[i];
      if (left.clock + left.len >= right.clock) {
        left.len = max(left.len, right.clock + right.len - left.clock);
      } else {
        if (j < i) {
          dels[j] = right;
        }
        j++;
      }
    }
    dels.length = j;
  });
};
var addToDeleteSet = (ds, client, clock, length3) => {
  setIfUndefined(ds.clients, client, () => []).push(new DeleteItem(clock, length3));
};
var createDeleteSet = () => new DeleteSet();
var writeDeleteSet = (encoder, ds) => {
  writeVarUint(encoder.restEncoder, ds.clients.size);
  ds.clients.forEach((dsitems, client) => {
    encoder.resetDsCurVal();
    writeVarUint(encoder.restEncoder, client);
    const len = dsitems.length;
    writeVarUint(encoder.restEncoder, len);
    for (let i = 0; i < len; i++) {
      const item = dsitems[i];
      encoder.writeDsClock(item.clock);
      encoder.writeDsLen(item.len);
    }
  });
};
var generateNewClientId = uint32;
var Doc = class extends Observable {
  constructor({ guid = uuidv4(), collectionid = null, gc = true, gcFilter = () => true, meta = null, autoLoad = false, shouldLoad = true } = {}) {
    super();
    this.gc = gc;
    this.gcFilter = gcFilter;
    this.clientID = generateNewClientId();
    this.guid = guid;
    this.collectionid = collectionid;
    this.share = new Map();
    this.store = new StructStore();
    this._transaction = null;
    this._transactionCleanups = [];
    this.subdocs = new Set();
    this._item = null;
    this.shouldLoad = shouldLoad;
    this.autoLoad = autoLoad;
    this.meta = meta;
    this.isLoaded = false;
    this.whenLoaded = create3((resolve) => {
      this.on("load", () => {
        this.isLoaded = true;
        resolve(this);
      });
    });
  }
  load() {
    const item = this._item;
    if (item !== null && !this.shouldLoad) {
      transact(item.parent.doc, (transaction) => {
        transaction.subdocsLoaded.add(this);
      }, null, true);
    }
    this.shouldLoad = true;
  }
  getSubdocs() {
    return this.subdocs;
  }
  getSubdocGuids() {
    return new Set(Array.from(this.subdocs).map((doc2) => doc2.guid));
  }
  transact(f2, origin = null) {
    transact(this, f2, origin);
  }
  get(name, TypeConstructor = AbstractType) {
    const type = setIfUndefined(this.share, name, () => {
      const t = new TypeConstructor();
      t._integrate(this, null);
      return t;
    });
    const Constr = type.constructor;
    if (TypeConstructor !== AbstractType && Constr !== TypeConstructor) {
      if (Constr === AbstractType) {
        const t = new TypeConstructor();
        t._map = type._map;
        type._map.forEach((n) => {
          for (; n !== null; n = n.left) {
            n.parent = t;
          }
        });
        t._start = type._start;
        for (let n = t._start; n !== null; n = n.right) {
          n.parent = t;
        }
        t._length = type._length;
        this.share.set(name, t);
        t._integrate(this, null);
        return t;
      } else {
        throw new Error(`Type with the name ${name} has already been defined with a different constructor`);
      }
    }
    return type;
  }
  getArray(name = "") {
    return this.get(name, YArray);
  }
  getText(name = "") {
    return this.get(name, YText);
  }
  getMap(name = "") {
    return this.get(name, YMap);
  }
  getXmlFragment(name = "") {
    return this.get(name, YXmlFragment);
  }
  toJSON() {
    const doc2 = {};
    this.share.forEach((value, key) => {
      doc2[key] = value.toJSON();
    });
    return doc2;
  }
  destroy() {
    from(this.subdocs).forEach((subdoc) => subdoc.destroy());
    const item = this._item;
    if (item !== null) {
      this._item = null;
      const content = item.content;
      content.doc = new Doc({ guid: this.guid, ...content.opts, shouldLoad: false });
      content.doc._item = item;
      transact(item.parent.doc, (transaction) => {
        const doc2 = content.doc;
        if (!item.deleted) {
          transaction.subdocsAdded.add(doc2);
        }
        transaction.subdocsRemoved.add(this);
      }, null, true);
    }
    this.emit("destroyed", [true]);
    this.emit("destroy", [this]);
    super.destroy();
  }
  on(eventName, f2) {
    super.on(eventName, f2);
  }
  off(eventName, f2) {
    super.off(eventName, f2);
  }
};
var DSEncoderV1 = class {
  constructor() {
    this.restEncoder = createEncoder();
  }
  toUint8Array() {
    return toUint8Array(this.restEncoder);
  }
  resetDsCurVal() {
  }
  writeDsClock(clock) {
    writeVarUint(this.restEncoder, clock);
  }
  writeDsLen(len) {
    writeVarUint(this.restEncoder, len);
  }
};
var UpdateEncoderV1 = class extends DSEncoderV1 {
  writeLeftID(id) {
    writeVarUint(this.restEncoder, id.client);
    writeVarUint(this.restEncoder, id.clock);
  }
  writeRightID(id) {
    writeVarUint(this.restEncoder, id.client);
    writeVarUint(this.restEncoder, id.clock);
  }
  writeClient(client) {
    writeVarUint(this.restEncoder, client);
  }
  writeInfo(info) {
    writeUint8(this.restEncoder, info);
  }
  writeString(s) {
    writeVarString(this.restEncoder, s);
  }
  writeParentInfo(isYKey) {
    writeVarUint(this.restEncoder, isYKey ? 1 : 0);
  }
  writeTypeRef(info) {
    writeVarUint(this.restEncoder, info);
  }
  writeLen(len) {
    writeVarUint(this.restEncoder, len);
  }
  writeAny(any2) {
    writeAny(this.restEncoder, any2);
  }
  writeBuf(buf) {
    writeVarUint8Array(this.restEncoder, buf);
  }
  writeJSON(embed) {
    writeVarString(this.restEncoder, JSON.stringify(embed));
  }
  writeKey(key) {
    writeVarString(this.restEncoder, key);
  }
};
var DSEncoderV2 = class {
  constructor() {
    this.restEncoder = createEncoder();
    this.dsCurrVal = 0;
  }
  toUint8Array() {
    return toUint8Array(this.restEncoder);
  }
  resetDsCurVal() {
    this.dsCurrVal = 0;
  }
  writeDsClock(clock) {
    const diff = clock - this.dsCurrVal;
    this.dsCurrVal = clock;
    writeVarUint(this.restEncoder, diff);
  }
  writeDsLen(len) {
    if (len === 0) {
      unexpectedCase();
    }
    writeVarUint(this.restEncoder, len - 1);
    this.dsCurrVal += len;
  }
};
var UpdateEncoderV2 = class extends DSEncoderV2 {
  constructor() {
    super();
    this.keyMap = new Map();
    this.keyClock = 0;
    this.keyClockEncoder = new IntDiffOptRleEncoder();
    this.clientEncoder = new UintOptRleEncoder();
    this.leftClockEncoder = new IntDiffOptRleEncoder();
    this.rightClockEncoder = new IntDiffOptRleEncoder();
    this.infoEncoder = new RleEncoder(writeUint8);
    this.stringEncoder = new StringEncoder();
    this.parentInfoEncoder = new RleEncoder(writeUint8);
    this.typeRefEncoder = new UintOptRleEncoder();
    this.lenEncoder = new UintOptRleEncoder();
  }
  toUint8Array() {
    const encoder = createEncoder();
    writeVarUint(encoder, 0);
    writeVarUint8Array(encoder, this.keyClockEncoder.toUint8Array());
    writeVarUint8Array(encoder, this.clientEncoder.toUint8Array());
    writeVarUint8Array(encoder, this.leftClockEncoder.toUint8Array());
    writeVarUint8Array(encoder, this.rightClockEncoder.toUint8Array());
    writeVarUint8Array(encoder, toUint8Array(this.infoEncoder));
    writeVarUint8Array(encoder, this.stringEncoder.toUint8Array());
    writeVarUint8Array(encoder, toUint8Array(this.parentInfoEncoder));
    writeVarUint8Array(encoder, this.typeRefEncoder.toUint8Array());
    writeVarUint8Array(encoder, this.lenEncoder.toUint8Array());
    writeUint8Array(encoder, toUint8Array(this.restEncoder));
    return toUint8Array(encoder);
  }
  writeLeftID(id) {
    this.clientEncoder.write(id.client);
    this.leftClockEncoder.write(id.clock);
  }
  writeRightID(id) {
    this.clientEncoder.write(id.client);
    this.rightClockEncoder.write(id.clock);
  }
  writeClient(client) {
    this.clientEncoder.write(client);
  }
  writeInfo(info) {
    this.infoEncoder.write(info);
  }
  writeString(s) {
    this.stringEncoder.write(s);
  }
  writeParentInfo(isYKey) {
    this.parentInfoEncoder.write(isYKey ? 1 : 0);
  }
  writeTypeRef(info) {
    this.typeRefEncoder.write(info);
  }
  writeLen(len) {
    this.lenEncoder.write(len);
  }
  writeAny(any2) {
    writeAny(this.restEncoder, any2);
  }
  writeBuf(buf) {
    writeVarUint8Array(this.restEncoder, buf);
  }
  writeJSON(embed) {
    writeAny(this.restEncoder, embed);
  }
  writeKey(key) {
    const clock = this.keyMap.get(key);
    if (clock === void 0) {
      this.keyClockEncoder.write(this.keyClock++);
      this.stringEncoder.write(key);
    } else {
      this.keyClockEncoder.write(this.keyClock++);
    }
  }
};
var writeStructs = (encoder, structs, client, clock) => {
  clock = max(clock, structs[0].id.clock);
  const startNewStructs = findIndexSS(structs, clock);
  writeVarUint(encoder.restEncoder, structs.length - startNewStructs);
  encoder.writeClient(client);
  writeVarUint(encoder.restEncoder, clock);
  const firstStruct = structs[startNewStructs];
  firstStruct.write(encoder, clock - firstStruct.id.clock);
  for (let i = startNewStructs + 1; i < structs.length; i++) {
    structs[i].write(encoder, 0);
  }
};
var writeClientsStructs = (encoder, store, _sm) => {
  const sm = new Map();
  _sm.forEach((clock, client) => {
    if (getState(store, client) > clock) {
      sm.set(client, clock);
    }
  });
  getStateVector(store).forEach((clock, client) => {
    if (!_sm.has(client)) {
      sm.set(client, 0);
    }
  });
  writeVarUint(encoder.restEncoder, sm.size);
  Array.from(sm.entries()).sort((a, b) => b[0] - a[0]).forEach(([client, clock]) => {
    writeStructs(encoder, store.clients.get(client), client, clock);
  });
};
var writeStructsFromTransaction = (encoder, transaction) => writeClientsStructs(encoder, transaction.doc.store, transaction.beforeState);
var EventHandler = class {
  constructor() {
    this.l = [];
  }
};
var createEventHandler = () => new EventHandler();
var addEventHandlerListener = (eventHandler, f2) => eventHandler.l.push(f2);
var removeEventHandlerListener = (eventHandler, f2) => {
  const l = eventHandler.l;
  const len = l.length;
  eventHandler.l = l.filter((g) => f2 !== g);
  if (len === eventHandler.l.length) {
    console.error("[yjs] Tried to remove event handler that doesn't exist.");
  }
};
var callEventHandlerListeners = (eventHandler, arg0, arg1) => callAll(eventHandler.l, [arg0, arg1]);
var ID = class {
  constructor(client, clock) {
    this.client = client;
    this.clock = clock;
  }
};
var compareIDs = (a, b) => a === b || a !== null && b !== null && a.client === b.client && a.clock === b.clock;
var createID = (client, clock) => new ID(client, clock);
var findRootTypeKey = (type) => {
  for (const [key, value] of type.doc.share.entries()) {
    if (value === type) {
      return key;
    }
  }
  throw unexpectedCase();
};
var Snapshot = class {
  constructor(ds, sv) {
    this.ds = ds;
    this.sv = sv;
  }
};
var createSnapshot = (ds, sm) => new Snapshot(ds, sm);
var emptySnapshot = createSnapshot(createDeleteSet(), new Map());
var isVisible = (item, snapshot) => snapshot === void 0 ? !item.deleted : snapshot.sv.has(item.id.client) && (snapshot.sv.get(item.id.client) || 0) > item.id.clock && !isDeleted(snapshot.ds, item.id);
var splitSnapshotAffectedStructs = (transaction, snapshot) => {
  const meta = setIfUndefined(transaction.meta, splitSnapshotAffectedStructs, create2);
  const store = transaction.doc.store;
  if (!meta.has(snapshot)) {
    snapshot.sv.forEach((clock, client) => {
      if (clock < getState(store, client)) {
        getItemCleanStart(transaction, createID(client, clock));
      }
    });
    iterateDeletedStructs(transaction, snapshot.ds, (item) => {
    });
    meta.add(snapshot);
  }
};
var StructStore = class {
  constructor() {
    this.clients = new Map();
    this.pendingStructs = null;
    this.pendingDs = null;
  }
};
var getStateVector = (store) => {
  const sm = new Map();
  store.clients.forEach((structs, client) => {
    const struct = structs[structs.length - 1];
    sm.set(client, struct.id.clock + struct.length);
  });
  return sm;
};
var getState = (store, client) => {
  const structs = store.clients.get(client);
  if (structs === void 0) {
    return 0;
  }
  const lastStruct = structs[structs.length - 1];
  return lastStruct.id.clock + lastStruct.length;
};
var addStruct = (store, struct) => {
  let structs = store.clients.get(struct.id.client);
  if (structs === void 0) {
    structs = [];
    store.clients.set(struct.id.client, structs);
  } else {
    const lastStruct = structs[structs.length - 1];
    if (lastStruct.id.clock + lastStruct.length !== struct.id.clock) {
      throw unexpectedCase();
    }
  }
  structs.push(struct);
};
var findIndexSS = (structs, clock) => {
  let left = 0;
  let right = structs.length - 1;
  let mid = structs[right];
  let midclock = mid.id.clock;
  if (midclock === clock) {
    return right;
  }
  let midindex = floor(clock / (midclock + mid.length - 1) * right);
  while (left <= right) {
    mid = structs[midindex];
    midclock = mid.id.clock;
    if (midclock <= clock) {
      if (clock < midclock + mid.length) {
        return midindex;
      }
      left = midindex + 1;
    } else {
      right = midindex - 1;
    }
    midindex = floor((left + right) / 2);
  }
  throw unexpectedCase();
};
var find = (store, id) => {
  const structs = store.clients.get(id.client);
  return structs[findIndexSS(structs, id.clock)];
};
var getItem = find;
var findIndexCleanStart = (transaction, structs, clock) => {
  const index = findIndexSS(structs, clock);
  const struct = structs[index];
  if (struct.id.clock < clock && struct instanceof Item) {
    structs.splice(index + 1, 0, splitItem(transaction, struct, clock - struct.id.clock));
    return index + 1;
  }
  return index;
};
var getItemCleanStart = (transaction, id) => {
  const structs = transaction.doc.store.clients.get(id.client);
  return structs[findIndexCleanStart(transaction, structs, id.clock)];
};
var getItemCleanEnd = (transaction, store, id) => {
  const structs = store.clients.get(id.client);
  const index = findIndexSS(structs, id.clock);
  const struct = structs[index];
  if (id.clock !== struct.id.clock + struct.length - 1 && struct.constructor !== GC) {
    structs.splice(index + 1, 0, splitItem(transaction, struct, id.clock - struct.id.clock + 1));
  }
  return struct;
};
var replaceStruct = (store, struct, newStruct) => {
  const structs = store.clients.get(struct.id.client);
  structs[findIndexSS(structs, struct.id.clock)] = newStruct;
};
var iterateStructs = (transaction, structs, clockStart, len, f2) => {
  if (len === 0) {
    return;
  }
  const clockEnd = clockStart + len;
  let index = findIndexCleanStart(transaction, structs, clockStart);
  let struct;
  do {
    struct = structs[index++];
    if (clockEnd < struct.id.clock + struct.length) {
      findIndexCleanStart(transaction, structs, clockEnd);
    }
    f2(struct);
  } while (index < structs.length && structs[index].id.clock < clockEnd);
};
var Transaction = class {
  constructor(doc2, origin, local) {
    this.doc = doc2;
    this.deleteSet = new DeleteSet();
    this.beforeState = getStateVector(doc2.store);
    this.afterState = new Map();
    this.changed = new Map();
    this.changedParentTypes = new Map();
    this._mergeStructs = [];
    this.origin = origin;
    this.meta = new Map();
    this.local = local;
    this.subdocsAdded = new Set();
    this.subdocsRemoved = new Set();
    this.subdocsLoaded = new Set();
  }
};
var writeUpdateMessageFromTransaction = (encoder, transaction) => {
  if (transaction.deleteSet.clients.size === 0 && !any(transaction.afterState, (clock, client) => transaction.beforeState.get(client) !== clock)) {
    return false;
  }
  sortAndMergeDeleteSet(transaction.deleteSet);
  writeStructsFromTransaction(encoder, transaction);
  writeDeleteSet(encoder, transaction.deleteSet);
  return true;
};
var addChangedTypeToTransaction = (transaction, type, parentSub) => {
  const item = type._item;
  if (item === null || item.id.clock < (transaction.beforeState.get(item.id.client) || 0) && !item.deleted) {
    setIfUndefined(transaction.changed, type, create2).add(parentSub);
  }
};
var tryToMergeWithLeft = (structs, pos) => {
  const left = structs[pos - 1];
  const right = structs[pos];
  if (left.deleted === right.deleted && left.constructor === right.constructor) {
    if (left.mergeWith(right)) {
      structs.splice(pos, 1);
      if (right instanceof Item && right.parentSub !== null && right.parent._map.get(right.parentSub) === right) {
        right.parent._map.set(right.parentSub, left);
      }
    }
  }
};
var tryGcDeleteSet = (ds, store, gcFilter) => {
  for (const [client, deleteItems] of ds.clients.entries()) {
    const structs = store.clients.get(client);
    for (let di = deleteItems.length - 1; di >= 0; di--) {
      const deleteItem = deleteItems[di];
      const endDeleteItemClock = deleteItem.clock + deleteItem.len;
      for (let si = findIndexSS(structs, deleteItem.clock), struct = structs[si]; si < structs.length && struct.id.clock < endDeleteItemClock; struct = structs[++si]) {
        const struct2 = structs[si];
        if (deleteItem.clock + deleteItem.len <= struct2.id.clock) {
          break;
        }
        if (struct2 instanceof Item && struct2.deleted && !struct2.keep && gcFilter(struct2)) {
          struct2.gc(store, false);
        }
      }
    }
  }
};
var tryMergeDeleteSet = (ds, store) => {
  ds.clients.forEach((deleteItems, client) => {
    const structs = store.clients.get(client);
    for (let di = deleteItems.length - 1; di >= 0; di--) {
      const deleteItem = deleteItems[di];
      const mostRightIndexToCheck = min(structs.length - 1, 1 + findIndexSS(structs, deleteItem.clock + deleteItem.len - 1));
      for (let si = mostRightIndexToCheck, struct = structs[si]; si > 0 && struct.id.clock >= deleteItem.clock; struct = structs[--si]) {
        tryToMergeWithLeft(structs, si);
      }
    }
  });
};
var cleanupTransactions = (transactionCleanups, i) => {
  if (i < transactionCleanups.length) {
    const transaction = transactionCleanups[i];
    const doc2 = transaction.doc;
    const store = doc2.store;
    const ds = transaction.deleteSet;
    const mergeStructs = transaction._mergeStructs;
    try {
      sortAndMergeDeleteSet(ds);
      transaction.afterState = getStateVector(transaction.doc.store);
      doc2._transaction = null;
      doc2.emit("beforeObserverCalls", [transaction, doc2]);
      const fs = [];
      transaction.changed.forEach((subs, itemtype) => fs.push(() => {
        if (itemtype._item === null || !itemtype._item.deleted) {
          itemtype._callObserver(transaction, subs);
        }
      }));
      fs.push(() => {
        transaction.changedParentTypes.forEach((events, type) => fs.push(() => {
          if (type._item === null || !type._item.deleted) {
            events = events.filter((event) => event.target._item === null || !event.target._item.deleted);
            events.forEach((event) => {
              event.currentTarget = type;
            });
            events.sort((event1, event2) => event1.path.length - event2.path.length);
            callEventHandlerListeners(type._dEH, events, transaction);
          }
        }));
        fs.push(() => doc2.emit("afterTransaction", [transaction, doc2]));
      });
      callAll(fs, []);
    } finally {
      if (doc2.gc) {
        tryGcDeleteSet(ds, store, doc2.gcFilter);
      }
      tryMergeDeleteSet(ds, store);
      transaction.afterState.forEach((clock, client) => {
        const beforeClock = transaction.beforeState.get(client) || 0;
        if (beforeClock !== clock) {
          const structs = store.clients.get(client);
          const firstChangePos = max(findIndexSS(structs, beforeClock), 1);
          for (let i2 = structs.length - 1; i2 >= firstChangePos; i2--) {
            tryToMergeWithLeft(structs, i2);
          }
        }
      });
      for (let i2 = 0; i2 < mergeStructs.length; i2++) {
        const { client, clock } = mergeStructs[i2].id;
        const structs = store.clients.get(client);
        const replacedStructPos = findIndexSS(structs, clock);
        if (replacedStructPos + 1 < structs.length) {
          tryToMergeWithLeft(structs, replacedStructPos + 1);
        }
        if (replacedStructPos > 0) {
          tryToMergeWithLeft(structs, replacedStructPos);
        }
      }
      if (!transaction.local && transaction.afterState.get(doc2.clientID) !== transaction.beforeState.get(doc2.clientID)) {
        print(ORANGE, BOLD, "[yjs] ", UNBOLD, RED, "Changed the client-id because another client seems to be using it.");
        doc2.clientID = generateNewClientId();
      }
      doc2.emit("afterTransactionCleanup", [transaction, doc2]);
      if (doc2._observers.has("update")) {
        const encoder = new UpdateEncoderV1();
        const hasContent = writeUpdateMessageFromTransaction(encoder, transaction);
        if (hasContent) {
          doc2.emit("update", [encoder.toUint8Array(), transaction.origin, doc2, transaction]);
        }
      }
      if (doc2._observers.has("updateV2")) {
        const encoder = new UpdateEncoderV2();
        const hasContent = writeUpdateMessageFromTransaction(encoder, transaction);
        if (hasContent) {
          doc2.emit("updateV2", [encoder.toUint8Array(), transaction.origin, doc2, transaction]);
        }
      }
      const { subdocsAdded, subdocsLoaded, subdocsRemoved } = transaction;
      if (subdocsAdded.size > 0 || subdocsRemoved.size > 0 || subdocsLoaded.size > 0) {
        subdocsAdded.forEach((subdoc) => {
          subdoc.clientID = doc2.clientID;
          if (subdoc.collectionid == null) {
            subdoc.collectionid = doc2.collectionid;
          }
          doc2.subdocs.add(subdoc);
        });
        subdocsRemoved.forEach((subdoc) => doc2.subdocs.delete(subdoc));
        doc2.emit("subdocs", [{ loaded: subdocsLoaded, added: subdocsAdded, removed: subdocsRemoved }, doc2, transaction]);
        subdocsRemoved.forEach((subdoc) => subdoc.destroy());
      }
      if (transactionCleanups.length <= i + 1) {
        doc2._transactionCleanups = [];
        doc2.emit("afterAllTransactions", [doc2, transactionCleanups]);
      } else {
        cleanupTransactions(transactionCleanups, i + 1);
      }
    }
  }
};
var transact = (doc2, f2, origin = null, local = true) => {
  const transactionCleanups = doc2._transactionCleanups;
  let initialCall = false;
  if (doc2._transaction === null) {
    initialCall = true;
    doc2._transaction = new Transaction(doc2, origin, local);
    transactionCleanups.push(doc2._transaction);
    if (transactionCleanups.length === 1) {
      doc2.emit("beforeAllTransactions", [doc2]);
    }
    doc2.emit("beforeTransaction", [doc2._transaction, doc2]);
  }
  try {
    f2(doc2._transaction);
  } finally {
    if (initialCall && transactionCleanups[0] === doc2._transaction) {
      cleanupTransactions(transactionCleanups, 0);
    }
  }
};
var YEvent = class {
  constructor(target, transaction) {
    this.target = target;
    this.currentTarget = target;
    this.transaction = transaction;
    this._changes = null;
    this._keys = null;
    this._delta = null;
  }
  get path() {
    return getPathTo(this.currentTarget, this.target);
  }
  deletes(struct) {
    return isDeleted(this.transaction.deleteSet, struct.id);
  }
  get keys() {
    if (this._keys === null) {
      const keys2 = new Map();
      const target = this.target;
      const changed = this.transaction.changed.get(target);
      changed.forEach((key) => {
        if (key !== null) {
          const item = target._map.get(key);
          let action;
          let oldValue;
          if (this.adds(item)) {
            let prev = item.left;
            while (prev !== null && this.adds(prev)) {
              prev = prev.left;
            }
            if (this.deletes(item)) {
              if (prev !== null && this.deletes(prev)) {
                action = "delete";
                oldValue = last(prev.content.getContent());
              } else {
                return;
              }
            } else {
              if (prev !== null && this.deletes(prev)) {
                action = "update";
                oldValue = last(prev.content.getContent());
              } else {
                action = "add";
                oldValue = void 0;
              }
            }
          } else {
            if (this.deletes(item)) {
              action = "delete";
              oldValue = last(item.content.getContent());
            } else {
              return;
            }
          }
          keys2.set(key, { action, oldValue });
        }
      });
      this._keys = keys2;
    }
    return this._keys;
  }
  get delta() {
    return this.changes.delta;
  }
  adds(struct) {
    return struct.id.clock >= (this.transaction.beforeState.get(struct.id.client) || 0);
  }
  get changes() {
    let changes = this._changes;
    if (changes === null) {
      const target = this.target;
      const added = create2();
      const deleted = create2();
      const delta = [];
      changes = {
        added,
        deleted,
        delta,
        keys: this.keys
      };
      const changed = this.transaction.changed.get(target);
      if (changed.has(null)) {
        let lastOp = null;
        const packOp = () => {
          if (lastOp) {
            delta.push(lastOp);
          }
        };
        for (let item = target._start; item !== null; item = item.right) {
          if (item.deleted) {
            if (this.deletes(item) && !this.adds(item)) {
              if (lastOp === null || lastOp.delete === void 0) {
                packOp();
                lastOp = { delete: 0 };
              }
              lastOp.delete += item.length;
              deleted.add(item);
            }
          } else {
            if (this.adds(item)) {
              if (lastOp === null || lastOp.insert === void 0) {
                packOp();
                lastOp = { insert: [] };
              }
              lastOp.insert = lastOp.insert.concat(item.content.getContent());
              added.add(item);
            } else {
              if (lastOp === null || lastOp.retain === void 0) {
                packOp();
                lastOp = { retain: 0 };
              }
              lastOp.retain += item.length;
            }
          }
        }
        if (lastOp !== null && lastOp.retain === void 0) {
          packOp();
        }
      }
      this._changes = changes;
    }
    return changes;
  }
};
var getPathTo = (parent, child) => {
  const path = [];
  while (child._item !== null && child !== parent) {
    if (child._item.parentSub !== null) {
      path.unshift(child._item.parentSub);
    } else {
      let i = 0;
      let c = child._item.parent._start;
      while (c !== child._item && c !== null) {
        if (!c.deleted) {
          i++;
        }
        c = c.right;
      }
      path.unshift(i);
    }
    child = child._item.parent;
  }
  return path;
};
var maxSearchMarker = 80;
var globalSearchMarkerTimestamp = 0;
var ArraySearchMarker = class {
  constructor(p, index) {
    p.marker = true;
    this.p = p;
    this.index = index;
    this.timestamp = globalSearchMarkerTimestamp++;
  }
};
var refreshMarkerTimestamp = (marker) => {
  marker.timestamp = globalSearchMarkerTimestamp++;
};
var overwriteMarker = (marker, p, index) => {
  marker.p.marker = false;
  marker.p = p;
  p.marker = true;
  marker.index = index;
  marker.timestamp = globalSearchMarkerTimestamp++;
};
var markPosition = (searchMarker, p, index) => {
  if (searchMarker.length >= maxSearchMarker) {
    const marker = searchMarker.reduce((a, b) => a.timestamp < b.timestamp ? a : b);
    overwriteMarker(marker, p, index);
    return marker;
  } else {
    const pm = new ArraySearchMarker(p, index);
    searchMarker.push(pm);
    return pm;
  }
};
var findMarker = (yarray, index) => {
  if (yarray._start === null || index === 0 || yarray._searchMarker === null) {
    return null;
  }
  const marker = yarray._searchMarker.length === 0 ? null : yarray._searchMarker.reduce((a, b) => abs(index - a.index) < abs(index - b.index) ? a : b);
  let p = yarray._start;
  let pindex = 0;
  if (marker !== null) {
    p = marker.p;
    pindex = marker.index;
    refreshMarkerTimestamp(marker);
  }
  while (p.right !== null && pindex < index) {
    if (!p.deleted && p.countable) {
      if (index < pindex + p.length) {
        break;
      }
      pindex += p.length;
    }
    p = p.right;
  }
  while (p.left !== null && pindex > index) {
    p = p.left;
    if (!p.deleted && p.countable) {
      pindex -= p.length;
    }
  }
  while (p.left !== null && p.left.id.client === p.id.client && p.left.id.clock + p.left.length === p.id.clock) {
    p = p.left;
    if (!p.deleted && p.countable) {
      pindex -= p.length;
    }
  }
  if (marker !== null && abs(marker.index - pindex) < p.parent.length / maxSearchMarker) {
    overwriteMarker(marker, p, pindex);
    return marker;
  } else {
    return markPosition(yarray._searchMarker, p, pindex);
  }
};
var updateMarkerChanges = (searchMarker, index, len) => {
  for (let i = searchMarker.length - 1; i >= 0; i--) {
    const m = searchMarker[i];
    if (len > 0) {
      let p = m.p;
      p.marker = false;
      while (p && (p.deleted || !p.countable)) {
        p = p.left;
        if (p && !p.deleted && p.countable) {
          m.index -= p.length;
        }
      }
      if (p === null || p.marker === true) {
        searchMarker.splice(i, 1);
        continue;
      }
      m.p = p;
      p.marker = true;
    }
    if (index < m.index || len > 0 && index === m.index) {
      m.index = max(index, m.index + len);
    }
  }
};
var callTypeObservers = (type, transaction, event) => {
  const changedType = type;
  const changedParentTypes = transaction.changedParentTypes;
  while (true) {
    setIfUndefined(changedParentTypes, type, () => []).push(event);
    if (type._item === null) {
      break;
    }
    type = type._item.parent;
  }
  callEventHandlerListeners(changedType._eH, event, transaction);
};
var AbstractType = class {
  constructor() {
    this._item = null;
    this._map = new Map();
    this._start = null;
    this.doc = null;
    this._length = 0;
    this._eH = createEventHandler();
    this._dEH = createEventHandler();
    this._searchMarker = null;
  }
  get parent() {
    return this._item ? this._item.parent : null;
  }
  _integrate(y, item) {
    this.doc = y;
    this._item = item;
  }
  _copy() {
    throw methodUnimplemented();
  }
  clone() {
    throw methodUnimplemented();
  }
  _write(encoder) {
  }
  get _first() {
    let n = this._start;
    while (n !== null && n.deleted) {
      n = n.right;
    }
    return n;
  }
  _callObserver(transaction, parentSubs) {
    if (!transaction.local && this._searchMarker) {
      this._searchMarker.length = 0;
    }
  }
  observe(f2) {
    addEventHandlerListener(this._eH, f2);
  }
  observeDeep(f2) {
    addEventHandlerListener(this._dEH, f2);
  }
  unobserve(f2) {
    removeEventHandlerListener(this._eH, f2);
  }
  unobserveDeep(f2) {
    removeEventHandlerListener(this._dEH, f2);
  }
  toJSON() {
  }
};
var typeListSlice = (type, start, end) => {
  if (start < 0) {
    start = type._length + start;
  }
  if (end < 0) {
    end = type._length + end;
  }
  let len = end - start;
  const cs = [];
  let n = type._start;
  while (n !== null && len > 0) {
    if (n.countable && !n.deleted) {
      const c = n.content.getContent();
      if (c.length <= start) {
        start -= c.length;
      } else {
        for (let i = start; i < c.length && len > 0; i++) {
          cs.push(c[i]);
          len--;
        }
        start = 0;
      }
    }
    n = n.right;
  }
  return cs;
};
var typeListToArray = (type) => {
  const cs = [];
  let n = type._start;
  while (n !== null) {
    if (n.countable && !n.deleted) {
      const c = n.content.getContent();
      for (let i = 0; i < c.length; i++) {
        cs.push(c[i]);
      }
    }
    n = n.right;
  }
  return cs;
};
var typeListForEach = (type, f2) => {
  let index = 0;
  let n = type._start;
  while (n !== null) {
    if (n.countable && !n.deleted) {
      const c = n.content.getContent();
      for (let i = 0; i < c.length; i++) {
        f2(c[i], index++, type);
      }
    }
    n = n.right;
  }
};
var typeListMap = (type, f2) => {
  const result = [];
  typeListForEach(type, (c, i) => {
    result.push(f2(c, i, type));
  });
  return result;
};
var typeListCreateIterator = (type) => {
  let n = type._start;
  let currentContent = null;
  let currentContentIndex = 0;
  return {
    [Symbol.iterator]() {
      return this;
    },
    next: () => {
      if (currentContent === null) {
        while (n !== null && n.deleted) {
          n = n.right;
        }
        if (n === null) {
          return {
            done: true,
            value: void 0
          };
        }
        currentContent = n.content.getContent();
        currentContentIndex = 0;
        n = n.right;
      }
      const value = currentContent[currentContentIndex++];
      if (currentContent.length <= currentContentIndex) {
        currentContent = null;
      }
      return {
        done: false,
        value
      };
    }
  };
};
var typeListGet = (type, index) => {
  const marker = findMarker(type, index);
  let n = type._start;
  if (marker !== null) {
    n = marker.p;
    index -= marker.index;
  }
  for (; n !== null; n = n.right) {
    if (!n.deleted && n.countable) {
      if (index < n.length) {
        return n.content.getContent()[index];
      }
      index -= n.length;
    }
  }
};
var typeListInsertGenericsAfter = (transaction, parent, referenceItem, content) => {
  let left = referenceItem;
  const doc2 = transaction.doc;
  const ownClientId = doc2.clientID;
  const store = doc2.store;
  const right = referenceItem === null ? parent._start : referenceItem.right;
  let jsonContent = [];
  const packJsonContent = () => {
    if (jsonContent.length > 0) {
      left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentAny(jsonContent));
      left.integrate(transaction, 0);
      jsonContent = [];
    }
  };
  content.forEach((c) => {
    if (c === null) {
      jsonContent.push(c);
    } else {
      switch (c.constructor) {
        case Number:
        case Object:
        case Boolean:
        case Array:
        case String:
          jsonContent.push(c);
          break;
        default:
          packJsonContent();
          switch (c.constructor) {
            case Uint8Array:
            case ArrayBuffer:
              left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentBinary(new Uint8Array(c)));
              left.integrate(transaction, 0);
              break;
            case Doc:
              left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentDoc(c));
              left.integrate(transaction, 0);
              break;
            default:
              if (c instanceof AbstractType) {
                left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentType(c));
                left.integrate(transaction, 0);
              } else {
                throw new Error("Unexpected content type in insert operation");
              }
          }
      }
    }
  });
  packJsonContent();
};
var lengthExceeded = create4("Length exceeded!");
var typeListInsertGenerics = (transaction, parent, index, content) => {
  if (index > parent._length) {
    throw lengthExceeded;
  }
  if (index === 0) {
    if (parent._searchMarker) {
      updateMarkerChanges(parent._searchMarker, index, content.length);
    }
    return typeListInsertGenericsAfter(transaction, parent, null, content);
  }
  const startIndex = index;
  const marker = findMarker(parent, index);
  let n = parent._start;
  if (marker !== null) {
    n = marker.p;
    index -= marker.index;
    if (index === 0) {
      n = n.prev;
      index += n && n.countable && !n.deleted ? n.length : 0;
    }
  }
  for (; n !== null; n = n.right) {
    if (!n.deleted && n.countable) {
      if (index <= n.length) {
        if (index < n.length) {
          getItemCleanStart(transaction, createID(n.id.client, n.id.clock + index));
        }
        break;
      }
      index -= n.length;
    }
  }
  if (parent._searchMarker) {
    updateMarkerChanges(parent._searchMarker, startIndex, content.length);
  }
  return typeListInsertGenericsAfter(transaction, parent, n, content);
};
var typeListPushGenerics = (transaction, parent, content) => {
  const marker = (parent._searchMarker || []).reduce((maxMarker, currMarker) => currMarker.index > maxMarker.index ? currMarker : maxMarker, { index: 0, p: parent._start });
  let n = marker.p;
  if (n) {
    while (n.right) {
      n = n.right;
    }
  }
  return typeListInsertGenericsAfter(transaction, parent, n, content);
};
var typeListDelete = (transaction, parent, index, length3) => {
  if (length3 === 0) {
    return;
  }
  const startIndex = index;
  const startLength = length3;
  const marker = findMarker(parent, index);
  let n = parent._start;
  if (marker !== null) {
    n = marker.p;
    index -= marker.index;
  }
  for (; n !== null && index > 0; n = n.right) {
    if (!n.deleted && n.countable) {
      if (index < n.length) {
        getItemCleanStart(transaction, createID(n.id.client, n.id.clock + index));
      }
      index -= n.length;
    }
  }
  while (length3 > 0 && n !== null) {
    if (!n.deleted) {
      if (length3 < n.length) {
        getItemCleanStart(transaction, createID(n.id.client, n.id.clock + length3));
      }
      n.delete(transaction);
      length3 -= n.length;
    }
    n = n.right;
  }
  if (length3 > 0) {
    throw lengthExceeded;
  }
  if (parent._searchMarker) {
    updateMarkerChanges(parent._searchMarker, startIndex, -startLength + length3);
  }
};
var typeMapDelete = (transaction, parent, key) => {
  const c = parent._map.get(key);
  if (c !== void 0) {
    c.delete(transaction);
  }
};
var typeMapSet = (transaction, parent, key, value) => {
  const left = parent._map.get(key) || null;
  const doc2 = transaction.doc;
  const ownClientId = doc2.clientID;
  let content;
  if (value == null) {
    content = new ContentAny([value]);
  } else {
    switch (value.constructor) {
      case Number:
      case Object:
      case Boolean:
      case Array:
      case String:
        content = new ContentAny([value]);
        break;
      case Uint8Array:
        content = new ContentBinary(value);
        break;
      case Doc:
        content = new ContentDoc(value);
        break;
      default:
        if (value instanceof AbstractType) {
          content = new ContentType(value);
        } else {
          throw new Error("Unexpected content type");
        }
    }
  }
  new Item(createID(ownClientId, getState(doc2.store, ownClientId)), left, left && left.lastId, null, null, parent, key, content).integrate(transaction, 0);
};
var typeMapGet = (parent, key) => {
  const val = parent._map.get(key);
  return val !== void 0 && !val.deleted ? val.content.getContent()[val.length - 1] : void 0;
};
var typeMapGetAll = (parent) => {
  const res = {};
  parent._map.forEach((value, key) => {
    if (!value.deleted) {
      res[key] = value.content.getContent()[value.length - 1];
    }
  });
  return res;
};
var typeMapHas = (parent, key) => {
  const val = parent._map.get(key);
  return val !== void 0 && !val.deleted;
};
var createMapIterator = (map7) => iteratorFilter(map7.entries(), (entry) => !entry[1].deleted);
var YArrayEvent = class extends YEvent {
  constructor(yarray, transaction) {
    super(yarray, transaction);
    this._transaction = transaction;
  }
};
var YArray = class extends AbstractType {
  constructor() {
    super();
    this._prelimContent = [];
    this._searchMarker = [];
  }
  static from(items) {
    const a = new YArray();
    a.push(items);
    return a;
  }
  _integrate(y, item) {
    super._integrate(y, item);
    this.insert(0, this._prelimContent);
    this._prelimContent = null;
  }
  _copy() {
    return new YArray();
  }
  clone() {
    const arr = new YArray();
    arr.insert(0, this.toArray().map((el) => el instanceof AbstractType ? el.clone() : el));
    return arr;
  }
  get length() {
    return this._prelimContent === null ? this._length : this._prelimContent.length;
  }
  _callObserver(transaction, parentSubs) {
    super._callObserver(transaction, parentSubs);
    callTypeObservers(this, transaction, new YArrayEvent(this, transaction));
  }
  insert(index, content) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeListInsertGenerics(transaction, this, index, content);
      });
    } else {
      this._prelimContent.splice(index, 0, ...content);
    }
  }
  push(content) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeListPushGenerics(transaction, this, content);
      });
    } else {
      this._prelimContent.push(...content);
    }
  }
  unshift(content) {
    this.insert(0, content);
  }
  delete(index, length3 = 1) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeListDelete(transaction, this, index, length3);
      });
    } else {
      this._prelimContent.splice(index, length3);
    }
  }
  get(index) {
    return typeListGet(this, index);
  }
  toArray() {
    return typeListToArray(this);
  }
  slice(start = 0, end = this.length) {
    return typeListSlice(this, start, end);
  }
  toJSON() {
    return this.map((c) => c instanceof AbstractType ? c.toJSON() : c);
  }
  map(f2) {
    return typeListMap(this, f2);
  }
  forEach(f2) {
    typeListForEach(this, f2);
  }
  [Symbol.iterator]() {
    return typeListCreateIterator(this);
  }
  _write(encoder) {
    encoder.writeTypeRef(YArrayRefID);
  }
};
var YMapEvent = class extends YEvent {
  constructor(ymap, transaction, subs) {
    super(ymap, transaction);
    this.keysChanged = subs;
  }
};
var YMap = class extends AbstractType {
  constructor(entries) {
    super();
    this._prelimContent = null;
    if (entries === void 0) {
      this._prelimContent = new Map();
    } else {
      this._prelimContent = new Map(entries);
    }
  }
  _integrate(y, item) {
    super._integrate(y, item);
    this._prelimContent.forEach((value, key) => {
      this.set(key, value);
    });
    this._prelimContent = null;
  }
  _copy() {
    return new YMap();
  }
  clone() {
    const map7 = new YMap();
    this.forEach((value, key) => {
      map7.set(key, value instanceof AbstractType ? value.clone() : value);
    });
    return map7;
  }
  _callObserver(transaction, parentSubs) {
    callTypeObservers(this, transaction, new YMapEvent(this, transaction, parentSubs));
  }
  toJSON() {
    const map7 = {};
    this._map.forEach((item, key) => {
      if (!item.deleted) {
        const v = item.content.getContent()[item.length - 1];
        map7[key] = v instanceof AbstractType ? v.toJSON() : v;
      }
    });
    return map7;
  }
  get size() {
    return [...createMapIterator(this._map)].length;
  }
  keys() {
    return iteratorMap(createMapIterator(this._map), (v) => v[0]);
  }
  values() {
    return iteratorMap(createMapIterator(this._map), (v) => v[1].content.getContent()[v[1].length - 1]);
  }
  entries() {
    return iteratorMap(createMapIterator(this._map), (v) => [v[0], v[1].content.getContent()[v[1].length - 1]]);
  }
  forEach(f2) {
    const map7 = {};
    this._map.forEach((item, key) => {
      if (!item.deleted) {
        f2(item.content.getContent()[item.length - 1], key, this);
      }
    });
    return map7;
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  delete(key) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeMapDelete(transaction, this, key);
      });
    } else {
      this._prelimContent.delete(key);
    }
  }
  set(key, value) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeMapSet(transaction, this, key, value);
      });
    } else {
      this._prelimContent.set(key, value);
    }
    return value;
  }
  get(key) {
    return typeMapGet(this, key);
  }
  has(key) {
    return typeMapHas(this, key);
  }
  clear() {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        this.forEach(function(value, key, map7) {
          typeMapDelete(transaction, map7, key);
        });
      });
    } else {
      this._prelimContent.clear();
    }
  }
  _write(encoder) {
    encoder.writeTypeRef(YMapRefID);
  }
};
var equalAttrs = (a, b) => a === b || typeof a === "object" && typeof b === "object" && a && b && equalFlat(a, b);
var ItemTextListPosition = class {
  constructor(left, right, index, currentAttributes) {
    this.left = left;
    this.right = right;
    this.index = index;
    this.currentAttributes = currentAttributes;
  }
  forward() {
    if (this.right === null) {
      unexpectedCase();
    }
    switch (this.right.content.constructor) {
      case ContentFormat:
        if (!this.right.deleted) {
          updateCurrentAttributes(this.currentAttributes, this.right.content);
        }
        break;
      default:
        if (!this.right.deleted) {
          this.index += this.right.length;
        }
        break;
    }
    this.left = this.right;
    this.right = this.right.right;
  }
};
var findNextPosition = (transaction, pos, count) => {
  while (pos.right !== null && count > 0) {
    switch (pos.right.content.constructor) {
      case ContentFormat:
        if (!pos.right.deleted) {
          updateCurrentAttributes(pos.currentAttributes, pos.right.content);
        }
        break;
      default:
        if (!pos.right.deleted) {
          if (count < pos.right.length) {
            getItemCleanStart(transaction, createID(pos.right.id.client, pos.right.id.clock + count));
          }
          pos.index += pos.right.length;
          count -= pos.right.length;
        }
        break;
    }
    pos.left = pos.right;
    pos.right = pos.right.right;
  }
  return pos;
};
var findPosition = (transaction, parent, index) => {
  const currentAttributes = new Map();
  const marker = findMarker(parent, index);
  if (marker) {
    const pos = new ItemTextListPosition(marker.p.left, marker.p, marker.index, currentAttributes);
    return findNextPosition(transaction, pos, index - marker.index);
  } else {
    const pos = new ItemTextListPosition(null, parent._start, 0, currentAttributes);
    return findNextPosition(transaction, pos, index);
  }
};
var insertNegatedAttributes = (transaction, parent, currPos, negatedAttributes) => {
  while (currPos.right !== null && (currPos.right.deleted === true || currPos.right.content.constructor === ContentFormat && equalAttrs(negatedAttributes.get(currPos.right.content.key), currPos.right.content.value))) {
    if (!currPos.right.deleted) {
      negatedAttributes.delete(currPos.right.content.key);
    }
    currPos.forward();
  }
  const doc2 = transaction.doc;
  const ownClientId = doc2.clientID;
  negatedAttributes.forEach((val, key) => {
    const left = currPos.left;
    const right = currPos.right;
    const nextFormat = new Item(createID(ownClientId, getState(doc2.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentFormat(key, val));
    nextFormat.integrate(transaction, 0);
    currPos.right = nextFormat;
    currPos.forward();
  });
};
var updateCurrentAttributes = (currentAttributes, format) => {
  const { key, value } = format;
  if (value === null) {
    currentAttributes.delete(key);
  } else {
    currentAttributes.set(key, value);
  }
};
var minimizeAttributeChanges = (currPos, attributes) => {
  while (true) {
    if (currPos.right === null) {
      break;
    } else if (currPos.right.deleted || currPos.right.content.constructor === ContentFormat && equalAttrs(attributes[currPos.right.content.key] || null, currPos.right.content.value))
      ;
    else {
      break;
    }
    currPos.forward();
  }
};
var insertAttributes = (transaction, parent, currPos, attributes) => {
  const doc2 = transaction.doc;
  const ownClientId = doc2.clientID;
  const negatedAttributes = new Map();
  for (const key in attributes) {
    const val = attributes[key];
    const currentVal = currPos.currentAttributes.get(key) || null;
    if (!equalAttrs(currentVal, val)) {
      negatedAttributes.set(key, currentVal);
      const { left, right } = currPos;
      currPos.right = new Item(createID(ownClientId, getState(doc2.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentFormat(key, val));
      currPos.right.integrate(transaction, 0);
      currPos.forward();
    }
  }
  return negatedAttributes;
};
var insertText = (transaction, parent, currPos, text2, attributes) => {
  currPos.currentAttributes.forEach((val, key) => {
    if (attributes[key] === void 0) {
      attributes[key] = null;
    }
  });
  const doc2 = transaction.doc;
  const ownClientId = doc2.clientID;
  minimizeAttributeChanges(currPos, attributes);
  const negatedAttributes = insertAttributes(transaction, parent, currPos, attributes);
  const content = text2.constructor === String ? new ContentString(text2) : text2 instanceof AbstractType ? new ContentType(text2) : new ContentEmbed(text2);
  let { left, right, index } = currPos;
  if (parent._searchMarker) {
    updateMarkerChanges(parent._searchMarker, currPos.index, content.getLength());
  }
  right = new Item(createID(ownClientId, getState(doc2.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, content);
  right.integrate(transaction, 0);
  currPos.right = right;
  currPos.index = index;
  currPos.forward();
  insertNegatedAttributes(transaction, parent, currPos, negatedAttributes);
};
var formatText = (transaction, parent, currPos, length3, attributes) => {
  const doc2 = transaction.doc;
  const ownClientId = doc2.clientID;
  minimizeAttributeChanges(currPos, attributes);
  const negatedAttributes = insertAttributes(transaction, parent, currPos, attributes);
  while (length3 > 0 && currPos.right !== null) {
    if (!currPos.right.deleted) {
      switch (currPos.right.content.constructor) {
        case ContentFormat: {
          const { key, value } = currPos.right.content;
          const attr = attributes[key];
          if (attr !== void 0) {
            if (equalAttrs(attr, value)) {
              negatedAttributes.delete(key);
            } else {
              negatedAttributes.set(key, value);
            }
            currPos.right.delete(transaction);
          }
          break;
        }
        default:
          if (length3 < currPos.right.length) {
            getItemCleanStart(transaction, createID(currPos.right.id.client, currPos.right.id.clock + length3));
          }
          length3 -= currPos.right.length;
          break;
      }
    }
    currPos.forward();
  }
  if (length3 > 0) {
    let newlines = "";
    for (; length3 > 0; length3--) {
      newlines += "\n";
    }
    currPos.right = new Item(createID(ownClientId, getState(doc2.store, ownClientId)), currPos.left, currPos.left && currPos.left.lastId, currPos.right, currPos.right && currPos.right.id, parent, null, new ContentString(newlines));
    currPos.right.integrate(transaction, 0);
    currPos.forward();
  }
  insertNegatedAttributes(transaction, parent, currPos, negatedAttributes);
};
var cleanupFormattingGap = (transaction, start, end, startAttributes, endAttributes) => {
  while (end && (!end.countable || end.deleted)) {
    if (!end.deleted && end.content.constructor === ContentFormat) {
      updateCurrentAttributes(endAttributes, end.content);
    }
    end = end.right;
  }
  let cleanups = 0;
  while (start !== end) {
    if (!start.deleted) {
      const content = start.content;
      switch (content.constructor) {
        case ContentFormat: {
          const { key, value } = content;
          if ((endAttributes.get(key) || null) !== value || (startAttributes.get(key) || null) === value) {
            start.delete(transaction);
            cleanups++;
          }
          break;
        }
      }
    }
    start = start.right;
  }
  return cleanups;
};
var cleanupContextlessFormattingGap = (transaction, item) => {
  while (item && item.right && (item.right.deleted || !item.right.countable)) {
    item = item.right;
  }
  const attrs = new Set();
  while (item && (item.deleted || !item.countable)) {
    if (!item.deleted && item.content.constructor === ContentFormat) {
      const key = item.content.key;
      if (attrs.has(key)) {
        item.delete(transaction);
      } else {
        attrs.add(key);
      }
    }
    item = item.left;
  }
};
var cleanupYTextFormatting = (type) => {
  let res = 0;
  transact(type.doc, (transaction) => {
    let start = type._start;
    let end = type._start;
    let startAttributes = create();
    const currentAttributes = copy(startAttributes);
    while (end) {
      if (end.deleted === false) {
        switch (end.content.constructor) {
          case ContentFormat:
            updateCurrentAttributes(currentAttributes, end.content);
            break;
          default:
            res += cleanupFormattingGap(transaction, start, end, startAttributes, currentAttributes);
            startAttributes = copy(currentAttributes);
            start = end;
            break;
        }
      }
      end = end.right;
    }
  });
  return res;
};
var deleteText = (transaction, currPos, length3) => {
  const startLength = length3;
  const startAttrs = copy(currPos.currentAttributes);
  const start = currPos.right;
  while (length3 > 0 && currPos.right !== null) {
    if (currPos.right.deleted === false) {
      switch (currPos.right.content.constructor) {
        case ContentType:
        case ContentEmbed:
        case ContentString:
          if (length3 < currPos.right.length) {
            getItemCleanStart(transaction, createID(currPos.right.id.client, currPos.right.id.clock + length3));
          }
          length3 -= currPos.right.length;
          currPos.right.delete(transaction);
          break;
      }
    }
    currPos.forward();
  }
  if (start) {
    cleanupFormattingGap(transaction, start, currPos.right, startAttrs, copy(currPos.currentAttributes));
  }
  const parent = (currPos.left || currPos.right).parent;
  if (parent._searchMarker) {
    updateMarkerChanges(parent._searchMarker, currPos.index, -startLength + length3);
  }
  return currPos;
};
var YTextEvent = class extends YEvent {
  constructor(ytext, transaction, subs) {
    super(ytext, transaction);
    this.childListChanged = false;
    this.keysChanged = new Set();
    subs.forEach((sub) => {
      if (sub === null) {
        this.childListChanged = true;
      } else {
        this.keysChanged.add(sub);
      }
    });
  }
  get changes() {
    if (this._changes === null) {
      const changes = {
        keys: this.keys,
        delta: this.delta,
        added: new Set(),
        deleted: new Set()
      };
      this._changes = changes;
    }
    return this._changes;
  }
  get delta() {
    if (this._delta === null) {
      const y = this.target.doc;
      const delta = [];
      transact(y, (transaction) => {
        const currentAttributes = new Map();
        const oldAttributes = new Map();
        let item = this.target._start;
        let action = null;
        const attributes = {};
        let insert = "";
        let retain = 0;
        let deleteLen = 0;
        const addOp = () => {
          if (action !== null) {
            let op;
            switch (action) {
              case "delete":
                op = { delete: deleteLen };
                deleteLen = 0;
                break;
              case "insert":
                op = { insert };
                if (currentAttributes.size > 0) {
                  op.attributes = {};
                  currentAttributes.forEach((value, key) => {
                    if (value !== null) {
                      op.attributes[key] = value;
                    }
                  });
                }
                insert = "";
                break;
              case "retain":
                op = { retain };
                if (Object.keys(attributes).length > 0) {
                  op.attributes = {};
                  for (const key in attributes) {
                    op.attributes[key] = attributes[key];
                  }
                }
                retain = 0;
                break;
            }
            delta.push(op);
            action = null;
          }
        };
        while (item !== null) {
          switch (item.content.constructor) {
            case ContentType:
            case ContentEmbed:
              if (this.adds(item)) {
                if (!this.deletes(item)) {
                  addOp();
                  action = "insert";
                  insert = item.content.getContent()[0];
                  addOp();
                }
              } else if (this.deletes(item)) {
                if (action !== "delete") {
                  addOp();
                  action = "delete";
                }
                deleteLen += 1;
              } else if (!item.deleted) {
                if (action !== "retain") {
                  addOp();
                  action = "retain";
                }
                retain += 1;
              }
              break;
            case ContentString:
              if (this.adds(item)) {
                if (!this.deletes(item)) {
                  if (action !== "insert") {
                    addOp();
                    action = "insert";
                  }
                  insert += item.content.str;
                }
              } else if (this.deletes(item)) {
                if (action !== "delete") {
                  addOp();
                  action = "delete";
                }
                deleteLen += item.length;
              } else if (!item.deleted) {
                if (action !== "retain") {
                  addOp();
                  action = "retain";
                }
                retain += item.length;
              }
              break;
            case ContentFormat: {
              const { key, value } = item.content;
              if (this.adds(item)) {
                if (!this.deletes(item)) {
                  const curVal = currentAttributes.get(key) || null;
                  if (!equalAttrs(curVal, value)) {
                    if (action === "retain") {
                      addOp();
                    }
                    if (equalAttrs(value, oldAttributes.get(key) || null)) {
                      delete attributes[key];
                    } else {
                      attributes[key] = value;
                    }
                  } else {
                    item.delete(transaction);
                  }
                }
              } else if (this.deletes(item)) {
                oldAttributes.set(key, value);
                const curVal = currentAttributes.get(key) || null;
                if (!equalAttrs(curVal, value)) {
                  if (action === "retain") {
                    addOp();
                  }
                  attributes[key] = curVal;
                }
              } else if (!item.deleted) {
                oldAttributes.set(key, value);
                const attr = attributes[key];
                if (attr !== void 0) {
                  if (!equalAttrs(attr, value)) {
                    if (action === "retain") {
                      addOp();
                    }
                    if (value === null) {
                      delete attributes[key];
                    } else {
                      attributes[key] = value;
                    }
                  } else {
                    item.delete(transaction);
                  }
                }
              }
              if (!item.deleted) {
                if (action === "insert") {
                  addOp();
                }
                updateCurrentAttributes(currentAttributes, item.content);
              }
              break;
            }
          }
          item = item.right;
        }
        addOp();
        while (delta.length > 0) {
          const lastOp = delta[delta.length - 1];
          if (lastOp.retain !== void 0 && lastOp.attributes === void 0) {
            delta.pop();
          } else {
            break;
          }
        }
      });
      this._delta = delta;
    }
    return this._delta;
  }
};
var YText = class extends AbstractType {
  constructor(string2) {
    super();
    this._pending = string2 !== void 0 ? [() => this.insert(0, string2)] : [];
    this._searchMarker = [];
  }
  get length() {
    return this._length;
  }
  _integrate(y, item) {
    super._integrate(y, item);
    try {
      this._pending.forEach((f2) => f2());
    } catch (e) {
      console.error(e);
    }
    this._pending = null;
  }
  _copy() {
    return new YText();
  }
  clone() {
    const text2 = new YText();
    text2.applyDelta(this.toDelta());
    return text2;
  }
  _callObserver(transaction, parentSubs) {
    super._callObserver(transaction, parentSubs);
    const event = new YTextEvent(this, transaction, parentSubs);
    const doc2 = transaction.doc;
    callTypeObservers(this, transaction, event);
    if (!transaction.local) {
      let foundFormattingItem = false;
      for (const [client, afterClock] of transaction.afterState.entries()) {
        const clock = transaction.beforeState.get(client) || 0;
        if (afterClock === clock) {
          continue;
        }
        iterateStructs(transaction, doc2.store.clients.get(client), clock, afterClock, (item) => {
          if (!item.deleted && item.content.constructor === ContentFormat) {
            foundFormattingItem = true;
          }
        });
        if (foundFormattingItem) {
          break;
        }
      }
      if (!foundFormattingItem) {
        iterateDeletedStructs(transaction, transaction.deleteSet, (item) => {
          if (item instanceof GC || foundFormattingItem) {
            return;
          }
          if (item.parent === this && item.content.constructor === ContentFormat) {
            foundFormattingItem = true;
          }
        });
      }
      transact(doc2, (t) => {
        if (foundFormattingItem) {
          cleanupYTextFormatting(this);
        } else {
          iterateDeletedStructs(t, t.deleteSet, (item) => {
            if (item instanceof GC) {
              return;
            }
            if (item.parent === this) {
              cleanupContextlessFormattingGap(t, item);
            }
          });
        }
      });
    }
  }
  toString() {
    let str = "";
    let n = this._start;
    while (n !== null) {
      if (!n.deleted && n.countable && n.content.constructor === ContentString) {
        str += n.content.str;
      }
      n = n.right;
    }
    return str;
  }
  toJSON() {
    return this.toString();
  }
  applyDelta(delta, { sanitize = true } = {}) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        const currPos = new ItemTextListPosition(null, this._start, 0, new Map());
        for (let i = 0; i < delta.length; i++) {
          const op = delta[i];
          if (op.insert !== void 0) {
            const ins = !sanitize && typeof op.insert === "string" && i === delta.length - 1 && currPos.right === null && op.insert.slice(-1) === "\n" ? op.insert.slice(0, -1) : op.insert;
            if (typeof ins !== "string" || ins.length > 0) {
              insertText(transaction, this, currPos, ins, op.attributes || {});
            }
          } else if (op.retain !== void 0) {
            formatText(transaction, this, currPos, op.retain, op.attributes || {});
          } else if (op.delete !== void 0) {
            deleteText(transaction, currPos, op.delete);
          }
        }
      });
    } else {
      this._pending.push(() => this.applyDelta(delta));
    }
  }
  toDelta(snapshot, prevSnapshot, computeYChange) {
    const ops = [];
    const currentAttributes = new Map();
    const doc2 = this.doc;
    let str = "";
    let n = this._start;
    function packStr() {
      if (str.length > 0) {
        const attributes = {};
        let addAttributes = false;
        currentAttributes.forEach((value, key) => {
          addAttributes = true;
          attributes[key] = value;
        });
        const op = { insert: str };
        if (addAttributes) {
          op.attributes = attributes;
        }
        ops.push(op);
        str = "";
      }
    }
    transact(doc2, (transaction) => {
      if (snapshot) {
        splitSnapshotAffectedStructs(transaction, snapshot);
      }
      if (prevSnapshot) {
        splitSnapshotAffectedStructs(transaction, prevSnapshot);
      }
      while (n !== null) {
        if (isVisible(n, snapshot) || prevSnapshot !== void 0 && isVisible(n, prevSnapshot)) {
          switch (n.content.constructor) {
            case ContentString: {
              const cur = currentAttributes.get("ychange");
              if (snapshot !== void 0 && !isVisible(n, snapshot)) {
                if (cur === void 0 || cur.user !== n.id.client || cur.state !== "removed") {
                  packStr();
                  currentAttributes.set("ychange", computeYChange ? computeYChange("removed", n.id) : { type: "removed" });
                }
              } else if (prevSnapshot !== void 0 && !isVisible(n, prevSnapshot)) {
                if (cur === void 0 || cur.user !== n.id.client || cur.state !== "added") {
                  packStr();
                  currentAttributes.set("ychange", computeYChange ? computeYChange("added", n.id) : { type: "added" });
                }
              } else if (cur !== void 0) {
                packStr();
                currentAttributes.delete("ychange");
              }
              str += n.content.str;
              break;
            }
            case ContentType:
            case ContentEmbed: {
              packStr();
              const op = {
                insert: n.content.getContent()[0]
              };
              if (currentAttributes.size > 0) {
                const attrs = {};
                op.attributes = attrs;
                currentAttributes.forEach((value, key) => {
                  attrs[key] = value;
                });
              }
              ops.push(op);
              break;
            }
            case ContentFormat:
              if (isVisible(n, snapshot)) {
                packStr();
                updateCurrentAttributes(currentAttributes, n.content);
              }
              break;
          }
        }
        n = n.right;
      }
      packStr();
    }, splitSnapshotAffectedStructs);
    return ops;
  }
  insert(index, text2, attributes) {
    if (text2.length <= 0) {
      return;
    }
    const y = this.doc;
    if (y !== null) {
      transact(y, (transaction) => {
        const pos = findPosition(transaction, this, index);
        if (!attributes) {
          attributes = {};
          pos.currentAttributes.forEach((v, k) => {
            attributes[k] = v;
          });
        }
        insertText(transaction, this, pos, text2, attributes);
      });
    } else {
      this._pending.push(() => this.insert(index, text2, attributes));
    }
  }
  insertEmbed(index, embed, attributes = {}) {
    const y = this.doc;
    if (y !== null) {
      transact(y, (transaction) => {
        const pos = findPosition(transaction, this, index);
        insertText(transaction, this, pos, embed, attributes);
      });
    } else {
      this._pending.push(() => this.insertEmbed(index, embed, attributes));
    }
  }
  delete(index, length3) {
    if (length3 === 0) {
      return;
    }
    const y = this.doc;
    if (y !== null) {
      transact(y, (transaction) => {
        deleteText(transaction, findPosition(transaction, this, index), length3);
      });
    } else {
      this._pending.push(() => this.delete(index, length3));
    }
  }
  format(index, length3, attributes) {
    if (length3 === 0) {
      return;
    }
    const y = this.doc;
    if (y !== null) {
      transact(y, (transaction) => {
        const pos = findPosition(transaction, this, index);
        if (pos.right === null) {
          return;
        }
        formatText(transaction, this, pos, length3, attributes);
      });
    } else {
      this._pending.push(() => this.format(index, length3, attributes));
    }
  }
  removeAttribute(attributeName) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeMapDelete(transaction, this, attributeName);
      });
    } else {
      this._pending.push(() => this.removeAttribute(attributeName));
    }
  }
  setAttribute(attributeName, attributeValue) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeMapSet(transaction, this, attributeName, attributeValue);
      });
    } else {
      this._pending.push(() => this.setAttribute(attributeName, attributeValue));
    }
  }
  getAttribute(attributeName) {
    return typeMapGet(this, attributeName);
  }
  getAttributes(snapshot) {
    return typeMapGetAll(this);
  }
  _write(encoder) {
    encoder.writeTypeRef(YTextRefID);
  }
};
var YXmlTreeWalker = class {
  constructor(root, f2 = () => true) {
    this._filter = f2;
    this._root = root;
    this._currentNode = root._start;
    this._firstCall = true;
  }
  [Symbol.iterator]() {
    return this;
  }
  next() {
    let n = this._currentNode;
    let type = n && n.content && n.content.type;
    if (n !== null && (!this._firstCall || n.deleted || !this._filter(type))) {
      do {
        type = n.content.type;
        if (!n.deleted && (type.constructor === YXmlElement || type.constructor === YXmlFragment) && type._start !== null) {
          n = type._start;
        } else {
          while (n !== null) {
            if (n.right !== null) {
              n = n.right;
              break;
            } else if (n.parent === this._root) {
              n = null;
            } else {
              n = n.parent._item;
            }
          }
        }
      } while (n !== null && (n.deleted || !this._filter(n.content.type)));
    }
    this._firstCall = false;
    if (n === null) {
      return { value: void 0, done: true };
    }
    this._currentNode = n;
    return { value: n.content.type, done: false };
  }
};
var YXmlFragment = class extends AbstractType {
  constructor() {
    super();
    this._prelimContent = [];
  }
  get firstChild() {
    const first = this._first;
    return first ? first.content.getContent()[0] : null;
  }
  _integrate(y, item) {
    super._integrate(y, item);
    this.insert(0, this._prelimContent);
    this._prelimContent = null;
  }
  _copy() {
    return new YXmlFragment();
  }
  clone() {
    const el = new YXmlFragment();
    el.insert(0, this.toArray().map((item) => item instanceof AbstractType ? item.clone() : item));
    return el;
  }
  get length() {
    return this._prelimContent === null ? this._length : this._prelimContent.length;
  }
  createTreeWalker(filter) {
    return new YXmlTreeWalker(this, filter);
  }
  querySelector(query) {
    query = query.toUpperCase();
    const iterator2 = new YXmlTreeWalker(this, (element2) => element2.nodeName && element2.nodeName.toUpperCase() === query);
    const next = iterator2.next();
    if (next.done) {
      return null;
    } else {
      return next.value;
    }
  }
  querySelectorAll(query) {
    query = query.toUpperCase();
    return Array.from(new YXmlTreeWalker(this, (element2) => element2.nodeName && element2.nodeName.toUpperCase() === query));
  }
  _callObserver(transaction, parentSubs) {
    callTypeObservers(this, transaction, new YXmlEvent(this, parentSubs, transaction));
  }
  toString() {
    return typeListMap(this, (xml) => xml.toString()).join("");
  }
  toJSON() {
    return this.toString();
  }
  toDOM(_document = document, hooks = {}, binding) {
    const fragment = _document.createDocumentFragment();
    if (binding !== void 0) {
      binding._createAssociation(fragment, this);
    }
    typeListForEach(this, (xmlType) => {
      fragment.insertBefore(xmlType.toDOM(_document, hooks, binding), null);
    });
    return fragment;
  }
  insert(index, content) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeListInsertGenerics(transaction, this, index, content);
      });
    } else {
      this._prelimContent.splice(index, 0, ...content);
    }
  }
  insertAfter(ref, content) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        const refItem = ref && ref instanceof AbstractType ? ref._item : ref;
        typeListInsertGenericsAfter(transaction, this, refItem, content);
      });
    } else {
      const pc = this._prelimContent;
      const index = ref === null ? 0 : pc.findIndex((el) => el === ref) + 1;
      if (index === 0 && ref !== null) {
        throw create4("Reference item not found");
      }
      pc.splice(index, 0, ...content);
    }
  }
  delete(index, length3 = 1) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeListDelete(transaction, this, index, length3);
      });
    } else {
      this._prelimContent.splice(index, length3);
    }
  }
  toArray() {
    return typeListToArray(this);
  }
  push(content) {
    this.insert(this.length, content);
  }
  unshift(content) {
    this.insert(0, content);
  }
  get(index) {
    return typeListGet(this, index);
  }
  slice(start = 0, end = this.length) {
    return typeListSlice(this, start, end);
  }
  _write(encoder) {
    encoder.writeTypeRef(YXmlFragmentRefID);
  }
};
var YXmlElement = class extends YXmlFragment {
  constructor(nodeName = "UNDEFINED") {
    super();
    this.nodeName = nodeName;
    this._prelimAttrs = new Map();
  }
  get nextSibling() {
    const n = this._item ? this._item.next : null;
    return n ? n.content.type : null;
  }
  get prevSibling() {
    const n = this._item ? this._item.prev : null;
    return n ? n.content.type : null;
  }
  _integrate(y, item) {
    super._integrate(y, item);
    this._prelimAttrs.forEach((value, key) => {
      this.setAttribute(key, value);
    });
    this._prelimAttrs = null;
  }
  _copy() {
    return new YXmlElement(this.nodeName);
  }
  clone() {
    const el = new YXmlElement(this.nodeName);
    const attrs = this.getAttributes();
    for (const key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
    el.insert(0, this.toArray().map((item) => item instanceof AbstractType ? item.clone() : item));
    return el;
  }
  toString() {
    const attrs = this.getAttributes();
    const stringBuilder = [];
    const keys2 = [];
    for (const key in attrs) {
      keys2.push(key);
    }
    keys2.sort();
    const keysLen = keys2.length;
    for (let i = 0; i < keysLen; i++) {
      const key = keys2[i];
      stringBuilder.push(key + '="' + attrs[key] + '"');
    }
    const nodeName = this.nodeName.toLocaleLowerCase();
    const attrsString = stringBuilder.length > 0 ? " " + stringBuilder.join(" ") : "";
    return `<${nodeName}${attrsString}>${super.toString()}</${nodeName}>`;
  }
  removeAttribute(attributeName) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeMapDelete(transaction, this, attributeName);
      });
    } else {
      this._prelimAttrs.delete(attributeName);
    }
  }
  setAttribute(attributeName, attributeValue) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeMapSet(transaction, this, attributeName, attributeValue);
      });
    } else {
      this._prelimAttrs.set(attributeName, attributeValue);
    }
  }
  getAttribute(attributeName) {
    return typeMapGet(this, attributeName);
  }
  hasAttribute(attributeName) {
    return typeMapHas(this, attributeName);
  }
  getAttributes(snapshot) {
    return typeMapGetAll(this);
  }
  toDOM(_document = document, hooks = {}, binding) {
    const dom2 = _document.createElement(this.nodeName);
    const attrs = this.getAttributes();
    for (const key in attrs) {
      dom2.setAttribute(key, attrs[key]);
    }
    typeListForEach(this, (yxml) => {
      dom2.appendChild(yxml.toDOM(_document, hooks, binding));
    });
    if (binding !== void 0) {
      binding._createAssociation(dom2, this);
    }
    return dom2;
  }
  _write(encoder) {
    encoder.writeTypeRef(YXmlElementRefID);
    encoder.writeKey(this.nodeName);
  }
};
var YXmlEvent = class extends YEvent {
  constructor(target, subs, transaction) {
    super(target, transaction);
    this.childListChanged = false;
    this.attributesChanged = new Set();
    subs.forEach((sub) => {
      if (sub === null) {
        this.childListChanged = true;
      } else {
        this.attributesChanged.add(sub);
      }
    });
  }
};
var AbstractStruct = class {
  constructor(id, length3) {
    this.id = id;
    this.length = length3;
  }
  get deleted() {
    throw methodUnimplemented();
  }
  mergeWith(right) {
    return false;
  }
  write(encoder, offset, encodingRef) {
    throw methodUnimplemented();
  }
  integrate(transaction, offset) {
    throw methodUnimplemented();
  }
};
var structGCRefNumber = 0;
var GC = class extends AbstractStruct {
  get deleted() {
    return true;
  }
  delete() {
  }
  mergeWith(right) {
    if (this.constructor !== right.constructor) {
      return false;
    }
    this.length += right.length;
    return true;
  }
  integrate(transaction, offset) {
    if (offset > 0) {
      this.id.clock += offset;
      this.length -= offset;
    }
    addStruct(transaction.doc.store, this);
  }
  write(encoder, offset) {
    encoder.writeInfo(structGCRefNumber);
    encoder.writeLen(this.length - offset);
  }
  getMissing(transaction, store) {
    return null;
  }
};
var ContentBinary = class {
  constructor(content) {
    this.content = content;
  }
  getLength() {
    return 1;
  }
  getContent() {
    return [this.content];
  }
  isCountable() {
    return true;
  }
  copy() {
    return new ContentBinary(this.content);
  }
  splice(offset) {
    throw methodUnimplemented();
  }
  mergeWith(right) {
    return false;
  }
  integrate(transaction, item) {
  }
  delete(transaction) {
  }
  gc(store) {
  }
  write(encoder, offset) {
    encoder.writeBuf(this.content);
  }
  getRef() {
    return 3;
  }
};
var ContentDeleted = class {
  constructor(len) {
    this.len = len;
  }
  getLength() {
    return this.len;
  }
  getContent() {
    return [];
  }
  isCountable() {
    return false;
  }
  copy() {
    return new ContentDeleted(this.len);
  }
  splice(offset) {
    const right = new ContentDeleted(this.len - offset);
    this.len = offset;
    return right;
  }
  mergeWith(right) {
    this.len += right.len;
    return true;
  }
  integrate(transaction, item) {
    addToDeleteSet(transaction.deleteSet, item.id.client, item.id.clock, this.len);
    item.markDeleted();
  }
  delete(transaction) {
  }
  gc(store) {
  }
  write(encoder, offset) {
    encoder.writeLen(this.len - offset);
  }
  getRef() {
    return 1;
  }
};
var createDocFromOpts = (guid, opts) => new Doc({ guid, ...opts, shouldLoad: opts.shouldLoad || opts.autoLoad || false });
var ContentDoc = class {
  constructor(doc2) {
    if (doc2._item) {
      console.error("This document was already integrated as a sub-document. You should create a second instance instead with the same guid.");
    }
    this.doc = doc2;
    const opts = {};
    this.opts = opts;
    if (!doc2.gc) {
      opts.gc = false;
    }
    if (doc2.autoLoad) {
      opts.autoLoad = true;
    }
    if (doc2.meta !== null) {
      opts.meta = doc2.meta;
    }
  }
  getLength() {
    return 1;
  }
  getContent() {
    return [this.doc];
  }
  isCountable() {
    return true;
  }
  copy() {
    return new ContentDoc(createDocFromOpts(this.doc.guid, this.opts));
  }
  splice(offset) {
    throw methodUnimplemented();
  }
  mergeWith(right) {
    return false;
  }
  integrate(transaction, item) {
    this.doc._item = item;
    transaction.subdocsAdded.add(this.doc);
    if (this.doc.shouldLoad) {
      transaction.subdocsLoaded.add(this.doc);
    }
  }
  delete(transaction) {
    if (transaction.subdocsAdded.has(this.doc)) {
      transaction.subdocsAdded.delete(this.doc);
    } else {
      transaction.subdocsRemoved.add(this.doc);
    }
  }
  gc(store) {
  }
  write(encoder, offset) {
    encoder.writeString(this.doc.guid);
    encoder.writeAny(this.opts);
  }
  getRef() {
    return 9;
  }
};
var ContentEmbed = class {
  constructor(embed) {
    this.embed = embed;
  }
  getLength() {
    return 1;
  }
  getContent() {
    return [this.embed];
  }
  isCountable() {
    return true;
  }
  copy() {
    return new ContentEmbed(this.embed);
  }
  splice(offset) {
    throw methodUnimplemented();
  }
  mergeWith(right) {
    return false;
  }
  integrate(transaction, item) {
  }
  delete(transaction) {
  }
  gc(store) {
  }
  write(encoder, offset) {
    encoder.writeJSON(this.embed);
  }
  getRef() {
    return 5;
  }
};
var ContentFormat = class {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }
  getLength() {
    return 1;
  }
  getContent() {
    return [];
  }
  isCountable() {
    return false;
  }
  copy() {
    return new ContentFormat(this.key, this.value);
  }
  splice(offset) {
    throw methodUnimplemented();
  }
  mergeWith(right) {
    return false;
  }
  integrate(transaction, item) {
    item.parent._searchMarker = null;
  }
  delete(transaction) {
  }
  gc(store) {
  }
  write(encoder, offset) {
    encoder.writeKey(this.key);
    encoder.writeJSON(this.value);
  }
  getRef() {
    return 6;
  }
};
var ContentAny = class {
  constructor(arr) {
    this.arr = arr;
  }
  getLength() {
    return this.arr.length;
  }
  getContent() {
    return this.arr;
  }
  isCountable() {
    return true;
  }
  copy() {
    return new ContentAny(this.arr);
  }
  splice(offset) {
    const right = new ContentAny(this.arr.slice(offset));
    this.arr = this.arr.slice(0, offset);
    return right;
  }
  mergeWith(right) {
    this.arr = this.arr.concat(right.arr);
    return true;
  }
  integrate(transaction, item) {
  }
  delete(transaction) {
  }
  gc(store) {
  }
  write(encoder, offset) {
    const len = this.arr.length;
    encoder.writeLen(len - offset);
    for (let i = offset; i < len; i++) {
      const c = this.arr[i];
      encoder.writeAny(c);
    }
  }
  getRef() {
    return 8;
  }
};
var ContentString = class {
  constructor(str) {
    this.str = str;
  }
  getLength() {
    return this.str.length;
  }
  getContent() {
    return this.str.split("");
  }
  isCountable() {
    return true;
  }
  copy() {
    return new ContentString(this.str);
  }
  splice(offset) {
    const right = new ContentString(this.str.slice(offset));
    this.str = this.str.slice(0, offset);
    const firstCharCode = this.str.charCodeAt(offset - 1);
    if (firstCharCode >= 55296 && firstCharCode <= 56319) {
      this.str = this.str.slice(0, offset - 1) + "\uFFFD";
      right.str = "\uFFFD" + right.str.slice(1);
    }
    return right;
  }
  mergeWith(right) {
    this.str += right.str;
    return true;
  }
  integrate(transaction, item) {
  }
  delete(transaction) {
  }
  gc(store) {
  }
  write(encoder, offset) {
    encoder.writeString(offset === 0 ? this.str : this.str.slice(offset));
  }
  getRef() {
    return 4;
  }
};
var YArrayRefID = 0;
var YMapRefID = 1;
var YTextRefID = 2;
var YXmlElementRefID = 3;
var YXmlFragmentRefID = 4;
var ContentType = class {
  constructor(type) {
    this.type = type;
  }
  getLength() {
    return 1;
  }
  getContent() {
    return [this.type];
  }
  isCountable() {
    return true;
  }
  copy() {
    return new ContentType(this.type._copy());
  }
  splice(offset) {
    throw methodUnimplemented();
  }
  mergeWith(right) {
    return false;
  }
  integrate(transaction, item) {
    this.type._integrate(transaction.doc, item);
  }
  delete(transaction) {
    let item = this.type._start;
    while (item !== null) {
      if (!item.deleted) {
        item.delete(transaction);
      } else {
        transaction._mergeStructs.push(item);
      }
      item = item.right;
    }
    this.type._map.forEach((item2) => {
      if (!item2.deleted) {
        item2.delete(transaction);
      } else {
        transaction._mergeStructs.push(item2);
      }
    });
    transaction.changed.delete(this.type);
  }
  gc(store) {
    let item = this.type._start;
    while (item !== null) {
      item.gc(store, true);
      item = item.right;
    }
    this.type._start = null;
    this.type._map.forEach((item2) => {
      while (item2 !== null) {
        item2.gc(store, true);
        item2 = item2.left;
      }
    });
    this.type._map = new Map();
  }
  write(encoder, offset) {
    this.type._write(encoder);
  }
  getRef() {
    return 7;
  }
};
var splitItem = (transaction, leftItem, diff) => {
  const { client, clock } = leftItem.id;
  const rightItem = new Item(createID(client, clock + diff), leftItem, createID(client, clock + diff - 1), leftItem.right, leftItem.rightOrigin, leftItem.parent, leftItem.parentSub, leftItem.content.splice(diff));
  if (leftItem.deleted) {
    rightItem.markDeleted();
  }
  if (leftItem.keep) {
    rightItem.keep = true;
  }
  if (leftItem.redone !== null) {
    rightItem.redone = createID(leftItem.redone.client, leftItem.redone.clock + diff);
  }
  leftItem.right = rightItem;
  if (rightItem.right !== null) {
    rightItem.right.left = rightItem;
  }
  transaction._mergeStructs.push(rightItem);
  if (rightItem.parentSub !== null && rightItem.right === null) {
    rightItem.parent._map.set(rightItem.parentSub, rightItem);
  }
  leftItem.length = diff;
  return rightItem;
};
var Item = class extends AbstractStruct {
  constructor(id, left, origin, right, rightOrigin, parent, parentSub, content) {
    super(id, content.getLength());
    this.origin = origin;
    this.left = left;
    this.right = right;
    this.rightOrigin = rightOrigin;
    this.parent = parent;
    this.parentSub = parentSub;
    this.redone = null;
    this.content = content;
    this.info = this.content.isCountable() ? BIT2 : 0;
  }
  set marker(isMarked) {
    if ((this.info & BIT4) > 0 !== isMarked) {
      this.info ^= BIT4;
    }
  }
  get marker() {
    return (this.info & BIT4) > 0;
  }
  get keep() {
    return (this.info & BIT1) > 0;
  }
  set keep(doKeep) {
    if (this.keep !== doKeep) {
      this.info ^= BIT1;
    }
  }
  get countable() {
    return (this.info & BIT2) > 0;
  }
  get deleted() {
    return (this.info & BIT3) > 0;
  }
  set deleted(doDelete) {
    if (this.deleted !== doDelete) {
      this.info ^= BIT3;
    }
  }
  markDeleted() {
    this.info |= BIT3;
  }
  getMissing(transaction, store) {
    if (this.origin && this.origin.client !== this.id.client && this.origin.clock >= getState(store, this.origin.client)) {
      return this.origin.client;
    }
    if (this.rightOrigin && this.rightOrigin.client !== this.id.client && this.rightOrigin.clock >= getState(store, this.rightOrigin.client)) {
      return this.rightOrigin.client;
    }
    if (this.parent && this.parent.constructor === ID && this.id.client !== this.parent.client && this.parent.clock >= getState(store, this.parent.client)) {
      return this.parent.client;
    }
    if (this.origin) {
      this.left = getItemCleanEnd(transaction, store, this.origin);
      this.origin = this.left.lastId;
    }
    if (this.rightOrigin) {
      this.right = getItemCleanStart(transaction, this.rightOrigin);
      this.rightOrigin = this.right.id;
    }
    if (this.left && this.left.constructor === GC || this.right && this.right.constructor === GC) {
      this.parent = null;
    }
    if (!this.parent) {
      if (this.left && this.left.constructor === Item) {
        this.parent = this.left.parent;
        this.parentSub = this.left.parentSub;
      }
      if (this.right && this.right.constructor === Item) {
        this.parent = this.right.parent;
        this.parentSub = this.right.parentSub;
      }
    } else if (this.parent.constructor === ID) {
      const parentItem = getItem(store, this.parent);
      if (parentItem.constructor === GC) {
        this.parent = null;
      } else {
        this.parent = parentItem.content.type;
      }
    }
    return null;
  }
  integrate(transaction, offset) {
    if (offset > 0) {
      this.id.clock += offset;
      this.left = getItemCleanEnd(transaction, transaction.doc.store, createID(this.id.client, this.id.clock - 1));
      this.origin = this.left.lastId;
      this.content = this.content.splice(offset);
      this.length -= offset;
    }
    if (this.parent) {
      if (!this.left && (!this.right || this.right.left !== null) || this.left && this.left.right !== this.right) {
        let left = this.left;
        let o;
        if (left !== null) {
          o = left.right;
        } else if (this.parentSub !== null) {
          o = this.parent._map.get(this.parentSub) || null;
          while (o !== null && o.left !== null) {
            o = o.left;
          }
        } else {
          o = this.parent._start;
        }
        const conflictingItems = new Set();
        const itemsBeforeOrigin = new Set();
        while (o !== null && o !== this.right) {
          itemsBeforeOrigin.add(o);
          conflictingItems.add(o);
          if (compareIDs(this.origin, o.origin)) {
            if (o.id.client < this.id.client) {
              left = o;
              conflictingItems.clear();
            } else if (compareIDs(this.rightOrigin, o.rightOrigin)) {
              break;
            }
          } else if (o.origin !== null && itemsBeforeOrigin.has(getItem(transaction.doc.store, o.origin))) {
            if (!conflictingItems.has(getItem(transaction.doc.store, o.origin))) {
              left = o;
              conflictingItems.clear();
            }
          } else {
            break;
          }
          o = o.right;
        }
        this.left = left;
      }
      if (this.left !== null) {
        const right = this.left.right;
        this.right = right;
        this.left.right = this;
      } else {
        let r;
        if (this.parentSub !== null) {
          r = this.parent._map.get(this.parentSub) || null;
          while (r !== null && r.left !== null) {
            r = r.left;
          }
        } else {
          r = this.parent._start;
          this.parent._start = this;
        }
        this.right = r;
      }
      if (this.right !== null) {
        this.right.left = this;
      } else if (this.parentSub !== null) {
        this.parent._map.set(this.parentSub, this);
        if (this.left !== null) {
          this.left.delete(transaction);
        }
      }
      if (this.parentSub === null && this.countable && !this.deleted) {
        this.parent._length += this.length;
      }
      addStruct(transaction.doc.store, this);
      this.content.integrate(transaction, this);
      addChangedTypeToTransaction(transaction, this.parent, this.parentSub);
      if (this.parent._item !== null && this.parent._item.deleted || this.parentSub !== null && this.right !== null) {
        this.delete(transaction);
      }
    } else {
      new GC(this.id, this.length).integrate(transaction, 0);
    }
  }
  get next() {
    let n = this.right;
    while (n !== null && n.deleted) {
      n = n.right;
    }
    return n;
  }
  get prev() {
    let n = this.left;
    while (n !== null && n.deleted) {
      n = n.left;
    }
    return n;
  }
  get lastId() {
    return this.length === 1 ? this.id : createID(this.id.client, this.id.clock + this.length - 1);
  }
  mergeWith(right) {
    if (this.constructor === right.constructor && compareIDs(right.origin, this.lastId) && this.right === right && compareIDs(this.rightOrigin, right.rightOrigin) && this.id.client === right.id.client && this.id.clock + this.length === right.id.clock && this.deleted === right.deleted && this.redone === null && right.redone === null && this.content.constructor === right.content.constructor && this.content.mergeWith(right.content)) {
      const searchMarker = this.parent._searchMarker;
      if (searchMarker) {
        searchMarker.forEach((marker) => {
          if (marker.p === right) {
            marker.p = this;
            if (!this.deleted && this.countable) {
              marker.index -= this.length;
            }
          }
        });
      }
      if (right.keep) {
        this.keep = true;
      }
      this.right = right.right;
      if (this.right !== null) {
        this.right.left = this;
      }
      this.length += right.length;
      return true;
    }
    return false;
  }
  delete(transaction) {
    if (!this.deleted) {
      const parent = this.parent;
      if (this.countable && this.parentSub === null) {
        parent._length -= this.length;
      }
      this.markDeleted();
      addToDeleteSet(transaction.deleteSet, this.id.client, this.id.clock, this.length);
      addChangedTypeToTransaction(transaction, parent, this.parentSub);
      this.content.delete(transaction);
    }
  }
  gc(store, parentGCd) {
    if (!this.deleted) {
      throw unexpectedCase();
    }
    this.content.gc(store);
    if (parentGCd) {
      replaceStruct(store, this, new GC(this.id, this.length));
    } else {
      this.content = new ContentDeleted(this.length);
    }
  }
  write(encoder, offset) {
    const origin = offset > 0 ? createID(this.id.client, this.id.clock + offset - 1) : this.origin;
    const rightOrigin = this.rightOrigin;
    const parentSub = this.parentSub;
    const info = this.content.getRef() & BITS5 | (origin === null ? 0 : BIT8) | (rightOrigin === null ? 0 : BIT7) | (parentSub === null ? 0 : BIT6);
    encoder.writeInfo(info);
    if (origin !== null) {
      encoder.writeLeftID(origin);
    }
    if (rightOrigin !== null) {
      encoder.writeRightID(rightOrigin);
    }
    if (origin === null && rightOrigin === null) {
      const parent = this.parent;
      if (parent._item !== void 0) {
        const parentItem = parent._item;
        if (parentItem === null) {
          const ykey = findRootTypeKey(parent);
          encoder.writeParentInfo(true);
          encoder.writeString(ykey);
        } else {
          encoder.writeParentInfo(false);
          encoder.writeLeftID(parentItem.id);
        }
      } else if (parent.constructor === String) {
        encoder.writeParentInfo(true);
        encoder.writeString(parent);
      } else if (parent.constructor === ID) {
        encoder.writeParentInfo(false);
        encoder.writeLeftID(parent);
      } else {
        unexpectedCase();
      }
      if (parentSub !== null) {
        encoder.writeString(parentSub);
      }
    }
    this.content.write(encoder, offset);
  }
};
var glo = typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};
var importIdentifier = "__ $YJS$ __";
if (glo[importIdentifier] === true) {
  console.warn("Yjs was already imported. Importing different versions of Yjs often leads to issues.");
}
glo[importIdentifier] = true;

// src/index.ts
async function handleRequest(request) {
  if (!ydoc) {
    console.log("creating YDoc instance");
    ydoc = new Doc();
  }
  const upgradeHeader = request.headers.get("Upgrade");
  if (!upgradeHeader || upgradeHeader !== "websocket") {
    return new Response("Expected Upgrade: websocket", { status: 426 });
  }
  let url = new URL(request.url);
  let docName = url.pathname;
  if (docName.split("/").length > 1) {
    console.log(url);
    return new Response("Bad Request: path must be url/[:documentName]", {
      status: 400
    });
  }
  const webSocketPair = new WebSocketPair();
  const client = webSocketPair[0];
  const server = webSocketPair[1];
  return new Response(null, {
    status: 101,
    webSocket: client
  });
}
var worker = { fetch: handleRequest };
var src_default = worker;
export {
  src_default as default,
  handleRequest
};
//# sourceMappingURL=index.mjs.map
