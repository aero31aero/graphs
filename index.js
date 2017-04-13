window.onload = function(e){
  var getVisualData = function(graph){
    var data={};
    data.nodes=[];
    data.links=[];
    graph.nodes.forEach(function(node){
      var nodeobj = {
        id: node.name
      }
      data.nodes.push(nodeobj);
      node.adjList.forEach(function(link){
        if(!link){
          return;
        }
        linkobj = {
          source: node.name,
          target: link.name
        }
        data.links.push(linkobj);
      });
    });
    return data;
  }

  var makeRandomGraph = function(length){
    var nodes = [];
    var links = [];
    var shouldMakeEdge = function(){
      var random = Math.random();
      if(random>0.2){
        return true;
      }
      return false;
    }
    for(var i=0;i<length;i++){
      nodes.push(i);
    }
    nodes.forEach(function(source){
      nodes.forEach(function(target){
        if(source < target && target - source < 5){
          if(shouldMakeEdge()==true){
            links.push({
              source: source,
              target: target
            });
          }
        }
      });
    });
    return {
      nodes,
      links
    }
  }

  var makeGraph = function(data){
    graph = new Graph();
    nodes = [];
    data.nodes.forEach(function(node){
      nodes.push(graph.addNode(node));
    })
    data.links.forEach(function(link){
      // console.log(link);
      nodes[link.source].addEdge(nodes[link.target]);
    })
    return graph;
  }

  var main = function(){
    var graph = makeGraph(makeRandomGraph(10));
    var data = getVisualData(graph);
    var graphholder = document.getElementById("graph-container");
    var instance = greuler({
      target: '#graph',
      width: graphholder.width,
      height: graphholder.height,
      data: data
    });
    console.log(instance);
    instance.update();
  }

  main();
};