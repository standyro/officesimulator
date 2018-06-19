var exports = module.exports = {};

exports.checkKey = function checkKey(e) {
    var keyCode = e;
    var i = 0;
    var result = false;

    function isDefined(o) {
        return typeof o !== 'undefined';
    }

    var modifierMap = {
        16: 'shiftKey',
        18: 'altKey',
        17: 'ctrlKey',
        91: 'metaKey'
    };

    // http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
    var keySets = [{
        name: 'service',
        set: {
            91: 'cmd',
            17: 'ctrl',
            18: 'alt',
            8: 'backspace',
            9: 'tab',
            46: 'delete',
            13: 'enter',
            27: 'esc',
            32: 'space',
            36: 'home',
            35: 'end',
            33: 'pageup',
            34: 'pagedown',
        }
    }, {
        name: 'helpers',
        set: {
            188: ',',
            190: '.',
            191: '/',
            192: '`',
            189: '-',
            187: '=',
            186: ';',
            222: '\'',
            219: '[',
            221: ']',
            220: '\\',
            // numpad
            106: '*',
            107: '+',
            108: '',
            109: '-',
            110: '.',
            111: '/',
        }
    }, {
        name: 'arrows',
        set: {
            38: 'up',
            40: 'down',
            37: 'left',
            39: 'right',
        }
    }, {
        name: 'numbers',
        set: {
            48: '0',
            49: '1',
            50: '2',
            51: '3',
            52: '4',
            53: '5',
            54: '6',
            55: '7',
            56: '8',
            57: '9',
            // numpad
            96: '0',
            97: '1',
            98: '2',
            99: '3',
            100: '4',
            101: '5',
            102: '6',
            103: '7',
            104: '8',
            105: '9',
        }
    }];
    for (i = 0; i < keySets.length; i++) {
        if (isDefined(keySets[i].set[keyCode])) {
            result = {
                group: keySets[i].name,
                alias: keySets[i].set[keyCode],
                code: keyCode,
                meta: e.metaKey,
                ctrl: e.ctrlKey,
                alt: e.altKey,
                shift: e.shiftKey,
            };
            break;
        }
    }
    return result;
}



    function recalculateSize(action, $el, notUpdate) {
        notUpdate = notUpdate || false;
        action = action || 'recalculate';
        var total;
        var $parentEl = $el.closest('.infopane__size');

        var color = $parentEl.attr('data-color');
        var size = $parentEl.attr('data-size');

        var price = $parentEl.attr('data-price');
        var $qtyEl = $parentEl.find('.infopane__size-qty');
        var $totalEl = $parentEl.find('.infopane__size-price-total');

        var qty = $qtyEl.val();
        qty = parseInt(qty, 10) || 0;
        qty = (action === 'minus') ?
            qty - 1 :
            (action === 'plus') ?
            qty + 1 :
            qty;
        qty = (qty < 0) ? 0 : qty;
        if (!notUpdate) {
            $qtyEl.val(qty);
        }
        total = qty * price;
        $totalEl.text(total + ' руб');
        // return false;
    }

    function recalculateSizeHandler(e) {
        e = e || window.event;
        var direction;
        var event = e.type;
        var keyCode = e.keyCode || e.which;
        var $el = $(e.currentTarget);
        var qty = $el.val();
        var qtyLength = qty.length;
        var caretPosition = $el.getCursorPosition();
        var type = $el.attr('data-type') || 'recalculate';
        var key = checkKey(e);

        var deleteTimer;

        var navigation = function (direction) {
            direction = direction || 'next';
            if (direction) {
                $(e.currentTarget)
                    .closest('.infopane__size')[direction]()
                    .find('.infopane__size-qty')
                    .focus();
                return false;
            }
        };

        if (event === 'click' || event === 'focusout') {
            recalculateSize(type, $el);
            return false;
        }


        if (event === 'keyup' && key && key.group === 'numbers') {
            // $el.val(qty + String.fromCharCode(keyCode));
            recalculateSize('recalculate', $el, 'notUpdate');
            return false;
        }

        if (event === 'keyup' && !key) {
            // $el.val(qty + String.fromCharCode(keyCode));
            recalculateSize('recalculate', $el);
            return false;
        }

        if (event === 'keydown' && key && key.alias === 'tab') {
            direction = (key.shift) ? 'prev' : 'next';
            navigation(direction);
            return false;
        }

        if (event === 'keyup' && key && (key.alias === 'backspace' || key.alias === 'delete')) {
            clearTimeout(deleteTimer);
            deleteTimer = setTimeout(
                recalculateSize('recalculate', $el, 'notUpdate'),
                1000
            );
        }

        if (event === 'keydown' && key && key.group === 'arrows') {
            if (['up', 'down'].indexOf(key.alias) !== -1) {
                type = (key.alias === 'up') ? 'plus' : type;
                type = (key.alias === 'down') ? 'minus' : type;
                recalculateSize(type, $el);
                return false;
            } else if (['left', 'right'].indexOf(key.alias) !== -1) {
                switch (key.alias) {
                case 'left':
                    direction = 'prev';
                    break;
                case 'right':
                    direction = 'next';
                    break;
                default:
                    direction = false;
                }
                if (direction && direction === 'prev' && caretPosition === 0) {
                    navigation(direction);
                }
                if (direction && direction === 'next' && caretPosition === qtyLength) {
                    navigation(direction);
                }
            }
        }
    }
