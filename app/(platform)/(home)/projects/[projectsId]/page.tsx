export default function ProjectId({ params }) {
	return (
		<>
			<div className="py-6">
				<main>
					<div className="mx-auto lg:max-w-[1500px] sm:px-6 lg:px-8 max-w-full">
						<h1>Project {params.id}</h1>
					</div>
				</main>
			</div>
		</>
	)
}
