import { id, Lecture, Operator, Resource, Rule } from "./types";
import { processData } from "./processor";

const rooms = new Map<id, Resource>();
([{ id: "1", userDefinedProperties: { size: 10 } }] as Resource[]).forEach((x) => {
	rooms.set(x.id, x);
});

const persons = new Map<id, Resource>();
([{ id: "samuel scheit" }] as Resource[]).forEach((x) => {
	persons.set(x.id, x);
});

const subjects = new Map<id, Resource>();
([{ id: "mathe", constraints: { rooms: [rooms.get("1")] } }] as Resource[]).forEach((x) => {
	subjects.set(x.id, x);
});

const lectures = new Map<id, Lecture>();
([{ id: "0" }] as Lecture[]).forEach((x) => {
	lectures.set(x.id, x);
});

const rules: Rule[] = [
	{
		operation: Operator.FILTER,
		input: {
			operation: Operator.EQUALS,
			input: [
				true,
				{
					operation: Operator.GET,
					input: "occupied",
				},
			],
		},
		action: {
			operation: Operator.SET,
			input: {
				operation: Operator.ADD,
				input: [
					{
						operation: Operator.GET,
						input: "hoursPerDay",
					},
					1,
				],
			},
			action: "hoursPerDay",
		},
	},
	{
		operation: Operator.GREATER_THAN,
		input: [
			8,
			{
				operation: Operator.GET,
				input: "hoursPerDay",
			},
		],
		action: { operation: Operator.PRIORITY },
	},
];

processData(Array.from(lectures.values()), rules);

console.log(JSON.stringify(lectures.values()));
