// The entry file of your WebAssembly module.

export function add(a: i32, b: i32): i32 {
	return a + b;
}

interface Lecture {
	room: Room;
	lecturer: Lecturer[];
	class: Student[];
	subject: Subject;
}

interface Resource {
	id: string;
	items: this[];
	userDefinedProperties: any;
}

interface Room extends Resource {
	size: number;
}

interface Person extends Resource {
	// use id for name identifier
}

interface Lecturer extends Person {}
interface Student extends Person {}

interface Subject extends Resource {}
