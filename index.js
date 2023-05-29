(function() {
    const ROWS = [
        'Никита пошел пушить',
        'Никита не следит за тиммейтами',
        'У Никиты что-то не так с оружием',
        'Никита словил в голову'
    ]
    const COLUMNS = [
        'Никита делает глупости',
        'Никита кого-то обвиняет',
        'Никита кого-то обзывает',
        'Никита тильтует'
    ]
    const CARDS = [
        {
            rowIndex: 0,
            columnIndex: 0,
            text: 'Прикройте меня!',
            checked: false
        },
        {
            rowIndex: 0,
            columnIndex: 1,
            text: 'А где ты был, если не секрет?',
            checked: false
        },
        {
            rowIndex: 0,
            columnIndex: 2,
            text: 'Иди ты на хуй, дядя!',
            checked: false
        },
        {
            rowIndex: 0,
            columnIndex: 3,
            text: 'Всё, я наигрался на сегодня.',
            checked: false
        },
        {
            rowIndex: 1,
            columnIndex: 0,
            text: '*Убежал на локацию вперед*',
            checked: false
        },
        {
            rowIndex: 1,
            columnIndex: 1,
            text: 'Ты чего так отстал-то?',
            checked: false
        },
        {
            rowIndex: 1,
            columnIndex: 2,
            text: 'Игра говна!',
            checked: false
        },
        {
            rowIndex: 1,
            columnIndex: 3,
            text: '*Орет так, что микрофон отрубается*',
            checked: false
        },
        {
            rowIndex: 2,
            columnIndex: 0,
            text: '*Взял оружие из которого не умеет стрелять*',
            checked: false
        },
        {
            rowIndex: 2,
            columnIndex: 1,
            text: 'А можно попадать, игра?',
            checked: false
        },
        {
            rowIndex: 2,
            columnIndex: 2,
            text: 'Оружие говна!',
            checked: false
        },
        {
            rowIndex: 2,
            columnIndex: 3,
            text: 'Да иди ты на хуй игра!',
            checked: false
        },
        {
            rowIndex: 3,
            columnIndex: 0,
            text: '*Никита вышел на крышу*',
            checked: false
        },
        {
            rowIndex: 3,
            columnIndex: 1,
            text: 'Забей, он вышел и сразу в голову мне дал.',
            checked: false
        },
        {
            rowIndex: 3,
            columnIndex: 2,
            text: 'Пидор!',
            checked: false
        },
        {
            rowIndex: 3,
            columnIndex: 3,
            text: 'Голова!',
            checked: false
        },
    ]
    const modalQueue = [];

    const spinner = document.querySelector('#spinner');
    const cardsContainer = document.querySelector('#cards');
    const cardsGrid = document.querySelector('#cardsGrid');
    const resetButton = document.querySelector('#resetButton');
    const effectsContainer = document.querySelector('#effects');
    const victorySound = document.querySelector('#victorySound');
    
    let cardsData = [...CARDS];
    let rowsCounter = [ 4, 4, 4, 4 ];
    let columnsCounter = [ 4, 4, 4, 4 ];

    const fillGrid = () => {
        spinner.classList.remove('hidden');
        cardsContainer.classList.add('hidden');

        cardsGrid.innerHTML = '';

        for (let card of cardsData) {
            addCardToGrid(card);
        }

        spinner.classList.add('hidden');
        cardsContainer.classList.remove('hidden');
    }

    const addCardToGrid = (card) => {
        const cardElement = document.createElement('div');

        cardElement.id = `${card.rowIndex}-${card.columnIndex}`;
        cardElement.classList.add('cards__card');
        cardElement.innerHTML = `<div>${card.text}</div>`;
        cardElement.onclick = handleCardClick;

        if (card.checked) {
            cardElement.classList.add('cards__card-checked');
        }

        cardsGrid.appendChild(cardElement);
    }

    const handleCardClick = (event) => {
        const cardElement = event.target;
        const isCardChecked = cardElement.classList.contains('cards__card-checked');
        const cardGridPosition = cardElement.id.split('-');

        if (isCardChecked) {
            cardElement.classList.remove('cards__card-checked');
            cardsData[+cardGridPosition[0] * 4 + +cardGridPosition[1]].checked = false;
            rowsCounter[cardGridPosition[0]]++;
            columnsCounter[cardGridPosition[1]]++;
        } else {
            cardElement.classList.add('cards__card-checked');
            cardsData[+cardGridPosition[0] * 4 + +cardGridPosition[1]].checked = true;
            rowsCounter[cardGridPosition[0]]--;
            columnsCounter[cardGridPosition[1]]--;

            checkForBingo(...cardGridPosition);
        }

        saveData();
    }

    const saveData = () => {
        localStorage.setItem('cardsData', JSON.stringify(cardsData));
        localStorage.setItem('rowsCounter', JSON.stringify(rowsCounter));
        localStorage.setItem('columnsCounter', JSON.stringify(columnsCounter));
    }

    const restoreData = () => {
        const savedCardsData = JSON.parse(localStorage.getItem('cardsData'));
        const savedRowsCounter = JSON.parse(localStorage.getItem('rowsCounter'));
        const savedColumnsCounter = JSON.parse(localStorage.getItem('columnsCounter'));

        if (savedCardsData) { cardsData = savedCardsData }

        if (savedRowsCounter) {
            rowsCounter = savedRowsCounter;
            for (let rowIndex in rowsCounter) {
                if (rowsCounter[rowIndex] === 0) {
                    addModalToQueue({
                        text: `Бинго! ${ROWS[rowIndex]}!`,
                        onModalOpen: showFireworks
                    });
                }
            }
        }

        if (savedColumnsCounter) {
            columnsCounter = savedColumnsCounter;
            for (let columnIndex in columnsCounter) {
                if (columnsCounter[columnIndex] === 0) {
                    addModalToQueue({
                        text: `Бинго! ${COLUMNS[columnIndex]}!`,
                        onModalOpen: showFireworks
                    });
                }
            }
        }

        showNextModalInQueue();
    }

    const clearLocalStorage = () => {
        localStorage.removeItem('cardsData');
        localStorage.removeItem('rowsCounter');
        localStorage.removeItem('columnsCounter');
    }

    const addModalToQueue = (modalData) => {
        modalQueue.push(modalData);
    }

    const showNextModalInQueue = () => {
        if (modalQueue.length > 0) {
            const modalData = modalQueue[0];
            const modalContainer = document.createElement('div');
            const modalBody = document.createElement('div');
            const modalText = document.createElement('div');
            const modalControls = document.createElement('div');

            modalContainer.id = 'modal';
            modalContainer.classList.add('modal__container');
            modalBody.classList.add('modal__body');
            modalText.classList.add('modal__text');
            modalText.innerText = modalData.text;
            modalControls.classList.add('controls');

            if (modalData.controls?.length > 0) {
                for (let control of modalData.controls) {
                    const controlButton = document.createElement('button');
                    controlButton.innerText = control.label;
                    controlButton.onclick = control.handler;
                    modalControls.appendChild(controlButton);
                }
            } else {
                const okButton = document.createElement('button');
                okButton.innerText = 'Ok';
                okButton.onclick = closeModal;
                modalControls.appendChild(okButton);
            }

            modalBody.appendChild(modalText);
            modalBody.appendChild(modalControls);
            modalContainer.appendChild(modalBody);
            document.body.appendChild(modalContainer);
            
            if (modalData.onModalOpen) {
                modalData.onModalOpen();
            }
        }
    }

    const closeModal = () => {
        const modal = document.querySelector('#modal');
        document.body.removeChild(modal);
        modalQueue.shift();

        if (modalQueue.length > 0) {
            showNextModalInQueue();
        }
    }

    const handleResetClick = () => {
        addModalToQueue({
            text: 'Сбросить все?',
            controls: [
                { label: 'Да', handler: handleResetYesClick },
                { label: 'Нет', handler: handleResetNoClick }
            ]
        })

        showNextModalInQueue();
    }

    const handleResetYesClick = () => {
        clearLocalStorage();

        cardsData = [...CARDS];
        rowsCounter = [ 4, 4, 4, 4 ];
        columnsCounter = [ 4, 4, 4, 4 ];

        saveData();
        fillGrid();
        closeModal();
    }
    
    const handleResetNoClick = () => {
        closeModal();
    }

    const checkForBingo = (rowsIndex, columnsIndex) => {
        if (rowsCounter[rowsIndex] === 0) {
            addModalToQueue({
                text: `Бинго! ${ROWS[rowsIndex]}!`,
                onModalOpen: showFireworks
            });
        }

        if (columnsCounter[columnsIndex] === 0) {
            addModalToQueue({
                text: `Бинго! ${COLUMNS[columnsIndex]}!`,
                onModalOpen: showFireworks
            });
        }

        showNextModalInQueue();
    }

    const showFireworks = () => {
        effectsContainer.classList.remove('hidden');
        victorySound.play();

        setTimeout(() => {
            effectsContainer.classList.add('hidden');
        }, 3000);
    }


    //runtime
    resetButton.onclick = handleResetClick;
    restoreData();
    fillGrid();
}())