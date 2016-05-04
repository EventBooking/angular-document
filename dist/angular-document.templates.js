(function(module) {
try {
  module = angular.module('ngDocument');
} catch (e) {
  module = angular.module('ngDocument', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('document-editor.html',
    '<div class="document-editor-wysiwyg">\n' +
    '    <div class="document-editor-wysiwyg-content-add" ng-if="!documentEditor.withHeader">\n' +
    '        <span class="document-editor-wysiwyg-content-add-button" ng-click="documentEditor.withHeader = true">\n' +
    '            <span class="fa-stack fa-lg">\n' +
    '                <i class="fa fa-circle-thin fa-stack-2x"></i>\n' +
    '                <i class="fa fa-plus fa-stack-1x"></i>\n' +
    '            </span>\n' +
    '            <span>Header</span>\n' +
    '        </span>\n' +
    '    </div>\n' +
    '    <div class="document-editor-wysiwyg-content">\n' +
    '        <div class="document-editor-wysiwyg-content-item" ng-if="documentEditor.withHeader">\n' +
    '            <textarea froala="documentEditor.headerConfig" ng-model="documentEditor.header"></textarea>\n' +
    '        </div>\n' +
    '        <div class="document-editor-wysiwyg-content-item">\n' +
    '            <textarea froala="documentEditor.contentConfig" ng-model="documentEditor.content"></textarea>\n' +
    '        </div>\n' +
    '        <div class="document-editor-wysiwyg-content-item" ng-if="documentEditor.withFooter">\n' +
    '            <textarea froala="documentEditor.footerConfig" ng-model="documentEditor.footer"></textarea>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="document-editor-wysiwyg-content-add" ng-if="!documentEditor.withFooter">\n' +
    '        <span class="document-editor-wysiwyg-content-add-button" ng-click="documentEditor.withFooter = true">\n' +
    '            <span class="fa-stack fa-lg">\n' +
    '                <i class="fa fa-circle-thin fa-stack-2x"></i>\n' +
    '                <i class="fa fa-plus fa-stack-1x"></i>\n' +
    '            </span>\n' +
    '            <span>Footer</span> \n' +
    '        </span>\n' +
    '    </div>\n' +
    '</div>\n' +
    '<div class="document-editor-sidebar">\n' +
    '    <div class="document-editor-sidebar-content" ng-transclude></div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ngDocument');
} catch (e) {
  module = angular.module('ngDocument', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('document-pdf.html',
    '<div class="document-viewer-main">\n' +
    '    <div ng-show="documentPdf.isLoading">\n' +
    '        <div class="document-viewer-loading">\n' +
    '            <i class="fa fa-spin fa-circle-o-notch"></i> Loading...\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div ng-show="!documentPdf.isLoading">\n' +
    '        <div class="document-viewer-toolbar">\n' +
    '            <i class="document-viewer-toolbar-icon fa fa-chevron-left" ng-click="documentPdf.pdf.previousPage()"></i>\n' +
    '            <span class="document-viewer-toolbar-title">{{documentPdf.pdf.page}} of {{documentPdf.pdf.total}}</span>\n' +
    '            <i class="document-viewer-toolbar-icon fa fa-chevron-right" ng-click="documentPdf.pdf.nextPage()"></i>\n' +
    '        </div>\n' +
    '        <div class="document-viewer-page" pdf-viewer="documentPdf.options" pdf-url="documentPdf.url"></div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '<div class="document-viewer-sidebar" ng-transclude></div>');
}]);
})();
