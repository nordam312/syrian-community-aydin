// src/pages/Elections.tsx
import { useState, useEffect } from 'react';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';

interface Candidate {
	id: number;
	name: string;
	position: string;
	votes: number;
	image: string;
}

export default function ElectionsPage() {
	const [candidates, setCandidates] = useState<Candidate[]>([]);
	const [selectedCandidate, setSelectedCandidate] = useState<number | null>(
		null,
	);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		setCandidates([
			{
				id: 1,
				name: 'محمد أحمد',
				position: 'رئيس الجالية',
				votes: 45,
				image: "/ahmad.jpg",
			},
			{
				id: 2,
				name: 'علي حسن',
				position: 'رئيس الجالية',
				votes: 30,
				image: '/samir.jpg',
			},
			{
				id: 3,
				name: 'فاطمة خالد',
				position: 'رئيس الجالية',
				votes: 25,
				image: '/path-to-your-images/avatar3.jpg',
			},
		]);
	}, []);

	const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);

	const handleVote = async () => {
		if (!selectedCandidate) return;

		try {
			setIsSubmitting(true);
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			setCandidates(
				candidates.map((c) =>
					c.id === selectedCandidate ? { ...c, votes: c.votes + 1 } : c,
				),
			);
			setSelectedCandidate(null);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Layout>
			<div className="container mx-auto bg-card py-10">
				<div className="max-w-4xl mx-auto animate-fade-in">
					<h1 className="text-3xl font-bold mb-8 text-center text-syria-green-800">
						انتخابات رئاسة الجالية
					</h1>

					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{candidates.map((candidate) => (
							<Card
								key={candidate.id}
								className={`relative overflow-hidden transition-all duration-300 
                ${
									selectedCandidate === candidate.id
										? 'ring-2 ring-syria-green-500 shadow-lg'
										: 'hover:ring-1 hover:ring-syria-green-200'
								}
                bg-syria-green-50 border-syria-green-100`}
								onClick={() => setSelectedCandidate(candidate.id)}
							>
								{selectedCandidate === candidate.id && (
									<CheckCircle className="absolute top-2 right-2 h-6 w-6 text-syria-green-600" />
								)}

								<img
									src={candidate.image}
									alt={candidate.name}
									className="w-full h-48 object-cover border-b border-syria-green-200"
								/>

								<CardHeader>
									<CardTitle className="text-xl font-semibold text-syria-green-900">
										{candidate.name}
									</CardTitle>
									<CardDescription className="text-syria-green-600">
										{candidate.position}
									</CardDescription>
								</CardHeader>

								<CardContent>
									<div className="space-y-2">
										<Progress
											value={(candidate.votes / (totalVotes || 1)) * 100}
											className="h-2 bg-syria-green-100"
										/>
										<div className="flex justify-between text-sm">
											<span className="text-syria-green-700">
												الأصوات: {candidate.votes}
											</span>
											<span className="text-syria-green-800 font-medium">
												{((candidate.votes / (totalVotes || 1)) * 100).toFixed(
													1,
												)}
												%
											</span>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>

					<div className="mt-8 text-center space-y-4">
						<p className="text-syria-green-700">إجمالي الأصوات: {totalVotes}</p>

						<Button
							size="lg"
							onClick={handleVote}
							disabled={!selectedCandidate || isSubmitting}
							className="px-8 py-4 text-lg bg-syria-green-600 hover:bg-syria-green-700 
              text-white transition-colors shadow-md"
						>
							{isSubmitting ? 'جاري التصويت...' : 'تأكيد التصويت'}
						</Button>
					</div>
				</div>
			</div>
		</Layout>
	);
}
