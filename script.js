var scene, camera, renderer, table;
var meshFloor, ambientLight, chair;
var lightWoodMaterial, darkWoodMaterial;
var sun,moon;

var keyboard = {};
var player = { height: 1.8, speed: 1, turnSpeed: Math.PI * 0.01 };

function init() {
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x000000);

	//==================================== Materials =================================================

	var lightWoodLoader = new THREE.TextureLoader();
	lightWoodLoader.crossOrigin = '';
	var lightWoodTexture = lightWoodLoader.load('http://www.textures4photoshop.com/tex/thumbs/free-wood-texture-with-high-resolution-thumb38.jpg', function (texture) {

		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.offset.set(0, 0);
		texture.repeat.set(1, 1);

	});
	lightWoodMaterial = new THREE.MeshPhongMaterial({ map: lightWoodTexture });
	var darkWoodLoader = new THREE.TextureLoader();
	darkWoodLoader.crossOrigin = '';
	var darkWoodTexture = darkWoodLoader.load('http://www.textures4photoshop.com/tex/thumbs/braided-wood-texture-material-free-thumb34.jpg', function (texture) {

		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.offset.set(0, 0);
		texture.repeat.set(1, 1);

	});
	darkWoodMaterial = new THREE.MeshPhongMaterial({ map: darkWoodTexture });

	//============================= Table ============================================

	table = createTable();
	table.position.set(0, -1.9, 0);

	//=========================================== Chair =================================================

	chair = createChair();

	chair1 = chair.clone();
	chair1.rotation.y = Math.PI / 2 + Math.PI / 4;
	chair1.position.set(-3.5, 2, -3.5);
	chair2 = chair.clone();
	chair2.rotation.y = Math.PI / 4;
	chair2.position.set(3.5, 2, -3.5);
	chair3 = chair.clone();
	chair3.rotation.y = -Math.PI / 4;
	chair3.position.set(3.5, 2, 3.5);
	chair4 = chair.clone();
	chair4.rotation.y = Math.PI + Math.PI / 4;
	chair4.position.set(-3.5, 2, 3.5);

	tableChairs = new THREE.Object3D();
	tableChairs.add(table);
	tableChairs.add(chair1);
	tableChairs.add(chair2);
	tableChairs.add(chair3);
	tableChairs.add(chair4);
	tableChairs.scale.set(2, 2, 2);
	scene.add(tableChairs);

	// ================================= Trees =====================================================

	tree = createTree();
	tree1 = tree.clone();
	tree1.position.set(40, 5, -40);
	tree2 = tree.clone();;
	tree2.position.set(40, 5, 0);
	tree3 = tree.clone();;
	tree3.position.set(40, 5, 40);
	tree4 = tree.clone();;
	tree4.position.set(-40, 5, -40);
	tree5 = tree.clone();;
	tree5.position.set(-40, 5, 0);
	tree6 = tree.clone();;
	tree6.position.set(-40, 5, 40);

	scene.add(tree1);
	scene.add(tree2);
	scene.add(tree3);
	scene.add(tree4);
	scene.add(tree5);
	scene.add(tree6);

	//	============================ Stars ==========================
	var starCount = 1000000;

	var stars = new THREE.Geometry();

	for (var p = 0; p < starCount; p++) {
		var x = Math.random() * 10000 - 5000;
		var y = Math.random() * 10000 + 50;
		var z = Math.random() * 10000 - 5000;

		var starPosition = new THREE.Vector3(x, y, z);

		stars.vertices.push(starPosition);
	}
	var starMaterial = new THREE.PointsMaterial({
		color: 0xffffff,
		size: 1
	});

	starParticles = new THREE.Points(stars, starMaterial);
	scene.add(starParticles);

	//======================== Sun ====================================================================
	
	sun = new THREE.Object3D();
	const sphereGeometry = new THREE.SphereBufferGeometry(1, 100, 100);
	const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xFFFF00 });
	const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
	sunMesh.scale.set(20, 20, 20);
	sunMesh.receiveShadow = false;
	sunMesh.position.set(0, 0, -400);
	sun.add(sunMesh);
	scene.add(sun);

	//======================== Sun Light ====================================================

	sunLight = new THREE.DirectionalLight(0xf7df72, 1, 100);
	sunLight.position.set(0, 0, -400);
	sunLight.castShadow = true;

	sunLight.shadow.mapSize.width = 512;
	sunLight.shadow.mapSize.height = 512;
	sunLight.shadow.camera.near = 0.5;
	sunLight.shadow.camera.far = 500;

	sunLight.shadowCameraLeft = -50;
	sunLight.shadowCameraRight = 50;
	sunLight.shadowCameraTop = 50;
	sunLight.shadowCameraBottom = -50;

	sun.add(sunLight);

	//==================================== Moon ==========================================================================

	moon = new THREE.Object3D();
	const moonGeometry = new THREE.SphereBufferGeometry(1, 100, 100);
	const moonMaterial = new THREE.MeshPhongMaterial({ emissive: 0xFFFFFF });
	const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
	moonMesh.scale.set(15, 15, 15);
	moonMesh.position.set(0, 0, 400);
	moon.add(moonMesh);

	//====================================== Moon Light ====================================================

	moonLight = new THREE.PointLight(0xffffff, 0.8, 1000);
	moonLight.castShadow = true;
	// Will not light anything closer than 0.1 units or further than 500 units
	moonLight.shadow.camera.near = 0.1;
	moonLight.shadow.camera.far = 1000;
	moonLight.position.set(0, 0, 400);


	moon.add(moonLight);
	scene.add(moon);

	// const helper = new THREE.CameraHelper(light.shadow.camera);
	// scene.add(helper);

	// ==========================================  Floor ===========================================================================

	//THREE.ImageUtils.crossOrigin = '';
	//var texture = THREE.ImageUtils.loadTexture('http://www.textures4photoshop.com/tex/thumbs/seamless-wood-floor-texture-thumb27.jpg');

	var planeLoader = new THREE.TextureLoader();
	planeLoader.crossOrigin = '';
	var planeTexture = planeLoader.load('http://www.textures4photoshop.com/tex/thumbs/seamless-grass-texture-free-thumb27.jpg', function (texture) {

		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.offset.set(0, 0);
		texture.repeat.set(5, 5);

	});
	meshFloor = new THREE.Mesh(
		new THREE.BoxGeometry(100, 1, 100, 100),
		new THREE.MeshPhongMaterial({
			map: planeTexture, opacity: 0, transparent: false
		})
	);
	meshFloor.position.set(0, 0, 0);
	meshFloor.receiveShadow = true;
	meshFloor.castShadow = true;

	scene.add(meshFloor);

	//=============================== Walls ======================================================

	const Walls = new THREE.Object3D();

	wall = createWall();
	wall1 = wall.clone();
	wall2 = wall.clone();
	wall2.position.set(0, 4, -50);

	wall3 = wall.clone();
	wall3.position.set(50, 4, 0);
	wall3.rotation.y = Math.PI / 2;
	wall4 = wall.clone();
	wall4.position.set(-50, 4, 0);
	wall4.rotation.y = Math.PI / 2;
	Walls.add(wall1);
	Walls.add(wall2);
	Walls.add(wall3);
	Walls.add(wall4);
	scene.add(Walls);


	// =================================== LIGHTS ===========================================
	ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
	scene.add(ambientLight);

	// =================================== Camera ===========================================

	camera = new THREE.PerspectiveCamera(45, 1280 / 720, 0.1, 1000);
	camera.position.set(-30, 15, 60);
	camera.lookAt(new THREE.Vector3(0, 10, 0));

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(1280, 720);
	// renderer.setClearColor(0x16222b);
	// renderer.setClearColor(0x222b);


	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; //BasicShadowMap

	document.body.appendChild(renderer.domElement);

	animate();
}

