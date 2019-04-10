import React from 'react';
import * as THREE from 'three';
import CANNON from 'cannon';
import PointerControl from "./PointerControl";
import Utils from '../utils/Utils.js';
import FBXLoader from 'three-fbxloader-offical';
import './Canvas.scss';

class Avatar {
    constructor(pos, mixer, path){
        this.pos = pos;
        this.mixer = mixer;
        this.path = path;
    }
    
}

export default class Canvas extends React.Component {


    componentDidMount() {


        var sphereShape, sphereBody, world, physicsMaterial;
        var settings = {enabled: false};
        let mixer_01, mixer_02, mixer_03;

        const avatarScale = 0.1;
        var camera, scene, renderer;
        var controls,time = Date.now();

        let loader = new FBXLoader();

        var blocker = document.getElementById( 'blocker' );
        var instructions = document.getElementById( 'instructions' );

        let pathBarAvatar = '/models/fbx/avatar_sit_bar_01.fbx'
        let pathTableAvatar = '/models/fbx/avatar_sit_table_01.fbx'
        let pathSofaAvatar = '/models/fbx/avatar_sit_sofa_01.fbx'

        //region Coordinates
        let B1CoordCam  = ["0.05", "1.55", "0.3"];
        let B2CoordCam  = ["0.05", "1.55", "0.3"];
        let B3CoordCam  = ["0.05", "1.55", "0.3"];
        let B4CoordCam  = ["0.05", "1.55", "0.3"];
        let B5CoordCam  = ["0.05", "1.55", "0.3"];
        let B6CoordCam  = ["0.05", "1.55", "0.3"];
        let B7CoordCam  = ["0.05", "1.55", "0.3"];
        let B8CoordCam  = ["0.05", "1.55", "0.3"];
        let B9CoordCam  = ["0.05", "1.55", "0.3"];
        let B10CoordCam =["0.05", "1.55", "0.3"];

        let T1CoordAvatar = ["-4.85", "0", "3"]
        let T2CoordAvatar = []
        let T3CoordAvatar = []
        let T4CoordAvatar = []
        let T5CoordAvatar = []
        let T6CoordAvatar = []
        let T7CoordAvatar = []
        let T8CoordAvatar = []


        let T1CoordCam = ["-4.85", "0", "3"];
        let T2CoordCam = [];
        let T3CoordCam = [];
        let T4CoordCam = [];
        let T5CoordCam = [];
        let T6CoordCam = [];
        let T7CoordCam = [];
        let T8CoordCam = [];

        let S1CoordAvatar = [];
        let S2CoordAvatar = ["3.84", "0", "4.1"];
        let S3CoordAvatar = [];
        let S4CoordAvatar = [];
        let S5CoordAvatar = [];
        let S6CoordAvatar = [];
        let S7CoordAvatar = [];
        let S8CoordAvatar = [];
        let S9CoordAvatar = [];

        let S1CoordCam = [];
        let S2CoordCam = ["3.84", "0", "4.1"];
        let S3CoordCam = [];
        let S4CoordCam = [];
        let S5CoordCam = [];
        let S6CoordCam = [];
        let S7CoordCam = [];
        let S8CoordCam = [];
        let S9CoordCam = [];





        let B1CoordAvatar  = ["0.05", "1.55", "0.3"];
        let B2CoordAvatar  = ["0.05", "1.55", "0.3"];
        let B3CoordAvatar  = ["0.05", "1.55", "0.3"];
        let B4CoordAvatar  = ["0.05", "1.55", "0.3"];
        let B5CoordAvatar  = ["0.05", "1.55", "0.3"];
        let B6CoordAvatar  = ["0.10", "-0.02", "0.54"];
        let B7CoordAvatar  = ["0.05", "1.55", "0.3"];
        let B8CoordAvatar  = ["0.05", "1.55", "0.3"];
        let B9CoordAvatar  = ["0.05", "1.55", "0.3"];
        let B10CoordAvatar =["0.05", "1.55", "0.3"];
        //endregion

        if ( Utils.hasPointerLock() )
        {

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
            let mass = 0, radius = 0.7;
            sphereShape = new CANNON.Sphere(radius);
            sphereBody = new CANNON.Body({ mass: mass });
            sphereBody.addShape(sphereShape);
            //avatar on place_s_2
            //sphereBody.position.set(4.21,0,4.1);
            //avatar on place_s_2
            sphereBody.position.set(B1CoordCam[0], B1CoordCam[1], B1CoordCam[2]);
            sphereBody.linearDamping = 0.9;
            world.add(sphereBody);

            // Create a plane
            var groundShape = new CANNON.Plane();
            var groundBody = new CANNON.Body({ mass: 0 });
            groundBody.addShape(groundShape);
            groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
            world.add(groundBody);
        }

        function loadAvatar(path, coords, mixer){
            loader.load( path,  (avatar) => {
                avatar.traverse( ( object ) => { object.frustumCulled = false;} );
                avatar.traverse( ( child ) => { if ( child.isMesh ) {child.castShadow = true;}} );
                avatar.traverse( ( node ) => {if( node.material ) {
                    node.material.side = THREE.DoubleSide;
                }
                });

                mixer = new THREE.AnimationMixer(avatar);
                let action = mixer.clipAction( avatar.animations[ 0 ] );
                action.play();

                scene.add(avatar);

                avatar.position.set(coords[0], coords[1], coords[2]);
                avatar.scale.set(avatarScale, avatarScale, avatarScale);
                return mixer

            });

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

            camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.01, 1000 );
            scene = new THREE.Scene();
            //scene.background = new THREE.Color( 0x000000 );
            //scene.fog = new THREE.Fog( 0xffffff, 1, 3 );

            var ambient = new THREE.AmbientLight( 0x00C3FF, 0.43 );
            scene.add( ambient );

            controls = new PointerControl( camera , sphereBody, settings );
            scene.add( controls.getObject() );



            //region Bar
            loader.load( '/models/fbx/lightBulbs_grp_01.fbx',  (lightBulbs) => {
                lightBulbs.traverse( function ( child ) {
                    if ( child.isMesh ) {

                    }
                } );
                scene.add(lightBulbs);
            });

            loader.load( '/models/fbx/floor.fbx',  (floor) => {
                floor.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        floor.scale.set(0.1,0.1,0.1);
                        child.receiveShadow = true;
                    }
                } );
                scene.add(floor);
            });

            loader.load( '/models/fbx/buttles_grp_01.fbx',  (buttles) => {
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

            loader.load( '/models/fbx/logo_02.fbx', (logo) => {
                logo.traverse( function( node ) {
                    if( node.material ) {
                        //node.material.side = THREE.DoubleSide;
                    }
                });
                scene.add(logo);
                logo.scale.set(0.1,0.1,0.1);
            });

            loader.load( '/models/fbx/bar_final_03.fbx', ( bar ) => {
                bar.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        bar.scale.set(0.1,0.1,0.1);
                        child.castShadow = true;
                        child.receiveShadow = true;

                    }
                } );
                scene.add( bar );
            } );

            loader.load( '/models/fbx/tv.fbx', ( tv ) => {
                tv.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        tv.scale.set(0.1,0.1,0.1);
                    }
                } );
                scene.add( tv );
            } );

            loader.load( '/models/fbx/tarshers_grp.fbx',  (tarshers) => {
                tarshers.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        child.castShadow = true;

                    }
                } );
                scene.add(tarshers);
                tarshers.scale.set(0.1,0.1,0.1);
            });

            loader.load( '/models/fbx/bar_chairs_grp.fbx',  (chairs) => {
                chairs.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        child.castShadow = true;
                        chairs.scale.set(0.1,0.1,0.1);

                    }
                } );
                scene.add(chairs);
            });
            //endregion

            //region Avatars
            loader.load( pathBarAvatar,  (avatar) => {
                avatar.traverse( ( object ) => { object.frustumCulled = false;} );
                avatar.traverse( ( child ) => { if ( child.isMesh ) {child.castShadow = true;}} );
                avatar.traverse( ( node ) => {if( node.material ) {
                    node.material.side = THREE.DoubleSide;
                }
                });

                mixer_01 = new THREE.AnimationMixer(avatar);
                let action = mixer_01.clipAction( avatar.animations[ 0 ] );
                action.play();

                scene.add(avatar);

                avatar.position.set(B6CoordAvatar[0], B6CoordAvatar[1], B6CoordAvatar[2]);
                avatar.scale.set(avatarScale, avatarScale, avatarScale);

            });
            loader.load( pathTableAvatar,  (avatar) => {
                avatar.traverse( ( object ) => { object.frustumCulled = false;} );
                avatar.traverse( ( child ) => { if ( child.isMesh ) {child.castShadow = true;}} );
                avatar.traverse( ( node ) => {if( node.material ) {
                    node.material.side = THREE.DoubleSide;
                }
                });

                mixer_02 = new THREE.AnimationMixer(avatar);
                let action = mixer_02.clipAction( avatar.animations[ 0 ] );
                action.play();

                scene.add(avatar);

                avatar.position.set(T1CoordAvatar[0], T1CoordAvatar[1], T1CoordAvatar[2]);
                avatar.scale.set(avatarScale, avatarScale, avatarScale);

            });
            loader.load( pathSofaAvatar,  (avatar) => {
                avatar.traverse( ( object ) => { object.frustumCulled = false;} );
                avatar.traverse( ( child ) => { if ( child.isMesh ) {child.castShadow = true;}} );
                avatar.traverse( ( node ) => {if( node.material ) {
                    node.material.side = THREE.DoubleSide;
                }
                });

                mixer_03 = new THREE.AnimationMixer(avatar);
                let action = mixer_03.clipAction( avatar.animations[ 0 ] );
                action.play();

                scene.add(avatar);

                avatar.position.set(S2CoordAvatar[0], S2CoordAvatar[1], S2CoordAvatar[2]);
                avatar.scale.set(avatarScale, avatarScale, avatarScale);

            });



            //mixer_01 = loadAvatar(pathBarAvatar,   B6CoordAvatar, mixer_01);
            //mixer_02 = loadAvatar(pathTableAvatar, T1CoordAvatar, mixer_02);
            //mixer_03 = loadAvatar(pathSofaAvatar,  S2CoordAvatar, mixer_03);
            //endregion

            //region SpotLights
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
            //endregion

            //region Render
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.shadowMap.enabled = true;
            //renderer.setPixelRatio( window.devicePixelRatio ); //from fbx_load
            renderer.shadowMapSoft = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.setSize( window.innerWidth, window.innerHeight );
            //renderer.setClearColor( scene.fog.color, 1 );
            //endregion

            document.body.appendChild( renderer.domElement );

        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( window.innerWidth, window.innerHeight );
        }

        const dt = 1/60;
        function animate() {
            requestAnimationFrame( animate );

            if(settings.enabled){
                world.step(dt);
                if ( mixer_01 ) mixer_01.update( dt );
                if ( mixer_02 ) mixer_02.update( dt );
                if ( mixer_03 ) mixer_03.update( dt );

            }

            controls.update( Date.now() - time );
            renderer.render( scene, camera );
            time = Date.now();

        }

    }

    render() {
        return <div>
            <div id="blocker" style={{display: '-webkit-box'}}>
                <div id="instructions" className="playingScreen">
                    {/* <div className="layer"></div> */}
                    <div className="enter">LAPPA BAR</div>
                </div>
            </div>

        </div>
    }
}