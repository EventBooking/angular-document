module NgDocument {
    export class FontSizePlugin {
        constructor(private editor, private fontSize) {
        }

        apply(value) {
            var ranges = this.editor.selection.ranges(),
                hasRanges = ranges.filter( x => !x.collapsed ).length > 0;

            if (hasRanges) {
                this.fontSize.apply(value);
                return;
            }

            var $start = $(this.editor.selection.element()),
                $list = $start.parents("ol, ul").first(),
                isList = $list.length > 0;

            if (!isList)
                return;

            $list.css("font-size", value);
        }

        refresh(a) {
            this.fontSize.refresh(a);
        }

        refreshOnShow(a, b) {
            this.fontSize.refreshOnShow(a, b);
        }
    }
}