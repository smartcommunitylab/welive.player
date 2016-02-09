angular.module('weliveplayer.services.utils', [])

.factory('Utils', function ($rootScope, $q, $filter, $ionicLoading, $ionicPopup, $timeout, StorageSrv, $http, Config) {
    
	var utilsService = {};
	
    var appMap = {
    	Trento: [ { id: 0, name: 'Viaggia Trento', city: 'Trento', rating: 5, userId : 52, consigliati : true, timestamp : 1454672400, tags : 'tag1,tagN' ,active:true},
    	          { id: 3, name: 'Comune nel Tasca', city: 'Trento', rating: 4, userId : 52, consigliati : false, timestamp : 1454672400, tags : 'tag1,tagN' },
    	          { id: 5, name: '%100 Riciclo Trento', city: 'Trento', rating: 3.2, userId : 52, consigliati : true, timestamp : 1454672400, tags : 'tag1,tagN' },
    	          { id: 7, name: 'MetroParco', city: 'Trento', rating: 1, userId : 52, consigliati : true, timestamp : 1454672400, tags : 'tag1,tagN' },
         	       { id: 8, name: 'Infanzia Digitale', city: 'Trento', rating: 0.9, userId : 52, consigliati : false, timestamp : 1454672408, tags : 'tag1,tagN' },
         	       { id: 9, name: 'Futura Trento', city: 'Trento', rating: 2, userId : 52, consigliati : true, timestamp : 1454672400, tags : 'tag1,tagN' },
         	       { id: 10, name: 'CLIMB', city: 'Trento', rating: 4, userId : 52, consigliati : false, timestamp : 1454672409, tags : 'tag1,tagN' }],	
    	Rovereto: [{ id: 1, name: 'Viaggia Rovereto', city: 'Rovereto', rating: 5, userId : 52, consigliati : true, timestamp : 1454672400, tags : 'tag1,tagN' },
    	           { id: 4, name: 'iPosto', city: 'Rovereto', rating: 3.5, userId : 52, consigliati : true, timestamp : 1454672410, tags : 'tag1,tagN' },
    	           { id: 6, name: '%100 Riciclo Rovereto', city: 'Rovereto', rating: 3.1, userId : 52, consigliati : true, timestamp : 1454672400, tags : 'tag1,tagN' }],
    	Novisad: [{ id: 2, name: 'FiemmeSKI', city: 'Novisad', rating: 3, userId : 52, consigliati : false, timestamp : 1454672400, tags : 'tag1,tagN' }]           
    	           
    };
    
	
	
    utilsService.getAppsByRegion = function(region) {
    	var apps= [];
		region.forEach(function(element){
    		var arr = appMap[element];
    		if (arr) apps = apps.concat(arr);	
    	});
    		
    	return apps;
    }
	
    utilsService.getDummyList = function () {
    	return items;
    }
    
    utilsService.getAppDetails = function (id, region) {
    	var app = {};
		
		var arr = appMap[region];
		if (arr) {
			for (var i=0,len = arr.length; i < len; i++) {
				if (arr[i].city = region) {
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
 				parseFields(response[0][2]);
    	         
    	         
    	         
    	     }
    	 }
    	 http.send(params);
    	
//    	return new Promise(function(resolve, reject) {
//
//    		opts = opts || {};
////    		validate(opts);
//
//    		var sort = convertSort(opts.sort);
//
//    		var options = {
//    			method: 'POST',
//    			uri: 'https://play.google.com/store/getreviews',
//    			form: {
//    				pageNum: opts.page || 0,
//    				id: opts.appId || opts.id,
//    				reviewSortOrder: sort,
//    				hl: opts.lang || 'en',
//    				reviewType: 0
//    			},
//    			json: true
//    		};
//
//    		request(options)
//    			.then(function(body){
//    				debugger;
//    				var response = JSON.parse(body.slice(6));
//    				return response[0][2];
//    			})
//    			.then(cheerio.load, h.requestError)
//    			.then(parseFields)
//    			.then(resolve)
//    			.catch(reject);
//    	});
    }

    function parseFields(response) {
    	var result = [];

    	var document = angular.element(response);
    	
    	// var reviews = response.getElementsByClassName('single-review');
    	
    	//var reviewsContainer = angular.element(angular.element(document).find('#div class="single-review" tabindex="0"');
    	 
    	var userReviews = [];
    	for (var i=0, len = document.length; i < len; i++) {
    		if (document[i].className == 'single-review') {
    			
    			// review header.
    			var authorNode = document[i].childNodes[3].childNodes[1].childNodes[1].outerText;
    			var publishDate = document[i].childNodes[3].childNodes[1].childNodes[3].outerText;
    			var rating = document[i].childNodes[3].childNodes[1].childNodes[9].childNodes[1].attributes[1].nodeValue;
    			var comment = document[i].childNodes[5].childNodes[1].innerText;
    			
    			var user;
    			user.authorNode = authorNode;
    			user.publishDate = publishDate;
    			user.rating = rating; 
    			user.comment = comment;
    			
    			userReviews.push(user);
    			
    		}
		}
    	
    	angular.forEach(reviewsContainer, function(doc, key) {
    		
    		 
    	}, log);

    	reviewsContainer.each(function(i) {
    		var info = $(this).find('div[class=review-info]');
    		var userInfo = info.find('a');
    		var userId = filterUserId(userInfo.attr('href'));
    		var userName = userInfo.text().trim();

    		var date = $(this).find('span[class=review-date]').text().trim();
    		var score = parseInt(filterScore($(this).find('.star-rating-non-editable-container').attr('aria-label').trim()));

    		var reviewContent = $(this).find('div[class=review-body]');
    		var title = reviewContent.find('span[class=review-title]').text().trim();
    		var text = filterReviewText(reviewContent.text().trim(), title.length);

    		var allInfo = {
    			userId: userId,
    			userName: userName,
    			date: date,
    			score: score,
    			title: title,
    			text: text
    		};

    		result[i] = allInfo;
    	});
    	return result;
    }

    function validate(opts) {
    	if (opts.sort && !(_.includes(c.sort, opts.sort))) {
    		throw new Error('Invalid sort ' + opts.sort);
    	}
    	if (opts.page && opts.page < 0) {
    		throw new Error('Page cannot be lower than 0');
    	}
    }

    function convertSort(sort) {
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

    function filterReviewText(text, startIndex) {
    	var regex = /Full Review/;
    	var result = text.substring(startIndex).replace(regex, '').trim();
    	return result;
    }

    function filterUserId(userId) {
    	var regex = /id=([0-9]*)/;
    	var result = userId.match(regex);
    	return result[1];
    }

    function filterScore(score) {
    	var regex = /([0-5]{1})/;
    	var result = score.match(regex);
    	return result[1];
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
