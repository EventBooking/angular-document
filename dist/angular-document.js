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
            var n = idx + 1;
            var $table = $row.parents("table");
            var $allRows = $table.find("> tbody > tr");
            var $cells = $allRows.find("td, th");
            var $column = $cells.filter(":nth-child(" + n + "):not([colspan])");
            $column.css("width", value);
        };
        TableColWidthPlugin.prototype.getCell = function (editor) {
            var $element = angular.element(editor.selection.get().focusNode);
            if (!$element.is("td, th"))
                $element = angular.element($element.parents("td, th"));
            return $element;
        };
        TableColWidthPlugin.prototype.showPopup = function (editor, cmd) {
            editor.popups.setContainer(TableColWidthPlugin.TEMPLATE_NAME, editor.$tb);
            this.$col = this.getCell(editor);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1kb2N1bWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHAudHMiLCIuLi9zcmMvZG9jdW1lbnQtZWRpdG9yLnRzIiwiLi4vc3JjL2RvY3VtZW50LXBkZi50cyIsIi4uL3NyYy9kb2N1bWVudC1yZWFkZXIudHMiLCIuLi9zcmMvZG9jdW1lbnQtd3JpdGVyLnRzIiwiLi4vc3JjL2ZvbnQtc2l6ZS1wbHVnaW4udHMiLCIuLi9zcmMvb3JkZXJlZC1saXN0LXBsdWdpbi50cyIsIi4uL3NyYy90YWJsZS1jb2wtd2lkdGgtcGx1Z2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQ0F6QyxJQUFPLFVBQVUsQ0FnVGhCO0FBaFRELFdBQU8sVUFBVSxFQUFDLENBQUM7SUFFZjtRQUNJO1lBQ0ksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztZQUNoQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1lBQ2xDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7UUFDcEMsQ0FBQztRQUVELDRDQUFTLEdBQVQsVUFBVSxNQUFNO1lBQWhCLGlCQXFFQztZQXBFRyxJQUFJLENBQUMsY0FBYyxHQUFHO2dCQUNsQixNQUFNLEVBQUUsSUFBSTtnQkFDWixLQUFLLEVBQUUsTUFBTSxDQUFDLE9BQU87Z0JBQ3JCLEtBQUssRUFBRSxHQUFHO2dCQUNWLGdCQUFnQixFQUFFLE1BQUksSUFBSSxDQUFDLFNBQVc7Z0JBQ3RDLFdBQVcsRUFBRTtvQkFDVCxlQUFlLEVBQUUsWUFBWTtvQkFDN0IsbUJBQW1CLEVBQUUsZ0JBQWdCO2lCQUN4QztnQkFDRCxnQkFBZ0IsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE1B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YSxDQUFDLENBQUM7WUFDbEUsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUVsQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ25FLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQztnQkFDTixNQUFNLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFbEIsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ25CLENBQUM7UUFFRCx1Q0FBUyxHQUFULFVBQVUsTUFBTTtZQUNaLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzFELENBQUM7UUFJYyxpQ0FBYSxHQUFHLDJCQUEyQixDQUFDO1FBQy9ELDBCQUFDO0lBQUQsQ0FBQyxBQS9IRCxJQStIQztJQS9IWSw4QkFBbUIsc0JBK0gvQixDQUFBO0FBRUwsQ0FBQyxFQW5JTSxVQUFVLEtBQVYsVUFBVSxRQW1JaEIiLCJzb3VyY2VzQ29udGVudCI6WyJBbmd1bGFyLm1vZHVsZShcIm5nRG9jdW1lbnRcIiwgWydmcm9hbGEnXSk7IiwibW9kdWxlIE5nRG9jdW1lbnQge1xyXG5cclxuICAgIGNsYXNzIERvY3VtZW50RWRpdG9yQ29udHJvbGxlciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGVhZGVyID0gdGhpcy5oZWFkZXIgfHwgJyc7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuY29udGVudCB8fCAnJztcclxuICAgICAgICAgICAgdGhpcy5mb290ZXIgPSB0aGlzLmZvb3RlciB8fCAnJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9uUHJlSW5pdChlZGl0b3IpIHtcclxuICAgICAgICAgICAgdGhpcy5kZWZhdWx0T3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIGlmcmFtZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGVudGVyOiBlZGl0b3IuRU5URVJfUCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiA4MTYsXHJcbiAgICAgICAgICAgICAgICB0b29sYmFyQ29udGFpbmVyOiBgIyR7dGhpcy50b29sYmFySWR9YCxcclxuICAgICAgICAgICAgICAgIHRhYmxlU3R5bGVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2ZyLW5vLWJvcmRlcnMnOiAnTm8gQm9yZGVycycsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2ZyLWFsdGVybmF0ZS1yb3dzJzogJ0FsdGVybmF0ZSBSb3dzJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHRhYmxlRWRpdEJ1dHRvbnM6IFtdLmNvbmNhdChlZGl0b3IuREVGQVVMVFMudGFibGVFZGl0QnV0dG9ucywgW1widGFibGVDb2xXaWR0aFwiXSksXHJcbiAgICAgICAgICAgICAgICB0YWJsZUNlbGxTdHlsZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnZnItbm8tYm9yZGVycyc6ICdObyBCb3JkZXJzIChBTEwpJyxcclxuICAgICAgICAgICAgICAgICAgICAnZnItbm8tbGVmdC1ib3JkZXInOiAnTm8gTGVmdCBCb3JkZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICdmci1uby1yaWdodC1ib3JkZXInOiAnTm8gUmlnaHQgQm9yZGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAnZnItbm8tdG9wLWJvcmRlcic6ICdObyBUb3AgQm9yZGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAnZnItbm8tYm90dG9tLWJvcmRlcic6ICdObyBCb3R0b20gQm9yZGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAnZnItYm9yZGVyLXRoaWNrJzogJ1RoaWNrIEJvcmRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2ZyLWJvcmRlci1kYXJrJzogJ0RhcmsgQm9yZGVyJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIidTb3VyY2UgU2VyaWYgUHJvJywgc2VyaWZcIjogXCJTZXJpZlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiJ1NvdXJjZSBTYW5zIFBybycsIHNhbnMtc2VyaWZcIjogXCJTYW5zIFNlcmlmXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCInU291cmNlIENvZGUgUHJvJywgbW9ub3NwYWNlXCI6IFwiTW9ub3NwYWNlXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5RGVmYXVsdFNlbGVjdGlvbjogXCJTZXJpZlwiLFxyXG4gICAgICAgICAgICAgICAgZm9udEZhbWlseVNlbGVjdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplU2VsZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6IFtcIjhcIiwgXCI5XCIsIFwiMTBcIiwgXCIxMVwiLCBcIjEyXCIsIFwiMTRcIiwgXCIxNlwiLCBcIjE4XCIsIFwiMjRcIiwgXCIzMFwiLCBcIjM2XCIsIFwiNDhcIiwgXCI2MFwiLCBcIjcyXCIsIFwiOTZcIl0sXHJcbiAgICAgICAgICAgICAgICBpZnJhbWVTdHlsZTogXCJib2R5e2ZvbnQtZmFtaWx5OidTb3VyY2UgU2VyaWYgUHJvJyxzZXJpZjtvdmVyZmxvdzpoaWRkZW47fVwiLFxyXG4gICAgICAgICAgICAgICAgdG9vbGJhckJ1dHRvbnM6IFtcclxuICAgICAgICAgICAgICAgICAgICAnYm9sZCcsICdpdGFsaWMnLCAndW5kZXJsaW5lJywgJ3N0cmlrZVRocm91Z2gnLCAnc3Vic2NyaXB0JywgJ3N1cGVyc2NyaXB0JywgJ2ZvbnRGYW1pbHknLCAnZm9udFNpemUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbG9yJywgJ2lubGluZVN0eWxlJywgJ3BhcmFncmFwaFN0eWxlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyctJyxcclxuICAgICAgICAgICAgICAgICAgICAncGFyYWdyYXBoRm9ybWF0JywgJ2FsaWduJywgJ2Zvcm1hdE9MJywgJ2Zvcm1hdFVMJywgJ291dGRlbnQnLCAnaW5kZW50JywgJ3F1b3RlJywgJ3wnLFxyXG4gICAgICAgICAgICAgICAgICAgICdpbnNlcnRIUicsICdpbnNlcnRMaW5rJywgJ2luc2VydEltYWdlJywgJ2luc2VydFRhYmxlJywgJ3VuZG8nLCAncmVkbycsICdjbGVhckZvcm1hdHRpbmcnLCAnaHRtbCdcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICB0b29sYmFyQnV0dG9uc01EOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgJ2JvbGQnLCAnaXRhbGljJywgJ3VuZGVybGluZScsICdzdHJpa2VUaHJvdWdoJywgJ3N1YnNjcmlwdCcsICdzdXBlcnNjcmlwdCcsICdmb250RmFtaWx5JywgJ2ZvbnRTaXplJywgJ3wnLFxyXG4gICAgICAgICAgICAgICAgICAgICdjb2xvcicsICdpbmxpbmVTdHlsZScsICdwYXJhZ3JhcGhTdHlsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8nLScsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3BhcmFncmFwaEZvcm1hdCcsICdhbGlnbicsICdmb3JtYXRPTCcsICdmb3JtYXRVTCcsICdvdXRkZW50JywgJ2luZGVudCcsICdxdW90ZScsICd8JyxcclxuICAgICAgICAgICAgICAgICAgICAnaW5zZXJ0SFInLCAnaW5zZXJ0TGluaycsICdpbnNlcnRJbWFnZScsICdpbnNlcnRUYWJsZScsICd1bmRvJywgJ3JlZG8nLCAnY2xlYXJGb3JtYXR0aW5nJywgJ2h0bWwnXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgdG9vbGJhckJ1dHRvbnNTTTogW1xyXG4gICAgICAgICAgICAgICAgICAgICdib2xkJywgJ2l0YWxpYycsICd1bmRlcmxpbmUnLCAnc3RyaWtlVGhyb3VnaCcsICdzdWJzY3JpcHQnLCAnc3VwZXJzY3JpcHQnLCAnZm9udEZhbWlseScsICdmb250U2l6ZScsICd8JyxcclxuICAgICAgICAgICAgICAgICAgICAnY29sb3InLCAnaW5saW5lU3R5bGUnLCAncGFyYWdyYXBoU3R5bGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vJy0nLFxyXG4gICAgICAgICAgICAgICAgICAgICdwYXJhZ3JhcGhGb3JtYXQnLCAnYWxpZ24nLCAnZm9ybWF0T0wnLCAnZm9ybWF0VUwnLCAnb3V0ZGVudCcsICdpbmRlbnQnLCAncXVvdGUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2luc2VydEhSJywgJ2luc2VydExpbmsnLCAnaW5zZXJ0SW1hZ2UnLCAnaW5zZXJ0VGFibGUnLCAndW5kbycsICdyZWRvJywgJ2NsZWFyRm9ybWF0dGluZycsICdodG1sJ1xyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJCdXR0b25zWFM6IFtcclxuICAgICAgICAgICAgICAgICAgICAnYm9sZCcsICdpdGFsaWMnLCAndW5kZXJsaW5lJywgJ3N0cmlrZVRocm91Z2gnLCAnc3Vic2NyaXB0JywgJ3N1cGVyc2NyaXB0JywgJ2ZvbnRGYW1pbHknLCAnZm9udFNpemUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbG9yJywgJ2lubGluZVN0eWxlJywgJ3BhcmFncmFwaFN0eWxlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyctJyxcclxuICAgICAgICAgICAgICAgICAgICAncGFyYWdyYXBoRm9ybWF0JywgJ2FsaWduJywgJ2Zvcm1hdE9MJywgJ2Zvcm1hdFVMJywgJ291dGRlbnQnLCAnaW5kZW50JywgJ3F1b3RlJywgJ3wnLFxyXG4gICAgICAgICAgICAgICAgICAgICdpbnNlcnRIUicsICdpbnNlcnRMaW5rJywgJ2luc2VydEltYWdlJywgJ2luc2VydFRhYmxlJywgJ3VuZG8nLCAncmVkbycsICdjbGVhckZvcm1hdHRpbmcnLCAnaHRtbCdcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBldmVudHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnZnJvYWxhRWRpdG9yLmltYWdlLmJlZm9yZVVwbG9hZCc6IChlLCBlZGl0b3IsIGltYWdlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluc2VydEJhc2U2NEltYWdlKGVkaXRvciwgaW1hZ2VzWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuaGVhZGVyQ29uZmlnID0gdGhpcy5nZXRIZWFkZXJDb25maWcodGhpcy5oZWFkZXJPcHRpb25zIHx8IHt9KTtcclxuICAgICAgICAgICAgdGhpcy5jb250ZW50Q29uZmlnID0gdGhpcy5nZXRDb250ZW50Q29uZmlnKHRoaXMuY29udGVudE9wdGlvbnMgfHwge30pO1xyXG4gICAgICAgICAgICB0aGlzLmZvb3RlckNvbmZpZyA9IHRoaXMuZ2V0Rm9vdGVyQ29uZmlnKHRoaXMuZm9vdGVyT3B0aW9ucyB8fCB7fSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvbkluaXQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Q29udGVudCh0aGlzLl9odG1sKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGVhZGVyLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICB0aGlzLndpdGhIZWFkZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5mb290ZXIubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgIHRoaXMud2l0aEZvb3RlciA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBpbnNlcnRCYXNlNjRJbWFnZShlZGl0b3I6IGFueSwgaW1hZ2U6IEZpbGUpIHtcclxuICAgICAgICAgICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgICAgIHJlYWRlci5vbmxvYWQgPSAocmVhZGVyRXZ0OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIGVkaXRvci5pbWFnZS5pbnNlcnQocmVhZGVyRXZ0LnRhcmdldC5yZXN1bHQpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChpbWFnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRIZWFkZXJDb25maWcob3B0aW9uczogYW55KTogYW55IHtcclxuICAgICAgICAgICAgdmFyIGNvbmZpZyA9IGFuZ3VsYXIuZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlclRleHQ6ICdIZWFkZXInXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRvb2xiYXJzID0gWyd0b29sYmFyQnV0dG9ucycsICd0b29sYmFyQnV0dG9uc01EJywgJ3Rvb2xiYXJCdXR0b25zU00nLCAndG9vbGJhckJ1dHRvbnNYUyddO1xyXG4gICAgICAgICAgICB0b29sYmFycy5mb3JFYWNoKHggPT4gY29uZmlnW3hdID0gY29uZmlnW3hdLmNvbmNhdChbJ3wnLCAncmVtb3ZlSGVhZGVyJ10pKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjb25maWc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRDb250ZW50Q29uZmlnKG9wdGlvbnM6IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciBjb25maWcgPSBhbmd1bGFyLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucywge1xyXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXJUZXh0OiAnQ29udGVudCdcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdG9vbGJhcnMgPSBbJ3Rvb2xiYXJCdXR0b25zJywgJ3Rvb2xiYXJCdXR0b25zTUQnLCAndG9vbGJhckJ1dHRvbnNTTScsICd0b29sYmFyQnV0dG9uc1hTJ107XHJcbiAgICAgICAgICAgIHRvb2xiYXJzLmZvckVhY2goeCA9PiBjb25maWdbeF0gPSBjb25maWdbeF0uY29uY2F0KFsncGFnZUJyZWFrJ10pKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjb25maWc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRGb290ZXJDb25maWcob3B0aW9uczogYW55KTogYW55IHtcclxuICAgICAgICAgICAgdmFyIGNvbmZpZyA9IGFuZ3VsYXIuZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlclRleHQ6ICdGb290ZXInXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRvb2xiYXJzID0gWyd0b29sYmFyQnV0dG9ucycsICd0b29sYmFyQnV0dG9uc01EJywgJ3Rvb2xiYXJCdXR0b25zU00nLCAndG9vbGJhckJ1dHRvbnNYUyddO1xyXG4gICAgICAgICAgICB0b29sYmFycy5mb3JFYWNoKHggPT4gY29uZmlnW3hdID0gY29uZmlnW3hdLmNvbmNhdChbJ3wnLCAncmVtb3ZlRm9vdGVyJ10pKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjb25maWc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIF9odG1sOiBzdHJpbmc7XHJcbiAgICAgICAgZ2V0IGh0bWwoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIHdyaXRlciA9IG5ldyBEb2N1bWVudFdyaXRlcih0aGlzLmhlYWRlciwgdGhpcy5jb250ZW50LCB0aGlzLmZvb3Rlcik7XHJcbiAgICAgICAgICAgIHZhciBvcHRpb25zOiBJRG9jdW1lbnRXcml0ZXJPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgZXhjbHVkZUhlYWRlcjogIXRoaXMud2l0aEhlYWRlcixcclxuICAgICAgICAgICAgICAgIGV4Y2x1ZGVGb290ZXI6ICF0aGlzLndpdGhGb290ZXJcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHdyaXRlci53cml0ZShvcHRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldCBodG1sKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5faHRtbCA9IHZhbHVlO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Q29udGVudCh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHNldENvbnRlbnQodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgcGFyc2VyID0gbmV3IERvY3VtZW50UmVhZGVyKHZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5oZWFkZXIgPSBwYXJzZXIuZ2V0SGVhZGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudCA9IHBhcnNlci5nZXRDb250ZW50KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZm9vdGVyID0gcGFyc2VyLmdldEZvb3RlcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaGVhZGVyT3B0aW9uczogYW55O1xyXG4gICAgICAgIGNvbnRlbnRPcHRpb25zOiBhbnk7XHJcbiAgICAgICAgZm9vdGVyT3B0aW9uczogYW55O1xyXG4gICAgICAgIGRlZmF1bHRPcHRpb25zOiBhbnk7XHJcbiAgICAgICAgaGVhZGVyQ29uZmlnOiBhbnk7XHJcbiAgICAgICAgY29udGVudENvbmZpZzogYW55O1xyXG4gICAgICAgIGZvb3RlckNvbmZpZzogYW55O1xyXG5cclxuICAgICAgICBpbml0aWFsaXplZDogYm9vbGVhbjtcclxuICAgICAgICB0b29sYmFySWQ6IHN0cmluZztcclxuICAgICAgICBoZWFkZXI6IHN0cmluZztcclxuICAgICAgICBjb250ZW50OiBzdHJpbmc7XHJcbiAgICAgICAgZm9vdGVyOiBzdHJpbmc7XHJcbiAgICAgICAgd2l0aEhlYWRlcjogYm9vbGVhbjtcclxuICAgICAgICB3aXRoRm9vdGVyOiBib29sZWFuO1xyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIERvY3VtZW50RWRpdG9yRGlyZWN0aXZlIHtcclxuICAgICAgICByZXN0cmljdCA9ICdFJztcclxuICAgICAgICB0cmFuc2NsdWRlID0gdHJ1ZTtcclxuICAgICAgICB0ZW1wbGF0ZVVybCA9ICdkb2N1bWVudC1lZGl0b3IuaHRtbCc7XHJcbiAgICAgICAgY29udHJvbGxlciA9IERvY3VtZW50RWRpdG9yQ29udHJvbGxlcjtcclxuICAgICAgICBjb250cm9sbGVyQXMgPSAnZG9jdW1lbnRFZGl0b3InO1xyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXIgPSB0cnVlO1xyXG4gICAgICAgIHNjb3BlID0ge1xyXG4gICAgICAgICAgICBoZWFkZXJPcHRpb25zOiAnPT8nLFxyXG4gICAgICAgICAgICBib2R5T3B0aW9uczogJz0/JyxcclxuICAgICAgICAgICAgZm9vdGVyT3B0aW9uczogJz0/JyxcclxuICAgICAgICAgICAgaHRtbDogJz0/J1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGluayA9IHtcclxuICAgICAgICAgICAgcHJlOiAoJHNjb3BlOiBhbmd1bGFyLklTY29wZSwgJGVsZW1lbnQ6IGFuZ3VsYXIuSUF1Z21lbnRlZEpRdWVyeSwgJGF0dHJzOiBhbmd1bGFyLklBdHRyaWJ1dGVzLCAkY3RybDogRG9jdW1lbnRFZGl0b3JDb250cm9sbGVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZWRpdG9yOiBhbnkgPSAkWydGcm9hbGFFZGl0b3InXTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRFbGVtZW50KCRlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdFRvb2xiYXIoJGN0cmwsICRzY29wZSwgJGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbml0Q29tbWFuZHMoZWRpdG9yLCAkY3RybCwgJHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdFBsdWdpbnMoZWRpdG9yLlBMVUdJTlMsICRzY29wZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJGN0cmwub25QcmVJbml0KGVkaXRvcik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBvc3Q6ICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICRjdHJsOiBEb2N1bWVudEVkaXRvckNvbnRyb2xsZXIpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciAkY29udGFpbmVyID0gJGVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICB2YXIgJGhlYWRlcjogYW55ID0gJGNvbnRhaW5lci5maW5kKCcuZG9jdW1lbnQtZWRpdG9yLWhlYWRlcicpO1xyXG4gICAgICAgICAgICAgICAgdmFyICRjb250ZW50OiBhbnkgPSAkY29udGFpbmVyLmZpbmQoJy5kb2N1bWVudC1lZGl0b3ItY29udGVudCcpO1xyXG4gICAgICAgICAgICAgICAgdmFyICRmb290ZXI6IGFueSA9ICRjb250YWluZXIuZmluZCgnLmRvY3VtZW50LWVkaXRvci1mb290ZXInKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRIZWFkZXIoJGhlYWRlciwgJGNvbnRlbnQsICRmb290ZXIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbml0Q29udGVudCgkaGVhZGVyLCAkY29udGVudCwgJGZvb3Rlcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRGb290ZXIoJGhlYWRlciwgJGNvbnRlbnQsICRmb290ZXIpO1xyXG5cclxuICAgICAgICAgICAgICAgICRjdHJsLm9uSW5pdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkZG9jdW1lbnRFZGl0b3I6IGFuZ3VsYXIuSUF1Z21lbnRlZEpRdWVyeTtcclxuICAgICAgICBpbml0RWxlbWVudCgkZWxlbWVudDogYW5ndWxhci5JQXVnbWVudGVkSlF1ZXJ5KSB7XHJcbiAgICAgICAgICAgIHZhciAkcGFyZW50ID0gJGVsZW1lbnQucGFyZW50KCk7XHJcbiAgICAgICAgICAgIHZhciAkYm9keSA9IGFuZ3VsYXIuZWxlbWVudCgkZWxlbWVudFswXS5vd25lckRvY3VtZW50LmJvZHkpO1xyXG4gICAgICAgICAgICAkYm9keS5hcHBlbmQoJGVsZW1lbnQpO1xyXG5cclxuICAgICAgICAgICAgJHBhcmVudC5vbihcIiRkZXN0cm95XCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICRlbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluaXRUb29sYmFyKCRjdHJsOiBEb2N1bWVudEVkaXRvckNvbnRyb2xsZXIsICRzY29wZTogYW5ndWxhci5JU2NvcGUsICRlbGVtZW50OiBhbmd1bGFyLklBdWdtZW50ZWRKUXVlcnkpIHtcclxuICAgICAgICAgICAgdmFyIHRvb2xiYXJJZCA9IGBkb2N1bWVudC1lZGl0b3ItJHskc2NvcGUuJGlkfS13eXNpd3lnLXRvb2xiYXJgO1xyXG4gICAgICAgICAgICB2YXIgJHRvb2xiYXIgPSAkZWxlbWVudC5maW5kKFwiLmRvY3VtZW50LWVkaXRvci13eXNpd3lnLXRvb2xiYXJcIik7XHJcbiAgICAgICAgICAgICR0b29sYmFyLnByb3AoJ2lkJywgdG9vbGJhcklkKTtcclxuICAgICAgICAgICAgJGN0cmwudG9vbGJhcklkID0gdG9vbGJhcklkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdENvbW1hbmRzKGVkaXRvciwgJGN0cmw6IERvY3VtZW50RWRpdG9yQ29udHJvbGxlciwgJHNjb3BlOiBhbmd1bGFyLklTY29wZSkge1xyXG4gICAgICAgICAgICBlZGl0b3IuRGVmaW5lSWNvbigncmVtb3ZlSGVhZGVyJywgeyBOQU1FOiAndGltZXMtY2lyY2xlJyB9KTtcclxuICAgICAgICAgICAgZWRpdG9yLlJlZ2lzdGVyQ29tbWFuZCgncmVtb3ZlSGVhZGVyJywge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdSZW1vdmUgSGVhZGVyJyxcclxuICAgICAgICAgICAgICAgIHVuZG86IHRydWUsXHJcbiAgICAgICAgICAgICAgICBmb2N1czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHJlZnJlc2hBZnRlckNhbGxiYWNrOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IChlZGl0b3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAkY3RybC53aXRoSGVhZGVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGVkaXRvci5EZWZpbmVJY29uKCdyZW1vdmVGb290ZXInLCB7IE5BTUU6ICd0aW1lcy1jaXJjbGUnIH0pO1xyXG4gICAgICAgICAgICBlZGl0b3IuUmVnaXN0ZXJDb21tYW5kKCdyZW1vdmVGb290ZXInLCB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1JlbW92ZSBGb290ZXInLFxyXG4gICAgICAgICAgICAgICAgdW5kbzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGZvY3VzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcmVmcmVzaEFmdGVyQ2FsbGJhY2s6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogKGVkaXRvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICRjdHJsLndpdGhGb290ZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZWRpdG9yLkRlZmluZUljb24oJ3BhZ2VCcmVhaycsIHsgTkFNRTogJ2NvbHVtbnMnIH0pO1xyXG4gICAgICAgICAgICBlZGl0b3IuUmVnaXN0ZXJDb21tYW5kKCdwYWdlQnJlYWsnLCB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1BhZ2UgQnJlYWsnLFxyXG4gICAgICAgICAgICAgICAgdW5kbzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGZvY3VzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcmVmcmVzaEFmdGVyQ2FsbGJhY2s6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24gKGVkaXRvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaHRtbC5pbnNlcnQoJzxociBjbGFzcz1cImZyLXBhZ2UtYnJlYWtcIj4nKTtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdFBsdWdpbnMoUExVR0lOUywgJHNjb3BlKSB7XHJcbiAgICAgICAgICAgIFBMVUdJTlMub3JkZXJlZExpc3RQbHVnaW4gPSAoZWRpdG9yKSA9PiBuZXcgT3JkZXJlZExpc3RQbHVnaW4oZWRpdG9yLCAkc2NvcGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIF9mb250U2l6ZSA9IFBMVUdJTlMuZm9udFNpemU7XHJcbiAgICAgICAgICAgIFBMVUdJTlMuZm9udFNpemUgPSAoZWRpdG9yKSA9PiBuZXcgRm9udFNpemVQbHVnaW4oZWRpdG9yLCBfZm9udFNpemUoZWRpdG9yKSk7XHJcblxyXG4gICAgICAgICAgICBUYWJsZUNvbFdpZHRoUGx1Z2luLnJlZ2lzdGVyKFBMVUdJTlMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdEhlYWRlcigkaGVhZGVyLCAkY29udGVudCwgJGZvb3Rlcikge1xyXG4gICAgICAgICAgICAkaGVhZGVyLmZyb2FsYUVkaXRvcigndG9vbGJhci5oaWRlJyk7XHJcbiAgICAgICAgICAgICRoZWFkZXIub24oJ2Zyb2FsYUVkaXRvci5mb2N1cycsIChlLCBlZGl0b3IpID0+IHtcclxuICAgICAgICAgICAgICAgIGVkaXRvci50b29sYmFyLnNob3coKTtcclxuICAgICAgICAgICAgICAgICRjb250ZW50LmZyb2FsYUVkaXRvcigndG9vbGJhci5oaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkZm9vdGVyLmZyb2FsYUVkaXRvcigndG9vbGJhci5oaWRlJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdENvbnRlbnQoJGhlYWRlciwgJGNvbnRlbnQsICRmb290ZXIpIHtcclxuICAgICAgICAgICAgJGNvbnRlbnQub24oJ2Zyb2FsYUVkaXRvci5mb2N1cycsIChlLCBlZGl0b3IpID0+IHtcclxuICAgICAgICAgICAgICAgICRoZWFkZXIuZnJvYWxhRWRpdG9yKCd0b29sYmFyLmhpZGUnKTtcclxuICAgICAgICAgICAgICAgIGVkaXRvci50b29sYmFyLnNob3coKTtcclxuICAgICAgICAgICAgICAgICRmb290ZXIuZnJvYWxhRWRpdG9yKCd0b29sYmFyLmhpZGUnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0Rm9vdGVyKCRoZWFkZXIsICRjb250ZW50LCAkZm9vdGVyKSB7XHJcbiAgICAgICAgICAgICRmb290ZXIuZnJvYWxhRWRpdG9yKCd0b29sYmFyLmhpZGUnKTtcclxuICAgICAgICAgICAgJGZvb3Rlci5vbignZnJvYWxhRWRpdG9yLmZvY3VzJywgKGUsIGVkaXRvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgJGhlYWRlci5mcm9hbGFFZGl0b3IoJ3Rvb2xiYXIuaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJGNvbnRlbnQuZnJvYWxhRWRpdG9yKCd0b29sYmFyLmhpZGUnKTtcclxuICAgICAgICAgICAgICAgIGVkaXRvci50b29sYmFyLnNob3coKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBBbmd1bGFyLm1vZHVsZShcIm5nRG9jdW1lbnRcIikuZGlyZWN0aXZlKFwiZG9jdW1lbnRFZGl0b3JcIiwgRG9jdW1lbnRFZGl0b3JEaXJlY3RpdmUpO1xyXG59IiwibW9kdWxlIE5nRG9jdW1lbnQge1xyXG4gICAgY2xhc3MgRG9jdW1lbnRQZGZDb250cm9sbGVyIHtcclxuICAgICAgICBvbkluaXQocmVuZGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlciA9IHJlbmRlcjtcclxuICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIF9yZW5kZXI6IGFueTtcclxuICAgICAgICByZW5kZXIodXJsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyKHVybCkuZmluYWxseSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzTG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0aWFsaXplZDogYm9vbGVhbjtcclxuICAgICAgICBpc0xvYWRpbmc6IGJvb2xlYW47XHJcbiAgICAgICAgaXNMb2FkZWQ6IGJvb2xlYW47XHJcblxyXG4gICAgICAgIHByaXZhdGUgX3VybDogc3RyaW5nO1xyXG4gICAgICAgIGdldCB1cmwoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3VybDtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0IHVybCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VybCA9IHZhbHVlO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3MgRG9jdW1lbnRQZGZEaXJlY3RpdmUge1xyXG4gICAgICAgIHN0YXRpYyAkaW5qZWN0ID0gWyckcSddO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlICRxOiBhbmd1bGFyLklRU2VydmljZSkge1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlc3RyaWN0ID0gJ0UnO1xyXG4gICAgICAgIHRyYW5zY2x1ZGUgPSB0cnVlO1xyXG4gICAgICAgIHRlbXBsYXRlVXJsID0gJ2RvY3VtZW50LXBkZi5odG1sJztcclxuICAgICAgICBjb250cm9sbGVyID0gRG9jdW1lbnRQZGZDb250cm9sbGVyO1xyXG4gICAgICAgIGNvbnRyb2xsZXJBcyA9ICdkb2N1bWVudFBkZic7XHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlciA9IHRydWU7XHJcbiAgICAgICAgc2NvcGUgPSB7XHJcbiAgICAgICAgICAgIHVybDogJ0AnLFxyXG4gICAgICAgICAgICBpc0xvYWRlZDogJz0/J1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGluayA9ICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICRjdHJsOiBEb2N1bWVudFBkZkNvbnRyb2xsZXIpID0+IHtcclxuICAgICAgICAgICAgdmFyICRwYWdlcyA9ICRlbGVtZW50LmZpbmQoXCIuZG9jdW1lbnQtdmlld2VyLXBhZ2VzXCIpO1xyXG5cclxuICAgICAgICAgICAgJGN0cmwub25Jbml0KCh1cmwpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlcigkc2NvcGUsICRwYWdlcywgdXJsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZW5kZXIoJHNjb3BlLCAkcGFnZXMsIHVybCkge1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSB0aGlzLiRxLmRlZmVyKCk7XHJcblxyXG4gICAgICAgICAgICAkcGFnZXMuZW1wdHkoKTtcclxuICAgICAgICAgICAgUERGSlMuZ2V0RG9jdW1lbnQodXJsKS50aGVuKHBkZiA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHRhc2tzID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpZHggPSAwOyBpZHggPCBwZGYubnVtUGFnZXM7IGlkeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFza3MucHVzaChwZGYuZ2V0UGFnZShpZHggKyAxKS50aGVuKHBhZ2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgeCA9IHBhZ2UucGFnZU51bWJlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlUGFnZShwYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy4kcS5hbGwodGFza3MpLnRoZW4oY2FudmFzZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICRwYWdlcy5hcHBlbmQoY2FudmFzZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocGRmKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNyZWF0ZVBhZ2UocGFnZTogUERGUGFnZVByb3h5KSB7XHJcbiAgICAgICAgICAgIHZhciBzY2FsZSA9IDEuNTtcclxuICAgICAgICAgICAgdmFyIHZpZXdwb3J0ID0gcGFnZS5nZXRWaWV3cG9ydChzY2FsZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgJGNhbnZhcyA9IGFuZ3VsYXIuZWxlbWVudCgnPGNhbnZhcyBjbGFzcz1cImRvY3VtZW50LXZpZXdlci1wYWdlXCI+PC9jYW52YXM+Jyk7XHJcbiAgICAgICAgICAgICRjYW52YXMuYXR0cihcInBhZ2VcIiwgcGFnZS5wYWdlTnVtYmVyKTtcclxuICAgICAgICAgICAgdmFyIGNhbnZhczogYW55ID0gJGNhbnZhcy5nZXQoMCk7XHJcbiAgICAgICAgICAgIHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSB2aWV3cG9ydC5oZWlnaHQ7XHJcbiAgICAgICAgICAgIGNhbnZhcy53aWR0aCA9IHZpZXdwb3J0LndpZHRoO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJlbmRlckNvbnRleHQgPSB7XHJcbiAgICAgICAgICAgICAgICBjYW52YXNDb250ZXh0OiBjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgdmlld3BvcnQ6IHZpZXdwb3J0XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBwYWdlLnJlbmRlcihyZW5kZXJDb250ZXh0KTtcclxuICAgICAgICAgICAgcmV0dXJuICRjYW52YXM7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEFuZ3VsYXIubW9kdWxlKFwibmdEb2N1bWVudFwiKS5kaXJlY3RpdmUoXCJkb2N1bWVudFBkZlwiLCBEb2N1bWVudFBkZkRpcmVjdGl2ZSk7XHJcbn0iLCJtb2R1bGUgTmdEb2N1bWVudCB7XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElEb2N1bWVudFJlYWRlciB7XHJcbiAgICAgICAgZ2V0SGVhZGVyKCk6IHN0cmluZztcclxuICAgICAgICBnZXRDb250ZW50KCk6IHN0cmluZztcclxuICAgICAgICBnZXRGb290ZXIoKTogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBEb2N1bWVudFJlYWRlciBpbXBsZW1lbnRzIElEb2N1bWVudFJlYWRlciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoaHRtbDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuXyRodG1sID0gJCgnPGRpdj48L2Rpdj4nKS5hcHBlbmQoaHRtbCB8fCAnJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIF8kaHRtbDogSlF1ZXJ5O1xyXG5cclxuICAgICAgICBnZXRIZWFkZXIoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGQoJ2hlYWRlcicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0Q29udGVudCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICAvLyBUb0RvOiBpZiA8Y29udGVudD48L2NvbnRlbnQ+IGRvZXMgbm90IGV4aXN0IGJ1dCB0aGVyZSBpcyBodG1sLCB3cmFwIHRoZSBodG1sIGluIGEgY29udGVudCB0YWdcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGQoJ2NvbnRlbnQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldEZvb3RlcigpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZCgnZm9vdGVyJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGNoaWxkKHNlbGVjdG9yOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fJGh0bWwuY2hpbGRyZW4oc2VsZWN0b3IpLmh0bWwoKSB8fCAnJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJtb2R1bGUgTmdEb2N1bWVudCB7XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElEb2N1bWVudFdyaXRlck9wdGlvbnMge1xyXG4gICAgICAgIGV4Y2x1ZGVIZWFkZXI6IGJvb2xlYW47XHJcbiAgICAgICAgZXhjbHVkZUZvb3RlcjogYm9vbGVhbjtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElEb2N1bWVudFdyaXRlciB7XHJcbiAgICAgICAgd3JpdGUoKTogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBEb2N1bWVudFdyaXRlciBpbXBsZW1lbnRzIElEb2N1bWVudFdyaXRlciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoaGVhZGVyOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZywgZm9vdGVyOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5faGVhZGVyID0gaGVhZGVyO1xyXG4gICAgICAgICAgICB0aGlzLl9jb250ZW50ID0gY29udGVudDtcclxuICAgICAgICAgICAgdGhpcy5fZm9vdGVyID0gZm9vdGVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGhhc0hlYWRlcigpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hlYWRlciAhPSBudWxsICYmIHRoaXMuX2hlYWRlci5sZW5ndGggPiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGhhc0Zvb3RlcigpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Zvb3RlciAhPSBudWxsICYmIHRoaXMuX2Zvb3Rlci5sZW5ndGggPiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgd3JpdGUob3B0aW9ucz86IElEb2N1bWVudFdyaXRlck9wdGlvbnMpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB2YXIgaHRtbCA9IFtdO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzSGVhZGVyICYmICFvcHRpb25zLmV4Y2x1ZGVIZWFkZXIpXHJcbiAgICAgICAgICAgICAgICBodG1sLnB1c2goYDxoZWFkZXI+JHt0aGlzLl9oZWFkZXJ9PC9oZWFkZXI+YCk7XHJcblxyXG4gICAgICAgICAgICBodG1sLnB1c2goYDxjb250ZW50PiR7dGhpcy5fY29udGVudH08L2NvbnRlbnQ+YCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNGb290ZXIgJiYgIW9wdGlvbnMuZXhjbHVkZUZvb3RlcilcclxuICAgICAgICAgICAgICAgIGh0bWwucHVzaChgPGZvb3Rlcj4ke3RoaXMuX2Zvb3Rlcn08L2Zvb3Rlcj5gKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBodG1sLmpvaW4oXCJcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIF9oZWFkZXI6IHN0cmluZztcclxuICAgICAgICBwcml2YXRlIF9jb250ZW50OiBzdHJpbmc7XHJcbiAgICAgICAgcHJpdmF0ZSBfZm9vdGVyOiBzdHJpbmc7XHJcbiAgICB9XHJcbn0iLCJtb2R1bGUgTmdEb2N1bWVudCB7XHJcbiAgICBleHBvcnQgY2xhc3MgRm9udFNpemVQbHVnaW4ge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZWRpdG9yLCBwcml2YXRlIGZvbnRTaXplKSB7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhcHBseSh2YWx1ZSkge1xyXG4gICAgICAgICAgICB2YXIgcmFuZ2VzID0gdGhpcy5lZGl0b3Iuc2VsZWN0aW9uLnJhbmdlcygpLFxyXG4gICAgICAgICAgICAgICAgaGFzUmFuZ2VzID0gcmFuZ2VzLmZpbHRlciggeCA9PiAheC5jb2xsYXBzZWQgKS5sZW5ndGggPiAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKGhhc1Jhbmdlcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb250U2l6ZS5hcHBseSh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciAkc3RhcnQgPSAkKHRoaXMuZWRpdG9yLnNlbGVjdGlvbi5lbGVtZW50KCkpLFxyXG4gICAgICAgICAgICAgICAgJGxpc3QgPSAkc3RhcnQucGFyZW50cyhcIm9sLCB1bFwiKS5maXJzdCgpLFxyXG4gICAgICAgICAgICAgICAgaXNMaXN0ID0gJGxpc3QubGVuZ3RoID4gMDtcclxuXHJcbiAgICAgICAgICAgIGlmICghaXNMaXN0KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgJGxpc3QuY3NzKFwiZm9udC1zaXplXCIsIHZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlZnJlc2goYSkge1xyXG4gICAgICAgICAgICB0aGlzLmZvbnRTaXplLnJlZnJlc2goYSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZWZyZXNoT25TaG93KGEsIGIpIHtcclxuICAgICAgICAgICAgdGhpcy5mb250U2l6ZS5yZWZyZXNoT25TaG93KGEsIGIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIm1vZHVsZSBOZ0RvY3VtZW50IHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgT3JkZXJlZExpc3RQbHVnaW4ge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZWRpdG9yLCBwcml2YXRlICRzY29wZSkge1xyXG4gICAgICAgICAgICB0aGlzLm9yZGVyZWRMaXN0VHlwZXMgPSB7XHJcbiAgICAgICAgICAgICAgICAnbGlzdFR5cGUtZGVjaW1hbCc6ICdOdW1iZXJlZCcsXHJcbiAgICAgICAgICAgICAgICAnbGlzdFR5cGUtbG93ZXJSb21hbic6ICdMb3dlciByb21hbicsXHJcbiAgICAgICAgICAgICAgICAnbGlzdFR5cGUtdXBwZXJSb21hbic6ICdVcHBlciByb21hbicsXHJcbiAgICAgICAgICAgICAgICAnbGlzdFR5cGUtbG93ZXJBbHBoYSc6ICdMb3dlciBhbHBoYScsXHJcbiAgICAgICAgICAgICAgICAnbGlzdFR5cGUtdXBwZXJBbHBoYSc6ICdVcHBlciBhbHBoYSdcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5lZGl0b3JTdGF0aWMgPSAkWydGcm9hbGFFZGl0b3InXTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yU3RhdGljLlBPUFVQX1RFTVBMQVRFU1tPcmRlcmVkTGlzdFBsdWdpbi5URU1QTEFURV9OQU1FXSA9ICdbX0JVVFRPTlNfXSc7XHJcblxyXG4gICAgICAgICAgICAkLmV4dGVuZCh0aGlzLmVkaXRvclN0YXRpYy5ERUZBVUxUUywge1xyXG4gICAgICAgICAgICAgICAgb3JkZXJMaXN0QnV0dG9uczogWydvcmRlcmVkTGlzdFR5cGUnXVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGVkaXRvci4kZWwub24oJ2NsaWNrJywgJ29sPmxpJywgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd1BvcHVwKGUudGFyZ2V0KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0KCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy4kcG9wdXApXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICB0aGlzLmVkaXRvclN0YXRpYy5EZWZpbmVJY29uKCdvcmRlcmVkTGlzdFR5cGUnLCB7IE5BTUU6ICdsaXN0LW9sJyB9KTtcclxuICAgICAgICAgICAgdGhpcy5lZGl0b3JTdGF0aWMuUmVnaXN0ZXJDb21tYW5kKCdvcmRlcmVkTGlzdFR5cGUnLCB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ09yZGVyIExpc3QgVHlwZScsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnZHJvcGRvd24nLFxyXG4gICAgICAgICAgICAgICAgdW5kbzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGZvY3VzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHJlZnJlc2hBZnRlckNhbGxiYWNrOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgb3B0aW9uczogdGhpcy5vcmRlcmVkTGlzdFR5cGVzLFxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IChjbWQsIHZhbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3R5bGUodmFsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYnV0dG9uczogc3RyaW5nW10gPSBbXHJcbiAgICAgICAgICAgICAgICBgPGRpdiBjbGFzcz1cImZyLWJ1dHRvbnNcIj5gLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5lZGl0b3IuYnV0dG9uLmJ1aWxkTGlzdCh0aGlzLmVkaXRvci5vcHRzLm9yZGVyTGlzdEJ1dHRvbnMpLFxyXG4gICAgICAgICAgICAgICAgYDwvZGl2PmBcclxuICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IGJ1dHRvbnMuam9pbignJylcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy4kcG9wdXAgPSB0aGlzLmVkaXRvci5wb3B1cHMuY3JlYXRlKE9yZGVyZWRMaXN0UGx1Z2luLlRFTVBMQVRFX05BTUUsIHRlbXBsYXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldFN0eWxlKHZhbCkge1xyXG4gICAgICAgICAgICB2YXIgJG9sID0gdGhpcy4kbGkucGFyZW50KFwib2xcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMub3JkZXJlZExpc3RUeXBlcyk7XHJcbiAgICAgICAgICAgICRvbC5yZW1vdmVDbGFzcyhrZXlzLmpvaW4oJyAnKSk7XHJcbiAgICAgICAgICAgICRvbC5hZGRDbGFzcyh2YWwpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzaG93UG9wdXAobGkpIHtcclxuICAgICAgICAgICAgdGhpcy5pbml0KCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmVkaXRvci5wb3B1cHMuc2V0Q29udGFpbmVyKE9yZGVyZWRMaXN0UGx1Z2luLlRFTVBMQVRFX05BTUUsIHRoaXMuZWRpdG9yLiR0Yik7XHJcblxyXG4gICAgICAgICAgICB2YXIgcGFyZW50ID0gdGhpcy5lZGl0b3IuJGlmcmFtZS5vZmZzZXQoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuJGxpID0gJChsaSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmVsT2Zmc2V0ID0gdGhpcy4kbGkub2Zmc2V0KCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0ge1xyXG4gICAgICAgICAgICAgICAgbGVmdDogcmVsT2Zmc2V0LmxlZnQgKyBwYXJlbnQubGVmdCxcclxuICAgICAgICAgICAgICAgIHRvcDogcmVsT2Zmc2V0LnRvcCArIHBhcmVudC50b3BcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGhlaWdodCA9IHRoaXMuJGxpLm91dGVySGVpZ2h0KCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgbGVmdCA9IG9mZnNldC5sZWZ0ICsgMTA7XHJcbiAgICAgICAgICAgIHZhciB0b3AgPSBvZmZzZXQudG9wICsgMjA7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmVkaXRvci5wb3B1cHMuc2hvdyhPcmRlcmVkTGlzdFBsdWdpbi5URU1QTEFURV9OQU1FLCBsZWZ0LCB0b3AsIGhlaWdodCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBoaWRlUG9wdXAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGxpID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5lZGl0b3IucG9wdXBzLmhpZGUoT3JkZXJlZExpc3RQbHVnaW4uVEVNUExBVEVfTkFNRSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlICRwb3B1cDogYW55O1xyXG4gICAgICAgIHByaXZhdGUgZWRpdG9yU3RhdGljOiBhbnk7XHJcbiAgICAgICAgcHJpdmF0ZSAkbGk6IGFueTtcclxuICAgICAgICBwcml2YXRlIG9yZGVyZWRMaXN0VHlwZXM6IGFueTtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBURU1QTEFURV9OQU1FID0gJ29yZGVyTGlzdFBsdWdpbi5wb3B1cCc7XHJcbiAgICB9XHJcbn0iLCJtb2R1bGUgTmdEb2N1bWVudCB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFRhYmxlQ29sV2lkdGhQbHVnaW4ge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyByZWdpc3RlcihQTFVHSU5TKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgcGx1Z2luID0gbmV3IFRhYmxlQ29sV2lkdGhQbHVnaW4oKTtcclxuICAgICAgICAgICAgUExVR0lOUy50YWJsZUNvbFdpZHRoID0gKGVkaXRvcikgPT4gcGx1Z2luLmluaXQoZWRpdG9yKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBlZGl0b3JTdGF0aWMgPSAkWydGcm9hbGFFZGl0b3InXTtcclxuXHJcbiAgICAgICAgICAgIGVkaXRvclN0YXRpYy5QT1BVUF9URU1QTEFURVNbVGFibGVDb2xXaWR0aFBsdWdpbi5URU1QTEFURV9OQU1FXSA9ICdbX0NVU1RPTV9MQVlFUl9dJztcclxuXHJcbiAgICAgICAgICAgICQuZXh0ZW5kKGVkaXRvclN0YXRpYy5ERUZBVUxUUywge1xyXG4gICAgICAgICAgICAgICAgdGFibGVDb2xXaWR0aDogWyd0YWJsZUNvbFdpZHRoJ11cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBlZGl0b3JTdGF0aWMuRGVmaW5lSWNvbigndGFibGVDb2xXaWR0aCcsIHsgTkFNRTogJ2Fycm93cy1oJyB9KTtcclxuICAgICAgICAgICAgZWRpdG9yU3RhdGljLlJlZ2lzdGVyQ29tbWFuZCgndGFibGVDb2xXaWR0aCcsIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnQ29sdW1uIFdpZHRoJyxcclxuICAgICAgICAgICAgICAgIHVuZG86IHRydWUsXHJcbiAgICAgICAgICAgICAgICBmb2N1czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICByZWZyZXNoQWZ0ZXJDYWxsYmFjazogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbiAoY21kLCB2YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBwbHVnaW4uc2hvd1BvcHVwKHRoaXMsIGNtZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdChlZGl0b3IpIHtcclxuICAgICAgICAgICAgdmFyIGN1c3RvbUxheWVyOiBzdHJpbmdbXSA9IFtgXHJcbiAgICAgICAgICAgICAgICA8Zm9ybSBjbGFzcz1cImZyLWN1c3RvbS1sYXllclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmci1pbnB1dC1saW5lXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiQ29sdW1uIFdpZHRoXCIgdmFsdWU9XCJcIiB0YWJpbmRleD1cIjFcIj48bGFiZWw+Q29sdW1uIFdpZHRoPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZnItYWN0aW9uLWJ1dHRvbnNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJmci1jb21tYW5kIGZyLXN1Ym1pdFwiIHRhYmluZGV4PVwiMlwiPlVwZGF0ZTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIGBdO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0ge1xyXG4gICAgICAgICAgICAgICAgY3VzdG9tX2xheWVyOiBjdXN0b21MYXllclxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgJHBvcHVwID0gZWRpdG9yLnBvcHVwcy5jcmVhdGUoVGFibGVDb2xXaWR0aFBsdWdpbi5URU1QTEFURV9OQU1FLCB0ZW1wbGF0ZSk7XHJcbiAgICAgICAgICAgIHZhciAkZm9ybSA9ICRwb3B1cC5maW5kKFwiZm9ybVwiKTtcclxuICAgICAgICAgICAgdmFyICRpbnB1dCA9ICRwb3B1cC5maW5kKFwiaW5wdXRcIik7XHJcbiAgICAgICAgICAgIHZhciAkdXBkYXRlID0gJHBvcHVwLmZpbmQoXCJidXR0b24uZnItc3VibWl0XCIpO1xyXG5cclxuICAgICAgICAgICAgJGZvcm0ub24oJ3N1Ym1pdCcsICgkZTogYW5ndWxhci5JQW5ndWxhckV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAkZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgJGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldENvbFdpZHRoKCRpbnB1dC52YWwoKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVQb3B1cChlZGl0b3IpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzdWJtaXRPbkVudGVyID0gKCRlOiBhbmd1bGFyLklBbmd1bGFyRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICgkZVsnd2hpY2gnXSAhPSAxMylcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgJGZvcm0uc3VibWl0KCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkdXBkYXRlLm9uKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICRmb3JtLnN1Ym1pdCgpO1xyXG4gICAgICAgICAgICB9KS5vbigna2V5dXAnLCBzdWJtaXRPbkVudGVyKTtcclxuXHJcbiAgICAgICAgICAgICRpbnB1dC5vbigna2V5dXAnLCBzdWJtaXRPbkVudGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldENvbFdpZHRoKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy4kY29sKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgdmFyICRyb3cgPSB0aGlzLiRjb2wucGFyZW50KCk7XHJcbiAgICAgICAgICAgIHZhciBpZHggPSAkcm93LmNoaWxkcmVuKCkuaW5kZXgodGhpcy4kY29sKTtcclxuICAgICAgICAgICAgdmFyIG4gPSBpZHggKyAxO1xyXG4gICAgICAgICAgICB2YXIgJHRhYmxlID0gJHJvdy5wYXJlbnRzKFwidGFibGVcIik7XHJcbiAgICAgICAgICAgIHZhciAkYWxsUm93cyA9ICR0YWJsZS5maW5kKFwiPiB0Ym9keSA+IHRyXCIpO1xyXG4gICAgICAgICAgICB2YXIgJGNlbGxzID0gJGFsbFJvd3MuZmluZChcInRkLCB0aFwiKTtcclxuICAgICAgICAgICAgdmFyICRjb2x1bW4gPSAkY2VsbHMuZmlsdGVyKGA6bnRoLWNoaWxkKCR7bn0pOm5vdChbY29sc3Bhbl0pYCk7XHJcblxyXG4gICAgICAgICAgICAkY29sdW1uLmNzcyhcIndpZHRoXCIsIHZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldENlbGwoZWRpdG9yKTogYW5ndWxhci5JQXVnbWVudGVkSlF1ZXJ5IHtcclxuICAgICAgICAgICAgdmFyICRlbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KGVkaXRvci5zZWxlY3Rpb24uZ2V0KCkuZm9jdXNOb2RlKTtcclxuICAgICAgICAgICAgaWYgKCEkZWxlbWVudC5pcyhcInRkLCB0aFwiKSlcclxuICAgICAgICAgICAgICAgICRlbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KCRlbGVtZW50LnBhcmVudHMoXCJ0ZCwgdGhcIikpO1xyXG4gICAgICAgICAgICByZXR1cm4gJGVsZW1lbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzaG93UG9wdXAoZWRpdG9yLCBjbWQpIHtcclxuICAgICAgICAgICAgZWRpdG9yLnBvcHVwcy5zZXRDb250YWluZXIoVGFibGVDb2xXaWR0aFBsdWdpbi5URU1QTEFURV9OQU1FLCBlZGl0b3IuJHRiKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuJGNvbCA9IHRoaXMuZ2V0Q2VsbChlZGl0b3IpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHBhcmVudCA9IGVkaXRvci4kaWZyYW1lLm9mZnNldCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMuJGNvbC5vZmZzZXQoKTtcclxuICAgICAgICAgICAgdmFyIGxlZnQgPSBvZmZzZXQubGVmdCArICh0aGlzLiRjb2wub3V0ZXJXaWR0aCgpIC8gMikgKyBwYXJlbnQubGVmdDtcclxuICAgICAgICAgICAgdmFyIHRvcCA9IG9mZnNldC50b3AgKyB0aGlzLiRjb2wub3V0ZXJIZWlnaHQoKSArIHBhcmVudC50b3A7XHJcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSB0aGlzLiRjb2wub3V0ZXJIZWlnaHQoKTtcclxuXHJcbiAgICAgICAgICAgIGVkaXRvci5wb3B1cHMuc2hvdyhUYWJsZUNvbFdpZHRoUGx1Z2luLlRFTVBMQVRFX05BTUUsIGxlZnQsIHRvcCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgIHZhciAkcG9wdXAgPSBlZGl0b3IucG9wdXBzLmdldChUYWJsZUNvbFdpZHRoUGx1Z2luLlRFTVBMQVRFX05BTUUpO1xyXG4gICAgICAgICAgICB2YXIgJGlucHV0ID0gJHBvcHVwLmZpbmQoXCJpbnB1dFwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB3aWR0aCA9IHRoaXMuJGNvbC5nZXQoMCkuc3R5bGUud2lkdGggfHwgdGhpcy4kY29sLmNzcyhcIndpZHRoXCIpO1xyXG4gICAgICAgICAgICBpZiAod2lkdGgpXHJcbiAgICAgICAgICAgICAgICAkaW5wdXQuYWRkQ2xhc3MoXCJmci1ub3QtZW1wdHlcIik7XHJcbiAgICAgICAgICAgICRpbnB1dC52YWwod2lkdGgpO1xyXG5cclxuICAgICAgICAgICAgJGlucHV0LmZvY3VzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBoaWRlUG9wdXAoZWRpdG9yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGNvbCA9IG51bGw7XHJcbiAgICAgICAgICAgIGVkaXRvci5wb3B1cHMuaGlkZShUYWJsZUNvbFdpZHRoUGx1Z2luLlRFTVBMQVRFX05BTUUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBlZGl0b3JTdGF0aWM6IGFueTtcclxuICAgICAgICBwcml2YXRlICRjb2w6IGFuZ3VsYXIuSUF1Z21lbnRlZEpRdWVyeTtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBURU1QTEFURV9OQU1FID0gJ3RhYmxlQ29sV2lkdGhQbHVnaW4ucG9wdXAnO1xyXG4gICAgfVxyXG5cclxufSJdfQ==