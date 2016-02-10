angular.module('weliveplayer.controllers.home', [])
.controller('HomeCtrl',function($scope, $state, $ionicPopup, $timeout, Utils, PlayStore) {

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

.controller('AppDetailCtrl',function($scope, $state, $ionicPopup, $timeout, Utils, PlayStore) {

	// get app info.
	$scope.app = Utils.getAppDetails($state.params.appId, $state.params.appRegion);
    
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
   
   var creationSuccess = function (agreegate) {
	   $scope.stars = Utils.getStars(agreegate[0]);
   };

   var creationError = function (error) {
       
   };

   PlayStore.getAgreegateReview($scope.app.storeId).then(creationSuccess, creationError);

})

.controller('AppCommentsCtrl',function($scope, $state, $ionicPopup, $timeout, Utils, $q, PlayStore) {

	var app = Utils.getAppDetails($state.params.appId, $state.params.appRegion);

	PlayStore.getAgreegateReview(app.storeId);
	
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
   
   var creationSuccess = function (reviews) {
	   $scope.userReviews = reviews;
   };

   var creationError = function (error) {
       
   };

   PlayStore.getUserReviews(opts).then(creationSuccess, creationError);
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
