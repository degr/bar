import React from 'react';
import * as THREE from 'three';
import CANNON from 'cannon';
import BodyComposition from "./BodyComposition";
import PointerControl from "./PointerControl";
import Utils from '../utils/Utils.js';
import WhiteKube from "./objects/WhiteKube";
import WhitePanelBuilder from "./objects/WhitePanelBuilder";
import FBXLoader from 'three-fbxloader-offical';

export default class Canvas extends React.Component {
    componentDidMount() {


        var sphereShape, sphereBody, world, physicsMaterial, light, light1, light2, spotLight1, balls=[];
        var bodies = [];
        var settings = {enabled: false};
        var mixer;

        var camera, scene, renderer;
        var geometry, material, mesh;
        var controls,time = Date.now();

        var blocker = document.getElementById( 'blocker' );
        var instructions = document.getElementById( 'instructions' );


        if ( Utils.hasPointerLock() ) {

            var body = document.body;

            var pointerlockchange = function () {
                var pointerLockElement = Utils.getPointerLock();
                if (pointerLockElement === body) {

                    settings.enabled = true;

                    blocker.style.display = 'none';

                } else {

                    settings.enabled = false;

                    blocker.style.display = '-webkit-box';
                    blocker.style.display = '-moz-box';
                    blocker.style.display = 'box';

                    instructions.style.display = '';

                }

            };

            var pointerlockerror = function () {
                instructions.style.display = '';
            };

            // Hook pointer lock state change events
            document.addEventListener( 'pointerlockchange', pointerlockchange, false );
            document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
            document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

            document.addEventListener( 'pointerlockerror', pointerlockerror, false );
            document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
            document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

            instructions.addEventListener( 'click', function () {
                instructions.style.display = 'none';
                // Ask the browser to lock the pointer
                body.requestPointerLock = Utils.browserCompatible(
                    body,
                    ['requestPointerLock', 'mozRequestPointerLock', 'webkitRequestPointerLock']
                );

                body.requestPointerLock();

            }, false );

        } else {

            instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

        }

        initCannon();
        init();
        animate();

        function initCannon(){
            // Setup our world
            world = new CANNON.World();
            world.quatNormalizeSkip = 0;
            world.quatNormalizeFast = false;

            var solver = new CANNON.GSSolver();

            world.defaultContactMaterial.contactEquationStiffness = 1e9;
            world.defaultContactMaterial.contactEquationRelaxation = 4;

            solver.iterations = 7;
            solver.tolerance = 0.1;
            var split = true;
            if(split)
                world.solver = new CANNON.SplitSolver(solver);
            else
                world.solver = solver;

            world.gravity.set(0,-20,0);
            world.broadphase = new CANNON.NaiveBroadphase();

            // Create a slippery material (friction coefficient = 0.0)
            physicsMaterial = new CANNON.Material("slipperyMaterial");
            var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
                physicsMaterial,
                0.0, // friction coefficient
                0.3  // restitution
            );
            // We must add the contact materials to the world
            world.addContactMaterial(physicsContactMaterial);

            // Create a sphere
            var mass = 5, radius = 1.3;
            sphereShape = new CANNON.Sphere(radius);
            sphereBody = new CANNON.Body({ mass: mass });
            sphereBody.addShape(sphereShape);
            sphereBody.position.set(0,5,0);
            sphereBody.linearDamping = 0.9;
            world.add(sphereBody);

            // Create a plane
            var groundShape = new CANNON.Plane();
            var groundBody = new CANNON.Body({ mass: 0 });
            groundBody.addShape(groundShape);
            groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
            world.add(groundBody);
        }

        function init() {

            camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );

