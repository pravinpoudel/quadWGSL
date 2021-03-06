import { buffer } from "d3";
import { size } from "mathjs";
import {
  compute_forces,
  apply_forces,
  compute_forces_a,
  create_adjacency_matrix,
  compute_forces_combined,
  buildTree,
} from "./wgsl";

class ForceDirected {
  public paramsBuffer: GPUBuffer;
  public nodeDataBuffer: GPUBuffer;
  public edgeDataBuffer: GPUBuffer;
  public adjMatrixBuffer: GPUBuffer;
  public forceDataBuffer: GPUBuffer;
  public treeBuffer: GPUBuffer;
  public lastIndexBuffer: GPUBuffer;
  public uniformParameterBuffer: GPUBuffer;
  public coolingFactor: number = 0.9;
  public device: GPUDevice;

  public bindGroupLayoutTree: GPUBindGroupLayout;
  public treePipelineLayout: GPUPipelineLayout;

  public computeTreePipeline: GPUComputePipeline;

  public createAdjMatrixPipeline: GPUComputePipeline;
  public computeForcesPipeline: GPUComputePipeline;
  public computeAttractForcesPipeline: GPUComputePipeline;
  public applyForcesPipeline: GPUComputePipeline;
  public iterationCount: number = 10000;
  public threshold: number = 100;
  public force: number = 1000.0;

