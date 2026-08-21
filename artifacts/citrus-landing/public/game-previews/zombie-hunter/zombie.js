//===================================================== modal
const infoBtn = document.getElementById("infoButton");
const modal = document.getElementById("controlsModal");
const closeBtn = document.getElementById("closeModal");

infoBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});


//===================================================== helpers
const randnum = (min, max) => Math.round(Math.random() * (max - min) + min);


var keyboard = {};
var shootSound = new Audio('./sounds/shoot.mp3');
shootSound.volume = 0.7;
var player = {
  height: 2.75,
  speed: window.innerWidth < 768 ? 1.5 : .85,
  turnSpeed: Math.PI * 0.005,
  canShoot: 0,
  maxHealth: 100,
  health: 100,
  isDead: false,
};

var meshs = [];
const palmCylinders = [];
var collidableMeshList = [];


  //===================================================== action
function fadeToAction(name, duration) {

  if (activeAction && activeAction !== name) {
    activeAction.fadeOut(duration);
  }

  name.reset(); // 🔥 THIS IS CRITICAL
  name.setEffectiveTimeScale(1);
  name.setEffectiveWeight(1);
  name.fadeIn(duration).play();

  activeAction = name;
}

//=========================================================================================== Gamepad API
//Modified from: https://gist.github.com/videlais/8110000
// Modified by Xander Luciano
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);//swap out button on mobile
class GamePad {
  constructor() {
    this.supported =
      (navigator.webkitGetGamepads && navigator.webkitGetGamepads()) ||
      !!navigator.webkitGamepads ||
      !!navigator.mozGamepads ||
      !!navigator.msGamepads ||
      !!navigator.gamepads ||
      (navigator.getGamepads && navigator.getGamepads());

    this.ticking = false;

    // Initialize pan, roll, and buttons
    this.pan = new THREE.Vector3(0, 0, 0);
    this.roll = new THREE.Vector3(0, 0, 0);
    this.btn = new THREE.Vector3(0, 0, 0); // needed for .set()

    this.RIGHT_AXIS_THRESHOLD = 7849 / 32767.0;
    this.LEFT_AXIS_THRESHOLD = 8689 / 32767.0;
    this.TRIGGER_AXIS_THRESHOLD = 30 / 32767.0;

    this.SPACEMOUSE_THRESHOLD = 5 / 32767.0;

    this.gamepads = [];
    this.prevRawGamepadTypes = [];
    this.prevTimestamps = [];

    this.init();
  }

  init() {
    if (this.supported) {
      // Older Firefox
      window.addEventListener(
        "MozGamepadConnected",
        e => this.onGamepadConnect(e),
        false
      );
      window.addEventListener(
        "MozGamepadDisconnected",
        e => this.onGamepadDisconnect(e),
        false
      );

      // W3C Specification
      window.addEventListener(
        "gamepadconnected",
        e => this.onGamepadConnect(e),
        false
      );
      window.addEventListener(
        "gamepaddisconnected",
        e => this.onGamepadDisconnect(e),
        false
      );

      // Chrome / CocoonJS
      if ((navigator.webkitGetGamepads && navigator.webkitGetGamepads()) || (navigator.getGamepads && navigator.getGamepads())) {
        this.startPolling();
      }
    } else {
      console.log("Gamepad API not supported or not detected!");
    }
  }

  startPolling() {
    console.log("Gamepad Controller Connected!");
    if (!this.ticking) {
      this.ticking = true;
      this.update();
    }
  }

  stopPolling() {
    alert("Gamepad Controller Disconnected!");
    this.ticking = false;
  }

  update() {
    this.pollStatus();
    if (this.ticking) {
      this.pollJoysticks();
      // You can add requestAnimationFrame here if needed
    }
  }

  pollStatus() {
    this.pollGamepads();
    for (let i in this.gamepads) {
      let gamepad = this.gamepads[i];
      if (gamepad.timestamp && gamepad.timestamp === this.prevTimestamps[i]) continue;
      this.prevTimestamps[i] = gamepad.timestamp;
    }
  }

  pollGamepads() {
    let rawGamepads =
      (navigator.webkitGetGamepads && navigator.webkitGetGamepads()) ||
      navigator.webkitGamepads ||
      navigator.mozGamepads ||
      navigator.msGamepads ||
      navigator.gamepads ||
      (navigator.getGamepads && navigator.getGamepads());

    if (rawGamepads) {
      this.gamepads = [];
      for (let i = 0, max = rawGamepads.length; i < max; i++) {
        if (typeof rawGamepads[i] !== this.prevRawGamepadTypes[i]) {
          this.prevRawGamepadTypes[i] = typeof rawGamepads[i];
        }
        if (rawGamepads[i]) this.gamepads.push(rawGamepads[i]);
      }
    }
  }

  pollJoysticks() {
    const pad = 0;

    // Reset inputs without reassigning
    this.pan.set(0, 0, 0);
    this.roll.set(0, 0, 0);
    this.btn.set(0, 0, 0); // this.btn.x/y/z will be overwritten below

    if (!this.gamepads[pad]) return;

    const gp = this.gamepads[pad];

    let panX = gp.axes[0];
    let panY = gp.axes[1];
    let panZ = gp.axes[2];

    let rollX = gp.axes[3];
    let rollY = gp.axes[4];
    let rollZ = gp.axes[5];

    // **Store full button objects so .pressed works**
    this.btn.y = gp.buttons[0]; // A
    this.btn.x = gp.buttons[1]; // B
    this.btn.z = gp.buttons[isMobile ? 2 : 3];//swap buttons on mobile
    // -------------------------
    // Apply deadzone
    const DEADZONE = 0.15;

    const applyDeadzone = (value, threshold = DEADZONE) => {
      if (Math.abs(value) < threshold) return 0;
      return (value - Math.sign(value) * threshold) / (1 - threshold);
    };

    this.pan.x = applyDeadzone(panX);
    this.pan.y = applyDeadzone(panY);
    this.pan.z = applyDeadzone(panZ);

    this.roll.x = applyDeadzone(rollX);
    this.roll.y = applyDeadzone(rollY);
    this.roll.z = applyDeadzone(rollZ);
  }

  onGamepadConnect(event) {
    console.log(event);
    let gamepad = event.gamepad;
    this.gamepads[event.gamepad.id] = gamepad;
    this.startPolling();
  }

  onGamepadDisconnect(event) {
    this.gamepads[event.gamepad.id] = null;
    if (this.gamepads.length === 0) this.stopPolling();
  }
}

// Create controller with Gamepad API
let controller = new GamePad();
console.log(controller);






//===================================================== scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.01,
  100000
);

camera.position.set(0, player.height, 0);
camera.rotation.set(0, 0, 0);




//===================================================== renderer
renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true; // Shadow
renderer.shadowMapType = THREE.PCFShadowMap; //Shadow
document.body.appendChild(renderer.domElement);

const container = document.createElement("div");
container.style.position = "absolute";
container.style.top = "20px";
container.style.left = "20px";
container.style.width = "200px";
container.style.height = "200px";
container.style.borderRadius = "50%";
container.style.overflow = "hidden";
container.style.border = "2px solid white";
container.style.boxShadow = "0 0 15px rgba(0,0,0,0.6)";
container.style.pointerEvents = "none"; // important!
document.body.appendChild(container);


// ===== MINIMAP CAMERA =====
const miniSize = 200;
const miniMapCamera = new THREE.OrthographicCamera(
  -150, 150,
   150, -150,
  0.1, 1000
);

miniMapCamera.position.set(0, 200, 0);
miniMapCamera.lookAt(0, 0, 0);
miniMapCamera.up.set(0, 0, -1); // keeps north up

const miniRenderer = new THREE.WebGLRenderer({ alpha: true });
miniRenderer.setSize(200, 200);
miniRenderer.setClearColor(0x000000, 0);


container.appendChild(miniRenderer.domElement);



//layers to display/hide
camera.layers.enable(0);
camera.layers.enable(2);
miniMapCamera.layers.enable(0);
miniMapCamera.layers.disable(2);
//===================================================== THIS IS WHERE YOUR CAMERA/GUN WILL LIVE
const visualRoot = new THREE.Object3D();
visualRoot.add(camera);
visualRoot.position.z = 150;
scene.add(visualRoot);
const tiltRoot = new THREE.Object3D();
visualRoot.add(tiltRoot);

let targetObject = visualRoot;


// ===== MINIMAP PLAYER DOT =====
const dotGeometry = new THREE.CircleGeometry(3.5, 16);
const dotMaterial = new THREE.MeshBasicMaterial({
  color: new THREE.Color("orange"),
  depthTest: false,
  depthWrite: false
});
dotMaterial.transparent = true;

const playerDot = new THREE.Mesh(dotGeometry, dotMaterial);
playerDot.rotation.x = -Math.PI / 2;
playerDot.position.y = 0.5;
playerDot.renderOrder = 999;
scene.add(playerDot);

//only show on mini map
playerDot.layers.set(1);
miniMapCamera.layers.enable(1);
camera.layers.enable(0); // main camera default
//===================================================== controls
/*var controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;
  controls.maxPolarAngle = Math.PI / 2.1;
*/



//===================================================== add front & back lighting

var light = new THREE.DirectionalLight(0xefefff, .1);
light.position.set(1, 0, 1).normalize();
scene.add(light);
var light = new THREE.DirectionalLight(0xffefef, .1);
light.position.set(-1, 0, -1).normalize();
scene.add(light);


//===================================================== fog
scene.fog = new THREE.Fog(0x080820, 200, 4000);


//===================================================== ground
const gridSize = 400; // width/depth of the grid
/*const gridDivisions = 25; // number of lines
const grid = new THREE.GridHelper(
  gridSize,
  gridDivisions,
  new THREE.Color("white"),
  new THREE.Color("white")
);
scene.add(grid);*/



