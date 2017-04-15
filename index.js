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
      node.adjList.forEach(function(link,count){
        if(!link){
          return;
        }
        if(node.name < link.name){
          return;
        }
        linkobj = {
          source: node.name,
          target: link.name,
          weight: node.weight[count]
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
      if(random>0.5){
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
            var weight = 1+Math.floor(Math.random()*20);
            links.push({
              source: source,
              target: target,
              weight: weight
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
      nodes[link.source].addEdge(nodes[link.target],link.weight);
      nodes[link.target].addEdge(nodes[link.source],link.weight);
    })
    return graph;
  }

  var highlightPath = function(path,instance,source,target){
    var route = [];
    var foundroot = false;
    route.push(target);
    var maxtries = 15;
    while(!foundroot){
      target = path[target];
      route.push(target);
      if(target==source){
        foundroot = true;
      }
      maxtries--;
      if(maxtries == 0){
        foundroot = true;
      }
      console.log(route);
    }

    var order = instance.graph.nodes.length;
    var size = instance.graph.edges.length;

    var id = Math.floor(Math.random() * order);

    var adjacent = instance.graph.getAdjacentNodes({ id: id });
    var v = adjacent[0].id;
    instance.selector.traverseAllEdgesBetween({ source: id, target: v });
  }
  window.highlightPath = highlightPath;

  var main = function(){
    var graph = makeGraph(makeRandomGraph(15));
    var data = getVisualData(graph);
    var graphholder = document.getElementById("graph-container");
    console.log("width",graphholder.width);
    console.log("height",graphholder.height);
    console.log(graphholder);
    var instance = greuler({
      target: '#graph',
      width: 1500,
      height: 600,
      data: data
    });
    console.log(instance);
    instance.update();
    var nodes=graph.getAllNodes();
    var path=dijkstra(graph,nodes[0],nodes[10]);
    console.log("Distance",path);
    highlightPath(path,instance,0,10);
    return instance;
  }

  window.instance = main();
};