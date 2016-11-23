declare module NgDocument {
}
declare module NgDocument {
}
declare module NgDocument {
    interface IDocumentReader {
        getHeader(): string;
        getContent(): string;
        getFooter(): string;
    }
    class DocumentReader implements IDocumentReader {
        constructor(html: string);
        private _$html;
        getHeader(): string;
        getContent(): string;
        getFooter(): string;
        private child(selector);
    }
}
declare module NgDocument {
    interface IDocumentWriterOptions {
        excludeHeader: boolean;
        excludeFooter: boolean;
    }
    interface IDocumentWriter {
        write(): string;
    }
    class DocumentWriter implements IDocumentWriter {
        constructor(header: string, content: string, footer: string);
        hasHeader: boolean;
        hasFooter: boolean;
        write(options?: IDocumentWriterOptions): string;
        private _header;
        private _content;
        private _footer;
    }
}
declare module NgDocument {
    class FontSizePlugin {
        private editor;
        private fontSize;
        constructor(editor: any, fontSize: any);
        apply(value: any): void;
        refresh(a: any): void;
        refreshOnShow(a: any, b: any): void;
    }
}
declare module NgDocument {
    class OrderedListPlugin {
        private editor;
        private $scope;
        constructor(editor: any, $scope: any);
        init(): void;
        setStyle(val: any): void;
        showPopup(li: any): void;
        hidePopup(): void;
        private $popup;
        private editorStatic;
        private $li;
        private orderedListTypes;
        private static TEMPLATE_NAME;
    }
}
