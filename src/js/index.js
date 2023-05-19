'use strict'
import Chart from 'chart.js/auto';
// main -> categoriesIterate(свойство categoreis объекта response(это список объектов, каждый из которых содержит основные данные о категории)) -> createBlock(объект category) -> createGraph(id категории)
document.addEventListener('DOMContentLoaded', () => {
    let port = '5000';

    async function getData(storage) {
        const mainRequest = await fetch(`http://127.0.0.1:${port}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({'type': 'all_categories', 'id': '4'})
        }).then((data) => {
            return data.json()
        }).then((data) => {
            return data;
        }).catch(() => {
            console.log('Error_1');
        });

        let f = mainRequest;
        storage.push(JSON.parse(JSON.stringify(f)));
    };

    
    async function getCurrnetCategory(idCategory, storage) {
        const request = await fetch(`http://127.0.0.1:${port}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({'type': 'get_score', 'id': idCategory})
        }).then((data) => {
            return data.json()
        }).then((data) => {
            return data;
        }).catch(() => {
            console.log('Error_2')
        });

        let scores = request;
        storage[idCategory] = JSON.parse(JSON.stringify(scores));
    };
    
    
    async function createAll(specsCategories, dataCategories) {
        let ctx = document.querySelector('.all_content').getContext('2d');
        const data = {
            labels: [],
            datasets: []
        };

        const iterateDates = async (categories, data) => {
            const n = Object.keys(categories)[0];
            const o = categories[n];

            for (let q = 6; q > -1; q--) {
                data.labels.push(o[q].date);
            };
        };
        await iterateDates(dataCategories, data);

        const iterateCategories = async (specs, categories, data) => {
            let o,
                currentCategory,
                colors;

            for (let e in specs) {
                currentCategory = categories[e];
                colors = {
                    red: '',
                    green: '',
                    blue: ''
                };

                await createColor(colors);

                o = {
                    data: [],
                    label: specs[e].name,
                    fill: false,
                    borderColor: `rgb(${colors.red}, ${colors.green}, ${colors.blue})`,
                    tension: 0.1
                };

                for (let j = 6; j > -1; j--) {
                    o.data.push(currentCategory[j].score);
                };
                data.datasets.push(JSON.parse(JSON.stringify(o)));
            };
        };
        await iterateCategories(specsCategories, dataCategories, data);

        const create = async (ctx, data) => {
            const stackedLine = new Chart(ctx, {
                type: 'line',
                data: data,
                options: {
                    scales: {
                        y: {
                            stacked: true
                        }
                    },
                }
            });
        };
        await create(ctx, data);
    };


    async function createColor(colors) {
        for (let c in colors) {
            colors[c] = Math.floor(Math.random() * 256);
        };
    };


    async function createBlock(specsCategory, dataCategory) {
        if (specsCategory.is_active) {
            let block = document.createElement('div');
            block.classList.add('element');

            let blockName = document.createElement('div');
            blockName.classList.add('element__name');
            blockName.innerHTML = specsCategory.name;

            let blockContent = document.createElement('canvas');
            blockContent.classList.add('element__content');
            await createGraph(blockContent, dataCategory);

            block.append(blockName);
            block.append(blockContent);
            document.querySelector('.main__categories').append(block);
        };
    };


    async function createGraph(container, scores) {
        const colors = {
            1: 'rgb(255, 0, 0)',
            2: 'rgb(235, 156, 0)',
            3: 'rgb(253, 233, 16)',
            4: 'rgb(154, 205, 50)',
            5: 'rgb(0, 128, 0)',
        };

        let ctx = container.getContext('2d');

        const data = {
            labels: [scores[0].date, scores[1].date, scores[2].date, scores[3].date, scores[4].date, scores[5].date, scores[6].date],
            datasets: [{
            axis: 'y',
            data: [scores[0].score, scores[1].score, scores[2].score, scores[3].score, scores[4].score, scores[5].score, scores[6].score],
            fill: false,
            backgroundColor: [
                colors[scores[0].score],
                colors[scores[1].score],
                colors[scores[2].score],
                colors[scores[3].score],
                colors[scores[4].score],
                colors[scores[5].score],
                colors[scores[6].score],
            ],
            borderWidth: 1
            }]
        };

        const stackedBar = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                indexAxis: 'y',
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true
                    }
                },
                plugins: {
                    legend: {
                       display: false
                    }
                }
            }
        });
    };



    let keep = [],
        keepSpecs = {},
        keepCurrent = {};


    const app = async () => {
        await getData(keep);

        const iterate = async () => {
            for (let e of keep[0].categories) {
                keepSpecs[e.id] = e;
                await getCurrnetCategory(e.id, keepCurrent);
            };
        };
        await iterate();

        await createAll(keepSpecs, keepCurrent);

        const categoreis = async () => {
            for (let k in keepSpecs) {
                createBlock(keepSpecs[k], keepCurrent[k]);
            };
        };
        await categoreis();
    };

    app();
});