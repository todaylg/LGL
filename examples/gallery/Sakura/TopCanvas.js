import { Vector3, Matrix44 } from "./Util";
import {
    createRenderTarget,
    deleteRenderTarget,
    createShader,
    compileShader,
    useShader,
    unuseShader
} from "./initShader";
import BlossomParticle from "./BlossomParticle";

let timeInfo = {
    'start': 0, 'prev': 0, // Date
    'delta': 0, 'elapsed': 0 // Number(sec)
};

let gl;
let renderSpec = {
    'width': 0,
    'height': 0,
    'aspect': 1,
    'array': new Float32Array(3),
    'halfWidth': 0,
    'halfHeight': 0,
    'halfArray': new Float32Array(3)
    // and some render targets. see setViewport()
};
renderSpec.setSize = function (w, h) {
    renderSpec.width = w;
    renderSpec.height = h;
    renderSpec.aspect = renderSpec.width / renderSpec.height;
    renderSpec.array[0] = renderSpec.width;
    renderSpec.array[1] = renderSpec.height;
    renderSpec.array[2] = renderSpec.aspect;

    renderSpec.halfWidth = Math.floor(w / 2);
    renderSpec.halfHeight = Math.floor(h / 2);
    renderSpec.halfArray[0] = renderSpec.halfWidth;
    renderSpec.halfArray[1] = renderSpec.halfHeight;
    renderSpec.halfArray[2] = renderSpec.halfWidth / renderSpec.halfHeight;
};

/////入口
let projection = {
    'angle': 60,
    'nearfar': new Float32Array([0.1, 100.0]),
    'matrix': Matrix44.createIdentity()
};
let camera = {
    'position': Vector3.create(0, 0, 100),
    'lookat': Vector3.create(0, 0, 0),
    'up': Vector3.create(0, 1, 0),
    'dof': Vector3.create(10.0, 4.0, 8.0),
    'matrix': Matrix44.createIdentity()
};

let pointFlower = {};
let meshFlower = {};
let sceneStandBy = false;

function createPointFlowers() {
    // get point sizes
    let prm = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE);
    renderSpec.pointSize = { 'min': prm[0], 'max': prm[1] };

    let vtxsrc = document.getElementById("sakura_point_vsh").textContent;
    let frgsrc = document.getElementById("sakura_point_fsh").textContent;

    pointFlower.program = createShader(
        gl, vtxsrc, frgsrc,
        ['uProjection', 'uModelview', 'uResolution', 'uOffset', 'uDOF', 'uFade'],
        ['aPosition', 'aEuler', 'aMisc']
    );

    useShader(gl, pointFlower.program);
    pointFlower.offset = new Float32Array([0.0, 0.0, 0.0]);
    pointFlower.fader = Vector3.create(0.0, 10.0, 0.0);

    // paramerters: velocity[3], rotate[3]
    pointFlower.numFlowers = 2;
    pointFlower.particles = new Array(pointFlower.numFlowers);
    // vertex attributes {position[3], euler_xyz[3], size[1]}
    pointFlower.dataArray = new Float32Array(pointFlower.numFlowers * (3 + 3 + 2));
    pointFlower.positionArrayOffset = 0;
    pointFlower.eulerArrayOffset = pointFlower.numFlowers * 3;
    pointFlower.miscArrayOffset = pointFlower.numFlowers * 6;

    pointFlower.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointFlower.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, pointFlower.dataArray, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    unuseShader(gl, pointFlower.program);

    for (var i = 0; i < pointFlower.numFlowers; i++) {
        pointFlower.particles[i] = new BlossomParticle();
    }
}

