import Noise from '../../assets/js/perlin.js';
const TAU = 2 * Math.PI;
let loadingTextArr = ['L', 'O', 'A', 'D', 'I', 'N', 'G'];
function randomInRange(min, max) {
    return min + Math.random() * (max - min);
}
function parabola(x, k) {
    return Math.pow(4 * x * (1 - x), k);
}

function pointInEllipse(a, b, theta, t) {
    //r*cos(A+B) = r*[cos(A)Cos(B) - sin(A)sin(B)]
    //https://www.quora.com/How-is-x-x-cos-theta-+-y-sin-theta  
    const x = a * Math.cos(t * TAU) * Math.cos(theta) - b * Math.sin(t * TAU) * Math.sin(theta);
    const y = a * Math.cos(t * TAU) * Math.sin(theta) + b * Math.sin(t * TAU) * Math.cos(theta);
    return { x, y }
}

class LGPreLoading {
    constructor(canvas, opts={}) {
        this.canvas = canvas;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
        this.context = canvas.getContext('2d');
        this.RADIUS = .25 * this.canvas.width;
        this.fontSize = 24;
        this.endFlag = false;
        this.startTime = performance.now();
        this.textStartTime = performance.now();
        this.textFadeTime = opts.textFadeTime || .08;
        this.loopDuration =  opts.loopDuration || 2.5;
        this.circleNum = opts.circleNum || 25;
        this.circles = [];
        this.init();
    }
    init() {
        let noise = new Noise();
        noise.seed(0);
        for (let j = 0; j < this.circleNum; j++) {
            const a = randomInRange(.3, .9);
            const b = randomInRange(.3, .9);
            const theta = randomInRange(0, TAU);
            const offset = randomInRange(0, 1);
            const thickness = randomInRange(2, 6);//虚线粗细
            this.circles.push({ a, b, theta, offset, thickness });
        }

        let update = () => {
            this.draw()
            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
    finish(callback){
        this.callback = callback;
        this.endFlag = true;
    }
    drawEllipse(x, y, a, b, theta, s, e) {
        let context = this.context;
        context.save();
        context.translate(-x, -y);

        const path = new Path2D();
        const p0 = pointInEllipse(a, b, theta, s);//线起点
        path.moveTo(p0.x, p0.y);
        for (let tt = s; tt < s + e; tt += .01) {//s+e（start\end）决定画多少弧度
            const p = pointInEllipse(a, b, theta, tt);
            path.lineTo(p.x, p.y);//线终点
        }

        context.strokeStyle = '#fff';
        context.stroke(path);

        context.restore();
    }
    draw() {
        let nowTime = performance.now();
        let context = this.context;
        //Black BG
        context.fillStyle = '#000';
        context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        const time = (.001 * (nowTime - this.startTime)) % this.loopDuration;
        const t = time / this.loopDuration;
        context.save();
        //Text
        context.strokeStyle = '#FFF';
        context.globalAlpha = parabola(t, 1);
        context.font = `${ this.fontSize }px caption`;
        context.textBaseline = 'middle';
        context.textAlign = 'center';
        let arrLength = loadingTextArr.length;
        if (this.endFlag && arrLength > 2) {
            if ((.001 * (nowTime - this.textStartTime)) > this.textFadeTime) {
                this.textStartTime = nowTime;
                loadingTextArr.splice(Math.floor(arrLength / 2), 1);
            }
        } else if (arrLength === 2) {
            context.globalAlpha = 1;
            if(this.RADIUS < 2*this.canvas.width || this.RADIUS < 2*this.canvas.height){
                this.RADIUS+=60;
            }else{
                context.globalAlpha = 0;
                typeof this.callback === 'function' && this.callback();
                this.callback = null;
            }
        }
        let LoadingText = loadingTextArr.join('');
        context.strokeText(LoadingText, this.canvasWidth / 2, this.canvasHeight / 2);

        context.translate(.5 * this.canvasWidth, .5 *  this.canvasHeight);
        context.strokeStyle = '#fff';
        context.globalAlpha = .5;
        context.globalCompositeOperation = 'lighten';//叠加

        context.setLineDash([8, 4]);//虚线
        context.lineDashOffset = 4;//起始偏移
        context.lineWidth = 10;

        this.circles.forEach(c => {
            const tt = (t + c.offset) % 1;
            context.lineWidth = c.thickness * (1 + parabola(tt, 4));//粗细由抛物线决定
            this.drawEllipse(0, 0, c.a * this.RADIUS, c.a * this.RADIUS, c.theta - tt * TAU, 0, .5 + .5 * Math.sin(tt * TAU));
        });

        context.restore();

    }
}

export default LGPreLoading;