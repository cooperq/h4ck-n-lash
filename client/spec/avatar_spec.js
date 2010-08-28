describe('Avatar', function() {
  var player, avatar;
  beforeEach(function() {
    game = new Game();
    player = new Player('fred');
    avatar = player.avatar;
  });
  
  describe('accelerate_up', function() {
    it('should subtract from the velocity.y', function() {
      avatar.accelerate_up();
      expect(avatar.velocity.y).toEqual(AVATAR_JUMP_ACCEL);
    });
  });
  describe('gravity', function() {
    it("every game tick should add to velocity.y", function() {
      expect(avatar.velocity.y).toEqual(0);
      jasmine.Clock.tick(ONE_GAME_TICK);
      expect(avatar.velocity.y).toEqual(GRAVITY);
      jasmine.Clock.tick(ONE_GAME_TICK);
      expect(avatar.velocity.y).toEqual(GRAVITY * 2);
    });
  });

  describe('collision detection', function(){
    describe('game boundaries', function(){
      it('should not move off left side of screen', function(){
        player.position.x = 0;
        simulate_left_key_press();
        game.next_tick();
        expect(player.position.x).toEqual(0);
      });
      it('should not move off right side of screen', function(){
        game.width = 500;
        player.position.x = game.width - AVATAR_WIDTH;
        simulate_right_key_press();
        game.next_tick();
        expect(player.position.x).toEqual(game.width - AVATAR_WIDTH);
      });

    });
  });
});
