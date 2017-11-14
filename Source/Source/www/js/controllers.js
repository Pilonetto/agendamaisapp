angular.module('starter.controllers', ["ngStorage"])

.controller('AppCtrl', function($ionicHistory,$state,$scope, $ionicModal, $timeout,$http, $sessionStorage,$window,searchdate,$rootScope,$ionicLoading) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});



  // Form data for the login modal
  $scope.loginData = {};
  $scope.signUpData = {};
  $scope.resetData = {};
  $scope.Doc={};
  $scope.AppointmentDetails={};
  $scope.desiredSearchData = {};
  $scope.desiredSearchData.speciality = '';
  $scope.desiredSearchData.insurance = '';
  $scope.desiredSearchData.location = '';
  $scope.desiredSearchData.selectedDate = new Date();
  $scope.desiredSearchData.page=0;
  $scope.desiredSearchData.status='first';
  //$scope.coreurl="http://localhost/bookmydoc_new_theme/";
  $scope.coreurl=coreurl;
  $scope.baseurl=baseurl;
  $scope.my_key=my_key;
  
console.log($scope.baseurl);
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope,
    caching: false
  }).then(function(modal) {
    $scope.modal = modal;
  });
    $ionicModal.fromTemplateUrl('templates/signup.html', {
    scope: $scope,
    caching: false
  }).then(function(signup_modal) {
    $scope.signup_modal = signup_modal;
  });
  $ionicModal.fromTemplateUrl('templates/forgot_password.html', {
    scope: $scope,
    caching: false
  }).then(function(reset_modal) {
    $scope.reset_modal = reset_modal;
  });
  $ionicModal.fromTemplateUrl('templates/doc_modal.html', {
    scope: $scope,
    caching: false
  }).then(function(doc_modal) {
    $scope.doc_modal = doc_modal;
  });

  

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };
  $scope.closeSignup = function() {
    $scope.signup_modal.hide();
  };
  $scope.closeForgot = function() {
    $scope.reset_modal.hide();
  };
  $scope.closeDoc_modal = function() {
    $scope.doc_modal.hide();
  };
 

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.signup = function() {
    $scope.signup_modal.show();
  };
    $scope.reset = function() {
    $scope.reset_modal.show();
  };
  $scope.doc_modal = function() {
    $scope.doc_modal.show();
  };
  $scope.join = function() {
    $scope.modal.hide();
    $scope.signup_modal.show();
  };
  


