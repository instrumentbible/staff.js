 (function(global, factory) {
   if (typeof exports === 'object' && typeof module !== 'undefined') {
     module.exports = factory;
   }
   else if (typeof define === 'function' && define.amd) {
     define('JZZ.input.Kbd', ['JZZ'], factory);
   }
   else {
     factory(JZZ);
   }
 })(this, function(JZZ) {

   if (!JZZ) return;
   if (!JZZ.input) JZZ.input = {};

   var _version = '1.1.9';
   function _name(name, deflt) { return name ? name : deflt; }

   function _copy(obj) {
     var ret = {};
     for(var k in obj) ret[k] = obj[k];
     return ret;
   }

   function _keycode(x) {
     var z = x.toUpperCase();
     if (z.length == 1) {
       var k = z.charCodeAt(0);
       if (k >= 65 && k <= 90) return 'Key' + z;
       if (k >= 48 && k <= 57) return 'Digit' + z;
     }
     z = {
       ESC: 'Escape',
       TAB: 'Tab',
       BSP: 'Backspace',
       '-': 'Minus', '_': 'Minus',
       '+': 'Equal', '=': 'Equal',
       '[': 'BracketLeft', '{': 'BracketLeft',
       ']': 'BracketRight', '}': 'BracketRight',
       ';':'Semicolon', ':': 'Semicolon',
       "'": 'Quote', '"': 'Quote',
       '`': 'Backquote', '~': 'Backquote',
       '|': 'Backslash', '\\': 'Backslash',
       ',': 'Comma', '<': 'Comma',
       '.': 'Period', '>': 'Period',
       '/': 'Slash', '?': 'Slash',
       ' ': 'Space'
     }[z];
     return z ? z : x;
   }

   function _codekey(k) {
     if (k >= 65 && k <= 90) return 'Key' + String.fromCharCode(k);
     if (k >= 48 && k <= 57) return 'Digit' + String.fromCharCode(k);
     return {
       9: 'Tab',
       8: 'Backspace',
       27: 'Escape',
       32: 'Space',
       59: 'Semicolon',
       171: 'Equal',
       173: 'Minus',
       188: 'Comma',
       190: 'Period',
       191: 'Slash',
       192: 'Backquote',
       219: 'BracketLeft',
       220: 'Backslash',
       221: 'BracketRight',
       222: 'Quote',
     }[k];
   }

   var _channelMap = { a:10, b:11, c:12, d:13, e:14, f:15, A:10, B:11, C:12, D:13, E:14, F:15 };
   for (var k = 0; k < 16; k++) _channelMap[k] = k;

   function Keyboard(arg) {
     this.notes = {};
     this.playing = [];
     if (typeof arg == 'undefined') arg = {};
     if (typeof arg.mpe != 'undefined') {
       JZZ.MPE.validate(arg.mpe);
       this.mpe = arg.mpe;
       this.chan = arg.mpe[0];
     }
     else {
       this.chan = _channelMap[arg.chan];
       if (typeof this.chan == 'undefined') this.chan = 0;
     }
     for (var k in arg) {
       var key = _keycode(k);
       var val = JZZ.MIDI.noteValue(arg[k]);
       if (typeof key != 'undefined' && typeof val != 'undefined') this.notes[key] = val;
     }
     var self = this;
     this.keydown = function(e) {
       var midi = e.code ? self.notes[e.code] : self.notes[_codekey(e.keyCode)];
       if (typeof midi != 'undefined') {
        // e.preventDefault();
         if (!self.playing[midi]) {
           self.playing[midi] = true;
           self.noteOn(midi);
         }
       }
     };
     this.keyup = function(e) {
       var midi = e.code ? self.notes[e.code] : self.notes[_codekey(e.keyCode)];
       if (typeof midi != 'undefined') {
       //  e.preventDefault();
         if (self.playing[midi]) {
           self.playing[midi] = undefined;
           self.noteOff(midi);
         }
       }
     };
     if (typeof arg.at == 'string') this.at = document.getElementById(arg.at);
     try {
       this.at.addEventListener('keydown', this.keydown);
       this.at.addEventListener('keyup', this.keyup);
       if (!this.at.tabIndex || this.at.tabIndex < 0) this.at.tabIndex = 0; // allow keyboard focus
     }
     catch(e) {
       document.addEventListener('keydown', this.keydown);
       document.addEventListener('keyup', this.keyup);
       this.at = document;
     }
     this._close = function() {
       this.at.removeEventListener('keydown', this.keydown);
       this.at.removeEventListener('keyup', this.keyup);
       for (var midi in self.playing) self.noteOff(midi);
     };
   }

   Keyboard.prototype.channel = function(c) {
     if (typeof this.mpe == 'undefined') {
       var chan = _channelMap[c];
       if (typeof chan != 'undefined') this.chan = chan;
     }
     return this.chan;
   };

   function AsciiEngine() {}

   AsciiEngine.prototype._info = function(name) {
     return {
       type: 'html/javascript',
       name: _name(name, 'ASCII'),
       manufacturer: 'virtual',
       version: _version
     };
   };

   AsciiEngine.prototype._openIn = function(port, name) {
     var keyboard = new Keyboard(this._arg);
     if (keyboard.mpe) {
       if (!port._orig._mpe) port._orig._mpe = JZZ.MPE();
       port._orig._mpe.setup(keyboard.mpe[0], keyboard.mpe[1]);
       keyboard.noteOn = function(note) {
         var msg = JZZ.MIDI(0x90 + this.chan, note, 127);
         msg._mpe = note;
         port._receive(msg);
       };
       keyboard.noteOff = function(note) {
         var msg = JZZ.MIDI(0x80 + this.chan, note, 127);
         msg._mpe = note;
         port._receive(msg);
       };
     }
     else {
       keyboard.noteOn = function(note) { port._receive(JZZ.MIDI(0x90 + this.chan, note, 127)); };
       keyboard.noteOff = function(note) { port._receive(JZZ.MIDI(0x80 + this.chan, note, 127)); };
     }
     port._info = this._info(name);
     port._close = function() { keyboard._close(); };
     port.channel = function(x) { return keyboard.channel(x); };
     port._resume();
   };

   JZZ.input.ASCII = function() {
     var name, arg;
     if (arguments.length == 1) {
       if (typeof arguments[0] == 'string') name = arguments[0];
       else arg = arguments[0];
     }
     else { name = arguments[0]; arg = arguments[1];}
     var _AsciiEngine = new AsciiEngine();
     _AsciiEngine._arg = arg;
     return JZZ.lib.openMidiIn(name, _AsciiEngine);
   };

   JZZ.input.ASCII.register = function() {
     var name, arg;
     if (arguments.length == 1) {
       if (typeof arguments[0] == 'string') name = arguments[0];
       else arg = arguments[0];
     }
     else { name = arguments[0]; arg = arguments[1];}
     var _AsciiEngine = new AsciiEngine();
     _AsciiEngine._arg = arg;
     return JZZ.lib.registerMidiIn(name, _AsciiEngine);
   };

   var _firefoxBug;
   function _fixBtnUp(e) {
     if (typeof e.buttons == 'undefined' || e.buttons != _firefoxBug) return e;
     e.stopPropagation();
     if (e.button == 0) return {buttons:_firefoxBug^1};
     if (e.button == 1) return {buttons:_firefoxBug^4};
     if (e.button == 2) return {buttons:_firefoxBug^2};
   }

   function _lftBtnDn(e) { return typeof e.buttons == 'undefined' ? !e.button : e.buttons & 1; }
   function _lftBtnUp(e) { return typeof e.buttons == 'undefined' ? !e.button : !(e.buttons & 1); }
   function _stay(c, p) { for (; c; c = c.parentNode) if (c == p) return true; return false; }
   function _returnFalse() { return false; }
   function _style(key, stl) {
     if (key) for(var k in stl) key.style[k] = stl[k];
   }

   function _keyNum(n, up) {
     n = JZZ.MIDI.noteValue(n);
     return (up ? [0, 1, 1, 2, 2, 3, 4, 4, 5, 5, 6, 6] : [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6])[n % 12] + Math.floor(n / 12) * 7;
   }

   function _keyMidi(n) {
     return Math.floor(n / 7) * 12 + {0:0, 1:2, 2:4, 3:5, 4:7, 5:9, 6:11}[n % 7];
   }

   function _handleMouseDown(piano, midi) {
     return function(e) {
       if (_lftBtnDn(e) && !piano.playing[midi]) {
         piano.mouseDown = true;
         piano.playing[midi] = 'M';
         piano.press(midi);
       }
       _firefoxBug = e.buttons;
     };
   }

   function _handleMouseOver(piano, midi) {
     return function(e) {
       if (piano.mouseDown && !piano.playing[midi]) {
         piano.playing[midi] = 'M';
         piano.press(midi);
       }
       _firefoxBug = e.buttons;
     };
   }

   function _handleMouseOut(piano, midi) {
     return function(e) {
       if (piano.mouseDown && piano.playing[midi] == 'M' && !_stay(e.relatedTarget, this)) {
         piano.playing[midi] = undefined;
         piano.release(midi);
       }
       _firefoxBug = e.buttons;
     };
   }

   function _handleMouseUp(piano, midi) {
     return function(e) {
       e = _fixBtnUp(e);
       if (_lftBtnUp(e) && piano.mouseDown && piano.playing[midi] == 'M') {
         piano.playing[midi] = undefined;
         piano.release(midi);
         piano.mouseDown = false;
       }
     };
   }

   function _handleMouseOff(piano) {
     return function(e) {
       e = _fixBtnUp(e);
       if (_lftBtnUp(e)) piano.mouseDown = false;
     };
   }

   function _watchMouseButtons() {
     return function(e) {
       _firefoxBug = e.buttons;
     };
   }

   function _handleTouch(piano) {
     return function(e) {
     //  e.preventDefault();
       var t = {};
       for (var i = 0; i < e.touches.length; i++) piano.findKey(e.touches[i].clientX, e.touches[i].clientY, t);
       var tt = {};
       var midi;
       for (midi in t) {
         if (midi in piano.touches) tt[midi] = true;
         else if (typeof piano.playing[midi] == 'undefined') {
           piano.playing[midi] = 'T';
           piano.press(midi);
           tt[midi] = true;
         }
       }
       for (midi in piano.touches) {
         if (!(midi in t)) {
           piano.playing[midi] = undefined;
           piano.release(midi);
         }
       }
       piano.touches = tt;
     };
   }

   function Piano(arg) {
     this.bins = [];
     this.params = {0:{}};
     var common = {from:'C4', to:'E6', ww:42, bw:24, wl:150, bl:100, pos:'N'};
     if (typeof arg == 'undefined') arg = {};
     if (typeof arg.mpe != 'undefined') {
       JZZ.MPE.validate(arg.mpe);
       this.mpe = arg.mpe;
       this.chan = arg.mpe[0];
     }
     else {
       this.chan = _channelMap[arg.chan];
       if (typeof this.chan == 'undefined') this.chan = 0;
     }
     var key;
     for (key in arg) {
       if (key == parseInt(key)) this.params[key] = _copy(arg[key]);
       else {
         if (key == 'chan') continue;
         if ((key == 'from' || key == 'to') && typeof JZZ.MIDI.noteValue(arg[key]) == 'undefined') continue;
         common[key] = arg[key];
       }
     }
     for (key in this.params) {
       this.bins.push(key);
       for (var k in common) {
         if ((k == 'from' || k == 'to') && (typeof this.params[key][k] == 'undefined' || typeof JZZ.MIDI.noteValue(this.params[key][k]) == 'undefined')) this.params[key][k] = common[k];
         if (!(k in this.params[key])) this.params[key][k] = common[k];
       }
       var from = this.params[key].from;
       var to = this.params[key].to;
       if (JZZ.MIDI.noteValue(from) > JZZ.MIDI.noteValue(to)) {
         this.params[key].from = to;
         this.params[key].to = from;
       }
     }
     this.bins.sort(function(a, b) { return a - b;});
   }

   Piano.prototype.channel = function(c) {
     if (typeof this.mpe == 'undefined') {
       var chan = _channelMap[c];
       if (typeof chan != 'undefined' && chan != this.chan) {
         for (var midi in this.playing) {
           _style(this.keys[midi], this.keys[midi]._active ? this.stl0[midi] : this.stl2[midi]);
           _style(this.keys[midi], this.locs[midi]);
         }
         this.chan = chan;
       }
     }
     return this.chan;
   };

   Piano.prototype._close = function() {
     for (var midi in this.playing) if (this.playing[midi] == 'M' || this.playing[midi] == 'T') this.noteOff(midi);
     if (this.resize) window.removeEventListener('resize', this.resize);
     this.cleanup();
   };

   Piano.prototype.press = function(midi) {
     if (this.keys[midi]._active) {
       _style(this.keys[midi], this.stl1[midi]);
       _style(this.keys[midi], this.locs[midi]);
       this.noteOn(midi);
     }
   };

   Piano.prototype.release = function(midi) {
     if (this.keys[midi]._active) {
       _style(this.keys[midi], this.stl0[midi]);
       _style(this.keys[midi], this.locs[midi]);
       this.noteOff(midi);
     }
   };

   Piano.prototype.forward = function(msg) {
     var n = msg[1];
     var ch = msg.getChannel();
     if (ch >= this.chan && ch <= (this.mpe ? this.chan + this.mpe[1] : this.chan)) {
       var s = msg[0] >> 4;
       if (msg.isNoteOn()) {
         if (this.keys[n]) {
           this.playing[n] = 'E';
           _style(this.keys[n], this.stl1[n]);
           _style(this.keys[n], this.locs[n]);
         }
       }
       else if (msg.isNoteOff()) {
         if (this.keys[n]) {
           this.playing[n] = undefined;
           _style(this.keys[n], this.keys[n]._active ? this.stl0[n] : this.stl2[n]);
           _style(this.keys[n], this.locs[n]);
         }
       }
       else if (s == 0xb && (n == 0x78 || n == 0x7b)) { // all notes/snd off
         for (n in this.playing) {
           this.playing[n] = undefined;
           _style(this.keys[n], this.keys[n]._active ? this.stl0[n] : this.stl2[n]);
           _style(this.keys[n], this.locs[n]);
         }
       }
     }
     this.emit(msg);
   };

   Piano.prototype.findKey = function(x, y, ret) {
     for (var midi in this.keys) {
       for (var elm = document.elementFromPoint(x, y); elm; elm = elm.parentNode) {
         if (this.keys[midi] == elm) {
           ret[midi] = true;
           return;
         }
       }
     }
   };

   Piano.prototype.create = function() {
     var bin = 0;
     for (var i = 0; i < this.bins.length; i++) {
       if (this.bins[i] <= window.innerWidth) bin = this.bins[i];
       else break;
     }
     this.current = this.params[bin];
     this.createCurrent();
   };

   Piano.prototype.createCurrent = function() {
     this.cleanup();
     this.keys = {}; this.locs = {};
     this.stl0 = {}; this.stl1 = {}; this.stl2 = {};
     this.playing = {}; this.touches = {};

     if (this.current.keys) {
       this.createWithKeys(this.current.keys);
       return;
     }
     if (typeof this.current.at == 'string') this.current.at = document.getElementById(this.current.at);
     try { this.createAt(this.current.at); }
     catch(e) {
       if (!this.bottom) {
         this.bottom = document.createElement('div');
         document.body.appendChild(this.bottom);
       }
       this.createAt(this.bottom);
     }
   };

   Piano.prototype.createWithKeys = function(keys) {
     for (var k in keys) {
       var midi = JZZ.MIDI.noteValue(keys[k][1]);
       var dom = keys[k][0];
       if (typeof dom == 'string') dom = document.getElementById(dom);
       this.keys[midi] = dom;
       this.locs[midi] = {};
       this.stl0[midi] = {};
       this.stl1[midi] = {};
       this.stl2[midi] = {};
     }
     this.setListeners();
     if (this.current.onCreate) this.current.onCreate.apply(this);
   };

   Piano.prototype.createAt = function(at) {
     at.innerHTML = '';
     var pos = this.current.pos.toUpperCase();
     var first = _keyNum(this.current.from);
     var last = _keyNum(this.current.to, true);
     var num = last - first + 1;
     var w = num * this.current.ww + 1;
     var h = this.current.wl + 1;
     var ww = this.current.ww - 1;
     var wl = this.current.wl - 1;
     var bw = this.current.bw - 1;
     var bl = this.current.bl - 1;
     var l2r = (pos != 'N') ^ !this.current.rev;
     var t2b = (pos != 'E') ^ !this.current.rev;
     var midi;
     var key;
     var stl;
     var piano = document.createElement('span');
     piano.style.display = 'inline-block';
     piano.style.position = 'relative';
     piano.style.margin = '0px';
     piano.style.padding = '0px';
     piano.style.borderStyle = 'none';
     piano.style.userSelect = 'none';
     piano.style.MozUserSelect = 'none';
     piano.style.WebkitUserSelect = 'none';
     piano.style.MsUserSelect = 'none';
     piano.style.KhtmlUserSelect = 'none';
     piano.style.cursor = 'default';

     if (pos == 'E' || pos == 'W') {
       piano.style.width = h + 'px';
       piano.style.height = w + 'px';
     }
     else {
       piano.style.width = w + 'px';
       piano.style.height = h + 'px';
     }
     for (var i = 0; i < num; i++) {
       midi = _keyMidi(i + first);
       key = document.createElement('span'); this.keys[midi] = key;
       stl = { display:'inline-block', position:'absolute', margin:'0px', padding:'0px', borderStyle:'solid', borderWidth:'1px' };
       this.locs[midi] = stl;
       if (pos == 'E' || pos == 'W') {
         stl.width = wl + 'px';
         stl.height = ww + 'px';
         stl.left = '0px';
         stl[t2b ? 'top' : 'bottom'] = (this.current.ww * i) + 'px';
       }
       else {
         stl.width = ww + 'px';
         stl.height = wl + 'px';
         stl.top = '0px';
         stl[l2r ? 'left' : 'right'] = (this.current.ww * i) + 'px';
         stl.verticalAlign = 'top';
       }
       this.stl0[midi] = { backgroundColor:'#fff', borderColor:'#000' };
       this.stl1[midi] = { backgroundColor:'#aaa', borderColor:'#000' };
       this.stl2[midi] = { backgroundColor:'#fff', borderColor:'#000' };
       _style(key, this.stl0[midi]);
       _style(key, stl);
       piano.appendChild(key);
     }
     var hole = Math.ceil(this.current.ww - this.current.bw * 3 / 4);
     if ((hole + this.current.ww) % 2) hole--; // both even or both odd
     var from = _keyMidi(first) + 1;
     var to = _keyMidi(last);
     for (midi = from; midi < to; midi++) {
       var note = midi % 12;
       var oct = Math.floor(midi / 12);
       var shift;
       if (note == 1) {      // C#
         shift = Math.floor(this.current.ww * (oct * 7 + 1.5 - first)) - hole / 2 - this.current.bw;
       }
       else if (note == 3) { // D#
         shift = Math.floor(this.current.ww * (oct * 7 + 1.5 - first) + hole / 2);
       }
       else if (note == 6) { // F#
         shift = this.current.ww * (oct * 7 + 5 - first) - Math.floor(this.current.bw / 2) - hole - this.current.bw;
       }
       else if (note == 8) { // G#
         shift = this.current.ww * (oct * 7 + 5 - first) - Math.floor(this.current.bw / 2);
       }
       else if (note == 10) {// Bb
         shift = this.current.ww * (oct * 7 + 5 - first) - Math.floor(this.current.bw / 2) + hole + this.current.bw;
       }
       else continue;
       key = document.createElement('span'); this.keys[midi] = key;
       stl = { display:'inline-block', position:'absolute', margin:'0px', padding:'0px', borderStyle:'solid', borderWidth:'1px' };
       this.locs[midi] = stl;
       if (pos == 'E' || pos == 'W') {
         stl.width = bl + 'px';
         stl.height = bw + 'px';
         stl[pos == 'E' ? 'right' : 'left'] = '0px';
         stl[t2b ? 'top' : 'bottom'] = shift + 'px';
       }
       else {
         stl.width = bw + 'px';
         stl.height = bl + 'px';
         stl[pos == 'N' ? 'top' : 'bottom'] = '0px';
         stl[l2r ? 'left' : 'right'] = shift + 'px';
       }
       this.stl0[midi] = { backgroundColor:'#000', borderColor:'#000' };
       this.stl1[midi] = { backgroundColor:'#888', borderColor:'#000' };
       this.stl2[midi] = { backgroundColor:'#000', borderColor:'#000' };
       _style(key, this.stl0[midi]);
       _style(key, stl);
       piano.appendChild(key);
     }
     at.appendChild(piano);
     this.current.at = at;
     this.at = at;
     this.setListeners();
     if (this.current.onCreate) this.current.onCreate.apply(this);
   };

   Piano.prototype.setListeners = function() {
     var active = typeof this.current.active == 'undefined' || !!this.current.active;
     var midi;
     this.watchButtons = _watchMouseButtons();
     this.mouseUpHandle = _handleMouseOff(this);
     window.addEventListener("mousedown", this.watchButtons);
     window.addEventListener("mousemove", this.watchButtons);
     window.addEventListener("mouseup", this.mouseUpHandle);
     this.touchHandle = _handleTouch(this);
     this.mouseDownH = [];
     this.mouseOverH = [];
     this.mouseOutH = [];
     this.mouseUpH = [];
     for (midi in this.keys) {
       this.mouseDownH[midi] = _handleMouseDown(this, midi);
       this.mouseOverH[midi] = _handleMouseOver(this, midi);
       this.mouseOutH[midi] = _handleMouseOut(this, midi);
       this.mouseUpH[midi] = _handleMouseUp(this, midi);
         this.keys[midi].addEventListener("mousedown", this.mouseDownH[midi], {passive: true});
         this.keys[midi].addEventListener("mouseover", this.mouseOverH[midi], {passive: true});
         this.keys[midi].addEventListener("mouseout", this.mouseOutH[midi], {passive: true});
         this.keys[midi].addEventListener("mouseup", this.mouseUpH[midi], {passive: true});
         this.keys[midi].addEventListener("touchstart", this.touchHandle, {passive: true});
         this.keys[midi].addEventListener("touchmove", this.touchHandle, {passive: true});
         this.keys[midi].addEventListener("touchend", this.touchHandle, {passive: true});
     }
     for (midi in this.keys) {
       if (typeof this.keys[midi]._active == 'undefined') this.keys[midi]._active = active;
       this.keys[midi].ondragstart = _returnFalse;
       this.keys[midi].onselectstart = _returnFalse;
     }
     if (!this.resize && this.bins.length > 1) {
       var self = this;
       this.resize = function() { self.onResize(); };
       window.addEventListener('resize', this.resize);
     }
   };

   Piano.prototype.cleanup = function() {
     if (this.watchButtons) {
       window.removeEventListener("mousedown", this.watchButtons);
       window.removeEventListener("mousemove", this.watchButtons);
       window.removeEventListener("mouseup", this.mouseUpHandle);
     }
     for (var midi in this.keys) {
       if (this.mouseDownH[midi]) this.keys[midi].removeEventListener("mousedown", this.mouseDownH[midi]);
       if (this.mouseOverH[midi]) this.keys[midi].removeEventListener("mouseover", this.mouseOverH[midi]);
       if (this.mouseOutH[midi]) this.keys[midi].removeEventListener("mouseout", this.mouseOutH[midi]);
       if (this.mouseUpH[midi]) this.keys[midi].removeEventListener("mouseup", this.mouseUpH[midi]);
       if (this.touchHandle) {
         this.keys[midi].removeEventListener("touchstart", this.touchHandle);
         this.keys[midi].removeEventListener("touchmove", this.touchHandle);
         this.keys[midi].removeEventListener("touchend", this.touchHandle);
       }
     }
     if (this.at) this.at.innerHTML = '';
   };

   Piano.prototype.settings = function() { return _copy(this.current); };

   Piano.prototype.onResize = function() {
     var bin = 0;
     for (var i = 0; i < this.bins.length; i++) {
       if (this.bins[i] <= window.innerWidth) bin = this.bins[i];
       else break;
     }
     if (this.current == this.params[bin]) return;
     this.current = this.params[bin];
     this.createCurrent();
   };

   Piano.prototype.enable = function() {
     for (var k in this.keys) this.keys[k]._active = true;
     return this;
   };

   Piano.prototype.disable = function() {
     for (var k in this.keys) this.keys[k]._active = false;
     return this;
   };

   Piano.prototype.getKey = function(note) {
     var keys = new Keys(this);
     var k = JZZ.MIDI.noteValue(note);
     if (typeof this.keys[k] != 'undefined') keys.keys.push(k);
     return keys;
   };

   Piano.prototype.getKeys = function(from, to) {
     var keys = new Keys(this);
     var n0 = typeof from == 'undefined' ? undefined : JZZ.MIDI.noteValue(from);
     var n1 = typeof to == 'undefined' ? undefined : JZZ.MIDI.noteValue(to);
     if (typeof n0 != 'undefined' && typeof n1 != 'undefined' && n1 < n0) { var nn = n0; n0 = n1; n1 = nn; }
     for (var k in this.keys) {
       if (typeof n0 != 'undefined' && k < n0) continue;
       if (typeof n1 != 'undefined' && k > n1) continue;
       keys.keys.push(k);
     }
     return keys;
   };

   Piano.prototype.getWhiteKeys = function(from, to) {
     var keys = new Keys(this);
     var n0 = typeof from == 'undefined' ? undefined : JZZ.MIDI.noteValue(from);
     var n1 = typeof to == 'undefined' ? undefined : JZZ.MIDI.noteValue(to);
     if (typeof n0 != 'undefined' && typeof n1 != 'undefined' && n1 < n0) { var nn = n0; n0 = n1; n1 = nn; }
     for (var k in this.keys) {
       if (typeof n0 != 'undefined' && k < n0) continue;
       if (typeof n1 != 'undefined' && k > n1) continue;
       var n = k % 12;
       if (n == 1 || n == 3 || n == 6 || n == 8 || n == 10) continue;
       keys.keys.push(k);
     }
     return keys;
   };

   Piano.prototype.getBlackKeys = function(from, to) {
     var keys = new Keys(this);
     var n0 = typeof from == 'undefined' ? undefined : JZZ.MIDI.noteValue(from);
     var n1 = typeof to == 'undefined' ? undefined : JZZ.MIDI.noteValue(to);
     if (typeof n0 != 'undefined' && typeof n1 != 'undefined' && n1 < n0) { var nn = n0; n0 = n1; n1 = nn; }
     for (var k in this.keys) {
       if (typeof n0 != 'undefined' && k < n0) continue;
       if (typeof n1 != 'undefined' && k > n1) continue;
       var n = k % 12;
       if (n != 1 && n != 3 && n != 6 && n != 8 && n != 10) continue;
       keys.keys.push(k);
     }
     return keys;
   };

   function Keys(piano) {
     this.piano = piano;
     this.keys = [];
   }

   Keys.prototype.setInnerHTML = function(html) {
     for (var k in this.keys) this.piano.keys[this.keys[k]].innerHTML = html;
     return this;
   };

   Keys.prototype.setStyle = function(s0, s1, s2) {
     var k, n, midi;
     if (typeof s1 == 'undefined') s1 = s0;
     if (typeof s2 == 'undefined') s2 = s0;
     for (k in this.keys) {
       midi = this.keys[k];
       for (n in s0) this.piano.stl0[midi][n] = s0[n];
       for (n in s1) this.piano.stl1[midi][n] = s1[n];
       for (n in s2) this.piano.stl2[midi][n] = s2[n];
       _style(this.piano.keys[midi], this.piano.playing[midi] ? this.piano.stl1[midi] : this.piano.keys[midi]._active ?  this.piano.stl0[midi] : this.piano.stl2[midi]);
       _style(this.piano.keys[midi], this.piano.locs[midi]);
     }
     return this;
   };

   Keys.prototype.enable = function() {
     var k, midi;
     for (k in this.keys) {
       midi = this.keys[k];
       this.piano.keys[midi]._active = true;
       _style(this.piano.keys[midi], this.piano.playing[midi] ? this.piano.stl1[midi] : this.piano.stl0[midi]);
       _style(this.piano.keys[midi], this.piano.locs[midi]);
     }
     return this;
   };

   Keys.prototype.disable = function() {
     var k, midi;
     for (k in this.keys) {
       midi = this.keys[k];
       this.piano.keys[midi]._active = false;
       _style(this.piano.keys[midi], this.piano.playing[midi] ? this.piano.stl1[midi] : this.piano.stl2[midi]);
       _style(this.piano.keys[midi], this.piano.locs[midi]);
     }
     return this;
   };

   function KbdEngine() {}

   KbdEngine.prototype._info = function(name) {
     return {
       type: 'html/javascript',
       name: _name(name, 'Kbd'),
       manufacturer: 'virtual',
       version: _version
     };
   };

   KbdEngine.prototype._openIn = function(port, name) {
     var piano = new Piano(this._arg);
     piano.send = function() { port.send.apply(port, arguments); };
     piano.connect = function() { port.connect.apply(port, arguments); };
     piano.create();

     if (piano.mpe) {
       if (!port._orig._mpe) port._orig._mpe = JZZ.MPE();
       port._orig._mpe.setup(piano.mpe[0], piano.mpe[1]);
       piano.noteOn = function(note) {
         var msg = JZZ.MIDI(0x90 + this.chan, note, 127);
         msg._mpe = note;
         port._emit(port._filter(msg));
       };
       piano.noteOff = function(note) {
         var msg = JZZ.MIDI(0x80 + this.chan, note, 127);
         msg._mpe = note;
         port._emit(port._filter(msg));
       };
     }
     else {
       piano.noteOn = function(note) { port._emit(JZZ.MIDI(0x90 + this.chan, note, 127)); };
       piano.noteOff = function(note) { port._emit(JZZ.MIDI(0x80 + this.chan, note, 127)); };
     }
     piano.emit = function(msg) { port._emit(port._filter(msg)); };
     port._info = this._info(name);
     port._receive = function(msg) { piano.forward(msg); };
     port._close = function() { piano._close(); };
     port.settings = function() { return piano.settings(); };
     port.getKey = function(note) { return piano.getKey(note); };
     port.getKeys = function(a, b) { return piano.getKeys(a, b); };
     port.getWhiteKeys = function(a, b) { return piano.getWhiteKeys(a, b); };
     port.getBlackKeys = function(a, b) { return piano.getBlackKeys(a, b); };
     port.channel = function(x) { return piano.channel(x); };
     port._resume();
   };

   JZZ.input.Kbd = function() {
     var name, arg;
     if (arguments.length == 1) {
       if (typeof arguments[0] === 'string') name = arguments[0];
       else arg = arguments[0];
     }
     else { name = arguments[0]; arg = arguments[1];}
     var _KbdEngine = new KbdEngine();
     _KbdEngine._arg = arg;
     return JZZ.lib.openMidiIn(name, _KbdEngine);
   };

   JZZ.input.Kbd.version = function() { return _version; };

   JZZ.input.Kbd.register = function() {
     var name, arg;
     if (arguments.length == 1) {
       if (typeof arguments[0] === 'string') name = arguments[0];
       else arg = arguments[0];
     }
     else { name = arguments[0]; arg = arguments[1];}
     var _KbdEngine = new KbdEngine();
     _KbdEngine._arg = arg;
     return JZZ.lib.registerMidiIn(name, _KbdEngine);
   };

 ////////////////////////////////////////////////////////////////////////

   var _innerStyle = {margin:0, padding:0, width:'100%', height:'100%'};

   function _Data(d) {
     this.base = 0.5;
     this.val = 0.5;
     this.msb = 0;
     this.lsb = 0;
     this.chan = 0;
     if (d instanceof Array) {
       if (d.length != 1 && d.length != 2) return;
       if (d.length == 2) {
         if (d[1] != parseInt(d[1]) || d[1] < 1 || d[1] > 0x7f) return;
         this.msb = d[0];
         if (d[1] != d[0]) this.lsb = d[1];
       }
       else this.msb = d[0];
     }
     else if (d == parseInt(d)) {
       if (d < 1 || d > 0x7f) return;
       this.msb = d;
     }
     else {
       var z = {
         mod:[0x01, 0x21], breath:[0x02, 0x22], foot:[0x04, 0x24], portamento:[0x05, 0x25], volume:[0x07, 0x27],
         balance:[0x08, 0x28], pan:[0x0a, 0x2a], expression:[0x0b, 0x2b], effect1:[0x0c, 0x2c], effect2:[0x0d, 0x2d]
       }[d];
       if (z) {
         this.msb = z[0];
         this.lsb = z[1];
       }
     }
     if (this.msb && this.msb != 7 && this.msb != 8 && this.msb != 0xa) this.base = 0;
     this.val = -1;
     this.setValue(this.base);
   }

   _Data.prototype.setBase = function(x) {
     x = parseFloat(x);
     if (!isNaN(x) && isFinite(x) && x >= 0 && x <= 1) this.base = x;
   };

   _Data.prototype.setValue = function(x) {
     x = parseFloat(x);
     if (isNaN(x) || !isFinite(x) || x < 0 || x > 1 || x == this.val) return;
     this.val = x;
     this.num = Math.round(x * (this.lsb || !this.msb ? 0x3fff : 0x7f));
     return true;
   };

   _Data.prototype.emit = function(out) {
     if (!this.msb) {
       out.emit([0xe0 + this.chan, this.num & 0x7f, this.num >> 7]);
     }
     else if (!this.lsb) {
       out.emit([0xb0 + this.chan, this.msb, this.num]);
     }
     else {
       out.emit([0xb0 + this.chan, this.msb, this.num >> 7]);
       out.emit([0xb0 + this.chan, this.lsb, this.num & 0x7f]);
     }
   };

   _Data.prototype.read = function(msg) {
     if (!this.msb && msg[0] == 0xe0 + this.chan && msg[1] == parseInt(msg[1]) && msg[2] == parseInt(msg[2])) {
       this.num = (msg[2] << 7) | (msg[1] & 0x7f);
       this.val = this.num / 0x3fff;
       return true;
     }
     else if (this.msb && msg[0] == 0xb0 + this.chan && msg[2] == parseInt(msg[2])) {
       if (msg[1] == this.msb) {
         if (this.lsb) {
           this.num = (msg[2] << 7) | (this.num & 0x7f);
           this.val = this.num / 0x3fff;
         }
         else {
           this.num = msg[2] & 0x7f;
           this.val = this.num / 0x7f;
         }
         return true;
       }
       if (msg[1] == this.lsb) {
         this.num = (this.num & 0x3f80) | (msg[2] & 0x7f);
         this.val = this.num / 0x3fff;
         return true;
       }
     }
   };

 ////////////////////////////////////////////////////////////////////////////

   function _Span(ctrl, span, inner, stl, stl0, stl1) {
     this.ctrl = ctrl;
     this.span = span;
     this.inner = inner;
     this.stl = stl;
     this.stl0 = stl0;
     this.stl1 = stl1;
   }

   _Span.prototype.setInnerHTML = function(html) {
     this.inner.innerHTML = html;
     return this;
   };

   _Span.prototype.setStyle = function(s0, s1) {
     if (typeof s1 == 'undefined') s1 = s0;
     var k;
     for(k in s0) this.stl0[k] = s0[k];
     for(k in s1) this.stl1[k] = s1[k];
     _style(this.span, this.ctrl.isSelected() ? this.stl1 : this.stl0);
     _style(this.span, this.stl);
     return this;
   };



 });