  constructor(device: GPUDevice) {
    this.device = device;

    this.nodeDataBuffer = this.device.createBuffer({
      size: 16,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    this.edgeDataBuffer = this.device.createBuffer({
      size: 16,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    this.adjMatrixBuffer = this.device.createBuffer({
      size: 16,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    this.forceDataBuffer = this.device.createBuffer({
      size: 16,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });

    this.treeBuffer = this.device.createBuffer({
      size: 16,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });

    this.lastIndexBuffer = this.device.createBuffer({
      size: 4,
      mappedAtCreation: true,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });

    new Int32Array(this.lastIndexBuffer.getMappedRange()).set([0]);
    this.lastIndexBuffer.unmap();

    this.uniformParameterBuffer = this.device.createBuffer({
      size: 16,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.createAdjMatrixPipeline = device.createComputePipeline({
      compute: {
        module: device.createShaderModule({
          code: create_adjacency_matrix,
        }),
        entryPoint: "main",
      },
    });

    this.bindGroupLayoutTree = device.createBindGroupLayout({
      entries: [
        {
          //node
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: "read-only-storage" as GPUBufferBindingType,
          },
        },
        {
          //tree
          binding: 1,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: "storage" as GPUBufferBindingType,
          },
        },
        {
          //uniform parameter
          binding: 2,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: "uniform" as GPUBufferBindingType,
          },
        },

        {
          binding: 3,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: "storage" as GPUBufferBindingType,
          },
        },
      ],
    });

    this.treePipelineLayout = this.device.createPipelineLayout({
      bindGroupLayouts: [this.bindGroupLayoutTree],
    });

    this.computeTreePipeline = device.createComputePipeline({
      layout: this.treePipelineLayout,
      compute: {
        module: device.createShaderModule({
          code: buildTree,
        }),
        entryPoint: "main",
      },
    });

    this.computeForcesPipeline = device.createComputePipeline({
      compute: {
        module: device.createShaderModule({
          code: compute_forces_combined,
        }),
        entryPoint: "main",
      },
    });

    this.computeAttractForcesPipeline = device.createComputePipeline({
      compute: {
        module: device.createShaderModule({
          code: compute_forces_a,
        }),
        entryPoint: "main",
      },
      layout: device.createPipelineLayout({
        bindGroupLayouts: [
          device.createBindGroupLayout({
            entries: [
              {
                binding: 0,
                visibility: GPUShaderStage.COMPUTE,
                buffer: {
                  type: "read-only-storage" as GPUBufferBindingType,
                },
              },
              {
                binding: 1,
                visibility: GPUShaderStage.COMPUTE,
                buffer: {
                  type: "read-only-storage" as GPUBufferBindingType,
                },
              },
              {
                binding: 2,
                visibility: GPUShaderStage.COMPUTE,
                buffer: {
                  type: "storage" as GPUBufferBindingType,
                },
              },
              {
                binding: 3,
                visibility: GPUShaderStage.COMPUTE,
                buffer: {
                  type: "uniform" as GPUBufferBindingType,
                },
              },
            ],
          }),
        ],
      }),
    });

    this.applyForcesPipeline = device.createComputePipeline({
      compute: {
        module: device.createShaderModule({
          code: apply_forces,
        }),
        entryPoint: "main",
      },
    });

    // Create a buffer to store the params, output, and min/max
    this.paramsBuffer = device.createBuffer({
      size: 4 * 4,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
  }

  async runForces(
    nodeDataBuffer = this.nodeDataBuffer,
    edgeDataBuffer = this.edgeDataBuffer,
    nodeLength: number = 0,
    edgeLength: number = 0,
    coolingFactor = this.coolingFactor,
    l = 0.05,
    iterationCount = this.iterationCount,
    threshold = this.threshold,
    iterRef
  ) {
    if (nodeLength == 0 || edgeLength == 0) {
      return;
    }
    console.log(l);
    console.log(coolingFactor);
    this.coolingFactor = coolingFactor;
    this.nodeDataBuffer = nodeDataBuffer;
    this.edgeDataBuffer = edgeDataBuffer;
    this.threshold = threshold;
    this.force = 100000;

    // Set up params (node length, edge length) for creating adjacency matrix
    var upload = this.device.createBuffer({
      size: 4 * 4,
      usage: GPUBufferUsage.COPY_SRC,
      mappedAtCreation: true,
    });
    var mapping = upload.getMappedRange();
    new Uint32Array(mapping).set([nodeLength, edgeLength]);
    new Float32Array(mapping).set([this.coolingFactor, l], 2);
    upload.unmap();

    this.adjMatrixBuffer = this.device.createBuffer({
      size: nodeLength * nodeLength * 4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });

    this.treeBuffer = this.device.createBuffer({
      size: (nodeLength + 1) * 4 * 12 * 4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });

    this.uniformParameterBuffer = this.device.createBuffer({
      size: 8,
      usage: GPUBufferUsage.UNIFORM,
      mappedAtCreation: true,
    });

    let arrInstance = this.uniformParameterBuffer.getMappedRange();
    new Uint8Array(arrInstance).set([nodeLength]);
    new Float32Array(arrInstance).set([0.5], 1);

    var commandEncoder = this.device.createCommandEncoder();
    commandEncoder.copyBufferToBuffer(upload, 0, this.paramsBuffer, 0, 4 * 4);
    var createBindGroup = this.device.createBindGroup({
      layout: this.createAdjMatrixPipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this.edgeDataBuffer,
          },
        },
        {
          binding: 1,
          resource: {
            buffer: this.adjMatrixBuffer,
          },
        },
        {
          binding: 2,
          resource: {
            buffer: this.paramsBuffer,
          },
        },
      ],
    });
    var pass = commandEncoder.beginComputePass();
    pass.setBindGroup(0, createBindGroup);
    pass.setPipeline(this.createAdjMatrixPipeline);
    pass.dispatch(1, 1, 1);
    pass.endPass();
    // Log adjacency matrix
    // const gpuReadBuffer = this.device.createBuffer({
    //     size: nodeLength * nodeLength * 4,
    //     usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
    // });
    // // Encode commands for copying buffer to buffer.
    // commandEncoder.copyBufferToBuffer(
    //     this.adjMatrixBuffer /* source buffer */ ,
    //     0 /* source offset */ ,
    //     gpuReadBuffer /* destination buffer */ ,
    //     0 /* destination offset */ ,
    //     nodeLength * nodeLength * 4 /* size */
    // );
    this.device.queue.submit([commandEncoder.finish()]);

    // Log adjacency matrix (count should be equal to the number of nonduplicate edges)
    // await gpuReadBuffer.mapAsync(GPUMapMode.READ);
    // const arrayBuffer = gpuReadBuffer.getMappedRange();
    // var output = new Uint32Array(arrayBuffer);
    // var count = 0;
    // for (var i = 0; i < output.length; i++) {
    //     if (output[i] == 1) {
    //         count++;
    //     }
    // }
    // console.log(output);
    // console.log(count);

    this.forceDataBuffer = this.device.createBuffer({
      size: nodeLength * 2 * 4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });

    var iterationTimes: Array<number> = [];
    var totalStart = performance.now();
    var applyBindGroup = this.device.createBindGroup({
      layout: this.applyForcesPipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this.nodeDataBuffer,
          },
        },
        {
          binding: 1,
          resource: {
            buffer: this.forceDataBuffer,
          },
        },
      ],
    });

    const bindGroupTree = this.device.createBindGroup({
      layout: this.bindGroupLayoutTree,
      entries: [
        {
          binding: 0,
          resource: { buffer: this.nodeDataBuffer },
        },

        {
          binding: 1,
          resource: { buffer: this.treeBuffer },
        },

        {
          binding: 2,
          resource: { buffer: this.uniformParameterBuffer },
        },
        {
          binding: 3,
          resource: { buffer: this.lastIndexBuffer },
        },
      ],
    });

    var treeComputePass = commandEncoder.beginComputePass();
    treeComputePass.setPipeline(this.computeTreePipeline);
    treeComputePass.setBindGroup(0, bindGroupTree);
    treeComputePass.dispatch(nodeLength, 1, 1);
    treeComputePass.endPass();

    let gpuReadTreeBuffer = this.device.createBuffer({
      size: (nodeLength + 1) * 4 * 12 * 4,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });
    commandEncoder.copyBufferToBuffer(
      this.treeBuffer,
      0,
      gpuReadTreeBuffer,
      0,
      nodeLength * 6
    );
    
    await gpuReadTreeBuffer.mapAsync(GPUMapMode.READ);
    const arrayBuffer = gpuReadTreeBuffer.getMappedRange();
    var resultTree = new Float32Array(arrayBuffer);
    gpuReadTreeBuffer.unmap();
    console.log(resultTree);

    while (
      iterationCount > 0 &&
      this.coolingFactor > 0.000001 &&
      this.force >= 0
    ) {
      iterationCount--;
      // Set up params (node length, edge length)
      var upload = this.device.createBuffer({
        size: 4 * 4,
        usage: GPUBufferUsage.COPY_SRC,
        mappedAtCreation: true,
      });
      var mapping = upload.getMappedRange();
      new Uint32Array(mapping).set([nodeLength, edgeLength]);
      new Float32Array(mapping).set([this.coolingFactor, l], 2);
      upload.unmap();
      //this.device.createQuerySet({})
      var commandEncoder = this.device.createCommandEncoder();
      //commandEncoder.writeTimestamp();
      commandEncoder.copyBufferToBuffer(upload, 0, this.paramsBuffer, 0, 4 * 4);
      // Create bind group

      var bindGroup = this.device.createBindGroup({
        layout: this.computeForcesPipeline.getBindGroupLayout(0),
        entries: [
          {
            binding: 0,
            resource: {
              buffer: this.nodeDataBuffer,
            },
          },
          {
            binding: 1,
            resource: {
              buffer: this.adjMatrixBuffer,
            },
          },
          {
            binding: 2,
            resource: {
              buffer: this.forceDataBuffer,
            },
          },
          {
            binding: 3,
            resource: {
              buffer: this.paramsBuffer,
            },
          },
        ],
      });

      var attractBindGroup = this.device.createBindGroup({
        layout: this.computeAttractForcesPipeline.getBindGroupLayout(0),
        entries: [
          {
            binding: 0,
            resource: {
              buffer: this.nodeDataBuffer,
            },
          },
          {
            binding: 1,
            resource: {
              buffer: this.edgeDataBuffer,
            },
          },
          {
            binding: 2,
            resource: {
              buffer: this.forceDataBuffer,
            },
          },
          {
            binding: 3,
            resource: {
              buffer: this.paramsBuffer,
            },
          },
          // {
          //     binding:4,
          //     resource: {
          //         buffer: this.maxForceBuffer
          //     }
          // }
        ],
      });

      // Run attract forces pass
      // var pass = commandEncoder.beginComputePass();
      // pass.setBindGroup(0, attractBindGroup);
      // pass.setPipeline(this.computeAttractForcesPipeline);
      // pass.dispatch(1, 1, 1);
      // pass.endPass();
      // this.device.queue.submit([commandEncoder.finish()]);
      // var start : number = performance.now();
      // await this.device.queue.onSubmittedWorkDone();
      // var end : number = performance.now();
      // console.log(`attract force time: ${end - start}`)
      // var commandEncoder = this.device.createCommandEncoder();

      // Run compute forces pass
      var pass = commandEncoder.beginComputePass();
      pass.setBindGroup(0, bindGroup);
      pass.setPipeline(this.computeForcesPipeline);
      pass.dispatch(nodeLength, 1, 1);
      pass.endPass();

      // Testing timing of both passes (comment out when not debugging)
      // pass.endPass();
      // this.device.queue.submit([commandEncoder.finish()]);
      // var start : number = performance.now();
      // await this.device.queue.onSubmittedWorkDone();
      // var end : number = performance.now();
      // console.log(`compute force time: ${end - start}`)
      // var commandEncoder = this.device.createCommandEncoder();

      // const gpuReadBuffer = this.device.createBuffer({
      //     size: nodeLength * 2 * 4,
      //     usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
      // });
      // // Encode commands for copying buffer to buffer.
      // commandEncoder.copyBufferToBuffer(
      //     this.forceDataBuffer /* source buffer */ ,
      //     0 /* source offset */ ,
      //     gpuReadBuffer /* destination buffer */ ,
      //     0 /* destination offset */ ,
      //     nodeLength * 2 * 4 /* size */
      // );
      var pass = commandEncoder.beginComputePass();

      //commandEncoder.writeTimestamp();

      // Run apply forces pass
      pass.setBindGroup(0, applyBindGroup);
      pass.setPipeline(this.applyForcesPipeline);
      pass.dispatch(nodeLength, 1, 1);
      pass.endPass();

      this.device.queue.submit([commandEncoder.finish()]);
      var start: number = performance.now();
      await this.device.queue.onSubmittedWorkDone();
      var end: number = performance.now();
      console.log(`iteration time ${end - start}`);
      iterationTimes.push(end - start);

      // this.maxForceResultBuffer.unmap();
      // Read all of the forces applied.
      // await gpuReadBuffer.mapAsync(GPUMapMode.READ);
      // const arrayBuffer = gpuReadBuffer.getMappedRange();
      // var output = new Float32Array(arrayBuffer);
      // console.log(output);
      this.coolingFactor = this.coolingFactor * coolingFactor;
    }
    var totalEnd = performance.now();
    var iterAvg: number =
      iterationTimes.reduce(function (a, b) {
        return a + b;
      }) / iterationTimes.length;
    iterRef.current!.innerText = `Completed in ${
      iterationTimes.length
    } iterations with total time ${
      totalEnd - totalStart
    } and average iteration time ${iterAvg}`;
  }
}

export default ForceDirected;
