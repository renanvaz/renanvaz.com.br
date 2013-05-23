Object.extend = function(a, b) {
    return $.extend(a, b);
}

String.prototype.toNumber = function(){
    return Number(this.replace('px', ''));
}

var Arr = {
	remove: function(array, remove){
		var _return = [];
		for(var i = 0; i < array.length; i++){
			if(array[i] != remove){
				_return.push(array[i]);
			}
		}
		return _return;
	},
    merge: function(/* variable number of arrays */){
        var _return = [];
        for(var i = 0; i < arguments.length; i++){
            var array = arguments[i];
            for(var j = 0; j < array.length; j++){
                if(_return.indexOf(array[j]) === -1) {
                    _return.push(array[j]);
                }
            }
        }
        return _return;
    }
}

$.fn.sprite = function(){
    return $(this).data('game');
}

$.fn.getAttr = function(attr, d){
    return $(this).attr(attr) || d;
}

var registerEvents = function(){
    var params = arguments;
    $.each(params, function(i){
        var name = params[i];
        var old = $.fn[name];
        $.fn[name] = function(){
            $(this).trigger('fn.' + name, [arguments]);
            var ret = old.apply(this, arguments);
            return ret;
        };
    })
}

registerEvents('remove');