// require("assemblyscript/std/portable");
// The entry file of your WebAssembly module.

enum Operator {
	// LOGICAL:
	EQUALS,
	NOT,
	GREATER_THAN,
	GREATER_EQUALS_THAN,
	LESS_THAN,
	LESS_EQUALS_THAN,
	AND,
	OR,
	XOR,
	XAND,
	// SELECTION
	GET,
	FILTER,
	FIND,
	// CONTAINS,
	// MATH:
	SET,
	ADD,
	SUBTRACT,
	DIVIDE,
	MODULO,
	SQUARE_ROOT,
}

type Literal = number | string | symbol;

type Statement = Rule | Literal | Statement[];

type Rule = {
	operation: Operator;
	input: Statement;
	// default action: if rule passes add to performance, if not subtract it
	action?: Statement;
	priority?: number;
};

const rule: Statement = {
	operation: Operator.ADD,
	input: {
		operation: Operator.GET,
		input: 2,
	},
	action: [],
	priority: 1,
};

type Lecture = Resource;

interface Resource {
	id: string;
	items: this[];
	room: Room[];
	class: Person[];
	subject: Subject[];
	times: Time[];
	userDefinedProperties: any;
}

interface Time {
	description?: string;
	from: Date;
	till: Date;
}

interface Room extends Resource {
	size: number;
	constraints: {
		class: Person[];
		subject: Subject[];
	};
}

interface Person extends Resource {
	// use id for name identifier
	type: PersonType | number;
	constraints: {
		subjects: Subject[];
		room: Room[];
		class: Person[];
	};
}

enum PersonType {
	Lecturer = 0,
	Student = 1,
}

interface Subject extends Resource {
	constraints: {
		room: Room[];
		class: Person[];
	};
}
