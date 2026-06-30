// ---- Living Blueprint 3D hero (Three.js) ----
function initHero3D(){
  const canvasHost = document.getElementById('hero3d');
  if(!canvasHost || !window.THREE) return;

  const W = canvasHost.clientWidth, H = canvasHost.clientHeight;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, W/H, 0.1, 100);
  camera.position.set(7, 5.5, 9);
  camera.lookAt(0,2,0);

  const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
  renderer.setSize(W,H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  canvasHost.appendChild(renderer.domElement);

  // Lighting
  const hemi = new THREE.HemisphereLight(0xFAF6EE, 0x22272E, 0.9);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xFFE9C7, 1.1);
  sun.position.set(6,10,4);
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xB6873E, 0.35);
  fill.position.set(-6,3,-4);
  scene.add(fill);

  // Ground "drafting paper" plane with grid
  const groundGeo = new THREE.PlaneGeometry(20,20);
  const groundMat = new THREE.MeshStandardMaterial({color:0xF2ECDD, roughness:1});
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI/2;
  ground.position.y = -0.02;
  scene.add(ground);
  const grid = new THREE.GridHelper(20, 40, 0xB6873E, 0xD8C9A8);
  grid.material.opacity = 0.35;
  grid.material.transparent = true;
  scene.add(grid);

  // Building group: stack of floor blocks that rise into place
  const buildingGroup = new THREE.Group();
  scene.add(buildingGroup);

  const floors = [];
  const floorCount = 7;
  const floorH = 0.62;
  const baseW = 3.0, baseD = 2.2;

  for(let i=0;i<floorCount;i++){
    const w = baseW - i*0.06;
    const d = baseD - i*0.04;
    const geo = new THREE.BoxGeometry(w, floorH*0.86, d);
    const mat = new THREE.MeshStandardMaterial({
      color: i % 2 === 0 ? 0xFAF6EE : 0xEDE3CC,
      roughness:0.6,
      metalness:0.05
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, i*floorH + floorH/2, 0);
    // edge wireframe (gold linework)
    const edges = new THREE.EdgesGeometry(geo);
    const lineMat = new THREE.LineBasicMaterial({color:0xB6873E, linewidth:1});
    const lines = new THREE.LineSegments(edges, lineMat);
    mesh.add(lines);

    // window strip
    const winGeo = new THREE.BoxGeometry(w*0.92, floorH*0.4, d*0.92);
    const winMat = new THREE.MeshStandardMaterial({color:0x7C8B6F, roughness:0.3, metalness:0.2, transparent:true, opacity:0.55});
    const win = new THREE.Mesh(winGeo, winMat);
    win.position.y = 0.02;
    mesh.add(win);

    mesh.scale.set(1,0.001,1);
    mesh.position.y = 0; // will animate up from ground
    buildingGroup.add(mesh);
    floors.push(mesh);
  }

  // Roof cap
  const roofGeo = new THREE.ConeGeometry(1.6, 0.9, 4);
  const roofMat = new THREE.MeshStandardMaterial({color:0xB6873E, roughness:0.4, metalness:0.3});
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.rotation.y = Math.PI/4;
  roof.position.y = floorCount*floorH + 0.45;
  roof.scale.set(0.001,0.001,0.001);
  buildingGroup.add(roof);

  // Construction animation sequence (GSAP)
  function playConstruction(){
    floors.forEach((mesh,i)=>{
      gsap.to(mesh.scale, {y:1, duration:0.7, delay: 0.15*i, ease:'power3.out'});
      gsap.to(mesh.position, {y: i*floorH + floorH/2, duration:0.7, delay:0.15*i, ease:'power3.out'});
    });
    gsap.to(roof.scale, {x:1,y:1,z:1, duration:0.6, delay:0.15*floorCount + 0.1, ease:'back.out(1.7)'});
  }

  // Floating gold particles (blueprint dust -> bricks)
  const particleCount = 140;
  const pGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount*3);
  for(let i=0;i<particleCount;i++){
    positions[i*3] = (Math.random()-0.5)*14;
    positions[i*3+1] = Math.random()*8 + 0.5;
    positions[i*3+2] = (Math.random()-0.5)*14;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions,3));
  const pMat = new THREE.PointsMaterial({color:0xB6873E, size:0.045, transparent:true, opacity:0.55});
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // Mouse parallax
  let mouseX = 0, mouseY = 0;
  canvasHost.addEventListener('mousemove', (e)=>{
    const rect = canvasHost.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left)/rect.width - 0.5);
    mouseY = ((e.clientY - rect.top)/rect.height - 0.5);
  });

  let t = 0;
  function animate(){
    requestAnimationFrame(animate);
    t += 0.004;
    buildingGroup.rotation.y = t*0.5 + mouseX*0.4;
    camera.position.x = 7 + mouseX*1.2;
    camera.position.y = 5.5 - mouseY*1.0;
    camera.lookAt(0,2.2,0);

    const pos = particles.geometry.attributes.position;
    for(let i=0;i<particleCount;i++){
      pos.array[i*3+1] -= 0.006;
      if(pos.array[i*3+1] < 0.2) pos.array[i*3+1] = 8;
    }
    pos.needsUpdate = true;

    renderer.render(scene, camera);
  }
  animate();
  setTimeout(playConstruction, 500);

  window.addEventListener('resize', ()=>{
    const w = canvasHost.clientWidth, h = canvasHost.clientHeight;
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
    renderer.setSize(w,h);
  });
}