function initPointFlowers() {
    //area
    pointFlower.area = Vector3.create(20.0, 20.0, 20.0);
    pointFlower.area.x = pointFlower.area.y * renderSpec.aspect;

    pointFlower.fader.x = 10.0; //env fade start
    pointFlower.fader.y = pointFlower.area.z; //env fade half
    pointFlower.fader.z = 0.1;  //near fade start

    //particles
    let PI2 = Math.PI * 2.0;
    let tmpv3 = Vector3.create(0, 0, 0);
    let tmpv = 0;
    let symmetryrand = function () { return (Math.random() * 2.0 - 1.0); };
    for (let i = 0; i < pointFlower.numFlowers; i++) {
        let tmpprtcl = pointFlower.particles[i];

        //velocity
        tmpv3.x = symmetryrand() * 0.3 + 0.8;
        tmpv3.y = symmetryrand() * 0.2 - 1.0;
        tmpv3.z = symmetryrand() * 0.3 + 0.5;
        Vector3.normalize(tmpv3);
        tmpv = 5.0 + Math.random() * 1.0;
        tmpprtcl.setVelocity(tmpv3.x * tmpv, tmpv3.y * tmpv, tmpv3.z * tmpv);

        //rotation
        tmpprtcl.setRotation(
            symmetryrand() * PI2 * 0.5,
            symmetryrand() * PI2 * 0.5,
            symmetryrand() * PI2 * 0.5
        );

        //position
        tmpprtcl.setPosition(
            symmetryrand() * pointFlower.area.x,
            symmetryrand() * pointFlower.area.y,
            symmetryrand() * pointFlower.area.z
        );

        //euler
        tmpprtcl.setEulerAngles(
            Math.random() * Math.PI * 2.0,
            Math.random() * Math.PI * 2.0,
            Math.random() * Math.PI * 2.0
        );

        //size
        tmpprtcl.setSize(2.0 + Math.random() * 0.1);
    }
}