const gridGroup = new THREE.Group();
scene.add(gridGroup);


const gridMat = new THREE.MeshBasicMaterial({
  color: new THREE.Color("white"),
  transparent: true,
  opacity: 0.05,
  side: THREE.DoubleSide
});


const size = 200;
const divisions = 40;
const step = size / divisions;
const thickness = 0.2; // 👈 line thickness

for (let i = -size; i <= size; i += step) {

  // ===== horizontal line (X axis)
  const geoH = new THREE.PlaneGeometry(size * 2, thickness);
  const lineH = new THREE.Mesh(geoH, gridMat);
  lineH.rotation.x = -Math.PI / 2;
  lineH.position.set(0, 0.01, i);
  gridGroup.add(lineH);

  // ===== vertical line (Z axis)
  const geoV = new THREE.PlaneGeometry(size * 2, thickness);
  const lineV = new THREE.Mesh(geoV, gridMat);
  lineV.rotation.x = -Math.PI / 2;
  lineV.rotation.z = Math.PI / 2;
  lineV.position.set(i, 0.01, 0);
  gridGroup.add(lineV);
}
//===================================================== resize
window.addEventListener("resize", function () {
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

function resizeMinimap() {
  const isMobile = window.innerWidth < 768;
  const size = Math.min(window.innerWidth, window.innerHeight) * 0.32;   // UI size
  const viewSize = isMobile ? 35 : 50; // world zoom level

  // Resize container
  container.style.width = size + "px";
  container.style.height = size + "px";

  // Resize renderer
  miniRenderer.setSize(size, size);

  // Adjust orthographic camera zoom (VERY IMPORTANT)
  miniMapCamera.left   = -viewSize;
  miniMapCamera.right  =  viewSize;
  miniMapCamera.top    =  viewSize;
  miniMapCamera.bottom = -viewSize;

  miniMapCamera.updateProjectionMatrix();
}

resizeMinimap();
window.addEventListener("resize", resizeMinimap);
//=========================================================================================== add tweening
//https://greensock.com/forums/topic/16993-threejs-properties/
Object.defineProperties(THREE.Object3D.prototype, {
  x: {
    get: function () {
      return this.position.x;
    },
    set: function (v) {
      this.position.x = v;
    }
  },
  y: {
    get: function () {
      return this.position.y;
    },
    set: function (v) {
      this.position.y = v;
    }
  },
  z: {
    get: function () {
      return this.position.z;
    },
    set: function (v) {
      this.position.z = v;
    }
  },
  rotationZ: {
    get: function () {
      return this.rotation.x;
    },
    set: function (v) {
      this.rotation.x = v;
    }
  },
  rotationY: {
    get: function () {
      return this.rotation.y;
    },
    set: function (v) {
      this.rotation.y = v;
    }
  },
  rotationX: {
    get: function () {
      return this.rotation.z;
    },
    set: function (v) {
      this.rotation.z = v;
    }
  }
});







//===================================================== beam raycast
var material = new THREE.MeshBasicMaterial({
  color: new THREE.Color("red"),
  transparent: true,
  opacity: 0
});
// THREE.Geometry was removed – use BufferGeometry instead
var beamPoints = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 0, 100),
  new THREE.Vector3(0, 0, 150)
];
var geometry = new THREE.BufferGeometry().setFromPoints(beamPoints);

var beam = new THREE.Line(geometry, material);
tiltRoot.add(beam);

//===================================================== flashlight
const flashlight = new THREE.SpotLight(new THREE.Color("white"), 5); // color, intensity

flashlight.angle = Math.PI / 8;   // cone width
flashlight.penumbra = 0.4;        // soft edge
flashlight.distance = 50;         // how far it shines
flashlight.decay = 2;             // realistic falloff

flashlight.castShadow = true;
camera.add(flashlight);
camera.add(flashlight.target);
flashlight.position.set(0, 0, 20);
flashlight.target.position.set(0, 0, -1);
//flashlight.layers.set(2);//hide on minimap




//===================================================== add model
var baseY;
var baseZ;
var baseX;
var loader = new THREE.GLTFLoader();
loader.load(
  "https://raw.githubusercontent.com/Data-Bee38/models/main/gun2.glb",
  function (object) {
    object.scene.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.castShadow = false;
        node.material = new THREE.MeshPhongMaterial( { color: new THREE.Color('#111'), specular: new THREE.Color('#222'), shininess: 0 } );

        // ===== Add edges outline =====
        var edges = new THREE.EdgesGeometry(node.geometry);
        var lineMat = new THREE.LineBasicMaterial({ color: new THREE.Color("white"), linewidth: 2,transparent: true, opacity: .05 });
        var outline = new THREE.LineSegments(edges, lineMat);
        //node.add(outline);
      }
    });

    gun = object.scene;
    gun.position.set(0, 0.05, 0);
    gun.scale.set(12,12,12);
    tiltRoot.add(gun);

    // store original Y position
    baseY = tiltRoot.position.y;
    baseZ = tiltRoot.position.z;
    baseX = tiltRoot.position.x;

  }
);





//===================================================== add model
let treeModel = null;
const treeLoader = new THREE.GLTFLoader();

treeLoader.load(
  "https://raw.githubusercontent.com/Data-Bee38/models/main/dead_tree.glb",
  function (gltf) {

    gltf.scene.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;

        node.material = new THREE.MeshPhongMaterial({
          color: new THREE.Color("#111"),
          specular: new THREE.Color("#222"),
          shininess: 0,
          side: THREE.DoubleSide
        });

        const edges = new THREE.EdgesGeometry(node.geometry);
        const lineMat = new THREE.LineBasicMaterial({ color: new THREE.Color("white"), transparent: true, opacity: .15 });
        const outline = new THREE.LineSegments(edges, lineMat);
        node.add(outline);
      }
    });

    treeModel = gltf.scene;

    // ✅ SPAWN TREES ONLY AFTER LOADED
    createTreeCluster(0, 0, 0);
 


  }
);



function createTreeCluster(
  centerX,
  centerY,
  centerZ,
  options = {}
) {
  if (!treeModel) return;

  // ===== DEFAULT SETTINGS =====
  const {
    count = 15,
    baseRadius = 50,
    radialJitterRange = 35,
    zScatterRange = 45,
    minScale = 2.5,
    maxScale = 3.5
  } = options;

  for (let i = 0; i < count; i++) {

    // ---- Circle placement ----
    const angle = (i / count) * Math.PI * 2;

    const radialJitter = randnum(-radialJitterRange, radialJitterRange);
    const zScatter = randnum(-zScatterRange, zScatterRange);

    const r = baseRadius + radialJitter;

    const x = centerX + Math.cos(angle) * r;
    const z = centerZ + Math.sin(angle) * r + zScatter;
    const y = centerY;

    const scale = randnum(minScale, maxScale);
    const rotationY = Math.random() * Math.PI * 2;

    // =============================
    // THREE TREE
    // =============================
    const tree = treeModel.clone(true);

    tree.position.set(x, y, z);
    tree.rotation.y = rotationY;
    tree.scale.set(scale, scale, scale);

    scene.add(tree);

    // =============================
    // PLAYER COLLISION
    // =============================
    const trunkRadius = 1.5 * scale;
    const trunkWidth = 1.5 * scale;     // adjust to match trunk thickness
    const trunkHeight = 12 * scale;   // trunk height
    const trunkDepth = 3 * scale;

    palmCylinders.push({
      position: tree.position,
      radius: trunkRadius/2,
      height: trunkHeight
    });

  }
}







//===================================================== add model
// BufferGeometry.fromGeometry() was removed – use BoxGeometry directly
var buffgeoBox = new THREE.BoxGeometry(1, 1, 1);

var loader = new THREE.GLTFLoader();
loader.load(
  "https://raw.githubusercontent.com/Data-Bee38/models/main/low_poly_humvee_free.glb",
  function (gltf) {
    gltf.scene.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true;
        node.material.side = THREE.DoubleSide;
        node.material = new THREE.MeshPhongMaterial({
          color: new THREE.Color("#111"),
          specular: new THREE.Color("#222"),
          shininess: 0,
          side: THREE.DoubleSide
        });

        // ===== Add edges outline =====
        var edges = new THREE.EdgesGeometry(node.geometry);
        var lineMat = new THREE.LineBasicMaterial({color: new THREE.Color("white"),linewidth: 5, transparent: true, opacity: .15});
        var outline = new THREE.LineSegments(edges, lineMat);
        node.add(outline);
      }
    });

    var humvee = gltf.scene;
    humvee.scale.set(3,3,3);
    humvee.position.set(-10, 3, -25);
    humvee.rotateY(-Math.PI / 2);
    humvee.rotateX(-Math.PI / 2);
    //humvee.position.y = 1;
    scene.add(humvee);

    var mesh = new THREE.Mesh(
      buffgeoBox,
      new THREE.MeshStandardMaterial({
        color: 0x555555,
        transparent: true,
        opacity: 0
      })
    );
    mesh.scale.set(5, 2, 2.5);
   /* mesh.position.set(
      humvee.position.x + 2.5,
      humvee.position.y,
      humvee.position.z
    );*/
    mesh.position.set(-.25, 1, 0);
    mesh.visible = false;
    humvee.add(mesh);
    meshs.push(mesh);
    //cene.add(mesh);
  }
);



