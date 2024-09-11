let score = 0;
let scoreText = document.getElementById('score');  // HTML의 점수 표시 요소

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },  // 중력 설정 없음 (2D 평면에서 움직임)
            debug: false        // 디버그 모드 비활성화
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let player;
let cursors;
let enemies;

function preload() {
    this.load.image('player', 'assets/images/player.png');
    this.load.image('enemy', 'assets/images/enemy.png');
}

function create() {
    // 플레이어 생성
    player = this.physics.add.sprite(400, 550, 'player');
    player.setCollideWorldBounds(true);  // 화면 경계에 충돌하여 더 이상 넘어가지 않도록 설정

    // 적 생성
    enemies = this.physics.add.group({
        key: 'enemy',
        repeat: 5,
        setXY: { x: 100, y: 100, stepX: 100 }
    });

    // 적 속도 설정
    enemies.children.iterate(function (child) {
        child.setVelocityY(Phaser.Math.Between(50, 100));
    });

    // 키보드 입력 처리
    cursors = this.input.keyboard.createCursorKeys();

    // 플레이어와 적 충돌 시 게임 오버
    this.physics.add.overlap(player, enemies, hitEnemy, null, this);
}

function update() {
    // 왼쪽 키가 눌린 경우
    if (cursors.left.isDown) {
        player.setVelocityX(-160);  // 왼쪽으로 이동
    }
    // 오른쪽 키가 눌린 경우
    else if (cursors.right.isDown) {
        player.setVelocityX(160);   // 오른쪽으로 이동
    }
    // 아무 키도 눌리지 않은 경우
    else {
        player.setVelocityX(0);     // 정지 상태
    }

    // 적이 화면 아래로 나가면 다시 위로 재생성
    enemies.children.iterate(function (child) {
        if (child.y > 600) {
            child.y = 0;
            child.x = Phaser.Math.Between(50, 750);
            score += 10;  // 적을 놓치면 점수 증가
            scoreText.innerText = 'Score: ' + score;
        }
    });
}

function hitEnemy(player, enemy) {
    this.physics.pause();          // 게임 일시 정지
    player.setTint(0xff0000);      // 플레이어에게 빨간색 틴트 적용
    scoreText.innerText = 'Game Over!';
}

// 게임을 재시작하는 함수
function restartGame() {
    game.scene.restart();          // Phaser의 씬을 다시 시작
    score = 0;                     // 점수 초기화
    scoreText.innerText = 'Score: ' + score;
}