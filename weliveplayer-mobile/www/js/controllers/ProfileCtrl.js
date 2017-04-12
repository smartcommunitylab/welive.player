    angular.module('weliveplayer.controllers.profile', [])
        .controller('ProfileCtrl', function ($scope, $ionicModal, $timeout, $filter, LoginSrv, StorageSrv, Utils, Config) {

            var userId = StorageSrv.getLoggedInUserId();

            $scope.canRefresh = true;
 
            $scope.initPicker = function() {
              datePicker.show({mode: 'date', date: new Date($scope.profile.birthdate)}, function(date) {
                $scope.profile.birthdate = $filter('date')(date,'yyyy-MM-dd');
                $scope.$apply();
              }, function(){

              });
            }

            var profileBody = {
                "ccUserID": ""
                , "birthdate": ""
                , "address": ""
                , "city": ""
                , "country": ""
                , "zipCode": ""
                , "referredPilot": ""
                , "languages": null
                , "userTags": null
                , "developer": false
            , };

            var preprocessProfile = function() {
                $scope.profile.referredPilot = Config.getPilotMap()[$scope.profile.referredPilot];

                $scope.languages = {
                  Italian: {checked: false},
                  Spanish: {checked: false},
                  Finnish: {checked: false},
                  Serbian: {checked: false},
                  SerbianLatin: {checked: false},
                  English: {checked: false}
                };

                if ($scope.profile.languages) {
                  $scope.profile.languages.forEach(function(l){
                    $scope.languages[l].checked = true;
                  });
                }

                if ($scope.profile.userTags) {
                  var newTags = [];
                  $scope.profile.userTags.forEach(function(t) {
                    if (!!t) newTags.push(t);
                  });
                  $scope.profile.userTags = newTags;
                }
                if ($scope.profile.skills) {
                  var newTags = [];
                  $scope.profile.skills.forEach(function(t) {
                    if (!!t) newTags.push(t);
                  });
                  $scope.profile.skills = newTags;
                }

                // gender.
                var inputGender = $scope.profile.gender;
                if ((inputGender !== undefined) &&
                    (inputGender !== null) &&
                    (inputGender.length != 0)) {
                    $scope.profile.gender = $filter('translate')('lbl_' + inputGender.toLowerCase());
                }
                               
                // fix birtdate string.
                if (
                    ($scope.profile.birthdate !== undefined) &&
                    ($scope.profile.birthdate !== null) &&
                    ($scope.profile.birthdate.length > 9) &&
                    ($scope.isValidDate($scope.profile.birthdate))) {
                    $scope.profile.birthdate = $scope.profile.birthdate.substring(0, 10);
                }
            }

            LoginSrv.makeCDVProfileCall(userId)

                .then(function(response) {
                    if (response) {
                        if (response.data.data) {
                            if (response.data.data.ccUserID) {
                                $scope.profile = response.data.data;
                                // preprocess data
                                preprocessProfile();
                                $scope.cdvProfile = 'exist';
                            }
                        }
                    }
                }
                , function(error) {
                    Utils.toast($filter('translate')('lbl_error'));
                    
                });

            $scope.editProfile = function () {
                $scope.cdvProfile = 'edit';
                $scope.canRefresh = false;
            }

            $scope.saveProfile = function (updateProfile) {

                $scope.canRefresh = true;
                
                // must be set.
                profileBody.ccUserID = updateProfile.ccUserID;

                // create profile json Body.
                if ((updateProfile.birthdate !== undefined) &&
                    (updateProfile.birthdate !== null) &&
                    (updateProfile.birthdate.length > 9) &&
                    ($scope.isValidDate(updateProfile.birthdate))) {
                    profileBody.birthdate = updateProfile.birthdate.substring(0, 10);
                } else {
                    profileBody.birthdate = null;
                }
                
                profileBody.address = updateProfile.address;
                profileBody.city = updateProfile.city;
                profileBody.country = updateProfile.country;
                profileBody.zipCode = updateProfile.zipCode;
                // profileBody.referredPilot = updateProfile.referredPilot;
                profileBody.languages = [];//updateProfile.languages.toString().split(",");
                for (var l in $scope.languages) {
                  if ($scope.languages[l].checked) profileBody.languages.push(l);
                }
                //    profileBody.skills = updateProfile.skills.toString().split(",");
                profileBody.userTags = updateProfile.userTags.toString().split(",");
                // profileBody.developer = (updateProfile.developer.toString().toLowerCase() === "true") ? true : false;

                var body = JSON.stringify(profileBody);

                LoginSrv.makeUpdateCDVProfile(body)
                    .then(function(response) {
                        LoginSrv.makeCDVProfileCall(userId)
                            .then(function(response) {
                                if (response) {
                                    if (response.data.data) {
                                        if (response.data.data.ccUserID) {
                                            $scope.profile = response.data.data;
                                            preprocessProfile();
                                            // fix birtdate string.
                                            $scope.cdvProfile = 'exist';
                                        }
                                    }
                                }
                            }
                            , function (error) {
                                Utils.toast($filter('translate')('lbl_error'));
                                $scope.doRefresh();
                            });
                    }
                    , function(error) {
                        $scope.cdvProfile = 'exist';
                        Utils.toast($filter('translate')('lbl_error'));
                        $scope.doRefresh();
                    })
            }

            $scope.isValidDate = function isValidDate(str) {
                // STRING FORMAT yyyy-mm-dd
                if (str == "" || str == null) {
                    return false;
                }
                // m[1] is year 'YYYY' * m[2] is month 'MM' * m[3] is day 'DD'
                var m = str.match(/(\d{4})-(\d{2})-(\d{2})/);
                // STR IS NOT FIT m IS NOT OBJECT
                if (m === null || typeof m !== 'object') {
                    return false;
                }
                // CHECK m TYPE
                if (typeof m !== 'object' && m !== null && m.size !== 3) {
                    return false;
                }
                var ret = true; //RETURN VALUE
                var thisYear = new Date().getFullYear(); //YEAR NOW
                var minYear = 1999; //MIN YEAR
                // YEAR CHECK 
                if ((m[1].length < 4)) {
                    ret = false;
                }
                // MONTH CHECK
                if ((m[2].length < 2) || m[2] < 1 || m[2] > 12) {
                    ret = false;
                }
                // DAY CHECK
                if ((m[3].length < 2) || m[3] < 1 || m[3] > 31) {
                    ret = false;
                }

                return ret;
            }


            $scope.doRefresh = function () {
                if ($scope.canRefresh) {
                    LoginSrv.makeCDVProfileCall(userId)
                        .then(function (response) {
                            if (response) {
                                if (response.data.data) {
                                    if (response.data.data.ccUserID) {
                                        $scope.profile = response.data.data;
                                        preprocessProfile();
                                        $scope.cdvProfile = 'exist';
                                    }
                                }
                            }
                            $scope.$broadcast('scroll.refreshComplete');
                        }
                        , function (error) {
                            $scope.$broadcast('scroll.refreshComplete');
                        });
                }
                else {
                    $ionicScrollDelegate.resize();
                }
            }    
        })
