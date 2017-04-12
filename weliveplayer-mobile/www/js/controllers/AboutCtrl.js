angular.module('weliveplayer.controllers.about', [])
    .controller('AboutCtrl', function($scope, $ionicModal, $timeout, $filter, $translate, Config) {

        var currentversion = 'v0.2.9';

        if (cordova.getAppVersion) {
          cordova.getAppVersion(function(version) {
              $scope.version = "v " + version;
          }, function(error) {
              $scope.version = currentversion;
              }
          );
        } else {
              $scope.version = currentversion;
        }

        $scope.information = Config.getAppInformation($translate.use());
        $scope.credits_info_p1 = Config.getCreditInfoP1($translate.use());

})