//===================================================== add model
var loader = new THREE.GLTFLoader();
loader.load(
  'https://raw.githubusercontent.com/Data-Bee38/models/main/bridge2.glb',
  function (gltf) {

    var model = gltf.scene;
    model.scale.set(150,150,150);
    model.position.set(0,0,-200);
    scene.add(model);

    gltf.scene.traverse(function(node) {

      if (node.isMesh) {
        node.castShadow = true;

        // Handle multi-material meshes
        const materials = Array.isArray(node.material)
          ? node.material
          : [node.material];

        const newMaterials = materials.map((mat) => {

          if (mat.name && mat.name.toLowerCase().includes("light")) {
            // 🔥 LIGHT MATERIAL
            return new THREE.MeshBasicMaterial({
              color: new THREE.Color("wheat"),
              transparent: true,
              opacity: 1
            });
          } else {
            // 🌑 NORMAL MATERIAL
            return new THREE.MeshPhongMaterial({
              color: new THREE.Color('#111'),
              specular: new THREE.Color('#222'),
              shininess: 0,
              side: THREE.DoubleSide
            });
          }

        });

        node.material = Array.isArray(node.material)
          ? newMaterials
          : newMaterials[0];

        // ===== Add edges outline =====
        var edges = new THREE.EdgesGeometry(node.geometry);
        var lineMat = new THREE.LineBasicMaterial({
          color: new THREE.Color("white"),
          linewidth: 2,
          transparent: true,
          opacity: 0.05
        });

        var outline = new THREE.LineSegments(edges, lineMat);
        node.add(outline);

        console.log(node);
      }

    });

  },
  undefined,
  function (error) {
    console.error('An error occurred while loading the model:', error);
  }
);

  


  //===================================================== model
  var loader = new THREE.GLTFLoader();
  loader.load(
    'https://raw.githubusercontent.com/Data-Bee38/models/main/tram.glb',  // Make sure the path is correct
    function (gltf) {

      var model = gltf.scene;
      model.scale.set(30,50,30);
      model.position.set(-300,30, -200);
      model.rotateY(Math.PI/2);
      scene.add(model);


      // Tweening setup
      resetPosition();
      function resetPosition() {
        model.position.x = -300; // Reset position
        TweenMax.to(model.position, 15, { 
          x: 300, // Target position
          ease: Power1.easeInOut, // Smooth easing
          onComplete: resetPosition // Restart the tween
        });
      }


      gltf.scene.traverse(function(node) {
        if (node instanceof THREE.Mesh) {
          node.castShadow = true;
          node.material.side = THREE.DoubleSide;
          node.material = new THREE.MeshPhongMaterial( { color: new THREE.Color('#111'), specular: new THREE.Color('#222'), shininess: 0 } );

        // ===== Add edges outline =====
        var edges = new THREE.EdgesGeometry(node.geometry);
        var lineMat = new THREE.LineBasicMaterial({ color: new THREE.Color("white"), linewidth: 2 });
        var outline = new THREE.LineSegments(edges, lineMat);
        //node.add(outline);

          // Check if the mesh name indicates it is a window
          if (node.name.toLowerCase().includes('window')) {
            console.log(`Updating Material for Mesh: ${node.name}`);

            // Create a new white material
            const whiteMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color('white'),transparent: true,opacity: .65});

            // Assign the new material
            node.material = whiteMaterial;
          }



        }
      });


    },
    undefined,
    function (error) {
      console.error('An error occurred while loading the model:', error);
    }
  );







 //===================================================== model
  var group3 = new THREE.Group();
  group3.position.set(-100, 0, 200);
  scene.add(group3);


  var loader = new THREE.GLTFLoader();
  loader.load(
    'https://raw.githubusercontent.com/Data-Bee38/models/main/Barn.glb',  // Make sure the path is correct
    function (gltf) {
      var model = gltf.scene;
      group3.add(model);


      // Position and scale the model as needed
      model.rotateY(Math.PI/1.5);
      model.scale.set(100,100,100);


      var pointflagLight = new THREE.PointLight(new THREE.Color("orange"), 5, 50);
      pointflagLight.position.set(0, 25, 0);
      group3.add(pointflagLight);



      gltf.scene.traverse(function(node) {
        if (node instanceof THREE.Mesh) {
          node.castShadow = true;
          node.material.side = THREE.DoubleSide;
          node.material = new THREE.MeshPhongMaterial( { color: new THREE.Color('#111'), specular: new THREE.Color('#222'), shininess: 0 } );

        // ===== Add edges outline =====
        var edges = new THREE.EdgesGeometry(node.geometry);
        var lineMat = new THREE.LineBasicMaterial({ color: new THREE.Color("white"), linewidth: 2, transparent: true,opacity: .075 });
        var outline = new THREE.LineSegments(edges, lineMat);
        node.add(outline);
        }
      });

    },
    undefined,
    function (error) {
      console.error('An error occurred while loading the model:', error);
    }
  );






 //===================================================== model

  var loader = new THREE.GLTFLoader();
  loader.load(
    'https://raw.githubusercontent.com/Data-Bee38/models/main/volcano.glb',  // Make sure the path is correct
    function (gltf) {
      var model = gltf.scene;
      group3.add(model);


      // Position and scale the model as needed
      model.scale.set(100,100,100);
      model.position.x = 140;
      model.position.y = -.75;
      model.position.z = 75;


      gltf.scene.traverse(function(node) {
        if (node instanceof THREE.Mesh) {
          node.castShadow = true;
          node.material.side = THREE.DoubleSide;
          node.material = new THREE.MeshPhongMaterial( { color: new THREE.Color('#111'), specular: new THREE.Color('#222'), shininess: 0 } );

        // ===== Add edges outline =====
        var edges = new THREE.EdgesGeometry(node.geometry);
        var lineMat = new THREE.LineBasicMaterial({ color: new THREE.Color("white"), linewidth: 2, transparent: true,opacity: .075 });
        var outline = new THREE.LineSegments(edges, lineMat);
        node.add(outline);
        }
      });

    },
    undefined,
    function (error) {
      console.error('An error occurred while loading the model:', error);
    }
  );



//===================================================== model

loader.load(
  'https://raw.githubusercontent.com/Data-Bee38/models/main/roadblock.glb',
  function (gltf) {

    const original = gltf.scene;

    for (let side = 0; side < 2; side++) {
      for (let i = 0; i < 6; i++) {

        const model = original.clone(true);

        const isLeft = side === 1;
        const x = isLeft ? -55 : 55;

        model.scale.set(5, 1.5, 1.5);
        model.position.set(x, 0, (i * 60) - 125);

        // base rotation
        model.rotation.y = Math.PI / 2;

        // 🔥 flip left side
        if (isLeft) {
          model.rotation.y += Math.PI;
        }

        scene.add(model);

        model.traverse(function(node) {
          if (node.isMesh) {

            node.castShadow = true;
            node.material.side = THREE.DoubleSide;
            node.material = new THREE.MeshPhongMaterial({
              color: new THREE.Color('#111'),
              specular: new THREE.Color('#222'),
              shininess: 0
            });

            var edges = new THREE.EdgesGeometry(node.geometry);
            var lineMat = new THREE.LineBasicMaterial({
              color: new THREE.Color("white"),
              transparent: true,
              opacity: .15
            });
            var outline = new THREE.LineSegments(edges, lineMat);
            node.add(outline);
          }
        });

      }
    }//end for loop



    //2 extra roadblocks
    const extra1 = original.clone(true);
    extra1.scale.set(20, 1.5, 1.5);
    extra1.position.set(5, 0, 185);
    //extra1.rotation.y = Math.PI / 2;
    scene.add(extra1);

    const extra2 = original.clone(true);
    extra2.scale.set(25, 1.5, 1.5);
    extra2.position.set(10, 0, -185);
    //extra2.rotation.y = Math.PI / 2;
    scene.add(extra2);

    [extra1, extra2].forEach(model => {
      model.traverse(function(node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.material.side = THREE.DoubleSide;
          node.material = new THREE.MeshPhongMaterial({
            color: new THREE.Color('#111'),
            specular: new THREE.Color('#222'),
            shininess: 0
          });

          var edges = new THREE.EdgesGeometry(node.geometry);
          var lineMat = new THREE.LineBasicMaterial({
            color: new THREE.Color("white"),
            transparent: true,
            opacity: .15
          });
          var outline = new THREE.LineSegments(edges, lineMat);
          node.add(outline);
        }
      });
    });




  }
);






//===================================================== model
loader.load(
  'https://raw.githubusercontent.com/Data-Bee38/models/main/lightpole.glb',
  function (gltf) {

    const original = gltf.scene;

    for (let side = 0; side < 2; side++) {
      for (let i = 0; i < 6; i++) {

        const model = original.clone(true);

        const isLeft = side === 1;
        const x = isLeft ? -55 : 55;

        model.scale.set(2, 2, 2);
        model.position.set(x, 0, (i * 60) - 150);

        // 🔥 rotate left side
        if (isLeft) {
          model.rotation.y = Math.PI;
        }

        scene.add(model);

        model.traverse(function(node) {
          if (node.isMesh) {

            node.castShadow = true;
            node.material.side = THREE.DoubleSide;

            if (node.name.toLowerCase().includes("light")) {
              node.material = new THREE.MeshBasicMaterial({
                color: new THREE.Color('white')
              });
            } else {
              node.material = new THREE.MeshPhongMaterial({
                color: new THREE.Color('#111'),
                specular: new THREE.Color('#222'),
                shininess: 0
              });
            }

            var edges = new THREE.EdgesGeometry(node.geometry);
            var lineMat = new THREE.LineBasicMaterial({
              color: new THREE.Color("white"),
              transparent: true,
              opacity: .15
            });
            var outline = new THREE.LineSegments(edges, lineMat);
            node.add(outline);
          }
        });

      }
    }//end for loop

  }
);





 //===================================================== text