function renderPointFlowers() {
    //update
    let PI2 = Math.PI * 2.0;
    let limit = [pointFlower.area.x, pointFlower.area.y, pointFlower.area.z];
    let repeatPos = function (prt, cmp, limit) {
        if (Math.abs(prt.position[cmp]) - prt.size * 0.5 > limit) {
            //out of area
            if (prt.position[cmp] > 0) {
                prt.position[cmp] -= limit * 2.0;
            }
            else {
                prt.position[cmp] += limit * 2.0;
            }
        }
    };
    let repeatEuler = function (prt, cmp) {
        prt.euler[cmp] = prt.euler[cmp] % PI2;
        if (prt.euler[cmp] < 0.0) {
            prt.euler[cmp] += PI2;
        }
    };

    for (let i = 0; i < pointFlower.numFlowers; i++) {
        let prtcl = pointFlower.particles[i];
        prtcl.update(timeInfo.delta, timeInfo.elapsed);
        repeatPos(prtcl, 0, pointFlower.area.x);
        repeatPos(prtcl, 1, pointFlower.area.y);
        repeatPos(prtcl, 2, pointFlower.area.z);
        repeatEuler(prtcl, 0);
        repeatEuler(prtcl, 1);
        repeatEuler(prtcl, 2);

        prtcl.alpha = 1.0;//(pointFlower.area.z - prtcl.position[2]) * 0.5;

        prtcl.zkey = (camera.matrix[2] * prtcl.position[0]
            + camera.matrix[6] * prtcl.position[1]
            + camera.matrix[10] * prtcl.position[2]
            + camera.matrix[14]);
    }

    // sort
    pointFlower.particles.sort(function (p0, p1) { return p0.zkey - p1.zkey; });

    // update data
    let ipos = pointFlower.positionArrayOffset;
    let ieuler = pointFlower.eulerArrayOffset;
    let imisc = pointFlower.miscArrayOffset;
    for (let i = 0; i < pointFlower.numFlowers; i++) {
        let prtcl = pointFlower.particles[i];
        pointFlower.dataArray[ipos] = prtcl.position[0];
        pointFlower.dataArray[ipos + 1] = prtcl.position[1];
        pointFlower.dataArray[ipos + 2] = prtcl.position[2];
        ipos += 3;
        pointFlower.dataArray[ieuler] = prtcl.euler[0];
        pointFlower.dataArray[ieuler + 1] = prtcl.euler[1];
        pointFlower.dataArray[ieuler + 2] = prtcl.euler[2];
        ieuler += 3;
        pointFlower.dataArray[imisc] = prtcl.size;
        pointFlower.dataArray[imisc + 1] = prtcl.alpha;
        imisc += 2;
    }

    //draw
    gl.enable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let prog = pointFlower.program;
    useShader(gl, prog);

    gl.uniformMatrix4fv(prog.uniforms.uProjection, false, projection.matrix);
    gl.uniformMatrix4fv(prog.uniforms.uModelview, false, camera.matrix);
    gl.uniform3fv(prog.uniforms.uResolution, renderSpec.array);
    gl.uniform3fv(prog.uniforms.uDOF, Vector3.arrayForm(camera.dof));
    gl.uniform3fv(prog.uniforms.uFade, Vector3.arrayForm(pointFlower.fader));

    gl.bindBuffer(gl.ARRAY_BUFFER, pointFlower.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, pointFlower.dataArray, gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(prog.attributes.aPosition, 3, gl.FLOAT, false, 0, pointFlower.positionArrayOffset * Float32Array.BYTES_PER_ELEMENT);
    gl.vertexAttribPointer(prog.attributes.aEuler, 3, gl.FLOAT, false, 0, pointFlower.eulerArrayOffset * Float32Array.BYTES_PER_ELEMENT);
    gl.vertexAttribPointer(prog.attributes.aMisc, 2, gl.FLOAT, false, 0, pointFlower.miscArrayOffset * Float32Array.BYTES_PER_ELEMENT);

    // doubler 
    for (let i = 1; i < 2; i++) {
        let zpos = i * -2.0;
        pointFlower.offset[0] = pointFlower.area.x * -1.0;
        pointFlower.offset[1] = pointFlower.area.y * -1.0;
        pointFlower.offset[2] = pointFlower.area.z * zpos;
        gl.uniform3fv(prog.uniforms.uOffset, pointFlower.offset);
        gl.drawArrays(gl.POINT, 0, pointFlower.numFlowers);

        pointFlower.offset[0] = pointFlower.area.x * -1.0;
        pointFlower.offset[1] = pointFlower.area.y * 1.0;
        pointFlower.offset[2] = pointFlower.area.z * zpos;
        gl.uniform3fv(prog.uniforms.uOffset, pointFlower.offset);
        gl.drawArrays(gl.POINT, 0, pointFlower.numFlowers);

        pointFlower.offset[0] = pointFlower.area.x * 1.0;
        pointFlower.offset[1] = pointFlower.area.y * -1.0;
        pointFlower.offset[2] = pointFlower.area.z * zpos;
        gl.uniform3fv(prog.uniforms.uOffset, pointFlower.offset);
        gl.drawArrays(gl.POINT, 0, pointFlower.numFlowers);

        pointFlower.offset[0] = pointFlower.area.x * 1.0;
        pointFlower.offset[1] = pointFlower.area.y * 1.0;
        pointFlower.offset[2] = pointFlower.area.z * zpos;
        gl.uniform3fv(prog.uniforms.uOffset, pointFlower.offset);
        gl.drawArrays(gl.POINT, 0, pointFlower.numFlowers);
    }

    //main
    pointFlower.offset[0] = 0.0;
    pointFlower.offset[1] = 0.0;
    pointFlower.offset[2] = 0.0;
    gl.uniform3fv(prog.uniforms.uOffset, pointFlower.offset);
    gl.drawArrays(gl.POINT, 0, pointFlower.numFlowers);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    unuseShader(gl, prog);

    gl.enable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
}

// effects
//common util
function createEffectProgram(vtxsrc, frgsrc, exunifs, exattrs) {
    let ret = {};
    let unifs = ['uResolution', 'uSrc', 'uDelta'];
    if (exunifs) {
        unifs = unifs.concat(exunifs);
    }
    let attrs = ['aPosition'];
    if (exattrs) {
        attrs = attrs.concat(exattrs);
    }

    ret.program = createShader(gl, vtxsrc, frgsrc, unifs, attrs);
    useShader(gl, ret.program);

    ret.dataArray = new Float32Array([
        -1.0, -1.0,
        1.0, -1.0,
        -1.0, 1.0,
        1.0, 1.0
    ]);
    ret.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ret.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, ret.dataArray, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    unuseShader(gl, ret.program);

    return ret;
}

// basic usage
// useEffect(prog, srctex({'texture':texid, 'dtxArray':(f32)[dtx, dty]})); //basic initialize
// gl.uniform**(...); //additional uniforms
// drawEffect()
// unuseEffect(prog)
// TEXTURE0 makes src TEXTURE0是樱花的texture
function useEffect(fxobj, srctex) {
    let prog = fxobj.program;
    useShader(gl, prog);
    gl.uniform3fv(prog.uniforms.uResolution, renderSpec.array);

    if (srctex != null) {
        gl.uniform2fv(prog.uniforms.uDelta, srctex.dtxArray);
        gl.uniform1i(prog.uniforms.uSrc, 0);

        gl.activeTexture(gl.TEXTURE0);//for sakura
        gl.bindTexture(gl.TEXTURE_2D, srctex.texture);
    }
}
function drawEffect(fxobj) {
    gl.bindBuffer(gl.ARRAY_BUFFER, fxobj.buffer);
    gl.vertexAttribPointer(fxobj.program.attributes.aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function unuseEffect(fxobj) {
    unuseShader(gl, fxobj.program);
}

var effectLib = {};
function createEffectLib() {

    let vtxsrc, frgsrc;
    //common
    let cmnvtxsrc = document.getElementById("fx_common_vsh").textContent;

    //background
    // frgsrc = document.getElementById("bg_fsh").textContent;
    // effectLib.sceneBg = createEffectProgram(cmnvtxsrc, frgsrc, ['uTimes'], null);

    // make brightpixels buffer
    frgsrc = document.getElementById("fx_brightbuf_fsh").textContent;
    effectLib.mkBrightBuf = createEffectProgram(cmnvtxsrc, frgsrc, null, null);

    // direction blur
    frgsrc = document.getElementById("fx_dirblur_r4_fsh").textContent;
    effectLib.dirBlur = createEffectProgram(cmnvtxsrc, frgsrc, ['uBlurDir'], null);

    //final composite
    vtxsrc = document.getElementById("pp_final_vsh").textContent;
    frgsrc = document.getElementById("pp_final_fsh").textContent;
    effectLib.finalComp = createEffectProgram(vtxsrc, frgsrc, ['uBloom'], null);
}

// background
function createBackground() {
    //console.log("create background");
}
function initBackground() {
    //console.log("init background");
}
function renderBackground() {
    gl.disable(gl.DEPTH_TEST);

    useEffect(effectLib.sceneBg, null);
    gl.uniform2f(effectLib.sceneBg.program.uniforms.uTimes, timeInfo.elapsed, timeInfo.delta);
    drawEffect(effectLib.sceneBg);
    unuseEffect(effectLib.sceneBg);

    gl.enable(gl.DEPTH_TEST);
}

// post process
let postProcess = {};
function createPostProcess() {
    //console.log("create post process");
}
function initPostProcess() {
    //console.log("init post process");
}

function renderPostProcess() {
    //gl.enable(gl.TEXTURE_2D);
    gl.disable(gl.DEPTH_TEST);
    let bindRT = function (rt, isclear) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, rt.frameBuffer);
        gl.viewport(0, 0, rt.width, rt.height);
        if (isclear) {
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }
    };

    //make bright buff
    bindRT(renderSpec.wHalfRT0, true);
    useEffect(effectLib.mkBrightBuf, renderSpec.mainRT);
    drawEffect(effectLib.mkBrightBuf);
    unuseEffect(effectLib.mkBrightBuf);

    // make bloom
    for (let i = 0; i < 2; i++) {
        let p = 1.5 + 1 * i;
        let s = 2.0 + 1 * i;
        bindRT(renderSpec.wHalfRT1, true);
        useEffect(effectLib.dirBlur, renderSpec.wHalfRT0);
        gl.uniform4f(effectLib.dirBlur.program.uniforms.uBlurDir, p, 0.0, s, 0.0);
        drawEffect(effectLib.dirBlur);
        unuseEffect(effectLib.dirBlur);

        bindRT(renderSpec.wHalfRT0, true);
        useEffect(effectLib.dirBlur, renderSpec.wHalfRT1);
        gl.uniform4f(effectLib.dirBlur.program.uniforms.uBlurDir, 0.0, p, 0.0, s);
        drawEffect(effectLib.dirBlur);
        unuseEffect(effectLib.dirBlur);
    }

    //display
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, renderSpec.width, renderSpec.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    useEffect(effectLib.finalComp, renderSpec.mainRT);
    gl.uniform1i(effectLib.finalComp.program.uniforms.uBloom, 0.5);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, renderSpec.wHalfRT0.texture);

    drawEffect(effectLib.finalComp);//是你！！
    unuseEffect(effectLib.finalComp);

    gl.enable(gl.DEPTH_TEST);
}

