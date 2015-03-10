var NUM_OF_SNIPPETS = 20;

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {
  //success - db is ready
});

var User = require('./models/user')(mongoose);
var Group = require('./models/group')(mongoose);
var Snippet = require('./models/snippet')(mongoose);


var user1;
 User.findOne("54ff104a721d291df99a1087", function(err,user){
  console.log("create user", err?err:"", user);
  user1 = user;
  if (!err) createGroups();
 });

var snippetJobsFinished = 0;
var closeConnection = function(){
  if(snippetJobsFinished === NUM_OF_SNIPPETS){
      mongoose.connection.close();
    }
}

var group1;
var group2;
var group4;
var group3;

var createGroups = function(callback){

  Group.create({name: "Ruby", user:user1}, function(err, group){
    console.log("create group", err?err:"", group);
    group1 = group;
    Group.create({name: "HTML5", user:user1}, function(err, group){
        console.log("create group", err?err:"", group);
        group2 = group;
        Group.create({name: "CSS", user:user1}, function(err, group){
          console.log("create group", err?err:"", group);
          group3 = group;
          Group.create({name: "JavaScript", user:user1},function(err, group){
              console.log("create group", err?err:"", group);
              group4 = group;
              if (!err) executeSnippets();
              });
        });

      });
  });

}

var executeSnippets = function(){
  var snippetJava = "// it works until I use ctx.drawImage()\n"+
                   " $.ajax({\n"+
                   " type: \"POST\",\n"+
                   " url: \"save.php\",\n"+
                   " data: {image: dataURL},\n"+
                   " success: function()\n"+
                   " {\n"+
                   "     alert('saved');\n"+
                   " }\n"+
                "});";

  var snippetRuby = "s=' '.ord;a=s%b=s/s\n"+
                    "b.upto(s-b-b){|x|p \"#{x} #{a=b+b=a}\"}\n";

  var snippetHTML =
                    "<!-- Place favicon.ico and apple-touch-icon.png in the root of your domain and delete these references -->\n"+
                    "<link rel=\"shortcut icon\" href=\"/favicon.ico\">\n"+
                    "<link rel=\"apple-touch-icon\" href=\"/apple-touch-icon.png\">\n";

  var snippetCSS = "article, aside, figure, footer, header,\n"+
                    "hgroup, nav, section { display:block; }";

  for(var i=0;i<NUM_OF_SNIPPETS;i++){
      var group,snippet;

      if(i%4==0){
        group = group1;
        snippet = snippetRuby;
      }else if(i%3==0){
        group = group2;
        snippet = snippetHTML;
      }else if(i%2===0){
        group = group3;
        snippet = snippetCSS;
      }else{
        group = group4;
        snippet = snippetJava;
      }

    Snippet.create({content: snippet, group: group, user: user1, tags:[group.name,"#myidea"]}, function(err, snippet){
      console.log("create snippet", err?err:"", snippet);
      snippetJobsFinished++;
      closeConnection();
    });

  }

}



