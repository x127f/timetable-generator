import { Box, Button, ButtonGroup, Input, InputLabel, ListItem, MenuItem, Select, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import QueueIcon from "@material-ui/icons/Queue";
import { ReactNode, useState } from "react";
import { Operator, Rule, Statement } from "../logic/types";
import "./rules.scss";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function Rules() {
	const [rules, setRules] = useState<Rule[]>([
		{ operation: Operator.AND, input: [{ operation: Operator.GET, input: "test" }] },
		{ operation: Operator.OR, input: [{ operation: Operator.GET, input: "test" }] },
	]);

	function onDragEnd(result: any) {
		const { destination, source } = result;

		if (!destination) return;
		if (destination.droppableId == source.droppableId && destination.index == source.index) return;

		const r = [...rules];
		r.splice(source.index, 1);
		r.splice(destination.index, 0, rules[source.index]);

		setRules(r);
	}

	function getStyle(style: any = {}) {
		return {
			...style,
			transform: style.transform
				? "translate(0px" + style.transform.slice(style.transform.indexOf(","), style.transform.length)
				: "",
			top: (style.top as number) - 17,
		};
	}

	return (
		<Box className="rules glass">
			<Typography variant="h5" gutterBottom>
				Rules
			</Typography>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="droppable" direction="vertical">
					{(provided: any, snapshot: any) => (
						<div
							{...provided.droppableProps}
							style={getStyle(provided.droppableProps.style)}
							ref={provided.innerRef}
							className="list"
						>
							{rules.map((item, index) => (
								<Draggable key={index} draggableId={`${index}`} index={index}>
									{(provided: any, snapshot: any) => (
										<div
											className="entry"
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											style={getStyle(provided.draggableProps.style)}
										>
											<div className="counter">
												<span className="index">{index + 1}</span>
											</div>
											{RenderStatement(item)}
										</div>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
			<ButtonGroup variant="contained" color="primary" className="addRule">
				<Button startIcon={<AddIcon />}>Add Rule</Button>
				<Button startIcon={<QueueIcon />}>Add Group</Button>
			</ButtonGroup>
		</Box>
	);
}

// @ts-ignore
globalThis.Operator = Operator;

export function useForceUpdate() {
	var [, setTick] = useState(0);
	return () => {
		setTick((tick) => tick + 1);
	};
}

export function RenderStatement(stmt?: Statement): ReactNode {
	const forceUpdate = useForceUpdate();

	if (!stmt) return <></>;
	if (Array.isArray(stmt)) return stmt.map(RenderStatement);
	if (["number", "string", "boolean", "bigint", "symbol"].includes(typeof stmt)) return <>{stmt}</>;

	const rule = stmt as Rule;
	const operation = Operator[rule.operation];
	const AND = rule.operation === Operator.AND;
	const GET = rule.operation === Operator.GET;
	const OR = rule.operation === Operator.OR;

	const content = (
		<Box className="content">
			{RenderStatement(rule.input)}
			{RenderStatement(rule.action)}
		</Box>
	);

	if (AND || OR) {
		return (
			<Box className={"group rule " + operation}>
				<Typography variant="overline" component="span">
					<Select
						className="type"
						value={rule.operation}
						onChange={(e) => {
							rule.operation = Number(e.target.value) as Operator;
							forceUpdate();
						}}
					>
						<MenuItem value={Operator.AND}>Alle</MenuItem>
						<MenuItem value={Operator.OR}>Mindestens eine</MenuItem>
					</Select>
					<span style={{ fontSize: "1rem", paddingLeft: "0.5rem" }}>
						{AND && "Regeln sind erfüllt"}
						{OR && "Regel ist erfüllt"}
					</span>
				</Typography>
				{content}
			</Box>
		);
	}

	if (GET) {
		return (
			<Box className={"rule " + operation}>
				<div>
					<InputLabel>Eigenschaft</InputLabel>
					<Select
						open={true}
						value={rule.input}
						onChange={(e) => {
							console.log("property", e.target.value);
							rule.input = e.target.value as string;
							forceUpdate();
						}}
					>
						<MenuItem value="test">test</MenuItem>
						<MenuItem>
							<Button color="primary" variant="contained">
								Eigenschaft hinzufügen
							</Button>
						</MenuItem>
					</Select>
				</div>
			</Box>
		);
	}

	return (
		<Box className={"rule " + operation}>
			<div>
				<InputLabel>Operation</InputLabel>
				<Select
					value={rule.operation}
					onChange={(e) => {
						rule.operation = Number(e.target.value) as Operator;
						forceUpdate();
					}}
				>
					<MenuItem value={Operator.GET}>Eigenschaft</MenuItem>
					<MenuItem value={Operator.SET}>Setzen</MenuItem>
					<MenuItem value={Operator.EQUALS}>Ist Gleich</MenuItem>
					<MenuItem value={Operator.NOT}>Ist Nicht</MenuItem>
					<MenuItem value={Operator.GREATER_THAN}>&gt;</MenuItem>
					<MenuItem value={Operator.GREATER_EQUALS_THAN}>&gt;=</MenuItem>
					<MenuItem value={Operator.LESS_THAN}>&lt;</MenuItem>
					<MenuItem value={Operator.LESS_EQUALS_THAN}>&lt;=</MenuItem>
					<MenuItem value={Operator.NOT}>Startet mit</MenuItem>
					<MenuItem value={Operator.NOT}>Endet mit</MenuItem>
					<MenuItem value={Operator.NOT}>Enthält</MenuItem>
					<MenuItem value={Operator.ADD}>Addieren</MenuItem>
					<MenuItem value={Operator.FILTER}>Filtern</MenuItem>
					<MenuItem value={Operator.FIND}>Finden</MenuItem>
				</Select>
			</div>
			{content}
		</Box>
	);
}
