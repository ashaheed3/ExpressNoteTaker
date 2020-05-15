var express = require("express");
var path = require("path"); 
var fs = require("fs")
var db = require("./db/db.json");
var notes = {};

var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

fs.readFile('./db/db.json', 'utf8', function(err, data){ 
  if (err){
    console.error(err);
    return
  }
    notes = JSON.parse(data);
});
    
  // Display the file content 


// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function(req, res){

    // let test = {"id":[{"title":"Test Title","text":"Test text"}]}
    // notes.push(test)
  
    res.json(notes)
    
}); 

app.post("/api/notes", function(req, res){

  // let test = {"id":[{"title":"Test Title","text":"Test text"}]}
  // notes.push(test)
  var newNote = req.body;
  notes.push(newNote);

  rewriteFile();


  res.json(newNote);
  
});

app.delete("/api/notes/:id", function(req, res){

  var chosen = req.params.id;

  if (notes[chosen] !== null){
    delete notes[chosen];
  }

  rewriteFile();

  
});

app.get("/*", function(req, res){
  res.sendFile(path.join(__dirname, "./public/index.html"));
});



app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});


function rewriteFile(){

  fs.writeFile('./db/db.json', JSON.stringify(notes), function (err) {
    if (err) return console.log(err);
    console.log('Successfully wrote to db.json');
  });

}