import * as THREE from 'three';

// Setup
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // White background matches the hero

const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(20, 20, 20);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Resize handler
window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    // Update shader resolution uniform if we add one
    if(material.uniforms.uResolution) {
        material.uniforms.uResolution.value.set(width, height);
    }
});

// Dither Shader
const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform vec2 uResolution;
    uniform float uTime;
    
    varying vec3 vNormal;
    varying vec3 vPosition;

    // Bayer matrix 4x4 for ordered dithering
    const float bayerMatrix[16] = float[16](
        0.0/16.0, 8.0/16.0, 2.0/16.0, 10.0/16.0,
        12.0/16.0, 4.0/16.0, 14.0/16.0, 6.0/16.0,
        3.0/16.0, 11.0/16.0, 1.0/16.0, 9.0/16.0,
        15.0/16.0, 7.0/16.0, 13.0/16.0, 5.0/16.0
    );

    void main() {
        // Light setup
        vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
        
        // Basic Lambertian lighting
        float diff = max(dot(vNormal, lightDir), 0.0);
        
        // Add some ambient light
        float intensity = diff * 0.8 + 0.2;

    // Dithering
    // Map screen coordinates to Bayer matrix
    // Scale coords to make pixels larger/more visible
    float scale = 2.0;
    int x = int(mod(gl_FragCoord.x / scale, 4.0));
    int y = int(mod(gl_FragCoord.y / scale, 4.0));
    int index = x + y * 4;
    
    float threshold = bayerMatrix[index];
    
    vec3 color = vec3(1.0);
    
    if (intensity < threshold) {
        color = vec3(0.05); // Dark gray/black
    }

    gl_FragColor = vec4(color, 1.0);
    }
`;

const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
        uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
        uTime: { value: 0 }
    }
});

// Geometry - City generation
const cityGroup = new THREE.Group();

// Generate random skyscrapers
const geometry = new THREE.BoxGeometry(1, 1, 1);
geometry.translate(0, 0.5, 0); 

for (let i = 0; i < 80; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    
    // Random position
    const x = (Math.random() - 0.5) * 15;
    const z = (Math.random() - 0.5) * 15;
    
    // Random height
    const h = Math.random() * 10 + 4;
    
    // Random width/depth
    const w = Math.random() * 1.5 + 0.5;
    const d = Math.random() * 1.5 + 0.5;
    
    mesh.position.set(x, 0, z);
    mesh.scale.set(w, h, d);
    
    cityGroup.add(mesh);
}

scene.add(cityGroup);

// Animation Loop
const animate = (time) => {
    requestAnimationFrame(animate);
    
    material.uniforms.uTime.value = time * 0.001;
    
    // Slowly rotate the city
    cityGroup.rotation.y = time * 0.0001;
    
    renderer.render(scene, camera);
};

animate(0);

