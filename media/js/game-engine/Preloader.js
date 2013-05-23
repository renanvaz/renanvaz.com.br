var Preloader = (function(){
	function Preloader(){
		this.queue = [];
		this.index = 0;
	}

	Preloader.prototype.bind = function(name, fn){
		if(!this.event)	this.event = new EventHandler(this);
		this.event.bind(name, fn);
	};

	Preloader.prototype.trigger = function(name, params){
		if(!this.event)	this.event = new EventHandler(this);
		this.event.trigger(name, params);
	};

	/*
	* Add to a queue
	* @param filename
	*/
	Preloader.prototype.add = function(filename){
		if(this.queue.indexOf(filename) == -1 && this.list.indexOf(filename) == -1){
			this.queue.push(filename);
			this.trigger('add');
		}
	}

	/*
	* Clear the queue
	* @param
	*/
	Preloader.prototype.clear = function(){
		this.queue = [];
		this.index = 0;
		this.trigger('clear');
	}

	/*
	* Load to the next file
	* @param
	*/
	Preloader.prototype.next = function(){
		if(this.queue.length < this.index){
			var self 	= this;
			var img 	= new Image();
			var current = this.index++
			img.src 	= this.queue[current];
			img.onload 	= function(){
				this.trigger('itemComplete', current);
				Preloader.prototype.list.push(this.queue[current]);
				self.next();
			}
		}else{
			this.trigger('complete');
		}
	}

	/*
	* Start to load the queue
	* @param
	*/
	Preloader.prototype.start = function(){
		this.trigger('start');
		this.next();
	}

	Preloader.prototype.list = [];

	return Preloader;
})();
