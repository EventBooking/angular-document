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
