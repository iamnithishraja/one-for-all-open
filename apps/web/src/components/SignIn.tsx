"use client";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "../../@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../@/components/ui/card";
import { Input } from "../../@/components/ui/input";
import { Label } from "../../@/components/ui/label";

const Signin = () => {
	const session = useSession();
	const router = useRouter();
	const redirected = useRef(false);
	useEffect(() => {
		if (redirected.current === false && session.data?.user) {
			const redirectUrl = localStorage.getItem("loginRedirectUrl");
			localStorage.removeItem("loginRedirectUrl");
			router.replace(redirectUrl || "/");
			redirected.current = true;
		}
	}, [redirected, session, router]);

	return (
		<div className="flex justify-center items-center min-h-screen">  
			<Card className="mx-auto max-w-sm p-4">
				<CardHeader>
					<CardTitle className="text-xl">Sign in</CardTitle>
					<CardDescription>
						Enter your information to create an account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="first-name">First name</Label>
								<Input id="first-name" placeholder="Max" required />
							</div>
							<div className="grid gap-2">
								<Label htmlFor="last-name">Last name</Label>
								<Input
									id="last-name"
									placeholder="Robinson"
									required
								/>
							</div>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="m@example.com"
								required
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password">Password</Label>
							<Input id="password" type="password" />
						</div>
						<Button
							type="submit"
							className="w-full"
							onClick={async () => {
								await signIn("credentials", {
									name: "string",
									email: "string",
									password: "string",
								});
							}}
						>
							Sign in
						</Button>
						<Button
							variant="outline"
							className="w-full"
							onClick={async () => {
								await signIn("google");
							}}
						>
							Sign in with Google
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default Signin;
