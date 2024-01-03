// Hàm tìm đỉnh có khoảng cách nhỏ nhất từ tập các đỉnh chưa xét cho Dijkstra
function minDistance(dist, V, sptSet) {
    let min = Number.MAX_VALUE;
    let min_index = -1;

    for (let v = 0; v < V; v++) {
        if (sptSet[v] == false && dist[v] <= min) {
            //console.log('Test: ' + v + ' ' + dist[v]);
            min = dist[v];
            min_index = v;
        }
    }
    return min_index;
}

function printSolutionDijkstra(trace, V, graph, src, dest) {
    //document.write("Vertex \t\t Distance from Source \t\t Path<br>");

    let nodes = new vis.DataSet();
    let edges = new vis.DataSet();

    let check = [];
    for (let i = 0; i < V; i++) {
        check[i] = [];
        for (let j = 0; j < V; j++) {
            check[i][j] = 0;
        }
    }

    for (let i = 0; i < V; i++) {
        nodes.add({ id: i, label: '' + i });
    }

    //for (let i = 0; i < V; i++) {
    //console.log(i + " \t\t " + dist[i] + " \t\t ");

    // Trace back to construct the path
    let path = [];
    let vertex = dest;
    if (trace[vertex] === undefined) {
        alert('Không tìm thấy được đi ngắn nhất từ ' + src + ' đến ' + dest);
    }
    else {
        while (vertex !== undefined) {
            path.push(vertex);
            if (trace[vertex] !== undefined) {
                if (check[trace[vertex]][vertex] === 0) {
                    console.log('vertex = ' + vertex + ' trace = ' + trace[vertex] + ' ' + graph[trace[vertex]][vertex]);
                    edges.add({ from: trace[vertex], to: vertex, label: graph[trace[vertex]][vertex].toString() });
                    check[trace[vertex]][vertex] = 1;
                }
            }
            vertex = trace[vertex];
        }
        //console.log(path.reverse().join(" -> "));
    }

    for (let i = 0; i < V; i++) {
        for (let j = 0; j < V; j++) {
            if (check[i][j] === 0 && graph[i][j] !== 0) {
                console.log('i = ' + i + ' j = ' + j + ' ' + graph[i][j]);
                edges.add({ from: i, to: j, label: graph[i][j].toString(), color: 'black' });
            }
        }
    }

    let data = {
        nodes: nodes,
        edges: edges,
    };
    // Tùy chỉnh css cho đồ thị
    let options = {
        nodes: {
            color: '#ffffff',
            fixed: false,
            font: '12px arial black',
            scaling: {
                label: true
            },
            shadow: true,
            shape: 'circle',
            margin: 10
        },
        edges: {
            arrows: 'to',
            color: 'orange',
            scaling: {
                label: true,
            },
            shadow: true,
        }
    };
    // Chỉ định vùng khởi tạo đồ thị
    let container = document.getElementById("mynetwork");
    // Hiển thị đồ thị với data được lưu ở trên cùng nơi hiển thị là container với css tùy chỉnh là option
    let network = new vis.Network(container, data, options);
}

function dijkstra(graph, V, src, dest) {
    //console.log("dijkstra work! " + V + ' ' + src + ' ' + dest);
    let dist = new Array(V);
    let sptSet = new Array(V);
    let trace = new Array(V);

    for (let i = 0; i < V; i++) {
        dist[i] = Number.MAX_VALUE;
        sptSet[i] = false;
    }

    dist[src] = 0;
    //console.log('src = ' + src);

    for (let count = 0; count < V - 1; count++) {
        let u = minDistance(dist, V, sptSet);
        //console.log('u = ' + u);
        sptSet[u] = true;

        for (let v = 0; v < V; v++) {
            if (!sptSet[v] && graph[u][v] != 0 && dist[u] != Number.MAX_VALUE && dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
                trace[v] = u;
                //console.log('trace: ' + trace[v]);
            }
        }
    }

    printSolutionDijkstra(trace, V, graph, src, dest);
}

function printSolutionBellmanFord(graph, dis, V, E) {
    for (let i = 0; i < E; i++) {
        for (let u = 0; u < V; u++) {
            for (let v = 0; v < V; v++) {
                if (graph[u][v] !== 0) {
                    if ((dis[u] != Number.MAX_VALUE) && (dis[u] + graph[u][v] < dis[v]))
                        document.write("Graph contains negative" + " weight cycle<br>");
                }
            }
        }
    }

    document.write("Vertex Distance from Source<br>");
    for (let i = 0; i < V; i++)
        document.write(i + "   " + dis[i] + "<br>");
}

