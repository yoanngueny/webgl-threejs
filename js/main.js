let scene, camera, camerenderer;
let cubeGeometry, sphereGeometry, vertexGeometry, loaderGeometry;
let normalMaterial, basicMaterial, lambertMaterial, phongMaterial, phongWireMaterial, phongFlatMaterial, standardMaterial;
let ambientGroup, ambientLight, directionalGroup, directionalLight, directionalLightHelper, pointGroup, pointLight, pointLightHelper, spotGroup, spotLight, spotLightHelper;
let textureMap, textureNormalMap, textureEnvironmentMap, textureLightMap;
let mesh;
let camera2, cameraHelper;
let clearColor = 0x222222,
    defaultFOV = 75,
    defaultNear = 0.01,
    defaultFar = 2,
    defaultMaterialColor = 0x2194ce,
    defaultShininess = 30;
let isMeshRotating = false,
    isMeshPositioning = false,
    isMeshScaling = false,
    isMeshVisible = false,
    isCamera2Visible = false,
    displayMeshIndex = 0,
    materialIndex = 0;

function init() {

    // scene
    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera( defaultFOV, window.innerWidth / window.innerHeight, defaultNear, defaultFar );
    camera.position.z = 1;

    cameraHelper = new THREE.CameraHelper( camera );
    scene.add( cameraHelper );
    cameraHelper.visible = false;

    camera2 = new THREE.PerspectiveCamera( defaultFOV, window.innerWidth / window.innerHeight, defaultNear, 50 );

    // geometry
    loaderGeometry = new THREE.BufferGeometry();
    loaderGeometry.addAttribute('position', new THREE.BufferAttribute(teapotVertices, 3));
    loaderGeometry.addAttribute('normal', new THREE.BufferAttribute(teapotNormals, 3));
    cubeGeometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    sphereGeometry = new THREE.SphereGeometry( .2, 32, 32 );
    sphereGeometry.faceVertexUvs[1] = sphereGeometry.faceVertexUvs[0];
    vertexGeometry = new THREE.SphereGeometry( .2, 8, 8 );

    // texture
    let r = "img/";
    let textureLoader = new THREE.TextureLoader();
    textureMap = textureLoader.load(r + 'ball.jpg');
    textureNormalMap = textureLoader.load(r + 'ball_normal.jpg');
    textureLightMap = textureLoader.load(r + 'ball_light.jpg');
	let urls = [ r + "posx.jpg", r + "negx.jpg", r + "posy.jpg", r + "negy.jpg", r + "posz.jpg", r + "negz.jpg" ];
	textureEnvironmentMap = new THREE.CubeTextureLoader().load( urls );
	// textureEnvironmentMap.format = THREE.RGBFormat;
	// textureEnvironmentMap.mapping = THREE.CubeReflectionMapping;

    // material
	normalMaterial = new THREE.MeshNormalMaterial({ transparent: true, opacity: 1 });
    basicMaterial = new THREE.MeshBasicMaterial({ color: defaultMaterialColor });
    lambertMaterial = new THREE.MeshLambertMaterial({ color: defaultMaterialColor, emissive: 0x000000 });
    phongMaterial = new THREE.MeshPhongMaterial({ color: defaultMaterialColor, emissive: 0x000000, specular: 0x111111, shininess: defaultShininess });
    phongFlatMaterial = new THREE.MeshPhongMaterial({ color: defaultMaterialColor, emissive: 0x000000, specular: 0x111111, shininess: defaultShininess, shading: THREE.FlatShading });
    phongWireMaterial = new THREE.MeshPhongMaterial({ color: defaultMaterialColor, emissive: 0x000000, specular: 0x111111, shininess: defaultShininess, wireframe: true });
    standardMaterial = new THREE.MeshStandardMaterial({ color: defaultMaterialColor, roughness: .3, metalness: 0 });

    // mesh
	mesh = new THREE.Mesh( cubeGeometry, normalMaterial );
	scene.add( mesh );
    mesh.visible = false;

    // light
    directionalGroup = new THREE.Group();
    scene.add(directionalGroup);
    directionalGroup.visible = false;
    directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalGroup.add( directionalLight );
    directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, .05 );
    directionalGroup.add( directionalLightHelper );

    pointGroup = new THREE.Group();
    scene.add(pointGroup);
    pointGroup.visible = false;
    pointLight = new THREE.PointLight( 0xffffff, 1, 10 );
    pointGroup.add( pointLight );
    pointLightHelper = new THREE.PointLightHelper( pointLight, .05 );
    pointGroup.add( pointLightHelper );

    spotGroup = new THREE.Group();
    scene.add(spotGroup);
    spotGroup.visible = false;
    spotLight = new THREE.SpotLight( 0xffffff, 1, 1, 0.3, 1 );
    spotGroup.add( spotLight );
    spotLightHelper = new THREE.SpotLightHelper( spotLight );
    spotGroup.add( spotLightHelper );

    ambientGroup = new THREE.Group();
    scene.add(ambientGroup);
    ambientLight = new THREE.AmbientLight( 0x505050 );
    ambientGroup.add( ambientLight );

    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(clearColor, 1);
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.querySelector('.webgl').appendChild( renderer.domElement );

    // default ease
    TweenLite.defaultEase = Quart.easeOut;

    // get slide index to show the mesh
    let sections = document.querySelectorAll('.slides > section');
    for (let i = 0, len = sections.length; i < len; i++) {
        if (sections[i].dataset.state == 'displayMesh') {
            displayMeshIndex = i;
        }
        if (sections[i].dataset.state == 'material') {
            materialIndex = i;
        }
    }

    animate();
}