// THREE.FontLoader is loaded via FontLoader.js addon (aliased as THREE.FontLoader)
var loader = new THREE.FontLoader();
loader.load(
    'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/fonts/optimer_regular.typeface.json',
    function (font) {
        var textGeometry = new THREE.TextGeometry('ZOMBIE HUNTER', {
            font: font,
            size: 15,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelSegments: 5,
        });

        var textMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('white') });
        var textMesh = new THREE.Mesh(textGeometry, textMaterial);

        textMesh.position.set(-50, 50, -225);
        //textMesh.rotateY(-Math.PI);
        scene.add(textMesh);

     
    }
);








//===================================================== ENEMY & WAVE SYSTEM

// ---- Enemy Type Configs ----
const ENEMY_TYPES = {
  BASIC:    { name:'Basic Zombie', speed:1.5,  health:1, scale:0.025, tint:null,       score:100, label:'🧟' },
  RUNNER:   { name:'Runner',       speed:4.2,  health:1, scale:0.019, tint:'#FF5555',  score:150, label:'💨' },
  TANK:     { name:'Tank',         speed:0.65, health:5, scale:0.042, tint:'#4A7C59',  score:500, label:'🛡️' },
  ACID:     { name:'Acid Zombie',  speed:1.8,  health:2, scale:0.022, tint:'#39FF14',  score:250, label:'☠️' },
  SCREAMER: { name:'Screamer',     speed:1.0,  health:2, scale:0.024, tint:'#C77DFF',  score:200, label:'📢' },
};

// ---- Wave Compositions ----
const WAVE_DEFS = [
  ['BASIC','BASIC','BASIC'],
  ['BASIC','BASIC','RUNNER','RUNNER'],
  ['BASIC','RUNNER','RUNNER','ACID'],
  ['RUNNER','RUNNER','ACID','ACID','BASIC'],
  ['BASIC','RUNNER','ACID','ACID','TANK'],
  ['TANK','RUNNER','RUNNER','ACID','BASIC','SCREAMER'],
  ['TANK','TANK','ACID','SCREAMER','RUNNER','RUNNER'],
  ['TANK','ACID','SCREAMER','SCREAMER','RUNNER','RUNNER','BASIC'],
  ['TANK','TANK','SCREAMER','ACID','ACID','RUNNER','RUNNER','BASIC'],
  ['TANK','TANK','SCREAMER','ACID','ACID','RUNNER','RUNNER','BASIC','BASIC'],
];

var mixers     = [];
var enemies    = [];
var zombieGLTF = null;
var zombieVariants = [];
var enemyheight= 3.75;

function findClip(animations, patterns) {
  if (!animations || animations.length === 0) return null;
  for (var p = 0; p < patterns.length; p++) {
    var re = patterns[p];
    for (var i = 0; i < animations.length; i++) {
      if (re.test(animations[i].name)) return animations[i];
    }
  }
  return animations[0];
}

function measureBounds(object3d) {
  var box = new THREE.Box3().setFromObject(object3d);
  var size = new THREE.Vector3();
  box.getSize(size);
  return { height: size.y || 1, minY: box.min.y };
}
function measureHeight(object3d) {
  return measureBounds(object3d).height;
}
var score      = 0;
var waveNumber = 0;
var waveEnemiesAlive = 0;
var waveInProgress   = false;
var gameOver = false;
var gamePaused = false;
let autoRestartTimer = null;


// ---- Per-enemy fade helper ----
function fadeToActionEnemy(enemy, action, duration) {
  const curr = enemy.userData.activeAction;
  if (curr && curr !== action) curr.fadeOut(duration);
  action.reset();
  action.setEffectiveTimeScale(1);
  action.setEffectiveWeight(1);
  action.fadeIn(duration).play();
  enemy.userData.activeAction = action;
}

// ---- Spawn one enemy of given type ----
function spawnEnemy(typeName, posX, posZ) {
  if (zombieVariants.length === 0) return;
  const cfg = ENEMY_TYPES[typeName] || ENEMY_TYPES.BASIC;

  // Attack cooldown / damage tuning (player health)
  const ATTACK_COOLDOWN_MS = 900; // per enemy
  const DAMAGE_ON_HIT = 10;      // per attack tick


  const group = new THREE.Group();
  group.userData.isEnemy  = true;
  group.userData.isDead   = false;
  group.userData.health   = cfg.health;
  group.userData.cfg      = cfg;
  group.userData.activeAction = null;
  group.userData.lastAttackTime = 0;
  group.userData.attackCooldownMs = 900;
  group.userData.damageOnHit = 10;


  // Collider
  const cGeo = new THREE.BoxGeometry(1.5, enemyheight, 1);
  cGeo.applyMatrix4(new THREE.Matrix4().makeTranslation(0, enemyheight / 2, 0));
  const cMat = new THREE.MeshNormalMaterial({ transparent:true, opacity:0, depthWrite:false });
  const collider = new THREE.Mesh(cGeo, cMat);
  collider.name = 'collider';
  collider.visible = false;
  collider.userData.enemy = group;
  group.add(collider);
  collidableMeshList.push(collider);
  meshs.push(collider);

  // Pick a random model variant
  const variant = zombieVariants[Math.floor(Math.random() * zombieVariants.length)];
  const sizeMul = cfg.scale / 0.025;
  const finalScale = (variant.def && variant.def.scaleOverride)
    ? variant.def.scaleOverride * sizeMul
    : (enemyheight / variant.nativeHeight) * sizeMul;

  // Clone model
  const model = THREE.SkeletonUtils.clone(variant.gltf.scene);
  model.scale.set(finalScale, finalScale, finalScale);
  var _lift = 0;
  if (variant.def.groundOffset !== undefined) {
    _lift = variant.def.groundOffset;
  } else {
    var _rawLift = -variant.nativeMinY * finalScale;
    var _maxSafe = variant.nativeHeight * finalScale * 0.45;
    _lift = Math.min(_rawLift, _maxSafe);
    _lift = Math.max(_lift, 0);
  }
  model.position.set(0, _lift, 0);
  model.traverse(function(node) {
    if (node.isMesh) {
      node.castShadow    = true;
      node.frustumCulled = false;
      if (cfg.tint) {
        node.material = node.material.clone();
        node.material.emissive          = new THREE.Color(cfg.tint);
        node.material.emissiveIntensity = 0.35;
      }
    }
  });
  group.add(model);

  // Spotlight
  const sl = new THREE.SpotLight(new THREE.Color('wheat'), 2);
  sl.penumbra = 0.3; sl.distance = 12; sl.decay = 2;
  sl.position.set(0, 5, 0); sl.target = group;
  group.add(sl);

  // AnimationMixer on the clone
  const mixer    = new THREE.AnimationMixer(model);
  const walkClip = variant.walkClip;
  const atkClip  = variant.atkClip;
  const dieClip  = variant.dieClip;
  const walkAction = mixer.clipAction(walkClip);
  const atkAction  = mixer.clipAction(atkClip);
  const dieAction  = mixer.clipAction(dieClip);
  dieAction.clampWhenFinished = true;
  dieAction.loop = THREE.LoopOnce;
  walkAction.play();
  group.userData.activeAction = walkAction;
  group.userData.actions = { walk: walkAction, attack: atkAction, die: dieAction };
  group.userData.mixer   = mixer;
  mixers.push(mixer);

  group.position.set(posX, 0, posZ);
  scene.add(group);
  enemies.push(group);
  waveEnemiesAlive++;
  return group;
}

// ---- Kill an enemy ----
function setGameOver() {
  if (gameOver) return;
  gameOver = true;
  player.isDead = true;

  const el = document.getElementById('wave-announce');
  if (el) {
    el.innerText = '💀 GAME OVER';
    el.style.color = '#FF4444';
    el.style.textShadow = '0 0 30px #FF0000, 4px 4px 0px #000';
    el.classList.add('visible');
  }

  // Auto-restart shortly after death so the next run starts clean.
  if (autoRestartTimer) clearTimeout(autoRestartTimer);
  autoRestartTimer = setTimeout(function() {
    restartGame();
  }, 2500);
}

function applyPlayerDamage(amount) {
  if (gameOver || player.isDead) return;
  player.health = Math.max(0, player.health - amount);
  updatePlayerHUD();

  if (player.health <= 0) {
    setGameOver();
  }
} 

function killEnemy(enemy) {
  if (!enemy || enemy.userData.isDead) return;
  enemy.userData.isDead = true;
  const actions = enemy.userData.actions;
  actions.die.reset();
  fadeToActionEnemy(enemy, actions.die, 0.4);
  score += enemy.userData.cfg.score;
  updateHUD();
  waveEnemiesAlive--;
  setTimeout(function() {
    // Remove collider from tracking arrays
    const col = enemy.children.find(c => c.name === 'collider');
    if (col) {
      collidableMeshList.splice(collidableMeshList.indexOf(col), 1);
      meshs.splice(meshs.indexOf(col), 1);
    }
    // Remove mixer
    if (enemy.userData.mixer) {
      const mi = mixers.indexOf(enemy.userData.mixer);
      if (mi !== -1) mixers.splice(mi, 1);
    }
    scene.remove(enemy);
    enemies.splice(enemies.indexOf(enemy), 1);
    if (waveEnemiesAlive <= 0 && waveInProgress) onWaveComplete();
  }, 2500);
}

// ---- Wave management ----
function startWave(num) {
  waveNumber       = num;
  waveInProgress   = true;
  waveEnemiesAlive = 0;
  const def   = WAVE_DEFS[Math.min(num - 1, WAVE_DEFS.length - 1)];
  const types = [...def];
  // Extra enemies for bonus waves
  const extra = Math.max(0, num - WAVE_DEFS.length);
  for (let e = 0; e < extra; e++) types.push(['TANK','SCREAMER','ACID'][e % 3]);

  showWaveAnnouncement('⚠️ WAVE ' + num, '#FF4444');
  updateHUD();

  types.forEach(function(type, i) {
    setTimeout(function() {
      const angle = Math.random() * Math.PI * 2;
      const dist  = 18 + Math.random() * 14; // close enough to see immediately
      spawnEnemy(type,
        visualRoot.position.x + Math.cos(angle) * dist,
        visualRoot.position.z + Math.sin(angle) * dist
      );
    }, i * 900);
  });
}

