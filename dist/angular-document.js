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
                toolbarContainer: "#" + this.toolbarId,
                tableStyles: {
                    'fr-no-borders': 'No Borders',
                    'fr-alternate-rows': 'Alternate Rows'
                },
                tableEditButtons: [].concat(editor.DEFAULTS.tableEditButtons, ["tableColWidth"]),
                tableCellStyles: {
                    'fr-no-borders': 'No Borders (ALL)',
                    'fr-no-left-border': 'No Left Border',
                    'fr-no-right-border': 'No Right Border',
                    'fr-no-top-border': 'No Top Border',
                    'fr-no-bottom-border': 'No Bottom Border',
                    'fr-border-thick': 'Thick Border',
                    'fr-border-dark': 'Dark Border'
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
            NgDocument.TableColWidthPlugin.register(PLUGINS);
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
var NgDocument;
(function (NgDocument) {
    var TableColWidthPlugin = (function () {
        function TableColWidthPlugin() {
        }
        TableColWidthPlugin.register = function (PLUGINS) {
            var plugin = new TableColWidthPlugin();
            PLUGINS.tableColWidth = function (editor) { return plugin.init(editor); };
            var editorStatic = $['FroalaEditor'];
            editorStatic.POPUP_TEMPLATES[TableColWidthPlugin.TEMPLATE_NAME] = '[_CUSTOM_LAYER_]';
            $.extend(editorStatic.DEFAULTS, {
                tableColWidth: ['tableColWidth']
            });
            editorStatic.DefineIcon('tableColWidth', { NAME: 'arrows-h' });
            editorStatic.RegisterCommand('tableColWidth', {
                title: 'Column Width',
                undo: true,
                focus: false,
                refreshAfterCallback: true,
                callback: function (cmd, val) {
                    plugin.showPopup(this, cmd);
                }
            });
        };
        TableColWidthPlugin.prototype.init = function (editor) {
            var _this = this;
            var customLayer = ["\n                <form class=\"fr-custom-layer\">\n                    <div class=\"fr-input-line\">\n                        <input type=\"text\" placeholder=\"Column Width\" value=\"\" tabindex=\"1\"><label>Column Width</label>\n                    </div>\n                    <div class=\"fr-action-buttons\">\n                        <button type=\"submit\" class=\"fr-command fr-submit\" tabindex=\"2\">Update</button>\n                    </div>\n                </div>\n            "];
            var template = {
                custom_layer: customLayer
            };
            var $popup = editor.popups.create(TableColWidthPlugin.TEMPLATE_NAME, template);
            var $form = $popup.find("form");
            var $input = $popup.find("input");
            var $update = $popup.find("button.fr-submit");
            $form.on('submit', function ($e) {
                $e.preventDefault();
                $e.stopPropagation();
                _this.setColWidth($input.val());
                _this.hidePopup(editor);
            });
            var submitOnEnter = function ($e) {
                if ($e['which'] != 13)
                    return;
                $form.submit();
            };
            $update.on('click', function () {
                $form.submit();
            }).on('keyup', submitOnEnter);
            $input.on('keyup', submitOnEnter);
        };
        TableColWidthPlugin.prototype.setColWidth = function (value) {
            if (!this.$col)
                return;
            var $row = this.$col.parent();
            var idx = $row.children().index(this.$col);
            var $table = $row.parents("table");
            var $tds = $table.find("tr > td:eq(" + idx + ")");
            var $ths = $table.find("tr > th:eq(" + idx + ")");
            $tds.css("width", value);
            $ths.css("width", value);
        };
        TableColWidthPlugin.prototype.showPopup = function (editor, cmd) {
            editor.popups.setContainer(TableColWidthPlugin.TEMPLATE_NAME, editor.$tb);
            this.$col = angular.element(editor.selection.get().focusNode);
            var parent = editor.$iframe.offset();
            var offset = this.$col.offset();
            var left = offset.left + (this.$col.outerWidth() / 2) + parent.left;
            var top = offset.top + this.$col.outerHeight() + parent.top;
            var height = this.$col.outerHeight();
            editor.popups.show(TableColWidthPlugin.TEMPLATE_NAME, left, top, height);
            var $popup = editor.popups.get(TableColWidthPlugin.TEMPLATE_NAME);
            var $input = $popup.find("input");
            var width = this.$col.get(0).style.width || this.$col.css("width");
            if (width)
                $input.addClass("fr-not-empty");
            $input.val(width);
            $input.focus();
        };
        TableColWidthPlugin.prototype.hidePopup = function (editor) {
            this.$col = null;
            editor.popups.hide(TableColWidthPlugin.TEMPLATE_NAME);
        };
        TableColWidthPlugin.TEMPLATE_NAME = 'tableColWidthPlugin.popup';
        return TableColWidthPlugin;
    }());
    NgDocument.TableColWidthPlugin = TableColWidthPlugin;
})(NgDocument || (NgDocument = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1kb2N1bWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHAudHMiLCIuLi9zcmMvZG9jdW1lbnQtZWRpdG9yLnRzIiwiLi4vc3JjL2RvY3VtZW50LXBkZi50cyIsIi4uL3NyYy9kb2N1bWVudC1yZWFkZXIudHMiLCIuLi9zcmMvZG9jdW1lbnQtd3JpdGVyLnRzIiwiLi4vc3JjL2ZvbnQtc2l6ZS1wbHVnaW4udHMiLCIuLi9zcmMvb3JkZXJlZC1saXN0LXBsdWdpbi50cyIsIi4uL3NyYy90YWJsZS1jb2wtd2lkdGgtcGx1Z2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQ0F6QyxJQUFPLFVBQVUsQ0FnVGhCO0FBaFRELFdBQU8sVUFBVSxFQUFDLENBQUM7SUFFZjtRQUNJO1lBQ0ksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztZQUNoQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1lBQ2xDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7UUFDcEMsQ0FBQztRQUVELDRDQUFTLEdBQVQsVUFBVSxNQUFNO1lBQWhCLGlCQXFFQztZQXBFRyxJQUFJLENBQUMsY0FBYyxHQUFHO2dCQUNsQixNQUFNLEVBQUUsSUFBSTtnQkFDWixLQUFLLEVBQUUsTUFBTSxDQUFDLE9BQU87Z0JBQ3JCLEtBQUssRUFBRSxHQUFHO2dCQUNWLGdCQUFnQixFQUFFLE1BQUksSUFBSSxDQUFDLFNBQVc7Z0JBQ3RDLFdBQVcsRUFBRTtvQkFDVCxlQUFlLEVBQUUsWUFBWTtvQkFDN0IsbUJBQW1CLEVBQUUsZ0JBQWdCO2lCQUN4QztnQkFDRCxnQkFBZ0IsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE1B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QUFDLEtBQUssQ0FBQyxDQUFDO1lBRWxCLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNuQixDQUFDO1FBRUQsdUNBQVMsR0FBVCxVQUFVLE1BQU07WUFDWixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNqQixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMxRCxDQUFDO1FBSWMsaUNBQWEsR0FBRywyQkFBMkIsQ0FBQztRQUMvRCwwQkFBQztJQUFELENBQUMsQUF2SEQsSUF1SEM7SUF2SFksOEJBQW1CLHNCQXVIL0IsQ0FBQTtBQUVMLENBQUMsRUEzSE0sVUFBVSxLQUFWLFVBQVUsUUEySGhCIiwic291cmNlc0NvbnRlbnQiOlsiQW5ndWxhci5tb2R1bGUoXCJuZ0RvY3VtZW50XCIsIFsnZnJvYWxhJ10pOyIsIm1vZHVsZSBOZ0RvY3VtZW50IHtcclxuXHJcbiAgICBjbGFzcyBEb2N1bWVudEVkaXRvckNvbnRyb2xsZXIge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICB0aGlzLmhlYWRlciA9IHRoaXMuaGVhZGVyIHx8ICcnO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLmNvbnRlbnQgfHwgJyc7XHJcbiAgICAgICAgICAgIHRoaXMuZm9vdGVyID0gdGhpcy5mb290ZXIgfHwgJyc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvblByZUluaXQoZWRpdG9yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICBpZnJhbWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBlbnRlcjogZWRpdG9yLkVOVEVSX1AsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogODE2LFxyXG4gICAgICAgICAgICAgICAgdG9vbGJhckNvbnRhaW5lcjogYCMke3RoaXMudG9vbGJhcklkfWAsXHJcbiAgICAgICAgICAgICAgICB0YWJsZVN0eWxlczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdmci1uby1ib3JkZXJzJzogJ05vIEJvcmRlcnMnLFxyXG4gICAgICAgICAgICAgICAgICAgICdmci1hbHRlcm5hdGUtcm93cyc6ICdBbHRlcm5hdGUgUm93cydcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB0YWJsZUVkaXRCdXR0b25zOiBbXS5jb25jYXQoZWRpdG9yLkRFRkFVTFRTLnRhYmxlRWRpdEJ1dHRvbnMsIFtcInRhYmxlQ29sV2lkdGhcIl0pLFxyXG4gICAgICAgICAgICAgICAgdGFibGVDZWxsU3R5bGVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2ZyLW5vLWJvcmRlcnMnOiAnTm8gQm9yZGVycyAoQUxMKScsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2ZyLW5vLWxlZnQtYm9yZGVyJzogJ05vIExlZnQgQm9yZGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAnZnItbm8tcmlnaHQtYm9yZGVyJzogJ05vIFJpZ2h0IEJvcmRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2ZyLW5vLXRvcC1ib3JkZXInOiAnTm8gVG9wIEJvcmRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2ZyLW5vLWJvdHRvbS1ib3JkZXInOiAnTm8gQm90dG9tIEJvcmRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2ZyLWJvcmRlci10aGljayc6ICdUaGljayBCb3JkZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICdmci1ib3JkZXItZGFyayc6ICdEYXJrIEJvcmRlcidcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCInU291cmNlIFNlcmlmIFBybycsIHNlcmlmXCI6IFwiU2VyaWZcIixcclxuICAgICAgICAgICAgICAgICAgICBcIidTb3VyY2UgU2FucyBQcm8nLCBzYW5zLXNlcmlmXCI6IFwiU2FucyBTZXJpZlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiJ1NvdXJjZSBDb2RlIFBybycsIG1vbm9zcGFjZVwiOiBcIk1vbm9zcGFjZVwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZm9udEZhbWlseURlZmF1bHRTZWxlY3Rpb246IFwiU2VyaWZcIixcclxuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHlTZWxlY3Rpb246IHRydWUsXHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZVNlbGVjdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiBbXCI4XCIsIFwiOVwiLCBcIjEwXCIsIFwiMTFcIiwgXCIxMlwiLCBcIjE0XCIsIFwiMTZcIiwgXCIxOFwiLCBcIjI0XCIsIFwiMzBcIiwgXCIzNlwiLCBcIjQ4XCIsIFwiNjBcIiwgXCI3MlwiLCBcIjk2XCJdLFxyXG4gICAgICAgICAgICAgICAgaWZyYW1lU3R5bGU6IFwiYm9keXtmb250LWZhbWlseTonU291cmNlIFNlcmlmIFBybycsc2VyaWY7b3ZlcmZsb3c6aGlkZGVuO31cIixcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJCdXR0b25zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgJ2JvbGQnLCAnaXRhbGljJywgJ3VuZGVybGluZScsICdzdHJpa2VUaHJvdWdoJywgJ3N1YnNjcmlwdCcsICdzdXBlcnNjcmlwdCcsICdmb250RmFtaWx5JywgJ2ZvbnRTaXplJywgJ3wnLFxyXG4gICAgICAgICAgICAgICAgICAgICdjb2xvcicsICdpbmxpbmVTdHlsZScsICdwYXJhZ3JhcGhTdHlsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8nLScsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3BhcmFncmFwaEZvcm1hdCcsICdhbGlnbicsICdmb3JtYXRPTCcsICdmb3JtYXRVTCcsICdvdXRkZW50JywgJ2luZGVudCcsICdxdW90ZScsICd8JyxcclxuICAgICAgICAgICAgICAgICAgICAnaW5zZXJ0SFInLCAnaW5zZXJ0TGluaycsICdpbnNlcnRJbWFnZScsICdpbnNlcnRUYWJsZScsICd1bmRvJywgJ3JlZG8nLCAnY2xlYXJGb3JtYXR0aW5nJywgJ2h0bWwnXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgdG9vbGJhckJ1dHRvbnNNRDogW1xyXG4gICAgICAgICAgICAgICAgICAgICdib2xkJywgJ2l0YWxpYycsICd1bmRlcmxpbmUnLCAnc3RyaWtlVGhyb3VnaCcsICdzdWJzY3JpcHQnLCAnc3VwZXJzY3JpcHQnLCAnZm9udEZhbWlseScsICdmb250U2l6ZScsICd8JyxcclxuICAgICAgICAgICAgICAgICAgICAnY29sb3InLCAnaW5saW5lU3R5bGUnLCAncGFyYWdyYXBoU3R5bGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vJy0nLFxyXG4gICAgICAgICAgICAgICAgICAgICdwYXJhZ3JhcGhGb3JtYXQnLCAnYWxpZ24nLCAnZm9ybWF0T0wnLCAnZm9ybWF0VUwnLCAnb3V0ZGVudCcsICdpbmRlbnQnLCAncXVvdGUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2luc2VydEhSJywgJ2luc2VydExpbmsnLCAnaW5zZXJ0SW1hZ2UnLCAnaW5zZXJ0VGFibGUnLCAndW5kbycsICdyZWRvJywgJ2NsZWFyRm9ybWF0dGluZycsICdodG1sJ1xyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJCdXR0b25zU006IFtcclxuICAgICAgICAgICAgICAgICAgICAnYm9sZCcsICdpdGFsaWMnLCAndW5kZXJsaW5lJywgJ3N0cmlrZVRocm91Z2gnLCAnc3Vic2NyaXB0JywgJ3N1cGVyc2NyaXB0JywgJ2ZvbnRGYW1pbHknLCAnZm9udFNpemUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbG9yJywgJ2lubGluZVN0eWxlJywgJ3BhcmFncmFwaFN0eWxlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyctJyxcclxuICAgICAgICAgICAgICAgICAgICAncGFyYWdyYXBoRm9ybWF0JywgJ2FsaWduJywgJ2Zvcm1hdE9MJywgJ2Zvcm1hdFVMJywgJ291dGRlbnQnLCAnaW5kZW50JywgJ3F1b3RlJywgJ3wnLFxyXG4gICAgICAgICAgICAgICAgICAgICdpbnNlcnRIUicsICdpbnNlcnRMaW5rJywgJ2luc2VydEltYWdlJywgJ2luc2VydFRhYmxlJywgJ3VuZG8nLCAncmVkbycsICdjbGVhckZvcm1hdHRpbmcnLCAnaHRtbCdcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICB0b29sYmFyQnV0dG9uc1hTOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgJ2JvbGQnLCAnaXRhbGljJywgJ3VuZGVybGluZScsICdzdHJpa2VUaHJvdWdoJywgJ3N1YnNjcmlwdCcsICdzdXBlcnNjcmlwdCcsICdmb250RmFtaWx5JywgJ2ZvbnRTaXplJywgJ3wnLFxyXG4gICAgICAgICAgICAgICAgICAgICdjb2xvcicsICdpbmxpbmVTdHlsZScsICdwYXJhZ3JhcGhTdHlsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8nLScsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3BhcmFncmFwaEZvcm1hdCcsICdhbGlnbicsICdmb3JtYXRPTCcsICdmb3JtYXRVTCcsICdvdXRkZW50JywgJ2luZGVudCcsICdxdW90ZScsICd8JyxcclxuICAgICAgICAgICAgICAgICAgICAnaW5zZXJ0SFInLCAnaW5zZXJ0TGluaycsICdpbnNlcnRJbWFnZScsICdpbnNlcnRUYWJsZScsICd1bmRvJywgJ3JlZG8nLCAnY2xlYXJGb3JtYXR0aW5nJywgJ2h0bWwnXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2Zyb2FsYUVkaXRvci5pbWFnZS5iZWZvcmVVcGxvYWQnOiAoZSwgZWRpdG9yLCBpbWFnZXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRCYXNlNjRJbWFnZShlZGl0b3IsIGltYWdlc1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB0aGlzLmhlYWRlckNvbmZpZyA9IHRoaXMuZ2V0SGVhZGVyQ29uZmlnKHRoaXMuaGVhZGVyT3B0aW9ucyB8fCB7fSk7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudENvbmZpZyA9IHRoaXMuZ2V0Q29udGVudENvbmZpZyh0aGlzLmNvbnRlbnRPcHRpb25zIHx8IHt9KTtcclxuICAgICAgICAgICAgdGhpcy5mb290ZXJDb25maWcgPSB0aGlzLmdldEZvb3RlckNvbmZpZyh0aGlzLmZvb3Rlck9wdGlvbnMgfHwge30pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb25Jbml0KCkge1xyXG4gICAgICAgICAgICB0aGlzLnNldENvbnRlbnQodGhpcy5faHRtbCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhlYWRlci5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy53aXRoSGVhZGVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZm9vdGVyLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICB0aGlzLndpdGhGb290ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgaW5zZXJ0QmFzZTY0SW1hZ2UoZWRpdG9yOiBhbnksIGltYWdlOiBGaWxlKSB7XHJcbiAgICAgICAgICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgICAgICByZWFkZXIub25sb2FkID0gKHJlYWRlckV2dDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3IuaW1hZ2UuaW5zZXJ0KHJlYWRlckV2dC50YXJnZXQucmVzdWx0KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoaW1hZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0SGVhZGVyQ29uZmlnKG9wdGlvbnM6IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciBjb25maWcgPSBhbmd1bGFyLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucywge1xyXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXJUZXh0OiAnSGVhZGVyJ1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0b29sYmFycyA9IFsndG9vbGJhckJ1dHRvbnMnLCAndG9vbGJhckJ1dHRvbnNNRCcsICd0b29sYmFyQnV0dG9uc1NNJywgJ3Rvb2xiYXJCdXR0b25zWFMnXTtcclxuICAgICAgICAgICAgdG9vbGJhcnMuZm9yRWFjaCh4ID0+IGNvbmZpZ1t4XSA9IGNvbmZpZ1t4XS5jb25jYXQoWyd8JywgJ3JlbW92ZUhlYWRlciddKSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY29uZmlnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0Q29udGVudENvbmZpZyhvcHRpb25zOiBhbnkpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgY29uZmlnID0gYW5ndWxhci5leHRlbmQoe30sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyVGV4dDogJ0NvbnRlbnQnXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRvb2xiYXJzID0gWyd0b29sYmFyQnV0dG9ucycsICd0b29sYmFyQnV0dG9uc01EJywgJ3Rvb2xiYXJCdXR0b25zU00nLCAndG9vbGJhckJ1dHRvbnNYUyddO1xyXG4gICAgICAgICAgICB0b29sYmFycy5mb3JFYWNoKHggPT4gY29uZmlnW3hdID0gY29uZmlnW3hdLmNvbmNhdChbJ3BhZ2VCcmVhayddKSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY29uZmlnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0Rm9vdGVyQ29uZmlnKG9wdGlvbnM6IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciBjb25maWcgPSBhbmd1bGFyLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucywge1xyXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXJUZXh0OiAnRm9vdGVyJ1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0b29sYmFycyA9IFsndG9vbGJhckJ1dHRvbnMnLCAndG9vbGJhckJ1dHRvbnNNRCcsICd0b29sYmFyQnV0dG9uc1NNJywgJ3Rvb2xiYXJCdXR0b25zWFMnXTtcclxuICAgICAgICAgICAgdG9vbGJhcnMuZm9yRWFjaCh4ID0+IGNvbmZpZ1t4XSA9IGNvbmZpZ1t4XS5jb25jYXQoWyd8JywgJ3JlbW92ZUZvb3RlciddKSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY29uZmlnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfaHRtbDogc3RyaW5nO1xyXG4gICAgICAgIGdldCBodG1sKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHZhciB3cml0ZXIgPSBuZXcgRG9jdW1lbnRXcml0ZXIodGhpcy5oZWFkZXIsIHRoaXMuY29udGVudCwgdGhpcy5mb290ZXIpO1xyXG4gICAgICAgICAgICB2YXIgb3B0aW9uczogSURvY3VtZW50V3JpdGVyT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIGV4Y2x1ZGVIZWFkZXI6ICF0aGlzLndpdGhIZWFkZXIsXHJcbiAgICAgICAgICAgICAgICBleGNsdWRlRm9vdGVyOiAhdGhpcy53aXRoRm9vdGVyXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiB3cml0ZXIud3JpdGUob3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXQgaHRtbCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2h0bWwgPSB2YWx1ZTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnNldENvbnRlbnQodmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzZXRDb250ZW50KHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIHBhcnNlciA9IG5ldyBEb2N1bWVudFJlYWRlcih2YWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuaGVhZGVyID0gcGFyc2VyLmdldEhlYWRlcigpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQgPSBwYXJzZXIuZ2V0Q29udGVudCgpO1xyXG4gICAgICAgICAgICB0aGlzLmZvb3RlciA9IHBhcnNlci5nZXRGb290ZXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGhlYWRlck9wdGlvbnM6IGFueTtcclxuICAgICAgICBjb250ZW50T3B0aW9uczogYW55O1xyXG4gICAgICAgIGZvb3Rlck9wdGlvbnM6IGFueTtcclxuICAgICAgICBkZWZhdWx0T3B0aW9uczogYW55O1xyXG4gICAgICAgIGhlYWRlckNvbmZpZzogYW55O1xyXG4gICAgICAgIGNvbnRlbnRDb25maWc6IGFueTtcclxuICAgICAgICBmb290ZXJDb25maWc6IGFueTtcclxuXHJcbiAgICAgICAgaW5pdGlhbGl6ZWQ6IGJvb2xlYW47XHJcbiAgICAgICAgdG9vbGJhcklkOiBzdHJpbmc7XHJcbiAgICAgICAgaGVhZGVyOiBzdHJpbmc7XHJcbiAgICAgICAgY29udGVudDogc3RyaW5nO1xyXG4gICAgICAgIGZvb3Rlcjogc3RyaW5nO1xyXG4gICAgICAgIHdpdGhIZWFkZXI6IGJvb2xlYW47XHJcbiAgICAgICAgd2l0aEZvb3RlcjogYm9vbGVhbjtcclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBEb2N1bWVudEVkaXRvckRpcmVjdGl2ZSB7XHJcbiAgICAgICAgcmVzdHJpY3QgPSAnRSc7XHJcbiAgICAgICAgdHJhbnNjbHVkZSA9IHRydWU7XHJcbiAgICAgICAgdGVtcGxhdGVVcmwgPSAnZG9jdW1lbnQtZWRpdG9yLmh0bWwnO1xyXG4gICAgICAgIGNvbnRyb2xsZXIgPSBEb2N1bWVudEVkaXRvckNvbnRyb2xsZXI7XHJcbiAgICAgICAgY29udHJvbGxlckFzID0gJ2RvY3VtZW50RWRpdG9yJztcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyID0gdHJ1ZTtcclxuICAgICAgICBzY29wZSA9IHtcclxuICAgICAgICAgICAgaGVhZGVyT3B0aW9uczogJz0/JyxcclxuICAgICAgICAgICAgYm9keU9wdGlvbnM6ICc9PycsXHJcbiAgICAgICAgICAgIGZvb3Rlck9wdGlvbnM6ICc9PycsXHJcbiAgICAgICAgICAgIGh0bWw6ICc9PydcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxpbmsgPSB7XHJcbiAgICAgICAgICAgIHByZTogKCRzY29wZTogYW5ndWxhci5JU2NvcGUsICRlbGVtZW50OiBhbmd1bGFyLklBdWdtZW50ZWRKUXVlcnksICRhdHRyczogYW5ndWxhci5JQXR0cmlidXRlcywgJGN0cmw6IERvY3VtZW50RWRpdG9yQ29udHJvbGxlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGVkaXRvcjogYW55ID0gJFsnRnJvYWxhRWRpdG9yJ107XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbml0RWxlbWVudCgkZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRUb29sYmFyKCRjdHJsLCAkc2NvcGUsICRlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdENvbW1hbmRzKGVkaXRvciwgJGN0cmwsICRzY29wZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRQbHVnaW5zKGVkaXRvci5QTFVHSU5TLCAkc2NvcGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICRjdHJsLm9uUHJlSW5pdChlZGl0b3IpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwb3N0OiAoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkY3RybDogRG9jdW1lbnRFZGl0b3JDb250cm9sbGVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgJGNvbnRhaW5lciA9ICRlbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgdmFyICRoZWFkZXI6IGFueSA9ICRjb250YWluZXIuZmluZCgnLmRvY3VtZW50LWVkaXRvci1oZWFkZXInKTtcclxuICAgICAgICAgICAgICAgIHZhciAkY29udGVudDogYW55ID0gJGNvbnRhaW5lci5maW5kKCcuZG9jdW1lbnQtZWRpdG9yLWNvbnRlbnQnKTtcclxuICAgICAgICAgICAgICAgIHZhciAkZm9vdGVyOiBhbnkgPSAkY29udGFpbmVyLmZpbmQoJy5kb2N1bWVudC1lZGl0b3ItZm9vdGVyJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbml0SGVhZGVyKCRoZWFkZXIsICRjb250ZW50LCAkZm9vdGVyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdENvbnRlbnQoJGhlYWRlciwgJGNvbnRlbnQsICRmb290ZXIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbml0Rm9vdGVyKCRoZWFkZXIsICRjb250ZW50LCAkZm9vdGVyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkY3RybC5vbkluaXQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJGRvY3VtZW50RWRpdG9yOiBhbmd1bGFyLklBdWdtZW50ZWRKUXVlcnk7XHJcbiAgICAgICAgaW5pdEVsZW1lbnQoJGVsZW1lbnQ6IGFuZ3VsYXIuSUF1Z21lbnRlZEpRdWVyeSkge1xyXG4gICAgICAgICAgICB2YXIgJHBhcmVudCA9ICRlbGVtZW50LnBhcmVudCgpO1xyXG4gICAgICAgICAgICB2YXIgJGJvZHkgPSBhbmd1bGFyLmVsZW1lbnQoJGVsZW1lbnRbMF0ub3duZXJEb2N1bWVudC5ib2R5KTtcclxuICAgICAgICAgICAgJGJvZHkuYXBwZW5kKCRlbGVtZW50KTtcclxuXHJcbiAgICAgICAgICAgICRwYXJlbnQub24oXCIkZGVzdHJveVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAkZWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0VG9vbGJhcigkY3RybDogRG9jdW1lbnRFZGl0b3JDb250cm9sbGVyLCAkc2NvcGU6IGFuZ3VsYXIuSVNjb3BlLCAkZWxlbWVudDogYW5ndWxhci5JQXVnbWVudGVkSlF1ZXJ5KSB7XHJcbiAgICAgICAgICAgIHZhciB0b29sYmFySWQgPSBgZG9jdW1lbnQtZWRpdG9yLSR7JHNjb3BlLiRpZH0td3lzaXd5Zy10b29sYmFyYDtcclxuICAgICAgICAgICAgdmFyICR0b29sYmFyID0gJGVsZW1lbnQuZmluZChcIi5kb2N1bWVudC1lZGl0b3Itd3lzaXd5Zy10b29sYmFyXCIpO1xyXG4gICAgICAgICAgICAkdG9vbGJhci5wcm9wKCdpZCcsIHRvb2xiYXJJZCk7XHJcbiAgICAgICAgICAgICRjdHJsLnRvb2xiYXJJZCA9IHRvb2xiYXJJZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluaXRDb21tYW5kcyhlZGl0b3IsICRjdHJsOiBEb2N1bWVudEVkaXRvckNvbnRyb2xsZXIsICRzY29wZTogYW5ndWxhci5JU2NvcGUpIHtcclxuICAgICAgICAgICAgZWRpdG9yLkRlZmluZUljb24oJ3JlbW92ZUhlYWRlcicsIHsgTkFNRTogJ3RpbWVzLWNpcmNsZScgfSk7XHJcbiAgICAgICAgICAgIGVkaXRvci5SZWdpc3RlckNvbW1hbmQoJ3JlbW92ZUhlYWRlcicsIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnUmVtb3ZlIEhlYWRlcicsXHJcbiAgICAgICAgICAgICAgICB1bmRvOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZm9jdXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICByZWZyZXNoQWZ0ZXJDYWxsYmFjazogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoZWRpdG9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGN0cmwud2l0aEhlYWRlciA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBlZGl0b3IuRGVmaW5lSWNvbigncmVtb3ZlRm9vdGVyJywgeyBOQU1FOiAndGltZXMtY2lyY2xlJyB9KTtcclxuICAgICAgICAgICAgZWRpdG9yLlJlZ2lzdGVyQ29tbWFuZCgncmVtb3ZlRm9vdGVyJywge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdSZW1vdmUgRm9vdGVyJyxcclxuICAgICAgICAgICAgICAgIHVuZG86IHRydWUsXHJcbiAgICAgICAgICAgICAgICBmb2N1czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHJlZnJlc2hBZnRlckNhbGxiYWNrOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IChlZGl0b3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAkY3RybC53aXRoRm9vdGVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGVkaXRvci5EZWZpbmVJY29uKCdwYWdlQnJlYWsnLCB7IE5BTUU6ICdjb2x1bW5zJyB9KTtcclxuICAgICAgICAgICAgZWRpdG9yLlJlZ2lzdGVyQ29tbWFuZCgncGFnZUJyZWFrJywge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdQYWdlIEJyZWFrJyxcclxuICAgICAgICAgICAgICAgIHVuZG86IHRydWUsXHJcbiAgICAgICAgICAgICAgICBmb2N1czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHJlZnJlc2hBZnRlckNhbGxiYWNrOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uIChlZGl0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmh0bWwuaW5zZXJ0KCc8aHIgY2xhc3M9XCJmci1wYWdlLWJyZWFrXCI+Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluaXRQbHVnaW5zKFBMVUdJTlMsICRzY29wZSkge1xyXG4gICAgICAgICAgICBQTFVHSU5TLm9yZGVyZWRMaXN0UGx1Z2luID0gKGVkaXRvcikgPT4gbmV3IE9yZGVyZWRMaXN0UGx1Z2luKGVkaXRvciwgJHNjb3BlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBfZm9udFNpemUgPSBQTFVHSU5TLmZvbnRTaXplO1xyXG4gICAgICAgICAgICBQTFVHSU5TLmZvbnRTaXplID0gKGVkaXRvcikgPT4gbmV3IEZvbnRTaXplUGx1Z2luKGVkaXRvciwgX2ZvbnRTaXplKGVkaXRvcikpO1xyXG5cclxuICAgICAgICAgICAgVGFibGVDb2xXaWR0aFBsdWdpbi5yZWdpc3RlcihQTFVHSU5TKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluaXRIZWFkZXIoJGhlYWRlciwgJGNvbnRlbnQsICRmb290ZXIpIHtcclxuICAgICAgICAgICAgJGhlYWRlci5mcm9hbGFFZGl0b3IoJ3Rvb2xiYXIuaGlkZScpO1xyXG4gICAgICAgICAgICAkaGVhZGVyLm9uKCdmcm9hbGFFZGl0b3IuZm9jdXMnLCAoZSwgZWRpdG9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3IudG9vbGJhci5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAkY29udGVudC5mcm9hbGFFZGl0b3IoJ3Rvb2xiYXIuaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJGZvb3Rlci5mcm9hbGFFZGl0b3IoJ3Rvb2xiYXIuaGlkZScpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluaXRDb250ZW50KCRoZWFkZXIsICRjb250ZW50LCAkZm9vdGVyKSB7XHJcbiAgICAgICAgICAgICRjb250ZW50Lm9uKCdmcm9hbGFFZGl0b3IuZm9jdXMnLCAoZSwgZWRpdG9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAkaGVhZGVyLmZyb2FsYUVkaXRvcigndG9vbGJhci5oaWRlJyk7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3IudG9vbGJhci5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAkZm9vdGVyLmZyb2FsYUVkaXRvcigndG9vbGJhci5oaWRlJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdEZvb3RlcigkaGVhZGVyLCAkY29udGVudCwgJGZvb3Rlcikge1xyXG4gICAgICAgICAgICAkZm9vdGVyLmZyb2FsYUVkaXRvcigndG9vbGJhci5oaWRlJyk7XHJcbiAgICAgICAgICAgICRmb290ZXIub24oJ2Zyb2FsYUVkaXRvci5mb2N1cycsIChlLCBlZGl0b3IpID0+IHtcclxuICAgICAgICAgICAgICAgICRoZWFkZXIuZnJvYWxhRWRpdG9yKCd0b29sYmFyLmhpZGUnKTtcclxuICAgICAgICAgICAgICAgICRjb250ZW50LmZyb2FsYUVkaXRvcigndG9vbGJhci5oaWRlJyk7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3IudG9vbGJhci5zaG93KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgQW5ndWxhci5tb2R1bGUoXCJuZ0RvY3VtZW50XCIpLmRpcmVjdGl2ZShcImRvY3VtZW50RWRpdG9yXCIsIERvY3VtZW50RWRpdG9yRGlyZWN0aXZlKTtcclxufSIsIm1vZHVsZSBOZ0RvY3VtZW50IHtcclxuICAgIGNsYXNzIERvY3VtZW50UGRmQ29udHJvbGxlciB7XHJcbiAgICAgICAgb25Jbml0KHJlbmRlcikge1xyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXIgPSByZW5kZXI7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfcmVuZGVyOiBhbnk7XHJcbiAgICAgICAgcmVuZGVyKHVybCkge1xyXG4gICAgICAgICAgICB0aGlzLmlzTG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlcih1cmwpLmZpbmFsbHkoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5pc0xvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdGlhbGl6ZWQ6IGJvb2xlYW47XHJcbiAgICAgICAgaXNMb2FkaW5nOiBib29sZWFuO1xyXG4gICAgICAgIGlzTG9hZGVkOiBib29sZWFuO1xyXG5cclxuICAgICAgICBwcml2YXRlIF91cmw6IHN0cmluZztcclxuICAgICAgICBnZXQgdXJsKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91cmw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNldCB1cmwodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLl91cmwgPSB2YWx1ZTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlcih2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIERvY3VtZW50UGRmRGlyZWN0aXZlIHtcclxuICAgICAgICBzdGF0aWMgJGluamVjdCA9IFsnJHEnXTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSAkcTogYW5ndWxhci5JUVNlcnZpY2UpIHtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXN0cmljdCA9ICdFJztcclxuICAgICAgICB0cmFuc2NsdWRlID0gdHJ1ZTtcclxuICAgICAgICB0ZW1wbGF0ZVVybCA9ICdkb2N1bWVudC1wZGYuaHRtbCc7XHJcbiAgICAgICAgY29udHJvbGxlciA9IERvY3VtZW50UGRmQ29udHJvbGxlcjtcclxuICAgICAgICBjb250cm9sbGVyQXMgPSAnZG9jdW1lbnRQZGYnO1xyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXIgPSB0cnVlO1xyXG4gICAgICAgIHNjb3BlID0ge1xyXG4gICAgICAgICAgICB1cmw6ICdAJyxcclxuICAgICAgICAgICAgaXNMb2FkZWQ6ICc9PydcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxpbmsgPSAoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkY3RybDogRG9jdW1lbnRQZGZDb250cm9sbGVyKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciAkcGFnZXMgPSAkZWxlbWVudC5maW5kKFwiLmRvY3VtZW50LXZpZXdlci1wYWdlc1wiKTtcclxuXHJcbiAgICAgICAgICAgICRjdHJsLm9uSW5pdCgodXJsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXIoJHNjb3BlLCAkcGFnZXMsIHVybCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVuZGVyKCRzY29wZSwgJHBhZ2VzLCB1cmwpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gdGhpcy4kcS5kZWZlcigpO1xyXG5cclxuICAgICAgICAgICAgJHBhZ2VzLmVtcHR5KCk7XHJcbiAgICAgICAgICAgIFBERkpTLmdldERvY3VtZW50KHVybCkudGhlbihwZGYgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB0YXNrcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaWR4ID0gMDsgaWR4IDwgcGRmLm51bVBhZ2VzOyBpZHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhc2tzLnB1c2gocGRmLmdldFBhZ2UoaWR4ICsgMSkudGhlbihwYWdlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHggPSBwYWdlLnBhZ2VOdW1iZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZVBhZ2UocGFnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuJHEuYWxsKHRhc2tzKS50aGVuKGNhbnZhc2VzID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAkcGFnZXMuYXBwZW5kKGNhbnZhc2VzKTtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHBkZik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjcmVhdGVQYWdlKHBhZ2U6IFBERlBhZ2VQcm94eSkge1xyXG4gICAgICAgICAgICB2YXIgc2NhbGUgPSAxLjU7XHJcbiAgICAgICAgICAgIHZhciB2aWV3cG9ydCA9IHBhZ2UuZ2V0Vmlld3BvcnQoc2NhbGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyICRjYW52YXMgPSBhbmd1bGFyLmVsZW1lbnQoJzxjYW52YXMgY2xhc3M9XCJkb2N1bWVudC12aWV3ZXItcGFnZVwiPjwvY2FudmFzPicpO1xyXG4gICAgICAgICAgICAkY2FudmFzLmF0dHIoXCJwYWdlXCIsIHBhZ2UucGFnZU51bWJlcik7XHJcbiAgICAgICAgICAgIHZhciBjYW52YXM6IGFueSA9ICRjYW52YXMuZ2V0KDApO1xyXG4gICAgICAgICAgICB2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gdmlld3BvcnQuaGVpZ2h0O1xyXG4gICAgICAgICAgICBjYW52YXMud2lkdGggPSB2aWV3cG9ydC53aWR0aDtcclxuXHJcbiAgICAgICAgICAgIHZhciByZW5kZXJDb250ZXh0ID0ge1xyXG4gICAgICAgICAgICAgICAgY2FudmFzQ29udGV4dDogY29udGV4dCxcclxuICAgICAgICAgICAgICAgIHZpZXdwb3J0OiB2aWV3cG9ydFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcGFnZS5yZW5kZXIocmVuZGVyQ29udGV4dCk7XHJcbiAgICAgICAgICAgIHJldHVybiAkY2FudmFzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBBbmd1bGFyLm1vZHVsZShcIm5nRG9jdW1lbnRcIikuZGlyZWN0aXZlKFwiZG9jdW1lbnRQZGZcIiwgRG9jdW1lbnRQZGZEaXJlY3RpdmUpO1xyXG59IiwibW9kdWxlIE5nRG9jdW1lbnQge1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJRG9jdW1lbnRSZWFkZXIge1xyXG4gICAgICAgIGdldEhlYWRlcigpOiBzdHJpbmc7XHJcbiAgICAgICAgZ2V0Q29udGVudCgpOiBzdHJpbmc7XHJcbiAgICAgICAgZ2V0Rm9vdGVyKCk6IHN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgRG9jdW1lbnRSZWFkZXIgaW1wbGVtZW50cyBJRG9jdW1lbnRSZWFkZXIge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKGh0bWw6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLl8kaHRtbCA9ICQoJzxkaXY+PC9kaXY+JykuYXBwZW5kKGh0bWwgfHwgJycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfJGh0bWw6IEpRdWVyeTtcclxuXHJcbiAgICAgICAgZ2V0SGVhZGVyKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkKCdoZWFkZXInKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldENvbnRlbnQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgLy8gVG9EbzogaWYgPGNvbnRlbnQ+PC9jb250ZW50PiBkb2VzIG5vdCBleGlzdCBidXQgdGhlcmUgaXMgaHRtbCwgd3JhcCB0aGUgaHRtbCBpbiBhIGNvbnRlbnQgdGFnXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkKCdjb250ZW50Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRGb290ZXIoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGQoJ2Zvb3RlcicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBjaGlsZChzZWxlY3Rvcjogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuXyRodG1sLmNoaWxkcmVuKHNlbGVjdG9yKS5odG1sKCkgfHwgJyc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwibW9kdWxlIE5nRG9jdW1lbnQge1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJRG9jdW1lbnRXcml0ZXJPcHRpb25zIHtcclxuICAgICAgICBleGNsdWRlSGVhZGVyOiBib29sZWFuO1xyXG4gICAgICAgIGV4Y2x1ZGVGb290ZXI6IGJvb2xlYW47XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJRG9jdW1lbnRXcml0ZXIge1xyXG4gICAgICAgIHdyaXRlKCk6IHN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgRG9jdW1lbnRXcml0ZXIgaW1wbGVtZW50cyBJRG9jdW1lbnRXcml0ZXIge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKGhlYWRlcjogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcsIGZvb3Rlcjogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2hlYWRlciA9IGhlYWRlcjtcclxuICAgICAgICAgICAgdGhpcy5fY29udGVudCA9IGNvbnRlbnQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2Zvb3RlciA9IGZvb3RlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBoYXNIZWFkZXIoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9oZWFkZXIgIT0gbnVsbCAmJiB0aGlzLl9oZWFkZXIubGVuZ3RoID4gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBoYXNGb290ZXIoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb290ZXIgIT0gbnVsbCAmJiB0aGlzLl9mb290ZXIubGVuZ3RoID4gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHdyaXRlKG9wdGlvbnM/OiBJRG9jdW1lbnRXcml0ZXJPcHRpb25zKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIGh0bWwgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc0hlYWRlciAmJiAhb3B0aW9ucy5leGNsdWRlSGVhZGVyKVxyXG4gICAgICAgICAgICAgICAgaHRtbC5wdXNoKGA8aGVhZGVyPiR7dGhpcy5faGVhZGVyfTwvaGVhZGVyPmApO1xyXG5cclxuICAgICAgICAgICAgaHRtbC5wdXNoKGA8Y29udGVudD4ke3RoaXMuX2NvbnRlbnR9PC9jb250ZW50PmApO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzRm9vdGVyICYmICFvcHRpb25zLmV4Y2x1ZGVGb290ZXIpXHJcbiAgICAgICAgICAgICAgICBodG1sLnB1c2goYDxmb290ZXI+JHt0aGlzLl9mb290ZXJ9PC9mb290ZXI+YCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaHRtbC5qb2luKFwiXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfaGVhZGVyOiBzdHJpbmc7XHJcbiAgICAgICAgcHJpdmF0ZSBfY29udGVudDogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgX2Zvb3Rlcjogc3RyaW5nO1xyXG4gICAgfVxyXG59IiwibW9kdWxlIE5nRG9jdW1lbnQge1xyXG4gICAgZXhwb3J0IGNsYXNzIEZvbnRTaXplUGx1Z2luIHtcclxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVkaXRvciwgcHJpdmF0ZSBmb250U2l6ZSkge1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXBwbHkodmFsdWUpIHtcclxuICAgICAgICAgICAgdmFyIHJhbmdlcyA9IHRoaXMuZWRpdG9yLnNlbGVjdGlvbi5yYW5nZXMoKSxcclxuICAgICAgICAgICAgICAgIGhhc1JhbmdlcyA9IHJhbmdlcy5maWx0ZXIoIHggPT4gIXguY29sbGFwc2VkICkubGVuZ3RoID4gMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChoYXNSYW5nZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9udFNpemUuYXBwbHkodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgJHN0YXJ0ID0gJCh0aGlzLmVkaXRvci5zZWxlY3Rpb24uZWxlbWVudCgpKSxcclxuICAgICAgICAgICAgICAgICRsaXN0ID0gJHN0YXJ0LnBhcmVudHMoXCJvbCwgdWxcIikuZmlyc3QoKSxcclxuICAgICAgICAgICAgICAgIGlzTGlzdCA9ICRsaXN0Lmxlbmd0aCA+IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWlzTGlzdClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICRsaXN0LmNzcyhcImZvbnQtc2l6ZVwiLCB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZWZyZXNoKGEpIHtcclxuICAgICAgICAgICAgdGhpcy5mb250U2l6ZS5yZWZyZXNoKGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVmcmVzaE9uU2hvdyhhLCBiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZm9udFNpemUucmVmcmVzaE9uU2hvdyhhLCBiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJtb2R1bGUgTmdEb2N1bWVudCB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIE9yZGVyZWRMaXN0UGx1Z2luIHtcclxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVkaXRvciwgcHJpdmF0ZSAkc2NvcGUpIHtcclxuICAgICAgICAgICAgdGhpcy5vcmRlcmVkTGlzdFR5cGVzID0ge1xyXG4gICAgICAgICAgICAgICAgJ2xpc3RUeXBlLWRlY2ltYWwnOiAnTnVtYmVyZWQnLFxyXG4gICAgICAgICAgICAgICAgJ2xpc3RUeXBlLWxvd2VyUm9tYW4nOiAnTG93ZXIgcm9tYW4nLFxyXG4gICAgICAgICAgICAgICAgJ2xpc3RUeXBlLXVwcGVyUm9tYW4nOiAnVXBwZXIgcm9tYW4nLFxyXG4gICAgICAgICAgICAgICAgJ2xpc3RUeXBlLWxvd2VyQWxwaGEnOiAnTG93ZXIgYWxwaGEnLFxyXG4gICAgICAgICAgICAgICAgJ2xpc3RUeXBlLXVwcGVyQWxwaGEnOiAnVXBwZXIgYWxwaGEnXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yU3RhdGljID0gJFsnRnJvYWxhRWRpdG9yJ107XHJcblxyXG4gICAgICAgICAgICB0aGlzLmVkaXRvclN0YXRpYy5QT1BVUF9URU1QTEFURVNbT3JkZXJlZExpc3RQbHVnaW4uVEVNUExBVEVfTkFNRV0gPSAnW19CVVRUT05TX10nO1xyXG5cclxuICAgICAgICAgICAgJC5leHRlbmQodGhpcy5lZGl0b3JTdGF0aWMuREVGQVVMVFMsIHtcclxuICAgICAgICAgICAgICAgIG9yZGVyTGlzdEJ1dHRvbnM6IFsnb3JkZXJlZExpc3RUeXBlJ11cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBlZGl0b3IuJGVsLm9uKCdjbGljaycsICdvbD5saScsIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dQb3B1cChlLnRhcmdldCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdCgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuJHBvcHVwKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5lZGl0b3JTdGF0aWMuRGVmaW5lSWNvbignb3JkZXJlZExpc3RUeXBlJywgeyBOQU1FOiAnbGlzdC1vbCcgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yU3RhdGljLlJlZ2lzdGVyQ29tbWFuZCgnb3JkZXJlZExpc3RUeXBlJywge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdPcmRlciBMaXN0IFR5cGUnLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Ryb3Bkb3duJyxcclxuICAgICAgICAgICAgICAgIHVuZG86IHRydWUsXHJcbiAgICAgICAgICAgICAgICBmb2N1czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICByZWZyZXNoQWZ0ZXJDYWxsYmFjazogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IHRoaXMub3JkZXJlZExpc3RUeXBlcyxcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoY21kLCB2YWwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0eWxlKHZhbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdmFyIGJ1dHRvbnM6IHN0cmluZ1tdID0gW1xyXG4gICAgICAgICAgICAgICAgYDxkaXYgY2xhc3M9XCJmci1idXR0b25zXCI+YCxcclxuICAgICAgICAgICAgICAgIHRoaXMuZWRpdG9yLmJ1dHRvbi5idWlsZExpc3QodGhpcy5lZGl0b3Iub3B0cy5vcmRlckxpc3RCdXR0b25zKSxcclxuICAgICAgICAgICAgICAgIGA8L2Rpdj5gXHJcbiAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICB2YXIgdGVtcGxhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiBidXR0b25zLmpvaW4oJycpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuJHBvcHVwID0gdGhpcy5lZGl0b3IucG9wdXBzLmNyZWF0ZShPcmRlcmVkTGlzdFBsdWdpbi5URU1QTEFURV9OQU1FLCB0ZW1wbGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXRTdHlsZSh2YWwpIHtcclxuICAgICAgICAgICAgdmFyICRvbCA9IHRoaXMuJGxpLnBhcmVudChcIm9sXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh0aGlzLm9yZGVyZWRMaXN0VHlwZXMpO1xyXG4gICAgICAgICAgICAkb2wucmVtb3ZlQ2xhc3Moa2V5cy5qb2luKCcgJykpO1xyXG4gICAgICAgICAgICAkb2wuYWRkQ2xhc3ModmFsKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2hvd1BvcHVwKGxpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5lZGl0b3IucG9wdXBzLnNldENvbnRhaW5lcihPcmRlcmVkTGlzdFBsdWdpbi5URU1QTEFURV9OQU1FLCB0aGlzLmVkaXRvci4kdGIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHBhcmVudCA9IHRoaXMuZWRpdG9yLiRpZnJhbWUub2Zmc2V0KCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLiRsaSA9ICQobGkpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJlbE9mZnNldCA9IHRoaXMuJGxpLm9mZnNldCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHtcclxuICAgICAgICAgICAgICAgIGxlZnQ6IHJlbE9mZnNldC5sZWZ0ICsgcGFyZW50LmxlZnQsXHJcbiAgICAgICAgICAgICAgICB0b3A6IHJlbE9mZnNldC50b3AgKyBwYXJlbnQudG9wXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSB0aGlzLiRsaS5vdXRlckhlaWdodCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGxlZnQgPSBvZmZzZXQubGVmdCArIDEwO1xyXG4gICAgICAgICAgICB2YXIgdG9wID0gb2Zmc2V0LnRvcCArIDIwO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5lZGl0b3IucG9wdXBzLnNob3coT3JkZXJlZExpc3RQbHVnaW4uVEVNUExBVEVfTkFNRSwgbGVmdCwgdG9wLCBoZWlnaHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaGlkZVBvcHVwKCkge1xyXG4gICAgICAgICAgICB0aGlzLiRsaSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yLnBvcHVwcy5oaWRlKE9yZGVyZWRMaXN0UGx1Z2luLlRFTVBMQVRFX05BTUUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSAkcG9wdXA6IGFueTtcclxuICAgICAgICBwcml2YXRlIGVkaXRvclN0YXRpYzogYW55O1xyXG4gICAgICAgIHByaXZhdGUgJGxpOiBhbnk7XHJcbiAgICAgICAgcHJpdmF0ZSBvcmRlcmVkTGlzdFR5cGVzOiBhbnk7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgVEVNUExBVEVfTkFNRSA9ICdvcmRlckxpc3RQbHVnaW4ucG9wdXAnO1xyXG4gICAgfVxyXG59IiwibW9kdWxlIE5nRG9jdW1lbnQge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBUYWJsZUNvbFdpZHRoUGx1Z2luIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgcmVnaXN0ZXIoUExVR0lOUykge1xyXG5cclxuICAgICAgICAgICAgdmFyIHBsdWdpbiA9IG5ldyBUYWJsZUNvbFdpZHRoUGx1Z2luKCk7XHJcbiAgICAgICAgICAgIFBMVUdJTlMudGFibGVDb2xXaWR0aCA9IChlZGl0b3IpID0+IHBsdWdpbi5pbml0KGVkaXRvcik7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWRpdG9yU3RhdGljID0gJFsnRnJvYWxhRWRpdG9yJ107XHJcblxyXG4gICAgICAgICAgICBlZGl0b3JTdGF0aWMuUE9QVVBfVEVNUExBVEVTW1RhYmxlQ29sV2lkdGhQbHVnaW4uVEVNUExBVEVfTkFNRV0gPSAnW19DVVNUT01fTEFZRVJfXSc7XHJcblxyXG4gICAgICAgICAgICAkLmV4dGVuZChlZGl0b3JTdGF0aWMuREVGQVVMVFMsIHtcclxuICAgICAgICAgICAgICAgIHRhYmxlQ29sV2lkdGg6IFsndGFibGVDb2xXaWR0aCddXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZWRpdG9yU3RhdGljLkRlZmluZUljb24oJ3RhYmxlQ29sV2lkdGgnLCB7IE5BTUU6ICdhcnJvd3MtaCcgfSk7XHJcbiAgICAgICAgICAgIGVkaXRvclN0YXRpYy5SZWdpc3RlckNvbW1hbmQoJ3RhYmxlQ29sV2lkdGgnLCB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0NvbHVtbiBXaWR0aCcsXHJcbiAgICAgICAgICAgICAgICB1bmRvOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZm9jdXM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcmVmcmVzaEFmdGVyQ2FsbGJhY2s6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24gKGNtZCwgdmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGx1Z2luLnNob3dQb3B1cCh0aGlzLCBjbWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluaXQoZWRpdG9yKSB7XHJcbiAgICAgICAgICAgIHZhciBjdXN0b21MYXllcjogc3RyaW5nW10gPSBbYFxyXG4gICAgICAgICAgICAgICAgPGZvcm0gY2xhc3M9XCJmci1jdXN0b20tbGF5ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZnItaW5wdXQtbGluZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIkNvbHVtbiBXaWR0aFwiIHZhbHVlPVwiXCIgdGFiaW5kZXg9XCIxXCI+PGxhYmVsPkNvbHVtbiBXaWR0aDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZyLWFjdGlvbi1idXR0b25zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiZnItY29tbWFuZCBmci1zdWJtaXRcIiB0YWJpbmRleD1cIjJcIj5VcGRhdGU8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICBgXTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIGN1c3RvbV9sYXllcjogY3VzdG9tTGF5ZXJcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyICRwb3B1cCA9IGVkaXRvci5wb3B1cHMuY3JlYXRlKFRhYmxlQ29sV2lkdGhQbHVnaW4uVEVNUExBVEVfTkFNRSwgdGVtcGxhdGUpO1xyXG4gICAgICAgICAgICB2YXIgJGZvcm0gPSAkcG9wdXAuZmluZChcImZvcm1cIik7XHJcbiAgICAgICAgICAgIHZhciAkaW5wdXQgPSAkcG9wdXAuZmluZChcImlucHV0XCIpO1xyXG4gICAgICAgICAgICB2YXIgJHVwZGF0ZSA9ICRwb3B1cC5maW5kKFwiYnV0dG9uLmZyLXN1Ym1pdFwiKTtcclxuXHJcbiAgICAgICAgICAgICRmb3JtLm9uKCdzdWJtaXQnLCAoJGU6IGFuZ3VsYXIuSUFuZ3VsYXJFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgJGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICRlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRDb2xXaWR0aCgkaW5wdXQudmFsKCkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlUG9wdXAoZWRpdG9yKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgc3VibWl0T25FbnRlciA9ICgkZTogYW5ndWxhci5JQW5ndWxhckV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJGVbJ3doaWNoJ10gIT0gMTMpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgICRmb3JtLnN1Ym1pdCgpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHVwZGF0ZS5vbignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAkZm9ybS5zdWJtaXQoKTtcclxuICAgICAgICAgICAgfSkub24oJ2tleXVwJywgc3VibWl0T25FbnRlcik7XHJcblxyXG4gICAgICAgICAgICAkaW5wdXQub24oJ2tleXVwJywgc3VibWl0T25FbnRlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXRDb2xXaWR0aCh2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuJGNvbClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIHZhciAkcm93ID0gdGhpcy4kY29sLnBhcmVudCgpO1xyXG4gICAgICAgICAgICB2YXIgaWR4ID0gJHJvdy5jaGlsZHJlbigpLmluZGV4KHRoaXMuJGNvbCk7XHJcbiAgICAgICAgICAgIHZhciAkdGFibGUgPSAkcm93LnBhcmVudHMoXCJ0YWJsZVwiKTtcclxuICAgICAgICAgICAgdmFyICR0ZHMgPSAkdGFibGUuZmluZChgdHIgPiB0ZDplcSgke2lkeH0pYCk7XHJcbiAgICAgICAgICAgIHZhciAkdGhzID0gJHRhYmxlLmZpbmQoYHRyID4gdGg6ZXEoJHtpZHh9KWApO1xyXG5cclxuICAgICAgICAgICAgJHRkcy5jc3MoXCJ3aWR0aFwiLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICR0aHMuY3NzKFwid2lkdGhcIiwgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2hvd1BvcHVwKGVkaXRvciwgY21kKSB7XHJcbiAgICAgICAgICAgIGVkaXRvci5wb3B1cHMuc2V0Q29udGFpbmVyKFRhYmxlQ29sV2lkdGhQbHVnaW4uVEVNUExBVEVfTkFNRSwgZWRpdG9yLiR0Yik7XHJcblxyXG4gICAgICAgICAgICB0aGlzLiRjb2wgPSBhbmd1bGFyLmVsZW1lbnQoZWRpdG9yLnNlbGVjdGlvbi5nZXQoKS5mb2N1c05vZGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHBhcmVudCA9IGVkaXRvci4kaWZyYW1lLm9mZnNldCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMuJGNvbC5vZmZzZXQoKTtcclxuICAgICAgICAgICAgdmFyIGxlZnQgPSBvZmZzZXQubGVmdCArICh0aGlzLiRjb2wub3V0ZXJXaWR0aCgpIC8gMikgKyBwYXJlbnQubGVmdDtcclxuICAgICAgICAgICAgdmFyIHRvcCA9IG9mZnNldC50b3AgKyB0aGlzLiRjb2wub3V0ZXJIZWlnaHQoKSArIHBhcmVudC50b3A7XHJcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSB0aGlzLiRjb2wub3V0ZXJIZWlnaHQoKTtcclxuXHJcbiAgICAgICAgICAgIGVkaXRvci5wb3B1cHMuc2hvdyhUYWJsZUNvbFdpZHRoUGx1Z2luLlRFTVBMQVRFX05BTUUsIGxlZnQsIHRvcCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgIHZhciAkcG9wdXAgPSBlZGl0b3IucG9wdXBzLmdldChUYWJsZUNvbFdpZHRoUGx1Z2luLlRFTVBMQVRFX05BTUUpO1xyXG4gICAgICAgICAgICB2YXIgJGlucHV0ID0gJHBvcHVwLmZpbmQoXCJpbnB1dFwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB3aWR0aCA9IHRoaXMuJGNvbC5nZXQoMCkuc3R5bGUud2lkdGggfHwgdGhpcy4kY29sLmNzcyhcIndpZHRoXCIpO1xyXG4gICAgICAgICAgICBpZiAod2lkdGgpXHJcbiAgICAgICAgICAgICAgICAkaW5wdXQuYWRkQ2xhc3MoXCJmci1ub3QtZW1wdHlcIik7XHJcbiAgICAgICAgICAgICRpbnB1dC52YWwod2lkdGgpO1xyXG5cclxuICAgICAgICAgICAgJGlucHV0LmZvY3VzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBoaWRlUG9wdXAoZWRpdG9yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGNvbCA9IG51bGw7XHJcbiAgICAgICAgICAgIGVkaXRvci5wb3B1cHMuaGlkZShUYWJsZUNvbFdpZHRoUGx1Z2luLlRFTVBMQVRFX05BTUUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBlZGl0b3JTdGF0aWM6IGFueTtcclxuICAgICAgICBwcml2YXRlICRjb2w6IGFuZ3VsYXIuSUF1Z21lbnRlZEpRdWVyeTtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBURU1QTEFURV9OQU1FID0gJ3RhYmxlQ29sV2lkdGhQbHVnaW4ucG9wdXAnO1xyXG4gICAgfVxyXG5cclxufSJdfQ==