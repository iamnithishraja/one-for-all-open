"use client";
import { useState } from "react";

import prismaClient from "@repo/db/client";

export default function Dropdown({ items, type, userDB }) {
	console.log(items);

	return (
		<select
			onChange={(e) => {
				console.log(e.target.value);
			}}
			className="mx-auto"
		>
			<option>Select {type}</option>
			{items.map((item: any) => (
				<option value={item} key={item.id}>
					{item.name}
				</option>
			))}
		</select>
	);
}