function onWaveComplete() {
  waveInProgress = false;
  showWaveAnnouncement('✅ WAVE CLEAR!', '#00FF88');
  updateHUD();
  setTimeout(function() { startWave(waveNumber + 1); }, 6000);
}

function showWaveAnnouncement(text, color) {
  const el = document.getElementById('wave-announce');
  if (!el) return;
  el.innerText = text;
  el.style.color = color || '#FF4444';
  el.style.textShadow = '0 0 20px ' + (color || '#FF4444');
  el.classList.add('visible');
  setTimeout(function() { el.classList.remove('visible'); }, 3000);
}

function updateHUD() {
  const wEl = document.getElementById('wave-num');
  const sEl = document.getElementById('score-num');
  const aEl = document.getElementById('alive-num');
  if (wEl) wEl.innerText = waveNumber;
  if (sEl) sEl.innerText = score;
  if (aEl) aEl.innerText = Math.max(0, waveEnemiesAlive);
}

function updatePlayerHUD() {
  const fill = document.getElementById('player-health-fill');
  const curTxt = document.getElementById('player-health-text');
  const maxTxt = document.getElementById('player-health-max-text');
  if (!fill) return;
  const max = player.maxHealth || 100;
  const cur = Math.max(0, Math.min(max, player.health));
  const pct = max > 0 ? cur / max : 0;
  fill.style.width = (pct * 100).toFixed(1) + '%';
  if (curTxt) curTxt.innerText = Math.round(cur);
  if (maxTxt) maxTxt.innerText = Math.round(max);
}

// ---- Load zombie GLTFs once, then start waves ----
var ZOMBIE_MODEL_DEFS = [
  { key: 'brenner',  url: './models/zombie_brenner.glb'                                   },
  { key: 'putrid',   url: './models/zombie_putrid.glb'                                    },
  { key: 'eyebeast', url: './models/eyebeast_-_animated.glb',   groundOffset: 0.0        },
  { key: 'shambler', url: './models/shambler_zombie_transition.glb', scaleOverride: 2.5  },
  { key: 'manthing', url: './models/manthing.glb'                                         }
];

var _zombiesLoaded = 0;
ZOMBIE_MODEL_DEFS.forEach(function(def) {
  var zombieLoader = new THREE.GLTFLoader();
  zombieLoader.load(def.url, function(gltf) {
    var _bounds = measureBounds(gltf.scene);
    var nativeHeight = _bounds.height;
    var nativeMinY  = _bounds.minY;
    console.log('[MODEL]', def.key, 'h='+nativeHeight.toFixed(2), 'minY='+nativeMinY.toFixed(2), 'autoScale='+(3.75/nativeHeight).toFixed(5));
    var anims = gltf.animations || [];
    var walkClip = findClip(anims, [/walk/i, /run/i, /move/i, /loco/i, /idle/i]);
    var atkClip  = findClip(anims, [/attack/i, /bite/i, /hit/i, /punch/i, /swing/i]);
    var dieClip  = findClip(anims, [/die|death|dead|fall/i]);
    zombieVariants.push({
      key: def.key,
      def: def,
      gltf: gltf,
      nativeHeight: nativeHeight,
      nativeMinY: nativeMinY,
      walkClip: walkClip,
      atkClip:  atkClip  || walkClip,
      dieClip:  dieClip  || walkClip
    });
    zombieGLTF = gltf; // keep legacy reference non-null
    _zombiesLoaded++;
    if (_zombiesLoaded === ZOMBIE_MODEL_DEFS.length) {
      setTimeout(function() { startWave(1); }, 2000);
    }
  }, undefined, function(err) {
    console.error('Failed to load zombie model', def.url, err);
    _zombiesLoaded++;
    if (_zombiesLoaded === ZOMBIE_MODEL_DEFS.length && zombieVariants.length > 0) {
      setTimeout(function() { startWave(1); }, 2000);
    }
  });
});






//===================================================== model
/*var loader = new THREE.GLTFLoader();
var mixer;
var model;
loader.load(
  "https://raw.githubusercontent.com/Data-Bee38/models/main/husky.glb",
  function (gltf) {
    //shadows and materials
    gltf.scene.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true;
        node.material.side = THREE.DoubleSide;
      }
      if (node.isSkinnedMesh) {
        skeleton = node.skeleton;
      } 
    });

    model = gltf.scene;
    model.scale.set(.75,.75,.57);
    model.position.set(0,0,50);
    scene.add(model);

    console.log(gltf.animations); //shows all animations imported into the dopesheet in blender

    mixer = new THREE.AnimationMixer(model);
    mixers.push(mixer);
    var shoot = mixer.clipAction(gltf.animations[6]);

    //fadeToAction( activeAction, name, duration )
    shoot.play();

  }
);
*/



//===================================================== Joystick
class JoyStick {
  constructor(options) {
    const circle = document.createElement("div");
    circle.style.touchAction = "none";
    circle.id = "joystick";
    circle.style.cssText =
      "position:absolute; bottom:35px; width:80px; height:80px; background:rgba(126, 126, 126, 0.5); border:#444 solid medium; border-radius:50%; right:30px;";
    const thumb = document.createElement("div");
    thumb.style.cssText =
      "position: absolute; left: 20px; top: 20px; width: 40px; height: 40px; border-radius: 50%; background: #fff;";
    circle.appendChild(thumb);
    document.body.appendChild(circle);
    this.domElement = thumb;
    this.maxRadius = options.maxRadius || 40;
    this.maxRadiusSquared = this.maxRadius * this.maxRadius;
    this.onMove = options.onMove;
    this.game = options.game;
    this.origin = {
      left: this.domElement.offsetLeft,
      top: this.domElement.offsetTop
    };
    this.rotationDamping = options.rotationDamping || 0.06;
    this.touchId = null;
    this.moveDamping = options.moveDamping || 0.01;
    if (this.domElement != undefined) {
      const joystick = this;
      if ("ontouchstart" in window) {
        this.domElement.addEventListener("touchstart", function (evt) {
          joystick.tap(evt);
        });
      } else {
        this.domElement.addEventListener("mousedown", function (evt) {
          joystick.tap(evt);
        });
      }
    }
  }

  getMousePosition(evt) {
    let clientX = evt.targetTouches ? evt.targetTouches[0].pageX : evt.clientX;
    let clientY = evt.targetTouches ? evt.targetTouches[0].pageY : evt.clientY;
    return { x: clientX, y: clientY };
  }

  tap(evt) {
    evt = evt || window.event;
    // get the mouse cursor position at startup:
    //this.offset = this.getMousePosition(evt);
    const joystick = this;
    if ("ontouchstart" in window) {
      const touch = evt.changedTouches[0];
      this.touchId = touch.identifier;

      this.offset = { x: touch.pageX, y: touch.pageY };

      document.ontouchmove = (evt) => this.move(evt);
      document.ontouchend = (evt) => this.up(evt);
    } else {
      document.onmousemove = function (evt) {
        joystick.move(evt);
      };
      document.onmouseup = function (evt) {
        joystick.up(evt);
      };
    }
  }

  move(evt) {
    evt = evt || window.event;
    evt.preventDefault();
    let touch = null;

    if (evt.touches) {
      for (let t of evt.touches) {
        if (t.identifier === this.touchId) {
          touch = t;
          break;
        }
      }
      if (!touch) return; // Ignore other fingers
    }

    const mouse = touch
      ? { x: touch.pageX, y: touch.pageY }
      : this.getMousePosition(evt);

    let left = mouse.x - this.offset.x;
    let top = mouse.y - this.offset.y;

    const sqMag = left * left + top * top;
    if (sqMag > this.maxRadiusSquared) {
      const magnitude = Math.sqrt(sqMag);
      left = (left / magnitude) * this.maxRadius;
      top = (top / magnitude) * this.maxRadius;
    }

    this.domElement.style.top = `${top + this.domElement.clientHeight / 2}px`;
    this.domElement.style.left = `${left + this.domElement.clientWidth / 2}px`;

    const forward = -top / this.maxRadius;
    const turn = left / this.maxRadius;

    // Clamp symmetrically
    const clampedForward = THREE.MathUtils.clamp(forward, -1, 1);
    const clampedTurn = THREE.MathUtils.clamp(turn, -1, 1);

    if (this.onMove !== undefined) {
      this.onMove.call(this.game, clampedForward, clampedTurn);
    }
  }

  up(evt) {
    if (evt.changedTouches) {
      for (let t of evt.changedTouches) {
        if (t.identifier === this.touchId) {
          this.touchId = null;
        }
      }
    }

    document.ontouchmove = null;
    document.ontouchend = null;

    this.domElement.style.top = `${this.origin.top}px`;
    this.domElement.style.left = `${this.origin.left}px`;

    this.onMove.call(this.game, 0, 0);
  }
} //end joystick class

var js = { forward: 0, turn: 0 };

var joystick = new JoyStick({
  onMove: joystickCallback
});

function joystickCallback(forward, turn) {
  js.forward = -forward;
  js.turn = -turn;
}



//===================================================== drive switch controls
function updateDrive(forward = js.forward, turn = js.turn) {

    //character
    var maxSteerVal = 0.05;
    var maxForce = 0.25;
    var brakeForce = 10;
    var force = maxForce * forward;
    var steer = maxSteerVal * turn;

  

    if (forward != 0) {

      if (forward > 0) {
        // Prevent forward movement if collision detected
        visualRoot.translateZ(force); // Move forward
      } else if (forward < 0) {

        // Allow backward movement even if collision detected
        visualRoot.translateZ(force); // Move backward
        //resetCollision(); // Reset collision after moving backward
      }
    } else {

    }
    visualRoot.rotateY(steer);
    visualRoot.visible = true;
 

} //end updateDrive





