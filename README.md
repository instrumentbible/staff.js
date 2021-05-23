# staff.js 🎼

A javascript library for displaying notes on a musical staff.

> Inspired by the `nslider` in MaxMSP.

Try the [live demo](https://instrumentbible.github.io/staff.js/).

# Features
 * show notes on a musical staff
 * touch on staff to update the note
 * change clef (treble, alto, tenor, bass, grand)
 * change accidental sharp or flat

#
![staffjs](https://user-images.githubusercontent.com/40344766/119275737-893a8100-bbcb-11eb-8e46-6af6ac413ef9.gif)


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


# Contributing
Any contributions you make are **greatly appreciated**. Any bugs and change requests are to be reported on the [issues tab](https://github.com/instrumentbible/instrument.bible/issues). If you don't like coding, you can contribute by becoming a sponsor.

[![GitHub Sponsors](https://img.shields.io/static/v1?label=&message=GitHub%20Sponsors&logo=github&logoColor=white&color=6e5494)](https://github.com/sponsors/instrumentbible) 
[![Patreon](https://img.shields.io/static/v1?label=&message=Support%20on%20Patreon&logo=Patreon&logoColor=white&color=f96854)](https://patreon.com/instrumentbible) 
[![Square](https://img.shields.io/static/v1?label=&message=Donate%20on%20Square&logo=Square&logoColor=white&color=28c101)](https://checkout.square.site/pay/31ba92dcb17e4a9c979c022b690659bb) 
[![Venmo](https://img.shields.io/static/v1?label=&message=Donate%20on%20Venmo&logo=Venmo&logoColor=white&color=3d95ce)](https://venmo.com/u/instrumentbible) 
[![PayPal](https://img.shields.io/static/v1?label=&message=Donate%20on%20PayPal&logo=PayPal&logoColor=white&color=009cde)](https://paypal.me/instrumentbible) 


# Questions?   
Please write to [contact@instrument.bible](mailto:contact@instrument.bible) or visit [instrument.bible](https://instrument.bible).
  
[![Discord](https://img.shields.io/static/v1?label=&message=Discord%20&logo=discord&logoColor=white&color=7289da)](https://discord.gg/VJDj7nt)  [![Twitter](https://img.shields.io/static/v1?label=&message=Twitter&logo=Twitter&logoColor=white&color=1DA1F2)](https://twitter.com/instrumentbible)  [![YouTube](https://img.shields.io/static/v1?label=&message=Youtube&logo=youtube&logoColor=white&color=FF0000)](https://youtube.com/channel/UCkw7klLsjYXYGzFT-9a3WMA)  [![Facebook](https://img.shields.io/static/v1?label=&message=Facebook&logo=facebook&logoColor=white&color=3c5a99)](https://facebook.com/instrumentbible)  [![LinkedIn](https://img.shields.io/static/v1?label=&message=LinkedIn&logo=LinkedIn&logoColor=white&color=0077b5)](https://linkedin.com/company/instrumentbible)  [![Instagram](https://img.shields.io/static/v1?label=&message=Instagram&logo=Instagram&logoColor=white&color=e1306c)](https://instagram.com/instrument.bible)
