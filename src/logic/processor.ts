import { Lecture, Operator, Resource, Rule, Statement } from "./types";

export function processData(data: Array<Lecture>, rules: Array<Rule>) {
	let i = rules.length;
	for (const rule of rules) {
		for (const d of data) {
			rule.priority = i;
			processStatement(d, rule);
		}
		i--;
	}

	for (const d of data) {
		d.runtime = {};
	}
}

export function processStatement(data: Lecture, stmt?: Statement): any {
	if (!stmt) return;
	if (Array.isArray(stmt)) return stmt.map((x) => processStatement(data, x));
	if (["number", "string", "boolean", "bigint", "symbol"].includes(typeof stmt)) return stmt;

	const rule = stmt as Rule;
	const result = processInput(data, rule);
	const action = rule.action as Rule;
	if (!action) return result;

	switch (action.operation) {
		case Operator.SET:
			data.runtime[action.action as string] = processStatement(data, action.input);
			return 0;
		case Operator.PRIORITY:
			if (!rule.priority) return 0;
			if (result) return rule.priority;
			return rule.priority * -1;
		default:
			throw new Error(`Only SET and PRIORITY operator is supported (${Operator[rule.operation]})`);
	}
}

function processInput(data: Lecture, rule: Rule): boolean | any[] | any {
	const eva = processStatement.bind(null, data);
	const input = asArray<Statement>(eva(rule.input));

	const comparison = eva(input[0]);

	switch (rule.operation) {
		case Operator.GET:
			return data.runtime?.[rule.input as string] || data.properties?.[rule.input as string];
		case Operator.EQUALS:
			// eslint-disable-next-line eqeqeq
			return input.every((x) => eva(x) == comparison);
		case Operator.GREATER_EQUALS_THAN:
			return input.every((x) => eva(x) >= comparison);
		case Operator.GREATER_THAN:
			return input.every((x) => eva(x) > comparison);
		case Operator.CONTAINS:
			return input.every((x) => `${eva(x)}`.includes(comparison));
		case Operator.STARTS_WITH:
			return input.every((x) => `${eva(x)}`.startsWith(comparison));
		case Operator.ENDS_WITH:
			return input.every((x) => `${eva(x)}`.endsWith(comparison));
		case Operator.LESS_EQUALS_THAN:
			return input.every((x) => eva(x) <= comparison);
		case Operator.LESS_THAN:
			return input.every((x) => eva(x) < comparison);
		case Operator.AND:
			return input.every((x) => eva(x));
		case Operator.NOT:
			return input.map((x) => !eva(x));
		case Operator.OR:
			return input.some((x) => eva(x));
		case Operator.FILTER:
			return input.filter((x) => eva(x));
		case Operator.FIND:
			return input.find((x) => eva(x));
		case Operator.ADD:
			// @ts-ignore
			return input.reduce((total, val) => total + (eva(val) || 0), comparison || 0);
		default:
			throw new Error(`Unkown operator ${Operator[rule.operation]}`);
	}
}

function asArray<T>(val: T | T[]): T[] {
	if (Array.isArray(val)) return val;
	return [val];
}
