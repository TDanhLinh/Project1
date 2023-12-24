// Biến block để truy cập vào vùng chứa đồ thị và thao tác với nó
let blocks = document.getElementsByClassName("graph");
// Các biến vertex, edge, weight_min, weight_max lần lượt lưu số đỉnh, số cạnh, trọng số min và trọng số max
const vertex = document.getElementById("Vertex");
const edge = document.getElementById("Edge");
const weight_min = document.getElementById("MinWeight");
const weight_max = document.getElementById("MaxWeight");

// Lưu id của đỉnh hiện tại
let cnt = 0;

// Khởi tạo nút mới có tọa độ x, y
const appendBlock = (x, y) => {
    const block = document.createElement("div");
    block.classList.add("block");
    block.style.left = `${y}px`;
    block.style.top = `${x}px`;
    block.style.transform = `translate(-50%,-50%)`;
    block.id = cnt;

    block.innerText = cnt++;
    blocks.appendChild(block);
}

// Hàm tìm đỉnh có khoảng cách nhỏ nhất từ tập các đỉnh chưa xét
function minDistance(dist, visited) {
    let min = Infinity;
    let min_index = -1;

    for (let v = 0; v <= vertex; v++) {
        if (visited[v] == false && dist[v] <= min) {
            min = dist[v];
            min_index = v;
        }
    }
    return min_index;
}
// Hàm dijsktra
const dijsktra = (el) => {
    let source = document.getElementById("Start");
    let startNode = parseInt(source.value);

    let dist = new Array(vertex + 1);
    let visited = new Array(vertex + 1);

    for (let i = 0; i <= vertex; i++) {
        dist[i] = Infinity;
        visited[i] = false;
    }

    dist[startNode] = 0;

    for (let count = 0; count <= vertex - 1; count++) {
        let u = minDistance(dist, visited);

        visited[u] = true;

        for (let v = 0; v <= vertex; v++) {
            if (!visited[v] && graph[u][v] != 0 && dist[u] != Infinity && dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
            }
        }
    }
}