angular
	.module('moneys')
    .config(routeConfig);

function routeConfig($routeProvider) {
    $routeProvider
        .when('/', {
        	templateUrl: 'static/templates/views/home.html',
            controller: 'HomeController',
            controllerAs: 'vm'
        });
}
