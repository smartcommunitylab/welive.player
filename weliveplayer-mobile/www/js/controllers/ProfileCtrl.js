    angular.module('weliveplayer.controllers.profile', [])
        .controller('ProfileCtrl', function ($scope, $ionicModal, $timeout, LoginSrv, StorageSrv) {

            var userId = StorageSrv.getLoggedInUserId();

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

            LoginSrv.makeCDVProfileCall(userId)

                .then(function(response) {
                    if (response) {
                        if (response.data.data) {
                            if (response.data.data.ccUserID) {
                                $scope.profile = response.data.data;
                                // fix birtdate string.
                                if (response.data.data.birthdate.length > 9 && $scope.isValidDate(response.data.data.birthdate)) {
                                    $scope.profile.birthdate = response.data.data.birthdate.substring(0, 10);
                                } else {
                                    $scope.profile.birthdate = 'yyyy-mm-dd';
                                }
                                $scope.cdvProfile = 'exist';
                            }
                        }
                    }
                }
                , function(error) {
                });

            $scope.editProfile = function () {
                $scope.cdvProfile = 'edit';
            }

            $scope.saveProfile = function (updateProfile) {

                // create profile json Body.
                profileBody.ccUserID = updateProfile.ccUserID;
                if (updateProfile.birthdate.length > 9 && $scope.isValidDate(updateProfile.birthdate)) {
                    profileBody.birthdate = updateProfile.birthdate.substring(0, 10);
                } else {
                    profileBody.birthdate = null;
                }
                profileBody.address = updateProfile.address;
                profileBody.city = updateProfile.city;
                profileBody.country = updateProfile.country;
                profileBody.zipCode = updateProfile.zipCode;
                profileBody.referredPilot = updateProfile.referredPilot;
                profileBody.languages = updateProfile.languages.toString().split(",");
                //    profileBody.skills = updateProfile.skills.toString().split(",");
                profileBody.userTags = updateProfile.userTags.toString().split(",");
                profileBody.developer = (updateProfile.developer.toString().toLowerCase() === "true") ? true : false;

                var body = JSON.stringify(profileBody);

                LoginSrv.makeUpdateCDVProfile(body)
                    .then(function(response) {
                        LoginSrv.makeCDVProfileCall(userId)
                            .then(function(response) {
                                if (response) {
                                    if (response.data.data) {
                                        if (response.data.data.ccUserID) {
                                            $scope.profile = response.data.data;
                                            // fix birtdate string.
                                            if (response.data.data.birthdate.length > 9 && $scope.isValidDate(response.data.data.birthdate)) {
                                                $scope.profile.birthdate = response.data.data.birthdate.substring(0, 10);
                                            } else {
                                                $scope.profile.birthdate = 'yyyy-mm-dd';
                                            }
                                            $scope.cdvProfile = 'exist';
                                        }
                                    }
                                }
                            }
                            , function(error) {
                            });
                    }
                    , function(error) {
                        $scope.cdvProfile = 'exist';
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


            $scope.doRefresh = function() {
                LoginSrv.makeCDVProfileCall(userId)
                    .then(function(response) {
                        if (response) {
                            if (response.data.data) {
                                if (response.data.data.ccUserID) {
                                    $scope.profile = response.data.data;
                                    if (response.data.data.birthdate.length > 9 && $scope.isValidDate(response.data.data.birthdate)) {
                                        $scope.profile.birthdate = response.data.data.birthdate.substring(0, 10);
                                    } else {
                                        $scope.profile.birthdate = 'yyyy-mm-dd';
                                    }
                                    $scope.cdvProfile = 'exist';
                                }
                            }
                        }
                        $scope.$broadcast('scroll.refreshComplete');
                    }
                    , function(error) {
                        $scope.$broadcast('scroll.refreshComplete');
                    });
            }
        })
