angular.module('weliveplayer.controllers.home', [])
    .controller('HomeCtrl', function ($scope, $state, $ionicPopup, $timeout, Utils, PlayStore, Config, $filter) {

        // read it from user profile (pilotId).	
        $scope.selections = Utils.getUserPilotCity();

        // bottom buttons.
        $scope.pilotIds = Config.getPilotIds();


        var creationSuccess = function (apps) {
            $scope.items = apps;
            Utils.loaded();
        };

        var creationError = function (error) {
            Utils.loaded();
            Utils.toast();
        };

        Utils.loading();
        Utils.getAppsByRegion($scope.selections, false).then(creationSuccess, creationError);

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
                title: $filter('translate')('lbl_popup_title'),
                cssClass: "popup-title",
                scope: $scope,
                buttons: [
                    {
                        text: $filter('translate')('lbl_popup_button_cancel'),
                        type: 'button-small welive-popup-button',
                    },
                    {
                        text: $filter('translate')('lbl_popup_button_ok'),
                        type: 'button-small welive-popup-button',
                        onTap: function (e) {
                            if (!$scope.sort.choice) {
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
            Utils.getAppsByRegion($scope.selections, false).then(creationSuccess, creationError);
        }

        $scope.getStars = function (vote) {
            return Utils.getStars(vote);
        };

        $scope.doRefresh = function () {
            // alert($filter('translate')('lbl_home_refresh'));
            Utils.getAppsByRegion($scope.selections, true).then(
                function success(apps) {
                    $scope.items = apps;
                    $scope.$broadcast('scroll.refreshComplete');
                },
                function error() {
                    $scope.$broadcast('scroll.refreshComplete');
                }
                )
        }

    })

    .controller('AppDetailCtrl', function ($scope, $state, $ionicPopup, $timeout, Utils, PlayStore) {

        // get app info.
        $scope.app = Utils.getAppDetails($state.params.appId, $state.params.appRegion);

        $scope.selection = 'info';

        var appStoreId = "";
        if ($scope.app.url && $scope.app.url.length > 0) {
            if ($scope.app.url.indexOf("https://play.google.com/store/apps/details?id=") > -1) {
                var storeUri = $scope.app.url;
                appStoreId = storeUri.slice(storeUri.lastIndexOf("=") + 1, storeUri.length);
            }
        }

        var pilotId = $scope.app.city;
        
        // check if app is installed.
        navigator.startApp.check(appStoreId, function (message) { /* success */
            // console.log("app exists.");
            // console.log(message.versionName);
            // console.log(message.packageName);
            // console.log(message.versionCode);
            // console.log(message.applicationInfo);
            $scope.appInstallStatus = "forward";
        },
            function (error) { /* error */
                // console.log("app does not exist.");
                $scope.appInstallStatus = "download";
            });
    
    
        // sub controller.
        $scope.showAppComments = function () {
            // $scope.selection = 'userComment';
            $state.go('app.comments', { appId: $scope.app.id, appRegion: $scope.app.city });
        }

        $scope.download = function (id) {
            if ($scope.appInstallStatus == 'download') {
                if (appStoreId.length === 0) {
                    console.log("missing playstore id.")
                } else {
                    cordova.plugins.market.open(appStoreId, {
                        success: function () {
                            // lOG EVENT (APP DOWNLOAD)
                            Utils.logAppDownload(appStoreId, pilotId);
                        },
                        failure: function () {
                        }
                    });
                }


            } else if ($scope.appInstallStatus == 'forward') {
                if (appStoreId.length === 0) {
                    console.log("missing playstore id.")
                } else {
                    navigator.startApp.start(appStoreId, function (message) {
                        // console.log(message);
                        // lOG EVENT (APP OPEN)
                        Utils.logAppOpen(appStoreId, pilotId);
                    }, function (error) { /* error */
                        console.log(error);
                    });
                }

            }

        }

        $scope.info = function () {
            $scope.selection = 'info';
            $state.go('app.single', { appId: $scope.app.id, appRegion: $scope.app.city });
        }
   
        // read it from cache.
        $scope.stars = Utils.getStars(Utils.getAgreegateRating($scope.app));

    })

    .controller('AppCommentsCtrl', function ($scope, $state, $ionicPopup, $timeout, Utils, $q, PlayStore) {

        var app = Utils.getAppDetails($state.params.appId, $state.params.appRegion);

        var appStoreId = "";
        if (app.url && app.url.length > 0) {
            if (app.url.indexOf("https://play.google.com/store/apps/details?id=") > -1) {
                var storeUri = app.url;
                appStoreId = storeUri.slice(storeUri.lastIndexOf("=") + 1, storeUri.length);
            }
        }


        navigator.startApp.check(appStoreId, function (message) { /* success */
            // console.log("app exists.");
            $scope.appInstallStatus = "forward";
        }, function (error) { /* error */
            // console.log("app does not exist.");
            $scope.appInstallStatus = "download";
        });

        $scope.name = app.name;
        $scope.id = app.id;
        $scope.region = app.city;

        var pilotId = app.city;

        $scope.download = function (id) {
            if ($scope.appInstallStatus == 'download') {

                if (appStoreId.length === 0) {
                    console.log("missing playstore id.")
                } else {
                    cordova.plugins.market.open(appStoreId, {
                        success: function () {
                            // lOG EVENT (APP DOWNLOAD)
                            Utils.logAppDownload(appStoreId, pilotId);
                        },
                        failure: function () {
                        }
                    });
                }

            } else if ($scope.appInstallStatus == 'forward') {
                if (appStoreId.length === 0) {
                    console.log("missing playstore id.")
                } else {
                    navigator.startApp.start(appStoreId, function (message) {
                        // console.log(message);
                        // lOG EVENT (APP OPEN)
                        Utils.logAppOpen(appStoreId, pilotId);
                    }, function (error) {
                        console.log(error);
                    });
                }


            }
        }

        $scope.selection = 'userComment';

        $scope.info = function () {
            $scope.selection = 'info';
            $state.go('app.single', { appId: app.id, appRegion: app.city });
        }

        /*reviews*/
        var opts = {};
        opts.id = app.id;
        opts.start = 0;
        opts.count = 5;
        $scope.moreReviewsPossible = false;
        
        
        // default load.
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
        
        // infinite list reload.
        $scope.loadMoreReviews = function (reset) {
            if (opts.start === 0) {
                Utils.loading();
            }

            if (reset) {
                $scope.userReviews = null;
            }

            PlayStore.getUserReviews(opts).then(
                function (reviews) {

                    if (opts.start === 0) {
                        Utils.loaded();
                    } else {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }

                    $scope.userReviews = !!$scope.userReviews ? $scope.userReviews.concat(reviews) : reviews;

                    if (reviews.length === opts.count) {
                        $scope.moreReviewsPossible = true;
                        opts.start = reviews.length;
                        opts.count = opts.count + 5;
                    } else {
                        $scope.moreReviewsPossible = false;
                    }
                },
                function (error) {
                    if (opts.count === 0) {
                        Utils.loaded();
                    } else {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }

                    Utils.toast();

                    if ($scope.userReviews === null) {
                        $scope.userReviews = [];
                    }
                }
                );
        };

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

        $scope.getStars = function (vote) {
            return Utils.getStars(vote);
        };
    })
