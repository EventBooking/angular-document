module NgDocument {

    export class OrderedListPlugin {
        constructor(private editor, private $scope) {
            this.orderedListTypes = {
                'listType-decimal': 'Numbered',
                'listType-lowerRoman': 'Lower roman',
                'listType-upperRoman': 'Upper roman',
                'listType-lowerAlpha': 'Lower alpha',
                'listType-upperAlpha': 'Upper alpha'
            }

            this.editorStatic = $['FroalaEditor'];

            this.editorStatic.POPUP_TEMPLATES[OrderedListPlugin.TEMPLATE_NAME] = '[_BUTTONS_]';

            $.extend(this.editorStatic.DEFAULTS, {
                orderListButtons: ['orderedListType']
            });

            editor.$el.on('click', 'ol>li', (e) => {
                this.showPopup(e.target);
            });
        }

        init() {
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
                callback: (cmd, val) => {
                    this.setStyle(val);
                }
            });

            var buttons: string[] = [
                `<div class="fr-buttons">`,
                this.editor.button.buildList(this.editor.opts.orderListButtons),
                `</div>`
            ];

            var template = {
                buttons: buttons.join('')
            }

            this.$popup = this.editor.popups.create(OrderedListPlugin.TEMPLATE_NAME, template);
        }

        setStyle(val) {
            var $ol = this.$li.parent("ol");

            var keys = Object.keys(this.orderedListTypes);
            $ol.removeClass(keys.join(' '));
            $ol.addClass(val);

            this.$scope.$apply();
        }

        showPopup(li) {
            this.init();

            this.editor.popups.setContainer(OrderedListPlugin.TEMPLATE_NAME, this.editor.$tb);

            var parent = this.editor.$iframe.offset();

            this.$li = $(li);

            var relOffset = this.$li.offset();

            var offset = {
                left: relOffset.left + parent.left,
                top: relOffset.top + parent.top
            }

            var height = this.$li.outerHeight();

            var left = offset.left + 10;
            var top = offset.top + 20;

            this.editor.popups.show(OrderedListPlugin.TEMPLATE_NAME, left, top, height);
        }

        hidePopup() {
            this.$li = null;
            this.editor.popups.hide(OrderedListPlugin.TEMPLATE_NAME);
        }

        private $popup: any;
        private editorStatic: any;
        private $li: any;
        private orderedListTypes: any;
        private static TEMPLATE_NAME = 'orderListPlugin.popup';
    }
}