module NgDocument {

    class DocumentEditorController {
        constructor() {
            this.header = this.header || '';
            this.content = this.content || '';
            this.footer = this.footer || '';
            this.headerOptions = this.headerOptions || {};
            this.contentOptions = this.contentOptions || {};
            this.footerOptions = this.footerOptions || {};
        }

        onPreInit() {
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

        get headerConfig(): any {
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
                toolbarButtonsMD: [
                ],
                toolbarButtonsSM: [
                ],
                toolbarButtonsXS: [
                ],
                events: {
                    'froalaEditor.image.beforeUpload': (e, editor, images) => {
                        this.insertBase64Image(editor, images[0]);
                        return false;
                    }
                }
            });
        }

        get contentConfig(): any {
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
                toolbarButtonsMD: [
                ],
                toolbarButtonsSM: [
                ],
                toolbarButtonsXS: [
                ],
                events: {
                    'froalaEditor.image.beforeUpload': (e, editor, images) => {
                        this.insertBase64Image(editor, images[0]);
                        return false;
                    }
                }
            });
        }

        get footerConfig(): any {
            return angular.extend(this.footerOptions || {}, {
                placeholderText: 'Footer',
                width: 816,
                toolbarSticky: false,
                toolbarButtons: [
                    'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|',
                    'color', 'inlineStyle', 'paragraphStyle', '|','removeFooter',
                    '-',
                    'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '|',
                    'insertHR', 'insertLink', 'insertImage', 'insertTable', 'undo', 'redo', 'clearFormatting', 'html'
                ],
                toolbarButtonsMD: [
                ],
                toolbarButtonsSM: [
                ],
                toolbarButtonsXS: [
                ],
                events: {
                    'froalaEditor.image.beforeUpload': (e, editor, images) => {
                        this.insertBase64Image(editor, images[0]);
                        return false;
                    }
                }
            });
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

                $ctrl.onPreInit();
            },
            post: ($scope, $element, $attrs, $ctrl: DocumentEditorController) => {
                $ctrl.onInit();
            }
        }


    }

    Angular.module("ngDocument").directive("documentEditor", DocumentEditorDirective);
}