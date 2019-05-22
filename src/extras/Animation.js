import {Vec3} from '../math/Vec3.js';
import {Quat} from '../math/Quat.js';

const prevPos = new Vec3();
const prevRot = new Quat();
const prevScl = new Vec3();

const nextPos = new Vec3();
const nextRot = new Quat();
const nextScl = new Vec3();

export class Animation {
    constructor({objects, data}) {
        this.objects = objects;
        this.data = data;
        console.log(data[0]);
        console.log(data[0].length);
        this.elapsed = 0;
        this.weight = 1;
        this.duration = data.length - 1;
    }

    update(totalWeight = 1, isSet) {
        const weight = isSet ? 1 : this.weight / totalWeight;
        const elapsed = this.elapsed % this.duration;

        const floorFrame = Math.floor(elapsed);
        const blend = elapsed - floorFrame;
        const prevKey = this.data[floorFrame];
        const nextKey = this.data[(floorFrame + 1) % this.duration];

        //可以这样直接foreach的条件是每一帧frameData已经包含了这一帧所有的bones位置
        this.objects.forEach((object, i) => {
            prevPos.fromArray(prevKey.position, i * 3)
            prevRot.fromArray(prevKey.quaternion, i * 4);
            prevScl.fromArray(prevKey.scale, i * 3);

            nextPos.fromArray(nextKey.position, i * 3);
            nextRot.fromArray(nextKey.quaternion, i * 4);
            nextScl.fromArray(nextKey.scale, i * 3);

            prevPos.lerp(nextPos, blend);
            prevRot.slerp(nextRot, blend);
            prevScl.lerp(nextScl, blend);

            object.position.lerp(prevPos, weight);
            object.quaternion.slerp(prevRot, weight);
            object.scale.lerp(prevScl, weight);
        });
    }
}