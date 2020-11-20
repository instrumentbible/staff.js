// Staff.js
class Staff {
	
	constructor(options) {
		
		// options
		this.accidental = options.accidental	|| 'flat';
		this.at 		= options.at			|| 'staff';
		this.clef 		= options.clef			|| 'treble';
		this.color 		= options.color			|| '#000000';
		this.id 		= options.id			|| 'myStaff';
		this.notes 		= options.notes			|| [60];
		// this.scroll 	= options.scroll		|| false;
		// this.font 		= options.font			|| 'Opus';

		// and create staff SVG element
		const newContent =  document.createElementNS("http://www.w3.org/2000/svg", "svg");
		newContent.setAttribute("id", this.id);
		newContent.innerHTML = staffSVG;
		document.getElementById(this.at).appendChild(newContent);

		// prevent scroll on touchmove
		newContent.addEventListener('touchmove', function(e) {
			e.preventDefault();
		}, { passive: false });

		
		// TO DO: test if this.id already exist
		
		/*
		 //Attempt to get the element using document.getElementById
		 var element = document.getElementById("test");
	  
		 //If it isn't "undefined" and it isn't "null", then it exists.
		 if(typeof(element) != 'undefined' && element != null){
			 alert('Element exists!');
		 } else{
			 alert('Element does not exist!');
		 }    //Attempt to get the element using document.getElementById
		 var element = document.getElementById("test");

		   //If it isn't "undefined" and it isn't "null", then it exists.
		   if(typeof(element) != 'undefined' && element != null){
			   alert('Element exists!');
		   } else{
			   alert('Element does not exist!');
		   }
			
		 */
		var thisStaff = this;
		
        // setup JZZ midi input
        var staffIn = JZZ.input.Kbd({
			at: this.id,
			keys: [
				['G1', 'G1'],  ['Ab1', 'Ab1'],  ['A1', 'A1'],  ['Bb1', 'Bb1'],  ['B1', 'B1'],  ['C2', 'C2'],  ['Db2', 'Db2'],  ['D2', 'D2'],  ['Eb2', 'Eb2'],  ['E2', 'E2'],  ['F2', 'F2'],  ['Gb2', 'Gb2'],
				['G2', 'G2'],  ['Ab2', 'Ab2'],  ['A2', 'A2'],  ['Bb2', 'Bb2'],  ['B2', 'B2'],  ['C3', 'C3'],  ['Db3', 'Db3'],  ['D3', 'D3'],  ['Eb3', 'Eb3'],  ['E3', 'E3'],  ['F3', 'F3'],  ['Gb3', 'Gb3'],
				['G3', 'G3'],  ['Ab3', 'Ab3'],  ['A3', 'A3'],  ['Bb3', 'Bb3'],  ['B3', 'B3'],  ['C4', 'C4'],  ['Db4', 'Db4'],  ['D4', 'D4'],  ['Eb4', 'Eb4'],  ['E4', 'E4'],  ['F4', 'F4'],  ['Gb4', 'Gb4'],
				['G4', 'G4'],  ['Ab4', 'Ab4'],  ['A4', 'A4'],  ['Bb4', 'Bb4'],  ['B4', 'B4'],  ['C5', 'C5'],  ['Db5', 'Db5'],  ['D5', 'D5'],  ['Eb5', 'Eb5'],  ['E5', 'E5'],  ['F5', 'F5'],  ['Gb5', 'Gb5'],
				['G5', 'G5'],  ['Ab5', 'Ab5'],  ['A5', 'A5'],  ['Bb5', 'Bb5'],  ['B5', 'B5'],  ['C6', 'C6'],  ['Db6', 'Db6'],  ['D6', 'D6'],  ['Eb6', 'Eb6'],  ['E6', 'E6'],  ['F6', 'F6'],  ['Gb6', 'Gb6'],
				['G6', 'G6'],  ['Ab6', 'Ab6'],  ['A6', 'A6'],  ['Bb6', 'Bb6'],  ['B6', 'B6'],  ['C7', 'C7'],  ['Db7', 'Db7'],  ['D7', 'D7'],  ['Eb7', 'Eb7'],  ['E7', 'E7'],  ['F7', 'F7'],  ['Gb7', 'Gb7'],
				['G7', 'G7'],  ['Ab7', 'Ab7'],  ['A7', 'A7'],  ['Bb7', 'Bb7'],  ['B7', 'B7'],  ['C8', 'C8'],  ['Db8', 'Db8'],  ['D8', 'D8'],  ['Eb8', 'Eb8'],  ['E8', 'E8'],  ['F8', 'F8'],  ['Gb8', 'Gb8'],
				['G8', 'G8'],  ['Ab8', 'Ab8'],  ['A8', 'A8'],  ['Bb8', 'Bb8'],  ['B8', 'B8'],  ['C9', 'C9'],  ['Db9', 'Db9'],  ['D9', 'D9'],  ['Eb9', 'Eb9'],  ['E9', 'E9'],  ['F9', 'F9'],  ['Gb9', 'Gb9'],
				['G9', 'G9'],  ['Ab9', 'Ab9'],  ['A9', 'A9'],  ['Bb9', 'Bb9'],  ['B9', 'B9'],  ['C10','C10'], ['Db10','Db10'], ['D10','D10'], ['Eb10','Eb10'], ['E10','E10'], ['F10','F10'], ['Gb10','Gb10'],
				['G10','G10']
			]
        }).connect(function(msg){
			if (msg.isNoteOn){
				thisStaff.setNotes([msg.getNote()])
			}
			
		});
		
		// set the clef
		this.setClef(this.clef);
	}
    
