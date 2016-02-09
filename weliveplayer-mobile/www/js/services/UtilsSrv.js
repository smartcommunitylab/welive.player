angular.module('weliveplayer.services.utils', [])

.factory('Utils', function ($rootScope, $q, $filter, $ionicLoading, $ionicPopup, $timeout, $http) {

	var utilsService = {};

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
    }

    utilsService.getDummyList = function () {
    	return items;
    }

    utilsService.getAppDetails = function (id, region) {
    	var app = {};
    	// make local copy of map.
    	var tempMap = {};
    	for (var i in appMap)
    		tempMap[i] = appMap[i];
    	
		var arr = tempMap[region];
		if (arr) {
			for (var i=0,len = arr.length; i < len; i++) {
				if (parseInt(arr[i].id) === parseInt(id)) {
				app = arr[i];
				break;
				}
			}
		}

    	return app;
    }

    // a list of sorting functions
	var sorters = {
		    byAlphabets : function(a,b) {
		        return ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0));
		    },
		    byPopularity : function(a,b) {
		        return (a.rating - b.rating);
		    },
		    byHighRatings : function(a,b) {
		        return ((a.rating < b.rating) ? 1 : ((a.rating > b.rating) ? -1 : 0));
		    },
		    byRecenti : function(a,b) {
		    	return ((a.timestamp < b.timestamp) ? 1 : ((a.timestamp > b.timestamp) ? -1 : 0)) ;
		    },
		    byConsigliati : function(a) {
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

        var halfStars = Math.ceil((vote % 1).toFixed(4));
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
    	var foundApps= [];
		for (var key in appMap) {
    		  if (appMap.hasOwnProperty(key)) {
    		    var apps = appMap[key];
    		    for (var i=0,len=apps.length; i < len; i++) {
    		    	if (apps[i].name.toUpperCase().indexOf(searchText.toUpperCase()) > -1) {
    		    		foundApps.push(apps[i]);
    		    	}
    		    }
    		  }
    		}


    	return foundApps;
    }


    utilsService.reviews = function reviews(opts) {

    	 var deferred = $q.defer();

    	 var reviews = [];

    	 var sort = convertSort(opts.sort);

    	 var form = {
    		        'pageNum': 0,
    		        'id': opts.id,
    		        'reviewSortOrder': sort,
    		        'hl': opts.lang,
    		        'reviewType': 0
    		    }


    	 var http = new XMLHttpRequest();
    	 var url = "https://play.google.com/store/getreviews?";
    	 var params = "id=eu.trentorise.smartcampus.viaggiatrento&reviewSortOrder=2&reviewType=1&pageNum=0";
    	 http.open("POST", url+ params, true);

    	 //Send the proper header information along with the request
//    	 http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    	 http.setRequestHeader("Access-Control-Allow-Origin", "*");

    	 http.onreadystatechange = function() {//Call a function when the state changes.
    	     if(http.readyState == 4 && http.status == 200) {
    	        var response = http.responseText;
    	        response = JSON.parse(response.slice(6));
    	        reviews = parseFields(response[0][2]);
    	     }
    	 }
    	 http.send(params);

    	 return reviews;

    }

    utilsService.parseFields = function parseFields(response) {

    	var document = angular.element(response);

    	var userReviews = [];

    	for (var i=0, len = document.length; i < len; i++) {

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

    utilsService.convertSort = function convertSort(sort) {
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

    utilsService.fastCompareObjects = function (obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    };

    utilsService.loading = function () {
        $ionicLoading.show();
    };

    utilsService.loaded = function () {
        $ionicLoading.hide();
    };

    return utilsService;
});
															