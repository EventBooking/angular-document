Angular.module("ngDocument", ['froala']);
var NgDocument;
(function (NgDocument) {
    var DocumentEditorController = (function () {
        function DocumentEditorController() {
            this.header = this.header || '';
            this.content = this.content || '';
            this.footer = this.footer || '';
        }
        DocumentEditorController.prototype.onPreInit = function (editor, toolbarId) {
            var _this = this;
            this.defaultOptions = {
                iframe: true,
                enter: editor.ENTER_BR,
                width: 816,
                toolbarContainer: "#" + toolbarId,
                tableStyles: {
                    'fr-no-borders': 'No Borders',
                    'fr-alternate-rows': 'Alternate Rows'
                },
                fontFamily: {
                    "'Source Serif Pro', serif": "Serif",
                    "'Source Sans Pro', sans-serif": "Sans Serif",
                    "'Source Code Pro', monospace": "Monospace"
                },
                fontFamilyDefaultSelection: "Serif",
                fontFamilySelection: true,
                iframeStyle: "body{font-family:'Source Serif Pro',serif;}",
                toolbarButtons: [
                    'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|',
                    'color', 'inlineStyle', 'paragraphStyle',
                    //'-',
                    'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '|',
                    'insertHR', 'insertLink', 'insertImage', 'insertTable', 'undo', 'redo', 'clearFormatting', 'html'
                ],
                toolbarButtonsMD: [
                    'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|',
                    'color', 'inlineStyle', 'paragraphStyle',
                    //'-',
                    'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '|',
                    'insertHR', 'insertLink', 'insertImage', 'insertTable', 'undo', 'redo', 'clearFormatting', 'html'
                ],
                toolbarButtonsSM: [
                    'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|',
                    'color', 'inlineStyle', 'paragraphStyle',
                    //'-',
                    'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '|',
                    'insertHR', 'insertLink', 'insertImage', 'insertTable', 'undo', 'redo', 'clearFormatting', 'html'
                ],
                toolbarButtonsXS: [
                    'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|',
                    'color', 'inlineStyle', 'paragraphStyle',
                    //'-',
                    'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '|',
                    'insertHR', 'insertLink', 'insertImage', 'insertTable', 'undo', 'redo', 'clearFormatting', 'html'
                ],
                events: {
                    'froalaEditor.image.beforeUpload': function (e, editor, images) {
                        _this.insertBase64Image(editor, images[0]);
                        return false;
                    }
                }
            };
            this.headerConfig = this.getHeaderConfig(this.headerOptions || {});
            this.contentConfig = this.getContentConfig(this.contentOptions || {});
            this.footerConfig = this.getFooterConfig(this.footerOptions || {});
        };
        DocumentEditorController.prototype.onInit = function () {
            this.setContent(this._html);
            if (this.header.length > 0)
                this.withHeader = true;
            if (this.footer.length > 0)
                this.withFooter = true;
            this.initialized = true;
        };
        DocumentEditorController.prototype.insertBase64Image = function (editor, image) {
            var reader = new FileReader();
            reader.onload = function (readerEvt) {
                editor.image.insert(readerEvt.target.result);
            };
            reader.readAsDataURL(image);
        };
        DocumentEditorController.prototype.getHeaderConfig = function (options) {
            var config = angular.extend({}, this.defaultOptions, options, {
                placeholderText: 'Header'
            });
            var toolbars = ['toolbarButtons', 'toolbarButtonsMD', 'toolbarButtonsSM', 'toolbarButtonsXS'];
            toolbars.forEach(function (x) { return config[x] = config[x].concat(['|', 'removeHeader']); });
            return config;
        };
        DocumentEditorController.prototype.getContentConfig = function (options) {
            return angular.extend({}, this.defaultOptions, options, {
                placeholderText: 'Content'
            });
        };
        DocumentEditorController.prototype.getFooterConfig = function (options) {
            var config = angular.extend({}, this.defaultOptions, options, {
                placeholderText: 'Footer'
            });
            var toolbars = ['toolbarButtons', 'toolbarButtonsMD', 'toolbarButtonsSM', 'toolbarButtonsXS'];
            toolbars.forEach(function (x) { return config[x] = config[x].concat(['|', 'removeFooter']); });
            return config;
        };
        Object.defineProperty(DocumentEditorController.prototype, "html", {
            get: function () {
                var writer = new DocumentWriter(this.header, this.content, this.footer);
                var options = {
                    excludeHeader: !this.withHeader,
                    excludeFooter: !this.withFooter
                };
                return writer.write(options);
            },
            set: function (value) {
                this._html = value;
                if (!this.initialized)
                    return;
                this.setContent(value);
            },
            enumerable: true,
            configurable: true
        });
        DocumentEditorController.prototype.setContent = function (value) {
            var parser = new DocumentReader(value);
            this.header = parser.getHeader();
            this.content = parser.getContent();
            this.footer = parser.getFooter();
        };
        return DocumentEditorController;
    }());
    var DocumentWriter = (function () {
        function DocumentWriter(header, content, footer) {
            this._header = header;
            this._content = content;
            this._footer = footer;
        }
        Object.defineProperty(DocumentWriter.prototype, "hasHeader", {
            get: function () {
                return this._header != null && this._header.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentWriter.prototype, "hasFooter", {
            get: function () {
                return this._footer != null && this._footer.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        DocumentWriter.prototype.write = function (options) {
            var html = [];
            if (this.hasHeader && !options.excludeHeader)
                html.push("<header>" + this._header + "</header>");
            html.push("<content>" + this._content + "</content>");
            if (this.hasFooter && !options.excludeFooter)
                html.push("<footer>" + this._footer + "</footer>");
            return html.join("");
        };
        return DocumentWriter;
    }());
    var DocumentReader = (function () {
        function DocumentReader(html) {
            this._$html = $('<div></div>').append(html || '');
        }
        DocumentReader.prototype.getHeader = function () {
            return this.child('header');
        };
        DocumentReader.prototype.getContent = function () {
            // ToDo: if <content></content> does not exist but there is html, wrap the html in a content tag
            return this.child('content');
        };
        DocumentReader.prototype.getFooter = function () {
            return this.child('footer');
        };
        DocumentReader.prototype.child = function (selector) {
            return this._$html.children(selector).html() || '';
        };
        return DocumentReader;
    }());
    var DocumentEditorDirective = (function () {
        function DocumentEditorDirective() {
            this.restrict = 'E';
            this.transclude = true;
            this.templateUrl = 'document-editor.html';
            this.controller = DocumentEditorController;
            this.controllerAs = 'documentEditor';
            this.bindToController = true;
            this.scope = {
                headerOptions: '=?',
                bodyOptions: '=?',
                footerOptions: '=?',
                html: '=?'
            };
            this.link = {
                pre: function ($scope, $element, $attrs, $ctrl) {
                    var toolbarId = "document-editor-" + $scope.$id + "-wysiwyg-toolbar";
                    var $toolbar = $element.find(".document-editor-wysiwyg-toolbar");
                    $toolbar.prop('id', toolbarId);
                    var editor = $['FroalaEditor'];
                    editor.DefineIcon('removeHeader', { NAME: 'times-circle' });
                    editor.RegisterCommand('removeHeader', {
                        title: 'Remove Header',
                        undo: true,
                        focus: true,
                        refreshAfterCallback: true,
                        callback: function (editor) {
                            $ctrl.withHeader = false;
                            $scope.$apply();
                        }
                    });
                    editor.DefineIcon('removeFooter', { NAME: 'times-circle' });
                    editor.RegisterCommand('removeFooter', {
                        title: 'Remove Footer',
                        undo: true,
                        focus: true,
                        refreshAfterCallback: true,
                        callback: function (editor) {
                            $ctrl.withFooter = false;
                            $scope.$apply();
                        }
                    });
                    $ctrl.onPreInit(editor, toolbarId);
                },
                post: function ($scope, $element, $attrs, $ctrl) {
                    var $header = $('.document-editor-header', $element);
                    var $content = $('.document-editor-content', $element);
                    var $footer = $('.document-editor-footer', $element);
                    $header.froalaEditor('toolbar.hide');
                    //$content.froalaEditor('toolbar.hide');
                    $footer.froalaEditor('toolbar.hide');
                    $header.on('froalaEditor.focus', function (e, editor) {
                        editor.toolbar.show();
                        $content.froalaEditor('toolbar.hide');
                        $footer.froalaEditor('toolbar.hide');
                    });
                    $content.on('froalaEditor.focus', function (e, editor) {
                        $header.froalaEditor('toolbar.hide');
                        editor.toolbar.show();
                        $footer.froalaEditor('toolbar.hide');
                    });
                    $footer.on('froalaEditor.focus', function (e, editor) {
                        $header.froalaEditor('toolbar.hide');
                        $content.froalaEditor('toolbar.hide');
                        editor.toolbar.show();
                    });
                    $ctrl.onInit();
                }
            };
        }
        return DocumentEditorDirective;
    }());
    Angular.module("ngDocument").directive("documentEditor", DocumentEditorDirective);
})(NgDocument || (NgDocument = {}));
var NgDocument;
(function (NgDocument) {
    var DocumentPdfController = (function () {
        function DocumentPdfController() {
        }
        DocumentPdfController.prototype.onInit = function (render) {
            this._render = render;
            this.render(this.url);
            this.initialized = true;
        };
        DocumentPdfController.prototype.render = function (url) {
            var _this = this;
            this.isLoading = true;
            this._render(url).finally(function () { return _this.isLoading = false; });
        };
        Object.defineProperty(DocumentPdfController.prototype, "url", {
            get: function () {
                return this._url;
            },
            set: function (value) {
                this._url = value;
                if (!this.initialized)
                    return;
                this.render(value);
            },
            enumerable: true,
            configurable: true
        });
        return DocumentPdfController;
    }());
    var DocumentPdfDirective = (function () {
        function DocumentPdfDirective($q) {
            var _this = this;
            this.$q = $q;
            this.restrict = 'E';
            this.transclude = true;
            this.templateUrl = 'document-pdf.html';
            this.controller = DocumentPdfController;
            this.controllerAs = 'documentPdf';
            this.bindToController = true;
            this.scope = {
                url: '@'
            };
            this.link = function ($scope, $element, $attrs, $ctrl) {
                var $pages = $element.find(".document-viewer-pages");
                $ctrl.onInit(function (url) {
                    return _this.render($scope, $pages, url);
                });
            };
        }
        DocumentPdfDirective.prototype.render = function ($scope, $pages, url) {
            var _this = this;
            var deferred = this.$q.defer();
            $pages.empty();
            PDFJS.getDocument(url).then(function (pdf) {
                var tasks = [];
                for (var idx = 0; idx < pdf.pdfInfo.numPages; idx++) {
                    tasks.push(pdf.getPage(idx + 1).then(function (page) {
                        return _this.createPage(page);
                    }));
                }
                _this.$q.all(tasks).then(function (canvases) {
                    $pages.append(canvases);
                    deferred.resolve(pdf);
                });
            });
            return deferred.promise;
        };
        DocumentPdfDirective.prototype.createPage = function (page) {
            var scale = 1.5;
            var viewport = page.getViewport(scale);
            var $canvas = $('<canvas class="document-viewer-page"></canvas>');
            var canvas = $canvas.get(0);
            var context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            var renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            page.render(renderContext);
            return $canvas;
        };
        DocumentPdfDirective.$inject = ['$q'];
        return DocumentPdfDirective;
    }());
    Angular.module("ngDocument").directive("documentPdf", DocumentPdfDirective);
})(NgDocument || (NgDocument = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1kb2N1bWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHAudHMiLCIuLi9zcmMvZG9jdW1lbnQtZWRpdG9yLnRzIiwiLi4vc3JjL2RvY3VtZW50LXBkZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUNBekMsSUFBTyxVQUFVLENBdVRoQjtBQXZURCxXQUFPLFVBQVUsRUFBQyxDQUFDO0lBRWY7UUFDSTtZQUNJLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7WUFDaEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztZQUNsQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO1FBQ3BDLENBQUM7UUFFRCw0Q0FBUyxHQUFULFVBQVUsTUFBTSxFQUFFLFNBQVM7WUFBM0IsaUJBeURDO1lBeERHLElBQUksQ0FBQyxjQUFjLEdBQUc7Z0JBQ2xCLE1BQU0sRUFBRSxJQUFJO2dCQUNaLEtBQUssRUFBRSxNQUFNLENBQUMsUUFBUTtnQkFDdEIsS0FBSyxFQUFFLEdBQUc7Z0JBQ1YsZ0JBQWdCLEVBQUUsTUFBSSxTQUFXO2dCQUNqQyxXQUFXLEVBQUU7b0JBQ1QsZUFBZSxFQUFFLFlBQVk7b0JBQzdCLG1CQUFtQixFQUFFLGdCQUFnQjtpQkFDeEM7Z0JBQ0QsVUFBVSxFQUFFO29CQUNSLDJCQUEyQixFQUFFLE9BQU87b0JBQ3BDLCtCQUErQixFQUFFLFlBQVk7b0JBQzdDLDhCQUE4QixFQUFFLFdBQVc7aUJBQzlDO2dCQUNELDBCQUEwQixFQUFFLE9BQU87Z0JBQ25DLG1CQUFtQixFQUFFLElBQUk7Z0JBQ3pCLFdBQVcsRUFBRSw2Q0FBNkM7Z0JBQzFELGNBQWMsRUFBRTtvQkFDWixNQUFN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VSxHQUFWLFVBQVcsSUFBSTtZQUNYLElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQztZQUNoQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRXZDLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO1lBQ2xFLElBQUksTUFBTSxHQUFRLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QyxNQUFNLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDaEMsTUFBTSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO1lBRTlCLElBQUksYUFBYSxHQUFHO2dCQUNoQixhQUFhLEVBQUUsT0FBTztnQkFDdEIsUUFBUSxFQUFFLFFBQVE7YUFDckIsQ0FBQztZQUVGLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDM0IsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUNuQixDQUFDO1FBaEVNLDRCQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQWlFNUIsMkJBQUM7SUFBRCxDQUFDLEFBbEVELElBa0VDO0lBRUQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLG9CQUFvQixDQUFDLENBQUM7QUFDaEYsQ0FBQyxFQXJHTSxVQUFVLEtBQVYsVUFBVSxRQXFHaEIiLCJzb3VyY2VzQ29udGVudCI6WyJBbmd1bGFyLm1vZHVsZShcIm5nRG9jdW1lbnRcIiwgWydmcm9hbGEnXSk7IiwibW9kdWxlIE5nRG9jdW1lbnQge1xyXG5cclxuICAgIGNsYXNzIERvY3VtZW50RWRpdG9yQ29udHJvbGxlciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGVhZGVyID0gdGhpcy5oZWFkZXIgfHwgJyc7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuY29udGVudCB8fCAnJztcclxuICAgICAgICAgICAgdGhpcy5mb290ZXIgPSB0aGlzLmZvb3RlciB8fCAnJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9uUHJlSW5pdChlZGl0b3IsIHRvb2xiYXJJZCkge1xyXG4gICAgICAgICAgICB0aGlzLmRlZmF1bHRPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgaWZyYW1lOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZW50ZXI6IGVkaXRvci5FTlRFUl9CUixcclxuICAgICAgICAgICAgICAgIHdpZHRoOiA4MTYsXHJcbiAgICAgICAgICAgICAgICB0b29sYmFyQ29udGFpbmVyOiBgIyR7dG9vbGJhcklkfWAsXHJcbiAgICAgICAgICAgICAgICB0YWJsZVN0eWxlczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdmci1uby1ib3JkZXJzJzogJ05vIEJvcmRlcnMnLFxyXG4gICAgICAgICAgICAgICAgICAgICdmci1hbHRlcm5hdGUtcm93cyc6ICdBbHRlcm5hdGUgUm93cydcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCInU291cmNlIFNlcmlmIFBybycsIHNlcmlmXCI6IFwiU2VyaWZcIixcclxuICAgICAgICAgICAgICAgICAgICBcIidTb3VyY2UgU2FucyBQcm8nLCBzYW5zLXNlcmlmXCI6IFwiU2FucyBTZXJpZlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiJ1NvdXJjZSBDb2RlIFBybycsIG1vbm9zcGFjZVwiOiBcIk1vbm9zcGFjZVwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZm9udEZhbWlseURlZmF1bHRTZWxlY3Rpb246IFwiU2VyaWZcIixcclxuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHlTZWxlY3Rpb246IHRydWUsXHJcbiAgICAgICAgICAgICAgICBpZnJhbWVTdHlsZTogXCJib2R5e2ZvbnQtZmFtaWx5OidTb3VyY2UgU2VyaWYgUHJvJyxzZXJpZjt9XCIsXHJcbiAgICAgICAgICAgICAgICB0b29sYmFyQnV0dG9uczogW1xyXG4gICAgICAgICAgICAgICAgICAgICdib2xkJywgJ2l0YWxpYycsICd1bmRlcmxpbmUnLCAnc3RyaWtlVGhyb3VnaCcsICdzdWJzY3JpcHQnLCAnc3VwZXJzY3JpcHQnLCAnZm9udEZhbWlseScsICdmb250U2l6ZScsICd8JyxcclxuICAgICAgICAgICAgICAgICAgICAnY29sb3InLCAnaW5saW5lU3R5bGUnLCAncGFyYWdyYXBoU3R5bGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vJy0nLFxyXG4gICAgICAgICAgICAgICAgICAgICdwYXJhZ3JhcGhGb3JtYXQnLCAnYWxpZ24nLCAnZm9ybWF0T0wnLCAnZm9ybWF0VUwnLCAnb3V0ZGVudCcsICdpbmRlbnQnLCAncXVvdGUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2luc2VydEhSJywgJ2luc2VydExpbmsnLCAnaW5zZXJ0SW1hZ2UnLCAnaW5zZXJ0VGFibGUnLCAndW5kbycsICdyZWRvJywgJ2NsZWFyRm9ybWF0dGluZycsICdodG1sJ1xyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJCdXR0b25zTUQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAnYm9sZCcsICdpdGFsaWMnLCAndW5kZXJsaW5lJywgJ3N0cmlrZVRocm91Z2gnLCAnc3Vic2NyaXB0JywgJ3N1cGVyc2NyaXB0JywgJ2ZvbnRGYW1pbHknLCAnZm9udFNpemUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbG9yJywgJ2lubGluZVN0eWxlJywgJ3BhcmFncmFwaFN0eWxlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyctJyxcclxuICAgICAgICAgICAgICAgICAgICAncGFyYWdyYXBoRm9ybWF0JywgJ2FsaWduJywgJ2Zvcm1hdE9MJywgJ2Zvcm1hdFVMJywgJ291dGRlbnQnLCAnaW5kZW50JywgJ3F1b3RlJywgJ3wnLFxyXG4gICAgICAgICAgICAgICAgICAgICdpbnNlcnRIUicsICdpbnNlcnRMaW5rJywgJ2luc2VydEltYWdlJywgJ2luc2VydFRhYmxlJywgJ3VuZG8nLCAncmVkbycsICdjbGVhckZvcm1hdHRpbmcnLCAnaHRtbCdcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICB0b29sYmFyQnV0dG9uc1NNOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgJ2JvbGQnLCAnaXRhbGljJywgJ3VuZGVybGluZScsICdzdHJpa2VUaHJvdWdoJywgJ3N1YnNjcmlwdCcsICdzdXBlcnNjcmlwdCcsICdmb250RmFtaWx5JywgJ2ZvbnRTaXplJywgJ3wnLFxyXG4gICAgICAgICAgICAgICAgICAgICdjb2xvcicsICdpbmxpbmVTdHlsZScsICdwYXJhZ3JhcGhTdHlsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8nLScsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3BhcmFncmFwaEZvcm1hdCcsICdhbGlnbicsICdmb3JtYXRPTCcsICdmb3JtYXRVTCcsICdvdXRkZW50JywgJ2luZGVudCcsICdxdW90ZScsICd8JyxcclxuICAgICAgICAgICAgICAgICAgICAnaW5zZXJ0SFInLCAnaW5zZXJ0TGluaycsICdpbnNlcnRJbWFnZScsICdpbnNlcnRUYWJsZScsICd1bmRvJywgJ3JlZG8nLCAnY2xlYXJGb3JtYXR0aW5nJywgJ2h0bWwnXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgdG9vbGJhckJ1dHRvbnNYUzogW1xyXG4gICAgICAgICAgICAgICAgICAgICdib2xkJywgJ2l0YWxpYycsICd1bmRlcmxpbmUnLCAnc3RyaWtlVGhyb3VnaCcsICdzdWJzY3JpcHQnLCAnc3VwZXJzY3JpcHQnLCAnZm9udEZhbWlseScsICdmb250U2l6ZScsICd8JyxcclxuICAgICAgICAgICAgICAgICAgICAnY29sb3InLCAnaW5saW5lU3R5bGUnLCAncGFyYWdyYXBoU3R5bGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vJy0nLFxyXG4gICAgICAgICAgICAgICAgICAgICdwYXJhZ3JhcGhGb3JtYXQnLCAnYWxpZ24nLCAnZm9ybWF0T0wnLCAnZm9ybWF0VUwnLCAnb3V0ZGVudCcsICdpbmRlbnQnLCAncXVvdGUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2luc2VydEhSJywgJ2luc2VydExpbmsnLCAnaW5zZXJ0SW1hZ2UnLCAnaW5zZXJ0VGFibGUnLCAndW5kbycsICdyZWRvJywgJ2NsZWFyRm9ybWF0dGluZycsICdodG1sJ1xyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGV2ZW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdmcm9hbGFFZGl0b3IuaW1hZ2UuYmVmb3JlVXBsb2FkJzogKGUsIGVkaXRvciwgaW1hZ2VzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0QmFzZTY0SW1hZ2UoZWRpdG9yLCBpbWFnZXNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5oZWFkZXJDb25maWcgPSB0aGlzLmdldEhlYWRlckNvbmZpZyh0aGlzLmhlYWRlck9wdGlvbnMgfHwge30pO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnRDb25maWcgPSB0aGlzLmdldENvbnRlbnRDb25maWcodGhpcy5jb250ZW50T3B0aW9ucyB8fCB7fSk7XHJcbiAgICAgICAgICAgIHRoaXMuZm9vdGVyQ29uZmlnID0gdGhpcy5nZXRGb290ZXJDb25maWcodGhpcy5mb290ZXJPcHRpb25zIHx8IHt9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9uSW5pdCgpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRDb250ZW50KHRoaXMuX2h0bWwpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oZWFkZXIubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgIHRoaXMud2l0aEhlYWRlciA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmZvb3Rlci5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy53aXRoRm9vdGVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGluc2VydEJhc2U2NEltYWdlKGVkaXRvcjogYW55LCBpbWFnZTogRmlsZSkge1xyXG4gICAgICAgICAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICAgICAgcmVhZGVyLm9ubG9hZCA9IChyZWFkZXJFdnQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yLmltYWdlLmluc2VydChyZWFkZXJFdnQudGFyZ2V0LnJlc3VsdCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGltYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldEhlYWRlckNvbmZpZyhvcHRpb25zOiBhbnkpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgY29uZmlnID0gYW5ndWxhci5leHRlbmQoe30sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyVGV4dDogJ0hlYWRlcidcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdG9vbGJhcnMgPSBbJ3Rvb2xiYXJCdXR0b25zJywgJ3Rvb2xiYXJCdXR0b25zTUQnLCAndG9vbGJhckJ1dHRvbnNTTScsICd0b29sYmFyQnV0dG9uc1hTJ107XHJcbiAgICAgICAgICAgIHRvb2xiYXJzLmZvckVhY2goeCA9PiBjb25maWdbeF0gPSBjb25maWdbeF0uY29uY2F0KFsnfCcsICdyZW1vdmVIZWFkZXInXSkpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldENvbnRlbnRDb25maWcob3B0aW9uczogYW55KTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlclRleHQ6ICdDb250ZW50J1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldEZvb3RlckNvbmZpZyhvcHRpb25zOiBhbnkpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgY29uZmlnID0gYW5ndWxhci5leHRlbmQoe30sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyVGV4dDogJ0Zvb3RlcidcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdG9vbGJhcnMgPSBbJ3Rvb2xiYXJCdXR0b25zJywgJ3Rvb2xiYXJCdXR0b25zTUQnLCAndG9vbGJhckJ1dHRvbnNTTScsICd0b29sYmFyQnV0dG9uc1hTJ107XHJcbiAgICAgICAgICAgIHRvb2xiYXJzLmZvckVhY2goeCA9PiBjb25maWdbeF0gPSBjb25maWdbeF0uY29uY2F0KFsnfCcsICdyZW1vdmVGb290ZXInXSkpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgX2h0bWw6IHN0cmluZztcclxuICAgICAgICBnZXQgaHRtbCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB2YXIgd3JpdGVyID0gbmV3IERvY3VtZW50V3JpdGVyKHRoaXMuaGVhZGVyLCB0aGlzLmNvbnRlbnQsIHRoaXMuZm9vdGVyKTtcclxuICAgICAgICAgICAgdmFyIG9wdGlvbnM6IElEb2N1bWVudFdyaXRlck9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICBleGNsdWRlSGVhZGVyOiAhdGhpcy53aXRoSGVhZGVyLFxyXG4gICAgICAgICAgICAgICAgZXhjbHVkZUZvb3RlcjogIXRoaXMud2l0aEZvb3RlclxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gd3JpdGVyLndyaXRlKG9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0IGh0bWwodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLl9odG1sID0gdmFsdWU7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5zZXRDb250ZW50KHZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc2V0Q29udGVudCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciBwYXJzZXIgPSBuZXcgRG9jdW1lbnRSZWFkZXIodmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmhlYWRlciA9IHBhcnNlci5nZXRIZWFkZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5jb250ZW50ID0gcGFyc2VyLmdldENvbnRlbnQoKTtcclxuICAgICAgICAgICAgdGhpcy5mb290ZXIgPSBwYXJzZXIuZ2V0Rm9vdGVyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBoZWFkZXJPcHRpb25zOiBhbnk7XHJcbiAgICAgICAgY29udGVudE9wdGlvbnM6IGFueTtcclxuICAgICAgICBmb290ZXJPcHRpb25zOiBhbnk7XHJcbiAgICAgICAgZGVmYXVsdE9wdGlvbnM6IGFueTtcclxuICAgICAgICBoZWFkZXJDb25maWc6IGFueTtcclxuICAgICAgICBjb250ZW50Q29uZmlnOiBhbnk7XHJcbiAgICAgICAgZm9vdGVyQ29uZmlnOiBhbnk7XHJcblxyXG4gICAgICAgIGluaXRpYWxpemVkOiBib29sZWFuO1xyXG4gICAgICAgIGhlYWRlcjogc3RyaW5nO1xyXG4gICAgICAgIGNvbnRlbnQ6IHN0cmluZztcclxuICAgICAgICBmb290ZXI6IHN0cmluZztcclxuICAgICAgICB3aXRoSGVhZGVyOiBib29sZWFuO1xyXG4gICAgICAgIHdpdGhGb290ZXI6IGJvb2xlYW47XHJcbiAgICB9XHJcblxyXG4gICAgaW50ZXJmYWNlIElEb2N1bWVudFdyaXRlck9wdGlvbnMge1xyXG4gICAgICAgIGV4Y2x1ZGVIZWFkZXI6IGJvb2xlYW47XHJcbiAgICAgICAgZXhjbHVkZUZvb3RlcjogYm9vbGVhbjtcclxuICAgIH1cclxuXHJcbiAgICBpbnRlcmZhY2UgSURvY3VtZW50V3JpdGVyIHtcclxuICAgICAgICB3cml0ZSgpOiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3MgRG9jdW1lbnRXcml0ZXIgaW1wbGVtZW50cyBJRG9jdW1lbnRXcml0ZXIge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKGhlYWRlcjogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcsIGZvb3Rlcjogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2hlYWRlciA9IGhlYWRlcjtcclxuICAgICAgICAgICAgdGhpcy5fY29udGVudCA9IGNvbnRlbnQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2Zvb3RlciA9IGZvb3RlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBoYXNIZWFkZXIoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9oZWFkZXIgIT0gbnVsbCAmJiB0aGlzLl9oZWFkZXIubGVuZ3RoID4gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBoYXNGb290ZXIoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb290ZXIgIT0gbnVsbCAmJiB0aGlzLl9mb290ZXIubGVuZ3RoID4gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHdyaXRlKG9wdGlvbnM/OiBJRG9jdW1lbnRXcml0ZXJPcHRpb25zKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIGh0bWwgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc0hlYWRlciAmJiAhb3B0aW9ucy5leGNsdWRlSGVhZGVyKVxyXG4gICAgICAgICAgICAgICAgaHRtbC5wdXNoKGA8aGVhZGVyPiR7dGhpcy5faGVhZGVyfTwvaGVhZGVyPmApO1xyXG5cclxuICAgICAgICAgICAgaHRtbC5wdXNoKGA8Y29udGVudD4ke3RoaXMuX2NvbnRlbnR9PC9jb250ZW50PmApO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzRm9vdGVyICYmICFvcHRpb25zLmV4Y2x1ZGVGb290ZXIpXHJcbiAgICAgICAgICAgICAgICBodG1sLnB1c2goYDxmb290ZXI+JHt0aGlzLl9mb290ZXJ9PC9mb290ZXI+YCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaHRtbC5qb2luKFwiXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfaGVhZGVyOiBzdHJpbmc7XHJcbiAgICAgICAgcHJpdmF0ZSBfY29udGVudDogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgX2Zvb3Rlcjogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGludGVyZmFjZSBJRG9jdW1lbnRSZWFkZXIge1xyXG4gICAgICAgIGdldEhlYWRlcigpOiBzdHJpbmc7XHJcbiAgICAgICAgZ2V0Q29udGVudCgpOiBzdHJpbmc7XHJcbiAgICAgICAgZ2V0Rm9vdGVyKCk6IHN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBEb2N1bWVudFJlYWRlciBpbXBsZW1lbnRzIElEb2N1bWVudFJlYWRlciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoaHRtbDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuXyRodG1sID0gJCgnPGRpdj48L2Rpdj4nKS5hcHBlbmQoaHRtbCB8fCAnJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIF8kaHRtbDogSlF1ZXJ5O1xyXG5cclxuICAgICAgICBnZXRIZWFkZXIoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGQoJ2hlYWRlcicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0Q29udGVudCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICAvLyBUb0RvOiBpZiA8Y29udGVudD48L2NvbnRlbnQ+IGRvZXMgbm90IGV4aXN0IGJ1dCB0aGVyZSBpcyBodG1sLCB3cmFwIHRoZSBodG1sIGluIGEgY29udGVudCB0YWdcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGQoJ2NvbnRlbnQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldEZvb3RlcigpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZCgnZm9vdGVyJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGNoaWxkKHNlbGVjdG9yOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fJGh0bWwuY2hpbGRyZW4oc2VsZWN0b3IpLmh0bWwoKSB8fCAnJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3MgRG9jdW1lbnRFZGl0b3JEaXJlY3RpdmUge1xyXG4gICAgICAgIHJlc3RyaWN0ID0gJ0UnO1xyXG4gICAgICAgIHRyYW5zY2x1ZGUgPSB0cnVlO1xyXG4gICAgICAgIHRlbXBsYXRlVXJsID0gJ2RvY3VtZW50LWVkaXRvci5odG1sJztcclxuICAgICAgICBjb250cm9sbGVyID0gRG9jdW1lbnRFZGl0b3JDb250cm9sbGVyO1xyXG4gICAgICAgIGNvbnRyb2xsZXJBcyA9ICdkb2N1bWVudEVkaXRvcic7XHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlciA9IHRydWU7XHJcbiAgICAgICAgc2NvcGUgPSB7XHJcbiAgICAgICAgICAgIGhlYWRlck9wdGlvbnM6ICc9PycsXHJcbiAgICAgICAgICAgIGJvZHlPcHRpb25zOiAnPT8nLFxyXG4gICAgICAgICAgICBmb290ZXJPcHRpb25zOiAnPT8nLFxyXG4gICAgICAgICAgICBodG1sOiAnPT8nXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsaW5rID0ge1xyXG4gICAgICAgICAgICBwcmU6ICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICRjdHJsOiBEb2N1bWVudEVkaXRvckNvbnRyb2xsZXIpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciB0b29sYmFySWQgPSBgZG9jdW1lbnQtZWRpdG9yLSR7JHNjb3BlLiRpZH0td3lzaXd5Zy10b29sYmFyYDtcclxuICAgICAgICAgICAgICAgIHZhciAkdG9vbGJhciA9ICRlbGVtZW50LmZpbmQoXCIuZG9jdW1lbnQtZWRpdG9yLXd5c2l3eWctdG9vbGJhclwiKTtcclxuICAgICAgICAgICAgICAgICR0b29sYmFyLnByb3AoJ2lkJywgdG9vbGJhcklkKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZWRpdG9yOiBhbnkgPSAkWydGcm9hbGFFZGl0b3InXTtcclxuXHJcbiAgICAgICAgICAgICAgICBlZGl0b3IuRGVmaW5lSWNvbigncmVtb3ZlSGVhZGVyJywgeyBOQU1FOiAndGltZXMtY2lyY2xlJyB9KTtcclxuICAgICAgICAgICAgICAgIGVkaXRvci5SZWdpc3RlckNvbW1hbmQoJ3JlbW92ZUhlYWRlcicsIHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1JlbW92ZSBIZWFkZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIHVuZG86IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZm9jdXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVmcmVzaEFmdGVyQ2FsbGJhY2s6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IChlZGl0b3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGN0cmwud2l0aEhlYWRlciA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZWRpdG9yLkRlZmluZUljb24oJ3JlbW92ZUZvb3RlcicsIHsgTkFNRTogJ3RpbWVzLWNpcmNsZScgfSk7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3IuUmVnaXN0ZXJDb21tYW5kKCdyZW1vdmVGb290ZXInLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdSZW1vdmUgRm9vdGVyJyxcclxuICAgICAgICAgICAgICAgICAgICB1bmRvOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvY3VzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlZnJlc2hBZnRlckNhbGxiYWNrOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoZWRpdG9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRjdHJsLndpdGhGb290ZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICRjdHJsLm9uUHJlSW5pdChlZGl0b3IsIHRvb2xiYXJJZCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBvc3Q6ICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICRjdHJsOiBEb2N1bWVudEVkaXRvckNvbnRyb2xsZXIpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgJGhlYWRlcjogYW55ID0gJCgnLmRvY3VtZW50LWVkaXRvci1oZWFkZXInLCAkZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgJGNvbnRlbnQ6IGFueSA9ICQoJy5kb2N1bWVudC1lZGl0b3ItY29udGVudCcsICRlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIHZhciAkZm9vdGVyOiBhbnkgPSAkKCcuZG9jdW1lbnQtZWRpdG9yLWZvb3RlcicsICRlbGVtZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAkaGVhZGVyLmZyb2FsYUVkaXRvcigndG9vbGJhci5oaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAvLyRjb250ZW50LmZyb2FsYUVkaXRvcigndG9vbGJhci5oaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkZm9vdGVyLmZyb2FsYUVkaXRvcigndG9vbGJhci5oaWRlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgJGhlYWRlci5vbignZnJvYWxhRWRpdG9yLmZvY3VzJywgKGUsIGVkaXRvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXRvci50b29sYmFyLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAkY29udGVudC5mcm9hbGFFZGl0b3IoJ3Rvb2xiYXIuaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICRmb290ZXIuZnJvYWxhRWRpdG9yKCd0b29sYmFyLmhpZGUnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICRjb250ZW50Lm9uKCdmcm9hbGFFZGl0b3IuZm9jdXMnLCAoZSwgZWRpdG9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGhlYWRlci5mcm9hbGFFZGl0b3IoJ3Rvb2xiYXIuaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXRvci50b29sYmFyLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAkZm9vdGVyLmZyb2FsYUVkaXRvcigndG9vbGJhci5oaWRlJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAkZm9vdGVyLm9uKCdmcm9hbGFFZGl0b3IuZm9jdXMnLCAoZSwgZWRpdG9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGhlYWRlci5mcm9hbGFFZGl0b3IoJ3Rvb2xiYXIuaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICRjb250ZW50LmZyb2FsYUVkaXRvcigndG9vbGJhci5oaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWRpdG9yLnRvb2xiYXIuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJGN0cmwub25Jbml0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBBbmd1bGFyLm1vZHVsZShcIm5nRG9jdW1lbnRcIikuZGlyZWN0aXZlKFwiZG9jdW1lbnRFZGl0b3JcIiwgRG9jdW1lbnRFZGl0b3JEaXJlY3RpdmUpO1xyXG59IiwibW9kdWxlIE5nRG9jdW1lbnQge1xyXG4gICAgZGVjbGFyZSB2YXIgUERGSlM6IGFueTtcclxuXHJcbiAgICBjbGFzcyBEb2N1bWVudFBkZkNvbnRyb2xsZXIge1xyXG5cclxuICAgICAgICBvbkluaXQocmVuZGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlciA9IHJlbmRlcjtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXIodGhpcy51cmwpO1xyXG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF9yZW5kZXI6IGFueTtcclxuICAgICAgICByZW5kZXIodXJsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyKHVybCkuZmluYWxseSgoKSA9PiB0aGlzLmlzTG9hZGluZyA9IGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluaXRpYWxpemVkOiBib29sZWFuO1xyXG4gICAgICAgIGlzTG9hZGluZzogYm9vbGVhbjtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfdXJsOiBzdHJpbmc7XHJcbiAgICAgICAgZ2V0IHVybCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdXJsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXQgdXJsKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5fdXJsID0gdmFsdWU7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXIodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBEb2N1bWVudFBkZkRpcmVjdGl2ZSB7XHJcbiAgICAgICAgc3RhdGljICRpbmplY3QgPSBbJyRxJ107XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgJHE6IGFuZ3VsYXIuSVFTZXJ2aWNlKSB7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzdHJpY3QgPSAnRSc7XHJcbiAgICAgICAgdHJhbnNjbHVkZSA9IHRydWU7XHJcbiAgICAgICAgdGVtcGxhdGVVcmwgPSAnZG9jdW1lbnQtcGRmLmh0bWwnO1xyXG4gICAgICAgIGNvbnRyb2xsZXIgPSBEb2N1bWVudFBkZkNvbnRyb2xsZXI7XHJcbiAgICAgICAgY29udHJvbGxlckFzID0gJ2RvY3VtZW50UGRmJztcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyID0gdHJ1ZTtcclxuICAgICAgICBzY29wZSA9IHtcclxuICAgICAgICAgICAgdXJsOiAnQCdcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxpbmsgPSAoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkY3RybDogRG9jdW1lbnRQZGZDb250cm9sbGVyKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciAkcGFnZXMgPSAkZWxlbWVudC5maW5kKFwiLmRvY3VtZW50LXZpZXdlci1wYWdlc1wiKTtcclxuXHJcbiAgICAgICAgICAgICRjdHJsLm9uSW5pdCgodXJsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXIoJHNjb3BlLCAkcGFnZXMsIHVybCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVuZGVyKCRzY29wZSwgJHBhZ2VzLCB1cmwpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gdGhpcy4kcS5kZWZlcigpO1xyXG5cclxuICAgICAgICAgICAgJHBhZ2VzLmVtcHR5KCk7XHJcbiAgICAgICAgICAgIFBERkpTLmdldERvY3VtZW50KHVybCkudGhlbihwZGYgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB0YXNrcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaWR4ID0gMDsgaWR4IDwgcGRmLnBkZkluZm8ubnVtUGFnZXM7IGlkeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFza3MucHVzaChwZGYuZ2V0UGFnZShpZHggKyAxKS50aGVuKHBhZ2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVQYWdlKHBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLiRxLmFsbCh0YXNrcykudGhlbihjYW52YXNlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHBhZ2VzLmFwcGVuZChjYW52YXNlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShwZGYpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3JlYXRlUGFnZShwYWdlKSB7XHJcbiAgICAgICAgICAgIHZhciBzY2FsZSA9IDEuNTtcclxuICAgICAgICAgICAgdmFyIHZpZXdwb3J0ID0gcGFnZS5nZXRWaWV3cG9ydChzY2FsZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgJGNhbnZhcyA9ICQoJzxjYW52YXMgY2xhc3M9XCJkb2N1bWVudC12aWV3ZXItcGFnZVwiPjwvY2FudmFzPicpO1xyXG4gICAgICAgICAgICB2YXIgY2FudmFzOiBhbnkgPSAkY2FudmFzLmdldCgwKTtcclxuICAgICAgICAgICAgdmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IHZpZXdwb3J0LmhlaWdodDtcclxuICAgICAgICAgICAgY2FudmFzLndpZHRoID0gdmlld3BvcnQud2lkdGg7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmVuZGVyQ29udGV4dCA9IHtcclxuICAgICAgICAgICAgICAgIGNhbnZhc0NvbnRleHQ6IGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICB2aWV3cG9ydDogdmlld3BvcnRcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHBhZ2UucmVuZGVyKHJlbmRlckNvbnRleHQpO1xyXG4gICAgICAgICAgICByZXR1cm4gJGNhbnZhcztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQW5ndWxhci5tb2R1bGUoXCJuZ0RvY3VtZW50XCIpLmRpcmVjdGl2ZShcImRvY3VtZW50UGRmXCIsIERvY3VtZW50UGRmRGlyZWN0aXZlKTtcclxufSJdfQ==