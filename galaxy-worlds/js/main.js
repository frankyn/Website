var Canvas_FN = function ( width, height ) {
	this.id = 'real_ctx';
	this.bid = 'buffer_ctx';
	this.width = width;
	this.height = height;
	
	this.canvas_elem = document.createElement('canvas');
	this.canvas_elem.id = this.id;
	this.canvas_elem.height = height;
	this.canvas_elem.width = width;
	
	this.buffer_elem = document.createElement('canvas');
	this.buffer_elem.id = this.id;
	this.buffer_elem.height = height;
	this.buffer_elem.width = width;
	this.buffer_elem.visible = false;
	document.body.appendChild(this.canvas_elem);
    
	this.canvas_ctx = this.canvas_elem.getContext("2d");
	this.buffer_ctx = this.buffer_elem.getContext("2d");
	
}

Canvas_FN.prototype.error = function ( MSG ) {
	console.error ( MSG );	
}

Canvas_FN.prototype.log = function ( MSG ) {
	console.log ( MSG );
}

Canvas_FN.prototype.resize = function ( width, height ) {
	this.width = width;
	this.height = height;
	$ ( "#" + this.id ).width ( this.width );
	$ ( "#" + this.id ).height ( this.height );
	
	$ ( "#" + this.bid ).width ( this.width );
	$ ( "#" + this.bid ).height ( this.height);	
}

Canvas_FN.prototype.ctx = function ( ) { 
	return this.buffer_ctx;
}

Canvas_FN.prototype.swap = function ( ) {
	var img = this.buffer_ctx.getImageData(0, 0, this.width, this.height);
	this.canvas_ctx.putImageData(img, 0, 0);
	this.buffer_ctx.clearRect (0, 0, this.width, this.height);
}

var Background_FN = function ( width , height ) {
	this.width = width;
	this.height = height;
}

Background_FN.prototype.error = function ( MSG ) {
	console.error ( "Background_FN: " + MSG );	
}

Background_FN.prototype.log = function ( MSG ) {
	console.log ( "Background_FN: " + MSG );
}

Background_FN.prototype.draw = function ( ctx ) {
	ctx.fillRect ( 0, 0, this.width, this.height );
}


var Sprite_FN = function ( ) {
	this.x = 0;
	this.y = 0;	
}

Sprite_FN.prototype.error = function ( MSG ) {
	console.error ( "Sprite: " + MSG );
}

Sprite_FN.prototype.log = function ( MSG ) { 
	console.log ( "Sprite: " + MSG );
}

Sprite_FN.prototype.setPosition = function ( x, y ) {
	this.x = x;
	this.y = y;	
	this.x0 = x;
	this.y0 = y;
}

Sprite_FN.prototype.dist = function ( s ) {
	return Math.sqrt( Math.pow ( s.x - this.x, 2 ) + Math.pow ( s.y - this.y, 2) );	
}

Sprite_FN.prototype.getX = function ( ) {
	return this.x;	
}

Sprite_FN.prototype.getY = function ( ) {
	return this.y;	
}

Sprite_FN.prototype.update = function ( dt ) { }
Sprite_FN.prototype.draw = function ( ctx ) { }


var Galaxy = function ( x, y ) {
	var g = new Sprite_FN ( );
	g.stars = new Array ( );
	for ( var i = 0; i < 2; i++ ) {
		g.log ( i );
		g.stars.push ( Star ( x, y, 60 + i * 140, 2 - i) );	
	}
	g.setPosition ( x, y );
	g.update = function ( dt ) {
		for ( var i = 0; i < this.stars.length; i++ ) {
			this.stars[i].setPosition( this.x, this.y );
			this.stars[i].update ( dt );	
		}
	};
	
	g.draw = function ( ctx ) {			
		ctx.save();
		ctx.fillStyle = "rgb(0,255,0)";
		ctx.fillRect ( this.x, this.y, 10, 10 );
		ctx.restore();
		for ( var i = 0; i < this.stars.length; i++ ) {
			this.stars[i].draw ( ctx );	
		}
	};
	return g;
}