//=========================================================================================== Praise Text
const PRAISE_PHRASES = [
  "Sharp Shooter!",
  "Lights Out!",
  "BULLSEYE!",
  "Neutralized!",
  "Clean Shot!",
];

function showPraise() {
  const el = document.getElementById("score-msg");
  el.innerText =
    PRAISE_PHRASES[Math.floor(Math.random() * PRAISE_PHRASES.length)];
  el.classList.add("pop-up");
  setTimeout(() => {
    el.classList.remove("pop-up");
  }, 1500);
}



//===================================================== for gamepad and keyboard to work together since they share the same updatedrive function
let inputForward = 0;
let inputTurn = 0;

function driveFromGamepad() {
  const gp = navigator.getGamepads()[0];
  if (!gp) return;

  const DEAD = 0.15;

  let forward = gp.axes[1];
  let turn = -gp.axes[0];

  if (Math.abs(forward) < DEAD) forward = 0;
  if (Math.abs(turn) < DEAD) turn = 0;

  inputForward = forward;
  inputTurn = turn;
}




//=========================================================================================== keyboard controls
function keyDown(event) {
  keyboard[event.keyCode] = true;
}

function keyUp(event) {
  keyboard[event.keyCode] = false;
}

function keypadControls() {

  if (keyboard[87]) inputForward -= 1;
  if (keyboard[83]) inputForward += 1;

  if (keyboard[65]) inputTurn += .5;
  if (keyboard[68]) inputTurn -= .5;
}
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);




//===================================================== player/gun

let canShoot = true;
let angle = 0,
  lastTime = null,
  u_frame = 0,
  clock = new THREE.Clock(),
  count = 0,
  prevTime = Date.now();

let aiming = false;
//gun position
var offset = 7;
var zoom = 0.75;
var height = 0.25;
var twist = Math.PI;
var tilt = 0;

const HIP_ZOOM = 0.75;
const ADS_ZOOM = 0.05;
const ADS_SPEED = 0.25; // lower = slower

let recoilX = 0; // vertical kick
let recoilY = 0; // horizontal shake
const RECOIL_MAX = 0.05; // max vertical kick
const RECOIL_RECOVERY = 0.02; // recovery per frame

//walking bobbing
let walkPhase = 0;
let isMoving = false;
let bobBlend = 0; // 0 = idle, 1 = moving





//===================================================== touch screen
let touchShoot = false;
let touchAim = false;
const shootBtn = document.getElementById("shootBtn");
const aimBtn = document.getElementById("aimBtn");

shootBtn.addEventListener("touchstart", e => {
  e.preventDefault();
  touchShoot = true;
});

shootBtn.addEventListener("touchend", e => {
  e.preventDefault();
  touchShoot = false;
});

aimBtn.addEventListener("touchstart", e => {
  e.preventDefault();
  touchAim = true;
});

aimBtn.addEventListener("touchend", e => {
  e.preventDefault();
  touchAim = false;
});


// Prevent long-press context menu
aimBtn.addEventListener("contextmenu", e => e.preventDefault());
// Prevent text selection popup (iOS)
aimBtn.addEventListener("selectstart", e => e.preventDefault());




//=========================================================================================== Tree colliders
let palmCollided = false;
let palmSide = 0;


function collideCameraWithPalms() {
  const camY = visualRoot.position.y;
  const camRadius = 2;

  palmCollided = false;
  let bestDist = Infinity;

  const right = new THREE.Vector3(1, 0, 0);
  right.applyQuaternion(visualRoot.quaternion);

  for (const palm of palmCylinders) {

    const bottomOffset = -5;
    const topMultiplier = 3.0;

    const minY = palm.position.y + bottomOffset;
    const maxY = palm.position.y + palm.height * topMultiplier;

    if (camY < minY || camY > maxY) continue;

    const t = THREE.MathUtils.clamp((camY - minY) / (maxY - minY), 0, 1);

    const trunkRadius = palm.radius;
    const canopyRadius = palm.radius * 3.0;

    const collisionRadius = THREE.MathUtils.lerp(
      trunkRadius,
      canopyRadius,
      t * t
    );

    const dx = visualRoot.position.x - palm.position.x;
    const dz = visualRoot.position.z - palm.position.z;

    const dist = Math.sqrt(dx * dx + dz * dz);
    const minDist = collisionRadius + camRadius;

    if (dist < minDist && dist > 0.00001) {
      palmCollided = true;

      // track closest palm side
      if (dist < bestDist) {
        bestDist = dist;

        const nx = dx / dist;
        const nz = dz / dist;

        palmSide = nx * right.x + nz * right.z;
      }

      // push out
      const angle = Math.atan2(dz, dx);
      visualRoot.position.x = palm.position.x + Math.cos(angle) * minDist;
      visualRoot.position.z = palm.position.z + Math.sin(angle) * minDist;
    }
  }
}




function collideEnemyWithPalms(enemy) {
  const camY = enemy.position.y;
  const camRadius = .75; // slightly bigger than player

  for (const palm of palmCylinders) {

    const bottomOffset = -5;
    const topMultiplier = 3.0;

    const minY = palm.position.y + bottomOffset;
    const maxY = palm.position.y + palm.height * topMultiplier;

    if (camY < minY || camY > maxY) continue;

    const t = THREE.MathUtils.clamp((camY - minY) / (maxY - minY), 0, 1);

    const trunkRadius = palm.radius;
    const canopyRadius = palm.radius * 3.0;

    const collisionRadius = THREE.MathUtils.lerp(
      trunkRadius,
      canopyRadius,
      t * t
    );

    const dx = enemy.position.x - palm.position.x;
    const dz = enemy.position.z - palm.position.z;

    const dist = Math.sqrt(dx * dx + dz * dz);
    const minDist = collisionRadius + camRadius;

    if (dist < minDist && dist > 0.00001) {
      const angle = Math.atan2(dz, dx);

      enemy.position.x =
        palm.position.x + Math.cos(angle) * minDist;

      enemy.position.z =
        palm.position.z + Math.sin(angle) * minDist;
    }
  }
}


//=========================================================================================== Mesh Colliders
//===================================================== UI controls (Start/Pause/Restart)
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');

function setPaused(paused) {
  gamePaused = paused;
  if (pauseBtn) pauseBtn.innerText = paused ? 'Resume' : 'Pause';
}

let gameRunning = false;

function startGame() {
  if (gameRunning) return;
  gameRunning = true;
  setPaused(false);
  // ensure HUD is correct
  updateHUD();
  updatePlayerHUD();
}

function restartGame() {
  // simple hard reload to reset everything
  location.reload();
}

if (pauseBtn) {
  pauseBtn.addEventListener('click', () => {
    if (!gameRunning) startGame();
    setPaused(!gamePaused);
  });
}

if (restartBtn) {
  restartBtn.addEventListener('click', () => {
    restartGame();
  });
}

//===================================================== Mesh Colliders
const _box = new THREE.Box3();
const _closest = new THREE.Vector3();

let prevX = visualRoot.position.x;
let prevZ = visualRoot.position.z;
let lastWallSide = 0;

function collideCameraWithMeshes() {
  const camRadius = 2.0;

  let collided = false;
  let bestDist = Infinity;
  let bestSide = lastWallSide;

  // camera RIGHT direction (local X axis in world space)
  const right = new THREE.Vector3(1, 0, 0);
  right.applyQuaternion(visualRoot.quaternion);

  for (const mesh of meshs) {
    if (mesh.name === "sphere") continue;

    _box.setFromObject(mesh);
    _box.clampPoint(visualRoot.position, _closest);

    const dx = visualRoot.position.x - _closest.x;
    const dz = visualRoot.position.z - _closest.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < camRadius) {
      collided = true;

      // ⭐ choose closest wall only
      if (dist < bestDist && dist > 0.00001) {
        bestDist = dist;

        // wall normal (from wall → visualRoot)
        const nx = dx / dist;
        const nz = dz / dist;

        bestSide = nx * right.x + nz * right.z;
      }

      // push visualRoot out of wall
      const angle = Math.atan2(dz, dx);
      const push = camRadius - dist;

      visualRoot.position.x += Math.cos(angle) * push;
      visualRoot.position.z += Math.sin(angle) * push;
    }
  }

  // ===== tilt decision =====
  const tryingToAim = aiming;
  const finalCollided = collided || palmCollided;
  const finalSide = collided ? bestSide : palmSide;

  if (finalCollided && tryingToAim){
    // update stored side only if strong enough
    if (Math.abs(finalSide) > 0.2) {
      lastWallSide = finalSide;
    }

    const targetTilt = lastWallSide > 0 ? -0.25 : 0.25;
    tilt += (targetTilt - tilt) * 0.15;
    aiming = true;
  } else {
    tilt += (0 - tilt) * 0.15;
    aiming = false;
  }

  // ===== store position for next frame =====
  prevX = visualRoot.position.x;
  prevZ = visualRoot.position.z;
}





function collideEnemyWithMeshes(enemy) {
  const radius = .75;

  for (const mesh of meshs) {
    if (mesh.name === "sphere") continue;

    _box.setFromObject(mesh);
    _box.clampPoint(enemy.position, _closest);

    const dx = enemy.position.x - _closest.x;
    const dz = enemy.position.z - _closest.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < radius && dist > 0.00001) {

      const angle = Math.atan2(dz, dx);
      const push = radius - dist;

      enemy.position.x += Math.cos(angle) * push;
      enemy.position.z += Math.sin(angle) * push;
    }
  }
}





