module NgDocument {

    class DocumentEditorController {
        constructor() {
            this.header = this.header || '';
            this.content = this.content || '';
            this.footer = this.footer || '';
        }

        onPreInit(editor) {
            this.defaultOptions = {
                iframe: true,
                enter: editor.ENTER_P,
                width: 816,
                zIndex: 100,
                toolbarContainer: `#${this.toolbarId}`,
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
                    'froalaEditor.image.beforeUpload': (e, editor, images) => {
                        this.insertBase64Image(editor, images[0]);
                        return false;
                    }
                }
            };

            this.headerConfig = this.getHeaderConfig(this.headerOptions || {});
            this.contentConfig = this.getContentConfig(this.contentOptions || {});
            this.footerConfig = this.getFooterConfig(this.footerOptions || {});
        }

        onInit() {
            this.setContent(this._html);
            if (this.header.length > 0)
                this.withHeader = true;
            if (this.footer.length > 0)
                this.withFooter = true;
            this.initialized = true;
        }

        private insertBase64Image(editor: any, image: File) {
            var reader = new FileReader();
            reader.onload = (readerEvt: any) => {
                editor.image.insert(readerEvt.target.result);
            };
            reader.readAsDataURL(image);
        }

        getHeaderConfig(options: any): any {
            var config = angular.extend({}, this.defaultOptions, options, {
                placeholderText: 'Header'
            });

            var toolbars = ['toolbarButtons', 'toolbarButtonsMD', 'toolbarButtonsSM', 'toolbarButtonsXS'];
            toolbars.forEach(x => config[x] = config[x].concat(['|', 'removeHeader']));

            return config;
        }

        getContentConfig(options: any): any {
            var config = angular.extend({}, this.defaultOptions, options, {
                placeholderText: 'Content'
            });

            var toolbars = ['toolbarButtons', 'toolbarButtonsMD', 'toolbarButtonsSM', 'toolbarButtonsXS'];
            toolbars.forEach(x => config[x] = config[x].concat(['pageBreak']));

            return config;
        }

        getFooterConfig(options: any): any {
            var config = angular.extend({}, this.defaultOptions, options, {
                placeholderText: 'Footer'
            });

            var toolbars = ['toolbarButtons', 'toolbarButtonsMD', 'toolbarButtonsSM', 'toolbarButtonsXS'];
            toolbars.forEach(x => config[x] = config[x].concat(['|', 'removeFooter']));

            return config;
        }

        private _html: string;
        get html(): string {
            var writer = new DocumentWriter(this.header, this.content, this.footer);
            var options: IDocumentWriterOptions = {
                excludeHeader: !this.withHeader,
                excludeFooter: !this.withFooter
            };
            return writer.write(options);
        }

        set html(value: string) {
            this._html = value;
            if (!this.initialized)
                return;
            this.setContent(value);
        }

        private setContent(value: string) {
            var parser = new DocumentReader(value);
            this.header = parser.getHeader();
            this.content = parser.getContent();
            this.footer = parser.getFooter();
        }

        headerOptions: any;
        contentOptions: any;
        footerOptions: any;
        defaultOptions: any;
        headerConfig: any;
        contentConfig: any;
        footerConfig: any;

        initialized: boolean;
        toolbarId: string;
        header: string;
        content: string;
        footer: string;
        withHeader: boolean;
        withFooter: boolean;
    }

    class DocumentEditorDirective {
        restrict = 'E';
        transclude = true;
        templateUrl = 'document-editor.html';
        controller = DocumentEditorController;
        controllerAs = 'documentEditor';
        bindToController = true;
        scope = {
            headerOptions: '=?',
            bodyOptions: '=?',
            footerOptions: '=?',
            html: '=?'
        }

        link = {
            pre: ($scope: angular.IScope, $element: angular.IAugmentedJQuery, $attrs: angular.IAttributes, $ctrl: DocumentEditorController) => {
                var editor: any = $['FroalaEditor'];

                this.initElement($element);
                this.initToolbar($ctrl, $scope, $element);
                this.initCommands(editor, $ctrl, $scope);
                this.initPlugins(editor.PLUGINS, $scope);

                $ctrl.onPreInit(editor);
            },
            post: ($scope, $element, $attrs, $ctrl: DocumentEditorController) => {
                var $container = $element;
                var $header: any = $container.find('.document-editor-header');
                var $content: any = $container.find('.document-editor-content');
                var $footer: any = $container.find('.document-editor-footer');

                this.initHeader($header, $content, $footer);
                this.initContent($header, $content, $footer);
                this.initFooter($header, $content, $footer);

                $ctrl.onInit();
            }
        }

        $documentEditor: angular.IAugmentedJQuery;
        initElement($element: angular.IAugmentedJQuery) {
            var $parent = $element.parent();
            var $body = angular.element($element[0].ownerDocument.body);
            $body.append($element);
            
            $parent.on("$destroy", () => {
                $element.remove();
            });
        }

        initToolbar($ctrl: DocumentEditorController, $scope: angular.IScope, $element: angular.IAugmentedJQuery) {
            var toolbarId = `document-editor-${$scope.$id}-wysiwyg-toolbar`;
            var $toolbar = $element.find(".document-editor-wysiwyg-toolbar");
            $toolbar.prop('id', toolbarId);
            $ctrl.toolbarId = toolbarId;
        }

        initCommands(editor, $ctrl: DocumentEditorController, $scope: angular.IScope) {
            editor.DefineIcon('removeHeader', { NAME: 'times-circle' });
            editor.RegisterCommand('removeHeader', {
                title: 'Remove Header',
                undo: true,
                focus: true,
                refreshAfterCallback: true,
                callback: (editor) => {
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
                callback: (editor) => {
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
        }

        initPlugins(PLUGINS, $scope) {
            PLUGINS.orderedListPlugin = (editor) => new OrderedListPlugin(editor, $scope);

            var _fontSize = PLUGINS.fontSize;
            PLUGINS.fontSize = (editor) => new FontSizePlugin(editor, _fontSize(editor));
        }

        initHeader($header, $content, $footer) {
            $header.froalaEditor('toolbar.hide');
            $header.on('froalaEditor.focus', (e, editor) => {
                editor.toolbar.show();
                $content.froalaEditor('toolbar.hide');
                $footer.froalaEditor('toolbar.hide');
            });
        }

        initContent($header, $content, $footer) {
            $content.on('froalaEditor.focus', (e, editor) => {
                $header.froalaEditor('toolbar.hide');
                editor.toolbar.show();
                $footer.froalaEditor('toolbar.hide');
            });
        }

        initFooter($header, $content, $footer) {
            $footer.froalaEditor('toolbar.hide');
            $footer.on('froalaEditor.focus', (e, editor) => {
                $header.froalaEditor('toolbar.hide');
                $content.froalaEditor('toolbar.hide');
                editor.toolbar.show();
            });
        }
    }


    Angular.module("ngDocument").directive("documentEditor", DocumentEditorDirective);
}