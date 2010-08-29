Avatar = function(options){
  this.id = Math.random();
  this.name = options.name || 'anonymous';
  this.position = options.position || {x:0,y:0};
  this.type = 'avatar';

  this.direction = {x:1,y:0};

  this.animation_cycles = {
    run_right:{y:0,step:90,frames:6},
    run_left:{y:95,step:90,frames:6}
  };
  
  this.current_cycle = this.animation_cycles.run_right;
  this.current_cycle.current_frame = 0;
  this.move = {
    left: false,
    right: false
  };
  this.velocity = {x:0, y:0};

};

Avatar.prototype = {
  get html() {
    return '<div id="avatar-'+this.id+'" class="avatar" style="top:'+Math.floor(this.position.y)+'px;left:'+Math.floor(this.position.x)+'px;background-position:'+(-1*this.current_cycle.current_frame*this.current_cycle.step)+'px '+this.current_cycle.y+'px"><div class="avatar-name">'+this.name+'</div></div>';
  },

  accelerate_left : function(){
    this.velocity.x -= AVATAR_RUN_ACCEL; 
  }, 
  accelerate_right: function(){
    this.velocity.x += AVATAR_RUN_ACCEL; 
  },

  accelerate_up: function(){
    this.velocity.y += AVATAR_JUMP_ACCEL;
  },

  update_position : function(){
    this.update_animation();
    this.update_acceleration();
    this.update_position_x();
    this.update_position_y();
  },

  update_animation : function(){
    var frame = this.current_cycle.current_frame;
    if(this.direction.x == 1) this.current_cycle = this.animation_cycles.run_right; 
    if(this.direction.x == -1) this.current_cycle = this.animation_cycles.run_left;
    if( frame >= this.current_cycle.frames){
      this.current_cycle.current_frame = 0;
    } else {
      this.current_cycle.current_frame = ++frame;
    }
  },

  update_acceleration: function(){
    if(this.move.left) this.accelerate_left();
    if(this.move.right) this.accelerate_right();
    //deal with gravity
    this.velocity.y += GRAVITY;
    // make sure we don't exceed max velocity 
    if(Math.abs(this.velocity.y) >= MAX_Y_VELOCITY){
      var direction = this.velocity.y > 0 ? 1 : -1;
      this.velocity.y = MAX_Y_VELOCITY * direction;
    }
    // apply friction
    if(!this.move.left && !this.move.right) {
      this.velocity.x *= AVATAR_FRICTION;
      if( Math.abs(this.velocity.x) <= 0.05) this.velocity.x = 0;
    }
  },

  update_position_x: function(){
    var new_x = this.position.x + this.velocity.x;
    if(new_x <= 0) {
      new_x = 0;
      this.velocity.x = 0;
    }
    if(new_x > this.game.current_level.width - AVATAR_WIDTH) {
      new_x = this.game.current_level.width - AVATAR_WIDTH;
      this.velocity.x = 0;
    }
    this.position.x = new_x;
  },

  update_position_y: function(){
    var self = this;

    var old_y = this.position.y;
    this.position.y += this.velocity.y;

    // don't move past the bottom of the level
    if( this.position.y > (this.game.current_level.height - AVATAR_HEIGHT)){
      this.position.y = this.game.current_level.height - AVATAR_HEIGHT;
      this.velocity.y = 0;
    }

    // don't move past the top of the level
    if( this.position.y <= 0){
      this.position.y = 0; 
      this.velocity.y = 0;
    }

    // land on platforms
    var new_position_bottom = this.position.y + AVATAR_HEIGHT;
    var old_position_bottom = old_y + AVATAR_HEIGHT;
    $.each( this.game.current_level.platforms, function( i, platform){
      if( old_position_bottom <= platform.y && new_position_bottom >= platform.y){
        if( self.position.x + AVATAR_WIDTH > platform.x && self.position.x < platform.x_end){
          self.position.y = platform.y - AVATAR_HEIGHT;
          self.velocity.y = 0;
        }
      } 
    });
  }
   
};
