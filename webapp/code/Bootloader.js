var Bootloader = (function () {
	var module = {
		id: "average-consensus.webapp.code.Bootloader",
		load: function () {
			Logger.load();
			Logger.log(module.id, "load()");
			Data.load();
			Statistics.load();
			_load();
		}
	};
	
	var A_GRAPH = [];
	var X = [];
	var statisticsData = [];
	var MAX_STEP_COUNT = 300;
	
	// DOM
	var graphAdjacenciesNode;
	var graphInitialValuesNode;
	var graphNextValuesNode;
	
	var DOMFactory = function (nodeId) {
		this.node = window.document.getElementById(nodeId);
		
		this.__proto__ = {
			show: function () {
				this.node.classList.remove("hidden");
			},
			
			hide: function () {
				this.node.classList.add("hidden");
			},
			
			setRelativePosition: function (top, left) {
				this.node.style.top = top + "%";
				this.node.style.left = left + "%";
			},
			
			getSubString: function (text) {
				return "<sub>" + text + "</sub>";
			},
			
			getSuperString: function (text) {
				return "<sup>" + text + "</sup>";
			},
			
			setSubString: function (text) {
				this.node.innerHTML += "<sub>" + text + "</sub>";
			},
			
			setSuperString: function (text) {
				this.node.innerHTML += "<sup>" + text + "</sup>";
			},
			
			addHTML: function (text) {
				this.node.innerHTML += text;
			},
			
			setHTML: function (text) {
				this.node.innerHTML = text;
			},
			
			clearHTML: function() {
				this.node.innerHTML = "";
			},
			
			newLine: function() {
				this.node.innerHTML += "<br>";
			},
			
			setText: function(text) {
				this.node.innerText = text;
			},
			
			setTab: function() {
				this.node.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
			}
		};
		
		return this;
	};
	
	function _isMatrix(matrix) {
		if(matrix && typeof matrix == "object" && matrix.constructor == Array){
			if(matrix[0] && typeof matrix[0] == "object" && matrix[0].constructor == Array){
				return true;
			}
		}
		return false;
	}
	
	function _isArray(array) {
		if(array && typeof array == "object" && array.constructor == Array){
			return true
		}
		return false;
	}
	
	function _isConverge() {
		var result = true;
		
		for (var i = 0; i < X.length - 1; i++){
			if(X[i][0] != X[i + 1][0]){
				result = false;
				return result;
			}
		}
		
		return result;
	}
	
	function _printInfo() {
		graphAdjacenciesNode.clearHTML();
		graphAdjacenciesNode.addHTML("Adjacency Matrix A: ");
		graphAdjacenciesNode.newLine();
		for (var row = 0; row < A_GRAPH.length; row++) {
			graphAdjacenciesNode.addHTML("| ");
			for (var column = 0; column < A_GRAPH[0].length; column++) {
				graphAdjacenciesNode.addHTML("  " + Math.round(A_GRAPH[row][column]*100)/100 + "  ");
			}
			graphAdjacenciesNode.addHTML(" |");
			graphAdjacenciesNode.newLine();
		}
		
		graphInitialValuesNode.clearHTML();
		graphInitialValuesNode.addHTML("Initial values on each node, X(0): ");
		graphInitialValuesNode.setSuperString("T");
		graphInitialValuesNode.addHTML(": [ ");
		for (var row = 0; row < X.length; row++) {
			graphInitialValuesNode.addHTML(" " + Math.round(X[row][0]*100)/100 + " ");
		}
		graphInitialValuesNode.addHTML(" ]");

		
		graphNextValuesNode.clearHTML();
		graphNextValuesNode.addHTML("Steps:");
		graphNextValuesNode.newLine();
	}
	
	function _printNextStep(step) {
		graphNextValuesNode.setTab();
		graphNextValuesNode.addHTML("X( " + step + " )");
		graphNextValuesNode.setSuperString("T");
		graphNextValuesNode.addHTML(": ");
		
		graphNextValuesNode.addHTML("[ ");
		for (var row = 0; row < X.length; row++) {
			graphNextValuesNode.addHTML(" " + Math.round(X[row][0]*10000)/10000 + " ");
		}
		graphNextValuesNode.addHTML(" ]");
		graphNextValuesNode.newLine();
	}
	
	function _loadDOMNodes() {
		graphAdjacenciesNode = new DOMFactory("graphAdjacencies");
		graphInitialValuesNode = new DOMFactory("graphInitialValues");
		graphNextValuesNode = new DOMFactory("graphNextValues");
	}
	
	function _randomTopo(nodeCount) {
		var topo = [];
		
		for(var row = 0; row < nodeCount; row++) {
			topo.push();
			topo[row] = [];
			for(var column = 0; column < nodeCount; column++) {
				if(row == column) {
					topo[row][column] = false;
				} else if(row < column) {
					var rnd = Math.round(Math.random() * 1);
					topo[row][column] = rnd == 1 ? true : false;
				} else {
					topo[row][column] = topo[column][row];
				}		
			}
		}
		
		return topo;
	}
	
	function _randomInitialValues(nodeCount) {
		var vals = [];
		
		for(var row = 0; row < nodeCount; row++) {
			vals.push();
			vals[row] = [];
			
			var rnd = Math.round(Math.random() * 9);
			vals[row][0] = rnd;
		}
		
		return vals;
	}
	
	function _calculate_A_GRAPH(topo) {
		for(var row = 0 ; row < topo.length; row++) {
			A_GRAPH.push();
			A_GRAPH[row] = [];
			var neighborCount = 0;
			for(var column = 0 ; column < topo[0].length; column++) {
				if(topo[row][column] || row == column) {
					A_GRAPH[row][column] = 1;
					neighborCount++;
				} else {
					A_GRAPH[row][column] = 0;
				}
			}
			
			for(var column = 0 ; column < topo[0].length; column++) {
				if(A_GRAPH[row][column] == 1) {
					A_GRAPH[row][column] = 1/neighborCount;
				}
			}
		}
		Logger.log(module.id, "GRAPH: " + A_GRAPH);
	}
	
	function _doStep(A, X) {
		var updatedX = [];
		
		if(_isMatrix(A) && _isArray(X)){		
			if(A[0].length == X.length){ // A row count and X count must be equal  
			
				statisticsData.push();
				statisticsData[statisticsData.length] = [];
					
				for(var row = 0 ; row < A.length; row++) {
					var result = 0;
					updatedX.push();
					updatedX[row] = [];
					
					for(var column = 0 ; column < X.length; column++) {
						result += A[row][column] * X[column][0];
					}
					// Floating numbers should contain at most 4 charachter after ',' as rounded.
					result = Math.round(result*10000)/10000;
					updatedX[row].push(result);
					statisticsData[statisticsData.length - 1].push(result);
				}
			}		
		}
		return updatedX;
	}

	function _load() {
		_loadDOMNodes();
		
		/*
		* Produces a random graph matrix and an initial values array.
		* In order to run the example that resides in Figure 57 in the course book, comment in following 2 lines of codes.
		*/
		Data.adjacencies = _randomTopo(5);
		Data.X = _randomInitialValues(5);
		
		_calculate_A_GRAPH(Data.adjacencies);
		X = Data.X;
		Logger.log(module.id, "X: " + X);
		
		_printInfo();
		
		statisticsData.push();
		statisticsData[statisticsData.length] = [];
		
		for(var i = 0; i < X.length; i++) {
			statisticsData[statisticsData.length - 1].push(X[i][0]);
		}
		
		setTimeout(function() {
			var i = 0;
			while(!_isConverge(X)){
				X = _doStep(A_GRAPH, X);
				i++;
				Logger.log(module.id, i + " X: " + X);	
				_printNextStep(i);
				
				if(i > MAX_STEP_COUNT) {
					graphNextValuesNode.addHTML("The system could not converge within " + i + " steps.");
					break;
				}
			}
			
			setTimeout(function() {
				Statistics.showStatistics("statisticContainer", statisticsData);
			}, 800);
		}, 500);
		
	}

	return module;
	
}());