/////
let SceneEnv = {};
function createScene() {
    createEffectLib();
    createBackground();
    createPointFlowers();
    createPostProcess();
    sceneStandBy = true;
}

function initScene() {
    initBackground();
    initPointFlowers();
    initPostProcess();

    //camera.position.y = 17.320508;
    camera.position.z = pointFlower.area.z + projection.nearfar[0];
    projection.angle = Math.atan2(pointFlower.area.y, camera.position.z + pointFlower.area.z) * 180.0 / Math.PI * 2.0;
    Matrix44.loadProjection(projection.matrix, renderSpec.aspect, projection.angle, projection.nearfar[0], projection.nearfar[1]);
}

function renderScene() {
    //draw
    Matrix44.loadLookAt(camera.matrix, camera.position, camera.lookat, camera.up);

    gl.enable(gl.DEPTH_TEST);

    //gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, renderSpec.mainRT.frameBuffer);
    gl.viewport(0, 0, renderSpec.mainRT.width, renderSpec.mainRT.height);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);//为什么0000是透明，1110不是透明。。醉了
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //怎么改才可以让背景透明呢？？？？？？也就是只绘制出不透明的物体
    //这么多的viewport是分开依次绘制到画布上的吗？？？？
    //renderBackground();
    renderPointFlowers();
    renderPostProcess(); //是你！！
}

