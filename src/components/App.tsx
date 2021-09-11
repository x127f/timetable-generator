import { CircularProgress, Container } from "@material-ui/core";
import { Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "../pages/Home";
import Rules from "../pages/Rules";

export default function App() {
	return (
		<Container maxWidth="md">
			<Suspense
				fallback={
					<div
						style={{
							display: "flex",
							width: "100%",
							height: "100%",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<CircularProgress />
					</div>
				}
			>
				<Router>
					<Switch>
						<Route path="/" component={Rules}></Route>
					</Switch>
				</Router>
			</Suspense>
		</Container>
	);
}
