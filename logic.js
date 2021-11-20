var pineapple_src = document.getElementById('pineapple_src');
var canvas = document.getElementById('pineapple');
canvas.setAttribute('width', window.innerWidth);
canvas.setAttribute('height', window.innerHeight);
var pineapple, ctx;
var sharts = [];
function clear() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

var m = {
    x: 0,
    y: 0
};

function init(){
    window.onmousemove = function(e) {
        m.x = e.clientX;
        m.y = e.clientY;  
    }
    window.ontouchstart = function(e) {
        m.x = e.clientX;
        m.y = e.clientY;
    }
    pineapple = {
        width: pineapple_src.width,
        height: pineapple_src.height,
        x : window.innerWidth/2,
        y : window.innerHeight/2,
        ax: 0,
        ay: 0,
        vx : 0,
        vy : 0,
        theta : 0,
        draw : function() {
            var deltax  = this.x - m.x;
            var deltay  = this.y - m.y;
            this.theta  = Math.atan2(deltay, deltax) - Math.PI/2;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.theta);
            ctx.drawImage(pineapple_src, -this.width/2, -this.height/2);
            ctx.restore();
            const b = 1.8;
            const ma = 1.3;
            const k = 1;
            this.vx += this.ax;
            this.vy += this.ay;
            this.x -= (ma/k) * this.vx + (b/k) * this.ax;
            this.y -= (ma/k) * this.vy + (b/k) * this.ay;
        },
        move : function(){
            if((this.x != m.x)&&(this.y != m.y)&&(m.x != NaN)&&(m.y != NaN)){
                var deltax  = this.x - m.x;
                var deltay  = this.y - m.y;
                var norm    = Math.sqrt(deltax**2 + deltay**2);
                this.ax     = deltax/norm;
                this.ay     = deltay/norm;
            }
            
            
        }
    };
    draw();
}
function shart(x, y){
    this.rad = 10;
    this.num = 50;
    this.follow_dist = pineapple.height/2 + 20;
    this.ax = 0;
    this.ay = 1;
    this.vx = Math.cos(pineapple.theta)*pineapple.ax*30; 
    this.vy = Math.sin(pineapple.theta)*pineapple.ay*30;
    this.x = x + (pineapple.width/2) * Math.cos(pineapple.theta + Math.PI/2);
    this.y = y + (pineapple.height/2) * Math.sin(pineapple.theta + Math.PI/2);
    this.visible = true;
    this.draw = function(){
        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.moveTo(this.x, this.y + this.rad);
        ctx.arc(this.x,this.y,this.rad,0,Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
    };
    this.move = function() {
        this.vx += this.ax;
        this.vy += this.ay;
        this.x += this.vx;
        this.y += this.vy;
        if (this.y > window.innerHeight){
            this.y = window.innerHeight;
            this.visible = false;
        }
        
    }
}

function draw(){
    if(canvas.getContext){
        ctx = canvas.getContext('2d');
    }
    clear();
    
    pineapple.draw();
    pineapple.move();
    var newShart = new shart(pineapple.x, pineapple.y);
    sharts.push(newShart);
    for( i = 0; i < sharts.length; i++){
        sharts[i].draw();
        sharts[i].move();
        if (!sharts[i].visible){
            sharts.splice(i,1);
        }
    }
    window.requestAnimationFrame(draw);
}
