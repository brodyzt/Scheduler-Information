function changeColors() {
    var blocks = document.getElementsByClassName("fc-time-grid-event");
    for (var i = 0; i < blocks.length; i++) {

        if(classOpen(blocks[i])) {
            blocks[i].style.backgroundColor = "green"
        } else {
            blocks[i].style.backgroundColor = "red";
        }
        addAvailability(blocks[i]);
    }
    console.log("RUN!");
}

function addAvailability(draggableBlock) {
    var classIdentifier = getClassIdentifierFromBlock(draggableBlock);
    if(classIdentifier in dictionary) {
        draggableBlock.innerHTML = draggableBlock.innerHTML.replace("To Be Assigned", dictionary[classIdentifier].availableSeats + "/" + dictionary[classIdentifier].capacity)
    }
}

function getClassIdentifierFromBlock(draggableBlock) {
    var nameString = draggableBlock.innerHTML.substring(draggableBlock.innerHTML.search('<span style="font-weight:bold;font-size:1.0em;">') + '<span style="font-weight:bold;font-size:1.0em;">'.length);
    var className = nameString.substring(0, nameString.search("<"));

    var sectionString = draggableBlock.innerHTML.substring(draggableBlock.innerHTML.search('<span style="font-size:0.9em;">') + '<span style="font-size:0.9em;">'.length + 4);
    var section = sectionString.substring(0, sectionString.search("<"));
    console.log(className + section);

    var classIdentifier = className + section;

    return classIdentifier;
}

function classOpen(draggableBlock) {
    var classIdentifier = getClassIdentifierFromBlock(draggableBlock);

    if(classIdentifier in dictionary) {
        return dictionary[classIdentifier].availableSeats !== "0";
    } else {
        return true;
    }
}

class ClassObject {
    constructor(name, section, identifier, capacity, enrollmentTotal, availableSeats) {
        this.name = name;
        this.section = section;
        this.identifier = identifier;
        this.capacity = capacity;
        this.enrollmentTotal = enrollmentTotal;
        this.availableSeats = availableSeats;
    }

}

var data = [];
var dictionary = {};

function update() {
    $(this).unbind('DOMSubtreeModified');
    setTimeout(function() {
        changeColors();
        $(".fc-content-skeleton").bind('DOMSubtreeModified', update)
    }, 500);
}

$(".fc-content-skeleton").bind('DOMSubtreeModified', update)
$.getJSON(chrome.extension.getURL("run_results.json"), function(json) {
    var i = 0;
    for(var element in json["list1"]) {

        /*console.log(i);
        i++;
        console.log(element);
        console.log(json["list1"][element]["ClassName"]);
        */

        var tempClass = new ClassObject();
        var titleString = json["list1"][element]["ClassName"]
        tempClass.name = titleString.substring(0, titleString.search(" ") + 5);
        tempClass.section = titleString.substring(titleString.search(" ") + 8, titleString.search(" ") + 11);
        tempClass.identifier = tempClass.name + tempClass.section;
        console.log(tempClass.identifier);
        tempClass.capacity = json["list1"][element]["Capacity"];
        tempClass.enrollmentTotal = json["list1"][element]["EnrollmentTotal"];
        tempClass.availableSeats = json["list1"][element]["AvailableSeats"];
        dictionary[tempClass.identifier] = tempClass;
    }
    console.log(dictionary);
})
