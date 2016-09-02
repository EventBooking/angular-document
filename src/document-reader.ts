module NgDocument {
    export interface IDocumentReader {
        getHeader(): string;
        getContent(): string;
        getFooter(): string;
    }

    export class DocumentReader implements IDocumentReader {
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
}