export default class BodyComposition {
    constructor(mesh, body) {
        this.mesh = mesh;
        this.body = body;
    }

    update() {
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }

    addTo(world, scene) {
        world.add(this.getBody());
        scene.add(this.getMesh());
    }

    getMesh() {
        return this.mesh;
    }

    getBody() {
        return this.body;
    }
}