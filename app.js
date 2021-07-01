import * as THREE from './three.module.js'
const scene = new THREE.Scene();

const canvasContainer = document.querySelector('#canvasContainer');

const camera = new THREE.PerspectiveCamera( 75, canvasContainer.offsetWidth / canvasContainer.offsetHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer( { 
    antialias: true,
    canvas: document.querySelector('canvas')
} );

renderer.setSize( canvasContainer.offsetWidth, canvasContainer.offsetHeight );
renderer.setPixelRatio( window.devicePixelRatio )

const vertexShader = `
varying vec2 vertexUV;
varying vec3 vertexNormal;
void main() {
    vertexNormal = normalize(normalMatrix * normal);
    vertexUV = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
`;

const fragmentShader = `
uniform sampler2D globeTexture;
varying vec2 vertexUV;
varying vec3 vertexNormal;
void main() {
    float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
    vec3 atmosphere = vec3(0.3, 0.6, 1.0) * pow(intensity, 1.5);
    gl_FragColor = vec4(atmosphere + texture2D(globeTexture, vertexUV ).xyz, 1.0);
    }
`;

const atmosphereVertexShader =`
varying vec3 vertexNormal;
void main() {
    vertexNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 0.8 );
    }
`;

const atmosphereFragmentShader =`
varying vec3 vertexNormal;
void main() {
    float intensity = pow(0.95 - dot(vertexNormal, vec3(0, 0, 1)), 2.0);
    gl_FragColor = vec4(0.3, 0.6, 1.0, 0.6) * intensity;
    }
`;

// create a sphere

const sphere = new THREE.Mesh(new THREE.SphereGeometry(5, 50, 50),  
    new THREE.ShaderMaterial({
        vertexShader ,
        fragmentShader,
        uniforms: {
            globeTexture: {
                value: new THREE.TextureLoader().load('./img/globe.jpg')
            }
        }
    })
)

// scene.add(sphere)

// create a atmosphere

const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(5, 50, 50),  
    new THREE.ShaderMaterial({
        vertexShader : atmosphereVertexShader,
        fragmentShader : 
        atmosphereFragmentShader,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
    })
)

scene.add(atmosphere)

const group = new THREE.Group()
group.add(sphere)
scene.add(group)

atmosphere.scale.set(1.1, 1.1, 1.1)

const starGeometry = new THREE.BufferGeometry()
const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff
})

const starVertices = []
for (let i=0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000
    const y = (Math.random() - 0.5) * 2000
    const z = -Math.random() * 3000
    starVertices.push(x, y, z)
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(
    starVertices, 3 ))
const stars = new THREE.Points(starGeometry, starMaterial)
scene.add(stars)

camera.position.z = 15

const mouse = {
    x: undefined,
    y: undefined
}

function animate() {
    requestAnimationFrame ( animate )
    renderer.render(scene, camera)
    sphere.rotation.y += 0.003
    group.rotation.y = mouse.x * 0.5
    gsap.to(group.rotation,{
        x: -mouse.y * 0.3,
        y: mouse.x * 0.5,
        duration: 2
    })
}

    
animate();


addEventListener('mousemove', () => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1 
    mouse.y = -(event.clientY / innerHeight) * 2 + 1 
})


