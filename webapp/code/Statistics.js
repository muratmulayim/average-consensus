var Statistics = (function () {
	var module = {
		id: "average-consensus.webapps.code.Statistics",
		load: function () {
			Logger.log(module.id, "load()");
		},

		showStatistics: function (parentId, dat) {
			if(_isMatrix(dat)){
				Logger.log(module.id, "Statistic info will be displayed soon.");
				var data = [];
				
				var tempObj = {
					x: [],
					y: [],
					text: [],
					name: '',
					mode: 'lines+markers',
					marker: {
						color: 'rgb(165, 255, 0)',
						size: 8
					},
					line: {
						color: 'rgb(165, 255, 0)',
						width: 3
					}
				};
				
				for(var column = 0; column < dat[0].length; column++) {
					var currObject = JSON.parse(JSON.stringify(tempObj));
					for(var row = 0; row < dat.length; row++) {
						currObject.x.push(row);
						currObject.y.push(dat[row][column]);
						currObject.name = "X(" + (column + 1) + ")";
					}
					currObject.marker.color = "rgb(" + (34*(column+1)%255) + ", " + (83*(column+1)%255) + ", " + (97*(column+1)%255) + ")";
					currObject.line.color = "rgb(" + (34*(column+1)%255) + ", " + (83*(column+1)%255) + ", " + (97*(column+1)%255) + ")";
					
					data.push(currObject);
				}
				
				var layout = {
					title: 'Average Consensus Chart - ' + Plotly.version
				};
				
				var config = {
					displayModeBar: true,
					displaylogo: false,
					sendData: false,
					modeBarButtonsToRemove: ["toImage", "zoom2d", "sendDataToCloud", "select2d", "lasso2d", "autoScale2d", "resetScale2d", "hoverCompareCartesian"]
					
				};
				Plotly.newPlot(parentId, data, layout, config);
			} else {
				Logger.log(module.id, "Statistic info won't be displayed due to mismatched data.");
			}

		},

		hideStatistics: function () {}
	};
	
	
	function _isMatrix(matrix) {
		if(matrix && typeof matrix == "object" && matrix.constructor == Array){
			if(matrix[0] && typeof matrix[0] == "object" && matrix[0].constructor == Array){
				return true;
			}
		}
		return false;
	}
	
	var mapElement;

	return module;
}());