function animate() {

    requestAnimationFrame( animate );

    let time = Date.now() / 1000;

    if (directionalLight) {
        directionalLight.position.y = Math.cos(time) * .3;
        directionalLight.position.x = Math.sin(time) * .3;
        directionalLight.position.z = .3;
        directionalLightHelper.update();
    }
    if (pointLight) {
        pointLight.position.y = Math.cos(time) * .3;
        pointLight.position.x = Math.sin(time) * .3;
        pointLight.position.z = .3;
        pointLightHelper.update();
    }
    if (spotLight) {
        spotLight.position.y = Math.cos(time) * .3;
        spotLight.position.x = Math.sin(time) * .3;
        spotLight.position.z = .3;
        spotLightHelper.update();
    }

    if (isMeshRotating) {
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.02;
    }
    if (isMeshPositioning) {
        mesh.position.x = Math.cos(time) * .3;
        mesh.position.z = Math.sin(time) * .3;
    }
    if (isMeshScaling) {
        mesh.scale.x = 1 + Math.cos(time) * .8;
        mesh.scale.y = 1 + Math.sin(time) * .8;
    }

    if (isCamera2Visible) {

        renderer.clear();

        let time = Date.now() / 2000;
        camera2.position.x = Math.cos(time) * 5;
        camera2.position.y = Math.cos(time) * 5;
        camera2.position.z = Math.sin(time) * 5;
        camera2.lookAt(mesh.position);

        renderer.setViewport( 0, 0, window.innerWidth, window.innerHeight );
        renderer.render( scene, camera );

        cameraHelper.visible = true;
        renderer.setViewport( 20, window.innerHeight * .5 - window.innerHeight / 3 * .5, window.innerWidth / 3, window.innerHeight / 3 );
		renderer.render( scene, camera2 );
        cameraHelper.visible = false;
    }
    else {

        renderer.render( scene, camera );
    }
}

function updateMeshDisplay(visible, action, direction) {

    let objectDistance = 2;

    if (visible && !isMeshVisible) {
        isMeshVisible = true;
        if (action == 'init') {
            mesh.visible = true;
            TweenLite.set(mesh.position, { x:0 });
        }
        else {
            mesh.visible = true;
            // TweenLite.set(mesh.position, { x:direction == 'forward' ? objectDistance : -objectDistance });
            // TweenLite.to(mesh.position, 1, { x:0 });
        }
    }
    else if (!visible && isMeshVisible) {
        isMeshVisible = false;
        // TweenLite.to(mesh.position, .5, { x:direction == 'forward' ? -objectDistance : objectDistance, onComplete:function() {
            mesh.visible = false;
        // } });
    }
}

function updateCamera2Display(visible, fov, near, far) {

    camera.fov = visible ? fov : defaultFOV;
    camera.near = visible ? near : defaultNear;
    camera.far = visible ? far : defaultFar;
    camera.updateProjectionMatrix();
    cameraHelper.update();

    if (visible) {
        renderer.autoClear = false;
    }
    else {
        renderer.autoClear = true;
        renderer.setViewport( 0, 0, window.innerWidth, window.innerHeight );
    }
}

