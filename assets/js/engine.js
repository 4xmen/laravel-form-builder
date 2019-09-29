function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

var app = new Vue({
    el: '#app',
    data: {
        code: '',
        theme: 'bootstrap',
        method: 'get',
        old: '',
        flds: [],
        typ: [
            'row',
            'input',
            'select',
            'submit'
        ],
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
        siz: function () {
            if (theme == 'semanticui') {
                return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
            }
            return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        }
    }, methods: {

        makeLabel: function (field, inp) {

            var out = '';
            if (field.id.trim() == '') {
                field.id = field.name;
            }

            out += `\t\t <div class="col-md-${field.size}">\n`;

            out += `\t\t\t <label for="${field.id}"> \n`;
            out += `\t\t\t\t {{_('${field.label}')}} \n`;
            out += `\t\t\t </label> \n`;

            out += inp;
            out += `\t\t </div>\n`;
            return out;
        },
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
            // make class
            var formClass = '';
            var generalClass = '';
            var rowClass = '';
            if (this.theme == 'bootstrap') {
                generalClass = 'form-control';
                rowClass = 'form-group row';
            }

            // make form html
            out += `<form method="${method}" action=""> \n`;
            out += `\t @csrf \n`;
            out += `\t ${extMethod} \n`;
            for (const i in this.flds) {
                var field = this.flds[i];
                switch (field.type) {
                    case "row":
                        if (hasRowBefore) {
                            out += `\t </div>\n`;
                        } else {
                            hasRowBefore = true;
                        }
                        out += `\t <div class="${rowClass}">\n`;
                        break;
                    case 'input':
                        var old = '';
                        if (this.old.trim() !== '') {
                            old = ',' + this.old.replace('#name', field.name);
                        }
                        if (this.theme == 'bootstrap') {
                            var genClass = generalClass + ` @error('${field.name}') is-invalid @enderror`;
                        } else {
                            var genClass = generalClass;
                        }
                        var inp = `\t\t\t <input type="${field.option}" class="${genClass}" placeholder="{{_('${field.label}')}}" value="{{old('${field.name}'${old})}}" /> \n`;
                        out += this.makeLabel(field, inp);
                        break;
                    case 'select':
                        var old = '';

                        if (this.theme == 'bootstrap') {
                            var genClass = generalClass + ` @error('${field.name}') is-invalid @enderror`;
                        } else {
                            var genClass = generalClass;
                        }
                        var inp = `\t\t\t <select id="${field.id}" class="${genClass}" > \n`;
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

                        out += this.makeLabel(field, inp);
                        break;
                    case 'submit':
                        out += `\t\t <div class="col-md-${field.size}">\n`;

                        out += `\t\t\t <label> &nbsp; </label> \n`;
                        var genClass = 'btn btn-primary mt-2';
                        out += `\t\t\t <input type="submit" class="${genClass}" value="{{_('${field.label}')}}" /> \n`;
                        out += `\t\t </div>\n`;
                        break;
                }
            }

            if (hasRowBefore) {
                out += `\t </div> \n`;
            }

            out += `</form>`;

            $("#code").text(out);
        },
        addField: function () {
            this.flds.push(clone(this.raw));
            this.initSemanticui();
        },
        initSemanticui: function () {
            setTimeout(function () {
                $('.ui.dropdown').dropdown();
            }, 200);
        }, removeField: function (i) {
            var fls = [];
            for( const k in this.flds) {
              let itm = this.flds[k] ;
              if (i != k){
                  fls.push(itm);
              }
            }
            this.flds = fls ;

        }
    }
});

