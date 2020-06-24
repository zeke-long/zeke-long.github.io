let horiz_buffer = 10;
let vert_buffer = 10;
let elevator_height = 50;
let elevator_width = 30;
let canvas_height = 500;
let canvas_width = 800;
let ground_floor = canvas_height - elevator_height - 20;


let elev_dict = {};
let floor_dict = {};
let people_dict = {};
let job_dict = {};
let elev_pos = [];
let draw_func = true;
let floor_count = 4;
let elevator_count = 4;
let max_elevator = 12;
let max_floor = 8;
let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var itr = 1;



function setup(){	
	createCanvas(canvas_width, canvas_height);
	background(140);
	frameRate(1);
	
	elevSlider = createSlider(2, max_elevator, 4);
	elevSlider.position(20, 20);
	floorSlider = createSlider(2, max_floor, 4);
	floorSlider.position(20, 40);
	peopleSlider = createSlider(0, 100, 5);
	peopleSlider.position(20, 60);

	for (var i = 0; i < elevSlider.value(); i++) {
		add_elevator();
	}
	for (var i = 0; i < floorSlider.value(); i++) {
		add_floor();
	}
}

function draw(){
	fill(150, 0, 0);
  	ellipse(canvas_width - 25, 25, 25, 25);
 	frameRate(10);
	if (draw_func){
		main_draw();
	}
}

function mousePressed(){
	let d = dist(mouseX, mouseY, canvas_width - 25, 25);
	if (d<25){
		draw_func ^= true;
	}
}

function main_draw(){
	frame_rate = 30;
	frameRate(frame_rate);
	background(140);
	fill(0, 150, 0);
  	ellipse(canvas_width - 25, 25, 25, 25)
  	fill(0, 0, 0);


	elevator_count = elevSlider.value();
	floor_count = floorSlider.value();
	var people_percent = peopleSlider.value();

	text('Number of Elevators: ' + elevator_count, elevSlider.x * 2 + elevSlider.width, 27);
	text('Number of Floors: ' + floor_count, floorSlider.x * 2 + floorSlider.width, 47);
	text('People Percent: ' + people_percent + "%", peopleSlider.x * 2 + peopleSlider.width, 67);
	
	resolve_sliders();
	display();
	get_situation();
	assign_jobs();
	
	if (itr%(frame_rate*3) == 0){
		itr = 1;
		run_steps(people_percent);
	}
	itr ++
}

function display(){
	for (var i in elev_dict){
		elev_dict[i].display();
	}
	for (var i in floor_dict){
		floor_dict[i].display();
	}
	for(var i in people_dict){
		people_dict[i].display();
	}
}

function run_steps(people_percent){
	for (var i in elev_dict){
		elev_dict[i].step()
	}
	if (Math.floor(random(0,100))<=people_percent){
		add_person();
	}
}

function resolve_sliders(){
	if(elevator_count > Object.keys(elev_dict).length){
		add_elevator();
		people_dict = {};
		for(var i in floor_dict){
			floor_dict[i].clear_floor();
		}
	}
	if(elevator_count < Object.keys(elev_dict).length){
		remove_elevator();
		people_dict = {};
		for(var i in floor_dict){
			floor_dict[i].clear_floor();
		}
	}

	if(floor_count > Object.keys(floor_dict).length){
		add_floor();
	}
	if(floor_count < Object.keys(floor_dict).length){
		remove_floor();
	}
}

function get_situation(){
	for(var person in people_dict){
		var this_person = people_dict[person]
		var job = [this_person.curr_floor, this_person.dest_floor]
		if (!(this_person.person_name in job_dict)){
			job_dict[this_person.person_name] = job
		}

	}
}

function assign_jobs(){
	for(var person in job_dict){
		for(var elevator_number in elev_dict){
			//Bare Minimum to Take Job
			if (!(elev_dict[elevator_number].has_job) && elev_dict[elevator_number].passenger_num < 2){
				// On same Floor
				if (elev_dict[elevator_number].curr_floor == job_dict[person][0]){
					elev_dict[elevator_number].dest_floor = job_dict[person][1];
					elev_dict[elevator_number].passenger_num += 1;
				}
			}
		}
	}
}






////////// HELPERS ///////////////






function add_elevator(){
	var g = 0;
	while(g in elev_dict){
		g++;
	}
	elev_dict[g] = new elevator(g);
}

function remove_elevator(){
	for (var i = elevator_count; i <= max_elevator; i++){
		if(i in elev_dict) {
   			delete elev_dict[i];
    	}

	}
}

function reset_elevators(){
	for (var i in elev_dict){
		elev_dict[i].reset();
	}
}

function add_floor(){
	var g = 0;
	while(g in floor_dict){
		g++;
	}
	floor_dict[g] = new floor(g);
}

function remove_floor(){
	for (var i = floor_count; i <= max_floor; i++){
		if(i in floor_dict) {
   			delete floor_dict[i];
   			reset_elevators();
    	}

	}
}

function add_person(){
	start_floor = Math.floor(random(0,floor_count));
	dest_floor = Math.floor(random(0,floor_count));
	in_line = floor_dict[start_floor].people.length;
	
	var g = 0;
	while(g in people_dict){
		g++;
	}

	additional_person = new person(g, start_floor, dest_floor, in_line);
	people_dict[g] = additional_person;
	floor_dict[start_floor].add_person_to_floor(additional_person);
}