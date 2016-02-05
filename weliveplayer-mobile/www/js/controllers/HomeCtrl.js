angular.module('weliveplayer.controllers.home', [])
.controller('HomeCtrl',function($scope, $state, $ionicPopup, $timeout, Utils) {
   
   $scope.selections = ['trento'];	
   $scope.items = Utils.getAppsByRegion($scope.selections);	
	
   $scope.sort = {};
   $scope.sort.choice = 'Consigliati';
   
   // sub controller.
   $scope.showAppDetails = function(id) {
	   $state.go('app.single',{appId:id});
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
})

.controller('AppDetailCtrl',function($scope, $state, $ionicPopup, $timeout, Utils) {
	
	// get app info.
	var app = Utils.getAppDetails($state.params.appId);
	
	$scope.city = app.city;
	$scope.name = app.name
	
})