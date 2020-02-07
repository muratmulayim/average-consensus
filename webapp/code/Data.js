var Data = (function () {
	var module = {
		id: "average-consensus.webapp.code.Data",
		
		adjacencies: [
			[false, true, false, false],
			[true, false, true, true],
			[false, true, false, true],
			[false, true, true, false],
		],
		
		X: [
			[5],
			[2],
			[7],
			[9],
		],
		
		/*
		* Stores various dataincluding the map of graph and DOM related.
		* @graphName: The name of  the graph. Example: "Complete Graph"
		* @textId: Id of the DOM element that will be filled with @graphName. Example: "Complete Graph"
		* @imageId: DOM Id of the graph image
		* @formulationId: An id of DOM. This DOM will represent the formulation of linear average.
		* @calculationId: An id of DOM. This DOM will represent the calculation of linear average with real values.
		* @initialValuesId: Id of DOM element that shows initial states of graphs. Example: "Initial States: [ 1,-1,1,-1,1 ] : 0.2"
		* @convergeId: Id of DOM element that shows average value of after algrithm. Example: "Value to converge to: 0.2"
		* @convergeResultId: Id of DOM element that shows the result is equal to average of initial states. Example: "It is equal to average of initial values."
		* @adjacencies: Represents the entire map. If the cell is true, (row+1)-(column+1) motes are connected.
		**/
		Topologies: {
			CompleteGraph: {
				graphName: "Complete Graph",
				textId: "completeGraphText",
				imageId: "completeGraphImage",
				formulationId: "completeGraphFormulation",
				calculationId: "completeGraphCalculation",
				initialValuesId: "completeGraphInitialValues",
				convergeId: "completeGraphConvergeValue",
				convergeResultId: "completeGraphConvergeResult",
				adjacencies: [
					[true, true, true, true, true],
					[true, true, true, true, true],
					[true, true, true, true, true],
					[true, true, true, true, true],
					[true, true, true, true, true]
				]
			},
			CycleGraph: {
				graphName: "Cycle Graph",
				textId: "cycleGraphText",
				imageId: "cycleeGraphImage",
				formulationId: "cycleGraphFormulation",
				calculationId: "cycleGraphCalculation",
				initialValuesId: "cycleGraphInitialValues",
				convergeId: "cycleGraphConvergeValue",
				convergeResultId: "cycleGraphConvergeResult",
				adjacencies: [
					[true, true, true, false, false],
					[true, true, false, true, false],
					[true, false, true, false, true],
					[false, true, false, true, true],
					[false, false, true, true, true]
				]
			},
			StarGraph: {
				graphName: "Star Graph",
				textId: "starGraphText",
				imageId: "starGraphImage",
				formulationId: "starGraphFormulation",
				calculationId: "starGraphCalculation",
				initialValuesId: "starGraphInitialValues",
				convergeId: "starGraphConvergeValue",
				convergeResultId: "starGraphConvergeResult",
				adjacencies: [
					[true, true, true, true, true],
					[true, true, false, false, false],
					[true, false, true, false, false],
					[true, false, false, true, false],
					[true, false, false, false, true]
				]
			}
		},
		
		Text: {
			convergeText: "Value to converge to: ",
			isConvergeText: "It is equal to average of initial values.",
			isnotConvergeText: "It is not equal to average of initial values.",
		},

		/*
		* InitialMeasurements: Represents initial state of undirected unweighted graph
		* Indices are related to mote number. index-(i+1) is equal to Mote-(i)
		*/
		InitialMeasurements: [1, -1, 1, -1, 1],

		load: function () {
			Logger.log(module.id, "load()");
		}
	};

	return module;

}
	());