	// set clef (treble, alto, bass, tenor)
	setClef(clef) {
        this.clef = clef;
		var thisElm = this.id;
		
		// hide each clef
		var clefs = document.getElementById(this.id).getElementsByClassName('clef');
		for(var i = 0; i < clefs.length; i++){
			var a = clefs[i];
			a.style.display = 'none';
		}
	
		var showLines = []; // array of lines to show
		var hideLines = ['G3','B3','D4','F4','A4','C5','E5','G5','B5','D6','F6']; // lines to hide
		var viewBox = "0 290 230 260"; // viewBox for SVG
		var verticalHeight = 250;
		var scrollOffset   = 510;
		
        switch(clef) {
            case "grand":
				viewBox = "0 320 250 360";
				showLines = ['G3','B3','D4','F4','A4','E5','G5','B5','D6','F6'];
                verticalHeight = 350;
				scrollOffset   = 390;
				document.getElementById(this.id).getElementsByClassName('trebleClef')[0].style.display = 'block';
				document.getElementById(this.id).getElementsByClassName('trebleRect')[0].style.display = 'block';
				document.getElementById(this.id).getElementsByClassName('bassClef')[0].style.display = 'block';
				document.getElementById(this.id).getElementsByClassName('bassRect')[0].style.display = 'block';
            break;
            case "treble":
				viewBox = "0 295 230 260";
				showLines = ['E5','G5','B5','D6','F6'];
                verticalHeight = 250;
				scrollOffset   = 380;
				document.getElementById(this.id).getElementsByClassName('trebleClef')[0].style.display = 'block';
				document.getElementById(this.id).getElementsByClassName('trebleRect')[0].style.display = 'block';
            break;
            case "bass":
				viewBox = "0 445 230 260";
				showLines = ['G3','B3','D4','F4','A4'];
                verticalHeight = 250;
				scrollOffset   = 510;
				document.getElementById(this.id).getElementsByClassName('bassClef')[0].style.display = 'block';
				document.getElementById(this.id).getElementsByClassName('bassRect')[0].style.display = 'block';
            break;
            case "alto":
				viewBox = "0 370 230 260";
				showLines = ['F4','A4','C5','E5','G5'];
                verticalHeight = 250;
				scrollOffset   = 450;
				document.getElementById(this.id).getElementsByClassName('altoClef')[0].style.display = 'block';
				document.getElementById(this.id).getElementsByClassName('altoRect')[0].style.display = 'block';
            break;
            case "tenor":
				viewBox = "0 395 230 260";
				showLines =  ['D4','F4','A4','C5','E5'];
                verticalHeight = 250;
				scrollOffset   = 450;
				document.getElementById(this.id).getElementsByClassName('tenorClef')[0].style.display = 'block';
				document.getElementById(this.id).getElementsByClassName('tenorRect')[0].style.display = 'block';
            break;
				
				
        }
		
		// set viewBox
		document.getElementById(this.id).setAttribute("viewBox", viewBox);
		
		var theColor = this.color;
		// hide lines
		arr_diff(showLines, hideLines).forEach(function(key){
			document.getElementById(thisElm).getElementById(key).style.stroke = theColor;
			document.getElementById(thisElm).getElementById(key).style.opacity = 0;
		});
		
		// show lines
		showLines.forEach(function(key){
			document.getElementById(thisElm).getElementById(key).style.stroke = theColor;
			document.getElementById(thisElm).getElementById(key).style.opacity = 1;
		});

	}
    
	// set note
	setNotes(theNotes) {
		this.notes = theNotes;
		var thisElm = this.id;
		
		var dataType;
		
		// check if incoming value is a number
		// or an array, else throw an error
		try {
			if (Array.isArray(this.notes)){
				dataType = "array";
			}
			else if (typeof this.notes === 'number'){
				dataType = "number";
				var sdfg = this.notes;
				this.notes = [];
				this.notes.push(sdfg)
			}
			else {
				throw "setNotes() must receive an array or integer."
			}
			
		 }
		 catch(err) {
			 console.error(err);
		 }
		
		var numberOfNotes; // total number of notes
		
		if (dataType === "array"){

			// remove current notes
			const removeElements = (elms) => elms.forEach(el => el.remove());
			removeElements( document.querySelectorAll(".noteG") );
			
			
			numberOfNotes = this.notes.length;
			// for each array element....
			for(var i = 0; i < numberOfNotes; i++){
				var a = this.notes[i];

				// create new note inside noteGroup
				var svg = document.getElementById(thisElm).getElementsByClassName('noteGroup')[0]; //Get svg element
				var newGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');
				newGroup.setAttribute("class","noteG");

				var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
				newElement.setAttribute("transform","translate(125 500)");
				newElement.setAttribute("class","note");
				newElement.innerHTML = "a";
				//newElement.style.display = "block";
				svg.appendChild(newGroup);
				newGroup.appendChild(newElement);

				var noteValue = a;
				
				// get octave
				var octave = Math.floor((noteValue / 12) - 1);

				// get pitch class (C=0, C#=1, D=2, etc)
				var pitchClass = noteValue % 12;
										 
				var notePlacement = 0;
				var accidentals = [1,3,6,8,10];

				// is ACCIDENTAL
				if (accidentals.indexOf(pitchClass) >= 0) {
					if (this.accidental === "sharp") {
						var newSharp = document.createElementNS("http://www.w3.org/2000/svg", 'text');
						newSharp.setAttribute("transform","translate(100 0)");
						newSharp.setAttribute("class","sharp");
						newSharp.innerHTML = "#";
						newSharp.style.display = "block";
						newGroup.appendChild(newSharp);
						notePlacement = noteHeight[noteValue - 1];
					}
					else {
						var newFlat = document.createElementNS("http://www.w3.org/2000/svg", 'text');
						newFlat.setAttribute("transform","translate(105 0)");
						newFlat.setAttribute("class","flat");
						newFlat.innerHTML = "b";
						newFlat.style.display = "block";
						newGroup.appendChild(newFlat);
						notePlacement = noteHeight[noteValue + 1];
					}
				}
										 
				// is NATURAL
				else {
					notePlacement = noteHeight[noteValue];
				}

				// move note up/down
				 if (notePlacement === undefined || notePlacement == 0) {} else {
					newGroup.setAttribute('transform', "translate(0," + (500 + notePlacement) + ")");
					newElement.setAttribute('transform', "translate(145," + 0 + ")");
				 }
				this.ledgerLines();
										 
			}
			
		}
		else if (dataType === "number"){
			numberOfNotes = 1;
		}

		// how many notes in chord?
		//console.log(numberOfNotes)

	}
	
    
	// get clef (returns the current clef) (ex. 'bass')
    getClef(e) {
		return this.clef;
	}
	
