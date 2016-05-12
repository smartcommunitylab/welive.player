angular.module('weliveplayer.controllers.about', [])
    .controller('AboutCtrl', function($scope, $ionicModal, $timeout, $filter, $translate, Config) {

        cordova.getAppVersion(function(version) {
            $scope.version = $filter('translate')('lbl_version') + " " + version;
        }, function(error) {
            $scope.version = $filter('translate')('lbl_version') + "0.1.9";
            }
        );

        // $scope.information = $filter('translate')('version_info');
        // $translate('version_info').then(function(info) {
        //     $scope.information = info;
        // });
        $scope.information = Config.getAppInformation($translate.use());

})