            scene = new THREE.Scene();
            //scene.fog = new THREE.Fog( 0x000000, 0, 500 );

/*            var ambient = new THREE.AmbientLight( 0x111111 );
            scene.add( ambient );*/



/*            light = new THREE.DirectionalLight( 0xffffff, 1 );
            //light = new THREE.SpotLight( 0xffffff );
            light.position.set( 10, 60, 20 );
            light.target.position.set( 0, 0, 0 );
            light.castShadow = true;

            light.shadow.camera.near = 30;
            light.shadow.camera.far = 500;//camera.far;
            light.shadow.camera.fov = 100;

            //light.shadow.map.bias = 0.1;
           // light.shadow.map.darkness = 0.7;
            light.shadow.mapSize.width = 2*512;
            light.shadow.mapSize.height = 2*512;
            scene.add( light );*/

            let loader1 = new FBXLoader();
            loader1.load( '/models/fbx/lightBulbs_grp_01.fbx', function (lightBulbs) {
                lightBulbs.castShadow = true;
                lightBulbs.receiveShadow = true;
                scene.add(lightBulbs);
            });

            let loader5 = new FBXLoader();
            loader5.load( '/models/fbx/lights_grp.fbx', function (lights) {
                lights.castShadow = true;
                lights.receiveShadow = true;
                scene.add(lights);
            });

            let loader6 = new FBXLoader();
            loader6.load( '/models/fbx/floor.fbx', function (floor) {
                floor.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                } );
                scene.add(floor);
            });


            let loader2 = new FBXLoader();
            loader2.load( '/models/fbx/rabbit.fbx', function (rabbit) {
                rabbit.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                } );

                scene.add(rabbit);
            });

/*
            let cylinder  = new THREE.CylinderGeometry( 0.05, 0.05, 0.2, 0.032 );
            light1 = new THREE.PointLight( 0xff9000, 0.5, 20 );
            light1.add( new THREE.Mesh( cylinder , new THREE.MeshBasicMaterial( { color: 0xff9000 } ) ) );
            light1.castShadow = true;
            light1.receiveShadow = true;
            light1.position.set( -1.76, 2.52, -1.5 );
            scene.add( light1 );

            let cylinder1  = new THREE.CylinderGeometry( 0.05, 0.05, 0.2, 0.032 );
            light2 = new THREE.PointLight( 0xff9000, 0.5, 20 );
            light2.add( new THREE.Mesh( cylinder1 , new THREE.MeshBasicMaterial( { color: 0xff9000 } ) ) );
            light2.castShadow = true;
            light2.receiveShadow = true;
            light2.position.set( 0.57, 2.52, -1.40 );
            scene.add( light2 );
*/


            controls = new PointerControl( camera , sphereBody, settings );
            scene.add( controls.getObject() );

            // floor
/*            geometry = new THREE.PlaneGeometry( 300, 300, 50, 50 );
            geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

            material = new THREE.MeshLambertMaterial( { color: 0xdddddd } );

            mesh = new THREE.Mesh( geometry, material );
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            scene.add( mesh );*/

            const loader = new FBXLoader();
            loader.load( '/models/fbx/bar_final_02.fbx', function ( object ) {
                object.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        child.castShadow = true;
                    }
                } );
                scene.add( object );
            } );

            const loader4 = new FBXLoader();
            loader4.load( '/models/fbx/tv.fbx', function ( object ) {
                object.castShadow = true;
                object.receiveShadow = true;
                scene.add( object );
            } );

            let loader7 = new FBXLoader();
            loader7.load( '/models/fbx/tarshers_grp.fbx', function (tarshers) {
                tarshers.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        child.castShadow = true;
                    }
                } );
                scene.add(tarshers);
            });

            let loader8 = new FBXLoader();
            loader8.load( '/models/fbx/glass_heineken.fbx', function (glass) {
                glass.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        child.castShadow = true;
                    }
                } );
                scene.add(glass);
            });


            let loader9 = new FBXLoader();
            loader9.load( '/models/fbx/chairBar_03.fbx', function (stool) {
                stool.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        child.castShadow = true;
                    }
                } );
                scene.add(stool);
            });

            let loader10 = new FBXLoader();
            loader10.load( '/models/fbx/avatar_bakedToBones_17.fbx', function (avatar) {

                mixer = new THREE.AnimationMixer( avatar );
                var action = mixer.clipAction( avatar.animations[ 0 ] );
                action.play();

                avatar.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        child.castShadow = true;
                        avatar.scale.set(0.04,0.04,0.04);
                    }
                } );
                scene.add(avatar);
            });

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.shadowMap.enabled = true;
            renderer.shadowMapSoft = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.setSize( window.innerWidth, window.innerHeight );
            //renderer.setClearColor( scene.fog.color, 1 );

            document.body.appendChild( renderer.domElement );

            window.addEventListener( 'resize', onWindowResize, false );

