angular.module('weliveplayer.services.utils', [])

    .factory('Utils', function ($rootScope, $q, $filter, $ionicLoading, $ionicPopup, $timeout, $http, Config, LoginSrv, StorageSrv) {

        var utilsService = {};

        //app cache.
        var appMap = new Object();

        utilsService.getAppsByRegion = function (region) {


            var deferred = $q.defer();

            var apps = [];

            var promises = [];
    	
            // fetch region apps using service.
            region.forEach(function (element) {

                var creationSuccess = function (apps) {
                    appMap[element] = apps
                };

                var creationError = function (error) {
                    deferred.resolve(null);
       	        };

       	        var singlePromise = utilsService.fetchApps(element).then(creationSuccess, creationError);
                promises.push(singlePromise);

            })

            $q.all(promises).then(function () {

                region.forEach(function (element) {
                    var arr = appMap[element];
                    if (arr) apps = apps.concat(arr);
                });
                deferred.resolve(apps);
            });

            return deferred.promise;

        }


        utilsService.fetchApps = function fetchApps(region) {

            var deferred = $q.defer();

            var apps = [];

            if (appMap[region] != null) {
                var arr = appMap[region];
                if (arr) {
                    apps = apps.concat(arr);
                    deferred.resolve(apps);
                }
            } else {
                LoginSrv.accessToken().then(
                    function (token) {
                        var url = Config.getWeLiveProxyUri() + "apps/" + region + "/All";
                        $http.get(url, { headers: { "Authorization": "Bearer " + token } })

                            .then(function (response) {
                                var apps = response.data.data;
                                deferred.resolve(apps);

                            }, function (error) {
                                deferred.resolve(null);
                            })

                    },
                    function (responseError) {
                        deferred.resolve(null);
                    }

                    );

            }
            return deferred.promise;
        }

        /**
            utilsService.fetchApps = function fetchApps(region) {
        
                var deferred = $q.defer();
        
                var apps = [];
            	
                if (appMap[region] != null) {
                       var arr = appMap[region];
                           if (arr) {
                               apps = apps.concat(arr);
                               deferred.resolve(apps);
              }} else {
                     $http.get("resources/" + region.toLowerCase() + '.json')
        
                    .then(function (response) {
                    	
                        var apps = response.data;
                    	
                        var cachedApps = [];
                    	
                        var promises = [];
                    	
                        // run for each app.
                        apps.forEach(function(app){
                            var creationSuccess = function (review) { 
                                if (review.length > 0) {
                                  app.rating = review[0];
                               app.totalReviews = review[1];
                             }
                                cachedApps.push(app);
                          };
                          var creationError = function (error) {
                                deferred.resolve(null);
                          };
        
                            var singlePromise = PlayStore.getAgreegateReview(app.storeId).then(creationSuccess, creationError);
                            promises.push(singlePromise); 
                          
                        })
                        $q.all(promises).then (function (){
                            deferred.resolve(cachedApps);
                        });
        
                    },
                    function (responseError) {
                        deferred.resolve(null);
                    }
                   ); 
                   }
            	
              return deferred.promise;
        
         }
        
            
            var appMap = {
        
                Trento: [
                          { id: 1, name: 'Viaggia Trento', city: 'Trento', rating: 5, userId : 52, consigliati : true, timestamp : 1454672400, tags : 'tag1,tagN', storeId : 'eu.trentorise.smartcampus.viaggiatrento' },
                          { id: 2, name: 'Comune nel Tasca', city: 'Trento', rating: 4, userId : 52, consigliati : false, timestamp : 1454672400, tags : 'tag1,tagN', storeId : 'it.smartcampuslab.comuni.trento' },
                          { id: 3, name: '%100 Riciclo Trento', city: 'Trento', rating: 3.2, userId : 52, consigliati : true, timestamp : 1454672400, tags : 'tag1,tagN', storeId : 'it.smartcommunitylab.rifiuti.trento' },
                          { id: 4, name: 'MetroParco', city: 'Trento', rating: 1, userId : 52, consigliati : true, timestamp : 1454672400, tags : 'tag1,tagN', storeId : 'eu.trentorise.smartcampus.viaggiatrento' },
                          { id: 5, name: 'Infanzia Digitale', city: 'Trento', rating: 0.9, userId : 52, consigliati : false, timestamp : 1454672408, tags : 'tag1,tagN', storeId : 'eu.trentorise.smartcampus.viaggiatrento' },
                            { id: 6, name: 'Futura Trento', city: 'Trento', rating: 2, userId : 52, consigliati : true, timestamp : 1454672400, tags : 'tag1,tagN', storeId : 'eu.trentorise.smartcampus.viaggiatrento' },
                            { id: 7, name: 'CLIMB', city: 'Trento', rating: 4, userId : 52, consigliati : false, timestamp : 1454672409, tags : 'tag1,tagN', storeId : 'eu.trentorise.smartcampus.viaggiatrento'}
                          ],
              Rovereto: [
                          { id: 8, name: 'Viaggia Rovereto', city: 'Rovereto', rating: 5, userId : 52, consigliati : true, timestamp : 1454672400, tags : 'tag1,tagN', storeId : 'eu.trentorise.smartcampus.viaggiarovereto' },
                          { id: 9, name: 'iPosto', city: 'Rovereto', rating: 3.5, userId : 52, consigliati : true, timestamp : 1454672410, tags : 'tag1,tagN', storeId : 'eu.trentorise.smartcampus.viaggiatrento' },
                          { id: 10, name: '%100 Riciclo Rovereto', city: 'Rovereto', rating: 3.1, userId : 52, consigliati : true, timestamp : 1454672400, tags : 'tag1,tagN', storeId : 'it.smartcommunitylab.rifiuti.rovereto' }
                        ],
               Novisad: [
                         { id: 11, name: 'FiemmeSKI', city: 'Novisad', rating: 3, userId : 52, consigliati : false, timestamp : 1454672400, tags : 'tag1,tagN', storeId : 'eu.trentorise.smartcampus.viaggiatrento' }
                        ]
            };
        
        
        
            utilsService.getAppsByRegion = function(region) {
                var apps= [];
        
                // make local copy of map.
                var tempMap = {};
                for (var i in appMap)
                    tempMap[i] = appMap[i];
        
                region.forEach(function(element){
                    var arr = tempMap[element];
                    if (arr) apps = apps.concat(arr);	
                });
        
                return apps;
            }*/

        utilsService.getAgreegateRating = function (app) {

            var stars = 0;

            if (appMap[app.city] != null) {

                var arr = appMap[app.city];

                arr.forEach(function (elem) {
                    if (parseInt(elem.id) === parseInt(app.id)) {
                        stars = elem.rating;
                    }
                });

            }

            return stars;
        }

        utilsService.getAppDetails = function (id, region) {
            var app = {};
            // make local copy of map.
            var tempMap = {};
            for (var i in appMap)
                tempMap[i] = appMap[i];

            var arr = tempMap[region];
            if (arr) {
                for (var j = 0, len = arr.length; j < len; j++) {
                    if (parseInt(arr[j].id) === parseInt(id)) {
                        app = arr[j];
                        break;
                    }
                }
            }

            return app;
        }

        // a list of sorting functions
        var sorters = {
            byAlphabets: function (a, b) {
                return ((a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : ((a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : 0));
            },
            byPopularity: function (a, b) {
                return (a.rating - b.rating);
            },
            byHighRatings: function (a, b) {
                return ((a.rating < b.rating) ? 1 : ((a.rating > b.rating) ? -1 : 0));
            },
            byRecenti: function (a, b) {
                return ((a.timestamp < b.timestamp) ? 1 : ((a.timestamp > b.timestamp) ? -1 : 0));
            },
            byConsigliati: function (a) {
                if (a.consigliati) {
                    return -1;
                } else {
                    return 1;
                }
            }

        };

        utilsService.orderByType = function (type, list) {

            var apps = {};

            if (type == "Alfabetico") {
                apps = list.sort(sorters.byAlphabets);
            } else if (type == "Popolari") {
                apps = list.sort(sorters.byHighRatings);
            } else if (type == "Consigliati") {
                apps = list.sort(sorters.byConsigliati)
                //    		for(var i=0, j=0, len=list.length; i < len; i++){
                //    			debugger;  
                //    			if (list[i].consigliati) {
                //    				  apps[j] = list[i];
                //    				  j++;
                //    			  }
                //    			}

            } else if (type == "Recenti") {
                apps = list.sort(sorters.byRecenti);
            }

            return apps;
        }

        utilsService.getStars = function (vote) {

            if (!vote) {
                vote = 0;
            }

            var stars = [];

            var fullStars = Math.floor(vote);
            for (var i = 0; i < fullStars; i++) {
                stars.push('full');
            }

            // var halfStars = Math.ceil((vote % 1).toFixed(4));
            var voteHS = Number((vote % 1)).toFixed(4);
            var halfStars = Math.ceil(Number(voteHS));

            for (var i = 0; i < halfStars; i++) {
                stars.push('half');
            }

            var emptyStars = 5 - stars.length;
            if (emptyStars >= 1) {
                for (var i = 0; i < emptyStars; i++) {
                    stars.push('empty');
                }
            }

            return stars;
        };

        utilsService.getUserComments = function (id) {
            var comments = {};
            return comments;
        }


        utilsService.searchApp = function (searchText) {
            var foundApps = [];
            for (var key in appMap) {
                if (appMap.hasOwnProperty(key)) {
                    var apps = appMap[key];
                    for (var i = 0, len = apps.length; i < len; i++) {
                        if (apps[i].name.toUpperCase().indexOf(searchText.toUpperCase()) > -1) {
                            foundApps.push(apps[i]);
                        }
                    }
                }
            }


            return foundApps;
        }


        utilsService.fastCompareObjects = function (obj1, obj2) {
            return JSON.stringify(obj1) === JSON.stringify(obj2);
        };

        utilsService.toast = function (message, duration, position) {
            message = message || $filter('translate')('toast_error_generic');
            duration = duration || 'short';
            position = position || 'bottom';

            if (!!window.cordova) {
                // Use the Cordova Toast plugin
                //$cordovaToast.show(message, duration, position);
                window.plugins.toast.show(message, duration, position);
            } else {
                if (duration == 'short') {
                    duration = 2000;
                } else {
                    duration = 5000;
                }

                var myPopup = $ionicPopup.show({
                    template: '<div class="toast">' + message + '</div>',
                    scope: $rootScope,
                    buttons: []
                });

                $timeout(
                    function () {
                        myPopup.close();
                    },
                    duration
                    );
            }
        };

        utilsService.toCamelCase = function (str) {
            return str
                .replace(/\s(.)/g, function ($1) { return $1.toUpperCase(); })
                .replace(/\s/g, '')
                .replace(/^(.)/, function ($1) { return $1.toLowerCase(); });
        };

        utilsService.logAppDownload = function (appStoreId, pilotId) {
            var userId = StorageSrv.getLoggedInUserId();
            var appDownloadJson = Config.getAppDownloadJson();
            appDownloadJson.custom_attr.UserID = userId;
            appDownloadJson.custom_attr.AppID = appStoreId;
            appDownloadJson.custom_attr.PilotID = pilotId;

            utilsService.log(appDownloadJson);
        };

        utilsService.logAppOpen = function (appStoreId, pilotId) {
            var userId = StorageSrv.getLoggedInUserId();
            var appOpenJson = Config.getAppOpenJson();
            appOpenJson.custom_attr.UserID = userId;
            appOpenJson.custom_attr.AppID = appStoreId;
            appOpenJson.custom_attr.PilotID = pilotId;

            utilsService.log(appOpenJson);

        };

        utilsService.log = function (body) {

            var deferred = $q.defer();

            var url = Config.getLogUri();

            $http.post(url, body, { headers: { "Accept": "application/json", "Content-Type": "application/json" } })

                .then(function (response) {
                    deferred.resolve(null);

                }, function (error) {
                    deferred.resolve(null);
                })

            return deferred.promise;
        }

        utilsService.getUserPilotCity = function () {
            
            var pilot = [];
            var pilotId = StorageSrv.getLoggedInUserPilotId();

            if (pilotId) {
                pilot.push(pilot);
            } else {
                // pilot.push(Config.getPilotIds()[0]);
                pilot = pilot.concat(Config.getPilotIds());
            }

            return pilot;
            
        }


        utilsService.loading = function () {
            $ionicLoading.show();
        };

        utilsService.loaded = function () {
            $ionicLoading.hide();
        };

        return utilsService;
    });
													