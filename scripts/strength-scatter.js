var strength_scatter = {
    initialize: function(){
        var strengthScatterWidth = $('#strength-scatter-svg').width();
        var strengthScatterHeight = $('#strength-scatter-svg').height();
        var margin = {top: 10, right: 30, bottom: 30, left: 40},
            width = strengthScatterWidth - margin.left - margin.right,
            height = strengthScatterHeight - margin.top - margin.bottom;

        var x = d3.scaleLinear()
            .range([0, width]);

        var y = d3.scaleLinear()
            .range([height, 0]);

        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var xAxis = d3.axisBottom(x);

        var yAxis = d3.axisLeft(y);

        var svg = d3.select("#strength-scatter-svg").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr('id', 'strength-scatter-g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.csv("datasets/fullData.csv", function(error, data) {
          if (error) throw error;
          data.forEach(function(d) {
            d.AVG = +d.AVG;
            d.EAR = +d.EAR;
            d.FPCT = +d.FPCT;
          });
          x.domain(d3.extent(data, function(d) { return d.EAR; })).nice();
          y.domain(d3.extent(data, function(d) { return d.AVG; })).nice();

          var pale = d3.rgb(135,206,250);
          var dark = d3.rgb(30,144,255);
          var color = d3.interpolate(pale, dark);        //颜色插值函数
          var linear = d3.scale.linear()
                .domain(d3.extent(data, function(d) { return d.Salaries; })).nice()
                .range([0, 1]);

          var brush = d3.brush()
              .extent([[0,0],[width,height]])
              .on('start',brushstart)
              .on('brush',brushmove)
              .on('end',brushend);

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          svg.append("text")
              .attr("class", "label")
              .attr("x", width)
              .attr("y", height + 28)
              .style("text-anchor", "end")
              .text("EAR")
              .style("color", "#fff");

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis);

          svg.append("text")
              .attr("class", "label")
              .attr("transform", "rotate(-90)")
              .attr("y", -35)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("AVG * 100")
              .style("color", "#fff");

          svg.append("text")
              .attr("class", "label")
              .attr("x", width)
              .attr("y", height - 20)
              .style("text-anchor", "end")
              .text("R=FPCT")
              .style("color", "#fff");

          svg.append("g").call(brush);

          svg.selectAll(".dot")
              .data(data)
              .enter()
              .append("circle")
              .attr("class", "dot")
              .attr("id", function(d,i){
                return d.playerID;
              })
              .attr("r", function(d) {
                  var a = x((d.FPCT/1-30) * 0.034);
                  if(a < 0)
                        return 0;
                  else
                        return a;})
              .attr("cx", function(d) { return x(d.EAR); })
              .attr("cy", function(d) { return y(d.AVG); })
              .on("click", function(d){ console.log(d.playerID); salary_line_chart.update(d.playerID); })
              .style("fill", function (d) {return color(linear(d.Salaries)); })
              .style("stroke", "#E6E6FA");


          var brushCell;
          var selectArray = new Array();
          // Clear the previously-active brush, if any.
          function brushstart(p) {
           if (brushCell !== this) {
              selectArray = new Array();
              svg.selectAll('.brush').call(brush);
              var selectArray = new Array();
              brushCell = this;
            }
          }
          // Highlight the selected circles.
          function brushmove(p) {
            var e=d3.event.selection;
            var xmin=e[0][0],xmax=e[1][0];
            var ymin=e[0][1],ymax=e[1][1];
            d3.selectAll('.dot')
            .style('fill',function(d) {
              var x = d3.select(this).attr('cx');
              var y = d3.select(this).attr('cy');
              var circleId = d3.select(this).attr('id');
              if(x>xmin&&x<xmax&&y>ymin&&y<ymax){
                d3.select(this).classed('circle-hidden', false);
                if(selectArray.indexOf(circleId)==-1){
                  selectArray.push(circleId);
                }
              }else{
                d3.select(this).classed('circle-hidden', true);
              }
            });
            salary_histogram.update(selectArray);
          }
          // If the brush is empty, select all circles.
          function brushend(p) {
            var e=d3.event.selection;
            if(e != null){
              var xmin=e[0][0],xmax=e[1][0];
              var ymin=e[0][1],ymax=e[1][1];
              if(((xmax - xmin) < 3)&&((ymax - ymin) < 3)){
                  svg.selectAll(".circle-hidden").classed("circle-hidden", false);
                  selectArray = new Array();
              }
            }else{
              svg.selectAll(".circle-hidden").classed("circle-hidden", false);
              selectArray = new Array();
            }
            salary_histogram.update(selectArray);
          }
        });
    },
    update: function(select_obj_array){
      var svg = d3.select('#strength-scatter-g');
      if(select_obj_array.length == 0){
          svg.selectAll(".circle-hidden").classed("circle-hidden", false);
      }else{
          svg.selectAll(".dot").classed("circle-hidden", true);
          for(var i = 0;i < select_obj_array.length;i++){
            svg.select('#' + select_obj_array[i]).classed("circle-hidden", false);
          }
      }
    }
}
