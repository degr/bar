import BodyComposition from "../BodyComposition";
import CANNON from "cannon";
import * as THREE from "three";

const halfExtents = new CANNON.Vec3(1,1,1);
const boxShape = new CANNON.Box(halfExtents);
const boxGeometry = new THREE.BoxGeometry(
    halfExtents.x*2,
    halfExtents.y*2,
    halfExtents.z*2
);
const material = new THREE.MeshLambertMaterial( { color: 0xdddddd } );

export default class WhiteKube extends BodyComposition {
    constructor(x, y, z) {
        super(WhiteKube.getMesh(), WhiteKube.getBody());
        this.getBody().position.set(x, y, z);
        this.getMesh().position.set(x, y, z)
    }

    static getMesh() {
        const boxMesh = new THREE.Mesh( boxGeometry, material );
        boxMesh.castShadow = true;
        boxMesh.receiveShadow = true;
        return boxMesh;
    }
    static getBody() {
        const boxBody = new CANNON.Body({ mass: 5 });
        boxBody.addShape(boxShape);
        return boxBody;
    }
}