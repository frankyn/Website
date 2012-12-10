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
/*
	SpaceBody creates 
*/
var SpaceBody = function ( x, y, size, r, speed, sbody, satellite, color) {
	var s = new Sprite_FN ( );
	
	s.setPosition ( x, y );
	s.color = color;
	s.radius = r;
	s.size = size;
	s.satellite = satellite ? satellite : null;
	s.next = sbody ? sbody : null;
	
	s.update = function ( dt ) {
		var delta = dt * 2 * Math.PI * speed;
		this.x = this.x0 + Math.cos ( delta ) * this.radius;
		this.y = this.y0 + Math.sin ( delta ) * this.radius;
		if ( this.next ) {
			this.next.update ( dt );
		}
		if ( this.satellite ) {
			this.satellite.setPosition ( this.x, this.y );
			this.satellite.update ( dt );	
		}
	}
	s.draw = function ( ctx ) {
		console.log ( "Draw");
		ctx.save();
		ctx.fillStyle = color;
		ctx.fillRect ( this.x-this.size/2 , this.y-this.size/2, this.size, this.size);
		if ( this.satellite ) {
			this.satellite.draw ( ctx );	
		}
		ctx.restore();
		if ( this.next ) {
			this.next.draw ( ctx );
		}
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
	$(window).resize( function ( ) { 
		scope.background.width = $ ( document ).width();
		scope.background.height = $ ( document ) .height();
		scope.gfx.resize ( $ ( document ).width(), $ ( document).height() );
	} );
	this.galaxies = null;
	//SpaceBody ( x, y, size, r, speed, sbody, satellite, color)
	for ( var i = 0; i < 1; i++ ) {
		var x = this.player.x;
		var y = this.player.y;
		var star = null;
		var color = null;
		for ( var b = 0; b < 5; b ++ ) {
			var planet = null;
			for ( var c = 0; c < 1; c ++ ) {
				var moon = null;
				color = "rgb(255,255,255)";
				
				for ( var d = 0; d < 1; d ++ ) {
					moon = SpaceBody ( x, y, 2, 20, 2.5, moon, null, color );	
				}
				color = "rgb(0,255,0)";
				planet = SpaceBody ( x, y, 3, 10, 1, planet, moon, color ); 	
			}
			color = "rgb(255, 0, 0)";
			star = SpaceBody ( x, y, 3, 50 + b * 50, 2 - .1 * b, star, planet, color );	
		}
		color = "rgb(0,0,255)";
		this.galaxies = SpaceBody ( x, y, 5, 0, 1, this.galaxies, star, color );	
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
	this.lastTime = ( this.currTime - this.lastTime ) % 2;
};

GalaxyWorlds_FN.prototype.updateGalaxyPosition = function ( ) {
	
}

GalaxyWorlds_FN.prototype.update = function ( dt ) {
	this.galaxies.update ( dt );
};

GalaxyWorlds_FN.prototype.draw = function ( ) { 
	this.background.draw ( this.gfx.ctx() );
	this.galaxies.draw ( this.gfx.ctx() );
	this.gfx.swap();
};

$(document).ready(function ( ) {
	var GW_Runner = new GalaxyWorlds_FN ( );
	GW_Runner.init();
} );
