'use strict';

angular.module('joggingApp')
  .controller('MainCtrl', function ($scope, $http, Auth) {

    $scope.newTimeRecord = {};
    $scope.timeRecords = [];
    $scope.timeReport = {};

    $scope.isAdmin = Auth.isAdmin;
    $scope.isLoggedIn = Auth.isLoggedIn;

    //console.log($scope.isLoggedIn);

    $scope.$watch('timeRecords', function(){
      calcTimeReports();
      //console.log('timeRecords changed', newVal, oldVal);
    }, true);


    $http.get('/api/times').success(function(timeRecords) {
      $scope.timeRecords = timeRecords;
      calcTimeReports();
    });


    $scope.addTimeRecord = function() {

      $http.post('/api/times', $scope.newTimeRecord).then(function(response){
        $scope.timeRecords.push(response.data);
      });
      $scope.newTimeRecord = {};

    };

    $scope.deleteTimeRecord = function(timeRecord, key) {
      if(confirm('Are you sure?')) {
        $http.delete('/api/times/' + timeRecord._id);
        $scope.timeRecords.splice(key, 1);
      }
    };

    var stateHistory = {};

    $scope.cancelEditTimeRecord = function(timeRecord, key) {
      timeRecord.edit = false;
      $scope.timeRecords[key] = stateHistory[timeRecord._id];
    };

    $scope.editTimeRecord = function(timeRecord, key) {
      stateHistory[timeRecord._id] = angular.extend({}, timeRecord);
      timeRecord.edit = true;
      timeRecord.dateObject = new Date(timeRecord.date);
    };

    $scope.saveTimeRecord = function(timeRecord, key) {
      timeRecord.edit = false;
      timeRecord.date = timeRecord.dateObject;
      // Save
      $http.put('/api/times/' + timeRecord._id, timeRecord).then(function(response){
        console.log(response.data);
      });
    };

    var getWeekString = function(dateObject) {
      var retval = dateObject.getFullYear() + '/' + (dateObject.getMonth() + 1);
      retval += ', week ' + Math.ceil(dateObject.getDate() / 7);
      return retval;
    };

    var calcTimeReports = function(){
      $scope.timeReport = {};

      var temp = $scope.timeRecords.slice();
      temp.sort(function(a, b){
        return new Date(a.date) - new Date(b.date);
      });

      for (var i in temp) {
        //console.log(temp[i]);
        var dateObject = new Date(temp[i].date);
        var week = getWeekString(dateObject);
        if ($scope.timeReport[week] === undefined) {
          $scope.timeReport[week] = {
            distance: temp[i].distance,
            duration: temp[i].duration
          };
        } else {
          $scope.timeReport[week].distance += temp[i].distance;
          $scope.timeReport[week].duration += temp[i].duration;
        }
      }
    };
  });
