var CaixaApp = angular.module('CaixaApp', ['ngRoute']);

CaixaApp.config(['$routeProvider', function($routeProvider){
	$routeProvider
	.when('/cashout',{
		templateUrl: 'views/cashout.html',
		controller:'CaixaAppController',
	})
	.when('/deposit',{
		templateUrl: 'views/deposit.html',
		controller:'CaixaAppController'
	}).otherwise({
		templateUrl: 'views/cashout.html',
		controller:'CaixaAppController'
	});
}]);

CaixaApp.controller('CaixaAppController',function($scope, $http){

	$scope.data = [];

	$scope.cem = 0;
	$scope.cinquenta = 0;
	$scope.vinte = 0;
	$scope.dez = 0;

	$scope.inserted = false;
	$scope.taken = false;

	$scope.codnota = 0;
	$scope.value = 0;
	$scope.notatext = "notas";

	$scope.cemTaken = 0;
	$scope.cinquentaTaken = 0;
	$scope.vinteTaken = 0;
	$scope.dezTaken = 0;

	$scope.error = false;
	$scope.saqueError = false;
	$scope.depositError = false;

	$scope.putMoney = function(codnota, value) {
		let req = {
			method: 'POST',
			url: 'http://167.99.106.221:80/addMoney',
			headers: [{
			  'Access-Control-Allow-Origin': '*'
			},
			{'Access-Control-Allow-Headers': 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization'},
			{'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE'}],
			data: {'cod':codnota, 'money': value}
		}

		$scope.codnota = codnota;
		$scope.value = value;
		if(value > 1){
			$scope.notatext = "notas";
		}else{
			$scope.notatext = "nota";
		}
		if((codnota / codnota == 1) && (value / value == 1) && codnota >= 0 && value >= 0 ){
			$scope.depositError = false;
			$http(req).then(function(response){
				$scope.inserted = true;
				console.log(response);
				init();
			});
		}else{
			$scope.depositError = true;
			$scope.inserted = false;
		}
	};

	$scope.takeMoney = function($money){
		let req = {
			method: 'POST',
			url: 'http://167.99.106.221:80/getMoney',
			headers: [{
			  'Access-Control-Allow-Origin': '*'
			},
			{'Access-Control-Allow-Headers': 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization'},
			{'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE'}],
			data: {'cod':1, 'money':$money}
		}
		if(($money / $money) == 1 && $money >= 0){
			$scope.saqueError = false;
			$http(req).then(function(response){
				if(response.data.error){
					$scope.error = true;
					$scope.taken = false;
				}else{
					$scope.cemTaken = response.data.cem + " notas de cem";
					$scope.cinquentaTaken = response.data.cinquenta + " notas de cinquenta";
					$scope.vinteTaken = response.data.vinte + " notas de vinte";
					$scope.dezTaken = response.data.dez + " notas de dez";
					$scope.error = false;
					$scope.taken = true;
				}
				init();
			});
		}else{
			$scope.saqueError = true;
			$scope.inserted = false;
			$scope.error = false;
			$scope.taken = false;
		}
	}
	var init = function () {
	   $http.get('http://167.99.106.221:80/').then(function(response){
	   		$scope.cem = response.data.cem;
	   		$scope.cinquenta = response.data.cinquenta;
	   		$scope.vinte = response.data.vinte;
	   		$scope.dez = response.data.dez;
		});
	};
	init();
});
