module NgDocument {

    class DocumentPdfController {
        constructor() {
            this.options = {};
        }

        onPreInit() {
        }

        onInit() {
        }

        get isLoading(): boolean {
            if (this.pdf == null)
                return true;
            return this.pdf.loading !== null;
        }

        options: any;
        url: string;
        pdf: any;
    }

    class DocumentPdfDirective {
        restrict = 'E';
        transclude = true;
        templateUrl = 'document-pdf.html';
        controller = DocumentPdfController;
        controllerAs = 'documentPdf';
        bindToController = true;
        scope = {
            url: '@'
        }

        link = ($scope, $element, $attrs, $ctrl: DocumentPdfController) => {
            var $pdfViewer = $element.find('[pdf-viewer]');
            $ctrl.pdf = $pdfViewer.controller('pdfViewer');
        }
    }

    Angular.module("ngDocument").directive("documentPdf", DocumentPdfDirective);
}