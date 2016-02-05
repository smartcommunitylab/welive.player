angular.module('weliveplayer.services.utils', [])

.factory('Utils', function ($rootScope, $q, $filter, $ionicLoading, $ionicPopup, $timeout, StorageSrv) {
    var utilsService = {};

    
    utilsService.getDummyList = function () {
    	var items = [
    	       { id: 0, name: 'Viaggia Trento', city: 'Trento', 'rating': 5, 'userId' : 52 },
    	       { id: 1, name: 'Viaggia Rovereto', city: 'Rovereto', 'rating': 5, 'userId' : 52 },
    	       { id: 2, name: 'FiemmeSKI', city: 'Cavalese', 'rating': 5, 'userId' : 52 },
    	       { id: 3, name: 'Comune nel Tasca', city: 'Trento', 'rating': 5, 'userId' : 52 },
    	       { id: 4, name: 'iPosto', city: 'Rovereto', 'rating': 5, 'userId' : 52 },
    	       { id: 5, name: '%100 Riciclo Trento', city: 'Trento', 'rating': 5, 'userId' : 52 },
    	       { id: 6, name: '%100 Riciclo Rovereto', city: 'Rovereto', 'rating': 5, 'userId' : 52 },
    	       { id: 7, name: 'MetroParco', city: 'Trento', 'rating': 5, 'userId' : 52 },
    	       { id: 8, name: 'Infanzia Digitale', city: 'Trento', 'rating': 5, 'userId' : 52 },
    	       { id: 9, name: 'Futura Trento', city: 'Trento', 'rating': 5, 'userId' : 52 },
    	       { id: 10, name: 'CLIMB', city: 'Trento', 'rating': 5, 'userId' : 52 }
    	    ];
    	return items;
    }
    
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
