Angular.module("ngDocument", ['froala']);
var NgDocument;
(function (NgDocument) {
    var DocumentEditorController = (function () {
        function DocumentEditorController() {
            this.header = this.header || '';
            this.content = this.content || '';
            this.footer = this.footer || '';
            this.headerOptions = this.headerOptions || {};
            this.contentOptions = this.contentOptions || {};
            this.footerOptions = this.footerOptions || {};
        }
        DocumentEditorController.prototype.onPreInit = function () {
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
        Object.defineProperty(DocumentEditorController.prototype, "headerConfig", {
            get: function () {
                var _this = this;
                return angular.extend(this.headerOptions || {}, {
                    placeholderText: 'Header',
                    width: 816,
                    toolbarSticky: false,
                    toolbarButtons: [
                        'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|',
                        'color', 'inlineStyle', 'paragraphStyle', '|', 'removeHeader',
                        '-',
                        'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '|',
                        'insertHR', 'insertLink', 'insertImage', 'insertTable', 'undo', 'redo', 'clearFormatting', 'html'
                    ],
                    toolbarButtonsMD: [],
                    toolbarButtonsSM: [],
                    toolbarButtonsXS: [],
                    events: {
                        'froalaEditor.image.beforeUpload': function (e, editor, images) {
                            _this.insertBase64Image(editor, images[0]);
                            return false;
                        }
                    }
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentEditorController.prototype, "contentConfig", {
            get: function () {
                var _this = this;
                return angular.extend(this.contentOptions || {}, {
                    placeholderText: 'Content',
                    width: 816,
                    toolbarSticky: false,
                    toolbarButtons: [
                        'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|',
                        'color', 'inlineStyle', 'paragraphStyle',
                        '-',
                        'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '|',
                        'insertHR', 'insertLink', 'insertImage', 'insertTable', 'undo', 'redo', 'clearFormatting', 'html'
                    ],
                    toolbarButtonsMD: [],
                    toolbarButtonsSM: [],
                    toolbarButtonsXS: [],
                    events: {
                        'froalaEditor.image.beforeUpload': function (e, editor, images) {
                            _this.insertBase64Image(editor, images[0]);
                            return false;
                        }
                    }
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentEditorController.prototype, "footerConfig", {
            get: function () {
                var _this = this;
                return angular.extend(this.footerOptions || {}, {
                    placeholderText: 'Footer',
                    width: 816,
                    toolbarSticky: false,
                    toolbarButtons: [
                        'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|',
                        'color', 'inlineStyle', 'paragraphStyle', '|', 'removeFooter',
                        '-',
                        'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '|',
                        'insertHR', 'insertLink', 'insertImage', 'insertTable', 'undo', 'redo', 'clearFormatting', 'html'
                    ],
                    toolbarButtonsMD: [],
                    toolbarButtonsSM: [],
                    toolbarButtonsXS: [],
                    events: {
                        'froalaEditor.image.beforeUpload': function (e, editor, images) {
                            _this.insertBase64Image(editor, images[0]);
                            return false;
                        }
                    }
                });
            },
            enumerable: true,
            configurable: true
        });
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
                    $ctrl.onPreInit();
                },
                post: function ($scope, $element, $attrs, $ctrl) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1kb2N1bWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHAudHMiLCIuLi9zcmMvZG9jdW1lbnQtZWRpdG9yLnRzIiwiLi4vc3JjL2RvY3VtZW50LXBkZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUNBekMsSUFBTyxVQUFVLENBbVJoQjtBQW5SRCxXQUFPLFVBQVUsRUFBQyxDQUFDO0lBRWY7UUFDSTtZQUNJLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7WUFDaEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztZQUNsQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO1lBQ2hDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsSUFBSSxFQUFFLENBQUM7WUFDOUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsY0FBYyxJQUFJLEVBQUUsQ0FBQztZQUNoRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLElBQUksRUFBRSxDQUFDO1FBQ2xELENBQUM7UUFFRCw0Q0FBUyxHQUFUO1FBQ0EsQ0FBQztRQUVELHlDQUFNLEdBQU47WUFDSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM1QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1lBQzNCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLFVBQVUs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QVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzFCLENBQUMsQ0FBQyxDQUFDO1lBRVAsQ0FBQyxDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUM1QixDQUFDO1FBRUQseUNBQVUsR0FBVixVQUFXLElBQUk7WUFDWCxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUM7WUFDaEIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUV2QyxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsZ0RBQWdELENBQUMsQ0FBQztZQUNsRSxJQUFJLE1BQU0sR0FBUSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEMsTUFBTSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQ2hDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztZQUU5QixJQUFJLGFBQWEsR0FBRztnQkFDaEIsYUFBYSxFQUFFLE9BQU87Z0JBQ3RCLFFBQVEsRUFBRSxRQUFRO2FBQ3JCLENBQUM7WUFFRixJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzNCLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDbkIsQ0FBQztRQWhFTSw0QkFBTyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFpRTVCLDJCQUFDO0lBQUQsQ0FBQyxBQWxFRCxJQWtFQztJQUVELE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0FBQ2hGLENBQUMsRUFyR00sVUFBVSxLQUFWLFVBQVUsUUFxR2hCIiwic291cmNlc0NvbnRlbnQiOlsiQW5ndWxhci5tb2R1bGUoXCJuZ0RvY3VtZW50XCIsIFsnZnJvYWxhJ10pOyIsIm1vZHVsZSBOZ0RvY3VtZW50IHtcclxuXHJcbiAgICBjbGFzcyBEb2N1bWVudEVkaXRvckNvbnRyb2xsZXIge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICB0aGlzLmhlYWRlciA9IHRoaXMuaGVhZGVyIHx8ICcnO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLmNvbnRlbnQgfHwgJyc7XHJcbiAgICAgICAgICAgIHRoaXMuZm9vdGVyID0gdGhpcy5mb290ZXIgfHwgJyc7XHJcbiAgICAgICAgICAgIHRoaXMuaGVhZGVyT3B0aW9ucyA9IHRoaXMuaGVhZGVyT3B0aW9ucyB8fCB7fTtcclxuICAgICAgICAgICAgdGhpcy5jb250ZW50T3B0aW9ucyA9IHRoaXMuY29udGVudE9wdGlvbnMgfHwge307XHJcbiAgICAgICAgICAgIHRoaXMuZm9vdGVyT3B0aW9ucyA9IHRoaXMuZm9vdGVyT3B0aW9ucyB8fCB7fTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9uUHJlSW5pdCgpIHtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9uSW5pdCgpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRDb250ZW50KHRoaXMuX2h0bWwpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oZWFkZXIubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgIHRoaXMud2l0aEhlYWRlciA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmZvb3Rlci5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy53aXRoRm9vdGVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGluc2VydEJhc2U2NEltYWdlKGVkaXRvcjogYW55LCBpbWFnZTogRmlsZSkge1xyXG4gICAgICAgICAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICAgICAgcmVhZGVyLm9ubG9hZCA9IChyZWFkZXJFdnQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yLmltYWdlLmluc2VydChyZWFkZXJFdnQudGFyZ2V0LnJlc3VsdCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGltYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBoZWFkZXJDb25maWcoKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZXh0ZW5kKHRoaXMuaGVhZGVyT3B0aW9ucyB8fCB7fSwge1xyXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXJUZXh0OiAnSGVhZGVyJyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiA4MTYsXHJcbiAgICAgICAgICAgICAgICB0b29sYmFyU3RpY2t5OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJCdXR0b25zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgJ2JvbGQnLCAnaXRhbGljJywgJ3VuZGVybGluZScsICdzdHJpa2VUaHJvdWdoJywgJ3N1YnNjcmlwdCcsICdzdXBlcnNjcmlwdCcsICdmb250RmFtaWx5JywgJ2ZvbnRTaXplJywgJ3wnLFxyXG4gICAgICAgICAgICAgICAgICAgICdjb2xvcicsICdpbmxpbmVTdHlsZScsICdwYXJhZ3JhcGhTdHlsZScsICd8JywgJ3JlbW92ZUhlYWRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgJy0nLFxyXG4gICAgICAgICAgICAgICAgICAgICdwYXJhZ3JhcGhGb3JtYXQnLCAnYWxpZ24nLCAnZm9ybWF0T0wnLCAnZm9ybWF0VUwnLCAnb3V0ZGVudCcsICdpbmRlbnQnLCAncXVvdGUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2luc2VydEhSJywgJ2luc2VydExpbmsnLCAnaW5zZXJ0SW1hZ2UnLCAnaW5zZXJ0VGFibGUnLCAndW5kbycsICdyZWRvJywgJ2NsZWFyRm9ybWF0dGluZycsICdodG1sJ1xyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJCdXR0b25zTUQ6IFtcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICB0b29sYmFyQnV0dG9uc1NNOiBbXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgdG9vbGJhckJ1dHRvbnNYUzogW1xyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGV2ZW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdmcm9hbGFFZGl0b3IuaW1hZ2UuYmVmb3JlVXBsb2FkJzogKGUsIGVkaXRvciwgaW1hZ2VzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0QmFzZTY0SW1hZ2UoZWRpdG9yLCBpbWFnZXNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBjb250ZW50Q29uZmlnKCk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhbmd1bGFyLmV4dGVuZCh0aGlzLmNvbnRlbnRPcHRpb25zIHx8IHt9LCB7XHJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlclRleHQ6ICdDb250ZW50JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiA4MTYsXHJcbiAgICAgICAgICAgICAgICB0b29sYmFyU3RpY2t5OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJCdXR0b25zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgJ2JvbGQnLCAnaXRhbGljJywgJ3VuZGVybGluZScsICdzdHJpa2VUaHJvdWdoJywgJ3N1YnNjcmlwdCcsICdzdXBlcnNjcmlwdCcsICdmb250RmFtaWx5JywgJ2ZvbnRTaXplJywgJ3wnLFxyXG4gICAgICAgICAgICAgICAgICAgICdjb2xvcicsICdpbmxpbmVTdHlsZScsICdwYXJhZ3JhcGhTdHlsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgJy0nLFxyXG4gICAgICAgICAgICAgICAgICAgICdwYXJhZ3JhcGhGb3JtYXQnLCAnYWxpZ24nLCAnZm9ybWF0T0wnLCAnZm9ybWF0VUwnLCAnb3V0ZGVudCcsICdpbmRlbnQnLCAncXVvdGUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2luc2VydEhSJywgJ2luc2VydExpbmsnLCAnaW5zZXJ0SW1hZ2UnLCAnaW5zZXJ0VGFibGUnLCAndW5kbycsICdyZWRvJywgJ2NsZWFyRm9ybWF0dGluZycsICdodG1sJ1xyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJCdXR0b25zTUQ6IFtcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICB0b29sYmFyQnV0dG9uc1NNOiBbXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgdG9vbGJhckJ1dHRvbnNYUzogW1xyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGV2ZW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdmcm9hbGFFZGl0b3IuaW1hZ2UuYmVmb3JlVXBsb2FkJzogKGUsIGVkaXRvciwgaW1hZ2VzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0QmFzZTY0SW1hZ2UoZWRpdG9yLCBpbWFnZXNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBmb290ZXJDb25maWcoKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZXh0ZW5kKHRoaXMuZm9vdGVyT3B0aW9ucyB8fCB7fSwge1xyXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXJUZXh0OiAnRm9vdGVyJyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiA4MTYsXHJcbiAgICAgICAgICAgICAgICB0b29sYmFyU3RpY2t5OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJCdXR0b25zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgJ2JvbGQnLCAnaXRhbGljJywgJ3VuZGVybGluZScsICdzdHJpa2VUaHJvdWdoJywgJ3N1YnNjcmlwdCcsICdzdXBlcnNjcmlwdCcsICdmb250RmFtaWx5JywgJ2ZvbnRTaXplJywgJ3wnLFxyXG4gICAgICAgICAgICAgICAgICAgICdjb2xvcicsICdpbmxpbmVTdHlsZScsICdwYXJhZ3JhcGhTdHlsZScsICd8JywncmVtb3ZlRm9vdGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAnLScsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3BhcmFncmFwaEZvcm1hdCcsICdhbGlnbicsICdmb3JtYXRPTCcsICdmb3JtYXRVTCcsICdvdXRkZW50JywgJ2luZGVudCcsICdxdW90ZScsICd8JyxcclxuICAgICAgICAgICAgICAgICAgICAnaW5zZXJ0SFInLCAnaW5zZXJ0TGluaycsICdpbnNlcnRJbWFnZScsICdpbnNlcnRUYWJsZScsICd1bmRvJywgJ3JlZG8nLCAnY2xlYXJGb3JtYXR0aW5nJywgJ2h0bWwnXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgdG9vbGJhckJ1dHRvbnNNRDogW1xyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJCdXR0b25zU006IFtcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICB0b29sYmFyQnV0dG9uc1hTOiBbXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2Zyb2FsYUVkaXRvci5pbWFnZS5iZWZvcmVVcGxvYWQnOiAoZSwgZWRpdG9yLCBpbWFnZXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRCYXNlNjRJbWFnZShlZGl0b3IsIGltYWdlc1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfaHRtbDogc3RyaW5nO1xyXG4gICAgICAgIGdldCBodG1sKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHZhciB3cml0ZXIgPSBuZXcgRG9jdW1lbnRXcml0ZXIodGhpcy5oZWFkZXIsIHRoaXMuY29udGVudCwgdGhpcy5mb290ZXIpO1xyXG4gICAgICAgICAgICB2YXIgb3B0aW9uczogSURvY3VtZW50V3JpdGVyT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIGV4Y2x1ZGVIZWFkZXI6ICF0aGlzLndpdGhIZWFkZXIsXHJcbiAgICAgICAgICAgICAgICBleGNsdWRlRm9vdGVyOiAhdGhpcy53aXRoRm9vdGVyXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiB3cml0ZXIud3JpdGUob3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXQgaHRtbCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2h0bWwgPSB2YWx1ZTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnNldENvbnRlbnQodmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzZXRDb250ZW50KHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIHBhcnNlciA9IG5ldyBEb2N1bWVudFJlYWRlcih2YWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuaGVhZGVyID0gcGFyc2VyLmdldEhlYWRlcigpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQgPSBwYXJzZXIuZ2V0Q29udGVudCgpO1xyXG4gICAgICAgICAgICB0aGlzLmZvb3RlciA9IHBhcnNlci5nZXRGb290ZXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGhlYWRlck9wdGlvbnM6IGFueTtcclxuICAgICAgICBjb250ZW50T3B0aW9uczogYW55O1xyXG4gICAgICAgIGZvb3Rlck9wdGlvbnM6IGFueTtcclxuICAgICAgICBpbml0aWFsaXplZDogYm9vbGVhbjtcclxuICAgICAgICBoZWFkZXI6IHN0cmluZztcclxuICAgICAgICBjb250ZW50OiBzdHJpbmc7XHJcbiAgICAgICAgZm9vdGVyOiBzdHJpbmc7XHJcbiAgICAgICAgd2l0aEhlYWRlcjogYm9vbGVhbjtcclxuICAgICAgICB3aXRoRm9vdGVyOiBib29sZWFuO1xyXG4gICAgfVxyXG5cclxuICAgIGludGVyZmFjZSBJRG9jdW1lbnRXcml0ZXJPcHRpb25zIHtcclxuICAgICAgICBleGNsdWRlSGVhZGVyOiBib29sZWFuO1xyXG4gICAgICAgIGV4Y2x1ZGVGb290ZXI6IGJvb2xlYW47XHJcbiAgICB9XHJcblxyXG4gICAgaW50ZXJmYWNlIElEb2N1bWVudFdyaXRlciB7XHJcbiAgICAgICAgd3JpdGUoKTogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIERvY3VtZW50V3JpdGVyIGltcGxlbWVudHMgSURvY3VtZW50V3JpdGVyIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihoZWFkZXI6IHN0cmluZywgY29udGVudDogc3RyaW5nLCBmb290ZXI6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLl9oZWFkZXIgPSBoZWFkZXI7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnRlbnQgPSBjb250ZW50O1xyXG4gICAgICAgICAgICB0aGlzLl9mb290ZXIgPSBmb290ZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgaGFzSGVhZGVyKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGVhZGVyICE9IG51bGwgJiYgdGhpcy5faGVhZGVyLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgaGFzRm9vdGVyKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9vdGVyICE9IG51bGwgJiYgdGhpcy5fZm9vdGVyLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB3cml0ZShvcHRpb25zPzogSURvY3VtZW50V3JpdGVyT3B0aW9ucyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHZhciBodG1sID0gW107XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNIZWFkZXIgJiYgIW9wdGlvbnMuZXhjbHVkZUhlYWRlcilcclxuICAgICAgICAgICAgICAgIGh0bWwucHVzaChgPGhlYWRlcj4ke3RoaXMuX2hlYWRlcn08L2hlYWRlcj5gKTtcclxuXHJcbiAgICAgICAgICAgIGh0bWwucHVzaChgPGNvbnRlbnQ+JHt0aGlzLl9jb250ZW50fTwvY29udGVudD5gKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc0Zvb3RlciAmJiAhb3B0aW9ucy5leGNsdWRlRm9vdGVyKVxyXG4gICAgICAgICAgICAgICAgaHRtbC5wdXNoKGA8Zm9vdGVyPiR7dGhpcy5fZm9vdGVyfTwvZm9vdGVyPmApO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGh0bWwuam9pbihcIlwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgX2hlYWRlcjogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgX2NvbnRlbnQ6IHN0cmluZztcclxuICAgICAgICBwcml2YXRlIF9mb290ZXI6IHN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICBpbnRlcmZhY2UgSURvY3VtZW50UmVhZGVyIHtcclxuICAgICAgICBnZXRIZWFkZXIoKTogc3RyaW5nO1xyXG4gICAgICAgIGdldENvbnRlbnQoKTogc3RyaW5nO1xyXG4gICAgICAgIGdldEZvb3RlcigpOiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3MgRG9jdW1lbnRSZWFkZXIgaW1wbGVtZW50cyBJRG9jdW1lbnRSZWFkZXIge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKGh0bWw6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLl8kaHRtbCA9ICQoJzxkaXY+PC9kaXY+JykuYXBwZW5kKGh0bWwgfHwgJycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfJGh0bWw6IEpRdWVyeTtcclxuXHJcbiAgICAgICAgZ2V0SGVhZGVyKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkKCdoZWFkZXInKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldENvbnRlbnQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgLy8gVG9EbzogaWYgPGNvbnRlbnQ+PC9jb250ZW50PiBkb2VzIG5vdCBleGlzdCBidXQgdGhlcmUgaXMgaHRtbCwgd3JhcCB0aGUgaHRtbCBpbiBhIGNvbnRlbnQgdGFnXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkKCdjb250ZW50Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRGb290ZXIoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGQoJ2Zvb3RlcicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBjaGlsZChzZWxlY3Rvcjogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuXyRodG1sLmNoaWxkcmVuKHNlbGVjdG9yKS5odG1sKCkgfHwgJyc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIERvY3VtZW50RWRpdG9yRGlyZWN0aXZlIHtcclxuICAgICAgICByZXN0cmljdCA9ICdFJztcclxuICAgICAgICB0cmFuc2NsdWRlID0gdHJ1ZTtcclxuICAgICAgICB0ZW1wbGF0ZVVybCA9ICdkb2N1bWVudC1lZGl0b3IuaHRtbCc7XHJcbiAgICAgICAgY29udHJvbGxlciA9IERvY3VtZW50RWRpdG9yQ29udHJvbGxlcjtcclxuICAgICAgICBjb250cm9sbGVyQXMgPSAnZG9jdW1lbnRFZGl0b3InO1xyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXIgPSB0cnVlO1xyXG4gICAgICAgIHNjb3BlID0ge1xyXG4gICAgICAgICAgICBoZWFkZXJPcHRpb25zOiAnPT8nLFxyXG4gICAgICAgICAgICBib2R5T3B0aW9uczogJz0/JyxcclxuICAgICAgICAgICAgZm9vdGVyT3B0aW9uczogJz0/JyxcclxuICAgICAgICAgICAgaHRtbDogJz0/J1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGluayA9IHtcclxuICAgICAgICAgICAgcHJlOiAoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkY3RybDogRG9jdW1lbnRFZGl0b3JDb250cm9sbGVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZWRpdG9yOiBhbnkgPSAkWydGcm9hbGFFZGl0b3InXTtcclxuXHJcbiAgICAgICAgICAgICAgICBlZGl0b3IuRGVmaW5lSWNvbigncmVtb3ZlSGVhZGVyJywgeyBOQU1FOiAndGltZXMtY2lyY2xlJyB9KTtcclxuICAgICAgICAgICAgICAgIGVkaXRvci5SZWdpc3RlckNvbW1hbmQoJ3JlbW92ZUhlYWRlcicsIHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1JlbW92ZSBIZWFkZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIHVuZG86IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZm9jdXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVmcmVzaEFmdGVyQ2FsbGJhY2s6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IChlZGl0b3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGN0cmwud2l0aEhlYWRlciA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZWRpdG9yLkRlZmluZUljb24oJ3JlbW92ZUZvb3RlcicsIHsgTkFNRTogJ3RpbWVzLWNpcmNsZScgfSk7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3IuUmVnaXN0ZXJDb21tYW5kKCdyZW1vdmVGb290ZXInLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdSZW1vdmUgRm9vdGVyJyxcclxuICAgICAgICAgICAgICAgICAgICB1bmRvOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvY3VzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlZnJlc2hBZnRlckNhbGxiYWNrOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoZWRpdG9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRjdHJsLndpdGhGb290ZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICRjdHJsLm9uUHJlSW5pdCgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwb3N0OiAoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkY3RybDogRG9jdW1lbnRFZGl0b3JDb250cm9sbGVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAkY3RybC5vbkluaXQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIEFuZ3VsYXIubW9kdWxlKFwibmdEb2N1bWVudFwiKS5kaXJlY3RpdmUoXCJkb2N1bWVudEVkaXRvclwiLCBEb2N1bWVudEVkaXRvckRpcmVjdGl2ZSk7XHJcbn0iLCJtb2R1bGUgTmdEb2N1bWVudCB7XHJcbiAgICBkZWNsYXJlIHZhciBQREZKUzogYW55O1xyXG5cclxuICAgIGNsYXNzIERvY3VtZW50UGRmQ29udHJvbGxlciB7XHJcblxyXG4gICAgICAgIG9uSW5pdChyZW5kZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyID0gcmVuZGVyO1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlcih0aGlzLnVybCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgX3JlbmRlcjogYW55O1xyXG4gICAgICAgIHJlbmRlcih1cmwpIHtcclxuICAgICAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXIodXJsKS5maW5hbGx5KCgpID0+IHRoaXMuaXNMb2FkaW5nID0gZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdGlhbGl6ZWQ6IGJvb2xlYW47XHJcbiAgICAgICAgaXNMb2FkaW5nOiBib29sZWFuO1xyXG5cclxuICAgICAgICBwcml2YXRlIF91cmw6IHN0cmluZztcclxuICAgICAgICBnZXQgdXJsKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91cmw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNldCB1cmwodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLl91cmwgPSB2YWx1ZTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlcih2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIERvY3VtZW50UGRmRGlyZWN0aXZlIHtcclxuICAgICAgICBzdGF0aWMgJGluamVjdCA9IFsnJHEnXTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSAkcTogYW5ndWxhci5JUVNlcnZpY2UpIHtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXN0cmljdCA9ICdFJztcclxuICAgICAgICB0cmFuc2NsdWRlID0gdHJ1ZTtcclxuICAgICAgICB0ZW1wbGF0ZVVybCA9ICdkb2N1bWVudC1wZGYuaHRtbCc7XHJcbiAgICAgICAgY29udHJvbGxlciA9IERvY3VtZW50UGRmQ29udHJvbGxlcjtcclxuICAgICAgICBjb250cm9sbGVyQXMgPSAnZG9jdW1lbnRQZGYnO1xyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXIgPSB0cnVlO1xyXG4gICAgICAgIHNjb3BlID0ge1xyXG4gICAgICAgICAgICB1cmw6ICdAJ1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGluayA9ICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICRjdHJsOiBEb2N1bWVudFBkZkNvbnRyb2xsZXIpID0+IHtcclxuICAgICAgICAgICAgdmFyICRwYWdlcyA9ICRlbGVtZW50LmZpbmQoXCIuZG9jdW1lbnQtdmlld2VyLXBhZ2VzXCIpO1xyXG5cclxuICAgICAgICAgICAgJGN0cmwub25Jbml0KCh1cmwpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlcigkc2NvcGUsICRwYWdlcywgdXJsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZW5kZXIoJHNjb3BlLCAkcGFnZXMsIHVybCkge1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSB0aGlzLiRxLmRlZmVyKCk7XHJcblxyXG4gICAgICAgICAgICAkcGFnZXMuZW1wdHkoKTtcclxuICAgICAgICAgICAgUERGSlMuZ2V0RG9jdW1lbnQodXJsKS50aGVuKHBkZiA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHRhc2tzID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpZHggPSAwOyBpZHggPCBwZGYucGRmSW5mby5udW1QYWdlczsgaWR4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXNrcy5wdXNoKHBkZi5nZXRQYWdlKGlkeCArIDEpLnRoZW4ocGFnZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZVBhZ2UocGFnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuJHEuYWxsKHRhc2tzKS50aGVuKGNhbnZhc2VzID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAkcGFnZXMuYXBwZW5kKGNhbnZhc2VzKTtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHBkZik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjcmVhdGVQYWdlKHBhZ2UpIHtcclxuICAgICAgICAgICAgdmFyIHNjYWxlID0gMS41O1xyXG4gICAgICAgICAgICB2YXIgdmlld3BvcnQgPSBwYWdlLmdldFZpZXdwb3J0KHNjYWxlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciAkY2FudmFzID0gJCgnPGNhbnZhcyBjbGFzcz1cImRvY3VtZW50LXZpZXdlci1wYWdlXCI+PC9jYW52YXM+Jyk7XHJcbiAgICAgICAgICAgIHZhciBjYW52YXM6IGFueSA9ICRjYW52YXMuZ2V0KDApO1xyXG4gICAgICAgICAgICB2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gdmlld3BvcnQuaGVpZ2h0O1xyXG4gICAgICAgICAgICBjYW52YXMud2lkdGggPSB2aWV3cG9ydC53aWR0aDtcclxuXHJcbiAgICAgICAgICAgIHZhciByZW5kZXJDb250ZXh0ID0ge1xyXG4gICAgICAgICAgICAgICAgY2FudmFzQ29udGV4dDogY29udGV4dCxcclxuICAgICAgICAgICAgICAgIHZpZXdwb3J0OiB2aWV3cG9ydFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcGFnZS5yZW5kZXIocmVuZGVyQ29udGV4dCk7XHJcbiAgICAgICAgICAgIHJldHVybiAkY2FudmFzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBBbmd1bGFyLm1vZHVsZShcIm5nRG9jdW1lbnRcIikuZGlyZWN0aXZlKFwiZG9jdW1lbnRQZGZcIiwgRG9jdW1lbnRQZGZEaXJlY3RpdmUpO1xyXG59Il19