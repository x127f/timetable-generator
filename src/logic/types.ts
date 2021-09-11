/*
* Properties
Subject
Room
Time
Person


Presets:
person type (teacher, pupil)
work hours per week/day
teacher/pupil previous lecture.room.id == lecture.room.id

*/

export enum Operator {
	EQUALS,
	NOT,
	STARTS_WITH,
	ENDS_WITH,
	CONTAINS,
	GREATER_THAN,
	GREATER_EQUALS_THAN,
	LESS_THAN,
	LESS_EQUALS_THAN,
	AND,
	OR,
	ADD,
	FILTER,
	FIND,
	GET,
	SET,
	PRIORITY,
}

export type Literal = number | string | symbol | boolean | bigint;
export type Statement = Rule | Literal | Statement[];

export type Rule = {
	id?: string | number;
	description?: string;
	operation: Operator;
	input?: Statement;
	// default action: if rule passes add to performance, if not subtract it
	action?: Statement;
	priority?: number;
};

export type Lecture = Omit<Resource, "constraints">;
export type id = string;

export interface Resource extends Constraints {
	id: id;
	description?: string;
	constraints: Constraints;
	properties?: any;
	runtime?: any;
}

export interface Constraints {
	subjects?: Resource[];
	rooms?: Resource[];
	classes?: Resource[];
	times?: Time[];
}

export interface Time {
	id?: string;
	from: Date | number;
	to: Date | number;
	repeat: number; // number of days it should repeat: e.g. 1 = every day, 7 = every week, 28 = one week
}
