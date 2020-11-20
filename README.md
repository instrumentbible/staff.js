# staff.js 🎼
![GitHub](https://img.shields.io/github/license/instrumentbible/staff.js)

A javascript library for displaying notes on a musical staff.

## Features

 * Touch on staff to update the note
 * Change accidental sharp or flat

# Setup
import **staff.js** library
```html
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
 - add key signatures
 - add microtonal notation
 - add way to change note stems
 - add way to show note names in nodehead
 - add way to show a scale
