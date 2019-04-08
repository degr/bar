import React from 'react';
import * as THREE from 'three';
import CANNON from 'cannon';
import PointerControl from "./PointerControl";
import Utils from '../utils/Utils.js';
import FBXLoader from 'three-fbxloader-offical';
import Map from '../components/Map'

export default class Canvas extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showMap: false
        }
    }

    componentDidMount() {


        var sphereShape, sphereBody, world, physicsMaterial;
        var settings = {enabled: false};
        var mixer_01, mixer_02, mixer_03;

        var camera, scene, renderer;
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

        function detectFPS() {


        }

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

        function createSpotlight( color ) {
            var newObj = new THREE.SpotLight( color, 1 );
            newObj.castShadow = true;
            newObj.angle = 1.2;
            newObj.penumbra = 0.1;
            newObj.decay = 0.1;
            newObj.distance = 15;
            newObj.shadow.mapSize.width = 512;
            newObj.shadow.mapSize.height = 512;
            return newObj;
        }

        function createSpotlight2( color ) {
            var newObj = new THREE.SpotLight( color, 1 );
            newObj.castShadow = true;
            newObj.angle = 0.63;
            newObj.penumbra = 0.3;
            newObj.decay = 0.1;
            newObj.distance = 7;
            newObj.shadow.mapSize.width = 512;
            newObj.shadow.mapSize.height = 512;
            return newObj;
        }


        function createSpotlight3( color ) {
            var newObj = new THREE.SpotLight( color, 1 );
            newObj.castShadow = true;
            newObj.angle = 0.9;
            newObj.penumbra = 0.09;
            newObj.decay = 0.1;
            newObj.distance = 7;
            newObj.shadow.mapSize.width = 512;
            newObj.shadow.mapSize.height = 512;
            return newObj;
        }
        function init() {

            camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );

            scene = new THREE.Scene();
            //scene.fog = new THREE.Fog( 0x000000, 0, 500 );

            var ambient = new THREE.AmbientLight( 0x00C3FF, 0.43 );
            scene.add( ambient );



/*            hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
            hemiLight.color.setHSL( 0.6, 1, 0.6 );
            hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
            hemiLight.position.set( 0, 0, 0 );
            scene.add( hemiLight );
            hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
            scene.add( hemiLightHelper );*/

/*            var bulbGeometry = new THREE.SphereBufferGeometry( 0.02, 16, 8 );
            bulbLight = new THREE.PointLight( 0xFFD47A, 1, 100, 2 );
            bulbMat = new THREE.MeshStandardMaterial( {
                emissive: 0xffffee,
                emissiveIntensity: 1,
                color: 0x000000
            } );
            bulbLight.add( new THREE.Mesh( bulbGeometry, bulbMat ) );
            bulbLight.position.set( 0, 2, 2 );
            bulbLight.castShadow = true;
            scene.add( bulbLight );*/

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

/*            loader.load( '/models/fbx/spotLight_01.fbx', function (lights) {
                lights.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        child.castShadow = true;
                        //lights.scale.set(0.1,0.1,0.1);

                    }
                } );
                scene.add(lights);

            });*/

            loader.load( '/models/fbx/floor.fbx', function (floor) {
                floor.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        floor.scale.set(0.1,0.1,0.1);
                        child.receiveShadow = true;
                    }
                } );
                scene.add(floor);
            });

            loader.load( '/models/fbx/buttles_grp_01.fbx', function (buttles) {
                buttles.traverse( function( node ) {
                    if( node.material ) {
                        node.material.side = THREE.DoubleSide;
                    }
                });

                buttles.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        //child.castShadow = true;
                        buttles.scale.set(0.1,0.1,0.1);
                    }
                } );
                scene.add(buttles);
            });


            loader.load( '/models/fbx/logo_02.fbx', function (logo) {
                logo.traverse( function( node ) {
                    if( node.material ) {
                        //node.material.side = THREE.DoubleSide;
                    }
                });
                scene.add(logo);
                logo.scale.set(0.1,0.1,0.1);
            });

            loader.load( '/models/fbx/bar_final_03.fbx', function ( bar ) {
                bar.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        bar.scale.set(0.1,0.1,0.1);
                        child.castShadow = true;
                        child.receiveShadow = true;

                    }
                } );
                scene.add( bar );
            } );

            loader.load( '/models/fbx/tv.fbx', function ( tv ) {
                tv.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        tv.scale.set(0.1,0.1,0.1);
                    }
                } );
                scene.add( tv );
            } );

            loader.load( '/models/fbx/tarshers_grp.fbx', function (tarshers) {
                tarshers.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        //child.castShadow = true;

                    }
                } );
                scene.add(tarshers);
                tarshers.scale.set(0.1,0.1,0.1);
            });

            loader.load( '/models/fbx/bar_chairs_grp.fbx', function (chairs) {
                chairs.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        child.castShadow = true;
                        chairs.scale.set(0.1,0.1,0.1);

                    }
                } );
                scene.add(chairs);
            });

            loader.load( '/models/fbx/avatar_sit_bar_01.fbx', function (avatar) {
                avatar.traverse( function( node ) {
                    if( node.material ) {
                        node.material.side = THREE.DoubleSide;
                    }
                });

                mixer_01 = new THREE.AnimationMixer( avatar );
                var action = mixer_01.clipAction( avatar.animations[ 0 ] );
                action.play();

                avatar.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        child.castShadow = true;
                    }
                } );
                scene.add(avatar);


                avatar.position.x = 0.10;
                avatar.position.y = -0.02;
                avatar.position.z = 0.54;
                avatar.scale.set(0.1,0.1,0.1);

            });

            loader.load( '/models/fbx/avatar_sit_table_01.fbx', function (avatar) {
                avatar.traverse( function( node ) {
                    if( node.material ) {
                        node.material.side = THREE.DoubleSide;
                    }
                });

                mixer_02 = new THREE.AnimationMixer( avatar );
                var action = mixer_02.clipAction( avatar.animations[ 0 ] );
                action.play();

                avatar.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        child.castShadow = true;
                    }
                } );
                scene.add(avatar);


                avatar.position.x = -4.85;
                //avatar.position.y = -0.01;
                avatar.position.z = 3;
                avatar.scale.set(0.1,0.1,0.1);

            });

            loader.load( '/models/fbx/avatar_sit_sofa_01.fbx', function (avatar) {
                avatar.traverse( function( node ) {
                    if( node.material ) {
                        node.material.side = THREE.DoubleSide;
                    }
                });

                mixer_03 = new THREE.AnimationMixer( avatar );
                var action = mixer_03.clipAction( avatar.animations[ 0 ] );
                action.play();

                avatar.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        child.castShadow = true;
                    }
                } );
                scene.add(avatar);


                avatar.position.x = 3.84;
                //avatar.position.y = -0.01;
                avatar.position.z = 4.1;
                avatar.scale.set(0.1,0.1,0.1);

            });

            let spotLight1 = createSpotlight( 0xFF7E00 );
            spotLight1.position.set( 0, 2.4,-1 );
            spotLight1.target.position.set(0,0,-1.3)
            //lightHelper1 = new THREE.SpotLightHelper( spotLight1 );
