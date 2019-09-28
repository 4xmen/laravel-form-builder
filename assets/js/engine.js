var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        theme: 'bootstrap',
        method: 'get',
        fld: [],
        typ: [
            'row',
            'input',
            'select'
        ],
        raw: {
            type: 'input',
            name: '',
            size: 12,
            id: '',
        }
    },
    mounted() {
        // sematicui
        $('.ui.dropdown').dropdown();

    }, computed: {
        siz: function () {
            if (theme == 'semanticui') {
                return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
            }
            return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        }
    }
});

