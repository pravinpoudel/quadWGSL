(this["webpackJsonpreact-geneterrain"]=this["webpackJsonpreact-geneterrain"]||[]).push([[0],{24:function(e,t,i){},25:function(e,t,i){},31:function(e,t,i){"use strict";i.r(t);var n=i(0),r=i.n(n),a=i(18),o=i.n(a),s=(i(24),i(25),i(14)),u=i.n(s),l=i(19),f=i(6),c=i(7),d=i(10),g=i(9),p=i(16),h=i(8),v=i(33),m=i(34),b=i(15),x=i.n(b),y=i(2),B=function(e){Object(d.a)(i,e);var t=Object(g.a)(i);function i(e){var n;return Object(f.a)(this,i),(n=t.call(this,e)).state={nodeData:[]},n.handleSubmit=n.handleSubmit.bind(Object(h.a)(n)),n.readFiles=n.readFiles.bind(Object(h.a)(n)),n}return Object(c.a)(i,[{key:"handleSubmit",value:function(e){e.preventDefault(),this.props.setNodeData(this.state.nodeData)}},{key:"readFiles",value:function(e){var t=this,i=e.target.files;console.log(i);var n={},r=[],a=new FileReader;a.onload=function(e){console.log("not yet implemented edges")};var o=new FileReader;o.onload=function(e){var s,u=o.result.split("\n"),l=Object(p.a)(u);try{for(l.s();!(s=l.n()).done;){var f=s.value.split("\t");n[f[0]]&&r.push(parseFloat(n[f[0]]),parseFloat(f[1]),parseFloat(f[2]),parseFloat(f[3]))}}catch(c){l.e(c)}finally{l.f()}t.setState({nodeData:r}),a.readAsText(i[1])};var s=new FileReader;s.onload=function(e){var t,r=s.result.split("\n"),a=Object(p.a)(r);try{for(a.s();!(t=a.n()).done;){var u=t.value;n[u.split("\t")[0]]=u.split("\t")[1]}}catch(l){a.e(l)}finally{a.f()}o.readAsText(i[1])},s.readAsText(i[0])}},{key:"render",value:function(){var e=this;return Object(y.jsx)("div",{className:"sidebar",children:Object(y.jsxs)(v.a,{style:{color:"white"},onSubmit:this.handleSubmit,children:[Object(y.jsxs)(v.a.Group,{controlId:"formFile",className:"mt-3 mb-3",children:[Object(y.jsx)(v.a.Label,{children:"Select Example Files"}),Object(y.jsx)(v.a.Control,{className:"form-control",type:"file",multiple:!0,onChange:this.readFiles}),Object(y.jsx)(m.a,{className:"mt-2",type:"submit",variant:"secondary",value:"Submit",children:"Submit"})]}),Object(y.jsxs)(x.a,{trigger:"Terrain Options",children:[Object(y.jsxs)(v.a.Group,{children:[Object(y.jsx)(v.a.Label,{children:" Width Factor "}),Object(y.jsx)("br",{}),Object(y.jsx)("input",{type:"range",defaultValue:1e3,min:0,max:2e3,onChange:function(t){return e.props.setWidthFactor(parseFloat(t.target.value))}})]}),Object(y.jsxs)(v.a.Group,{children:[Object(y.jsx)(v.a.Label,{children:" Peak and Valley Values "}),Object(y.jsx)("br",{}),Object(y.jsx)("input",{type:"range",defaultValue:.8,min:.5,max:1,step:.01,onChange:function(t){return e.props.setPeakValue(parseFloat(t.target.value))}}),Object(y.jsx)("input",{type:"range",defaultValue:.2,min:0,max:.5,step:.01,onChange:function(t){return e.props.setValleyValue(parseFloat(t.target.value))}})]}),Object(y.jsx)(v.a.Group,{children:Object(y.jsx)(v.a.Check,{defaultChecked:!0,onClick:function(t){return e.props.setGlobalRange()},type:"checkbox",label:"Use Global Min/Max"})})]}),Object(y.jsxs)(x.a,{trigger:"Layers",children:[Object(y.jsx)(v.a.Check,{defaultChecked:!0,onClick:function(t){return e.props.toggleTerrainLayer()},type:"checkbox",label:"Terrain Layer"}),Object(y.jsx)(v.a.Check,{defaultChecked:!0,onClick:function(t){return e.props.toggleNodeLayer()},type:"checkbox",label:"Node Layer"})]})]})})}}]),i}(r.a.Component),P=function(){function e(){Object(f.a)(this,e),this.mousemove=void 0,this.press=void 0,this.wheel=void 0,this.mousemove=null,this.press=null,this.wheel=null}return Object(c.a)(e,[{key:"registerForCanvas",value:function(e){var t=null,i=this;e.addEventListener("mousemove",(function(n){n.preventDefault();var r=e.getBoundingClientRect(),a=[n.clientX-r.left,n.clientY-r.top];t?i.mousemove&&i.mousemove(t,a,n):t=[n.clientX-r.left,n.clientY-r.top],t=a})),e.addEventListener("mousedown",(function(t){t.preventDefault();var n=e.getBoundingClientRect(),r=[t.clientX-n.left,t.clientY-n.top];i.press&&i.press(r,t)})),e.addEventListener("wheel",(function(e){e.preventDefault(),i.wheel&&i.wheel(-e.deltaY)})),e.oncontextmenu=function(e){e.preventDefault()}}}]),e}(),_=function(){function e(t,i,n){Object(f.a)(this,e),this.rangeBuffer=void 0,this.pixelValueBuffer=void 0,this.paramsBuffer=void 0,this.nodeDataBuffer=void 0,this.device=void 0,this.width=void 0,this.height=void 0,this.computeTerrainPipeline=void 0,this.normalizeTerrainPipeline=void 0,this.computeTerrainBGLayout=void 0,this.normalizeTerrainBGLayout=void 0,this.nodeData=[],this.device=t,this.width=i,this.height=n,this.nodeDataBuffer=this.device.createBuffer({size:16,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.rangeBuffer=this.device.createBuffer({size:8,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC});var r="storage",a="uniform";this.computeTerrainBGLayout=t.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:r}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:a}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:r}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:r}}]}),this.computeTerrainPipeline=t.createComputePipeline({layout:t.createPipelineLayout({bindGroupLayouts:[this.computeTerrainBGLayout]}),compute:{module:t.createShaderModule({code:"// compute terrain wgsl\nstruct Node {\n    value : f32;\n    x : f32;\n    y : f32;\n    size : f32;\n};\n[[block]] struct Nodes {\n    nodes : array<Node>;\n};\n[[block]] struct Uniforms {\n  image_width : u32;\n  image_height : u32;\n  nodes_length : u32;\n  width_factor : f32;\n  view_box : vec4<f32>;\n};\n[[block]] struct Pixels {\n    pixels : array<f32>;\n};\n[[block]] struct Range {\n    x : atomic<i32>;\n    y : atomic<i32>;\n};\n\n[[group(0), binding(0)]] var<storage, read> nodes : Nodes;\n[[group(0), binding(1)]] var<uniform> uniforms : Uniforms;\n[[group(0), binding(2)]] var<storage, write> pixels : Pixels;\n[[group(0), binding(3)]] var<storage, read_write> range : Range;\n\n[[stage(compute), workgroup_size(1, 1, 1)]]\nfn main([[builtin(global_invocation_id)]] global_id : vec3<u32>) {\n    var pixel_index : u32 = global_id.x + global_id.y * uniforms.image_width;\n    var x : f32 = f32(global_id.x) / f32(uniforms.image_width);\n    var y : f32 = f32(global_id.y) / f32(uniforms.image_height);\n    x = x * (uniforms.view_box.z - uniforms.view_box.x) + uniforms.view_box.x;\n    y = y * (uniforms.view_box.w - uniforms.view_box.y) + uniforms.view_box.y;\n    var value : f32 = 0.0;\n\n    for (var i : u32 = 0u; i < uniforms.nodes_length; i = i + 1u) {\n        var sqrDistance : f32 = (x - nodes.nodes[i].x) * (x - nodes.nodes[i].x) + (y - nodes.nodes[i].y) * (y - nodes.nodes[i].y);\n        value = value + nodes.nodes[i].value / (sqrDistance * uniforms.width_factor + 1.0);\n    }\n    value = value * 100.0;\n    ignore(atomicMin(&range.x, i32(floor(value))));\n    ignore(atomicMax(&range.y, i32(ceil(value))));\n    pixels.pixels[pixel_index] = value;\n}"}),entryPoint:"main"}}),this.normalizeTerrainBGLayout=t.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:r}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:a}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:r}}]}),this.normalizeTerrainPipeline=t.createComputePipeline({layout:t.createPipelineLayout({bindGroupLayouts:[this.normalizeTerrainBGLayout]}),compute:{module:t.createShaderModule({code:"// normalize terrain wgsl\n[[block]] struct Uniforms {\n  image_width : u32;\n  image_height : u32;\n  nodes_length : u32;\n  width_factor : f32;\n};\n[[block]] struct Pixels {\n    pixels : array<f32>;\n};\n[[block]] struct Range {\n    x : i32;\n    y : i32;\n};\n\n[[group(0), binding(0)]] var<storage, write> pixels : Pixels;\n[[group(0), binding(1)]] var<uniform> uniforms : Uniforms;\n[[group(0), binding(2)]] var<storage, read_write> range : Range;\n\n[[stage(compute), workgroup_size(1, 1, 1)]]\nfn main([[builtin(global_invocation_id)]] global_id : vec3<u32>) {\n    var pixel_index : u32 = global_id.x + global_id.y * uniforms.image_width;\n    pixels.pixels[pixel_index] = (pixels.pixels[pixel_index] - f32(range.x)) / f32(range.y - range.x);\n}"}),entryPoint:"main"}}),this.paramsBuffer=t.createBuffer({size:32,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.pixelValueBuffer=t.createBuffer({size:this.width*this.height*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC})}return Object(c.a)(e,[{key:"computeTerrain",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.nodeData,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1e3,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[0,0,1,1],n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null;if(0!=e.length){this.nodeData=e,this.nodeDataBuffer=this.device.createBuffer({size:4*e.length,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST,mappedAtCreation:!0}),new Float32Array(this.nodeDataBuffer.getMappedRange()).set(e),this.nodeDataBuffer.unmap(),this.rangeBuffer=n||this.device.createBuffer({size:8,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC});var r=this.device.createBuffer({size:32,usage:GPUBufferUsage.COPY_SRC,mappedAtCreation:!0}),a=r.getMappedRange();new Uint32Array(a).set([this.width,this.height,e.length/4]),new Float32Array(a).set([t,i[0],i[1],i[2],i[3]],3),r.unmap();var o=this.device.createCommandEncoder();o.copyBufferToBuffer(r,0,this.paramsBuffer,0,32);var s=this.device.createBindGroup({layout:this.computeTerrainBGLayout,entries:[{binding:0,resource:{buffer:this.nodeDataBuffer}},{binding:1,resource:{buffer:this.paramsBuffer}},{binding:2,resource:{buffer:this.pixelValueBuffer}},{binding:3,resource:{buffer:this.rangeBuffer}}]}),u=o.beginComputePass();u.setBindGroup(0,s),u.setPipeline(this.computeTerrainPipeline),u.dispatch(this.width,this.height,1);s=this.device.createBindGroup({layout:this.normalizeTerrainBGLayout,entries:[{binding:0,resource:{buffer:this.pixelValueBuffer}},{binding:1,resource:{buffer:this.paramsBuffer}},{binding:2,resource:{buffer:this.rangeBuffer}}]});u.setBindGroup(0,s),u.setPipeline(this.normalizeTerrainPipeline),u.dispatch(this.width,this.height,1),u.endPass(),this.device.queue.submit([o.finish()])}}}]),e}(),w=_,U=function(){function e(t,i,n,r){if(Object(f.a)(this,e),this.uniform2DBuffer=null,this.terrainGenerator=null,this.device=void 0,this.bindGroup2D=null,this.nodeBindGroup=null,this.nodePositionBuffer=null,this.nodePipeline=null,this.nodeLength=1,this.rangeBuffer=null,this.nodeToggle=!0,this.terrainToggle=!0,this.device=i,null!==n.current){var a=n.current.getContext("webgpu"),o=window.devicePixelRatio||1,s=[n.current.clientWidth*o,n.current.clientHeight*o],u=a.getPreferredFormat(t);a.configure({device:i,format:u,size:s}),this.rangeBuffer=this.device.createBuffer({size:8,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),this.nodePositionBuffer=i.createBuffer({size:48,usage:GPUBufferUsage.VERTEX,mappedAtCreation:!0}),new Float32Array(this.nodePositionBuffer.getMappedRange()).set([1,-1,-1,-1,-1,1,1,-1,-1,1,1,1]),this.nodePositionBuffer.unmap(),this.nodePipeline=i.createRenderPipeline({vertex:{module:i.createShaderModule({code:"// Vertex shader\nstruct VertexOutput {\n    [[builtin(position)]] Position : vec4<f32>;\n    [[location(0)]] position: vec2<f32>;\n    [[location(1), interpolate(flat)]] center : vec2<f32>;\n};\n[[block]] struct Uniforms {\n  view_box : vec4<f32>;\n};\n\n[[group(0), binding(0)]] var<uniform> uniforms : Uniforms;\n[[stage(vertex)]]\nfn main([[location(0)]] position : vec2<f32>)\n     -> VertexOutput {\n    var output : VertexOutput;\n    var inv_zoom : f32 = uniforms.view_box.z - uniforms.view_box.x;\n    var expected_x : f32 = 0.5 * (1.0 - inv_zoom); \n    var expected_y : f32 = 0.5 * (1.0 - inv_zoom);\n    // view_box expected to be between 0 and 1, panning need to be doubled as clip space is (-1, 1)\n    var x : f32 = (position.x - 2.0 * (uniforms.view_box.x - expected_x)) / inv_zoom;\n    var y : f32 = (position.y - 2.0 * (uniforms.view_box.y - expected_y)) / inv_zoom;\n    output.Position = vec4<f32>(x, y, 0.0, 1.0);\n    output.position = position;\n    // flat interpolated position will give bottom right corner, so translate to center\n    output.center = output.position + vec2<f32>(-0.01, 0.01);\n    return output;\n}"}),entryPoint:"main",buffers:[{arrayStride:8,attributes:[{format:"float32x2",offset:0,shaderLocation:0}]}]},fragment:{module:i.createShaderModule({code:"[[stage(fragment)]]\nfn main([[location(0)]] position: vec2<f32>, [[location(1), interpolate(flat)]] center: vec2<f32>) -> [[location(0)]] vec4<f32> {\n    if (distance(position, center) > 0.005) {\n        discard;\n    }\n    return vec4<f32>(0.0, 0.0, 0.0, (1.0 - distance(position, center) * 200));\n}\n"}),entryPoint:"main",targets:[{format:u}]},primitive:{topology:"triangle-list"},multisample:{count:4}});var l=i.createRenderPipeline({vertex:{module:i.createShaderModule({code:"// Vertex shader\nstruct VertexOutput {\n  [[builtin(position)]] Position : vec4<f32>;\n  [[location(0)]] fragPosition: vec4<f32>;\n};\n\n[[stage(vertex)]]\nfn main([[location(0)]] position : vec4<f32>)\n     -> VertexOutput {\n    var output : VertexOutput;\n    output.Position = position;\n    output.fragPosition = 0.5 * (position + vec4<f32>(1.0, 1.0, 1.0, 1.0));\n    return output;\n}\n\n\n"}),entryPoint:"main",buffers:[{arrayStride:16,attributes:[{format:"float32x4",offset:0,shaderLocation:0}]}]},fragment:{module:i.createShaderModule({code:"// Fragment shader\n[[block]] struct Pixels {\n    pixels : array<f32>;\n};\n[[block]] struct Uniforms {\n    peak_value : f32;\n    valley_value : f32;\n};\n[[block]] struct Image {\n    width : u32;\n    height : u32;\n};\n\n[[group(0), binding(0)]] var myTexture: texture_2d<f32>;\n[[group(0), binding(1)]] var<storage, read> pixels : Pixels;\n[[group(0), binding(2)]] var<uniform> uniforms : Uniforms;\n[[group(0), binding(3)]] var<uniform> image_size : Image;\n\nfn outside_grid(p : vec2<u32>) -> bool {\n    return any(p == vec2<u32>(u32(0))) || p.x == image_size.width || p.y == image_size.height;\n}\n\n[[stage(fragment)]]\nfn main([[location(0)]] fragPosition: vec4<f32>) -> [[location(0)]] vec4<f32> {\n    var ufragPos : vec4<u32> = vec4<u32>(fragPosition * f32(image_size.width));\n    var pixelIndex : u32 = ufragPos.x + ufragPos.y * image_size.width;\n    var value : f32 = pixels.pixels[pixelIndex];\n    if (!outside_grid(ufragPos.xy)){\n        var neighbor_peaks : vec4<bool> = vec4<bool>(\n            pixels.pixels[pixelIndex - image_size.width] >= uniforms.peak_value ,\n            pixels.pixels[pixelIndex - u32(1)] >= uniforms.peak_value,\n            pixels.pixels[pixelIndex + u32(1)] >= uniforms.peak_value,\n            pixels.pixels[pixelIndex + image_size.width] >= uniforms.peak_value\n        );\n        var neighbor_valleys : vec4<bool> = vec4<bool>(\n            pixels.pixels[pixelIndex - image_size.width] <= uniforms.valley_value,\n            pixels.pixels[pixelIndex - u32(1)] <= uniforms.valley_value,\n            pixels.pixels[pixelIndex + u32(1)] <= uniforms.valley_value,\n            pixels.pixels[pixelIndex + image_size.width] <= uniforms.valley_value\n        ); \n        if (any(neighbor_peaks) && value < uniforms.peak_value) {\n            return vec4<f32>(0.8, 0.5, 0.5, 1.0);\n        }\n        if (any(neighbor_valleys) && value > uniforms.valley_value) {\n            return vec4<f32>(0.5, 0.3, 0.3, 1.0);\n        }\n    }\n    var color : vec4<f32> = textureLoad(myTexture, vec2<i32>(i32(value * 180.0), 1), 0);\n    return color;\n}"}),entryPoint:"main",targets:[{format:u}]},primitive:{topology:"triangle-list"},multisample:{count:4}}),c=i.createBuffer({size:96,usage:GPUBufferUsage.VERTEX,mappedAtCreation:!0});new Float32Array(c.getMappedRange()).set([1,-1,0,1,-1,-1,0,1,-1,1,0,1,1,-1,0,1,-1,1,0,1,1,1,0,1]),c.unmap(),this.uniform2DBuffer=i.createBuffer({size:8,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),i.queue.writeBuffer(this.uniform2DBuffer,0,new Float32Array([.8,.2]),0,2);var d=i.createBuffer({size:8,usage:GPUBufferUsage.UNIFORM,mappedAtCreation:!0});new Uint32Array(d.getMappedRange()).set(s),d.unmap();i.createBuffer({size:16,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});var g=i.createTexture({size:[r.width,r.height,1],format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});i.queue.copyExternalImageToTexture({source:r},{texture:g},[r.width,r.height,1]),this.terrainGenerator=new w(i,s[0],s[1]),this.bindGroup2D=i.createBindGroup({layout:l.getBindGroupLayout(0),entries:[{binding:0,resource:g.createView()},{binding:1,resource:{buffer:this.terrainGenerator.pixelValueBuffer}},{binding:2,resource:{buffer:this.uniform2DBuffer}},{binding:3,resource:{buffer:d}}]});var p=i.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});i.queue.writeBuffer(p,0,new Float32Array([0,0,1,1]),0,4);var h=[0,0,1,1],v=[0,0,1,1],m=new P,b=this.terrainGenerator,x=this;m.mousemove=function(e,t,n){if(1==n.buttons){var r=[(t[0]-e[0])*(h[2]-h[0])/s[0],(e[1]-t[1])*(h[3]-h[1])/s[1]];v=[v[0]-r[0],v[1]-r[1],v[2]-r[0],v[3]-r[1]],(Math.abs(v[0]-h[0])>.03*(h[2]-h[0])||Math.abs(v[1]-h[1])>.03*(h[3]-h[1]))&&(h=v,x.terrainToggle&&b.computeTerrain(void 0,void 0,h,x.rangeBuffer),x.nodeToggle&&i.queue.writeBuffer(p,0,new Float32Array(h),0,4))}},m.wheel=function(e){var t=[e/1e4,e/1e4];(v=[v[0]+t[0],v[1]+t[1],v[2]-t[0],v[3]-t[1]])[2]-v[0]>.01&&v[3]-v[1]>.01?(h=v,x.terrainToggle&&b.computeTerrain(void 0,void 0,h,x.rangeBuffer),x.nodeToggle&&i.queue.writeBuffer(p,0,new Float32Array(h),0,4)):v=h},m.registerForCanvas(n.current);var y=i.createBindGroup({layout:this.nodePipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:p}}]}),B=i.createTexture({size:s,sampleCount:4,format:u,usage:GPUTextureUsage.RENDER_ATTACHMENT}).createView();x=this;requestAnimationFrame((function e(){if(n.current){var t=i.createCommandEncoder(),r={colorAttachments:[{view:B,resolveTarget:a.getCurrentTexture().createView(),loadValue:{r:1,g:1,b:1,a:1},storeOp:"discard"}]},o=t.beginRenderPass(r);x.terrainToggle&&(o.setPipeline(l),o.setVertexBuffer(0,c),o.setBindGroup(0,x.bindGroup2D),o.draw(6,1,0,0)),x.nodeToggle&&(o.setPipeline(x.nodePipeline),o.setVertexBuffer(0,x.nodePositionBuffer),o.setBindGroup(0,y),o.draw(6*x.nodeLength,1,0,0)),o.endPass(),i.queue.submit([t.finish()]),requestAnimationFrame(e)}}))}}return Object(c.a)(e,[{key:"setNodeData",value:function(e){this.terrainGenerator.computeTerrain(e,void 0,void 0,this.rangeBuffer);for(var t=[],i=.01,n=0;n<e.length;n+=4){var r=2*e[n+1]-1,a=2*e[n+2]-1;t.push(r+i,a-i,r-i,a-i,r-i,a+i,r+i,a-i,r-i,a+i,r+i,a+i)}this.nodePositionBuffer=this.device.createBuffer({size:4*t.length,usage:GPUBufferUsage.VERTEX,mappedAtCreation:!0}),new Float32Array(this.nodePositionBuffer.getMappedRange()).set(t),this.nodePositionBuffer.unmap(),this.nodeLength=e.length/4}},{key:"setWidthFactor",value:function(e){this.terrainGenerator.computeTerrain(void 0,e,void 0,this.rangeBuffer)}},{key:"setPeakValue",value:function(e){this.device.queue.writeBuffer(this.uniform2DBuffer,0,new Float32Array([e]),0,1)}},{key:"setValleyValue",value:function(e){this.device.queue.writeBuffer(this.uniform2DBuffer,4,new Float32Array([e]),0,1)}},{key:"setGlobalRange",value:function(){this.rangeBuffer?this.rangeBuffer=null:this.rangeBuffer=this.device.createBuffer({size:8,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC})}},{key:"toggleTerrainLayer",value:function(){this.terrainToggle=!this.terrainToggle}},{key:"toggleNodeLayer",value:function(){this.nodeToggle=!this.nodeToggle}}]),e}(),G=function(e){Object(d.a)(i,e);var t=Object(g.a)(i);function i(e){var r;return Object(f.a)(this,i),(r=t.call(this,e)).state={widthFactor:1e3,canvasRef:Object(n.createRef)(),renderer:null},r}return Object(c.a)(i,[{key:"componentDidMount",value:function(){var e=Object(l.a)(u.a.mark((function e(){var t,i,n,r;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,navigator.gpu.requestAdapter();case 2:return t=e.sent,e.next=5,t.requestDevice();case 5:return i=e.sent,(n=new Image).src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAABCAYAAAB3yoT0AAAAOklEQVQokc3QsQrAIBBEwTEI+v9fG0E8e0kKu6se7HRbiFBR0X+azVpg4j36teWwx0px3Y2VkeK6K9uFnl0AGQ1BkQAAAABJRU5ErkJggg==",e.next=10,n.decode();case 10:return e.next=12,createImageBitmap(n);case 12:r=e.sent,this.setState({renderer:new U(t,i,this.state.canvasRef,r)});case 14:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"setNodeData",value:function(e){this.state.renderer.setNodeData(e)}},{key:"setWidthFactor",value:function(e){this.state.renderer.setWidthFactor(e)}},{key:"setPeakValue",value:function(e){this.state.renderer.setPeakValue(e)}},{key:"setValleyValue",value:function(e){this.state.renderer.setValleyValue(e)}},{key:"setGlobalRange",value:function(){this.state.renderer.setGlobalRange()}},{key:"toggleNodeLayer",value:function(){this.state.renderer.toggleNodeLayer()}},{key:"toggleTerrainLayer",value:function(){this.state.renderer.toggleTerrainLayer()}},{key:"render",value:function(){return Object(y.jsxs)("div",{children:[Object(y.jsx)(B,{setValleyValue:this.setValleyValue.bind(this),setPeakValue:this.setPeakValue.bind(this),setWidthFactor:this.setWidthFactor.bind(this),setNodeData:this.setNodeData.bind(this),setGlobalRange:this.setGlobalRange.bind(this),toggleNodeLayer:this.toggleNodeLayer.bind(this),toggleTerrainLayer:this.toggleTerrainLayer.bind(this)}),Object(y.jsx)("div",{className:"canvasContainer",children:Object(y.jsx)("canvas",{ref:this.state.canvasRef,width:800,height:800})})]})}}]),i}(r.a.Component),O=G;var T=function(){return Object(y.jsx)("div",{className:"App",children:Object(y.jsx)(O,{})})};o.a.render(Object(y.jsx)(r.a.StrictMode,{children:Object(y.jsx)(T,{})}),document.getElementById("root"))}},[[31,1,2]]]);
//# sourceMappingURL=main.22602008.chunk.js.map