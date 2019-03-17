import CANNON from "cannon";
import * as THREE from "three";
import BodyComposition from "../BodyComposition";

const size = 0.5;
const he = new CANNON.Vec3(size,size,size*0.1);
const boxShape = new CANNON.Box(he);
const boxGeometry = new THREE.BoxGeometry(he.x*2,he.y*2,he.z*2);
const material = new THREE.MeshLambertMaterial( { color: 0xdddddd } );
const space = 0.1 * size;

export default class WhitePanelBuilder {
    constructor(mass, index, world, scene, max, last) {
        this.body = new CANNON.Body({ mass: mass });
        this.mass = mass;
        this.body.addShape(boxShape);
        this.mesh = new THREE.Mesh(boxGeometry, material);
        this.body.position.set(5,(max-index)*(size*2+2*space) + size*2+space,0);
        this.body.linearDamping = 0.01;
        this.body.angularDamping = 0.01;
        this.mesh.receiveShadow = true;

        if(index === 0){
            this.mass=0.3;
        }

        scene.add(this.mesh);

    }

    addConstraints(last, world) {
        if(last) {
            // Connect this this.body to the last one
            const c1 = new CANNON.PointToPointConstraint(
                this.body,
                new CANNON.Vec3(-size, size + space, 0),
                last,
                new CANNON.Vec3(-size, -size - space, 0)
            );
            const c2 = new CANNON.PointToPointConstraint(
                this.body,
                new CANNON.Vec3(size, size + space, 0),
                last,
                new CANNON.Vec3(size, -size - space, 0)
            );
            world.addConstraint(c1);
            world.addConstraint(c2);
        }
        world.add(this.body);
        return this;
    }
    
    build() {
        return new BodyComposition(this.mesh, this.body);
    }

    getMass() {
        return this.mass;
    }
    getLast() {
        return this.body;
    }
}