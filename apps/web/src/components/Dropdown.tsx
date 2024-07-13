"use client";

import prismaClient from "@repo/db/client";

export default function Dropdown({ items, type }) {
	console.log(items);

	return (
		<select onChange={() => {}} className="mx-auto">
			<option>Select {type}</option>
			{items.map((items: any) => (
				<option>{items.name}</option>
			))}
		</select>
	);
}