function BellmanFord(graph, V, E, src) {
    let dis = Array(V).fill(Number.MAX_VALUE);

    dis[src] = 0;

    for (let i = 1; i < V - 1; i++) {
        for (let j = 0; j < E; j++) {
            for (let u = 0; u < V; u++) {
                for (let v = 0; v < V; v++) {
                    console.log('u = ' + u + 'v = ' + v + ' graph: ' + graph[u][v]);
                    if (graph[u][v] !== 0) {
                        if ((dis[u] + graph[u][v]) < dis[v])
                            dis[v] = dis[u] + graph[u][v];
                    }
                }
            }
        }
    }
    printSolutionBellmanFord(graph, dis, V, E);
}

function printSolutionFloyd(dist, V) {
    document.write("Following matrix shows the shortest " + "distances between every pair of vertices<br>");
    for (let i = 0; i < V; i++) {
        for (let j = 0; j < V; j++) {
            console.log('i = ' + i + 'j = ' + j + 'dist = ' + dist[i][j]);
            if (dist[i][j] === Number.MAX_VALUE) {
                document.write("    ∞   ");
            }
            else {
                document.write("    " + dist[i][j] + "   ");
            }
        }
        document.write("<br>");
    }
}

function floyd(graph, V) {
    //console.log("Floyd work!");
    let dist = Array.from(Array(V), () => new Array(V).fill(0));
    for (let i = 0; i < V; i++) {
        for (let j = 0; j < V; j++) {
            if (graph[i][j] === 0) {
                dist[i][j] = Number.MAX_VALUE;
            }
            else {
                dist[i][j] = graph[i][j];
            }
            //console.log('i = ' + i + ' j = ' + j + ' dist = ' + dist[i][j]);
        }
    }

    for (let k = 0; k < V; k++) {
        for (let i = 0; i < V; i++) {
            for (let j = 0; j < V; j++) {
                if (i == j) {
                    dist[i][j] = Number.MAX_VALUE;
                }
                else {
                    if (dist[i][j] >= (dist[i][k] + dist[k][j]) && (dist[k][j] != Number.MAX_VALUE && dist[i][k] != Number.MAX_VALUE)) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                    }
                }
            }
        }
    }

    printSolutionFloyd(dist, V);
}

// Lưu đồ thị bằng biến toàn cục
let Graph = [];
let V;
let E;

