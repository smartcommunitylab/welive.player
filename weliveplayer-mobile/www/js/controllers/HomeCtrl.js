angular.module('weliveplayer.controllers.home', [])
.controller('HomeCtrl',function($scope, $ionicPopup, $timeout) {
   $scope.sort = {};
   $scope.sort.choice = 'Consigliati';
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
	 console.log('Tapped!', res);
   });
   $timeout(function() {
      myPopup.close(); //close the popup after 3 seconds for some reason
   }, 10000);
  };

$scope.data = {
	showDelete : false,
	showOption : true,
	};

$scope.edit = function(item) {
	alert('Edit Item: ' + item.id);
	};
$scope.share = function(item) {
	alert('Share Item: ' + item.id);
	};

$scope.moveItem = function(item, fromIndex, toIndex) {
	$scope.items.splice(fromIndex, 1);
	$scope.items.splice(toIndex, 0, item);
	};

$scope.onItemDelete = function(item) {
	$scope.items.splice($scope.items.indexOf(item), 1);
	};

$scope.items = [
                { id: 0, name: 'app0' },
                { id: 1, name: 'app1' },
                { id: 2, name: 'app2' },
                { id: 3, name: 'app3' },
                { id: 4, name: 'app4' },
                { id: 5, name: 'app5' },
                { id: 6, name: 'app6' },
                { id: 7, name: 'app7' },
                { id: 8, name: 'app8' },
                { id: 9, name: 'app9' },
                { id: 10, name: 'app10' }
              ];
});