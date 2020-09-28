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
    route.push(parseInt(target));
    var maxtries = 15;
    while(!foundroot){
      target = path[target];
      console.log("Target:",target);
      route.push(target);
      if(target==source){
        foundroot = true;
      }
      maxtries--;
      if(maxtries == 0){
        foundroot = true;
        continue;
      }
    }
    route.reverse();
    console.log(route);

    for(var i=0;i<route.length-1;i++){
      var linefrom = route[i];
      var lineto = route[i+1];
      instance.selector.traverseAllEdgesBetween({ source: linefrom, target: lineto });
    }
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
      width: 1000,
      height: 800,
      data: data
    });
    console.log(instance);
    instance.update();
    var nodes=graph.getAllNodes();
    // var path=dijkstra(graph,nodes[0],nodes[10]);
    // console.log("Distance",path);
    // highlightPath(path.path,window.instance,0,10);
    return instance;
  }
  // document.getElementById("graph-maker").onclick=function(e){
  //   console.log('Hello');
  // };
  window.instance = main();
};

function findPath(button){
  console.log("Clicked");
  var source = prompt("Source Node");
  var target = prompt("Target Node");

  if(source >= 0 && source <=14){
    if(target >= 0 && target <=14){
      //var nodes=graph.getAllNodes();
      var path=dijkstra(graph,nodes[source],nodes[target]);
      console.log(path.distance);
      button.innerHTML="Distance = " + path.distance;
      highlightPath(path.path,window.instance,source,target);
    }
  }
}