	// get notes (returns array of current notes)
	getNotes(e) {
		return this.notes;
	}
    
	
	/*============= Ledger Lines =============*/
	ledgerLines(){
		var currentNotes = this.notes;
		var lo = arrayMin(currentNotes)
		var hi = arrayMax(currentNotes)
		
		var f10L = document.getElementById('f10L'), d10L = document.getElementById('d10L'), b9L = document.getElementById('b9L'), g9L = document.getElementById('g9L'), e9L = document.getElementById('e9L'), c9L = document.getElementById('c9L'), a8L = document.getElementById('a8L'), f8L = document.getElementById('f8L'), d8L = document.getElementById('d8L'), b7L = document.getElementById('b7L'), g7L = document.getElementById('g7L'), e7L = document.getElementById('e7L'), c7L = document.getElementById('c7L'), a6L = document.getElementById('a6L'), f6L = document.getElementById('f6L'), d6L = document.getElementById('d6L'), b5L = document.getElementById('b5L'), g5L = document.getElementById('g5L'), e5L = document.getElementById('e5L'), c5L = document.getElementById('c5L'), a4L = document.getElementById('a4L'), f4L = document.getElementById('f4L'), d4L = document.getElementById('d4L'), b3L = document.getElementById('b3L'), g3L = document.getElementById('g3L'), e3L = document.getElementById('e3L'), c3L = document.getElementById('c3L'), a2L = document.getElementById('a2L'), f2L = document.getElementById('f2L'), d2L = document.getElementById('d2L'), b1L = document.getElementById('b1L'), g1L = document.getElementById('g1L');

		 // Grand Clef
		 if(this.clef == 'grand') {
			 if (hi >= 125) {f10L.style.display = "block"} else                                                                                  {f10L.style.display = "none"}
			 if (hi >= 122) {d10L.style.display = "block"} else if (hi === 121 && this.accidental === "flat") {d10L.style.display = "block"}else {d10L.style.display = "none"}
			 if (hi >= 119) {b9L.style.display = "block"} else if (hi === 118 && this.accidental === "flat") {b9L.style.display = "block"} else {b9L.style.display = "none"}
			 if (hi >= 115) {g9L.style.display = "block"} else if (hi === 114 && this.accidental === "flat") {g9L.style.display = "block"} else {g9L.style.display = "none"}
			 if (hi >= 112) {e9L.style.display = "block"} else if (hi === 111 && this.accidental === "flat") {e9L.style.display = "block"} else {e9L.style.display = "none"}
			 if (hi >= 108) {c9L.style.display = "block"} else                                                                                   {c9L.style.display = "none"}
			 if (hi >= 105) {a8L.style.display = "block"} else if (hi === 104 && this.accidental === "flat") {a8L.style.display = "block"} else {a8L.style.display = "none"}
			 if (hi >= 101) {f8L.style.display = "block"} else                                                                                   {f8L.style.display = "none"}
			 if (hi >= 98)  {d8L.style.display = "block"} else if (hi === 97  && this.accidental === "flat") {d8L.style.display = "block"} else {d8L.style.display = "none"}
			 if (hi >= 95)  {b7L.style.display = "block"} else if (hi === 94  && this.accidental === "flat") {b7L.style.display = "block"} else {b7L.style.display = "none"}
			 if (hi >= 91)  {g7L.style.display = "block"} else if (hi === 90  && this.accidental === "flat") {g7L.style.display = "block"} else {g7L.style.display = "none"}
			 if (hi >= 88)  {e7L.style.display = "block"} else if (hi === 87  && this.accidental === "flat") {e7L.style.display = "block"} else {e7L.style.display = "none"}
			 if (hi >= 84)  {c7L.style.display = "block"} else                                                                                   {c7L.style.display = "none"}
			 if (hi >= 81)  {a6L.style.display = "block"} else if (hi === 80  && this.accidental === "flat") {a6L.style.display = "block"} else {a6L.style.display = "none"}
			 if (hi == 60 || lo == 60){c5L.style.display = "block"} else if(this.accidental === "flat"){if (hi === 60) {c5L.style.display = "block"} else {c5L.style.display = "none"}} else {if (hi >= 60 && lo <= 61 ) {c5L.style.display = "block"}  else {c5L.style.display = "none"}}
			 if (lo <= 40)  {e3L.style.display = "block"} else                                                                                   {e3L.style.display = "none"}
			 if (lo <= 36)  {c3L.style.display = "block"} else if (lo === 37  && this.accidental === "sharp")           {c3L.style.display = "block"} else {c3L.style.display = "none"}
			 if (lo <= 33)  {a2L.style.display = "block"} else if (lo === 34  && this.accidental === "sharp")           {a2L.style.display = "block"} else {a2L.style.display = "none"}
			 if (lo <= 29)  {f2L.style.display = "block"} else if (lo === 30  && this.accidental === "sharp")           {f2L.style.display = "block"} else {f2L.style.display = "none"}
			 if (lo <= 26)  {d2L.style.display = "block"} else if (lo === 27  && this.accidental === "sharp")           {d2L.style.display = "block"} else {d2L.style.display = "none"}
			 if (lo <= 23)  {b1L.style.display = "block"} else                                                                                   {b1L.style.display = "none"}
			 if (lo <= 19)  {g1L.style.display = "block"} else if (lo === 20  && this.accidental === "sharp")           {g1L.style.display = "block"} else {g1L.style.display = "none"}
		 }
		 // Treble Clef
		 if(this.clef == 'treble') {
			 // flip note stem direction
			  // if (hi > 71){ $('#note').html('X');} else { $('#note').html('x');  }
			 if (hi >= 125){f10L.style.display = "block"} else                                                                                   {f10L.style.display = "none"}
			 if (hi >= 122){d10L.style.display = "block"} else if (hi === 121 && this.accidental === "flat") {d10L.style.display = "block"}else {d10L.style.display = "none"}
			 if (hi >= 119) {b9L.style.display = "block"} else if (hi === 118 && this.accidental === "flat") {b9L.style.display = "block"} else {b9L.style.display = "none"}
			 if (hi >= 115) {g9L.style.display = "block"} else if (hi === 114 && this.accidental === "flat") {g9L.style.display = "block"} else {g9L.style.display = "none"}
			 if (hi >= 112) {e9L.style.display = "block"} else if (hi === 111 && this.accidental === "flat") {e9L.style.display = "block"} else {e9L.style.display = "none"}
			 if (hi >= 108) {c9L.style.display = "block"} else                                                                                   {c9L.style.display = "none"}
			 if (hi >= 105) {a8L.style.display = "block"} else if (hi === 104 && this.accidental === "flat") {a8L.style.display = "block"} else {a8L.style.display = "none"}
			 if (hi >= 101) {f8L.style.display = "block"} else                                                                                   {f8L.style.display = "none"}
			 if (hi >= 98)  {d8L.style.display = "block"} else if (hi === 97  && this.accidental === "flat") {d8L.style.display = "block"} else {d8L.style.display = "none"}
			 if (hi >= 95)  {b7L.style.display = "block"} else if (hi === 94  && this.accidental === "flat") {b7L.style.display = "block"} else {b7L.style.display = "none"}
			 if (hi >= 91)  {g7L.style.display = "block"} else if (hi === 90  && this.accidental === "flat") {g7L.style.display = "block"} else {g7L.style.display = "none"}
			 if (hi >= 88)  {e7L.style.display = "block"} else if (hi === 87  && this.accidental === "flat") {e7L.style.display = "block"} else {e7L.style.display = "none"}
			 if (hi >= 84)  {c7L.style.display = "block"} else                                                                                   {c7L.style.display = "none"}
			 if (hi >= 81)  {a6L.style.display = "block"} else if (hi === 80  && this.accidental === "flat") {a6L.style.display = "block"} else {a6L.style.display = "none"}
			 if (lo <= 60)  {c5L.style.display = "block"} else if (lo === 61  && this.accidental === "sharp")           {c5L.style.display = "block"} else {c5L.style.display = "none"}
			 if (lo <= 57)  {a4L.style.display = "block"} else if (lo === 58  && this.accidental === "sharp")           {a4L.style.display = "block"} else {a4L.style.display = "none"}
			 if (lo <= 53)  {f4L.style.display = "block"} else if (lo === 54  && this.accidental === "sharp")           {f4L.style.display = "block"} else {f4L.style.display = "none"}
			 if (lo <= 50)  {d4L.style.display = "block"} else if (lo === 51  && this.accidental === "sharp")           {d4L.style.display = "block"} else {d4L.style.display = "none"}
			 if (lo <= 47)  {b3L.style.display = "block"} else                                                                                   {b3L.style.display = "none"}
			 if (lo <= 43)  {g3L.style.display = "block"} else if (lo === 44  && this.accidental === "sharp")           {g3L.style.display = "block"} else {g3L.style.display = "none"}
			 if (lo <= 40)  {e3L.style.display = "block"} else                                                                                   {e3L.style.display = "none"}
			 if (lo <= 36)  {c3L.style.display = "block"} else if (lo === 37  && this.accidental === "sharp")           {c3L.style.display = "block"} else {c3L.style.display = "none"}
			 if (lo <= 33)  {a2L.style.display = "block"} else if (lo === 34  && this.accidental === "sharp")           {a2L.style.display = "block"} else {a2L.style.display = "none"}
			 if (lo <= 29)  {f2L.style.display = "block"} else if (lo === 30  && this.accidental === "sharp")           {f2L.style.display = "block"} else {f2L.style.display = "none"}
			 if (lo <= 26)  {d2L.style.display = "block"} else if (lo === 27  && this.accidental === "sharp")           {d2L.style.display = "block"} else {d2L.style.display = "none"}
			 if (lo <= 23)  {b1L.style.display = "block"} else                                                                                   {b1L.style.display = "none"}
			 if (lo <= 19)  {g1L.style.display = "block"} else if (lo === 20  && this.accidental === "sharp")           {g1L.style.display = "block"} else {g1L.style.display = "none"}
		 }

		 // Bass Clef
		 if(this.clef == 'bass') {
			// if (hi > 50){ $('#note').html('X');} else { $('#note').html('x');  }
			 if (hi >= 125){f10L.style.display = "block"} else                                                                                   {f10L.style.display = "none"}
			 if (hi >= 122){d10L.style.display = "block"} else if (hi === 121 && this.accidental === "flat") {d10L.style.display = "block"}else {d10L.style.display = "none"}
			 if (hi >= 119) {b9L.style.display = "block"} else if (hi === 118 && this.accidental === "flat") {b9L.style.display = "block"} else {b9L.style.display = "none"}
			 if (hi >= 115) {g9L.style.display = "block"} else if (hi === 114 && this.accidental === "flat") {g9L.style.display = "block"} else {g9L.style.display = "none"}
			 if (hi >= 112) {e9L.style.display = "block"} else if (hi === 111 && this.accidental === "flat") {e9L.style.display = "block"} else {e9L.style.display = "none"}
			 if (hi >= 108) {c9L.style.display = "block"} else                                                                                   {c9L.style.display = "none"}
			 if (hi >= 105) {a8L.style.display = "block"} else if (hi === 104 && this.accidental === "flat") {a8L.style.display = "block"} else {a8L.style.display = "none"}
			 if (hi >= 101) {f8L.style.display = "block"} else                                                                                   {f8L.style.display = "none"}
			 if (hi >= 98)  {d8L.style.display = "block"} else if (hi === 97  && this.accidental === "flat") {d8L.style.display = "block"} else {d8L.style.display = "none"}
			 if (hi >= 95)  {b7L.style.display = "block"} else if (hi === 94  && this.accidental === "flat") {b7L.style.display = "block"} else {b7L.style.display = "none"}
			 if (hi >= 91)  {g7L.style.display = "block"} else if (hi === 90  && this.accidental === "flat") {g7L.style.display = "block"} else {g7L.style.display = "none"}
			 if (hi >= 88)  {e7L.style.display = "block"} else if (hi === 87  && this.accidental === "flat") {e7L.style.display = "block"} else {e7L.style.display = "none"}
			 if (hi >= 84)  {c7L.style.display = "block"} else                                                                                   {c7L.style.display = "none"}
			 if (hi >= 81)  {a6L.style.display = "block"} else if (hi === 80  && this.accidental === "flat") {a6L.style.display = "block"} else {a6L.style.display = "none"}
			 if (hi >= 77)  {f6L.style.display = "block"} else                                                                                   {f6L.style.display = "none"}
			 if (hi >= 74)  {d6L.style.display = "block"} else if (hi === 73  && this.accidental === "flat") {d6L.style.display = "block"} else {d6L.style.display = "none"}
			 if (hi >= 71)  {b5L.style.display = "block"} else if (hi === 70  && this.accidental === "flat") {b5L.style.display = "block"} else {b5L.style.display = "none"}
			 if (hi >= 67)  {g5L.style.display = "block"} else if (hi === 66  && this.accidental === "flat") {g5L.style.display = "block"} else {g5L.style.display = "none"}
			 if (hi >= 64)  {e5L.style.display = "block"} else if (hi === 63  && this.accidental === "flat") {e5L.style.display = "block"} else {e5L.style.display = "none"}
			 if (hi >= 60)  {c5L.style.display = "block"} else                                                                                   {c5L.style.display = "none"}
			 if (lo <= 40)  {e3L.style.display = "block"} else                                                                                   {e3L.style.display = "none"}
			 if (lo <= 36)  {c3L.style.display = "block"} else if (lo === 37  && this.accidental === "sharp")           {c3L.style.display = "block"} else {c3L.style.display = "none"}
			 if (lo <= 33)  {a2L.style.display = "block"} else if (lo === 34  && this.accidental === "sharp")           {a2L.style.display = "block"} else {a2L.style.display = "none"}
			 if (lo <= 29)  {f2L.style.display = "block"} else if (lo === 30  && this.accidental === "sharp")           {f2L.style.display = "block"} else {f2L.style.display = "none"}
			 if (lo <= 26)  {d2L.style.display = "block"} else if (lo === 27  && this.accidental === "sharp")           {d2L.style.display = "block"} else {d2L.style.display = "none"}
			 if (lo <= 23)  {b1L.style.display = "block"} else                                                                                   {b1L.style.display = "none"}
			 if (lo <= 19)  {g1L.style.display = "block"} else if (lo === 20  && this.accidental === "sharp")           {g1L.style.display = "block"} else {g1L.style.display = "none"}
		 }

		 // Alto Clef
		 if(this.clef == 'alto') {
			 //if (hi > 60){ $('#note').html('X');} else { $('#note').html('x');  }
			 if (hi >= 119) {b9L.style.display = "block"} else if (hi === 118 && this.accidental === "flat") {b9L.style.display = "block"} else {b9L.style.display = "none"}
			 if (hi >= 115) {g9L.style.display = "block"} else if (hi === 114 && this.accidental === "flat") {g9L.style.display = "block"} else {g9L.style.display = "none"}
			 if (hi >= 112) {e9L.style.display = "block"} else if (hi === 111 && this.accidental === "flat") {e9L.style.display = "block"} else {e9L.style.display = "none"}
			 if (hi >= 108) {c9L.style.display = "block"} else                                                                                   {c9L.style.display = "none"}
			 if (hi >= 105) {a8L.style.display = "block"} else if (hi === 104 && this.accidental === "flat") {a8L.style.display = "block"} else {a8L.style.display = "none"}
			 if (hi >= 101) {f8L.style.display = "block"} else                                                                                   {f8L.style.display = "none"}
			 if (hi >= 98)  {d8L.style.display = "block"} else if (hi === 97  && this.accidental === "flat") {d8L.style.display = "block"} else {d8L.style.display = "none"}
			 if (hi >= 95)  {b7L.style.display = "block"} else if (hi === 94  && this.accidental === "flat") {b7L.style.display = "block"} else {b7L.style.display = "none"}
			 if (hi >= 91)  {g7L.style.display = "block"} else if (hi === 90  && this.accidental === "flat") {g7L.style.display = "block"} else {g7L.style.display = "none"}
			 if (hi >= 88)  {e7L.style.display = "block"} else if (hi === 87  && this.accidental === "flat") {e7L.style.display = "block"} else {e7L.style.display = "none"}
			 if (hi >= 84)  {c7L.style.display = "block"} else                                                                                   {c7L.style.display = "none"}
			 if (hi >= 81)  {a6L.style.display = "block"} else if (lo === 80  && this.accidental === "flat") {a6L.style.display = "block"} else {a6L.style.display = "none"}
			 if (hi >= 77)  {f6L.style.display = "block"} else                                                                                   {f6L.style.display = "none"}
			 if (hi >= 74)  {d6L.style.display = "block"} else if (lo === 73  && this.accidental === "flat") {d6L.style.display = "block"} else {d6L.style.display = "none"}
			 if (hi >= 71)  {b5L.style.display = "block"} else if (lo === 70  && this.accidental === "flat") {b5L.style.display = "block"} else {b5L.style.display = "none"}
			 if (lo <= 50)  {d4L.style.display = "block"} else if (lo === 51  && this.accidental === "sharp")           {d4L.style.display = "block"} else {d4L.style.display = "none"}
			 if (lo <= 47)  {b3L.style.display = "block"} else                                                                                   {b3L.style.display = "none"}
			 if (lo <= 43)  {g3L.style.display = "block"} else if (lo === 44  && this.accidental === "sharp")           {g3L.style.display = "block"} else {g3L.style.display = "none"}
			 if (lo <= 40)  {e3L.style.display = "block"} else                                                                                   {e3L.style.display = "none"}
			 if (lo <= 36)  {c3L.style.display = "block"} else if (lo === 37  && this.accidental === "sharp")           {c3L.style.display = "block"} else {c3L.style.display = "none"}
			 if (lo <= 33)  {a2L.style.display = "block"} else if (lo === 34  && this.accidental === "sharp")           {a2L.style.display = "block"} else {a2L.style.display = "none"}
			 if (lo <= 29)  {f2L.style.display = "block"} else if (lo === 30  && this.accidental === "sharp")           {f2L.style.display = "block"} else {f2L.style.display = "none"}
			 if (lo <= 26)  {d2L.style.display = "block"} else if (lo === 27  && this.accidental === "sharp")           {d2L.style.display = "block"} else {d2L.style.display = "none"}
			 if (lo <= 23)  {b1L.style.display = "block"} else                                                                                   {b1L.style.display = "none"}
			 if (lo <= 19)  {g1L.style.display = "block"} else if (lo === 20  && this.accidental === "sharp")           {g1L.style.display = "block"} else {g1L.style.display = "none"}
		 }
	 }
		
	
}

										 
// get difference between two arrays
function arr_diff (a1, a2) {
   var a = [], diff = [];
   for (var i = 0; i < a1.length; i++) { a[a1[i]] = true; }
   for (var i = 0; i < a2.length; i++) { if (a[a2[i]]) { delete a[a2[i]]; } else { a[a2[i]] = true;} }
   for (var k in a) { diff.push(k); }
   return diff;
}


