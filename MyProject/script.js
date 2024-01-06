// Hàm tìm đỉnh có khoảng cách nhỏ nhất từ tập các đỉnh chưa xét cho Dijkstra
function minDistance(dist, V, sptSet) {
    let min = Number.MAX_VALUE;
    let min_index = -1;

    for (let v = 0; v < V; v++) {
        if (sptSet[v] == false && dist[v] <= min) {
            min = dist[v];
            min_index = v;
        }
    }
    return min_index;
}

// Hàm hiển thị đồ thị sau khi tìm được đường đi ngắn nhất bằng Dijkstra và lưu lại output vào file .txt
function printSolutionDijkstra(trace, V, graph, src, dest) {
    // Khởi tạo vùng lưu giá trị output vào 1 thẻ textarea có id = outputArea trong index.html để lưu vào file .txt
    const textArea = document.getElementById("outputArea");
    // Khởi tạo data cho node và edge phục vụ cho việc hiển thị đồ thị lên màn hình
    let nodes = new vis.DataSet();
    let edges = new vis.DataSet();

    // Kiểm tra đường đi đã được đi qua hay chưa
    let check = [];
    for (let i = 0; i < V; i++) {
        check[i] = [];
        for (let j = 0; j < V; j++) {
            check[i][j] = 0;
        }
    }

    // Thiết lập các node để hiển thị lên màn hình
    for (let i = 1; i <= V; i++) {
        nodes.add({ id: i, label: '' + i });
    }

    // Truy vết đường đi
    let path = [];
    let vertex = dest;
    let sum = 0;
    if (trace[vertex] === undefined) {
        // Gán giá trị cho textArea để lưu vào file txt
        // Coi textArea.value như string để lưu giá trị vào file txt
        textArea.value = 'Không tìm thấy được đi ngắn nhất từ ' + (src + 1) + ' đến ' + (dest + 1);
    }
    else {
        textArea.value = 'Đường đi ngắn nhất từ đỉnh ' + (src + 1) + ' đến đỉnh ' + (dest + 1) + ' là: \n';
        while (vertex !== undefined) {
            path.push(vertex + 1);
            if (trace[vertex] !== undefined) {
                if (check[trace[vertex]][vertex] === 0) {
                    // Thiết lập các cạnh để hiển thị lên màn hình
                    edges.add({ from: trace[vertex] + 1, to: vertex + 1, label: graph[trace[vertex]][vertex].toString() });
                    check[trace[vertex]][vertex] = 1;
                    sum += graph[trace[vertex]][vertex];
                }
            }
            vertex = trace[vertex];
        }
        // Gán giá trị cho textArea để lưu vào file txt
        // Coi textArea.value như string để lưu giá trị vào file txt
        textArea.value += path.reverse().join(' -> ') + ' ';
        textArea.value += '\nĐộ dài đường đi ngắn nhất là: ' + sum;
    }

    for (let i = 0; i < V; i++) {
        for (let j = 0; j < V; j++) {
            if (check[i][j] === 0 && graph[i][j] !== 0) {
                edges.add({ from: i + 1, to: j + 1, label: graph[i][j].toString(), color: 'black' });
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
    let dist = new Array(V);
    let sptSet = new Array(V);
    let trace = new Array(V);

    for (let i = 0; i < V; i++) {
        dist[i] = Number.MAX_VALUE;
        sptSet[i] = false;
    }

    dist[src] = 0;

    for (let count = 0; count < V - 1; count++) {
        let u = minDistance(dist, V, sptSet);
        sptSet[u] = true;

        for (let v = 0; v < V; v++) {
            if (!sptSet[v] && graph[u][v] != 0 && dist[u] != Number.MAX_VALUE && dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
                trace[v] = u;
            }
        }
    }

    printSolutionDijkstra(trace, V, graph, src, dest);
}

// Lưu output sau khi chạy thuật toán BellmanFord và xuất ra file txt
function printSolutionBellmanFord(graph, dis, V, E, src, trace) {
    // Khởi tạo vùng lưu giá trị output vào 1 thẻ textarea có id = outputArea trong index.html để lưu vào file .txt
    const textArea = document.getElementById("outputArea");
    /*
    for (let i = 0; i < E; i++) {
        for (let u = 0; u < V; u++) {
            for (let v = 0; v < V; v++) {
                if (graph[u][v] !== 0) {
                    if ((dis[u] != Number.MAX_VALUE) && (dis[u] + graph[u][v] < dis[v]))
                        console.log("Graph contains negative" + " weight cycle");
                }
            }
        }
    }
    */

    // Gán giá trị cho textArea để lưu vào file txt
    // Coi textArea.value như string để lưu giá trị vào file txt
    textArea.value = 'Khoảng cách ngắn nhất từ đỉnh ' + (src + 1) + ' đến các đỉnh khác là: \n';
    for (let i = 0; i < V; i++) {
        if (dis[i] !== 0) {
            // Truy vết đường đi
            let path = [];
            let vertex = i;
            if (trace[vertex] === undefined) {
                // Gán giá trị cho textArea để lưu vào file txt
                // Coi textArea.value như string để lưu giá trị vào file txt
                textArea.value += 'Không tìm thấy được đi ngắn nhất từ ' + (src + 1) + ' đến ' + (i + 1);
            }
            else {
                textArea.value += 'Đỉnh ' + (i + 1) + ':   ' + dis[i] + '\t';
                textArea.value += 'Đường đi ngắn nhất từ đỉnh ' + (src + 1) + ' đến đỉnh ' + (i + 1) + ' là: ';
                while (vertex !== undefined) {
                    path.push(vertex + 1);
                    vertex = trace[vertex];
                }
                // Gán giá trị cho textArea để lưu vào file txt
                // Coi textArea.value như string để lưu giá trị vào file txt
                textArea.value += path.reverse().join(' -> ') + ' ';
            }
            textArea.value += '\n';
        }
    }
}

// Thuật toán Bellman Ford
function BellmanFord(graph, V, E, src) {
    let dis = Array(V).fill(Number.MAX_VALUE);
    let trace = new Array(V);

    dis[src] = 0;

    for (let i = 1; i < V - 1; i++) {
        for (let j = 0; j < E; j++) {
            for (let u = 0; u < V; u++) {
                for (let v = 0; v < V; v++) {
                    if (graph[u][v] !== 0) {
                        if ((dis[u] + graph[u][v]) < dis[v]) {
                            dis[v] = dis[u] + graph[u][v];
                            trace[v] = u;
                        }
                    }
                }
            }
        }
    }
    printSolutionBellmanFord(graph, dis, V, E, src, trace);
}

// Lưu ouput sau khi chạy thuật toán Floyd và xuất ra file txt
function printSolutionFloyd(dist, V, trace) {
    // Khởi tạo vùng lưu giá trị output vào 1 thẻ textarea có id = outputArea trong index.html để lưu vào file .txt
    const textArea = document.getElementById("outputArea");
    // Gán giá trị cho textArea để lưu vào file txt
    // Coi textArea.value như string để lưu giá trị vào file txt
    textArea.value = 'Ma trận khoảng cách ngắn nhất giữa mọi cặp đỉnh là: \n';
    for (let i = 0; i < V; i++) {
        for (let j = 0; j < V; j++) {
            if (j === 0) {
                if (dist[i][j] === Number.MAX_VALUE) {
                    textArea.value += '∞\t';
                }
                else {
                    textArea.value += dist[i][j] + '\t';
                }
            }
            else {
                if (dist[i][j] === Number.MAX_VALUE) {
                    textArea.value += '\t∞\t';
                }
                else {
                    textArea.value += '\t' + dist[i][j] + '\t';
                }
            }
        }
        textArea.value += '\n';
    }
    textArea.value += '\n';
    
    // Truy vết lại để tạo ra ma trận P
    // Gán giá trị cho textArea để lưu vào file txt
    // Coi textArea.value như string để lưu giá trị vào file txt
    textArea.value += 'Ma trận P là: \n';
    for (let i = 0; i < V; i++) {
        for (let j = 0; j < V; j++) {
            if (j === 0) {
                if (dist[i][j] === Number.MAX_VALUE) {
                    textArea.value += '∞\t';
                }
                else {
                    textArea.value += (trace[i][j] + 1) + '\t';
                }
            }
            else {
                if (dist[i][j] === Number.MAX_VALUE) {
                    textArea.value += '\t∞\t';
                }
                else {
                    textArea.value += '\t' + (trace[i][j] + 1) + '\t';
                }
            }
        }
        textArea.value += '\n';
    }
}

function floyd(graph, V) {
    let dist = Array.from(Array(V), () => new Array(V).fill(0));
    let trace = Array.from(Array(V), () => new Array(V));

    for (let i = 0; i < V; i++) {
        for (let j = 0; j < V; j++) {
            trace[i][j] = i;
            if (graph[i][j] === 0) {
                dist[i][j] = Number.MAX_VALUE;
            }
            else {
                dist[i][j] = graph[i][j];
            }
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
                        trace[i][j] = trace[k][j];
                    }
                }
            }
        }
    }

    printSolutionFloyd(dist, V, trace);
}

