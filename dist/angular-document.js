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
        DocumentEditorController.prototype.onPreInit = function (toolbarId) {
            this.toolbarId = toolbarId;
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
                    iframe: true,
                    placeholderText: 'Header',
                    enter: $['FroalaEditor'].ENTER_BR,
                    width: 816,
                    toolbarContainer: "#" + this.toolbarId,
                    toolbarButtons: [
                        'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|',
                        'color', 'inlineStyle', 'paragraphStyle',
                        //'-',
                        'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '|',
                        'insertHR', 'insertLink', 'insertImage', 'insertTable', 'undo', 'redo', 'clearFormatting', 'html',
                        '|', 'removeHeader'
                    ],
                    toolbarButtonsMD: [
                        'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|',
                        'color', 'inlineStyle', 'paragraphStyle', '|', 'removeHeader',
                        //'-',
                        'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '|',
                        'insertHR', 'insertLink', 'insertImage', 'insertTable', 'undo', 'redo', 'clearFormatting', 'html'
                    ],
                    toolbarButtonsSM: [
                        'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|',
                        'color', 'inlineStyle', 'paragraphStyle', '|', 'removeHeader',
                        //'-',
                        'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '|',
                        'insertHR', 'insertLink', 'insertImage', 'insertTable', 'undo', 'redo', 'clearFormatting', 'html'
                    ],
                    toolbarButtonsXS: [
                        'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|',
                        'color', 'inlineStyle', 'paragraphStyle', '|', 'removeHeader',
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
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentEditorController.prototype, "contentConfig", {
            get: function () {
                var _this = this;
                return angular.extend(this.contentOptions || {}, {
                    iframe: true,
                    placeholderText: 'Content',
                    enter: $['FroalaEditor'].ENTER_BR,
                    width: 816,
                    toolbarContainer: "#" + this.toolbarId,
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
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentEditorController.prototype, "footerConfig", {
            get: function () {
                var _this = this;
                return angular.extend(this.footerOptions || {}, {
                    iframe: true,
                    placeholderText: 'Footer',
                    enter: $['FroalaEditor'].ENTER_BR,
                    width: 816,
                    toolbarContainer: "#" + this.toolbarId,
                    toolbarButtons: [
                        'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|',
                        'color', 'inlineStyle', 'paragraphStyle',
                        //'-',
                        'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '|',
                        'insertHR', 'insertLink', 'insertImage', 'insertTable', 'undo', 'redo', 'clearFormatting', 'html',
                        '|', 'removeFooter'
                    ],
                    toolbarButtonsMD: [
                        'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|',
                        'color', 'inlineStyle', 'paragraphStyle', '|', 'removeFooter',
                        //'-',
                        'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '|',
                        'insertHR', 'insertLink', 'insertImage', 'insertTable', 'undo', 'redo', 'clearFormatting', 'html'
                    ],
                    toolbarButtonsSM: [
                        'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|',
                        'color', 'inlineStyle', 'paragraphStyle', '|', 'removeFooter',
                        //'-',
                        'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '|',
                        'insertHR', 'insertLink', 'insertImage', 'insertTable', 'undo', 'redo', 'clearFormatting', 'html'
                    ],
                    toolbarButtonsXS: [
                        'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|',
                        'color', 'inlineStyle', 'paragraphStyle', '|', 'removeFooter',
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
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentEditorController.prototype, "styles", {
            get: function () {
                return "p { margin: 0 }";
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
                    $ctrl.onPreInit(toolbarId);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1kb2N1bWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHAudHMiLCIuLi9zcmMvZG9jdW1lbnQtZWRpdG9yLnRzIiwiLi4vc3JjL2RvY3VtZW50LXBkZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUNBekMsSUFBTyxVQUFVLENBNldoQjtBQTdXRCxXQUFPLFVBQVUsRUFBQyxDQUFDO0lBRWY7UUFDSTtZQUNJLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7WUFDaEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztZQUNsQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO1lBQ2hDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsSUFBSSxFQUFFLENBQUM7WUFDOUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsY0FBYyxJQUFJLEVBQUUsQ0FBQztZQUNoRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLElBQUksRUFBRSxDQUFDO1FBQ2xELENBQUM7UUFFRCw0Q0FBUyxHQUFULFVBQVUsU0FBUztZQUNmLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQy9CLENBQUM7UUFFRCx5Q0FBTSxHQUFOO1lBQ0ksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDNUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2dCQUN2QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUMzQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxD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USxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFdkMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLGdEQUFnRCxDQUFDLENBQUM7WUFDbEUsSUFBSSxNQUFNLEdBQVEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQyxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUNoQyxNQUFNLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7WUFFOUIsSUFBSSxhQUFhLEdBQUc7Z0JBQ2hCLGFBQWEsRUFBRSxPQUFPO2dCQUN0QixRQUFRLEVBQUUsUUFBUTthQUNyQixDQUFDO1lBRUYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUMzQixNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ25CLENBQUM7UUFoRU0sNEJBQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBaUU1QiwyQkFBQztJQUFELENBQUMsQUFsRUQsSUFrRUM7SUFFRCxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztBQUNoRixDQUFDLEVBckdNLFVBQVUsS0FBVixVQUFVLFFBcUdoQiIsInNvdXJjZXNDb250ZW50IjpbIkFuZ3VsYXIubW9kdWxlKFwibmdEb2N1bWVudFwiLCBbJ2Zyb2FsYSddKTsiLCJtb2R1bGUgTmdEb2N1bWVudCB7XHJcblxyXG4gICAgY2xhc3MgRG9jdW1lbnRFZGl0b3JDb250cm9sbGVyIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgdGhpcy5oZWFkZXIgPSB0aGlzLmhlYWRlciB8fCAnJztcclxuICAgICAgICAgICAgdGhpcy5jb250ZW50ID0gdGhpcy5jb250ZW50IHx8ICcnO1xyXG4gICAgICAgICAgICB0aGlzLmZvb3RlciA9IHRoaXMuZm9vdGVyIHx8ICcnO1xyXG4gICAgICAgICAgICB0aGlzLmhlYWRlck9wdGlvbnMgPSB0aGlzLmhlYWRlck9wdGlvbnMgfHwge307XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudE9wdGlvbnMgPSB0aGlzLmNvbnRlbnRPcHRpb25zIHx8IHt9O1xyXG4gICAgICAgICAgICB0aGlzLmZvb3Rlck9wdGlvbnMgPSB0aGlzLmZvb3Rlck9wdGlvbnMgfHwge307XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvblByZUluaXQodG9vbGJhcklkKSB7XHJcbiAgICAgICAgICAgIHRoaXMudG9vbGJhcklkID0gdG9vbGJhcklkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb25Jbml0KCkge1xyXG4gICAgICAgICAgICB0aGlzLnNldENvbnRlbnQodGhpcy5faHRtbCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhlYWRlci5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy53aXRoSGVhZGVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZm9vdGVyLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICB0aGlzLndpdGhGb290ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgaW5zZXJ0QmFzZTY0SW1hZ2UoZWRpdG9yOiBhbnksIGltYWdlOiBGaWxlKSB7XHJcbiAgICAgICAgICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgICAgICByZWFkZXIub25sb2FkID0gKHJlYWRlckV2dDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3IuaW1hZ2UuaW5zZXJ0KHJlYWRlckV2dC50YXJnZXQucmVzdWx0KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoaW1hZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGhlYWRlckNvbmZpZygpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gYW5ndWxhci5leHRlbmQodGhpcy5oZWFkZXJPcHRpb25zIHx8IHt9LCB7XHJcbiAgICAgICAgICAgICAgICBpZnJhbWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlclRleHQ6ICdIZWFkZXInLFxyXG4gICAgICAgICAgICAgICAgZW50ZXI6ICRbJ0Zyb2FsYUVkaXRvciddLkVOVEVSX0JSLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IDgxNixcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJDb250YWluZXI6IGAjJHt0aGlzLnRvb2xiYXJJZH1gLFxyXG4gICAgICAgICAgICAgICAgdG9vbGJhckJ1dHRvbnM6IFtcclxuICAgICAgICAgICAgICAgICAgICAnYm9sZCcsICdpdGFsaWMnLCAndW5kZXJsaW5lJywgJ3N0cmlrZVRocm91Z2gnLCAnc3Vic2NyaXB0JywgJ3N1cGVyc2NyaXB0JywgJ2ZvbnRGYW1pbHknLCAnZm9udFNpemUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbG9yJywgJ2lubGluZVN0eWxlJywgJ3BhcmFncmFwaFN0eWxlJywgXHJcbiAgICAgICAgICAgICAgICAgICAgLy8nLScsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3BhcmFncmFwaEZvcm1hdCcsICdhbGlnbicsICdmb3JtYXRPTCcsICdmb3JtYXRVTCcsICdvdXRkZW50JywgJ2luZGVudCcsICdxdW90ZScsICd8JyxcclxuICAgICAgICAgICAgICAgICAgICAnaW5zZXJ0SFInLCAnaW5zZXJ0TGluaycsICdpbnNlcnRJbWFnZScsICdpbnNlcnRUYWJsZScsICd1bmRvJywgJ3JlZG8nLCAnY2xlYXJGb3JtYXR0aW5nJywgJ2h0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgICd8JywgJ3JlbW92ZUhlYWRlcidcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICB0b29sYmFyQnV0dG9uc01EOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgJ2JvbGQnLCAnaXRhbGljJywgJ3VuZGVybGluZScsICdzdHJpa2VUaHJvdWdoJywgJ3N1YnNjcmlwdCcsICdzdXBlcnNjcmlwdCcsICdmb250RmFtaWx5JywgJ2ZvbnRTaXplJywgJ3wnLFxyXG4gICAgICAgICAgICAgICAgICAgICdjb2xvcicsICdpbmxpbmVTdHlsZScsICdwYXJhZ3JhcGhTdHlsZScsICd8JywgJ3JlbW92ZUhlYWRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8nLScsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3BhcmFncmFwaEZvcm1hdCcsICdhbGlnbicsICdmb3JtYXRPTCcsICdmb3JtYXRVTCcsICdvdXRkZW50JywgJ2luZGVudCcsICdxdW90ZScsICd8JyxcclxuICAgICAgICAgICAgICAgICAgICAnaW5zZXJ0SFInLCAnaW5zZXJ0TGluaycsICdpbnNlcnRJbWFnZScsICdpbnNlcnRUYWJsZScsICd1bmRvJywgJ3JlZG8nLCAnY2xlYXJGb3JtYXR0aW5nJywgJ2h0bWwnXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgdG9vbGJhckJ1dHRvbnNTTTogW1xyXG4gICAgICAgICAgICAgICAgICAgICdib2xkJywgJ2l0YWxpYycsICd1bmRlcmxpbmUnLCAnc3RyaWtlVGhyb3VnaCcsICdzdWJzY3JpcHQnLCAnc3VwZXJzY3JpcHQnLCAnZm9udEZhbWlseScsICdmb250U2l6ZScsICd8JyxcclxuICAgICAgICAgICAgICAgICAgICAnY29sb3InLCAnaW5saW5lU3R5bGUnLCAncGFyYWdyYXBoU3R5bGUnLCAnfCcsICdyZW1vdmVIZWFkZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vJy0nLFxyXG4gICAgICAgICAgICAgICAgICAgICdwYXJhZ3JhcGhGb3JtYXQnLCAnYWxpZ24nLCAnZm9ybWF0T0wnLCAnZm9ybWF0VUwnLCAnb3V0ZGVudCcsICdpbmRlbnQnLCAncXVvdGUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2luc2VydEhSJywgJ2luc2VydExpbmsnLCAnaW5zZXJ0SW1hZ2UnLCAnaW5zZXJ0VGFibGUnLCAndW5kbycsICdyZWRvJywgJ2NsZWFyRm9ybWF0dGluZycsICdodG1sJ1xyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJCdXR0b25zWFM6IFtcclxuICAgICAgICAgICAgICAgICAgICAnYm9sZCcsICdpdGFsaWMnLCAndW5kZXJsaW5lJywgJ3N0cmlrZVRocm91Z2gnLCAnc3Vic2NyaXB0JywgJ3N1cGVyc2NyaXB0JywgJ2ZvbnRGYW1pbHknLCAnZm9udFNpemUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbG9yJywgJ2lubGluZVN0eWxlJywgJ3BhcmFncmFwaFN0eWxlJywgJ3wnLCAncmVtb3ZlSGVhZGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyctJyxcclxuICAgICAgICAgICAgICAgICAgICAncGFyYWdyYXBoRm9ybWF0JywgJ2FsaWduJywgJ2Zvcm1hdE9MJywgJ2Zvcm1hdFVMJywgJ291dGRlbnQnLCAnaW5kZW50JywgJ3F1b3RlJywgJ3wnLFxyXG4gICAgICAgICAgICAgICAgICAgICdpbnNlcnRIUicsICdpbnNlcnRMaW5rJywgJ2luc2VydEltYWdlJywgJ2luc2VydFRhYmxlJywgJ3VuZG8nLCAncmVkbycsICdjbGVhckZvcm1hdHRpbmcnLCAnaHRtbCdcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBldmVudHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnZnJvYWxhRWRpdG9yLmltYWdlLmJlZm9yZVVwbG9hZCc6IChlLCBlZGl0b3IsIGltYWdlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluc2VydEJhc2U2NEltYWdlKGVkaXRvciwgaW1hZ2VzWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgY29udGVudENvbmZpZygpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gYW5ndWxhci5leHRlbmQodGhpcy5jb250ZW50T3B0aW9ucyB8fCB7fSwge1xyXG4gICAgICAgICAgICAgICAgaWZyYW1lOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXJUZXh0OiAnQ29udGVudCcsXHJcbiAgICAgICAgICAgICAgICBlbnRlcjogJFsnRnJvYWxhRWRpdG9yJ10uRU5URVJfQlIsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogODE2LFxyXG4gICAgICAgICAgICAgICAgdG9vbGJhckNvbnRhaW5lcjogYCMke3RoaXMudG9vbGJhcklkfWAsXHJcbiAgICAgICAgICAgICAgICB0b29sYmFyQnV0dG9uczogW1xyXG4gICAgICAgICAgICAgICAgICAgICdib2xkJywgJ2l0YWxpYycsICd1bmRlcmxpbmUnLCAnc3RyaWtlVGhyb3VnaCcsICdzdWJzY3JpcHQnLCAnc3VwZXJzY3JpcHQnLCAnZm9udEZhbWlseScsICdmb250U2l6ZScsICd8JyxcclxuICAgICAgICAgICAgICAgICAgICAnY29sb3InLCAnaW5saW5lU3R5bGUnLCAncGFyYWdyYXBoU3R5bGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vJy0nLFxyXG4gICAgICAgICAgICAgICAgICAgICdwYXJhZ3JhcGhGb3JtYXQnLCAnYWxpZ24nLCAnZm9ybWF0T0wnLCAnZm9ybWF0VUwnLCAnb3V0ZGVudCcsICdpbmRlbnQnLCAncXVvdGUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2luc2VydEhSJywgJ2luc2VydExpbmsnLCAnaW5zZXJ0SW1hZ2UnLCAnaW5zZXJ0VGFibGUnLCAndW5kbycsICdyZWRvJywgJ2NsZWFyRm9ybWF0dGluZycsICdodG1sJ1xyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJCdXR0b25zTUQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAnYm9sZCcsICdpdGFsaWMnLCAndW5kZXJsaW5lJywgJ3N0cmlrZVRocm91Z2gnLCAnc3Vic2NyaXB0JywgJ3N1cGVyc2NyaXB0JywgJ2ZvbnRGYW1pbHknLCAnZm9udFNpemUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbG9yJywgJ2lubGluZVN0eWxlJywgJ3BhcmFncmFwaFN0eWxlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyctJyxcclxuICAgICAgICAgICAgICAgICAgICAncGFyYWdyYXBoRm9ybWF0JywgJ2FsaWduJywgJ2Zvcm1hdE9MJywgJ2Zvcm1hdFVMJywgJ291dGRlbnQnLCAnaW5kZW50JywgJ3F1b3RlJywgJ3wnLFxyXG4gICAgICAgICAgICAgICAgICAgICdpbnNlcnRIUicsICdpbnNlcnRMaW5rJywgJ2luc2VydEltYWdlJywgJ2luc2VydFRhYmxlJywgJ3VuZG8nLCAncmVkbycsICdjbGVhckZvcm1hdHRpbmcnLCAnaHRtbCdcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICB0b29sYmFyQnV0dG9uc1NNOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgJ2JvbGQnLCAnaXRhbGljJywgJ3VuZGVybGluZScsICdzdHJpa2VUaHJvdWdoJywgJ3N1YnNjcmlwdCcsICdzdXBlcnNjcmlwdCcsICdmb250RmFtaWx5JywgJ2ZvbnRTaXplJywgJ3wnLFxyXG4gICAgICAgICAgICAgICAgICAgICdjb2xvcicsICdpbmxpbmVTdHlsZScsICdwYXJhZ3JhcGhTdHlsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8nLScsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3BhcmFncmFwaEZvcm1hdCcsICdhbGlnbicsICdmb3JtYXRPTCcsICdmb3JtYXRVTCcsICdvdXRkZW50JywgJ2luZGVudCcsICdxdW90ZScsICd8JyxcclxuICAgICAgICAgICAgICAgICAgICAnaW5zZXJ0SFInLCAnaW5zZXJ0TGluaycsICdpbnNlcnRJbWFnZScsICdpbnNlcnRUYWJsZScsICd1bmRvJywgJ3JlZG8nLCAnY2xlYXJGb3JtYXR0aW5nJywgJ2h0bWwnXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgdG9vbGJhckJ1dHRvbnNYUzogW1xyXG4gICAgICAgICAgICAgICAgICAgICdib2xkJywgJ2l0YWxpYycsICd1bmRlcmxpbmUnLCAnc3RyaWtlVGhyb3VnaCcsICdzdWJzY3JpcHQnLCAnc3VwZXJzY3JpcHQnLCAnZm9udEZhbWlseScsICdmb250U2l6ZScsICd8JyxcclxuICAgICAgICAgICAgICAgICAgICAnY29sb3InLCAnaW5saW5lU3R5bGUnLCAncGFyYWdyYXBoU3R5bGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vJy0nLFxyXG4gICAgICAgICAgICAgICAgICAgICdwYXJhZ3JhcGhGb3JtYXQnLCAnYWxpZ24nLCAnZm9ybWF0T0wnLCAnZm9ybWF0VUwnLCAnb3V0ZGVudCcsICdpbmRlbnQnLCAncXVvdGUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2luc2VydEhSJywgJ2luc2VydExpbmsnLCAnaW5zZXJ0SW1hZ2UnLCAnaW5zZXJ0VGFibGUnLCAndW5kbycsICdyZWRvJywgJ2NsZWFyRm9ybWF0dGluZycsICdodG1sJ1xyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGV2ZW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdmcm9hbGFFZGl0b3IuaW1hZ2UuYmVmb3JlVXBsb2FkJzogKGUsIGVkaXRvciwgaW1hZ2VzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0QmFzZTY0SW1hZ2UoZWRpdG9yLCBpbWFnZXNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBmb290ZXJDb25maWcoKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZXh0ZW5kKHRoaXMuZm9vdGVyT3B0aW9ucyB8fCB7fSwge1xyXG4gICAgICAgICAgICAgICAgaWZyYW1lOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXJUZXh0OiAnRm9vdGVyJyxcclxuICAgICAgICAgICAgICAgIGVudGVyOiAkWydGcm9hbGFFZGl0b3InXS5FTlRFUl9CUixcclxuICAgICAgICAgICAgICAgIHdpZHRoOiA4MTYsXHJcbiAgICAgICAgICAgICAgICB0b29sYmFyQ29udGFpbmVyOiBgIyR7dGhpcy50b29sYmFySWR9YCxcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJCdXR0b25zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgJ2JvbGQnLCAnaXRhbGljJywgJ3VuZGVybGluZScsICdzdHJpa2VUaHJvdWdoJywgJ3N1YnNjcmlwdCcsICdzdXBlcnNjcmlwdCcsICdmb250RmFtaWx5JywgJ2ZvbnRTaXplJywgJ3wnLFxyXG4gICAgICAgICAgICAgICAgICAgICdjb2xvcicsICdpbmxpbmVTdHlsZScsICdwYXJhZ3JhcGhTdHlsZScsIFxyXG4gICAgICAgICAgICAgICAgICAgIC8vJy0nLFxyXG4gICAgICAgICAgICAgICAgICAgICdwYXJhZ3JhcGhGb3JtYXQnLCAnYWxpZ24nLCAnZm9ybWF0T0wnLCAnZm9ybWF0VUwnLCAnb3V0ZGVudCcsICdpbmRlbnQnLCAncXVvdGUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2luc2VydEhSJywgJ2luc2VydExpbmsnLCAnaW5zZXJ0SW1hZ2UnLCAnaW5zZXJ0VGFibGUnLCAndW5kbycsICdyZWRvJywgJ2NsZWFyRm9ybWF0dGluZycsICdodG1sJyxcclxuICAgICAgICAgICAgICAgICAgICAnfCcsICdyZW1vdmVGb290ZXInXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgdG9vbGJhckJ1dHRvbnNNRDogW1xyXG4gICAgICAgICAgICAgICAgICAgICdib2xkJywgJ2l0YWxpYycsICd1bmRlcmxpbmUnLCAnc3RyaWtlVGhyb3VnaCcsICdzdWJzY3JpcHQnLCAnc3VwZXJzY3JpcHQnLCAnZm9udEZhbWlseScsICdmb250U2l6ZScsICd8JyxcclxuICAgICAgICAgICAgICAgICAgICAnY29sb3InLCAnaW5saW5lU3R5bGUnLCAncGFyYWdyYXBoU3R5bGUnLCAnfCcsICdyZW1vdmVGb290ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vJy0nLFxyXG4gICAgICAgICAgICAgICAgICAgICdwYXJhZ3JhcGhGb3JtYXQnLCAnYWxpZ24nLCAnZm9ybWF0T0wnLCAnZm9ybWF0VUwnLCAnb3V0ZGVudCcsICdpbmRlbnQnLCAncXVvdGUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2luc2VydEhSJywgJ2luc2VydExpbmsnLCAnaW5zZXJ0SW1hZ2UnLCAnaW5zZXJ0VGFibGUnLCAndW5kbycsICdyZWRvJywgJ2NsZWFyRm9ybWF0dGluZycsICdodG1sJ1xyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJCdXR0b25zU006IFtcclxuICAgICAgICAgICAgICAgICAgICAnYm9sZCcsICdpdGFsaWMnLCAndW5kZXJsaW5lJywgJ3N0cmlrZVRocm91Z2gnLCAnc3Vic2NyaXB0JywgJ3N1cGVyc2NyaXB0JywgJ2ZvbnRGYW1pbHknLCAnZm9udFNpemUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbG9yJywgJ2lubGluZVN0eWxlJywgJ3BhcmFncmFwaFN0eWxlJywgJ3wnLCAncmVtb3ZlRm9vdGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyctJyxcclxuICAgICAgICAgICAgICAgICAgICAncGFyYWdyYXBoRm9ybWF0JywgJ2FsaWduJywgJ2Zvcm1hdE9MJywgJ2Zvcm1hdFVMJywgJ291dGRlbnQnLCAnaW5kZW50JywgJ3F1b3RlJywgJ3wnLFxyXG4gICAgICAgICAgICAgICAgICAgICdpbnNlcnRIUicsICdpbnNlcnRMaW5rJywgJ2luc2VydEltYWdlJywgJ2luc2VydFRhYmxlJywgJ3VuZG8nLCAncmVkbycsICdjbGVhckZvcm1hdHRpbmcnLCAnaHRtbCdcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICB0b29sYmFyQnV0dG9uc1hTOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgJ2JvbGQnLCAnaXRhbGljJywgJ3VuZGVybGluZScsICdzdHJpa2VUaHJvdWdoJywgJ3N1YnNjcmlwdCcsICdzdXBlcnNjcmlwdCcsICdmb250RmFtaWx5JywgJ2ZvbnRTaXplJywgJ3wnLFxyXG4gICAgICAgICAgICAgICAgICAgICdjb2xvcicsICdpbmxpbmVTdHlsZScsICdwYXJhZ3JhcGhTdHlsZScsICd8JywgJ3JlbW92ZUZvb3RlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8nLScsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3BhcmFncmFwaEZvcm1hdCcsICdhbGlnbicsICdmb3JtYXRPTCcsICdmb3JtYXRVTCcsICdvdXRkZW50JywgJ2luZGVudCcsICdxdW90ZScsICd8JyxcclxuICAgICAgICAgICAgICAgICAgICAnaW5zZXJ0SFInLCAnaW5zZXJ0TGluaycsICdpbnNlcnRJbWFnZScsICdpbnNlcnRUYWJsZScsICd1bmRvJywgJ3JlZG8nLCAnY2xlYXJGb3JtYXR0aW5nJywgJ2h0bWwnXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2Zyb2FsYUVkaXRvci5pbWFnZS5iZWZvcmVVcGxvYWQnOiAoZSwgZWRpdG9yLCBpbWFnZXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRCYXNlNjRJbWFnZShlZGl0b3IsIGltYWdlc1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHN0eWxlcygpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJwIHsgbWFyZ2luOiAwIH1cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgX2h0bWw6IHN0cmluZztcclxuICAgICAgICBnZXQgaHRtbCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB2YXIgd3JpdGVyID0gbmV3IERvY3VtZW50V3JpdGVyKHRoaXMuaGVhZGVyLCB0aGlzLmNvbnRlbnQsIHRoaXMuZm9vdGVyKTtcclxuICAgICAgICAgICAgdmFyIG9wdGlvbnM6IElEb2N1bWVudFdyaXRlck9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICBleGNsdWRlSGVhZGVyOiAhdGhpcy53aXRoSGVhZGVyLFxyXG4gICAgICAgICAgICAgICAgZXhjbHVkZUZvb3RlcjogIXRoaXMud2l0aEZvb3RlclxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gd3JpdGVyLndyaXRlKG9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0IGh0bWwodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLl9odG1sID0gdmFsdWU7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5zZXRDb250ZW50KHZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc2V0Q29udGVudCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciBwYXJzZXIgPSBuZXcgRG9jdW1lbnRSZWFkZXIodmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmhlYWRlciA9IHBhcnNlci5nZXRIZWFkZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5jb250ZW50ID0gcGFyc2VyLmdldENvbnRlbnQoKTtcclxuICAgICAgICAgICAgdGhpcy5mb290ZXIgPSBwYXJzZXIuZ2V0Rm9vdGVyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0b29sYmFySWQ6IHN0cmluZztcclxuICAgICAgICBoZWFkZXJPcHRpb25zOiBhbnk7XHJcbiAgICAgICAgY29udGVudE9wdGlvbnM6IGFueTtcclxuICAgICAgICBmb290ZXJPcHRpb25zOiBhbnk7XHJcbiAgICAgICAgaW5pdGlhbGl6ZWQ6IGJvb2xlYW47XHJcbiAgICAgICAgaGVhZGVyOiBzdHJpbmc7XHJcbiAgICAgICAgY29udGVudDogc3RyaW5nO1xyXG4gICAgICAgIGZvb3Rlcjogc3RyaW5nO1xyXG4gICAgICAgIHdpdGhIZWFkZXI6IGJvb2xlYW47XHJcbiAgICAgICAgd2l0aEZvb3RlcjogYm9vbGVhbjtcclxuICAgIH1cclxuXHJcbiAgICBpbnRlcmZhY2UgSURvY3VtZW50V3JpdGVyT3B0aW9ucyB7XHJcbiAgICAgICAgZXhjbHVkZUhlYWRlcjogYm9vbGVhbjtcclxuICAgICAgICBleGNsdWRlRm9vdGVyOiBib29sZWFuO1xyXG4gICAgfVxyXG5cclxuICAgIGludGVyZmFjZSBJRG9jdW1lbnRXcml0ZXIge1xyXG4gICAgICAgIHdyaXRlKCk6IHN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBEb2N1bWVudFdyaXRlciBpbXBsZW1lbnRzIElEb2N1bWVudFdyaXRlciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoaGVhZGVyOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZywgZm9vdGVyOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5faGVhZGVyID0gaGVhZGVyO1xyXG4gICAgICAgICAgICB0aGlzLl9jb250ZW50ID0gY29udGVudDtcclxuICAgICAgICAgICAgdGhpcy5fZm9vdGVyID0gZm9vdGVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGhhc0hlYWRlcigpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hlYWRlciAhPSBudWxsICYmIHRoaXMuX2hlYWRlci5sZW5ndGggPiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGhhc0Zvb3RlcigpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Zvb3RlciAhPSBudWxsICYmIHRoaXMuX2Zvb3Rlci5sZW5ndGggPiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgd3JpdGUob3B0aW9ucz86IElEb2N1bWVudFdyaXRlck9wdGlvbnMpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB2YXIgaHRtbCA9IFtdO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzSGVhZGVyICYmICFvcHRpb25zLmV4Y2x1ZGVIZWFkZXIpXHJcbiAgICAgICAgICAgICAgICBodG1sLnB1c2goYDxoZWFkZXI+JHt0aGlzLl9oZWFkZXJ9PC9oZWFkZXI+YCk7XHJcblxyXG4gICAgICAgICAgICBodG1sLnB1c2goYDxjb250ZW50PiR7dGhpcy5fY29udGVudH08L2NvbnRlbnQ+YCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNGb290ZXIgJiYgIW9wdGlvbnMuZXhjbHVkZUZvb3RlcilcclxuICAgICAgICAgICAgICAgIGh0bWwucHVzaChgPGZvb3Rlcj4ke3RoaXMuX2Zvb3Rlcn08L2Zvb3Rlcj5gKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBodG1sLmpvaW4oXCJcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIF9oZWFkZXI6IHN0cmluZztcclxuICAgICAgICBwcml2YXRlIF9jb250ZW50OiBzdHJpbmc7XHJcbiAgICAgICAgcHJpdmF0ZSBfZm9vdGVyOiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgaW50ZXJmYWNlIElEb2N1bWVudFJlYWRlciB7XHJcbiAgICAgICAgZ2V0SGVhZGVyKCk6IHN0cmluZztcclxuICAgICAgICBnZXRDb250ZW50KCk6IHN0cmluZztcclxuICAgICAgICBnZXRGb290ZXIoKTogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIERvY3VtZW50UmVhZGVyIGltcGxlbWVudHMgSURvY3VtZW50UmVhZGVyIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihodG1sOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5fJGh0bWwgPSAkKCc8ZGl2PjwvZGl2PicpLmFwcGVuZChodG1sIHx8ICcnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgXyRodG1sOiBKUXVlcnk7XHJcblxyXG4gICAgICAgIGdldEhlYWRlcigpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZCgnaGVhZGVyJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRDb250ZW50KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIC8vIFRvRG86IGlmIDxjb250ZW50PjwvY29udGVudD4gZG9lcyBub3QgZXhpc3QgYnV0IHRoZXJlIGlzIGh0bWwsIHdyYXAgdGhlIGh0bWwgaW4gYSBjb250ZW50IHRhZ1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZCgnY29udGVudCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0Rm9vdGVyKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkKCdmb290ZXInKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgY2hpbGQoc2VsZWN0b3I6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl8kaHRtbC5jaGlsZHJlbihzZWxlY3RvcikuaHRtbCgpIHx8ICcnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBEb2N1bWVudEVkaXRvckRpcmVjdGl2ZSB7XHJcbiAgICAgICAgcmVzdHJpY3QgPSAnRSc7XHJcbiAgICAgICAgdHJhbnNjbHVkZSA9IHRydWU7XHJcbiAgICAgICAgdGVtcGxhdGVVcmwgPSAnZG9jdW1lbnQtZWRpdG9yLmh0bWwnO1xyXG4gICAgICAgIGNvbnRyb2xsZXIgPSBEb2N1bWVudEVkaXRvckNvbnRyb2xsZXI7XHJcbiAgICAgICAgY29udHJvbGxlckFzID0gJ2RvY3VtZW50RWRpdG9yJztcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyID0gdHJ1ZTtcclxuICAgICAgICBzY29wZSA9IHtcclxuICAgICAgICAgICAgaGVhZGVyT3B0aW9uczogJz0/JyxcclxuICAgICAgICAgICAgYm9keU9wdGlvbnM6ICc9PycsXHJcbiAgICAgICAgICAgIGZvb3Rlck9wdGlvbnM6ICc9PycsXHJcbiAgICAgICAgICAgIGh0bWw6ICc9PydcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxpbmsgPSB7XHJcbiAgICAgICAgICAgIHByZTogKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJGN0cmw6IERvY3VtZW50RWRpdG9yQ29udHJvbGxlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRvb2xiYXJJZCA9IGBkb2N1bWVudC1lZGl0b3ItJHskc2NvcGUuJGlkfS13eXNpd3lnLXRvb2xiYXJgO1xyXG4gICAgICAgICAgICAgICAgdmFyICR0b29sYmFyID0gJGVsZW1lbnQuZmluZChcIi5kb2N1bWVudC1lZGl0b3Itd3lzaXd5Zy10b29sYmFyXCIpO1xyXG4gICAgICAgICAgICAgICAgJHRvb2xiYXIucHJvcCgnaWQnLCB0b29sYmFySWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBlZGl0b3I6IGFueSA9ICRbJ0Zyb2FsYUVkaXRvciddO1xyXG5cclxuICAgICAgICAgICAgICAgIGVkaXRvci5EZWZpbmVJY29uKCdyZW1vdmVIZWFkZXInLCB7IE5BTUU6ICd0aW1lcy1jaXJjbGUnIH0pO1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yLlJlZ2lzdGVyQ29tbWFuZCgncmVtb3ZlSGVhZGVyJywge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUmVtb3ZlIEhlYWRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgdW5kbzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBmb2N1czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICByZWZyZXNoQWZ0ZXJDYWxsYmFjazogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKGVkaXRvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkY3RybC53aXRoSGVhZGVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBlZGl0b3IuRGVmaW5lSWNvbigncmVtb3ZlRm9vdGVyJywgeyBOQU1FOiAndGltZXMtY2lyY2xlJyB9KTtcclxuICAgICAgICAgICAgICAgIGVkaXRvci5SZWdpc3RlckNvbW1hbmQoJ3JlbW92ZUZvb3RlcicsIHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1JlbW92ZSBGb290ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIHVuZG86IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZm9jdXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVmcmVzaEFmdGVyQ2FsbGJhY2s6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IChlZGl0b3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGN0cmwud2l0aEZvb3RlciA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJGN0cmwub25QcmVJbml0KHRvb2xiYXJJZCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBvc3Q6ICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICRjdHJsOiBEb2N1bWVudEVkaXRvckNvbnRyb2xsZXIpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgJGhlYWRlcjogYW55ID0gJCgnLmRvY3VtZW50LWVkaXRvci1oZWFkZXInLCAkZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgJGNvbnRlbnQ6IGFueSA9ICQoJy5kb2N1bWVudC1lZGl0b3ItY29udGVudCcsICRlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIHZhciAkZm9vdGVyOiBhbnkgPSAkKCcuZG9jdW1lbnQtZWRpdG9yLWZvb3RlcicsICRlbGVtZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAkaGVhZGVyLmZyb2FsYUVkaXRvcigndG9vbGJhci5oaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAvLyRjb250ZW50LmZyb2FsYUVkaXRvcigndG9vbGJhci5oaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkZm9vdGVyLmZyb2FsYUVkaXRvcigndG9vbGJhci5oaWRlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgJGhlYWRlci5vbignZnJvYWxhRWRpdG9yLmZvY3VzJywgKGUsIGVkaXRvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXRvci50b29sYmFyLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAkY29udGVudC5mcm9hbGFFZGl0b3IoJ3Rvb2xiYXIuaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICRmb290ZXIuZnJvYWxhRWRpdG9yKCd0b29sYmFyLmhpZGUnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICRjb250ZW50Lm9uKCdmcm9hbGFFZGl0b3IuZm9jdXMnLCAoZSwgZWRpdG9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGhlYWRlci5mcm9hbGFFZGl0b3IoJ3Rvb2xiYXIuaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXRvci50b29sYmFyLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAkZm9vdGVyLmZyb2FsYUVkaXRvcigndG9vbGJhci5oaWRlJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAkZm9vdGVyLm9uKCdmcm9hbGFFZGl0b3IuZm9jdXMnLCAoZSwgZWRpdG9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGhlYWRlci5mcm9hbGFFZGl0b3IoJ3Rvb2xiYXIuaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICRjb250ZW50LmZyb2FsYUVkaXRvcigndG9vbGJhci5oaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWRpdG9yLnRvb2xiYXIuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJGN0cmwub25Jbml0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBBbmd1bGFyLm1vZHVsZShcIm5nRG9jdW1lbnRcIikuZGlyZWN0aXZlKFwiZG9jdW1lbnRFZGl0b3JcIiwgRG9jdW1lbnRFZGl0b3JEaXJlY3RpdmUpO1xyXG59IiwibW9kdWxlIE5nRG9jdW1lbnQge1xyXG4gICAgZGVjbGFyZSB2YXIgUERGSlM6IGFueTtcclxuXHJcbiAgICBjbGFzcyBEb2N1bWVudFBkZkNvbnRyb2xsZXIge1xyXG5cclxuICAgICAgICBvbkluaXQocmVuZGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlciA9IHJlbmRlcjtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXIodGhpcy51cmwpO1xyXG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF9yZW5kZXI6IGFueTtcclxuICAgICAgICByZW5kZXIodXJsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyKHVybCkuZmluYWxseSgoKSA9PiB0aGlzLmlzTG9hZGluZyA9IGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluaXRpYWxpemVkOiBib29sZWFuO1xyXG4gICAgICAgIGlzTG9hZGluZzogYm9vbGVhbjtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfdXJsOiBzdHJpbmc7XHJcbiAgICAgICAgZ2V0IHVybCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdXJsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXQgdXJsKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5fdXJsID0gdmFsdWU7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXIodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBEb2N1bWVudFBkZkRpcmVjdGl2ZSB7XHJcbiAgICAgICAgc3RhdGljICRpbmplY3QgPSBbJyRxJ107XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgJHE6IGFuZ3VsYXIuSVFTZXJ2aWNlKSB7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzdHJpY3QgPSAnRSc7XHJcbiAgICAgICAgdHJhbnNjbHVkZSA9IHRydWU7XHJcbiAgICAgICAgdGVtcGxhdGVVcmwgPSAnZG9jdW1lbnQtcGRmLmh0bWwnO1xyXG4gICAgICAgIGNvbnRyb2xsZXIgPSBEb2N1bWVudFBkZkNvbnRyb2xsZXI7XHJcbiAgICAgICAgY29udHJvbGxlckFzID0gJ2RvY3VtZW50UGRmJztcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyID0gdHJ1ZTtcclxuICAgICAgICBzY29wZSA9IHtcclxuICAgICAgICAgICAgdXJsOiAnQCdcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxpbmsgPSAoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkY3RybDogRG9jdW1lbnRQZGZDb250cm9sbGVyKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciAkcGFnZXMgPSAkZWxlbWVudC5maW5kKFwiLmRvY3VtZW50LXZpZXdlci1wYWdlc1wiKTtcclxuXHJcbiAgICAgICAgICAgICRjdHJsLm9uSW5pdCgodXJsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXIoJHNjb3BlLCAkcGFnZXMsIHVybCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVuZGVyKCRzY29wZSwgJHBhZ2VzLCB1cmwpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gdGhpcy4kcS5kZWZlcigpO1xyXG5cclxuICAgICAgICAgICAgJHBhZ2VzLmVtcHR5KCk7XHJcbiAgICAgICAgICAgIFBERkpTLmdldERvY3VtZW50KHVybCkudGhlbihwZGYgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB0YXNrcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaWR4ID0gMDsgaWR4IDwgcGRmLnBkZkluZm8ubnVtUGFnZXM7IGlkeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFza3MucHVzaChwZGYuZ2V0UGFnZShpZHggKyAxKS50aGVuKHBhZ2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVQYWdlKHBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLiRxLmFsbCh0YXNrcykudGhlbihjYW52YXNlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHBhZ2VzLmFwcGVuZChjYW52YXNlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShwZGYpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3JlYXRlUGFnZShwYWdlKSB7XHJcbiAgICAgICAgICAgIHZhciBzY2FsZSA9IDEuNTtcclxuICAgICAgICAgICAgdmFyIHZpZXdwb3J0ID0gcGFnZS5nZXRWaWV3cG9ydChzY2FsZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgJGNhbnZhcyA9ICQoJzxjYW52YXMgY2xhc3M9XCJkb2N1bWVudC12aWV3ZXItcGFnZVwiPjwvY2FudmFzPicpO1xyXG4gICAgICAgICAgICB2YXIgY2FudmFzOiBhbnkgPSAkY2FudmFzLmdldCgwKTtcclxuICAgICAgICAgICAgdmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IHZpZXdwb3J0LmhlaWdodDtcclxuICAgICAgICAgICAgY2FudmFzLndpZHRoID0gdmlld3BvcnQud2lkdGg7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmVuZGVyQ29udGV4dCA9IHtcclxuICAgICAgICAgICAgICAgIGNhbnZhc0NvbnRleHQ6IGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICB2aWV3cG9ydDogdmlld3BvcnRcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHBhZ2UucmVuZGVyKHJlbmRlckNvbnRleHQpO1xyXG4gICAgICAgICAgICByZXR1cm4gJGNhbnZhcztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQW5ndWxhci5tb2R1bGUoXCJuZ0RvY3VtZW50XCIpLmRpcmVjdGl2ZShcImRvY3VtZW50UGRmXCIsIERvY3VtZW50UGRmRGlyZWN0aXZlKTtcclxufSJdfQ==