# staff.js 🎼

A javascript library for displaying notes on a musical staff.
> DISCLAIMER: this library is a work in progress

## Features

* Touch on staff to update the note
 * Change accidental sharp or flat

# Setup
import **staff.js** library
```html
<!-- import CSS -->
<link rel="stylesheet" href="css/staff.css" />

<!-- import JavaScript -->
<script src="js/JZZ.js"></script>
<script src="js/JZZ.input.Kbd.js"></script>
<script src="staff.js"></script>
```
add this HTML 
```html
<div id="myStaff"></div>
```

now you can use the library to create a staff
```javascript
// these are the options
var options = {
	id: "myStaff",
	clef: "treble",
	accidental: "flat",
	color: "#FF0000",
	scroll: false,
}

// create a new staff
var staff = newStaff(options)
```



```javascript
// create a new staff
var staff = newStaff({
	clef:"treble",
	accidental:"flat"
})
```



## update the staff
change the clef
```javascript
staff.setClef('bass');
```	

get the clef 
```javascript
staff.getClef();
// bass
```	


## Notes

Set the current note
```javascript
staff.setNote(88);
```	


Get current note
```javascript
staff.getNote('myStaff');
// 68
```	





change the accidental
```javascript
staff.setAccidental('sharp');
```	




### Chords
To display multiple notes, `setNote()` with an array.

```javascript
staff.setNote([45,55,62]);
```
OR
```javascript
var chord = [45,55,62];
staff.setNote(chord);
```

## TO DO
 - support for multiple staffs
 - refactor ledger line code
 - create a addNote() function
 - add way to make note color different from staff color
 - add key signatures
 - add microtonal notation
 - add way to change note stems
 - add way to show note names in nodehead
 - add way to show a scale
