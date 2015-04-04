'use strict';

angular.module('cmndvninja').controller('GroupController',
  ['$scope', '$location','$document', 'Group', 'Shared','Snippet',
  function($scope, $location,$document, Group, Shared, Snippet){

  $.material.init()
  //console.log('GroupController init', $location);

  $scope.groupData = {};
  $scope.$parent.userGroups = {};
  $scope.snippetCount = 0;
  $scope.snippetPastedText = "";
  $scope.showAlert = false;
  $scope.image_url = ""


  $scope.deleteGroup = function($event, group) {
    group.userId = Shared.userId;
    group.user = Shared.userId;
    group.id = group._id
    if(Shared.loggingEnabled) console.log('the group you tried to delete is:', group);
    Group.remove(group);
    removeGroupFromDom(group);
    if($event)$event.stopPropagation()
  }

  /*TODO add to helper (also defined in snippetcontroller) */
  Array.prototype.getIndexBy = function (name, value) {
    for (var i = 0; i < this.length; i++) {
      if (this[i][name] == value) {
          return i;
      }
    }
  };

  var removeGroupFromDom = function(group) {
    var groups = $scope.groupData.groups
    groups.splice(groups.getIndexBy("_id", group._id), 1);
  }

  $scope.createGroup = function () {
    var image_url = $('#image_url_box').val()
    var description = $('#description_box').val()
    var name = $('#name_box').val()
    var group = {
      name: name,
      description: description,
      image_url: image_url,
      userId: Shared.userId,
      user: Shared.userId
    }
    if(Shared.loggingEnabled) console.log('creating group:', group);
    /*TODO: push the returned JSON
      object back into $scope.groups
      instead of getting them all
      back again */
    Group.post(group).$promise.then(function(){
      getGroups();}
    );
    // insertDefaultPicture(group);
    // $scope.groupData.groups.push(group);
  };

  /* This overrides the default picture setting on the server side.
  It's necessary because otherwise pictures don't show up until the page
  reloads */

  var insertDefaultPicture = function(obj) {
    if (!obj.image_url) {
      obj.image_url = 'app/img/default-code-image.png';
    }
  }

  $scope.shareGroup = function (group) {
    if(Shared.loggingEnabled) console.log('this group should be shared:', group)
  }

  var hiddenInput = document.getElementById("hidden-input");

  var getGroups = function(){
    if($scope.$parent.user){
      Group.query({userId:$scope.$parent.user._id}).$promise.then(function(groups){
        $scope.groupData.groups = groups;
        $scope.$parent.userGroups = groups;
        setTimeout($scope.positionGroups,200);
        setDefaultGroups();
        groups.forEach(function(item){item.snippetCount = item.snippetCount || 0});
      });
    }
  }

  $scope.positionGroups = function(){
    var vw = $( window ).width();
    //assume standard width of 230
    //TODO move constants to top
    var standardSize = 230,
        marginBetweenGroups = 8,
        //obtain from New Group element
        topOffset = $("#newGroupButton").offset().top + $("#newGroupButton").outerHeight() + 24,
        topMargin = 8,
        previousRowHeights = [],
        currentRowHeights = [],
        topPosition = topOffset,
        leftMargin = $("#newGroupButton").offset().left,
        leftOffset = 0,
        elementsPerRow = Math.floor((vw - leftMargin)/(standardSize)),
        column = 0;


    $(".group-panel").each(function(index){

      if(column === elementsPerRow){
        //next row
        previousRowHeights = currentRowHeights;
        currentRowHeights = [];
        leftOffset = leftMargin;
        column = 0;
      }

      leftOffset = standardSize*column+marginBetweenGroups + leftMargin;

      if(previousRowHeights[column]){
        topPosition = previousRowHeights[column] + topMargin;
      }
      console.log($(this).height());
      currentRowHeights.push($(this).height() + topPosition);

      $(this).offset({top: topPosition , left: leftOffset});
      column++;

    });


  }

  $( window ).resize(function() {
    positionGroups();
  });

  getGroups();

  //TODO set the property on the server side
  function setDefaultGroups () {
    var groups = $scope.groupData.groups;
    for (var i = 0; i < groups.length; i++){
      switch(groups[i].group_type) {
        case 'external':
          groups[i].defaultGroup = false;
          break
        case 'sublime':
          groups[i].defaultGroup = true;
          break
        // case 'external':  /* TODO: Give 'from web' a different type */
        //   groups[i].defaultGroup = true;
        //   break
        case 'github-gist':
          groups[i].defaultGroup = true;
          break
      }
      if (groups[i].name === "Found On The Web") {
        groups[i].defaultGroup = true;
      }
    }

    if(Shared.loggingEnabled) console.log($scope.groupData.groups);
  }

  $scope.showGroup = function(id){
    if(Shared.loggingEnabled) console.log($scope.groupData);
    Shared.groups = $scope.groupData.groups;
    Shared.currentGroupId = id;
    $location.path('groups/'+id + '/snippets');
  }
  $scope.firePasteSnippet = function($event){
    if(Shared.loggingEnabled) console.log("fire paste event");
    $event.stopPropagation();

  }

  $scope.pasteSnippet = function($event){
    var newSnippet = {};
    newSnippet.user = $scope.$parent.user._id;
    newSnippet.content = $scope.snippetPastedText;
    newSnippet.groupId =$scope.groupId;
    newSnippet.group = $scope.groupId;
    newSnippet.unique_handle = "Just added using CMD+V (" + (new Date()).toDateString()+")";
    if(Shared.loggingEnabled) console.log("new group snippets",newSnippet);

    Snippet.post(newSnippet).$promise.then(function(group){
      //animate
      //change count
      $("#alert-success-"+newSnippet.groupId).removeClass('hide');
      $scope.groupData.groups.forEach (
            function(item){
              if (item._id === newSnippet.groupId){
                item.content_count+=1;

                setTimeout(function(){ $("#alert-success-"+newSnippet.groupId).addClass('hide');}, 3000);
              }
            }
        );
      });


      if($event)$event.stopPropagation();

  }

   document.addEventListener("paste", function(e) {
          if(Shared.loggingEnabled) console.log("Paste event", e);
          var text = e.clipboardData.getData("text/plain");
          if(Shared.loggingEnabled) console.log("Paste event", text);
          $scope.snippetPastedText = text;
          var activeGroup = $('.activegroup');
          $scope.groupId = activeGroup.data("id");
          $scope.pasteSnippet();
          //focusHiddenArea();
          //e.preventDefault();
      });


}]);

// ]
