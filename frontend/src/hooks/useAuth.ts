import { useState, useEffect } from 'react';

interface User {
	id: number;
	name: string;
	email: string;
	student_id: string;
	phone?: string;
	major?: string;
	role?: string;
	academic_year?: string;
}

export const useAuth = () => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// تحقق من وجود بيانات المستخدم في sessionStorage
		const savedUser = sessionStorage.getItem('userData');
		const savedToken = sessionStorage.getItem('userToken');

		if (savedUser && savedToken) {
			try {
				setUser(JSON.parse(savedUser));
				setToken(savedToken);
			} catch (error) {
				console.error('Error parsing user data:', error);
				// إذا كان هناك خطأ في البيانات، احذفها
				sessionStorage.removeItem('userData');
				sessionStorage.removeItem('userToken');
			}
		}
	}, []);

	const login = (userData: User, userToken: string) => {
		setUser(userData);
		setToken(userToken);
		sessionStorage.setItem('userData', JSON.stringify(userData));
		sessionStorage.setItem('userToken', userToken);
	};

	const logout = () => {
		setUser(null);
		setToken(null);
		sessionStorage.removeItem('userData');
		sessionStorage.removeItem('userToken');
	};

	const isAuthenticated = !!user && !!token;

	return {
		user,
		token,
		isLoading,
		isAuthenticated,
		login,
		logout,
	};
};
