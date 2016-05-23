angular.module('weliveplayer.controllers.home', [])

    .controller('LoginCtrl', function ($scope, $rootScope, $ionicPlatform, $state, $ionicPopup, $timeout) {

        $ionicPlatform.ready(function () {
            $rootScope.login();
        });

    })

    .controller('HomeCtrl', function ($scope, $state, $ionicPopup, $timeout, Utils, PlayStore, Config, $filter) {

        $scope.hideSearchInput = true;
        var opts = {};
        opts.start = 0;
        opts.count = 20;
        $scope.moreAppsPossible = false;
        $scope.sort = {};
        $scope.sort.choice = 'Consigliati';
        

        // read it from user profile (pilotId).
        $scope.selections = Utils.getUserPilotCity();

        // bottom buttons.
        $scope.pilotIds = Config.getPilotIds();


        var creationSuccess = function (apps) {
            // $scope.items = apps;
            $scope.items = Utils.orderByType($scope.sort.choice, apps);
            Utils.loaded();
        };

        var creationError = function (error) {
            Utils.loaded();
            Utils.toast($filter('translate')('lbl_error'));
        };

        // before routine.
        $scope.$on('$ionicView.enter', function () {
            $scope.hideSearchInput = true;
            Utils.loading();
            Utils.getAppsByRegion($scope.selections, false, opts).then(creationSuccess, creationError);
            
        });

        // sub controller.
        $scope.showAppDetails = function (id, region) {
            $state.go('app.single', {
                appId: id
                , appRegion: region
            });
        }

        $scope.showSearchInput = function () {
            $state.go('app.search');
        }

        $scope.formData = {};
        $scope.doSearch = function () {
            if ($scope.hideSearchInput) {
                $scope.hideSearchInput = false;
            } else {
                if ($scope.formData.searchString) {
                    $scope.items = Utils.searchApp($scope.formData.searchString);
                }
                $scope.hideSearchInput = true;
            }
        }

        $scope.showPopup = function () {

            var myPopup = $ionicPopup.show({
                templateUrl: "templates/sort.html"
                , title: $filter('translate')('lbl_popup_title')
                , cssClass: "popup-title"
                , scope: $scope
                , buttons: [
                    {
                        text: $filter('translate')('lbl_popup_button_cancel')
                        , type: 'button-small welive-popup-button'
                        ,
                    }
                    , {
                        text: $filter('translate')('lbl_popup_button_ok')
                        , type: 'button-small welive-popup-button'
                        , onTap: function (e) {
                            if (!$scope.sort.choice) {
                                e.preventDefault();
                            } else {
                                return $scope.sort.choice;
                            }
                        }
                    }



                    ,]
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
            Utils.getAppsByRegion($scope.selections, false, opts).then(creationSuccess, creationError);
        }

        $scope.getStars = function (vote) {
            return Utils.getStars(vote);
        };

        $scope.doRefresh = function () {
            // alert($filter('translate')('lbl_home_refresh'));
            $scope.hideSearchInput = true;
            Utils.getAppsByRegion($scope.selections, true, opts).then(
                function success(apps) {
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.items = Utils.orderByType($scope.sort.choice, apps);
                }
                , function error() {
                    $scope.$broadcast('scroll.refreshComplete');
                    Utils.toast($filter('translate')('lbl_error'));
                }
            )
        }

        // infinite list reload.
        $scope.loadMoreApps = function (reset) {
            if (opts.start === 0) {
                Utils.loading();
            }

            if (reset) {
                $scope.items = null;
            }

            Utils.getAppsByRegion($scope.selections, true, opts).then(

                function success(apps) {
                    if (opts.start === 0) {
                        Utils.loaded();
                    } else {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }

                    // not equal, type
                    $scope.items = !!$scope.items ? $scope.items.concat(apps) : apps;

                    if (apps.length === opts.count) {
                        $scope.moreAppsPossible = true;
                        opts.start = opts.start + 1;
                        opts.count = opts.count + 5;
                    } else {
                        $scope.moreReviewsPossible = false;
                    }
                }
                , function (error) {
                    if (opts.count === 0) {
                        Utils.loaded();
                    } else {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                    Utils.toast($filter('translate')('lbl_error'));

                    if ($scope.items === null) {
                        $scope.items = [];
                    }
                }
            );
        };

        // after routine.
        $scope.$on("$ionicView.afterLeave", function () {
            $scope.hideSearchInput = true;
            Utils.getAppsByRegion($scope.selections, false, opts).then(creationSuccess, creationError);
        });
    })

    .controller('AppDetailCtrl', function ($scope, $state, $ionicPopup, $timeout, Utils, PlayStore, Config) {

        // get app info.
        $scope.app = Utils.getAppDetails($state.params.appId, $state.params.appRegion);

        Utils.parseUri.options.strictMode = true;


        $scope.selection = 'info';

        var appStoreId = "";
        if ($scope.app.url && $scope.app.url.length > 0) {
            // android app.
            if ($scope.app.url.indexOf("https://play.google.com/store/apps/details?id=") > -1) {
                var storeUri = $scope.app.url;
                var uriParams = Utils.parseUri(storeUri);
                if (uriParams.queryKey) {
                    if (uriParams.queryKey.id) {
                        appStoreId = uriParams.queryKey.id;
                    }
                }
                // if (storeUri.indexOf("&") > -1) {
                //     appStoreId = storeUri.slice(storeUri.lastIndexOf("id=") + 3, storeUri.lastIndexOf("&"));
                // } else {
                //     appStoreId = storeUri.slice(storeUri.lastIndexOf("id=") + 3, storeUri.length);

                // }
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
        }
            , function (error) { /* error */
                // console.log("app does not exist.");
                $scope.appInstallStatus = "download";
                //Web Application
                if (Config.getWebAppTypes().indexOf($scope.app.type) > -1) {
                    $scope.appInstallStatus = "forward";
                }
            });


        // sub controller.
        $scope.showAppComments = function () {
            // $scope.selection = 'userComment';
            $state.go('app.comments', {
                appId: $scope.app.id
                , appRegion: $scope.app.city
            });
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
                        }
                        , failure: function () { }
                    });
                }


            } else if ($scope.appInstallStatus == 'forward') {

                if (Config.getWebAppTypes().indexOf($scope.app.type) > -1 && $scope.app.url && $scope.app.url.length > 0) {
                    window.open($scope.app.url, '_system', 'location=no,toolbar=no');
                } else {
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
        }


        $scope.info = function () {
            $scope.selection = 'info';
            $state.go('app.single', {
                appId: $scope.app.id
                , appRegion: $scope.app.city
            });
        }

        // read it from cache.
        $scope.stars = Utils.getStars(Utils.getAgreegateRating($scope.app));

    })

    .controller('AppCommentsCtrl', function ($scope, $state, $ionicPopup, $timeout, Utils, $q, PlayStore, Config) {

        var app = Utils.getAppDetails($state.params.appId, $state.params.appRegion);

        var appStoreId = "";
        if (app.url && app.url.length > 0) {
            if (app.url.indexOf("https://play.google.com/store/apps/details?id=") > -1) {
                var storeUri = app.url;
                var uriParams = Utils.parseUri(storeUri);
                if (uriParams.queryKey) {
                    if (uriParams.queryKey.id) {
                        appStoreId = uriParams.queryKey.id;
                    }
                }
            }
        }


        navigator.startApp.check(appStoreId, function (message) { /* success */
            // console.log("app exists.");
            $scope.appInstallStatus = "forward";
        }, function (error) { /* error */
            // console.log("app does not exist.");
            $scope.appInstallStatus = "download";
            if (Config.getWebAppTypes().indexOf(app.type) > -1) {
                $scope.appInstallStatus = "forward";
            }

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
                        }
                        , failure: function () { }
                    });
                }

            } else if ($scope.appInstallStatus == 'forward') {
                if (Config.getWebAppTypes().indexOf(app.type) > -1 && app.url && app.url.length > 0) {
                    window.open(app.url, '_system', 'location=no,toolbar=no');
                } else {
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
        }


        $scope.selection = 'userComment';

        $scope.info = function () {
            $scope.selection = 'info';
            $state.go('app.single', {
                appId: app.id
                , appRegion: app.city
            });
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
            Utils.toast($filter('translate')('lbl_error'));
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
                        opts.start = opts.start + 1;
                        opts.count = opts.count + 5;
                    } else {
                        $scope.moreReviewsPossible = false;
                    }
                }
                , function (error) {
                    if (opts.count === 0) {
                        Utils.loaded();
                    } else {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }

                    Utils.toast($filter('translate')('lbl_error'));

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
            $state.go('app.single', {
                appId: id
                , appRegion: region
            });
        }

        $scope.getStars = function (vote) {
            return Utils.getStars(vote);
        };
    })