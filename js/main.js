var scope = this;

var vrInput;

function gotVRDevices(devices) {
    for (var i = 0; i < devices.length; i++) {
        if (( 'VRDisplay' in window && devices[i] instanceof VRDisplay ) ||
            ( 'PositionSensorVRDevice' in window && devices[i] instanceof PositionSensorVRDevice )) {
            vrInput = devices[i];
            break;
        }
    }
    if (!vrInput) {
        if (onError) onError('VR input not available.');
    }
}

if (navigator.getVRDisplays) {

    navigator.getVRDisplays().then(gotVRDevices);

}
var pose = [0, 0, 0, 1];
scope.update = function () {
    if (vrInput) {
        if (vrInput.getPose) {
            pose = vrInput.getPose();
        }
    }
};

// Get the canvas element from our HTML above
var canvas = document.getElementById("renderCanvas");
var quat;
// Load the BABYLON 3D engine
var engine = new BABYLON.Engine(canvas, true);
var camera;

var createScene = function () {

    var scene = new BABYLON.Scene(engine);

    scene.clearColor = new BABYLON.Color3(0, 1, 0);

    camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, 0), scene);

    //camera.inputs.addVRDeviceOrientation();

    camera.setTarget(BABYLON.Vector3.Zero());

    camera.attachControl(canvas, false);

    quat = new BABYLON.Quaternion.FromArray([0, 0, 0, 1], 0);

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    light.intensity = .5;

    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 20, scene);
    var materialSphere1 = new BABYLON.StandardMaterial("texture1", scene);
    materialSphere1.wireframe = true;
    sphere.material = materialSphere1;
    sphere.position.y = 1;

    return scene;

};

var scene = createScene();

var angle = new BABYLON.Vector3();
// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scope.update();

    quat.x = pose.orientation[0];
    quat.y = pose.orientation[1];
    quat.z = pose.orientation[2];
    quat.w = pose.orientation[3];
    angle = quat.toEulerAngles();
    camera.rotation.x = -1*angle.x;
    camera.rotation.y = -1*angle.y;
    camera.rotation.z = angle.z;
    scene.render();
});


// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});


