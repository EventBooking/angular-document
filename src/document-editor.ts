module NgDocument {

    class DocumentEditorController {
        constructor() {
            this.header = this.header || '';
            this.content = this.content || '';
            this.footer = this.footer || '';
        }

        onPreInit(editor, toolbarId) {
            this.defaultOptions = {
                iframe: true,
                enter: editor.ENTER_BR,
                width: 816,
                toolbarContainer: `#${toolbarId}`,
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
            return angular.extend({}, this.defaultOptions, options, {
                placeholderText: 'Content'
            });
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
        header: string;
        content: string;
        footer: string;
        withHeader: boolean;
        withFooter: boolean;
    }

    interface IDocumentWriterOptions {
        excludeHeader: boolean;
        excludeFooter: boolean;
    }

    interface IDocumentWriter {
        write(): string;
    }

    class DocumentWriter implements IDocumentWriter {
        constructor(header: string, content: string, footer: string) {
            this._header = header;
            this._content = content;
            this._footer = footer;
        }

        get hasHeader(): boolean {
            return this._header != null && this._header.length > 0;
        }

        get hasFooter(): boolean {
            return this._footer != null && this._footer.length > 0;
        }

        write(options?: IDocumentWriterOptions): string {
            var html = [];

            if (this.hasHeader && !options.excludeHeader)
                html.push(`<header>${this._header}</header>`);

            html.push(`<content>${this._content}</content>`);

            if (this.hasFooter && !options.excludeFooter)
                html.push(`<footer>${this._footer}</footer>`);

            return html.join("");
        }

        private _header: string;
        private _content: string;
        private _footer: string;
    }

    interface IDocumentReader {
        getHeader(): string;
        getContent(): string;
        getFooter(): string;
    }

    class DocumentReader implements IDocumentReader {
        constructor(html: string) {
            this._$html = $('<div></div>').append(html || '');
        }

        private _$html: JQuery;

        getHeader(): string {
            return this.child('header');
        }

        getContent(): string {
            // ToDo: if <content></content> does not exist but there is html, wrap the html in a content tag
            return this.child('content');
        }

        getFooter(): string {
            return this.child('footer');
        }

        private child(selector: string): string {
            return this._$html.children(selector).html() || '';
        }
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
            pre: ($scope, $element, $attrs, $ctrl: DocumentEditorController) => {
                var toolbarId = `document-editor-${$scope.$id}-wysiwyg-toolbar`;
                var $toolbar = $element.find(".document-editor-wysiwyg-toolbar");
                $toolbar.prop('id', toolbarId);

                var editor: any = $['FroalaEditor'];

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

                $ctrl.onPreInit(editor, toolbarId);
            },
            post: ($scope, $element, $attrs, $ctrl: DocumentEditorController) => {

                var $header: any = $('.document-editor-header', $element);
                var $content: any = $('.document-editor-content', $element);
                var $footer: any = $('.document-editor-footer', $element);

                $header.froalaEditor('toolbar.hide');
                //$content.froalaEditor('toolbar.hide');
                $footer.froalaEditor('toolbar.hide');

                $header.on('froalaEditor.focus', (e, editor) => {
                    editor.toolbar.show();
                    $content.froalaEditor('toolbar.hide');
                    $footer.froalaEditor('toolbar.hide');
                });

                $content.on('froalaEditor.focus', (e, editor) => {
                    $header.froalaEditor('toolbar.hide');
                    editor.toolbar.show();
                    $footer.froalaEditor('toolbar.hide');
                });

                $footer.on('froalaEditor.focus', (e, editor) => {
                    $header.froalaEditor('toolbar.hide');
                    $content.froalaEditor('toolbar.hide');
                    editor.toolbar.show();
                });

                $ctrl.onInit();
            }
        }


    }

    Angular.module("ngDocument").directive("documentEditor", DocumentEditorDirective);
}