function BodyComposition(mesh, body) {
    this.mesh = mesh;
    this.body = body;
}

BodyComposition.prototype.update = function() {
    this.mesh.position.copy(this.body.position);
    this.mesh.quaternion.copy(this.body.quaternion);
};

BodyComposition.prototype.getMesh = function() {
    return this.mesh;
};
BodyComposition.prototype.getBody = function() {
    return this.body;
};