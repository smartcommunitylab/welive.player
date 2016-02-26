angular.module('weliveplayer.controllers.home', [])
    .controller('HomeCtrl', function ($scope, $state, $ionicPopup, $timeout, Utils, PlayStore) {

        $scope.selections = ['Novisad'];	
        //$scope.items = Utils.getAppsByRegion($scope.selections);	
   
        var creationSuccess = function (apps) {
            $scope.items = apps;
            Utils.loaded();
        };

        var creationError = function (error) {
            Utils.loaded();
            Utils.toast();
        };

        Utils.loading();
        Utils.getAppsByRegion($scope.selections).then(creationSuccess, creationError);

        $scope.sort = {};
        $scope.sort.choice = 'Consigliati';

        // sub controller.
        $scope.showAppDetails = function (id, region) {
            $state.go('app.single', { appId: id, appRegion: region });
        }

        $scope.showSearchInput = function () {
            $state.go('app.search');
        }

        $scope.showPopup = function () {

            var myPopup = $ionicPopup.show({
                templateUrl: "templates/sort.html",
                title: "Scegli Una Ordinamento",
                scope: $scope,
                buttons: [
                    {
                        text: 'ANNULLA',
                        type: 'button-small welive-popup-button',
                    },
                    {
                        text: 'ORDINA',
                        type: 'button-small welive-popup-button',
                        onTap: function (e) {
                            if (!$scope.sort.choice) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                return $scope.sort.choice;
                            }
                        }
                    },
                ]
            });
            myPopup.then(function (res) {
                $scope.items = Utils.orderByType($scope.sort.choice, $scope.items);

            });
        };

        $scope.selectApps = function (city) {

            // remove city from selection
            var index = $scope.selections.indexOf(city);

            if (index > -1) {
                $scope.selections.splice(index, 1);
            } else {
                $scope.selections.push(city);
            }

            Utils.loading();
            Utils.getAppsByRegion($scope.selections).then(creationSuccess, creationError);
        }

        $scope.getStars = function (vote) {
            return Utils.getStars(vote);
        };

    })

    .controller('AppDetailCtrl', function ($scope, $state, $ionicPopup, $timeout, Utils, PlayStore) {

        // get app info.
        $scope.app = Utils.getAppDetails($state.params.appId, $state.params.appRegion);

        $scope.selection = 'info';

        var appStoreId = "eu.trentorise.smartcampus.viaggiarovereto"; //com.twitter.android
        var pilotId = $scope.app.city;
        
        // check if app is installed.
        navigator.startApp.check(appStoreId, function (message) { /* success */
            console.log("app exists.");
            // console.log(message.versionName);
            // console.log(message.packageName);
            // console.log(message.versionCode);
            // console.log(message.applicationInfo);
            $scope.appInstallStatus = "forward";
        },
            function (error) { /* error */
                console.log("app does not exist.");
                $scope.appInstallStatus = "download";
            });
    
    
        // sub controller.
        $scope.showAppComments = function () {
            // $scope.selection = 'userComment';
            $state.go('app.comments', { appId: $scope.app.id, appRegion: $scope.app.city });
        }

        $scope.download = function (id) {
            if ($scope.appInstallStatus == 'download') {
                cordova.plugins.market.open(appStoreId, {
                    success: function () {
                        // lOG EVENT (APP DOWNLOAD)
                        Utils.logAppDownload(appStoreId, pilotId);
                    },
                    failure: function () {
                    }
                });

            } else if ($scope.appInstallStatus == 'forward') {
                navigator.startApp.start(appStoreId, function (message) {
                    console.log(message);
                    // lOG EVENT (APP OPEN)
                    Utils.logAppOpen(appStoreId, pilotId);
                }, function (error) { /* error */
                    console.log(error);
                });
            }

        }

        $scope.info = function () {
            $scope.selection = 'info';
            $state.go('app.single', { appId: $scope.app.id, appRegion: $scope.app.city });
        }
   
        // read it from cache.
        $scope.stars = Utils.getStars(Utils.getAgreegateRating($scope.app));
   
        /**
        var creationSuccess = function (agreegate) {
            $scope.stars = Utils.getStars(agreegate[0]);
        };
     
        var creationError = function (error) {
            
        };
     
        PlayStore.getAgreegateReview($scope.app.storeId).then(creationSuccess, creationError);*/

    })

    .controller('AppCommentsCtrl', function ($scope, $state, $ionicPopup, $timeout, Utils, $q, PlayStore) {

        var app = Utils.getAppDetails($state.params.appId, $state.params.appRegion);

        navigator.startApp.check("com.twitter.android", function (message) { /* success */
            console.log("app exists.");
            $scope.appInstallStatus = "forward";
        }, function (error) { /* error */
            console.log("app does not exist.");
            $scope.appInstallStatus = "download";
        });

        $scope.name = app.name;
        $scope.id = app.id;
        $scope.region = app.city;
        var appStoreId = "eu.trentorise.smartcampus.viaggiatrento";
        var pilotId = app.city;

        $scope.download = function (id) {
            if ($scope.appInstallStatus == 'download') {
                cordova.plugins.market.open(appStoreId, {
                    success: function () {
                        // lOG EVENT (APP DOWNLOAD)
                        Utils.logAppDownload(appStoreId, pilotId);
                    },
                    failure: function () {
                    }
                });
            } else if ($scope.appInstallStatus == 'forward') {
                navigator.startApp.start(appStoreId, function (message) {
                    console.log(message);
                    // lOG EVENT (APP OPEN)
                    Utils.logAppOpen(appStoreId, pilotId);
                }, function (error) {
                    console.log(error);
                });
            }
        }

        $scope.selection = 'userComment';

        $scope.info = function () {
            $scope.selection = 'info';
            $state.go('app.single', { appId: app.id, appRegion: app.city });
        }

        var opts = {};

        opts.id = app.id;
        opts.storeId = app.eId;
        opts.city = app.city;
        opts.sort = "newest";
        opts.page = 0;
        opts.lang = "it";
        opts.reviewType = 0;

        var creationSuccess = function (reviews) {
            $scope.userReviews = reviews;
            Utils.loaded();
        };

        var creationError = function (error) {
            Utils.loaded();
            Utils.toast();
        };

        Utils.loading();
        PlayStore.getUserReviews(opts).then(creationSuccess, creationError);
    })

    .controller('AppSearchCtrl', function ($scope, $state, $ionicPopup, $timeout, Utils) {

        $scope.formData = {};
        $scope.doSearch = function () {
            $scope.searchApps = Utils.searchApp($scope.formData.searchString);
        }

        // sub controller.
        $scope.showAppDetails = function (id, region) {
            $state.go('app.single', { appId: id, appRegion: region });
        }
    })
