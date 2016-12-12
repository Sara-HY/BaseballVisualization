var salary_histogram = {
    salariesGap: 1000000,
    arrayNum: 0,
    array2d: null,
    x: null,
    y: null,
    height: 0,
    margin: null,
    initialize: function(){
        var self = this;
        var salaryHistogramWidth = $('#salary-histogram-svg').width();
        var salaryHistogramHeight = $('#salary-histogram-svg').height();
        var margin = {top: 10, right: 20, bottom: 30, left: 50},
            width = salaryHistogramWidth - margin.left - margin.right,
            height = salaryHistogramHeight - margin.top - margin.bottom;
        self.margin = margin;
        self.height = height;
        var formatPercent = d3.format(".0%");
        self.x = d3.scaleBand()
            .rangeRound([0, width], .2, 1);
        var x = self.x;
        self.y = d3.scaleLinear()
            .range([height, 0]);
        var y = self.y;

        var xAxis = d3.axisBottom(x);

        var yAxis = d3.axisLeft(y);

        var select_object_array = new Array();
        var svg = d3.select("#salary-histogram-svg")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr('id', 'salary-histogram-g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.csv("datasets/fullData.csv", function(error, data) {
            for(var ii = 0;ii < data.length;ii++){
                data[ii].Salaries = +data[ii].Salaries;
            }
            var range = d3.extent(data, function(d,i){
                return d.Salaries;
            });
            var salariesGap = self.salariesGap;
            self.arrayNum = Math.ceil(range[1]/salariesGap);
            var arrayNum = self.arrayNum;
            self.array2d = new Array(arrayNum);
            var array2d = self.array2d;
            for(var jj = 0;jj < arrayNum;jj++){
                array2d[jj] = new Array();
            }
            for(var ii = 0;ii < data.length;ii++){
                var index = +Math.floor(data[ii].Salaries / salariesGap);
                array2d[index].push(data[ii].playerID);
            }
            var countObjArray = new Array();
            for(var ii = 0;ii < arrayNum;ii++){
                countObjArray[ii] = new Object();
                if(array2d[ii].length != 0){
                    countObjArray[ii].num = array2d[ii].length;//Math.log2(array2d[ii].length);//array2d[ii].length;//
                }else{
                    countObjArray[ii].num = 0;//array2d[ii].length;//
                }
                countObjArray[ii].label = (ii * salariesGap/1000 + 250) + 'k-' + ((ii + 1) * salariesGap/1000 + 250) + 'k';
            }
            countObjArray.forEach(function(d) {
                d.num = +d.num;
            });

            x.domain(countObjArray.map(function(d) { return d.label; }));
            y.domain([0, d3.max(countObjArray, function(d) { return +d.num })]);

            var ticks = x.domain().filter(function(d,i){ return !(i%10); } );

            xAxis.tickValues( ticks );

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("text")
                .attr("class", "label")
                .attr("x", width)
                .attr("y", height + 20)
                .style("text-anchor", "end")
                .text("Salary");

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);

            svg.append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", -42)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Count");

            svg.selectAll(".bar")
                .data(countObjArray)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d.label); })
                .attr("width", x.bandwidth() - 1)
                .attr("y", function(d) {
                    return y(+d.num);
                })
                .attr("height", function(d) { return height - y(+d.num); })
                .on("click", function(d,i){
                    if(!d3.select(this).classed('rect-highlight')){
                        for(var j = 0;j < array2d[i].length;j++){
                            if(select_object_array.indexOf(array2d[i][j]) == -1){
                                select_object_array.push(array2d[i][j]);
                            }
                        }
                        d3.selectAll(".bar").classed('rect-hidden', true);
                        d3.select(this).classed('rect-hidden', false);
                        d3.select(this).classed('rect-highlight', true);
                    }else{
                        for(var j = 0;j < array2d[i].length;j++){
                            var eleIndex = select_object_array.indexOf(array2d[i][j]);
                            if(eleIndex != -1){
                                select_object_array.splice(eleIndex, 1);
                            }
                        }
                        d3.select(this).classed('rect-highlight', false);
                        d3.select(this).classed('rect-hidden', true);
                        if(d3.selectAll('.rect-highlight').empty()){
                            d3.selectAll(".bar").classed("rect-hidden", false);
                        }
                    }
                    strength_scatter.update(select_object_array);
                });
        });
    },
    update: function(select_object_array){
        var self = this;
        var arrayNum = self.arrayNum;
        var salariesGap = self.salariesGap;
        var innerCountArray = new Array(arrayNum);
        var array2d = self.array2d;
        var x = self.x;
        var y = self.y;
        var height = self.height;
        var margin = self.margin;
        var svg = d3.select("#salary-histogram-g");
        for(var i = 0;i < arrayNum;i++){
            innerCountArray[i] = 0;
        }
        console.log('select_object_array', select_object_array);
        for(var i = 0;i < select_object_array.length;i++){
            var personId = select_object_array[i];
            for(var j = 0;j < arrayNum;j++){
                if(array2d[j].indexOf(personId) != -1){
                    innerCountArray[j] = innerCountArray[j] + 1;
                }
            }
        }
        var innerCountObjArray = new Array();
        for(var i = 0;i < arrayNum;i++){
            innerCountObjArray[i] = new Object();
            if(innerCountArray[i] != 0){
                innerCountObjArray[i].num = innerCountArray[i];
            }else{
                innerCountObjArray[i].num = 0;
            }
            innerCountObjArray[i].label = (i * salariesGap/1000 + 250) + 'k-' + ((i + 1) * salariesGap/1000 + 250) + 'k';
        }
        if(select_object_array.length != 0){
            svg.selectAll(".bar").classed("rect-hidden", true);
        }else{
            svg.selectAll(".bar").classed("rect-hidden", false);
        }
        var appendBar = svg.selectAll(".append-bar")
            .data(innerCountObjArray);
        appendBar.enter().append("rect")
            .attr("class", "append-bar")
            .attr("x", function(d) {
                return x(d.label);
            })
            .attr("width", x.bandwidth() - 1)
            .attr("y", function(d) {
                return y(+d.num);
            })
            .attr("height", function(d) { return height - y(+d.num); });
        appendBar.attr("class", "append-bar")
            .attr("x", function(d) {
                console.log(x(d.label))
                return x(d.label);
            })
            .attr("width", x.bandwidth() - 1)
            .attr("y", function(d) {
                return y(+d.num);
            })
            .attr("height", function(d) { return height - y(+d.num); });
        appendBar.exit().remove();
    }
}