/*            spotLight1.shadow.camera.near = 10;
            spotLight1.shadow.camera.far = 1;
            spotLight1.shadow.camera.fov = 1;*/
            scene.add( spotLight1.target, spotLight1);
            //scene.add( lightHelper1);

            let spotLight2 = createSpotlight2( 0xFF7E00 );
            spotLight2.position.set( -4.48, 2.4,2.7 );
            spotLight2.target.position.set(-4.48,0,2.7)
            //lightHelper2 = new THREE.SpotLightHelper( spotLight2 );
            scene.add( spotLight2.target, spotLight2);
            //scene.add( lightHelper2);

            let spotLight3 = createSpotlight3( 0xFF7E00 );
            spotLight3.position.set( 3.84, 2.4,4.5 );
            spotLight3.target.position.set(3.84, 0,4.5)
            //lightHelper3 = new THREE.SpotLightHelper( spotLight3 );
            scene.add( spotLight3.target, spotLight3);
            //scene.add( lightHelper3);

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.shadowMap.enabled = true;
            //renderer.setPixelRatio( window.devicePixelRatio ); //from fbx_load
            renderer.shadowMapSoft = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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

            //let t0 = performance.now();

            if(settings.enabled){
                world.step(dt);
                if ( mixer_01 ) mixer_01.update( dt );
                if ( mixer_02 ) mixer_02.update( dt );
                if ( mixer_03 ) mixer_03.update( dt );

            }

            controls.update( Date.now() - time );
            renderer.render( scene, camera );
            time = Date.now();

            //let t1 = performance.now();

            //console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
        }

    }

    render() {
        return <div>
            <div id="blocker" style={{display: '-webkit-box'}}>
                <button onClick={this.showMap}>Show Map</button>
                <div id="instructions">
                    <span style={{fontSize:40}}>Click to play</span>
                    <br/>
                    (W,A,S,D = Move, SPACE = Jump, MOUSE = Look, CLICK = Shoot)
                </div>
            </div>
            {this.state.showMap && <Map />}
        </div>
    }

    showMap = () => {
        this.setState({showMap: true});
    }
}