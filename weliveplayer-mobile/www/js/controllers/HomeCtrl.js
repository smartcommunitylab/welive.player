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
       { text: 'ANNULLA' },
       {
         text: '<b>ORDINA</b>',
         type: 'button-positive',
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
   $timeout(function() {
      myPopup.close(); //close the popup after 10 seconds for some reason
   }, 10000);
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
	var app = Utils.getAppDetails($state.params.appId, $state.params.appRegion);

	// sub controller.
   $scope.showAppComments = function(id) {
	   $scope.selection = 'userComment';
	   $state.go('app.comments',{appId:id});
   }
		
	$scope.selection = 'info';
	
	$scope.city = app.city;
	$scope.name = app.name;
	$scope.rating = app.rating;
	$scope.tags = app.tags;
	
	$scope.getStars = function (vote) {
        return Utils.getStars(vote);
    };
	
   $scope.download = function(id) {
	   $scope.selection = 'download';
	   
   }
   
   $scope.info = function() {
    $scope.selection = 'info';
	}

})

.controller('AppCommentsCtrl',function($scope, $state, $ionicPopup, $timeout, Utils) {
	
	var app = Utils.getAppDetails($state.params.appId);
	
	$scope.name = app.name;
	// get app info.
	// var app = Utils.getAppComments($state.params.appId);
	
	$scope.download = function(id) {	   
    }

   
   $scope.info = function() {
    $state.go('app.single',{appId:app.id, appRegion:app.city});
	}
	
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
