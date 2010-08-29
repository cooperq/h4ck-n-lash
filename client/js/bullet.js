function Bullet(player) {
  var self = this;
  self.type = "bullet";
  self.position = $.extend({}, player.avatar.position);
  self.position = {x:player.avatar.position.x+AVATAR_WIDTH/2, y:player.avatar.position.y+AVATAR_HEIGHT/3};
  
  var direction = player.avatar.move.left ? -1 : 1;
  self.velocity = {x: direction * BULLET_VELOCITY, y:0};

  return self;
};

Bullet.prototype = {
  update_position: function() {
    this.position.x += this.velocity.x;
  },
  get html() {
    return '<div class="bullet" style="top:'+Math.floor(this.position.y)+'px;left:'+Math.floor(this.position.x)+'px;"></div>';
  }
}