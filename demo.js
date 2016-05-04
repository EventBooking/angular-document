function Config() {
}

Run.$inject = ['$rootScope'];

function Run($rootScope) {
    $rootScope.html = '<header>this is the header</header><content>Hello World</content><footer>this is the footer</footer>';
    $rootScope.showEditor = false;
    $rootScope.showPdf = true;  
    $rootScope.pdfUrl = 'pdf.pdf';
    
    $rootScope.toggleEditor = function (value) {
        $rootScope.showEditor = value;
    }
    
    $rootScope.togglePdf = function (value) {
        $rootScope.showPdf = value;
    }
}

angular.module("demo", ['ngDocument'])
    .config(Config)
    .run(Run);