$scope.submitted= false;$scope.loginError =false;$sessionStorage.userSessionStatus = false;$scope.noSessionStatus = true;
  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    $ionicLoading.show({
      template: '<img  src="img/loading.gif" />'
    });
    $scope.loginData.usertype='2';
    var url='/Signin';
    $http({
      url: $scope.baseurl+url, 
      method: "POST",
      data: $scope.loginData,
    }).then(function mySucces(response) {
        $scope.loginDetails = response.data; 
        // $sessionStorage.userSession = response.data;
        // console.log($sessionStorage.SessionMessage);
        if($scope.loginDetails.error.status===false){
          $sessionStorage.userSession = response.data;
          $scope.userSession = response.data;
          $scope.userSessionStatus = true;
          $scope.AppointmentDetails.details = true;
          $scope.noSessionStatus = false;
          $timeout(function() {
            $ionicLoading.hide();
            $scope.closeLogin();
          }, 1000);
          
        }else{
          $scope.loginError = $scope.loginDetails.error.status;
          $scope.loginErrorMsg = $scope.loginDetails.error.msg;
          $timeout(function() {
            $ionicLoading.hide();
          }, 1000);
        }
    });
  }
    $scope.doSignup = function() {
      $ionicLoading.show({
        template: '<img  src="img/loading.gif" />'
      });
      $scope.signUpData.usertype='2';
      var url='/Signup';
      $http({
        url: $scope.baseurl+url, 
        method: "POST",
        data: $scope.signUpData,
      }).then(function mySucces(response) {
          $scope.signupDetails = response.data; 
          $scope.signupError = $scope.signupDetails.status;
          $scope.signupMessage = $scope.signupDetails.msg;
          $ionicLoading.hide();
          $timeout(function() {            
            $scope.closeSignup();
            $scope.login();
          }, 3000);
      });
    }
    
    $ionicHistory.clearCache();
    $scope.my_booking =function(){
      $ionicHistory.clearCache();
      $ionicHistory.nextViewOptions({ disableBack: true });
      $state.go('app.my_booking');
    }
    $scope.doForgot =function(){
      //console.log($scope.resetData);
    }

    $scope.Logout = function() {
      $sessionStorage.userSession = '';
      $scope.userSessionStatus = false;
      $scope.noSessionStatus = true;
      $window.location.href = '#/app/bmd-home';
    }

    $scope.get_appointments = function(){
      console.log('appointment');
      $scope.loading=true;
      $scope.loadingpart=false;
      $ionicHistory.nextViewOptions({ disableBack: true });
      var url='/get_appointment';
      $http({
          url: $scope.baseurl+url, 
          method: "POST",
          data: {'user_id':$scope.userSession.userID},
        }).then(function mySucces(response) {
            $scope.AppointmentList = response.data; 
            console.log($scope.AppointmentList);
            $timeout(function() {
              $scope.loading = false; 
              $scope.loadingpart = ($scope.AppointmentList.status) ? true :false;
              $scope.AppointmentStatus = ($scope.AppointmentList.status==false) ? true :false;
            }, 1000);
        });
      };

      $scope.view_doc = function(id){
        $scope.doc_popup_id=id;
        //console.log(id);
        var url='/get_doctor_info';
        $http({
          url: $scope.baseurl+url, 
          method: "POST",
          data: {'user_id': id},
        }).then(function mySucces(response) {
            $rootScope.docpopup = response.data; 
            $scope.doc_modal.show();
        });
      }
      $scope.Doc.date = (searchdate.get()=='')? new Date() :searchdate.get();

      $scope.loading = true; 
      $scope.loadingpart = false;

      $rootScope.updateDoc = function(id,fname,lname,speciality,rating,image,address,status){
        $ionicHistory.clearCache();
      $ionicHistory.nextViewOptions({ disableBack: true });
      $window.location.href='#app/doctor';
        $scope.Doc.id = (id=='')? $scope.Doc.id : id;
        var date = $scope.Doc.date ;
        date.setDate( $scope.Doc.date.getDate());
        $scope.Doc.endDate = $scope.Doc.date;
        var date1 = $scope.Doc.endDate ;
        date1.setDate( $scope.Doc.endDate.getDate());
        $scope.Doc.fname = fname;
        $scope.Doc.lname = lname;
        $scope.Doc.speciality = speciality;
        $scope.Doc.rating = rating;
        $scope.Doc.image = image;
        $scope.Doc.address = address;
        $scope.Doc.status = status;
        console.log($scope.loading);
        var url='/get_doctor_details';
        $http({
          url: $scope.baseurl+url, 
          method: "POST",
          data: {'docData': $scope.Doc},
        }).then(function mySucces(response) {
          $scope.Doc.resultData = response.data;
          $timeout(function() {
            $scope.loading = false; 
            $scope.loadingpart = true;
          }, 1000);
          date1.setDate( $scope.Doc.endDate.getDate()+4);
          $scope.doc_modal.hide();
          
        });
    }
$scope.selectedDay = (searchdate.get()=='')? new Date() :searchdate.get();
  $scope.selectedDate =($scope.selectedDate=='')?  new Date() : $scope.selectedDate;

$scope.slide= function(myTransition) {
  $rootScope.transitionClass ='test';
    $timeout(function(){
      $rootScope.transitionClass = myTransition;
    },500);
}

})





