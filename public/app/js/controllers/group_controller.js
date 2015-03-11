'use strict';

angular.module('cmndvninja').controller('GroupController',
  ['$scope', '$location','$document', 'Group', 'Shared','Snippet',
  function($scope, $location,$document, Group, Shared, Snippet){

  $.material.init()
  console.log('GroupController init', $location);

  $scope.groupData = {};
  $scope.$parent.userGroups = {};
  $scope.snippetCount = 0;
  $scope.snippetPastedText = "";
  $scope.data = {};
  $scope.formGroup = {
    image_url: "shit"
  };

  $scope.image_url = ""


  $scope.createGroup = function () {
    var image_url = $('#image_url_box').val()
    var description = $('#description_box').val()
    var name = $('#name_box').val()
    var group = {
      name: name,
      description: description,
      image_url: image_url,
      userId: Shared.userId
    }
    console.log('creating group:', group);
    Group.post(group);
  };


  $scope.shareGroup = function (group) {
    console.log('this group should be shared:', group)
  }

$scope.testGroups = [
  {
  _id: '1',
  name: 'My Snippets',
  content_count: 12,
  description: 'Douglas Crawfords favorite code' ,
  image_url: 'http://upload.wikimedia.org/wikipedia/commons/b/b7/Html-source-code.png'
  },

  {
    _id: '2',
   name: 'My Snippets',
  content_count: 12,
  description: 'Douglas Crawfords favorite code',
  image_url: 'http://upload.wikimedia.org/wikipedia/commons/b/b7/Html-source-code.png'
  },

  {
   _id: '3',
    name: 'My Snippets',
  content_count: 12,
  description: 'Douglas Crawfords favorite code',
  image_url: 'http://upload.wikimedia.org/wikipedia/commons/b/b7/Html-source-code.png'
  },

  {
    _id: '4',
   name: 'My Snippets',
  content_count: 12,
  description: 'Douglas Crawfords favorite code',
  image_url: 'http://upload.wikimedia.org/wikipedia/commons/b/b7/Html-source-code.png'
  },

  { _id: '5',
  name: 'My Snippets',
  content_count: 12,
  description: 'Douglas Crawfords favorite code',
  image_url: 'http://upload.wikimedia.org/wikipedia/commons/b/b7/Html-source-code.png'
  },

]


  var hiddenInput = document.getElementById("hidden-input");

  if($scope.$parent.user){
    Group.query({userId:$scope.$parent.user._id}).$promise.then(function(groups){
      $scope.groupData.groups = groups;
      $scope.$parent.userGroups = groups;
      //groups.forEach(function(item){item.snippetCount = item.snippetCount || 5});
    });
  }


  $scope.showGroup = function(id){
    console.log($scope.groupData);
    Shared.groups = $scope.groupData;
    Shared.currentGroupId = id;
    $location.path('groups/'+id + '/snippets');
  }
  $scope.firePasteSnippet = function($event){
    $event.stopPropagation();
       var evt = document.createEvent('KeyboardEvent');
        evt.initKeyEvent("keypress", false, true, null, false, false,
                         shift, false, keyCode(key), key.charCodeAt(0));
        document.dispatchEvent(evt);
  }

  $scope.pasteSnippet = function($event){
    var newSnippet = {};
    newSnippet.user = $scope.$parent.user._id;
    newSnippet.content = $scope.snippetPastedText;
    newSnippet.groupId =$scope.groupId;
    newSnippet.group = $scope.groupId;
    newSnippet.unique_handle = "Just added using CMD+V (" + (new Date()).toDateString()+")";
    console.log("new group snippets",newSnippet);

    Snippet.post(newSnippet).$promise.then(function(group){
      //animate
      //change count
            $scope.groupData.groups.forEach (
                  function(item){
                    if (item._id === newSnippet.groupId){
                      item.content_count+=1;
                    }
                  }
              );
      });
    if($event)$event.stopPropagation();
    // //console.log("Pasted Text", $scope.snippetPastedText);
    // var pressEvent = document.createEvent ("KeyboardEvent");
    // pressEvent.initKeyEvent ("keypress", true, true, window,
    // true, false, false, false,
    // 86, 0);

    // hiddenInput.dispatchEvent(pressEvent);
  }




  // var focusHiddenArea = function() {
  //     // In order to ensure that the browser will fire clipboard events, we always need to have something selected
  //   hiddenInput.value = ' ';
  //   hiddenInput.focus();
  //   //hiddenInput.select();
  // };

   document.addEventListener("paste", function(e) {
          console.log("Paste event", e);
          var text = e.clipboardData.getData("text/plain");
          console.log("Paste event", text);
          $scope.snippetPastedText = text;
          var activeGroup = $('.activegroup');
          $scope.groupId = activeGroup.data("id");
          $scope.pasteSnippet();
          //focusHiddenArea();
          //e.preventDefault();
      });

  // // Keep the hidden text area selected
  // document.addEventListener("mouseup", focusHiddenArea);

}]);
