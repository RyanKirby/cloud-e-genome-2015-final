'use strict';

angular.module('pat-cases').directive('showData', [
    function ($parse) {
        return {
            restrict: 'E',
            replace: true,
            template: '<span id="chart"></span>',
            link: function (scope, element, attrs) {

                scope.$watch('overview', function () {



                    console.log(attrs.data);
                    var dataset = attrs.data.split(',');
                    var chart;
                    d3.select('#chart').selectAll('*').remove();

                    if (dataset[0] !== '') {

                        var lable = [['Green', 4, '#9BC09B'], ['Amber', 0, '#E6C19C'], ['Red', 18, '#E67373']];

                        var bw = 400;
                        var w = 600;
                        var h = 50;
                        //var dataset = [5, 25, 15];
                        var lgt = 0;
                        console.log(dataset);
                        for (var i = 0; i < dataset.length; i++) {
                            if (lgt < parseInt(dataset[i])) {
                                lgt = dataset[i];
                            }
                        }

                        chart = d3.select('#chart')
                                .append('svg')
                                .attr('width', w)   // <-- Here
                                .attr('height', h); // <-- and here!



                        var recs = chart.selectAll('rect')
                                .data(dataset)
                                .enter()
                                .append('rect');
                        recs.attr('x', 50)
                                .attr('y', function (d, i) {
                                    return i * 15;
                                })
                                .attr('width', 0)
                                .attr('height', 13)
                                .attr('fill', function (d, i) {
                                    return lable[i][2];
                                })
                                .text(function (d) {
                                    return d;
                                })
                                .on('click', function (d) {
                                    d3.select(this)
                                            .attr('width', function (d) {
                                                return (d / lgt) * bw;
                                            })
                                            .transition()
                                            .ease('linear')
                                            .duration(100)
                                            .attr('width', function (d) {
                                                return ((d / lgt) * bw) + 50;
                                            })
                                            .transition()
                                            .ease('linear')
                                            .duration(200)
                                            .attr('width', function (d) {
                                                return ((d / lgt) * bw - 50);
                                            })
                                            .transition()
                                            .ease('elastic')
                                            .duration(300)
                                            .attr('width', function (d) {
                                                return ((d / lgt) * bw);
                                            });
                                })
                                .transition()
                                .ease('elastic')
                                .delay(function (d, i) {
                                    return i * 300;
                                })
                                .duration(2000)
                                .attr('width', function (d) {
                                    return ((d / lgt) * bw);
                                });

                        var text = chart.selectAll('text')
                                .data(dataset)
                                .enter()
                                .append('text');

                        var text1 = chart.selectAll('text1')
                                .data(dataset)
                                .enter()
                                .append('text');

                        var textLabels = text
                                .attr('x', 53)
                                .attr('y', function (d, i) {
                                    return (i * 15) + 11;
                                })
                                .text(function (d, i) {
                                    return d + ' variants';
                                })
                                .attr('font-family', 'sans-serif')
                                .attr('font-size', '12px')
                                .attr('fill', 'white');

                        var textLabels1 = text1
                                .attr('x', function (d, i) {
                                    return lable[i][1];
                                })
                                .attr('y', function (d, i) {
                                    return (i * 15) + 11;
                                })
                                .text(function (d, i) {
                                    return lable[i][0];
                                })
                                .attr('font-family', 'sans-serif')
                                .attr('font-weight', 'bold')
                                .attr('font-size', '14px')
                                .attr('fill', function (d, i) {
                                    return lable[i][2];
                                });


                    }
                });
            }

        };
    }


]);