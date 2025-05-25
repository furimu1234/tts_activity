const Loading = () => {
	return (
		<div className="absolute inset-0 flex items-center justify-center z-50">
			<div className="relative w-24 h-24">
				<span className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite" />
				<span className="absolute inset-2 rounded-full border-4 border-green-500 animate-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite delay-150" />
				<span className="absolute inset-4 rounded-full border-4 border-blue-500 animate-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite delay-300" />
			</div>
			<p className="absolute top-[calc(50%+80px)] text-white text-lg">
				Loading...
			</p>
		</div>
	);
};

export default Loading;