// Call this **after updating the camera movement**
function clampCameraPosition() {
  if (visualRoot.position.x > gridSize / 8) visualRoot.position.x = gridSize / 8;
  if (visualRoot.position.x < -gridSize / 8) visualRoot.position.x = -gridSize / 8;

  if (visualRoot.position.z > gridSize / 2.25) visualRoot.position.z = gridSize / 2.25;
  if (visualRoot.position.z < -gridSize / 2.25) visualRoot.position.z = -gridSize / 2.25;
}

//===================================================== 
// =======================
// FIREWORK SYSTEM
// =======================
// =======================
// FIREWORK SHADERS
// =======================
const vshader = `
uniform float u_time;
uniform vec3 u_gravity;

attribute vec3 velocity;
attribute vec3 a_color;

varying vec3 v_color;

void main() {

    v_color = a_color;

    vec3 vel = velocity * u_time;
    vec3 acc = u_gravity * 0.5 * u_time * u_time;

    vec3 newPosition = position + vel + acc;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    // Larger visible size
    gl_PointSize = 8.0 * (1.0 - u_time * 0.25);
}
`;

const fshader = `
uniform float u_time;

varying vec3 v_color;

void main() {

    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);

    float alpha = smoothstep(0.5, 0.15, dist);

    float lifeFade = 1.0 - (u_time / 3.0);
    lifeFade = clamp(lifeFade, 0.0, 1.0);

    vec3 finalColor = vec3(0.7, 0.0, 0.0);

    gl_FragColor = vec4(finalColor, alpha * lifeFade * 0.4);
}
`;


const fireworks = [];

function spawnFirework(position) {

  const COUNT = 90;
  const speed = 14;

  const positions = new Float32Array(COUNT * 3);
  const velocity = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);

  for (let i = 0; i < COUNT; i++) {

    // All particles start at center
    positions[i*3 + 0] = 0;
    positions[i*3 + 1] = 0;
    positions[i*3 + 2] = 0;

    // Spherical explosion direction
    const theta = Math.random() * Math.PI * 2;

    const spread = 0.6; // don't go below 0.4 or it collapses
    const phi = Math.acos(1 - Math.random() * spread);

    const dir = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.sin(phi) * Math.sin(theta),
      Math.cos(phi)
    );

    velocity[i*3 + 0] = dir.x * speed;
    velocity[i*3 + 1] = dir.y * speed;
    velocity[i*3 + 2] = dir.z * speed;

    // Color variation
    colors[i*3 + 0] = 1.0;  // red
    colors[i*3 + 1] = 0.0;  // no green
    colors[i*3 + 2] = 0.0;  // no blue                        // tiny blue
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('velocity', new THREE.BufferAttribute(velocity, 3));
  geometry.setAttribute('a_color', new THREE.BufferAttribute(colors, 3));

  const uniforms = {
    u_time: { value: 0 },
    u_gravity: { value: new THREE.Vector3(0, -18, 0) }
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: vshader,
    fragmentShader: fshader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const points = new THREE.Points(geometry, material);
  points.position.copy(position);

  scene.add(points);
  fireworks.push(points);
}








//===================================================== rain
var flash = new THREE.PointLight(0x062d89, 30, 500, 1.7);
flash.position.set(200,300, 100);
scene.add(flash);


var rainCount = 10000;
var rainGeo = new THREE.BufferGeometry();
var positions = [];
var velocities = [];

// Replace the for loop
for (let i = 0; i < rainCount; i++) {
  // Start position of the raindrop
  let x = randnum(-400, 400);
  let y = randnum(0, 300);
  let z = randnum(-400, 400);

  // Create a line segment for each raindrop (start and end points)
  positions.push(x, y, z);     // Start point
  positions.push(x, y - 0.5, z); // End point (5 units lower)


  // Assign velocities in X, Y, and Z directions for wind effect
  const xVelocity = randnum(-1, 1);  // Horizontal wind effect (left/right)
  const yVelocity = randnum(1, 1);   // Vertical fall speed
  const zVelocity = randnum(-1, 1);  // Horizontal wind effect (front/back)

  // Store velocity for animation purposes
  //velocities.push(xVelocity, yVelocity, zVelocity); // Velocity components
  velocities.push(1 + Math.random() * 2); // Random fall speed
}

// Add positions and velocities to the geometry
rainGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
rainGeo.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));// Velocity has 3 components (x, y, z)

// Update the material to work with LineSegments
var rainMaterial = new THREE.LineBasicMaterial({
  color: 0xaaaaaa,
  transparent: true,
  opacity: 0.3,
});

// Use LineSegments instead of Points
var rain = new THREE.LineSegments(rainGeo, rainMaterial);
scene.add(rain);



//===================================================== add Terrain
function createTerrain({
  url,
  width = 128,
  depth = 128,
  minHeight = 0,
  maxHeight = 160,
  elementSize = 400,
  position = { x: 0, y: -10, z: 0 }
}) {
  const img = new Image();
  img.crossOrigin = "anonymous";

  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = depth;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0, 0, width, depth);
    const imgData = ctx.getImageData(0, 0, width, depth).data;

    // Plane geometry (same resolution as heightmap)
    const geometry = new THREE.PlaneBufferGeometry(
      width * elementSize,
      depth * elementSize,
      width - 1,
      depth - 1
    );

    const pos = geometry.attributes.position;
    const heightRange = maxHeight - minHeight;

    for (let z = 0; z < depth; z++) {
      for (let x = 0; x < width; x++) {
        const i = z * width + x;

        // flip image Y axis
        const imgY = depth - z - 1;
        const pixel = (imgY * width + x) * 4;

        const height = (imgData[pixel] / 255) * heightRange + minHeight;

        // IMPORTANT: Z, NOT Y
        pos.setZ(i, height);
      }
    }

    pos.needsUpdate = true;
    geometry.computeVertexNormals();

    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color("#111"),
      specular: new THREE.Color("#222"),
      shininess: 0,
      side: THREE.DoubleSide
    });

    const terrain = new THREE.Mesh(geometry, material);
    terrain.material.flatShading = true;
    terrain.material.needsUpdate = true;

    terrain.rotation.x = -Math.PI / 2;
    terrain.position.set(position.x, position.y, position.z);
    terrain.receiveShadow = true;
    scene.add(terrain);

    //addOimoTerrain(geometry, terrain.position);

    const edges = new THREE.EdgesGeometry(geometry, 1);
    const lineMat = new THREE.LineBasicMaterial({ color: new THREE.Color("white"), linewidth: 5, transparent: true, opacity: 0.05});

    const outline = new THREE.LineSegments(edges, lineMat);

    // Attach like your other models
    terrain.add(outline);

    //for oimo.js
    function getWorldNormal(intersection) {
      const geometry = intersection.object.geometry;
      const normal = new THREE.Vector3();

      if (!geometry.attributes || !geometry.attributes.normal) {
        return normal.set(0, 1, 0); // safe fallback
      }

      const index = intersection.faceIndex;

      // non-indexed BufferGeometry
      if (!geometry.index) {
        normal.fromBufferAttribute(geometry.attributes.normal, index * 3);
      } else {
        normal.fromBufferAttribute(
          geometry.attributes.normal,
          geometry.index.getX(index * 3)
        );
      }

      normal.transformDirection(intersection.object.matrixWorld);
      return normal.normalize();
    }

    // Raycast helper to ensure proper alignment and interaction
    var raycastHelperGeometry = new THREE.CylinderGeometry(
      0,
      1,
      5,
      8 // MUST be integer
    );

  }; //end imgae.load

  img.src = url;
} //end createTerrain

createTerrain({
  url: "https://linear-vaporwave-three-js.vercel.app/displacement-7.png",
  width: 128,
  depth: 128,
  minHeight: 0,
  maxHeight: 60,
  elementSize: 3.5,
  position: { x: 0, y: 0, z: 0 }
});




//===================================================== bloom
let composer;
function addBloomEffect(renderer, scene, camera) {
    composer = new THREE.EffectComposer(renderer);

    // Render pass
    const renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Bloom pass
    const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5, // Strength
        0.4, // Radius
        0.85 // Threshold
    );
    composer.addPass(bloomPass);



     //===================================================== flicker bloom
    function startFlicker() {
        //between 0.1, 0.3
        TweenMax.to(bloomPass, 0.1 + Math.random() * 0.2, {
            strength: Math.random() * 1.0 + 0.5, // Flicker between 0.5 and 1.5
            onComplete: startFlicker,           // Loop animation
            ease: Power1.easeInOut              // Smooth flicker
        });
    }
    startFlicker();

}//end addBloomEffect

// Add bloom effect
addBloomEffect(renderer, scene, camera);

//===================================================== animate
let lastX = visualRoot.position.x;
let lastZ = visualRoot.position.z;
let lastRigZ = 0

const raycaster = new THREE.Raycaster();
const shootDirection = new THREE.Vector3();

