angular.module('weliveplayer.services.utils', [])

.factory('Utils', function ($rootScope, $q, $filter, $ionicLoading, $ionicPopup, $timeout, StorageSrv) {
    
	var utilsService = {};

    var appMap = {
    	Trento: [ { id: 0, name: 'Viaggia Trento', city: 'Trento', rating: 5, userId : 52, consigliati : true, timestamp : 1454672400, tags : 'tag1,tagN' },
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
