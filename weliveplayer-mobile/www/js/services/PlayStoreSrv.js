angular.module('weliveplayer.services.playstore', [])

    .factory('PlayStore', function ($rootScope, $q, $filter, $ionicLoading, $ionicPopup, $timeout, $http) {

        var playStoreService = {};

        var playStoreUserReviews = new Object();

        playStoreService.convertSort = function convertSort(sort) {
            switch (sort) {
                case 'newest':
                    return 0;
                case 'rating':
                    return 1;
                case 'helpfulness':
                    return 4;
                default:
                    return 0;
            }
        }

        playStoreService.getUserReviews = function getUserReviews(opts) {

            var deferred = $q.defer();

            var userReviews = playStoreUserReviews[opts.city + "_" + opts.id];

            if (userReviews) {
                deferred.resolve(userReviews);
            } else {
                var sort = playStoreService.convertSort(opts.sort);

                var url = "https://play.google.com/store/getreviews?";
                var params = "id=" + opts.storeId + "&reviewSortOrder=" + sort + "&reviewType=" + opts.reviewType + "&pageNum=" + opts.page + "&hl=" + opts.lang;

                $http.post(url + params)

                    .then(
                        function (response) {
                            if (response.data[0][2]) {
                                var reviews = playStoreService.parseFields(response.data[0][2]);
                                // update reviews to map[key->city_id] = reviews;
                                playStoreUserReviews[opts.city + "_" + opts.id] = reviews;
                                deferred.resolve(reviews);
                            } else {
                                deferred.resolve(null);
                            }


                        },
                        function (responseError) {
                            deferred.resolve(null);
                        }
                        );
            }

            return deferred.promise;

        }

        playStoreService.getAgreegateReview = function getAgreegateReview(storeId) {

            var deferred = $q.defer();
		   
            //		   var http = new XMLHttpRequest();
            var url = "https://play.google.com/store/apps/details?id=" + storeId;

            $http.get(url)
                .then(
                    function (response) {

                        var document = angular.element(response.data);

                        var agreegate = [];

                        var agreegateScore = document[71].childNodes[97].childNodes[5].childNodes[1].childNodes[0].childNodes[0].childNodes[2]
                            .childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[1].childNodes[1].childNodes[1].childNodes[5].innerText;

                        var totalReviews = document[71].childNodes[97].childNodes[5].childNodes[1].childNodes[0].childNodes[0].childNodes[2]
                            .childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[1].childNodes[1].childNodes[1].childNodes[9].innerText;

                        var r = /^[0-9]+([,.][0-9]+)?$/g;

                        var result = agreegateScore.match(r)

                        result = result.toString().replace(",", ".");

                        agreegate.push(result);
                        agreegate.push(totalReviews);

                        deferred.resolve(agreegate);

                    },
                    function (responseError) {
                        deferred.resolve(null);
                    }
                    );

            return deferred.promise;
            //		   http.open("GET", url, true);
            //
            //			//Send the proper header information along with the request
            //			http.setRequestHeader("Access-Control-Allow-Origin", "*");
            //
            //			http.onreadystatechange = function() {//Call a function when the state changes.
            //			    if(http.readyState == 4 && http.status == 200) {
            //			       var response = http.responseText;
            //			       var document = angular.element(response);
            //			       
            //			       var agreegateScore = document[71].childNodes[97].childNodes[5].childNodes[1].childNodes[0].childNodes[0].childNodes[2]
            //			       .childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[1].childNodes[1].childNodes[1].childNodes[5].innerText;
            //			       
            //			       var totalReview = document[71].childNodes[97].childNodes[5].childNodes[1].childNodes[0].childNodes[0].childNodes[2]
            //			       .childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[1].childNodes[1].childNodes[1].childNodes[9].innerText;
            //			       
            //			       
            ////			       var r = /\d+/;
            //			       var r = /^[0-9]+([,.][0-9]+)?$/g;
            //	    		   
            //			       var result = agreegateScore.match(r)
            //			       
            //			       result = result.toString().replace(",", ".");
            //			       
            //			       $scope.updateStars(result);
            //
            //			    }
            //			}
            //			http.send();

        }

        playStoreService.parseFields = function parseFields(response) {

            var document = angular.element(response);

            var userReviews = [];

            for (var i = 0, len = document.length; i < len; i++) {

                if (document[i].className == 'single-review') {
                    // review header.
                    var authorNode = document[i].childNodes[3].childNodes[1].childNodes[1].outerText;
                    var publishDate = document[i].childNodes[3].childNodes[1].childNodes[3].outerText;
                    var rating = document[i].childNodes[3].childNodes[1].childNodes[9].childNodes[1].attributes[1].value;
                    var comment = document[i].childNodes[5].childNodes[1].innerText;

                    var user = {};
                    user.authorNode = authorNode;
                    user.publishDate = publishDate;
                    user.comment = comment;
                    // regex.
                    var r = /\d+/;
                    var matching = rating.match(r)
                    if (matching != null) {
                        user.rating = matching[0];
                    }

                    userReviews.push(user);

                }
            }


            return userReviews;
        }

        return playStoreService;
    });
