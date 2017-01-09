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
            window['editor'] = editor;
            console.log(["tableColWidth"].concat(editor.DEFAULTS.tableEditButtons));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1kb2N1bWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHAudHMiLCIuLi9zcmMvZG9jdW1lbnQtZWRpdG9yLnRzIiwiLi4vc3JjL2RvY3VtZW50LXBkZi50cyIsIi4uL3NyYy9kb2N1bWVudC1yZWFkZXIudHMiLCIuLi9zcmMvZG9jdW1lbnQtd3JpdGVyLnRzIiwiLi4vc3JjL2ZvbnQtc2l6ZS1wbHVnaW4udHMiLCIuLi9zcmMvb3JkZXJlZC1saXN0LXBsdWdpbi50cyIsIi4uL3NyYy90YWJsZS1jb2wtd2lkdGgtcGx1Z2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQ0F6QyxJQUFPLFVBQVUsQ0FrVGhCO0FBbFRELFdBQU8sVUFBVSxFQUFDLENBQUM7SUFFZjtRQUNJO1lBQ0ksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztZQUNoQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1lBQ2xDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7UUFDcEMsQ0FBQztRQUVELDRDQUFTLEdBQVQsVUFBVSxNQUFNO1lBQWhCLGlCQXVFQztZQXRFRyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsTUFBTSxDQUFDO1lBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDeEUsSUFBSSxDQUFDLGNBQWMsR0FBRztnQkFDbEIsTUFBTSxFQUFFLElBQUk7Z0JBQ1osS0FBSyxFQUFFLE1BQU0sQ0FBQyxPQUFPO2dCQUNyQixLQUFLLEVBQUUsR0FBRztnQkFDVixnQkFB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SUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDbkUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDO2dCQUNOLE1BQU0sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDcEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUVsQixNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDbkIsQ0FBQztRQUVELHVDQUFTLEdBQVQsVUFBVSxNQUFNO1lBQ1osSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDakIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDMUQsQ0FBQztRQUljLGlDQUFhLEdBQUcsMkJBQTJCLENBQUM7UUFDL0QsMEJBQUM7SUFBRCxDQUFDLEFBdkhELElBdUhDO0lBdkhZLDhCQUFtQixzQkF1SC9CLENBQUE7QUFFTCxDQUFDLEVBM0hNLFVBQVUsS0FBVixVQUFVLFFBMkhoQiIsInNvdXJjZXNDb250ZW50IjpbIkFuZ3VsYXIubW9kdWxlKFwibmdEb2N1bWVudFwiLCBbJ2Zyb2FsYSddKTsiLCJtb2R1bGUgTmdEb2N1bWVudCB7XHJcblxyXG4gICAgY2xhc3MgRG9jdW1lbnRFZGl0b3JDb250cm9sbGVyIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgdGhpcy5oZWFkZXIgPSB0aGlzLmhlYWRlciB8fCAnJztcclxuICAgICAgICAgICAgdGhpcy5jb250ZW50ID0gdGhpcy5jb250ZW50IHx8ICcnO1xyXG4gICAgICAgICAgICB0aGlzLmZvb3RlciA9IHRoaXMuZm9vdGVyIHx8ICcnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb25QcmVJbml0KGVkaXRvcikge1xyXG4gICAgICAgICAgICB3aW5kb3dbJ2VkaXRvciddID0gZWRpdG9yO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhbXCJ0YWJsZUNvbFdpZHRoXCJdLmNvbmNhdChlZGl0b3IuREVGQVVMVFMudGFibGVFZGl0QnV0dG9ucykpO1xyXG4gICAgICAgICAgICB0aGlzLmRlZmF1bHRPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgaWZyYW1lOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZW50ZXI6IGVkaXRvci5FTlRFUl9QLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IDgxNixcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJDb250YWluZXI6IGAjJHt0aGlzLnRvb2xiYXJJZH1gLFxyXG4gICAgICAgICAgICAgICAgdGFibGVTdHlsZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnZnItbm8tYm9yZGVycyc6ICdObyBCb3JkZXJzJyxcclxuICAgICAgICAgICAgICAgICAgICAnZnItYWx0ZXJuYXRlLXJvd3MnOiAnQWx0ZXJuYXRlIFJvd3MnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdGFibGVFZGl0QnV0dG9uczogW10uY29uY2F0KGVkaXRvci5ERUZBVUxUUy50YWJsZUVkaXRCdXR0b25zLCBbXCJ0YWJsZUNvbFdpZHRoXCJdKSxcclxuICAgICAgICAgICAgICAgIHRhYmxlQ2VsbFN0eWxlczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdmci1uby1ib3JkZXJzJzogJ05vIEJvcmRlcnMgKEFMTCknLFxyXG4gICAgICAgICAgICAgICAgICAgICdmci1uby1sZWZ0LWJvcmRlcic6ICdObyBMZWZ0IEJvcmRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2ZyLW5vLXJpZ2h0LWJvcmRlcic6ICdObyBSaWdodCBCb3JkZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICdmci1uby10b3AtYm9yZGVyJzogJ05vIFRvcCBCb3JkZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICdmci1uby1ib3R0b20tYm9yZGVyJzogJ05vIEJvdHRvbSBCb3JkZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICdmci1ib3JkZXItdGhpY2snOiAnVGhpY2sgQm9yZGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAnZnItYm9yZGVyLWRhcmsnOiAnRGFyayBCb3JkZXInXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZm9udEZhbWlseToge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiJ1NvdXJjZSBTZXJpZiBQcm8nLCBzZXJpZlwiOiBcIlNlcmlmXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCInU291cmNlIFNhbnMgUHJvJywgc2Fucy1zZXJpZlwiOiBcIlNhbnMgU2VyaWZcIixcclxuICAgICAgICAgICAgICAgICAgICBcIidTb3VyY2UgQ29kZSBQcm8nLCBtb25vc3BhY2VcIjogXCJNb25vc3BhY2VcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHlEZWZhdWx0U2VsZWN0aW9uOiBcIlNlcmlmXCIsXHJcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5U2VsZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemVTZWxlY3Rpb246IHRydWUsXHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogW1wiOFwiLCBcIjlcIiwgXCIxMFwiLCBcIjExXCIsIFwiMTJcIiwgXCIxNFwiLCBcIjE2XCIsIFwiMThcIiwgXCIyNFwiLCBcIjMwXCIsIFwiMzZcIiwgXCI0OFwiLCBcIjYwXCIsIFwiNzJcIiwgXCI5NlwiXSxcclxuICAgICAgICAgICAgICAgIGlmcmFtZVN0eWxlOiBcImJvZHl7Zm9udC1mYW1pbHk6J1NvdXJjZSBTZXJpZiBQcm8nLHNlcmlmO292ZXJmbG93OmhpZGRlbjt9XCIsXHJcbiAgICAgICAgICAgICAgICB0b29sYmFyQnV0dG9uczogW1xyXG4gICAgICAgICAgICAgICAgICAgICdib2xkJywgJ2l0YWxpYycsICd1bmRlcmxpbmUnLCAnc3RyaWtlVGhyb3VnaCcsICdzdWJzY3JpcHQnLCAnc3VwZXJzY3JpcHQnLCAnZm9udEZhbWlseScsICdmb250U2l6ZScsICd8JyxcclxuICAgICAgICAgICAgICAgICAgICAnY29sb3InLCAnaW5saW5lU3R5bGUnLCAncGFyYWdyYXBoU3R5bGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vJy0nLFxyXG4gICAgICAgICAgICAgICAgICAgICdwYXJhZ3JhcGhGb3JtYXQnLCAnYWxpZ24nLCAnZm9ybWF0T0wnLCAnZm9ybWF0VUwnLCAnb3V0ZGVudCcsICdpbmRlbnQnLCAncXVvdGUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2luc2VydEhSJywgJ2luc2VydExpbmsnLCAnaW5zZXJ0SW1hZ2UnLCAnaW5zZXJ0VGFibGUnLCAndW5kbycsICdyZWRvJywgJ2NsZWFyRm9ybWF0dGluZycsICdodG1sJ1xyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJCdXR0b25zTUQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAnYm9sZCcsICdpdGFsaWMnLCAndW5kZXJsaW5lJywgJ3N0cmlrZVRocm91Z2gnLCAnc3Vic2NyaXB0JywgJ3N1cGVyc2NyaXB0JywgJ2ZvbnRGYW1pbHknLCAnZm9udFNpemUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbG9yJywgJ2lubGluZVN0eWxlJywgJ3BhcmFncmFwaFN0eWxlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyctJyxcclxuICAgICAgICAgICAgICAgICAgICAncGFyYWdyYXBoRm9ybWF0JywgJ2FsaWduJywgJ2Zvcm1hdE9MJywgJ2Zvcm1hdFVMJywgJ291dGRlbnQnLCAnaW5kZW50JywgJ3F1b3RlJywgJ3wnLFxyXG4gICAgICAgICAgICAgICAgICAgICdpbnNlcnRIUicsICdpbnNlcnRMaW5rJywgJ2luc2VydEltYWdlJywgJ2luc2VydFRhYmxlJywgJ3VuZG8nLCAncmVkbycsICdjbGVhckZvcm1hdHRpbmcnLCAnaHRtbCdcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICB0b29sYmFyQnV0dG9uc1NNOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgJ2JvbGQnLCAnaXRhbGljJywgJ3VuZGVybGluZScsICdzdHJpa2VUaHJvdWdoJywgJ3N1YnNjcmlwdCcsICdzdXBlcnNjcmlwdCcsICdmb250RmFtaWx5JywgJ2ZvbnRTaXplJywgJ3wnLFxyXG4gICAgICAgICAgICAgICAgICAgICdjb2xvcicsICdpbmxpbmVTdHlsZScsICdwYXJhZ3JhcGhTdHlsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8nLScsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3BhcmFncmFwaEZvcm1hdCcsICdhbGlnbicsICdmb3JtYXRPTCcsICdmb3JtYXRVTCcsICdvdXRkZW50JywgJ2luZGVudCcsICdxdW90ZScsICd8JyxcclxuICAgICAgICAgICAgICAgICAgICAnaW5zZXJ0SFInLCAnaW5zZXJ0TGluaycsICdpbnNlcnRJbWFnZScsICdpbnNlcnRUYWJsZScsICd1bmRvJywgJ3JlZG8nLCAnY2xlYXJGb3JtYXR0aW5nJywgJ2h0bWwnXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgdG9vbGJhckJ1dHRvbnNYUzogW1xyXG4gICAgICAgICAgICAgICAgICAgICdib2xkJywgJ2l0YWxpYycsICd1bmRlcmxpbmUnLCAnc3RyaWtlVGhyb3VnaCcsICdzdWJzY3JpcHQnLCAnc3VwZXJzY3JpcHQnLCAnZm9udEZhbWlseScsICdmb250U2l6ZScsICd8JyxcclxuICAgICAgICAgICAgICAgICAgICAnY29sb3InLCAnaW5saW5lU3R5bGUnLCAncGFyYWdyYXBoU3R5bGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vJy0nLFxyXG4gICAgICAgICAgICAgICAgICAgICdwYXJhZ3JhcGhGb3JtYXQnLCAnYWxpZ24nLCAnZm9ybWF0T0wnLCAnZm9ybWF0VUwnLCAnb3V0ZGVudCcsICdpbmRlbnQnLCAncXVvdGUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2luc2VydEhSJywgJ2luc2VydExpbmsnLCAnaW5zZXJ0SW1hZ2UnLCAnaW5zZXJ0VGFibGUnLCAndW5kbycsICdyZWRvJywgJ2NsZWFyRm9ybWF0dGluZycsICdodG1sJ1xyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGV2ZW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdmcm9hbGFFZGl0b3IuaW1hZ2UuYmVmb3JlVXBsb2FkJzogKGUsIGVkaXRvciwgaW1hZ2VzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0QmFzZTY0SW1hZ2UoZWRpdG9yLCBpbWFnZXNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5oZWFkZXJDb25maWcgPSB0aGlzLmdldEhlYWRlckNvbmZpZyh0aGlzLmhlYWRlck9wdGlvbnMgfHwge30pO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnRDb25maWcgPSB0aGlzLmdldENvbnRlbnRDb25maWcodGhpcy5jb250ZW50T3B0aW9ucyB8fCB7fSk7XHJcbiAgICAgICAgICAgIHRoaXMuZm9vdGVyQ29uZmlnID0gdGhpcy5nZXRGb290ZXJDb25maWcodGhpcy5mb290ZXJPcHRpb25zIHx8IHt9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9uSW5pdCgpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRDb250ZW50KHRoaXMuX2h0bWwpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oZWFkZXIubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgIHRoaXMud2l0aEhlYWRlciA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmZvb3Rlci5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy53aXRoRm9vdGVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGluc2VydEJhc2U2NEltYWdlKGVkaXRvcjogYW55LCBpbWFnZTogRmlsZSkge1xyXG4gICAgICAgICAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICAgICAgcmVhZGVyLm9ubG9hZCA9IChyZWFkZXJFdnQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yLmltYWdlLmluc2VydChyZWFkZXJFdnQudGFyZ2V0LnJlc3VsdCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGltYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldEhlYWRlckNvbmZpZyhvcHRpb25zOiBhbnkpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgY29uZmlnID0gYW5ndWxhci5leHRlbmQoe30sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyVGV4dDogJ0hlYWRlcidcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdG9vbGJhcnMgPSBbJ3Rvb2xiYXJCdXR0b25zJywgJ3Rvb2xiYXJCdXR0b25zTUQnLCAndG9vbGJhckJ1dHRvbnNTTScsICd0b29sYmFyQnV0dG9uc1hTJ107XHJcbiAgICAgICAgICAgIHRvb2xiYXJzLmZvckVhY2goeCA9PiBjb25maWdbeF0gPSBjb25maWdbeF0uY29uY2F0KFsnfCcsICdyZW1vdmVIZWFkZXInXSkpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldENvbnRlbnRDb25maWcob3B0aW9uczogYW55KTogYW55IHtcclxuICAgICAgICAgICAgdmFyIGNvbmZpZyA9IGFuZ3VsYXIuZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlclRleHQ6ICdDb250ZW50J1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0b29sYmFycyA9IFsndG9vbGJhckJ1dHRvbnMnLCAndG9vbGJhckJ1dHRvbnNNRCcsICd0b29sYmFyQnV0dG9uc1NNJywgJ3Rvb2xiYXJCdXR0b25zWFMnXTtcclxuICAgICAgICAgICAgdG9vbGJhcnMuZm9yRWFjaCh4ID0+IGNvbmZpZ1t4XSA9IGNvbmZpZ1t4XS5jb25jYXQoWydwYWdlQnJlYWsnXSkpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldEZvb3RlckNvbmZpZyhvcHRpb25zOiBhbnkpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgY29uZmlnID0gYW5ndWxhci5leHRlbmQoe30sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyVGV4dDogJ0Zvb3RlcidcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdG9vbGJhcnMgPSBbJ3Rvb2xiYXJCdXR0b25zJywgJ3Rvb2xiYXJCdXR0b25zTUQnLCAndG9vbGJhckJ1dHRvbnNTTScsICd0b29sYmFyQnV0dG9uc1hTJ107XHJcbiAgICAgICAgICAgIHRvb2xiYXJzLmZvckVhY2goeCA9PiBjb25maWdbeF0gPSBjb25maWdbeF0uY29uY2F0KFsnfCcsICdyZW1vdmVGb290ZXInXSkpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgX2h0bWw6IHN0cmluZztcclxuICAgICAgICBnZXQgaHRtbCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB2YXIgd3JpdGVyID0gbmV3IERvY3VtZW50V3JpdGVyKHRoaXMuaGVhZGVyLCB0aGlzLmNvbnRlbnQsIHRoaXMuZm9vdGVyKTtcclxuICAgICAgICAgICAgdmFyIG9wdGlvbnM6IElEb2N1bWVudFdyaXRlck9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICBleGNsdWRlSGVhZGVyOiAhdGhpcy53aXRoSGVhZGVyLFxyXG4gICAgICAgICAgICAgICAgZXhjbHVkZUZvb3RlcjogIXRoaXMud2l0aEZvb3RlclxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gd3JpdGVyLndyaXRlKG9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0IGh0bWwodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLl9odG1sID0gdmFsdWU7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5zZXRDb250ZW50KHZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc2V0Q29udGVudCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciBwYXJzZXIgPSBuZXcgRG9jdW1lbnRSZWFkZXIodmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmhlYWRlciA9IHBhcnNlci5nZXRIZWFkZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5jb250ZW50ID0gcGFyc2VyLmdldENvbnRlbnQoKTtcclxuICAgICAgICAgICAgdGhpcy5mb290ZXIgPSBwYXJzZXIuZ2V0Rm9vdGVyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBoZWFkZXJPcHRpb25zOiBhbnk7XHJcbiAgICAgICAgY29udGVudE9wdGlvbnM6IGFueTtcclxuICAgICAgICBmb290ZXJPcHRpb25zOiBhbnk7XHJcbiAgICAgICAgZGVmYXVsdE9wdGlvbnM6IGFueTtcclxuICAgICAgICBoZWFkZXJDb25maWc6IGFueTtcclxuICAgICAgICBjb250ZW50Q29uZmlnOiBhbnk7XHJcbiAgICAgICAgZm9vdGVyQ29uZmlnOiBhbnk7XHJcblxyXG4gICAgICAgIGluaXRpYWxpemVkOiBib29sZWFuO1xyXG4gICAgICAgIHRvb2xiYXJJZDogc3RyaW5nO1xyXG4gICAgICAgIGhlYWRlcjogc3RyaW5nO1xyXG4gICAgICAgIGNvbnRlbnQ6IHN0cmluZztcclxuICAgICAgICBmb290ZXI6IHN0cmluZztcclxuICAgICAgICB3aXRoSGVhZGVyOiBib29sZWFuO1xyXG4gICAgICAgIHdpdGhGb290ZXI6IGJvb2xlYW47XHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3MgRG9jdW1lbnRFZGl0b3JEaXJlY3RpdmUge1xyXG4gICAgICAgIHJlc3RyaWN0ID0gJ0UnO1xyXG4gICAgICAgIHRyYW5zY2x1ZGUgPSB0cnVlO1xyXG4gICAgICAgIHRlbXBsYXRlVXJsID0gJ2RvY3VtZW50LWVkaXRvci5odG1sJztcclxuICAgICAgICBjb250cm9sbGVyID0gRG9jdW1lbnRFZGl0b3JDb250cm9sbGVyO1xyXG4gICAgICAgIGNvbnRyb2xsZXJBcyA9ICdkb2N1bWVudEVkaXRvcic7XHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlciA9IHRydWU7XHJcbiAgICAgICAgc2NvcGUgPSB7XHJcbiAgICAgICAgICAgIGhlYWRlck9wdGlvbnM6ICc9PycsXHJcbiAgICAgICAgICAgIGJvZHlPcHRpb25zOiAnPT8nLFxyXG4gICAgICAgICAgICBmb290ZXJPcHRpb25zOiAnPT8nLFxyXG4gICAgICAgICAgICBodG1sOiAnPT8nXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsaW5rID0ge1xyXG4gICAgICAgICAgICBwcmU6ICgkc2NvcGU6IGFuZ3VsYXIuSVNjb3BlLCAkZWxlbWVudDogYW5ndWxhci5JQXVnbWVudGVkSlF1ZXJ5LCAkYXR0cnM6IGFuZ3VsYXIuSUF0dHJpYnV0ZXMsICRjdHJsOiBEb2N1bWVudEVkaXRvckNvbnRyb2xsZXIpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBlZGl0b3I6IGFueSA9ICRbJ0Zyb2FsYUVkaXRvciddO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdEVsZW1lbnQoJGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbml0VG9vbGJhcigkY3RybCwgJHNjb3BlLCAkZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRDb21tYW5kcyhlZGl0b3IsICRjdHJsLCAkc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbml0UGx1Z2lucyhlZGl0b3IuUExVR0lOUywgJHNjb3BlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkY3RybC5vblByZUluaXQoZWRpdG9yKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcG9zdDogKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJGN0cmw6IERvY3VtZW50RWRpdG9yQ29udHJvbGxlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyICRjb250YWluZXIgPSAkZWxlbWVudDtcclxuICAgICAgICAgICAgICAgIHZhciAkaGVhZGVyOiBhbnkgPSAkY29udGFpbmVyLmZpbmQoJy5kb2N1bWVudC1lZGl0b3ItaGVhZGVyJyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgJGNvbnRlbnQ6IGFueSA9ICRjb250YWluZXIuZmluZCgnLmRvY3VtZW50LWVkaXRvci1jb250ZW50Jyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgJGZvb3RlcjogYW55ID0gJGNvbnRhaW5lci5maW5kKCcuZG9jdW1lbnQtZWRpdG9yLWZvb3RlcicpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdEhlYWRlcigkaGVhZGVyLCAkY29udGVudCwgJGZvb3Rlcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRDb250ZW50KCRoZWFkZXIsICRjb250ZW50LCAkZm9vdGVyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdEZvb3RlcigkaGVhZGVyLCAkY29udGVudCwgJGZvb3Rlcik7XHJcblxyXG4gICAgICAgICAgICAgICAgJGN0cmwub25Jbml0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRkb2N1bWVudEVkaXRvcjogYW5ndWxhci5JQXVnbWVudGVkSlF1ZXJ5O1xyXG4gICAgICAgIGluaXRFbGVtZW50KCRlbGVtZW50OiBhbmd1bGFyLklBdWdtZW50ZWRKUXVlcnkpIHtcclxuICAgICAgICAgICAgdmFyICRwYXJlbnQgPSAkZWxlbWVudC5wYXJlbnQoKTtcclxuICAgICAgICAgICAgdmFyICRib2R5ID0gYW5ndWxhci5lbGVtZW50KCRlbGVtZW50WzBdLm93bmVyRG9jdW1lbnQuYm9keSk7XHJcbiAgICAgICAgICAgICRib2R5LmFwcGVuZCgkZWxlbWVudCk7XHJcblxyXG4gICAgICAgICAgICAkcGFyZW50Lm9uKFwiJGRlc3Ryb3lcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgJGVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdFRvb2xiYXIoJGN0cmw6IERvY3VtZW50RWRpdG9yQ29udHJvbGxlciwgJHNjb3BlOiBhbmd1bGFyLklTY29wZSwgJGVsZW1lbnQ6IGFuZ3VsYXIuSUF1Z21lbnRlZEpRdWVyeSkge1xyXG4gICAgICAgICAgICB2YXIgdG9vbGJhcklkID0gYGRvY3VtZW50LWVkaXRvci0keyRzY29wZS4kaWR9LXd5c2l3eWctdG9vbGJhcmA7XHJcbiAgICAgICAgICAgIHZhciAkdG9vbGJhciA9ICRlbGVtZW50LmZpbmQoXCIuZG9jdW1lbnQtZWRpdG9yLXd5c2l3eWctdG9vbGJhclwiKTtcclxuICAgICAgICAgICAgJHRvb2xiYXIucHJvcCgnaWQnLCB0b29sYmFySWQpO1xyXG4gICAgICAgICAgICAkY3RybC50b29sYmFySWQgPSB0b29sYmFySWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0Q29tbWFuZHMoZWRpdG9yLCAkY3RybDogRG9jdW1lbnRFZGl0b3JDb250cm9sbGVyLCAkc2NvcGU6IGFuZ3VsYXIuSVNjb3BlKSB7XHJcbiAgICAgICAgICAgIGVkaXRvci5EZWZpbmVJY29uKCdyZW1vdmVIZWFkZXInLCB7IE5BTUU6ICd0aW1lcy1jaXJjbGUnIH0pO1xyXG4gICAgICAgICAgICBlZGl0b3IuUmVnaXN0ZXJDb21tYW5kKCdyZW1vdmVIZWFkZXInLCB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1JlbW92ZSBIZWFkZXInLFxyXG4gICAgICAgICAgICAgICAgdW5kbzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGZvY3VzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcmVmcmVzaEFmdGVyQ2FsbGJhY2s6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogKGVkaXRvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICRjdHJsLndpdGhIZWFkZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZWRpdG9yLkRlZmluZUljb24oJ3JlbW92ZUZvb3RlcicsIHsgTkFNRTogJ3RpbWVzLWNpcmNsZScgfSk7XHJcbiAgICAgICAgICAgIGVkaXRvci5SZWdpc3RlckNvbW1hbmQoJ3JlbW92ZUZvb3RlcicsIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnUmVtb3ZlIEZvb3RlcicsXHJcbiAgICAgICAgICAgICAgICB1bmRvOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZm9jdXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICByZWZyZXNoQWZ0ZXJDYWxsYmFjazogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoZWRpdG9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGN0cmwud2l0aEZvb3RlciA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBlZGl0b3IuRGVmaW5lSWNvbigncGFnZUJyZWFrJywgeyBOQU1FOiAnY29sdW1ucycgfSk7XHJcbiAgICAgICAgICAgIGVkaXRvci5SZWdpc3RlckNvbW1hbmQoJ3BhZ2VCcmVhaycsIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnUGFnZSBCcmVhaycsXHJcbiAgICAgICAgICAgICAgICB1bmRvOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZm9jdXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICByZWZyZXNoQWZ0ZXJDYWxsYmFjazogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbiAoZWRpdG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5odG1sLmluc2VydCgnPGhyIGNsYXNzPVwiZnItcGFnZS1icmVha1wiPicpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0UGx1Z2lucyhQTFVHSU5TLCAkc2NvcGUpIHtcclxuICAgICAgICAgICAgUExVR0lOUy5vcmRlcmVkTGlzdFBsdWdpbiA9IChlZGl0b3IpID0+IG5ldyBPcmRlcmVkTGlzdFBsdWdpbihlZGl0b3IsICRzY29wZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgX2ZvbnRTaXplID0gUExVR0lOUy5mb250U2l6ZTtcclxuICAgICAgICAgICAgUExVR0lOUy5mb250U2l6ZSA9IChlZGl0b3IpID0+IG5ldyBGb250U2l6ZVBsdWdpbihlZGl0b3IsIF9mb250U2l6ZShlZGl0b3IpKTtcclxuXHJcbiAgICAgICAgICAgIFRhYmxlQ29sV2lkdGhQbHVnaW4ucmVnaXN0ZXIoUExVR0lOUyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0SGVhZGVyKCRoZWFkZXIsICRjb250ZW50LCAkZm9vdGVyKSB7XHJcbiAgICAgICAgICAgICRoZWFkZXIuZnJvYWxhRWRpdG9yKCd0b29sYmFyLmhpZGUnKTtcclxuICAgICAgICAgICAgJGhlYWRlci5vbignZnJvYWxhRWRpdG9yLmZvY3VzJywgKGUsIGVkaXRvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yLnRvb2xiYXIuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgJGNvbnRlbnQuZnJvYWxhRWRpdG9yKCd0b29sYmFyLmhpZGUnKTtcclxuICAgICAgICAgICAgICAgICRmb290ZXIuZnJvYWxhRWRpdG9yKCd0b29sYmFyLmhpZGUnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0Q29udGVudCgkaGVhZGVyLCAkY29udGVudCwgJGZvb3Rlcikge1xyXG4gICAgICAgICAgICAkY29udGVudC5vbignZnJvYWxhRWRpdG9yLmZvY3VzJywgKGUsIGVkaXRvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgJGhlYWRlci5mcm9hbGFFZGl0b3IoJ3Rvb2xiYXIuaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yLnRvb2xiYXIuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgJGZvb3Rlci5mcm9hbGFFZGl0b3IoJ3Rvb2xiYXIuaGlkZScpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluaXRGb290ZXIoJGhlYWRlciwgJGNvbnRlbnQsICRmb290ZXIpIHtcclxuICAgICAgICAgICAgJGZvb3Rlci5mcm9hbGFFZGl0b3IoJ3Rvb2xiYXIuaGlkZScpO1xyXG4gICAgICAgICAgICAkZm9vdGVyLm9uKCdmcm9hbGFFZGl0b3IuZm9jdXMnLCAoZSwgZWRpdG9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAkaGVhZGVyLmZyb2FsYUVkaXRvcigndG9vbGJhci5oaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkY29udGVudC5mcm9hbGFFZGl0b3IoJ3Rvb2xiYXIuaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yLnRvb2xiYXIuc2hvdygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIEFuZ3VsYXIubW9kdWxlKFwibmdEb2N1bWVudFwiKS5kaXJlY3RpdmUoXCJkb2N1bWVudEVkaXRvclwiLCBEb2N1bWVudEVkaXRvckRpcmVjdGl2ZSk7XHJcbn0iLCJtb2R1bGUgTmdEb2N1bWVudCB7XHJcbiAgICBjbGFzcyBEb2N1bWVudFBkZkNvbnRyb2xsZXIge1xyXG4gICAgICAgIG9uSW5pdChyZW5kZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyID0gcmVuZGVyO1xyXG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgX3JlbmRlcjogYW55O1xyXG4gICAgICAgIHJlbmRlcih1cmwpIHtcclxuICAgICAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXIodXJsKS5maW5hbGx5KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNMb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluaXRpYWxpemVkOiBib29sZWFuO1xyXG4gICAgICAgIGlzTG9hZGluZzogYm9vbGVhbjtcclxuICAgICAgICBpc0xvYWRlZDogYm9vbGVhbjtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfdXJsOiBzdHJpbmc7XHJcbiAgICAgICAgZ2V0IHVybCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdXJsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXQgdXJsKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5fdXJsID0gdmFsdWU7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXIodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBEb2N1bWVudFBkZkRpcmVjdGl2ZSB7XHJcbiAgICAgICAgc3RhdGljICRpbmplY3QgPSBbJyRxJ107XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgJHE6IGFuZ3VsYXIuSVFTZXJ2aWNlKSB7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzdHJpY3QgPSAnRSc7XHJcbiAgICAgICAgdHJhbnNjbHVkZSA9IHRydWU7XHJcbiAgICAgICAgdGVtcGxhdGVVcmwgPSAnZG9jdW1lbnQtcGRmLmh0bWwnO1xyXG4gICAgICAgIGNvbnRyb2xsZXIgPSBEb2N1bWVudFBkZkNvbnRyb2xsZXI7XHJcbiAgICAgICAgY29udHJvbGxlckFzID0gJ2RvY3VtZW50UGRmJztcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyID0gdHJ1ZTtcclxuICAgICAgICBzY29wZSA9IHtcclxuICAgICAgICAgICAgdXJsOiAnQCcsXHJcbiAgICAgICAgICAgIGlzTG9hZGVkOiAnPT8nXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsaW5rID0gKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJGN0cmw6IERvY3VtZW50UGRmQ29udHJvbGxlcikgPT4ge1xyXG4gICAgICAgICAgICB2YXIgJHBhZ2VzID0gJGVsZW1lbnQuZmluZChcIi5kb2N1bWVudC12aWV3ZXItcGFnZXNcIik7XHJcblxyXG4gICAgICAgICAgICAkY3RybC5vbkluaXQoKHVybCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyKCRzY29wZSwgJHBhZ2VzLCB1cmwpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlbmRlcigkc2NvcGUsICRwYWdlcywgdXJsKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9IHRoaXMuJHEuZGVmZXIoKTtcclxuXHJcbiAgICAgICAgICAgICRwYWdlcy5lbXB0eSgpO1xyXG4gICAgICAgICAgICBQREZKUy5nZXREb2N1bWVudCh1cmwpLnRoZW4ocGRmID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdGFza3MgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGlkeCA9IDA7IGlkeCA8IHBkZi5udW1QYWdlczsgaWR4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXNrcy5wdXNoKHBkZi5nZXRQYWdlKGlkeCArIDEpLnRoZW4ocGFnZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB4ID0gcGFnZS5wYWdlTnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVQYWdlKHBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLiRxLmFsbCh0YXNrcykudGhlbihjYW52YXNlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHBhZ2VzLmFwcGVuZChjYW52YXNlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShwZGYpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3JlYXRlUGFnZShwYWdlOiBQREZQYWdlUHJveHkpIHtcclxuICAgICAgICAgICAgdmFyIHNjYWxlID0gMS41O1xyXG4gICAgICAgICAgICB2YXIgdmlld3BvcnQgPSBwYWdlLmdldFZpZXdwb3J0KHNjYWxlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciAkY2FudmFzID0gYW5ndWxhci5lbGVtZW50KCc8Y2FudmFzIGNsYXNzPVwiZG9jdW1lbnQtdmlld2VyLXBhZ2VcIj48L2NhbnZhcz4nKTtcclxuICAgICAgICAgICAgJGNhbnZhcy5hdHRyKFwicGFnZVwiLCBwYWdlLnBhZ2VOdW1iZXIpO1xyXG4gICAgICAgICAgICB2YXIgY2FudmFzOiBhbnkgPSAkY2FudmFzLmdldCgwKTtcclxuICAgICAgICAgICAgdmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IHZpZXdwb3J0LmhlaWdodDtcclxuICAgICAgICAgICAgY2FudmFzLndpZHRoID0gdmlld3BvcnQud2lkdGg7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmVuZGVyQ29udGV4dCA9IHtcclxuICAgICAgICAgICAgICAgIGNhbnZhc0NvbnRleHQ6IGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICB2aWV3cG9ydDogdmlld3BvcnRcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHBhZ2UucmVuZGVyKHJlbmRlckNvbnRleHQpO1xyXG4gICAgICAgICAgICByZXR1cm4gJGNhbnZhcztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQW5ndWxhci5tb2R1bGUoXCJuZ0RvY3VtZW50XCIpLmRpcmVjdGl2ZShcImRvY3VtZW50UGRmXCIsIERvY3VtZW50UGRmRGlyZWN0aXZlKTtcclxufSIsIm1vZHVsZSBOZ0RvY3VtZW50IHtcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSURvY3VtZW50UmVhZGVyIHtcclxuICAgICAgICBnZXRIZWFkZXIoKTogc3RyaW5nO1xyXG4gICAgICAgIGdldENvbnRlbnQoKTogc3RyaW5nO1xyXG4gICAgICAgIGdldEZvb3RlcigpOiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIERvY3VtZW50UmVhZGVyIGltcGxlbWVudHMgSURvY3VtZW50UmVhZGVyIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihodG1sOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5fJGh0bWwgPSAkKCc8ZGl2PjwvZGl2PicpLmFwcGVuZChodG1sIHx8ICcnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgXyRodG1sOiBKUXVlcnk7XHJcblxyXG4gICAgICAgIGdldEhlYWRlcigpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZCgnaGVhZGVyJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRDb250ZW50KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIC8vIFRvRG86IGlmIDxjb250ZW50PjwvY29udGVudD4gZG9lcyBub3QgZXhpc3QgYnV0IHRoZXJlIGlzIGh0bWwsIHdyYXAgdGhlIGh0bWwgaW4gYSBjb250ZW50IHRhZ1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZCgnY29udGVudCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0Rm9vdGVyKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkKCdmb290ZXInKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgY2hpbGQoc2VsZWN0b3I6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl8kaHRtbC5jaGlsZHJlbihzZWxlY3RvcikuaHRtbCgpIHx8ICcnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIm1vZHVsZSBOZ0RvY3VtZW50IHtcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSURvY3VtZW50V3JpdGVyT3B0aW9ucyB7XHJcbiAgICAgICAgZXhjbHVkZUhlYWRlcjogYm9vbGVhbjtcclxuICAgICAgICBleGNsdWRlRm9vdGVyOiBib29sZWFuO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSURvY3VtZW50V3JpdGVyIHtcclxuICAgICAgICB3cml0ZSgpOiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIERvY3VtZW50V3JpdGVyIGltcGxlbWVudHMgSURvY3VtZW50V3JpdGVyIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihoZWFkZXI6IHN0cmluZywgY29udGVudDogc3RyaW5nLCBmb290ZXI6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLl9oZWFkZXIgPSBoZWFkZXI7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnRlbnQgPSBjb250ZW50O1xyXG4gICAgICAgICAgICB0aGlzLl9mb290ZXIgPSBmb290ZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgaGFzSGVhZGVyKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGVhZGVyICE9IG51bGwgJiYgdGhpcy5faGVhZGVyLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgaGFzRm9vdGVyKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9vdGVyICE9IG51bGwgJiYgdGhpcy5fZm9vdGVyLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB3cml0ZShvcHRpb25zPzogSURvY3VtZW50V3JpdGVyT3B0aW9ucyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHZhciBodG1sID0gW107XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNIZWFkZXIgJiYgIW9wdGlvbnMuZXhjbHVkZUhlYWRlcilcclxuICAgICAgICAgICAgICAgIGh0bWwucHVzaChgPGhlYWRlcj4ke3RoaXMuX2hlYWRlcn08L2hlYWRlcj5gKTtcclxuXHJcbiAgICAgICAgICAgIGh0bWwucHVzaChgPGNvbnRlbnQ+JHt0aGlzLl9jb250ZW50fTwvY29udGVudD5gKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc0Zvb3RlciAmJiAhb3B0aW9ucy5leGNsdWRlRm9vdGVyKVxyXG4gICAgICAgICAgICAgICAgaHRtbC5wdXNoKGA8Zm9vdGVyPiR7dGhpcy5fZm9vdGVyfTwvZm9vdGVyPmApO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGh0bWwuam9pbihcIlwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgX2hlYWRlcjogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgX2NvbnRlbnQ6IHN0cmluZztcclxuICAgICAgICBwcml2YXRlIF9mb290ZXI6IHN0cmluZztcclxuICAgIH1cclxufSIsIm1vZHVsZSBOZ0RvY3VtZW50IHtcclxuICAgIGV4cG9ydCBjbGFzcyBGb250U2l6ZVBsdWdpbiB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBlZGl0b3IsIHByaXZhdGUgZm9udFNpemUpIHtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFwcGx5KHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHZhciByYW5nZXMgPSB0aGlzLmVkaXRvci5zZWxlY3Rpb24ucmFuZ2VzKCksXHJcbiAgICAgICAgICAgICAgICBoYXNSYW5nZXMgPSByYW5nZXMuZmlsdGVyKCB4ID0+ICF4LmNvbGxhcHNlZCApLmxlbmd0aCA+IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAoaGFzUmFuZ2VzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvbnRTaXplLmFwcGx5KHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyICRzdGFydCA9ICQodGhpcy5lZGl0b3Iuc2VsZWN0aW9uLmVsZW1lbnQoKSksXHJcbiAgICAgICAgICAgICAgICAkbGlzdCA9ICRzdGFydC5wYXJlbnRzKFwib2wsIHVsXCIpLmZpcnN0KCksXHJcbiAgICAgICAgICAgICAgICBpc0xpc3QgPSAkbGlzdC5sZW5ndGggPiAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFpc0xpc3QpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAkbGlzdC5jc3MoXCJmb250LXNpemVcIiwgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVmcmVzaChhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZm9udFNpemUucmVmcmVzaChhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlZnJlc2hPblNob3coYSwgYikge1xyXG4gICAgICAgICAgICB0aGlzLmZvbnRTaXplLnJlZnJlc2hPblNob3coYSwgYik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwibW9kdWxlIE5nRG9jdW1lbnQge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBPcmRlcmVkTGlzdFBsdWdpbiB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBlZGl0b3IsIHByaXZhdGUgJHNjb3BlKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3JkZXJlZExpc3RUeXBlcyA9IHtcclxuICAgICAgICAgICAgICAgICdsaXN0VHlwZS1kZWNpbWFsJzogJ051bWJlcmVkJyxcclxuICAgICAgICAgICAgICAgICdsaXN0VHlwZS1sb3dlclJvbWFuJzogJ0xvd2VyIHJvbWFuJyxcclxuICAgICAgICAgICAgICAgICdsaXN0VHlwZS11cHBlclJvbWFuJzogJ1VwcGVyIHJvbWFuJyxcclxuICAgICAgICAgICAgICAgICdsaXN0VHlwZS1sb3dlckFscGhhJzogJ0xvd2VyIGFscGhhJyxcclxuICAgICAgICAgICAgICAgICdsaXN0VHlwZS11cHBlckFscGhhJzogJ1VwcGVyIGFscGhhJ1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmVkaXRvclN0YXRpYyA9ICRbJ0Zyb2FsYUVkaXRvciddO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5lZGl0b3JTdGF0aWMuUE9QVVBfVEVNUExBVEVTW09yZGVyZWRMaXN0UGx1Z2luLlRFTVBMQVRFX05BTUVdID0gJ1tfQlVUVE9OU19dJztcclxuXHJcbiAgICAgICAgICAgICQuZXh0ZW5kKHRoaXMuZWRpdG9yU3RhdGljLkRFRkFVTFRTLCB7XHJcbiAgICAgICAgICAgICAgICBvcmRlckxpc3RCdXR0b25zOiBbJ29yZGVyZWRMaXN0VHlwZSddXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZWRpdG9yLiRlbC5vbignY2xpY2snLCAnb2w+bGknLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93UG9wdXAoZS50YXJnZXQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluaXQoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLiRwb3B1cClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yU3RhdGljLkRlZmluZUljb24oJ29yZGVyZWRMaXN0VHlwZScsIHsgTkFNRTogJ2xpc3Qtb2wnIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmVkaXRvclN0YXRpYy5SZWdpc3RlckNvbW1hbmQoJ29yZGVyZWRMaXN0VHlwZScsIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnT3JkZXIgTGlzdCBUeXBlJyxcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdkcm9wZG93bicsXHJcbiAgICAgICAgICAgICAgICB1bmRvOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZm9jdXM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcmVmcmVzaEFmdGVyQ2FsbGJhY2s6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBvcHRpb25zOiB0aGlzLm9yZGVyZWRMaXN0VHlwZXMsXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogKGNtZCwgdmFsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdHlsZSh2YWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBidXR0b25zOiBzdHJpbmdbXSA9IFtcclxuICAgICAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiZnItYnV0dG9uc1wiPmAsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVkaXRvci5idXR0b24uYnVpbGRMaXN0KHRoaXMuZWRpdG9yLm9wdHMub3JkZXJMaXN0QnV0dG9ucyksXHJcbiAgICAgICAgICAgICAgICBgPC9kaXY+YFxyXG4gICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0ge1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uczogYnV0dG9ucy5qb2luKCcnKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLiRwb3B1cCA9IHRoaXMuZWRpdG9yLnBvcHVwcy5jcmVhdGUoT3JkZXJlZExpc3RQbHVnaW4uVEVNUExBVEVfTkFNRSwgdGVtcGxhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0U3R5bGUodmFsKSB7XHJcbiAgICAgICAgICAgIHZhciAkb2wgPSB0aGlzLiRsaS5wYXJlbnQoXCJvbFwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXModGhpcy5vcmRlcmVkTGlzdFR5cGVzKTtcclxuICAgICAgICAgICAgJG9sLnJlbW92ZUNsYXNzKGtleXMuam9pbignICcpKTtcclxuICAgICAgICAgICAgJG9sLmFkZENsYXNzKHZhbCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLiRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNob3dQb3B1cChsaSkge1xyXG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yLnBvcHVwcy5zZXRDb250YWluZXIoT3JkZXJlZExpc3RQbHVnaW4uVEVNUExBVEVfTkFNRSwgdGhpcy5lZGl0b3IuJHRiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLmVkaXRvci4kaWZyYW1lLm9mZnNldCgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kbGkgPSAkKGxpKTtcclxuXHJcbiAgICAgICAgICAgIHZhciByZWxPZmZzZXQgPSB0aGlzLiRsaS5vZmZzZXQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSB7XHJcbiAgICAgICAgICAgICAgICBsZWZ0OiByZWxPZmZzZXQubGVmdCArIHBhcmVudC5sZWZ0LFxyXG4gICAgICAgICAgICAgICAgdG9wOiByZWxPZmZzZXQudG9wICsgcGFyZW50LnRvcFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gdGhpcy4kbGkub3V0ZXJIZWlnaHQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBsZWZ0ID0gb2Zmc2V0LmxlZnQgKyAxMDtcclxuICAgICAgICAgICAgdmFyIHRvcCA9IG9mZnNldC50b3AgKyAyMDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yLnBvcHVwcy5zaG93KE9yZGVyZWRMaXN0UGx1Z2luLlRFTVBMQVRFX05BTUUsIGxlZnQsIHRvcCwgaGVpZ2h0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGhpZGVQb3B1cCgpIHtcclxuICAgICAgICAgICAgdGhpcy4kbGkgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLmVkaXRvci5wb3B1cHMuaGlkZShPcmRlcmVkTGlzdFBsdWdpbi5URU1QTEFURV9OQU1FKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgJHBvcHVwOiBhbnk7XHJcbiAgICAgICAgcHJpdmF0ZSBlZGl0b3JTdGF0aWM6IGFueTtcclxuICAgICAgICBwcml2YXRlICRsaTogYW55O1xyXG4gICAgICAgIHByaXZhdGUgb3JkZXJlZExpc3RUeXBlczogYW55O1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIFRFTVBMQVRFX05BTUUgPSAnb3JkZXJMaXN0UGx1Z2luLnBvcHVwJztcclxuICAgIH1cclxufSIsIm1vZHVsZSBOZ0RvY3VtZW50IHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgVGFibGVDb2xXaWR0aFBsdWdpbiB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIHJlZ2lzdGVyKFBMVUdJTlMpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBwbHVnaW4gPSBuZXcgVGFibGVDb2xXaWR0aFBsdWdpbigpO1xyXG4gICAgICAgICAgICBQTFVHSU5TLnRhYmxlQ29sV2lkdGggPSAoZWRpdG9yKSA9PiBwbHVnaW4uaW5pdChlZGl0b3IpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGVkaXRvclN0YXRpYyA9ICRbJ0Zyb2FsYUVkaXRvciddO1xyXG5cclxuICAgICAgICAgICAgZWRpdG9yU3RhdGljLlBPUFVQX1RFTVBMQVRFU1tUYWJsZUNvbFdpZHRoUGx1Z2luLlRFTVBMQVRFX05BTUVdID0gJ1tfQ1VTVE9NX0xBWUVSX10nO1xyXG5cclxuICAgICAgICAgICAgJC5leHRlbmQoZWRpdG9yU3RhdGljLkRFRkFVTFRTLCB7XHJcbiAgICAgICAgICAgICAgICB0YWJsZUNvbFdpZHRoOiBbJ3RhYmxlQ29sV2lkdGgnXVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGVkaXRvclN0YXRpYy5EZWZpbmVJY29uKCd0YWJsZUNvbFdpZHRoJywgeyBOQU1FOiAnYXJyb3dzLWgnIH0pO1xyXG4gICAgICAgICAgICBlZGl0b3JTdGF0aWMuUmVnaXN0ZXJDb21tYW5kKCd0YWJsZUNvbFdpZHRoJywge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdDb2x1bW4gV2lkdGgnLFxyXG4gICAgICAgICAgICAgICAgdW5kbzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGZvY3VzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHJlZnJlc2hBZnRlckNhbGxiYWNrOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uIChjbWQsIHZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBsdWdpbi5zaG93UG9wdXAodGhpcywgY21kKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0KGVkaXRvcikge1xyXG4gICAgICAgICAgICB2YXIgY3VzdG9tTGF5ZXI6IHN0cmluZ1tdID0gW2BcclxuICAgICAgICAgICAgICAgIDxmb3JtIGNsYXNzPVwiZnItY3VzdG9tLWxheWVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZyLWlucHV0LWxpbmVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJDb2x1bW4gV2lkdGhcIiB2YWx1ZT1cIlwiIHRhYmluZGV4PVwiMVwiPjxsYWJlbD5Db2x1bW4gV2lkdGg8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmci1hY3Rpb24tYnV0dG9uc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImZyLWNvbW1hbmQgZnItc3VibWl0XCIgdGFiaW5kZXg9XCIyXCI+VXBkYXRlPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgYF07XHJcblxyXG4gICAgICAgICAgICB2YXIgdGVtcGxhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBjdXN0b21fbGF5ZXI6IGN1c3RvbUxheWVyXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciAkcG9wdXAgPSBlZGl0b3IucG9wdXBzLmNyZWF0ZShUYWJsZUNvbFdpZHRoUGx1Z2luLlRFTVBMQVRFX05BTUUsIHRlbXBsYXRlKTtcclxuICAgICAgICAgICAgdmFyICRmb3JtID0gJHBvcHVwLmZpbmQoXCJmb3JtXCIpO1xyXG4gICAgICAgICAgICB2YXIgJGlucHV0ID0gJHBvcHVwLmZpbmQoXCJpbnB1dFwiKTtcclxuICAgICAgICAgICAgdmFyICR1cGRhdGUgPSAkcG9wdXAuZmluZChcImJ1dHRvbi5mci1zdWJtaXRcIik7XHJcblxyXG4gICAgICAgICAgICAkZm9ybS5vbignc3VibWl0JywgKCRlOiBhbmd1bGFyLklBbmd1bGFyRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICRlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAkZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q29sV2lkdGgoJGlucHV0LnZhbCgpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGlkZVBvcHVwKGVkaXRvcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdmFyIHN1Ym1pdE9uRW50ZXIgPSAoJGU6IGFuZ3VsYXIuSUFuZ3VsYXJFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCRlWyd3aGljaCddICE9IDEzKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICAkZm9ybS5zdWJtaXQoKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICR1cGRhdGUub24oJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgJGZvcm0uc3VibWl0KCk7XHJcbiAgICAgICAgICAgIH0pLm9uKCdrZXl1cCcsIHN1Ym1pdE9uRW50ZXIpO1xyXG5cclxuICAgICAgICAgICAgJGlucHV0Lm9uKCdrZXl1cCcsIHN1Ym1pdE9uRW50ZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0Q29sV2lkdGgodmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLiRjb2wpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICB2YXIgJHJvdyA9IHRoaXMuJGNvbC5wYXJlbnQoKTtcclxuICAgICAgICAgICAgdmFyIGlkeCA9ICRyb3cuY2hpbGRyZW4oKS5pbmRleCh0aGlzLiRjb2wpO1xyXG4gICAgICAgICAgICB2YXIgJHRhYmxlID0gJHJvdy5wYXJlbnRzKFwidGFibGVcIik7XHJcbiAgICAgICAgICAgIHZhciAkdGRzID0gJHRhYmxlLmZpbmQoYHRyID4gdGQ6ZXEoJHtpZHh9KWApO1xyXG4gICAgICAgICAgICB2YXIgJHRocyA9ICR0YWJsZS5maW5kKGB0ciA+IHRoOmVxKCR7aWR4fSlgKTtcclxuXHJcbiAgICAgICAgICAgICR0ZHMuY3NzKFwid2lkdGhcIiwgdmFsdWUpO1xyXG4gICAgICAgICAgICAkdGhzLmNzcyhcIndpZHRoXCIsIHZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNob3dQb3B1cChlZGl0b3IsIGNtZCkge1xyXG4gICAgICAgICAgICBlZGl0b3IucG9wdXBzLnNldENvbnRhaW5lcihUYWJsZUNvbFdpZHRoUGx1Z2luLlRFTVBMQVRFX05BTUUsIGVkaXRvci4kdGIpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kY29sID0gYW5ndWxhci5lbGVtZW50KGVkaXRvci5zZWxlY3Rpb24uZ2V0KCkuZm9jdXNOb2RlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSBlZGl0b3IuJGlmcmFtZS5vZmZzZXQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLiRjb2wub2Zmc2V0KCk7XHJcbiAgICAgICAgICAgIHZhciBsZWZ0ID0gb2Zmc2V0LmxlZnQgKyAodGhpcy4kY29sLm91dGVyV2lkdGgoKSAvIDIpICsgcGFyZW50LmxlZnQ7XHJcbiAgICAgICAgICAgIHZhciB0b3AgPSBvZmZzZXQudG9wICsgdGhpcy4kY29sLm91dGVySGVpZ2h0KCkgKyBwYXJlbnQudG9wO1xyXG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gdGhpcy4kY29sLm91dGVySGVpZ2h0KCk7XHJcblxyXG4gICAgICAgICAgICBlZGl0b3IucG9wdXBzLnNob3coVGFibGVDb2xXaWR0aFBsdWdpbi5URU1QTEFURV9OQU1FLCBsZWZ0LCB0b3AsIGhlaWdodCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgJHBvcHVwID0gZWRpdG9yLnBvcHVwcy5nZXQoVGFibGVDb2xXaWR0aFBsdWdpbi5URU1QTEFURV9OQU1FKTtcclxuICAgICAgICAgICAgdmFyICRpbnB1dCA9ICRwb3B1cC5maW5kKFwiaW5wdXRcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgd2lkdGggPSB0aGlzLiRjb2wuZ2V0KDApLnN0eWxlLndpZHRoIHx8IHRoaXMuJGNvbC5jc3MoXCJ3aWR0aFwiKTtcclxuICAgICAgICAgICAgaWYgKHdpZHRoKVxyXG4gICAgICAgICAgICAgICAgJGlucHV0LmFkZENsYXNzKFwiZnItbm90LWVtcHR5XCIpO1xyXG4gICAgICAgICAgICAkaW5wdXQudmFsKHdpZHRoKTtcclxuXHJcbiAgICAgICAgICAgICRpbnB1dC5mb2N1cygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaGlkZVBvcHVwKGVkaXRvcikge1xyXG4gICAgICAgICAgICB0aGlzLiRjb2wgPSBudWxsO1xyXG4gICAgICAgICAgICBlZGl0b3IucG9wdXBzLmhpZGUoVGFibGVDb2xXaWR0aFBsdWdpbi5URU1QTEFURV9OQU1FKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZWRpdG9yU3RhdGljOiBhbnk7XHJcbiAgICAgICAgcHJpdmF0ZSAkY29sOiBhbmd1bGFyLklBdWdtZW50ZWRKUXVlcnk7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgVEVNUExBVEVfTkFNRSA9ICd0YWJsZUNvbFdpZHRoUGx1Z2luLnBvcHVwJztcclxuICAgIH1cclxuXHJcbn0iXX0=