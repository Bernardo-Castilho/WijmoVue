// create some data for our app
var names = 'Abraham,Andrew,Carter,Charles,Daniel,David,Edward,Gunning,Jacob,John,Josiah,Pierce,Richard,Samuel,Simon,Thomas,William'.split(','),
    data = [],
    count = 20,
    startDate = wijmo.DateTime.addDays(new Date(), -count);
for (var i = 0; i < count; i++) {
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
data = new wijmo.collections.CollectionView(data);

// define app component after the document has loaded
onload = function () {
    new Vue({
        el: '#app',
        data: {
            names: names,
            data: data,
            gridItemsChanged: function (s, e) {
                console.log('grid items changed');
            },
            initGrid: function (s, e) {
                console.log('grid initialized');
            },
            selectedIndexChanged: function (s, e) {
                console.log('selected index changed to ' + s.selectedIndex);
            }
        },
        attached: function () {
            // invalidate grids when the values of the current item change
            // because we're setting them directly
            var _this = this;
            this.$watch(
                function () {
                    return JSON.stringify(_this.data.currentItem)
                },
                function (newVal, oldVal) {
                    wijmo.Control.invalidateAll();
                }
            );
        }
    });
}