.controller('BMDCtrl', function($ionicModal,$rootScope,$scope, $stateParams,$http,speciality,location,insurance,searchdate,$window,$timeout,$filter,$ionicLoading) {
  $scope.apnt_init = function(){
	  $scope.select_insurance = '';
	  $scope.select_reason = '';
    //$stateParams.apnt_date_time = $stateParams.apnt_date_time.replace(/([T,a,p])/g, ' $1');
    // var date = new Date($stateParams.apnt_date_time).getTime();
    // var offset = new Date($stateParams.apnt_date_time).getTimezoneOffset();
    // var selectedDate = date - offset;
    // $scope.AppointmentDetails.selectedDate = new Date($stateParams.apnt_date_time).getTime();
    // console.log(new Date(Date.parse($scope.AppointmentDetails.apnt_date_time)).toUTCString());
    $scope.AppointmentDetails.selectedDate = $stateParams.apnt_date_time;

    var url='/get_insurance_list';
    $http({
        url: $scope.baseurl+url, 
        method: "POST",
      }).then(function mySucces(response) {
          $scope.AppointmentDetails.selectionDetails = response.data; 
      });

      var url='/visit_categories';
    $http({
        url: $scope.baseurl+url, 
        method: "POST",
      }).then(function mySucces(response) {
          $scope.AppointmentDetails.visit_categories = response.data;
      });
    }
    
    $scope.slide_apnt= function(myTransition,prev,next) {
      $rootScope.transitionClass ='sample';
        $timeout(function(){
          $rootScope.transitionClass = myTransition;
          $scope.AppointmentDetails.details = (next=="details") ? true : false;
          $scope.AppointmentDetails.confirm = (next=="confirm") ? true : false;
          $scope.AppointmentDetails.success = (next=="success") ? true : false;
        },300);
    }

   //check app_config
    var url='/appkey_validator'; 
    $http({
      url: $scope.baseurl+url, 
      method: "POST",
    data: {'my_key': $scope.my_key},
    }).then(function mySucces(response) {  
      $timeout(function(){
        $ionicLoading.hide();
      },1000);           
      if(response.data=='false'){
        $window.location.href = '#/app/bmd-blocked';
        console.log('bmd-blocked');
      }
    });



    $scope.search = function(search_text){
      $window.location.href = '#/app/search_list/'+search_text;
      //console.log(search_text);
      
    }
    $scope.loading = true; 
    $scope.loadingpart = false;
    $scope.searchList = function(){
      var url='/act_search_bar';
      $http({
          url: $scope.baseurl+url, 
          method: "POST",
          data: {'search_text': $stateParams.search_text},
        }).then(function mySucces(response) {
            $scope.searchResponse = response.data;
            //console.log($scope.searchResponse);
            //$window.location.href = '#/app/search_list';
            $timeout(function() {
              $scope.loading = false; 
              $scope.loadingpart = ($scope.searchResponse.location == null && $scope.searchResponse.user == null && $scope.searchResponse.speciality == null && $scope.searchResponse.insurance == null && $scope.searchResponse.languages == null ) ? false : true;
              $scope.noMoreItems = ($scope.searchResponse.location == null && $scope.searchResponse.user == null && $scope.searchResponse.speciality == null && $scope.searchResponse.insurance == null && $scope.searchResponse.languages == null ) ? true : false; 
            }, 1000);
        });
    }
     $scope.view_search_list_doc = function(id){
        $scope.doc_popup_id=id;
        //console.log(id);
        var url='/get_doctor_info';
        $http({
          url: $scope.baseurl+url, 
          method: "POST",
          data: {'user_id': id},
        }).then(function mySucces(response) {
            $rootScope.docpopup = response.data; 
            $scope.doc_modal.show();
        });
      }

    $scope.test = function(test){
      $scope.srchReason = test;
    }

    $scope.bookAppointment = function(){
      $ionicLoading.show({
        template: '<img  src="img/loading.gif" />'
      });
      $scope.Appointment ={};
      $scope.Appointment.doctor_id = $scope.Doc.id;
      // $scope.Appointment.apnttime = $filter('date')($scope.AppointmentDetails.selectedDate, "EEEE,MMMM dd,yyyy")+" at "+$filter('date')($scope.AppointmentDetails.selectedDate, "hh:mm a");
      $scope.Appointment.apnttime = $scope.AppointmentDetails.selectedDate;
      $scope.Appointment.patiendid = $scope.userSession.userID;
      $scope.Appointment.apnt_note = $scope.srchReason;
      $scope.Appointment.email = $scope.Doc.doctorId;
      $scope.Appointment.name = $scope.userSession.name;
      //$scope.reason = $scope.visit_reason;
     // $scope.insurance = $scope.insurance;
      $scope.Appointment.docname = $scope.Doc.fname +" "+$scope.Doc.lname ;
      console.log($scope.Appointment);
        var url='/act_confirm_apnt';
        $http({
            url: $scope.baseurl+url, 
            method: "POST",
            data: {'Appointment': $scope.Appointment,'reason': $scope.select_reason, 'insurance': $scope.select_insurance},
          }).then(function mySucces(response) {
              $scope.Appointment.response = response.data;
              //$scope.AppointmentDetails.confirm = false;
              //$scope.AppointmentDetails.success=true; 
              if(response.data.status==true){
                $timeout(function() {
                  $ionicLoading.hide();
                  $scope.slide_apnt('slidein-from-right','confirm','success');
                }, 1000);
              }else{
                $timeout(function() {
                  $ionicLoading.hide();
                }, 1000);
              }
          });
    }
	
	$scope.appinsurance = function(item){
		 console.log(item);
		 $scope.select_insurance = item;
	}
	$scope.appreason = function(item){
		 console.log(item);
		 $scope.select_reason= item;
	}
  //console.log($scope.AppointmentDetails);
  $scope.selectionname = $stateParams.selectionId;
  var url='/get_selection_details';
  $scope.loading = true; 
  $scope.loadingpart = false;
  console.log($scope.loading);
  switch ($scope.selectionname) {
            case 'speciality':
                speciality.set('Selecione a especialidade.');
                delete $scope.desiredSearchData.speciality;
                break;
            case 'insurance':
                insurance.set('Vou selecionar meu plano de saúde mais tarde.');
                delete $scope.desiredSearchData.insurance;
                break;
            case 'location':
                location.set('Selecione sua localização.');
                delete $scope.desiredSearchData.location;
                break;
            case 'languages':
                location.set('Selecione a lingua.');
                delete $scope.desiredSearchData.languages;
                break;
            default:

        }

  $http.post($scope.baseurl+url, { data: { 'selectionname': $scope.selectionname } })
  .success(function(response) {
    $scope.selectionDetails = response;
    $timeout(function() {
            $scope.loading = false; 
            $scope.loadingpart = true; 
          }, 1000);
  });

    $scope.desiredSpeciality = speciality.get();
    $scope.desiredInsurance = insurance.get();
    $scope.desiredLocation = location.get();
    $scope.clickfunction =function(id,data,type,key){
      
      switch (type) {
            case 'speciality':
                speciality.set(data);
                $scope.desiredSearchData.speciality = id;
                break;
            case 'insurance':
                insurance.set(data);
                $scope.desiredSearchData.insurance = id;
                break;
            case 'location':
                location.set(data);
                $scope.desiredSearchData.location = id;
                break;
            case 'languages':
                location.set(data);
                $scope.desiredSearchData.languages = id;
                break;
            default:

        }
        var url=(key==null) ? '#/app/bmd-home' : '#/app/search' ;
      $window.location.href = url;
    }
    

 $ionicModal.fromTemplateUrl('templates/calendar.html', {
    scope: $scope,
    caching: false
  }).then(function(calendar_modal) {
    $scope.calendar_modal = calendar_modal;
  });
  $scope.calendar = function() {
    $scope.loading = true;
    $scope.loadingpart = false;
      var url='/get_calendar_details';
    $http({
      url: $scope.baseurl+url, 
      method: "POST",
    }).then(function mySucces(response) {
      $scope.calenderDetails = response.data;
      
      $timeout(function() {
            $scope.loading = false; 
            $scope.loadingpart = true; 
          }, 1000);
    });

    $scope.calendar_modal.show();
  };

  $scope.calender_fetch = function(month,year){
    $scope.loading = true;
    $scope.loadingpart = false; 
     var url='/get_calendar_details';
    $http({
      url: $scope.baseurl+url, 
      method: "GET",
      params: {'month': month,'year':year},
    }).then(function mySucces(response) {
      $scope.calenderDetails = response.data;
      $timeout(function() {
            $scope.loading = false; 
            $scope.loadingpart = true; 
          }, 1000);
    });
  };

  $scope.selectedDay = (searchdate.get()=='')? new Date() :searchdate.get();
  $scope.selectedDate =($scope.selectedDate=='')?  new Date() : $scope.selectedDate;
  $scope.desiredSearchData.selectedDate =$scope.selectedDate;
  $scope.selectedclass = 'none';
  //$scope.loading = false;
  $scope.loadingpart = false;
  $scope.updateDate = function(day,date){
    $scope.selectedDay = day;
    $scope.selectedDate = date;
    var HHmmss = $filter('date')(new Date(), 'HH:mm:ss');
    var selectedDate = date+"T"+HHmmss;
    $scope.desiredSearchData.selectedDate =new Date(selectedDate);
    searchdate.set($scope.desiredSearchData.selectedDate);
    $scope.selectedclass = ($scope.selectedclass == 'none') ? 'selected' : 'none';
  }

  $scope.closeCalendar = function() {
    $scope.calendar_modal.hide();
  };
  
  $scope.findDoc = function(){
    $window.location.href = '#/app/search';
  };
})
.controller('searchCtrl', function($ionicModal,$rootScope,$scope, $stateParams,$http,speciality,location,insurance,searchdate,$window,$timeout,$filter) {
    $scope.desiredSearchData.page=0;
    $scope.selectedDay = (searchdate.get()=='')? new Date() :searchdate.get();
    $scope.selectedDate = (searchdate.get()=='')? new Date() :searchdate.get();
    console.log($scope.selectedDate);
    $scope.questions = [];
    $scope.loadmore = function(NumOfFeedToLoad){
      $scope.noMoreItemsAvailable = false;
      $scope.noMoreItems = false;
      var page = $scope.desiredSearchData.page;
      $scope.desiredSearchData.page=++page;
      //console.log(page);
      $scope.desiredSearchData.selectedDate=$filter('date')($scope.selectedDate, "yyyy-MM-dd hh:mm a");
      //console.log($scope.desiredSearchData.status);
      var url='/get_search_details';
      $http({
        url: $scope.baseurl+url, 
        method: "POST",
        data: {'searchData': $scope.desiredSearchData},
      }).then(function mySucces(response) {
        $scope.searchResultData =response.data;
        if($scope.searchResultData.hasOwnProperty('profile_details'))
        {
          $scope.questions = $scope.questions.concat(response.data.profile_details);
        }
        console.log($scope.questions.length,response.data.length);
        //$scope.noMoreItemsAvailable = ($scope.questions.length >= response.data.length)? true : false;
        //$scope.noMoreItems = ($scope.questions.length >= response.data.length)? true : false;
        console.log($scope.questions.length,response.data.length);
        $scope.noMoreItemsAvailable = ($scope.questions.length >= response.data.length)? true : false;
        console.log('noMoreItemsAvailable'+$scope.noMoreItemsAvailable);
        console.log(response.data.length==0,$scope.searchResultData.hasOwnProperty('profile_details'));
        $scope.noMoreItems = (response.data.length==0 && $scope.searchResultData.hasOwnProperty('profile_details')) ? true : false;
        console.log($scope.noMoreItems);
        console.log($scope.searchResultData.hasOwnProperty('profile_details'));
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };

    $scope.setDate = function(type){
      var date = $scope.selectedDate ;
      date.setDate((type=='next')? $scope.selectedDate.getDate()+1 : $scope.selectedDate.getDate()-1);
      searchdate.set(date);
      $scope.desiredSearchData.status=(type=='next')? 'next' : 'prev';
      $scope.desiredSearchData.selectedDate =$filter('date')(date, "yyyy-MM-dd hh:mm a");
      $scope.desiredSearchData.page=0;
      //angular.element($("[my-directive]")).html('');
      $scope.questions = [];
      $scope.loadmore();
    };
    

        $scope.Doc.date = $scope.selectedDate;
 
    
    $scope.single_calendar = function(status){
      $scope.loading = true; 
      $scope.loadingpart = false;
      //console.log(status);
      $scope.Doc.resultData ='';
      var date = $scope.Doc.date ;
      date.setDate((status=='next')? $scope.Doc.date.getDate()+5 : $scope.Doc.date.getDate()-5 );
      var date1 = $scope.Doc.endDate ;
      date1.setDate((status=='next')? $scope.Doc.endDate.getDate()+5 : $scope.Doc.endDate.getDate()-5 );
      $scope.Doc.status = status;
      var url='/get_doctor_details';
        $http({
          url: $scope.baseurl+url, 
          method: "POST",
          data: {'docData': $scope.Doc},
        }).then(function mySucces(response) {
          $scope.Doc.resultData = response.data;
          $timeout(function() {
            $scope.loading = false; 
            $scope.loadingpart = true; 
          }, 3000);
        });
    }

    $scope.apnt_navigate = function(date,time){
       console.log(date,time);
       console.log(time);
       time = time.replace("am", "");
       time = time.replace("pm", "");

      var curr_dte= Math.round(new Date().getTime()/1000);
      var event_date = Math.round(new Date(date+" "+time).getTime()/1000);
       
      
      console.log(event_date);
      console.log(curr_dte);
      // alert('');
       if(curr_dte > event_date){


          alert('Booking is not Available');
          //return false;
        }
        else{

      $scope.AppointmentDetails.details = true;
      $scope.AppointmentDetails.confirm = false;
      $scope.AppointmentDetails.success = false;
      $window.location.href = '#/app/appointment/'+date+'T'+time;
   }
    }

});