(function animate() {
  if (gamePaused) {
    requestAnimationFrame(animate);
    if (composer && !isMobile) composer.render();
    else renderer.render(scene, camera);
    miniRenderer.render(scene, miniMapCamera);
    return;
  }
  const time = Date.now();
  if (lastTime === undefined) lastTime = time;
  const dt = (Date.now() - lastTime) / 1000.0;
  var FPSFactor = dt;
  lastTime = time;



  
  requestAnimationFrame(animate);
  controller.update();


  //HAVE TO USE BLUETOOTH OR KEYBOARD. CAN"T USE BOTH!
  inputForward = 0;
  inputTurn = 0;
  // Joystick input
  inputForward += js.forward;
  inputTurn += js.turn;


  keypadControls();      // keyboard first
  driveFromGamepad();    // gamepad LAST (overrides keyboard if active)
  updateDrive(inputForward, inputTurn);
  collideCameraWithMeshes();
  collideCameraWithPalms();
  clampCameraPosition();


// ===== UPDATE MINIMAP TARGET =====
miniMapCamera.position.x = targetObject.position.x;
miniMapCamera.position.z = targetObject.position.z;
miniMapCamera.position.y = 200;

miniMapCamera.lookAt(
  targetObject.position.x,
  0,
  targetObject.position.z
);

playerDot.position.set(
  targetObject.position.x,
  0.5,
  targetObject.position.z
);

//RENDER SCENE FIRST!
//renderer.render(scene, camera);
if (composer && !isMobile) {
    composer.render();
  } else {
    renderer.render(scene, camera);
  }
miniRenderer.render(scene, miniMapCamera);







//display coordinates
let coordTarget;
coordTarget = visualRoot;

info.innerHTML = `<span>X: </span>${coordTarget.position.x.toFixed(2)},
&nbsp;&nbsp;&nbsp;
<span>Y: </span>${coordTarget.position.y.toFixed(2)},
&nbsp;&nbsp;&nbsp;
<span>Z: </span>${coordTarget.position.z.toFixed(2)}`;








  var delta = clock.getDelta();
  var time2 = Date.now() * 0.0009;



  //bobbing when moving and idle
  const moveThreshold = 0.1;

  const keyboardMoving =
    keyboard[87] || keyboard[65] || keyboard[83] || keyboard[68];

  const stickMoving =
    Math.abs(js.forward) > moveThreshold ||
    Math.abs(js.turn) > moveThreshold;

    


  const dx = visualRoot.position.x - lastX;
  const dz = visualRoot.position.z - lastZ;

  const movementSpeed = Math.sqrt(dx * dx + dz * dz);

  const isMoving = movementSpeed > 0.001;

  lastX = visualRoot.position.x;
  lastZ = visualRoot.position.z;






  const bobHeight = 0.015;
  const bobSpeed = 18;

  if (isMoving) {
    walkPhase += delta * bobSpeed;
  }

  const BLEND_SPEED = 8; // higher = snappier
  bobBlend += ((isMoving ? 1 : 0) - bobBlend) * delta * BLEND_SPEED;

  // idle sway (your original)
  const idleBob =
    Math.sin(time2 * 4 + camera.position.x + camera.position.z) * 0.01;

  // walk bob
  const walkBob = Math.sin(walkPhase) * bobHeight;

  // blended result
  const finalBob =
    idleBob * (1 - bobBlend) +
    walkBob * bobBlend;



  //position camera
  tiltRoot.position.set(
    camera.position.x - Math.sin(camera.rotation.y + Math.PI / offset-.75) * zoom,
    //camera.position.y - height + Math.sin(time * 4 + camera.position.x + camera.position.z) * 0.01,
    camera.position.y - height + finalBob,
    camera.position.z + Math.cos(camera.rotation.y + Math.PI / offset+2) * zoom
  );
  //rotate camera
  tiltRoot.rotation.set(
    camera.rotation.x,
    camera.rotation.y + twist,
    camera.rotation.z - tilt
  );



  // Smooth recoil recovery
  recoilX -= Math.min(recoilX, RECOIL_RECOVERY);
  recoilY -= recoilY * 0.2; // gradually back to 0

  // Apply recoil as an offset to tiltRoot rotation
  tiltRoot.rotation.x -= recoilX;
  tiltRoot.rotation.y += recoilY;





//glb animation
mixers.map(x=>x.update(delta));



// ---- Enemy AI loop ----
	enemies.forEach(function(enemy) {
  if (!enemy || enemy.userData.isDead) return;

  const cfg     = enemy.userData.cfg;
  const actions = enemy.userData.actions;

  enemy.lookAt(visualRoot.position.x, enemy.position.y, visualRoot.position.z);

  let dx = visualRoot.position.x - enemy.position.x;
  let dz = visualRoot.position.z - enemy.position.z;
  let len = Math.sqrt(dx * dx + dz * dz);

  if (len > 4) {
    enemy.position.x += (dx / len) * delta * cfg.speed;
    enemy.position.z += (dz / len) * delta * cfg.speed;
    if (enemy.userData.activeAction !== actions.walk) {
      fadeToActionEnemy(enemy, actions.walk, 0.3);
    }
  } else {
    // Attack animation
    if (enemy.userData.activeAction !== actions.attack) {
      actions.attack.reset();
      fadeToActionEnemy(enemy, actions.attack, 0.3);
    }

    // Damage player (cooldown so it isn't per-frame)
    const now = Date.now();
    const last = enemy.userData.lastAttackTime || 0;
    const cd = enemy.userData.attackCooldownMs || 900;

    if (now - last >= cd) {
      enemy.userData.lastAttackTime = now;
      applyPlayerDamage(enemy.userData.damageOnHit || DAMAGE_ON_HIT || 10);
    }
  }

  collideEnemyWithMeshes(enemy);
  collideEnemyWithPalms(enemy);
});









//sparks
for (let i = fireworks.length - 1; i >= 0; i--) {
  const fw = fireworks[i];
  fw.material.uniforms.u_time.value += delta;

  if (fw.material.uniforms.u_time.value > 2.5) {
    scene.remove(fw);
    fireworks.splice(i, 1);
  }
}


// Press O on keyboard OR X on xbox controller gamepad
const shootPressed =
  keyboard[79] ||
  controller.btn.z.pressed ||
  touchShoot;



if (shootPressed && canShoot) {
  canShoot = false;
  shootSound.currentTime = 0;
  shootSound.play();

  recoilX = 0.06;
  recoilY = (Math.random() - 0.5) * 0.02;


  //RAYCAST
  camera.getWorldDirection(shootDirection);

  const rayOrigin = new THREE.Vector3();
  rayOrigin.setFromMatrixPosition(camera.matrixWorld);
  raycaster.set(rayOrigin, shootDirection);
  raycaster.far = 300;   // 🔥 extend shooting distance


  //raycast visual
/*  const origin = new THREE.Vector3();
  const direction = new THREE.Vector3();

  camera.getWorldPosition(origin);
  camera.getWorldDirection(direction);

  const length = raycaster.far; // your ray distance

  // Create end point
  const end = origin.clone().add(direction.clone().multiplyScalar(length));

  // Create geometry
  const points = [origin, end];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

  const line = new THREE.Line(geometry, material);
  scene.add(line);*/

// Optional: auto remove after 100ms
//setTimeout(() => {
//  scene.remove(line);
//}, 100);






  // ---- Raycast hit detection ----
  const intersects = raycaster.intersectObjects(collidableMeshList, true);
  if (intersects.length > 0) {
    const hitInfo = intersects[0];
    const hitEnemy = hitInfo.object.userData.enemy;
    if (!hitEnemy) return;
    spawnFirework(hitInfo.point);
    if (!hitEnemy.userData.isDead) {
      hitEnemy.userData.health--;
      if (hitEnemy.userData.health <= 0) {
        killEnemy(hitEnemy);
        setTimeout(function() { showPraise(); }, 800);
      } else {
        // flash tint to indicate hit
        hitEnemy.traverse(function(n) {
          if (n.isMesh && n.material) {
            const prev = n.material.emissiveIntensity || 0;
            n.material.emissive = new THREE.Color('#FFFFFF');
            n.material.emissiveIntensity = 0.8;
            setTimeout(function() {
              n.material.emissive = new THREE.Color(hitEnemy.userData.cfg.tint || '#000000');
              n.material.emissiveIntensity = prev;
            }, 120);
          }
        });
      }
    }
  }



  
}//end if





if (!shootPressed) {
  canShoot = true;
}//end it




 // ===== AIM INPUT =====
// Press P on keyboard OR A on xbox controller gamepad
const shouldAim =
  controller.btn.y.pressed ||
  keyboard[80] ||
  touchAim;


 if (shouldAim) {
      aiming = true;
      //zoom = .05;
      console.log("AIMING");
    } else {
      aiming = false;
      //zoom = .75;
    }

    const targetZoom = aiming ? ADS_ZOOM : HIP_ZOOM;
    zoom += (targetZoom - zoom) * ADS_SPEED;






  if(!isMobile){

    // Access positions and velocities
    const positions = rainGeo.attributes.position.array;
    const velocities = rainGeo.attributes.velocity.array;

   // velocity buffer stores 1 float per raindrop (fall speed)
   for (let i = 0; i < rainCount; i++) {
      const startIndex = i * 6; // Each raindrop uses 6 coordinates (x, y, z) * 2 vertices
      const endIndex = startIndex + 3;
      const vel = velocities[i]; // 1 component per drop

      // Move the start and end points down by fall speed
      positions[startIndex + 1]   -= vel; // Start Y
      positions[endIndex   + 1]   -= vel; // End Y

      // Reset when the raindrop goes below the threshold
      if (positions[startIndex + 1] < -10) {
        const newY = 100; // Reset to top
        positions[startIndex + 1] = newY;       // Start point Y
        positions[endIndex + 1]   = newY - 2;   // End point Y (shorter)

        // Reset X and Z positions within bounds
        positions[startIndex]     = randnum(-200, 200);
        positions[startIndex + 2] = randnum(-200, 200);
        positions[endIndex]       = positions[startIndex];
        positions[endIndex + 2]   = positions[startIndex + 2];

        // Randomise fall speed for variety
        velocities[i] = 1 + Math.random() * 2;
      }
    }


    // Inform Three.js that positions have changed
    rainGeo.attributes.position.needsUpdate = true;

    // Optional: Add rotation for a dynamic effect
    //rain.rotation.y += 0.002;
    
    // Lightening Animation
    if(Math.random() > 0.96 || flash.power > 100) {
      if(flash.power<100) {
        flash.position.set(
          Math.random()*400,
          300+Math.random()*200,
          100
        );
      }
      flash.power = 50 + Math.random() * 500;
    }

  }//end if mobile
    







})();