angular.module('weliveplayer.controllers.profile', [])
    .controller('ProfileCtrl', function ($scope, $ionicModal, $timeout, LoginSrv) {
        
        var userId = "0";

        LoginSrv.makeCDVProfileCall(userId)
        
                .then(function (response) {
                     if (response) {
                       $scope.profile = response.data
                     }},
                     function (error) {
                     });
    })
