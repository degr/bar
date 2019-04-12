import * as THREE from "three";
import * as CANNON from "cannon";

const PI_2 = Math.PI / 2;

export default class PointerControl {
    constructor(camera, cannonBody, settings) {
        this.settings = settings;
        const eyeYPos = 2; // eyes are 2 meters above the ground
        this.velocityFactor = 0.4;
        this.jumpVelocity = 20;
        this.cannonBody = cannonBody;
        this.pitchObject = new THREE.Object3D();
        this.pitchObject.add(camera);

        this.yawObject = new THREE.Object3D();
        this.yawObject.position.y = eyeYPos;
        this.yawObject.add(this.pitchObject);

        this.quat = new THREE.Quaternion();

        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        this.canJump = false;

        const contactNormal = new CANNON.Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
        const upAxis = new CANNON.Vec3(0, 1, 0);
        this.cannonBody.addEventListener("collide", (e) => {
            const contact = e.contact;
            // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
            // We do not yet know which one is which! Let's check.
            if (contact.bi.id === this.cannonBody.id)  // bi is the player body, flip the contact normal
                contact.ni.negate(contactNormal);
            else
                contactNormal.copy(contact.ni); // bi is something else. Keep the normal as it is
            // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
            if (contactNormal.dot(upAxis) > 0.5) // Use a "good" threshold value between 0 and 1 here!
                this.canJump = true;
        });

        this.velocity = this.cannonBody.velocity;



        document.addEventListener('mousemove', e => this.onMouseMove(e), false);
        document.addEventListener('keydown', e => this.onKeyDown(e), false);
        document.addEventListener('keyup', e => this.onKeyUp(e), false);


    };

    getObject() {
        return this.yawObject;
    };

    getDirection (targetVec) {
        targetVec.set(0, 0, -1);
        this.quat.multiplyVector3(targetVec);
    };


    onKeyDown(event) {
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                this.moveForward = true;
                break;
            case 37: // left
            case 65: // a
                this.moveLeft = true;
                break;
            case 40: // down
            case 83: // s
                this.moveBackward = true;
                break;
            case 39: // right
            case 68: // d
                this.moveRight = true;
                break;
            case 32: // space
                if (this.canJump === true) {
                    this.velocity.y = this.jumpVelocity;
                }
                this.canJump = false;
                break;
        }
    };


    onKeyUp(event) {
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                this.moveForward = false;
                break;
            case 37: // left
            case 65: // a
                this.moveLeft = false;
                break;

            case 40: // down
            case 83: // a
                this.moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                this.moveRight = false;
                break;
        }
    };

    onMouseMove (event) {

        if (!this.settings.enabled) return;

        const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        this.yawObject.rotation.y -= movementX * 0.002;
        this.pitchObject.rotation.x -= movementY * 0.002;

        this.pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, this.pitchObject.rotation.x));
    };

    update(delta) {
        const inputVelocity = new THREE.Vector3();
        const euler = new THREE.Euler();
        if (!this.settings.enabled) return;

        delta *= 0.1;

        inputVelocity.set(0, 0, 0);

        if (this.moveForward) {
            inputVelocity.z = -this.velocityFactor * delta;
        }
        if (this.moveBackward) {
            inputVelocity.z = this.velocityFactor * delta;
        }

        if (this.moveLeft) {
            inputVelocity.x = -this.velocityFactor * delta;
        }
        if (this.moveRight) {
            inputVelocity.x = this.velocityFactor * delta;
        }

        // Convert velocity to world coordinates
        euler.x = this.pitchObject.rotation.x;
        euler.y = this.yawObject.rotation.y;
        euler.order = "XYZ";
        this.quat.setFromEuler(euler);
        inputVelocity.applyQuaternion(this.quat);

        // Add to the object
        this.velocity.x += inputVelocity.x;
        this.velocity.z += inputVelocity.z;
        this.yawObject.position.copy(this.cannonBody.position);
        console.log(this.cannonBody.position);
    };


    setPosition(x, y, z) {
        if(x !== undefined) {
            this.cannonBody.position.x = x;
        }
        if(y !== undefined) {
            this.cannonBody.position.y = y;
        }
        if(z !== undefined) {
            this.cannonBody.position.z = z;
        }
        this.yawObject.position.copy(this.cannonBody.position);
    }
    getLocation() {
        return this.cannonBody.position;
    }
}