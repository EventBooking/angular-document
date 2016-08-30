function Config() {
}

Run.$inject = ['$rootScope'];

function Run($rootScope) {
    $rootScope.html = '<header>this is the header</header><content>Hello World</content><footer>this is the footer</footer>';
    $rootScope.showEditor = true;
    $rootScope.showPdf = false;
    $rootScope.pdfUrl = 'pdf.pdf';

    $rootScope.toggleEditor = function (value) {
        $rootScope.showEditor = value;
    }

    $rootScope.togglePdf = function (value) {
        $rootScope.showPdf = value;
    }

    $rootScope.copyToClipboard = function (html) {
        var aux = document.createElement("input");
        aux.setAttribute("value", html);
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);
    }
}

angular.module("demo", ['ngDocument'])
    .config(Config)
    .run(Run);