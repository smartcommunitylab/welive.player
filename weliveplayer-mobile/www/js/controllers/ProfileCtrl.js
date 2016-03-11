angular.module('weliveplayer.controllers.profile', [])
    .controller('ProfileCtrl', function ($scope, $ionicModal, $timeout, LoginSrv, StorageSrv) {
        
        var userId = StorageSrv.getLoggedInUserId();

        LoginSrv.makeCDVProfileCall(userId)
        
                .then(function (response) {
                     if (response) {
                         if (response.data.ccUserID) {
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
