// ==UserScript==
// @name        makeWebLogicSelectable
// @namespace   nl.qualogy.weblogic
// @description A small script to make text fields in WebLogic readable and editable
// @include     */console/console.portal*
// @version     1
// @grant       none
// ==/UserScript==

// Disable the disabled, enable the readonly ability
function makeSelectable(field) {
    field.disabled = false
    field.readOnly  = true
}

// Turn a text field into a textarea object
// Set the height of the box to the height of the content
function swapToSelecteableTextArea(field) {
    var input = document.createElement('TEXTAREA');
    input.setAttribute('cols',field.size);
    input.setAttribute('class','inputDisabled');
    input.value = field.value;
    field.parentNode.appendChild(input)

    // We hive instead of removing, otherwise we'll mess up the array of 
    // "input" fields used in our parent loop
    field.style.display = 'none';      
    input.style.height= input.scrollHeight + "px";
    return input
}

// Let's be absolutely positively sure that we will only change field style when the page 
// is in readonly mode 

// Find the lock button top left of the screen
lockButton = document.getElementsByName("save");
if(lockButton &&
    lockButton.length > 0 &&
    // Is it clickable? Then we might be in the correct mode
     !lockButton[0].disabled &&
     //And does the button link to "MakeChangesAction"? 
     lockButton[0].getAttribute('onclick').indexOf('MakeChangesAction') > -1) {
     
     // Find textareas that have been disabled
    var fields = document.getElementsByTagName("textarea")
    for(i = 0; i < fields.length; i++) {
        field = fields[i]
        if(field.disabled) {
            // Add a class, otherwise they'll appear as fully editable
            field.className = 'inputDisabled'
            makeSelectable(field)
        } 
    }

    // Find text input fields that have been disabled
    var fields = document.getElementsByTagName("input")
    for(i = 0; i < fields.length; i++) {
        field = fields[i]
        if(field.type == 'text' && field.disabled) {
            // If we're too big for our suit, get a textarea instead
            if(field.value.length > field.size) {
                field = swapToSelecteableTextArea(field)  
            } 
            makeSelectable(field)
        } 
    }
    
    // Done.             
}
