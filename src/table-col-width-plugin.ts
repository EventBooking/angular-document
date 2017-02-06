module NgDocument {

    export class TableColWidthPlugin {
        constructor() {

        }

        static register(PLUGINS) {

            var plugin = new TableColWidthPlugin();
            PLUGINS.tableColWidth = (editor) => plugin.init(editor);

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
        }

        init(editor) {
            var customLayer: string[] = [`
                <form class="fr-custom-layer">
                    <div class="fr-input-line">
                        <input type="text" placeholder="Column Width" value="" tabindex="1"><label>Column Width</label>
                    </div>
                    <div class="fr-action-buttons">
                        <button type="submit" class="fr-command fr-submit" tabindex="2">Update</button>
                    </div>
                </div>
            `];

            var template = {
                custom_layer: customLayer
            }

            var $popup = editor.popups.create(TableColWidthPlugin.TEMPLATE_NAME, template);
            var $form = $popup.find("form");
            var $input = $popup.find("input");
            var $update = $popup.find("button.fr-submit");

            $form.on('submit', ($e: angular.IAngularEvent) => {
                $e.preventDefault();
                $e.stopPropagation();
                this.setColWidth($input.val());
                this.hidePopup(editor);
            });

            var submitOnEnter = ($e: angular.IAngularEvent) => {
                if ($e['which'] != 13)
                    return;

                $form.submit();
            };

            $update.on('click', () => {
                $form.submit();
            }).on('keyup', submitOnEnter);

            $input.on('keyup', submitOnEnter);
        }

        setColWidth(value) {
            if (!this.$col)
                return;

            var $row = this.$col.parent();
            var idx = $row.children().index(this.$col);
            var n = idx + 1;
            var $table = $row.parents("table");
            var $allRows = $table.find("> tbody > tr");
            var $cells = $allRows.find("td, th");
            var $column = $cells.filter(`:nth-child(${n}):not([colspan])`);

            $column.css("width", value);
        }

        getCell(editor): angular.IAugmentedJQuery {
            var $element = angular.element(editor.selection.get().focusNode);
            if (!$element.is("td, th"))
                $element = angular.element($element.parents("td, th"));
            return $element;
        }

        showPopup(editor, cmd) {
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
        }

        hidePopup(editor) {
            this.$col = null;
            editor.popups.hide(TableColWidthPlugin.TEMPLATE_NAME);
        }

        private editorStatic: any;
        private $col: angular.IAugmentedJQuery;
        private static TEMPLATE_NAME = 'tableColWidthPlugin.popup';
    }

}