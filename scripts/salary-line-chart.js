var salary_line_chart = {
    x: null,
    y: null,
    height: 0,
    line1: 0,
    initialize: function(playerID){
        var self = this;
        var salaryLineChartWidth = $('#salary-line-chart-svg').width();
        var salaryLineChartHeight = $('#salary-line-chart-svg').height();
        var margin = {top: 10, right: 30, bottom: 30, left: 50},
            width = salaryLineChartWidth - margin.left - margin.right,
            height = salaryLineChartHeight - margin.top - margin.bottom;

        self.x = d3.scaleLinear()
            .range([0, width]);

        self.y = d3.scaleLinear()
            .range([height, 0]);
        var x = self.x;
        var y = self.y;

        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var xAxis = d3.axisBottom(x);

        var yAxis = d3.axisLeft(y);

        var _data;

        var svg = d3.select("#salary-line-chart-svg").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr('id', 'salary-line-chart-g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.csv("datasets/playSalaries.csv", function(error, data) {
            if (error) throw error;
                _data = data;
                data.forEach(function(d) {
                    d.year = +d.year;
                    d.salary = +d.salary;
            });
            x.domain([2001, 2015]);
            y.domain(d3.extent(data, function(d) { return d.salary/1000000; })).nice();

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("text")
                .attr("class", "label")
                .attr("x", width)
                .attr("y", height + 28)
                .style("text-anchor", "end")
                .text("Time");

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);

            svg.append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", -38)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Salary");

            self.line1 = d3.line()
                .x(function(d){ return x(d.year);})
                .y(function(d){ return y(d.salary/1000000);});
            line1 = self.line1

            svg.selectAll(".dot")
                .data(data.filter(function(d){return d.playerID == playerID; }))
                .enter()
                .append("circle")
                .attr("class", "dot")
                .attr("r", 2)
                .attr("cx", function(d) { return x(d.year); })
                .attr("cy", function(d) { return y(d.salary/1000000); })
                .style("fill", function(d) { return "yellow"; });

            path1 = svg.append("path")
                .datum(data.filter(function(d){return d.playerID == playerID; }))
                .attr('id', 'path1')
                .attr("class", "pathline")
                .attr("stroke", "#87CEFA")
                .attr("d", line1);

            });

    },

    update: function(playerID){
        var self = this;
        var x = self.x;
        var y = self.y;
        var line1 = self.line1
        var svg = d3.select("#salary-line-chart-g");

        d3.csv("datasets/playSalaries.csv", function(error, data) {

            console.log(data);

            dataSet = data.filter(function (d) {return d.playerID == playerID;});

            console.log(dataSet);

            if (dataSet.length == 0)
                dataSet = data.filter(function (d) {return d.playerID == playerID;});
            console.log(dataSet);

            svg.selectAll(".dot").remove();

            svg.selectAll(".dot")
                .data(dataSet)
                .enter()
                .append("circle")
                .attr("class", "dot")
                .attr("r", 2)
                .attr("cx", function (d) {
                    return x(d.year);
                })
                .attr("cy", function (d) {
                    return y(d.salary / 1000000);
                })
                .style("fill", function (d) {
                    return "yellow";
                });

            d3.select(".pathline").remove();

            path1 = svg.append("path")
                .datum(dataSet)
                .attr('id', 'path1')
                .attr("class", "pathline")
                .attr("stroke", "#87CEFA")
                .attr("d", line1);
        });
    }

};

