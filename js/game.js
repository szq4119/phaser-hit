var tGame = tGame || {};
tGame.SCORE = 0;
tGame.WINSCORE = 50;
tGame.PLAYTIME = 3;
tGame.SCALE = 0.5;
tGame.Preload = function() {console.log('Preload') };
tGame.Preload.prototype = {
    preload: function() {
        this.game.load.spritesheet('startbtn', './assets/btn-start.png',300,114);
        this.game.load.spritesheet('sharebtn', './assets/btn-share.png',300,114);
        this.game.load.spritesheet('mainmenubg', './assets/mainmenu-bg.jpg');
        this.game.load.spritesheet('gamebg', './assets/game-bg.jpg');
        this.game.load.spritesheet('pa','./assets/pa.png',158,168);
        this.game.load.spritesheet('blank','http://img.axmall.com.au/3/202571455870423.png',30,30);
        this.game.load.spritesheet('face','./assets/face.png', 400,400,2);
        this.game.load.spritesheet('hand','./assets/hand.png',200,200,3);
        this.game.load.spritesheet('gameover','./assets/gameover.png');
        if(window.innerWidth * 2 > 750){
            tGame.SCALE  = (window.innerWidth*2 - 80)/750 * 0.5;
        }else if(window.innerWidth * 2 < 750){
            tGame.SCALE  = (window.innerWidth * 2)/750 * 0.5;
        }
    },
    create: function() {
        this.game.state.start('MainMenu');
    }
}
tGame.MainMenu = function() { console.log('MainMenu') };
tGame.MainMenu.prototype = {
	create: function() {
        var gamebg = this.game.add.image(0, 0, 'mainmenubg');
        gamebg.width = window.innerWidth, gamebg.height = window.innerHeight;
        var lotteryText = this.game.add.text(0, 0, "您还有 " + SevController.Date.LOTTERYNUM + " 次机会" , { font: "20px Microsoft YaHei",  fill: "#ff0000"});
        lotteryText.x = this.game.world.centerX - lotteryText._width / 2;
        lotteryText.y = this.game.world.centerY - this.game.world.height/3.4;
        var startbtn = this.game.add.button(5,this.game.world.height - 150, 'startbtn', this.startGame);
        var sharebtn = this.game.add.button(this.game.world.width - 155,this.game.world.height - 150, 'sharebtn', SevController.Fun.shareBtnClick);
        startbtn.scale.setTo(0.5);
        sharebtn.scale.setTo(0.5);
	},
    startGame: function() {
        if(typeof SevController.Api.Get.startGame === 'String'){
            $.getJSON(SevController.Api.Get.startGame,function(data){
                //  游戏次数减一后的逻辑
                //  ...
            })
        }
        SevController.Date.LOTTERYNUM -- ;
        this.game.state.start('Play');
    }
}
tGame.Play = function() { console.log('Play') };
tGame.Play.prototype = {
    preload:function(){
        tGame.SCORE = 0 ;
        this.playtime = tGame.PLAYTIME;
        this.hitting = false;
        var gamebg = this.game.add.image(0, 0, 'gamebg');
        gamebg.width = this.game.world.width, gamebg.height = this.game.world.height;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
    },
    create: function() {
        this.timeText = this.game.add.text(0, 0, "剩余：" + this.playtime + "s", {
            font: "18px Microsoft YaHei", fill: '#333'
        });
        this.timeText.x = this.game.world.centerX  - this.timeText._width - 10;
        this.timeText.y = this.game.world.centerY - this.game.world.height/3.4;
        this.scoreText = this.game.add.text(0, 0, "已打：" + tGame.SCORE + "下", {
            font: "18px Microsoft YaHei", fill: '#333'
        });
        this.scoreText.x = this.game.world.centerX + 10;
        this.scoreText.y = this.game.world.centerY - this.game.world.height/3.4;
        this.face = this.game.add.sprite(this.game.world.centerX , this.game.world.centerY,'face');
        this.face.x = this.game.world.centerX  - this.face.width/4;
        this.face.y = this.game.world.centerY  - this.face.height/11;
        this.face.scale.setTo(tGame.SCALE);

        this.hand = this.game.add.sprite(this.game.world.centerX + 30, this.game.world.centerY + 60,'hand');
        this.hand.scale.setTo(tGame.SCALE);
        this.playtimer = this.game.time.events.loop(1000, this.countdown, this);
        //this.game.physics.arcade.enable();
    },
    countdown: function(){
        this.playtime--;
        if(this.playtime >= 0){
            this.timeText.setText("剩余：" + this.playtime + "s");
        }else{
            this.hand.destroy();
            this.face.destroy();
            this.game.state.start('GameOver'); 
        }
    },
    update: function() {
        this.game.input.onDown.add(this.hitFace, this);
    },
    hitFace: function(){
        var point = this.input;
        if(!this.hitting){
            this.hitting = true;
            var rnx = this.game.rnd.between(-40,40);
            var rny = this.game.rnd.between(-40,40);
            var handanim = this.hand.animations.add('hand',[0 , 2]);
            handanim.play('hand', 10, false);
            handanim.onComplete.add(function(){
                this.hand.destroy();
                var pa = this.game.add.sprite(this.game.world.centerX + rnx, this.game.world.centerY + rny,'pa');
                pa.rotation = rny/10;
                pa.scale.setTo(tGame.SCALE);
                var faceanim = this.face.animations.add('face',[0 , 1]);
                faceanim.play('face', 200, false);
                faceanim.onComplete.add(function(){
                    var that = this;
                    setTimeout(function(){
                        that.face.destroy();
                        pa.destroy();
                        that.hitting = false;
                        if(that.playtime > 0){
                            that.face = that.game.add.sprite(that.game.world.centerX , that.game.world.centerY,'face');
                            that.face.x = that.game.world.centerX  - that.face.width/4;
                            that.face.y = that.game.world.centerY  - that.face.height/11;
                            that.face.scale.setTo(tGame.SCALE);
                            that.hand = that.game.add.sprite(that.game.world.centerX + 30, that.game.world.centerY + 60,'hand');
                            that.hand.scale.setTo(tGame.SCALE); 
                        }
                    },150 + rnx);
                    tGame.SCORE ++ ;
                    this.scoreText.setText("已打：" + tGame.SCORE + "下");
                },this);
            },this);
        }
    },
}
tGame.GameOver = function() { console.log('GameOver') };
tGame.GameOver.prototype = {
    create: function() {
        var gamebg = this.game.add.image(0, 0, 'gameover');
        gamebg.width = window.innerWidth, gamebg.height = window.innerHeight;
        SevController.Fun.gameOver(tGame.SCORE);
    }
}

tGame.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'game');
tGame.game.state.add('Preload', tGame.Preload);
tGame.game.state.add('MainMenu', tGame.MainMenu);
tGame.game.state.add('Play', tGame.Play);
tGame.game.state.add('GameOver', tGame.GameOver);
tGame.game.state.start('Preload');