var Star = function ( x, y, r, d) {
	var s = new Sprite_FN ( );
	s.radius = r;
	s.satellites = new Array ( );
	for ( var i = 0; i < 1; i++ ) {
		s.satellites.push ( Satellite ( x, y, i * 50 + 30, 5 - i ) );	
	}
	s.setPosition ( x, y );
	s.update = function ( dt ) {
		this.x = this.x0 + Math.cos ( dt * 2 * Math.PI * d) * this.radius;
		this.y = this.y0 + Math.sin ( dt * 2 * Math.PI * d) * this.radius;
		for ( var i = 0; i < this.satellites.length; i++ ) {
			this.satellites[i].setPosition(this.x, this.y);
			this.satellites[i].update ( dt );	
		}
	}
	s.draw = function ( ctx ) {
		ctx.save();
		ctx.fillStyle = "rgb(0,0,255)";
		ctx.fillRect (this.x , this.y, 10, 10);		
		ctx.restore();
		for ( var i = 0; i < this.satellites.length; i++ ) {
			this.satellites[i].draw ( ctx );	
		}
	}
	return s;
}

var Satellite = function ( x, y, r, d ) {
	var s = new Sprite_FN ( );
	s.radius = r;
	s.setPosition( x, y );
	s.update = function ( dt ) {
		this.x = this.x0 + Math.cos ( dt * 2 * Math.PI * d ) * this.radius;
		this.y = this.y0 + Math.sin ( dt * 2 * Math.PI * d ) * this.radius;	
	}
	s.draw = function ( ctx ) {
		ctx.save();
		ctx.fillStyle = "rgb(255,0,0)";
		ctx.fillRect (this.x , this.y, 5, 5);		
		ctx.restore();
	}
	return s;
}

var Ship = function ( x, y ) {
	var s = new Sprite_FN ( );
	s.setPosition ( x, y );
	s.update = function ( dt ) {
			
	}
	s.draw = function ( ctx ) {
		ctx.save();
		ctx.fillStyle = "rgb(22, 255, 0 )";
		ctx.fillRect ( this.x, this.y, 2, 2 );
		ctx.restore();	
	}
	return s;
}

var GalaxyWorlds_FN = function ( ) {
	this.gfx = new Canvas_FN ( $ ( document ).width(), $(document).height() );
	this.background = new Background_FN ( $ ( document).width(), $ ( document ).height() );
	this.player_x = 0;
	this.player_y = 0;
	this.player = Ship ( $(document).width()/2, $(document).height()/2 );
	var scope = this;
	$(document).keypress( function ( evt ) {
		switch ( evt.which ){
			case 119: //W
				scope.player_y = -10;
				scope.player_x = 0;
			break;
			case 115: //S
				scope.player_y = 10;
				scope.player_x = 0;
			break;
			case 97: //A
				scope.player_x = -10;
				scope.player_y = 0;
			break;
			case 100: //D
				scope.player_x = 10;
				scope.player_y = 0;
			break;
			default:
				scope.log ( evt.which );	
		}
		scope.updateGalaxyPosition();
	});
	this.galaxies = Array();
	for ( var i = 0; i < 10; i++ ) {
		this.galaxies.push( Galaxy ( Math.random() * 3000 , Math.random() * 3000 ) );
	}
};

GalaxyWorlds_FN.prototype.log = function ( MSG ) {
	console.log ( " Galaxy Worlds: " + MSG );
};

GalaxyWorlds_FN.prototype.error = function ( MSG ) {
	console.error ( "Galaxy Worlds: " + MSG );	
};

GalaxyWorlds_FN.prototype.init = function ( ) {
	this.log ( "init..." );
	this.lastTime = new Date();
	var scope = this;
	setInterval (  function ( ) {scope.loop();}, 75 );
};

GalaxyWorlds_FN.prototype.loop = function ( ) {
	this.currTime = new Date();
	this.update ( (this.currTime - this.lastTime)/5000 );
	this.draw ( );
};

GalaxyWorlds_FN.prototype.updateGalaxyPosition = function ( ) {
	for ( var i = 0; i < 10; i++ ) {
		this.galaxies[i].setPosition ( this.galaxies[i].x0 - this.player_x, this.galaxies[i].y0 - this.player_y );	
	}
}

GalaxyWorlds_FN.prototype.update = function ( dt ) {
	for ( var i = 0; i < 10; i++ ) {
		this.galaxies[i].update ( dt );
	}
};

GalaxyWorlds_FN.prototype.draw = function ( ) { 
	this.background.draw ( this.gfx.ctx() );
	for ( var i = 0; i < 10; i++ ) {
		if ( this.galaxies[i].dist ( this.player ) < $(document).width() ) {
			this.galaxies[i].draw ( this.gfx.ctx() );
		}
	}
	this.player.draw ( this.gfx.ctx() );
	this.gfx.swap();
};

$(document).ready(function ( ) {
	var GW_Runner = new GalaxyWorlds_FN ( );
	GW_Runner.init();
} );
