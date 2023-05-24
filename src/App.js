import {  useState } from "react"
import React from "react"

// DOMAIN
// Create a new grid of rows x cols cells
function deadCells(rows, cols) {
	return Array(rows)
		.fill(null)
		.map(() => Array(cols).fill(false))
}

// Copy a grid of cells
function cellsCopy(cells) {
	return cells.map((line) => line.slice(0))
}

const SURROUND = [
	[-1, -1],
	[-1, 0],
	[-1, 1],
	[0, -1],
	[0, 1],
	[1, -1],
	[1, 0],
	[1, 1],
]

// Count the alive cells in the 8 neighboorhood of a cell
function total_alive_around_cell(grid, i, j, rows, cols) {
	return SURROUND.reduce((neighboors_alive, neighboor_offset) => {
		const [ni, nj] = neighboor_offset
		const ii = (i + ni + rows) % rows
		const jj = (j + nj + cols) % cols

		let neighboor = grid[ii][jj]
		let inc = neighboor ? 1 : 0
		return neighboors_alive + inc
	}, 0)
}

// 2d Conway game of life generation transition:
// Alive and one or less, or 4 or more neighboors -> Dies
// Dead and exactly 3 neighboors -> Dies
function nextGen(gen, rows, cols) {
	let next = deadCells(rows, cols)
	for (let i = 0; i < rows; i++)
	for (let j = 0; j < cols; j++) {
		let neighboors_alive = total_alive_around_cell(gen, i, j, rows, cols)
		if (!gen[i][j]) {
			next[i][j] = neighboors_alive === 3
		} else {
			next[i][j] = 2 <= neighboors_alive && neighboors_alive <= 3
		}
	}
	return next
}

// VIEW:: uses REACT
// Cell
function Cell({ handleClick, alive }) {
	return (
		<button onClick={handleClick} className={`${alive ? "alive" : "dead"}`}>
			{" "}
		</button>
	)
}


// Grid of Cells
export default function Grid({ rows, cols }) {
	const [cells, setCells] = useState(deadCells(rows, cols))

	const [runningInterval, setRunningInterval] = useState(0)
        const runningSpeed = 800
	function cellClicked(c, i, j) {
		stop()
		const next_cells = cellsCopy(c)
		next_cells[i][j] = !c[i][j]
		setCells(next_cells)
		console.log(`${i},${j} `)
	}

	function nextGeneration() {
		setCells((prev_cells) => nextGen(prev_cells, rows, cols))
	}

	function play() {
		setRunningInterval(
		        setInterval(() => {nextGeneration()}),
			runningSpeed
		)
	}

	function running(){
		return runningInterval !== 0
	}

	function stop() {
		if (running()) {
			clearInterval(runningInterval)
			setRunningInterval(0)
		}
	}

	function runOnce() {
		stop()
		nextGeneration(cells)
	}


	function playOrStop() {
		if (runningInterval === 0) {
			play()
		} else {
			stop()
		}
	}

	function addGlider(){
        	const start_i = 0 
		const end_i = 2 
		const start_j = 29 
		const end_j = 31
		const setglider = cellsCopy(cells)
		setglider[start_i][end_j] = true
		for(let i = start_i; i <= end_i; i++){
			setglider[i][start_j] = true
		}
		setglider[end_i][start_j + 1] = true 
		setCells(setglider)
	}
	return (
		<div>
			<header>
				<h1> Conway Game of Life</h1>
				<button type="button" onClick={runOnce}>
					Next Gen
				</button>
				<button type="button" onClick={playOrStop}>
					{" "}
					{runningInterval ? "⏸️ " : "▶️ "}
				</button>
			        <button type="button" onClick={addGlider}>
				        Add a Glider
				</button>	
			</header>
			<div>
				<section>
					{cells.map((row, i) => (
						<div key={i}>
							{row.map((cell, j) => (
								<Cell
									key={i * rows + j}
									alive={cell}
									handleClick={() => cellClicked(cells, i, j)}
								/>
							))}
						</div>
					))}
				</section>
				<p>Click on a cell to bring it to life.</p>
				<a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life">Detailed info.</a>
			</div>
		</div>
	)
}
