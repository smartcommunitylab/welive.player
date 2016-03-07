angular.module('weliveplayer.controllers.profile', [])
    .controller('ProfileCtrl', function ($scope, $ionicModal, $timeout, LoginSrv) {
        
        var userId = "0";

        LoginSrv.makeCDVProfileCall(userId)
        
                .then(function (response) {
                     if (response) {
                         if (response.data.name) {
                             $scope.profile = response.data;
                             $scope.cdvProfile = 'exist';
                         } else {
                             $scope.cdvProfile = 'create';       
                         }
                       
                     }},
                     function (error) {
                      $scope.cdvProfile = 'create';
                     });
                     
        $scope.editProfile = function () {
            // $scope.cdvProfile = 'edit';
        }
        
        $scope.saveProfile = function (profile) {
            // alert(profile.name);
            $scope.cdvProfile = 'exist';
        }
                     
    })
