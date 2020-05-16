var express = require("express");
var path = require("path"); 
var fs = require("fs")
var notes = [];

var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Read data from db.json and save to notes variable
fs.readFile('./db/db.json', 'utf8', function(err, data){ 
  if (err){
    console.error(err);
    return
  }
    notes = JSON.parse(data);
});
    
  
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function(req, res){
    res.json(notes) 
}); 

app.post("/api/notes", function(req, res){

  var newNote = req.body;
  notes.push(newNote);
  rewriteFile();
  res.json(newNote);
  
});

app.delete("/api/notes/:id", function(req, res){

  var chosen = req.params.id;

  for (let i = 0; i < notes.length; i++) {
    if (notes[i].id == chosen){
      notes.splice(i,1)
    }
  }

  rewriteFile();
  res.json("")
  
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