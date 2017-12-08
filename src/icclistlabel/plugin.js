/*global CKEDITOR*/
import keycode from 'keycode'
import {toggleWidgetState} from "../../../ckeditor-iccexception-plugin/src/common/common";

((() => {
    let title = 'icclistlabel';
    let block = [
        'indent',
        'outdent',
        'iccnumberedlist',
        'iccbulletedlist',
        'standardexception',
        'exceptionlist'
    ];

    let blockNestedExceptions = (editor, event, names) => {
        let sender = event.sender;
        let label = sender.editables.label.$;
        let widgets = [];

        names.forEach(function (name) {
            let widget = editor.commands[name] !== undefined ? editor.commands[name] : null;

            if (widget) {
                widgets.push(widget);
            }
        });

        toggleWidgetState(widgets, label);
    };

    const replaceRangeWithClosestEditableRoot = (range, element) => {
        if (range.root.equals(element)) {
            return range
        } else {
            const newRange = new CKEDITOR.dom.range(element)

            newRange.moveToRange(range)
            return newRange
        }
    };

    CKEDITOR.plugins.add(title, {
        requires: 'widget',
        icons: title,

        init(editor) {
            editor.widgets.add(
                title, {
                    button: 'Add a list label',
                    template: '<span class="label">1.</span>',
                    draggable: false,
                    editables: {
                        label: {
                            selector: 'span.label'
                        }
                    },

                    /**
                     * @param {CKEDITOR.htmlParser.element} element
                     * @returns {boolean}
                     */
                    upcast: element => {
                        return element.name === 'span' &&
                            element.hasClass('label') &&
                            element.getAscendant('p') !== null &&
                            element.getAscendant('p').getAscendant('li') !== null;
                    },

                    // function fires when processing imported widget's editable area
                    data: (event) => {
                        blockNestedExceptions(editor, event, block);
                    },

                    // function fires when processing imported widget's editable area
                    edit: (event) => {
                        blockNestedExceptions(editor, event, block);
                    },

                    init: () => {
                        editor.on(
                            'key', ({data: {keyCode, domEvent}, cancel}) => {
                                // Check if target element matches this widget's element.
                                if (this.element.equals(domEvent.getTarget())) {
                                    // Check if delete or backspace was pressed.

                                    if (keyCode === keycode('delete') || keyCode === keycode('backspace')) {
                                        const selection = this.editor.getSelection()
                                        /** @type {CKEDITOR.dom.range} range */
                                        let range = selection.getRanges()[0];

                                        if (!range || !range.collapsed) {
                                            return;
                                        }

                                        range = replaceRangeWithClosestEditableRoot(range, this.element);

                                        // If backspace is going to remove the label element, cancel the event.
                                        if (range.checkStartOfBlock() && range.getPreviousNode().equals(this.element)) {
                                            cancel();
                                        }
                                    }
                                }
                            }
                        )
                    }
                }
            )
        }
    })
}))();
