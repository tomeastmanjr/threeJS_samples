// Set up the scene, camera and the renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 2, window.innerWidth / window.innerHeight, 1, 1000 );

var renderer = new THREE.WebGLRenderer( { alpha: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Set up the mouse controls
var controls = new THREE.OrbitControls( camera );
controls.autoRotate = true;

// Position the camera
camera.position.z = 120;

// LIGHT
var light = new THREE.PointLight(0xffffff);
light.position.set(-100,200,100);
scene.add(light);

var light = new THREE.PointLight(0xffffff);
light.position.set(100,-200,-100);
scene.add(light);

// variables for movement testing
var mySpots = []
var ballsToMove = []
var ballLocation = {}
var ballX;
var ballY;
var ballZ;

// Set up the loading manager
var manager = new THREE.LoadingManager();
manager.onProgress = function ( item, loaded, total ) {
	console.log( item, loaded, total );
};
//no idea why everyone puts texture here
var texture = new THREE.Texture();

var onProgress = function ( xhr ) {
	if ( xhr.lengthComputable ) {
		var percentComplete = xhr.loaded / xhr.total * 100;
		console.log( Math.round(percentComplete, 2) + '% downloaded' );
	}
};

var onError = function ( xhr ) {
};

// Load a texture (not sure why to do this here)
var loader = new THREE.ImageLoader( manager );
loader.load( '../../test-ninja-head copy/js/three.js-master/examples/models/obj/ninja/UV_Grid_Sm.jpg' ,function ( image ) {

	texture.image = image;
	texture.needsUpdate = true;

} );

var loader = new THREE.OBJLoader( manager );

var objects = [];

// loader.load( '../../test-ninja-head copy/js/three.js-master/examples/models/obj/ninja/head_mesh.obj', function ( object ) {
// 	object.traverse( function ( child ) {
// 		if( child instanceof THREE.Mesh ) {
// 			child.material.map = texture;
// 		};
// 	});
	// set properties of object (i.e. position, rotation, etc);
    // object.position.x = 0
    // object.position.y = -.3
    // object.position.z = 0
    // objects.push( object); //This will most likely work, I just commented it out because it isn't strictly necessary to load the model
// 	object.scale.set(.6, .6, .6);
// 	scene.add( object );
// }, onProgress, onError);

console.log('this is objects', objects);
console.log('typeof objects', typeof objects)




// Green Ball
var greenBall = new THREE.Mesh(
    new THREE.SphereGeometry(.5, .5, .5),
    new THREE.MeshPhongMaterial({color: 0x00ff00})); // 0x00ff00 is green
greenBall.position.set(0, 0, 0);
var greenBallMarker = new THREE.Object3D();
greenBallMarker.add(greenBall);

// Red Ball
var redBall = new THREE.Mesh(
    new THREE.SphereGeometry(.1, .1, .1),
	// 0xff0000 is green
    new THREE.MeshPhongMaterial({color: 0xff0000}));
ballX = -1;
ballY = 0;
ballZ = 0;

redBall.position.set(ballX, ballY, ballZ);
// position.set(X, Y, Z) looking at face for example
// your "viewpoint" changes depending on if you changed the position of other objects below. Notes below can be confusing
// X moves horizontal (left to right, negative to positive, from the center of the object)
// Y moves vertical (down to up, negative to positive, from the center of the object)
// Z moves toward or away from you (back to front, negative to positive, from the center of the object.)
ballLocation = {ballX, ballY, ballZ};
ballsToMove.push(redBall);
mySpots.push(ballLocation)
var redBallMarker = new THREE.Object3D();
redBallMarker.add(redBall);

// Blue Ball
var blueBall = new THREE.Mesh(
    new THREE.SphereGeometry(.1, .1, .1),
	// 0x0000ff is blue
    new THREE.MeshPhongMaterial({color: 0x0000ff}));
ballX = 2;
ballY = 0;
ballZ = 0;

blueBall.position.set(ballX, ballY, ballZ);
ballLocation = {ballX, ballY, ballZ};
ballsToMove.push(blueBall);
mySpots.push(ballLocation);
var blueBallMarker = new THREE.Object3D();
blueBallMarker.add(blueBall);

// Black Ball
var blackBall = new THREE.Mesh(
    new THREE.SphereGeometry(.1, .1, .1),
	// 0x000000 is black
    new THREE.MeshPhongMaterial({color: 0x000000}));
ballX = 1;
ballY = 1;
ballZ = 1;

blackBall.position.set(ballX, ballY, ballZ);
ballLocation = {ballX, ballY, ballZ};
ballsToMove.push(blackBall);
mySpots.push(ballLocation);
var blackBallMarker = new THREE.Object3D();
blackBallMarker.add(blackBall);

// setup scene
var obj = new THREE.Object3D();
obj.add(greenBallMarker);
scene.add(obj);

var obj2 = new THREE.Object3D();
obj2.add(redBallMarker);
scene.add(obj2);

var obj3 = new THREE.Object3D();
obj3.add(blueBallMarker);
scene.add(obj3);

var obj4 = new THREE.Object3D();
obj4.add(blackBallMarker);
scene.add(obj4);

for (i in ballsToMove ){
    // for testing if a collision
    var stop = false;
    var totalMoved = 0;
    while (stop === false){
        // Calculate distance between the 2 objects
        var distanceBetween = ballsToMove[i].position.distanceTo(greenBall.position);
        // console.log('this is distanceBetween', distanceBetween);

        // Check if the distance between 2 objects current vertices is <= 0 + r/2 of both objects (.6 is manualy calculated)
        if ( distanceBetween <= .6 ){
            stop = true;
            console.log('Objects have collided so I have stopped moving ball i', i);
        }

        totalMoved += .01;
        // console.log('this is totalMoved in the while loop', totalMoved);

        // Move the balls closer to the center of the stationary object (greenBall)

        // < < <
        if ( mySpots[i].ballX < 0 && mySpots[i].ballY < 0 && mySpots[i].ballZ < 0) {
            ballsToMove[i].position.set(mySpots[i].ballX+totalMoved, mySpots[i].ballY+totalMoved, mySpots[i].ballZ+totalMoved);
        // < < 0
        } else if ( mySpots[i].ballX < 0 && mySpots[i].ballY < 0 && mySpots[i].ballZ === 0) {
            ballsToMove[i].position.set(mySpots[i].ballX+totalMoved, mySpots[i].ballY+totalMoved, 0);
        // < < >
        } else if ( mySpots[i].ballX < 0 && mySpots[i].ballY < 0 && mySpots[i].ballZ > 0) {
            ballsToMove[i].position.set(mySpots[i].ballX+totalMoved, mySpots[i].ballY+totalMoved, mySpots[i].ballZ-totalMoved);
        // < 0 <
        } else if ( mySpots[i].ballX < 0 && mySpots[i].ballY === 0 && mySpots[i].ballZ < 0) {
            ballsToMove[i].position.set(mySpots[i].ballX+totalMoved, 0, mySpots[i].ballZ+totalMoved);        
        // < 0 0
        } else if ( mySpots[i].ballX < 0 && mySpots[i].ballY === 0 && mySpots[i].ballZ === 0){
            ballsToMove[i].position.set(mySpots[i].ballX+totalMoved, 0, 0);
        // < 0 >
        } else if ( mySpots[i].ballX < 0 && mySpots[i].ballY === 0 && mySpots[i].ballZ > 0) {
            ballsToMove[i].position.set(mySpots[i].ballX+totalMoved, 0, mySpots[i].ballZ-totalMoved);
        // < > <
        } else if ( mySpots[i].ballX < 0 && mySpots[i].ballY > 0 && mySpots[i].ballZ < 0) {
            ballsToMove[i].position.set(mySpots[i].ballX+totalMoved, mySpots[i].ballY-totalMoved, mySpots[i].ballZ+totalMoved);
        // < > 0
        } else if ( mySpots[i].ballX < 0 && mySpots[i].ballY > 0 && mySpots[i].ballZ === 0) {
            ballsToMove[i].position.set(mySpots[i].ballX+totalMoved, mySpots[i].ballY-totalMoved, 0);

        // 0 < <
        } else if ( mySpots[i].ballX === 0 && mySpots[i].ballY < 0 && mySpots[i].ballZ < 0) {
            ballsToMove[i].position.set(0, mySpots[i].ballY+totalMoved, mySpots[i].ballZ+totalMoved);
        // 0 < 0
        } else if ( mySpots[i].ballX === 0 && mySpots[i].ballY < 0 && mySpots[i].ballZ === 0) {
            ballsToMove[i].position.set(0, mySpots[i].ballY+totalMoved, 0);
        // 0 < >
        } else if ( mySpots[i].ballX === 0 && mySpots[i].ballY < 0 && mySpots[i].ballZ > 0) {
            ballsToMove[i].position.set(0, mySpots[i].ballY+totalMoved, mySpots[i].ballZ-totalMoved);
        // 0 0 <
        } else if ( mySpots[i].ballX === 0 && mySpots[i].ballY === 0 && mySpots[i].ballZ < 0) {
            ballsToMove[i].position.set(0, 0, mySpots[i].ballZ+totalMoved);
        // 0 0 0 *************** error?
        } else if ( mySpots[i].ballX === 0 && mySpots[i].ballY === 0 && mySpots[i].ballZ === 0) {
            console.log('ball is at 0,0,0. ballsToMove[i] is', ballsToMove[i]);
        // 0 0 >
        } else if ( mySpots[i].ballX === 0 && mySpots[i].ballY === 0 && mySpots[i].ballZ > 0) {
            ballsToMove[i].position.set(0, 0, mySpots[i].ballZ-totalMoved);
        // 0 > <
        } else if ( mySpots[i].ballX === 0 && mySpots[i].ballY > 0 && mySpots[i].ballZ < 0) {
            ballsToMove[i].position.set(0, mySpots[i].ballY-totalMoved, mySpots[i].ballZ+totalMoved);
        // 0 > 0
        } else if ( mySpots[i].ballX === 0 && mySpots[i].ballY > 0 && mySpots[i].ballZ === 0) {
            ballsToMove[i].position.set(0, mySpots[i].ballY-totalMoved, 0);
        // 0 > >
        } else if ( mySpots[i].ballX === 0 && mySpots[i].ballY > 0 && mySpots[i].ballZ > 0) {
            ballsToMove[i].position.set(0, mySpots[i].ballY-totalMoved, mySpots[i].ballZ-totalMoved);

        // > < <
        } else if ( mySpots[i].ballX > 0 && mySpots[i].ballY < 0 && mySpots[i].ballZ < 0) {
            ballsToMove[i].position.set(mySpots[i].ballX-totalMoved, mySpots[i].ballY+totalMoved, mySpots[i].ballZ+totalMoved);
        // > < 0
        } else if ( mySpots[i].ballX > 0 && mySpots[i].ballY < 0 && mySpots[i].ballZ === 0) {
            ballsToMove[i].position.set(mySpots[i].ballX-totalMoved, mySpots[i].ballY+totalMoved, 0);
        // > < >
        } else if ( mySpots[i].ballX > 0 && mySpots[i].ballY < 0 && mySpots[i].ballZ > 0) {
            ballsToMove[i].position.set(mySpots[i].ballX-totalMoved, mySpots[i].ballY+totalMoved, mySpots[i].ballZ-totalMoved);
        // > 0 <
        } else if ( mySpots[i].ballX > 0 && mySpots[i].ballY === 0 && mySpots[i].ballZ < 0) {
            ballsToMove[i].position.set(mySpots[i].ballX-totalMoved, 0, mySpots[i].ballZ+totalMoved);
        // > 0 0
        } else if ( mySpots[i].ballX > 0 && mySpots[i].ballY === 0 && mySpots[i].ballZ === 0){
            ballsToMove[i].position.set(mySpots[i].ballX-totalMoved, 0, 0);
        // > 0 >
        } else if ( mySpots[i].ballX > 0 && mySpots[i].ballY === 0 && mySpots[i].ballZ > 0) {
            ballsToMove[i].position.set(mySpots[i].ballX-totalMoved, 0, mySpots[i].ballZ-totalMoved);
        // > > <
        } else if ( mySpots[i].ballX > 0 && mySpots[i].ballY > 0 && mySpots[i].ballZ < 0) {
            ballsToMove[i].position.set(mySpots[i].ballX-totalMoved, mySpots[i].ballY-totalMoved, mySpots[i].ballZ+totalMoved);
        // > > 0
        } else if ( mySpots[i].ballX > 0 && mySpots[i].ballY > 0 && mySpots[i].ballZ === 0) {
            ballsToMove[i].position.set(mySpots[i].ballX-totalMoved, mySpots[i].ballY-totalMoved, 0);
        // > > >
        } else if ( mySpots[i].ballX > 0 && mySpots[i].ballY > 0 && mySpots[i].ballZ > 0){
            ballsToMove[i].position.set(mySpots[i].ballX-totalMoved, mySpots[i].ballY-totalMoved, mySpots[i].ballZ-totalMoved);
        }
        
        // console.log('this is redBall.position', redBall.position);
    //     render();
        if(totalMoved >= 2.5){
            stop = true;
        }
    }
}

//     console.log('this is totalMoved below', totalMoved);
//     console.log('this is redBall.position below', redBall.position);
//     console.log('this is stop below', stop);    


// var distanceBetween = redBall.position.distanceTo(greenBall.position);
// console.log('this is distanceBetween', distanceBetween);





// Render the Scene
function render() {
    requestAnimationFrame( render );
	renderer.render( scene, camera );
    controls.update();
}
render();