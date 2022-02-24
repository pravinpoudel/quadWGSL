struct Node{
    index: u32;
    x: f32;
    y: f32;
    displacement: f32;
}

struct Boundary{
    x: f32;
    y: f32;
    w: f32;
    h: f32
}

struct Position{
    x:f32;
    y: f32
}

//make a default value in this
struct Quadtree{
    boundary: Boundary;
    CoM: Position;
    mass: u32;
    NE: u32;
    NW: u32;
    SE: u32;
    SW: u32;
    isDivided: bool;
    nodes: array<Node> 
}

struct Nodes{
  nodes: array<Node>;
};

struct tree{
    quad: array<Quadtree>
}

struct uniforms{
  nodes_length:u32;
  theta: f32;
}

[[group(0), binding(0)]] var<storage, read> nodes:Nodes;
[[group(0), binding(1)]] var<uniform> uniforms:uniforms;


function partition(quadtree:Quadtree)-> array<Quadtree>{
    let child:array<Quadtree>

    let x:f32 = quadtree.boundary.x;
    let y:f32 = quadtree.boundary.y;
    let w:f32 = quadtree.boundary.w;
    let h:f32 = quadtree.boundary.h;
    let mass:u32 = 0;

    var SE: Quadtree;    
    SE.boundary.x = x+(w/2);
    SE.boundary.y = y+(h/2);
    SE.boundary.w = w/2;
    SE.boundary.h = w/2;
    

    var SW: Quadtree;
    SW.boundary.x = x-(w/2);
    SW.boundary.y = y+(h/2);
    SW.boundary.w = w/2;
    SW.boundary.h = w/2;

    var NE: Quadtree;
    NE.boundary.x = x+(w/2);
    NE.boundary.y = y-(h/2);
    NE.boundary.w = w/2;
    NE.boundary.h = w/2;

    var NW: Quadtree;
    NW.boundary.x = x+(w/2);
    NW.boundary.y = y-(h/2);
    NW.boundary.w = w/2;
    NW.boundary.h = w/2;

}


fn isBounded( boundary: Boundary, node: Node)->bool{
    if (boundary.x + boundary.w == 1.0) {
      return (
        node.x >= boundary.x - boundary.w &&
        node.x <= boundary.x + boundary.w &&
        node.y >= boundary.y - boundary.h &&
        node.y < boundary.y + boundary.h
      );
    }

    if (boundary.y + boundary.h == 1.0) {
      return (
        node.x >= boundary.x - boundary.w &&
        node.x < boundary.x + boundary.w &&
        node.y >= boundary.y - boundary.h &&
        node.y <= boundary.y + boundary.h
      );
    } else {
      return (
        node.x >= boundary.x - boundary.w &&
        node.x < boundary.x + boundary.w &&
        node.y >= boundary.y - boundary.h &&
        node.y < boundary.y + boundary.h
      );
    }
  }

// check that quadtree in the main quadtree array

  fn insert(node:Node, index:u32)-> bool{
      //root
      if(!isBounded(tree.quad[index].boundary, node)){
          return false;
      }
      //mean it is empty
      //code to insert it into quadtree
      // i think it's condition is overloaded and not needed; double check after coffee !!!

      if(arrayLength(tree.quad[index].nodes)<1 && !tree.quad[index].isDivided){
          quadtree.mass++;
          quadtree.CoM.x = node.x;
          quadtree.CoM.y = node.y;
          quadtree.nodes[0] = nodes;
          return true;
      }
    
     if(!tree.quad[index].isDivided){
         //remove node data at that node
        let childP = tree.quad[index].node[0];
        //create a quad
        let quad:array<Quadtree> = partition(tree.quad[index]);
        let SE:Quadtree = quad[0];
        let SW: Quadtree = quad[1];
        let NE: Quadtree = quad[2];
        let NW: Quadtree = quad[3];
        //add that point to tree
        let treeLength = arrayLength(tree.quad);
        tree.quad[treeLength-1] = SE;
        tree.quad[treeLength] = SW;
        tree.quad[treeLength+1] = NE;
        tree.quad[treeLength+2] = NW;
        //check where does it exist among four
        insert(tree.quad[index].nodes[0], treeLength-1)||
        insert(tree.quad[index].nodes[0], treeLength) ||
        insert(tree.quad[index].nodes[0], treeLength+1) ||
        insert(tree.quad[index].nodes[0]), treeLength+2)
         //add new point to tree 
     }

     //you dont need to divide, there is already a division so just go through but dont forget to update mass and CoM
      let totalX:f32 = tree.quad[index].CoM.x*tree.quad[index].mass + node.x;
      let totalY:f32 = tree.quad[index].CoM.y*tree.quad[index].mass + node.y;
     //now new point is to be added; update the mass 
      tree.quad[index].mass+=1;
     //update the center of mass
      tree.quad[index].CoM.x = totalX/tree.quad[index].mass;
      tree.quad[index].CoM.y = totalY/tree.quad[index].mass;
     return (
        insert(node, treeLength-1)||
        insert(node, treeLength) ||
        insert(node, treeLength+1) ||
        insert(node, treeLength+2)
     );
  }

[[stage(compute), workgroup_size(1,1,1)]]
fn main([[builtin(global_invocation_id)]] global_id: vec3<u32>){
  let nodes_length:u32 = uniforms.nodes_length;
  let theta:f32 = uniforms.theta;
  if(global_id.x>=u32(uniforms.nodes_length)){
    return;
  }
  let node:Node = nodes.nodes[global_id.x];
  tree.insert(node);
}