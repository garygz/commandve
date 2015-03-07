var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;

//db.on('error', console.error.bind(console, 'connection error:'));

// db.once('open', function (callback) {
//   //success - db is ready
// });

// var User = require('./models/user')(mongoose);
// var Group = require('./models/group')(mongoose);
// var Snippet = require('./models/snippet')(mongoose);


// var user1 = User.create({username: 'garygz9819', email:"garygz9819@gmail.com", password: "123"});

// var group1 = Group.create({name: "Ruby"});
// var group2 = Group.create({name: "HTML5"});
// var group3 = Group.create({name: "CSS"});
// var group4 = Group.create({name: "JavaScript"});

// var snippetJava = "// it works until I use ctx.drawImage()\n"+
//                    " $.ajax({\n"+
//                    " type: \"POST\",\n"+
//                    " url: \"save.php\",\n"+
//                    " data: {image: dataURL},\n"+
//                    " success: function()\n"+
//                    " {\n"+
//                    "     alert('saved');\n"+
//                    " }\n"+
//                 "});";

// var snippetRuby = "s=' '.ord;a=s%b=s/s\n"+
//                   "b.upto(s-b-b){|x|p \"#{x} #{a=b+b=a}\"}\n";

// var snippetHTML =
//                   "<!-- Place favicon.ico and apple-touch-icon.png in the root of your domain and delete these references -->\n"+
//                   "<link rel=\"shortcut icon\" href=\"/favicon.ico\">\n"+
//                   "<link rel=\"apple-touch-icon\" href=\"/apple-touch-icon.png\">\n";

// var snippetCSS = "article, aside, figure, footer, header,\n"+
//                   "hgroup, nav, section { display:block; }";

// for(var i=0;i<20;i++){
//   var group,snippet;

//   if(i%4==0){
//     group = group1;
//     snippet = snippetRuby;
//   }else if(i%3==0){
//     group = group2;
//     snippet = snippetHTML;
//   }else if(i%2===0){
//     group = group3;
//     snippet = snippetCSS;
//   }else{
//     group = group4;
//     snippet = snippetJava;
//   }
//   Snippet.create({content: snippet, group: group, user: user1});
// }

mongoose.connection.close();


