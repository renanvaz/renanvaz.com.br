var EventHandler = function(context){
	this.context = context;
	this.events = {};
}

EventHandler.prototype.bind = function(name, fn){
	if(!this.events[name]){
		this.events[name] = [fn];
	}else{
		this.events[name].push(fn);
	}
};

EventHandler.prototype.trigger = function(name, params){
	if(this.events[name])
	for(var i = 0; i < this.events[name].length; i++){
		this.events[name][i].apply(this.context, [params || null]);
	}
};