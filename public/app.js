// Grab the articles as a json
$.getJSON("/articles", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        $("#articles").append("<div class='article-click' data-id='" + data[i]._id + "'>" + "<h5>" + data[i].title + "</h5>" + "<a href=" + data[i].link + " target='_blank'>" + data[i].link + "</a> </div><br>");
    }
});


// Whenever someone clicks a p tag
$(document).on("click", ".article-click", function () {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        // With that done, add the note information to the page
        .then(function (data) {
            // The title of the article
            $("#notes").append("<h5>" + data.title + "</h5><br>");
            // Create a div for notes to go into
            $("#notes").append("<div id='notes-list'></div>");
            // An input to enter a new title
            $("#notes").append("<input placeholder='Comment Title' id='titleinput' name='title' >");
            // A textarea to add a new note body
            $("#notes").append("<textarea id='bodyinput' placeholder='Comment Body' name='body'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
            $("#notes").append("<h5><u>Comments</u></h5>")

            // If there's a note in the article
            if (data.note) {
                for (var i = 0; i < data.note.length; i++) {
                    $("#notes").append("<h6><strong>" + data.note[i].title + "</strong></h6> <p>" + data.note[i].body + "</p>");
                }
            }
        });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // Value taken from title input
            title: $("#titleinput").val(),
            // Value taken from note textarea
            body: $("#bodyinput").val()
        }
    })
        // With that done
        .then(function (data) {
            // Empty the notes section
            $("#notes").empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});