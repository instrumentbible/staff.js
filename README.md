# staff.js 🎼

A javascript library for displaying notes on a musical staff.
Inspired by the `nslider` in MaxMSP.

> DISCLAIMER: this library is a work in progress

Try the [live demo](https://instrumentbible.github.io/staff.js/).

# Features
 * show notes on a musical staff
 * touch on staff to update the note
 * change clef (treble, alto, tenor, bass, grand)
 * change accidental sharp or flat

# Setup
import **staff.js** library
```html
<!-- import CSS -->
<link rel="stylesheet" href="css/staff.css" />

<!-- import JavaScript -->
<script src="js/JZZ.js"></script>
<script src="js/JZZ.input.Kbd.js"></script>
<script src="js/staff.js"></script>
```
add this HTML 
```html
<div id="myStaff"></div>
```

now you can use the library to create a staff
```js
// these are the options
var options = {
	id: "myStaff",
	clef: "treble",
	accidental: "flat",
	color: "#FF0000",
	scroll: false,
}

// create a new staff
var myStaff = new Staff(options)
```

```js
// create a new staff
var myStaff = new Staff({
	clef:"treble",
	accidental:"flat"
})
```



## clef
change the clef
```js
myStaff.setClef('bass');
```	

get the clef 
```js
myStaff.getClef();
// bass
```	


## Notes

Set the current note
```js
myStaff.setNote(88);
```	


Get current note
```js
myStaff.getNote('myStaff');
// 68
```	

change the accidental
```js
myStaff.setAccidental('sharp');
```	


### Chords
To display multiple notes, `setNote()` with an array.

```js
myStaff.setNote([45,55,62]);
```
OR
```js
var chord = [45,55,62];
myStaff.setNote(chord);
```

### Color
set the color

```js
myStaff.setColor('#FF0000');
```
get the color
```js
myStaff.getColor();
// #FF0000
```


## TO DO
 - support for multiple staffs
 - refactor ledger line code
 - create a `addNote()` function
 - add way to make note color different from staff color
 - add key signatures
 - add microtonal notation
 - add way to change note stems
 - add way to show note name in notehead
 - add way to show a scale


# Questions?   
Please write to [contact@instrument.bible](mailto://contact@instrument.bible) or visit [instrument.bible](https://instrument.bible).
  
![Discord](https://img.shields.io/static/v1?label=&message=Discord%20&logo=discord&logoColor=white&color=7289da&link=https://discord.gg/VJDj7nt) ![Twitter](https://img.shields.io/static/v1?label=&message=Twitter&logo=Twitter&logoColor=white&color=1DA1F2&link=https://twitter.col/instrumentbible) ![YouTube](https://img.shields.io/static/v1?label=&message=Youtube&logo=youtube&logoColor=white&color=FF5555&link=https://facebook.col/instrumentbible) ![Facebook](https://img.shields.io/static/v1?label=&message=Facebook&logo=facebook&logoColor=white&color=1877F2&link=https://facebook.col/instrumentbible) ![LinkedIn](https://img.shields.io/static/v1?label=&message=LinkedIn&logo=LinkedIn&logoColor=white&color=0077B5&link=https://facebook.col/instrumentbible) ![Instagram](https://img.shields.io/static/v1?label=&message=Instagram&logo=Instagram&logoColor=white&color=E4405F&link=https://instagram.col/instrumentbible)
