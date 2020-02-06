/**
 * clone function
 * @param obj
 * @returns {*}
 */
function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

/**
 * for number in function
 * @type {*[]}
 */
var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

/**
 * number to words
 * @param num
 * @returns {string}
 */
function inWords(num) {
    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + '' : '';
    return str;
}


function init() {
    document.getElementById('json-file').addEventListener('change', handleFileSelect, false);
}

/**
 * handle file selected
 * @param event
 */
function handleFileSelect(event) {
    const reader = new FileReader();
    reader.onload = handleFileLoad;
    reader.readAsText(event.target.files[0]);

}

/**
 * handl file loads
 * @param event
 */
function handleFileLoad(event) {
    try {
        var all = JSON.parse(event.target.result);
        app.flds = all.fields;
        app.old = all.old;
    } catch (e) {
        console.log(e.message);
        alert('Input file error');
    }

    // document.getElementById('fileContent').textContent = ;
}

/**
 * download json
 * @param exportObj
 * @param exportName
 */
function downloadObjectAsJson(exportObj, exportName) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

var app = new Vue({
    el: '#app',
    data: {
        code: '',
        theme: 'bootstrap', // default theme
        method: 'get', // default methods
        old: '',
        flds: [], // list of field
        // type of inputs
        typ: [
            'row',
            'input',
            'textaera',
            'select',
            'submit',
            'form-divider',
        ],
        // raw field for edit
        raw: {
            type: 'input',
            name: '',
            label: '',
            size: 12,
            id: '',
            options: ''
        }
    },
    mounted() {
        // sematicui
        this.initSemanticui();

    }, computed: {
        // size for handle
        siz: function () {
            if (this.theme == 'semanticui') {
                return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
            }
            return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        },

        // calculate max column count
        maxSize: function () {
            if (this.theme == 'semanticui') {
                return 16;
            } else {
                return 12;
            }
        }
    }, methods: {

        // set old default
        defaultOld: function () {
            this.old = $("#old").attr('placeholder');
        },
        // make labael
        makeLabel: function (field, inp) {

            var out = '';
            // set default id
            if (field.id.trim() == '') {
                field.id = field.name;
            }


            switch (this.theme) {
                case "bootstrap":
                    // make bootstrap column
                    out += `\t\t <div class="col-md-${field.size} mt-3">\n`;
                    out += `\t\t\t <div class="form-group">\n`;
                    out += `\t\t\t\t <label for="${field.id}"> \n`;
                    out += `\t\t\t\t\t {{__('${field.label}')}} \n`;
                    out += `\t\t\t\t </label> \n`;
                    out += inp;
                    out += `\t\t\t </div>\n`;
                    out += `\t\t </div>\n`;

                    break;
                case "semanticui":
                    // make semanticui column
                    out += `\t\t <div class="${$.trim(inWords(field.size))} wide column">\n`;
                    out += `\t\t\t <div class="field">\n`;
                    out += `\t\t\t\t <label for="${field.id}"> \n`;
                    out += `\t\t\t\t\t {{__('${field.label}')}} \n`;
                    out += `\t\t\t\t </label> \n`;
                    out += `\t\t\t\t <div class="ui input"> \n`;
                    out += '\t\t' + inp;
                    out += `\t\t\t\t </div> \n`;
                    out += `\t\t\t </div>\n`;
                    out += `\t\t </div>\n`;

                    break;
                case "materialize":
                    // make bootstrap column
                    out += `\t\t <div class="input-field col s${field.size}">\n`;
                    out += inp;
                    out += `\t\t\t\t <label for="${field.id}"> \n`;
                    out += `\t\t\t\t\t {{__('${field.label}')}} \n`;
                    out += `\t\t\t\t </label> \n`;

                    out += `\t\t </div>\n`;

                    break;
                default:

            }


            return out;
        },

        // generate form
        generateForm: function () {
            var out = '';
            var hasRowBefore = false;
            // make method
            var method = 'get';
            var extMethod = '';
            if (this.method != 'get') {
                method = 'post';
                if (this.method != 'post') {
                    extMethod = `@method('${this.method.toUpperCase()}')`;
                }
            }
            // make reset class
            var formClass = '';
            var generalClass = '';
            var rowClass = '';

            // make default classes
            switch (this.theme) {
                case "bootstrap":
                    generalClass = 'form-control';
                    rowClass = 'row';
                    break;
                case "semanticui":
                    generalClass = '';
                    rowClass = 'ui grid';
                    formClass = 'ui form';
                    break;
                case "materialize":
                    generalClass = '';
                    rowClass = 'row';
                    formClass = '';
                    break;
                default:
                    console.log('unknow theme');
            }

            // make form html
            out += `<form class="${formClass}" method="${method}" action=""> \n`;
            out += `\t @csrf \n`;
            out += `\t ${extMethod} \n`;

            // loop fields make
            for (const field of this.flds) {
                // var field = this.flds[i]; // must remove in next major version this comment
                switch (field.type) {
                    case "row":

                        // check before this we have row or not
                        if (hasRowBefore) {
                            out += `\t </div>\n`;
                        } else {
                            hasRowBefore = true;
                        }
                        // make grid row
                        out += `\t <div class="${rowClass}">\n`;
                        break;
                    case 'input':

                        var old = '';
                        if (this.old.trim() !== '') {
                            old = ',' + this.old.replace('#name', field.name);
                        }

                        // handle bootstrap class
                        if (this.theme == 'bootstrap') {
                            if (field.option == 'file') {
                                var genClass = 'form-control-file' + ` @error('${field.name}') is-invalid @enderror`;
                            } else {
                                var genClass = generalClass + ` @error('${field.name}') is-invalid @enderror`;
                            }
                        } else
                        // handle bootstrap class
                        if (this.theme == 'semanticui') {
                            var genClass = ` @error('${field.name}') error @enderror`;
                        } else {
                            var genClass = generalClass + ` @error('${field.name}') invalid @enderror`;
                        }


                        var inp = `\t\t\t <input name="${field.name}" type="${field.option}" class="${genClass}" placeholder="{{__('${field.label}')}}" value="{{old('${field.name}'${old})}}" /> \n`;
                        out += this.makeLabel(field, inp);
                        break;


                    case 'textaera':
                        var old = '';
                        if (this.old.trim() !== '') {
                            old = ',' + this.old.replace('#name', field.name);
                        }

                        // handle bootstrap class
                        if (this.theme == 'bootstrap') {
                            var genClass = generalClass + ` @error('${field.name}') is-invalid @enderror`;
                        } else

                        // handle bootstrap class
                        if (this.theme == 'semanticui') {
                            var genClass = ` @error('${field.name}') error @enderror`;
                        } else {
                            var genClass =  `materialize-textarea @error('${field.name}') invalid @enderror`;
                        }


                        var inp = `\t\t\t <textarea name="${field.name}" class="${genClass}" placeholder="{{__('${field.label}')}}" >{{old('${field.name}'${old})}}</textarea> \n`;
                        out += this.makeLabel(field, inp);
                        break;
                    case 'select':
                        var old = '';

                        // handle bootstrap class
                        if (this.theme == 'bootstrap') {
                            var genClass = generalClass + ` @error('${field.name}') is-invalid @enderror`;
                        } else
                        // handle bootstrap class
                        if (this.theme == 'semanticui') {
                            var genClass = 'ui dropdown' + ` @error('${field.name}') error @enderror`;
                        } else {
                            var genClass = generalClass + ` @error('${field.name}') invalid @enderror`;
                        }


                        var inp = `\t\t\t <select name="${field.name}" id="${field.id}" class="${genClass}" > \n`;
                        try {
                            var ops = field.option.split(':');
                            var rs = ops[0];
                            var r = ops[1];
                            var key = ops[2];
                            var title = ops[3];
                        } catch (e) {
                            alert('invalide options for ' + field.name);
                        }

                        if (this.old.trim() !== '') {
                            old = ',' + this.old.replace('#name', field.name);
                            old = ` @if (old('${field.name}'${old}) == ${r}->${key} ) selected @endif`;
                        } else {
                            old = ` @if (old('${field.name}') == ${r}->${key} ) selected @endif`;
                        }


                        inp += `\t\t\t\t @foreach(${rs} as ${r} ) \n`;
                        inp += `\t\t\t\t\t <option value="{{ ${r}->${key} }}" ${old} > {{${r}->${title}}} </option> \n`;
                        inp += `\t\t\t\t @endforeach \n`;
                        inp += '\t\t\t </select>';

                        out += this.makeLabel(field, inp);
                        break;
                    case 'submit':

                        switch (this.theme) {
                            case "bootstrap":
                                out += `\t\t <div class="col-md-${field.size}">\n`;
                                var genClass = 'btn btn-primary mt-2';

                                break;
                            case "semanticui":
                                out += `\t\t <div class="ui wide column sixteen">\n`;
                                var genClass = 'ui button blue';
                                break;
                            default:
                                console.log('unknow theme');
                        }


                        out += `\t\t\t <label> &nbsp; </label> \n`;
                        out += `\t\t\t <input name="${field.name}" type="submit" class="${genClass}" value="{{__('${field.label}')}}" /> \n`;
                        out += `\t\t </div>\n`;
                        break;
                    case  'form-divider':

                        switch (this.theme) {
                            case "bootstrap":
                                out += `\t </div> \n \t <div class="row"> \n`;
                                out += `\t\t <div class="col"><hr></div> \n`;
                                out += `\t\t <div class="col-auto">{{__('${field.label}')}}</div> \n`;
                                out += `\t\t <div class="col"><hr></div> \n`;
                                out += `\t </div> \n \t <div class="row"> \n`;

                                break;
                            case "semanticui":
                                out += `\t\t <h4 class="ui dividing header">{__('${field.label}')}}</h4>\n`;
                                break;
                            case "materialize":
                                out += `\t\t <h5 >{__('${field.label}')}}</h5> <hr />\n`;
                                break;
                            default:
                                console.log('unknow theme');
                        }


                        out += `\t\t\t <label> &nbsp; </label> \n`;
                        out += `\t\t\t <input name="${field.name}" type="submit" class="${genClass}" value="{{__('${field.label}')}}" /> \n`;
                        out += `\t\t </div>\n`;
                        break;
                }
            }

            if (hasRowBefore) {
                out += `\t </div> \n`;
            }

            out += `</form>`;

            $("#code").text(out);
            document.querySelectorAll('#code').forEach((block) => {
                hljs.highlightBlock(block);
            });
        },
        // add field
        addField: function () {
            this.raw.size = this.maxSize;
            this.flds.push(clone(this.raw));
            this.initSemanticui();
        },
        // initial semantic ui
        initSemanticui: function () {
            setTimeout(function () {
                $('.ui.dropdown').dropdown();
            }, 200);
        },
        // remove filed from fields
        removeField: function (i) {
            var fls = [];
            for (const k in this.flds) {
                let itm = this.flds[k];
                if (i != k) {
                    fls.push(itm);
                }
            }
            this.flds = fls;

        },
        // save json
        saveJson: function () {
            var all = {
                fields: this.flds,
                old: this.old
            };
            downloadObjectAsJson(all, '4xmen-laravel-form-builder-export');
        },
        // load json
        loadJson: function () {
            init();
            $("#json-file").click();
        },
        // clear all fields
        clearAll: function () {
            this.flds = [];
            this.old = '';
        },
        changeTheme: function () {
        }
    }
});

