import { Vec3 } from '../math/Vec3.js';
import { Quat } from '../math/Quat.js';

export class AnimationChannel {
    constructor(target, timeLine, keyFrame) {
        this.target = target;
        this.timeLine = timeLine;
        this.endTime = this.timeLine[this.timeLine.length - 1];
        this.keyFrame = keyFrame;

        this.currentTime = 0;
        this.startTime = 0;
        this.totalTime = 0;
        this.step = 0;
        this.speed = 1;
        this.isLoop = true;
        this.pause = false;

        if (this.timeLine.length != 1) {
            this.startTime = this.timeLine[0];
        } else {
            this.currentTime = this.endTime;
        }
    }
}

//一个Aniamation可能包含多个channels（比如Rotation + Position 动画）
export class Animation {
    constructor() {
        this.channels = [];
        this.totalTime = 0;
    }
    attachChannel(chan) {
        this.channels.push(chan);
        this.totalTime = Math.max(this.totalTime, chan.endTime);//取最大
    }
}


export class AnimationSystem {
    constructor() {
        this.group = [];
        this.speed = 1;
        this.defaultWeights = new Float32Array(8);
        this.defaultVec3 = new Vec3();
        this.defaultQuat = new Quat();
    }
    reset(channel) {
        channel.step = 0;
        channel.currentTime = 0;
    }
    step(channel) {
        let targetLength = channel.target.length;
        let prevKey = channel.step;
        let nextKey = prevKey + 1;
        let prevTime, prevFrame, nextTime, nextFrame;
        if (channel.timeLine.length == 1) { // Single frame
            nextKey = 0;
            prevTime = 0;
            channel.pause = true;
        } else {
            prevTime = channel.timeLine[prevKey];
            prevFrame = channel.keyFrame[prevKey];
        }
        nextTime = channel.timeLine[nextKey];
        nextFrame = channel.keyFrame[nextKey];

        let scopeTime = nextTime - prevTime;
        // Confirm
        if (channel.currentTime < prevTime || channel.currentTime > nextTime) {
            console.error('Wrong step!', channel.currentTime, prevTime, nextTime);
            console.log(channel.timeLine);
            return;
        }
        let interpolationValue = scopeTime
            ? (channel.currentTime - prevTime) / scopeTime
            : 1;
        switch (targetLength) {
            case 4:
                channel.target.slerp(prevFrame || this.defaultQuat, nextFrame, interpolationValue);
                break;
            case 3:
                channel.target.lerp(prevFrame || this.defaultVec3, nextFrame, interpolationValue);
                break;
            // Morph Target Weight Animation
            case 8:
                this.lerp(channel.target, prevFrame || this.defaultWeights, nextFrame, interpolationValue);
                break;
            default:
                break;
        }
    }
    lerp(out, a, b, t) {
        for(let i=0,l=a.length;i<l;i++){
            let ax = a[i];
            out[i] = ax + t * (b[i] - ax);
        }
    }
    playStep(anim, channel, dt) {
        if (!channel.pause) {
            if (channel.currentTime > anim.totalTime) {
                this.reset(channel);
                if (!channel.isLoop) {
                    channel.pause = true;
                    // execute the last frame even already missed?
                    // anim.currentTime = anim.endTime;
                    console.log('stop');
                }
                return;
            }
            //取到当前帧
            while (channel.currentTime > channel.timeLine[channel.step + 1]) {
                channel.step++;
            }

            if (channel.currentTime > channel.startTime && channel.currentTime <= channel.endTime) {
                this.step(channel);
            }
            channel.speed = this.speed;
            channel.currentTime += dt * channel.speed;
        }
    }
    update(dt) {
        for (let animation of this.group) {
            if (dt > 0.016) dt = 0.016;
            for (let channel of animation.channels) {
                this.playStep(animation, channel, dt);
            }
        }
    };
}
