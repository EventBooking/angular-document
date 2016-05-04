function Config() {
}

Run.$inject = ['$rootScope'];

function Run($rootScope) {
    $rootScope.html = '<header>this is the header</header><content>Hello World</content><footer>this is the footer</footer>';
    $rootScope.showEditor = true;

    $rootScope.save = function () {
        $rootScope.showEditor = false;
    }
}

angular.module("demo", ['ngDocument'])
    .config(Config)
    .run(Run);