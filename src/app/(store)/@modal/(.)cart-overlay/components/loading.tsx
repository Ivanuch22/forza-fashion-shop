import "../loader.css";
const Loading = () => {
	return (
		<div className="absolute z-10 flex justify-center items-center top-0 bottom-0 left-0 right-0 bg-white/50">
			<div className="lds-ring ">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
};
export default Loading;
