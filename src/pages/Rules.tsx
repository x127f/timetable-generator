import {
	Box,
	Button,
	ButtonGroup,
	InputLabel,
	Dialog,
	MenuItem,
	Select,
	Typography,
	DialogTitle,
	DialogContent,
	DialogContentText,
	TextField,
	DialogActions,
	IconButton,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import QueueIcon from "@material-ui/icons/Queue";
import { ReactNode, useState } from "react";
import { Operator, Rule, Statement } from "../logic/types";
import "./rules.scss";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Store } from "../components/Store";
import NoteIcon from "@material-ui/icons/Note";
import useForceUpdate from "../util/useForceUpdate";
import DeleteIcon from "@material-ui/icons/Delete";

export default function Rules() {
	const rules = Store.use((s) => s.rules) as Rule[];
	console.log(rules);
	// @ts-ignore
	globalThis.rules = rules;

	function onDragEnd(result: any) {
		const { destination, source } = result;

		if (!destination) return;
		if (destination.droppableId == source.droppableId && destination.index == source.index) return;

		rules.splice(source.index, 1);
		rules.splice(destination.index, 0, rules[source.index]);
	}

	function getStyle(style: any = {}) {
		return {
			...style,
			transform: style.transform
				? "translate(0px" + style.transform.slice(style.transform.indexOf(","), style.transform.length)
				: "",
			top: (style.top as number) - 17 || 0,
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
											{RenderStatement(item, rules)}
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
				<Button onClick={() => rules.push({ operation: Operator.AND })} startIcon={<AddIcon />}>
					Add Rule
				</Button>
				<Button startIcon={<QueueIcon />}>Add Group</Button>
				<Button startIcon={<NoteIcon />}>Preset</Button>
			</ButtonGroup>
		</Box>
	);
}

// @ts-ignore
globalThis.Operator = Operator;

export function RenderStatement(stmt?: Statement, parent?: Statement[]): ReactNode {
	const rules = Store.use((s) => s.rules) as Rule[];
	const properties = Store.use((s) => s.properties) as string[];
	const forceUpdate = useForceUpdate();
	const [isDialogOpen, toggleDialog] = useState(false);
	const [propertyName, setPropertyName] = useState("");

	if (!stmt) return <></>;
	if (Array.isArray(stmt)) return stmt.map((x) => RenderStatement(x, stmt));
	if (["number", "string", "boolean", "bigint", "symbol"].includes(typeof stmt)) return <>{stmt}</>;

	const rule = stmt as Rule;
	const operation = Operator[rule.operation];
	const AND = rule.operation === Operator.AND;
	const GET = rule.operation === Operator.GET;
	const OR = rule.operation === Operator.OR;

	const DeleteButton = () => (
		<IconButton
			onClick={() => {
				if (parent) {
					parent.splice(
						parent.findIndex((x) => x === stmt),
						1
					);
				}
			}}
			style={{ marginLeft: "auto" }}
		>
			<DeleteIcon />
		</IconButton>
	);

	const content = (
		<Box className="content">
			{RenderStatement(rule.input)}
			{RenderStatement(rule.action)}
		</Box>
	);

	if (AND || OR) {
		return (
			<Box className={"group rule " + operation}>
				<Typography variant="overline" component="span" style={{ display: "flex" }}>
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
						{AND && "Bedingungen sind erfüllt"}
						{OR && "Bedingung ist erfüllt"}
					</span>
					<DeleteButton />
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
						value={rule.input}
						onChange={(e) => {
							if (!e.target.value) return;
							console.log("property", e.target.value, e);
							rule.input = e.target.value as string;
							forceUpdate();
						}}
					>
						{properties.map((x: any) => (
							<MenuItem value={x}>{x}</MenuItem>
						))}

						<MenuItem value="">
							<Button onClick={() => toggleDialog(true)} color="primary" variant="contained">
								Eigenschaft hinzufügen
							</Button>
						</MenuItem>
					</Select>
					<Dialog open={isDialogOpen} onClose={() => toggleDialog(false)}>
						<DialogTitle>Eigenschaft hinzufügen</DialogTitle>
						<DialogContent>
							<DialogContentText>Gib der Eigenschaft einen Namen:</DialogContentText>
							<TextField
								onChange={(e) => setPropertyName(e.target.value)}
								placeholder="z.B. wochenstunden"
								autoFocus
								label="Eigenschaft Name"
								type="text"
								fullWidth
								InputLabelProps={{
									shrink: true,
								}}
							/>
						</DialogContent>
						<DialogActions>
							<Button onClick={() => toggleDialog(false)} color="primary">
								Abbrechen
							</Button>
							<Button
								variant="contained"
								onClick={() => {
									rule.input = propertyName;
									properties.push(propertyName);
									toggleDialog(false);
									forceUpdate();
								}}
								color="primary"
							>
								Hinzufügen
							</Button>
						</DialogActions>
					</Dialog>
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
				<DeleteButton />
			</div>
			{content}
		</Box>
	);
}
