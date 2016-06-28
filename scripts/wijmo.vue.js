/*
 * Wijmo components for Vue JS
 */

// FlexGrid component
Vue.component('wj-flex-grid', {
    template: '<div><slot/></div>',
    props: wjGetProps(wijmo.grid.FlexGrid),
    attached: function () {
        var ctl = new wijmo.grid.FlexGrid(this.$el, {
            autoGenerateColumns: this.$children.length == 0
        });
        wjInitialize(this, ctl);
    }
});
Vue.component('wj-flex-grid-column', {
    template: '<div/>',
    props: wjGetProps(wijmo.grid.Column),
    attached: function () {
        var grid = wijmo.Control.getControl(this.$parent.$el);
        var col = new wijmo.grid.Column();
        wjInitialize(this, col);
        grid.columns.push(col);
        this.$parent.$el.removeChild(this.$el);
    }
});

// FlexChart component
Vue.component('wj-flex-chart', {
    template: '<div><slot/></div>',
    props: wjGetProps(wijmo.chart.FlexChart),
    attached: function () {
        var ctl = new wijmo.chart.FlexChart(this.$el);
        wjInitialize(this, ctl);
    }
});
Vue.component('wj-flex-chart-series', {
    template: '<div/>',
    props: wjGetProps(wijmo.chart.Series),
    attached: function () {
        var chart = wijmo.Control.getControl(this.$parent.$el),
            series = new wijmo.chart.Series();
        wjInitialize(this, series);
        chart.series.push(series);
        this.$parent.$el.removeChild(this.$el);
    }
});

// InputNumber component
Vue.component('wj-input-number', {
    template: '<div/>',
    props: wjGetProps(wijmo.input.InputNumber),
    attached: function () {
        var ctl = new wijmo.input.InputNumber(this.$el);
        wjInitialize(this, ctl);
    }
})

// InputDate component
Vue.component('wj-input-date', {
    template: '<div/>',
    props: wjGetProps(wijmo.input.InputDate),
    attached: function () {
        var ctl = new wijmo.input.InputDate(this.$el);
        wjInitialize(this, ctl);
    }
})

// InputTime component
Vue.component('wj-input-time', {
    template: '<div/>',
    props: wjGetProps(wijmo.input.InputTime),
    attached: function () {
        var ctl = new wijmo.input.InputTime(this.$el);
        wjInitialize(this, ctl);
    }
})

// InputDateTime component
Vue.component('wj-input-date-time', {
    template: '<div/>',
    props: wjGetProps(wijmo.input.InputDateTime),
    attached: function () {
        var ctl = new wijmo.input.InputDateTime(this.$el);
        wjInitialize(this, ctl);
    }
})

// Calendar component
Vue.component('wj-calendar', {
    template: '<div/>',
    props: wjGetProps(wijmo.input.Calendar),
    attached: function () {
        var ctl = new wijmo.input.Calendar(this.$el);
        wjInitialize(this, ctl);
    }
})

// ComboBox component
Vue.component('wj-combo-box', {
    template: '<div/>',
    props: wjGetProps(wijmo.input.ComboBox),
    attached: function () {
        var ctl = new wijmo.input.ComboBox(this.$el);
        wjInitialize(this, ctl);
    }
})

// RadialGauge and LinearGauge components
Vue.component('wj-radial-gauge', {
    template: '<div><slot/></div>',
    props: wjGetProps(wijmo.gauge.RadialGauge),
    attached: function () {
        var ctl = new wijmo.gauge.RadialGauge(this.$el);
        wjInitialize(this, ctl);
    }
});
Vue.component('wj-linear-gauge', {
    template: '<div><slot/></div>',
    props: wjGetProps(wijmo.gauge.LinearGauge),
    attached: function () {
        var ctl = new wijmo.gauge.LinearGauge(this.$el);
        wjInitialize(this, ctl);
    }
});
Vue.component('wj-range', {
    template: '<div/>',
    props: wjGetProps(wijmo.gauge.Range, ['wjProperty']),
    attached: function () {
        var gauge = wijmo.Control.getControl(this.$parent.$el),
            rng = gauge[this.wjProperty];
        if (rng) {
            wjCopy(rng, this);
        } else {
            rng = new wijmo.gauge.Range();
            wjInitialize(this, rng);
            gauge.ranges.push(rng);
        }
        this.$parent.$el.removeChild(this.$el);
    }
});

// get an array with a control's properties and events
function wjGetProps(controlClass, extraProps) {
    var p = [
        'control',      // expose control to parent component (optional)
        'initialized'   // event that occurs after the control has been fully initialized
    ];

    // scan class hierarchy and collect all properties/events
    for (var prototype = controlClass.prototype; prototype; prototype = prototype.__proto__) {
        for (var prop in prototype) {
            if (prop[0] != '_' && prop != 'constructor') {
                if (prop.match(/\bon[A-Z]/)) {
                    prop = prop[2].toLowerCase() + prop.substr(3);
                }
                if (p.indexOf(prop) < 0) {
                    p.push(prop);
                }
            }
        }
    }

    // add any extra properties
    if (extraProps) {
        Array.prototype.push.apply(p, extraProps);
    }

    // return the whole list
    return p;
}

// initialize control properties from component, add watchers to keep the control in sync
function wjInitialize(component, control) {

    // hook up event handlers
    for (var prop in component._props) {
        if (control[prop] instanceof wijmo.Event) {
            var event = control[prop];

            // fire component event handler
            if (wijmo.isFunction(component[prop])) {
                event.addHandler(component[prop], control);
            }

            // update property 'xxx' in response to 'xxxChanged' event
            var m = prop.match(/(\w+)Changed/);
            if (m && m.length) {
                prop = m[1];
                if (control[prop] != null && component[prop] != null) {
                    event.addHandler(_update.bind({
                        component: component,
                        control: control,
                        prop: prop
                    }));
                }
            }
        }
    }

    // initialize properties (after setting up event handlers)
    for (var prop in component._props) {
        if (!(control[prop] instanceof wijmo.Event) && component[prop] != null) {
            control[prop] = component[prop];
            component.$watch(prop, _watch.bind({ control: control, prop: prop }));
        }
    }

    // set 'control' pseudo-property so it's accessible to parent component
    if (component.control && component.$parent) {
        component.$parent[component.control] = control;
    }

    // invoke 'initialized' event
    if (wijmo.isFunction(component.initialized)) {
        component.initialized(control);
    }

    // update control property to match component changes
    function _watch(newValue) {
        this.control[this.prop] = newValue;
    }

    // update component property to match control changes
    function _update() {
        this.component[this.prop] = this.control[this.prop];
    }
}

// copy properties from an object to another
function wjCopy(dst, src) {
    for (var key in src) {
        if (key in dst && wijmo.isPrimitive(src[key])) {
            dst[key] = src[key];
        }
    }
}
