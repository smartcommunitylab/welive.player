angular.module('weliveplayer.controllers.about', [])
    .controller('AboutCtrl', function($scope, $ionicModal, $timeout, $filter, $translate, Config) {

        cordova.getAppVersion(function(version) {
            $scope.version = "v " + version;
        }, function(error) {
            $scope.version = "v " + "0.2.4";
            }
        );

        $scope.information = Config.getAppInformation($translate.use());
        $scope.credits_info_p1 = Config.getCreditInfoP1($translate.use());

})