// Lưu đồ thị bằng biến toàn cục
let Graph = [];
let V; // Lưu số đỉnh bằng biến toàn cục
let E; // Lưu số cạnh bằng biến toàn cục

// Sinh ra đồ thị mới có số đỉnh, số cạnh và trọng số chạy từ Min -> Max theo người dùng nhập
function newGraph() {
    // Lấy giá trị của số đỉnh, số cạnh và trọng số Min, Max của người dùng nhập
    const vertex = Number(document.getElementById("Vertex").value);
    const edge = Number(document.getElementById("Edge").value);
    const weightMin = Number(document.getElementById("MinWeight").value);
    const weightMax = Number(document.getElementById("MaxWeight").value);
    const textArea = document.getElementById("inputArea");

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

    let nodes = new vis.DataSet();
    let edges = new vis.DataSet();
    // Khởi tạo và hiển thị các đỉnh
    for (let i = 1; i <= vertex; i++) {
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

        edges.add({ from: u, to: v, label: w.toString() }); // Thêm cạnh u,v với trọng số w vào data
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

// Phần xử lý output 
const button = document.querySelector("#startButton");
const inputStartElement = document.getElementById("Start");
const inputEndElement = document.getElementById("End");

button.addEventListener("click", () => {
    const inputStartValue = Number(inputStartElement.value);
    const inputEndValue = Number(inputEndElement.value);

    // Chọn ra thuật toán
    const selectElement = document.querySelector(".form-select");
    //selectElement.addEventListener("change", () => {

    const selectedValue = selectElement.selectedOptions[0].value;

    // Gọi thuật toán tương ứng dựa trên lựa chọn
    if (selectedValue === "1") {
        dijkstra(Graph, V, inputStartValue - 1, inputEndValue - 1);
    } else if (selectedValue === "2") {
        BellmanFord(Graph, V, E, inputStartValue - 1);
    } else if (selectedValue === "3") {
        floyd(Graph, V);
    }
    // Phần này tương tự downloadInputFile
    const link = document.createElement("a");
    const content = document.getElementById("outputArea").value;
    const file = new Blob([content], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = "output.txt";
    link.click();
    URL.revokeObjectURL(link.href);
});

// Thêm event cho Lưu File Button khi bấm vào sẽ sinh data cho input file rồi tự tải xuống
const downloadInputFile = () => {
    const link = document.createElement("a"); // Tạo ra 1 thẻ a
    const content = document.getElementById("inputArea").value; // Set content cho thẻ a đó là 1 thẻ textArea có id = inputArea
    const file = new Blob([content], { type: 'text/plain' }); // Tạo ra 1 file với định dạng là text và có content được khởi tạo ở trên
    link.href = URL.createObjectURL(file); // Gắn url vào thẻ a
    link.download = "input.txt"; // Thêm phương thức download cho link và set tên có file download = input.txt
    link.click(); // Thêm event click để thực hiện thao tác download vào cho link
    URL.revokeObjectURL(link.href); // Gỡ phương thức download ra khỏi link để reset
};

// Phần này là để ngăn button hoạt động khi chưa nhập đủ input và chưa có đồ thị
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

// Khởi tạo để kèm dòng note dưới button bằng bootstrap
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

const inputArea = document.getElementById("inputArea");
const outputArea = document.getElementById("outputArea");

// Ẩn các thẻ textarea
inputArea.style.display = "none";
outputArea.style.display = "none";
