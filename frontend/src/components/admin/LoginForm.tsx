import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface LoginFormProps {
	onLogin: (success: boolean) => void;
}

// Note: In a real application, this would be handled securely with proper authentication
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'syria2025';

const LoginForm = ({ onLogin }: LoginFormProps) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Simulate network delay
		setTimeout(() => {
			if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
				toast({
					title: 'Login successful',
					description: 'Welcome to the admin panel',
					variant: 'default',
				});
				// Store authentication state in session storage
				sessionStorage.setItem('adminAuthenticated', 'true');
				onLogin(true);
			} else {
				toast({
					title: 'Login failed',
					description: 'Invalid username or password',
					variant: 'destructive',
				});
				onLogin(false);
			}
			setIsLoading(false);
		}, 500);
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle className="text-center text-syria-green-700">
					Admin Login
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit}>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="username">Username</Label>
							<Input
								id="username"
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								placeholder="Enter your username"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter your password"
								required
							/>
						</div>
					</div>

					<CardFooter className="px-0 pt-6">
						<Button
							type="submit"
							className="w-full bg-syria-green-500 hover:bg-syria-green-600"
							disabled={isLoading}
						>
							{isLoading ? 'Logging in...' : 'Login'}
						</Button>
					</CardFooter>
				</form>
			</CardContent>
		</Card>
	);
};

export default LoginForm;
