'use strict';

angular.module('cmndvninja').controller('GroupController',
  ['$scope', '$location','$document', 'Group', 'Shared','Snippet',
  function($scope, $location,$document, Group, Shared, Snippet){

  console.log('GroupController init', $location);

  $scope.groupData = {};
  $scope.$parent.userGroups = {};
  $scope.snippetCount = 0;
  $scope.snippetPastedText = "";

  var hiddenInput = document.getElementById("hidden-input");

  if($scope.$parent.user){
    Group.query({userId:$scope.$parent.user._id}).$promise.then(function(groups){
      $scope.groupData.groups = groups;
      $scope.$parent.userGroups = groups;
      //groups.forEach(function(item){item.snippetCount = item.snippetCount || 5});
    });
  }


  $scope.showGroup = function(id){
    $location.path('groups/'+id + '/snippets');
    Shared.currentGroupId = id;
  }

  $scope.pasteSnippet = function(){
    var newSnippet = {};
    newSnippet.user = $scope.$parent.user._id;
    newSnippet.content = $scope.snippetPastedText;
    newSnippet.groupId =$scope.groupId;
    newSnippet.group = $scope.groupId;
    newSnippet.unique_handle = "Just added using CMD+V (" + Date.now().toDateString()+")";
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