// Sinh ra đồ thị mới có số đỉnh, số cạnh và trọng số chạy từ Min -> Max theo người dùng nhập
function newGraph() {
    console.log("Test!");
    // Lấy giá trị của số đỉnh, số cạnh và trọng số Min, Max của người dùng nhập
    const vertex = Number(document.getElementById("Vertex").value);
    const edge = Number(document.getElementById("Edge").value);
    const weightMin = Number(document.getElementById("MinWeight").value);
    const weightMax = Number(document.getElementById("MaxWeight").value);
    const textArea = document.querySelector("textarea");

    V = vertex;
    E = edge;

    // Lưu đồ thị được sinh ra bằng biến cục bộ
    let graph = [];
    for (let i = 0; i < vertex; i++) {
        graph[i] = [];
        for (let j = 0; j < vertex; j++) {
            graph[i][j] = 0;
        }
    }
    /*
    console.log(vertex);
    console.log(edge);
    console.log(weightMin);
    console.log(weightMax);
 
    let nodes = new vis.DataSet([
        { id: 1, label: "Node 1" },
        { id: 2, label: "Node 2" },
        { id: 3, label: "Node 3" },
        { id: 4, label: "Node 4" },
        { id: 5, label: "Node 5" },
    ]);
    let edges = new vis.DataSet([
        { from: 1, to: 2, label: "21" },
        { from: 1, to: 3, label: "13" },
        { from: 2, to: 4, label: "24" },
        { from: 2, to: 5 },
        { from: 3, to: 4 },
    ]);
    */
    let nodes = new vis.DataSet();
    let edges = new vis.DataSet();
    // Khởi tạo và hiển thị các đỉnh
    for (let i = 0; i < vertex; i++) {
        nodes.add({ id: i, label: '' + i });
    }

    // Khởi tạo vào hiển thị các cạnh
    // Mảng check là mảng 2 chiều để kiểm tra xem các cạnh được tạo ra có trùng với cạnh đã có hay không
    let check = [];

    for (let i = 0; i < vertex; i++) {
        check[i] = [];
        for (let j = 0; j < vertex; j++) {
            check[i][j] = 0;
        }
    }

    textArea.value = vertex + ' ' + edge + '\n'; // Ghi dòng đầu tiên

    // Khởi tạo vào hiển thị các cạnh với trọng số nằm trong khoảng từ weightMin -> weightMax
    for (let i = 0; i < edge; i++) {
        let w = Math.floor(Math.random() * (weightMax - weightMin + 1)) + weightMin; // Sinh trọng số ư ngẫu nhiên từ Min -> Max
        let u, v;
        do {
            u = Math.floor(Math.random() * vertex) + 1; // Sinh đỉnh u ngẫu nhiên 
            v = Math.floor(Math.random() * vertex) + 1; // Sinh đỉnh v ngẫu nhiễn
        } while (check[u - 1][v - 1] === 1 || u === v); // Kiểm tra xem cặp đỉnh u, v có tồn tại không

        check[u - 1][v - 1] = 1;      // Đánh dấu lại cặp đỉnh u, v    

        graph[u - 1][v - 1] = w;

        textArea.value += (u - 1) + ' ' + (v - 1) + ' ' + w + '\n'; // Ghi các dòng tiếp theo

        edges.add({ from: (u - 1), to: (v - 1), label: w.toString() }); // Thêm cạnh u,v với trọng số w vào data
        console.log('u = ' + (u - 1) + '; v = ' + (v - 1) + '; w = ' + w + '; Min = ' + weightMin + '; Max = ' + weightMax);
    }

    for (let i = 0; i < vertex; i++) {
        Graph[i] = [];
        for (let j = 0; j < vertex; j++) {
            Graph[i][j] = graph[i][j];
        }
    }

    // Lưu lại data đã khởi tạo ở trên
    let data = {
        nodes: nodes,
        edges: edges
    };
    // Tùy chỉnh css cho đồ thị
    let options = {
        nodes: {
            color: '#ffffff',
            fixed: false,
            font: '12px arial black',
            scaling: {
                label: true
            },
            shadow: true,
            shape: 'circle',
            margin: 10
        },
        edges: {
            arrows: 'to',
            color: 'black',
            scaling: {
                label: true,
            },
            shadow: true,
        }
    };
    // Chỉ định vùng khởi tạo đồ thị
    let container = document.getElementById("mynetwork");
    // Hiển thị đồ thị với data được lưu ở trên cùng nơi hiển thị là container với css tùy chỉnh là option
    let network = new vis.Network(container, data, options);
}

const vertexInput = document.getElementById("Vertex");
const edgeInput = document.getElementById("Edge");
const weightMinInput = document.getElementById("MinWeight");
const weightMaxInput = document.getElementById("MaxWeight");
const spawnGraphButton = document.getElementById("SpawnGraph");

// Ngăn chặn button Sinh đồ thị hoạt động nếu không nhập đủ dữ liệu hoặc nhập Min > Max
spawnGraphButton.disabled = true;

vertexInput.addEventListener("input", () => {
    if (Number(vertexInput.value) == 0 || Number(edgeInput.value) == 0 || Number(weightMinInput.value) == 0 || Number(weightMaxInput.value) == 0) {
        spawnGraphButton.disabled = true;
        spawnGraphButton.style.pointerEvents = "none";
    }
    else {
        spawnGraphButton.disabled = false;
        spawnGraphButton.style.pointerEvents = "auto";
    }
});

edgeInput.addEventListener("input", () => {
    if (Number(vertexInput.value) == 0 || Number(edgeInput.value) == 0 || Number(weightMinInput.value) == 0 || Number(weightMaxInput.value) == 0) {
        spawnGraphButton.disabled = true;
        spawnGraphButton.style.pointerEvents = "none";
    }
    else {
        spawnGraphButton.disabled = false;
        spawnGraphButton.style.pointerEvents = "auto";
    }
});

weightMinInput.addEventListener("input", () => {
    const weightMin = Number(weightMinInput.value);
    const weightMax = Number(weightMaxInput.value);

    if (Number(vertexInput.value) == 0 || Number(edgeInput.value) == 0 || Number(weightMinInput.value) == 0 || Number(weightMaxInput.value) == 0) {
        spawnGraphButton.disabled = true;
        spawnGraphButton.style.pointerEvents = "none";
    } else {
        if (weightMin > weightMax) {
            spawnGraphButton.disabled = true;
            spawnGraphButton.style.pointerEvents = "none";
        } else {
            spawnGraphButton.disabled = false;
            spawnGraphButton.style.pointerEvents = "auto";
        }
    }
});

