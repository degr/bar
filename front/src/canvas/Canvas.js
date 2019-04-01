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

            camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );

            scene = new THREE.Scene();
            //scene.fog = new THREE.Fog( 0x000000, 0, 500 );

/*            var ambient = new THREE.AmbientLight( 0x111111 );
            scene.add( ambient );*/

            controls = new PointerControl( camera , sphereBody, settings );
            scene.add( controls.getObject() );


            let loader = new FBXLoader();

            loader.load( '/models/fbx/lightBulbs_grp_01.fbx', function (lightBulbs) {
                lightBulbs.traverse( function ( child ) {
                    if ( child.isMesh ) {

                    }
                } );
                scene.add(lightBulbs);
            });

            loader.load( '/models/fbx/lights_grp.fbx', function (lights) {
                scene.add(lights);
            });

            loader.load( '/models/fbx/floor.fbx', function (floor) {
                scene.add(floor);
            });

            loader.load( '/models/fbx/rabbit.fbx', function (rabbit) {

                rabbit.traverse( function( node ) {
                    if( node.material ) {
                        node.material.side = THREE.DoubleSide;
                    }
                });

                scene.add(rabbit);
            });

            loader.load( '/models/fbx/bar_final_02.fbx', function ( bar ) {



                bar.traverse( function ( child ) {
                    if ( child.isMesh ) {

                        //child.castShadow = true;

                    }
                } );
                scene.add( bar );
            } );

            loader.load( '/models/fbx/tv.fbx', function ( tv ) {
                tv.traverse( function ( child ) {
                    if ( child.isMesh ) {

                    }
                } );
                scene.add( tv );
            } );

            loader.load( '/models/fbx/tarshers_grp.fbx', function (tarshers) {
                tarshers.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        child.castShadow = true;

                    }
                } );
                scene.add(tarshers);
            });

            loader.load( '/models/fbx/glass_heineken.fbx', function (glass) {
                glass.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        //glass.rotation.set(new THREE.Vector3( 0, 0, 0));
                        child.castShadow = true;

                    }
                } );
                scene.add(glass);
            });

            loader.load( '/models/fbx/chairBar_03.fbx', function (stool) {
                stool.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        child.castShadow = true;
                        stool.scale.set(0.1,0.1,0.1);

                    }
                } );
                scene.add(stool);
            });

            loader.load( '/models/fbx/avatar_bakedToBones_37.fbx', function (avatar) {
                avatar.traverse( function( node ) {
                    if( node.material ) {
                        node.material.side = THREE.DoubleSide;
                    }
                });


                mixer = new THREE.AnimationMixer( avatar );
                var action = mixer.clipAction( avatar.animations[ 0 ] );
                action.play();

                avatar.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        child.castShadow = true;
                        //child.rotateX(Math.PI / 2);

                    }
                } );
                scene.add(avatar);


                avatar.position.x = -1.93;
                //avatar.position.y = 0.09;
                avatar.position.z = -0.547;
                avatar.scale.set(0.1,0.1,0.1);

            });

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.shadowMap.enabled = true;
            renderer.setPixelRatio( window.devicePixelRatio ); //from fbx_load
            //renderer.shadowMapSoft = true;
            //renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.setSize( window.innerWidth, window.innerHeight );
            //renderer.setClearColor( scene.fog.color, 1 );

            document.body.appendChild( renderer.domElement );

        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( window.innerWidth, window.innerHeight );
        }

        var dt = 1/60;
        function animate() {
            requestAnimationFrame( animate );

            if(settings.enabled){
                world.step(dt);
                if ( mixer ) mixer.update( dt );

            }

            controls.update( Date.now() - time );
            renderer.render( scene, camera );
            time = Date.now();

        }

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