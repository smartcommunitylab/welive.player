angular.module('weliveplayer.controllers.home', [])
.controller('HomeCtrl',function($scope, $state, $ionicPopup, $timeout, Utils) {

   $scope.selections = ['Trento'];	
   $scope.items = Utils.getAppsByRegion($scope.selections);	

   $scope.sort = {};
   $scope.sort.choice = 'Consigliati';

   // sub controller.
   $scope.showAppDetails = function(id, region) {
	   $state.go('app.single',{appId:id, appRegion:region});
   }

   $scope.showSearchInput = function() {
	   $state.go('app.search');
   }

   $scope.showPopup = function() {

   var myPopup = $ionicPopup.show({
	 templateUrl: "templates/sort.html",
     title: "Scegli Una Ordinamento",
     scope: $scope,
     buttons: [
       {
         text: 'ANNULLA',
         type: 'button-small welive-popup-button',
       },
       {
         text: 'ORDINA',
         type: 'button-small welive-popup-button',
         onTap: function(e) {
        	 if (!$scope.sort.choice) {
             //don't allow the user to close unless he enters wifi password
             e.preventDefault();
           } else {
             return $scope.sort.choice;
           }
         }
       },
     ]
   });
   myPopup.then(function(res) {
	 $scope.items = Utils.orderByType($scope.sort.choice, $scope.items);

   });
  };

  $scope.selectApps = function (city) {

	var index = $scope.selections.indexOf(city);

	// remove city from selection
	var index = $scope.selections.indexOf(city);
	if (index > -1) {
		$scope.selections.splice(index, 1);
	} else {
		$scope.selections.push(city);
	}

	$scope.items = Utils.getAppsByRegion($scope.selections);	
  }

	$scope.getStars = function (vote) {
        return Utils.getStars(vote);
    };

})

.controller('AppDetailCtrl',function($scope, $state, $ionicPopup, $timeout, Utils) {

	// get app info.
	$scope.app = Utils.getAppDetails($state.params.appId, $state.params.appRegion);
    $scope.stars = Utils.getStars($scope.app.rating);

	// sub controller.
   $scope.showAppComments = function() {
	   $scope.selection = 'userComment';
	   $state.go('app.comments',{appId:$scope.app.id, appRegion:$scope.app.city});
   }

	$scope.selection = 'info';

   $scope.download = function(id) {
	   $scope.selection = 'download';

   }

   $scope.info = function() {
    $scope.selection = 'info';
	}

})

.controller('AppCommentsCtrl',function($scope, $state, $ionicPopup, $timeout, Utils, $q) {

	var app = Utils.getAppDetails($state.params.appId, $state.params.appRegion);

	$scope.name = app.name;
	$scope.id = app.id;
	$scope.region = app.city;

	$scope.download = function(id) {	   
    }


   $scope.info = function() {
    $state.go('app.single',{appId:app.id, appRegion:app.city});
	}

//   var appId = "eu.trentorise.smartcampus.viaggiatrento";
//   cordova.plugins.market.open(appId, {
//     success: function() {
//       debugger;
//     },
//     failure: function() {
//    	 debugger;
//     }
//   })

   var opts = {};

   opts.id = app.storeId;
   opts.sort = "newest";
   opts.page = 0;
   opts.lang = "en";
   opts.reviewType = 0;

   var deferred = $q.defer();
   var sort = Utils.convertSort(opts.sort);
   
   var http = new XMLHttpRequest();
   var url = "https://play.google.com/store/getreviews?";
   var params = "id=" + opts.id + "&reviewSortOrder=" + sort + "&reviewType=" + opts.reviewType + "&pageNum=" + opts.page + "&hl=" + opts.lang;
   http.open("POST", url+ params, true);

	//Send the proper header information along with the request
	http.setRequestHeader("Access-Control-Allow-Origin", "*");

	http.onreadystatechange = function() {//Call a function when the state changes.
	    if(http.readyState == 4 && http.status == 200) {
	       var response = http.responseText;
	       response = JSON.parse(response.slice(6));
	       $scope.userReviews = Utils.parseFields(response[0][2]);
	    }
	}
	http.send(params);

})

.controller('AppSearchCtrl',function($scope, $state, $ionicPopup, $timeout, Utils) {

	$scope.formData = {};
	$scope.doSearch = function() {
		$scope.searchApps = Utils.searchApp($scope.formData.searchString);	
    }

	// sub controller.
	$scope.showAppDetails = function(id, region) {
		   $state.go('app.single',{appId:id, appRegion:region});
	}
})
