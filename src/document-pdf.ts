module NgDocument {
    declare var PDFJS: any;

    class DocumentPdfController {

        onInit(render) {
            this._render = render;
            this.render(this.url);
            this.initialized = true;
        }

        _render: any;
        render(url) {
            this.isLoading = true;
            this._render(url).finally(() => {
                this.isLoading = false
                this.isLoaded = true;
            });
        }

        initialized: boolean;
        isLoading: boolean;
        isLoaded: boolean;

        private _url: string;
        get url(): string {
            return this._url;
        }
        set url(value: string) {
            this._url = value;
            if (!this.initialized)
                return;
            this.render(value);
        }
    }

    class DocumentPdfDirective {
        static $inject = ['$q'];

        constructor(private $q: angular.IQService) {

        }

        restrict = 'E';
        transclude = true;
        templateUrl = 'document-pdf.html';
        controller = DocumentPdfController;
        controllerAs = 'documentPdf';
        bindToController = true;
        scope = {
            url: '@',
            isLoaded: '=?'
        }

        link = ($scope, $element, $attrs, $ctrl: DocumentPdfController) => {
            var $pages = $element.find(".document-viewer-pages");

            $ctrl.onInit((url) => {
                return this.render($scope, $pages, url);
            });
        }

        render($scope, $pages, url) {
            var deferred = this.$q.defer();

            $pages.empty();
            PDFJS.getDocument(url).then(pdf => {

                var tasks = [];
                for (let idx = 0; idx < pdf.pdfInfo.numPages; idx++) {
                    tasks.push(pdf.getPage(idx + 1).then(page => {
                        return this.createPage(page);
                    }));
                }

                this.$q.all(tasks).then(canvases => {
                    $pages.append(canvases);
                    deferred.resolve(pdf);
                });

            });

            return deferred.promise;
        }

        createPage(page) {
            var scale = 1.5;
            var viewport = page.getViewport(scale);

            var $canvas = $('<canvas class="document-viewer-page"></canvas>');
            var canvas: any = $canvas.get(0);
            var context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            var renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            page.render(renderContext);
            return $canvas;
        }
    }

    Angular.module("ngDocument").directive("documentPdf", DocumentPdfDirective);
}