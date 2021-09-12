/* eslint-disable react-hooks/rules-of-hooks */
import EventEmitter from "events";
import React, { useContext, useEffect } from "react";
import { Rule } from "../logic/types";
import useForceUpdate from "../util/useForceUpdate";
import { debounce } from "../util/useTimeout";

export interface StoreData {
	properties: string[];
	rules: Rule[];
}

const Cache = new Map();

const excludedFunctions = ["forEach", "map", "at", "every", "filter", "findIndex", "find"];

class StoreClass extends EventEmitter {
	value!: StoreData;

	constructor() {
		super();
		this.init();
		this.save = debounce(this.save, 300);
	}

	init() {
		try {
			console.log("json parse");
			const data = localStorage.getItem("store");
			if (!data) throw new Error("store data not saved");
			this.value = JSON.parse(data);
		} catch (error) {
			this.value = { properties: [], rules: [] };
		}
	}

	getValue(obj?: any) {
		if (!obj) obj = this.value;
		if (Cache.has(obj)) return Cache.get(obj);

		console.log({ obj });

		const self = this;
		const proxy: any = new Proxy(obj, {
			get: (target, prop, receiver) => {
				const result = Reflect.get(target, prop, receiver);
				if (typeof result === "function" && !excludedFunctions.includes(prop as string)) {
					// also proxy function calls that modify the object: e.g. array.push
					return function (this: any, ...props: any[]) {
						const res = result.apply(this, props);
						self.emit("update");
						return res;
					};
				} else if (typeof result === "object") {
					return this.getValue(result);
				}
				return result;
			},
			set(obj, prop, value) {
				const result = Reflect.set(obj, prop, value);
				self.emit("update");
				return result;
			},
		});
		Cache.set(obj, proxy);
		return proxy;
	}

	use<T = StoreData>(filter?: (s: StoreData) => T) {
		const value = this.getValue();
		const forceUpdate = useForceUpdate();
		useEffect(() => {
			function onUpdate() {
				forceUpdate();
			}
			this.addListener("update", onUpdate);
			this.setMaxListeners(this.listenerCount("update") + 1);

			return () => {
				this.setMaxListeners(this.listenerCount("update") - 1);
				this.removeListener("update", onUpdate);
			};
		}, []);

		if (filter) return filter(value);
		return value;
	}

	save() {
		localStorage.setItem("store", JSON.stringify(this.value));
	}
}

export const Store = new StoreClass();
