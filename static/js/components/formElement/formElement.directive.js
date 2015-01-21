(function() {
    'use strict';

    angular
        .module('moneys')
        .directive('formElement', formElement);

    function formElement() {
        return {
            link: link,
            scope: {
                'formElement': '='
            },
            restrict: 'A'
        };

        function link(scope, element) {
            scope.formElement = element.get(0);
        }
    }
})();