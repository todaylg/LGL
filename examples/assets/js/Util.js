export const TAU = 2 * Math.PI;
export function randomInRange(min, max) {
    return min + Math.random() * (max - min);
}

export function randInt( low, high ) {
    return low + Math.floor( Math.random() * ( high - low + 1 ) );
}

export function randFloat( low, high ) {
    return low + Math.random() * ( high - low );
}

export function parabola(x, k) {
    return Math.pow(4 * x * (1 - x), k);
}

export function pointInEllipse(a, b, theta, t) {
    //r*cos(A+B) = r*[cos(A)Cos(B) - sin(A)sin(B)]
    //https://www.quora.com/How-is-x-x-cos-theta-+-y-sin-theta  
    const x = a * Math.cos(t * TAU) * Math.cos(theta) - b * Math.sin(t * TAU) * Math.sin(theta);
    const y = a * Math.cos(t * TAU) * Math.sin(theta) + b * Math.sin(t * TAU) * Math.cos(theta);
    return { x, y }
}

// r: radius
// theta: 0-Pi
// phi: 0-Tau
export function sphericalToCartesian(r, theta, phi) {
    const x = r * Math.sin(theta) * Math.cos(phi);
    const y = r * Math.sin(theta) * Math.sin(phi);
    const z = r * Math.cos(theta);
    return { x, y, z };
}

export function cartesianToSpherical(x, y, z) {
    const r = Math.sqrt(x * x + y * y + z * z);
    const theta = Math.acos(z / r);
    const phi = Math.atan2(y, x);
    return { r, theta, phi };
}

//加载图片
export function loadImages(imgSrc) {
    return new Promise((res, rej) => {
        const img = new Image();
        img.setAttribute('crossOrigin', 'Anonymous');
        img.onload = () => {
            res(img);
        };
        img.onerror = () => {
            rej(img);
        };
        img.src = imgSrc;
    });
};

export function loadAllImages(imagesList) {
    return Promise.all(
        imagesList.map(imgSrc => {
            return loadImages(imgSrc);
        })
    );
};