// this is the innerHTML for the staff
var staffSVG = `
	<g>
		<path class="l1" id="G10" d="M 0,  12.5   L 10000,  12.5"  />
		<path class="l1" id="Gb10"d="M 0,  18.75  L 10000,  18.75" />
		<path class="l2" id="F10" d="M 0,  25     L 10000,  25"    />
		<path class="l2" id="E10" d="M 0,  36     L 10000,  36"    />
		<path class="l1" id="Eb10"d="M 0,  43.75  L 10000,  43.75" />
		<path class="l1" id="D10" d="M 0,  50     L 10000,  50"    />
		<path class="l1" id="Db10"d="M 0,  56.25  L 10000,  56.25" />
		<path class="l2" id="C10" d="M 0,  64.5   L 10000,  64.5"  />
		<path class="l2" id="B9"  d="M 0,  75     L 10000,  75"    />
		<path class="l1" id="Bb9" d="M 0,  81.25  L 10000,  81.25" />
		<path class="l1" id="A9"  d="M 0,  87.5   L 10000,  87.5"  />
		<path class="l1" id="Ab9" d="M 0,  93.75  L 10000,  93.75" />
		<path class="l1" id="G9"  d="M 0,  100    L 10000,  100"   />
		<path class="l2" id="Gb9" d="M 0,  106.25 L 10000,  106.25"/>
		<path class="l2" id="F9"  d="M 0,  112.5  L 10000,  112.5" />
		<path class="l1" id="E9"  d="M 0,  125    L 10000,  125"   />
		<path class="l1" id="Eb9" d="M 0,  131.25 L 10000,  131.25"/>
		<path class="l1" id="D9"  d="M 0,  137.5  L 10000,  137.5 "/>
		<path class="l2" id="Db9" d="M 0,  143.75 L 10000,  143.75"/>
		<path class="l1" id="C9"  d="M 0,  150    L 10000,  150"   />
		<path class="l1" id="B8"  d="M 0,  156.25 L 10000,  156.25"/>
		<path class="l1" id="Bb8" d="M 0,  162.5  L 10000,  162.5" />
		<path class="l1" id="A8"  d="M 0,  175    L 10000,  175"   />
		<path class="l2" id="Ab8" d="M 0,  181.25 L 10000,  181.25"/>
		<path class="l2" id="G8"  d="M 0,  185    L 10000,  185"   />
		<path class="l1" id="Gb8" d="M 0,  192.5  L 10000,  192.5" />
		<path class="l1" id="F8"  d="M 0,  200    L 10000,  200"   />
		<path class="l1" id="E8"  d="M 0,  206.25 L 10000,  206.25"/>
		<path class="l1" id="Eb8" d="M 0,  212.5  L 10000,  212.5" />
		<path class="l1" id="D8"  d="M 0,  225    L 10000,  225"   />
		<path class="l1" id="Db8" d="M 0,  231.25 L 10000,  231.25"/>
		<path class="l1" id="C8"  d="M 0,  237.5  L 10000,  237.5" />
		<path class="l1" id="B7"  d="M 0,  250    L 10000,  250"   />
		<path class="l1" id="Bb7" d="M 0,  256.25 L 10000,  256.25"/>
		<path class="l1" id="A7"  d="M 0,  262.5  L 10000,  262.5" />
		<path class="l1" id="Ab7" d="M 0,  268.75 L 10000,  268.75"/>
		<path class="l1" id="G7"  d="M 0,  275    L 10000,  275"   />
		<path class="l1" id="Gb7" d="M 0,  281.25 L 10000,  281.25"/>
		<path class="l2" id="F7"  d="M 0,  290    L 10000,  290"   />
		<path class="l2" id="E7"  d="M 0,  298.5  L 10000,  298.5" />
		<path class="l1" id="Eb7" d="M 0,  306.25 L 10000,  306.25"/>
		<path class="l1" id="D7"  d="M 0,  312.5  L 10000,  312.5" />
		<path class="l1" id="Db7" d="M 0,  318.75 L 10000,  318.75"/>
		<path class="l1" id="C7"  d="M 0,  325    L 10000,  325"   />
		<path class="l2" id="B6"  d="M 0,  333    L 10000,  333"   />
		<path class="l2" id="Bb6" d="M 0,  342    L 10000,  342"   />
		<path class="l1" id="A6"  d="M 0,  350    L 10000,  350"   />
		<path class="l1" id="Ab6" d="M 0,  356.25 L 10000,  356.25"/>
		<path class="l1" id="G6"  d="M 0,  362.5  L 10000,  362.5" />
		<path class="l1" id="Gb6" d="M 0,  368.75 L 10000,  368.75"/>
		<path class="l1" id="F6"  d="M 0,  375    L 10000,  375"   />
		<path class="l2" id="E6"  d="M 0,  383    L 10000,  383"   />
		<path class="l2" id="Eb6" d="M 0,  392.5  L 10000,  392.5" />
		<path class="l1" id="D6"  d="M 0,  400    L 10000,  400"   />
		<path class="l2" id="Db6" d="M 0,  408    L 10000,  408"   />
		<path class="l2" id="C6"  d="M 0,  417.5  L 10000,  417.5" />
		<path class="l1" id="B5"  d="M 0,  425    L 10000,  425"   />
		<path class="l1" id="Bb5" d="M 0,  431.25 L 10000,  431.25"/>
		<path class="l1" id="A5"  d="M 0,  437.5  L 10000,  437.5" />
		<path class="l1" id="Ab5" d="M 0,  443.75 L 10000,  443.75"/>
		<path class="l1" id="G5"  d="M 0,  450    L 10000,  450"   />
		<path class="l2" id="Gb5" d="M 0,  458    L 10000,  458"   />
		<path class="l2" id="F5"  d="M 0,  467.5  L 10000,  467.5" />
		<path class="l1" id="E5"  d="M 0,  475    L 10000,  475"   />
		<path class="l1" id="Eb5" d="M 0,  481.25 L 10000,  481.25"/>
		<path class="l1" id="D5"  d="M 0,  487.5  L 10000,  487.5" />
		<path class="l1" id="Db5" d="M 0,  493.75 L 10000,  493.75"/>
		<path class="l1" id="C5"  d="M 0,  500    L 10000,  500"   />
		<path class="l2" id="B4"  d="M 0,  508    L 10000,  508"   />
		<path class="l2" id="Bb4" d="M 0,  517.5  L 10000,  517.5" />
		<path class="l1" id="A4"  d="M 0,  525    L 10000,  525"   />
		<path class="l1" id="Ab4" d="M 0,  531.25 L 10000,  531.25"/>
		<path class="l1" id="G4"  d="M 0,  537.5  L 10000,  537.5" />
		<path class="l1" id="Gb4" d="M 0,  543.75 L 10000,  543.75"/>
		<path class="l1" id="F4"  d="M 0,  550    L 10000,  550"   />
		<path class="l2" id="E4"  d="M 0,  558    L 10000,  558"   />
		<path class="l2" id="Eb4" d="M 0,  567.5  L 10000,  567.5" />
		<path class="l1" id="D4"  d="M 0,  575    L 10000,  575"   />
		<path class="l2" id="Db4" d="M 0,  583    L 10000,  583"   />
		<path class="l2" id="C4"  d="M 0,  592.5  L 10000,  592.5" />
		<path class="l1" id="B3"  d="M 0,  600    L 10000,  600"   />
		<path class="l1" id="Bb3" d="M 0,  606.25 L 10000,  606.25"/>
		<path class="l1" id="A3"  d="M 0,  612.5  L 10000,  612.5" />
		<path class="l1" id="Ab3" d="M 0,  618.75 L 10000,  618.75"/>
		<path class="l1" id="G3"  d="M 0,  625    L 10000,  625"   />
		<path class="l2" id="Gb3" d="M 0,  632.5  L 10000,  632.5" />
		<path class="l2" id="F3"  d="M 0,  642    L 10000,  642"   />
		<path class="l1" id="E3"  d="M 0,  650    L 10000,  650"   />
		<path class="l1" id="Eb3" d="M 0,  656.25 L 10000,  656.25"/>
		<path class="l1" id="D3"  d="M 0,  662.5  L 10000,  662.5" />
		<path class="l1" id="Db3" d="M 0,  668.75 L 10000,  668.75"/>
		<path class="l1" id="C3"  d="M 0,  675    L 10000,  675"   />
		<path class="l1" id="B2"  d="M 0,  687.5  L 10000,  687.5" />
		<path class="l1" id="Bb2" d="M 0,  693.75 L 10000,  693.75"/>
		<path class="l1" id="A2"  d="M 0,  700    L 10000,  700"   />
		<path class="l1" id="Ab2" d="M 0,  706.25 L 10000,  706.25"/>
		<path class="l1" id="G2"  d="M 0,  712.5  L 10000,  712.5" />
		<path class="l1" id="Gb2" d="M 0,  718.75 L 10000,  718.75"/>
		<path class="l1" id="F2"  d="M 0,  725    L 10000,  725"   />
		<path class="l1" id="E2"  d="M 0,  737.5  L 10000,  737.5" />
		<path class="l1" id="Eb2" d="M 0,  743.75 L 10000,  743.75"/>
		<path class="l1" id="D2"  d="M 0,  750    L 10000,  750"   />
		<path class="l1" id="Db2" d="M 0,  756.25 L 10000,  756.25"/>
		<path class="l1" id="C2"  d="M 0,  762.5  L 10000,  762.5" />
		<path class="l1" id="B1"  d="M 0,  775    L 10000,  775"   />
		<path class="l1" id="Bb1" d="M 0,  781.25 L 10000,  781.25"/>
		<path class="l1" id="A1"  d="M 0,  787.5  L 10000,  787.5" />
		<path class="l1" id="Ab1" d="M 0,  793.75 L 10000,  793.75"/>
		<path class="l1" id="G1"  d="M 0,  800    L 10000,  800"   />
		<g class="ledgerLines">
			<path id="f10L" d="M 135,25  L 205, 25"  />
			<path id="d10L" d="M 135,50  L 205, 50"  />
			<path id="b9L" d="M 135,75  L 205, 75"  />
			<path id="g9L" d="M 135,100 L 205, 100" />
			<path id="e9L" d="M 135,125 L 205, 125" />
			<path id="c9L" d="M 135,150 L 205, 150" />
			<path id="a8L" d="M 135,175 L 205, 175" />
			<path id="f8L" d="M 135,200 L 205, 200" />
			<path id="d8L" d="M 135,225 L 205, 225" />
			<path id="b7L" d="M 135,250 L 205, 250" />
			<path id="g7L" d="M 135,275 L 205, 275" />
			<path id="e7L" d="M 135,300 L 205, 300" />
			<path id="c7L" d="M 135,325 L 205, 325" />
			<path id="a6L" d="M 135,350 L 205, 350" />
			<path id="f6L" d="M 135,375 L 205, 375" />
			<path id="d6L" d="M 135,400 L 205, 400" />
			<path id="b5L" d="M 135,425 L 205, 425" />
			<path id="g5L" d="M 135,450 L 205, 450" />
			<path id="e5L" d="M 135,475 L 205, 475" />
			<path id="c5L" d="M 135,500 L 205, 500" />
			<path id="a4L" d="M 135,525 L 205, 525" />
			<path id="f4L" d="M 135,550 L 205, 550" />
			<path id="d4L" d="M 135,575 L 205, 575" />
			<path id="b3L" d="M 135,600 L 205, 600" />
			<path id="g3L" d="M 135,625 L 205, 625" />
			<path id="e3L" d="M 135,650 L 205, 650" />
			<path id="c3L" d="M 135,675 L 205, 675" />
			<path id="a2L" d="M 135,700 L 205, 700" />
			<path id="f2L" d="M 135,725 L 205, 725" />
			<path id="d2L" d="M 135,750 L 205, 750" />
			<path id="b1L" d="M 135,775 L 205, 775" />
			<path id="g1L" d="M 135,800 L 205, 800" />
		</g>
		<g class="noteGroup"></g>


	<g id="clefs">
		<rect class="trebleRect" x="3" y="325" width="70" height="190" />
		<rect class="altoRect"   x="3" y="450" width="70" height="100" />
		<rect class="tenorRect"  x="3" y="450" width="70" height="100" />
		<rect class="bassRect"   x="3" y="525" width="70" height="90"  />
		<text class="clef trebleClef" x="0"  y="450">&</text>
		<text class="clef altoClef"   x="0"  y="500">B</text>
		<text class="clef tenorClef"  x="0"  y="500">B</text>
		<text class="clef bassClef"   x="10" y="550">?</text>
	</g>
</g>
`


