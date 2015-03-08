angular.module('cmndvninja').factory('User', ['$resource', function($resource){
  return $resource('/api/users/:id', {id: '@_id'}, {
    query: {method:'GET', isArray:true},
    getOne: {method:'GET', isArray:false},
    post: {method:'POST'},
    update: {method:'PUT' },
    remove: {method:'DELETE'}
  });
}]);


angular.module('cmndvninja').factory('Shared', [function($resource){
    return {};
}]);

angular.module('cmndvninja').factory('Snippet', ['$resource', function($resource){
  return $resource('/api/snippets/:id', {id: '@_id'}, {
    query: {method:'GET', isArray:true},
    getOne: {method:'GET', isArray:false},
    post: {method:'POST'},
    update: {method:'PUT' },
    remove: {method:'DELETE'}
  });
}]);

angular.module('cmndvninja').factory('Group', ['$resource', 'Shared', function($resource){
  Group = $resource('/api/users/:userId/groups/:id', {id: '@_id', userId: '@userId'}, {
    query: {method:'GET', isArray:true},
    getOne: {method:'GET', isArray:false},
    post: {method:'POST'},
    update: {method:'PUT' },
    remove: {method:'DELETE'}
  });

  return Group;
}]);