/////
function onResize(e) {
    makeCanvasFullScreen(document.getElementById("sakura"));
    setViewports();
    if (sceneStandBy) {
        initScene();
    }
}

function setViewports() {
    renderSpec.setSize(gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.2, 0.2, 0.5, 1.0);
    gl.viewport(0, 0, renderSpec.width, renderSpec.height);

    let rtfunc = function (rtname, rtw, rth) {
        let rt = renderSpec[rtname];
        if (rt) deleteRenderTarget(gl, rt);
        renderSpec[rtname] = createRenderTarget(gl, rtw, rth);
    };
    //为了视差效果（层次差别z轴的远近）
    rtfunc('mainRT', renderSpec.width, renderSpec.height);
    // rtfunc('wFullRT0', renderSpec.width, renderSpec.height);
    // rtfunc('wFullRT1', renderSpec.width, renderSpec.height);
    rtfunc('wHalfRT0', renderSpec.halfWidth, renderSpec.halfHeight);
    rtfunc('wHalfRT1', renderSpec.halfWidth, renderSpec.halfHeight);
}

function render() {
    renderScene();
}

let animating = true;
function toggleAnimation(elm) {
    animating ^= true;
    if (animating) animate();
    if (elm) {
        elm.innerHTML = animating ? "Stop" : "Start";
    }
}

function stepAnimation() {
    if (!animating) animate();
}

function animate() {
    let curdate = new Date();
    timeInfo.elapsed = (curdate - timeInfo.start) / 1000.0;
    timeInfo.delta = (curdate - timeInfo.prev) / 1000.0;
    timeInfo.prev = curdate;

    if (animating) requestAnimationFrame(animate);
    render();
}

function makeCanvasFullScreen(canvas) {
    let b = document.body;
    let d = document.documentElement;
    let fullw = Math.max(b.clientWidth, b.scrollWidth, d.scrollWidth, d.clientWidth);
    let fullh = Math.max(b.clientHeight, b.scrollHeight, d.scrollHeight, d.clientHeight);
    canvas.width = fullw;
    canvas.height = fullh;
}

window.addEventListener('load', function (e) {
    var canvas = document.getElementById("sakura2");
    try {
        makeCanvasFullScreen(canvas);
        gl = canvas.getContext('experimental-webgl');
    } catch (e) {
        alert("WebGL not supported." + e);
        console.error(e);
        return;
    }

    window.addEventListener('resize', onResize);

    setViewports();
    createScene();
    initScene();

    timeInfo.start = new Date();
    timeInfo.prev = timeInfo.start;
    animate();
});


// function initMegumi() {
//     createRenderTarget(gl, renderSpec.width, renderSpec.height, document.getElementById("test"));
// }
//set window.requestAnimationFrame
(function (w, r) {
    w['r' + r] = w['r' + r] || w['webkitR' + r] || w['mozR' + r] || w['msR' + r] || w['oR' + r] || function (c) { w.setTimeout(c, 1000 / 60); };
})(window, 'requestAnimationFrame');