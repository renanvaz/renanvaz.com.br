var TiledIndex = (function(){
	function TiledIndex(){
		var limitX, limitY;

		this.indexes = [];
		this.limitX = 0;
		this.limitY = 0;
		this.limit 	= 0;
		this.width 	= 200;
		this.height = 200;

		this.limitX = ~~(GAME.Stage.size.width / this.width);
		this.width = Math.ceil(GAME.Stage.size.width / this.limitX);

		this.limitY = ~~(GAME.Stage.size.height / this.height);
		this.height = Math.ceil(GAME.Stage.size.height / this.limitY);

		this.limit = this.limitX * this.limitY;

		if(GAME.Settings.DEBUG_COLLISION_INDEX){
			var n;
			for(var i = 0; i < this.limit; i++){
				n = i + 1;
				n = (n < 100 ? n < 10 ? '00' + n : '0' + n : n);
				$(GAME.Stage.el).append('<div style="outline: 1px solid rgba(0, 0, 0, .5); width:'+this.width+'px; height:'+this.height+'px; position: absolute; top:'+(~~(i/this.limitX) * this.height)+'px; left:'+(i%this.limitX * this.width)+'px; font-weight: bold; text-indent: 3px; text-shadow: 1px 1px 0 #fff;">'+n+'</div>')
			}
		}
	}

	/*
	* Add a Sprite in a list of index
	* @param sprite
	*/
	TiledIndex.prototype.add = function(sprite){
		var _index 		= 0;
		var numTilesX 	= sprite.width / this.width;
		var numTilesY 	= sprite.height / this.height;
		var _position 	= sprite.getPositionForCollision();
		var tileX 		= Math.ceil((_position.x - (sprite.width/2)) / this.width);
		var tileY 		= Math.ceil((_position.y - (sprite.height/2)) / this.height);

		var _posX = (_position.x - (sprite.width/2)) % this.width;
		var _posY = (_position.y - (sprite.height/2)) % this.height;
		numTilesX = 1 + (_posX == 0 || _posX > (this.width - sprite.width % this.width) - 1 ? Math.ceil(numTilesX) : Math.floor(numTilesX));
		numTilesY = 1 + (_posY == 0 || _posY > (this.height - sprite.height % this.height) - 1 ? Math.ceil(numTilesY) : Math.floor(numTilesY));

		this.removeSprite(sprite);

		for(var iX = 0; iX < numTilesX; iX++){
			for(var iY = 0; iY < numTilesY; iY++){
				_index = ((tileY + iY - 1) * this.limitX) + tileX + iX;
				sprite.tiles.push(_index);

				if(this.indexes[_index] == undefined) this.indexes[_index] = [];
				this.indexes[_index].push(sprite);
			}
		}

		if(GAME.Settings.DEBUG_COLLISION_INDEX){
			if($(sprite.el).find('> .debug-tile').length == 0){
				$(sprite.el).append('<div class="debug-tile" style="position: absolute; top:0; left: 0; padding: 5px; background: rgba(255, 255, 255, .7); z-index: 1;">' + 'TileX: '+tileX+'<br />TileY: '+tileY+'<br />Tile index: '+sprite.tiles.toString()+'</div>');
			}else{
				$(sprite.el).find('> .debug-tile').html('TileX: '+tileX+'<br />TileY: '+tileY+'<br />Tile index: '+sprite.tiles.toString());
			}
		}
	}

	TiledIndex.prototype.removeSprite = function(sprite){
		for(var i = 0; i < sprite.tiles.length; i++){
			this.indexes[sprite.tiles[i]] = Arr.remove(this.indexes[sprite.tiles[i]], sprite);
		}

		sprite.tiles = [];
	}

	/*
	* Get iniq sprites in a list of index
	* @param sprite
	* $return Array
	*/
	TiledIndex.prototype.getOther = function(sprite){
		var a = [], t = sprite.getTiles(), s;
		for(var i = 0; i < t.length; i++){
			s = this.indexes[t[i]];
			for(var j = 0; j < s.length; j++){
				if(a.indexOf(s) == -1 && s[j].getLastParent() != sprite.getLastParent()){
					a.push(s[j]);
				}
			}
		}

		return a;
	}

	/*
	* Verify if exists other sprites in the tiles index
	* @param sprite
	* $return Boolean
	*/
	TiledIndex.prototype.hasOther = function(sprite){
		var r = false, t = sprite.getTiles();
		for(var i = 0; i < t.length; i++){
			if(this.indexes[t[i]].length > 1){
				r = true;
			}
		}

		return r;
	}

	return TiledIndex;
})();
