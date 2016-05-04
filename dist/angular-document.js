Angular.module("ngDocument", ['froala']);
var NgDocument;
(function (NgDocument) {
    var DocumentEditorController = (function () {
        function DocumentEditorController() {
            this.header = this.header || '';
            this.content = this.content || '';
            this.footer = this.footer || '';
            this.headerOptions = this.headerOptions || {};
            this.contentOptions = this.contentOptions || {};
            this.footerOptions = this.footerOptions || {};
        }
        DocumentEditorController.prototype.onPreInit = function () {
        };
        DocumentEditorController.prototype.onInit = function () {
            this.setContent(this._html);
            if (this.header.length > 0)
                this.withHeader = true;
            if (this.footer.length > 0)
                this.withFooter = true;
            this.initialized = true;
        };
        DocumentEditorController.prototype.insertBase64Image = function (editor, image) {
            var reader = new FileReader();
            reader.onload = function (readerEvt) {
                editor.image.insert(readerEvt.target.result);
            };
            reader.readAsDataURL(image);
        };
        Object.defineProperty(DocumentEditorController.prototype, "headerConfig", {
            get: function () {
                var _this = this;
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
                    toolbarButtonsMD: [],
                    toolbarButtonsSM: [],
                    toolbarButtonsXS: [],
                    events: {
                        'froalaEditor.image.beforeUpload': function (e, editor, images) {
                            _this.insertBase64Image(editor, images[0]);
                            return false;
                        }
                    }
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentEditorController.prototype, "contentConfig", {
            get: function () {
                var _this = this;
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
                    toolbarButtonsMD: [],
                    toolbarButtonsSM: [],
                    toolbarButtonsXS: [],
                    events: {
                        'froalaEditor.image.beforeUpload': function (e, editor, images) {
                            _this.insertBase64Image(editor, images[0]);
                            return false;
                        }
                    }
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentEditorController.prototype, "footerConfig", {
            get: function () {
                var _this = this;
                return angular.extend(this.footerOptions || {}, {
                    placeholderText: 'Footer',
                    width: 816,
                    toolbarSticky: false,
                    toolbarButtons: [
                        'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|',
                        'color', 'inlineStyle', 'paragraphStyle', '|', 'removeFooter',
                        '-',
                        'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '|',
                        'insertHR', 'insertLink', 'insertImage', 'insertTable', 'undo', 'redo', 'clearFormatting', 'html'
                    ],
                    toolbarButtonsMD: [],
                    toolbarButtonsSM: [],
                    toolbarButtonsXS: [],
                    events: {
                        'froalaEditor.image.beforeUpload': function (e, editor, images) {
                            _this.insertBase64Image(editor, images[0]);
                            return false;
                        }
                    }
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentEditorController.prototype, "html", {
            get: function () {
                var writer = new DocumentWriter(this.header, this.content, this.footer);
                var options = {
                    excludeHeader: !this.withHeader,
                    excludeFooter: !this.withFooter
                };
                return writer.write(options);
            },
            set: function (value) {
                this._html = value;
                if (!this.initialized)
                    return;
                this.setContent(value);
            },
            enumerable: true,
            configurable: true
        });
        DocumentEditorController.prototype.setContent = function (value) {
            var parser = new DocumentReader(value);
            this.header = parser.getHeader();
            this.content = parser.getContent();
            this.footer = parser.getFooter();
        };
        return DocumentEditorController;
    }());
    var DocumentWriter = (function () {
        function DocumentWriter(header, content, footer) {
            this._header = header;
            this._content = content;
            this._footer = footer;
        }
        Object.defineProperty(DocumentWriter.prototype, "hasHeader", {
            get: function () {
                return this._header != null && this._header.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentWriter.prototype, "hasFooter", {
            get: function () {
                return this._footer != null && this._footer.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        DocumentWriter.prototype.write = function (options) {
            var html = [];
            if (this.hasHeader && !options.excludeHeader)
                html.push("<header>" + this._header + "</header>");
            html.push("<content>" + this._content + "</content>");
            if (this.hasFooter && !options.excludeFooter)
                html.push("<footer>" + this._footer + "</footer>");
            return html.join("");
        };
        return DocumentWriter;
    }());
    var DocumentReader = (function () {
        function DocumentReader(html) {
            this._$html = $('<div></div>').append(html || '');
        }
        DocumentReader.prototype.getHeader = function () {
            return this.child('header');
        };
        DocumentReader.prototype.getContent = function () {
            return this.child('content');
        };
        DocumentReader.prototype.getFooter = function () {
            return this.child('footer');
        };
        DocumentReader.prototype.child = function (selector) {
            return this._$html.children(selector).html() || '';
        };
        return DocumentReader;
    }());
    var DocumentEditorDirective = (function () {
        function DocumentEditorDirective() {
            this.restrict = 'E';
            this.transclude = true;
            this.templateUrl = 'document-editor.html';
            this.controller = DocumentEditorController;
            this.controllerAs = 'documentEditor';
            this.bindToController = true;
            this.scope = {
                headerOptions: '=?',
                bodyOptions: '=?',
                footerOptions: '=?',
                html: '=?'
            };
            this.link = {
                pre: function ($scope, $element, $attrs, $ctrl) {
                    var editor = $['FroalaEditor'];
                    editor.DefineIcon('removeHeader', { NAME: 'times-circle' });
                    editor.RegisterCommand('removeHeader', {
                        title: 'Remove Header',
                        undo: true,
                        focus: true,
                        refreshAfterCallback: true,
                        callback: function (editor) {
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
                        callback: function (editor) {
                            $ctrl.withFooter = false;
                            $scope.$apply();
                        }
                    });
                    $ctrl.onPreInit();
                },
                post: function ($scope, $element, $attrs, $ctrl) {
                    $ctrl.onInit();
                }
            };
        }
        return DocumentEditorDirective;
    }());
    Angular.module("ngDocument").directive("documentEditor", DocumentEditorDirective);
})(NgDocument || (NgDocument = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1kb2N1bWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHAudHMiLCIuLi9zcmMvZG9jdW1lbnQtZWRpdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQ0F6QyxJQUFPLFVBQVUsQ0FrUmhCO0FBbFJELFdBQU8sVUFBVSxFQUFDLENBQUM7SUFFZjtRQUNJO1lBQ0ksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztZQUNoQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1lBQ2xDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7WUFDaEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxJQUFJLEVBQUUsQ0FBQztZQUM5QyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLElBQUksRUFBRSxDQUFDO1lBQ2hELElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsSUFBSSxFQUFFLENBQUM7UUFDbEQsQ0FBQztRQUVELDRDQUFTLEdBQVQ7UUFDQSxDQUFDO1FBRUQseUNBQU0sR0FBTjtZQUNJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzVCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDM0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2dCQUN2QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUMzQixJQUFJ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LEVBQUUsSUFBSTt3QkFDMUIsUUFBUSxFQUFFLFVBQUMsTUFBTTs0QkFDYixLQUFLLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQzs0QkFDekIsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO3dCQUNwQixDQUFDO3FCQUNKLENBQUMsQ0FBQztvQkFFSCxNQUFNLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFBRSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDO29CQUM1RCxNQUFNLENBQUMsZUFBZSxDQUFDLGNBQWMsRUFBRTt3QkFDbkMsS0FBSyxFQUFFLGVBQWU7d0JBQ3RCLElBQUksRUFBRSxJQUFJO3dCQUNWLEtBQUssRUFBRSxJQUFJO3dCQUNYLG9CQUFvQixFQUFFLElBQUk7d0JBQzFCLFFBQVEsRUFBRSxVQUFDLE1BQU07NEJBQ2IsS0FBSyxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7NEJBQ3pCLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQzt3QkFDcEIsQ0FBQztxQkFDSixDQUFDLENBQUM7b0JBRUgsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUN0QixDQUFDO2dCQUNELElBQUksRUFBRSxVQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEtBQStCO29CQUM1RCxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ25CLENBQUM7YUFDSixDQUFBO1FBR0wsQ0FBQztRQUFELDhCQUFDO0lBQUQsQ0FBQyxBQWxERCxJQWtEQztJQUVELE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsU0FBUyxDQUFDLGdCQUFnQixFQUFFLHVCQUF1QixDQUFDLENBQUM7QUFDdEYsQ0FBQyxFQWxSTSxVQUFVLEtBQVYsVUFBVSxRQWtSaEIiLCJzb3VyY2VzQ29udGVudCI6WyJBbmd1bGFyLm1vZHVsZShcIm5nRG9jdW1lbnRcIiwgWydmcm9hbGEnXSk7IiwibW9kdWxlIE5nRG9jdW1lbnQge1xyXG5cclxuICAgIGNsYXNzIERvY3VtZW50RWRpdG9yQ29udHJvbGxlciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGVhZGVyID0gdGhpcy5oZWFkZXIgfHwgJyc7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuY29udGVudCB8fCAnJztcclxuICAgICAgICAgICAgdGhpcy5mb290ZXIgPSB0aGlzLmZvb3RlciB8fCAnJztcclxuICAgICAgICAgICAgdGhpcy5oZWFkZXJPcHRpb25zID0gdGhpcy5oZWFkZXJPcHRpb25zIHx8IHt9O1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnRPcHRpb25zID0gdGhpcy5jb250ZW50T3B0aW9ucyB8fCB7fTtcclxuICAgICAgICAgICAgdGhpcy5mb290ZXJPcHRpb25zID0gdGhpcy5mb290ZXJPcHRpb25zIHx8IHt9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb25QcmVJbml0KCkge1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb25Jbml0KCkge1xyXG4gICAgICAgICAgICB0aGlzLnNldENvbnRlbnQodGhpcy5faHRtbCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhlYWRlci5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy53aXRoSGVhZGVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZm9vdGVyLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICB0aGlzLndpdGhGb290ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgaW5zZXJ0QmFzZTY0SW1hZ2UoZWRpdG9yOiBhbnksIGltYWdlOiBGaWxlKSB7XHJcbiAgICAgICAgICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgICAgICByZWFkZXIub25sb2FkID0gKHJlYWRlckV2dDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3IuaW1hZ2UuaW5zZXJ0KHJlYWRlckV2dC50YXJnZXQucmVzdWx0KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoaW1hZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGhlYWRlckNvbmZpZygpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gYW5ndWxhci5leHRlbmQodGhpcy5oZWFkZXJPcHRpb25zIHx8IHt9LCB7XHJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlclRleHQ6ICdIZWFkZXInLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IDgxNixcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJTdGlja3k6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdG9vbGJhckJ1dHRvbnM6IFtcclxuICAgICAgICAgICAgICAgICAgICAnYm9sZCcsICdpdGFsaWMnLCAndW5kZXJsaW5lJywgJ3N0cmlrZVRocm91Z2gnLCAnc3Vic2NyaXB0JywgJ3N1cGVyc2NyaXB0JywgJ2ZvbnRGYW1pbHknLCAnZm9udFNpemUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbG9yJywgJ2lubGluZVN0eWxlJywgJ3BhcmFncmFwaFN0eWxlJywgJ3wnLCAncmVtb3ZlSGVhZGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAnLScsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3BhcmFncmFwaEZvcm1hdCcsICdhbGlnbicsICdmb3JtYXRPTCcsICdmb3JtYXRVTCcsICdvdXRkZW50JywgJ2luZGVudCcsICdxdW90ZScsICd8JyxcclxuICAgICAgICAgICAgICAgICAgICAnaW5zZXJ0SFInLCAnaW5zZXJ0TGluaycsICdpbnNlcnRJbWFnZScsICdpbnNlcnRUYWJsZScsICd1bmRvJywgJ3JlZG8nLCAnY2xlYXJGb3JtYXR0aW5nJywgJ2h0bWwnXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgdG9vbGJhckJ1dHRvbnNNRDogW1xyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJCdXR0b25zU006IFtcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICB0b29sYmFyQnV0dG9uc1hTOiBbXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2Zyb2FsYUVkaXRvci5pbWFnZS5iZWZvcmVVcGxvYWQnOiAoZSwgZWRpdG9yLCBpbWFnZXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRCYXNlNjRJbWFnZShlZGl0b3IsIGltYWdlc1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGNvbnRlbnRDb25maWcoKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZXh0ZW5kKHRoaXMuY29udGVudE9wdGlvbnMgfHwge30sIHtcclxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyVGV4dDogJ0NvbnRlbnQnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IDgxNixcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJTdGlja3k6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdG9vbGJhckJ1dHRvbnM6IFtcclxuICAgICAgICAgICAgICAgICAgICAnYm9sZCcsICdpdGFsaWMnLCAndW5kZXJsaW5lJywgJ3N0cmlrZVRocm91Z2gnLCAnc3Vic2NyaXB0JywgJ3N1cGVyc2NyaXB0JywgJ2ZvbnRGYW1pbHknLCAnZm9udFNpemUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbG9yJywgJ2lubGluZVN0eWxlJywgJ3BhcmFncmFwaFN0eWxlJyxcclxuICAgICAgICAgICAgICAgICAgICAnLScsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3BhcmFncmFwaEZvcm1hdCcsICdhbGlnbicsICdmb3JtYXRPTCcsICdmb3JtYXRVTCcsICdvdXRkZW50JywgJ2luZGVudCcsICdxdW90ZScsICd8JyxcclxuICAgICAgICAgICAgICAgICAgICAnaW5zZXJ0SFInLCAnaW5zZXJ0TGluaycsICdpbnNlcnRJbWFnZScsICdpbnNlcnRUYWJsZScsICd1bmRvJywgJ3JlZG8nLCAnY2xlYXJGb3JtYXR0aW5nJywgJ2h0bWwnXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgdG9vbGJhckJ1dHRvbnNNRDogW1xyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJCdXR0b25zU006IFtcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICB0b29sYmFyQnV0dG9uc1hTOiBbXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2Zyb2FsYUVkaXRvci5pbWFnZS5iZWZvcmVVcGxvYWQnOiAoZSwgZWRpdG9yLCBpbWFnZXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRCYXNlNjRJbWFnZShlZGl0b3IsIGltYWdlc1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGZvb3RlckNvbmZpZygpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gYW5ndWxhci5leHRlbmQodGhpcy5mb290ZXJPcHRpb25zIHx8IHt9LCB7XHJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlclRleHQ6ICdGb290ZXInLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IDgxNixcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJTdGlja3k6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdG9vbGJhckJ1dHRvbnM6IFtcclxuICAgICAgICAgICAgICAgICAgICAnYm9sZCcsICdpdGFsaWMnLCAndW5kZXJsaW5lJywgJ3N0cmlrZVRocm91Z2gnLCAnc3Vic2NyaXB0JywgJ3N1cGVyc2NyaXB0JywgJ2ZvbnRGYW1pbHknLCAnZm9udFNpemUnLCAnfCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbG9yJywgJ2lubGluZVN0eWxlJywgJ3BhcmFncmFwaFN0eWxlJywgJ3wnLCdyZW1vdmVGb290ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICctJyxcclxuICAgICAgICAgICAgICAgICAgICAncGFyYWdyYXBoRm9ybWF0JywgJ2FsaWduJywgJ2Zvcm1hdE9MJywgJ2Zvcm1hdFVMJywgJ291dGRlbnQnLCAnaW5kZW50JywgJ3F1b3RlJywgJ3wnLFxyXG4gICAgICAgICAgICAgICAgICAgICdpbnNlcnRIUicsICdpbnNlcnRMaW5rJywgJ2luc2VydEltYWdlJywgJ2luc2VydFRhYmxlJywgJ3VuZG8nLCAncmVkbycsICdjbGVhckZvcm1hdHRpbmcnLCAnaHRtbCdcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICB0b29sYmFyQnV0dG9uc01EOiBbXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgdG9vbGJhckJ1dHRvbnNTTTogW1xyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJCdXR0b25zWFM6IFtcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBldmVudHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnZnJvYWxhRWRpdG9yLmltYWdlLmJlZm9yZVVwbG9hZCc6IChlLCBlZGl0b3IsIGltYWdlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluc2VydEJhc2U2NEltYWdlKGVkaXRvciwgaW1hZ2VzWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIF9odG1sOiBzdHJpbmc7XHJcbiAgICAgICAgZ2V0IGh0bWwoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIHdyaXRlciA9IG5ldyBEb2N1bWVudFdyaXRlcih0aGlzLmhlYWRlciwgdGhpcy5jb250ZW50LCB0aGlzLmZvb3Rlcik7XHJcbiAgICAgICAgICAgIHZhciBvcHRpb25zOiBJRG9jdW1lbnRXcml0ZXJPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgZXhjbHVkZUhlYWRlcjogIXRoaXMud2l0aEhlYWRlcixcclxuICAgICAgICAgICAgICAgIGV4Y2x1ZGVGb290ZXI6ICF0aGlzLndpdGhGb290ZXJcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHdyaXRlci53cml0ZShvcHRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldCBodG1sKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5faHRtbCA9IHZhbHVlO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Q29udGVudCh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHNldENvbnRlbnQodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgcGFyc2VyID0gbmV3IERvY3VtZW50UmVhZGVyKHZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5oZWFkZXIgPSBwYXJzZXIuZ2V0SGVhZGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudCA9IHBhcnNlci5nZXRDb250ZW50KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZm9vdGVyID0gcGFyc2VyLmdldEZvb3RlcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaGVhZGVyT3B0aW9uczogYW55O1xyXG4gICAgICAgIGNvbnRlbnRPcHRpb25zOiBhbnk7XHJcbiAgICAgICAgZm9vdGVyT3B0aW9uczogYW55O1xyXG4gICAgICAgIGluaXRpYWxpemVkOiBib29sZWFuO1xyXG4gICAgICAgIGhlYWRlcjogc3RyaW5nO1xyXG4gICAgICAgIGNvbnRlbnQ6IHN0cmluZztcclxuICAgICAgICBmb290ZXI6IHN0cmluZztcclxuICAgICAgICB3aXRoSGVhZGVyOiBib29sZWFuO1xyXG4gICAgICAgIHdpdGhGb290ZXI6IGJvb2xlYW47XHJcbiAgICB9XHJcblxyXG4gICAgaW50ZXJmYWNlIElEb2N1bWVudFdyaXRlck9wdGlvbnMge1xyXG4gICAgICAgIGV4Y2x1ZGVIZWFkZXI6IGJvb2xlYW47XHJcbiAgICAgICAgZXhjbHVkZUZvb3RlcjogYm9vbGVhbjtcclxuICAgIH1cclxuXHJcbiAgICBpbnRlcmZhY2UgSURvY3VtZW50V3JpdGVyIHtcclxuICAgICAgICB3cml0ZSgpOiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3MgRG9jdW1lbnRXcml0ZXIgaW1wbGVtZW50cyBJRG9jdW1lbnRXcml0ZXIge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKGhlYWRlcjogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcsIGZvb3Rlcjogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2hlYWRlciA9IGhlYWRlcjtcclxuICAgICAgICAgICAgdGhpcy5fY29udGVudCA9IGNvbnRlbnQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2Zvb3RlciA9IGZvb3RlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBoYXNIZWFkZXIoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9oZWFkZXIgIT0gbnVsbCAmJiB0aGlzLl9oZWFkZXIubGVuZ3RoID4gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBoYXNGb290ZXIoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb290ZXIgIT0gbnVsbCAmJiB0aGlzLl9mb290ZXIubGVuZ3RoID4gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHdyaXRlKG9wdGlvbnM/OiBJRG9jdW1lbnRXcml0ZXJPcHRpb25zKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIGh0bWwgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc0hlYWRlciAmJiAhb3B0aW9ucy5leGNsdWRlSGVhZGVyKVxyXG4gICAgICAgICAgICAgICAgaHRtbC5wdXNoKGA8aGVhZGVyPiR7dGhpcy5faGVhZGVyfTwvaGVhZGVyPmApO1xyXG5cclxuICAgICAgICAgICAgaHRtbC5wdXNoKGA8Y29udGVudD4ke3RoaXMuX2NvbnRlbnR9PC9jb250ZW50PmApO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzRm9vdGVyICYmICFvcHRpb25zLmV4Y2x1ZGVGb290ZXIpXHJcbiAgICAgICAgICAgICAgICBodG1sLnB1c2goYDxmb290ZXI+JHt0aGlzLl9mb290ZXJ9PC9mb290ZXI+YCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaHRtbC5qb2luKFwiXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfaGVhZGVyOiBzdHJpbmc7XHJcbiAgICAgICAgcHJpdmF0ZSBfY29udGVudDogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgX2Zvb3Rlcjogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGludGVyZmFjZSBJRG9jdW1lbnRSZWFkZXIge1xyXG4gICAgICAgIGdldEhlYWRlcigpOiBzdHJpbmc7XHJcbiAgICAgICAgZ2V0Q29udGVudCgpOiBzdHJpbmc7XHJcbiAgICAgICAgZ2V0Rm9vdGVyKCk6IHN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBEb2N1bWVudFJlYWRlciBpbXBsZW1lbnRzIElEb2N1bWVudFJlYWRlciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoaHRtbDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuXyRodG1sID0gJCgnPGRpdj48L2Rpdj4nKS5hcHBlbmQoaHRtbCB8fCAnJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIF8kaHRtbDogSlF1ZXJ5O1xyXG5cclxuICAgICAgICBnZXRIZWFkZXIoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGQoJ2hlYWRlcicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0Q29udGVudCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZCgnY29udGVudCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0Rm9vdGVyKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkKCdmb290ZXInKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgY2hpbGQoc2VsZWN0b3I6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl8kaHRtbC5jaGlsZHJlbihzZWxlY3RvcikuaHRtbCgpIHx8ICcnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBEb2N1bWVudEVkaXRvckRpcmVjdGl2ZSB7XHJcbiAgICAgICAgcmVzdHJpY3QgPSAnRSc7XHJcbiAgICAgICAgdHJhbnNjbHVkZSA9IHRydWU7XHJcbiAgICAgICAgdGVtcGxhdGVVcmwgPSAnZG9jdW1lbnQtZWRpdG9yLmh0bWwnO1xyXG4gICAgICAgIGNvbnRyb2xsZXIgPSBEb2N1bWVudEVkaXRvckNvbnRyb2xsZXI7XHJcbiAgICAgICAgY29udHJvbGxlckFzID0gJ2RvY3VtZW50RWRpdG9yJztcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyID0gdHJ1ZTtcclxuICAgICAgICBzY29wZSA9IHtcclxuICAgICAgICAgICAgaGVhZGVyT3B0aW9uczogJz0/JyxcclxuICAgICAgICAgICAgYm9keU9wdGlvbnM6ICc9PycsXHJcbiAgICAgICAgICAgIGZvb3Rlck9wdGlvbnM6ICc9PycsXHJcbiAgICAgICAgICAgIGh0bWw6ICc9PydcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxpbmsgPSB7XHJcbiAgICAgICAgICAgIHByZTogKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJGN0cmw6IERvY3VtZW50RWRpdG9yQ29udHJvbGxlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGVkaXRvcjogYW55ID0gJFsnRnJvYWxhRWRpdG9yJ107XHJcblxyXG4gICAgICAgICAgICAgICAgZWRpdG9yLkRlZmluZUljb24oJ3JlbW92ZUhlYWRlcicsIHsgTkFNRTogJ3RpbWVzLWNpcmNsZScgfSk7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3IuUmVnaXN0ZXJDb21tYW5kKCdyZW1vdmVIZWFkZXInLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdSZW1vdmUgSGVhZGVyJyxcclxuICAgICAgICAgICAgICAgICAgICB1bmRvOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvY3VzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlZnJlc2hBZnRlckNhbGxiYWNrOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoZWRpdG9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRjdHJsLndpdGhIZWFkZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGVkaXRvci5EZWZpbmVJY29uKCdyZW1vdmVGb290ZXInLCB7IE5BTUU6ICd0aW1lcy1jaXJjbGUnIH0pO1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yLlJlZ2lzdGVyQ29tbWFuZCgncmVtb3ZlRm9vdGVyJywge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUmVtb3ZlIEZvb3RlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgdW5kbzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBmb2N1czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICByZWZyZXNoQWZ0ZXJDYWxsYmFjazogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKGVkaXRvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkY3RybC53aXRoRm9vdGVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAkY3RybC5vblByZUluaXQoKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcG9zdDogKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJGN0cmw6IERvY3VtZW50RWRpdG9yQ29udHJvbGxlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgJGN0cmwub25Jbml0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBBbmd1bGFyLm1vZHVsZShcIm5nRG9jdW1lbnRcIikuZGlyZWN0aXZlKFwiZG9jdW1lbnRFZGl0b3JcIiwgRG9jdW1lbnRFZGl0b3JEaXJlY3RpdmUpO1xyXG59Il19