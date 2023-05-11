import React, { useState, useEffect } from "react";

function Matrix() {
    const MATRIX_SIZE = parseInt(process.env.REACT_APP_MATRIX_SIZE);
    const START_X = parseInt(process.env.REACT_APP_START_X);
    const START_Y = parseInt(process.env.REACT_APP_START_Y);
    const END_X = parseInt(process.env.REACT_APP_END_X);
    const END_Y = parseInt(process.env.REACT_APP_END_Y);
    const BLOCKING_OBJECTS = parseInt(process.env.REACT_APP_BLOCKING_OBJECTS);

    const [matrix, setMatrix] = useState([]);
    const [path, setPath] = useState([])
    const [executionTime, setExecutionTime] = useState(null);

    useEffect(() => {
        // Stvori novu matricu
        const newMatrix = [];
        for (let i = 0; i < MATRIX_SIZE; i++) {
            const newRow = [];
            for (let j = 0; j < MATRIX_SIZE; j++) {
                newRow.push("cell");
            }
            newMatrix.push(newRow);
        }
        setMatrix(newMatrix);

        let count = 0;
        while (count < BLOCKING_OBJECTS) {
            const x = Math.floor(Math.random() * MATRIX_SIZE);
            const y = Math.floor(Math.random() * MATRIX_SIZE);
            if (
                newMatrix[y][x] !== "start" &&
                newMatrix[y][x] !== "end" &&
                newMatrix[y][x] !== "obstacle"
            ) {
                newMatrix[y][x] = "obstacle";
                count++;
            }
        }
    }, []);


    function findPath() {
        const t0 = performance.now();
        const queue = [[START_X, START_Y]];
        const visited = new Set();
        const parent = {};
        visited.add(`${START_X},${START_Y}`);
        while (queue.length > 0) {
            const [x, y] = queue.shift();
            if (x === END_X && y === END_Y) {
                break;
            }
            const neighbors = getNeighbors(x, y);
            for (const [nx, ny] of neighbors) {
                const key = `${nx},${ny}`;
                if (!visited.has(key)) {
                    visited.add(key);
                    queue.push([nx, ny]);
                    parent[key] = [x, y];
                }
            }
        }
        const shortestPath = [];
        let current = [END_X, END_Y];
        while (current !== undefined) {
            shortestPath.push(current);
            current = parent[`${current[0]},${current[1]}`];
        }
        shortestPath.reverse();
        setPath(shortestPath);
        const t1 = performance.now();
        setExecutionTime(t1 - t0);
    }

    function getNeighbors(x, y) {
        const neighbors = [];
        if (x > 0 && matrix[y][x - 1] !== "obstacle") {
            neighbors.push([x - 1, y]);
        }
        if (y > 0 && matrix[y - 1][x] !== "obstacle") {
            neighbors.push([x, y - 1]);
        }
        if (x < MATRIX_SIZE - 1 && matrix[y][x + 1] !== "obstacle") {
            neighbors.push([x + 1, y]);
        }
        if (y < MATRIX_SIZE - 1 && matrix[y + 1][x] !== "obstacle") {
            neighbors.push([x, y + 1]);
        }
        return neighbors;
    }


    return (
        <div>
            {path && (
                <table>
                    <tbody>
                        {matrix.map((row, y) => (
                            <tr key={y}>
                                {row.map((cell, x) => {
                                    const isPath = path.some(
                                        ([xPath, yPath]) => xPath === x && yPath === y
                                    );
                                    return (
                                        <td
                                            key={`${x},${y}`}
                                            style={{
                                                width: "60px",
                                                height: "60px",
                                                backgroundColor: isPath
                                                    ? "blue"
                                                    : x === START_X && y === START_Y
                                                        ? "green"
                                                        : x === END_X && y === END_Y
                                                            ? "red"
                                                            : cell === "obstacle"
                                                                ? "black"
                                                                : "grey",
                                            }}
                                        ></td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <button onClick={findPath}>Start</button>
            <p>The time to find the shortest path is: {executionTime}</p>
        </div>
    );
}

export default Matrix;