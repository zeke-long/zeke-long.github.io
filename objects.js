class elevator {
	constructor(name) {
		this.elev_name = name;
		this.x = elevator_width*this.elev_name + (this.elev_name+1)*horiz_buffer;
		this.y = ground_floor;
		this.dest_floor = Math.floor(random(0,floor_count));
		this.curr_floor = 0;
		this.passenger_num = 0;
		this.open = false;
		this.open_time = 0;
		this.has_job = false;
	}

	step() {
		if(this.open){
			if (this.open_time < 3){
				this.open_time++;
			}
			if (this.open_time >= 3){
				this.open_time = 0;
				this.open = false;
			}
			
		}
		else if(this.dest_floor < this.curr_floor){
			this.down_floor();
		}
		else if(this.dest_floor > this.curr_floor){
			this.up_floor();
		}
		else if(this.dest_floor == this.curr_floor){
			this.open_doors();
		}
	}

	up_floor(){
		this.y -= elevator_height;
		this.curr_floor +=1;
	}
	down_floor(){
		this.y += elevator_height;
		this.curr_floor -=1;
	}
	open_doors(){
		this.open = true;
		this.dest_floor = Math.floor(random(0,floor_count))
	}	
	reset(){
		this.y = ground_floor;
		this.curr_floor = 0;
		this.dest_floor = Math.floor(random(0,floor_count))
	}

	display() {
		fill(0,0,80);
		if (this.open){
			fill(80,80,0);
		}
		rect(this.x, this.y, elevator_width, elevator_height);
		text(this.curr_floor, this.x, this.y);
		text(this.dest_floor, this.x+elevator_width-horiz_buffer, this.y);
	}
}

class person {
	constructor(name, start_floor, dest_floor, in_line) {
		this.person_name = name
		this.curr_floor = start_floor;
		this.dest_floor = dest_floor;
		this.in_danger = 0;
		this.elevator = null;
		this.diameter = 10;
		this.x = elevator_count*(elevator_width+2*horiz_buffer) + in_line*(2*this.diameter + 1.5*horiz_buffer);
		this.y = ground_floor - (this.curr_floor*elevator_height) + elevator_height/2;
		this.speed = 40;
	}

	step() {
	}

	display() {
		fill(0,60,60)
	    ellipse(this.x, this.y, 30,30);
	    fill(255,255,255)
	    text(this.dest_floor, this.x - 3, this.y+2)
	}
}

class floor{
	constructor(i){
		this.floor_num = i;
		this.people = [];
		this.floor_height = ground_floor - i*elevator_height;
		this.elevators = [];
	}

	add_person_to_floor(person){
		this.people.push(person);
	}

	display(){
		line(0, this.floor_height, canvas_width, this.floor_height);
		line(0, this.floor_height+elevator_height, canvas_width, this.floor_height+elevator_height);
	}
	clear_floor(){
		this.people = [];
	}
}