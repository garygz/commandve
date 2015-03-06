angular.module('users').factory('User', ['$resource', function($resource){
  return $resource('/api/users/:id', {id: '@_id'}, {
    query: {method:'GET', isArray:true},
    getOne: {method:'GET', isArray:false},
    post: {method:'POST'},
    update: {method:'PUT' },
    remove: {method:'DELETE'}
  });
}]);


angular.module('users').factory('Shared', [function($resource){
    return {};
}]);
