//var Vue = require('vue');
import Vue from 'vue';
import axios from 'axios';

axios.defaults.baseURL = 'https://atom.ifrs.edu.br/api';
axios.defaults.headers.common['REST-API-Key'] = 'b9a06bd3ab1cfd2a';

new Vue({
    el: '#atom-link-root',
    data: {
        error: true,
        result: {}
    },
    mounted() {
        axios.get('/informationobjects/' + shortcode_slug.slug + '?sf_culture=' + shortcode_options.sf_culture)
        .then(response => {this.error = false, this.result = response.data})
        .catch(response => {this.error = true, this.result = response.data});
    }
});
