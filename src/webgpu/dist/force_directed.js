"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var wgsl_1 = require("./wgsl");
var ForceDirected = /** @class */ (function () {
    function ForceDirected(device) {
        this.coolingFactor = 0.9;
        this.iterationCount = 10000;
        this.threshold = 100;
        this.force = 1000.0;
        this.device = device;
        this.nodeDataBuffer = this.device.createBuffer({
            size: 16,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        this.edgeDataBuffer = this.device.createBuffer({
            size: 16,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        this.adjMatrixBuffer = this.device.createBuffer({
            size: 16,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        this.forceDataBuffer = this.device.createBuffer({
            size: 16,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
        });
        this.treeBuffer = this.device.createBuffer({
            size: 16,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
        });
        this.lastIndexBuffer = this.device.createBuffer({
            size: 4,
            mappedAtCreation: true,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
        });
        new Int32Array(this.lastIndexBuffer.getMappedRange()).set([0]);
        this.lastIndexBuffer.unmap();
        this.uniformParameterBuffer = this.device.createBuffer({
            size: 16,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        this.createAdjMatrixPipeline = device.createComputePipeline({
            compute: {
                module: device.createShaderModule({
                    code: wgsl_1.create_adjacency_matrix
                }),
                entryPoint: "main"
            }
        });
        this.bindGroupLayoutTree = device.createBindGroupLayout({
            entries: [
                {
                    //node
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {
                        type: "read-only-storage"
                    }
                },
                {
                    //tree
                    binding: 1,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {
                        type: "storage"
                    }
                },
                {
                    //uniform parameter
                    binding: 2,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {
                        type: "uniform"
                    }
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {
                        type: "storage"
                    }
                },
            ]
        });
        this.treePipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [this.bindGroupLayoutTree]
        });
        this.computeTreePipeline = device.createComputePipeline({
            layout: this.treePipelineLayout,
            compute: {
                module: device.createShaderModule({
                    code: wgsl_1.buildTree
                }),
                entryPoint: "main"
            }
        });
        this.computeForcesPipeline = device.createComputePipeline({
            compute: {
                module: device.createShaderModule({
                    code: wgsl_1.compute_forces_combined
                }),
                entryPoint: "main"
            }
        });
        this.computeAttractForcesPipeline = device.createComputePipeline({
            compute: {
                module: device.createShaderModule({
                    code: wgsl_1.compute_forces_a
                }),
                entryPoint: "main"
            },
            layout: device.createPipelineLayout({
                bindGroupLayouts: [
                    device.createBindGroupLayout({
                        entries: [
                            {
                                binding: 0,
                                visibility: GPUShaderStage.COMPUTE,
                                buffer: {
                                    type: "read-only-storage"
                                }
                            },
                            {
                                binding: 1,
                                visibility: GPUShaderStage.COMPUTE,
                                buffer: {
                                    type: "read-only-storage"
                                }
                            },
                            {
                                binding: 2,
                                visibility: GPUShaderStage.COMPUTE,
                                buffer: {
                                    type: "storage"
                                }
                            },
                            {
                                binding: 3,
                                visibility: GPUShaderStage.COMPUTE,
                                buffer: {
                                    type: "uniform"
                                }
                            },
                        ]
                    }),
                ]
            })
        });
        this.applyForcesPipeline = device.createComputePipeline({
            compute: {
                module: device.createShaderModule({
                    code: wgsl_1.apply_forces
                }),
                entryPoint: "main"
            }
        });
        // Create a buffer to store the params, output, and min/max
        this.paramsBuffer = device.createBuffer({
            size: 4 * 4,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    }
    ForceDirected.prototype.runForces = function (nodeDataBuffer, edgeDataBuffer, nodeLength, edgeLength, coolingFactor, l, iterationCount, threshold, iterRef) {
        if (nodeDataBuffer === void 0) { nodeDataBuffer = this.nodeDataBuffer; }
        if (edgeDataBuffer === void 0) { edgeDataBuffer = this.edgeDataBuffer; }
        if (nodeLength === void 0) { nodeLength = 0; }
        if (edgeLength === void 0) { edgeLength = 0; }
        if (coolingFactor === void 0) { coolingFactor = this.coolingFactor; }
        if (l === void 0) { l = 0.05; }
        if (iterationCount === void 0) { iterationCount = this.iterationCount; }
        if (threshold === void 0) { threshold = this.threshold; }
        return __awaiter(this, void 0, void 0, function () {
            var upload, mapping, arrInstance, commandEncoder, createBindGroup, pass, iterationTimes, totalStart, applyBindGroup, bindGroupTree, treeComputePass, gpuReadTreeBuffer, arrayBuffer, resultTree, upload, mapping, commandEncoder, bindGroup, attractBindGroup, pass, pass, start, end, totalEnd, iterAvg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (nodeLength == 0 || edgeLength == 0) {
                            return [2 /*return*/];
                        }
                        console.log(l);
                        console.log(coolingFactor);
                        this.coolingFactor = coolingFactor;
                        this.nodeDataBuffer = nodeDataBuffer;
                        this.edgeDataBuffer = edgeDataBuffer;
                        this.threshold = threshold;
                        this.force = 100000;
                        upload = this.device.createBuffer({
                            size: 4 * 4,
                            usage: GPUBufferUsage.COPY_SRC,
                            mappedAtCreation: true
                        });
                        mapping = upload.getMappedRange();
                        new Uint32Array(mapping).set([nodeLength, edgeLength]);
                        new Float32Array(mapping).set([this.coolingFactor, l], 2);
                        upload.unmap();
                        this.adjMatrixBuffer = this.device.createBuffer({
                            size: nodeLength * nodeLength * 4,
                            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
                        });
                        this.treeBuffer = this.device.createBuffer({
                            size: (nodeLength + 1) * 4 * 12 * 4,
                            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
                        });
                        this.uniformParameterBuffer = this.device.createBuffer({
                            size: 8,
                            usage: GPUBufferUsage.UNIFORM,
                            mappedAtCreation: true
                        });
                        arrInstance = this.uniformParameterBuffer.getMappedRange();
                        new Uint8Array(arrInstance).set([nodeLength]);
                        new Float32Array(arrInstance).set([0.5], 1);
                        commandEncoder = this.device.createCommandEncoder();
                        commandEncoder.copyBufferToBuffer(upload, 0, this.paramsBuffer, 0, 4 * 4);
                        createBindGroup = this.device.createBindGroup({
                            layout: this.createAdjMatrixPipeline.getBindGroupLayout(0),
                            entries: [
                                {
                                    binding: 0,
                                    resource: {
                                        buffer: this.edgeDataBuffer
                                    }
                                },
                                {
                                    binding: 1,
                                    resource: {
                                        buffer: this.adjMatrixBuffer
                                    }
                                },
                                {
                                    binding: 2,
                                    resource: {
                                        buffer: this.paramsBuffer
                                    }
                                },
                            ]
                        });
                        pass = commandEncoder.beginComputePass();
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
                            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
                        });
                        iterationTimes = [];
                        totalStart = performance.now();
                        applyBindGroup = this.device.createBindGroup({
                            layout: this.applyForcesPipeline.getBindGroupLayout(0),
                            entries: [
                                {
                                    binding: 0,
                                    resource: {
                                        buffer: this.nodeDataBuffer
                                    }
                                },
                                {
                                    binding: 1,
                                    resource: {
                                        buffer: this.forceDataBuffer
                                    }
                                },
                            ]
                        });
                        bindGroupTree = this.device.createBindGroup({
                            layout: this.bindGroupLayoutTree,
                            entries: [
                                {
                                    binding: 0,
                                    resource: { buffer: this.nodeDataBuffer }
                                },
                                {
                                    binding: 1,
                                    resource: { buffer: this.treeBuffer }
                                },
                                {
                                    binding: 2,
                                    resource: { buffer: this.uniformParameterBuffer }
                                },
                                {
                                    binding: 3,
                                    resource: { buffer: this.lastIndexBuffer }
                                },
                            ]
                        });
                        treeComputePass = commandEncoder.beginComputePass();
                        treeComputePass.setPipeline(this.computeTreePipeline);
                        treeComputePass.setBindGroup(0, bindGroupTree);
                        treeComputePass.dispatch(nodeLength, 1, 1);
                        treeComputePass.endPass();
                        gpuReadTreeBuffer = this.device.createBuffer({
                            size: (nodeLength + 1) * 4 * 12 * 4,
                            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
                        });
                        commandEncoder.copyBufferToBuffer(this.treeBuffer, 0, gpuReadTreeBuffer, 0, nodeLength * 6);
                        return [4 /*yield*/, gpuReadTreeBuffer.mapAsync(GPUMapMode.READ)];
                    case 1:
                        _a.sent();
                        arrayBuffer = gpuReadTreeBuffer.getMappedRange();
                        resultTree = new Float32Array(arrayBuffer);
                        gpuReadTreeBuffer.unmap();
                        console.log(resultTree);
                        _a.label = 2;
                    case 2:
                        if (!(iterationCount > 0 &&
                            this.coolingFactor > 0.000001 &&
                            this.force >= 0)) return [3 /*break*/, 4];
                        iterationCount--;
                        upload = this.device.createBuffer({
                            size: 4 * 4,
                            usage: GPUBufferUsage.COPY_SRC,
                            mappedAtCreation: true
                        });
                        mapping = upload.getMappedRange();
                        new Uint32Array(mapping).set([nodeLength, edgeLength]);
                        new Float32Array(mapping).set([this.coolingFactor, l], 2);
                        upload.unmap();
                        commandEncoder = this.device.createCommandEncoder();
                        //commandEncoder.writeTimestamp();
                        commandEncoder.copyBufferToBuffer(upload, 0, this.paramsBuffer, 0, 4 * 4);
                        bindGroup = this.device.createBindGroup({
                            layout: this.computeForcesPipeline.getBindGroupLayout(0),
                            entries: [
                                {
                                    binding: 0,
                                    resource: {
                                        buffer: this.nodeDataBuffer
                                    }
                                },
                                {
                                    binding: 1,
                                    resource: {
                                        buffer: this.adjMatrixBuffer
                                    }
                                },
                                {
                                    binding: 2,
                                    resource: {
                                        buffer: this.forceDataBuffer
                                    }
                                },
                                {
                                    binding: 3,
                                    resource: {
                                        buffer: this.paramsBuffer
                                    }
                                },
                            ]
                        });
                        attractBindGroup = this.device.createBindGroup({
                            layout: this.computeAttractForcesPipeline.getBindGroupLayout(0),
                            entries: [
                                {
                                    binding: 0,
                                    resource: {
                                        buffer: this.nodeDataBuffer
                                    }
                                },
                                {
                                    binding: 1,
                                    resource: {
                                        buffer: this.edgeDataBuffer
                                    }
                                },
                                {
                                    binding: 2,
                                    resource: {
                                        buffer: this.forceDataBuffer
                                    }
                                },
                                {
                                    binding: 3,
                                    resource: {
                                        buffer: this.paramsBuffer
                                    }
                                },
                            ]
                        });
                        pass = commandEncoder.beginComputePass();
                        pass.setBindGroup(0, bindGroup);
                        pass.setPipeline(this.computeForcesPipeline);
                        pass.dispatch(nodeLength, 1, 1);
                        pass.endPass();
                        pass = commandEncoder.beginComputePass();
                        //commandEncoder.writeTimestamp();
                        // Run apply forces pass
                        pass.setBindGroup(0, applyBindGroup);
                        pass.setPipeline(this.applyForcesPipeline);
                        pass.dispatch(nodeLength, 1, 1);
                        pass.endPass();
                        this.device.queue.submit([commandEncoder.finish()]);
                        start = performance.now();
                        return [4 /*yield*/, this.device.queue.onSubmittedWorkDone()];
                    case 3:
                        _a.sent();
                        end = performance.now();
                        console.log("iteration time " + (end - start));
                        iterationTimes.push(end - start);
                        // this.maxForceResultBuffer.unmap();
                        // Read all of the forces applied.
                        // await gpuReadBuffer.mapAsync(GPUMapMode.READ);
                        // const arrayBuffer = gpuReadBuffer.getMappedRange();
                        // var output = new Float32Array(arrayBuffer);
                        // console.log(output);
                        this.coolingFactor = this.coolingFactor * coolingFactor;
                        return [3 /*break*/, 2];
                    case 4:
                        totalEnd = performance.now();
                        iterAvg = iterationTimes.reduce(function (a, b) {
                            return a + b;
                        }) / iterationTimes.length;
                        iterRef.current.innerText = "Completed in " + iterationTimes.length + " iterations with total time " + (totalEnd - totalStart) + " and average iteration time " + iterAvg;
                        return [2 /*return*/];
                }
            });
        });
    };
    return ForceDirected;
}());
exports["default"] = ForceDirected;

//# sourceMappingURL=force_directed.js.map
