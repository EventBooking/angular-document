module NgDocument {
    export interface IDocumentWriterOptions {
        excludeHeader: boolean;
        excludeFooter: boolean;
    }

    export interface IDocumentWriter {
        write(): string;
    }

    export class DocumentWriter implements IDocumentWriter {
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
}