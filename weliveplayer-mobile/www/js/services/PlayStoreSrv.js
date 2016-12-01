angular.module('weliveplayer.services.playstore', [])

.factory('PlayStore', function ($rootScope, $q, $filter, $ionicLoading, $ionicPopup, $timeout, $http, Config, LoginSrv) {

    var playStoreService = {};

    playStoreService.getUserReviews = function getUserReviews(opts) {

        var deferred = $q.defer();

        // var token = "4155f2a3-e1ab-44b3-a7f0-7f292faa7a57";
        // var url = Config.getWeLiveProxyUri() + "appComments/" + opts.id;
        // $http.get(url, { headers: { "Authorization": "Bearer " + token } })
        //     .then(function (response) {
        //         var reviews = response.data.data;
        //         deferred.resolve(reviews);
        //     }, function (error) {
        //         deferred.reject();
        //     })

        LoginSrv.accessToken().then(
            function (token) {
                var url = Config.getWeLiveProxyUri() + "appComments/" + opts.id + "?start=" + opts.start + "&count=" + opts.count;
                $http.get(url, {
                    timeout: 5000,
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                }).then(function (response) {
                    var reviews = [];
                    if (response.data.data) {
                        response.data.data.forEach(function (review) {
                            var d = new Date(review.publishDate);
                            review.publishDate = d;
                            reviews.push(review);
                        });
                    }
                    deferred.resolve(reviews);
                }, function (error) {
                    deferred.reject();
                })
            }
            , function (responseError) {
                deferred.reject();
            }
            ,
            function (error) {
                deferred.reject(error);
            });
        
        return deferred.promise;

    }

    return playStoreService;
});