Angular.module("ngDocument", ['froala']);
var NgDocument;
(function (NgDocument) {
    var DocumentEditorController = (function () {
        function DocumentEditorController() {
            this.header = this.header || '';
            this.content = this.content || '';
            this.footer = this.footer || '';
        }
        DocumentEditorController.prototype.onPreInit = function (editor) {
            var _this = this;
            this.defaultOptions = {
                iframe: true,
                enter: editor.ENTER_P,
                width: 816,
                zIndex: 100,
                toolbarContainer: "#" + this.toolbarId,
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
                iframeStyle: "body{font-family:'Source Serif Pro',serif;overflow:hidden;}",
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
        function DocumentEditorDirective() {
            var _this = this;
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
                    _this.initElement($element);
                    _this.initToolbar($ctrl, $scope, $element);
                    _this.initCommands(editor, $ctrl, $scope);
                    _this.initPlugins(editor.PLUGINS, $scope);
                    $ctrl.onPreInit(editor);
                },
                post: function ($scope, $element, $attrs, $ctrl) {
                    var $container = $element;
                    var $header = $container.find('.document-editor-header');
                    var $content = $container.find('.document-editor-content');
                    var $footer = $container.find('.document-editor-footer');
                    _this.initHeader($header, $content, $footer);
                    _this.initContent($header, $content, $footer);
                    _this.initFooter($header, $content, $footer);
                    $ctrl.onInit();
                }
            };
        }
        DocumentEditorDirective.prototype.initElement = function ($element) {
            var $parent = $element.parent();
            var $body = angular.element($element[0].ownerDocument.body);
            $body.append($element);
            $parent.on("$destroy", function () {
                $element.remove();
            });
        };
        DocumentEditorDirective.prototype.initToolbar = function ($ctrl, $scope, $element) {
            var toolbarId = "document-editor-" + $scope.$id + "-wysiwyg-toolbar";
            var $toolbar = $element.find(".document-editor-wysiwyg-toolbar");
            $toolbar.prop('id', toolbarId);
            $ctrl.toolbarId = toolbarId;
        };
        DocumentEditorDirective.prototype.initCommands = function (editor, $ctrl, $scope) {
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
        };
        DocumentEditorDirective.prototype.initPlugins = function (PLUGINS, $scope) {
            PLUGINS.orderedListPlugin = function (editor) { return new NgDocument.OrderedListPlugin(editor, $scope); };
            var _fontSize = PLUGINS.fontSize;
            PLUGINS.fontSize = function (editor) { return new NgDocument.FontSizePlugin(editor, _fontSize(editor)); };
        };
        DocumentEditorDirective.prototype.initHeader = function ($header, $content, $footer) {
            $header.froalaEditor('toolbar.hide');
            $header.on('froalaEditor.focus', function (e, editor) {
                editor.toolbar.show();
                $content.froalaEditor('toolbar.hide');
                $footer.froalaEditor('toolbar.hide');
            });
        };
        DocumentEditorDirective.prototype.initContent = function ($header, $content, $footer) {
            $content.on('froalaEditor.focus', function (e, editor) {
                $header.froalaEditor('toolbar.hide');
                editor.toolbar.show();
                $footer.froalaEditor('toolbar.hide');
            });
        };
        DocumentEditorDirective.prototype.initFooter = function ($header, $content, $footer) {
            $footer.froalaEditor('toolbar.hide');
            $footer.on('froalaEditor.focus', function (e, editor) {
                $header.froalaEditor('toolbar.hide');
                $content.froalaEditor('toolbar.hide');
                editor.toolbar.show();
            });
        };
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
                for (var idx = 0; idx < pdf.numPages; idx++) {
                    tasks.push(pdf.getPage(idx + 1).then(function (page) {
                        var x = page.pageNumber;
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
            var $canvas = angular.element('<canvas class="document-viewer-page"></canvas>');
            $canvas.attr("page", page.pageNumber);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1kb2N1bWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHAudHMiLCIuLi9zcmMvZG9jdW1lbnQtZWRpdG9yLnRzIiwiLi4vc3JjL2RvY3VtZW50LXBkZi50cyIsIi4uL3NyYy9kb2N1bWVudC1yZWFkZXIudHMiLCIuLi9zcmMvZG9jdW1lbnQtd3JpdGVyLnRzIiwiLi4vc3JjL2ZvbnQtc2l6ZS1wbHVnaW4udHMiLCIuLi9zcmMvb3JkZXJlZC1saXN0LXBsdWdpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUNBekMsSUFBTyxVQUFVLENBcVNoQjtBQXJTRCxXQUFPLFVBQVUsRUFBQyxDQUFDO0lBRWY7UUFDSTtZQUNJLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7WUFDaEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztZQUNsQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO1FBQ3BDLENBQUM7UUFFRCw0Q0FBUyxHQUFULFVBQVUsTUFBTTtZQUFoQixpQkE0REM7WUEzREcsSUFBSSxDQUFDLGNBQWMsR0FBRztnQkFDbEIsTUFBTSxFQUFFLElBQUk7Z0JBQ1osS0FBSyxFQUFFLE1BQU0sQ0FBQyxPQUFPO2dCQUNyQixLQUFLLEVBQUUsR0FBRztnQkFDVixNQUFNLEVBQUUsR0FBRztnQkFDWCxnQkFBZ0IsRUFBRSxNQUFJLElBQUksQ0FBQyxTQUFXO2dCQUN0QyxXQUFXLEVBQUU7b0JBQ1QsZUFBZSxFQUFFLFlBQVk7b0JBQzdCLG1CQUFtQixFQUFFLGdCQUFnQjtpQkFDeEM7Z0JBQ0QsVUFBVSxFQUFFO29CQUNSLDJCQUEyQixFQUFFLE9BQU87b0JBQ3BDLCtCQUErQixF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bGUoXCJuZ0RvY3VtZW50XCIsIFsnZnJvYWxhJ10pOyIsIm1vZHVsZSBOZ0RvY3VtZW50IHtcclxuXHJcbiAgICBjbGFzcyBEb2N1bWVudEVkaXRvckNvbnRyb2xsZXIge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICB0aGlzLmhlYWRlciA9IHRoaXMuaGVhZGVyIHx8ICcnO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLmNvbnRlbnQgfHwgJyc7XHJcbiAgICAgICAgICAgIHRoaXMuZm9vdGVyID0gdGhpcy5mb290ZXIgfHwgJyc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvblByZUluaXQoZWRpdG9yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICBpZnJhbWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBlbnRlcjogZWRpdG9yLkVOVEVSX1AsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogODE2LFxyXG4gICAgICAgICAgICAgICAgekluZGV4OiAxMDAsXHJcbiAgICAgICAgICAgICAgICB0b29sYmFyQ29udGFpbmVyOiBgIyR7dGhpcy50b29sYmFySWR9YCxcclxuICAgICAgICAgICAgICAgIHRhYmxlU3R5bGVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2ZyLW5vLWJvcmRlcnMnOiAnTm8gQm9yZGVycycsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2ZyLWFsdGVybmF0ZS1yb3dzJzogJ0FsdGVybmF0ZSBSb3dzJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIidTb3VyY2UgU2VyaWYgUHJvJywgc2VyaWZcIjogXCJTZXJpZlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiJ1NvdXJjZSBTYW5zIFBybycsIHNhbnMtc2VyaWZcIjogXCJTYW5zIFNlcmlmXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCInU291cmNlIENvZGUgUHJvJywgbW9ub3NwYWNlXCI6IFwiTW9ub3NwYWNlXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5RGVmYXVsdFNlbGVjdGlvbjogXCJTZXJpZlwiLFxyXG4gICAgICAgICAgICAgICAgZm9udEZhbWlseVNlbGVjdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplU2VsZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6IFtcIjhcIiwgXCI5XCIsIFwiMTBcIiwgXCIxMVwiLCBcIjEyXCIsIFwiMTRcIiwgXCIxNlwiLCBcIjE4XCIsIFwiMjRcIiwgXCIzMFwiLCBcIjM2XCIsIFwiNDhcIiwgXCI2MFwiLCBcIjcyXCIsIFwiOTZcIl0sXHJcbiAgICAgICAgICAgICAgICBpZnJhbWVTdHlsZTogXCJib2R5e2ZvbnQtZmFtaWx5OidTb3VyY2UgU2VyaWYgUHJvJyxzZXJpZjtvdmVyZmxvdzpoaWRkZW47fVwiLFxyXG4gICAgICAgICAgICAgICAgdG9vbGJhckJ1dHRvbnM6IFtcclxuICAgICAgICAgICAgICAgICAgICAnYm9sZCcsICdpdGFsaWMnLCAndW5kZXJsaW5lJywgJ3N0cmlrZVRocm91Z2gnLCAnc3Vic2NyaXB0JywgJ3N1cGVyc2NyaXB0JywgJ2ZvbnRGYW1pbHknLCAnZm9udFNpemUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbG9yJywgJ2lubGluZVN0eWxlJywgJ3BhcmFncmFwaFN0eWxlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyctJyxcclxuICAgICAgICAgICAgICAgICAgICAncGFyYWdyYXBoRm9ybWF0JywgJ2FsaWduJywgJ2Zvcm1hdE9MJywgJ2Zvcm1hdFVMJywgJ291dGRlbnQnLCAnaW5kZW50JywgJ3F1b3RlJywgJ3wnLFxyXG4gICAgICAgICAgICAgICAgICAgICdpbnNlcnRIUicsICdpbnNlcnRMaW5rJywgJ2luc2VydEltYWdlJywgJ2luc2VydFRhYmxlJywgJ3VuZG8nLCAncmVkbycsICdjbGVhckZvcm1hdHRpbmcnLCAnaHRtbCdcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICB0b29sYmFyQnV0dG9uc01EOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgJ2JvbGQnLCAnaXRhbGljJywgJ3VuZGVybGluZScsICdzdHJpa2VUaHJvdWdoJywgJ3N1YnNjcmlwdCcsICdzdXBlcnNjcmlwdCcsICdmb250RmFtaWx5JywgJ2ZvbnRTaXplJywgJ3wnLFxyXG4gICAgICAgICAgICAgICAgICAgICdjb2xvcicsICdpbmxpbmVTdHlsZScsICdwYXJhZ3JhcGhTdHlsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8nLScsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3BhcmFncmFwaEZvcm1hdCcsICdhbGlnbicsICdmb3JtYXRPTCcsICdmb3JtYXRVTCcsICdvdXRkZW50JywgJ2luZGVudCcsICdxdW90ZScsICd8JyxcclxuICAgICAgICAgICAgICAgICAgICAnaW5zZXJ0SFInLCAnaW5zZXJ0TGluaycsICdpbnNlcnRJbWFnZScsICdpbnNlcnRUYWJsZScsICd1bmRvJywgJ3JlZG8nLCAnY2xlYXJGb3JtYXR0aW5nJywgJ2h0bWwnXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgdG9vbGJhckJ1dHRvbnNTTTogW1xyXG4gICAgICAgICAgICAgICAgICAgICdib2xkJywgJ2l0YWxpYycsICd1bmRlcmxpbmUnLCAnc3RyaWtlVGhyb3VnaCcsICdzdWJzY3JpcHQnLCAnc3VwZXJzY3JpcHQnLCAnZm9udEZhbWlseScsICdmb250U2l6ZScsICd8JyxcclxuICAgICAgICAgICAgICAgICAgICAnY29sb3InLCAnaW5saW5lU3R5bGUnLCAncGFyYWdyYXBoU3R5bGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vJy0nLFxyXG4gICAgICAgICAgICAgICAgICAgICdwYXJhZ3JhcGhGb3JtYXQnLCAnYWxpZ24nLCAnZm9ybWF0T0wnLCAnZm9ybWF0VUwnLCAnb3V0ZGVudCcsICdpbmRlbnQnLCAncXVvdGUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2luc2VydEhSJywgJ2luc2VydExpbmsnLCAnaW5zZXJ0SW1hZ2UnLCAnaW5zZXJ0VGFibGUnLCAndW5kbycsICdyZWRvJywgJ2NsZWFyRm9ybWF0dGluZycsICdodG1sJ1xyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJCdXR0b25zWFM6IFtcclxuICAgICAgICAgICAgICAgICAgICAnYm9sZCcsICdpdGFsaWMnLCAndW5kZXJsaW5lJywgJ3N0cmlrZVRocm91Z2gnLCAnc3Vic2NyaXB0JywgJ3N1cGVyc2NyaXB0JywgJ2ZvbnRGYW1pbHknLCAnZm9udFNpemUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbG9yJywgJ2lubGluZVN0eWxlJywgJ3BhcmFncmFwaFN0eWxlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyctJyxcclxuICAgICAgICAgICAgICAgICAgICAncGFyYWdyYXBoRm9ybWF0JywgJ2FsaWduJywgJ2Zvcm1hdE9MJywgJ2Zvcm1hdFVMJywgJ291dGRlbnQnLCAnaW5kZW50JywgJ3F1b3RlJywgJ3wnLFxyXG4gICAgICAgICAgICAgICAgICAgICdpbnNlcnRIUicsICdpbnNlcnRMaW5rJywgJ2luc2VydEltYWdlJywgJ2luc2VydFRhYmxlJywgJ3VuZG8nLCAncmVkbycsICdjbGVhckZvcm1hdHRpbmcnLCAnaHRtbCdcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBldmVudHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnZnJvYWxhRWRpdG9yLmltYWdlLmJlZm9yZVVwbG9hZCc6IChlLCBlZGl0b3IsIGltYWdlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluc2VydEJhc2U2NEltYWdlKGVkaXRvciwgaW1hZ2VzWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuaGVhZGVyQ29uZmlnID0gdGhpcy5nZXRIZWFkZXJDb25maWcodGhpcy5oZWFkZXJPcHRpb25zIHx8IHt9KTtcclxuICAgICAgICAgICAgdGhpcy5jb250ZW50Q29uZmlnID0gdGhpcy5nZXRDb250ZW50Q29uZmlnKHRoaXMuY29udGVudE9wdGlvbnMgfHwge30pO1xyXG4gICAgICAgICAgICB0aGlzLmZvb3RlckNvbmZpZyA9IHRoaXMuZ2V0Rm9vdGVyQ29uZmlnKHRoaXMuZm9vdGVyT3B0aW9ucyB8fCB7fSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvbkluaXQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Q29udGVudCh0aGlzLl9odG1sKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGVhZGVyLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICB0aGlzLndpdGhIZWFkZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5mb290ZXIubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgIHRoaXMud2l0aEZvb3RlciA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBpbnNlcnRCYXNlNjRJbWFnZShlZGl0b3I6IGFueSwgaW1hZ2U6IEZpbGUpIHtcclxuICAgICAgICAgICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgICAgIHJlYWRlci5vbmxvYWQgPSAocmVhZGVyRXZ0OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIGVkaXRvci5pbWFnZS5pbnNlcnQocmVhZGVyRXZ0LnRhcmdldC5yZXN1bHQpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChpbWFnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRIZWFkZXJDb25maWcob3B0aW9uczogYW55KTogYW55IHtcclxuICAgICAgICAgICAgdmFyIGNvbmZpZyA9IGFuZ3VsYXIuZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlclRleHQ6ICdIZWFkZXInXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRvb2xiYXJzID0gWyd0b29sYmFyQnV0dG9ucycsICd0b29sYmFyQnV0dG9uc01EJywgJ3Rvb2xiYXJCdXR0b25zU00nLCAndG9vbGJhckJ1dHRvbnNYUyddO1xyXG4gICAgICAgICAgICB0b29sYmFycy5mb3JFYWNoKHggPT4gY29uZmlnW3hdID0gY29uZmlnW3hdLmNvbmNhdChbJ3wnLCAncmVtb3ZlSGVhZGVyJ10pKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjb25maWc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRDb250ZW50Q29uZmlnKG9wdGlvbnM6IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciBjb25maWcgPSBhbmd1bGFyLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucywge1xyXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXJUZXh0OiAnQ29udGVudCdcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdG9vbGJhcnMgPSBbJ3Rvb2xiYXJCdXR0b25zJywgJ3Rvb2xiYXJCdXR0b25zTUQnLCAndG9vbGJhckJ1dHRvbnNTTScsICd0b29sYmFyQnV0dG9uc1hTJ107XHJcbiAgICAgICAgICAgIHRvb2xiYXJzLmZvckVhY2goeCA9PiBjb25maWdbeF0gPSBjb25maWdbeF0uY29uY2F0KFsncGFnZUJyZWFrJ10pKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjb25maWc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRGb290ZXJDb25maWcob3B0aW9uczogYW55KTogYW55IHtcclxuICAgICAgICAgICAgdmFyIGNvbmZpZyA9IGFuZ3VsYXIuZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlclRleHQ6ICdGb290ZXInXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRvb2xiYXJzID0gWyd0b29sYmFyQnV0dG9ucycsICd0b29sYmFyQnV0dG9uc01EJywgJ3Rvb2xiYXJCdXR0b25zU00nLCAndG9vbGJhckJ1dHRvbnNYUyddO1xyXG4gICAgICAgICAgICB0b29sYmFycy5mb3JFYWNoKHggPT4gY29uZmlnW3hdID0gY29uZmlnW3hdLmNvbmNhdChbJ3wnLCAncmVtb3ZlRm9vdGVyJ10pKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjb25maWc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIF9odG1sOiBzdHJpbmc7XHJcbiAgICAgICAgZ2V0IGh0bWwoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIHdyaXRlciA9IG5ldyBEb2N1bWVudFdyaXRlcih0aGlzLmhlYWRlciwgdGhpcy5jb250ZW50LCB0aGlzLmZvb3Rlcik7XHJcbiAgICAgICAgICAgIHZhciBvcHRpb25zOiBJRG9jdW1lbnRXcml0ZXJPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgZXhjbHVkZUhlYWRlcjogIXRoaXMud2l0aEhlYWRlcixcclxuICAgICAgICAgICAgICAgIGV4Y2x1ZGVGb290ZXI6ICF0aGlzLndpdGhGb290ZXJcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHdyaXRlci53cml0ZShvcHRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldCBodG1sKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5faHRtbCA9IHZhbHVlO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Q29udGVudCh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHNldENvbnRlbnQodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgcGFyc2VyID0gbmV3IERvY3VtZW50UmVhZGVyKHZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5oZWFkZXIgPSBwYXJzZXIuZ2V0SGVhZGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudCA9IHBhcnNlci5nZXRDb250ZW50KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZm9vdGVyID0gcGFyc2VyLmdldEZvb3RlcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaGVhZGVyT3B0aW9uczogYW55O1xyXG4gICAgICAgIGNvbnRlbnRPcHRpb25zOiBhbnk7XHJcbiAgICAgICAgZm9vdGVyT3B0aW9uczogYW55O1xyXG4gICAgICAgIGRlZmF1bHRPcHRpb25zOiBhbnk7XHJcbiAgICAgICAgaGVhZGVyQ29uZmlnOiBhbnk7XHJcbiAgICAgICAgY29udGVudENvbmZpZzogYW55O1xyXG4gICAgICAgIGZvb3RlckNvbmZpZzogYW55O1xyXG5cclxuICAgICAgICBpbml0aWFsaXplZDogYm9vbGVhbjtcclxuICAgICAgICB0b29sYmFySWQ6IHN0cmluZztcclxuICAgICAgICBoZWFkZXI6IHN0cmluZztcclxuICAgICAgICBjb250ZW50OiBzdHJpbmc7XHJcbiAgICAgICAgZm9vdGVyOiBzdHJpbmc7XHJcbiAgICAgICAgd2l0aEhlYWRlcjogYm9vbGVhbjtcclxuICAgICAgICB3aXRoRm9vdGVyOiBib29sZWFuO1xyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIERvY3VtZW50RWRpdG9yRGlyZWN0aXZlIHtcclxuICAgICAgICByZXN0cmljdCA9ICdFJztcclxuICAgICAgICB0cmFuc2NsdWRlID0gdHJ1ZTtcclxuICAgICAgICB0ZW1wbGF0ZVVybCA9ICdkb2N1bWVudC1lZGl0b3IuaHRtbCc7XHJcbiAgICAgICAgY29udHJvbGxlciA9IERvY3VtZW50RWRpdG9yQ29udHJvbGxlcjtcclxuICAgICAgICBjb250cm9sbGVyQXMgPSAnZG9jdW1lbnRFZGl0b3InO1xyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXIgPSB0cnVlO1xyXG4gICAgICAgIHNjb3BlID0ge1xyXG4gICAgICAgICAgICBoZWFkZXJPcHRpb25zOiAnPT8nLFxyXG4gICAgICAgICAgICBib2R5T3B0aW9uczogJz0/JyxcclxuICAgICAgICAgICAgZm9vdGVyT3B0aW9uczogJz0/JyxcclxuICAgICAgICAgICAgaHRtbDogJz0/J1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGluayA9IHtcclxuICAgICAgICAgICAgcHJlOiAoJHNjb3BlOiBhbmd1bGFyLklTY29wZSwgJGVsZW1lbnQ6IGFuZ3VsYXIuSUF1Z21lbnRlZEpRdWVyeSwgJGF0dHJzOiBhbmd1bGFyLklBdHRyaWJ1dGVzLCAkY3RybDogRG9jdW1lbnRFZGl0b3JDb250cm9sbGVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZWRpdG9yOiBhbnkgPSAkWydGcm9hbGFFZGl0b3InXTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRFbGVtZW50KCRlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdFRvb2xiYXIoJGN0cmwsICRzY29wZSwgJGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbml0Q29tbWFuZHMoZWRpdG9yLCAkY3RybCwgJHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdFBsdWdpbnMoZWRpdG9yLlBMVUdJTlMsICRzY29wZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJGN0cmwub25QcmVJbml0KGVkaXRvcik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBvc3Q6ICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICRjdHJsOiBEb2N1bWVudEVkaXRvckNvbnRyb2xsZXIpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciAkY29udGFpbmVyID0gJGVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICB2YXIgJGhlYWRlcjogYW55ID0gJGNvbnRhaW5lci5maW5kKCcuZG9jdW1lbnQtZWRpdG9yLWhlYWRlcicpO1xyXG4gICAgICAgICAgICAgICAgdmFyICRjb250ZW50OiBhbnkgPSAkY29udGFpbmVyLmZpbmQoJy5kb2N1bWVudC1lZGl0b3ItY29udGVudCcpO1xyXG4gICAgICAgICAgICAgICAgdmFyICRmb290ZXI6IGFueSA9ICRjb250YWluZXIuZmluZCgnLmRvY3VtZW50LWVkaXRvci1mb290ZXInKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRIZWFkZXIoJGhlYWRlciwgJGNvbnRlbnQsICRmb290ZXIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbml0Q29udGVudCgkaGVhZGVyLCAkY29udGVudCwgJGZvb3Rlcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRGb290ZXIoJGhlYWRlciwgJGNvbnRlbnQsICRmb290ZXIpO1xyXG5cclxuICAgICAgICAgICAgICAgICRjdHJsLm9uSW5pdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkZG9jdW1lbnRFZGl0b3I6IGFuZ3VsYXIuSUF1Z21lbnRlZEpRdWVyeTtcclxuICAgICAgICBpbml0RWxlbWVudCgkZWxlbWVudDogYW5ndWxhci5JQXVnbWVudGVkSlF1ZXJ5KSB7XHJcbiAgICAgICAgICAgIHZhciAkcGFyZW50ID0gJGVsZW1lbnQucGFyZW50KCk7XHJcbiAgICAgICAgICAgIHZhciAkYm9keSA9IGFuZ3VsYXIuZWxlbWVudCgkZWxlbWVudFswXS5vd25lckRvY3VtZW50LmJvZHkpO1xyXG4gICAgICAgICAgICAkYm9keS5hcHBlbmQoJGVsZW1lbnQpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgJHBhcmVudC5vbihcIiRkZXN0cm95XCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICRlbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluaXRUb29sYmFyKCRjdHJsOiBEb2N1bWVudEVkaXRvckNvbnRyb2xsZXIsICRzY29wZTogYW5ndWxhci5JU2NvcGUsICRlbGVtZW50OiBhbmd1bGFyLklBdWdtZW50ZWRKUXVlcnkpIHtcclxuICAgICAgICAgICAgdmFyIHRvb2xiYXJJZCA9IGBkb2N1bWVudC1lZGl0b3ItJHskc2NvcGUuJGlkfS13eXNpd3lnLXRvb2xiYXJgO1xyXG4gICAgICAgICAgICB2YXIgJHRvb2xiYXIgPSAkZWxlbWVudC5maW5kKFwiLmRvY3VtZW50LWVkaXRvci13eXNpd3lnLXRvb2xiYXJcIik7XHJcbiAgICAgICAgICAgICR0b29sYmFyLnByb3AoJ2lkJywgdG9vbGJhcklkKTtcclxuICAgICAgICAgICAgJGN0cmwudG9vbGJhcklkID0gdG9vbGJhcklkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdENvbW1hbmRzKGVkaXRvciwgJGN0cmw6IERvY3VtZW50RWRpdG9yQ29udHJvbGxlciwgJHNjb3BlOiBhbmd1bGFyLklTY29wZSkge1xyXG4gICAgICAgICAgICBlZGl0b3IuRGVmaW5lSWNvbigncmVtb3ZlSGVhZGVyJywgeyBOQU1FOiAndGltZXMtY2lyY2xlJyB9KTtcclxuICAgICAgICAgICAgZWRpdG9yLlJlZ2lzdGVyQ29tbWFuZCgncmVtb3ZlSGVhZGVyJywge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdSZW1vdmUgSGVhZGVyJyxcclxuICAgICAgICAgICAgICAgIHVuZG86IHRydWUsXHJcbiAgICAgICAgICAgICAgICBmb2N1czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHJlZnJlc2hBZnRlckNhbGxiYWNrOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IChlZGl0b3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAkY3RybC53aXRoSGVhZGVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGVkaXRvci5EZWZpbmVJY29uKCdyZW1vdmVGb290ZXInLCB7IE5BTUU6ICd0aW1lcy1jaXJjbGUnIH0pO1xyXG4gICAgICAgICAgICBlZGl0b3IuUmVnaXN0ZXJDb21tYW5kKCdyZW1vdmVGb290ZXInLCB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1JlbW92ZSBGb290ZXInLFxyXG4gICAgICAgICAgICAgICAgdW5kbzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGZvY3VzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcmVmcmVzaEFmdGVyQ2FsbGJhY2s6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogKGVkaXRvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICRjdHJsLndpdGhGb290ZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZWRpdG9yLkRlZmluZUljb24oJ3BhZ2VCcmVhaycsIHsgTkFNRTogJ2NvbHVtbnMnIH0pO1xyXG4gICAgICAgICAgICBlZGl0b3IuUmVnaXN0ZXJDb21tYW5kKCdwYWdlQnJlYWsnLCB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1BhZ2UgQnJlYWsnLFxyXG4gICAgICAgICAgICAgICAgdW5kbzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGZvY3VzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcmVmcmVzaEFmdGVyQ2FsbGJhY2s6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24gKGVkaXRvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaHRtbC5pbnNlcnQoJzxociBjbGFzcz1cImZyLXBhZ2UtYnJlYWtcIj4nKTtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdFBsdWdpbnMoUExVR0lOUywgJHNjb3BlKSB7XHJcbiAgICAgICAgICAgIFBMVUdJTlMub3JkZXJlZExpc3RQbHVnaW4gPSAoZWRpdG9yKSA9PiBuZXcgT3JkZXJlZExpc3RQbHVnaW4oZWRpdG9yLCAkc2NvcGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIF9mb250U2l6ZSA9IFBMVUdJTlMuZm9udFNpemU7XHJcbiAgICAgICAgICAgIFBMVUdJTlMuZm9udFNpemUgPSAoZWRpdG9yKSA9PiBuZXcgRm9udFNpemVQbHVnaW4oZWRpdG9yLCBfZm9udFNpemUoZWRpdG9yKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0SGVhZGVyKCRoZWFkZXIsICRjb250ZW50LCAkZm9vdGVyKSB7XHJcbiAgICAgICAgICAgICRoZWFkZXIuZnJvYWxhRWRpdG9yKCd0b29sYmFyLmhpZGUnKTtcclxuICAgICAgICAgICAgJGhlYWRlci5vbignZnJvYWxhRWRpdG9yLmZvY3VzJywgKGUsIGVkaXRvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yLnRvb2xiYXIuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgJGNvbnRlbnQuZnJvYWxhRWRpdG9yKCd0b29sYmFyLmhpZGUnKTtcclxuICAgICAgICAgICAgICAgICRmb290ZXIuZnJvYWxhRWRpdG9yKCd0b29sYmFyLmhpZGUnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0Q29udGVudCgkaGVhZGVyLCAkY29udGVudCwgJGZvb3Rlcikge1xyXG4gICAgICAgICAgICAkY29udGVudC5vbignZnJvYWxhRWRpdG9yLmZvY3VzJywgKGUsIGVkaXRvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgJGhlYWRlci5mcm9hbGFFZGl0b3IoJ3Rvb2xiYXIuaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yLnRvb2xiYXIuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgJGZvb3Rlci5mcm9hbGFFZGl0b3IoJ3Rvb2xiYXIuaGlkZScpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluaXRGb290ZXIoJGhlYWRlciwgJGNvbnRlbnQsICRmb290ZXIpIHtcclxuICAgICAgICAgICAgJGZvb3Rlci5mcm9hbGFFZGl0b3IoJ3Rvb2xiYXIuaGlkZScpO1xyXG4gICAgICAgICAgICAkZm9vdGVyLm9uKCdmcm9hbGFFZGl0b3IuZm9jdXMnLCAoZSwgZWRpdG9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAkaGVhZGVyLmZyb2FsYUVkaXRvcigndG9vbGJhci5oaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkY29udGVudC5mcm9hbGFFZGl0b3IoJ3Rvb2xiYXIuaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yLnRvb2xiYXIuc2hvdygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIEFuZ3VsYXIubW9kdWxlKFwibmdEb2N1bWVudFwiKS5kaXJlY3RpdmUoXCJkb2N1bWVudEVkaXRvclwiLCBEb2N1bWVudEVkaXRvckRpcmVjdGl2ZSk7XHJcbn0iLCJtb2R1bGUgTmdEb2N1bWVudCB7XHJcbiAgICBjbGFzcyBEb2N1bWVudFBkZkNvbnRyb2xsZXIge1xyXG4gICAgICAgIG9uSW5pdChyZW5kZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyID0gcmVuZGVyO1xyXG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgX3JlbmRlcjogYW55O1xyXG4gICAgICAgIHJlbmRlcih1cmwpIHtcclxuICAgICAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXIodXJsKS5maW5hbGx5KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNMb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluaXRpYWxpemVkOiBib29sZWFuO1xyXG4gICAgICAgIGlzTG9hZGluZzogYm9vbGVhbjtcclxuICAgICAgICBpc0xvYWRlZDogYm9vbGVhbjtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfdXJsOiBzdHJpbmc7XHJcbiAgICAgICAgZ2V0IHVybCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdXJsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXQgdXJsKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5fdXJsID0gdmFsdWU7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXIodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBEb2N1bWVudFBkZkRpcmVjdGl2ZSB7XHJcbiAgICAgICAgc3RhdGljICRpbmplY3QgPSBbJyRxJ107XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgJHE6IGFuZ3VsYXIuSVFTZXJ2aWNlKSB7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzdHJpY3QgPSAnRSc7XHJcbiAgICAgICAgdHJhbnNjbHVkZSA9IHRydWU7XHJcbiAgICAgICAgdGVtcGxhdGVVcmwgPSAnZG9jdW1lbnQtcGRmLmh0bWwnO1xyXG4gICAgICAgIGNvbnRyb2xsZXIgPSBEb2N1bWVudFBkZkNvbnRyb2xsZXI7XHJcbiAgICAgICAgY29udHJvbGxlckFzID0gJ2RvY3VtZW50UGRmJztcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyID0gdHJ1ZTtcclxuICAgICAgICBzY29wZSA9IHtcclxuICAgICAgICAgICAgdXJsOiAnQCcsXHJcbiAgICAgICAgICAgIGlzTG9hZGVkOiAnPT8nXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsaW5rID0gKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJGN0cmw6IERvY3VtZW50UGRmQ29udHJvbGxlcikgPT4ge1xyXG4gICAgICAgICAgICB2YXIgJHBhZ2VzID0gJGVsZW1lbnQuZmluZChcIi5kb2N1bWVudC12aWV3ZXItcGFnZXNcIik7XHJcblxyXG4gICAgICAgICAgICAkY3RybC5vbkluaXQoKHVybCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyKCRzY29wZSwgJHBhZ2VzLCB1cmwpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlbmRlcigkc2NvcGUsICRwYWdlcywgdXJsKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9IHRoaXMuJHEuZGVmZXIoKTtcclxuXHJcbiAgICAgICAgICAgICRwYWdlcy5lbXB0eSgpO1xyXG4gICAgICAgICAgICBQREZKUy5nZXREb2N1bWVudCh1cmwpLnRoZW4ocGRmID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdGFza3MgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGlkeCA9IDA7IGlkeCA8IHBkZi5udW1QYWdlczsgaWR4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXNrcy5wdXNoKHBkZi5nZXRQYWdlKGlkeCArIDEpLnRoZW4ocGFnZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB4ID0gcGFnZS5wYWdlTnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVQYWdlKHBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLiRxLmFsbCh0YXNrcykudGhlbihjYW52YXNlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHBhZ2VzLmFwcGVuZChjYW52YXNlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShwZGYpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3JlYXRlUGFnZShwYWdlOiBQREZQYWdlUHJveHkpIHtcclxuICAgICAgICAgICAgdmFyIHNjYWxlID0gMS41O1xyXG4gICAgICAgICAgICB2YXIgdmlld3BvcnQgPSBwYWdlLmdldFZpZXdwb3J0KHNjYWxlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciAkY2FudmFzID0gYW5ndWxhci5lbGVtZW50KCc8Y2FudmFzIGNsYXNzPVwiZG9jdW1lbnQtdmlld2VyLXBhZ2VcIj48L2NhbnZhcz4nKTtcclxuICAgICAgICAgICAgJGNhbnZhcy5hdHRyKFwicGFnZVwiLCBwYWdlLnBhZ2VOdW1iZXIpO1xyXG4gICAgICAgICAgICB2YXIgY2FudmFzOiBhbnkgPSAkY2FudmFzLmdldCgwKTtcclxuICAgICAgICAgICAgdmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IHZpZXdwb3J0LmhlaWdodDtcclxuICAgICAgICAgICAgY2FudmFzLndpZHRoID0gdmlld3BvcnQud2lkdGg7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmVuZGVyQ29udGV4dCA9IHtcclxuICAgICAgICAgICAgICAgIGNhbnZhc0NvbnRleHQ6IGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICB2aWV3cG9ydDogdmlld3BvcnRcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHBhZ2UucmVuZGVyKHJlbmRlckNvbnRleHQpO1xyXG4gICAgICAgICAgICByZXR1cm4gJGNhbnZhcztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQW5ndWxhci5tb2R1bGUoXCJuZ0RvY3VtZW50XCIpLmRpcmVjdGl2ZShcImRvY3VtZW50UGRmXCIsIERvY3VtZW50UGRmRGlyZWN0aXZlKTtcclxufSIsIm1vZHVsZSBOZ0RvY3VtZW50IHtcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSURvY3VtZW50UmVhZGVyIHtcclxuICAgICAgICBnZXRIZWFkZXIoKTogc3RyaW5nO1xyXG4gICAgICAgIGdldENvbnRlbnQoKTogc3RyaW5nO1xyXG4gICAgICAgIGdldEZvb3RlcigpOiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIERvY3VtZW50UmVhZGVyIGltcGxlbWVudHMgSURvY3VtZW50UmVhZGVyIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihodG1sOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5fJGh0bWwgPSAkKCc8ZGl2PjwvZGl2PicpLmFwcGVuZChodG1sIHx8ICcnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgXyRodG1sOiBKUXVlcnk7XHJcblxyXG4gICAgICAgIGdldEhlYWRlcigpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZCgnaGVhZGVyJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRDb250ZW50KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIC8vIFRvRG86IGlmIDxjb250ZW50PjwvY29udGVudD4gZG9lcyBub3QgZXhpc3QgYnV0IHRoZXJlIGlzIGh0bWwsIHdyYXAgdGhlIGh0bWwgaW4gYSBjb250ZW50IHRhZ1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZCgnY29udGVudCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0Rm9vdGVyKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkKCdmb290ZXInKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgY2hpbGQoc2VsZWN0b3I6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl8kaHRtbC5jaGlsZHJlbihzZWxlY3RvcikuaHRtbCgpIHx8ICcnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIm1vZHVsZSBOZ0RvY3VtZW50IHtcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSURvY3VtZW50V3JpdGVyT3B0aW9ucyB7XHJcbiAgICAgICAgZXhjbHVkZUhlYWRlcjogYm9vbGVhbjtcclxuICAgICAgICBleGNsdWRlRm9vdGVyOiBib29sZWFuO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSURvY3VtZW50V3JpdGVyIHtcclxuICAgICAgICB3cml0ZSgpOiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIERvY3VtZW50V3JpdGVyIGltcGxlbWVudHMgSURvY3VtZW50V3JpdGVyIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihoZWFkZXI6IHN0cmluZywgY29udGVudDogc3RyaW5nLCBmb290ZXI6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLl9oZWFkZXIgPSBoZWFkZXI7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnRlbnQgPSBjb250ZW50O1xyXG4gICAgICAgICAgICB0aGlzLl9mb290ZXIgPSBmb290ZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgaGFzSGVhZGVyKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGVhZGVyICE9IG51bGwgJiYgdGhpcy5faGVhZGVyLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgaGFzRm9vdGVyKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9vdGVyICE9IG51bGwgJiYgdGhpcy5fZm9vdGVyLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB3cml0ZShvcHRpb25zPzogSURvY3VtZW50V3JpdGVyT3B0aW9ucyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHZhciBodG1sID0gW107XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNIZWFkZXIgJiYgIW9wdGlvbnMuZXhjbHVkZUhlYWRlcilcclxuICAgICAgICAgICAgICAgIGh0bWwucHVzaChgPGhlYWRlcj4ke3RoaXMuX2hlYWRlcn08L2hlYWRlcj5gKTtcclxuXHJcbiAgICAgICAgICAgIGh0bWwucHVzaChgPGNvbnRlbnQ+JHt0aGlzLl9jb250ZW50fTwvY29udGVudD5gKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc0Zvb3RlciAmJiAhb3B0aW9ucy5leGNsdWRlRm9vdGVyKVxyXG4gICAgICAgICAgICAgICAgaHRtbC5wdXNoKGA8Zm9vdGVyPiR7dGhpcy5fZm9vdGVyfTwvZm9vdGVyPmApO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGh0bWwuam9pbihcIlwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgX2hlYWRlcjogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgX2NvbnRlbnQ6IHN0cmluZztcclxuICAgICAgICBwcml2YXRlIF9mb290ZXI6IHN0cmluZztcclxuICAgIH1cclxufSIsIm1vZHVsZSBOZ0RvY3VtZW50IHtcclxuICAgIGV4cG9ydCBjbGFzcyBGb250U2l6ZVBsdWdpbiB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBlZGl0b3IsIHByaXZhdGUgZm9udFNpemUpIHtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFwcGx5KHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHZhciByYW5nZXMgPSB0aGlzLmVkaXRvci5zZWxlY3Rpb24ucmFuZ2VzKCksXHJcbiAgICAgICAgICAgICAgICBoYXNSYW5nZXMgPSByYW5nZXMuZmlsdGVyKCB4ID0+ICF4LmNvbGxhcHNlZCApLmxlbmd0aCA+IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAoaGFzUmFuZ2VzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvbnRTaXplLmFwcGx5KHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyICRzdGFydCA9ICQodGhpcy5lZGl0b3Iuc2VsZWN0aW9uLmVsZW1lbnQoKSksXHJcbiAgICAgICAgICAgICAgICAkbGlzdCA9ICRzdGFydC5wYXJlbnRzKFwib2wsIHVsXCIpLmZpcnN0KCksXHJcbiAgICAgICAgICAgICAgICBpc0xpc3QgPSAkbGlzdC5sZW5ndGggPiAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFpc0xpc3QpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAkbGlzdC5jc3MoXCJmb250LXNpemVcIiwgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVmcmVzaChhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZm9udFNpemUucmVmcmVzaChhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlZnJlc2hPblNob3coYSwgYikge1xyXG4gICAgICAgICAgICB0aGlzLmZvbnRTaXplLnJlZnJlc2hPblNob3coYSwgYik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwibW9kdWxlIE5nRG9jdW1lbnQge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBPcmRlcmVkTGlzdFBsdWdpbiB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBlZGl0b3IsIHByaXZhdGUgJHNjb3BlKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3JkZXJlZExpc3RUeXBlcyA9IHtcclxuICAgICAgICAgICAgICAgICdsaXN0VHlwZS1kZWNpbWFsJzogJ051bWJlcmVkJyxcclxuICAgICAgICAgICAgICAgICdsaXN0VHlwZS1sb3dlclJvbWFuJzogJ0xvd2VyIHJvbWFuJyxcclxuICAgICAgICAgICAgICAgICdsaXN0VHlwZS11cHBlclJvbWFuJzogJ1VwcGVyIHJvbWFuJyxcclxuICAgICAgICAgICAgICAgICdsaXN0VHlwZS1sb3dlckFscGhhJzogJ0xvd2VyIGFscGhhJyxcclxuICAgICAgICAgICAgICAgICdsaXN0VHlwZS11cHBlckFscGhhJzogJ1VwcGVyIGFscGhhJ1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmVkaXRvclN0YXRpYyA9ICRbJ0Zyb2FsYUVkaXRvciddO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5lZGl0b3JTdGF0aWMuUE9QVVBfVEVNUExBVEVTW09yZGVyZWRMaXN0UGx1Z2luLlRFTVBMQVRFX05BTUVdID0gJ1tfQlVUVE9OU19dJztcclxuXHJcbiAgICAgICAgICAgICQuZXh0ZW5kKHRoaXMuZWRpdG9yU3RhdGljLkRFRkFVTFRTLCB7XHJcbiAgICAgICAgICAgICAgICBvcmRlckxpc3RCdXR0b25zOiBbJ29yZGVyZWRMaXN0VHlwZSddXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZWRpdG9yLiRlbC5vbignY2xpY2snLCAnb2w+bGknLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93UG9wdXAoZS50YXJnZXQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluaXQoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLiRwb3B1cClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yU3RhdGljLkRlZmluZUljb24oJ29yZGVyZWRMaXN0VHlwZScsIHsgTkFNRTogJ2xpc3Qtb2wnIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmVkaXRvclN0YXRpYy5SZWdpc3RlckNvbW1hbmQoJ29yZGVyZWRMaXN0VHlwZScsIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnT3JkZXIgTGlzdCBUeXBlJyxcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdkcm9wZG93bicsXHJcbiAgICAgICAgICAgICAgICB1bmRvOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZm9jdXM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcmVmcmVzaEFmdGVyQ2FsbGJhY2s6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBvcHRpb25zOiB0aGlzLm9yZGVyZWRMaXN0VHlwZXMsXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogKGNtZCwgdmFsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdHlsZSh2YWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBidXR0b25zOiBzdHJpbmdbXSA9IFtcclxuICAgICAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiZnItYnV0dG9uc1wiPmAsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVkaXRvci5idXR0b24uYnVpbGRMaXN0KHRoaXMuZWRpdG9yLm9wdHMub3JkZXJMaXN0QnV0dG9ucyksXHJcbiAgICAgICAgICAgICAgICBgPC9kaXY+YFxyXG4gICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0ge1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uczogYnV0dG9ucy5qb2luKCcnKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLiRwb3B1cCA9IHRoaXMuZWRpdG9yLnBvcHVwcy5jcmVhdGUoT3JkZXJlZExpc3RQbHVnaW4uVEVNUExBVEVfTkFNRSwgdGVtcGxhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0U3R5bGUodmFsKSB7XHJcbiAgICAgICAgICAgIHZhciAkb2wgPSB0aGlzLiRsaS5wYXJlbnQoXCJvbFwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXModGhpcy5vcmRlcmVkTGlzdFR5cGVzKTtcclxuICAgICAgICAgICAgJG9sLnJlbW92ZUNsYXNzKGtleXMuam9pbignICcpKTtcclxuICAgICAgICAgICAgJG9sLmFkZENsYXNzKHZhbCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLiRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNob3dQb3B1cChsaSkge1xyXG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yLnBvcHVwcy5zZXRDb250YWluZXIoT3JkZXJlZExpc3RQbHVnaW4uVEVNUExBVEVfTkFNRSwgdGhpcy5lZGl0b3IuJHRiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLmVkaXRvci4kaWZyYW1lLm9mZnNldCgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kbGkgPSAkKGxpKTtcclxuXHJcbiAgICAgICAgICAgIHZhciByZWxPZmZzZXQgPSB0aGlzLiRsaS5vZmZzZXQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSB7XHJcbiAgICAgICAgICAgICAgICBsZWZ0OiByZWxPZmZzZXQubGVmdCArIHBhcmVudC5sZWZ0LFxyXG4gICAgICAgICAgICAgICAgdG9wOiByZWxPZmZzZXQudG9wICsgcGFyZW50LnRvcFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gdGhpcy4kbGkub3V0ZXJIZWlnaHQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBsZWZ0ID0gb2Zmc2V0LmxlZnQgKyAxMDtcclxuICAgICAgICAgICAgdmFyIHRvcCA9IG9mZnNldC50b3AgKyAyMDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yLnBvcHVwcy5zaG93KE9yZGVyZWRMaXN0UGx1Z2luLlRFTVBMQVRFX05BTUUsIGxlZnQsIHRvcCwgaGVpZ2h0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGhpZGVQb3B1cCgpIHtcclxuICAgICAgICAgICAgdGhpcy4kbGkgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLmVkaXRvci5wb3B1cHMuaGlkZShPcmRlcmVkTGlzdFBsdWdpbi5URU1QTEFURV9OQU1FKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgJHBvcHVwOiBhbnk7XHJcbiAgICAgICAgcHJpdmF0ZSBlZGl0b3JTdGF0aWM6IGFueTtcclxuICAgICAgICBwcml2YXRlICRsaTogYW55O1xyXG4gICAgICAgIHByaXZhdGUgb3JkZXJlZExpc3RUeXBlczogYW55O1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIFRFTVBMQVRFX05BTUUgPSAnb3JkZXJMaXN0UGx1Z2luLnBvcHVwJztcclxuICAgIH1cclxufSJdfQ==