/*            // Add boxes
            for(var i=0; i<7; i++){
                const box = new WhiteKube(
                    (Math.random()-0.5)*20,
                    1 + (Math.random() - 0.5),
                    (Math.random()-0.5)*20
                );
                bodies.push(box);
                box.addTo(world, scene);
            }*/


            // Add linked boxes
/*            var mass = 0;
            var N = 5, last = null;
            for(var i=0; i<N; i++){
                const builder = new WhitePanelBuilder(mass, i, world, scene, N, last);
                builder.addConstraints(last, world);
                mass = builder.getMass();
                last = builder.getLast();
                bodies.push(builder.build());
            }*/
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( window.innerWidth, window.innerHeight );
        }

        var dt = 1.5/60;
        function animate() {
            requestAnimationFrame( animate );
            //var delta = clock.getDelta();
            //if ( mixer ) mixer.update( delta );

            if(settings.enabled){
                world.step(dt);
                if ( mixer ) mixer.update( dt );
                // Update ball positions
                bodies.forEach(function(dt){dt.update()});
            }

            controls.update( Date.now() - time );
            renderer.render( scene, camera );
            time = Date.now();

        }

        var ballShape = new CANNON.Sphere(0.2);
        var ballGeometry = new THREE.SphereGeometry(ballShape.radius, 32, 32);
        var shootDirection = new THREE.Vector3();
        var shootVelo = 15;


        const unprojectVector=function(){
            var matrix=new THREE.Matrix4;
            var B=new THREE.Matrix4;
            return function(vector,camera){
                matrix.getInverse(camera.projectionMatrix);
                B.multiplyMatrices(camera.matrixWorld, matrix);
                return vector.applyProjection(B)
            }
        }();

        function getShootDir(targetVec){
            var vector = targetVec;
            targetVec.set(0,0,1);
            unprojectVector(vector, camera);
            var ray = new THREE.Ray(sphereBody.position, vector.sub(sphereBody.position).normalize() );
            targetVec.copy(ray.direction);
        }

        window.addEventListener("click",function(e){
            if(settings.enabled){
                var x = sphereBody.position.x;
                var y = sphereBody.position.y;
                var z = sphereBody.position.z;
                var ballBody = new CANNON.Body({ mass: 1 });
                ballBody.addShape(ballShape);
                var ballMesh = new THREE.Mesh( ballGeometry, material );
                world.add(ballBody);
                scene.add(ballMesh);
                ballMesh.castShadow = true;
                ballMesh.receiveShadow = true;
                balls.push(ballBody);
                bodies.push(new BodyComposition(ballMesh, ballBody));
                getShootDir(shootDirection);
                ballBody.velocity.set(  shootDirection.x * shootVelo,
                    shootDirection.y * shootVelo,
                    shootDirection.z * shootVelo);

                // Move the ball outside the player sphere
                x += shootDirection.x * (sphereShape.radius*1.02 + ballShape.radius);
                y += shootDirection.y * (sphereShape.radius*1.02 + ballShape.radius);
                z += shootDirection.z * (sphereShape.radius*1.02 + ballShape.radius);
                ballBody.position.set(x,y,z);
                ballMesh.position.set(x,y,z);
            }
        });


    }

    render() {
        return <div>
            <div id="blocker" style={{display: '-webkit-box'}}>

                <div id="instructions">
                    <span style={{fontSize:40}}>Click to play</span>
                    <br/>
                        (W,A,S,D = Move, SPACE = Jump, MOUSE = Look, CLICK = Shoot)
                </div>
            </div>
        </div>
    }
}