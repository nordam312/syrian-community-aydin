import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import AdminDashboard from '@/components/admin/AdminDashboard';

const Admin = () => {
	return (
		<Layout>
			<div className="page-container py-12">
				<AdminDashboard />
			</div>
		</Layout>
	);
};

export default Admin;
