Angular.module("ngDocument", ['froala']);
var NgDocument;
(function (NgDocument) {
    var OrderedListPlugin = (function () {
        function OrderedListPlugin(editor, $scope) {
            var _this = this;
            this.editor = editor;
            this.$scope = $scope;
            this.orderedListTypes = {
                'listType-decimal': 'Numbered',
                'listType-lowerRoman': 'Lower roman',
                'listType-upperRoman': 'Upper roman',
                'listType-lowerAlpha': 'Lower alpha',
                'listType-upperAlpha': 'Upper alpha'
            };
            this.editorStatic = $['FroalaEditor'];
            this.editorStatic.POPUP_TEMPLATES[OrderedListPlugin.TEMPLATE_NAME] = '[_BUTTONS_]';
            $.extend(this.editorStatic.DEFAULTS, {
                orderListButtons: ['orderedListType']
            });
            editor.$el.on('click', 'ol>li', function (e) {
                _this.showPopup(e.target);
            });
        }
        OrderedListPlugin.prototype.init = function () {
            var _this = this;
            if (this.$popup)
                return;
            this.editorStatic.DefineIcon('orderedListType', { NAME: 'list-ol' });
            this.editorStatic.RegisterCommand('orderedListType', {
                title: 'Order List Type',
                type: 'dropdown',
                undo: true,
                focus: false,
                refreshAfterCallback: true,
                options: this.orderedListTypes,
                callback: function (cmd, val) {
                    _this.setStyle(val);
                }
            });
            var buttons = [
                "<div class=\"fr-buttons\">",
                this.editor.button.buildList(this.editor.opts.orderListButtons),
                "</div>"
            ];
            var template = {
                buttons: buttons.join('')
            };
            this.$popup = this.editor.popups.create(OrderedListPlugin.TEMPLATE_NAME, template);
        };
        OrderedListPlugin.prototype.setStyle = function (val) {
            var $ol = this.$li.parent("ol");
            var keys = Object.keys(this.orderedListTypes);
            $ol.removeClass(keys.join(' '));
            $ol.addClass(val);
            this.$scope.$apply();
        };
        OrderedListPlugin.prototype.showPopup = function (li) {
            this.init();
            this.editor.popups.setContainer(OrderedListPlugin.TEMPLATE_NAME, this.editor.$tb);
            var parent = this.editor.$iframe.offset();
            this.$li = $(li);
            var relOffset = this.$li.offset();
            var offset = {
                left: relOffset.left + parent.left,
                top: relOffset.top + parent.top
            };
            var height = this.$li.outerHeight();
            var left = offset.left + 10;
            var top = offset.top + 20;
            this.editor.popups.show(OrderedListPlugin.TEMPLATE_NAME, left, top, height);
        };
        OrderedListPlugin.prototype.hidePopup = function () {
            this.$li = null;
            this.editor.popups.hide(OrderedListPlugin.TEMPLATE_NAME);
        };
        OrderedListPlugin.TEMPLATE_NAME = 'orderListPlugin.popup';
        return OrderedListPlugin;
    }());
    NgDocument.OrderedListPlugin = OrderedListPlugin;
})(NgDocument || (NgDocument = {}));
var NgDocument;
(function (NgDocument) {
    var FontSizePlugin = (function () {
        function FontSizePlugin(editor, fontSize) {
            this.editor = editor;
            this.fontSize = fontSize;
        }
        FontSizePlugin.prototype.apply = function (value) {
            var ranges = this.editor.selection.ranges(), hasRanges = ranges.filter(function (x) { return !x.collapsed; }).length > 0;
            if (hasRanges) {
                this.fontSize.apply(value);
                return;
            }
            var $start = $(this.editor.selection.element()), $list = $start.parents("ol, ul").first(), isList = $list.length > 0;
            if (!isList)
                return;
            $list.css("font-size", value);
        };
        FontSizePlugin.prototype.refresh = function (a) {
            this.fontSize.refresh(a);
        };
        FontSizePlugin.prototype.refreshOnShow = function (a, b) {
            this.fontSize.refreshOnShow(a, b);
        };
        return FontSizePlugin;
    }());
    NgDocument.FontSizePlugin = FontSizePlugin;
})(NgDocument || (NgDocument = {}));
var NgDocument;
(function (NgDocument) {
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
    NgDocument.DocumentReader = DocumentReader;
})(NgDocument || (NgDocument = {}));
var NgDocument;
(function (NgDocument) {
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
    NgDocument.DocumentWriter = DocumentWriter;
})(NgDocument || (NgDocument = {}));
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
                fontSizeSelection: true,
                fontSize: ["8", "9", "10", "11", "12", "14", "16", "18", "24", "30", "36", "48", "60", "72", "96"],
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
            var config = angular.extend({}, this.defaultOptions, options, {
                placeholderText: 'Content'
            });
            var toolbars = ['toolbarButtons', 'toolbarButtonsMD', 'toolbarButtonsSM', 'toolbarButtonsXS'];
            toolbars.forEach(function (x) { return config[x] = config[x].concat(['pageBreak']); });
            return config;
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
                var writer = new NgDocument.DocumentWriter(this.header, this.content, this.footer);
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
            var parser = new NgDocument.DocumentReader(value);
            this.header = parser.getHeader();
            this.content = parser.getContent();
            this.footer = parser.getFooter();
        };
        return DocumentEditorController;
    }());
    var DocumentEditorDirective = (function () {
        function DocumentEditorDirective($document) {
            var _this = this;
            this.$document = $document;
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
                    var $body = _this.$document.find('body');
                    $body.append($element);
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
                    editor.DefineIcon('pageBreak', { NAME: 'columns' });
                    editor.RegisterCommand('pageBreak', {
                        title: 'Page Break',
                        undo: true,
                        focus: true,
                        refreshAfterCallback: true,
                        callback: function (editor) {
                            this.html.insert('<hr class="fr-page-break">');
                            $scope.$apply();
                        }
                    });
                    var PLUGINS = $['FroalaEditor'].PLUGINS;
                    PLUGINS.orderedListPlugin = function (editor) { return new NgDocument.OrderedListPlugin(editor, $scope); };
                    var _fontSize = PLUGINS.fontSize;
                    PLUGINS.fontSize = function (editor) { return new NgDocument.FontSizePlugin(editor, _fontSize(editor)); };
                    $ctrl.onPreInit(editor, toolbarId);
                },
                post: function ($scope, $element, $attrs, $ctrl) {
                    var $header = $('.document-editor-header', $element);
                    var $content = $('.document-editor-content', $element);
                    var $footer = $('.document-editor-footer', $element);
                    $header.froalaEditor('toolbar.hide');
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
        DocumentEditorDirective.$inject = ['$document'];
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
            this._render(url).finally(function () {
                _this.isLoading = false;
                _this.isLoaded = true;
            });
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
                url: '@',
                isLoaded: '=?'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1kb2N1bWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHAudHMiLCIuLi9zcmMvb3JkZXJlZC1saXN0LXBsdWdpbi50cyIsIi4uL3NyYy9mb250LXNpemUtcGx1Z2luLnRzIiwiLi4vc3JjL2RvY3VtZW50LXJlYWRlci50cyIsIi4uL3NyYy9kb2N1bWVudC13cml0ZXIudHMiLCIuLi9zcmMvZG9jdW1lbnQtZWRpdG9yLnRzIiwiLi4vc3JjL2RvY3VtZW50LXBkZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUNBekMsSUFBTyxVQUFVLENBb0doQjtBQXBHRCxXQUFPLFVBQVUsRUFBQyxDQUFDO0lBRWY7UUFDSSwyQkFBb0IsTUFBTSxFQUFVLE1BQU07WUFEOUMsaUJBaUdDO1lBaEd1QixXQUFNLEdBQU4sTUFBTSxDQUFBO1lBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBQTtZQUN0QyxJQUFJLENBQUMsZ0JBQWdCLEdBQUc7Z0JBQ3BCLGtCQUFrQixFQUFFLFVBQVU7Z0JBQzlCLHFCQUFxQixFQUFFLGFBQWE7Z0JBQ3BDLHFCQUFxQixFQUFFLGFBQWE7Z0JBQ3BDLHFCQUFxQixFQUFFLGFBQWE7Z0JBQ3BDLHFCQUFxQixFQUFFLGFBQWE7YUFDdkMsQ0FBQTtZQUVELElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRXRDLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxHQUFHLGFBQWEsQ0FBQztZQUVuRixDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFO2dCQUNqQyxnQkFBZ0IsRUFBRSxDQUFDLGlCQUFpQixDQUFDO2FBQ3hDLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxHQUFHLENBQUMs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b2FsYSddKTsiLCJtb2R1bGUgTmdEb2N1bWVudCB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIE9yZGVyZWRMaXN0UGx1Z2luIHtcclxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVkaXRvciwgcHJpdmF0ZSAkc2NvcGUpIHtcclxuICAgICAgICAgICAgdGhpcy5vcmRlcmVkTGlzdFR5cGVzID0ge1xyXG4gICAgICAgICAgICAgICAgJ2xpc3RUeXBlLWRlY2ltYWwnOiAnTnVtYmVyZWQnLFxyXG4gICAgICAgICAgICAgICAgJ2xpc3RUeXBlLWxvd2VyUm9tYW4nOiAnTG93ZXIgcm9tYW4nLFxyXG4gICAgICAgICAgICAgICAgJ2xpc3RUeXBlLXVwcGVyUm9tYW4nOiAnVXBwZXIgcm9tYW4nLFxyXG4gICAgICAgICAgICAgICAgJ2xpc3RUeXBlLWxvd2VyQWxwaGEnOiAnTG93ZXIgYWxwaGEnLFxyXG4gICAgICAgICAgICAgICAgJ2xpc3RUeXBlLXVwcGVyQWxwaGEnOiAnVXBwZXIgYWxwaGEnXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yU3RhdGljID0gJFsnRnJvYWxhRWRpdG9yJ107XHJcblxyXG4gICAgICAgICAgICB0aGlzLmVkaXRvclN0YXRpYy5QT1BVUF9URU1QTEFURVNbT3JkZXJlZExpc3RQbHVnaW4uVEVNUExBVEVfTkFNRV0gPSAnW19CVVRUT05TX10nO1xyXG5cclxuICAgICAgICAgICAgJC5leHRlbmQodGhpcy5lZGl0b3JTdGF0aWMuREVGQVVMVFMsIHtcclxuICAgICAgICAgICAgICAgIG9yZGVyTGlzdEJ1dHRvbnM6IFsnb3JkZXJlZExpc3RUeXBlJ11cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBlZGl0b3IuJGVsLm9uKCdjbGljaycsICdvbD5saScsIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dQb3B1cChlLnRhcmdldCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdCgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuJHBvcHVwKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5lZGl0b3JTdGF0aWMuRGVmaW5lSWNvbignb3JkZXJlZExpc3RUeXBlJywgeyBOQU1FOiAnbGlzdC1vbCcgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yU3RhdGljLlJlZ2lzdGVyQ29tbWFuZCgnb3JkZXJlZExpc3RUeXBlJywge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdPcmRlciBMaXN0IFR5cGUnLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Ryb3Bkb3duJyxcclxuICAgICAgICAgICAgICAgIHVuZG86IHRydWUsXHJcbiAgICAgICAgICAgICAgICBmb2N1czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICByZWZyZXNoQWZ0ZXJDYWxsYmFjazogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IHRoaXMub3JkZXJlZExpc3RUeXBlcyxcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoY21kLCB2YWwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0eWxlKHZhbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdmFyIGJ1dHRvbnM6IHN0cmluZ1tdID0gW1xyXG4gICAgICAgICAgICAgICAgYDxkaXYgY2xhc3M9XCJmci1idXR0b25zXCI+YCxcclxuICAgICAgICAgICAgICAgIHRoaXMuZWRpdG9yLmJ1dHRvbi5idWlsZExpc3QodGhpcy5lZGl0b3Iub3B0cy5vcmRlckxpc3RCdXR0b25zKSxcclxuICAgICAgICAgICAgICAgIGA8L2Rpdj5gXHJcbiAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICB2YXIgdGVtcGxhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiBidXR0b25zLmpvaW4oJycpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuJHBvcHVwID0gdGhpcy5lZGl0b3IucG9wdXBzLmNyZWF0ZShPcmRlcmVkTGlzdFBsdWdpbi5URU1QTEFURV9OQU1FLCB0ZW1wbGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXRTdHlsZSh2YWwpIHtcclxuICAgICAgICAgICAgdmFyICRvbCA9IHRoaXMuJGxpLnBhcmVudChcIm9sXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh0aGlzLm9yZGVyZWRMaXN0VHlwZXMpO1xyXG4gICAgICAgICAgICAkb2wucmVtb3ZlQ2xhc3Moa2V5cy5qb2luKCcgJykpO1xyXG4gICAgICAgICAgICAkb2wuYWRkQ2xhc3ModmFsKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2hvd1BvcHVwKGxpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5lZGl0b3IucG9wdXBzLnNldENvbnRhaW5lcihPcmRlcmVkTGlzdFBsdWdpbi5URU1QTEFURV9OQU1FLCB0aGlzLmVkaXRvci4kdGIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHBhcmVudCA9IHRoaXMuZWRpdG9yLiRpZnJhbWUub2Zmc2V0KCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLiRsaSA9ICQobGkpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJlbE9mZnNldCA9IHRoaXMuJGxpLm9mZnNldCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHtcclxuICAgICAgICAgICAgICAgIGxlZnQ6IHJlbE9mZnNldC5sZWZ0ICsgcGFyZW50LmxlZnQsXHJcbiAgICAgICAgICAgICAgICB0b3A6IHJlbE9mZnNldC50b3AgKyBwYXJlbnQudG9wXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSB0aGlzLiRsaS5vdXRlckhlaWdodCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGxlZnQgPSBvZmZzZXQubGVmdCArIDEwO1xyXG4gICAgICAgICAgICB2YXIgdG9wID0gb2Zmc2V0LnRvcCArIDIwO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5lZGl0b3IucG9wdXBzLnNob3coT3JkZXJlZExpc3RQbHVnaW4uVEVNUExBVEVfTkFNRSwgbGVmdCwgdG9wLCBoZWlnaHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaGlkZVBvcHVwKCkge1xyXG4gICAgICAgICAgICB0aGlzLiRsaSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yLnBvcHVwcy5oaWRlKE9yZGVyZWRMaXN0UGx1Z2luLlRFTVBMQVRFX05BTUUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSAkcG9wdXA6IGFueTtcclxuICAgICAgICBwcml2YXRlIGVkaXRvclN0YXRpYzogYW55O1xyXG4gICAgICAgIHByaXZhdGUgJGxpOiBhbnk7XHJcbiAgICAgICAgcHJpdmF0ZSBvcmRlcmVkTGlzdFR5cGVzOiBhbnk7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgVEVNUExBVEVfTkFNRSA9ICdvcmRlckxpc3RQbHVnaW4ucG9wdXAnO1xyXG4gICAgfVxyXG59IiwibW9kdWxlIE5nRG9jdW1lbnQge1xyXG4gICAgZXhwb3J0IGNsYXNzIEZvbnRTaXplUGx1Z2luIHtcclxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVkaXRvciwgcHJpdmF0ZSBmb250U2l6ZSkge1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXBwbHkodmFsdWUpIHtcclxuICAgICAgICAgICAgdmFyIHJhbmdlcyA9IHRoaXMuZWRpdG9yLnNlbGVjdGlvbi5yYW5nZXMoKSxcclxuICAgICAgICAgICAgICAgIGhhc1JhbmdlcyA9IHJhbmdlcy5maWx0ZXIoIHggPT4gIXguY29sbGFwc2VkICkubGVuZ3RoID4gMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChoYXNSYW5nZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9udFNpemUuYXBwbHkodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgJHN0YXJ0ID0gJCh0aGlzLmVkaXRvci5zZWxlY3Rpb24uZWxlbWVudCgpKSxcclxuICAgICAgICAgICAgICAgICRsaXN0ID0gJHN0YXJ0LnBhcmVudHMoXCJvbCwgdWxcIikuZmlyc3QoKSxcclxuICAgICAgICAgICAgICAgIGlzTGlzdCA9ICRsaXN0Lmxlbmd0aCA+IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWlzTGlzdClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICRsaXN0LmNzcyhcImZvbnQtc2l6ZVwiLCB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZWZyZXNoKGEpIHtcclxuICAgICAgICAgICAgdGhpcy5mb250U2l6ZS5yZWZyZXNoKGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVmcmVzaE9uU2hvdyhhLCBiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZm9udFNpemUucmVmcmVzaE9uU2hvdyhhLCBiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJtb2R1bGUgTmdEb2N1bWVudCB7XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElEb2N1bWVudFJlYWRlciB7XHJcbiAgICAgICAgZ2V0SGVhZGVyKCk6IHN0cmluZztcclxuICAgICAgICBnZXRDb250ZW50KCk6IHN0cmluZztcclxuICAgICAgICBnZXRGb290ZXIoKTogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBEb2N1bWVudFJlYWRlciBpbXBsZW1lbnRzIElEb2N1bWVudFJlYWRlciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoaHRtbDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuXyRodG1sID0gJCgnPGRpdj48L2Rpdj4nKS5hcHBlbmQoaHRtbCB8fCAnJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIF8kaHRtbDogSlF1ZXJ5O1xyXG5cclxuICAgICAgICBnZXRIZWFkZXIoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGQoJ2hlYWRlcicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0Q29udGVudCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICAvLyBUb0RvOiBpZiA8Y29udGVudD48L2NvbnRlbnQ+IGRvZXMgbm90IGV4aXN0IGJ1dCB0aGVyZSBpcyBodG1sLCB3cmFwIHRoZSBodG1sIGluIGEgY29udGVudCB0YWdcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGQoJ2NvbnRlbnQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldEZvb3RlcigpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZCgnZm9vdGVyJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGNoaWxkKHNlbGVjdG9yOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fJGh0bWwuY2hpbGRyZW4oc2VsZWN0b3IpLmh0bWwoKSB8fCAnJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJtb2R1bGUgTmdEb2N1bWVudCB7XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElEb2N1bWVudFdyaXRlck9wdGlvbnMge1xyXG4gICAgICAgIGV4Y2x1ZGVIZWFkZXI6IGJvb2xlYW47XHJcbiAgICAgICAgZXhjbHVkZUZvb3RlcjogYm9vbGVhbjtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElEb2N1bWVudFdyaXRlciB7XHJcbiAgICAgICAgd3JpdGUoKTogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBEb2N1bWVudFdyaXRlciBpbXBsZW1lbnRzIElEb2N1bWVudFdyaXRlciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoaGVhZGVyOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZywgZm9vdGVyOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5faGVhZGVyID0gaGVhZGVyO1xyXG4gICAgICAgICAgICB0aGlzLl9jb250ZW50ID0gY29udGVudDtcclxuICAgICAgICAgICAgdGhpcy5fZm9vdGVyID0gZm9vdGVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGhhc0hlYWRlcigpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hlYWRlciAhPSBudWxsICYmIHRoaXMuX2hlYWRlci5sZW5ndGggPiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGhhc0Zvb3RlcigpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Zvb3RlciAhPSBudWxsICYmIHRoaXMuX2Zvb3Rlci5sZW5ndGggPiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgd3JpdGUob3B0aW9ucz86IElEb2N1bWVudFdyaXRlck9wdGlvbnMpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB2YXIgaHRtbCA9IFtdO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzSGVhZGVyICYmICFvcHRpb25zLmV4Y2x1ZGVIZWFkZXIpXHJcbiAgICAgICAgICAgICAgICBodG1sLnB1c2goYDxoZWFkZXI+JHt0aGlzLl9oZWFkZXJ9PC9oZWFkZXI+YCk7XHJcblxyXG4gICAgICAgICAgICBodG1sLnB1c2goYDxjb250ZW50PiR7dGhpcy5fY29udGVudH08L2NvbnRlbnQ+YCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNGb290ZXIgJiYgIW9wdGlvbnMuZXhjbHVkZUZvb3RlcilcclxuICAgICAgICAgICAgICAgIGh0bWwucHVzaChgPGZvb3Rlcj4ke3RoaXMuX2Zvb3Rlcn08L2Zvb3Rlcj5gKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBodG1sLmpvaW4oXCJcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIF9oZWFkZXI6IHN0cmluZztcclxuICAgICAgICBwcml2YXRlIF9jb250ZW50OiBzdHJpbmc7XHJcbiAgICAgICAgcHJpdmF0ZSBfZm9vdGVyOiBzdHJpbmc7XHJcbiAgICB9XHJcbn0iLCJtb2R1bGUgTmdEb2N1bWVudCB7XHJcblxyXG4gICAgY2xhc3MgRG9jdW1lbnRFZGl0b3JDb250cm9sbGVyIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgdGhpcy5oZWFkZXIgPSB0aGlzLmhlYWRlciB8fCAnJztcclxuICAgICAgICAgICAgdGhpcy5jb250ZW50ID0gdGhpcy5jb250ZW50IHx8ICcnO1xyXG4gICAgICAgICAgICB0aGlzLmZvb3RlciA9IHRoaXMuZm9vdGVyIHx8ICcnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb25QcmVJbml0KGVkaXRvciwgdG9vbGJhcklkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICBpZnJhbWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBlbnRlcjogZWRpdG9yLkVOVEVSX0JSLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IDgxNixcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJDb250YWluZXI6IGAjJHt0b29sYmFySWR9YCxcclxuICAgICAgICAgICAgICAgIHRhYmxlU3R5bGVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2ZyLW5vLWJvcmRlcnMnOiAnTm8gQm9yZGVycycsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2ZyLWFsdGVybmF0ZS1yb3dzJzogJ0FsdGVybmF0ZSBSb3dzJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIidTb3VyY2UgU2VyaWYgUHJvJywgc2VyaWZcIjogXCJTZXJpZlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiJ1NvdXJjZSBTYW5zIFBybycsIHNhbnMtc2VyaWZcIjogXCJTYW5zIFNlcmlmXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCInU291cmNlIENvZGUgUHJvJywgbW9ub3NwYWNlXCI6IFwiTW9ub3NwYWNlXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5RGVmYXVsdFNlbGVjdGlvbjogXCJTZXJpZlwiLFxyXG4gICAgICAgICAgICAgICAgZm9udEZhbWlseVNlbGVjdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplU2VsZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6IFtcIjhcIiwgXCI5XCIsIFwiMTBcIiwgXCIxMVwiLCBcIjEyXCIsIFwiMTRcIiwgXCIxNlwiLCBcIjE4XCIsIFwiMjRcIiwgXCIzMFwiLCBcIjM2XCIsIFwiNDhcIiwgXCI2MFwiLCBcIjcyXCIsIFwiOTZcIl0sXHJcbiAgICAgICAgICAgICAgICBpZnJhbWVTdHlsZTogXCJib2R5e2ZvbnQtZmFtaWx5OidTb3VyY2UgU2VyaWYgUHJvJyxzZXJpZjt9XCIsXHJcbiAgICAgICAgICAgICAgICB0b29sYmFyQnV0dG9uczogW1xyXG4gICAgICAgICAgICAgICAgICAgICdib2xkJywgJ2l0YWxpYycsICd1bmRlcmxpbmUnLCAnc3RyaWtlVGhyb3VnaCcsICdzdWJzY3JpcHQnLCAnc3VwZXJzY3JpcHQnLCAnZm9udEZhbWlseScsICdmb250U2l6ZScsICd8JyxcclxuICAgICAgICAgICAgICAgICAgICAnY29sb3InLCAnaW5saW5lU3R5bGUnLCAncGFyYWdyYXBoU3R5bGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vJy0nLFxyXG4gICAgICAgICAgICAgICAgICAgICdwYXJhZ3JhcGhGb3JtYXQnLCAnYWxpZ24nLCAnZm9ybWF0T0wnLCAnZm9ybWF0VUwnLCAnb3V0ZGVudCcsICdpbmRlbnQnLCAncXVvdGUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2luc2VydEhSJywgJ2luc2VydExpbmsnLCAnaW5zZXJ0SW1hZ2UnLCAnaW5zZXJ0VGFibGUnLCAndW5kbycsICdyZWRvJywgJ2NsZWFyRm9ybWF0dGluZycsICdodG1sJ1xyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJCdXR0b25zTUQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAnYm9sZCcsICdpdGFsaWMnLCAndW5kZXJsaW5lJywgJ3N0cmlrZVRocm91Z2gnLCAnc3Vic2NyaXB0JywgJ3N1cGVyc2NyaXB0JywgJ2ZvbnRGYW1pbHknLCAnZm9udFNpemUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbG9yJywgJ2lubGluZVN0eWxlJywgJ3BhcmFncmFwaFN0eWxlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyctJyxcclxuICAgICAgICAgICAgICAgICAgICAncGFyYWdyYXBoRm9ybWF0JywgJ2FsaWduJywgJ2Zvcm1hdE9MJywgJ2Zvcm1hdFVMJywgJ291dGRlbnQnLCAnaW5kZW50JywgJ3F1b3RlJywgJ3wnLFxyXG4gICAgICAgICAgICAgICAgICAgICdpbnNlcnRIUicsICdpbnNlcnRMaW5rJywgJ2luc2VydEltYWdlJywgJ2luc2VydFRhYmxlJywgJ3VuZG8nLCAncmVkbycsICdjbGVhckZvcm1hdHRpbmcnLCAnaHRtbCdcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICB0b29sYmFyQnV0dG9uc1NNOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgJ2JvbGQnLCAnaXRhbGljJywgJ3VuZGVybGluZScsICdzdHJpa2VUaHJvdWdoJywgJ3N1YnNjcmlwdCcsICdzdXBlcnNjcmlwdCcsICdmb250RmFtaWx5JywgJ2ZvbnRTaXplJywgJ3wnLFxyXG4gICAgICAgICAgICAgICAgICAgICdjb2xvcicsICdpbmxpbmVTdHlsZScsICdwYXJhZ3JhcGhTdHlsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8nLScsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3BhcmFncmFwaEZvcm1hdCcsICdhbGlnbicsICdmb3JtYXRPTCcsICdmb3JtYXRVTCcsICdvdXRkZW50JywgJ2luZGVudCcsICdxdW90ZScsICd8JyxcclxuICAgICAgICAgICAgICAgICAgICAnaW5zZXJ0SFInLCAnaW5zZXJ0TGluaycsICdpbnNlcnRJbWFnZScsICdpbnNlcnRUYWJsZScsICd1bmRvJywgJ3JlZG8nLCAnY2xlYXJGb3JtYXR0aW5nJywgJ2h0bWwnXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgdG9vbGJhckJ1dHRvbnNYUzogW1xyXG4gICAgICAgICAgICAgICAgICAgICdib2xkJywgJ2l0YWxpYycsICd1bmRlcmxpbmUnLCAnc3RyaWtlVGhyb3VnaCcsICdzdWJzY3JpcHQnLCAnc3VwZXJzY3JpcHQnLCAnZm9udEZhbWlseScsICdmb250U2l6ZScsICd8JyxcclxuICAgICAgICAgICAgICAgICAgICAnY29sb3InLCAnaW5saW5lU3R5bGUnLCAncGFyYWdyYXBoU3R5bGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vJy0nLFxyXG4gICAgICAgICAgICAgICAgICAgICdwYXJhZ3JhcGhGb3JtYXQnLCAnYWxpZ24nLCAnZm9ybWF0T0wnLCAnZm9ybWF0VUwnLCAnb3V0ZGVudCcsICdpbmRlbnQnLCAncXVvdGUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2luc2VydEhSJywgJ2luc2VydExpbmsnLCAnaW5zZXJ0SW1hZ2UnLCAnaW5zZXJ0VGFibGUnLCAndW5kbycsICdyZWRvJywgJ2NsZWFyRm9ybWF0dGluZycsICdodG1sJ1xyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGV2ZW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdmcm9hbGFFZGl0b3IuaW1hZ2UuYmVmb3JlVXBsb2FkJzogKGUsIGVkaXRvciwgaW1hZ2VzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0QmFzZTY0SW1hZ2UoZWRpdG9yLCBpbWFnZXNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5oZWFkZXJDb25maWcgPSB0aGlzLmdldEhlYWRlckNvbmZpZyh0aGlzLmhlYWRlck9wdGlvbnMgfHwge30pO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnRDb25maWcgPSB0aGlzLmdldENvbnRlbnRDb25maWcodGhpcy5jb250ZW50T3B0aW9ucyB8fCB7fSk7XHJcbiAgICAgICAgICAgIHRoaXMuZm9vdGVyQ29uZmlnID0gdGhpcy5nZXRGb290ZXJDb25maWcodGhpcy5mb290ZXJPcHRpb25zIHx8IHt9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9uSW5pdCgpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRDb250ZW50KHRoaXMuX2h0bWwpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oZWFkZXIubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgIHRoaXMud2l0aEhlYWRlciA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmZvb3Rlci5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy53aXRoRm9vdGVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGluc2VydEJhc2U2NEltYWdlKGVkaXRvcjogYW55LCBpbWFnZTogRmlsZSkge1xyXG4gICAgICAgICAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICAgICAgcmVhZGVyLm9ubG9hZCA9IChyZWFkZXJFdnQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yLmltYWdlLmluc2VydChyZWFkZXJFdnQudGFyZ2V0LnJlc3VsdCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGltYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldEhlYWRlckNvbmZpZyhvcHRpb25zOiBhbnkpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgY29uZmlnID0gYW5ndWxhci5leHRlbmQoe30sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyVGV4dDogJ0hlYWRlcidcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdG9vbGJhcnMgPSBbJ3Rvb2xiYXJCdXR0b25zJywgJ3Rvb2xiYXJCdXR0b25zTUQnLCAndG9vbGJhckJ1dHRvbnNTTScsICd0b29sYmFyQnV0dG9uc1hTJ107XHJcbiAgICAgICAgICAgIHRvb2xiYXJzLmZvckVhY2goeCA9PiBjb25maWdbeF0gPSBjb25maWdbeF0uY29uY2F0KFsnfCcsICdyZW1vdmVIZWFkZXInXSkpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldENvbnRlbnRDb25maWcob3B0aW9uczogYW55KTogYW55IHtcclxuICAgICAgICAgICAgdmFyIGNvbmZpZyA9IGFuZ3VsYXIuZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlclRleHQ6ICdDb250ZW50J1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0b29sYmFycyA9IFsndG9vbGJhckJ1dHRvbnMnLCAndG9vbGJhckJ1dHRvbnNNRCcsICd0b29sYmFyQnV0dG9uc1NNJywgJ3Rvb2xiYXJCdXR0b25zWFMnXTtcclxuICAgICAgICAgICAgdG9vbGJhcnMuZm9yRWFjaCh4ID0+IGNvbmZpZ1t4XSA9IGNvbmZpZ1t4XS5jb25jYXQoWydwYWdlQnJlYWsnXSkpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldEZvb3RlckNvbmZpZyhvcHRpb25zOiBhbnkpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgY29uZmlnID0gYW5ndWxhci5leHRlbmQoe30sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyVGV4dDogJ0Zvb3RlcidcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdG9vbGJhcnMgPSBbJ3Rvb2xiYXJCdXR0b25zJywgJ3Rvb2xiYXJCdXR0b25zTUQnLCAndG9vbGJhckJ1dHRvbnNTTScsICd0b29sYmFyQnV0dG9uc1hTJ107XHJcbiAgICAgICAgICAgIHRvb2xiYXJzLmZvckVhY2goeCA9PiBjb25maWdbeF0gPSBjb25maWdbeF0uY29uY2F0KFsnfCcsICdyZW1vdmVGb290ZXInXSkpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgX2h0bWw6IHN0cmluZztcclxuICAgICAgICBnZXQgaHRtbCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB2YXIgd3JpdGVyID0gbmV3IERvY3VtZW50V3JpdGVyKHRoaXMuaGVhZGVyLCB0aGlzLmNvbnRlbnQsIHRoaXMuZm9vdGVyKTtcclxuICAgICAgICAgICAgdmFyIG9wdGlvbnM6IElEb2N1bWVudFdyaXRlck9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICBleGNsdWRlSGVhZGVyOiAhdGhpcy53aXRoSGVhZGVyLFxyXG4gICAgICAgICAgICAgICAgZXhjbHVkZUZvb3RlcjogIXRoaXMud2l0aEZvb3RlclxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gd3JpdGVyLndyaXRlKG9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0IGh0bWwodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLl9odG1sID0gdmFsdWU7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5zZXRDb250ZW50KHZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc2V0Q29udGVudCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciBwYXJzZXIgPSBuZXcgRG9jdW1lbnRSZWFkZXIodmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmhlYWRlciA9IHBhcnNlci5nZXRIZWFkZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5jb250ZW50ID0gcGFyc2VyLmdldENvbnRlbnQoKTtcclxuICAgICAgICAgICAgdGhpcy5mb290ZXIgPSBwYXJzZXIuZ2V0Rm9vdGVyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBoZWFkZXJPcHRpb25zOiBhbnk7XHJcbiAgICAgICAgY29udGVudE9wdGlvbnM6IGFueTtcclxuICAgICAgICBmb290ZXJPcHRpb25zOiBhbnk7XHJcbiAgICAgICAgZGVmYXVsdE9wdGlvbnM6IGFueTtcclxuICAgICAgICBoZWFkZXJDb25maWc6IGFueTtcclxuICAgICAgICBjb250ZW50Q29uZmlnOiBhbnk7XHJcbiAgICAgICAgZm9vdGVyQ29uZmlnOiBhbnk7XHJcblxyXG4gICAgICAgIGluaXRpYWxpemVkOiBib29sZWFuO1xyXG4gICAgICAgIGhlYWRlcjogc3RyaW5nO1xyXG4gICAgICAgIGNvbnRlbnQ6IHN0cmluZztcclxuICAgICAgICBmb290ZXI6IHN0cmluZztcclxuICAgICAgICB3aXRoSGVhZGVyOiBib29sZWFuO1xyXG4gICAgICAgIHdpdGhGb290ZXI6IGJvb2xlYW47XHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3MgRG9jdW1lbnRFZGl0b3JEaXJlY3RpdmUge1xyXG4gICAgICAgIHN0YXRpYyAkaW5qZWN0ID0gWyckZG9jdW1lbnQnXTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSAkZG9jdW1lbnQ6IGFuZ3VsYXIuSURvY3VtZW50U2VydmljZSkge1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzdHJpY3QgPSAnRSc7XHJcbiAgICAgICAgdHJhbnNjbHVkZSA9IHRydWU7XHJcbiAgICAgICAgdGVtcGxhdGVVcmwgPSAnZG9jdW1lbnQtZWRpdG9yLmh0bWwnO1xyXG4gICAgICAgIGNvbnRyb2xsZXIgPSBEb2N1bWVudEVkaXRvckNvbnRyb2xsZXI7XHJcbiAgICAgICAgY29udHJvbGxlckFzID0gJ2RvY3VtZW50RWRpdG9yJztcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyID0gdHJ1ZTtcclxuICAgICAgICBzY29wZSA9IHtcclxuICAgICAgICAgICAgaGVhZGVyT3B0aW9uczogJz0/JyxcclxuICAgICAgICAgICAgYm9keU9wdGlvbnM6ICc9PycsXHJcbiAgICAgICAgICAgIGZvb3Rlck9wdGlvbnM6ICc9PycsXHJcbiAgICAgICAgICAgIGh0bWw6ICc9PydcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxpbmsgPSB7XHJcbiAgICAgICAgICAgIHByZTogKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJGN0cmw6IERvY3VtZW50RWRpdG9yQ29udHJvbGxlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyICRib2R5ID0gdGhpcy4kZG9jdW1lbnQuZmluZCgnYm9keScpO1xyXG4gICAgICAgICAgICAgICAgJGJvZHkuYXBwZW5kKCRlbGVtZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdG9vbGJhcklkID0gYGRvY3VtZW50LWVkaXRvci0keyRzY29wZS4kaWR9LXd5c2l3eWctdG9vbGJhcmA7XHJcbiAgICAgICAgICAgICAgICB2YXIgJHRvb2xiYXIgPSAkZWxlbWVudC5maW5kKFwiLmRvY3VtZW50LWVkaXRvci13eXNpd3lnLXRvb2xiYXJcIik7XHJcbiAgICAgICAgICAgICAgICAkdG9vbGJhci5wcm9wKCdpZCcsIHRvb2xiYXJJZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGVkaXRvcjogYW55ID0gJFsnRnJvYWxhRWRpdG9yJ107XHJcblxyXG4gICAgICAgICAgICAgICAgZWRpdG9yLkRlZmluZUljb24oJ3JlbW92ZUhlYWRlcicsIHsgTkFNRTogJ3RpbWVzLWNpcmNsZScgfSk7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3IuUmVnaXN0ZXJDb21tYW5kKCdyZW1vdmVIZWFkZXInLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdSZW1vdmUgSGVhZGVyJyxcclxuICAgICAgICAgICAgICAgICAgICB1bmRvOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvY3VzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlZnJlc2hBZnRlckNhbGxiYWNrOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoZWRpdG9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRjdHJsLndpdGhIZWFkZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGVkaXRvci5EZWZpbmVJY29uKCdyZW1vdmVGb290ZXInLCB7IE5BTUU6ICd0aW1lcy1jaXJjbGUnIH0pO1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yLlJlZ2lzdGVyQ29tbWFuZCgncmVtb3ZlRm9vdGVyJywge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUmVtb3ZlIEZvb3RlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgdW5kbzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBmb2N1czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICByZWZyZXNoQWZ0ZXJDYWxsYmFjazogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKGVkaXRvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkY3RybC53aXRoRm9vdGVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBlZGl0b3IuRGVmaW5lSWNvbigncGFnZUJyZWFrJywgeyBOQU1FOiAnY29sdW1ucycgfSk7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3IuUmVnaXN0ZXJDb21tYW5kKCdwYWdlQnJlYWsnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQYWdlIEJyZWFrJyxcclxuICAgICAgICAgICAgICAgICAgICB1bmRvOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvY3VzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlZnJlc2hBZnRlckNhbGxiYWNrOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbiAoZWRpdG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaHRtbC5pbnNlcnQoJzxociBjbGFzcz1cImZyLXBhZ2UtYnJlYWtcIj4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBQTFVHSU5TID0gJFsnRnJvYWxhRWRpdG9yJ10uUExVR0lOUztcclxuICAgICAgICAgICAgICAgIFBMVUdJTlMub3JkZXJlZExpc3RQbHVnaW4gPSAoZWRpdG9yKSA9PiBuZXcgT3JkZXJlZExpc3RQbHVnaW4oZWRpdG9yLCAkc2NvcGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBfZm9udFNpemUgPSBQTFVHSU5TLmZvbnRTaXplO1xyXG4gICAgICAgICAgICAgICAgUExVR0lOUy5mb250U2l6ZSA9IChlZGl0b3IpID0+IG5ldyBGb250U2l6ZVBsdWdpbihlZGl0b3IsIF9mb250U2l6ZShlZGl0b3IpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkY3RybC5vblByZUluaXQoZWRpdG9yLCB0b29sYmFySWQpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwb3N0OiAoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkY3RybDogRG9jdW1lbnRFZGl0b3JDb250cm9sbGVyKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyICRoZWFkZXI6IGFueSA9ICQoJy5kb2N1bWVudC1lZGl0b3ItaGVhZGVyJywgJGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgdmFyICRjb250ZW50OiBhbnkgPSAkKCcuZG9jdW1lbnQtZWRpdG9yLWNvbnRlbnQnLCAkZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgJGZvb3RlcjogYW55ID0gJCgnLmRvY3VtZW50LWVkaXRvci1mb290ZXInLCAkZWxlbWVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgJGhlYWRlci5mcm9hbGFFZGl0b3IoJ3Rvb2xiYXIuaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJGZvb3Rlci5mcm9hbGFFZGl0b3IoJ3Rvb2xiYXIuaGlkZScpO1xyXG5cclxuICAgICAgICAgICAgICAgICRoZWFkZXIub24oJ2Zyb2FsYUVkaXRvci5mb2N1cycsIChlLCBlZGl0b3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBlZGl0b3IudG9vbGJhci5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGNvbnRlbnQuZnJvYWxhRWRpdG9yKCd0b29sYmFyLmhpZGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAkZm9vdGVyLmZyb2FsYUVkaXRvcigndG9vbGJhci5oaWRlJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAkY29udGVudC5vbignZnJvYWxhRWRpdG9yLmZvY3VzJywgKGUsIGVkaXRvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICRoZWFkZXIuZnJvYWxhRWRpdG9yKCd0b29sYmFyLmhpZGUnKTtcclxuICAgICAgICAgICAgICAgICAgICBlZGl0b3IudG9vbGJhci5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGZvb3Rlci5mcm9hbGFFZGl0b3IoJ3Rvb2xiYXIuaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJGZvb3Rlci5vbignZnJvYWxhRWRpdG9yLmZvY3VzJywgKGUsIGVkaXRvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICRoZWFkZXIuZnJvYWxhRWRpdG9yKCd0b29sYmFyLmhpZGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAkY29udGVudC5mcm9hbGFFZGl0b3IoJ3Rvb2xiYXIuaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXRvci50b29sYmFyLnNob3coKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICRjdHJsLm9uSW5pdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgQW5ndWxhci5tb2R1bGUoXCJuZ0RvY3VtZW50XCIpLmRpcmVjdGl2ZShcImRvY3VtZW50RWRpdG9yXCIsIERvY3VtZW50RWRpdG9yRGlyZWN0aXZlKTtcclxufSIsIm1vZHVsZSBOZ0RvY3VtZW50IHtcclxuICAgIGRlY2xhcmUgdmFyIFBERkpTOiBhbnk7XHJcblxyXG4gICAgY2xhc3MgRG9jdW1lbnRQZGZDb250cm9sbGVyIHtcclxuXHJcbiAgICAgICAgb25Jbml0KHJlbmRlcikge1xyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXIgPSByZW5kZXI7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyKHRoaXMudXJsKTtcclxuICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfcmVuZGVyOiBhbnk7XHJcbiAgICAgICAgcmVuZGVyKHVybCkge1xyXG4gICAgICAgICAgICB0aGlzLmlzTG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlcih1cmwpLmZpbmFsbHkoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5pc0xvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdGlhbGl6ZWQ6IGJvb2xlYW47XHJcbiAgICAgICAgaXNMb2FkaW5nOiBib29sZWFuO1xyXG4gICAgICAgIGlzTG9hZGVkOiBib29sZWFuO1xyXG5cclxuICAgICAgICBwcml2YXRlIF91cmw6IHN0cmluZztcclxuICAgICAgICBnZXQgdXJsKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91cmw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNldCB1cmwodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLl91cmwgPSB2YWx1ZTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlcih2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIERvY3VtZW50UGRmRGlyZWN0aXZlIHtcclxuICAgICAgICBzdGF0aWMgJGluamVjdCA9IFsnJHEnXTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSAkcTogYW5ndWxhci5JUVNlcnZpY2UpIHtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXN0cmljdCA9ICdFJztcclxuICAgICAgICB0cmFuc2NsdWRlID0gdHJ1ZTtcclxuICAgICAgICB0ZW1wbGF0ZVVybCA9ICdkb2N1bWVudC1wZGYuaHRtbCc7XHJcbiAgICAgICAgY29udHJvbGxlciA9IERvY3VtZW50UGRmQ29udHJvbGxlcjtcclxuICAgICAgICBjb250cm9sbGVyQXMgPSAnZG9jdW1lbnRQZGYnO1xyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXIgPSB0cnVlO1xyXG4gICAgICAgIHNjb3BlID0ge1xyXG4gICAgICAgICAgICB1cmw6ICdAJyxcclxuICAgICAgICAgICAgaXNMb2FkZWQ6ICc9PydcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxpbmsgPSAoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkY3RybDogRG9jdW1lbnRQZGZDb250cm9sbGVyKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciAkcGFnZXMgPSAkZWxlbWVudC5maW5kKFwiLmRvY3VtZW50LXZpZXdlci1wYWdlc1wiKTtcclxuXHJcbiAgICAgICAgICAgICRjdHJsLm9uSW5pdCgodXJsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXIoJHNjb3BlLCAkcGFnZXMsIHVybCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVuZGVyKCRzY29wZSwgJHBhZ2VzLCB1cmwpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gdGhpcy4kcS5kZWZlcigpO1xyXG5cclxuICAgICAgICAgICAgJHBhZ2VzLmVtcHR5KCk7XHJcbiAgICAgICAgICAgIFBERkpTLmdldERvY3VtZW50KHVybCkudGhlbihwZGYgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB0YXNrcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaWR4ID0gMDsgaWR4IDwgcGRmLnBkZkluZm8ubnVtUGFnZXM7IGlkeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFza3MucHVzaChwZGYuZ2V0UGFnZShpZHggKyAxKS50aGVuKHBhZ2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVQYWdlKHBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLiRxLmFsbCh0YXNrcykudGhlbihjYW52YXNlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHBhZ2VzLmFwcGVuZChjYW52YXNlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShwZGYpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3JlYXRlUGFnZShwYWdlKSB7XHJcbiAgICAgICAgICAgIHZhciBzY2FsZSA9IDEuNTtcclxuICAgICAgICAgICAgdmFyIHZpZXdwb3J0ID0gcGFnZS5nZXRWaWV3cG9ydChzY2FsZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgJGNhbnZhcyA9ICQoJzxjYW52YXMgY2xhc3M9XCJkb2N1bWVudC12aWV3ZXItcGFnZVwiPjwvY2FudmFzPicpO1xyXG4gICAgICAgICAgICB2YXIgY2FudmFzOiBhbnkgPSAkY2FudmFzLmdldCgwKTtcclxuICAgICAgICAgICAgdmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IHZpZXdwb3J0LmhlaWdodDtcclxuICAgICAgICAgICAgY2FudmFzLndpZHRoID0gdmlld3BvcnQud2lkdGg7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmVuZGVyQ29udGV4dCA9IHtcclxuICAgICAgICAgICAgICAgIGNhbnZhc0NvbnRleHQ6IGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICB2aWV3cG9ydDogdmlld3BvcnRcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHBhZ2UucmVuZGVyKHJlbmRlckNvbnRleHQpO1xyXG4gICAgICAgICAgICByZXR1cm4gJGNhbnZhcztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQW5ndWxhci5tb2R1bGUoXCJuZ0RvY3VtZW50XCIpLmRpcmVjdGl2ZShcImRvY3VtZW50UGRmXCIsIERvY3VtZW50UGRmRGlyZWN0aXZlKTtcclxufSJdfQ==