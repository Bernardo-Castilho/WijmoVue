onload = function () {

    // app model
    var names = 'Abraham,Andrew,Carter,Charles,Daniel,David,Edward,Gunning,Jacob,John,Josiah,Pierce,Richard,Samuel,Simon,Thomas,William'.split(','),
        count = 20,
        startDate = wijmo.DateTime.addDays(new Date(), -count),
        data = [];
    for (var i = 0; i < 20; i++) {
        data.push({
            id: i,
            name: names[i % names.length],
            sales: Math.random() * 1000,
            expenses: Math.random() * 500,
            downloads: Math.random() * 2000,
            active: i % 2 == 0,
            date: wijmo.DateTime.addDays(startDate, i)
        });
    }

    // app view (main component)
    new Vue({
        el: '#app',
        data: {
            names: names,
            view: new wijmo.collections.CollectionView(data)
        },
        methods: {

            // refresh the CollectionView after setting values 
            // edit/commitItem blocks
            refreshView: function (s, e) {
                this.view.refresh();
            }
        }
    });
}
