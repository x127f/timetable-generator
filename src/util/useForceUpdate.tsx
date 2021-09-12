import { useState } from "react";

export default function useForceUpdate() {
	var [, setTick] = useState(0);

	return () => {
		setTick((tick) => tick + 1);
	};
}
