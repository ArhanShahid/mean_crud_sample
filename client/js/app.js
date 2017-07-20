var app = angular.module('app', ['ngResource']);
app.config(function () {
});
app.controller('appController', ['$scope', '$resource', function ($scope, $resource) {

    $scope.showEdit = false;

    $scope.name = {
        first: null,
        last: null
    };
    $scope.editname = {
        _id: null,
        first: null,
        last: null
    };
    function getNames() {
        var name = $resource('/api/get');
        name.get({}, function (res) {

            res.$promise.then(function (data) {
                $scope.list = data.data;
            })
        });
    }

    getNames();

    $scope.save = function (user) {
        console.log(user);

        if (user.first && user.last) {

            var name = $resource('/api/register');
            name.save({
                    name: user.first,
                    contact: user.last
                },
                function (res) {
                    console.log(res);
                    $scope.name.first = null;
                    $scope.name.last = null;
                    getNames();
                });

        } else {
            alert("Invalid Input");
        }
    };
    $scope.enableEdit = function (name) {

        $scope.showEdit = true;
        $scope.editname._id = name._id;
        $scope.editname.first = name.name;
        $scope.editname.last = name.contact;

    };

    $scope.edit = function (name) {
        console.log(name);
        if (name.first && name.last && name._id) {

            var user = $resource('/api/update/:id', {id: '@id'});
            user.save({
                    id: name._id
                },
                {
                    name: name.first,
                    contact: name.last
                },
                function (res) {
                    console.log(res);
                    $scope.showEdit = false;
                    getNames();
                });

        } else {
            alert("Invalid Input");
        }
    };
    $scope.delete = function (name) {
        var deleteUser = $resource('/api/delete/:id', {id: '@id'});
        deleteUser.delete({
                id: name._id
            },
            function (res) {
                console.log(res);
                getNames();
            })
    }
}]);