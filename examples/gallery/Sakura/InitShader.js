function deleteRenderTarget(gl, rt) {
    gl.deleteFramebuffer(rt.frameBuffer);
    //gl.deleteRenderbuffer(rt.renderBuffer);
    gl.deleteTexture(rt.texture);
}

function createRenderTarget(gl, w, h, image=null) {
    var ret = {
        'width':w,
        'height':h,
        'sizeArray':new Float32Array([w, h, w / h]),
        'dtxArray':new Float32Array([1.0 / w, 1.0 / h])
    };
    ret.frameBuffer = gl.createFramebuffer();
    //ret.renderBuffer = gl.createRenderbuffer();//renderBuffer压根没用到
    ret.texture = gl.createTexture();
    
    gl.bindTexture(gl.TEXTURE_2D, ret.texture);
    //gl.texImage2D(target, level, internalformat, width, height, border, format, type, ArrayBufferView? pixels);
    //gl.texImage2D(target, level, internalformat, format, type, ImageData? pixels);
    if(!image){
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
    }else{
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    }
    //设置纹理图象映射到图形上的具体方法
    //gl.texParameteri(target, pname, param)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, ret.frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, ret.texture, 0);
    
    //gl.bindRenderbuffer(gl.RENDERBUFFER, ret.renderBuffer);
    //gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h);
    //gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, ret.renderBuffer);
    
    gl.bindTexture(gl.TEXTURE_2D, null);
    //gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    
    return ret;
}

function compileShader(gl, shtype, shsrc) {
    
	var retsh = gl.createShader(shtype);
	gl.shaderSource(retsh, shsrc);
	gl.compileShader(retsh);
	
	if(!gl.getShaderParameter(retsh, gl.COMPILE_STATUS)) {
		var errlog = gl.getShaderInfoLog(retsh);
		gl.deleteShader(retsh);
		console.error(errlog);
		return null;
	}
	return retsh;
}

function createShader(gl, vtxsrc, frgsrc, uniformlist, attrlist) {
    var vsh = compileShader(gl, gl.VERTEX_SHADER, vtxsrc);
    var fsh = compileShader(gl, gl.FRAGMENT_SHADER, frgsrc);
    
    if(vsh == null || fsh == null) {
        return null;
    }
    
    var prog = gl.createProgram();
    gl.attachShader(prog, vsh);
    gl.attachShader(prog, fsh);
    gl.deleteShader(vsh);
    gl.deleteShader(fsh);
    
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        var errlog = gl.getProgramInfoLog(prog);
        console.error(errlog);
        return null;
    }
    
    if(uniformlist) {
        prog.uniforms = {};
        for(var i = 0; i < uniformlist.length; i++) {
            prog.uniforms[uniformlist[i]] = gl.getUniformLocation(prog, uniformlist[i]);
        }
    }
    
    if(attrlist) {
        prog.attributes = {};
        for(var i = 0; i < attrlist.length; i++) {
            var attr = attrlist[i];
            prog.attributes[attr] = gl.getAttribLocation(prog, attr);
        }
    }
    
    return prog;
}

function useShader(gl, prog) {
    gl.useProgram(prog);
    for(var attr in prog.attributes) {
        gl.enableVertexAttribArray(prog.attributes[attr]);;
    }
}

function unuseShader(gl, prog) {
    for(var attr in prog.attributes) {
        gl.disableVertexAttribArray(prog.attributes[attr]);;
    }
    gl.useProgram(null);
}

export {
    createRenderTarget,
    deleteRenderTarget,
    createShader,
    compileShader,
    useShader,
    unuseShader
}