function animate() {

	requestAnimationFrame(animate);
	//sunrise
	if (sun.rotation.x > 0 && sun.rotation.x < Math.PI / 2 && scene.background.g < 0.9) {
		console.log(scene.background.g);
		console.log(sun.rotation.x);
		scene.background.r += 0.002;
		scene.background.g += 0.002;
		scene.background.b += 0.0025;
	}
	//sunset
	if (sun.rotation.x > 2.70526 && sun.rotation.x < Math.PI && scene.background.g > 0) {
		scene.background.r -= 0.002;
		scene.background.g -= 0.002;
		scene.background.b -= 0.0025;
	}

	sun.rotation.x += 0.001;
	moon.rotation.x += 0.001;
	//reset angles
	if (sun.rotation.x > 2 * Math.PI) {
		sun.rotation.x = 0;
	}
	if (moon.rotation.x > 2 * Math.PI) {
		moon.rotation.x = 0;
	}
	//camera movement
	if (keyboard[87]) { // W key
		camera.position.x += Math.sin(camera.rotation.y) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
	}
	if (keyboard[83]) { // S key
		camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
		camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
	}
	if (keyboard[65]) { // A key
		camera.position.x -= Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
		camera.position.z -= -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
	}
	if (keyboard[68]) { // D key
		camera.position.x -= Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
		camera.position.z -= -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
	}


	if (keyboard[37]) { // left arrow key
		camera.rotation.y += 0.1;
	}
	if (keyboard[39]) { // right arrow key
		camera.rotation.y -= 0.1;
	}
	if (keyboard[38]) { // up arrow key
		camera.rotation.x += 0.1;
	}
	if (keyboard[40]) { // down arrow key
		camera.rotation.x -= 0.1;
	}

	renderer.render(scene, camera);
}
function createTree() {
	var treeLoader = new THREE.TextureLoader();
	treeLoader.crossOrigin = '';
	var treeTexture = treeLoader.load('http://www.textures4photoshop.com/tex/thumbs/christmas-tree-fir-texture-free-background-40.jpg', function (texture) {

		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.offset.set(0, 0);
		texture.repeat.set(1, 1);

	});
	const treeMaterial = new THREE.MeshPhongMaterial({ map: treeTexture });

	const tree = new THREE.Object3D();
	const lowerTreeGeometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 32);
	const lowerTreeMesh = new THREE.Mesh(lowerTreeGeometry, lightWoodMaterial);
	lowerTreeMesh.receiveShadow = true;
	lowerTreeMesh.castShadow = true;
	const upperTreeMesh = new THREE.Object3D();
	var treeConeGeometory = new THREE.ConeGeometry(3, 3, 5);
	const treeCone = new THREE.Mesh(treeConeGeometory, treeMaterial);
	treeCone.position.set(0, 2.5, 0);
	treeCone.receiveShadow = true;
	treeCone.castShadow = true;
	const treeCone2 = treeCone.clone();
	treeCone2.position.set(0, 3.5, 0);
	const treeCone3 = treeCone.clone();
	treeCone3.position.set(0, 4.5, 0);
	upperTreeMesh.add(treeCone);
	upperTreeMesh.add(treeCone2);
	upperTreeMesh.add(treeCone3);
	upperTreeMesh.position.set(0, -0.5, 0)
	tree.add(lowerTreeMesh);
	tree.add(upperTreeMesh);
	tree.scale.set(2, 3, 2);
	return tree;
}
function createChair() {
	const chair = new THREE.Object3D();

	const chairlegGeometry = new THREE.BoxGeometry(0.5, 3, 0.5, 32);
	const chairlegMesh = new THREE.Mesh(chairlegGeometry, darkWoodMaterial);
	chairlegMesh.position.y += 2;
	chairlegMesh.receiveShadow = true;
	chairlegMesh.castShadow = true;
	chairleg1 = chairlegMesh.clone();
	chairleg2 = chairlegMesh.clone();
	chairleg2.position.x += 4;
	chairleg3 = chairlegMesh.clone();
	chairleg3.position.x += 4;
	chairleg3.position.z += 4;
	chairleg4 = chairlegMesh.clone();
	chairleg4.position.z += 4;

	const chairPlaneGeometry = new THREE.BoxGeometry(4.5, 0.6, 4.5, 32);
	const chairPlaneMesh = new THREE.Mesh(chairPlaneGeometry, lightWoodMaterial);
	chairPlaneMesh.position.x += 2;
	chairPlaneMesh.position.y += 3.6;
	chairPlaneMesh.position.z += 2;
	chairPlaneMesh.receiveShadow = true;
	chairPlaneMesh.castShadow = true;

	const chairBackPlaneGeometry = new THREE.BoxGeometry(0.5, 4.5, 4.5, 32);
	const chairBackMaterial = new THREE.MeshPhongMaterial({ color: 0x4f2c0e, wireframe: false })
	const chairBackPlaneMesh = new THREE.Mesh(chairBackPlaneGeometry, darkWoodMaterial);
	chairBackPlaneMesh.position.x += 4.5;
	chairBackPlaneMesh.position.y += 6;
	chairBackPlaneMesh.position.z += 2;
	chairBackPlaneMesh.rotation.z += -0.2;
	chairBackPlaneMesh.receiveShadow = true;
	chairBackPlaneMesh.castShadow = true;
	chair.add(chairPlaneMesh);
	chair.add(chairleg1);
	chair.add(chairleg2);
	chair.add(chairleg3);
	chair.add(chairleg4);
	chair.add(chairBackPlaneMesh);
	chair.scale.set(0.5, 0.5, 0.5);

	var box = new THREE.Box3().setFromObject(chair);
	box.center(chair.position); // this re-sets the mesh position
	chair.position.multiplyScalar(- 1);
	pivot = new THREE.Group();
	pivot.add(chair);
	return pivot;
}
function createTable() {
	table = new THREE.Object3D();
	const upperTableGeometry = new THREE.CylinderGeometry(4, 4, 0.3, 32);
	const upperTableMesh = new THREE.Mesh(upperTableGeometry, lightWoodMaterial);
	upperTableMesh.position.y += 5;
	upperTableMesh.receiveShadow = true;
	upperTableMesh.castShadow = true;
	table.add(upperTableMesh);

	const midTableGeometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 32);
	const midTableMesh = new THREE.Mesh(midTableGeometry, lightWoodMaterial);
	midTableMesh.position.y += 3.6;
	midTableMesh.receiveShadow = true;
	midTableMesh.castShadow = true;
	table.add(midTableMesh);

	const lowerTableGeometry = new THREE.SphereGeometry(0.7, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
	const lowerTableMesh = new THREE.Mesh(lowerTableGeometry, darkWoodMaterial);
	lowerTableMesh.position.y += 1.9;
	lowerTableMesh.receiveShadow = true;
	lowerTableMesh.castShadow = true;
	table.add(lowerTableMesh);
	return table;
}
function createWall() {
	var wallLoader = new THREE.TextureLoader();
	wallLoader.crossOrigin = '';
	var wallTexture = wallLoader.load('http://www.textures4photoshop.com/tex/thumbs/white-brick-wall-seamless-texture-free-thumb38.jpg', function (texture) {

		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.offset.set(1, 1);
		texture.repeat.set(8, 1);

	});

	const wallPlaneGeometry = new THREE.BoxGeometry(100, 8, 1, 32);
	const wall = new THREE.Mesh(wallPlaneGeometry,
		new THREE.MeshPhongMaterial({
			map: wallTexture,
		}));
	wall.position.set(0, 3.9, 50);
	wall.castShadow = true;
	return wall;
}
function keyDown(event) {
	keyboard[event.keyCode] = true;
}

function keyUp(event) {
	keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.onload = init;
