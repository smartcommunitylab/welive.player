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

    utilsService.getMonthList = function () {
        var monthList = [
            $filter('translate')('month_jan'),
            $filter('translate')('month_feb'),
            $filter('translate')('month_mar'),
            $filter('translate')('month_apr'),
            $filter('translate')('month_may'),
            $filter('translate')('month_jun'),
            $filter('translate')('month_jul'),
            $filter('translate')('month_ago'),
            $filter('translate')('month_sep'),
            $filter('translate')('month_oct'),
            $filter('translate')('month_nov'),
            $filter('translate')('month_dic')
        ];
        return monthList;
    };

    utilsService.getDoWList = function () {
        var daysOfWeek = [
            $filter('translate')('dow_sunday'),
            $filter('translate')('dow_monday'),
            $filter('translate')('dow_tuesday'),
            $filter('translate')('dow_wednesday'),
            $filter('translate')('dow_thursday'),
            $filter('translate')('dow_friday'),
            $filter('translate')('dow_saturday')
        ];
        return daysOfWeek;
    };

    utilsService.getSDoWList = function () {
        var shortDaysOfWeek = [
            $filter('translate')('dow_sunday_short'),
            $filter('translate')('dow_monday_short'),
            $filter('translate')('dow_tuesday_short'),
            $filter('translate')('dow_wednesday_short'),
            $filter('translate')('dow_thursday_short'),
            $filter('translate')('dow_friday_short'),
            $filter('translate')('dow_saturday_short')
        ];
        return shortDaysOfWeek;
    };

    utilsService.getBookingCounters = function (travel) {
        if (!!travel && !!travel.bookings) {
            var bookingCounters = {
                total: angular.copy(travel.places),
                available: angular.copy(travel.places),
                booked: 0
            };

            travel.bookings.forEach(function (booking) {
                // NOTE Availability logic: busy if 0 (requested) or 1 (accepted), free if -1 (rejected)
                if (booking.accepted >= 0) {
                    bookingCounters.booked++;
                    bookingCounters.available--;
                }
            });

            return bookingCounters;
        }
    };

    utilsService.getTripStyle = function (trip) {
        if (!!trip.communityIds && trip.communityIds.length === 1) {
            var community = StorageSrv.getCommunityById(trip.communityIds[0]);
            if (!!community) {
                return {
                    'border-color': '#' + community.color + ' #' + community.color + ' transparent transparent'
                };
            }
        }
    };

    utilsService.getRecurrencyString = function (travel) {
        var dsOfWeek = utilsService.getDoWList();
        var dowString = '';

        if (!!travel && !!travel.recurrency) {
            // The "Sunday issue"
            var days = angular.copy(travel.recurrency.days)
            if (days[0] === 1) {
                days.splice(0, 1); // remove 1 at the stard
                days.push(1); // add 1 at the end
            }

            for (var i = 0; i < days.length; i++) {
                var dow = days[i];
                if (!!dowString) {
                    dowString = dowString + ', ';
                }
                dowString = dowString + dsOfWeek[dow - 1]; // 1 = sunday, 2 = monday...
            }
        }

        return dowString;
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

    utilsService.getNumber = function (num) {
        if (!num || num === 0) {
            return [];
        }
        return new Array(num);
    };

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