// vertical translation (of notehead) based on MIDI note number
var noteHeight = {
	19:   300,   21:   287.5, 23:   275,
	24:   262.5, 26:   250,   28:   237.5,  29:   225,   31:   212.5, 33:   200,    35:   187.5,
	36:   175,   38:   162.5, 40:   150,    41:   137.5, 43:   125,   45:   112.5,  47:   100,
	48:   87.5,  50:   75,    52:   62.5,   53:   50,    55:   37.5,  57:   25,     59:   12.5,
	60:   0.01,  62:  -12.5,  64:  -25,     65:  -37.5,  67:  -50,    69:  -62.5,   71:  -75,
	72:  -87.5,  74:  -100 ,  76:  -112.5,  77:  -125 ,  79:  -137.5, 81:  -150,    83:  -162.5,
	84:  -175,   86:  -187.5, 88:  -200,    89:  -212.5, 91:  -225,   93:  -237.5,  95:  -250,
	96:  -262.5, 98:  -275,   100: -287.5,  101: -300,   103: -312.5, 105: -325,    107: -337.5,
	108: -350,   110: -362.5, 112: -375,    113: -387.5, 115: -400,   117: -412.5,  119: -425,
	120: -437.5, 122: -450,   124: -462.5,  125: -475,   127: -487.5,
}


									 
// get min/max of array
function arrayMin(arr) {
  return arr.reduce(function (p, v) { return ( p < v ? p : v ); });
}

function arrayMax(arr) {
  return arr.reduce(function (p, v) { return ( p > v ? p : v ); });
}
