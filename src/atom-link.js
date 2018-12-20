import Vue from 'vue';
import axios from 'axios';

var baseUrlAtom = shortcode_options.atom_url_index;

axios.defaults.baseURL = shortcode_options.atom_url_api;
axios.defaults.headers.common['REST-API-Key'] = shortcode_options.atom_api_key;

Vue.component('atom-link', {

    template: '<table><tbody><tr class="active" v-for="item in items"><td :bgcolor=setBackgroundColor(item)><a :href=item.digital_object.url target="_blank">{{item.title}}</a></td></tr></tbody></table>',

    data: function () {
        return {
            error: false,
            items: []
        }
    },

    methods: {
        setBackgroundColor(item) {
            return this.$parent.setBackgroundColor(item);
        },
        setPending(value) {
            this.$parent.setPending(value);
        },
        releasePending() {

            if (this.$parent.releasePending()) {

                app.tempItems.sort(function (a, b) {
                    return a.reference_code < b.reference_code ? -1 : a.reference_code > b.reference_code ? 1 : 0;
                });

                if (app.tempItems.length) {
                    app.tempItems[0].level = 1;
                }
                this.items = app.tempItems.slice();
            }
        },
        addItemsBySlug(slug) {

            if (!slug)
                return;

            let self = this;

            axios.get('informationobjects/' + slug + '?sf_culture=' + shortcode_options.sf_culture)
                .then(function (response) {

                    self.setPending();

                    if (response.data) {
                        if (response.data.level_of_description.toUpperCase() == 'ITEM') {
                            if (response.data.digital_object && response.data.digital_object.url) {
                                self.error = false, app.tempItems.push(response.data);
                            }
                        } else if (response.data.reference_code) {
                            self.addItemsByReferenceCode(response.data.reference_code);
                        }
                    }

                    self.releasePending();
                })
                .catch(function (response) {
                    self.error = true, app.tempItems = []
                });
        },
        addItemsByReferenceCode(referenceCode) {

            let self = this;

            self.setPending();

            axios.get('informationobjects?sq0=' + referenceCode + '&sf0=referenceCode&sf_culture=' + shortcode_options.sf_culture)
                .then(function (response) {

                    let ocorrencias = response.data.results;

                    self.setPending(ocorrencias.length);

                    ocorrencias.forEach(function (el) {
                        if (el.level_of_description.toUpperCase() == 'ITEM') {
                            el.level = 3;
                            self.addItemsBySlug(el.slug);
                        } else {
                            el.level = 2;
                            el.digital_object = {};
                            el.digital_object.url = baseUrlAtom + el.slug;
                            app.tempItems.push(el);
                        }

                        self.releasePending();
                    });

                    self.releasePending();
                })
                .catch(function (response) {
                    self.error = true, self.title = null, self.atomUrl = shortcode_options.slug
                });
        }
    },

    mounted() {

        let url = shortcode_options.slug;

        if (url) {

            var splittedUrl = url.split('/');

            if (splittedUrl.length) {

                let slug = splittedUrl.pop();

                this.addItemsBySlug(slug);

            } else {

                this.atomUrl = url;

            }
        }
    }
})

Vue.component('atom-recents-link', {
    template: '<table><tbody><tr class="active" v-for="item in items"><td :bgcolor=setBackgroundColor(item)><a :href=item.digital_object.url target="_blank">{{item.title}}</a></td></tr></tbody></table>',

    data: function () {
        return {
            error: false,
            items: []
        }
    },

    methods: {
        setBackgroundColor(item) {
            return this.$parent.setBackgroundColor(item);
        },
        setPending(value) {
            this.$parent.setPending(value);
        },
        releasePending() {

            if (this.$parent.releasePending())
                this.items = app.tempItems.slice();
        },
        addItems() {

            let self = this;

            axios.get('informationobjects?sort=lastUpdated&topLod=0&limit=' + shortcode_options.number + '&sf_culture=' + shortcode_options.sf_culture)
                .then(function (response) {

                    let ocorrencias = response.data.results;

                    self.setPending();

                    ocorrencias.forEach(function (el) {

                        if (el.data && el.level_of_description.toUpperCase() == 'ITEM') {
                            if (el.data.digital_object && el.data.digital_object.url) {
                                el.level = 3;
                                self.error = false, app.tempItems.push(el);
                            }
                        } else {
                            el.level = 2;
                            el.digital_object = {};
                            el.digital_object.url = baseUrlAtom + el.slug;
                            app.tempItems.push(el);
                        }
                    })

                    self.releasePending();
                })
                .catch(function (response) {
                    self.error = true, app.tempItems = []
                });
        }
    },

    mounted() {

        if (!shortcode_options.number)
            shortcode_options.number = 20;

        this.addItems();
    }
})

var app = new Vue({

    el: '#atom-link-root',

    data: {
        callPending: 0,
        tempItems: []
    },

    methods: {
        setPending(value) {
            if (!value) this.callPending++;
            else this.callPending += value;
        },
        releasePending() {

            let self = this;

            if (this.callPending > 0)
                this.callPending--;

            return this.callPending == 0;
        },
        setBackgroundColor(item) {
            if (item.level) {
                if (item.level == 1)
                    return '#00b300';
                if (item.level == 2)
                    return '#00cc00';
                else
                    return '#ccffcc';
            }
        },
    }
});