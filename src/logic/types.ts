// require("assemblyscript/std/portable");
// The entry file of your WebAssembly module.

export enum Operator {
	// LOGICAL:
	EQUALS,
	NOT,
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
export type Literal2 = {
	number: number;
	string: string;
	symbol: symbol;
	boolean: boolean;
	bigint: bigint;
};

export type Statement = Rule | Literal | Statement[];
export type Statement2 = {
	rule: Rule;
	literal: Literal;
	statements: Statement2[];
};

export type Rule = {
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
	constraints: Constraints;
	userDefinedProperties?: any;
}

export interface Constraints {
	subjects?: Resource[];
	rooms?: Resource[];
	classes?: Resource[];
	times?: Time[];
}

export interface Time {
	description?: string;
	from: Date;
	till: Date;
}