// slide change event
function onSlideChange(index, state, action, direction) {

    console.log(index, state, action, direction)

    let isMeshVisible = false;
    let isNotStop = action != 'stop';

    switch(state) {

        case 'gettingStartedMesh':
            if (isNotStop) isMeshVisible = true;
            break;

        // object3D

        case 'object3DRotation':
            isMeshRotating = isNotStop;
            if (isNotStop) isMeshVisible = true;
            else {
                if (direction == 'backward') {
                    // TweenLite.set(mesh.rotation, {x:mesh.rotation.x % Math.PI, y:mesh.rotation.y % Math.PI, z:mesh.rotation.z % Math.PI});
                    TweenLite.set(mesh.rotation, {x:0, y:0, z:0});
                }
            }
            break;

        case 'object3DPosition':
            isMeshRotating = isNotStop;
            isMeshPositioning = isNotStop;
            if (isNotStop) isMeshVisible = true;
            else TweenLite.set(mesh.position, {x:0, y:0, z:0});
            break;

        case 'object3DScale':
            isMeshRotating = isNotStop;
            isMeshPositioning = isNotStop;
            isMeshScaling = isNotStop;
            if (isNotStop) isMeshVisible = true;
            else {
                TweenLite.set(mesh.position, {x:0, y:0, z:0});
                TweenLite.set(mesh.scale, {x:1, y:1, z:1});
            }
            break;

        // camera

        case 'cameraFOV':
            isMeshRotating = isNotStop;
            isCamera2Visible = isNotStop;
            if (isNotStop) isMeshVisible = true;
            updateCamera2Display(isNotStop, defaultFOV, defaultNear, defaultFar);
            break;

        case 'cameraFOVLarge':
            isMeshRotating = isNotStop;
            isCamera2Visible = isNotStop;
            if (isNotStop) isMeshVisible = true;
            updateCamera2Display(isNotStop, 120, defaultNear, defaultFar);
            break;

        case 'cameraFOVSmall':
            isMeshRotating = isNotStop;
            isCamera2Visible = isNotStop;
            if (isNotStop) isMeshVisible = true;
            updateCamera2Display(isNotStop, 30, defaultNear, defaultFar);
            break;

        case 'cameraNear':
            isMeshRotating = isNotStop;
            isCamera2Visible = isNotStop;
            if (isNotStop) isMeshVisible = true;
            updateCamera2Display(isNotStop, defaultFOV, 1, defaultFar);
            break;

        case 'cameraFar':
            isMeshRotating = isNotStop;
            isCamera2Visible = isNotStop;
            if (isNotStop) isMeshVisible = true;
            updateCamera2Display(isNotStop, defaultFOV, defaultNear, 1);
            break;

        // geometry

        case 'geometrySphere':
            // isMeshRotating = isNotStop;
            mesh.rotation.set(0, 0, 0);
            if (isNotStop) isMeshVisible = true;
            mesh.geometry = isNotStop ? sphereGeometry : cubeGeometry;
            normalMaterial.wireframe = isNotStop;
            break;

        case 'geometryVertex':
            // isMeshRotating = isNotStop;
            mesh.rotation.set(0, 0, 0);
            if (isNotStop) isMeshVisible = true;
            mesh.geometry = isNotStop ? vertexGeometry : cubeGeometry;
            normalMaterial.wireframe = isNotStop;
            break;

        case 'geometryLoader':
            mesh.rotation.set(0, 0, 0);
            if (isNotStop) isMeshVisible = true;
            mesh.geometry = isNotStop ? loaderGeometry : cubeGeometry;
            let scale = isNotStop ? .1 : 1;
            mesh.scale.set(scale, scale, scale);
            mesh.position.y = isNotStop ? -.08 : 0;
            normalMaterial.wireframe = isNotStop;
            break;

        // material

        case 'materialBasic':
            if (isNotStop) isMeshVisible = true;
            mesh.material = isNotStop ? basicMaterial : normalMaterial;
            break;

        case 'materialLambert':
            if (isNotStop) isMeshVisible = true;
            mesh.material = isNotStop ? lambertMaterial : normalMaterial;
            directionalGroup.visible = isNotStop;
            directionalLightHelper.visible = !isNotStop;
            break;

        case 'materialPhong':
            if (isNotStop) isMeshVisible = true;
            mesh.material = isNotStop ? phongMaterial : normalMaterial;
            directionalGroup.visible = isNotStop;
            directionalLightHelper.visible = !isNotStop;
            break;

        case 'materialShininess':
            if (isNotStop) isMeshVisible = true;
            mesh.material = isNotStop ? phongMaterial : normalMaterial;
            directionalGroup.visible = isNotStop;
            directionalLightHelper.visible = !isNotStop;
            phongMaterial.shininess = isNotStop ? 100 : defaultShininess;
            break;

        case 'materialStandard':
            if (isNotStop) isMeshVisible = true;
            mesh.material = isNotStop ? standardMaterial : normalMaterial;
            directionalGroup.visible = isNotStop;
            directionalLightHelper.visible = !isNotStop;
            break;

        case 'materialShading':
            if (isNotStop) isMeshVisible = true;
            mesh.material = isNotStop ? phongFlatMaterial : normalMaterial;
            directionalGroup.visible = isNotStop;
            directionalLightHelper.visible = !isNotStop;
            break;

        case 'materialWireframe':
            if (isNotStop) isMeshVisible = true;
            mesh.material = isNotStop ? phongWireMaterial : normalMaterial;
            directionalGroup.visible = isNotStop;
            directionalLightHelper.visible = !isNotStop;
            break;

        case 'materialOpacity':
            mesh.rotation.set(0, 0, 0);
            if (isNotStop) isMeshVisible = true;
            mesh.material = isNotStop ? phongMaterial : normalMaterial;
            directionalGroup.visible = isNotStop;
            directionalLightHelper.visible = !isNotStop;
            phongMaterial.transparent = isNotStop;
            phongMaterial.opacity = isNotStop ? .2 : 1;
            break;

        case 'materialTexture':
            isMeshRotating = isNotStop;
            if (isNotStop) isMeshVisible = true;
            mesh.material = isNotStop ? phongMaterial : normalMaterial;
            directionalGroup.visible = isNotStop;
            directionalLightHelper.visible = !isNotStop;
            phongMaterial.color.set(isNotStop ? 0xffffff : defaultMaterialColor);
            phongMaterial.map = isNotStop ? textureMap : null;
            phongMaterial.needsUpdate = true;
            break;

        case 'materialNormal':
            isMeshRotating = isNotStop;
            if (isNotStop) isMeshVisible = true;
            mesh.material = isNotStop ? phongMaterial : normalMaterial;
            directionalGroup.visible = isNotStop;
            directionalLightHelper.visible = !isNotStop;
            phongMaterial.color.set(isNotStop ? 0xffffff : defaultMaterialColor);
            phongMaterial.map = isNotStop ? textureMap : null;
            phongMaterial.normalMap = isNotStop ? textureNormalMap : null;
            // phongMaterial.normalScale.set(2, 2)
            phongMaterial.needsUpdate = true;
            break;

        case 'materialEnvironment':
            isMeshRotating = isNotStop;
            if (isNotStop) isMeshVisible = true;
            mesh.material = isNotStop ? phongMaterial : normalMaterial;
            directionalGroup.visible = isNotStop;
            directionalLightHelper.visible = !isNotStop;
            phongMaterial.color.set(isNotStop ? 0xffffff : defaultMaterialColor);
            phongMaterial.map = isNotStop ? textureMap : null;
            phongMaterial.normalMap = isNotStop ? textureNormalMap : null;
            phongMaterial.envMap = isNotStop ? textureEnvironmentMap : null;
            phongMaterial.reflectivity = .08;
            phongMaterial.needsUpdate = true;
            break;

        case 'materialLight':
            isMeshRotating = isNotStop;
            if (isNotStop) isMeshVisible = true;
            mesh.material = isNotStop ? phongMaterial : normalMaterial;
            // directionalGroup.visible = isNotStop;
            // directionalLightHelper.visible = !isNotStop;
            phongMaterial.color.set(isNotStop ? 0xffffff : defaultMaterialColor);
            phongMaterial.map = isNotStop ? textureMap : null;
            phongMaterial.lightMap = isNotStop ? textureLightMap : null;
            phongMaterial.needsUpdate = true;
            break;

        // light

        case 'lightAmbient':
            if (isNotStop) isMeshVisible = true;
            mesh.material = isNotStop ? phongMaterial : normalMaterial;
            break;

        case 'lightDirectional':
            if (isNotStop) isMeshVisible = true;
            mesh.material = isNotStop ? phongMaterial : normalMaterial;
            directionalGroup.visible = isNotStop;
            break;

        case 'lightPoint':
            if (isNotStop) isMeshVisible = true;
            mesh.material = isNotStop ? phongMaterial : normalMaterial;
            pointGroup.visible = isNotStop;
            break;

        case 'lightSpot':
            if (isNotStop) isMeshVisible = true;
            mesh.material = isNotStop ? phongMaterial : normalMaterial;
            spotGroup.visible = isNotStop;
            break;
    }

    if (isNotStop) updateMeshDisplay(isMeshVisible, action, direction);

    if (index >= materialIndex) mesh.geometry = sphereGeometry;
}