weightMaxInput.addEventListener("input", () => {
    const weightMin = Number(weightMinInput.value);
    const weightMax = Number(weightMaxInput.value);

    if (Number(vertexInput.value) == 0 || Number(edgeInput.value) == 0 || Number(weightMinInput.value) == 0 || Number(weightMaxInput.value) == 0) {
        spawnGraphButton.disabled = true;
        spawnGraphButton.style.pointerEvents = "none";
    } else {
        if (weightMin > weightMax) {
            spawnGraphButton.disabled = true;
            spawnGraphButton.style.pointerEvents = "none";
        } else {
            spawnGraphButton.disabled = false;
            spawnGraphButton.style.pointerEvents = "auto";
        }
    }
});

spawnGraphButton.addEventListener("click", () => {
    newGraph();
    saveButton.disabled = false;
    startButton.disabled = false;
});

// Hiển thị các ô input và button theo lựa chọn thuật toán
const selectElement = document.querySelector(".form-select");
const startInput = document.getElementById("Start");
const endInput = document.getElementById("End");
const startLabel = document.querySelector("label[for='Start']");
const endLabel = document.querySelector("label[for='End']");
const startButton = document.getElementById("startButton");
const saveButton = document.getElementById("saveFile");

selectElement.addEventListener("change", (event) => {
    const selectedAlgorithm = event.target.value;

    if (selectedAlgorithm === "1") { // Dijkstra's
        startInput.style.display = "block";
        endInput.style.display = "block";
        startLabel.style.display = "block";
        endLabel.style.display = "block";
        startButton.style.display = "block";
        saveButton.style.display = "block";
    } else if (selectedAlgorithm === "2") { // Bellman-Ford
        startInput.style.display = "block";
        startLabel.style.display = "block";
        endInput.style.display = "none";
        endLabel.style.display = "none";
        startButton.style.display = "block";
        saveButton.style.display = "block";
    } else { // Floyd-Warshall
        startInput.style.display = "none";
        startLabel.style.display = "none";
        endInput.style.display = "none";
        endLabel.style.display = "none";
        startButton.style.display = "block";
        saveButton.style.display = "block";
    }
});

// Ban đầu ẩn các phần tử Start, End, label Start và label End
startInput.style.display = "none";
endInput.style.display = "none";
startLabel.style.display = "none";
endLabel.style.display = "none";
startButton.style.display = "none";
saveButton.style.display = "none";
startButton.disabled = true;
saveButton.disabled = true;

const button = document.querySelector("#startButton");
const inputStartElement = document.getElementById("Start");
const inputEndElement = document.getElementById("End");

button.addEventListener("click", () => {
    const inputStartValue = Number(inputStartElement.value);
    const inputEndValue = Number(inputEndElement.value);
    console.log(inputStartValue + ' ' + inputEndValue);

    // Chọn ra thuật toán
    const selectElement = document.querySelector(".form-select");
    //selectElement.addEventListener("change", () => {

    const selectedValue = selectElement.selectedOptions[0].value;
    //console.log("Selected value:", selectedValue);

    // Call appropriate function based on the selected value:
    if (selectedValue === "1") {
        dijkstra(Graph, V, inputStartValue, inputEndValue);
    } else if (selectedValue === "2") {
        BellmanFord(Graph, V, E, inputStartValue);
    } else if (selectedValue === "3") {
        floyd(Graph, V);
    }
    //});
});

// Thêm event cho Lưu File Button khi bấm vào sẽ sinh data cho input file rồi tự tải xuống
const downloadInputFile = () => {
    const link = document.createElement("a");
    writeGraph(Graph, V, E);
    const content = document.querySelector("textarea").value;
    const file = new Blob([content], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = "input.txt";
    link.click();
    URL.revokeObjectURL(link.href);
};

// Thêm event cho Lưu File Button khi bấm vào sẽ sinh data cho input file rồi tự tải xuống
const downloadOutputFile = () => {
    const link = document.createElement("a");
    writeGraph(Graph, V, E);
    const content = document.querySelector("textarea").value;
    const file = new Blob([content], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = "output.txt";
    link.click();
    URL.revokeObjectURL(link.href);
};

// Khởi tạo để kèm dòng note dưới button bằng bootstrap
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))