/**
 *
 * Copyright 2015, Institute for Systems Biology
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

define(['jquery', 'd3', 'd3tip', 'vis_helpers'],
function($, d3, d3tip, vis_helpers) {

    var CURSOR_TOOLTIP_PAD = 20;

    // If you want to override the tip coming in from the create call,
    // do it here
     var treeTip = d3tip()
        .attr('class', 'd3-tip')
        .direction('s')
        .offset([0, 0])
        .html(function(d) {
            if (d.dy > CURSOR_TOOLTIP_PAD) {
                var yOffset = (d.dy < (CURSOR_TOOLTIP_PAD*1.5) ? (CURSOR_TOOLTIP_PAD/2) : 0);
                treeTip.offset([yOffset, 0]);
            } else {
                treeTip.offset([CURSOR_TOOLTIP_PAD, 0]);
            }

            return '<span>' + d.name + ': ' + d.count + '</span>';
        });

    return {
        get_treemap_ready: function(data, attribute) {
            var children = [];
            for (var i in data) {
                children.push({name:(data[i]['displ_name'] || data[i]['value'].toString().replace(/_/g, ' ')), count: data[i]['count']});
            }
            return {children: children, name: attribute};
        },
        draw_tree: function(data, svg, attribute, w, h, showtext, tip, pcount) {

            pcount = pcount || 0;

            tip = treeTip || tip;

            var node = this.get_treemap_ready(data, attribute);
            var treemap = d3.layout.treemap()
                .round(false)
                .size([w, h])
                .sticky(true)
                .value(function(d) {
                    if(d.count <= 0) {
                        return d.count;
                    }
                    return d.count+pcount;
                });

            var nodes = treemap.nodes(node)
                .filter(function(d) { return !d.children; });

            var name_domain = $.map(nodes, function(d) {
                return d.name;
            });
            var helpers = Object.create(vis_helpers, {});
            var color = d3.scale.ordinal()
                .domain(name_domain)
                .range(helpers.color_map(name_domain.length));

            var cell = svg.selectAll("g")
                .data(nodes)
                .enter().append("svg:g")
                .attr("class", "cell")
                .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

            cell.append("svg:rect")
                .attr("width", function(d) {
                    return d.dx;
                })
                .attr("height", function(d) {
                    return d.dy;
                })
                .attr('data-attr', function() { return attribute; })
                .style("fill", function(d) { return color(d.name); })
                .style('cursor', 'pointer')
                .text(function(d) { return d.name; })
                .on('mouseover.tip', tip.show)
                .on('mouseout.tip', tip.hide)
                .on('click', function() {
                    var item = $('#' + $(this).attr('data-attr') + '-' + $(this).html().replace(/\s+/g, ''));
                    if (item.length > 0) {
                        item[0].checked = 'checked';
                        $(item[0]).trigger('change');
                    }
                });

            svg.call(tip);
        },
        draw_trees: function(data, clin_attr, this_tree) {

            var startPlot = new Date().getTime();

            var total = 0;

            var w = 140,
                h = 140;

            $(this_tree).empty();

            // Munge Data
            var tree_data = {};
            for (var i = 0; i < data.length; i++) {
                if (clin_attr[data[i]['name']]) {
                    total = data[i].total;
                    tree_data[data[i]['name']] = data[i]['values']
                }
            }

            // Calculate our pseudocount:
            var pcount = (total * 0.008) > 1 ? (total * 0.008) : 0;

            var clin_attr_keys = Object.keys(clin_attr);

            for (var i = 0; i < clin_attr_keys.length; i++) {
                var tree_div = d3.select(this_tree)
                    .append('div')
                    .attr('class', 'tree-graph');
                var title_div = tree_div.append('p')
                    .attr('class', 'graph-title')
                    .html(clin_attr[clin_attr_keys[i]]);
                var graph_svg = tree_div.append('svg')
                    .attr("class", "chart")
                    .style("width", w + "px")
                    .style("height", h + "px")
                    .append("svg:g")
                    .attr("transform", "translate(.5,.5)");
                this.draw_tree(tree_data[clin_attr_keys[i]], graph_svg, clin_attr[clin_attr_keys[i]], w, h, false, treeTip, pcount);
            }

            var stopPlot = new Date().getTime();

            console.debug("[BENCHMARKING] Time to build tree graphs: "+(stopPlot-startPlot)+ "ms");
        }
    };
});