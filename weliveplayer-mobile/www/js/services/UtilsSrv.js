angular.module('weliveplayer.services.utils', [])

    .factory('Utils', function($rootScope, $q, $filter, $ionicLoading, $ionicPopup, $timeout, $http, Config, LoginSrv, StorageSrv) {

        var utilsService = {};

        var loggingToken = LOGGING_TOKEN;
 
        //app cache.
        var appMap = new Object();

        utilsService.getAppsByRegion = function(region, forceReset, opts) {


            var deferred = $q.defer();

            var apps = [];

            var promises = [];

            //force reset cache.
            if (forceReset) {
                appMap = {};
            }

            // fetch region apps using service.
            region.forEach(function(element) {

                var creationSuccess = function(apps) {
                    appMap[element] = apps
                };

                var creationError = function(error) {
                    deferred.reject(error);
                };

                var singlePromise = utilsService.fetchApps(element, opts).then(creationSuccess, creationError);
                promises.push(singlePromise);

            })

            $q.all(promises).then(function() {

                region.forEach(function(element) {
                    var arr = appMap[element];
                    if (arr) apps = apps.concat(arr);
                });
                deferred.resolve(apps);
            });

            return deferred.promise;

        }


        utilsService.fetchApps = function fetchApps(region, opts) {

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
                        var url = Config.getWeLiveProxyUri() + "apps/" + region + "/" + Config.getDefaultAppType() + "?start=" + opts.start + "&count=" + opts.count;
                        $http.get(url, {
                            timeout: 20000,
                            headers: {
                                "Authorization": "Bearer " + token
                            }
                        })
                       .then(function (response) {
                           var apps = response.data.data;
                           deferred.resolve(apps);
                            },
                            function (error) {
                                deferred.reject("error retrieving data.");
                            })
                    }
                    , function (responseError) {
                        deferred.reject("error retrieving data.");
                    }
                   );
            }
            
            return deferred.promise;
        }

        utilsService.getAgreegateRating = function(app) {

            var stars = 0;

            if (appMap[app.city] != null) {

                var arr = appMap[app.city];

                arr.forEach(function(elem) {
                    if (parseInt(elem.id) === parseInt(app.id)) {
                        stars = elem.rating;
                    }
                });

            }

            return stars;
        }

        utilsService.getAppDetails = function(id, region) {
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
            byAlphabets: function(a, b) {
                return ((a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : ((a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : 0));
            }
            , byPopularity: function(a, b) {
                return (a.rating - b.rating);
            }
            , byHighRatings: function(a, b) {
                return ((a.rating < b.rating) ? 1 : ((a.rating > b.rating) ? -1 : 0));
            }
            , byRecenti: function(a, b) {
                return ((a.timestamp < b.timestamp) ? 1 : ((a.timestamp > b.timestamp) ? -1 : 0));
            }
            , byConsigliati: function(a) {
                if (a.recommendation) {
                    return -1;
                } else {
                    return 1;
                }
            }

        };

        utilsService.orderByType = function(type, list) {

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

        utilsService.getStars = function(vote) {

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

        utilsService.getUserComments = function(id) {
            var comments = {};
            return comments;
        }


        utilsService.searchApp = function(searchText) {
            var foundApps = [];
            for (var key in appMap) {
                if (appMap.hasOwnProperty(key)) {
                    var apps = appMap[key];
                    if (apps) {
                        for (var i = 0, len = apps.length; i < len; i++) {
                            if (apps[i].name.toUpperCase().indexOf(searchText.toUpperCase()) > -1) {
                                foundApps.push(apps[i]);
                            }
                        }
                    }
                }
            }
            
            var appSearchJson = Config.getPlayerAppSearchJson();
            appSearchJson.custom_attr.userid = StorageSrv.getLoggedInUserId();
            appSearchJson.custom_attr.pilot = StorageSrv.getLoggedInUserPilotId();
            utilsService.log(appSearchJson);

            return foundApps;
        }


        utilsService.fastCompareObjects = function(obj1, obj2) {
            return JSON.stringify(obj1) === JSON.stringify(obj2);
        };

        utilsService.toast = function(message, duration, position) {
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
                    template: '<div class="toast">' + message + '</div>'
                    , scope: $rootScope
                    , buttons: []
                });

                $timeout(
                    function() {
                        myPopup.close();
                    }
                    , duration
                );
            }
        };

        utilsService.toCamelCase = function(str) {
            return str
                .replace(/\s(.)/g, function($1) {
                    return $1.toUpperCase();
                })
                .replace(/\s/g, '')
                .replace(/^(.)/, function($1) {
                    return $1.toLowerCase();
                });
        };

        utilsService.logAppDownload = function(artifactId, pilotId, appName) {
            var userId = StorageSrv.getLoggedInUserId();
            var appDownloadJson = Config.getAppDownloadJson();
            appDownloadJson.custom_attr.userid = userId;
            appDownloadJson.custom_attr.appid = artifactId;
            appDownloadJson.custom_attr.pilot = pilotId;
            appDownloadJson.custom_attr.appname = appName;

            utilsService.log(appDownloadJson);
        };

        utilsService.logAppOpen = function(artifactId, pilotId, appName) {
            var userId = StorageSrv.getLoggedInUserId();
            var appOpenJson = Config.getAppOpenJson();
            appOpenJson.custom_attr.userid = userId;
            appOpenJson.custom_attr.appid = artifactId;
            appOpenJson.custom_attr.pilot = pilotId;
            appOpenJson.custom_attr.appname = appName;

            utilsService.log(appOpenJson);

        };

        utilsService.log = function(body) {
        
            var deferred = $q.defer();

            var url = Config.getLogUri();

            $http.post(url, body, {
                headers: {
                    "Accept": "application/json"
                    , "Content-Type": "application/json"
                    , "Authorization": 'Bearer ' + loggingToken
                }
            })

                .then(function(response) {
                    deferred.reject();

                }, function(error) {
                    deferred.reject();
                })

            return deferred.promise;
        }

        utilsService.getUserPilotCity = function() {

            var pilot = [];
            var pilotId = StorageSrv.getLoggedInUserPilotId();
            pilotId = Config.getPilotMap()[pilotId];

            if (pilotId) {
                pilot.push(pilotId);
            } else {
                // pilot.push(Config.getPilotIds()[0]);
                pilot = pilot.concat(Config.getPilotIds());
            }

            return pilot;

        }


        utilsService.loading = function() {
            $ionicLoading.show();
        };

        utilsService.loaded = function() {
            $ionicLoading.hide();
        };

        // parseUri 1.2.2
        // (c) Steven Levithan <stevenlevithan.com>
        // MIT License

        utilsService.parseUri = function(str) {
            var o = utilsService.parseUri.options,
                m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
                uri = {},
                i = 14;

            while (i--) uri[o.key[i]] = m[i] || "";

            uri[o.q.name] = {};
            uri[o.key[12]].replace(o.q.parser, function($0, $1, $2) {
                if ($1) uri[o.q.name][$1] = $2;
            });

            return uri;
        };

        utilsService.parseUri.options = {
            strictMode: false,
            key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
            q: {
                name: "queryKey",
                parser: /(?:^|&)([^&=]*)=?([^&]*)/g
            },
            parser: {
                strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
            }
        };

        return utilsService;
    });
