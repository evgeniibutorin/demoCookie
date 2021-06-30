function getIndex(list, id) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) {
            return i;
        }
    }
    return -1;
}


var cookieApi = Vue.resource('/cookie{/id}');

Vue.component('cookie-form', {
    props: ['cookies', 'cookieAttr'],
    //Для того что бы сохранять отредактированное сообщение нам необходимос схранять из него данные в переменную для этого сущесствует блок data
    data: function () {
        return {
            text: '',
            id: ''
        }
    },
    watch: {
        cookieAttr: function (newVal, oidVal) {
            this.text = newVal.text;
            this.id = newVal.id;
        }
    },
    template:
        '<div>' +
        //v-model связывает переменную из data с полем ввода
        '<input type="text" placeholder="Write somrthing" v-model="text">' +
        //v-model связывает переменную из data с полем ввода @click(то же самое что v-on:click)
        // для обработки нажатия на клавишу в кавычках наименование метода который будет выполняться ниже в methods
        '<input type="button" value="Save" @click="save">' +
        '</div>',
    methods: {
        save: function () {
            var cookie = {text: this.text};
            if (this.id) {
                cookieApi.update({id: this.id}, cookie).then(result =>
                    result.json().then(date => {
                        var index = getIndex(this.cookies, date.id);
                        this.cookies.splice(index, 1, date);
                        this.text = '';
                        this.id = '';
                    }))
            }
            cookieApi.save({}, cookie).then(result =>
                result.json().then(data => {
                    this.cookies.push(data);
                    this.text = '';
                }))
        }
    }
});

//Строка для отображения одной строки из блока с печеньем
//Определяе компонент под названием cookie-row
Vue.component('cookie-row', {
    //props (properties) что бы компонент знал, что в него входят какие то данные в массиве в виде строк указываем ожидаемые параметры
    props: ['cookie', 'editMethod', 'cookies'],
    //в template описывается разметка которую мы хотим видеть на странице
    template: '<div>' +
        '<i>({{cookie.id}})</i>{{cookie.text}}' +
        '<span style="position: absolute; right: 0">' +
        '<input type="button" value="Edit" @click="edit"/>' +
        '<input type="button" value="X" @click="del"/>' +
        '</span>' +
        '</div>',
    methods: {
        edit: function () {
            this.editMethod(this.cookie)
        },
        del: function () {
            cookieApi.remove({id: this.cookie.id}).then(result => {
                if (result.ok) {
                    this.cookies.splice(this.cookies.indexOf(this.cookie), 1)
                }
            })
        }
    }
});

Vue.component('cookies-list', {
    props: ['cookies'],
    data: function () {
        return {
            cookie: null,
        }
    },

    template: '<div style="position: relative; width: 300px;"> ' +
        '<cookie-form :cookies="cookies" :cookieAttr ="cookie"/>' +
        //v-for для отображения циклов после in коллекция (cookies) перед in имя одног объекта из коллекцции
        '<cookie-row v-for="cookie in cookies" :key="cookie.id" :cookie="cookie" ' +
        ':editMethod="editMethod" :cookies="cookies"/>' +
        '</div>',
    //created - хук жизненнеого цикла
    created: function () {
        cookieApi.get().then(result =>
            result.json().then(data =>
                data.forEach(cookie => this.cookies.push(cookie))))
    },
    methods: {
        editMethod: function (cookie) {
            this.cookie = cookie;
        }
    }

});

var app = new Vue({ //По факту небельшое приложение которое будет обрабатывать написанные скрипты и управлять написанным интерфейсом
    el: '#app',//идентификатор html тега # указывает на Id
    template: '<cookies-list :cookies="cookies"/>',
    data: {//объект содержащий ключ значения для отображения данные в приложении
        cookies: []
    }
});