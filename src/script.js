function gameStart(){
	const canvas = document.querySelector('canvas')
	const ctx = canvas.getContext('2d')

	canvas.width = innerWidth
	canvas.height = innerHeight
	const unit = canvas.height / 100

	console.log(root)

	const gameColor = root.style.getPropertyValue('--main-color')

	class Player{
		constructor(pwidth, pheight, posx, color){
			this.height = pheight
			this.width = pwidth
			this.color = color
			this.velocity = {
				x: 0,
				y: 0
			}

			this.position = {
				x: posx,
				y: canvas.height / 2 - this.height / 2
			}
		}

		draw(){
			ctx.beginPath()
			ctx.rect(this.position.x, this.position.y, this.width, this.height)
			ctx.fillStyle = this.color
			ctx.fill()
		}

		update(){
			this.draw()
			this.position.y += this.velocity.y
		}
	}
	
	class Ball{
		constructor(color){
			this.diameter = 2 * unit
			this.color = color
			this.velocity = {
				x: 1.5 * unit,
				y: 0
			}

			this.position = {
				x: canvas.width / 2,
				y: canvas.height / 2
			}

			let rand = Math.floor(Math.random() * 2)
			if(rand > 0) this.velocity.x = -this.velocity.x
		}

		draw(){
			ctx.beginPath()
			ctx.arc(this.position.x, this.position.y, this.diameter, 0, 2 * Math.PI)
			ctx.fillStyle = this.color
			ctx.fill()
		}

		update(){
			this.draw()
			this.position.x += this.velocity.x
			this.position.y += this.velocity.y
		}
	}

	let aniTime = 600
	const hideClass = 'hide'
	const maxScore = $('.maxScore > input')[0].value
	const maxGames = $('.maxGames > input')[0].value
	let gameEnd = false

	let pushKey = {
		first: {
			up: false,
			down: false
		},
		sec: {
			up: false,
			down: false
		}
	}

	const player_width = 5 * unit
	const player_height = 25 * unit
	const player_start_position = 8 * unit + player_width
	const players = [
		new Player(player_width, player_height, player_start_position, gameColor),
		new Player(player_width, player_height, canvas.width - player_width - player_start_position, gameColor)
	]
	const ball = new Ball(gameColor)

	$('.title').addClass('hide-title')
	$('.start').addClass('hide-animation')
	$('.score').addClass('score-animation').removeClass(hideClass)
	setTimeout(() => {
		$('.title').addClass(hideClass).removeClass('hide-title')
		$('.menu.start').addClass(hideClass).removeClass('hide-animation')
		$('.score').removeClass('score-animation '+hideClass)

		let path = $('.break')
		for(let i=0; i<3; i++){
			setTimeout(() => {
				$(path[i]).removeClass(hideClass)
			}, aniTime*i)
			
			setTimeout(() => {
				$(path[i]).addClass(hideClass)
			}, aniTime*(i+1))
		}
		
		setTimeout(() => {
			gameLoop()
		}, 2000)
		
	}, 1900)

	const gameLoop = () => {
		if(ball.position.x + ball.diameter < -ball.diameter || ball.position.x - ball.diameter > canvas.width + ball.diameter){
			scorePoint()

			if(gameEnd){
				endGame()
				return
			}
			resetGame()
			
			return
		}
		ctx.clearRect(0, 0, canvas.width, canvas.height)

		if(ball.position.x - ball.diameter / 2 <= players[0].position.x + player_width && ball.position.x >= players[0].position.x && ball.position.y - ball.diameter <= players[0].position.y + player_height && ball.position.y >= players[0].position.y && ball.velocity.x < 0){
			hitBall(0)
		}
		else if(ball.position.x + ball.diameter / 2 >= players[1].position.x && ball.position.x <= players[1].position.x + player_width && ball.position.y - ball.diameter <= players[1].position.y + player_height && ball.position.y >= players[1].position.y && ball.velocity.x > 0){
			hitBall(1)
		}

		if(ball.position.y >= canvas.height && ball.velocity.y > 0 || ball.position.y <= 0 && ball.velocity.y < 0){
			ball.velocity.y = -ball.velocity.y
		}

		playerMovement()
		ball.update()

		requestAnimationFrame(gameLoop)
	}

	const playerMovement = () => {
		if(pushKey.first.up) players[0].velocity.y = -unit
		else if(pushKey.first.down) players[0].velocity.y = unit
		else players[0].velocity.y = 0

		if(pushKey.sec.up) players[1].velocity.y = -unit
		else if(pushKey.sec.down) players[1].velocity.y = unit
		else players[1].velocity.y = 0

		players.forEach((player) => {
			if(player.position.y <= 0 && player.velocity.y < 0 || player.position.y >= canvas.height - player_height && player.velocity.y > 0) player.velocity.y = 0
			player.update()
		})
	}

	const hitBall = (num) => {
		ball.velocity.x = -ball.velocity.x
		if(ball.velocity.y != 0) ball.velocity.x *= 1.07

		ball.velocity.y = (players[num].position.y + player_height / 2 - ball.position.y) / -6
	}

	const scorePoint = () => {
		let path = [$('.score-points > span')[0], $('.score-games > span')[0], $('.break.point')[0]]

		if(ball.position.x < canvas.width / 2){
			path[0] = $('.score-points > span')[1]
			path[1] = $('.score-games > span')[1]
		}

		if(path[0] === $('.score-points > span')[1]){
			$(path[2]).html(path[2].innerText.replace('One', 'Two'))
		}
		
		let score = parseInt(path[0].innerText)
		let games = parseInt([path[1].innerText])
		score++
		if(score >= maxScore){
			score = 0
			games++
			$('.score-points > span').html(score)
		}
		$(path[0]).html(score)
		$(path[1]).html(games)
		if(games >= maxGames) return gameEnd = true
	}

	const resetGame = () => {
		resetPosiotion()

		setTimeout(() => {
			$('.break.point').removeClass(hideClass)	
		}, 100)
		

		setTimeout(() => {
			$('.break.point').addClass(hideClass)
			
		}, 100+aniTime)
		
		let path = [$('.break.ready')[0], $('.break.go')[0]]
		for(let i=0; i<2; i++){
			setTimeout(() => {
				$(path[i]).removeClass(hideClass)
			}, 500+aniTime*(i+1))
			
			setTimeout(() => {
				$(path[i]).addClass(hideClass)
			}, 500+aniTime*(i+2))
		}
		
		setTimeout(() => {
			gameLoop()
		}, 500+aniTime*3)
	}

	const resetPosiotion = () => {
		players.forEach((player) => {
			player.position.y = canvas.height / 2 - player.height / 2
		})
		ball.position.x = canvas.width / 2
		ball.position.y = canvas.height / 2
		ball.velocity.x = 1.5 * unit
		ball.velocity.y = 0
	}

	const keysButtons = document.querySelector('.keys')
	const endGame = () => {
		path = [$('.score-games > span')[0], $('.break.win')[0]]

		if(parseInt($('.score-games > span')[1].innerText) > parseInt(path[0].innerText)){
			$(path[1]).html(path[1].innerText.replace('One', 'Two'))
		}

		$(path[1]).removeClass(hideClass)
		setTimeout(() => {
			$(path[1]).addClass(hideClass)
			$('.menu.after').removeClass(hideClass)
		}, aniTime)
	}

	if(hbChild.textContent == 'Off') keysButtons.classList.remove('hide')

	const holdClass = 'hold'
	$(document).keydown(function(e){
		switch(e.keyCode){
			case 38:
				pushKey.sec.up = true
				$('.key.up').addClass(holdClass)
				break
			case 40:
				pushKey.sec.down = true
				$('.key.down').addClass(holdClass)
				break
			case 83:
				pushKey.first.down = true
				$('.key.s').addClass(holdClass)
				break
			case 87:
				pushKey.first.up = true
				$('.key.w').addClass(holdClass)
				break
		}
	})

	$(document).keyup(function(e){
		switch(e.keyCode){
			case 38:
				pushKey.sec.up = false
				$('.key.up').removeClass(holdClass)
				break
			case 40:
				pushKey.sec.down = false
				$('.key.down').removeClass(holdClass)
				break
			case 83:
				pushKey.first.down = false
				$('.key.s').removeClass(holdClass)
				break
			case 87:
				pushKey.first.up = false
				$('.key.w').removeClass(holdClass)
				break
		}
	})

	const keysChild = keysButtons.children
	Array.from(keysChild).forEach(el => {
		el.addEventListener('mousedown', function(){
			const btnClicked = el.textContent
			
			if(btnClicked == 'w') pushKey.first.up = true
			if(btnClicked == 's') pushKey.first.down = true
			if(btnClicked == '↑') pushKey.sec.up = true
			if(btnClicked == '↓') pushKey.sec.down = true
		})

		el.addEventListener('mouseup', function(){
			const btnClicked = el.textContent
			
			if(btnClicked == 'w') pushKey.first.up = false
			if(btnClicked == 's') pushKey.first.down = false
			if(btnClicked == '↑') pushKey.sec.up = false
			if(btnClicked == '↓') pushKey.sec.down = false
		})
	})
}

gameStart()